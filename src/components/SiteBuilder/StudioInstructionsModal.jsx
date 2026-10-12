import React, { useState } from 'react';
import { X, SlidersHorizontal, Sparkles, Check } from 'lucide-react';

export default function StudioInstructionsModal({ currentInstructions = '', onApply, onClose }) {
  const [instructions, setInstructions] = useState(currentInstructions);

  const handleSubmit = () => {
    onApply(instructions.trim());
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[10002] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-[#121216] border border-white/10 rounded-2xl p-6 max-w-lg w-full shadow-2xl space-y-4 text-white">
        <div className="flex items-center justify-between border-b border-white/5 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-600/20 text-emerald-400 flex items-center justify-center">
              <SlidersHorizontal size={18} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Instruções Permanentes do Projeto</h3>
              <p className="text-[11px] text-gray-400">Diretrizes de tom de voz, regras da marca e garantia para a IA</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-white/5">
            <X size={18} />
          </button>
        </div>

        <div className="space-y-2">
          <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
            Instruções Mestres
          </label>
          <textarea
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            rows={6}
            placeholder="Ex: Focar no atendimento rápido e emergencial; usar tom acolhedor e seguro; enfatizar que o orçamento é sem compromisso; nunca usar termos excessivamente técnicos; destacar garantia de 90 dias em todas as peças..."
            className="w-full bg-black/50 border border-white/10 rounded-xl p-3.5 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500 leading-relaxed resize-none"
          />
        </div>

        <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-[11px] text-emerald-300">
          💡 <strong>Dica da IA:</strong> Estas instruções serão anexadas em todas as futuras gerações e refinamentos deste lead, mantendo a consistência da marca.
        </div>

        <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-white/5 hover:bg-white/10 text-gray-300 rounded-xl text-xs font-semibold"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="px-5 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-xs font-bold shadow-lg"
          >
            Salvar Instruções
          </button>
        </div>
      </div>
    </div>
  );
}
