import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Filter, MessageCircle, CalendarCheck } from 'lucide-react';

const steps = [
  {
    icon: MapPin,
    title: "Mapeamento IA",
    desc: "O Lead Scanner varre o Google Maps buscando empresas reais e ativas na sua região."
  },
  {
    icon: Filter,
    title: "Filtragem e Qualificação",
    desc: "Removemos os curiosos e organizamos os contatos válidos (telefone, site, redes sociais)."
  },
  {
    icon: MessageCircle,
    title: "Abordagem PRO",
    desc: "O SDR Virtual entra em ação, iniciando uma conversa persuasiva direto no WhatsApp do lead."
  },
  {
    icon: CalendarCheck,
    title: "Reuniões Agendadas",
    desc: "Você só intervém na melhor parte: participar da reunião com um cliente pronto para comprar."
  }
];

export default function HowItWorks() {
  return (
    <section className="section-padding relative z-10" id="funciona">
      <div className="text-center mb-20">
        <h2 className="text-3xl md:text-5xl font-bold mb-4">
          Como a <span className="text-gradient">Automação</span> Funciona
        </h2>
        <p className="text-slate-400 max-w-2xl mx-auto">
          Um fluxo perfeitamente orquestrado. Da captura do número à marcação da reunião, sem que você precise digitar uma palavra.
        </p>
      </div>

      <div className="relative max-w-5xl mx-auto">
        {/* Linha de conexão invisível em mobile, visível em desktop */}
        <div className="hidden md:block absolute top-12 left-10 right-10 h-0.5 bg-gradient-to-r from-purple-900 via-fuchsia-500 to-purple-900 opacity-30 z-0"></div>

        <div className="grid md:grid-cols-4 gap-8 relative z-10">
          {steps.map((step, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className="flex flex-col items-center text-center"
            >
              <div className="w-24 h-24 rounded-full bg-purple-950 border-2 border-purple-500/30 flex items-center justify-center mb-6 relative hud-card-inner">
                {/* Glow ring */}
                <div className="absolute inset-0 rounded-full border border-fuchsia-500/20 animate-pulse"></div>
                <step.icon size={32} className="text-purple-400" />
                
                {/* Number badge */}
                <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-fuchsia-600 border-2 border-purple-950 flex items-center justify-center text-white font-bold text-sm">
                  {index + 1}
                </div>
              </div>
              
              <h3 className="text-xl font-bold mb-3 text-white">{step.title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                {step.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
