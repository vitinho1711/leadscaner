import React, { useState, useEffect, useRef } from 'react';
import { Wand2, Search, Monitor, Smartphone, Download, Code2, X, Sparkles, RefreshCw, CheckCircle, AlertCircle, Globe } from 'lucide-react';

const LOADING_STEPS = [
  'Analisando o lead...',
  'Definindo identidade visual...',
  'Criando hero section impactante...',
  'Desenhando cards de serviços...',
  'Adicionando animações e efeitos...',
  'Construindo seção de depoimentos...',
  'Finalizando o site premium...',
];

export default function SdrSiteGenerator() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLead, setSelectedLead] = useState(null);
  const [generatedHtml, setGeneratedHtml] = useState('');
  const [generating, setGenerating] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [error, setError] = useState('');
  const [previewMode, setPreviewMode] = useState('desktop');
  const [copied, setCopied] = useState(false);
  const iframeRef = useRef(null);
  const stepIntervalRef = useRef(null);

  useEffect(() => { fetchLeads(); }, []);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const res = await fetch('/api/leads', { headers: { Authorization: `Bearer ${token}` } });
      const json = await res.json();
      if (json.data) setLeads(json.data.reverse());
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const startLoadingSteps = () => {
    setLoadingStep(0);
    let i = 0;
    stepIntervalRef.current = setInterval(() => {
      i++;
      if (i < LOADING_STEPS.length) setLoadingStep(i);
      else clearInterval(stepIntervalRef.current);
    }, 1800);
  };

  const handleGenerate = async (lead) => {
    setSelectedLead(lead);
    setGeneratedHtml('');
    setError('');
    setGenerating(true);
    startLoadingSteps();

    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/generate-site', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ leadId: lead.id }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Erro ao gerar');
      setGeneratedHtml(json.html);
    } catch (e) {
      setError(e.message);
    } finally {
      clearInterval(stepIntervalRef.current);
      setGenerating(false);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([generatedHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `site-${(selectedLead?.nome || 'lead').replace(/\s+/g, '-').toLowerCase()}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(generatedHtml);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClose = () => {
    setSelectedLead(null);
    setGeneratedHtml('');
    setError('');
    setGenerating(false);
    clearInterval(stepIntervalRef.current);
  };

  const filteredLeads = leads.filter(l => {
    if (!searchTerm) return true;
    return (l.nome || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (l.nicho || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (l.cidade || '').toLowerCase().includes(searchTerm.toLowerCase());
  });

  const isModalOpen = !!selectedLead;

  return (
    <div className="animate-fade-in text-white space-y-6 max-w-7xl mx-auto pb-12">

      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-violet-900/30 via-purple-900/20 to-blue-900/30 border border-purple-500/20 p-6 rounded-2xl">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-purple-600/10 via-transparent to-transparent pointer-events-none" />
        <div className="absolute top-0 right-0 p-6 opacity-10 pointer-events-none">
          <Globe size={140} className="text-purple-300" />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center shadow-lg shadow-violet-500/40">
                <Wand2 size={22} className="text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight">Gerador de Sites com IA</h1>
                <p className="text-xs text-purple-300/70 font-medium">Powered by Groq · llama-3.3-70b</p>
              </div>
            </div>
            <p className="text-sm text-gray-400 max-w-xl">
              Selecione um lead e gere uma landing page premium completa em segundos. Visualize, baixe e envie para o cliente.
            </p>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={15} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por nome, nicho ou cidade..."
              className="w-full md:w-72 pl-9 pr-4 py-2.5 bg-black/50 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-purple-500/50 text-white placeholder-gray-500 transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Lead Grid */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500" />
        </div>
      ) : filteredLeads.length === 0 ? (
        <div className="text-center py-20 bg-[#121216] border border-white/5 rounded-2xl">
          <Globe size={48} className="mx-auto text-gray-600 mb-4" />
          <h3 className="text-lg font-bold text-gray-300">Nenhum lead encontrado</h3>
          <p className="text-sm text-gray-500 mt-2">Importe leads para começar a gerar sites.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredLeads.map(lead => (
            <div
              key={lead.id}
              className="group bg-[#111115] border border-white/5 rounded-2xl p-5 flex flex-col gap-4 hover:border-purple-500/30 transition-all hover:shadow-lg hover:shadow-purple-900/10"
            >
              {/* Avatar */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold shrink-0"
                  style={{ background: `hsl(${(lead.nome || 'A').charCodeAt(0) * 7 % 360}, 60%, 25%)`, color: `hsl(${(lead.nome || 'A').charCodeAt(0) * 7 % 360}, 80%, 70%)` }}>
                  {(lead.nome || '?').charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-sm text-white truncate">{lead.nome || 'Sem nome'}</p>
                  <p className="text-xs text-gray-500 truncate">{lead.cidade || 'Sem cidade'}</p>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5">
                {lead.nicho && (
                  <span className="px-2 py-0.5 rounded-md text-xs bg-purple-500/10 text-purple-300 border border-purple-500/20">
                    {lead.nicho}
                  </span>
                )}
                {lead.status && (
                  <span className={`px-2 py-0.5 rounded-md text-xs border ${
                    lead.status === 'QUENTE' ? 'bg-red-500/10 text-red-300 border-red-500/20' :
                    lead.status === 'CHAMADO' ? 'bg-yellow-500/10 text-yellow-300 border-yellow-500/20' :
                    'bg-white/5 text-gray-400 border-white/10'
                  }`}>
                    {lead.status}
                  </span>
                )}
              </div>

              {/* CTA */}
              <button
                onClick={() => handleGenerate(lead)}
                className="w-full mt-auto py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 text-white shadow-lg shadow-violet-600/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <Sparkles size={15} />
                Gerar Site
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Modal de Preview */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-6xl h-[90vh] bg-[#0e0e12] border border-white/10 rounded-2xl flex flex-col overflow-hidden shadow-2xl shadow-black/60">

            {/* Modal Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/5 bg-[#111115] shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center shadow shadow-violet-500/30">
                  <Globe size={16} className="text-white" />
                </div>
                <div>
                  <p className="font-bold text-sm text-white">{selectedLead?.nome || 'Lead'}</p>
                  <p className="text-xs text-gray-500">{selectedLead?.nicho} · {selectedLead?.cidade}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* Preview mode toggle */}
                {generatedHtml && (
                  <div className="flex items-center gap-1 bg-black/40 border border-white/10 rounded-lg p-1 mr-2">
                    <button
                      onClick={() => setPreviewMode('desktop')}
                      className={`p-1.5 rounded-md transition-colors ${previewMode === 'desktop' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'}`}
                      title="Desktop"
                    >
                      <Monitor size={15} />
                    </button>
                    <button
                      onClick={() => setPreviewMode('mobile')}
                      className={`p-1.5 rounded-md transition-colors ${previewMode === 'mobile' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'}`}
                      title="Mobile"
                    >
                      <Smartphone size={15} />
                    </button>
                  </div>
                )}

                {generatedHtml && (
                  <>
                    <button
                      onClick={() => handleGenerate(selectedLead)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10 transition-colors"
                      disabled={generating}
                    >
                      <RefreshCw size={13} className={generating ? 'animate-spin' : ''} />
                      Gerar Novamente
                    </button>
                    <button
                      onClick={handleCopyCode}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                        copied ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-400' : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10'
                      }`}
                    >
                      {copied ? <CheckCircle size={13} /> : <Code2 size={13} />}
                      {copied ? 'Copiado!' : 'Copiar Código'}
                    </button>
                    <button
                      onClick={handleDownload}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 text-white shadow shadow-violet-500/20 transition-all"
                    >
                      <Download size={13} />
                      Baixar HTML
                    </button>
                  </>
                )}

                <button
                  onClick={handleClose}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors ml-1"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-hidden flex items-center justify-center bg-[#0a0a0e] p-4">
              {generating ? (
                /* Loading State */
                <div className="flex flex-col items-center gap-6 max-w-sm w-full">
                  <div className="relative w-20 h-20">
                    <div className="absolute inset-0 rounded-full border-2 border-purple-500/20" />
                    <div className="absolute inset-0 rounded-full border-t-2 border-purple-500 animate-spin" />
                    <div className="absolute inset-3 rounded-full border-t-2 border-blue-400 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '0.8s' }} />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Sparkles size={22} className="text-purple-400 animate-pulse" />
                    </div>
                  </div>

                  <div className="text-center space-y-1">
                    <p className="font-bold text-white text-lg">Gerando site premium...</p>
                    <p className="text-sm text-purple-300 animate-pulse">{LOADING_STEPS[loadingStep]}</p>
                  </div>

                  <div className="w-full space-y-2">
                    {LOADING_STEPS.map((step, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 transition-all duration-500 ${
                          i < loadingStep ? 'bg-emerald-500' :
                          i === loadingStep ? 'bg-purple-500 animate-pulse' :
                          'bg-white/5 border border-white/10'
                        }`}>
                          {i < loadingStep && <CheckCircle size={10} className="text-white" />}
                        </div>
                        <p className={`text-xs transition-colors duration-300 ${
                          i < loadingStep ? 'text-emerald-400' :
                          i === loadingStep ? 'text-purple-300 font-semibold' :
                          'text-gray-600'
                        }`}>{step}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : error ? (
                /* Error State */
                <div className="flex flex-col items-center gap-4 max-w-sm text-center">
                  <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                    <AlertCircle size={28} className="text-red-400" />
                  </div>
                  <div>
                    <p className="font-bold text-white text-lg mb-1">Erro ao gerar site</p>
                    <p className="text-sm text-gray-400">{error}</p>
                  </div>
                  <button
                    onClick={() => handleGenerate(selectedLead)}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 text-white text-sm font-bold hover:opacity-90 transition-opacity"
                  >
                    <RefreshCw size={15} /> Tentar Novamente
                  </button>
                </div>
              ) : generatedHtml ? (
                /* Preview */
                <div className={`h-full transition-all duration-500 ${previewMode === 'mobile' ? 'w-[390px]' : 'w-full'}`}>
                  {previewMode === 'mobile' && (
                    <div className="flex justify-center mb-2">
                      <span className="text-xs text-gray-500 bg-white/5 px-3 py-1 rounded-full border border-white/10">iPhone 15 Pro — 390px</span>
                    </div>
                  )}
                  <div className={`h-full rounded-xl overflow-hidden border border-white/10 shadow-2xl ${previewMode === 'mobile' ? 'shadow-purple-900/30' : ''}`}>
                    <iframe
                      ref={iframeRef}
                      srcDoc={generatedHtml}
                      title="Preview do Site"
                      className="w-full h-full bg-white"
                      sandbox="allow-scripts allow-same-origin"
                    />
                  </div>
                </div>
              ) : (
                <div className="text-gray-600 text-sm">Aguardando geração...</div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
