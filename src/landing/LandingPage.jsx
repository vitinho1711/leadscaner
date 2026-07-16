import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { 
  Bot, Target, Search, MessageSquare, Briefcase, ChevronDown, ChevronRight,
  Zap, BarChart2, ShieldCheck, Mail, ArrowRight, Play, CheckCircle, 
  Globe, Smartphone, PieChart, Activity, Users, User, Settings, Database, Server, Sparkles,
  DollarSign, RefreshCcw, Video, Brain, LayoutDashboard, X, ArrowDown, Star, Check,
  Lock, Key, Shield, MessageCircle
} from 'lucide-react';
import './LandingPage.css';

// Componente helper para animação de digitação
const TypewriterText = ({ text }) => {
  return (
    <motion.span
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5, ease: "easeOut" }}
    >
      {text}
    </motion.span>
  );
};

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const { scrollYProgress } = useScroll();
  const yParallax = useTransform(scrollYProgress, [0, 1], [0, -100]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const fadeIn = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  return (
    <div className="lp-container selection:bg-blue-500/30">
      <div className="bg-grid"></div>
      <div className="bg-aurora"></div>

      {/* HEADER */}
      <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-[#02040A]/80 backdrop-blur-md border-b border-white/5 py-4' : 'py-6'}`}>
        <div className="max-w-[1300px] mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shadow-[0_0_15px_rgba(59,130,246,0.5)]">
              <Sparkles size={18} className="text-white" />
            </div>
            <span className="text-xl font-bold text-white tracking-tight">Lead Scanner</span>
          </div>
          
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-400">
            <a href="#problema" className="hover:text-white transition-colors">Problema</a>
            <a href="#solucao" className="hover:text-white transition-colors">Solução</a>
            <a href="#funcionalidades" className="hover:text-white transition-colors">Diferenciais</a>
            <a href="#planos" className="hover:text-white transition-colors">Planos</a>
          </nav>
          
          <div className="flex items-center gap-4">
            <a href="/login" className="text-sm font-medium text-white hover:text-gray-300 transition-colors">Login</a>
            <a href="/login?register=true" className="btn-primary py-2 px-4 text-sm hidden md:flex">
              Começar Grátis
            </a>
          </div>
        </div>
      </header>

      {/* 1. HERO CINEMATOGRÁFICO */}
      <section className="relative z-10 pt-40 pb-20 px-6 min-h-screen flex items-center overflow-hidden">
        <div className="max-w-[1300px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <motion.div 
            initial="hidden" animate="visible" variants={fadeIn}
            className="lg:col-span-6 flex flex-col gap-8 relative z-20"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 w-fit text-sm font-semibold">
              <Sparkles size={14} /> Novo Módulo IA LLaMA 3
            </div>
            
            <h1 className="text-5xl lg:text-[4rem] font-black text-white leading-[1.05] tracking-tight">
              Sua <span className="text-gradient">IA SDR</span> que encontra empresas, inicia conversas e agenda reuniões.
            </h1>
            
            <p className="text-xl text-gray-400 leading-relaxed font-medium">
              Pare de perder horas procurando clientes. O Lead Scanner varre a internet, qualifica leads, cria mensagens hiper-personalizadas e responde automaticamente até colocar a reunião na sua agenda.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center mt-4">
              <a href="/login?register=true" className="btn-primary text-lg w-full sm:w-auto">
                COMEÇAR TESTE GRÁTIS
              </a>
              <a href="#demo" className="btn-outline text-lg w-full sm:w-auto">
                <Play size={20} /> Agendar Demo
              </a>
            </div>
            <p className="text-sm text-gray-500">Sem necessidade de cartão de crédito. Setup em 2 minutos.</p>
          </motion.div>
          
          {/* 3D Dashboard Mockup */}
          <motion.div 
            initial={{ opacity: 0, x: 100, rotateY: 20 }}
            animate={{ opacity: 1, x: 0, rotateY: 0 }}
            transition={{ duration: 1.2, type: "spring" }}
            className="lg:col-span-6 relative perspective-container hidden lg:block h-[600px]"
          >
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/20 blur-[100px] rounded-full"></div>
            
            <div className="dashboard-3d w-full h-full relative">
              {/* Main Panel */}
              <div className="absolute top-[10%] right-0 w-[500px] h-[350px] bg-[#0A0F24]/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-10 flex flex-col">
                <div className="h-10 border-b border-white/10 flex items-center px-4 justify-between bg-[#050816]">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
                  </div>
                  <span className="text-xs text-gray-500 font-mono">app.leadscanner.com</span>
                </div>
                <div className="flex-1 p-6 relative overflow-hidden">
                  <div className="flex justify-between items-end mb-6">
                    <div>
                      <p className="text-gray-400 text-sm">Leads Encontrados (Hoje)</p>
                      <p className="text-4xl font-black text-white">2,841</p>
                    </div>
                    <div className="w-24 h-12">
                      <svg viewBox="0 0 100 40" className="w-full h-full stroke-green-400 fill-none" strokeWidth="3">
                        <path d="M0 40 L20 30 L40 35 L60 15 L80 20 L100 0" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  </div>
                  
                  {/* Flutuantes animadas */}
                  <motion.div 
                    animate={{ y: [0, -10, 0] }} transition={{ duration: 4, repeat: Infinity }}
                    className="absolute bottom-8 left-6 right-6 bg-white/5 border border-white/10 rounded-lg p-3 flex gap-3 items-center"
                  >
                    <div className="w-8 h-8 rounded bg-green-500/20 text-green-400 flex items-center justify-center shrink-0"><Check size={16}/></div>
                    <div>
                      <p className="text-white text-sm font-bold">Reunião Agendada!</p>
                      <p className="text-gray-400 text-xs">A IA marcou call com Diretor da TechCorp.</p>
                    </div>
                  </motion.div>
                </div>
              </div>

              {/* Chat Bubble Floating */}
              <motion.div 
                animate={{ y: [0, 15, 0] }} transition={{ duration: 5, repeat: Infinity, delay: 1 }}
                className="absolute top-[40%] -left-10 w-[280px] bg-[#111827] border border-green-500/30 rounded-xl p-4 shadow-xl z-20"
              >
                <div className="flex gap-2 items-center mb-2">
                  <MessageCircle size={14} className="text-green-400" />
                  <span className="text-xs font-bold text-gray-400">WhatsApp IA</span>
                </div>
                <p className="text-sm text-white">"Claro João, posso te mostrar como a empresa X economizou 30%. Terça às 14h fica bom pra você?"</p>
              </motion.div>

              {/* Data Extraction Floating */}
              <motion.div 
                animate={{ y: [0, -15, 0] }} transition={{ duration: 6, repeat: Infinity, delay: 2 }}
                className="absolute -top-5 right-10 w-[220px] bg-[#111827] border border-blue-500/30 rounded-xl p-4 shadow-xl z-0"
              >
                <div className="flex gap-2 items-center mb-2">
                  <Database size={14} className="text-blue-400" />
                  <span className="text-xs font-bold text-gray-400">Scraping em Tempo Real</span>
                </div>
                <div className="space-y-2">
                  <div className="h-2 w-full bg-white/10 rounded"></div>
                  <div className="h-2 w-3/4 bg-white/10 rounded"></div>
                  <div className="h-2 w-5/6 bg-white/10 rounded"></div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. BARRA DE CONFIANÇA (MÉTRICAS) */}
      <section className="border-y border-white/5 bg-white/[0.02] py-8 relative z-10 overflow-hidden">
        <div className="max-w-[1300px] mx-auto px-6">
          <div className="flex flex-wrap justify-between items-center gap-8 md:gap-4">
            {[
              { value: "+18.000", label: "Empresas analisadas" },
              { value: "+320.000", label: "Mensagens enviadas" },
              { value: "94%", label: "Taxa de entrega" },
              { value: "42%", label: "Taxa média de resposta" },
              { value: "40h", label: "Economizadas por semana" }
            ].map((stat, i) => (
              <div key={i} className="text-center flex-1 min-w-[150px]">
                <h4 className="text-3xl font-black text-white">{stat.value}</h4>
                <p className="text-sm font-medium text-gray-500 uppercase tracking-wider mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. O PROBLEMA (VISUAL VERMELHO) */}
      <section id="problema" className="section-padding">
        <motion.div 
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-black text-white mb-6">Sua equipe perde horas fazendo isso todos os dias.</h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            O modelo tradicional de vendas B2B quebrou. Pagar humanos para fazer trabalho de robô destrói sua margem de lucro.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-12">
          {[
            "Procurando empresas manualmente",
            "Copiando números para planilhas",
            "Escrevendo mensagens iguais",
            "Respondendo leads frios",
            "Fazendo Follow Up esquecido",
            "Perdendo oportunidades reais"
          ].map((text, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              className="bg-red-500/10 border border-red-500/20 rounded-xl p-6 flex flex-col items-center text-center gap-4 hover:bg-red-500/20 transition-colors"
            >
              <div className="w-12 h-12 rounded-full bg-red-500/20 text-red-500 flex items-center justify-center">
                <X size={24} />
              </div>
              <span className="text-sm font-bold text-gray-300">{text}</span>
            </motion.div>
          ))}
        </div>
        
        <div className="text-center">
          <p className="text-2xl font-black text-gradient-purple uppercase tracking-widest">Tudo isso desaparece com uma IA.</p>
        </div>
      </section>

      {/* 4. JORNADA DE 7 PASSOS (COMO FUNCIONA) */}
      <section id="solucao" className="section-padding bg-[#0A0F24]/30 border-y border-white/5 relative">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-black text-white">A Linha de Produção Perfeita</h2>
          <p className="text-xl text-gray-400 mt-4">Nenhum ser humano consegue ser tão rápido e consistente.</p>
        </div>
        
        <div className="max-w-[800px] mx-auto relative">
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500/0 via-blue-500/50 to-purple-500/0 md:-translate-x-1/2"></div>
          
          {[
            { step: 1, title: "Procura empresas", desc: "Varre a web por nicho, região e palavra-chave.", icon: <Globe/> },
            { step: 2, title: "A IA analisa", desc: "Verifica nicho, qualidade e potencial de compra.", icon: <Brain/> },
            { step: 3, title: "Cria mensagens", desc: "Abordagem 100% diferente para cada empresa.", icon: <MessageSquare/> },
            { step: 4, title: "Envia automaticamente", desc: "Dispara via WhatsApp sem bloqueios.", icon: <Zap/> },
            { step: 5, title: "A IA conversa", desc: "Contorna objeções de preço, tempo e interesse.", icon: <MessageCircle/> },
            { step: 6, title: "Agenda reunião", desc: "Manda o link do Calendly na hora certa.", icon: <Target/> },
            { step: 7, title: "Você vende", desc: "Seu humano só entra no fechamento.", icon: <DollarSign/> }
          ].map((item, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, x: i % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
              className={`relative flex items-center mb-12 ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} flex-row`}
            >
              {/* Timeline dot */}
              <div className="absolute left-8 md:left-1/2 w-8 h-8 rounded-full bg-[#050816] border-4 border-blue-500 transform -translate-x-1/2 flex items-center justify-center z-10 shadow-[0_0_15px_rgba(59,130,246,0.6)]">
                <span className="text-[10px] font-bold text-white">{item.step}</span>
              </div>
              
              <div className={`w-full md:w-1/2 pl-20 md:pl-0 ${i % 2 === 0 ? 'md:pr-16 md:text-right' : 'md:pl-16 md:text-left'}`}>
                <div className={`glass-panel p-6 hover:border-blue-500/50 transition-colors inline-block text-left w-full max-w-[350px] ${i % 2 === 0 ? 'md:float-right' : 'md:float-left'}`}>
                  <div className={`w-10 h-10 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center mb-4 ${i % 2 === 0 ? 'md:ml-auto' : ''}`}>
                    {item.icon}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-gray-400 text-sm">{item.desc}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 5. DEMONSTRAÇÃO DO DASHBOARD (VÍDEO/ANIMAÇÃO GRANDE) */}
      <section className="section-padding">
        <div className="glass-panel p-2 md:p-4 rounded-[2rem] border-blue-500/30 shadow-[0_0_80px_rgba(59,130,246,0.15)] relative overflow-hidden group">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-10 group-hover:opacity-20 transition-opacity duration-700"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#050816] via-[#050816]/80 to-transparent mix-blend-overlay"></div>
          
          <div className="aspect-[16/7] bg-[#02040A]/80 rounded-2xl relative z-10 flex items-center justify-center overflow-hidden">
             <div className="text-center relative z-20">
               <div className="w-24 h-24 rounded-full bg-blue-600/90 flex items-center justify-center text-white mx-auto mb-6 cursor-pointer hover:scale-110 transition-transform shadow-[0_0_40px_rgba(59,130,246,0.8)]">
                 <Play size={40} className="ml-2" />
               </div>
               <h3 className="text-2xl font-black text-white tracking-widest uppercase">Ver a Máquina Operando</h3>
             </div>
             
             {/* Efeitos de UI Flutuantes de fundo */}
             <div className="absolute top-10 left-10 w-64 glass-panel p-4 opacity-80 animate-float" style={{ animationDelay: '0s' }}>
               <div className="text-xs font-bold text-blue-400 mb-1 uppercase tracking-wider">Leads Extraídos</div>
               <div className="text-3xl font-black text-white mb-2">12,492</div>
               <div className="flex items-center gap-2 text-xs text-green-400">
                 <Activity size={12} />
                 <span>+14% essa semana</span>
               </div>
             </div>
             <div className="absolute bottom-10 right-10 w-72 glass-panel p-4 opacity-80 animate-float" style={{ animationDelay: '1s' }}>
               <div className="flex justify-between items-center mb-2">
                 <div className="text-xs font-bold text-green-400 uppercase tracking-wider">Calls Agendadas</div>
                 <div className="text-xl font-black text-white">47</div>
               </div>
               <div className="mt-2 space-y-2">
                 <div className="flex items-center gap-2 text-sm text-gray-300 bg-white/5 p-2 rounded">
                   <Target size={14} className="text-blue-400"/> Reunião com Diretor TI
                 </div>
                 <div className="flex items-center gap-2 text-sm text-gray-300 bg-white/5 p-2 rounded">
                   <Target size={14} className="text-blue-400"/> Reunião com CEO
                 </div>
               </div>
             </div>
          </div>
        </div>
      </section>

      {/* 6. CÉREBRO HOLOGRÁFICO (IA) */}
      <section className="section-padding relative">
        <div className="text-center mb-20 relative z-20">
          <h2 className="text-4xl md:text-5xl font-black text-white">A IA faz o trabalho pesado.</h2>
          <p className="text-xl text-purple-200 mt-4">Não é um chatbot de botões. É Cognição de Vendas.</p>
        </div>
        
        <div className="flex flex-col items-center justify-center relative min-h-[500px]">
          {/* Cérebro Central */}
          <div className="brain-container z-20 flex items-center justify-center bg-black rounded-full border border-purple-500/30">
            <div className="brain-core"></div>
            <Brain size={100} className="text-purple-400 relative z-10" />
            
            {/* Linhas Conectivas SVG */}
            <svg className="absolute inset-[-200px] w-[calc(100%+400px)] h-[calc(100%+400px)] pointer-events-none opacity-30 hidden md:block">
              <path d="M350,350 L150,150" stroke="#7C3AED" strokeWidth="2" strokeDasharray="5,5" />
              <path d="M350,350 L550,150" stroke="#7C3AED" strokeWidth="2" strokeDasharray="5,5" />
              <path d="M350,350 L100,350" stroke="#7C3AED" strokeWidth="2" strokeDasharray="5,5" />
              <path d="M350,350 L600,350" stroke="#7C3AED" strokeWidth="2" strokeDasharray="5,5" />
              <path d="M350,350 L150,550" stroke="#7C3AED" strokeWidth="2" strokeDasharray="5,5" />
              <path d="M350,350 L550,550" stroke="#7C3AED" strokeWidth="2" strokeDasharray="5,5" />
            </svg>
          </div>
          
          {/* Funcionalidades ao redor (Absolute em Desktop, Grid em Mobile) */}
          <div className="md:absolute inset-0 w-full h-full flex flex-col md:block gap-4 mt-10 md:mt-0 relative z-30">
             {[
               { text: "Analisa Leads", pos: "md:top-[5%] md:left-[15%]" },
               { text: "Escreve Mensagens", pos: "md:top-[5%] md:right-[15%]" },
               { text: "Aprende Respostas", pos: "md:top-[45%] md:left-[5%]" },
               { text: "Contorna Objeções", pos: "md:top-[45%] md:right-[5%]" },
               { text: "Responde Clientes", pos: "md:bottom-[15%] md:left-[20%]" },
               { text: "Agenda Reuniões", pos: "md:bottom-[15%] md:right-[20%]" },
             ].map((item, i) => (
                <div key={i} className={`md:absolute ${item.pos} glass-panel px-6 py-3 border-purple-500/30 flex items-center gap-3 w-fit mx-auto shadow-[0_0_20px_rgba(124,58,237,0.15)]`}>
                  <CheckCircle size={16} className="text-purple-400" />
                  <span className="font-bold text-white text-sm">{item.text}</span>
                </div>
             ))}
          </div>
        </div>
      </section>

      {/* 7. GRID DE DIFERENCIAIS PREMIUM */}
      <section id="funcionalidades" className="section-padding bg-[#0A0F24]/30 border-y border-white/5">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-white">Tudo que você precisa em um único login.</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { title: "IA SDR", desc: "Conversa igual um vendedor humano.", icon: <Brain/> },
            { title: "Web Scraping", desc: "Encontra empresas automaticamente.", icon: <Search/> },
            { title: "WhatsApp", desc: "Integração nativa e aquecimento.", icon: <MessageSquare/> },
            { title: "Campanhas", desc: "Disparos inteligentes em massa.", icon: <Target/> },
            { title: "Dashboard", desc: "KPIs em tempo real.", icon: <PieChart/> },
            { title: "Multi Contas", desc: "Vários atendentes no mesmo funil.", icon: <Users/> },
            { title: "Follow-up", desc: "Nunca esquece de um cliente.", icon: <RefreshCcw/> },
            { title: "IA Especialista", desc: "Treinada com seu script de vendas.", icon: <Bot/> },
            { title: "Classificação", desc: "Análise de leads automática.", icon: <BarChart2/> },
            { title: "Agências", desc: "Gerencie vários clientes.", icon: <Briefcase/> },
            { title: "QR Code", desc: "Conecte seu zap em segundos.", icon: <Smartphone/> },
            { title: "Multi Tenant", desc: "Isolamento total de dados.", icon: <Server/> }
          ].map((feature, i) => (
            <div key={i} className="feature-card p-6">
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center mb-4">
                {feature.icon}
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
              <p className="text-gray-400 text-sm font-medium">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 8. COMPARAÇÃO (❌ VS ✅) */}
      <section className="section-padding">
        <div className="max-w-[1000px] mx-auto bg-black border border-white/10 rounded-3xl overflow-hidden flex flex-col md:flex-row shadow-[0_0_50px_rgba(0,0,0,0.5)]">
          <div className="flex-1 p-10 bg-red-500/5">
            <h3 className="text-2xl font-black text-gray-400 mb-8 uppercase tracking-wider text-center">Sua equipe hoje</h3>
            <ul className="space-y-6">
              {['Procurar empresas', 'Copiar telefone', 'Criar mensagens', 'Follow Up Manual', 'Responder um a um', 'Organizar Planilhas', 'Muito tempo perdido'].map((item, i) => (
                <li key={i} className="flex items-center gap-4 text-gray-500 font-medium text-lg">
                  <div className="w-6 h-6 rounded-full bg-red-500/20 flex items-center justify-center shrink-0"><X size={14} className="text-red-500"/></div>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          
          <div className="flex-1 p-10 bg-blue-600/10 border-l border-blue-500/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/20 blur-[80px]"></div>
            <h3 className="text-2xl font-black text-white mb-8 uppercase tracking-wider text-center text-gradient">Lead Scanner</h3>
            <div className="flex flex-col items-center justify-center h-full pb-16">
              <div className="w-20 h-20 rounded-full bg-blue-500/20 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(59,130,246,0.5)]">
                <Check size={40} className="text-blue-400" />
              </div>
              <p className="text-3xl font-black text-white">A IA FAZ TUDO</p>
              <p className="text-blue-200 mt-2 text-center">Enquanto você foca apenas em fechar o negócio.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 9. RESULTADOS ESPERADOS (GRANDES NÚMEROS) */}
      <section className="section-padding border-y border-white/5 bg-gradient-to-b from-[#02040A] to-[#0A0F24]">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-black text-white">Resultados Comprovados</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-[1200px] mx-auto">
          {[
            { num: "80%", desc: "Menos tempo prospectando" },
            { num: "3x", desc: "Mais reuniões agendadas" },
            { num: "94%", desc: "Taxa de entrega no WhatsApp" },
            { num: "24/7", desc: "Sua IA trabalhando sem parar" }
          ].map((stat, i) => (
            <div key={i} className="text-center glass-panel p-8 border-t-4 border-t-blue-500">
              <h3 className="text-6xl font-black text-white mb-4">{stat.num}</h3>
              <p className="text-gray-400 font-bold uppercase tracking-wider text-sm">{stat.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 10. INTEGRAÇÕES & SEGURANÇA */}
      <section className="section-padding text-center">
        <h2 className="text-2xl font-bold text-gray-500 mb-10 uppercase tracking-widest">Tecnologia de Ponta Integrada</h2>
        
        {/* Fake Logos - Representados com texto premium para o MVP */}
        <div className="flex flex-wrap justify-center gap-8 md:gap-16 items-center opacity-60 mb-20">
           {['WhatsApp Native', 'OpenAI LLaMA', 'Groq Inference', 'Google Maps API', 'React & Node.js', 'Supabase'].map((tech, i) => (
             <span key={i} className="text-xl font-black tracking-tighter grayscale-hover cursor-default text-gray-400">{tech}</span>
           ))}
        </div>

        <div className="max-w-[800px] mx-auto glass-panel p-8 text-left grid grid-cols-1 md:grid-cols-2 gap-8 items-center border-green-500/20">
          <div>
            <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-3"><Shield className="text-green-400"/> Segurança Nível Enterprise</h3>
            <p className="text-gray-400 mb-4">Seus dados e os dados dos seus clientes estão protegidos com os mais altos padrões da indústria.</p>
          </div>
          <ul className="space-y-3">
            {[
              { icon: <Key size={16}/>, text: "Autenticação via JWT" },
              { icon: <Lock size={16}/>, text: "Criptografia de ponta a ponta" },
              { icon: <Server size={16}/>, text: "Sessões WWebJS isoladas" },
              { icon: <ShieldCheck size={16}/>, text: "Arquitetura Multi Tenant" }
            ].map((item, i) => (
              <li key={i} className="flex items-center gap-3 text-white font-medium text-sm">
                <span className="text-green-400">{item.icon}</span> {item.text}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 11. PROVA SOCIAL (DEPOIMENTOS) */}
      <section className="section-padding bg-[#0A0F24]/30">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-black text-white">Eles demitiram as planilhas.</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-[1200px] mx-auto">
          {[
            {
              quote: "Nossa equipe dobrou as reuniões em apenas duas semanas. A IA contorna objeções melhor que meus vendedores júniores.",
              name: "Carlos Mendes",
              role: "CEO, TechGrowth B2B"
            },
            {
              quote: "Antes pagávamos R$ 3.000 num SDR que mandava 50 mensagens. Hoje pagamos uma fração disso e a ferramenta faz 500 abordagens diárias hiper-personalizadas.",
              name: "Amanda Silva",
              role: "Diretora Comercial, Agência X"
            },
            {
              quote: "O scraper encontrou 2.000 clínicas odontológicas na minha região. A IA fez o filtro, agendou 12 calls e nós fechamos 3 contratos. Tudo automático.",
              name: "Roberto Almeida",
              role: "Founder, SaaS Saúde"
            }
          ].map((item, i) => (
            <div key={i} className="glass-panel p-8 flex flex-col gap-6">
              <div className="flex gap-1 text-yellow-500">
                {[1,2,3,4,5].map(n => <Star key={n} size={16} fill="currentColor" />)}
              </div>
              <p className="text-lg text-white font-medium italic flex-1 leading-relaxed">"{item.quote}"</p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 p-[2px]">
                  <div className="w-full h-full bg-[#050816] rounded-full"></div>
                </div>
                <div>
                  <h4 className="font-bold text-white">{item.name}</h4>
                  <p className="text-sm text-gray-400">{item.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 12. PLANOS */}
      <section id="planos" className="section-padding">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-white">Contrate seu SDR Virtual</h2>
          <p className="text-xl text-gray-400 mt-4 max-w-2xl mx-auto">Mais barato que um estagiário. 100x mais eficiente.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-[1100px] mx-auto">
          {/* Starter */}
          <div className="glass-panel p-8 flex flex-col hover:border-blue-500/30 transition-colors">
            <h3 className="text-2xl font-bold text-white">Starter</h3>
            <p className="text-gray-400 mt-2 mb-6 text-sm">Para freelancers e consultores independentes.</p>
            <div className="text-4xl font-black text-white mb-6">R$ 297<span className="text-base text-gray-500 font-medium">/mês</span></div>
            <ul className="space-y-4 mb-8 flex-1">
              {['Até 1.000 extrações mensais', '1 Conexão WhatsApp', 'IA LLaMA Básica', 'Dashboard Padrão'].map((f, i) => (
                <li key={i} className="flex items-center gap-3 text-sm text-gray-300"><Check size={16} className="text-blue-500"/> {f}</li>
              ))}
            </ul>
            <a href="/login?register=true" className="btn-outline w-full">Assinar Starter</a>
          </div>

          {/* Professional (Destaque) */}
          <div className="glass-panel p-8 flex flex-col border-blue-500 shadow-[0_0_40px_rgba(59,130,246,0.2)] relative transform md:-translate-y-4 bg-[#0A0F24]">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs font-bold px-4 py-1 rounded-full uppercase tracking-wider">
              A Máquina Completa
            </div>
            <h3 className="text-2xl font-bold text-white">Professional</h3>
            <p className="text-blue-200 mt-2 mb-6 text-sm">Para times de vendas comerciais.</p>
            <div className="text-4xl font-black text-white mb-6">R$ 997<span className="text-base text-blue-300 font-medium">/mês</span></div>
            <ul className="space-y-4 mb-8 flex-1">
              {['Extrações Ilimitadas', '3 Conexões WhatsApp', 'IA Avançada (Treino Customizado)', 'Campanhas Multi-Follow-up', 'Relatórios Avançados'].map((f, i) => (
                <li key={i} className="flex items-center gap-3 text-sm text-white font-medium"><Check size={16} className="text-blue-400"/> {f}</li>
              ))}
            </ul>
            <a href="/login?register=true" className="btn-primary w-full shadow-[0_0_20px_rgba(59,130,246,0.4)]">
              TESTAR GRÁTIS
            </a>
          </div>

          {/* Enterprise */}
          <div className="glass-panel p-8 flex flex-col hover:border-blue-500/30 transition-colors">
            <h3 className="text-2xl font-bold text-white">Enterprise</h3>
            <p className="text-gray-400 mt-2 mb-6 text-sm">Para agências e franquias (White-label).</p>
            <div className="text-4xl font-black text-white mb-6">R$ 2.997<span className="text-base text-gray-500 font-medium">/mês</span></div>
            <ul className="space-y-4 mb-8 flex-1">
              {['Tudo do Professional', 'Conexões WhatsApp Ilimitadas', 'Multi-Tenancy (Vários Clientes)', 'API e Webhooks', 'Gerente de Sucesso'].map((f, i) => (
                <li key={i} className="flex items-center gap-3 text-sm text-gray-300"><Check size={16} className="text-blue-500"/> {f}</li>
              ))}
            </ul>
            <a href="#contato" className="btn-outline w-full">Falar com Vendas</a>
          </div>
        </div>
      </section>

      {/* 13. FAQ COMPLETO */}
      <section className="section-padding max-w-[800px]">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-black text-white">Perguntas Frequentes</h2>
        </div>
        <div className="space-y-3">
          {[
            "O Lead Scanner substitui um vendedor humano?",
            "Qual o limite de mensagens por dia?",
            "Meu número de WhatsApp pode ser banido?",
            "Preciso ter o ChatGPT pago para usar a IA?",
            "Funciona para qualquer nicho (B2B e B2C)?",
            "Como o sistema encontra as empresas?",
            "Posso treinar a IA com meu próprio texto de vendas?",
            "Existe período de fidelidade ou posso cancelar?"
          ].map((q, i) => (
            <div key={i} className="glass-panel p-5 flex justify-between items-center cursor-pointer hover:bg-white/5 transition-colors group">
              <span className="font-bold text-gray-200 group-hover:text-white">{q}</span>
              <ChevronDown className="text-gray-500 group-hover:text-blue-400 transition-colors" />
            </div>
          ))}
        </div>
      </section>

      {/* 14. CTA CINEMATOGRÁFICO FINAL */}
      <section className="py-40 px-6 relative z-10 bg-black border-t border-white/10 overflow-hidden">
        {/* Luz Azul Central */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-600/20 blur-[150px] rounded-full pointer-events-none"></div>
        <div className="lp-particles"></div>
        
        <div className="max-w-[900px] mx-auto text-center relative z-10">
          <h2 className="text-5xl md:text-7xl font-black text-white mb-8 tracking-tighter">
            Sua próxima reunião pode estar esperando agora.
          </h2>
          <p className="text-2xl text-gray-400 mb-12 font-medium">
            Enquanto você lê esta página, sua concorrência pode estar prospectando automaticamente. Comece hoje e deixe a IA trabalhar por você.
          </p>
          <a href="/login?register=true" className="btn-primary text-xl px-12 py-6 rounded-2xl w-full sm:w-auto">
            COMEÇAR TESTE GRÁTIS AGORA
          </a>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#02040A] border-t border-white/5 py-12 relative z-10">
        <div className="max-w-[1300px] mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <Sparkles size={20} className="text-blue-500" />
            <span className="text-lg font-bold text-white">Lead Scanner B2B</span>
          </div>
          
          <div className="flex gap-8 text-sm font-medium text-gray-500">
            <a href="#" className="hover:text-white transition-colors">Termos de Uso</a>
            <a href="#" className="hover:text-white transition-colors">Política de Privacidade</a>
            <a href="#" className="hover:text-white transition-colors">Falar com Vendas</a>
          </div>
          
          <div className="text-xs text-gray-600 font-bold uppercase tracking-widest">
            © 2026 Lead Scanner IA
          </div>
        </div>
      </footer>
    </div>
  );
}
