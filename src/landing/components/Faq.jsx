import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    q: "O Lead Scanner funciona para qualquer nicho?",
    a: "Sim. Como a extração é feita via Google Maps, você pode buscar qualquer tipo de negócio local, desde clínicas médicas até indústrias, em qualquer cidade do mundo."
  },
  {
    q: "Como funciona o SDR Virtual via WhatsApp?",
    a: "Nossa IA (disponível no plano PRO) se conecta ao seu WhatsApp e envia as mensagens de abordagem. Ela lê as respostas, quebra objeções e avisa você quando o lead estiver quente para marcar reunião."
  },
  {
    q: "Preciso saber programar para usar?",
    a: "De forma alguma. O painel foi desenhado para ser intuitivo. Basta colocar o termo de busca (ex: 'Padarias em São Paulo') e apertar um botão."
  },
  {
    q: "Qual a diferença entre o plano Starter e o PRO?",
    a: "O Starter é focado na extração de dados e gestão manual (CRM). O PRO adiciona a camada de Inteligência Artificial que faz a abordagem e conversa com os leads automaticamente por você."
  }
];

export default function Faq() {
  const [open, setOpen] = useState(0);

  return (
    <section className="py-24 relative z-10" id="faq">
      <div className="max-w-3xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Perguntas Frequentes</h2>
          <p className="text-slate-400">Tudo o que você precisa saber sobre o Lead Scanner.</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="hud-card !p-0 overflow-hidden cursor-pointer"
              onClick={() => setOpen(open === idx ? -1 : idx)}
            >
              <div className="p-6 flex justify-between items-center bg-purple-950/20 hover:bg-purple-900/30 transition-colors">
                <h3 className="font-semibold text-slate-200">{faq.q}</h3>
                <ChevronDown size={20} className={`text-purple-400 transition-transform ${open === idx ? 'rotate-180' : ''}`} />
              </div>
              <AnimatePresence>
                {open === idx && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="px-6 pb-6 text-slate-400 text-sm leading-relaxed"
                  >
                    <div className="pt-2 border-t border-purple-500/10 mt-2">
                      {faq.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
