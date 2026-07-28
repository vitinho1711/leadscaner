import React from 'react';
import { motion } from 'framer-motion';
import { Bot, Play, ChevronRight, Sparkles } from 'lucide-react';

export default function Hero() {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center pt-20 pb-32">
      {/* Navbar overlay */}
      <nav className="absolute top-0 w-full px-6 py-6 flex justify-between items-center z-50 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-600 to-fuchsia-500 flex items-center justify-center shadow-[0_0_15px_rgba(147,51,234,0.5)]">
            <Bot size={24} className="text-white" />
          </div>
          <span className="text-2xl font-bold tracking-tight">Lead<span className="text-purple-400">Scanner</span></span>
        </div>
        <div className="hidden md:flex gap-8 text-sm font-medium text-slate-300">
          <a href="#funciona" className="hover:text-purple-400 transition-colors">Como funciona</a>
          <a href="#recursos" className="hover:text-purple-400 transition-colors">Recursos</a>
          <a href="#planos" className="hover:text-purple-400 transition-colors">Planos</a>
          <a href="#faq" className="hover:text-purple-400 transition-colors">FAQ</a>
        </div>
        <div>
          <button onClick={() => window.location.href='/login'} className="btn-outline !py-2 !px-6 !text-sm">
            Entrar
          </button>
        </div>
      </nav>

      {/* Main Hero Content */}
      <div className="w-full max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center z-10 mt-10">
        
        {/* Left: Copy */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col gap-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-900/30 border border-purple-500/30 w-fit">
            <Sparkles size={16} className="text-fuchsia-400" />
            <span className="text-sm font-medium text-purple-200">A Nova Era da Prospecção B2B</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold leading-[1.1] tracking-tight">
            Revolucione suas Vendas com <br />
            <span className="text-gradient">Inteligência Artificial</span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-400 max-w-xl leading-relaxed">
            Pare de perder horas prospectando manualmente. Nosso sistema encontra as melhores empresas, organiza seus leads e usa um SDR Virtual para agendar reuniões por você, 24/7.
          </p>
          
          <div className="flex flex-wrap items-center gap-4 mt-4">
            <button onClick={() => window.location.href='/register'} className="btn-primary group">
              Começar Agora
              <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="btn-outline group">
              <Play size={20} className="text-fuchsia-400 group-hover:text-white transition-colors" />
              Ver Demonstração
            </button>
          </div>
        </motion.div>

        {/* Right: Graphic / Visual */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="relative"
        >
          <div className="hud-card hud-card-inner aspect-square w-full max-w-md mx-auto rounded-full flex items-center justify-center">
            {/* Glowing rings */}
            <div className="absolute inset-4 rounded-full border border-purple-500/20 animate-[spin_10s_linear_infinite]" />
            <div className="absolute inset-8 rounded-full border border-fuchsia-500/20 animate-[spin_15s_linear_infinite_reverse]" />
            <div className="absolute inset-16 rounded-full border border-purple-400/30 border-dashed animate-[spin_20s_linear_infinite]" />
            
            {/* Center Core */}
            <div className="w-32 h-32 rounded-full bg-purple-600/20 backdrop-blur-md flex items-center justify-center shadow-[0_0_50px_rgba(147,51,234,0.6)] relative z-10">
              <span className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white to-purple-400">AI</span>
            </div>
            
            {/* Floating nodes */}
            <div className="absolute top-10 left-10 w-12 h-12 hud-card rounded-lg flex items-center justify-center text-xs font-bold text-purple-300">Maps</div>
            <div className="absolute bottom-10 right-10 w-12 h-12 hud-card rounded-lg flex items-center justify-center text-xs font-bold text-fuchsia-300">CRM</div>
            <div className="absolute top-20 right-4 w-12 h-12 hud-card rounded-lg flex items-center justify-center text-xs font-bold text-blue-300">Zap</div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
