import React from 'react';
import { motion } from 'framer-motion';
import { X, Check } from 'lucide-react';

const features = [
  { name: "Extração de Contatos B2B", old: "Busca manual no Google", new: "100% Automatizado via Maps" },
  { name: "Qualificação de Leads", old: "Achismo e perda de tempo", new: "IA analisa e pontua o perfil" },
  { name: "Abordagem Inicial", old: "Mensagens copiadas e coladas", new: "SDR Virtual hiper-personalizado" },
  { name: "Follow-up", old: "Esquecido no WhatsApp", new: "Lembretes e disparos automáticos" },
  { name: "Gestão (CRM)", old: "Planilhas confusas", new: "Pipeline visual e Kanban integrado" }
];

export default function Comparison() {
  return (
    <section className="section-padding relative z-10">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-5xl font-bold mb-4">
          A Diferença é <span className="text-purple-400">Absurda.</span>
        </h2>
        <p className="text-slate-400 max-w-2xl mx-auto">
          Veja por que empresas estão abandonando agências e processos manuais para adotar nossa inteligência.
        </p>
      </div>

      <div className="max-w-5xl mx-auto">
        <div className="hud-card overflow-hidden !p-0">
          <div className="grid grid-cols-3 bg-purple-950/40 border-b border-purple-500/20 p-6">
            <div className="font-bold text-slate-300">Processo</div>
            <div className="font-bold text-slate-400 text-center">Modo Tradicional</div>
            <div className="font-bold text-fuchsia-400 text-center">Lead Scanner</div>
          </div>
          
          <div className="divide-y divide-purple-500/10">
            {features.map((item, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: idx * 0.1 }}
                className="grid grid-cols-3 p-6 items-center hover:bg-purple-900/10 transition-colors"
              >
                <div className="font-medium text-slate-200">{item.name}</div>
                <div className="flex items-center justify-center gap-2 text-slate-500 text-sm">
                  <X size={16} className="text-red-500" />
                  <span className="hidden md:inline">{item.old}</span>
                </div>
                <div className="flex items-center justify-center gap-2 text-purple-200 font-medium text-sm">
                  <Check size={16} className="text-green-400" />
                  <span className="hidden md:inline">{item.new}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
