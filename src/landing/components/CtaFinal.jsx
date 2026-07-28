import React from 'react';
import { motion } from 'framer-motion';
import { Rocket, ArrowRight } from 'lucide-react';

export default function CtaFinal() {
  return (
    <section className="py-24 relative z-10 border-t border-purple-500/20 bg-gradient-to-b from-transparent to-purple-950/40">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="hud-card !p-12 md:!p-16 flex flex-col items-center bg-[url('data:image/svg+xml,%3Csvg width=\\'40\\' height=\\'40\\' viewBox=\\'0 0 40 40\\' xmlns=\\'http://www.w3.org/2000/svg\\'%3E%3Cpath d=\\'M0 0h40v40H0V0zm20 20h20v20H20V20zM0 20h20v20H0V20z\\' fill=\\'%239333ea\\' fill-opacity=\\'0.05\\' fill-rule=\\'evenodd\\'/%3E%3C/svg%3E')] bg-center"
        >
          <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-600 to-fuchsia-600 flex items-center justify-center shadow-[0_0_30px_rgba(217,70,239,0.5)] mb-8">
            <Rocket size={32} className="text-white" />
          </div>
          
          <h2 className="text-4xl md:text-5xl font-black mb-6 leading-tight">
            Sua próxima reunião já poderia <br className="hidden md:block"/> estar agendada.
          </h2>
          
          <p className="text-slate-400 text-lg mb-10 max-w-2xl mx-auto">
            O tempo que você passou lendo esta página é o tempo que a nossa Inteligência Artificial levaria para encontrar e abordar 50 novas empresas para você.
          </p>
          
          <button onClick={() => window.location.href='/register'} className="btn-primary text-lg !py-4 !px-8 group">
            Automatizar Minhas Vendas Agora
            <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </motion.div>
      </div>
    </section>
  );
}
