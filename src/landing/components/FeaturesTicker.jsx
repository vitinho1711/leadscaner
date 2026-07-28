import React from 'react';
import { Activity, Shield, Zap, Search, MessageSquare, Brain } from 'lucide-react';

const features = [
  { icon: Search, text: "Extração no Google Maps" },
  { icon: Zap, text: "Prospecção em Tempo Real" },
  { icon: Brain, text: "Inteligência Artificial PRO" },
  { icon: Shield, text: "Seguro by Design" },
  { icon: MessageSquare, text: "SDR Virtual via WhatsApp" },
  { icon: Activity, text: "Gestão CRM Integrada" },
];

export default function FeaturesTicker() {
  return (
    <div className="w-full bg-purple-900/20 border-y border-purple-500/20 py-4 relative z-20">
      <div className="max-w-7xl mx-auto px-4">
        <div className="marquee-container">
          <div className="marquee-content">
            {features.map((item, index) => (
              <div key={index} className="flex items-center gap-3 whitespace-nowrap">
                <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center">
                  <item.icon size={16} className="text-purple-400" />
                </div>
                <span className="text-purple-200 font-medium text-sm">{item.text}</span>
              </div>
            ))}
            {/* Duplicado para criar o efeito infinito */}
            {features.map((item, index) => (
              <div key={`dup-${index}`} className="flex items-center gap-3 whitespace-nowrap">
                <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center">
                  <item.icon size={16} className="text-purple-400" />
                </div>
                <span className="text-purple-200 font-medium text-sm">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
