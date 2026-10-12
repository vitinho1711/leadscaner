import React, { useState, useEffect, useRef } from 'react';
import { 
  X, Monitor, Tablet, Smartphone, Sparkles, RefreshCw, Edit3, 
  FileText, Link2, Download, ExternalLink, CheckCircle2, ChevronDown,
  Code, Copy, Check, Terminal, Sliders, Layers, Palette, Crown, Zap, BookOpen 
} from 'lucide-react';
import SiteEditorPanel from './SiteEditorPanel';
import ProposalPdfModal from './ProposalPdfModal';
import BusinessPromptModal from './BusinessPromptModal';

const ANALYSIS_STEPS = [
  'Analisando empresa e presença digital...',
  'Identificando nicho e público-alvo...',
  'Analisando serviços e diferenciais no Google Maps...',
  'Aplicando framework oficial de Frontend Design (Anthropic)...',
  'Definindo paleta com tokens deliberados e showstopper autoral...',
  'Eliminando clichês de templates e cartões repetidos...',
  'Escrevendo copy estratégica em voz ativa (PT-BR)...',
  'Desenvolvendo layout responsivo moderno com Tailwind CSS...',
  'Otimizando botão flutuante e conversão para WhatsApp...',
  'Finalizando validação do site autoral de alto padrão...'
];

export const DESIGN_SKILLS = [
  { 
    id: 'frontend_design', 
    label: '✨ Anthropic Frontend Design', 
    badge: 'Autoral & Anti-AI', 
    desc: 'Design autoral de estúdio, showstopper exclusivo, paleta com tokens deliberados e zero cartões SaaS repetidos',
    tag: 'Recomendado',
    color: 'from-purple-500/20 to-indigo-500/20 text-purple-300 border-purple-500/30'
  },
  { 
    id: 'ui_ux_pro_max', 
    label: '⚡ UI/UX Pro Max', 
    badge: 'Design Intelligence', 
    desc: 'Glassmorphism moderno, micro-interações, grid fluido, bento dinâmico e simulador interativo de atendimento',
    tag: 'Tech & Interativo',
    color: 'from-cyan-500/20 to-blue-500/20 text-cyan-300 border-cyan-500/30'
  },
  { 
    id: 'redesign_premium', 
    label: '👑 Redesign Premium & Luxo', 
    badge: 'Alto Ticket & Ouro', 
    desc: 'Autoridade de alto ticket, ouro champagne, medalha do Google Maps em destaque e concierge VIP',
    tag: 'Clínicas & Luxo',
    color: 'from-amber-500/20 to-yellow-500/20 text-amber-300 border-amber-500/30'
  },
  { 
    id: 'minimalista_editorial', 
    label: '🌿 Editorial Boutique & Craft', 
    badge: 'Revista & Tipografia', 
    desc: 'Espaço negativo generoso, tipografia serifada nobre, estilo ateliê autoral e elegância atemporal',
    tag: 'Boutique & Gastronomia',
    color: 'from-emerald-500/20 to-teal-500/20 text-emerald-300 border-emerald-500/30'
  },
  { 
    id: 'vendas_agressivo', 
    label: '🔥 Direct Response & Vendas', 
    badge: 'Alta Conversão', 
    desc: 'Gatilhos de urgência ética, tabela comparativa, prova social ostensiva e botão de ação rápida',
    tag: 'Serviços & Reparos',
    color: 'from-red-500/20 to-orange-500/20 text-red-300 border-red-500/30'
  },
  { 
    id: 'moderno', 
    label: '🚀 Modern Split & Clean', 
    badge: 'Corporativo & Clean', 
    desc: 'Visual moderno fluido, hero dividido e foco em usabilidade e agendamento instantâneo',
    tag: 'Geral',
    color: 'from-blue-500/20 to-slate-500/20 text-blue-300 border-blue-500/30'
  }
];

export const CREATIVE_DIRECTIONS = DESIGN_SKILLS;

