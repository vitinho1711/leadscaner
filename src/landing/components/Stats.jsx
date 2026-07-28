import React from 'react';
import { motion } from 'framer-motion';

const stats = [
  { value: "10x", label: "Mais Reuniões Agendadas" },
  { value: "85%", label: "Redução no Tempo de Busca" },
  { value: "24/7", label: "Prospecção Ininterrupta" },
  { value: "3.5k+", label: "Leads Qualificados Gerados" }
];

export default function Stats() {
  return (
    <section className="py-24 relative z-10 border-y border-purple-500/10 bg-purple-950/20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-4xl font-bold">
            Potencializando empresas com soluções <span className="text-purple-400">inteligentes e escaláveis.</span>
          </h2>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center p-6 rounded-2xl bg-gradient-to-b from-purple-900/30 to-transparent border border-purple-500/10 hover:border-purple-500/30 transition-colors"
            >
              <div className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-purple-400 mb-2">
                {stat.value}
              </div>
              <div className="text-sm font-medium text-purple-200 uppercase tracking-wide">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
