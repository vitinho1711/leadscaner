import React, { useState, useEffect } from 'react';
import { 
  Sparkles, Search, Monitor, FileText, Link2, ExternalLink, 
  CheckCircle, Clock, Send, Eye, Edit3, ArrowUpRight, TrendingUp, Layers, Zap,
  Bot, Key, X, Check, AlertCircle, ChevronLeft, ChevronRight 
} from 'lucide-react';
import LeadStudioModal from './LeadStudioModal';
import BusinessPromptModal from './BusinessPromptModal';

export default function SiteBuilderView() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('Todos');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20;

  const [selectedLeadForBuilder, setSelectedLeadForBuilder] = useState(null);
  const [promptLead, setPromptLead] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  
  // Debounce search to prevent UI freezing on typing
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setCurrentPage(1);
    }, 200);
    return () => clearTimeout(handler);
  }, [searchTerm]);
  
  // AI Status & Quick Key Configuration
  const [aiStatus, setAiStatus] = useState({ isOpenAiActive: false, model: 'gemini-2.0-flash', provider: 'auto', hasOpenAi: false, hasGroq: false, hasGemini: false });
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [modalTab, setModalTab] = useState('gemini'); // 'gemini' | 'openai'
  const [modalGeminiKey, setModalGeminiKey] = useState('');
  const [modalOpenAiKey, setModalOpenAiKey] = useState('');
  const [modalOpenAiModel, setModalOpenAiModel] = useState('gpt-4o-mini');
  const [savingKey, setSavingKey] = useState(false);

  useEffect(() => {
    fetchLeads();
    fetchAiStatus();
  }, []);

  const fetchAiStatus = async () => {
    try {
      const token = localStorage.getItem('sdr_jwt_token') || localStorage.getItem('token');
      const res = await fetch('/api/site-builder/ai-status', {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      if (res.ok) {
        const data = await res.json();
        setAiStatus(data);
      }
    } catch (e) {}
  };

  const handleSaveModalKey = async () => {
    setSavingKey(true);
    try {
      const token = localStorage.getItem('sdr_jwt_token') || localStorage.getItem('token');
      const payload = {};
      if (modalTab === 'gemini') {
        if (!modalGeminiKey.trim()) return;
        payload.geminiApiKey = modalGeminiKey.trim();
        payload.geminiModel = 'gemini-2.0-flash';
        payload.aiProvider = 'gemini';
      } else {
        if (!modalOpenAiKey.trim()) return;
        payload.openaiApiKey = modalOpenAiKey.trim();
        payload.openaiModel = modalOpenAiModel;
        payload.aiProvider = 'openai';
      }

      const res = await fetch('/api/config', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        alert(modalTab === 'gemini' ? '✨ Chave do Google Gemini 2.0 Flash configurada com sucesso!' : '🤖 Chave do ChatGPT configurada com sucesso!');
        setShowKeyModal(false);
        fetchAiStatus();
      } else {
        alert('Erro ao salvar chave.');
      }
    } catch (e) {
      alert('Erro ao salvar chave: ' + e.message);
    } finally {
      setSavingKey(false);
    }
  };

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('sdr_jwt_token') || localStorage.getItem('token');
      const res = await fetch('/api/leads?t=' + Date.now(), {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      const data = await res.json();
      if (data.data) {
        setLeads(data.data);
      }
    } catch (e) {
      console.error('Erro ao buscar leads:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleLeadUpdated = (updatedLead) => {
    setLeads((prev) => prev.map((l) => (l.id === updatedLead.id ? updatedLead : l)));
  };

  const handleCopyLink = (lead, e) => {
    e.stopPropagation();
    const url = `${window.location.origin}/preview/${lead.id}`;
    navigator.clipboard.writeText(url);
    setCopiedId(lead.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleOpenPreview = (lead, e) => {
    e.stopPropagation();
    window.open(`/preview/${lead.id}`, '_blank');
  };

  // Filtragem dos leads com termo debounced
  const filteredLeads = leads.filter((lead) => {
    const term = debouncedSearch.trim().toLowerCase();
    const matchesSearch =
      !term ||
      (lead.nome || '').toLowerCase().includes(term) ||
      (lead.nicho || '').toLowerCase().includes(term) ||
      (lead.cidade || '').toLowerCase().includes(term);

    if (!matchesSearch) return false;

    if (activeFilter === 'Todos') return true;
    if (activeFilter === 'Sem Site') return !lead.siteStatus || lead.siteStatus === 'SEM_SITE';
    if (activeFilter === 'Com Site Gerado') return lead.siteStatus === 'SITE_GERADO' || lead.siteHtml || lead.hasSiteHtml;
    if (activeFilter === 'Proposta Criada') return lead.siteStatus === 'PDF_GERADO';
    if (activeFilter === 'Em Negociação') return lead.siteStatus === 'ENVIADO_AO_CLIENTE' || lead.siteStatus === 'CLIENTE_INTERESSADO' || lead.siteStatus === 'PROPOSTA_ENVIADA';
    if (activeFilter === 'Vendido') return lead.siteStatus === 'VENDA_REALIZADA' || lead.status === 'FECHADO';

    return true;
  });

  // Paginação inteligente para 60 FPS
  const totalPages = Math.max(1, Math.ceil(filteredLeads.length / pageSize));
  const validPage = Math.min(currentPage, totalPages);
  const startIndex = (validPage - 1) * pageSize;
  const paginatedLeads = filteredLeads.slice(startIndex, startIndex + pageSize);

  // Métricas
  const totalLeads = leads.length;
  const sitesGeradosCount = leads.filter((l) => l.siteStatus === 'SITE_GERADO' || l.siteHtml || l.hasSiteHtml).length;
  const propostasCount = leads.filter((l) => l.siteStatus === 'PDF_GERADO').length;
  const convertidosCount = leads.filter((l) => l.siteStatus === 'VENDA_REALIZADA').length;

  const getStatusBadge = (status) => {
    switch (status) {
      case 'SITE_GERADO':
        return { label: 'Site Pronto ✨', color: 'purple' };
      case 'PDF_GERADO':
        return { label: 'PDF Criado 📄', color: 'blue' };
      case 'ENVIADO_AO_CLIENTE':
        return { label: 'Enviado ✉️', color: 'amber' };
      case 'CLIENTE_INTERESSADO':
        return { label: 'Interessado 🔥', color: 'orange' };
      case 'PROPOSTA_ENVIADA':
        return { label: 'Proposta Enviada 💼', color: 'indigo' };
      case 'VENDA_REALIZADA':
        return { label: 'Venda Fechada 🏆', color: 'emerald' };
      case 'SEM_SITE':
      default:
        return { label: 'Sem Site', color: 'gray' };
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#0a0a0d] text-white overflow-hidden font-sans">
      {/* Top Header */}
      <div className="p-6 border-b border-white/5 bg-[#0f0f13] flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center shadow-[0_0_20px_rgba(124,58,237,0.35)]">
              <Sparkles size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight text-white flex items-center gap-2">
                Site Builder IA
                <span className="text-[10px] uppercase font-extrabold px-2 py-0.5 rounded-full bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-500/30 text-purple-300">
                  Alta Conversão
                </span>
                <button
                  onClick={() => setShowKeyModal(true)}
                  className={`text-[10px] uppercase font-extrabold px-2.5 py-0.5 rounded-full flex items-center gap-1.5 transition-all cursor-pointer ${
                    aiStatus.hasGemini
                      ? 'bg-blue-500/15 border border-blue-500/30 text-blue-300 hover:bg-blue-500/25 shadow-[0_0_12px_rgba(59,130,246,0.2)]'
                      : aiStatus.hasGroq
                      ? 'bg-amber-500/15 border border-amber-500/30 text-amber-300 hover:bg-amber-500/25 shadow-[0_0_12px_rgba(245,158,11,0.2)]'
                      : aiStatus.isOpenAiActive
                      ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/25 shadow-[0_0_12px_rgba(16,185,129,0.2)]'
                      : 'bg-purple-500/15 border border-purple-500/30 text-purple-300 hover:bg-purple-500/25 animate-pulse'
                  }`}
                  title="Configurações de Inteligência Artificial para Geração dos Sites"
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${aiStatus.hasGemini || aiStatus.hasGroq || aiStatus.isOpenAiActive ? 'bg-emerald-400' : 'bg-amber-400'}`}></span>
                  <span>
                    {aiStatus.hasGemini
                      ? '✨ Gemini 2.0 Flash (Grátis)'
                      : aiStatus.hasGroq
                      ? '⚡ Groq Cloud 120B (Grátis)'
                      : aiStatus.isOpenAiActive
                      ? `🤖 ChatGPT (${aiStatus.model || 'gpt-4o-mini'})`
                      : '✨ Conectar IA Grátis'}
                  </span>
                </button>
              </h1>
              <p className="text-xs text-gray-400">
                Transforme qualquer empresa encontrada no Google Maps em um site profissional sob medida e gere a proposta em PDF.
              </p>
            </div>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 bg-white/[0.03] border border-white/5 rounded-xl">
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">Total Leads</span>
            <span className="text-base font-extrabold text-white">{totalLeads}</span>
          </div>
          <div className="px-4 py-2 bg-purple-500/10 border border-purple-500/20 rounded-xl">
            <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider block">Sites Criados</span>
            <span className="text-base font-extrabold text-purple-300">{sitesGeradosCount}</span>
          </div>
          <div className="px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-xl">
            <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider block">Propostas PDF</span>
            <span className="text-base font-extrabold text-blue-300">{propostasCount}</span>
          </div>
          <div className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">Vendas</span>
            <span className="text-base font-extrabold text-emerald-300">{convertidosCount}</span>
          </div>
        </div>
      </div>

      {/* Filters & Search Toolbar */}
      <div className="p-4 border-b border-white/5 bg-black/20 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto custom-scrollbar py-1">
          {['Todos', 'Sem Site', 'Com Site Gerado', 'Proposta Criada', 'Em Negociação', 'Vendido'].map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setActiveFilter(tab);
                setCurrentPage(1);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                activeFilter === tab
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por empresa, nicho ou cidade..."
            className="pl-9 pr-4 py-2 bg-black/50 border border-white/10 rounded-xl text-xs text-white focus:border-purple-500 focus:outline-none w-72 placeholder:text-gray-600"
          />
        </div>
      </div>

      {/* Table Container */}
      <div className="flex-1 overflow-auto custom-scrollbar p-6">
        <div className="bg-[#121216] border border-white/5 rounded-2xl overflow-hidden shadow-xl">
          <table className="w-full text-left text-xs whitespace-nowrap">
            <thead className="bg-black/40 border-b border-white/5 text-gray-400 font-semibold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Empresa / Lead</th>
                <th className="py-3.5 px-4">Localização & Avaliações</th>
                <th className="py-3.5 px-4">Status do Site</th>
                <th className="py-3.5 px-4 text-center">Demonstração</th>
                <th className="py-3.5 px-4 text-right">Ação do Site Builder</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading && leads.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-gray-500">
                    Carregando empresas...
                  </td>
                </tr>
              ) : filteredLeads.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-gray-500">
                    Nenhuma empresa encontrada com os filtros selecionados.
                  </td>
                </tr>
              ) : (
                paginatedLeads.map((lead) => {
                  const badge = getStatusBadge(lead.siteStatus);
                  const hasSite = Boolean(lead.siteHtml || lead.hasSiteHtml || lead.siteStatus === 'SITE_GERADO');

                  return (
                    <tr
                      key={lead.id}
                      className="hover:bg-white/[0.02] transition-colors cursor-pointer"
                      onClick={() => setSelectedLeadForBuilder(lead)}
                    >
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 font-bold shrink-0">
                            {lead.nome ? lead.nome.charAt(0).toUpperCase() : 'E'}
                          </div>
                          <div>
                            <p className="font-bold text-white text-sm truncate max-w-[220px]" title={lead.nome}>
                              {lead.nome || 'Empresa'}
                            </p>
                            <span className="text-[10px] text-gray-400 font-medium">
                              {lead.nicho || 'Serviços'}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-4">
                        <div>
                          <p className="text-gray-300 font-medium">{lead.cidade || 'Brasil'}</p>
                          <div className="flex items-center gap-1 mt-0.5">
                            <span className="text-amber-400 text-[11px] font-bold">★ {lead.nota || '5.0'}</span>
                            <span className="text-gray-500 text-[10px]">({lead.reviews || 0} avaliações)</span>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            badge.color === 'purple'
                              ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                              : badge.color === 'blue'
                              ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                              : badge.color === 'emerald'
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : badge.color === 'orange' || badge.color === 'amber'
                              ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                              : 'bg-white/5 text-gray-400 border border-white/10'
                          }`}
                        >
                          {badge.label}
                        </span>
                      </td>

                      <td className="py-4 px-4 text-center">
                        {hasSite ? (
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={(e) => handleCopyLink(lead, e)}
                              className="p-1.5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                              title="Copiar Link de Demonstração"
                            >
                              <Link2 size={14} className={copiedId === lead.id ? 'text-emerald-400' : ''} />
                            </button>
                            <button
                              onClick={(e) => handleOpenPreview(lead, e)}
                              className="p-1.5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-purple-400 transition-colors"
                              title="Abrir Demonstração"
                            >
                              <ExternalLink size={14} />
                            </button>
                          </div>
                        ) : (
                          <span className="text-gray-600 text-[10px]">Pendente</span>
                        )}
                      </td>

                      <td className="py-4 px-4 text-right">
                        <div className="flex items-center justify-end gap-2 flex-wrap">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setPromptLead(lead);
                            }}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-purple-600/30 via-indigo-600/30 to-blue-600/30 border border-purple-500/40 text-purple-200 hover:border-purple-400 hover:scale-105 rounded-xl text-xs font-bold transition-all shadow-sm"
                            title="Ver Prompt Especializado por Nicho e Gerar com Google Stitch IA"
                          >
                            <Sparkles size={12} className="text-purple-400" />
                            Prompt & Stitch
                          </button>

                          {hasSite ? (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedLeadForBuilder(lead);
                              }}
                              className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-lg text-xs font-semibold transition-all"
                            >
                              <Eye size={13} />
                              Ver / Editar
                            </button>
                          ) : (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedLeadForBuilder(lead);
                              }}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white rounded-lg text-xs font-semibold transition-all"
                            >
                              Studio IA
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>

          {/* Pagination Controls */}
          {filteredLeads.length > pageSize && (
            <div className="p-4 border-t border-white/5 bg-black/40 flex flex-wrap items-center justify-between gap-3 text-xs">
              <span className="text-gray-400">
                Mostrando <span className="text-white font-bold">{startIndex + 1}</span> a{' '}
                <span className="text-white font-bold">{Math.min(startIndex + pageSize, filteredLeads.length)}</span> de{' '}
                <span className="text-white font-bold">{filteredLeads.length}</span> empresas
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={validPage === 1}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-gray-300 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all font-semibold"
                >
                  <ChevronLeft size={14} /> Anterior
                </button>

                <span className="px-3 py-1 bg-purple-500/15 border border-purple-500/30 rounded-lg text-purple-300 font-bold">
                  {validPage} / {totalPages}
                </span>

                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={validPage >= totalPages}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-gray-300 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all font-semibold"
                >
                  Próxima <ChevronRight size={14} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal Rápido de Configuração de Inteligência Artificial */}
      {showKeyModal && (
        <div className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#121216] border border-white/10 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4 animate-fade-in relative">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles size={20} className="text-purple-400" />
                <h3 className="font-bold text-sm text-white">Configurar IA do Site Builder</h3>
              </div>
              <button 
                onClick={() => setShowKeyModal(false)}
                className="text-gray-400 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            {/* Provider Tabs */}
            <div className="flex p-1 bg-white/5 rounded-xl gap-1">
              <button
                type="button"
                onClick={() => setModalTab('gemini')}
                className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  modalTab === 'gemini'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                ✨ Google Gemini (Grátis)
              </button>
              <button
                type="button"
                onClick={() => setModalTab('openai')}
                className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  modalTab === 'openai'
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                🤖 OpenAI ChatGPT
              </button>
            </div>

            {modalTab === 'gemini' ? (
              <div className="space-y-3">
                <p className="text-xs text-gray-300 leading-relaxed bg-blue-500/10 border border-blue-500/20 p-2.5 rounded-xl">
                  <strong className="text-blue-300">100% Gratuito:</strong> O Google Gemini 2.0 Flash oferece até <strong className="text-white">1.500 sites por dia</strong> gratuitamente sem precisar de cartão de crédito.
                </p>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                      Chave API Gemini
                    </label>
                    <a
                      href="https://aistudio.google.com/app/apikey"
                      target="_blank"
                      rel="noreferrer"
                      className="text-[10px] text-blue-400 hover:underline flex items-center gap-1"
                    >
                      Pegar chave grátis no Google <ExternalLink size={10} />
                    </a>
                  </div>
                  <input 
                    type="password"
                    value={modalGeminiKey}
                    onChange={(e) => setModalGeminiKey(e.target.value)}
                    placeholder="AIzaSy..."
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500 font-mono"
                  />
                  <p className="text-[10px] text-gray-500 mt-1">
                    Basta fazer login com seu Gmail e clicar em "Create API key".
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-xs text-gray-400 leading-relaxed">
                  Insira sua chave de API da OpenAI para gerar sites e copywriting de alta conversão usando GPT-4o Mini ou GPT-4o.
                </p>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                      Chave OpenAI (API Key)
                    </label>
                    <a
                      href="https://platform.openai.com/api-keys"
                      target="_blank"
                      rel="noreferrer"
                      className="text-[10px] text-emerald-400 hover:underline flex items-center gap-1"
                    >
                      Obter chave <ExternalLink size={10} />
                    </a>
                  </div>
                  <input 
                    type="password"
                    value={modalOpenAiKey}
                    onChange={(e) => setModalOpenAiKey(e.target.value)}
                    placeholder="sk-proj-... ou sk-..."
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                    Modelo do ChatGPT
                  </label>
                  <select
                    value={modalOpenAiModel}
                    onChange={(e) => setModalOpenAiModel(e.target.value)}
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="gpt-4o-mini">⚡ GPT-4o Mini (Recomendado - Rápido e Econômico)</option>
                    <option value="gpt-4o">👑 GPT-4o (Máxima Potência Criativa)</option>
                  </select>
                </div>
              </div>
            )}

            {/* Groq Cloud Callout */}
            <div className="flex items-center gap-2 p-2 bg-amber-500/10 border border-amber-500/20 rounded-xl text-[11px] text-amber-300">
              <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0"></span>
              <span>
                <strong>Groq Cloud 120B</strong> já está ativo no seu servidor como backup gratuito automático.
              </span>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/5">
              <button
                type="button"
                onClick={() => setShowKeyModal(false)}
                className="px-4 py-2 bg-white/5 hover:bg-white/10 text-gray-300 rounded-xl text-xs font-semibold"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleSaveModalKey}
                disabled={savingKey || (modalTab === 'gemini' ? !modalGeminiKey.trim() : !modalOpenAiKey.trim())}
                className="px-5 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white rounded-xl text-xs font-bold disabled:opacity-50 shadow-lg"
              >
                {savingKey ? 'Salvando...' : 'Salvar e Ativar'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Fullscreen LeadSite Studio IA Workspace Modal */}
      {selectedLeadForBuilder && (
        <LeadStudioModal
          lead={selectedLeadForBuilder}
          onClose={() => setSelectedLeadForBuilder(null)}
          onLeadUpdated={handleLeadUpdated}
        />
      )}

      {/* Business Specialized Prompt & Stitch AI Modal */}
      {promptLead && (
        <BusinessPromptModal
          lead={promptLead}
          onClose={() => setPromptLead(null)}
          onLeadUpdated={(updated) => {
            handleLeadUpdated(updated);
            setPromptLead(updated);
          }}
        />
      )}
    </div>
  );
}
