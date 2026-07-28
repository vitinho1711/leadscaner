import React, { useState, useEffect } from 'react';
import { MessageSquare, Send, Reply, Briefcase, Search, Filter, Plus, Edit2, MoreHorizontal, Copy, Activity, Target, CheckCircle, Sparkles, Bot, Save, X, Trash2, TrendingUp, Shuffle, RefreshCcw, Wand2 } from 'lucide-react';

export default function LeadScannerMessages({ planInfo, userTier }) {
  const [activeFilter, setActiveFilter] = useState('Primeiro Contato');

  const initialTemplates = [
    { id: 1, name: 'Abordagem Inicial - Restaurante', type: 'Primeiro Contato', status: 'Ativa', content: 'Olá {nome}! Tudo bem?\n\nVi que o {empresa} é referência em {nicho} aqui em {cidade} e achei demais o trabalho de vocês!\n\nQuero te mostrar uma solução que tem ajudado outros {nicho} a:\n• Aumentar os pedidos\n• Melhorar o posicionamento\n• Atrair mais clientes todos os dias\n\nPosso te enviar mais detalhes rapidinho?', uses: 156, responseRate: '32%', color: 'purple', responses: 50, deals: 12 },
    { id: 2, name: 'Abordagem Inicial - Academia', type: 'Primeiro Contato', status: 'Ativa', content: 'Olá {nome} da {empresa}, tudo joia?\n\nReparei no excelente trabalho que fazem em {cidade} e acho que nossa solução pode ajudar.', uses: 98, responseRate: '28%', color: 'blue', responses: 27, deals: 5 },
    { id: 3, name: 'Follow-up 1', type: 'Follow-up', status: 'Ativa', content: 'Oi {nome}, conseguiu ver a mensagem anterior? Fico à disposição!', uses: 65, responseRate: '24%', color: 'orange', responses: 15, deals: 3 },
  ];

  const [templates, setTemplates] = useState(initialTemplates);
  const [activeTemplate, setActiveTemplate] = useState(templates[0]);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState(null);

  // ── Estado para geração em massa (Batch IA) ──
  const [showBatchForm, setShowBatchForm] = useState(false);
  const [batchNiche, setBatchNiche] = useState('');
  const [batchCount, setBatchCount] = useState(16);
  const [batchSalesperson, setBatchSalesperson] = useState('');
  const [batchService, setBatchService] = useState('');
  const [batchTone, setBatchTone] = useState('variado');
  const [isGeneratingBatch, setIsGeneratingBatch] = useState(false);

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const res = await fetch('/api/whatsapp/templates');
        const json = await res.json();
        if (json.data && json.data.length > 0) {
          setTemplates(json.data);
          setActiveTemplate(json.data[0]);
        }
      } catch (e) {
        console.error('Erro ao buscar templates:', e);
      }
    };
    fetchTemplates();
  }, []);

  const saveTemplatesToBackend = async (newTemplates) => {
    try {
      await fetch('/api/whatsapp/templates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ templates: newTemplates })
      });
    } catch (e) {
      console.error('Erro ao salvar templates:', e);
    }
  };

  const variables = [
    '{nome}', '{empresa}', '{nicho}', '{cidade}', '{site}', '{site_informado}', '{ifood}',
    '{tipo_de_comida}', '{whatsapp}', '{instagram}', '{facebook}', '{problema}', '{solucao}'
  ];

  const handleNewMessage = () => {
    const newTpl = {
      id: Date.now(),
      name: 'Nova Mensagem',
      type: activeFilter === 'Todas' ? 'Primeiro Contato' : activeFilter,
      status: 'Rascunho',
      content: '',
      uses: 0,
      responseRate: '0%',
      color: 'purple',
      responses: 0,
      deals: 0
    };
    const newTemplates = [newTpl, ...templates];
    setTemplates(newTemplates);
    setActiveTemplate(newTpl);
    setEditForm(newTpl);
    setIsEditing(true);
    saveTemplatesToBackend(newTemplates);
  };

  const startEdit = (tpl) => {
    setEditForm(tpl);
    setIsEditing(true);
  };

  const handleSaveMessage = () => {
    const newTemplates = templates.map(t => t.id === editForm.id ? editForm : t);
    setTemplates(newTemplates);
    setActiveTemplate(editForm);
    setIsEditing(false);
    saveTemplatesToBackend(newTemplates);
  };

  const handleDeleteMessage = (id) => {
    if (window.confirm("Deseja mesmo excluir esta mensagem?")) {
      const newTemplates = templates.filter(t => t.id !== id);
      setTemplates(newTemplates);
      if (activeTemplate?.id === id) {
        setActiveTemplate(newTemplates.length > 0 ? newTemplates[0] : null);
        setIsEditing(false);
      }
      saveTemplatesToBackend(newTemplates);
    }
  };

  const handleClearAll = () => {
    if (window.confirm("Tem certeza que deseja apagar TODAS as mensagens salvas? Esta ação não pode ser desfeita.")) {
      setTemplates([]);
      setActiveTemplate(null);
      setIsEditing(false);
      saveTemplatesToBackend([]);
    }
  };

  const handleAiGenerate = () => {
    const aiText = 'Olá {nome}! Percebi que a {empresa} é super conceituada na área de {nicho}. Estou entrando em contato porque nossa IA tem ajudado empresas como a sua a escalar as vendas pelo WhatsApp automaticamente.\n\nFaz sentido conversarmos por 5 minutos?';
    if (isEditing) {
      setEditForm({...editForm, content: aiText});
    } else {
      const newTpl = {
        id: Date.now(),
        name: 'Abordagem Gerada por IA',
        type: 'Primeiro Contato',
        status: 'Rascunho',
        content: aiText,
        uses: 0,
        responseRate: '0%',
        color: 'purple',
        responses: 0,
        deals: 0
      };
      const newTemplates = [newTpl, ...templates];
      setTemplates(newTemplates);
      setActiveTemplate(newTpl);
      saveTemplatesToBackend(newTemplates);
    }
  };

  // ── Geração em massa com IA ──
  const handleGenerateBatchAI = async () => {
    if (!batchNiche.trim()) return alert('Por favor, informe o nicho (ex: Academia, Restaurante).');
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
        setActiveTemplate(data.templates[0]);
        setShowBatchForm(false);
        alert(`✅ Sucesso! ${data.count} modelos de mensagem gerados automaticamente para o nicho "${batchNiche}".`);
      } else if (data.error) {
        alert('Erro ao gerar: ' + data.error);
      }
    } catch (e) {
      alert('Erro ao conectar com o servidor.');
    }
    setIsGeneratingBatch(false);
  };

  const insertVariable = (v) => {
    if (isEditing && editForm) {
      setEditForm({...editForm, content: editForm.content + v});
    }
  };

  const filteredTemplates = activeFilter === 'Todas' ? templates : templates.filter(t => t.type === activeFilter);

  return (
    <div className="animate-fade-in text-white space-y-6 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-1 flex items-center gap-2">Mensagens <MessageSquare size={20} className="text-gray-500" /></h1>
          <p className="text-sm text-gray-400">Crie, personalize e gerencie mensagens que geram conexão e fecham negócios.</p>
        </div>
        
        <div className="flex items-center gap-3">
          {templates.length > 0 && (
            <button 
              onClick={handleClearAll} 
              className="flex items-center gap-2 px-3 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-lg text-sm font-bold transition-all"
              title="Apagar todas as mensagens"
            >
              <Trash2 size={16} /> Limpar Tudo
            </button>
          )}
          <button 
            onClick={() => {
              if (userTier === 'basic') {
                alert('⭐ Funcionalidade Exclusiva PRO!\n\nA geração de mensagens com Inteligência Artificial está disponível apenas no plano PRO. Faça o upgrade para criar mensagens que convertem 10x mais!');
              } else {
                setShowBatchForm(!showBatchForm); 
                setIsEditing(false);
              }
            }} 
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 rounded-lg text-sm font-bold transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)]"
          >
            <Wand2 size={16} /> Gerar em Massa (IA)
          </button>
          <button onClick={handleNewMessage} className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 rounded-lg text-sm font-bold transition-all shadow-[0_0_15px_rgba(124,58,237,0.3)]">
            <Plus size={16} /> Nova mensagem
          </button>
        </div>
      </div>

      {/* ── Formulário de Geração em Massa (IA) ── */}
      {showBatchForm && (
        <div className="bg-gradient-to-br from-[#121216] to-[#0f1a1f] border border-emerald-500/30 rounded-2xl p-6 space-y-5 animate-fade-in relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-500/5 rounded-full blur-3xl -mr-10 -mt-10"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-3xl -ml-10 -mb-10"></div>
          
          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 border border-emerald-500/30">
                <Wand2 size={20} className="text-emerald-400" />
              </div>
              <div>
                <h3 className="font-bold text-white text-base">Gerar Modelos de Mensagem com IA</h3>
                <p className="text-xs text-gray-400">Crie múltiplas variações de abordagem automaticamente para o nicho que deseja prospectar</p>
              </div>
            </div>
            <button onClick={() => setShowBatchForm(false)} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
              <X size={16} className="text-gray-400" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
            <div>
              <label className="text-xs text-emerald-300 font-bold mb-2 flex items-center gap-1.5" style={{ display: 'block' }}>
                <Target size={12} /> Nicho / Segmento do Lead
              </label>
              <input 
                value={batchNiche} 
                onChange={e => setBatchNiche(e.target.value)} 
                placeholder="Ex: Academia de Crossfit, Restaurante, Clínica Odontológica..." 
                className="w-full bg-black/40 border border-emerald-500/20 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500/50 transition-colors placeholder:text-gray-600" 
              />
            </div>
            <div>
              <label className="text-xs text-emerald-300 font-bold mb-2 flex items-center gap-1.5" style={{ display: 'block' }}>
                👤 Nome do Vendedor (Remetente)
              </label>
              <input 
                value={batchSalesperson} 
                onChange={e => setBatchSalesperson(e.target.value)} 
                placeholder="Ex: Vitor Batista" 
                className="w-full bg-black/40 border border-emerald-500/20 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500/50 transition-colors placeholder:text-gray-600" 
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
            <div>
              <label className="text-xs text-emerald-300 font-bold mb-2 flex items-center gap-1.5" style={{ display: 'block' }}>
                ⚙️ Serviço Oferecido
              </label>
              <input 
                value={batchService} 
                onChange={e => setBatchService(e.target.value)} 
                placeholder="Ex: criação de sites modernos e estratégicos" 
                className="w-full bg-black/40 border border-emerald-500/20 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500/50 transition-colors placeholder:text-gray-600" 
              />
            </div>
            <div>
              <label className="text-xs text-emerald-300 font-bold mb-2 flex items-center gap-1.5" style={{ display: 'block' }}>
                <Shuffle size={12} /> Quantidade de Validações (Mensagens Únicas)
              </label>
              <div className="flex gap-2">
                {[10, 16, 20, 50].map(c => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setBatchCount(c)}
                    className={`flex-1 px-3 py-2 rounded-xl text-sm font-bold transition-all duration-200 ${
                      batchCount === c 
                        ? 'bg-gradient-to-r from-emerald-600 to-cyan-600 text-white shadow-[0_0_12px_rgba(16,185,129,0.3)]' 
                        : 'bg-black/40 text-gray-400 border border-white/10 hover:border-emerald-500/30 hover:text-white'
                    }`}
                  >
                    {c}
                  </button>
                ))}
                <input 
                  type="number" 
                  value={batchCount} 
                  onChange={e => setBatchCount(Math.min(50, Math.max(1, parseInt(e.target.value) || 1)))} 
                  className="bg-black/40 border border-emerald-500/20 rounded-xl px-3 text-center text-sm text-white focus:outline-none focus:border-emerald-500/50 transition-colors" 
                  style={{ width: '70px' }}
                  min={1}
                  max={50}
                />
              </div>
              <p className="text-[10px] text-gray-500 mt-1.5">Máximo: 50 variações por geração</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 relative z-10 mb-4">
            <div>
              <label className="text-xs text-emerald-300 font-bold mb-2 flex items-center gap-1.5" style={{ display: 'block' }}>
                🎭 Tom / Estilo da Mensagem
              </label>
              <select 
                value={batchTone} 
                onChange={e => setBatchTone(e.target.value)} 
                className="w-full bg-black/40 border border-emerald-500/20 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500/50 transition-colors"
              >
                <option value="variado">Variado (Recomendado - Mescla abordagens)</option>
                <option value="agressivo">Agressivo (Direto ao ponto, focado na venda)</option>
                <option value="curioso">Curioso (Gera curiosidade antes de oferecer)</option>
                <option value="consultivo">Consultivo (Foco em ajudar e empatia)</option>
                <option value="amigável">Amigável e Casual (Super informal)</option>
              </select>
            </div>
          </div>

          <div className="flex gap-3 pt-2 relative z-10">
            <button 
              onClick={handleGenerateBatchAI} 
              disabled={isGeneratingBatch || !batchNiche.trim()} 
              className="flex-1 flex items-center justify-center gap-2.5 px-5 py-3 bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 rounded-xl text-sm font-bold transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {isGeneratingBatch ? <RefreshCcw size={16} className="animate-spin" /> : <Bot size={16} />}
              {isGeneratingBatch 
                ? `Gerando ${batchCount} mensagens com IA (aguarde)...` 
                : `Gerar ${batchCount} Mensagens para "${batchNiche || '...'}"` 
              }
            </button>
            <button 
              onClick={() => setShowBatchForm(false)} 
              className="px-5 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-400 hover:text-white rounded-xl text-sm font-medium transition-colors"
            >
              Cancelar
            </button>
          </div>

          <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-xl p-3 relative z-10">
            <p className="text-[11px] text-emerald-300/70 flex items-center gap-1.5">
              <Sparkles size={12} className="text-emerald-400" />
              <strong>Dica:</strong> A IA vai criar mensagens únicas com variações de abordagem (elogio, curiosidade, direto ao ponto) para maximizar a taxa de resposta no nicho informado.
            </p>
          </div>
        </div>
      )}

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-[#121216] border border-white/5 rounded-xl p-5 flex flex-col justify-between">
          <div className="flex items-start gap-3 mb-2">
            <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <MessageSquare size={20} />
            </div>
            <div>
              <p className="text-xs text-gray-400 font-medium">Mensagens Criadas</p>
              <h3 className="text-2xl font-bold mt-0.5">{templates.length}</h3>
            </div>
          </div>
          <p className="text-[10px] text-emerald-400 font-medium">+1 esta semana</p>
        </div>

        <div className="bg-[#121216] border border-white/5 rounded-xl p-5 flex flex-col justify-between">
          <div className="flex items-start gap-3 mb-2">
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <Send size={20} />
            </div>
            <div>
              <p className="text-xs text-gray-400 font-medium">Mensagens Enviadas</p>
              <h3 className="text-2xl font-bold mt-0.5">358</h3>
            </div>
          </div>
          <p className="text-[10px] text-emerald-400 font-medium">+102 esta semana</p>
        </div>

        <div className="bg-[#121216] border border-white/5 rounded-xl p-5 flex flex-col justify-between">
          <div className="flex items-start gap-3 mb-2">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Reply size={20} />
            </div>
            <div>
              <p className="text-xs text-gray-400 font-medium">Respostas Recebidas</p>
              <h3 className="text-2xl font-bold mt-0.5">89</h3>
            </div>
          </div>
          <p className="text-[10px] text-emerald-400 font-medium">24.9% de taxa de resposta</p>
        </div>

        <div className="bg-[#121216] border border-white/5 rounded-xl p-5 flex flex-col justify-between">
          <div className="flex items-start gap-3 mb-2">
            <div className="p-2 rounded-lg bg-orange-500/10 text-orange-400 border border-orange-500/20">
              <Briefcase size={20} />
            </div>
            <div>
              <p className="text-xs text-gray-400 font-medium">Negócios Fechados</p>
              <h3 className="text-2xl font-bold mt-0.5">17</h3>
            </div>
          </div>
          <p className="text-[10px] text-emerald-400 font-medium">+4 esta semana</p>
        </div>
      </div>

      {/* Main Layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Left Column - List */}
        <div className="col-span-1 md:col-span-3 space-y-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {['Todas', 'Primeiro Contato', 'Follow-up', 'Negociação'].map(filter => (
              <button 
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${activeFilter === filter ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
              >
                {filter}
              </button>
            ))}
          </div>
          
          <div className="space-y-3">
            {filteredTemplates.map((tpl) => (
              <div 
                key={tpl.id} 
                onClick={() => { setActiveTemplate(tpl); setIsEditing(false); }}
                className={`p-4 rounded-xl border ${activeTemplate?.id === tpl.id ? 'bg-white/5 border-purple-500/30' : 'bg-[#121216] border-white/5'} hover:bg-white/5 transition-colors cursor-pointer relative group`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <div className={`p-1.5 rounded-lg bg-${tpl.color}-500/10 text-${tpl.color}-400`}>
                      <MessageSquare size={14} />
                    </div>
                    <div>
                      <p className={`text-xs font-bold ${activeTemplate?.id === tpl.id ? 'text-white' : 'text-gray-300'} leading-tight`}>{tpl.name}</p>
                      <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded ${tpl.status === 'Ativa' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-orange-500/20 text-orange-400'}`}>
                        {tpl.status}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-3 text-[10px] text-gray-500">
                  <span className="flex items-center gap-1"><RefreshCcw_Mock size={10}/> Usada {tpl.uses} vezes</span>
                  <span className="flex items-center gap-1"><Activity size={10}/> {tpl.responseRate} resp.</span>
                </div>
              </div>
            ))}
            {filteredTemplates.length === 0 && (
              <p className="text-xs text-gray-500 text-center py-4">Nenhuma mensagem encontrada.</p>
            )}
            <button onClick={handleNewMessage} className="w-full py-3 bg-transparent border border-dashed border-white/20 hover:border-purple-500/50 hover:bg-purple-500/5 rounded-xl text-xs font-bold text-gray-400 hover:text-purple-400 transition-colors flex items-center justify-center gap-2">
              <Plus size={14} /> Nova mensagem
            </button>
          </div>
        </div>

        {/* Middle Column - Editor */}
        <div className="col-span-1 md:col-span-6 space-y-4">
          {activeTemplate && (
            <div className="bg-[#121216] border border-white/5 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                {isEditing ? (
                  <div className="flex-1 mr-4">
                    <input 
                      type="text" 
                      value={editForm.name}
                      onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                      className="text-lg font-bold bg-transparent border-b border-purple-500/50 focus:outline-none w-full pb-1 text-white" 
                      placeholder="Nome da mensagem"
                    />
                  </div>
                ) : (
                  <div>
                    <h2 className="text-lg font-bold flex items-center gap-2">
                      {activeTemplate.name} 
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${activeTemplate.status === 'Ativa' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-orange-500/20 text-orange-400'}`}>
                        {activeTemplate.status}
                      </span>
                    </h2>
                    <p className="text-xs text-gray-500">Categoria: {activeTemplate.type}</p>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  {isEditing ? (
                    <>
                      <button onClick={() => setIsEditing(false)} className="px-3 py-1.5 hover:bg-white/10 rounded-lg text-xs font-medium transition-colors text-gray-400">
                        Cancelar
                      </button>
                      <button onClick={handleSaveMessage} className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-xs font-medium transition-colors">
                        <Save size={12} /> Salvar
                      </button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => startEdit(activeTemplate)} className="flex items-center gap-2 px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-xs font-medium transition-colors border border-white/5">
                        <Edit2 size={12} /> Editar
                      </button>
                      <button onClick={() => handleDeleteMessage(activeTemplate.id)} className="flex items-center gap-2 px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg text-xs font-medium transition-colors border border-red-500/10">
                        <Trash2 size={12} /> Excluir
                      </button>
                    </>
                  )}
                </div>
              </div>

              <div className="mb-4">
                <p className="text-xs text-gray-400 mb-2 flex items-center gap-1"><Eye size={12} /> Conteúdo da Mensagem</p>
                {isEditing ? (
                  <textarea 
                    value={editForm.content}
                    onChange={(e) => setEditForm({...editForm, content: e.target.value})}
                    className="w-full bg-black/40 border border-purple-500/30 rounded-xl p-5 text-sm leading-relaxed text-white focus:border-purple-500 focus:outline-none min-h-[250px]"
                    placeholder="Digite sua mensagem aqui..."
                  ></textarea>
                ) : (
                  <div className="bg-black/30 border border-white/5 rounded-xl p-5 text-sm leading-relaxed text-gray-300 font-light relative whitespace-pre-wrap">
                    {activeTemplate.content.split(/({[^}]+})/).map((part, i) => 
                      part.startsWith('{') && part.endsWith('}') 
                        ? <span key={i} className="text-purple-400 font-medium">{part}</span> 
                        : part
                    )}
                    
                    <div className="mt-6 flex items-center justify-between border-t border-white/5 pt-4">
                      <span className="text-[10px] text-gray-600">{activeTemplate.content.length} caracteres</span>
                      <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-xs font-medium transition-colors text-gray-300">
                        <Copy size={12} /> Copiar mensagem
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="mb-6">
                <p className="text-xs text-gray-400 mb-2 flex items-center gap-1"><Sparkles size={12} /> Variáveis disponíveis {isEditing && '(Clique para inserir)'}</p>
                <div className="flex flex-wrap gap-2">
                  {variables.map((v, i) => (
                    <span 
                      key={i} 
                      onClick={() => insertVariable(v)}
                      className={`px-2.5 py-1 bg-purple-500/10 border border-purple-500/20 text-purple-300 rounded text-[10px] font-mono transition-colors ${isEditing ? 'cursor-pointer hover:bg-purple-500/30' : 'cursor-default'}`}
                    >
                      {v}
                    </span>
                  ))}
                </div>
              </div>

              {!isEditing && (
                <div>
                  <p className="text-xs text-gray-400 mb-2 flex items-center gap-1"><Activity size={12} /> Estatísticas da mensagem</p>
                  <div className="grid grid-cols-4 gap-3">
                    <div className="bg-black/20 border border-white/5 rounded-lg p-3 text-center">
                      <MessageSquare size={14} className="text-purple-400 mx-auto mb-1" />
                      <h4 className="text-sm font-bold">{activeTemplate.uses}</h4>
                      <p className="text-[9px] text-gray-500">Usos</p>
                    </div>
                    <div className="bg-black/20 border border-white/5 rounded-lg p-3 text-center">
                      <TrendingUp size={14} className="text-blue-400 mx-auto mb-1" />
                      <h4 className="text-sm font-bold">{activeTemplate.responseRate}</h4>
                      <p className="text-[9px] text-gray-500">Taxa de resposta</p>
                    </div>
                    <div className="bg-black/20 border border-white/5 rounded-lg p-3 text-center">
                      <Reply size={14} className="text-emerald-400 mx-auto mb-1" />
                      <h4 className="text-sm font-bold">{activeTemplate.responses}</h4>
                      <p className="text-[9px] text-gray-500">Respostas</p>
                    </div>
                    <div className="bg-black/20 border border-white/5 rounded-lg p-3 text-center">
                      <Briefcase size={14} className="text-orange-400 mx-auto mb-1" />
                      <h4 className="text-sm font-bold">{activeTemplate.deals}</h4>
                      <p className="text-[9px] text-gray-500">Negócios</p>
                    </div>
                  </div>
                </div>
              )}

            </div>
          )}
        </div>

        {/* Right Column - Tips */}
        <div className="col-span-1 md:col-span-3 space-y-4">
          
          <div className="bg-gradient-to-br from-purple-900/30 to-blue-900/30 border border-purple-500/20 rounded-2xl p-5 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Bot size={64} />
            </div>
            <h3 className="font-bold text-sm text-white mb-2 flex items-center gap-2">IA te ajudando <Sparkles size={14} className="text-yellow-400" /></h3>
            <p className="text-xs text-purple-200 mb-4 opacity-80 relative z-10">
              Deixe a IA criar uma mensagem altamente conversiva e personalizada.
            </p>
            <button onClick={handleAiGenerate} className="w-full flex items-center justify-center gap-2 py-2.5 bg-purple-600 hover:bg-purple-500 rounded-xl text-white text-xs font-bold transition-colors relative z-10 shadow-lg shadow-purple-600/20">
              Gerar com IA <Bot size={14} />
            </button>
          </div>

          <div className="bg-[#121216] border border-white/5 rounded-2xl p-5">
            <h3 className="font-bold text-sm mb-4">Dicas para melhores resultados</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <CheckCircle size={14} className="text-purple-400 mt-0.5 flex-shrink-0" />
                <p className="text-[11px] text-gray-400 leading-tight">Personalize sempre com o nome e empresa do lead</p>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle size={14} className="text-purple-400 mt-0.5 flex-shrink-0" />
                <p className="text-[11px] text-gray-400 leading-tight">Mostre benefícios claros logo no primeiro contato</p>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle size={14} className="text-purple-400 mt-0.5 flex-shrink-0" />
                <p className="text-[11px] text-gray-400 leading-tight">Use perguntas para gerar curiosidade</p>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle size={14} className="text-purple-400 mt-0.5 flex-shrink-0" />
                <p className="text-[11px] text-gray-400 leading-tight">Mensagens curtas têm mais chance de resposta</p>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}

function Eye(props) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}
function RefreshCcw_Mock(props) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
      <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
      <path d="M16 21v-5h5" />
    </svg>
  );
}
