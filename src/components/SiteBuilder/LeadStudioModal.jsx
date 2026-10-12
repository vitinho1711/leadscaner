import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowLeft, SlidersHorizontal, Images, Palette, History, 
  Send, Paperclip, ThumbsUp, ThumbsDown, Monitor, Smartphone, 
  ExternalLink, Sparkles, Check, Copy, Download, RefreshCw,
  RotateCcw, RotateCw, Wand2, FileText, Phone, CheckCircle2,
  X, MessageSquare, Edit3, Layers, Zap
} from 'lucide-react';
import StudioThemeModal from './StudioThemeModal';
import StudioAssetsModal from './StudioAssetsModal';
import StudioInstructionsModal from './StudioInstructionsModal';
import StudioHistoryModal from './StudioHistoryModal';
import ProposalPdfModal from './ProposalPdfModal';

export default function LeadStudioModal({ lead, onClose, onLeadUpdated }) {
  const [currentLead, setCurrentLead] = useState(lead);
  const [generatedHtml, setGeneratedHtml] = useState(lead?.siteHtml || '');
  const [generating, setGenerating] = useState(!lead?.siteHtml);
  const [deviceMode, setDeviceMode] = useState('desktop'); // 'desktop' | 'mobile'
  const [directEditMode, setDirectEditMode] = useState(false);
  const [animatedHero, setAnimatedHero] = useState(true);

  // Chat Copilot State
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      sender: 'assistant',
      text: `Construí o site de alta conversão para ${lead?.nome || 'sua empresa'} com base nas avaliações e dados do Google Maps. Peça qualquer ajuste pelo chat ou use o modo "Editar direto".`,
      timestamp: new Date()
    }
  ]);
  const [inputPrompt, setInputPrompt] = useState('');
  const [isRefining, setIsRefining] = useState(false);
  const [selectedElement, setSelectedElement] = useState(null);

  // Modals state
  const [showThemeModal, setShowThemeModal] = useState(false);
  const [showAssetsModal, setShowAssetsModal] = useState(false);
  const [showInstructionsModal, setShowInstructionsModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [showPublishModal, setShowPublishModal] = useState(false);

  // Feedback states
  const [copiedLink, setCopiedLink] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [companyName, setCompanyName] = useState(lead?.nome || 'Empresa');

  const iframeRef = useRef(null);
  const chatEndRef = useRef(null);

  // Auto-scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isRefining]);

  // Carrega ou gera o site inicial
  useEffect(() => {
    if (currentLead?.siteHtml && currentLead.siteHtml.length > 2000) {
      setGeneratedHtml(currentLead.siteHtml);
      setGenerating(false);
      return;
    }

    handleInitialGenerate();
  }, []);

  const handleInitialGenerate = async () => {
    setGenerating(true);
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
          creativeDirection: 'frontend_design'
        })
      });
      const data = await res.json();
      if (data.success && data.html) {
        setGeneratedHtml(data.html);
        setCurrentLead(data.lead);
        if (onLeadUpdated) onLeadUpdated(data.lead);
      }
    } catch (e) {
      console.error('Erro na geração inicial:', e);
    } finally {
      setGenerating(false);
    }
  };

  // Injeta script interativo no iframe para suportar o modo "Editar Direto"
  const getInteractiveHtml = () => {
    if (!generatedHtml) return '';
    const scriptTag = `
      <style>
        .__sk_hi { outline: 2px solid #3b82f6 !important; outline-offset: 2px !important; cursor: pointer !important; transition: outline 0.15s ease !important; }
        .__sk_selected { outline: 2px solid #a855f7 !important; outline-offset: 3px !important; }
      </style>
      <script>
        (function() {
          var isDirectEdit = ${directEditMode ? 'true' : 'false'};
          var selectedEl = null;

          document.addEventListener('mouseover', function(e) {
            if (!isDirectEdit) return;
            var target = e.target.closest('h1, h2, h3, p, a, button, img, section, div[class*="hero"], div[class*="card"]') || e.target;
            if (target && target !== document.body) {
              document.querySelectorAll('.__sk_hi').forEach(function(el) { el.classList.remove('__sk_hi'); });
              target.classList.add('__sk_hi');
            }
          }, true);

          document.addEventListener('mouseout', function(e) {
            if (e.target && e.target.classList) {
              e.target.classList.remove('__sk_hi');
            }
          }, true);

          document.addEventListener('click', function(e) {
            if (!isDirectEdit) return;
            e.preventDefault();
            e.stopPropagation();

            var target = e.target.closest('h1, h2, h3, p, a, button, img, section') || e.target;
            if (!target || target === document.body) return;

            document.querySelectorAll('.__sk_selected').forEach(function(el) { el.classList.remove('__sk_selected'); });
            target.classList.add('__sk_selected');

            var textContent = (target.innerText || target.textContent || '').trim().substring(0, 120);
            var tag = (target.tagName || '').toLowerCase();

            window.parent.postMessage({
              type: 'sk-element-click',
              tag: tag,
              text: textContent,
              src: target.src || ''
            }, '*');
          }, true);
        })();
      </script>
    `;

    return generatedHtml.includes('</body>')
      ? generatedHtml.replace('</body>', scriptTag + '</body>')
      : generatedHtml + scriptTag;
  };

  // Escuta mensagens do iframe
  useEffect(() => {
    const handleWindowMessage = (e) => {
      if (e.data && e.data.type === 'sk-element-click') {
        setSelectedElement(e.data.text || e.data.tag);
        setInputPrompt(`Ajuste o elemento "${e.data.text || e.data.tag}": `);
      }
    };
    window.addEventListener('message', handleWindowMessage);
    return () => window.removeEventListener('message', handleWindowMessage);
  }, []);

  // Envio de mensagem para o Copilot de IA
  const handleSendMessage = async (customText = null) => {
    const textToSend = (customText || inputPrompt).trim();
    if (!textToSend || isRefining) return;

    const userMsg = {
      id: Date.now().toString(),
      sender: 'user',
      text: textToSend,
      timestamp: new Date()
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputPrompt('');
    setIsRefining(true);

    try {
      const token = localStorage.getItem('sdr_jwt_token') || localStorage.getItem('token');
      const res = await fetch('/api/site-builder/refine', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          leadId: currentLead.id,
          message: textToSend,
          selectedElement: selectedElement || ''
        })
      });

      const data = await res.json();
      if (data.success && data.html) {
        setGeneratedHtml(data.html);
        setCurrentLead(data.lead);
        if (onLeadUpdated) onLeadUpdated(data.lead);

        const aiMsg = {
          id: (Date.now() + 1).toString(),
          sender: 'assistant',
          text: data.explanation || 'Apliquei as modificações solicitadas no layout do site.',
          timestamp: new Date()
        };
        setMessages((prev) => [...prev, aiMsg]);
        setSelectedElement(null);
      } else {
        throw new Error(data.error || 'Erro ao refinar');
      }
    } catch (err) {
      const errorMsg = {
        id: (Date.now() + 1).toString(),
        sender: 'assistant',
        text: `Ocorreu um erro ao processar o ajuste: ${err.message}. Tente novamente.`,
        isError: true,
        timestamp: new Date()
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsRefining(false);
    }
  };

  // Rollback para versão anterior
  const handleRollbackVersion = async (idx) => {
    setIsRefining(true);
    try {
      const token = localStorage.getItem('sdr_jwt_token') || localStorage.getItem('token');
      const res = await fetch('/api/site-builder/rollback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          leadId: currentLead.id,
          historyIndex: idx
        })
      });
      const data = await res.json();
      if (data.success && data.html) {
        setGeneratedHtml(data.html);
        setCurrentLead(data.lead);
        if (onLeadUpdated) onLeadUpdated(data.lead);
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now().toString(),
            sender: 'assistant',
            text: `Versão #${idx + 1} restaurada com sucesso!`,
            timestamp: new Date()
          }
        ]);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsRefining(false);
    }
  };

  // Aplica Tema
  const handleApplyTheme = (themeData) => {
    handleSendMessage(
      `Atualize o tema visual do site: Cor de fundo/primária ${themeData.primary}, Cor de destaque/CTA ${themeData.accent}, Fonte tipográfica ${themeData.font}, Modo ${themeData.mode}.`
    );
  };

  // Aplica Fotos e Logo
  const handleApplyAssets = (assetsData) => {
    let msg = 'Atualize as fotos do site: ';
    if (assetsData.logo) msg += `Logo da empresa: ${assetsData.logo}. `;
    if (assetsData.heroImage) msg += `Foto principal do fundo: ${assetsData.heroImage}. `;
    if (assetsData.gallery && assetsData.gallery.length) {
      msg += `Fotos da galeria: ${assetsData.gallery.join(', ')}.`;
    }
    handleSendMessage(msg);
  };

  // Aplica Instruções Permanentes
  const handleApplyInstructions = (inst) => {
    handleSendMessage(`Considere estas novas instruções mestres para o site: ${inst}`);
  };

  const handleCopyLink = () => {
    const url = `${window.location.origin}/preview/${currentLead.id}`;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([generatedHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `site-${(currentLead?.nome || 'site').toLowerCase().replace(/\s+/g, '-')}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const versionCount = (currentLead?.siteHistory?.length || 0) + 1;

  return (
    <div className="fixed inset-0 z-[9999] bg-[#090a0f] text-white flex flex-col overflow-hidden font-sans select-none">
      <div className="flex-1 flex h-full overflow-hidden">
        {/* ========================================================= */}
        {/* SIDEBAR ESQUERDA: COPILOT IA / REFINAMENTO (380px)       */}
        {/* ========================================================= */}
        <div className="w-[380px] shrink-0 border-r border-white/10 bg-[#0e0f15] flex flex-col h-full z-20">
          {/* Header da Sidebar */}
          <div className="h-14 border-b border-white/10 px-3 flex items-center justify-between gap-1.5 shrink-0 bg-[#12131b]">
            <div className="flex items-center gap-1.5 min-w-0">
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors shrink-0"
                title="Voltar"
              >
                <ArrowLeft size={17} />
              </button>

              {isEditingName ? (
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  onBlur={() => setIsEditingName(false)}
                  onKeyDown={(e) => e.key === 'Enter' && setIsEditingName(false)}
                  autoFocus
                  className="bg-black/60 border border-purple-500 rounded px-2 py-0.5 text-xs text-white outline-none w-36"
                />
              ) : (
                <button
                  onClick={() => setIsEditingName(true)}
                  className="text-left text-xs font-bold text-white truncate max-w-[140px] hover:text-purple-300 transition-colors"
                  title="Clique para renomear"
                >
                  {companyName}
                </button>
              )}
            </div>

            {/* Ações Rápidas no Header */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => setShowInstructionsModal(true)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                title="Instruções permanentes do projeto (tom, marca, restrições)"
              >
                <SlidersHorizontal size={14} />
              </button>

              <button
                onClick={() => setShowAssetsModal(true)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                title="Fotos e logo do projeto"
              >
                <Images size={14} />
              </button>

              <button
                onClick={() => setShowThemeModal(true)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                title="Tema: cores e fonte do site"
              >
                <Palette size={14} />
              </button>

              <button
                onClick={() => setShowHistoryModal(true)}
                className="flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-semibold text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                title="Histórico de versões"
              >
                <History size={14} />
                <span className="tabular-nums font-mono text-purple-400 font-bold">{versionCount}</span>
              </button>
            </div>
          </div>

          {/* Área de Mensagens / Chat com IA */}
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 custom-scrollbar">
            {messages.map((msg) => {
              const isUser = msg.sender === 'user';
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col max-w-[88%] ${isUser ? 'self-end items-end' : 'self-start items-start'}`}
                >
                  <div
                    className={`rounded-2xl px-3.5 py-2.5 text-[13px] leading-relaxed select-text ${
                      isUser
                        ? 'bg-[#0284c7] text-white rounded-br-sm shadow-md'
                        : msg.isError
                        ? 'bg-red-500/15 text-red-300 border border-red-500/20'
                        : 'bg-[#181a23] text-gray-200 border border-white/5 rounded-bl-sm shadow-sm'
                    }`}
                  >
                    {msg.text}
                  </div>

                  {!isUser && !msg.isError && (
                    <div className="mt-1 flex items-center gap-1.5 pl-1 text-gray-500">
                      <button className="p-1 rounded hover:text-white hover:bg-white/5 transition-colors" title="Boa resposta">
                        <ThumbsUp size={11} />
                      </button>
                      <button className="p-1 rounded hover:text-white hover:bg-white/5 transition-colors" title="Pode melhorar">
                        <ThumbsDown size={11} />
                      </button>
                    </div>
                  )}
                </div>
              );
            })}

            {isRefining && (
              <div className="self-start max-w-[85%] flex items-center gap-2 p-3 rounded-2xl bg-[#181a23] border border-white/5 text-purple-300 text-xs animate-pulse">
                <RefreshCw size={13} className="animate-spin text-purple-400" />
                <span>Aplicando ajustes no site com IA...</span>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* Sugestões Rápidas de Refinamento */}
          <div className="px-3 pt-2 border-t border-white/5 flex gap-1.5 overflow-x-auto no-scrollbar shrink-0">
            {[
              '💎 Ouro & Luxo',
              '⚡ Mais Urgência',
              '💬 Depoimentos Maps',
              '📱 Botão WhatsApp',
              '❓ Seção FAQ'
            ].map((chip) => (
              <button
                key={chip}
                onClick={() => handleSendMessage(`Aplique o ajuste: ${chip}`)}
                className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white whitespace-nowrap transition-colors border border-white/5 cursor-pointer"
              >
                {chip}
              </button>
            ))}
          </div>

          {/* Input Bar do Copilot */}
          <div className="p-3 border-t border-white/10 bg-[#12131b] shrink-0">
            {selectedElement && (
              <div className="mb-2 flex items-center justify-between text-[11px] bg-purple-500/15 border border-purple-500/30 text-purple-300 px-2.5 py-1 rounded-lg">
                <span className="truncate max-w-[280px]">Elemento selecionado: "{selectedElement}"</span>
                <button onClick={() => setSelectedElement(null)} className="hover:text-white">
                  <X size={12} />
                </button>
              </div>
            )}

            <div className="flex items-center gap-2 bg-[#1a1b24] border border-white/10 rounded-2xl px-3 py-1.5 focus-within:border-purple-500/60 transition-colors">
              <button
                onClick={() => setShowAssetsModal(true)}
                className="p-1 rounded-lg text-gray-400 hover:text-white transition-colors"
                title="Anexar foto ou logo"
              >
                <Paperclip size={16} />
              </button>

              <input
                type="text"
                value={inputPrompt}
                onChange={(e) => setInputPrompt(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Peça uma mudança..."
                disabled={isRefining}
                className="flex-1 bg-transparent text-xs text-white placeholder-gray-500 outline-none"
              />

              <button
                onClick={() => handleSendMessage()}
                disabled={!inputPrompt.trim() || isRefining}
                className="w-7 h-7 rounded-xl bg-[#0284c7] hover:bg-sky-500 text-white flex items-center justify-center transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shrink-0 shadow-sm"
              >
                <Send size={13} />
              </button>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* CANVAS DIREITO: LIVE PREVIEW & TOOLBAR FLUTUANTE           */}
        {/* ========================================================= */}
        <div className="flex-1 flex flex-col h-full overflow-hidden relative bg-[#07080b]">
          {/* Barra Superior do Canvas */}
          <div className="h-14 border-b border-white/10 px-6 flex items-center justify-between z-30 shrink-0 bg-[#0c0d12]/90 backdrop-blur-md">
            {/* Undo / Redo */}
            <div className="flex items-center bg-black/40 border border-white/10 rounded-xl p-0.5 gap-0.5">
              <button
                onClick={() => handleRollbackVersion(Math.max(0, (currentLead?.siteHistory?.length || 1) - 2))}
                disabled={!currentLead?.siteHistory || currentLead.siteHistory.length === 0}
                className="p-1.5 rounded-lg text-gray-400 hover:text-white disabled:opacity-30 transition-colors"
                title="Desfazer"
              >
                <RotateCcw size={14} />
              </button>
              <button
                disabled
                className="p-1.5 rounded-lg text-gray-400 opacity-30 transition-colors"
                title="Refazer"
              >
                <RotateCw size={14} />
              </button>
            </div>

            {/* Alternadores Centrais: Dispositivos & Visualizar */}
            <div className="flex items-center gap-2">
              <div className="flex items-center bg-black/40 border border-white/10 rounded-xl p-1 gap-1">
                <button
                  onClick={() => setDeviceMode('desktop')}
                  className={`p-1.5 rounded-lg transition-all ${
                    deviceMode === 'desktop' ? 'bg-sky-600 text-white shadow-sm' : 'text-gray-400 hover:text-white'
                  }`}
                  title="Visualização Desktop"
                >
                  <Monitor size={15} />
                </button>
                <button
                  onClick={() => setDeviceMode('mobile')}
                  className={`p-1.5 rounded-lg transition-all ${
                    deviceMode === 'mobile' ? 'bg-sky-600 text-white shadow-sm' : 'text-gray-400 hover:text-white'
                  }`}
                  title="Visualização Celular"
                >
                  <Smartphone size={15} />
                </button>
              </div>

              <button
                onClick={() => window.open(`/preview/${currentLead.id}`, '_blank')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white text-xs font-semibold transition-colors"
              >
                <ExternalLink size={13} />
                <span>Visualizar</span>
              </button>

              <button
                onClick={() => setAnimatedHero(!animatedHero)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-colors ${
                  animatedHero
                    ? 'border-purple-500/30 bg-purple-500/10 text-purple-300'
                    : 'border-white/10 bg-white/5 text-gray-400 hover:text-white'
                }`}
              >
                <Sparkles size={13} />
                <span>Hero animado</span>
              </button>

              {/* Proposta PDF */}
              <button
                onClick={() => setShowPdfModal(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white text-xs font-semibold transition-colors"
              >
                <FileText size={13} />
                <span>Proposta PDF</span>
              </button>
            </div>

            {/* Ações Principais: Publicar & Editar Direto */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowPublishModal(true)}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-[#0284c7] hover:bg-sky-500 text-white text-xs font-bold transition-all shadow-[0_0_15px_rgba(2,132,199,0.35)] cursor-pointer"
              >
                <Zap size={13} />
                <span>Publicar</span>
              </button>

              <button
                onClick={() => setDirectEditMode(!directEditMode)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                  directEditMode
                    ? 'bg-purple-600 border-purple-400 text-white shadow-[0_0_15px_rgba(168,85,247,0.4)] animate-pulse'
                    : 'bg-white/5 border-white/10 text-gray-300 hover:text-white hover:bg-white/10'
                }`}
                title="Clique em qualquer elemento do site para editar"
              >
                <Wand2 size={13} />
                <span>{directEditMode ? 'Editando Direto' : 'Editar direto'}</span>
              </button>
            </div>
          </div>

          {/* Canvas Preview */}
          <div className="flex-1 flex items-center justify-center p-4 overflow-auto custom-scrollbar relative">
            {generating ? (
              <div className="flex flex-col items-center justify-center text-center p-6 space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-600 to-sky-600 flex items-center justify-center shadow-2xl animate-pulse">
                  <Sparkles size={28} className="text-white animate-spin" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-white">Criando Site Exclusivo</h4>
                  <p className="text-xs text-gray-400 mt-1">Carregando identidade e copywriting de alta conversão...</p>
                </div>
              </div>
            ) : deviceMode === 'desktop' ? (
              <div className="w-full h-full rounded-xl overflow-hidden shadow-2xl border border-white/10 bg-white">
                <iframe
                  ref={iframeRef}
                  srcDoc={getInteractiveHtml()}
                  title="Desktop Preview"
                  className="w-full h-full border-0"
                />
              </div>
            ) : (
              /* Celular Realista com Dynamic Island */
              <div className="w-[390px] h-[780px] max-h-[96%] rounded-[48px] overflow-hidden shadow-[0_25px_70px_rgba(0,0,0,0.8)] border-[12px] border-[#181924] bg-black flex flex-col relative shrink-0">
                <div className="h-7 bg-[#181924] flex items-center justify-center shrink-0">
                  <div className="w-24 h-4 bg-black rounded-full" />
                </div>
                <iframe
                  ref={iframeRef}
                  srcDoc={getInteractiveHtml()}
                  title="Mobile Preview"
                  className="w-full flex-1 border-0 bg-white"
                />
                <div className="h-4 bg-[#181924] flex items-center justify-center shrink-0">
                  <div className="w-28 h-1 bg-gray-600 rounded-full" />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* MODAIS DO STUDIO                                          */}
      {/* ========================================================= */}

      {showThemeModal && (
        <StudioThemeModal
          currentTheme={currentLead?.siteData?.theme || {}}
          onApply={handleApplyTheme}
          onClose={() => setShowThemeModal(false)}
        />
      )}

      {showAssetsModal && (
        <StudioAssetsModal
          currentAssets={currentLead?.siteData?.profile?.imagens || {}}
          onApply={handleApplyAssets}
          onClose={() => setShowAssetsModal(false)}
        />
      )}

      {showInstructionsModal && (
        <StudioInstructionsModal
          currentInstructions={currentLead?.sitePrompt || ''}
          onApply={handleApplyInstructions}
          onClose={() => setShowInstructionsModal(false)}
        />
      )}

      {showHistoryModal && (
        <StudioHistoryModal
          history={currentLead?.siteHistory || []}
          onRollback={handleRollbackVersion}
          onClose={() => setShowHistoryModal(false)}
        />
      )}

      {showPdfModal && (
        <ProposalPdfModal
          lead={currentLead}
          onClose={() => setShowPdfModal(false)}
        />
      )}

      {/* Modal de Publicação */}
      {showPublishModal && (
        <div className="fixed inset-0 z-[10002] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-[#121216] border border-white/10 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4 text-white">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-sky-600/20 text-sky-400 flex items-center justify-center">
                  <Zap size={18} />
                </div>
                <h3 className="text-sm font-bold text-white">Publicar e Compartilhar Site</h3>
              </div>
              <button onClick={() => setShowPublishModal(false)} className="text-gray-400 hover:text-white">
                <X size={18} />
              </button>
            </div>

            <p className="text-xs text-gray-400 leading-relaxed">
              O site de <strong className="text-white">{currentLead.nome}</strong> está pronto para ser apresentado ao cliente para fechar a venda.
            </p>

            <div className="space-y-2">
              <button
                onClick={handleCopyLink}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all text-xs font-semibold"
              >
                <span className="flex items-center gap-2">
                  <Copy size={14} className="text-purple-400" />
                  <span>Copiar Link de Demonstração</span>
                </span>
                <span className="text-[11px] text-purple-300 font-bold">{copiedLink ? 'Copiado!' : 'Copiar'}</span>
              </button>

              {currentLead.whatsapp && (
                <button
                  onClick={() => {
                    const clean = currentLead.whatsapp.replace(/\D/g, '');
                    const previewUrl = `${window.location.origin}/preview/${currentLead.id}`;
                    const msg = encodeURIComponent(`Olá ${currentLead.nome}! Desenvolvi uma nova versão moderna e de alta conversão para o site da sua empresa: ${previewUrl}. O que achou?`);
                    window.open(`https://wa.me/${clean}?text=${msg}`, '_blank');
                  }}
                  className="w-full flex items-center justify-between p-3 rounded-xl bg-emerald-600/15 hover:bg-emerald-600/25 border border-emerald-500/30 text-emerald-300 transition-all text-xs font-semibold"
                >
                  <span className="flex items-center gap-2">
                    <Phone size={14} />
                    <span>Enviar Demonstração via WhatsApp</span>
                  </span>
                  <span className="text-[11px] font-bold">Abrir Conversa →</span>
                </button>
              )}

              <button
                onClick={() => {
                  setShowPublishModal(false);
                  setShowPdfModal(true);
                }}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-purple-600/15 hover:bg-purple-600/25 border border-purple-500/30 text-purple-300 transition-all text-xs font-semibold"
              >
                <span className="flex items-center gap-2">
                  <FileText size={14} />
                  <span>Gerar Proposta Comercial em PDF</span>
                </span>
                <span className="text-[11px] font-bold">Abrir PDF →</span>
              </button>

              <button
                onClick={handleDownload}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white transition-all text-xs font-semibold"
              >
                <span className="flex items-center gap-2">
                  <Download size={14} />
                  <span>Baixar Arquivo HTML Completo</span>
                </span>
                <span className="text-[11px] font-bold">Download</span>
              </button>
            </div>

            <div className="flex items-center justify-end pt-2 border-t border-white/5">
              <button
                onClick={() => setShowPublishModal(false)}
                className="px-4 py-2 bg-white/5 hover:bg-white/10 text-gray-300 rounded-xl text-xs font-semibold"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
