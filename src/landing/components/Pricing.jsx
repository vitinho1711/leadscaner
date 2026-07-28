import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Star } from 'lucide-react';

const plans = [
  {
    name: "Starter",
    price: "97",
    desc: "Para quem quer organizar suas vendas e ter acesso ao extrator B2B.",
    features: [
      "Extrator Google Maps Ilimitado",
      "CRM em Kanban Integrado",
      "Organização de contatos",
      "Importação/Exportação CSV",
      "Suporte via Email"
    ],
    recommended: false,
    cta: "Assinar Starter"
  },
  {
    name: "PRO IA",
    price: "197",
    desc: "A solução definitiva. O SDR Virtual trabalhando por você 24/7.",
    features: [
      "Tudo do plano Starter",
      "SDR Virtual IA (WhatsApp)",
      "Qualificação Automática de Leads",
      "Disparos Personalizados",
      "Respostas automáticas inteligentes",
      "Suporte Prioritário"
    ],
    recommended: true,
    cta: "Assinar PRO"
  }
];

export default function Pricing() {
  return (
    <section className="section-padding relative z-10" id="planos">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-5xl font-bold mb-4">
          Escolha como quer <span className="text-gradient">Trabalhar</span>
        </h2>
        <p className="text-slate-400 max-w-2xl mx-auto">
          Um funcionário custaria milhares de reais por mês. Tenha um sistema mais rápido e inteligente por uma fração do preço.
        </p>
      </div>

      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8 items-center">
        {plans.map((plan, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: idx * 0.2 }}
            className={`relative p-8 rounded-2xl border ${plan.recommended ? 'bg-purple-950/40 border-fuchsia-500/50 shadow-[0_0_30px_rgba(217,70,239,0.2)]' : 'bg-[#0a0515]/80 border-purple-500/20'} backdrop-blur-xl transition-all hover:-translate-y-2`}
          >
            {plan.recommended && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple-600 to-fuchsia-500 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1 shadow-[0_0_15px_rgba(217,70,239,0.5)]">
                <Star size={12} className="fill-white" /> Mais Escolhido
              </div>
            )}
            
            <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
            <p className="text-sm text-slate-400 mb-6 min-h-[40px]">{plan.desc}</p>
            
            <div className="mb-8 flex items-baseline gap-1">
              <span className="text-xl font-bold text-slate-400">R$</span>
              <span className="text-5xl font-black text-white">{plan.price}</span>
              <span className="text-slate-500">/mês</span>
            </div>
            
            <ul className="space-y-4 mb-8">
              {plan.features.map((feat, fidx) => (
                <li key={fidx} className="flex items-start gap-3">
                  <CheckCircle2 size={20} className={plan.recommended ? 'text-fuchsia-400' : 'text-purple-400'} />
                  <span className="text-sm text-slate-300">{feat}</span>
                </li>
              ))}
            </ul>
            
            <button className={`w-full py-4 rounded-xl font-bold transition-all ${plan.recommended ? 'bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 text-white shadow-[0_0_20px_rgba(217,70,239,0.4)]' : 'bg-purple-900/30 hover:bg-purple-900/50 text-purple-200 border border-purple-500/30'}`}>
              {plan.cta}
            </button>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
