import React, { useState, useEffect, useRef } from 'react';
import LeadScannerDashboard from './LeadScannerDashboard';
import LeadScannerAnalysis from './LeadScannerAnalysis';
import LeadScannerLeads from './LeadScannerLeads';
import LeadScannerMessages from './LeadScannerMessages';
import LeadScannerHistory from './LeadScannerHistory';
import LeadScannerSettings from './LeadScannerSettings';
import LeadScannerAccount from './LeadScannerAccount';
import LeadScannerInvites from './LeadScannerInvites';
import SdrSitePrompts from './SdrSitePrompts';
import { 
  Bot, MessageSquare, PieChart, Users, TrendingUp, Calendar, Clock, 
  CheckCircle, Zap, ShieldCheck, ChevronRight, Activity, Bell, Send,
  Target, BarChart2, MessageCircle, RefreshCcw, Trash2,
  Megaphone, Play, Square, Plus, PenLine, Copy, AlertTriangle, Shuffle,
  Power, Rocket, RotateCcw, Pause, LayoutDashboard, PlusCircle, History, Mail, Settings, User, LogOut, Monitor, Gift
} from 'lucide-react';

export default function SdrSystem({ userRole, planInfo, handleLogout }) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [notifications, setNotifications] = useState([]);
  const [globalWaData, setGlobalWaData] = useState({ status: 'CONNECTING', qr: null });
  const [dismissWa, setDismissWa] = useState(false);
  
  // Notification Demo
  useEffect(() => {
    const timer = setTimeout(() => {
      setNotifications([{ id: 1, text: 'Novo lead quente: João Silva', time: 'Agora' }]);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  // Global WA Fetch
  useEffect(() => {
    const fetchWa = async () => {
      try {
        const token = localStorage.getItem('sdr_jwt_token');
        const res = await fetch('/api/whatsapp/status', {
          headers: token ? { 'Authorization': `Bearer ${token}` } : {}
        });
        if (res.ok) {
          setGlobalWaData(await res.json());
        } else if (res.status === 401) {
          // If unauthorized, don't trigger the modal error state yet
          setGlobalWaData({ status: 'CONNECTING', qr: null });
        } else {
          setGlobalWaData({ status: 'DISCONNECTED', qr: null });
        }
      } catch(e) {
        setGlobalWaData({ status: 'DISCONNECTED', qr: null });
      }
    };
    fetchWa();
    const interval = setInterval(fetchWa, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="sdr-system flex h-full bg-[#0a0a0a] text-white overflow-hidden" style={{fontFamily: 'Inter, sans-serif'}}>
      {/* Sidebar LeadScanner AI */}
      <div className="w-64 border-r border-white/5 bg-[#0f0f13] flex flex-col relative z-10">
        <div className="p-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-[0_0_15px_rgba(124,58,237,0.3)]">
              <Bot size={18} className="text-white" />
            </div>
            LeadScanner AI
          </h2>
        </div>
        
        <div className="flex-1 py-2 px-3 space-y-1 overflow-y-auto custom-scrollbar">
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 text-sm font-medium ${activeTab === 'dashboard' ? 'bg-gradient-to-r from-purple-600/20 to-blue-600/20 text-purple-400 border border-purple-500/20 shadow-[0_0_10px_rgba(124,58,237,0.1)]' : 'text-gray-400 hover:bg-white/5 hover:text-white border border-transparent'}`}
          >
            <LayoutDashboard size={18} /> Dashboard
          </button>
          
          <button 
            onClick={() => setActiveTab('nova_analise')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 text-sm font-medium ${activeTab === 'nova_analise' ? 'bg-gradient-to-r from-purple-600/20 to-blue-600/20 text-purple-400 border border-purple-500/20 shadow-[0_0_10px_rgba(124,58,237,0.1)]' : 'text-gray-400 hover:bg-white/5 hover:text-white border border-transparent'}`}
          >
            <PlusCircle size={18} /> Nova Análise
          </button>

          <button 
            onClick={() => setActiveTab('leads_qualificados')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 text-sm font-medium ${activeTab === 'leads_qualificados' ? 'bg-gradient-to-r from-purple-600/20 to-blue-600/20 text-purple-400 border border-purple-500/20 shadow-[0_0_10px_rgba(124,58,237,0.1)]' : 'text-gray-400 hover:bg-white/5 hover:text-white border border-transparent'}`}
          >
            <Activity size={18} /> Leads Qualificados
          </button>

          <button 
            onClick={() => setActiveTab('historico')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 text-sm font-medium ${activeTab === 'historico' ? 'bg-gradient-to-r from-purple-600/20 to-blue-600/20 text-purple-400 border border-purple-500/20 shadow-[0_0_10px_rgba(124,58,237,0.1)]' : 'text-gray-400 hover:bg-white/5 hover:text-white border border-transparent'}`}
          >
            <History size={18} /> Histórico
          </button>

          <button 
            onClick={() => setActiveTab('mensagens')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 text-sm font-medium ${activeTab === 'mensagens' ? 'bg-gradient-to-r from-purple-600/20 to-blue-600/20 text-purple-400 border border-purple-500/20 shadow-[0_0_10px_rgba(124,58,237,0.1)]' : 'text-gray-400 hover:bg-white/5 hover:text-white border border-transparent'}`}
          >
            <Mail size={18} /> Mensagens
          </button>

          <div className="pt-4 pb-1">
            <p className="px-3 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Ferramentas SDR (Add-ons)</p>
          </div>


          <button 
            onClick={() => setActiveTab('chat')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 text-sm font-medium ${activeTab === 'chat' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/20 shadow-[0_0_10px_rgba(59,130,246,0.15)]' : 'text-gray-400 hover:bg-white/5 hover:text-white border border-transparent'}`}
          >
            <MessageSquare size={18} /> Conversa IA
          </button>

          <button 
            onClick={() => setActiveTab('campanhas')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 text-sm font-medium ${activeTab === 'campanhas' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.15)]' : 'text-gray-400 hover:bg-white/5 hover:text-white border border-transparent'}`}
          >
            <Megaphone size={18} /> Campanhas Automáticas
          </button>
          
          <button 
            onClick={() => setActiveTab('prompts_site')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 text-sm font-medium ${activeTab === 'prompts_site' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/20 shadow-[0_0_10px_rgba(168,85,247,0.15)]' : 'text-gray-400 hover:bg-white/5 hover:text-white border border-transparent'}`}
          >
            <Monitor size={18} /> Prompts de Site
          </button>

          <button 
            onClick={() => setActiveTab('captura')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 text-sm font-medium ${activeTab === 'captura' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/20 shadow-[0_0_10px_rgba(59,130,246,0.15)]' : 'text-gray-400 hover:bg-white/5 hover:text-white border border-transparent'}`}
          >
            <Zap size={18} /> Captura Inteligente
          </button>

          {userRole === 'admin' && (
            <button 
              onClick={() => setActiveTab('convites')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 text-sm font-medium ${activeTab === 'convites' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/20 shadow-[0_0_10px_rgba(245,158,11,0.15)]' : 'text-gray-400 hover:bg-white/5 hover:text-white border border-transparent'}`}
            >
              <Gift size={18} /> Convites
            </button>
          )}

          <div className="pt-4 pb-1">
            <p className="px-3 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Sistema</p>
          </div>

          <button 
            onClick={() => setActiveTab('configuracoes')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 text-sm font-medium ${activeTab === 'configuracoes' ? 'bg-white/10 text-white border border-white/20' : 'text-gray-400 hover:bg-white/5 hover:text-white border border-transparent'}`}
          >
            <Settings size={18} /> Configurações
          </button>

          <button 
            onClick={() => setActiveTab('conta')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 text-sm font-medium ${activeTab === 'conta' ? 'bg-white/10 text-white border border-white/20' : 'text-gray-400 hover:bg-white/5 hover:text-white border border-transparent'}`}
          >
            <User size={18} /> Minha Conta
          </button>
        </div>
        
        {/* User Profile Footer */}
        <div className="p-4 border-t border-white/5 bg-black/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-600/30 border border-purple-500/50 flex items-center justify-center text-purple-300 font-bold text-sm">
              VN
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-bold text-white truncate">Vitor Nogueira</p>
              <p className="text-xs text-gray-500 truncate">vitor@example.com</p>
            </div>
          </div>
          <button onClick={handleLogout} className="mt-4 w-full flex items-center gap-2 text-xs font-bold text-red-400 hover:text-red-300 transition-colors">
            <LogOut size={14} /> Sair do sistema
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto bg-[#0a0a0f] p-8 relative">
        {activeTab === 'dashboard' && <LeadScannerDashboard setActiveTab={setActiveTab} planInfo={planInfo} />}
        {activeTab === 'nova_analise' && <LeadScannerAnalysis setActiveTab={setActiveTab} />}
        {activeTab === 'leads_qualificados' && <LeadScannerLeads setActiveTab={setActiveTab} />}
        {activeTab === 'historico' && <LeadScannerHistory />}
        {activeTab === 'mensagens' && <LeadScannerMessages planInfo={planInfo} />}
        {activeTab === 'convites' && <LeadScannerInvites />}
        

        {activeTab === 'chat' && <SdrChat />}
        {activeTab === 'captura' && <SdrCapture />}
        {activeTab === 'campanhas' && <SdrCampaign />}
        {activeTab === 'prompts_site' && <SdrSitePrompts />}
        
        {activeTab === 'admin' && <SdrAdmin />}
        {activeTab === 'configuracoes' && <LeadScannerSettings />}
        {activeTab === 'conta' && <LeadScannerAccount />}
      </div>

      {/* GLOBAL WHATSAPP CONNECTION MODAL */}
      {!dismissWa && globalWaData.status !== 'CONNECTED' && globalWaData.status !== 'CONNECTING' && globalWaData.status !== 'STARTING' && (
        <div className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#121212] border border-white/10 rounded-2xl p-8 max-w-md w-full shadow-2xl flex flex-col items-center text-center relative overflow-hidden animate-fade-in">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>
            
            <div className="w-20 h-20 bg-blue-500/10 rounded-full flex items-center justify-center mb-6 border border-blue-500/20 shadow-[0_0_30px_rgba(59,130,246,0.2)]">
              <Bot size={40} className="text-blue-400" />
            </div>
            
            <h2 className="text-2xl font-bold text-white mb-2">Conecte o WhatsApp</h2>
            <p className="text-gray-400 mb-8 text-sm">O Agente SDR precisa estar conectado ao WhatsApp para enviar mensagens e operar campanhas automaticamente.</p>
            
            {globalWaData.status === 'QR_READY' && globalWaData.qr ? (
              <div className="bg-white p-4 rounded-xl mb-6 shadow-lg shadow-white/5">
                <img src={globalWaData.qr} alt="QR Code WhatsApp" className="w-64 h-64 object-contain mx-auto" />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-48 mb-6 bg-white/5 rounded-xl w-full border border-white/5">
                <RefreshCcw size={32} className="text-gray-500 animate-spin mb-4" />
                <p className="text-gray-500 text-sm">Iniciando conexão...</p>
              </div>
            )}
            
            {globalWaData.status === 'QR_READY' && (
              <div className="w-full text-center p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 mb-6">
                <p className="text-sm font-bold text-emerald-400">
                  Aponte a câmera do WhatsApp para o código
                </p>
                <p className="text-xs text-gray-500 mt-1">Dispositivos conectados &gt; Conectar aparelho</p>
              </div>
            )}

            <button 
              onClick={() => setDismissWa(true)}
              className="px-4 py-2 text-xs text-gray-500 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
            >
              Continuar sem conectar por enquanto
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function SdrDashboard() {
  const [waData, setWaData] = useState({ status: 'DISCONNECTED', qr: null });
  const [leadStats, setLeadStats] = useState({
    total: 0,
    quentes: 0,
    mornos: 0,
    frios: 0
  });
  const [autoSend, setAutoSend] = useState({ enabled: false, running: false, stats: { sent: 0, failed: 0, skipped: 0, lastSentAt: null, lastLeadName: null }, pendingCount: 0 });
  const [togglingAuto, setTogglingAuto] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      // 1. Fetch WhatsApp Status
      try {
        const resWa = await fetch('/api/whatsapp/status');
        if (resWa.ok) setWaData(await resWa.json());
      } catch (e) {
        console.error("Erro ao buscar status do WhatsApp", e);
      }
      
      // 2. Fetch Leads Database
      try {
        const resLeads = await fetch('/api/leads?t=' + Date.now());
        if (resLeads.ok) {
          const json = await resLeads.json();
          if (json.data) {
            const leads = json.data;
            setLeadStats({
              total: leads.length,
              quentes: leads.filter(l => l.status === 'QUENTE').length,
              mornos: leads.filter(l => l.status === 'MORNO').length,
              frios: leads.filter(l => l.status === 'FRIO').length
            });
          }
        }
      } catch (e) {
        console.error("Erro ao buscar leads", e);
      }

      // 3. Fetch Auto-Send Status
      try {
        const resAuto = await fetch('/api/autosend/status');
        if (resAuto.ok) setAutoSend(await resAuto.json());
      } catch (e) {
        console.error("Erro ao buscar status do piloto automático", e);
      }
    };
    
    fetchData();
    const interval = setInterval(fetchData, 3000);
    return () => clearInterval(interval);
  }, []);

  const toggleAutoSend = async () => {
    setTogglingAuto(true);
    try {
      const res = await fetch('/api/autosend/toggle', { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        setAutoSend(prev => ({ ...prev, enabled: data.enabled }));
      }
    } catch (e) {
      console.error('Erro ao alternar piloto automático', e);
    }
    setTogglingAuto(false);
  };

  const resetAutoStats = async () => {
    try {
      await fetch('/api/autosend/reset-stats', { method: 'POST' });
    } catch (e) {}
  };

  const resetLeadFlags = async () => {
    if (!window.confirm('Isso vai permitir que TODOS os leads recebam mensagem novamente. Tem certeza?')) return;
    try {
      await fetch('/api/autosend/reset-leads', { method: 'POST' });
    } catch (e) {}
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <header className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Painel SDR</h1>
          <p className="text-gray-400">Visão geral do funil de conversão e performance do Agente IA.</p>
        </div>
        
        {/* WhatsApp Connection Status Widget */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center gap-4">
          <div className="flex flex-col">
            <span className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Status do Bot WhatsApp</span>
            {waData.status === 'CONNECTED' && <span className="text-emerald-400 font-bold flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div> Conectado e Operando</span>}
            {waData.status === 'QR_READY' && <span className="text-orange-400 font-bold flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-orange-400 animate-pulse"></div> Aguardando Leitura</span>}
            {waData.status === 'DISCONNECTED' && <span className="text-red-400 font-bold flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-red-400"></div> Desconectado</span>}
          </div>
          
          {waData.status === 'QR_READY' && waData.qr && (
            <div className="bg-white p-2 rounded-xl">
              <img src={waData.qr} alt="QR Code WhatsApp" className="w-48 h-48 object-contain" />
            </div>
          )}
          {waData.status === 'QR_READY' && (
             <div className="text-sm font-medium text-gray-400 max-w-[140px] text-center">
               Aponte a câmera do WhatsApp para iniciar
             </div>
          )}
        </div>
      </header>

      {/* PILOTO AUTOMÁTICO */}
      <div className={`border rounded-2xl p-6 relative overflow-hidden transition-all duration-500 ${
        autoSend.enabled 
          ? 'bg-gradient-to-r from-emerald-500/10 to-blue-500/10 border-emerald-500/30 shadow-[0_0_30px_rgba(16,185,129,0.1)]' 
          : 'bg-white/5 border-white/10'
      }`}>
        {autoSend.enabled && autoSend.running && (
          <div className="absolute top-0 left-0 h-1 w-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-emerald-400 to-blue-400 animate-pulse" style={{width: '100%'}}></div>
          </div>
        )}
        
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-xl transition-all duration-300 ${
              autoSend.enabled 
                ? 'bg-gradient-to-br from-emerald-500 to-blue-500 shadow-lg shadow-emerald-500/25' 
                : 'bg-white/10'
            }`}>
              <Rocket size={22} className="text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                Piloto Automático
                {autoSend.enabled && autoSend.running && (
                  <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full text-[10px] uppercase tracking-wider font-bold animate-pulse">Ativo</span>
                )}
                {autoSend.enabled && !autoSend.running && (
                  <span className="px-2 py-0.5 bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 rounded-full text-[10px] uppercase tracking-wider font-bold">Aguardando</span>
                )}
              </h3>
              <p className="text-xs text-gray-400">Envia mensagens automaticamente para novos leads</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {autoSend.enabled && (
              <div className="flex gap-1">
                <button onClick={resetAutoStats} title="Resetar estatísticas" className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors text-gray-400 hover:text-white">
                  <RotateCcw size={14} />
                </button>
                <button onClick={resetLeadFlags} title="Reenviar para todos" className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors text-gray-400 hover:text-white">
                  <RefreshCcw size={14} />
                </button>
              </div>
            )}
            <button 
              onClick={toggleAutoSend}
              disabled={togglingAuto || waData.status !== 'CONNECTED'}
              className={`relative flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 ${
                autoSend.enabled
                  ? 'bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500 hover:text-white'
                  : waData.status !== 'CONNECTED'
                    ? 'bg-gray-500/20 text-gray-500 border border-gray-500/20 cursor-not-allowed'
                    : 'bg-gradient-to-r from-emerald-500 to-blue-500 text-white shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:scale-105'
              }`}
            >
              {togglingAuto ? (
                <RefreshCcw size={16} className="animate-spin" />
              ) : autoSend.enabled ? (
                <><Pause size={16} /> Desativar</>
              ) : (
                <><Power size={16} /> Ativar Piloto</>
              )}
            </button>
          </div>
        </div>

        {waData.status !== 'CONNECTED' && !autoSend.enabled && (
          <div className="flex items-center gap-2 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-xl text-xs text-yellow-400">
            <AlertTriangle size={14} />
            <span>Conecte o WhatsApp primeiro para ativar o Piloto Automático.</span>
          </div>
        )}

        {(autoSend.enabled || autoSend.stats.sent > 0) && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mt-4">
            <div className="bg-black/30 rounded-xl p-3 text-center border border-white/5">
              <p className="text-2xl font-bold text-emerald-400">{autoSend.stats.sent}</p>
              <p className="text-[10px] text-gray-500 uppercase tracking-wider mt-1">Enviadas</p>
            </div>
            <div className="bg-black/30 rounded-xl p-3 text-center border border-white/5">
              <p className="text-2xl font-bold text-red-400">{autoSend.stats.failed}</p>
              <p className="text-[10px] text-gray-500 uppercase tracking-wider mt-1">Falhas</p>
            </div>
            <div className="bg-black/30 rounded-xl p-3 text-center border border-white/5">
              <p className="text-2xl font-bold text-yellow-400">{autoSend.stats.skipped}</p>
              <p className="text-[10px] text-gray-500 uppercase tracking-wider mt-1">Sem WhatsApp</p>
            </div>
            <div className="bg-black/30 rounded-xl p-3 text-center border border-white/5">
              <p className="text-2xl font-bold text-blue-400">{autoSend.pendingCount}</p>
              <p className="text-[10px] text-gray-500 uppercase tracking-wider mt-1">Pendentes</p>
            </div>
            <div className="bg-black/30 rounded-xl p-3 text-center border border-white/5">
              <p className="text-sm font-bold text-white truncate">{autoSend.stats.lastLeadName || '—'}</p>
              <p className="text-[10px] text-gray-500 uppercase tracking-wider mt-1">Último Envio</p>
              {autoSend.stats.lastSentAt && (
                <p className="text-[9px] text-gray-600 mt-0.5">{new Date(autoSend.stats.lastSentAt).toLocaleTimeString('pt-BR', {hour:'2-digit', minute:'2-digit'})}</p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* KPIs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <KpiCard title="Total de Leads" value={leadStats.total.toString()} icon={<Users size={20}/>} color="from-blue-500 to-blue-600" delay="0ms" trend="Base de dados" />
        <KpiCard title="Leads Quentes" value={leadStats.quentes.toString()} icon={<Zap size={20}/>} color="from-orange-500 to-red-500" delay="100ms" trend="Alta Conversão" />
        <KpiCard title="Leads Mornos" value={leadStats.mornos.toString()} icon={<Calendar size={20}/>} color="from-emerald-500 to-teal-500" delay="200ms" trend="Nutrição IA" />
        <KpiCard title="Leads Frios" value={leadStats.frios.toString()} icon={<MessageCircle size={20}/>} color="from-purple-500 to-pink-500" delay="300ms" trend="Descarte/Pesquisa" />
      </div>

      {/* Main Charts area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        <div className="lg:col-span-2 bg-white/5 border border-white/10 rounded-2xl p-6 relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2"><TrendingUp size={18} className="text-blue-400"/> Funil Visual de Conversão</h3>
          
          <div className="space-y-4">
            {/* Real Pipeline Bars */}
            <div>
              <div className="flex justify-between text-sm mb-1"><span className="text-gray-400">1. Base Total de Leads</span><span className="font-bold">{leadStats.total}</span></div>
              <div className="w-full bg-white/10 rounded-full h-3"><div className="bg-blue-500 h-3 rounded-full" style={{width: '100%'}}></div></div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1"><span className="text-gray-400">2. Mornos (Engajamento Inicial)</span><span className="font-bold">{leadStats.mornos}</span></div>
              <div className="w-full bg-white/10 rounded-full h-3"><div className="bg-purple-500 h-3 rounded-full" style={{width: `${leadStats.total > 0 ? (leadStats.mornos / leadStats.total) * 100 : 0}%`}}></div></div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1"><span className="text-gray-400">3. Quentes (Qualificados pela IA)</span><span className="font-bold">{leadStats.quentes}</span></div>
              <div className="w-full bg-white/10 rounded-full h-3"><div className="bg-orange-500 h-3 rounded-full" style={{width: `${leadStats.total > 0 ? (leadStats.quentes / leadStats.total) * 100 : 0}%`}}></div></div>
            </div>
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 relative overflow-hidden">
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2"><Activity size={18} className="text-emerald-400"/> Atividade Recente</h3>
          <div className="space-y-4">
            <ActivityItem time="Agora" title="Reunião Marcada" desc="Lead 'TechCorp' agendou call para amanhã." type="success" />
            <ActivityItem time="5m atrás" title="Follow-up Automático" desc="Mensagem de dia 3 enviada para 12 leads." type="info" />
            <ActivityItem time="12m atrás" title="Nova Resposta" desc="Lead interessado no plano Pro." type="warning" />
            <ActivityItem time="1h atrás" title="Classificação IA" desc="24 leads marcados como Quentes." type="default" />
          </div>
        </div>
      </div>
    </div>
  );
}

function KpiCard({ title, value, icon, color, delay, trend }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 relative overflow-hidden hover:-translate-y-1 transition-transform duration-300 group" style={{animationDelay: delay}}>
      <div className={`absolute -right-6 -top-6 w-24 h-24 bg-gradient-to-br ${color} rounded-full opacity-20 blur-xl group-hover:opacity-40 transition-opacity`}></div>
      <div className="flex justify-between items-start mb-4 relative z-10">
        <h3 className="text-sm text-gray-400 font-medium">{title}</h3>
        <div className={`p-2 rounded-lg bg-gradient-to-br ${color} bg-opacity-20 backdrop-blur-sm`}>
          {icon}
        </div>
      </div>
      <div className="relative z-10">
        <h2 className="text-3xl font-bold text-white tracking-tight">{value}</h2>
        <p className="text-xs text-emerald-400 mt-2 font-medium bg-emerald-400/10 inline-block px-2 py-1 rounded">{trend}</p>
      </div>
    </div>
  );
}

function ActivityItem({ time, title, desc, type }) {
  const colors = {
    success: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
    info: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
    warning: 'text-orange-400 bg-orange-400/10 border-orange-400/20',
    default: 'text-gray-400 bg-gray-400/10 border-gray-400/20'
  };
  return (
    <div className="flex gap-4 items-start">
      <div className={`mt-1 p-1.5 rounded-full border ${colors[type]}`}>
        <div className="w-1.5 h-1.5 rounded-full bg-current"></div>
      </div>
      <div>
        <p className="text-sm font-bold text-gray-200">{title} <span className="text-xs font-normal text-gray-500 ml-2">{time}</span></p>
        <p className="text-xs text-gray-400 mt-1">{desc}</p>
      </div>
    </div>
  );
}

function SdrChat() {
  const [messages, setMessages] = useState([
    { id: 1, sender: 'ia', text: 'Olá! Notei que vocês têm um tráfego interessante no Google, mas o site atual pode estar limitando as conversões. Como está a captação de clientes hoje?', time: '14:32' },
    { id: 2, sender: 'lead', text: 'Oi, a gente usa mais o Instagram e indicações mesmo.', time: '14:45' },
    { id: 3, sender: 'ia', text: 'Entendo perfeitamente. O Instagram é ótimo para visibilidade, mas ter um sistema próprio profissional ajuda a automatizar as vendas sem depender 100% da sua atenção no DM. Posso te enviar uma prévia de como ficaria um sistema focado em conversão para o seu nicho?', time: '14:46' },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const newMsg = { id: Date.now(), sender: 'lead', text: input, time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) };
    
    // Add user message to state
    const currentMessages = [...messages, newMsg];
    setMessages(currentMessages);
    setInput('');
    setIsTyping(true);

    try {
      // Prepare history for OpenAI
      const history = currentMessages.map(m => ({
        role: m.sender === 'ia' ? 'assistant' : 'user',
        content: m.text
      }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: newMsg.text,
          history: history.slice(0, -1), // Everything except the very last message we just sent, as it is sent in "message"
          leadInfo: {
            nome: 'Empresa Demo',
            nicho: 'Estética',
            cidade: 'São Paulo'
          }
        })
      });

      const data = await res.json();
      
      setIsTyping(false);
      
      if (data.error) {
        setMessages(prev => [...prev, {
          id: Date.now()+1, 
          sender: 'ia', 
          text: '⚠️ Erro: ' + data.error + (data.suggestion ? ' ' + data.suggestion : ''), 
          time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
        }]);
      } else {
        setMessages(prev => [...prev, {
          id: Date.now()+1, 
          sender: 'ia', 
          text: data.reply, 
          time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
        }]);
      }

    } catch (err) {
      setIsTyping(false);
      setMessages(prev => [...prev, {
        id: Date.now()+1, 
        sender: 'ia', 
        text: '⚠️ Falha ao conectar com o servidor local. Verifique se o server.js está rodando na porta 3001.', 
        time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
      }]);
    }
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col xl:flex-row gap-6 animate-slide-in">
      {/* Chat Area */}
      <div className="flex-1 bg-white/5 border border-white/10 rounded-2xl flex flex-col overflow-hidden relative shadow-2xl">
        <div className="p-4 border-b border-white/10 bg-black/40 backdrop-blur-md flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center border-2 border-black">
                <Bot size={20} className="text-white" />
              </div>
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-black rounded-full"></div>
            </div>
            <div>
              <h3 className="font-bold text-white flex items-center gap-2">Agente SDR Pro <span className="px-2 py-0.5 rounded text-[10px] bg-blue-500/20 text-blue-400 border border-blue-500/30 uppercase tracking-wider">IA</span></h3>
              <p className="text-xs text-emerald-400">Online e operando</p>
            </div>
          </div>
          <div className="flex gap-2">
            <span className="px-3 py-1 bg-orange-500/20 text-orange-400 border border-orange-500/30 rounded-full text-xs font-bold flex items-center gap-1">
              <Zap size={12}/> Lead Quente
            </span>
            <span className="px-3 py-1 bg-white/10 text-gray-300 rounded-full text-xs font-bold flex items-center gap-1 border border-white/10">
              Pontuação: 92/100
            </span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((m) => (
            <div key={m.id} className={`flex ${m.sender === 'ia' ? 'justify-start' : 'justify-end'}`}>
              <div className={`max-w-[70%] p-4 rounded-2xl relative group ${
                m.sender === 'ia' 
                  ? 'bg-white/10 rounded-tl-sm text-gray-200 border border-white/5 shadow-lg' 
                  : 'bg-gradient-to-r from-blue-600 to-blue-500 rounded-tr-sm text-white shadow-xl shadow-blue-500/20'
              }`}>
                <p className="text-sm leading-relaxed">{m.text}</p>
                <p className={`text-[10px] mt-2 opacity-0 group-hover:opacity-100 transition-opacity ${m.sender === 'ia' ? 'text-gray-400' : 'text-blue-200 text-right'}`}>{m.time}</p>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-white/10 border border-white/5 p-4 rounded-2xl rounded-tl-sm max-w-[70%]">
                <div className="flex gap-1.5 items-center h-4">
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={endRef} />
        </div>

        <div className="p-4 border-t border-white/10 bg-black/40">
          <div className="relative">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Simule a resposta do lead..." 
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-4 pr-12 py-3 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
            />
            <button onClick={handleSend} className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
              <Send size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Barra Lateral de Inteligência */}
      <div className="w-full xl:w-80 space-y-6">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <h3 className="font-bold mb-4 flex items-center gap-2"><ShieldCheck size={16} className="text-emerald-400"/> Análise Cognitiva do Lead</h3>
          <div className="space-y-4">
            <div>
              <p className="text-xs text-gray-400 mb-1">Intenção de Compra</p>
              <div className="w-full bg-white/10 rounded-full h-2"><div className="bg-orange-500 h-2 rounded-full" style={{width: '85%'}}></div></div>
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-1">Poder de Decisão</p>
              <div className="w-full bg-white/10 rounded-full h-2"><div className="bg-blue-500 h-2 rounded-full" style={{width: '95%'}}></div></div>
            </div>
            <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg mt-4">
              <p className="text-xs text-blue-200 leading-relaxed">
                <span className="font-bold text-blue-400">Insights da IA:</span> Este lead mostrou interesse ao mencionar que "usa mais o Instagram". A objeção principal é a falta de tempo/conhecimento técnico, não financeira. Estratégia atual: Oferecer a prévia visual gratuita para tangibilizar o valor.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <h3 className="font-bold mb-4 flex items-center gap-2"><Clock size={16} className="text-purple-400"/> Acompanhamentos Programados</h3>
          <div className="relative pl-4 border-l border-white/10 space-y-6">
            <div className="relative">
              <div className="absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-emerald-500 ring-4 ring-black"></div>
              <p className="text-sm font-bold">1 Hora (Enviada)</p>
              <p className="text-xs text-gray-400">Mensagem de conexão inicial.</p>
            </div>
            <div className="relative">
              <div className="absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-blue-500 ring-4 ring-black animate-pulse"></div>
              <p className="text-sm font-bold text-blue-400">Amanhã 09:00 (Pendente)</p>
              <p className="text-xs text-gray-400">Confirmação de interesse / Retomada.</p>
            </div>
            <div className="relative">
              <div className="absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-white/20 ring-4 ring-black"></div>
              <p className="text-sm font-bold text-gray-500">Dia 3 (Agendado)</p>
              <p className="text-xs text-gray-500">Gatilho de escassez / Oportunidade.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SdrCapture() {
  const [copied, setCopied] = useState(false);
  
  const handleCopy = () => {
    navigator.clipboard.writeText('<script src="https://api.leadscanner.ai/sdr/widget.js" data-id="xyz123"></script>');
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto py-8 animate-fade-in">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-white mb-4">Captura Inteligente</h1>
        <p className="text-gray-400 max-w-xl mx-auto">Configure os formulários inteligentes do seu site. Os dados são imediatamente enviados para a IA SDR que inicia a qualificação e conversa em segundos.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 relative overflow-hidden backdrop-blur-xl shadow-2xl">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500 rounded-full opacity-10 blur-3xl"></div>
          <h2 className="text-xl font-bold mb-6 text-white">Configurar Formulário</h2>
          
          <form className="space-y-4 relative z-10" onSubmit={e => e.preventDefault()}>
            <div>
              <label className="block text-xs font-bold text-gray-400 mb-1 uppercase tracking-wider">Campos Ativos</label>
              <div className="space-y-2 mt-2">
                {['Nome', 'Empresa', 'WhatsApp (obrigatório)', 'Nicho', 'Faturamento', 'Principal Dificuldade'].map((campo, i) => (
                  <label key={i} className="flex items-center gap-3 p-3 bg-white/5 border border-white/10 rounded-lg cursor-pointer hover:bg-white/10 transition-colors">
                    <input type="checkbox" defaultChecked={i < 4} className="w-4 h-4 rounded bg-black border-white/20 text-blue-500 focus:ring-blue-500 focus:ring-offset-gray-900" />
                    <span className="text-sm">{campo}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <button 
              onClick={handleCopy}
              className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-500/25 transition-all mt-6"
            >
              {copied ? 'Código Copiado!' : 'Gerar Código de Incorporação'}
            </button>
          </form>
        </div>

        <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border border-white/10 rounded-2xl p-8 flex flex-col justify-center items-center text-center shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
          
          <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(52,211,153,0.3)] rotate-3">
            <CheckCircle size={32} className="text-black" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-4">Automação Ativa</h2>
          <p className="text-gray-400 text-sm leading-relaxed mb-8">
            Sempre que um lead preencher o formulário, a Inteligência Artificial fará a classificação (Quente, Morno, Frio) e iniciará o contato no WhatsApp em <b>30 segundos</b> se estiver dentro do perfil.
          </p>
          
          <div className="w-full bg-black/40 p-4 rounded-xl border border-white/5 relative group cursor-pointer" onClick={handleCopy}>
            <p className="text-xs text-gray-500 font-mono text-left break-all">
              &lt;script src="https://api.leadscanner.ai/sdr/widget.js" data-id="xyz123"&gt;&lt;/script&gt;
            </p>
            <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-xl">
              <span className="bg-black/80 px-3 py-1 rounded text-xs font-bold text-white">Clique para copiar</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SdrCampaign() {
  const [templates, setTemplates] = useState([
    { id: 1, name: '🎯 Curiosidade', text: '{saudacao}, tudo bem? {emoji_oi}\n\n{vi} a {empresa} {tempo} e fiquei curioso...\n\nVocês já pensaram em ter um sistema próprio pra receber clientes direto pelo Google sem depender de plataforma?\n\nTenho algo bem interessante pra te mostrar. Posso enviar?' },
    { id: 2, name: '⭐ Elogio + Dor', text: '{saudacao}! {emoji_oi}\n\nParabéns pelo trabalho da {empresa}, vi que vocês têm ótimas avaliações!\n\nMas percebi que vocês ainda não têm um site/sistema próprio. Sabia que mais de 70% das pessoas desistem quando não encontram um site profissional?\n\nConsigo te mostrar uma prévia de como ficaria, sem compromisso. Posso enviar?' },
    { id: 3, name: '📱 Salvar Contato', text: '{saudacao}, tudo bem? {emoji_oi}\n\nMeu nome é [SEU NOME] e eu trabalho criando sistemas digitais pra empresas como a {empresa}.\n\nSalva meu contato aí que vou te mandar uma prévia GRATUITA de como ficaria um sistema profissional com a cara de vocês.\n\nSe gostar, a gente conversa. Se não, sem problema! {emoji}' },
    { id: 4, name: '🚀 Direto ao Ponto', text: 'Opa, beleza? {emoji_oi}\n\nVou ser direto: {vi} a {empresa} no Google e percebi uma oportunidade que vocês estão perdendo.\n\nConsigo montar uma prévia de site/sistema profissional pra vocês em 24h, de graça.\n\nSe fizer sentido a gente conversa. Quer ver?' },
    { id: 5, name: '🏆 Prova Social', text: '{saudacao}! {emoji}\n\nEstou trabalhando com várias empresas de {nicho} aqui em {cidade} e os resultados têm sido incríveis.\n\nUm cliente meu que estava na mesma situação triplicou os contatos em 30 dias.\n\nPosso te mostrar como ficaria algo assim pra {empresa}? Monto uma prévia sem compromisso {emoji}' },
  ]);
  const [leads, setLeads] = useState([]);
  const [selectedLeads, setSelectedLeads] = useState(new Set());
  const [campaign, setCampaign] = useState({ isRunning: false, total: 0, sent: 0, failed: 0, skipped: 0, currentLead: null });
  const [settings, setSettings] = useState({ delayMin: 45, delayMax: 120, batchSize: 15, batchPause: 600 });
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');
  const [editName, setEditName] = useState('');
  const [showNewForm, setShowNewForm] = useState(false);
  const [newName, setNewName] = useState('');
  const [newText, setNewText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiTone, setAiTone] = useState('consultivo');

  const [showBatchForm, setShowBatchForm] = useState(false);
  const [batchNiche, setBatchNiche] = useState('');
  const [batchCount, setBatchCount] = useState(16);
  const [batchSalesperson, setBatchSalesperson] = useState('Vitor Batista');
  const [batchService, setBatchService] = useState('criação de sites modernos e estratégicos');
  const [batchTone, setBatchTone] = useState('variado');
  const [isGeneratingBatch, setIsGeneratingBatch] = useState(false);

  const handleGenerateBatchAI = async () => {
    if (!batchNiche.trim()) return alert('Por favor, informe o nicho (ex: Academia).');
    setIsGeneratingBatch(true);
    try {
      const token = localStorage.getItem('sdr_jwt_token');
      const res = await fetch('/api/ai/generate-batch-templates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          niche: batchNiche,
          count: batchCount,
          salesperson: batchSalesperson,
          service: batchService,
          tone: batchTone
        })
      });
      const data = await res.json();
      if (data.success && data.templates) {
        setTemplates(data.templates);
        setShowBatchForm(false);
        alert(`Sucesso! ${data.count} validações automáticas geradas e configuradas para a campanha.`);
      } else if (data.error) {
        alert("Erro ao gerar: " + data.error);
      }
    } catch(e) {
      alert("Erro ao conectar com o servidor.");
    }
    setIsGeneratingBatch(false);
  };

  const handleGenerateAI = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch('/api/ai/generate-template', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tone: aiTone })
      });
      const data = await res.json();
      if (data.template) {
        setNewText(data.template);
        if (!newName) setNewName(`Abordagem IA - ${aiTone.charAt(0).toUpperCase() + aiTone.slice(1)}`);
      } else if (data.error) {
        alert("Erro da IA: " + data.error);
      }
    } catch(e) {
      alert("Erro de conexão com a IA.");
    }
    setIsGenerating(false);
  };

  useEffect(() => {
    fetch('/api/leads?t=' + Date.now()).then(r => r.json()).then(j => { 
      if (j.data) {
        setLeads(j.data); 
        const pre = sessionStorage.getItem('preSelectedLeads');
        if (pre) {
          try {
            const preIds = new Set(JSON.parse(pre));
            const validPreIds = j.data.filter(l => preIds.has(l.id) && l.whatsapp && String(l.whatsapp).replace(/\D/g, '').length > 5).map(l => l.id);
            setSelectedLeads(new Set(validPreIds));
          } catch(e) {}
        }
      }
    }).catch(() => {});
    fetch('/api/whatsapp/templates').then(r => r.json()).then(j => { if (j.data?.length) setTemplates(j.data); }).catch(() => {});
  }, []);

  useEffect(() => {
    fetch('/api/whatsapp/campaign/status').then(r => r.json()).then(setCampaign).catch(() => {});
    if (!campaign.isRunning) return;
    const interval = setInterval(() => {
      fetch('/api/whatsapp/campaign/status').then(r => r.json()).then(setCampaign).catch(() => {});
    }, 3000);
    return () => clearInterval(interval);
  }, [campaign.isRunning]);

  const saveTemplates = (newList) => { setTemplates(newList); fetch('/api/whatsapp/templates', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ templates: newList }) }).catch(() => {}); };
  const toggleLead = (id) => { setSelectedLeads(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; }); };
  const selectAll = () => { const valid = leads.filter(l => l.whatsapp && String(l.whatsapp).replace(/\D/g, '').length > 5); setSelectedLeads(new Set(valid.map(l => l.id))); };

  const startCampaign = async () => {
    const selected = leads.filter(l => selectedLeads.has(l.id) && l.whatsapp && String(l.whatsapp).replace(/\D/g, '').length > 5);
    const tpls = templates.map(t => t.content || t.text).filter(Boolean);
    if (!selected.length) return alert('Selecione pelo menos um lead.');
    if (!tpls.length) return alert('Crie pelo menos um template.');
    if (!window.confirm(`Iniciar campanha para ${selected.length} leads com ${templates.length} templates?\n\nDelay: ${settings.delayMin}-${settings.delayMax}s\nLote: ${settings.batchSize} mensagens\nPausa entre lotes: ${Math.floor(settings.batchPause/60)} min`)) return;

    try {
      const res = await fetch('/api/whatsapp/campaign/start', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ leads: selected, templates: tpls, ...settings }) });
      const data = await res.json();
      if (data.error) return alert('Erro: ' + data.error);
      setCampaign({ isRunning: true, total: selected.length, sent: 0, failed: 0, skipped: 0, currentLead: null });
    } catch (e) { alert('Erro ao conectar com o servidor.'); }
  };

  const stopCampaign = async () => { try { await fetch('/api/whatsapp/campaign/stop', { method: 'POST' }); } catch (e) {} };

  const handleDeleteAll = async () => {
    if (leads.length === 0) return;
    if (!window.confirm(`Tem certeza que deseja excluir TODOS os ${leads.length} leads da base?`)) return;
    for (const lead of leads) {
      if (lead.id) {
        try { await fetch(`/api/leads/${lead.id}`, { method: 'DELETE' }); } catch (e) {}
      }
    }
    setLeads([]);
    setSelectedLeads(new Set());
  };

  const progress = campaign.total > 0 ? Math.round(((campaign.sent + campaign.failed + campaign.skipped) / campaign.total) * 100) : 0;

  return (
    <div className="animate-fade-in space-y-6">
      <header className="mb-4">
        <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3"><Megaphone className="text-emerald-400" /> Campanhas Anti-Ban</h1>
        <p className="text-gray-400">Envie mensagens humanizadas com rotação automática de templates para evitar bloqueios do WhatsApp.</p>
      </header>

      {/* Campaign Progress */}
      {(campaign.isRunning || (campaign.actionLog && campaign.actionLog.length > 0)) && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 h-1 bg-emerald-500 transition-all duration-500" style={{width: `${progress}%`}}></div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-emerald-400 flex items-center gap-2"><RefreshCcw size={16} className="animate-spin" /> {campaign.isRunning ? 'Campanha em Andamento' : 'Logs da Última Campanha'}</h3>
            {campaign.isRunning && <button onClick={stopCampaign} className="px-4 py-2 bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg text-sm font-bold hover:bg-red-500 hover:text-white transition-colors flex items-center gap-2"><Square size={14} /> Parar</button>}
          </div>
          <div className="grid grid-cols-5 gap-4 text-center">
            <div><p className="text-2xl font-bold text-white">{progress}%</p><p className="text-xs text-gray-400">Progresso</p></div>
            <div><p className="text-2xl font-bold text-emerald-400">{campaign.sent}</p><p className="text-xs text-gray-400">Enviadas</p></div>
            <div><p className="text-2xl font-bold text-red-400">{campaign.failed}</p><p className="text-xs text-gray-400">Falhas</p></div>
            <div><p className="text-2xl font-bold text-yellow-400">{campaign.skipped}</p><p className="text-xs text-gray-400">Puladas</p></div>
            <div><p className="text-sm font-bold text-white truncate">{campaign.currentLead || '...'}</p><p className="text-xs text-gray-400">Lead Atual</p></div>
          </div>
          
          {/* Action Log Real-time */}
          {campaign.actionLog && campaign.actionLog.length > 0 && (
            <div className="mt-6 pt-4 border-t border-emerald-500/20">
              <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-3">Logs de Disparo em Tempo Real</h4>
              <div className="bg-black/40 rounded-lg p-3 max-h-40 overflow-y-auto space-y-2 font-mono text-[11px] custom-scrollbar">
                {campaign.actionLog.map((log, i) => (
                  <div key={i} className="flex items-center justify-between border-b border-white/5 pb-2 last:border-0 last:pb-0">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500">[{log.time}]</span>
                      <span className="text-white truncate max-w-[200px]">{log.lead}</span>
                    </div>
                    <span className={`px-2 py-0.5 rounded font-bold ${log.status === 'Enviada' ? 'bg-emerald-500/20 text-emerald-400' : log.status === 'Falha' ? 'bg-red-500/20 text-red-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                      {log.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Templates */}
        <div className="xl:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Shuffle size={18} className="text-blue-400" /> Modelos de Mensagem <span className="text-xs text-gray-500 font-normal">({templates.length} variações)</span>
            </h3>
            <div className="flex gap-2">
              {templates.length > 0 && (
                <button 
                  onClick={() => {
                    if (window.confirm('Tem certeza que deseja apagar TODAS as mensagens da campanha?')) {
                      saveTemplates([]);
                    }
                  }} 
                  className="px-3 py-1.5 bg-red-500/10 text-red-400 border border-red-500/20 rounded-lg text-sm font-bold hover:bg-red-500 hover:text-white transition-colors flex items-center gap-1.5 shadow-[0_0_10px_rgba(239,68,68,0.1)]"
                >
                  <Trash2 size={14} /> Limpar Tudo
                </button>
              )}
              <button 
                onClick={() => { setShowBatchForm(!showBatchForm); setShowNewForm(false); }} 
                className="px-3 py-1.5 bg-purple-500/20 text-purple-400 border border-purple-500/30 rounded-lg text-sm font-bold hover:bg-purple-500 hover:text-white transition-colors flex items-center gap-1.5 shadow-[0_0_10px_rgba(168,85,247,0.1)]"
              >
                <Bot size={14} /> Gerar em Massa (IA)
              </button>
              <button 
                onClick={() => { setShowNewForm(!showNewForm); setShowBatchForm(false); }} 
                className="px-3 py-1.5 bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-lg text-sm font-bold hover:bg-blue-500 hover:text-white transition-colors flex items-center gap-1"
              >
                <Plus size={14} /> Novo
              </button>
            </div>
          </div>

          {showBatchForm && (
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 flex flex-column gap-4">
              <div className="flex items-center gap-2 pb-2 border-b border-white/10">
                <Bot size={18} className="text-primary" />
                <h4 className="font-bold text-sm text-primary">Criar Múltiplas Validações Automáticas (IA)</h4>
              </div>
              
              <div className="grid-2">
                <div>
                  <label className="text-xs text-muted font-bold mb-2" style={{ display: 'block' }}>🎯 Nicho / Segmento do Lead</label>
                  <input 
                    value={batchNiche} 
                    onChange={e => setBatchNiche(e.target.value)} 
                    placeholder="Ex: Academia de Crossfit, Restaurante de Sushi, Imobiliária" 
                    className="bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-sm text-white" 
                  />
                </div>
                <div>
                  <label className="text-xs text-muted font-bold mb-2" style={{ display: 'block' }}>👤 Nome do Vendedor (Remetente)</label>
                  <input 
                    value={batchSalesperson} 
                    onChange={e => setBatchSalesperson(e.target.value)} 
                    placeholder="Ex: Vitor Batista" 
                    className="bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-sm text-white" 
                  />
                </div>
              </div>

              <div className="grid-2">
                <div>
                  <label className="text-xs text-muted font-bold mb-2" style={{ display: 'block' }}>⚙️ Serviço Oferecido</label>
                  <input 
                    value={batchService} 
                    onChange={e => setBatchService(e.target.value)} 
                    placeholder="Ex: criação de sites modernos e estratégicos" 
                    className="bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-sm text-white" 
                  />
                </div>
                <div>
                  <label className="text-xs text-muted font-bold mb-2" style={{ display: 'block' }}>🔢 Quantidade de Mensagens Únicas (Validações)</label>
                  <div className="flex gap-2">
                    {[10, 16, 20, 50].map(c => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setBatchCount(c)}
                        className={`flex-1 btn btn-sm ${batchCount === c ? 'btn-primary' : 'btn-secondary'}`}
                      >
                        {c}
                      </button>
                    ))}
                    <input 
                      type="number" 
                      value={batchCount} 
                      onChange={e => setBatchCount(Math.min(50, Math.max(1, parseInt(e.target.value) || 1)))} 
                      className="bg-black/30 border border-white/10 rounded-lg px-2 text-center text-sm text-white" 
                      style={{ width: '70px' }}
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 mb-4 mt-4">
                <div>
                  <label className="text-xs text-purple-300 font-bold mb-2 flex items-center gap-1.5" style={{ display: 'block' }}>
                    🎭 Tom / Estilo da Mensagem
                  </label>
                  <select 
                    value={batchTone} 
                    onChange={e => setBatchTone(e.target.value)} 
                    className="w-full bg-black/50 border border-purple-500/30 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500"
                  >
                    <option value="variado">Variado (Recomendado - Mescla abordagens)</option>
                    <option value="agressivo">Agressivo (Direto ao ponto, focado na venda)</option>
                    <option value="curioso">Curioso (Gera curiosidade antes de oferecer)</option>
                    <option value="consultivo">Consultivo (Foco em ajudar e empatia)</option>
                    <option value="amigável">Amigável e Casual (Super informal)</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button 
                  onClick={handleGenerateBatchAI} 
                  disabled={isGeneratingBatch} 
                  className="flex-1 btn btn-primary flex items-center justify-center gap-2 disabled-opacity-50"
                  style={{ background: isGeneratingBatch ? 'rgba(255,255,255,0.05)' : undefined }}
                >
                  {isGeneratingBatch ? <RefreshCcw size={14} className="animate-spin" /> : <Bot size={14} />}
                  {isGeneratingBatch ? `Gerando ${batchCount} mensagens com IA (aguarde)...` : `Gerar ${batchCount} Mensagens Anti-Ban no Automático`}
                </button>
                <button 
                  onClick={() => setShowBatchForm(false)} 
                  className="btn btn-secondary"
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}

          {showNewForm && (
            <div className="bg-white/5 border border-blue-500/30 rounded-xl p-4 space-y-3">
              <div className="flex gap-2 mb-2 p-3 bg-purple-500/10 rounded-lg border border-purple-500/20 items-end">
                <div className="flex-1">
                  <label className="text-xs text-purple-300 font-bold mb-1 block">🪄 Gerador com Inteligência Artificial</label>
                  <select value={aiTone} onChange={e => setAiTone(e.target.value)} className="w-full bg-black/50 border border-purple-500/30 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none">
                    <option value="consultivo">Especialista (Consultivo e Empático)</option>
                    <option value="agressivo">Direto ao Ponto (Focado em Resultado)</option>
                    <option value="curioso">Curto e Curioso (Gera Respostas)</option>
                    <option value="amigavel">Amigável e Casual</option>
                  </select>
                </div>
                <button onClick={handleGenerateAI} disabled={isGenerating} className="px-4 py-1.5 h-[34px] bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-xs font-bold transition-colors shadow-[0_0_15px_rgba(168,85,247,0.4)] flex items-center gap-2">
                  {isGenerating ? <RefreshCcw size={14} className="animate-spin" /> : <Bot size={14} />}
                  {isGenerating ? 'Gerando...' : 'Criar Abordagem Única'}
                </button>
              </div>
              <input value={newName} onChange={e => setNewName(e.target.value)} placeholder="Nome do modelo (ex: Acompanhamento)" className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500" />
              <textarea value={newText} onChange={e => setNewText(e.target.value)} placeholder="Texto da mensagem... Use {saudacao}, {nome}, {empresa}, {emoji}, etc." rows={5} className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500 resize-none" />
              <p className="text-xs text-gray-400">Dica Anti-Ban: Use Spintax para variar o texto automaticamente. Ex: <span className="text-blue-400 font-mono">{`{Oi|Olá|Opa}`}</span> {`{nome}`}, <span className="text-blue-400 font-mono">{`{tudo bem?|como vai?}`}</span></p>
              <div className="flex gap-2">
                <button onClick={() => { if(!newName.trim()||!newText.trim()) return; const nt = [...templates, { id: Date.now(), name: newName, content: newText }]; saveTemplates(nt); setNewName(''); setNewText(''); setShowNewForm(false); }} className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-bold">Salvar</button>
                <button onClick={() => setShowNewForm(false)} className="px-4 py-2 bg-white/10 text-gray-400 rounded-lg text-sm">Cancelar</button>
              </div>
            </div>
          )}

          {templates.map((t) => (
            <div key={t.id} className="bg-white/5 border border-white/10 rounded-xl p-4 group hover:border-white/20 transition-colors">
              {editingId === t.id ? (
                <div className="space-y-3">
                  <input value={editName} onChange={e => setEditName(e.target.value)} className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500" />
                  <textarea value={editText} onChange={e => setEditText(e.target.value)} rows={6} className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500 resize-none font-mono" />
                  <p className="text-xs text-gray-400">Dica Anti-Ban: Use Spintax para variar o texto automaticamente. Ex: <span className="text-emerald-400 font-mono">{`{Oi|Olá|Opa}`}</span> {`{nome}`}, <span className="text-emerald-400 font-mono">{`{tudo bem?|como vai?}`}</span></p>
                  <div className="flex gap-2">
                    <button onClick={() => { const nt = templates.map(x => x.id === t.id ? {...x, name: editName, content: editText} : x); saveTemplates(nt); setEditingId(null); }} className="px-3 py-1.5 bg-emerald-500 text-white rounded-lg text-xs font-bold">Salvar</button>
                    <button onClick={() => setEditingId(null)} className="px-3 py-1.5 bg-white/10 text-gray-400 rounded-lg text-xs">Cancelar</button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-bold text-white text-sm">{t.name}</h4>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => { setEditingId(t.id); setEditName(t.name); setEditText(t.content || t.text); }} className="p-1.5 bg-white/10 rounded-lg hover:bg-blue-500 transition-colors"><PenLine size={12} /></button>
                      <button onClick={() => { navigator.clipboard.writeText(t.content || t.text); }} className="p-1.5 bg-white/10 rounded-lg hover:bg-blue-500 transition-colors"><Copy size={12} /></button>
                      <button onClick={() => { if (window.confirm('Excluir este modelo?')) saveTemplates(templates.filter(x => x.id !== t.id)); }} className="p-1.5 bg-white/10 rounded-lg hover:bg-red-500 transition-colors"><Trash2 size={12} /></button>
                    </div>
                  </div>
                  <pre className="text-xs text-gray-400 whitespace-pre-wrap font-sans leading-relaxed max-h-32 overflow-y-auto">{t.content || t.text}</pre>
                </>
              )}
            </div>
          ))}
        </div>

        {/* Right Panel */}
        <div className="space-y-4">
          {/* Variables Reference */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-4">
            <h4 className="font-bold text-white text-sm mb-3 flex items-center gap-2"><Zap size={14} className="text-yellow-400" /> Variáveis Disponíveis</h4>
            <div className="space-y-1.5 text-xs">
              {[
                ['{saudacao}', 'Oi, Olá, Fala... (aleatório)'],
                ['{nome}', 'Nome da empresa'],
                ['{empresa}', 'Nome da empresa'],
                ['{nicho}', 'Segmento do lead'],
                ['{cidade}', 'Cidade do lead'],
                ['{emoji_oi}', '👋, ✌️... (aleatório)'],
                ['{emoji}', '😊, 🙂, 🤝... (aleatório)'],
                ['{tempo}', 'hoje, recentemente... (aleatório)'],
                ['{vi}', 'Vi, Encontrei, Achei... (aleatório)'],
              ].map(([v, d]) => (
                <div key={v} className="flex gap-2 items-start">
                  <code className="bg-blue-500/20 text-blue-400 px-1.5 py-0.5 rounded text-[10px] font-mono shrink-0">{v}</code>
                  <span className="text-gray-500">{d}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Anti-Ban Tips */}
          <div className="bg-orange-500/5 border border-orange-500/20 rounded-xl p-4">
            <h4 className="font-bold text-orange-400 text-sm mb-3 flex items-center gap-2"><AlertTriangle size={14} /> Dicas Anti-Bloqueio</h4>
            <ul className="space-y-2 text-xs text-gray-400">
              <li className="flex gap-2"><CheckCircle size={12} className="text-emerald-400 shrink-0 mt-0.5" /> Use pelo menos 3-5 modelos diferentes</li>
              <li className="flex gap-2"><CheckCircle size={12} className="text-emerald-400 shrink-0 mt-0.5" /> Intervalo mínimo de 45s entre mensagens</li>
              <li className="flex gap-2"><CheckCircle size={12} className="text-emerald-400 shrink-0 mt-0.5" /> Máximo 15-20 mensagens por lote</li>
              <li className="flex gap-2"><CheckCircle size={12} className="text-emerald-400 shrink-0 mt-0.5" /> Pausa de 10+ min entre lotes</li>
              <li className="flex gap-2"><CheckCircle size={12} className="text-emerald-400 shrink-0 mt-0.5" /> Use {'{saudacao}'} e {'{emoji}'} para variar</li>
              <li className="flex gap-2"><CheckCircle size={12} className="text-emerald-400 shrink-0 mt-0.5" /> Envie no máx 50-80 msgs/dia</li>
            </ul>
          </div>

          {/* Campaign Settings */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-4">
            <h4 className="font-bold text-white text-sm mb-3 flex items-center gap-2"><Clock size={14} className="text-purple-400" /> Configurações de Envio</h4>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Intervalo entre mensagens (seg)</label>
                <div className="flex gap-2">
                  <input type="number" value={settings.delayMin} onChange={e => setSettings(s => ({...s, delayMin: +e.target.value}))} className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white" placeholder="Mín" />
                  <span className="text-gray-500 flex items-center">a</span>
                  <input type="number" value={settings.delayMax} onChange={e => setSettings(s => ({...s, delayMax: +e.target.value}))} className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white" placeholder="Máx" />
                </div>
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Mensagens por lote</label>
                <input type="number" value={settings.batchSize} onChange={e => setSettings(s => ({...s, batchSize: +e.target.value}))} className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white" />
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Pausa entre lotes (seg)</label>
                <input type="number" value={settings.batchPause} onChange={e => setSettings(s => ({...s, batchPause: +e.target.value}))} className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white" />
                <p className="text-[10px] text-gray-600 mt-1">= {Math.floor(settings.batchPause / 60)} minutos</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lead Selector + Launch */}
      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-white/10 bg-black/40 flex justify-between items-center flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <h3 className="font-bold text-white flex items-center gap-2"><Users size={16} /> Selecionar Leads</h3>
            <span className="text-xs text-gray-500">{selectedLeads.size} de {leads.filter(l => l.whatsapp && String(l.whatsapp).replace(/\D/g, '').length > 5).length} selecionados</span>
          </div>
          <div className="flex gap-2 flex-wrap justify-end">
            <button onClick={selectAll} className="px-3 py-1.5 bg-white/10 text-gray-300 rounded-lg text-xs font-bold hover:bg-white/20 transition-colors">Selecionar Todos</button>
            <button onClick={() => setSelectedLeads(new Set())} className="px-3 py-1.5 bg-white/10 text-gray-300 rounded-lg text-xs font-bold hover:bg-white/20 transition-colors">Limpar Seleção</button>
            <button onClick={handleDeleteAll} className="px-3 py-1.5 bg-red-500/10 text-red-400 border border-red-500/20 rounded-lg text-xs font-bold hover:bg-red-500 hover:text-white transition-colors">Excluir Todos da Base</button>
            <button onClick={startCampaign} disabled={campaign.isRunning || selectedLeads.size === 0} className={`px-6 py-1.5 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors ${campaign.isRunning || selectedLeads.size === 0 ? 'bg-gray-500/30 text-gray-500 cursor-not-allowed' : 'bg-emerald-500 text-white hover:bg-emerald-600 shadow-lg shadow-emerald-500/25'}`}>
              <Play size={14} /> {campaign.isRunning ? 'Em andamento...' : 'Iniciar Campanha'}
            </button>
          </div>
        </div>
        <div className="max-h-[300px] overflow-y-auto">
          {leads.length === 0 ? (
            <div className="p-8 text-center text-gray-500"><Users size={40} className="mx-auto mb-3 opacity-20" /><p>Nenhum lead na base. Use a extração primeiro.</p></div>
          ) : (
            <table className="w-full text-left text-sm text-gray-300">
              <thead className="text-xs text-gray-400 uppercase bg-black/20 border-b border-white/5 sticky top-0">
                <tr><th className="px-4 py-3 w-10"></th><th className="px-4 py-3">Nome</th><th className="px-4 py-3">Nicho</th><th className="px-4 py-3">WhatsApp</th><th className="px-4 py-3">Nota</th></tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {leads
                  .filter(l => l.whatsapp && String(l.whatsapp).replace(/\D/g, '').length > 5)
                  .sort((a, b) => {
                    const aSelected = selectedLeads.has(a.id) ? 1 : 0;
                    const bSelected = selectedLeads.has(b.id) ? 1 : 0;
                    return bSelected - aSelected;
                  })
                  .map(l => (
                  <tr key={l.id} className={`hover:bg-white/5 transition-colors cursor-pointer ${selectedLeads.has(l.id) ? 'bg-emerald-500/5' : ''}`} onClick={() => toggleLead(l.id)}>
                    <td className="px-4 py-2"><input type="checkbox" checked={selectedLeads.has(l.id)} onChange={() => {}} className="w-4 h-4 rounded" /></td>
                    <td className="px-4 py-2 font-bold text-white">{l.nome}</td>
                    <td className="px-4 py-2 text-gray-400">{l.nicho}</td>
                    <td className="px-4 py-2 text-gray-400">{l.whatsapp}</td>
                    <td className="px-4 py-2 text-gray-400">{l.nota || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

function SdrAdmin() {
  const [leads, setLeads] = useState([]);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('Todos os Status');
  const [loading, setLoading] = useState(true);
  const [isCleaning, setIsCleaning] = useState(false);

  const fetchLeads = async () => {
    try {
      const res = await fetch('/api/leads?t=' + Date.now());
      const json = await res.json();
      if (json.data) setLeads(json.data.reverse()); // latest first
    } catch (e) {
      console.error('Failed to fetch leads:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
    const interval = setInterval(fetchLeads, 10000); // refresh every 10s
    return () => clearInterval(interval);
  }, []);

  const handleClean = async () => {
    if (!window.confirm('Isto irá verificar todos os leads e excluir os que não possuem WhatsApp ativo. Pode demorar alguns minutos. Deseja continuar?')) return;
    setIsCleaning(true);
    try {
      const res = await fetch('/api/leads/clean', { method: 'POST' });
      const data = await res.json();
      if (data.error) {
        alert('Erro: ' + data.error);
      } else {
        alert(`Limpeza concluída! ${data.removed} leads sem WhatsApp foram removidos.`);
        fetchLeads();
      }
    } catch (e) {
      alert('Erro ao limpar base.');
      console.error(e);
    } finally {
      setIsCleaning(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir este lead? Essa ação não pode ser desfeita.')) return;
    
    // Otimista: remove da UI na mesma hora
    setLeads(prev => prev.filter(l => l.id !== id && l.whatsapp !== id));
    
    try {
      await fetch(`/api/leads/${id}`, { method: 'DELETE' });
    } catch (e) {
      console.error("Erro ao excluir", e);
      fetchLeads(); // resync if failed
    }
  };

  const filteredLeads = leads.filter(l => {
    const matchSearch = l.nome?.toLowerCase().includes(search.toLowerCase()) || l.nicho?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'Todos os Status' || l.status?.toUpperCase() === filterStatus.toUpperCase();
    return matchSearch && matchStatus;
  });

  const getStatusBadge = (status) => {
    const s = (status || 'FRIO').toUpperCase();
    if (s === 'QUENTE') return <span className="px-2 py-1 bg-orange-500/20 text-orange-400 rounded text-xs font-bold border border-orange-500/20">QUENTE</span>;
    if (s === 'MORNO') return <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-xs font-bold border border-blue-500/20">MORNO</span>;
    return <span className="px-2 py-1 bg-gray-500/20 text-gray-400 rounded text-xs font-bold border border-gray-500/20">FRIO</span>;
  };

  const getScoreColor = (score) => {
    if (score >= 70) return 'bg-orange-500';
    if (score >= 40) return 'bg-blue-500';
    return 'bg-gray-500';
  };

  return (
    <div className="animate-fade-in">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Gestão de Leads e Administração</h1>
        <p className="text-gray-400">Controle total sobre o banco de dados e histórico de qualificações do SDR.</p>
      </header>
      
      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
        <div className="p-4 border-b border-white/10 bg-black/40 flex justify-between items-center flex-wrap gap-4">
          <div className="flex gap-2 w-full md:w-auto">
            <input 
              type="text" 
              placeholder="Buscar lead..." 
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="bg-black/50 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-blue-500 w-full md:w-64" 
            />
            <select 
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value)}
              className="bg-black/50 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-blue-500 appearance-none"
            >
              <option>Todos os Status</option>
              <option value="QUENTE">Quentes</option>
              <option value="MORNO">Mornos</option>
              <option value="FRIO">Frios</option>
            </select>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={handleClean}
              disabled={isCleaning}
              className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-colors border flex items-center gap-2 ${isCleaning ? 'bg-orange-500/50 text-white cursor-not-allowed border-orange-500/50' : 'bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 border-orange-500/20'}`}
            >
              {isCleaning ? <RefreshCcw size={16} className="spin animate-spin" /> : <ShieldCheck size={16} />}
              {isCleaning ? 'Validando...' : 'Limpar Sem WhatsApp'}
            </button>
            <button className="px-4 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-bold text-white transition-colors border border-white/5">
              Exportar CSV
            </button>
          </div>
        </div>
        <div className="overflow-x-auto min-h-[300px]">
          {loading ? (
            <div className="flex justify-center items-center h-48">
              <RefreshCcw className="spin text-blue-500" size={24} />
            </div>
          ) : filteredLeads.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-gray-500">
              <Users size={48} className="mb-4 opacity-20" />
              <p>Nenhum lead encontrado.</p>
              <p className="text-sm mt-1">Use a Extração do Google Maps para popular a base!</p>
            </div>
          ) : (
            <table className="w-full text-left text-sm text-gray-300">
              <thead className="text-xs text-gray-400 uppercase bg-black/20 border-b border-white/5">
                <tr>
                  <th className="px-6 py-4">Nome do Lead</th>
                  <th className="px-6 py-4">Empresa / Nicho</th>
                  <th className="px-6 py-4">Status IA</th>
                  <th className="px-6 py-4">Telefone</th>
                  <th className="px-6 py-4">Pontuação</th>
                  <th className="px-6 py-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 bg-transparent">
                {filteredLeads.map((l, i) => (
                  <tr key={l.id || i} className="hover:bg-white/5 transition-colors group">
                    <td className="px-6 py-4 font-bold text-white">{l.nome}</td>
                    <td className="px-6 py-4 text-gray-400">{l.nicho || l.cidade}</td>
                    <td className="px-6 py-4">{getStatusBadge(l.status)}</td>
                    <td className="px-6 py-4 text-gray-400">{l.whatsapp}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold w-6">{l.score || 0}</span>
                        <div className="w-full bg-white/10 h-1.5 rounded-full">
                          <div className={`${getScoreColor(l.score)} h-1.5 rounded-full`} style={{width: `${Math.min(l.score || 0, 100)}%`}}></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => handleDelete(l.id || l.whatsapp)}
                        className="p-2 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white rounded transition-colors"
                        title="Excluir lead"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

function SdrScanner() {
  const [query, setQuery] = useState('');
  const [location, setLocation] = useState('');
  const [limit, setLimit] = useState(100);
  const [isScraping, setIsScraping] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');

  const handleScrape = async (e) => {
    e.preventDefault();
    if (!query || !location) return setError('Preencha o nicho e a localidade.');
    setIsScraping(true);
    setError('');
    setResults(null);
    try {
      const res = await fetch(`http://localhost:3001/api/scrape?query=${encodeURIComponent(query)}&location=${encodeURIComponent(location)}&limit=${limit}`);
      const data = await res.json();
      if (data.error) setError(data.error);
      else setResults(data.data);
    } catch (err) {
      setError('Falha ao conectar com o servidor local. Verifique se o bot está rodando.');
    }
    setIsScraping(false);
  };

  return (
    <div className="animate-fade-in space-y-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3"><Bot className="text-blue-400" /> AI SDR PRO (Extrator Massivo)</h1>
        <p className="text-gray-400">Busca e extrai leads do Google Maps, valida números de WhatsApp e adiciona diretamente ao seu funil.</p>
      </header>

      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-xl">
        <form onSubmit={handleScrape} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div className="md:col-span-1">
            <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider">Nicho / Negócio</label>
            <input 
              type="text" 
              value={query} 
              onChange={e => setQuery(e.target.value)} 
              placeholder="Ex: Clínicas, Lojas..." 
              className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>
          <div className="md:col-span-1">
            <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider">Localidade</label>
            <input 
              type="text" 
              value={location} 
              onChange={e => setLocation(e.target.value)} 
              placeholder="Ex: São Paulo, SP" 
              className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>
          <div className="md:col-span-1">
            <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider">Limite de Busca</label>
            <input 
              type="number" 
              value={limit} 
              onChange={e => setLimit(e.target.value)} 
              max="500"
              className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>
          <div className="md:col-span-1">
            <button 
              type="submit" 
              disabled={isScraping}
              className={`w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
                isScraping ? 'bg-blue-500/50 text-white cursor-not-allowed' : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white shadow-[0_0_15px_rgba(59,130,246,0.5)]'
              }`}
            >
              {isScraping ? <RefreshCcw className="animate-spin" size={18} /> : <Bot size={18} />}
              {isScraping ? 'Extraindo...' : 'Iniciar Extração'}
            </button>
          </div>
        </form>
        {error && <p className="text-red-400 text-sm mt-4 font-bold">{error}</p>}
      </div>

      {isScraping && (
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-12 flex flex-col items-center justify-center text-center animate-pulse">
          <Bot size={48} className="text-blue-400 mb-4 animate-bounce" />
          <h3 className="text-xl font-bold text-blue-400 mb-2">O Robô está trabalhando...</h3>
          <p className="text-gray-400 text-sm max-w-md">O processo usa um navegador invisível para navegar no Google Maps, extrair dados e validar se os números possuem WhatsApp ativo. Isso pode levar alguns minutos.</p>
        </div>
      )}

      {results && !isScraping && (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold flex items-center gap-2"><CheckCircle className="text-emerald-400" size={18} /> Extração Concluída</h3>
            <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-xs font-bold border border-emerald-500/30">
              {results.length} Leads Encontrados
            </span>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-300">
              <thead className="text-xs text-gray-500 uppercase bg-black/40 border-b border-white/5">
                <tr>
                  <th className="px-4 py-3">Nome / Empresa</th>
                  <th className="px-4 py-3">Nicho</th>
                  <th className="px-4 py-3">WhatsApp</th>
                  <th className="px-4 py-3">Avaliação</th>
                </tr>
              </thead>
              <tbody>
                {results.map((r, i) => (
                  <tr key={i} className="border-b border-white/5 hover:bg-white/5">
                    <td className="px-4 py-3 font-medium text-white">{r.nome}</td>
                    <td className="px-4 py-3"><span className="px-2 py-0.5 bg-white/10 rounded text-xs">{r.nicho}</span></td>
                    <td className="px-4 py-3 font-mono text-emerald-400">{r.whatsapp}</td>
                    <td className="px-4 py-3 flex items-center gap-1"><Target size={12} className="text-yellow-400"/> {r.nota} ({r.reviews})</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {results.length === 0 && <p className="text-center py-8 text-gray-500">Nenhum lead com WhatsApp foi encontrado para essa busca.</p>}
          </div>
          {results.length > 0 && (
            <div className="mt-6 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
              <p className="text-sm text-emerald-400 text-center">✅ Todos esses leads já foram adicionados ao seu painel e estão disponíveis na Gestão de Leads e Campanhas.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
