import React, { useState, useEffect } from 'react';
import { Search, Upload, Plus, TrendingUp, CheckCircle, PhoneCall, DollarSign, Target, Activity, FileSpreadsheet, MessageSquare, Settings, Eye, ChevronRight, Clock } from 'lucide-react';

const PlanProgressBar = ({ label, current, max }) => {
  const percent = Math.min(100, Math.round((current / max) * 100)) || 0;
  return (
    <div className="bg-black/30 p-4 rounded-xl border border-white/5">
      <div className="flex justify-between items-center mb-2">
        <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">{label}</span>
        <span className="text-xs font-bold text-white">{current} / {max}</span>
      </div>
      <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
        <div 
          className={`h-full rounded-full transition-all ${percent >= 90 ? 'bg-red-500' : percent >= 75 ? 'bg-amber-500' : 'bg-purple-500'}`} 
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
};
export default function LeadScannerDashboard({ setActiveTab, planInfo }) {
  const [leads, setLeads] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resLeads, resHistory] = await Promise.all([
          fetch('/api/leads'),
          fetch('/api/history')
        ]);
        const jsonLeads = await resLeads.json();
        const jsonHistory = await resHistory.json();
        setLeads(jsonLeads.data || []);
        setHistory(jsonHistory.data || []);
      } catch (e) {
        console.error(e);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  const totalAnalisados = leads.length;
  const leadsAprovados = leads.filter(l => l.score >= 10 || l.status === 'QUENTE' || l.status === 'MORNO').length;
  const emNegociacao = leads.filter(l => l.status === 'NEGOCIANDO').length;
  const vendasFechadas = leads.filter(l => l.status === 'FECHADO').length;
  const leadsDescartados = leads.filter(l => l.status === 'DESCARTADO' || l.status === 'REPROVADO').length;

  const getLevelColor = (score) => {
    if(score >= 25) return 'red';
    if(score >= 10) return 'orange';
    return 'blue';
  };

  return (
    <div className="animate-fade-in text-white space-y-6 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-1">Olá! 👋</h1>
          <p className="text-sm text-gray-400">Aqui está o resumo da sua prospecção hoje.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input 
              type="text" 
              placeholder="Buscar leads, empresas..." 
              className="pl-10 pr-12 py-2 bg-[#121216] border border-white/5 rounded-lg text-sm focus:outline-none focus:border-purple-500/50 w-64"
            />
          </div>
          
          <button onClick={() => setActiveTab && setActiveTab('nova_analise')} className="flex items-center gap-2 px-4 py-2 bg-[#121216] border border-white/5 hover:bg-white/5 rounded-lg text-sm font-medium transition-colors">
            <Upload size={16} /> Importar Planilha
          </button>
          
          <button onClick={() => setActiveTab && setActiveTab('nova_analise')} className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 border border-purple-500/20 rounded-lg text-sm font-bold transition-all shadow-[0_0_15px_rgba(124,58,237,0.3)]">
            <Plus size={16} /> Nova Análise
          </button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-[#121216] border border-white/5 rounded-xl p-5 flex flex-col justify-between">
          <div className="flex items-start gap-3 mb-2">
            <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <Activity size={20} />
            </div>
            <div>
              <p className="text-xs text-gray-400 font-medium">Total Analisados</p>
              <h3 className="text-2xl font-bold mt-0.5">{loading ? '-' : totalAnalisados}</h3>
            </div>
          </div>
        </div>

        <div className="bg-[#121216] border border-white/5 rounded-xl p-5 flex flex-col justify-between">
          <div className="flex items-start gap-3 mb-2">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <CheckCircle size={20} />
            </div>
            <div>
              <p className="text-xs text-gray-400 font-medium">Leads Aprovados</p>
              <h3 className="text-2xl font-bold mt-0.5">{loading ? '-' : leadsAprovados}</h3>
            </div>
          </div>
        </div>

        <div className="bg-[#121216] border border-white/5 rounded-xl p-5 flex flex-col justify-between">
          <div className="flex items-start gap-3 mb-2">
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <Target size={20} />
            </div>
            <div>
              <p className="text-xs text-gray-400 font-medium">Taxa de Aprovação</p>
              <h3 className="text-2xl font-bold mt-0.5">{totalAnalisados > 0 ? Math.round((leadsAprovados/totalAnalisados)*100) : 0}%</h3>
            </div>
          </div>
        </div>

        <div className="bg-[#121216] border border-white/5 rounded-xl p-5 flex flex-col justify-between">
          <div className="flex items-start gap-3 mb-2">
            <div className="p-2 rounded-lg bg-orange-500/10 text-orange-400 border border-orange-500/20">
              <TrendingUp size={20} />
            </div>
            <div>
              <p className="text-xs text-gray-400 font-medium">Em Negociação</p>
              <h3 className="text-2xl font-bold mt-0.5">{loading ? '-' : emNegociacao}</h3>
            </div>
          </div>
        </div>

        <div className="bg-[#121216] border border-white/5 rounded-xl p-5 flex flex-col justify-between">
          <div className="flex items-start gap-3 mb-2">
            <div className="p-2 rounded-lg bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">
              <DollarSign size={20} />
            </div>
            <div>
              <p className="text-xs text-gray-400 font-medium">Vendas Fechadas</p>
              <h3 className="text-2xl font-bold mt-0.5">{loading ? '-' : vendasFechadas}</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Uso do Plano - Trial Users */}
      {planInfo && !planInfo.isAdmin && planInfo.usage && planInfo.limits && (
        <div className="bg-[#121216] border border-white/5 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-bold text-lg flex items-center gap-2">
              <Activity className="text-amber-400" size={20} /> Uso do Plano
            </h3>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20">
              <Clock size={14} className="text-amber-400" />
              <span className="text-xs font-semibold text-amber-400">
                {planInfo.daysLeft} {planInfo.daysLeft === 1 ? 'dia restante' : 'dias restantes'}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Leads */}
            <PlanProgressBar
              label="Leads Utilizados"
              current={planInfo.usage.leadsCount || 0}
              max={planInfo.limits.maxLeads || 50}
            />
            {/* Messages */}
            <PlanProgressBar
              label="Mensagens Hoje"
              current={planInfo.usage.messagesToday || 0}
              max={planInfo.limits.maxMessagesPerDay || 20}
            />
            {/* Scrapes */}
            <PlanProgressBar
              label="Buscas Hoje"
              current={planInfo.usage.scrapesToday || 0}
              max={planInfo.limits.maxScrapesPerDay || 3}
            />
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Melhores Oportunidades (Middle Column) */}
        <div className="col-span-2 space-y-4">
          <div className="bg-[#121216] border border-white/5 rounded-2xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-lg flex items-center gap-2"><Target className="text-purple-400" size={20} /> Melhores Oportunidades do Dia</h3>
              <button onClick={() => setActiveTab && setActiveTab('leads_qualificados')} className="text-xs text-purple-400 hover:text-purple-300 font-medium">Ver todas</button>
            </div>
            
            <div className="space-y-4">
              {loading && <p className="text-gray-500 text-sm">Carregando...</p>}
              {!loading && leads.length === 0 && <p className="text-gray-500 text-sm">Nenhum lead qualificado encontrado.</p>}
              {leads.filter(l => l.score > 0).sort((a,b) => b.score - a.score).slice(0, 4).map((lead, i) => {
                const color = getLevelColor(lead.score);
                return (
                  <div key={i} className="flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-xl hover:bg-white/10 transition-colors group cursor-pointer">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-full border-2 border-${color}-500/30 flex items-center justify-center text-lg font-bold text-${color}-400 bg-${color}-500/10`}>
                        {lead.score || 0}
                      </div>
                      <div>
                        <p className="font-bold text-white group-hover:text-purple-400 transition-colors">{lead.nome}</p>
                        <p className="text-xs text-gray-500">{lead.nicho} {lead.cidade ? `• ${lead.cidade}` : ''}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {lead.whatsapp && lead.whatsapp.replace(/\D/g, '').length >= 10 && (
                        <button onClick={() => window.open(`https://wa.me/${lead.whatsapp.replace(/\D/g, '')}`, '_blank')} className="px-3 py-1.5 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 rounded-lg text-xs font-bold transition-colors flex items-center gap-2">
                          <PhoneCall size={14} /> Chamar
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Ações Rápidas & Últimas Análises (Right Column) */}
        <div className="col-span-1 space-y-6">
          
          {/* Quick Actions */}
          <div className="bg-[#121216] border border-white/5 rounded-2xl p-6">
            <h3 className="font-bold text-sm mb-4 text-gray-400">Ações Rápidas</h3>
            <div className="space-y-3">
              <button onClick={() => setActiveTab && setActiveTab('nova_analise')} className="w-full flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition-colors group">
                <div className="flex items-center gap-3">
                  <div className="p-1.5 rounded-lg bg-blue-500/20 text-blue-400"><FileSpreadsheet size={14}/></div>
                  <div className="text-left">
                    <p className="text-xs font-bold text-white group-hover:text-blue-400 transition-colors">Importar Planilha</p>
                    <p className="text-[9px] text-gray-500">Inicie uma nova qualificação</p>
                  </div>
                </div>
                <ChevronRight size={14} className="text-gray-600" />
              </button>

              <button onClick={() => setActiveTab && setActiveTab('mensagens')} className="w-full flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition-colors group">
                <div className="flex items-center gap-3">
                  <div className="p-1.5 rounded-lg bg-orange-500/20 text-orange-400"><MessageSquare size={14}/></div>
                  <div className="text-left">
                    <p className="text-xs font-bold text-white group-hover:text-orange-400 transition-colors">Mensagens</p>
                    <p className="text-[9px] text-gray-500">Gerenciar prompts</p>
                  </div>
                </div>
                <ChevronRight size={14} className="text-gray-600" />
              </button>

              <button onClick={() => setActiveTab && setActiveTab('configuracoes')} className="w-full flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition-colors group">
                <div className="flex items-center gap-3">
                  <div className="p-1.5 rounded-lg bg-gray-500/20 text-gray-400"><Settings size={14}/></div>
                  <div className="text-left">
                    <p className="text-xs font-bold text-white group-hover:text-gray-400 transition-colors">Critérios IA</p>
                    <p className="text-[9px] text-gray-500">Ajustar filtros e pontuação</p>
                  </div>
                </div>
                <ChevronRight size={14} className="text-gray-600" />
              </button>
            </div>
          </div>

          {/* Últimas Análises */}
          <div className="bg-[#121216] border border-white/5 rounded-2xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-sm text-gray-400">Últimas Análises</h3>
              <button onClick={() => setActiveTab && setActiveTab('historico')} className="text-xs text-purple-400 hover:text-purple-300 font-medium">Ver histórico</button>
            </div>
            
            <div className="space-y-4">
              {history.length === 0 && <p className="text-xs text-gray-500">Nenhuma análise recente.</p>}
              {history.slice(0, 3).map(item => (
                <div key={item.id} className="flex items-start gap-3 relative">
                  <div className={`w-2 h-2 mt-1.5 rounded-full shrink-0 ${item.status === 'Concluído' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-red-500'}`}></div>
                  <div>
                    <p className={`text-xs font-bold ${item.status === 'Concluído' ? 'text-white' : 'text-gray-300'}`}>{item.name}</p>
                    <p className={`text-[10px] ${item.status === 'Concluído' ? 'text-gray-500' : 'text-red-400/80'}`}>{item.date} {item.time} • {item.total} leads analisados</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
