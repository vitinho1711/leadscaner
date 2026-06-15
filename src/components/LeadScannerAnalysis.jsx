import React, { useState, useRef, useEffect } from 'react';
import { Cloud, Shield, History, ArrowLeft, ArrowRight, FileSpreadsheet, Bot, CheckCircle, Target, Sparkles, AlertCircle, Play, HeadphonesIcon, Search, MapPin, Loader2, Trash2, CheckSquare, Square, XCircle, Zap, RefreshCw, Megaphone } from 'lucide-react';
import * as XLSX from 'xlsx';

export default function LeadScannerAnalysis({ setActiveTab }) {
  // === MODO DE ENTRADA ===
  const [mode, setMode] = useState('busca'); // 'busca' ou 'planilha'

  // === BUSCA AUTOMÁTICA ===
  const [nicho, setNicho] = useState('');
  const [cidade, setCidade] = useState('');
  const [limite, setLimite] = useState(100);
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [searchError, setSearchError] = useState('');

  // === UPLOAD PLANILHA ===
  const [file, setFile] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const fileInputRef = useRef(null);

  // === SELEÇÃO E EXCLUSÃO ===
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [selectAll, setSelectAll] = useState(false);

  // === AUTOSEND STATUS ===
  const [autoSendStatus, setAutoSendStatus] = useState({ enabled: false, running: false });

  useEffect(() => {
    fetch('/api/autosend/status').then(r => r.json()).then(d => setAutoSendStatus(d)).catch(() => {});
  }, []);

  // ==========================================
  // BUSCA AUTOMÁTICA POR NICHO (Google Maps)
  // ==========================================
  const handleSearch = async () => {
    if (!nicho.trim() || !cidade.trim()) return alert('Preencha o nicho e a cidade.');
    setIsSearching(true);
    setSearchError('');
    setSearchResults([]);
    setSelectedIds(new Set());
    try {
      const res = await fetch(`/api/scrape?query=${encodeURIComponent(nicho)}&location=${encodeURIComponent(cidade)}&limit=${limite}`);
      const json = await res.json();
      if (json.error) {
        setSearchError(json.error);
      } else {
        setSearchResults(json.data || []);
        
        const addedIds = (json.data || []).map(l => l.id).filter(Boolean);
        if (addedIds.length > 0) {
          sessionStorage.setItem('preSelectedLeads', JSON.stringify(addedIds));
        }

        alert(`✅ Busca concluída! Encontrados ${json.data ? json.data.length : 0} leads.`);
        if (setActiveTab) setActiveTab('campanhas');
      }
    } catch (e) {
      setSearchError('Erro ao conectar com o servidor. Certifique-se de que o backend está rodando.');
    }
    setIsSearching(false);
  };

  // ==========================================
  // UPLOAD DE PLANILHA
  // ==========================================
  const handleFileUpload = (e) => {
    const uploadedFile = e.target.files[0];
    if (uploadedFile) setFile(uploadedFile);
  };

  const processFile = async () => {
    if (!file) return alert('Selecione uma planilha primeiro.');
    setIsAnalyzing(true);
    setSearchResults([]);
    setSelectedIds(new Set());
    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data, { type: 'array' });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      const rows = XLSX.utils.sheet_to_json(worksheet, { defval: '' });

      const newLeads = rows.map((row) => {
        const guessKey = (possibleNames) => {
          const key = Object.keys(row).find(k => possibleNames.some(p => k.toLowerCase().includes(p)));
          return key ? row[key] : '';
        };
        const nome = guessKey(['nome', 'name', 'empresa', 'restaurante']) || 'Sem Nome';
        let rawPhone = guessKey(['telefone', 'celular', 'whatsapp', 'phone', 'numero', 'contato']);
        if (typeof rawPhone === 'number') {
          rawPhone = rawPhone.toLocaleString('fullwide', {useGrouping:false});
        }
        const whatsapp = String(rawPhone || '').replace(/\D/g, '') || 'não informado';
        const nicho = guessKey(['nicho', 'categoria', 'category', 'segmento']) || 'Desconhecido';
        const cidade = guessKey(['cidade', 'city', 'local', 'municipio']) || '';
        const site = guessKey(['site', 'website', 'url', 'link']) || 'não informado';
        const rawRating = guessKey(['nota', 'rating', 'avaliacao']);
        const nota = parseFloat(rawRating) || 0;
        const rawReviews = guessKey(['reviews', 'avaliacoes', 'qtd']);
        const reviews = parseInt(rawReviews) || 0;
        let score = Math.floor(Math.random() * 20) + 5;
        return { nome, whatsapp, nicho, cidade, site, nota, reviews, score, status: 'FRIO' };
      }).filter(l => l.whatsapp !== 'não informado');

      if (newLeads.length === 0) {
        alert('Nenhum lead com WhatsApp encontrado na planilha.');
        setIsAnalyzing(false);
        return;
      }

      // Salva no backend
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newLeads)
      });
      const result = await res.json();
      
      // Salva no histórico
      await fetch('/api/history', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: file.name,
          total: rows.length,
          approved: newLeads.length
        })
      });

      setSearchResults(result.data || newLeads);
      
      const addedIds = (result.data || []).map(l => l.id);
      sessionStorage.setItem('preSelectedLeads', JSON.stringify(addedIds));
      
      alert(`✅ ${newLeads.length} leads importados com sucesso!`);
      if (setActiveTab) setActiveTab('campanhas');
    } catch (error) {
      console.error(error);
      alert('Erro ao processar a planilha.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // ==========================================
  // SELEÇÃO
  // ==========================================
  const toggleSelect = (id) => {
    setSelectedIds(prev => {
      const n = new Set(prev);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(searchResults.map((_, i) => i)));
    }
    setSelectAll(!selectAll);
  };

  // ==========================================
  // EXCLUSÃO
  // ==========================================
  const handleDeleteSelected = async () => {
    if (selectedIds.size === 0) return alert('Selecione pelo menos um lead.');
    const label = selectedIds.size === searchResults.length ? 'TODOS os leads' : `${selectedIds.size} lead(s) selecionado(s)`;
    if (!window.confirm(`Tem certeza que deseja excluir ${label}?`)) return;

    // Pega os IDs reais dos leads que queremos deletar
    const leadsToDelete = searchResults.filter((_, i) => selectedIds.has(i));
    
    for (const lead of leadsToDelete) {
      if (lead.id) {
        try { await fetch(`/api/leads/${lead.id}`, { method: 'DELETE' }); } catch (e) { console.error(e); }
      }
    }

    // Remove da lista visual
    setSearchResults(prev => prev.filter((_, i) => !selectedIds.has(i)));
    setSelectedIds(new Set());
    setSelectAll(false);
  };

  const handleDeleteAll = async () => {
    if (searchResults.length === 0) return;
    if (!window.confirm(`Tem certeza que deseja excluir TODOS os ${searchResults.length} leads da lista?`)) return;
    
    for (const lead of searchResults) {
      if (lead.id) {
        try { await fetch(`/api/leads/${lead.id}`, { method: 'DELETE' }); } catch (e) { console.error(e); }
      }
    }
    setSearchResults([]);
    setSelectedIds(new Set());
    setSelectAll(false);
  };

  // ==========================================
  // ATIVAR CAMPANHA AUTOMÁTICA
  // ==========================================
  const toggleAutoSend = async () => {
    try {
      const res = await fetch('/api/autosend/toggle', { method: 'POST' });
      const data = await res.json();
      setAutoSendStatus(prev => ({ ...prev, enabled: data.enabled }));
    } catch (e) {
      alert('Erro ao conectar com o servidor.');
    }
  };

  return (
    <div className="animate-fade-in text-white space-y-6 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold mb-1">Nova Análise</h1>
          <p className="text-sm text-gray-400">Busque leads por nicho automaticamente ou importe uma planilha.</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setActiveTab && setActiveTab('leads_qualificados')} className="flex items-center gap-2 px-4 py-2 bg-[#121216] border border-white/5 hover:bg-white/5 rounded-lg text-sm font-medium transition-colors">
            <Target size={16} /> Ver Leads
          </button>
          <button onClick={() => setActiveTab && setActiveTab('dashboard')} className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 rounded-lg text-sm font-bold transition-all shadow-[0_0_15px_rgba(124,58,237,0.3)]">
            <ArrowLeft size={16} /> Dashboard
          </button>
        </div>
      </div>

      {/* Mode Selector */}
      <div className="flex items-center gap-3">
        <button onClick={() => setMode('busca')} className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${mode === 'busca' ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-[0_0_15px_rgba(124,58,237,0.3)]' : 'bg-[#121216] border border-white/5 text-gray-400 hover:text-white hover:bg-white/5'}`}>
          <Search size={16} /> Busca Automática
        </button>
        <button onClick={() => setMode('planilha')} className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${mode === 'planilha' ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-[0_0_15px_rgba(124,58,237,0.3)]' : 'bg-[#121216] border border-white/5 text-gray-400 hover:text-white hover:bg-white/5'}`}>
          <FileSpreadsheet size={16} /> Importar Planilha
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        
        {/* Main Content Area */}
        <div className="xl:col-span-3 space-y-6">
          
          {/* ===== MODO BUSCA AUTOMÁTICA ===== */}
          {mode === 'busca' && (
            <div className="bg-[#121216] border border-white/5 rounded-2xl p-6 space-y-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2.5 rounded-xl bg-purple-600/20 border border-purple-500/30">
                  <Search size={22} className="text-purple-400" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Busca Automática por Nicho</h3>
                  <p className="text-xs text-gray-500">A IA vai buscar empresas no Google Maps automaticamente</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-gray-400">Nicho / Segmento</label>
                  <div className="relative">
                    <Bot className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-400" size={16} />
                    <input 
                      type="text" value={nicho} onChange={e => setNicho(e.target.value)} 
                      placeholder="Ex: Restaurante japonês"
                      className="w-full pl-10 pr-4 py-3 bg-black/50 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-purple-500/50 placeholder:text-gray-600"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-gray-400">Cidade / Região</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-400" size={16} />
                    <input 
                      type="text" value={cidade} onChange={e => setCidade(e.target.value)}
                      placeholder="Ex: Belo Horizonte"
                      className="w-full pl-10 pr-4 py-3 bg-black/50 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-blue-500/50 placeholder:text-gray-600"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-gray-400">Limite de leads</label>
                  <input 
                    type="number" value={limite} onChange={e => setLimite(Number(e.target.value))} min={10} max={500}
                    className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-purple-500/50"
                  />
                </div>
              </div>

              <button onClick={handleSearch} disabled={isSearching} className="w-full py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl text-white font-bold text-sm flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(124,58,237,0.3)] transition-all">
                {isSearching ? (
                  <><Loader2 size={18} className="animate-spin" /> Buscando no Google Maps... (pode levar até 2 min)</>
                ) : (
                  <><Sparkles size={18} /> Buscar Leads Automaticamente</>
                )}
              </button>

              {searchError && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex items-center gap-3">
                  <AlertCircle className="text-red-400 shrink-0" size={20} />
                  <p className="text-sm text-red-300">{searchError}</p>
                </div>
              )}
            </div>
          )}

          {/* ===== MODO PLANILHA ===== */}
          {mode === 'planilha' && (
            <div className="bg-[#121216] border border-white/5 rounded-2xl p-6 space-y-6">
              <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept=".xlsx,.xls,.csv" className="hidden" />
              <div 
                onClick={() => fileInputRef.current?.click()}
                className={`w-full border-2 border-dashed ${file ? 'border-emerald-500/50 bg-emerald-500/5' : 'border-purple-500/30 bg-purple-500/5 hover:bg-purple-500/10'} rounded-2xl p-10 transition-colors cursor-pointer group text-center`}
              >
                <div className={`w-14 h-14 ${file ? 'bg-emerald-600/20' : 'bg-purple-600/20'} rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform`}>
                  {file ? <CheckCircle size={28} className="text-emerald-400" /> : <Cloud size={28} className="text-purple-400" />}
                </div>
                <h3 className="text-lg font-bold mb-1">{file ? file.name : 'Importar Planilha'}</h3>
                <p className="text-gray-400 text-sm mb-4">{file ? 'Arquivo pronto! Clique em "Processar" abaixo.' : 'Arraste e solte ou clique para selecionar'}</p>
                <p className="text-xs text-gray-500">Formatos: .xlsx, .xls, .csv</p>
              </div>

              <button onClick={processFile} disabled={isAnalyzing || !file} className="w-full py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl text-white font-bold text-sm flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(124,58,237,0.3)] transition-all">
                {isAnalyzing ? <><Loader2 size={18} className="animate-spin" /> Processando planilha...</> : <><Sparkles size={18} /> Processar e Importar</>}
              </button>
            </div>
          )}

          {/* ===== RESULTADOS ===== */}
          {searchResults.length > 0 && (
            <div className="bg-[#121216] border border-white/5 rounded-2xl overflow-hidden">
              {/* Toolbar */}
              <div className="p-4 border-b border-white/5 bg-black/40 flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-3">
                  <h3 className="font-bold text-white flex items-center gap-2">
                    <CheckCircle size={16} className="text-emerald-400" />
                    {searchResults.length} leads encontrados
                  </h3>
                  {selectedIds.size > 0 && (
                    <span className="text-xs text-purple-400 bg-purple-500/10 border border-purple-500/20 px-2.5 py-1 rounded-lg font-bold">{selectedIds.size} selecionado(s)</span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={handleSelectAll} className="px-3 py-1.5 bg-white/10 text-gray-300 rounded-lg text-xs font-bold hover:bg-white/20 transition-colors flex items-center gap-1.5">
                    {selectAll ? <CheckSquare size={14} /> : <Square size={14} />} {selectAll ? 'Desmarcar Todos' : 'Selecionar Todos'}
                  </button>
                  {selectedIds.size > 0 && (
                    <button onClick={handleDeleteSelected} className="px-3 py-1.5 bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg text-xs font-bold hover:bg-red-500 hover:text-white transition-colors flex items-center gap-1.5">
                      <Trash2 size={14} /> Excluir Selecionados ({selectedIds.size})
                    </button>
                  )}
                  <button onClick={handleDeleteAll} className="px-3 py-1.5 bg-red-500/10 text-red-400 border border-red-500/20 rounded-lg text-xs font-bold hover:bg-red-500 hover:text-white transition-colors flex items-center gap-1.5">
                    <XCircle size={14} /> Excluir Todos
                  </button>
                </div>
              </div>

              {/* Table */}
              <div className="max-h-[500px] overflow-y-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-black/20 border-b border-white/5 sticky top-0 z-10">
                    <tr className="text-gray-400">
                      <th className="px-4 py-3 w-10"></th>
                      <th className="px-4 py-3 font-medium">Lead</th>
                      <th className="px-4 py-3 font-medium">WhatsApp</th>
                      <th className="px-4 py-3 font-medium">Nota</th>
                      <th className="px-4 py-3 font-medium">Avaliações</th>
                      <th className="px-4 py-3 font-medium text-right">Ação</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-gray-300">
                    {searchResults.map((lead, i) => (
                      <tr key={i} className={`hover:bg-white/[0.02] transition-colors cursor-pointer ${selectedIds.has(i) ? 'bg-purple-500/5' : ''}`} onClick={() => toggleSelect(i)}>
                        <td className="px-4 py-3">
                          <input type="checkbox" checked={selectedIds.has(i)} onChange={() => {}} className="w-4 h-4 rounded accent-purple-500" />
                        </td>
                        <td className="px-4 py-3">
                          <p className="font-bold text-white text-sm truncate max-w-[200px]" title={lead.nome}>{lead.nome}</p>
                          <p className="text-[10px] text-gray-500">{lead.nicho || '-'} • {lead.cidade || '-'}</p>
                        </td>
                        <td className="px-4 py-3">
                          {lead.whatsapp && lead.whatsapp !== 'não informado' ? (
                            <button onClick={(e) => { e.stopPropagation(); window.open(`https://wa.me/${lead.whatsapp.replace(/\D/g, '')}`, '_blank'); }} className="flex items-center gap-1.5 px-2.5 py-1 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 rounded-lg text-[10px] font-bold transition-colors">
                              <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="WA" className="w-3 h-3 opacity-80" /> {lead.whatsapp}
                            </button>
                          ) : <span className="text-gray-600 text-[10px]">Sem nº</span>}
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-orange-400">★ {lead.nota || '-'}</span>
                        </td>
                        <td className="px-4 py-3 text-gray-400">{lead.reviews || 0}</td>
                        <td className="px-4 py-3 text-right">
                          <button onClick={(e) => { e.stopPropagation(); toggleSelect(i); }} className="p-1.5 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded transition-colors">
                            <Trash2 size={14} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* ===== SIDEBAR ===== */}
        <div className="xl:col-span-1 space-y-4">

          {/* Campanha Inteligente */}
          <div className={`rounded-2xl p-5 border transition-colors bg-[#121216] border-white/5`}>
            <h3 className="font-bold text-sm mb-3 flex items-center gap-2">
              <Megaphone size={16} className="text-emerald-400" />
              Criar Campanha
            </h3>
            <p className="text-[11px] text-gray-400 mb-4 leading-relaxed">
              Envie mensagens em massa para os leads importados usando a inteligência do SDR (Campanhas Anti-Ban).
            </p>
            <button 
              onClick={() => {
                 const idsToSave = selectedIds.size > 0 
                   ? searchResults.filter((_, i) => selectedIds.has(i)).map(l => l.id).filter(Boolean)
                   : searchResults.map(l => l.id).filter(Boolean);
                 if (idsToSave.length > 0) {
                   sessionStorage.setItem('preSelectedLeads', JSON.stringify(idsToSave));
                 }
                 if (setActiveTab) setActiveTab('campanhas');
              }}
              className={`w-full py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all bg-emerald-500 text-white hover:bg-emerald-600 shadow-lg shadow-emerald-500/25`}
            >
              <Megaphone size={16} /> Ir para Campanhas
            </button>
          </div>

          {/* Fluxo */}
          <div className="bg-[#121216] border border-white/5 rounded-2xl p-5">
            <h3 className="font-bold text-sm mb-4">Como funciona</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="p-1.5 bg-purple-500/10 text-purple-400 rounded-lg shrink-0"><Search size={14}/></div>
                <div>
                  <p className="text-xs font-bold text-white">1. Busque ou importe</p>
                  <p className="text-[10px] text-gray-500">Digite o nicho e a cidade</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-1.5 bg-blue-500/10 text-blue-400 rounded-lg shrink-0"><Bot size={14}/></div>
                <div>
                  <p className="text-xs font-bold text-white">2. IA encontra leads</p>
                  <p className="text-[10px] text-gray-500">Scraping automático do Maps</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-1.5 bg-orange-500/10 text-orange-400 rounded-lg shrink-0"><Trash2 size={14}/></div>
                <div>
                  <p className="text-xs font-bold text-white">3. Exclua os que não quer</p>
                  <p className="text-[10px] text-gray-500">Selecione individualmente ou todos</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-1.5 bg-emerald-500/10 text-emerald-400 rounded-lg shrink-0"><Megaphone size={14}/></div>
                <div>
                  <p className="text-xs font-bold text-white">4. Campanha automática</p>
                  <p className="text-[10px] text-gray-500">Dispara mensagens via WhatsApp</p>
                </div>
              </div>
            </div>
          </div>

          {/* Dicas */}
          <div className="bg-[#121216] border border-white/5 rounded-2xl p-5">
            <h3 className="font-bold text-sm mb-4">Dicas</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <CheckCircle size={14} className="text-purple-400 mt-0.5 shrink-0" />
                <p className="text-[11px] text-gray-400 leading-tight">Seja específico no nicho: "Pizzaria delivery" em vez de apenas "Restaurante".</p>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle size={14} className="text-purple-400 mt-0.5 shrink-0" />
                <p className="text-[11px] text-gray-400 leading-tight">Revise a lista antes de ativar a campanha. Exclua concorrentes e leads indesejados.</p>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle size={14} className="text-purple-400 mt-0.5 shrink-0" />
                <p className="text-[11px] text-gray-400 leading-tight">Configure seus templates de mensagem antes de ativar o envio automático.</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
