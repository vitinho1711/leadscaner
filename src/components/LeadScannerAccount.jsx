import React from 'react';
import { User, CreditCard, Activity, Bell, Shield, Package, Zap } from 'lucide-react';

export default function LeadScannerAccount() {
  return (
    <div className="animate-fade-in text-white space-y-6 max-w-5xl mx-auto">
      
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-1 flex items-center gap-2">Minha Conta <User size={20} className="text-gray-500" /></h1>
          <p className="text-sm text-gray-400">Gerencie seu perfil, assinatura e veja o uso da sua conta.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left Column: Profile & Plan */}
        <div className="col-span-1 space-y-6">
          
          <div className="bg-[#121216] border border-white/5 rounded-2xl p-6 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl mx-auto flex items-center justify-center text-3xl font-bold mb-4 shadow-lg shadow-purple-600/20">
              VN
            </div>
            <h3 className="text-xl font-bold">Vitor Nogueira</h3>
            <p className="text-sm text-gray-500 mb-6">vitor@example.com</p>
            
            <button className="w-full py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm font-bold transition-colors">
              Editar Perfil
            </button>
          </div>

          <div className="bg-gradient-to-br from-purple-900/30 to-blue-900/30 border border-purple-500/30 rounded-2xl p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Zap size={64} />
            </div>
            <div className="relative z-10">
              <span className="px-2.5 py-1 bg-purple-500/20 text-purple-300 text-[10px] font-bold uppercase tracking-wider rounded border border-purple-500/30 mb-4 inline-block">Plano Atual</span>
              <h3 className="text-2xl font-bold text-white mb-1">PRO <span className="text-sm text-gray-400 font-normal">/ mês</span></h3>
              <p className="text-xs text-purple-200 opacity-80 mb-6">Renova automaticamente em 12/06</p>
              
              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-300">Leads Analisados</span>
                  <span className="font-bold text-white">418 / 1.000</span>
                </div>
                <div className="w-full h-1.5 bg-black/40 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-purple-500 to-blue-500 w-[41.8%]"></div>
                </div>
              </div>

              <button className="w-full py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-sm font-bold transition-colors shadow-[0_0_15px_rgba(124,58,237,0.4)]">
                Fazer Upgrade
              </button>
            </div>
          </div>

        </div>

        {/* Right Column: Settings */}
        <div className="col-span-2 space-y-6">
          
          <div className="bg-[#121216] border border-white/5 rounded-2xl overflow-hidden">
            <div className="p-6 border-b border-white/5">
              <h3 className="text-lg font-bold flex items-center gap-2"><CreditCard size={18} className="text-gray-400" /> Histórico de Faturamento</h3>
            </div>
            <table className="w-full text-left text-sm">
              <thead className="bg-black/20">
                <tr className="text-gray-500 text-xs">
                  <th className="py-3 px-6 font-medium">Data</th>
                  <th className="py-3 px-4 font-medium">Plano</th>
                  <th className="py-3 px-4 font-medium">Valor</th>
                  <th className="py-3 px-6 font-medium text-right">Fatura</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-gray-300">
                <tr className="hover:bg-white/5 transition-colors">
                  <td className="py-4 px-6">12/05/2026</td>
                  <td className="py-4 px-4"><span className="px-2 py-1 bg-purple-500/10 text-purple-400 rounded text-xs font-bold">PRO</span></td>
                  <td className="py-4 px-4 font-bold">R$ 97,00</td>
                  <td className="py-4 px-6 text-right"><button className="text-xs text-blue-400 hover:text-blue-300 font-medium">Baixar PDF</button></td>
                </tr>
                <tr className="hover:bg-white/5 transition-colors">
                  <td className="py-4 px-6">12/04/2026</td>
                  <td className="py-4 px-4"><span className="px-2 py-1 bg-gray-500/10 text-gray-400 rounded text-xs font-bold">START</span></td>
                  <td className="py-4 px-4 font-bold">R$ 47,00</td>
                  <td className="py-4 px-6 text-right"><button className="text-xs text-blue-400 hover:text-blue-300 font-medium">Baixar PDF</button></td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="bg-[#121216] border border-white/5 rounded-2xl p-6">
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2"><Bell size={18} className="text-gray-400" /> Preferências de Notificação</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-black/20 border border-white/5 rounded-xl">
                <div>
                  <p className="text-sm font-bold text-white">Análise Concluída</p>
                  <p className="text-[11px] text-gray-500 mt-0.5">Receba um e-mail quando a IA terminar de analisar sua planilha.</p>
                </div>
                <div className="w-10 h-5 bg-purple-600 rounded-full relative cursor-pointer">
                  <div className="absolute right-1 top-0.5 w-4 h-4 bg-white rounded-full shadow"></div>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-black/20 border border-white/5 rounded-xl">
                <div>
                  <p className="text-sm font-bold text-white">Novas Respostas (Leads Quentes)</p>
                  <p className="text-[11px] text-gray-500 mt-0.5">Notificação imediata no WhatsApp quando um lead demonstrar alto interesse.</p>
                </div>
                <div className="w-10 h-5 bg-purple-600 rounded-full relative cursor-pointer">
                  <div className="absolute right-1 top-0.5 w-4 h-4 bg-white rounded-full shadow"></div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