export default function SiteBuilderModal({ lead, onClose, onLeadUpdated }) {
  const [currentLead, setCurrentLead] = useState(lead);
  const [generatedHtml, setGeneratedHtml] = useState(lead?.siteHtml || '');
  const [generating, setGenerating] = useState(!lead?.siteHtml);
  const [activeSkillId, setActiveSkillId] = useState(lead?.siteData?.creativeDirection || 'frontend_design');
  const [showSkillsModal, setShowSkillsModal] = useState(false);
  const [customSkillDirectives, setCustomSkillDirectives] = useState('');
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [deviceMode, setDeviceMode] = useState('desktop'); // 'desktop' | 'tablet' | 'mobile'
  const [showEditor, setShowEditor] = useState(false);
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [showPromptModal, setShowPromptModal] = useState(false);
  const [strategicPrompt, setStrategicPrompt] = useState(lead?.sitePrompt || '');
  const [loadingPrompt, setLoadingPrompt] = useState(false);
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [showRegenMenu, setShowRegenMenu] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const iframeRef = useRef(null);
  const stepTimerRef = useRef(null);

  // Inicia a geração ou carrega o site existente sob demanda
  useEffect(() => {
    const isCompleteHtml = (html) => typeof html === 'string' && html.length >= 2500 && html.includes('</body>');

    if (currentLead?.siteHtml && isCompleteHtml(currentLead.siteHtml)) {
      setGeneratedHtml(currentLead.siteHtml);
      setGenerating(false);
      return;
    }

    if (currentLead?.hasSiteHtml || currentLead?.siteStatus === 'SITE_GERADO' || currentLead?.siteHtml) {
      setGenerating(true);
      fetch(`/preview/${currentLead.id}`)
        .then(async (res) => {
          if (res.ok) {
            const html = await res.text();
            if (isCompleteHtml(html) && !html.includes('Projeto Não Encontrado')) {
              setGeneratedHtml(html);
              setCurrentLead(prev => ({ ...prev, siteHtml: html }));
              setGenerating(false);
              return;
            }
          }
          handleGenerateSite(activeSkillId || 'frontend_design');
        })
        .catch(() => {
          handleGenerateSite(activeSkillId || 'frontend_design');
        });
    } else {
      handleGenerateSite(activeSkillId || 'frontend_design');
    }
  }, []);

  const startAnalysisProgress = () => {
    setCurrentStepIndex(0);
    let index = 0;
    clearInterval(stepTimerRef.current);
    stepTimerRef.current = setInterval(() => {
      index++;
      if (index < ANALYSIS_STEPS.length) {
        setCurrentStepIndex(index);
      } else {
        clearInterval(stepTimerRef.current);
      }
    }, 700);
  };

  const fetchStrategicPrompt = async (direction = 'frontend_design', directives = '') => {
    setLoadingPrompt(true);
    try {
      const token = localStorage.getItem('sdr_jwt_token') || localStorage.getItem('token');
      const res = await fetch('/api/site-builder/generate-prompt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          leadId: currentLead.id,
          creativeDirection: direction,
          customDirectives: directives || customSkillDirectives
        })
      });
      const data = await res.json();
      if (data.prompt) {
        setStrategicPrompt(data.prompt);
      }
    } catch (e) {
      console.error('Erro ao buscar prompt estratégico:', e);
    } finally {
      setLoadingPrompt(false);
    }
  };

  const handleGenerateSite = async (direction = 'frontend_design', customPrompt = null, directives = '') => {
    setGenerating(true);
    setErrorMsg('');
    setActiveSkillId(direction);
    startAnalysisProgress();

    try {
      const token = localStorage.getItem('sdr_jwt_token') || localStorage.getItem('token');
      const res = await fetch('/api/site-builder/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          leadId: currentLead.id,
          creativeDirection: direction,
          customPrompt: customPrompt || strategicPrompt,
          customDirectives: directives || customSkillDirectives
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Falha ao processar site');
      }

      setGeneratedHtml(data.html);
      setCurrentLead(data.lead);
      if (data.prompt) setStrategicPrompt(data.prompt);
      if (onLeadUpdated) onLeadUpdated(data.lead);
    } catch (e) {
      console.error(e);
      setErrorMsg(e.message || 'Erro ao gerar o site.');
    } finally {
      clearInterval(stepTimerRef.current);
      setGenerating(false);
    }
  };

  const handleRegenerate = async (direction, customPrompt = null, directives = '') => {
    setShowRegenMenu(false);
    setGenerating(true);
    setErrorMsg('');
    setActiveSkillId(direction);
    startAnalysisProgress();

    try {
      const token = localStorage.getItem('sdr_jwt_token') || localStorage.getItem('token');
      const res = await fetch('/api/site-builder/regenerate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          leadId: currentLead.id,
          creativeDirection: direction,
          customPrompt: customPrompt || strategicPrompt,
          customDirectives: directives || customSkillDirectives
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Falha ao regenerar');
      }

      setGeneratedHtml(data.html);
      setCurrentLead(data.lead);
      if (data.prompt) setStrategicPrompt(data.prompt);
      if (onLeadUpdated) onLeadUpdated(data.lead);
    } catch (e) {
      setErrorMsg(e.message);
    } finally {
      clearInterval(stepTimerRef.current);
      setGenerating(false);
    }
  };

  const handleSaveOverrides = async (overrides, siteStatus) => {
    try {
      const token = localStorage.getItem('sdr_jwt_token') || localStorage.getItem('token');
      // Re-gera o site localmente com os novos overrides
      const res = await fetch('/api/site-builder/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          leadId: currentLead.id,
          creativeDirection: currentLead.siteData?.creativeDirection || 'moderno',
          customOverrides: overrides
        })
      });

      const data = await res.json();
      if (data.success) {
        setGeneratedHtml(data.html);
        setCurrentLead(data.lead);
        if (onLeadUpdated) onLeadUpdated(data.lead);
      }
    } catch (err) {
      console.error('Erro ao salvar edições:', err);
    }
  };

  const handleCopyPublicLink = () => {
    const url = `${window.location.origin}/preview/${currentLead.id}`;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleDownloadHtml = () => {
    const blob = new Blob([generatedHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `site-${(currentLead?.nome || 'lead').toLowerCase().replace(/\s+/g, '-')}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleOpenExternal = () => {
    window.open(`/preview/${currentLead.id}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-black/90 backdrop-blur-md flex flex-col overflow-hidden text-white font-sans">
      {/* Top Header Toolbar */}
      <header className="h-16 bg-[#0f0f13] border-b border-white/10 px-6 flex items-center justify-between z-30 shrink-0 select-none">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center shadow-lg">
              <Sparkles size={16} className="text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-white truncate max-w-[240px]" title={currentLead?.nome}>
                  {currentLead?.nome || 'Empresa'}
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  {currentLead?.nicho || 'Serviços'}
                </span>
                {currentLead?.siteData?.generatedBy && (
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                    currentLead.siteData.generatedBy.includes('gemini')
                      ? 'bg-blue-500/15 border-blue-500/30 text-blue-300 shadow-[0_0_10px_rgba(59,130,246,0.2)]'
                      : currentLead.siteData.generatedBy.includes('groq')
                      ? 'bg-amber-500/15 border-amber-500/30 text-amber-300 shadow-[0_0_10px_rgba(245,158,11,0.2)]'
                      : currentLead.siteData.generatedBy.includes('chatgpt') || currentLead.siteData.generatedBy.includes('openai')
                      ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300 shadow-[0_0_10px_rgba(16,185,129,0.2)]'
                      : 'bg-purple-500/15 border-purple-500/30 text-purple-300'
                  }`}>
                    {currentLead.siteData.generatedBy.includes('gemini')
                      ? '✨ Gemini 2.0 Flash (IA Grátis)'
                      : currentLead.siteData.generatedBy.includes('groq')
                      ? '⚡ Groq Cloud (IA Grátis)'
                      : currentLead.siteData.generatedBy.includes('chatgpt') || currentLead.siteData.generatedBy.includes('openai')
                      ? '🤖 ChatGPT (Full-Custom)'
                      : '🎨 Engine Multi-Skill'}
                  </span>
                )}
              </div>
              <p className="text-[11px] text-gray-400 truncate">{currentLead?.cidade || 'Brasil'}</p>
            </div>
          </div>
        </div>

        {/* Center: Device Switcher */}
        {!generating && (
          <div className="flex items-center bg-black/40 border border-white/10 rounded-xl p-1 gap-1">
            <button
              onClick={() => setDeviceMode('desktop')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                deviceMode === 'desktop'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Monitor size={14} /> Desktop
            </button>
            <button
              onClick={() => setDeviceMode('tablet')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                deviceMode === 'tablet'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Tablet size={14} /> Tablet
            </button>
            <button
              onClick={() => setDeviceMode('mobile')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                deviceMode === 'mobile'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Smartphone size={14} /> Celular
            </button>
          </div>
        )}

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          {!generating && (
            <>
              {/* Strategic Prompt Button */}
              <button
                onClick={() => setShowPromptModal(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-purple-500/40 bg-purple-600/15 hover:bg-purple-600/25 text-purple-300 text-xs font-semibold transition-all shadow-[0_0_12px_rgba(124,58,237,0.2)]"
                title="Visualizar prompt especializado do nicho (Cardápio, Clínica, etc.) ou gerar com Stitch"
              >
                <Sparkles size={13} className="text-purple-400" /> Prompt & Stitch IA
              </button>

              {/* Skills Hub Button */}
              <button
                onClick={() => setShowSkillsModal(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-purple-500/40 bg-purple-600/20 hover:bg-purple-600/30 text-purple-200 text-xs font-bold transition-all shadow-[0_0_15px_rgba(147,51,234,0.3)] cursor-pointer"
                title="Escolher Skill de Design e personalizar instruções"
              >
                <Layers size={13} className="text-purple-400" />
                <span>Skills de Design</span>
                <span className="text-[10px] bg-purple-500/30 border border-purple-400/40 px-1.5 py-0.5 rounded-md font-mono hidden sm:inline">
                  {DESIGN_SKILLS.find(s => s.id === activeSkillId)?.badge || 'Autoral'}
                </span>
              </button>

              {/* Edit Toggle */}
              <button
                onClick={() => setShowEditor(!showEditor)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
                  showEditor
                    ? 'border-purple-500/50 bg-purple-500/20 text-purple-300'
                    : 'border-white/10 hover:bg-white/5 text-gray-300 hover:text-white'
                }`}
              >
                <Edit3 size={13} /> Editor
              </button>

              {/* Proposal PDF Modal Button */}
              <button
                onClick={() => setShowPdfModal(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-600/20 border border-purple-500/40 text-purple-300 hover:bg-purple-600/30 text-xs font-bold transition-all shadow-sm"
              >
                <FileText size={13} /> Proposta em PDF
              </button>

              {/* Copy Link */}
              <button
                onClick={handleCopyPublicLink}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-white/10 hover:bg-white/5 text-gray-300 hover:text-white text-xs font-semibold transition-all"
                title="Copiar Link de Demonstração Pública"
              >
                <Link2 size={13} /> {copiedLink ? 'Link Copiado!' : 'Copiar Link'}
              </button>

              {/* Download HTML */}
              <button
                onClick={handleDownloadHtml}
                className="p-2 rounded-xl border border-white/10 hover:bg-white/5 text-gray-400 hover:text-white transition-all"
                title="Baixar Arquivo HTML"
              >
                <Download size={14} />
              </button>

              {/* Open in New Tab */}
              <button
                onClick={handleOpenExternal}
                className="p-2 rounded-xl border border-white/10 hover:bg-white/5 text-gray-400 hover:text-white transition-all"
                title="Abrir em Nova Aba"
              >
                <ExternalLink size={14} />
              </button>
            </>
          )}

          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-red-500/10 text-gray-400 hover:text-red-400 transition-colors ml-2"
            title="Fechar"
          >
            <X size={18} />
          </button>
        </div>
      </header>

      {/* Quick-Switch Skill Bar */}
      {!generating && (
        <div className="bg-[#0f0f14] border-b border-white/5 px-4 py-2 flex items-center justify-between gap-2 overflow-x-auto custom-scrollbar shrink-0">
          <div className="flex items-center gap-1.5 text-xs text-gray-400 font-semibold shrink-0">
            <Palette size={13} className="text-purple-400" />
            <span className="hidden sm:inline">Skill de Design:</span>
          </div>
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
            {DESIGN_SKILLS.map((skill) => {
              const isActive = (activeSkillId || 'frontend_design') === skill.id;
              return (
                <button
                  key={skill.id}
                  onClick={() => {
                    setActiveSkillId(skill.id);
                    handleRegenerate(skill.id, null, customSkillDirectives);
                  }}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                    isActive
                      ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30 border border-purple-400/50 scale-[1.02]'
                      : 'bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white border border-white/5'
                  }`}
                  title={skill.desc}
                >
                  <span>{skill.label}</span>
                </button>
              );
            })}
          </div>
          <button
            onClick={() => setShowSkillsModal(true)}
            className="text-xs text-purple-400 hover:text-purple-300 font-semibold underline shrink-0 cursor-pointer ml-1"
          >
            + Customizar
          </button>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden relative bg-[#0a0a0d]">
        {/* Generating Overlay / Visual Process */}
        {generating ? (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center shadow-[0_0_30px_rgba(124,58,237,0.5)] mb-6 animate-pulse">
              <Sparkles size={32} className="text-white animate-spin" style={{ animationDuration: '4s' }} />
            </div>

            <h3 className="text-xl font-bold text-white mb-2">Construindo Site de Alta Conversão</h3>
            <p className="text-gray-400 text-xs max-w-md mb-8">
              Nossa inteligência artificial está analisando a empresa <strong>{currentLead?.nome}</strong> para criar uma proposta exclusiva e personalizada.
            </p>

            {/* Steps Progress List */}
            <div className="w-full max-w-md bg-[#121216] border border-white/10 rounded-2xl p-5 shadow-2xl text-left space-y-2.5">
              {ANALYSIS_STEPS.map((step, idx) => {
                const isDone = idx < currentStepIndex;
                const isCurrent = idx === currentStepIndex;
                return (
                  <div
                    key={idx}
                    className={`flex items-center gap-3 text-xs transition-all duration-300 ${
                      isDone
                        ? 'text-emerald-400 font-semibold'
                        : isCurrent
                        ? 'text-purple-300 font-bold scale-[1.02]'
                        : 'text-gray-600 opacity-40'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 text-[10px] ${
                        isDone
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : isCurrent
                          ? 'bg-purple-500/30 text-purple-300 border border-purple-400'
                          : 'bg-white/5 text-gray-600'
                      }`}
                    >
                      {isDone ? '✓' : isCurrent ? '●' : '○'}
                    </div>
                    <span className="truncate">{step}</span>
                  </div>
                );
              })}
            </div>
          </div>
        ) : errorMsg ? (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
            <p className="text-red-400 font-bold mb-4">{errorMsg}</p>
            <button
              onClick={() => handleGenerateSite('moderno')}
              className="px-4 py-2 bg-purple-600 text-white rounded-xl text-xs font-bold"
            >
              Tentar Novamente
            </button>
          </div>
        ) : (
          /* Preview Canvas */
          <div className="flex-1 flex items-center justify-center p-4 md:p-6 overflow-auto custom-scrollbar">
            {deviceMode === 'desktop' && (
              <div className="w-full h-full rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-white">
                <iframe
                  ref={iframeRef}
                  srcDoc={generatedHtml}
                  title="Site Preview"
                  className="w-full h-full border-0"
                />
              </div>
            )}

            {deviceMode === 'tablet' && (
              <div className="w-[768px] h-[95%] rounded-3xl overflow-hidden shadow-2xl border-[10px] border-[#1e1e24] bg-white flex flex-col">
                <div className="h-6 bg-[#1e1e24] flex items-center justify-center">
                  <div className="w-12 h-1.5 bg-gray-600 rounded-full" />
                </div>
                <iframe
                  ref={iframeRef}
                  srcDoc={generatedHtml}
                  title="Tablet Preview"
                  className="w-full flex-1 border-0"
                />
              </div>
            )}

            {deviceMode === 'mobile' && (
              <div className="w-[390px] h-[780px] max-h-[96%] rounded-[44px] overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.6)] border-[12px] border-[#18181f] bg-white flex flex-col relative">
                {/* iPhone Dynamic Island / Speaker Notch */}
                <div className="h-7 bg-[#18181f] flex items-center justify-center shrink-0">
                  <div className="w-20 h-4 bg-black rounded-full" />
                </div>
                <iframe
                  ref={iframeRef}
                  srcDoc={generatedHtml}
                  title="Mobile Preview"
                  className="w-full flex-1 border-0"
                />
                {/* Home Indicator */}
                <div className="h-4 bg-white flex items-center justify-center shrink-0">
                  <div className="w-24 h-1 bg-gray-400 rounded-full" />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Side Panel Editor */}
        {showEditor && !generating && (
          <SiteEditorPanel
            lead={currentLead}
            onSave={handleSaveOverrides}
            onClose={() => setShowEditor(false)}
          />
        )}
      </div>

      {/* PDF Commercial Proposal Modal */}
      {showPdfModal && (
        <ProposalPdfModal
          lead={currentLead}
          onClose={() => setShowPdfModal(false)}
        />
      )}

      {/* Central de Skills de Design & Criação Autoral */}
      {showSkillsModal && (
        <div className="fixed inset-0 z-[10001] bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-[#121217] border border-white/15 rounded-3xl p-6 max-w-3xl w-full shadow-2xl flex flex-col max-h-[90vh] space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <h3 className="font-extrabold text-base text-white flex items-center gap-2">
                  <Layers size={18} className="text-purple-400" />
                  Central de Skills de Design & Criação Autoral
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  Escolha a metodologia e arquitetura de design que melhor se adapta à empresa <strong className="text-white">{currentLead?.nome}</strong> em {currentLead?.cidade}.
                </p>
              </div>
              <button
                onClick={() => setShowSkillsModal(false)}
                className="text-gray-400 hover:text-white p-1.5 rounded-xl hover:bg-white/10"
              >
                <X size={18} />
              </button>
            </div>

            {/* Skills Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[46vh] overflow-y-auto custom-scrollbar p-0.5">
              {DESIGN_SKILLS.map((skill) => {
                const isSelected = activeSkillId === skill.id;
                return (
                  <div
                    key={skill.id}
                    onClick={() => setActiveSkillId(skill.id)}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'bg-purple-600/15 border-purple-500 text-white shadow-[0_0_20px_rgba(147,51,234,0.25)]'
                        : 'bg-white/[0.02] hover:bg-white/[0.06] border-white/10 text-gray-300'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-bold text-sm text-white flex items-center gap-1.5">
                          {skill.label}
                        </span>
                        <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border bg-gradient-to-r ${skill.color}`}>
                          {skill.tag}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400 leading-relaxed">{skill.desc}</p>
                    </div>
                    <div className="mt-3 flex items-center justify-between text-[11px] font-semibold pt-2 border-t border-white/5">
                      <span className="text-gray-500">Arquétipo: {skill.badge}</span>
                      <span className={isSelected ? 'text-purple-300 font-bold' : 'text-gray-400'}>
                        {isSelected ? '● Selecionada' : 'Selecionar'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Custom Instructions / Prompts */}
            <div className="space-y-1.5 pt-2 border-t border-white/10">
              <label className="text-xs font-bold text-gray-200 flex items-center justify-between">
                <span>Instruções e Personalização da Empresa (Opcional)</span>
                <span className="text-[11px] font-normal text-purple-400">Prioridade Máxima na IA</span>
              </label>
              <textarea
                value={customSkillDirectives}
                onChange={(e) => setCustomSkillDirectives(e.target.value)}
                placeholder="Ex: Quero um visual mais escuro com detalhes em ouro champanhe, dar ênfase no serviço de Clareamento a Laser e adicionar uma seção de perguntas frequentes sobre parcelamento..."
                className="w-full h-20 p-3 bg-black/50 border border-white/10 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/60 resize-none leading-relaxed"
              />
            </div>

            {/* Bottom Actions */}
            <div className="flex items-center justify-between pt-2 border-t border-white/10">
              <button
                onClick={() => {
                  setShowSkillsModal(false);
                  fetchStrategicPrompt(activeSkillId, customSkillDirectives);
                  setShowPromptModal(true);
                }}
                className="flex items-center gap-1.5 text-xs text-purple-400 hover:text-purple-300 font-semibold cursor-pointer"
              >
                <Code size={13} />
                <span>Ver Prompt Completo da Skill</span>
              </button>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowSkillsModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-400 hover:text-white hover:bg-white/5"
                >
                  Fechar
                </button>
                <button
                  onClick={() => {
                    setShowSkillsModal(false);
                    handleRegenerate(activeSkillId, null, customSkillDirectives);
                  }}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-extrabold shadow-[0_0_25px_rgba(147,51,234,0.4)] transition-all cursor-pointer hover:scale-[1.02]"
                >
                  <Sparkles size={14} />
                  <span>Aplicar Skill & Gerar Novo Site</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Visualizador e Gerador de Prompt Especializado & Google Stitch */}
      {showPromptModal && (
        <BusinessPromptModal
          lead={currentLead}
          onClose={() => setShowPromptModal(false)}
          onLeadUpdated={(updated) => {
            setCurrentLead(updated);
            if (updated.siteHtml) {
              setGeneratedHtml(updated.siteHtml);
            }
            if (onLeadUpdated) onLeadUpdated(updated);
          }}
        />
      )}
    </div>
  );
}
