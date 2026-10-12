import React, { useState, useEffect } from 'react';
import { 
  X, Copy, Check, Sparkles, ExternalLink, RefreshCw, 
  Terminal, Globe, Layers, Eye, Smartphone, Monitor, ChevronDown, CheckCircle2, ArrowRight,
  MapPin, Phone, Star, Bot, Sliders, MessageSquare
} from 'lucide-react';

function InstagramIcon({ size = 12, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
    </svg>
  );
}

export default function BusinessPromptModal({ lead, onClose, onLeadUpdated }) {
  const [currentLead, setCurrentLead] = useState(lead);
  const [loadingPrompt, setLoadingPrompt] = useState(true);
  const [generatingAiPrompt, setGeneratingAiPrompt] = useState(false);
  const [promptData, setPromptData] = useState(null);
  const [activeArchetype, setActiveArchetype] = useState(null);
  const [editablePrompt, setEditablePrompt] = useState('');
  const [copied, setCopied] = useState(false);
  const [customDirectives, setCustomDirectives] = useState('');
  const [showDirectives, setShowDirectives] = useState(false);
  const [isAiGenerated, setIsAiGenerated] = useState(false);
  
  // Stitch Generation State
  const [generatingStitch, setGeneratingStitch] = useState(false);
  const [stitchSuccess, setStitchSuccess] = useState(false);
  const [stitchResult, setStitchResult] = useState(null);
  const [stitchError, setStitchError] = useState('');
  
  // Active View Tab: 'prompt' | 'preview'
  const [activeTab, setActiveTab] = useState('prompt');

  useEffect(() => {
    fetchBusinessPrompt(null, false);
  }, [lead?.id]);

  const fetchBusinessPrompt = async (archetypeOverride = null, useAi = true, directives = customDirectives) => {
    if (useAi) setGeneratingAiPrompt(true);
    else setLoadingPrompt(true);

    try {
      const token = localStorage.getItem('sdr_jwt_token') || localStorage.getItem('token');
      const res = await fetch(`/api/leads/${lead.id}/business-prompt`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ 
          archetypeOverride, 
          customDirectives: directives,
          useAi
        })
      });
      const data = await res.json();
      if (data.success) {
        setPromptData(data);
        setActiveArchetype(data.archetypeKey);
        setEditablePrompt(data.prompt);
        setIsAiGenerated(Boolean(data.isAiGenerated));
        if (data.lead) setCurrentLead(data.lead);
      }
    } catch (e) {
      console.error('Erro ao buscar prompt do negócio:', e);
    } finally {
      setLoadingPrompt(false);
      setGeneratingAiPrompt(false);
    }
  };

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(editablePrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleGenerateWithStitch = async () => {
    setGeneratingStitch(true);
    setStitchError('');
    setStitchSuccess(false);

    try {
      const token = localStorage.getItem('sdr_jwt_token') || localStorage.getItem('token');
      const res = await fetch('/api/stitch/generate-site', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          leadId: currentLead.id,
          customPrompt: editablePrompt,
          archetypeId: activeArchetype
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Erro na geração via Google Stitch');
      }

      setStitchSuccess(true);
      setStitchResult(data);
      setCurrentLead(data.lead);
      if (onLeadUpdated) onLeadUpdated(data.lead);
      setActiveTab('preview');
    } catch (err) {
      console.error('Erro ao gerar com Stitch:', err);
      setStitchError(err.message);
    } finally {
      setGeneratingStitch(false);
    }
  };

  const archetypeInfo = promptData?.archetype || {};
  const hasHtml = Boolean(currentLead?.siteHtml || stitchResult?.html);
  const previewHtml = currentLead?.siteHtml || stitchResult?.html || '';

  // Formatação dos dados reais do estabelecimento
  const cleanPhone = currentLead?.whatsapp ? currentLead.whatsapp.replace(/\D/g, '') : '';
  const displayPhone = cleanPhone ? (cleanPhone.startsWith('55') ? cleanPhone.slice(2) : cleanPhone) : 'Não informado';
  const displayAddress = currentLead?.endereco || currentLead?.address || (currentLead?.cidade ? `${currentLead.cidade}, Brasil` : 'Localização não informada');
  const displayInstagram = currentLead?.instagram 
    ? (currentLead.instagram.startsWith('@') ? currentLead.instagram : `@${currentLead.instagram}`) 
    : `@${(currentLead?.nome || 'empresa').toLowerCase().replace(/[^a-z0-9]/g, '')}`;

  return (
    <div className="fixed inset-0 z-[10000] bg-black/85 backdrop-blur-md flex items-center justify-center p-3 md:p-6 animate-fade-in">
      <div className="bg-[#101015] border border-white/15 rounded-3xl w-full max-w-5xl h-[94vh] flex flex-col overflow-hidden shadow-2xl shadow-purple-950/30">
        
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-3.5 border-b border-white/10 bg-[#14141c] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-500/20 via-purple-500/20 to-blue-500/20 border border-purple-500/30 flex items-center justify-center text-xl shadow-lg">
              {archetypeInfo.icon || '✨'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base text-white truncate max-w-xs md:max-w-md">
                  {currentLead?.nome || 'Empresa'}
                </h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-bold border border-purple-500/30 flex items-center gap-1">
                  <Star size={10} className="fill-purple-400 text-purple-400" />
                  ★ {currentLead?.nota || '4.9'} ({currentLead?.reviews || 0} reviews)
                </span>
                {isAiGenerated && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30 flex items-center gap-1">
                    <Sparkles size={10} /> ChatGPT Ativo
                  </span>
                )}
              </div>

              {/* Informações Reais Extraídas do Estabelecimento */}
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-[11px] text-gray-400">
                <span className="flex items-center gap-1 text-gray-300" title="Endereço exato">
                  <MapPin size={11} className="text-red-400 shrink-0" />
                  <span className="truncate max-w-[220px]">{displayAddress}</span>
                </span>
                <span className="flex items-center gap-1 text-gray-300" title="WhatsApp para pedidos e contato">
                  <Phone size={11} className="text-emerald-400 shrink-0" />
                  <span>{displayPhone}</span>
                </span>
                <span className="flex items-center gap-1 text-gray-300" title="Instagram oficial">
                  <InstagramIcon size={11} className="text-pink-400 shrink-0" />
                  <span>{displayInstagram}</span>
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* View Switcher if site exists */}
            {hasHtml && (
              <div className="flex bg-black/40 border border-white/10 rounded-xl p-1 mr-2">
                <button
                  onClick={() => setActiveTab('prompt')}
                  className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${activeTab === 'prompt' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'}`}
                >
                  Prompt
                </button>
                <button
                  onClick={() => setActiveTab('preview')}
                  className={`px-3 py-1 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${activeTab === 'preview' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'}`}
                >
                  <Eye size={13} /> Ver Site
                </button>
              </div>
            )}

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Content Area */}
        {activeTab === 'prompt' ? (
          <div className="flex-1 flex flex-col p-5 md:p-6 overflow-y-auto custom-scrollbar space-y-4 bg-[#0c0c10]">
            
            {/* Archetype Banner */}
            <div className="bg-gradient-to-r from-purple-900/30 via-indigo-900/20 to-blue-900/30 border border-purple-500/30 rounded-2xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-lg">
              <div className="flex items-start gap-3">
                <span className="text-3xl">{archetypeInfo.icon || '🚀'}</span>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-purple-400">
                      Arquétipo de Conversão
                    </span>
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-bold border border-emerald-500/30 flex items-center gap-1">
                      <Sparkles size={10} /> 100% Anti-Genérico (ChatGPT)
                    </span>
                  </div>
                  <h4 className="font-extrabold text-sm text-white mt-0.5">
                    {archetypeInfo.title || 'Demonstração Especializada'}
                  </h4>
                  <p className="text-xs text-gray-300 mt-1 max-w-xl leading-relaxed">
                    {archetypeInfo.description}
                  </p>
                </div>
              </div>

              {/* Selector to change archetype if needed */}
              {promptData?.allArchetypes && (
                <div className="shrink-0 w-full md:w-auto">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
                    Trocar Nicho / Modelo:
                  </label>
                  <select
                    value={activeArchetype || ''}
                    onChange={(e) => {
                      const newArch = e.target.value;
                      setActiveArchetype(newArch);
                      fetchBusinessPrompt(newArch, false);
                    }}
                    className="w-full md:w-64 bg-black/60 border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                  >
                    {promptData.allArchetypes.map(a => (
                      <option key={a.id} value={a.id}>
                        {a.icon} {a.title}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* Custom Directives Accordion (Optional details for AI) */}
            <div className="border border-white/10 rounded-2xl bg-white/[0.02] overflow-hidden">
              <button
                onClick={() => setShowDirectives(!showDirectives)}
                className="w-full px-4 py-2.5 flex items-center justify-between text-xs text-gray-300 hover:text-white hover:bg-white/5 transition-all text-left cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <Sliders size={13} className="text-purple-400" />
                  <span className="font-bold">Adicionar Instruções Específicas para o ChatGPT</span>
                  {customDirectives && (
                    <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse"></span>
                  )}
                </div>
                <ChevronDown size={14} className={`transform transition-transform ${showDirectives ? 'rotate-180' : ''}`} />
              </button>

              {showDirectives && (
                <div className="p-4 border-t border-white/5 bg-black/40 space-y-2">
                  <p className="text-[11px] text-gray-400">
                    Insira pedidos específicos do negócio (ex: "Criar combo família por R$ 59,90", "Destacar promoção de inauguração", "Incluir link do iFood"):
                  </p>
                  <textarea
                    value={customDirectives}
                    onChange={(e) => setCustomDirectives(e.target.value)}
                    placeholder="Ex: Destacar o Smash Especial da Casa por R$ 34,90, acrescentar taxa de entrega grátis acima de R$ 60 e colocar o link do Instagram no Hero..."
                    className="w-full p-3 bg-black/80 border border-white/10 rounded-xl text-xs text-gray-200 focus:outline-none focus:border-purple-500/60 resize-none h-20"
                  />
                  <div className="flex justify-end">
                    <button
                      onClick={() => fetchBusinessPrompt(activeArchetype, true, customDirectives)}
                      disabled={generatingAiPrompt}
                      className="px-4 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                    >
                      {generatingAiPrompt ? <RefreshCw size={12} className="animate-spin" /> : <Sparkles size={12} />}
                      Aplicar e Regenerar com IA
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Actions Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-white/5 border border-white/10 rounded-2xl p-3.5">
              <div className="flex flex-wrap items-center gap-2">
                {/* ChatGPT AI Regenerate Button */}
                <button
                  onClick={() => fetchBusinessPrompt(activeArchetype, true)}
                  disabled={generatingAiPrompt}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-extrabold shadow-lg shadow-emerald-900/30 transition-all cursor-pointer disabled:opacity-50"
                  title="Gera o prompt mestre do negócio 100% com ChatGPT, contendo todos os dados reais e itens de nicho"
                >
                  {generatingAiPrompt ? (
                    <RefreshCw size={15} className="animate-spin text-white" />
                  ) : (
                    <Bot size={15} className="text-white" />
                  )}
                  <span>{generatingAiPrompt ? 'ChatGPT Criando Prompt...' : '🤖 Gerar com ChatGPT (IA)'}</span>
                </button>

                {/* Google Stitch MCP Button */}
                <button
                  onClick={handleGenerateWithStitch}
                  disabled={generatingStitch || generatingAiPrompt}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/40 text-amber-300 hover:bg-amber-500/30 text-xs font-bold transition-all disabled:opacity-50 cursor-pointer"
                  title="Gera a tela no Google Stitch MCP e salva o HTML de alta fidelidade"
                >
                  {generatingStitch ? (
                    <RefreshCw size={15} className="animate-spin text-amber-400" />
                  ) : (
                    <Sparkles size={15} className="text-amber-400" />
                  )}
                  <span>{generatingStitch ? 'Stitch MCP Gerando...' : '⚡ Gerar com Google Stitch AI'}</span>
                </button>

                {/* Copy Prompt Button */}
                <button
                  onClick={handleCopyPrompt}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                    copied 
                      ? 'bg-purple-600 text-white shadow-purple-600/30 scale-105'
                      : 'bg-white/10 hover:bg-white/15 text-gray-200 border border-white/10'
                  }`}
                >
                  {copied ? <Check size={15} className="text-emerald-300" /> : <Copy size={15} />}
                  <span>{copied ? '✓ Prompt Copiado!' : 'Copiar Prompt'}</span>
                </button>
              </div>

              {/* Fast links to external AI tools */}
              <div className="flex items-center gap-1.5 text-xs text-gray-400">
                <span className="text-[11px] font-semibold text-gray-500 mr-1">Abrir em:</span>
                <a
                  href="https://chatgpt.com"
                  target="_blank"
                  rel="noreferrer"
                  className="px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 hover:text-white text-[11px] flex items-center gap-1 font-bold"
                >
                  ChatGPT <ExternalLink size={10} />
                </a>
                <a
                  href="https://claude.ai/new"
                  target="_blank"
                  rel="noreferrer"
                  className="px-2.5 py-1 rounded-lg bg-black/40 border border-white/10 hover:border-purple-500/40 text-gray-300 hover:text-white text-[11px] flex items-center gap-1"
                >
                  Claude <ExternalLink size={10} />
                </a>
                <a
                  href="https://v0.dev"
                  target="_blank"
                  rel="noreferrer"
                  className="px-2.5 py-1 rounded-lg bg-black/40 border border-white/10 hover:border-cyan-500/40 text-gray-300 hover:text-white text-[11px] flex items-center gap-1"
                >
                  v0.dev <ExternalLink size={10} />
                </a>
                <a
                  href="https://stitch.withgoogle.com"
                  target="_blank"
                  rel="noreferrer"
                  className="px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 hover:text-amber-200 text-[11px] flex items-center gap-1 font-bold"
                >
                  Stitch <ExternalLink size={10} />
                </a>
              </div>
            </div>

            {/* Error or Success notification */}
            {stitchError && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs font-semibold">
                ⚠️ {stitchError}
              </div>
            )}
            {stitchSuccess && (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-300 text-xs font-semibold flex items-center justify-between">
                <span>✨ Site gerado pelo Google Stitch com sucesso!</span>
                <button
                  onClick={() => setActiveTab('preview')}
                  className="underline font-bold text-white ml-2 cursor-pointer"
                >
                  Ver Demonstração &rarr;
                </button>
              </div>
            )}

            {/* Prompt Text Viewer & Editor */}
            <div className="flex-1 flex flex-col space-y-2 min-h-[350px]">
              <div className="flex items-center justify-between text-xs text-gray-400">
                <span className="font-bold flex items-center gap-1.5 text-gray-200">
                  <Terminal size={14} className="text-purple-400" />
                  Prompt Mestre & Especificação PRD do Negócio
                  {isAiGenerated ? (
                    <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold ml-1.5">
                      ✓ Criado com ChatGPT (IA)
                    </span>
                  ) : (
                    <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 font-bold ml-1.5 flex items-center gap-1">
                      <Sparkles size={10} className="text-purple-300" /> PRD Enterprise (28 Seções · R$ 90.000)
                    </span>
                  )}
                </span>
                <span className="text-[11px] text-gray-400 font-mono">
                  {editablePrompt.length} caracteres · Rolagem completa habilitada
                </span>
              </div>

              {loadingPrompt ? (
                <div className="flex-1 flex flex-col items-center justify-center p-12 bg-black/60 border border-purple-500/30 rounded-2xl shadow-inner">
                  <RefreshCw size={24} className="animate-spin text-purple-400 mb-3" />
                  <p className="text-xs text-gray-200 font-bold">Carregando Especificação PRD de Alta Fidelidade...</p>
                  <p className="text-[11px] text-gray-500 mt-1">Carregando as 28 seções arquiteturais com regras reais de negócio...</p>
                </div>
              ) : (
                <div className="flex-1 relative flex flex-col">
                  <textarea
                    value={editablePrompt}
                    onChange={(e) => setEditablePrompt(e.target.value)}
                    className="flex-1 w-full p-4 bg-black/80 border border-purple-500/30 hover:border-purple-500/50 rounded-2xl text-xs text-gray-100 font-mono leading-relaxed focus:outline-none focus:border-purple-400 shadow-2xl resize-none custom-scrollbar"
                    placeholder="Carregando prompt estruturado..."
                  />
                  <div className="absolute bottom-3 right-4 flex items-center gap-2 pointer-events-none">
                    <span className="text-[10px] px-2 py-0.5 rounded-md bg-purple-950/80 text-purple-300 border border-purple-500/30 backdrop-blur-sm">
                      Role para ver todas as 28 seções ↕
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Live Site Preview Area */
          <div className="flex-1 flex flex-col p-4 bg-[#0a0a0d] overflow-hidden">
            <div className="flex items-center justify-between mb-3 px-2">
              <div className="flex items-center gap-2 text-xs text-gray-300">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Site de Demonstração para <strong>{currentLead?.nome}</strong></span>
                {currentLead?.siteData?.generatedBy === 'google_stitch_mcp' && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold">
                    ⚡ Gerado via Google Stitch MCP
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={`/preview/${currentLead?.id}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-600/30 hover:bg-purple-600/50 border border-purple-500/30 text-purple-300 text-xs font-bold transition-all"
                >
                  <ExternalLink size={12} /> Abrir em Nova Aba
                </a>
              </div>
            </div>

            <div className="flex-1 rounded-2xl overflow-hidden border border-white/10 bg-white shadow-2xl">
              <iframe
                srcDoc={previewHtml}
                title="Prévia do Site"
                className="w-full h-full border-0"
              />
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
