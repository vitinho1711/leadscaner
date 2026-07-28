import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, ChevronRight, BarChart3, Users, MessageSquare } from 'lucide-react';

export default function SoftwareShowcase() {
  return (
    <section className="section-padding relative z-10" id="recursos">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
        
        {/* Left: Graphic Mockup */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative"
        >
          <div className="hud-card !p-1 aspect-video rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(147,51,234,0.3)]">
            <div className="w-full h-full bg-[#0a0515] rounded-xl flex flex-col relative overflow-hidden">
              {/* Fake App Header */}
              <div className="h-12 border-b border-purple-500/20 flex items-center px-4 gap-4">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
                </div>
                <div className="h-4 w-48 bg-purple-900/30 rounded mx-auto"></div>
              </div>
              
              {/* Fake App Body */}
              <div className="flex-1 flex p-4 gap-4">
                {/* Sidebar */}
                <div className="w-16 h-full flex flex-col gap-4">
                  <div className="w-full aspect-square rounded-lg bg-purple-600/20 flex items-center justify-center"><BarChart3 size={16} className="text-purple-400"/></div>
                  <div className="w-full aspect-square rounded-lg bg-purple-900/20 flex items-center justify-center"><Users size={16} className="text-purple-400/50"/></div>
                  <div className="w-full aspect-square rounded-lg bg-purple-900/20 flex items-center justify-center"><MessageSquare size={16} className="text-purple-400/50"/></div>
                </div>
                {/* Content */}
                <div className="flex-1 flex flex-col gap-4">
                  <div className="flex gap-4">
                    <div className="flex-1 h-20 bg-purple-900/20 rounded-lg border border-purple-500/10 p-3">
                      <div className="h-2 w-12 bg-purple-400/30 rounded mb-2"></div>
                      <div className="text-2xl font-bold text-white">1,492</div>
                    </div>
                    <div className="flex-1 h-20 bg-fuchsia-900/20 rounded-lg border border-fuchsia-500/10 p-3">
                      <div className="h-2 w-16 bg-fuchsia-400/30 rounded mb-2"></div>
                      <div className="text-2xl font-bold text-white">34</div>
                    </div>
                  </div>
                  <div className="flex-1 bg-purple-900/10 rounded-lg border border-purple-500/10 relative overflow-hidden p-4">
                    <div className="space-y-3">
                      {[1,2,3,4].map((i) => (
                        <div key={i} className="h-8 w-full bg-purple-900/20 rounded flex items-center px-3 gap-3">
                          <div className="w-4 h-4 rounded-full bg-fuchsia-500/40"></div>
                          <div className="h-2 w-32 bg-purple-400/20 rounded"></div>
                        </div>
                      ))}
                    </div>
                    
                    {/* Glowing scanning line */}
                    <motion.div 
                      animate={{ top: ['0%', '100%', '0%'] }}
                      transition={{ duration: 4, ease: "linear", repeat: Infinity }}
                      className="absolute left-0 right-0 h-1 bg-fuchsia-500/50 shadow-[0_0_10px_#d946ef] z-10"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Floating elements */}
          <motion.div 
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="absolute -bottom-6 -right-6 bg-[#0a0515] border border-purple-500/30 p-4 rounded-xl shadow-xl flex items-center gap-3"
          >
            <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
              <CheckCircle2 size={20} className="text-green-400" />
            </div>
            <div>
              <div className="text-sm font-bold text-white">Reunião Agendada</div>
              <div className="text-xs text-slate-400">Há 2 minutos</div>
            </div>
          </motion.div>
        </motion.div>

        {/* Right: Copy */}
        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full border border-purple-500/20 mb-4">
            <span className="text-xs font-semibold text-purple-300 uppercase tracking-widest">SDR Virtual</span>
          </div>
          
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Inteligência pronta para os desafios de hoje.
          </h2>
          
          <p className="text-slate-400 text-lg mb-8 leading-relaxed">
            Nós nos especializamos em criar soluções escaláveis de IA para resolver o maior desafio B2B: a prospecção. Nosso sistema evolui com suas necessidades, entregando interações humanizadas e convertendo leads frios em clientes.
          </p>

          <div className="grid grid-cols-2 gap-4 mb-8">
            {[
              "Busca no Maps IA",
              "Enriquecimento de Dados",
              "Disparos via WhatsApp",
              "IA Conversacional",
              "Score de Leads",
              "CRM Inteligente"
            ].map((feature, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-fuchsia-400" />
                <span className="text-sm text-slate-300">{feature}</span>
              </div>
            ))}
          </div>

          <button className="btn-primary">
            Testar Sistema <ChevronRight size={18} />
          </button>
        </motion.div>
      </div>
    </section>
  );
}
