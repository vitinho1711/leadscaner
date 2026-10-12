import React, { useState, useEffect } from 'react';
import { Bot, Save } from 'lucide-react';

export default function SdrAiTraining() {
  const [apiConfig, setApiConfig] = useState({ 
    groqApiKey: '', 
    openaiApiKey: '',
    openaiModel: 'gpt-4o-mini',
    aiProvider: 'auto',
    enableAutoResponder: true, 
    aiTrainingPrompt: '' 
  });
  const [isSavingConfig, setIsSavingConfig] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('sdr_jwt_token');
    fetch('/api/config', {
      headers: token ? { 'Authorization': `Bearer ${token}` } : {}
    })
      .then(r => r.json())
      .then(setApiConfig)
      .catch(() => {});
  }, []);

  const handleSaveConfig = async () => {
    setIsSavingConfig(true);
    try {
      const token = localStorage.getItem('sdr_jwt_token');
      await fetch('/api/config', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ 
          groqApiKey: apiConfig.groqApiKey, 
          openaiApiKey: apiConfig.openaiApiKey,
          openaiModel: apiConfig.openaiModel,
          aiProvider: apiConfig.aiProvider,
          autoResponder: apiConfig.enableAutoResponder, 
          aiTrainingPrompt: apiConfig.aiTrainingPrompt 
        })
      });
      alert('Treinamento salvo com sucesso!');
    } catch(e) {
      alert('Erro ao salvar treinamento.');
    }
    setIsSavingConfig(false);
  };

  return (
    <div className="bg-[#121216] border border-white/5 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold flex items-center gap-2">
          <Bot size={20} className="text-purple-400" /> Configuração da Inteligência Artificial
        </h3>
        <button 
          onClick={handleSaveConfig} 
          disabled={isSavingConfig} 
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded-lg text-sm font-bold transition-colors shadow-lg"
        >
          <Save size={16} />
          {isSavingConfig ? 'Salvando...' : 'Salvar Treinamento'}
        </button>
      </div>
      <p className="text-sm text-gray-400 mb-6">
        Treine a sua IA para agir exatamente como você. Defina seu nicho, seu tom de voz e seu estilo de venda.
      </p>
      
      <div className="space-y-5">
        <div>
          <label className="block text-sm font-bold text-gray-300 mb-2">Treinamento Personalizado (System Prompt)</label>
          <textarea 
            className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-sm text-white focus:border-purple-500 focus:outline-none min-h-[400px] font-mono leading-relaxed"
            value={apiConfig.aiTrainingPrompt || ''}
            onChange={(e) => setApiConfig({...apiConfig, aiTrainingPrompt: e.target.value})}
            placeholder="Ex: Você é o João, especialista em marketing digital há 10 anos. Seu objetivo é conversar com clientes de forma amigável e direta. Sempre tente agendar uma reunião online no final da conversa..."
          ></textarea>
          <p className="text-xs text-gray-500 mt-2">
            Dica: Seja detalhista. As regras de segurança para nunca dar o preço e transferir o atendimento para você já estão ativadas automaticamente no sistema.
          </p>
        </div>
      </div>
    </div>
  );
}
