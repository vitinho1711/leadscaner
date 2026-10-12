import React from 'react';
import { X, History, RotateCcw, Clock, Sparkles } from 'lucide-react';

export default function StudioHistoryModal({ history = [], onRollback, onClose }) {
  return (
    <div className="fixed inset-0 z-[10002] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-[#121216] border border-white/10 rounded-2xl p-6 max-w-lg w-full shadow-2xl space-y-4 text-white">
        <div className="flex items-center justify-between border-b border-white/5 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-600/20 text-amber-400 flex items-center justify-center">
              <History size={18} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Histórico de Versões do Site</h3>
              <p className="text-[11px] text-gray-400">{history.length} {history.length === 1 ? 'versão gravada' : 'versões gravadas'}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-white/5">
            <X size={18} />
          </button>
        </div>

        {history.length === 0 ? (
          <div className="py-8 text-center text-gray-500 text-xs">
            Nenhuma versão anterior registrada para este site.
          </div>
        ) : (
          <div className="space-y-2.5 max-h-[380px] overflow-y-auto custom-scrollbar pr-1">
            {history.map((item, idx) => {
              const isCurrent = idx === history.length - 1;
              const dateStr = item.timestamp ? new Date(item.timestamp).toLocaleString('pt-BR') : 'Data não informada';
              return (
                <div
                  key={idx}
                  className={`p-3 rounded-xl border flex items-center justify-between gap-3 transition-all ${
                    isCurrent
                      ? 'bg-purple-500/10 border-purple-500/30'
                      : 'bg-white/[0.02] border-white/5 hover:border-white/15'
                  }`}
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white">
                        Versão #{idx + 1}
                      </span>
                      {isCurrent && (
                        <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                          Atual
                        </span>
                      )}
                      <span className="text-[10px] text-gray-500">
                        {dateStr}
                      </span>
                    </div>
                    <p className="text-xs text-gray-300 mt-1 truncate max-w-sm" title={item.prompt || item.action}>
                      {item.prompt || item.action || 'Alteração realizada'}
                    </p>
                    {item.explanation && (
                      <p className="text-[10px] text-gray-400 italic mt-0.5 truncate">
                        "{item.explanation}"
                      </p>
                    )}
                  </div>

                  {!isCurrent && (
                    <button
                      type="button"
                      onClick={() => {
                        onRollback(idx);
                        onClose();
                      }}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-purple-600 hover:text-white border border-white/10 text-xs font-semibold text-gray-300 transition-all shrink-0 cursor-pointer"
                      title="Restaurar esta versão"
                    >
                      <RotateCcw size={12} />
                      <span>Restaurar</span>
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}

        <div className="flex items-center justify-end pt-2 border-t border-white/5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-white/5 hover:bg-white/10 text-gray-300 rounded-xl text-xs font-semibold"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
