import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { Activity, Clock } from 'lucide-react';

const mockTimelineData = [
  { name: '10/05', leads: 400 },
  { name: '11/05', leads: 600 },
  { name: '12/05', leads: 500 },
  { name: '13/05', leads: 900 },
  { name: '14/05', leads: 850 },
  { name: '15/05', leads: 1328 },
  { name: '16/05', leads: 1100 },
];

const mockSourceData = [
  { name: 'Google Maps', value: 45, color: '#A855F7' },
  { name: 'Site', value: 25, color: '#3B82F6' },
  { name: 'Indicação', value: 20, color: '#F97316' },
  { name: 'Outros', value: 10, color: '#6B7280' },
];

const mockResponseRateData = [
  { name: 'S', rate: 20 },
  { name: 'T', rate: 25 },
  { name: 'Q', rate: 35 },
  { name: 'Q', rate: 30 },
  { name: 'S', rate: 45 },
  { name: 'S', rate: 40 },
  { name: 'D', rate: 48.7 },
];

const PlanProgressBar = ({ label, current, max }) => {
  const percent = Math.min(100, Math.round((current / max) * 100)) || 0;
  return (
    <div className="bg-[#121216]/50 p-4 rounded-xl border border-white/5">
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const resLeads = await fetch('/api/leads', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const jsonLeads = await resLeads.json();
        setLeads(jsonLeads.data || []);
      } catch (e) {
        console.error(e);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  // Dados reais calculados a partir dos leads
  const totalAnalisados = leads.length;
  const conversasIniciadas = leads.filter(l => l.status && l.status !== 'FRIO').length;
  const vendasFechadas = leads.filter(l => ['FECHADO', 'VENDIDO', 'CONVERTIDO'].includes(l.status?.toUpperCase())).length;
  const respostas = leads.filter(l => ['QUENTE', 'FECHADO', 'VENDIDO', 'CONVERTIDO', 'RESPONDIDO'].includes(l.status?.toUpperCase())).length;

  const MetricCard = ({ title, value, percentage }) => (
    <div className="bg-[#0f0f14]/80 backdrop-blur-md border border-white/5 rounded-2xl p-5 flex flex-col justify-between hover:border-purple-500/30 transition-all duration-300">
      <p className="text-sm text-gray-400 font-medium mb-2">{title}</p>
      <div className="flex items-end gap-3">
        <h3 className="text-3xl font-bold text-white">{value}</h3>
        {percentage && <span className="text-sm font-semibold text-purple-400 mb-1">{percentage}</span>}
      </div>
    </div>
  );

  return (
    <div className="animate-fade-in text-white space-y-6 max-w-7xl mx-auto pb-10">
      {/* Top Header */}
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-2xl font-bold text-white tracking-tight">Dashboard</h1>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <MetricCard title="Leads Encontrados" value={loading ? '...' : totalAnalisados.toLocaleString('pt-BR')} />
        <MetricCard title="Conversas Iniciadas" value={loading ? '...' : conversasIniciadas.toLocaleString('pt-BR')} />
        <MetricCard title="Respostas" value={loading ? '...' : respostas.toLocaleString('pt-BR')} />
        <MetricCard title="Vendas Fechadas" value={loading ? '...' : vendasFechadas.toLocaleString('pt-BR')} />
      </div>

      {/* Uso do Plano - Trial Users */}
      {planInfo && !planInfo.isAdmin && planInfo.usage && planInfo.limits && (
        <div className="bg-[#0f0f14]/80 backdrop-blur-md border border-white/5 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-bold text-lg flex items-center gap-2">
              <Activity className="text-purple-400" size={20} /> Uso do Plano
            </h3>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-purple-500/10 border border-purple-500/20">
              <Clock size={14} className="text-purple-400" />
              <span className="text-xs font-semibold text-purple-400">
                {planInfo.daysLeft} {planInfo.daysLeft === 1 ? 'dia restante' : 'dias restantes'}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <PlanProgressBar label="Leads Utilizados" current={planInfo.usage.leadsCount || 0} max={planInfo.limits.maxLeads || 50} />
            <PlanProgressBar label="Mensagens Hoje" current={planInfo.usage.messagesToday || 0} max={planInfo.limits.maxMessagesPerDay || 20} />
            <PlanProgressBar label="Buscas Hoje" current={planInfo.usage.scrapesToday || 0} max={planInfo.limits.maxScrapesPerDay || 3} />
          </div>
        </div>
      )}

      {/* Middle Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Line Chart */}
        <div className="lg:col-span-2 bg-[#0f0f14]/80 backdrop-blur-md border border-white/5 rounded-2xl p-6 relative overflow-hidden">
          {/* Subtle Glow Background */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-purple-600/20 blur-[100px] pointer-events-none rounded-full" />
          
          <h3 className="text-base font-semibold text-white mb-6 relative z-10">Leads ao longo do tempo</h3>
          <div className="h-64 relative z-10 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockTimelineData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2D2D35" vertical={false} />
                <XAxis dataKey="name" stroke="#6B7280" tick={{ fill: '#6B7280', fontSize: 12 }} axisLine={false} tickLine={false} dy={10} />
                <YAxis stroke="#6B7280" tick={{ fill: '#6B7280', fontSize: 12 }} axisLine={false} tickLine={false} />
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: '#121216', borderColor: '#333', borderRadius: '8px', color: '#fff' }}
                  itemStyle={{ color: '#A855F7' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="leads" 
                  stroke="#A855F7" 
                  strokeWidth={3}
                  dot={{ r: 4, fill: '#A855F7', strokeWidth: 2, stroke: '#0f0f14' }}
                  activeDot={{ r: 6, fill: '#fff', stroke: '#A855F7', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Donut Chart */}
        <div className="bg-[#0f0f14]/80 backdrop-blur-md border border-white/5 rounded-2xl p-6 flex flex-col">
          <h3 className="text-base font-semibold text-white mb-2">Origem dos Leads</h3>
          <div className="flex-1 flex items-center justify-center relative">
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie
                  data={mockSourceData}
                  cx="45%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={70}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {mockSourceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <RechartsTooltip contentStyle={{ backgroundColor: '#121216', borderColor: '#333', borderRadius: '8px' }} />
              </PieChart>
            </ResponsiveContainer>
            
            {/* Legend inside Donut */}
            <div className="absolute right-0 top-1/2 -translate-y-1/2 flex flex-col gap-3">
              {mockSourceData.map((entry, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
                  <span className="text-xs text-gray-300 font-medium whitespace-nowrap">{entry.name} <span className="text-gray-500 ml-1">{entry.value}%</span></span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Campanhas Ativas */}
        <div className="bg-[#0f0f14]/80 backdrop-blur-md border border-white/5 rounded-2xl p-6 flex flex-col h-[320px]">
          <h3 className="text-base font-semibold text-white mb-6">Campanhas ativas</h3>
          <div className="flex-1 space-y-5 overflow-y-auto pr-2 scrollbar-hide">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.8)]" />
                <span className="text-sm font-medium text-white">Clínica Odontológica</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-400">320</span>
                <span className="text-xs font-bold text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded">+12%</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
                <span className="text-sm font-medium text-white">Academias</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-400">278</span>
                <span className="text-xs font-bold text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded">+8%</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.8)]" />
                <span className="text-sm font-medium text-white">Salões de Beleza</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-400">184</span>
                <span className="text-xs font-bold text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded">+15%</span>
              </div>
            </div>
          </div>
          <button className="w-full mt-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-sm font-semibold text-white transition-colors">
            Ver todas
          </button>
        </div>

        {/* Taxa de Resposta Area Chart */}
        <div className="bg-[#0f0f14]/80 backdrop-blur-md border border-white/5 rounded-2xl p-6 flex flex-col h-[320px]">
          <h3 className="text-base font-semibold text-white mb-2">Taxa de Resposta</h3>
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-3xl font-bold text-white">48,7%</h2>
            <span className="text-sm font-bold text-purple-400">+8,2%</span>
          </div>
          <div className="flex-1 w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockResponseRateData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRate" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#A855F7" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#A855F7" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="rate" stroke="#A855F7" strokeWidth={2} fillOpacity={1} fill="url(#colorRate)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Últimas Conversas */}
        <div className="bg-[#0f0f14]/80 backdrop-blur-md border border-white/5 rounded-2xl p-6 flex flex-col h-[320px]">
          <h3 className="text-base font-semibold text-white mb-6">Últimas conversas</h3>
          <div className="flex-1 space-y-4 overflow-y-auto pr-2 scrollbar-hide">
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img src={`https://ui-avatars.com/api/?name=C+S&background=3b82f6&color=fff&rounded=true`} alt="Avatar" className="w-9 h-9 rounded-full" />
                <div>
                  <p className="text-sm font-bold text-white">Clínica Sorriso</p>
                  <p className="text-xs text-gray-400">Mensagem enviada</p>
                </div>
              </div>
              <span className="text-xs text-gray-500">10:24</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img src={`https://ui-avatars.com/api/?name=A+A&background=ef4444&color=fff&rounded=true`} alt="Avatar" className="w-9 h-9 rounded-full" />
                <div>
                  <p className="text-sm font-bold text-white">Academia Ativa</p>
                  <p className="text-xs text-gray-400">Respondeu</p>
                </div>
              </div>
              <span className="text-xs text-gray-500">10:18</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img src={`https://ui-avatars.com/api/?name=S+B&background=f59e0b&color=fff&rounded=true`} alt="Avatar" className="w-9 h-9 rounded-full" />
                <div>
                  <p className="text-sm font-bold text-white">Studio Beleza</p>
                  <p className="text-xs text-gray-400">Interesse detectado</p>
                </div>
              </div>
              <span className="text-xs text-gray-500">10:11</span>
            </div>

          </div>
          <button onClick={() => setActiveTab && setActiveTab('mensagens')} className="w-full mt-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-sm font-semibold text-white transition-colors">
            Ver todas
          </button>
        </div>

      </div>
    </div>
  );
}
