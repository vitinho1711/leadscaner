import React, { useState, useEffect } from 'react';
import { Download, Copy, Zap, Search, Filter, PhoneCall, TrendingUp, CheckCircle, Flame, MessageSquare, Target, HeadphonesIcon, RefreshCw, Trash2, CheckSquare, Square, XCircle, Megaphone } from 'lucide-react';

export default function LeadScannerLeads({ setActiveTab }) {
  const [activeFilter, setActiveFilter] = useState('Todos');
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIds, setSelectedIds] = useState(new Set());

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/leads?t=' + Date.now());
      const json = await res.json();
      setLeads(json.data || []);
    } catch (e) {
      console.error('Erro ao buscar leads:', e);
    }
    setLoading(false);
  };

  useEffect(() => { fetchLeads(); }, []);

  const handleDelete = async (id) => {
    if(!window.confirm('Tem certeza que deseja excluir este lead?')) return;
    try {
      await fetch(`/api/leads/${id}`, { method: 'DELETE' });
      setSelectedIds(prev => { const n = new Set(prev); n.delete(id); return n; });
      fetchLeads();
    } catch (e) { console.error(e); }
  };

  const handleDeleteSelected = async () => {
    if (selectedIds.size === 0) return;
    const label = selectedIds.size === filteredLeads.length ? 'TODOS os leads filtrados' : `${selectedIds.size} lead(s)`;
    if (!window.confirm(`Excluir ${label}?`)) return;
    for (const id of selectedIds) {
      try { await fetch(`/api/leads/${id}`, { method: 'DELETE' }); } catch (e) { console.error(e); }
    }
    setSelectedIds(new Set());
    fetchLeads();
  };

  const handleDeleteAll = async () => {
    if (leads.length === 0) return;
    if (!window.confirm(`Tem certeza que deseja excluir TODOS os ${leads.length} leads da base?`)) return;
    for (const lead of leads) {
      try { await fetch(`/api/leads/${lead.id}`, { method: 'DELETE' }); } catch (e) { console.error(e); }
    }
    setSelectedIds(new Set());
    setLeads([]);
  };

  const handleExportCSV = () => {
    const leadsToExport = selectedIds.size > 0 ? leads.filter(l => selectedIds.has(l.id)) : filteredLeads;
    if (leadsToExport.length === 0) return alert('Nenhum lead para exportar.');
    
    const headers = ['Nome', 'Nicho', 'WhatsApp', 'Cidade', 'Nota', 'Status'];
    const csvContent = [
      headers.join(';'),
      ...leadsToExport.map(l => [
        `"${(l.nome || '').replace(/"/g, '""')}"`,
        `"${(l.nicho || '').replace(/"/g, '""')}"`,
        `"=""${(l.whatsapp || '').replace(/"/g, '""')}"""`,
        `"${(l.cidade || '').replace(/"/g, '""')}"`,
        `"${(l.nota || '')}"`,
        `"${(l.status || '')}"`
      ].join(';'))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `leads_sdr_${new Date().getTime()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const toggleSelect = (id) => {
    setSelectedIds(prev => {
      const n = new Set(prev);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === filteredLeads.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredLeads.map(l => l.id)));
    }
  };

  const handleSendToCampaign = () => {
    if (selectedIds.size === 0) return;
    sessionStorage.setItem('preSelectedLeads', JSON.stringify(Array.from(selectedIds)));
    if (setActiveTab) setActiveTab('campanhas');
  };

  const filteredLeads = leads.filter(l => {
    const matchFilter = (() => {
      if(activeFilter === 'Todos') return true;
      if(activeFilter === '🔥 Quentes') return l.score >= 20 || l.status === 'QUENTE';
      if(activeFilter === 'Novos') return l.status === 'NOVO' || l.status === 'FRIO';
      if(activeFilter === 'Chamados') return l.status === 'CHAMADO' || l.messageSent;
      if(activeFilter === 'Negociando') return l.status === 'NEGOCIANDO';
      if(activeFilter === 'Fechados') return l.status === 'FECHADO';
      return true;
    })();
    const matchSearch = !searchTerm || (l.nome || '').toLowerCase().includes(searchTerm.toLowerCase()) || (l.nicho || '').toLowerCase().includes(searchTerm.toLowerCase());
    return matchFilter && matchSearch;
  });

  const getStatusColor = (status) => {
    if(!status) return 'blue';
    const s = status.toUpperCase();
    if(s === 'NOVO' || s === 'FRIO') return 'blue';
    if(s === 'MORNO' || s === 'CHAMADO') return 'orange';
    if(s === 'QUENTE' || s === 'NEGOCIANDO') return 'purple';
    if(s === 'FECHADO') return 'emerald';
    return 'gray';
  };

  const getLevel = (score) => {
    if(!score) return { text: 'FRIO', color: 'blue' };
    if(score >= 25) return { text: 'QUENTE', color: 'red' };
    if(score >= 10) return { text: 'MORNO', color: 'orange' };
    return { text: 'FRIO', color: 'blue' };
  };

  const stats = {
    novos: leads.filter(l => !l.status || l.status === 'NOVO' || l.status === 'FRIO').length,
    chamados: leads.filter(l => l.status === 'CHAMADO' || l.messageSent).length,
    negociando: leads.filter(l => l.status === 'NEGOCIANDO').length,
    fechados: leads.filter(l => l.status === 'FECHADO').length
  };

  return (
    <div className="animate-fade-in text-white space-y-6 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold mb-1">Leads Qualificados</h1>
          <p className="text-sm text-gray-400">Gerencie, aborde e feche oportunidades com eficiência.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button onClick={fetchLeads} className="flex items-center gap-2 px-4 py-2 bg-[#121216] border border-white/5 hover:bg-white/5 rounded-lg text-sm font-medium transition-colors">
            <RefreshCw size={16} className={loading ? 'animate-spin text-purple-400' : ''} /> Atualizar
          </button>
          {selectedIds.size > 0 && (
            <>
              <button onClick={handleSendToCampaign} className="flex items-center gap-2 px-4 py-2 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500 hover:text-white rounded-lg text-sm font-bold transition-colors shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                <Megaphone size={16} /> Enviar para Campanha Automática
              </button>
              <button onClick={handleDeleteSelected} className="flex items-center gap-2 px-4 py-2 bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500 hover:text-white rounded-lg text-sm font-bold transition-colors">
                <Trash2 size={16} /> Excluir ({selectedIds.size})
              </button>
            </>
          )}
          <button onClick={handleDeleteAll} className="flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500 hover:text-white rounded-lg text-sm font-bold transition-colors">
            <XCircle size={16} /> Excluir Todos
          </button>
          <button onClick={handleExportCSV} className="flex items-center gap-2 px-4 py-2 bg-blue-500/10 text-blue-400 border border-blue-500/20 hover:bg-blue-500 hover:text-white rounded-lg text-sm font-bold transition-colors">
            <Download size={16} /> Exportar CSV
          </button>
        </div>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-[#121216] border border-white/5 rounded-xl p-5 flex flex-col justify-between">
          <div className="flex items-start gap-3 mb-2">
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20"><Zap size={20} /></div>
            <div><p className="text-xs text-gray-400 font-medium">Leads Novos</p><h3 className="text-2xl font-bold mt-0.5">{stats.novos}</h3></div>
          </div>
        </div>
        <div className="bg-[#121216] border border-white/5 rounded-xl p-5 flex flex-col justify-between">
          <div className="flex items-start gap-3 mb-2">
            <div className="p-2 rounded-lg bg-orange-500/10 text-orange-400 border border-orange-500/20"><PhoneCall size={20} /></div>
            <div><p className="text-xs text-gray-400 font-medium">Leads Chamados</p><h3 className="text-2xl font-bold mt-0.5">{stats.chamados}</h3></div>
          </div>
        </div>
        <div className="bg-[#121216] border border-white/5 rounded-xl p-5 flex flex-col justify-between">
          <div className="flex items-start gap-3 mb-2">
            <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20"><TrendingUp size={20} /></div>
            <div><p className="text-xs text-gray-400 font-medium">Em Negociação</p><h3 className="text-2xl font-bold mt-0.5">{stats.negociando}</h3></div>
          </div>
        </div>
        <div className="bg-[#121216] border border-white/5 rounded-xl p-5 flex flex-col justify-between">
          <div className="flex items-start gap-3 mb-2">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"><CheckCircle size={20} /></div>
            <div><p className="text-xs text-gray-400 font-medium">Leads Fechados</p><h3 className="text-2xl font-bold mt-0.5">{stats.fechados}</h3></div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        
        {/* Main Table Area */}
        <div className="col-span-3 space-y-4">
          
          {/* Filters & Search */}
          <div className="flex items-center justify-between bg-[#121216] p-3 border border-white/5 rounded-xl overflow-x-auto scrollbar-none flex-wrap gap-2">
            <div className="flex items-center gap-2 whitespace-nowrap">
              {['Todos', '🔥 Quentes', 'Novos', 'Chamados', 'Negociando', 'Fechados'].map(filter => (
                <button 
                  key={filter}
                  onClick={() => { setActiveFilter(filter); setSelectedIds(new Set()); }}
                  className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-colors ${activeFilter === filter ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                >
                  {filter}
                </button>
              ))}
            </div>
            
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={14} />
                <input 
                  type="text" 
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  placeholder="Buscar leads..." 
                  className="pl-9 pr-4 py-1.5 bg-black/50 border border-white/5 rounded-lg text-xs focus:outline-none focus:border-purple-500/50 w-48 text-white"
                />
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="bg-[#121216] border border-white/5 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs whitespace-nowrap">
                <thead className="bg-black/30 border-b border-white/5">
                  <tr className="text-gray-400">
                    <th className="py-4 px-4 font-medium w-10">
                      <button onClick={toggleSelectAll} className="text-gray-500 hover:text-white transition-colors">
                        {selectedIds.size === filteredLeads.length && filteredLeads.length > 0 ? <CheckSquare size={16} className="text-purple-400" /> : <Square size={16} />}
                      </button>
                    </th>
                    <th className="py-4 px-4 font-medium">Lead</th>
                    <th className="py-4 px-4 font-medium">Status</th>
                    <th className="py-4 px-4 font-medium">WhatsApp</th>
                    <th className="py-4 px-4 font-medium">Nível / Pontos</th>
                    <th className="py-4 px-4 font-medium text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-gray-300">
                  {loading && leads.length === 0 ? (
                    <tr><td colSpan="6" className="py-10 text-center text-gray-500">Carregando leads...</td></tr>
                  ) : filteredLeads.length === 0 ? (
                    <tr><td colSpan="6" className="py-10 text-center text-gray-500">Nenhum lead encontrado.</td></tr>
                  ) : filteredLeads.map((lead) => {
                    const statusColor = getStatusColor(lead.status);
                    const level = getLevel(lead.score);
                    const cleanPhone = lead.whatsapp ? lead.whatsapp.replace(/\D/g, '') : '';
                    const isSelected = selectedIds.has(lead.id);
                    
                    return (
                      <tr key={lead.id} className={`hover:bg-white/[0.02] transition-colors cursor-pointer ${isSelected ? 'bg-purple-500/5' : ''}`} onClick={() => toggleSelect(lead.id)}>
                        <td className="py-4 px-4">
                          <input type="checkbox" checked={isSelected} onChange={() => {}} className="w-4 h-4 rounded accent-purple-500" />
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-gray-400 border border-white/10 shrink-0">
                              <CheckCircle size={14} className={lead.messageSent ? 'text-emerald-400' : 'text-gray-600'} />
                            </div>
                            <div>
                              <p className="font-bold text-white text-sm max-w-[200px] truncate" title={lead.nome}>{lead.nome}</p>
                              <p className="text-[10px] text-gray-500 truncate max-w-[200px]">{lead.nicho} • {lead.cidade || 'Sem cidade'}</p>
                              <div className="flex items-center gap-1 mt-1">
                                <span className="text-orange-400 text-[10px]">★ {lead.nota || '-'}</span>
                                <span className="text-gray-600 text-[10px]">({lead.reviews || 0} aval.)</span>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold border bg-${statusColor}-500/10 text-${statusColor}-400 border-${statusColor}-500/20`}>
                            {lead.status || 'NOVO'}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          {cleanPhone.length >= 10 ? (
                            <button onClick={(e) => { e.stopPropagation(); window.open(`https://wa.me/${cleanPhone}`, '_blank'); }} className="flex items-center gap-1.5 px-3 py-1.5 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 rounded-lg text-[10px] font-bold transition-colors">
                              <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="WA" className="w-3 h-3 opacity-80" /> Abrir Zap
                            </button>
                          ) : (
                            <span className="text-gray-600 text-[10px]">Sem número</span>
                          )}
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex flex-col gap-1">
                            <span className={`px-2 py-0.5 rounded text-[9px] font-bold w-max bg-${level.color}-500/20 text-${level.color}-400`}>
                              {level.text}
                            </span>
                            <p className="text-[10px] text-gray-400">Score: {lead.score || 0}</p>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <button onClick={(e) => { e.stopPropagation(); handleDelete(lead.id); }} className="p-1.5 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded transition-colors" title="Excluir">
                            <Trash2 size={14}/>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="p-4 border-t border-white/5 flex items-center justify-between text-xs text-gray-500">
              <span>Mostrando {filteredLeads.length} de {leads.length} leads</span>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="col-span-1 space-y-4">
          
          <div className="bg-[#121216] border border-white/5 rounded-2xl p-5">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-sm">Melhores Oportunidades</h3>
              <button onClick={handleExportCSV} className="flex items-center gap-1.5 text-blue-400 hover:text-blue-300 transition-colors">
                <Download size={14} /> <span className="text-[10px]">Exportar</span>
              </button>
            </div>
            <div className="space-y-4">
              {leads.filter(l => l.score > 0).sort((a,b) => b.score - a.score).slice(0, 5).map((lead, i) => (
                <div key={i} className="flex flex-col gap-2 group">
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-full border-2 border-emerald-500/30 flex items-center justify-center text-[9px] font-bold text-emerald-400 shrink-0">
                      {lead.score || 0}
                    </div>
                    <div className="truncate">
                      <p className="text-xs font-bold text-white group-hover:text-emerald-400 transition-colors leading-tight truncate" title={lead.nome}>{lead.nome}</p>
                      <p className="text-[9px] text-gray-500 leading-tight truncate">{lead.nicho}</p>
                    </div>
                  </div>
                  {lead.whatsapp && lead.whatsapp.replace(/\D/g, '').length >= 10 && (
                    <button onClick={() => window.open(`https://wa.me/${lead.whatsapp.replace(/\D/g, '')}`, '_blank')} className="ml-10 px-2 py-1 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 rounded text-[9px] font-bold transition-colors w-max flex items-center gap-1">
                      <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="WA" className="w-2.5 h-2.5 opacity-80" /> Abrir Zap
                    </button>
                  )}
                </div>
              ))}
              {leads.length === 0 && <p className="text-xs text-gray-500">Nenhum lead qualificado ainda.</p>}
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-900/30 to-blue-900/30 border border-purple-500/20 rounded-2xl p-5">
            <h3 className="font-bold text-sm text-white mb-2">Precisa de ajuda?</h3>
            <p className="text-xs text-purple-200 mb-4 opacity-80">Nosso suporte está pronto para te ajudar!</p>
            <button className="w-full flex items-center justify-center gap-2 py-2 bg-purple-600/20 hover:bg-purple-600/40 border border-purple-500/30 rounded-lg text-purple-300 text-xs font-bold transition-colors">
              <HeadphonesIcon size={14} /> Abrir Suporte
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
