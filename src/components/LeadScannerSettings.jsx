import React, { useState, useEffect } from 'react';
import { Settings, Save, Server, Globe, Key, Shield, MessageSquare, Bot, Database, RefreshCcw, LogOut } from 'lucide-react';

export default function LeadScannerSettings() {
  const [activeTab, setActiveTab] = useState('whatsapp');
  const [waData, setWaData] = useState({ status: 'LOADING', qr: null });
  const [isReconnecting, setIsReconnecting] = useState(false);
  const [apiConfig, setApiConfig] = useState({ groqApiKey: '', enableAutoResponder: true });
  const [userName, setUserName] = useState('');
  const [isSavingConfig, setIsSavingConfig] = useState(false);

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
    }).then(r => r.json()).then(setApiConfig).catch(()=>{});
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
    try {
      const token = localStorage.getItem('sdr_jwt_token');
      
      // Save profile name
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
          window.dispatchEvent(new Event('storage')); // trigger header update if needed
        }
      }

      await fetch('/api/config', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ groqApiKey: apiConfig.groqApiKey, autoResponder: apiConfig.enableAutoResponder })
      });
      alert('Configurações salvas com sucesso! (Recarregue a página se o seu nome não atualizar no topo)');
    } catch(e) {
      alert('Erro ao salvar.');
    }
    setIsSavingConfig(false);
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
          <h1 className="text-2xl font-bold mb-1 flex items-center gap-2">Configurações <Settings size={20} className="text-gray-500" /></h1>
          <p className="text-sm text-gray-400">Ajuste as integrações, WhatsApp e critérios da IA.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Sidebar Nav */}
        <div className="col-span-1 space-y-2">
          <button 
            onClick={() => setActiveTab('whatsapp')}
            className={`w-full text-left px-4 py-3 rounded-xl font-bold text-sm flex items-center gap-3 transition-colors ${activeTab === 'whatsapp' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'hover:bg-white/5 text-gray-400 hover:text-white border border-transparent'}`}
          >
            <MessageSquare size={18} /> WhatsApp
          </button>
          <button 
            onClick={() => setActiveTab('ia')}
            className={`w-full text-left px-4 py-3 rounded-xl font-bold text-sm flex items-center gap-3 transition-colors ${activeTab === 'ia' ? 'bg-purple-600/10 text-purple-400 border border-purple-500/20' : 'hover:bg-white/5 text-gray-400 hover:text-white border border-transparent'}`}
          >
            <Bot size={18} /> Critérios da IA
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
            <Server size={18} /> Outros
          </button>
        </div>

        {/* Content Area */}
        <div className="col-span-2 space-y-6">
          
          {/* Aba WhatsApp */}
          {activeTab === 'whatsapp' && (
            <div className="bg-[#121216] border border-white/5 rounded-2xl p-6">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><MessageSquare size={20} className="text-emerald-400" /> Conexão do WhatsApp</h3>
              <p className="text-sm text-gray-400 mb-6">Conecte seu WhatsApp para que o Agente SDR possa enviar mensagens automaticamente nas campanhas.</p>
              
              <div className="bg-black/40 border border-white/5 rounded-xl p-6 text-center">
                {waData.status === 'CONNECTED' ? (
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mb-4 border border-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                      <MessageSquare size={28} className="text-emerald-400" />
                    </div>
                    <h4 className="text-xl font-bold text-white mb-1">WhatsApp Conectado</h4>
                    <p className="text-sm text-gray-400 mb-6">O sistema está pronto para disparar campanhas.</p>
                    
                    <button onClick={handleDisconnect} disabled={isReconnecting} className="px-6 py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg text-sm font-bold transition-colors flex items-center gap-2">
                      <LogOut size={16} /> Desconectar / Trocar de Número
                    </button>
                  </div>
                ) : waData.status === 'QR_READY' && waData.qr ? (
                  <div className="flex flex-col items-center">
                    <h4 className="text-xl font-bold text-white mb-2">Escaneie o QR Code</h4>
                    <p className="text-sm text-gray-400 mb-6">Abra o WhatsApp no seu celular, vá em Aparelhos Conectados e aponte a câmera.</p>
                    <div className="bg-white p-4 rounded-xl shadow-lg inline-block mb-6">
                      <img src={waData.qr} alt="QR Code" className="w-64 h-64 object-contain" />
                    </div>
                    <button onClick={handleReconnect} disabled={isReconnecting} className="px-6 py-2.5 bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10 rounded-lg text-sm font-bold transition-colors flex items-center gap-2">
                      <RefreshCcw size={16} className={isReconnecting ? "animate-spin" : ""} /> Gerar Novo Código
                    </button>
                  </div>
                ) : waData.status === 'DISCONNECTED' ? (
                  <div className="flex flex-col items-center py-10">
                    <LogOut size={32} className="text-gray-600 mb-4" />
                    <h4 className="text-lg font-bold text-white mb-1">WhatsApp Desconectado</h4>
                    <p className="text-sm text-gray-500 mb-6">Você não está conectado. Clique abaixo para gerar o QR Code.</p>
                    <button onClick={handleReconnect} disabled={isReconnecting} className="px-6 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-sm font-bold transition-colors">
                      {isReconnecting ? 'Iniciando...' : 'Conectar / Gerar Código'}
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center py-10">
                    <RefreshCcw size={32} className="text-emerald-400 animate-spin mb-4" />
                    <h4 className="text-lg font-bold text-white mb-1">Iniciando Conexão...</h4>
                    <p className="text-sm text-gray-500 mb-6">Aguarde enquanto preparamos o sistema.</p>
                    <button onClick={handleReconnect} disabled={isReconnecting} className="px-4 py-2 bg-white/5 hover:bg-white/10 text-gray-400 rounded-lg text-xs transition-colors">
                      Forçar Reconexão
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Aba IA */}
          {activeTab === 'ia' && (
            <div className="bg-[#121216] border border-white/5 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold flex items-center gap-2"><Bot size={20} className="text-purple-400" /> Critérios Globais da IA</h3>
                <button onClick={handleSaveConfig} disabled={isSavingConfig} className="px-4 py-1.5 bg-purple-600 hover:bg-purple-500 rounded-lg text-xs font-bold transition-colors shadow-lg">
                  {isSavingConfig ? 'Salvando...' : 'Salvar'}
                </button>
              </div>
              <p className="text-sm text-gray-400 mb-6">Defina regras que a IA usará em todas as suas análises para reprovar leads automaticamente.</p>
              
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-bold text-gray-300 mb-2">Palavras-chave Negativas (Reprovação Imediata)</label>
                  <textarea 
                    className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-sm text-white focus:border-purple-500 focus:outline-none min-h-[100px] font-mono"
                    defaultValue="fechado temporariamente, permanentemente fechado, sem delivery, apenas retirada, não fazemos entregas"
                    placeholder="Ex: fechado, faliu, sem delivery..."
                  ></textarea>
                </div>
              </div>
            </div>
          )}

          {/* Aba Extrator */}
          {activeTab === 'extrator' && (
            <div className="bg-[#121216] border border-white/5 rounded-2xl p-6">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><Globe size={20} className="text-blue-400" /> Extrator Automático</h3>
              <p className="text-sm text-gray-400 mb-6">Configurações para o preenchimento automático de dados que faltam.</p>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-black/20 border border-white/5 rounded-xl">
                  <div>
                    <p className="text-sm font-bold text-white">Buscar Redes Sociais</p>
                    <p className="text-[11px] text-gray-500 mt-0.5">A IA tenta encontrar Instagram/Facebook.</p>
                  </div>
                  <div className="w-10 h-5 bg-blue-600 rounded-full relative cursor-pointer">
                    <div className="absolute right-1 top-0.5 w-4 h-4 bg-white rounded-full shadow"></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Aba Outros */}
          {activeTab === 'outros' && (
            <div className="bg-[#121216] border border-white/5 rounded-2xl p-6 space-y-6">
              
              <div>
                <h3 className="text-lg font-bold mb-4 text-white flex items-center gap-2">Perfil</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-400 mb-2">Seu Nome</label>
                    <input 
                      type="text" 
                      value={userName} 
                      onChange={e => setUserName(e.target.value)}
                      placeholder="Ex: Vitor Batista" 
                      className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
                    />
                    <p className="text-xs text-gray-500 mt-2">Nome usado para identificação dentro do sistema e nas mensagens.</p>
                  </div>
                </div>
              </div>

              <div className="border-t border-white/10 pt-6">
                <h3 className="text-lg font-bold mb-4 text-white flex items-center gap-2"><Key size={20} className="text-purple-400" /> Inteligência Artificial</h3>
                <p className="text-sm text-gray-400 mb-6">Configure a IA para gerar abordagens e conversar com seus leads automaticamente.</p>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-400 mb-2">Groq API Key</label>
                    <input 
                      type="password" 
                      value={apiConfig.groqApiKey} 
                      onChange={e => setApiConfig({...apiConfig, groqApiKey: e.target.value})}
                      placeholder="gsk_..." 
                      className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-purple-500 transition-colors"
                    />
                    <p className="text-xs text-gray-500 mt-2">Necessário para gerar abordagens dinâmicas e o robô SDR funcionar.</p>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-black/20 border border-white/5 rounded-xl">
                    <div>
                      <p className="text-sm font-bold text-white">Robô SDR (Auto-Resposta)</p>
                      <p className="text-xs text-gray-500 mt-0.5">A IA responderá automaticamente as mensagens dos clientes.</p>
                    </div>
                    <div 
                      className={`w-12 h-6 rounded-full relative cursor-pointer transition-colors ${apiConfig.enableAutoResponder ? 'bg-emerald-500' : 'bg-gray-600'}`}
                      onClick={() => setApiConfig({...apiConfig, enableAutoResponder: !apiConfig.enableAutoResponder})}
                    >
                      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${apiConfig.enableAutoResponder ? 'right-1' : 'left-1'}`}></div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex justify-end">
                  <button 
                    onClick={handleSaveConfig} 
                    disabled={isSavingConfig}
                    className="flex items-center gap-2 px-6 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-sm font-bold transition-all shadow-[0_0_15px_rgba(168,85,247,0.4)] disabled:opacity-50"
                  >
                    {isSavingConfig ? <RefreshCcw size={16} className="animate-spin" /> : <Save size={16} />}
                    {isSavingConfig ? 'Salvando...' : 'Salvar Configurações'}
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
