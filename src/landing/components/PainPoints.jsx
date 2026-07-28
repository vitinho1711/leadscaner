import React from 'react';
import { Clock, Frown, DollarSign, Target } from 'lucide-react';
import { motion } from 'framer-motion';

const painPoints = [
  {
    icon: Clock,
    title: "O Fim do Trabalho Braçal",
    text: "Pesquisar no Google Maps, copiar dados, colar no Excel. Uma rotina exaustiva que consome até 60% do tempo de um vendedor B2B."
  },
  {
    icon: Target,
    title: "Leads Frios e Desqualificados",
    text: "Mandar mensagens genéricas para empresas que não têm perfil de compra, resultando em vácuos e bloqueios no WhatsApp."
  },
  {
    icon: Frown,
    title: "Falta de Organização (Caos)",
    text: "Leads perdidos no bloco de notas, follow-ups esquecidos e ausência total de previsibilidade nas vendas da sua empresa."
  },
  {
    icon: DollarSign,
    title: "Custo Alto de Aquisição",
    text: "Pagar caro por listas de contatos desatualizadas ou agências de prospecção que não entregam reuniões qualificadas."
  }
];

export default function PainPoints() {
  return (
    <section className="section-padding py-24 z-10 relative">
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full border border-purple-500/20 mb-4">
          <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse"></span>
          <span className="text-xs font-semibold text-purple-300 uppercase tracking-widest">O Problema Atual</span>
        </div>
        <h2 className="text-3xl md:text-5xl font-bold mb-4">
          A Prospecção Tradicional <br />
          <span className="text-purple-400">está Morta.</span>
        </h2>
        <p className="text-slate-400 max-w-2xl mx-auto">
          Enquanto sua equipe perde horas em planilhas e mensagens repetitivas, seus concorrentes já estão escalando vendas com Inteligência Artificial.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
        {painPoints.map((point, index) => (
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            key={index} 
            className="hud-card group"
          >
            <div className="w-12 h-12 rounded-lg bg-purple-900/40 border border-purple-500/30 flex items-center justify-center mb-6 group-hover:bg-purple-800/50 transition-colors">
              <point.icon size={24} className="text-fuchsia-400" />
            </div>
            <h3 className="text-lg font-bold mb-3 text-slate-200">{point.title}</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              {point.text}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
