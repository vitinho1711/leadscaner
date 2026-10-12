import React, { useState, useEffect } from 'react';
import { 
  Settings, Save, Server, Globe, Key, Shield, MessageSquare, 
  Bot, Database, RefreshCcw, LogOut, Eye, EyeOff, CheckCircle2, AlertCircle, Sparkles, ExternalLink, Zap 
} from 'lucide-react';

export default function LeadScannerSettings() {
  const [activeTab, setActiveTab] = useState('ia');
  const [waData, setWaData] = useState({ status: 'LOADING', qr: null });
  const [isReconnecting, setIsReconnecting] = useState(false);
  const [apiConfig, setApiConfig] = useState({ 
    geminiApiKey: '',
    geminiModel: 'gemini-2.0-flash',
    groqApiKey: '', 
    openaiApiKey: '',
    openaiModel: 'gpt-4o-mini',
    aiProvider: 'auto',
    enableAutoResponder: true, 
    aiTrainingPrompt: '',
    hasGeminiKey: false,
    hasOpenaiKey: false,
    hasGroqKey: false
  });
  const [userName, setUserName] = useState('');
  const [isSavingConfig, setIsSavingConfig] = useState(false);
  
  // UI states for AI keys
  const [showGeminiKey, setShowGeminiKey] = useState(false);
  const [showOpenAiKey, setShowOpenAiKey] = useState(false);
  const [showGroqKey, setShowGroqKey] = useState(false);
  const [testingAi, setTestingAi] = useState(false);
  const [testResult, setTestResult] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('sdr_jwt_token');
    const userStr = localStorage.getItem('sdr_user');
    if (userStr) {
      try {
        const u = JSON.parse(userStr.startsWith('{') ? userStr : atob(userStr));
        setUserName(u.username || '');
      } catch (e) {}
    }
    
    fetch('/api/config', {
      headers: token ? { 'Authorization': `Bearer ${token}` } : {}
    })
      .then(res => res.json())
      .then(data => {
        setApiConfig(prev => ({
          ...prev,
          ...data,
          hasGeminiKey: Boolean(data.geminiApiKey),
          hasOpenaiKey: Boolean(data.openaiApiKey),
          hasGroqKey: Boolean(data.groqApiKey)
        }));
      })
      .catch(() => {});

    const checkWa = async () => {
      try {
        const token = localStorage.getItem('sdr_jwt_token');
        const res = await fetch('/api/whatsapp/status', {
          headers: token ? { 'Authorization': `Bearer ${token}` } : {}
        });
        if (res.ok) setWaData(await res.json());
      } catch (e) {}
    };
    checkWa();
    const interval = setInterval(checkWa, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleSaveConfig = async () => {
    setIsSavingConfig(true);
    setTestResult(null);
    try {
      const token = localStorage.getItem('sdr_jwt_token');
      
      // Save profile name if on profile/outros tab
      if (userName) {
        await fetch('/api/user/profile', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {})
          },
          body: JSON.stringify({ username: userName })
        });
        const userStr = localStorage.getItem('sdr_user');
        if (userStr) {
          const u = JSON.parse(userStr.startsWith('{') ? userStr : atob(userStr));
          u.username = userName;
          localStorage.setItem('sdr_user', btoa(JSON.stringify(u)));
          window.dispatchEvent(new Event('storage'));
        }
      }

      const res = await fetch('/api/config', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ 
          geminiApiKey: apiConfig.geminiApiKey,
          geminiModel: apiConfig.geminiModel || 'gemini-2.0-flash',
          groqApiKey: apiConfig.groqApiKey,
          openaiApiKey: apiConfig.openaiApiKey,
          openaiModel: apiConfig.openaiModel,
          aiProvider: apiConfig.aiProvider,
          autoResponder: apiConfig.enableAutoResponder, 
          aiTrainingPrompt: apiConfig.aiTrainingPrompt 
        })
      });

      if (res.ok) {
        const json = await res.json();
        if (json.config) {
          setApiConfig(prev => ({
            ...prev,
            ...json.config,
            hasGeminiKey: Boolean(json.config.geminiApiKey),
            hasOpenaiKey: Boolean(json.config.openaiApiKey),
            hasGroqKey: Boolean(json.config.groqApiKey)
          }));
        }
        alert('Configurações de IA salvas com sucesso!');
      } else {
        alert('Erro ao salvar configurações.');
      }
    } catch(e) {
      alert('Erro de conexão ao salvar.');
    }
    setIsSavingConfig(false);
  };

  const handleTestAi = async () => {
    setTestingAi(true);
    setTestResult(null);
    try {
      const token = localStorage.getItem('sdr_jwt_token');
      let providerToTest = apiConfig.aiProvider;
      if (providerToTest === 'auto') {
        if (apiConfig.geminiApiKey) providerToTest = 'gemini';
        else if (apiConfig.groqApiKey) providerToTest = 'groq';
        else providerToTest = 'openai';
      }

      let keyToTest = '';
      if (providerToTest === 'gemini') keyToTest = apiConfig.geminiApiKey;
      else if (providerToTest === 'groq') keyToTest = apiConfig.groqApiKey;
      else keyToTest = apiConfig.openaiApiKey;

      const res = await fetch('/api/config/test-ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          provider: providerToTest,
          apiKey: keyToTest,
          model: providerToTest === 'gemini' ? (apiConfig.geminiModel || 'gemini-2.0-flash') : apiConfig.openaiModel
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setTestResult({
          success: true,
          message: `Conexão bem-sucedida com ${data.provider.toUpperCase()} (${data.model})! Resposta: "${data.reply}"`
        });
      } else {
        setTestResult({
          success: false,
          message: data.error || 'Falha ao autenticar com a API.'
        });
      }
    } catch(e) {
      setTestResult({
        success: false,
        message: 'Erro de rede ao conectar à API de Inteligência Artificial.'
      });
    }
    setTestingAi(false);
  };

  const handleReconnect = async () => {
    setIsReconnecting(true);
    setWaData(prev => ({ ...prev, status: 'STARTING', qr: null }));
    try {
      const token = localStorage.getItem('sdr_jwt_token');
      await fetch('/api/whatsapp/reconnect', { 
        method: 'POST',
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
      });
    } catch (e) {
      alert('Erro ao tentar reconectar.');
    }
    setTimeout(() => setIsReconnecting(false), 2000);
  };

  const handleDisconnect = async () => {
    setIsReconnecting(true);
    setWaData({ status: 'DISCONNECTED', qr: null });
    try {
      const token = localStorage.getItem('sdr_jwt_token');
      await fetch('/api/whatsapp/disconnect', { 
        method: 'POST',
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
      });
    } catch (e) {}
    setIsReconnecting(false);
  };

  return (
    <div className="animate-fade-in text-white space-y-6 max-w-4xl mx-auto">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-1 flex items-center gap-2">
            Configurações <Settings size={20} className="text-gray-500" />
          </h1>
          <p className="text-sm text-gray-400">
            Ajuste as chaves de API do ChatGPT, WhatsApp e integrações do sistema.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Sidebar Nav */}
        <div className="col-span-1 space-y-2">
          <button 
            onClick={() => setActiveTab('ia')}
            className={`w-full text-left px-4 py-3 rounded-xl font-bold text-sm flex items-center justify-between transition-colors ${activeTab === 'ia' ? 'bg-purple-500/15 text-purple-300 border border-purple-500/30 shadow-[0_0_15px_rgba(168,85,247,0.15)]' : 'hover:bg-white/5 text-gray-400 hover:text-white border border-transparent'}`}
          >
            <div className="flex items-center gap-3">
              <Bot size={18} className="text-purple-400" /> Inteligência Artificial
            </div>
            {(apiConfig.hasOpenaiKey || Boolean(apiConfig.openaiApiKey)) && (
              <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" title="Chave OpenAI Conectada"></span>
            )}
          </button>

          <button 
            onClick={() => setActiveTab('whatsapp')}
            className={`w-full text-left px-4 py-3 rounded-xl font-bold text-sm flex items-center gap-3 transition-colors ${activeTab === 'whatsapp' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'hover:bg-white/5 text-gray-400 hover:text-white border border-transparent'}`}
          >
            <MessageSquare size={18} /> WhatsApp
          </button>

          <button 
            onClick={() => setActiveTab('extrator')}
            className={`w-full text-left px-4 py-3 rounded-xl font-bold text-sm flex items-center gap-3 transition-colors ${activeTab === 'extrator' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : 'hover:bg-white/5 text-gray-400 hover:text-white border border-transparent'}`}
          >
            <Globe size={18} /> Extrator Automático
          </button>

          <button 
            onClick={() => setActiveTab('outros')}
            className={`w-full text-left px-4 py-3 rounded-xl font-bold text-sm flex items-center gap-3 transition-colors ${activeTab === 'outros' ? 'bg-gray-500/10 text-gray-300 border border-gray-500/20' : 'hover:bg-white/5 text-gray-400 hover:text-white border border-transparent'}`}
          >
            <Server size={18} /> Perfil & Outros
          </button>
        </div>

        {/* Content Area */}
        <div className="col-span-2 space-y-6">
          
          {/* Aba Inteligência Artificial (ChatGPT & Groq) */}
          {activeTab === 'ia' && (
            <div className="bg-[#121216] border border-white/5 rounded-2xl p-6 space-y-6 shadow-xl">
              <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <div>
                  <h3 className="text-lg font-bold flex items-center gap-2 text-white">
                    <Sparkles size={20} className="text-purple-400" />
                    Inteligência Artificial (ChatGPT / OpenAI)
                  </h3>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Utilizada para criar os prompts dos sites, copywriters de R$ 800+, bento grid e mensagens.
                  </p>
                </div>
                {apiConfig.openaiApiKey ? (
                  <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[11px] font-bold flex items-center gap-1.5">
                    <CheckCircle2 size={13} /> OpenAI Ativo
                  </span>
                ) : (
                  <span className="px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[11px] font-bold flex items-center gap-1.5">
                    <AlertCircle size={13} /> Chave Pendente
                  </span>
                )}
              </div>

              {/* Seletor de Provedor */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                  Provedor de Inteligência Artificial
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <button
                    type="button"
                    onClick={() => setApiConfig({ ...apiConfig, aiProvider: 'gemini' })}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      apiConfig.aiProvider === 'gemini'
                        ? 'bg-emerald-600/20 border-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.2)]'
                        : 'bg-black/30 border-white/5 text-gray-400 hover:border-white/20'
                    }`}
                  >
                    <div className="font-bold text-xs flex items-center gap-1.5 text-emerald-400">
                      <Sparkles size={14} /> Google Gemini
                    </div>
                    <span className="text-[10px] text-gray-400 mt-1 block">100% Grátis · 1.500 sites/dia</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setApiConfig({ ...apiConfig, aiProvider: 'groq' })}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      apiConfig.aiProvider === 'groq'
                        ? 'bg-amber-600/20 border-amber-500 text-white shadow-[0_0_15px_rgba(245,158,11,0.2)]'
                        : 'bg-black/30 border-white/5 text-gray-400 hover:border-white/20'
                    }`}
                  >
                    <div className="font-bold text-xs flex items-center gap-1.5 text-amber-400">
                      <Zap size={14} /> Groq Cloud
                    </div>
                    <span className="text-[10px] text-gray-400 mt-1 block">100% Grátis · Qwen 27B</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setApiConfig({ ...apiConfig, aiProvider: 'openai' })}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      apiConfig.aiProvider === 'openai'
                        ? 'bg-purple-600/20 border-purple-500 text-white shadow-[0_0_15px_rgba(168,85,247,0.2)]'
                        : 'bg-black/30 border-white/5 text-gray-400 hover:border-white/20'
                    }`}
                  >
                    <div className="font-bold text-xs flex items-center gap-1.5 text-purple-400">
                      <Bot size={14} /> OpenAI ChatGPT
                    </div>
                    <span className="text-[10px] text-gray-400 mt-1 block">GPT-4o & Mini (Pago)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setApiConfig({ ...apiConfig, aiProvider: 'auto' })}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      apiConfig.aiProvider === 'auto'
                        ? 'bg-blue-600/20 border-blue-500 text-white shadow-[0_0_15px_rgba(59,130,246,0.2)]'
                        : 'bg-black/30 border-white/5 text-gray-400 hover:border-white/20'
                    }`}
                  >
                    <div className="font-bold text-xs flex items-center gap-1.5 text-blue-400">
                      <Sparkles size={14} /> Automático
                    </div>
                    <span className="text-[10px] text-gray-400 mt-1 block">Gemini ➔ Groq ➔ OpenAI</span>
                  </button>
                </div>
              </div>

              {/* Google Gemini API Key (100% Gratuito) */}
              <div className="space-y-2 pt-2 border-t border-white/5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-emerald-300 flex items-center gap-1.5">
                    <Sparkles size={14} className="text-emerald-400" /> Chave de API Google Gemini (Recomendada & 100% Grátis)
                  </label>
                  <a
                    href="https://aistudio.google.com/"
                    target="_blank"
                    rel="noreferrer"
                    className="text-[11px] text-emerald-400 hover:text-emerald-300 flex items-center gap-1 underline font-semibold"
                  >
                    Obter chave grátis no Google AI Studio (Sem Cartão) <ExternalLink size={11} />
                  </a>
                </div>
                <div className="relative">
                  <input
                    type={showGeminiKey ? "text" : "password"}
                    value={apiConfig.geminiApiKey || ''}
                    onChange={(e) => setApiConfig({ ...apiConfig, geminiApiKey: e.target.value })}
                    placeholder="AIzaSy..."
                    className="w-full bg-black/50 border border-emerald-500/30 rounded-xl pl-4 pr-12 py-3 text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowGeminiKey(!showGeminiKey)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  >
                    {showGeminiKey ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                <p className="text-[11px] text-gray-400">
                  Permite gerar até 1.500 sites por dia com o modelo <strong>Gemini 2.0 Flash</strong> de forma totalmente gratuita sem necessidade de cartão de crédito.
                </p>
              </div>

              {/* OpenAI API Key */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-300 flex items-center gap-1.5">
                    <Key size={14} className="text-purple-400" /> Chave de API da OpenAI (ChatGPT)
                  </label>
                  <a
                    href="https://platform.openai.com/api-keys"
                    target="_blank"
                    rel="noreferrer"
                    className="text-[11px] text-purple-400 hover:text-purple-300 flex items-center gap-1 underline"
                  >
                    Obter chave na OpenAI <ExternalLink size={11} />
                  </a>
                </div>
                <div className="relative">
                  <input
                    type={showOpenAiKey ? "text" : "password"}
                    value={apiConfig.openaiApiKey || ''}
                    onChange={(e) => setApiConfig({ ...apiConfig, openaiApiKey: e.target.value })}
                    placeholder="sk-proj-... ou sk-..."
                    className="w-full bg-black/50 border border-white/10 rounded-xl pl-4 pr-12 py-3 text-sm text-white focus:outline-none focus:border-purple-500 transition-colors font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowOpenAiKey(!showOpenAiKey)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  >
                    {showOpenAiKey ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                <p className="text-[11px] text-gray-400">
                  Insira sua chave oficial da OpenAI. Com ela ativada, os prompts do <strong>Site Builder IA</strong> gerarão headlines sob medida, descrições ricas para cada serviço e depoimentos realistas da cidade.
                </p>
              </div>

              {/* Modelo OpenAI */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-2">
                  Modelo do ChatGPT Selecionado
                </label>
                <select
                  value={apiConfig.openaiModel || 'gpt-4o-mini'}
                  onChange={(e) => setApiConfig({ ...apiConfig, openaiModel: e.target.value })}
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-purple-500 transition-colors"
                >
                  <option value="gpt-4o-mini">⚡ GPT-4o Mini (Recomendado — Ultrarrápido, excelente em PT-BR e custo quase zero)</option>
                  <option value="gpt-4o">👑 GPT-4o (Máxima capacidade criativa e copywriting de elite para alto ticket)</option>
                  <option value="gpt-3.5-turbo">⚙️ GPT-3.5 Turbo (Modelo legado)</option>
                </select>
              </div>

              {/* Groq API Key (Opcional / Fallback) */}
              <div className="pt-2 border-t border-white/5 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                    <Key size={14} className="text-gray-500" /> Chave Groq (Backup Opcional)
                  </label>
                </div>
                <div className="relative">
                  <input
                    type={showGroqKey ? "text" : "password"}
                    value={apiConfig.groqApiKey || ''}
                    onChange={(e) => setApiConfig({ ...apiConfig, groqApiKey: e.target.value })}
                    placeholder="gsk_..."
                    className="w-full bg-black/40 border border-white/10 rounded-xl pl-4 pr-12 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500 transition-colors font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowGroqKey(!showGroqKey)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  >
                    {showGroqKey ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Resultado do Teste de Conexão */}
              {testResult && (
                <div className={`p-4 rounded-xl border text-xs flex items-start gap-3 animate-fade-in ${
                  testResult.success 
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' 
                    : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                }`}>
                  {testResult.success ? (
                    <CheckCircle2 size={18} className="text-emerald-400 shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle size={18} className="text-rose-400 shrink-0 mt-0.5" />
                  )}
                  <div className="flex-1">
                    <span className="font-bold block mb-0.5">
                      {testResult.success ? 'Conexão Estabelecida com Sucesso!' : 'Falha no Teste de IA'}
                    </span>
                    <p className="leading-relaxed opacity-90">{testResult.message}</p>
                  </div>
                </div>
              )}

              {/* Botões de Ação */}
              <div className="flex items-center justify-between pt-4 border-t border-white/5">
                <button
                  type="button"
                  onClick={handleTestAi}
                  disabled={testingAi || (!apiConfig.openaiApiKey && !apiConfig.groqApiKey)}
                  className="flex items-center gap-2 px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white rounded-xl text-xs font-bold transition-all disabled:opacity-40"
                >
                  {testingAi ? <RefreshCcw size={14} className="animate-spin text-purple-400" /> : <Bot size={14} />}
                  {testingAi ? 'Testando Conexão...' : 'Testar Conexão com a IA'}
                </button>

                <button 
                  type="button"
                  onClick={handleSaveConfig} 
                  disabled={isSavingConfig}
                  className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white rounded-xl text-xs font-extrabold transition-all shadow-[0_0_20px_rgba(124,58,237,0.35)] disabled:opacity-50"
                >
                  {isSavingConfig ? <RefreshCcw size={15} className="animate-spin" /> : <Save size={15} />}
                  {isSavingConfig ? 'Salvando...' : 'Salvar Configurações de IA'}
                </button>
              </div>
            </div>
          )}

          {/* Aba WhatsApp */}
          {activeTab === 'whatsapp' && (
            <div className="bg-[#121216] border border-white/5 rounded-2xl p-6">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><MessageSquare size={20} className="text-emerald-400" /> Conexão do WhatsApp</h3>
              <p className="text-sm text-gray-400 mb-6">Conecte seu WhatsApp para que o Agente SDR possa enviar mensagens automaticamente nas campanhas.</p>
              
              <div className="flex flex-col items-center justify-center p-8 bg-black/40 border border-white/5 rounded-2xl">
                {waData.status === 'CONNECTED' ? (
                  <div className="text-center space-y-4">
                    <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto border border-emerald-500/20 text-emerald-400">
                      <Shield size={32} />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg text-white">WhatsApp Conectado</h4>
                      <p className="text-xs text-gray-400 mt-1">O robô está pronto para disparar campanhas e mensagens.</p>
                    </div>
                    <button 
                      onClick={handleDisconnect} 
                      disabled={isReconnecting}
                      className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-xl text-xs font-bold transition-all"
                    >
                      {isReconnecting ? 'Desconectando...' : 'Desconectar WhatsApp'}
                    </button>
                  </div>
                ) : waData.status === 'QR_READY' && waData.qr ? (
                  <div className="text-center space-y-4">
                    <div className="bg-white p-4 rounded-2xl inline-block shadow-xl">
                      <img src={waData.qr} alt="QR Code WhatsApp" className="w-64 h-64" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">Escaneie o QR Code no seu WhatsApp</p>
                      <p className="text-xs text-gray-400 mt-1">Abra o WhatsApp &gt; Dispositivos Conectados &gt; Conectar um aparelho.</p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center space-y-4">
                    <div className="w-16 h-16 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto border border-amber-500/20 text-amber-400">
                      <RefreshCcw size={28} className={isReconnecting ? 'animate-spin' : ''} />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg text-white">WhatsApp Desconectado</h4>
                      <p className="text-xs text-gray-400 mt-1">Inicie uma nova sessão para conectar seu número de WhatsApp.</p>
                    </div>
                    <button 
                      onClick={handleReconnect} 
                      disabled={isReconnecting}
                      className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                    >
                      {isReconnecting ? 'Iniciando Sessão...' : 'Conectar WhatsApp'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Aba Extrator */}
          {activeTab === 'extrator' && (
            <div className="bg-[#121216] border border-white/5 rounded-2xl p-6">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><Globe size={20} className="text-blue-400" /> Extrator Automático</h3>
              <p className="text-sm text-gray-400 mb-6">Configurações para o enriquecimento automático de dados de leads.</p>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-black/20 border border-white/5 rounded-xl">
                  <div>
                    <p className="text-sm font-bold text-white">Buscar Redes Sociais</p>
                    <p className="text-[11px] text-gray-500 mt-0.5">A IA tenta encontrar perfis de Instagram e Facebook durante a extração.</p>
                  </div>
                  <div className="w-10 h-5 bg-blue-600 rounded-full relative cursor-pointer">
                    <div className="absolute right-1 top-0.5 w-4 h-4 bg-white rounded-full shadow"></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Aba Outros / Perfil */}
          {activeTab === 'outros' && (
            <div className="bg-[#121216] border border-white/5 rounded-2xl p-6 space-y-6">
              <div>
                <h3 className="text-lg font-bold mb-4 text-white flex items-center gap-2">Perfil do Usuário</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-400 mb-2">Seu Nome de Apresentação</label>
                    <input 
                      type="text" 
                      value={userName} 
                      onChange={e => setUserName(e.target.value)}
                      placeholder="Ex: Vitor Batista" 
                      className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
                    />
                    <p className="text-xs text-gray-500 mt-2">Nome usado para identificação nas propostas comerciais e no topo do sistema.</p>
                  </div>
                </div>
              </div>

              <div className="border-t border-white/10 pt-6">
                <h3 className="text-lg font-bold mb-4 text-white flex items-center gap-2">Robô SDR (Auto-Resposta)</h3>
                <div className="flex items-center justify-between p-4 bg-black/20 border border-white/5 rounded-xl">
                  <div>
                    <p className="text-sm font-bold text-white">Auto-Resposta no WhatsApp</p>
                    <p className="text-xs text-gray-500 mt-0.5">A IA responderá automaticamente perguntas dos clientes no WhatsApp.</p>
                  </div>
                  <div 
                    className={`w-12 h-6 rounded-full relative cursor-pointer transition-colors ${apiConfig.enableAutoResponder ? 'bg-emerald-500' : 'bg-gray-600'}`}
                    onClick={() => setApiConfig({...apiConfig, enableAutoResponder: !apiConfig.enableAutoResponder})}
                  >
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${apiConfig.enableAutoResponder ? 'right-1' : 'left-1'}`}></div>
                  </div>
                </div>

                <div className="mt-6 flex justify-end">
                  <button 
                    onClick={handleSaveConfig} 
                    disabled={isSavingConfig}
                    className="flex items-center gap-2 px-6 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-sm font-bold transition-all shadow-[0_0_15px_rgba(168,85,247,0.4)] disabled:opacity-50"
                  >
                    {isSavingConfig ? <RefreshCcw size={16} className="animate-spin" /> : <Save size={16} />}
                    {isSavingConfig ? 'Salvando...' : 'Salvar Alterações'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
