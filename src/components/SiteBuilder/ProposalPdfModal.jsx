import React, { useState } from 'react';
import { X, FileText, Download, Printer, Send, Sparkles, CheckCircle2, User, Phone, Building2 } from 'lucide-react';

export default function ProposalPdfModal({ lead, onClose }) {
  const [nomeConsultor, setNomeConsultor] = useState(
    (() => {
      try {
        const stored = localStorage.getItem('sdr_user');
        if (stored) return JSON.parse(atob(stored)).username || 'Vitor Batista';
      } catch (e) {}
      return 'Consultor Comercial';
    })()
  );
  const [telefone, setTelefone] = useState('(11) 99999-9999');
  const [agencia, setAgencia] = useState('LeadScanner Studio');
  const [loadingPdf, setLoadingPdf] = useState(false);
  const [pdfSuccess, setPdfSuccess] = useState(false);

  const cleanLeadPhone = lead?.whatsapp ? String(lead.whatsapp).replace(/\D/g, '') : '';

  const handleDownloadPdf = async () => {
    setLoadingPdf(true);
    setPdfSuccess(false);
    try {
      const token = localStorage.getItem('sdr_jwt_token') || localStorage.getItem('token');
      const res = await fetch(`/api/site-builder/pdf/${lead.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          consultantData: {
            nome: nomeConsultor,
            telefone,
            whatsapp: telefone,
            agencia
          }
        })
      });

      const contentType = res.headers.get('content-type') || '';
      if (contentType.includes('application/pdf')) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `proposta-${(lead.nome || 'empresa').toLowerCase().replace(/\s+/g, '-')}.pdf`;
        a.click();
        window.URL.revokeObjectURL(url);
        setPdfSuccess(true);
      } else {
        // Fallback se retornou JSON com fallbackHtml
        const data = await res.json();
        const printWindow = window.open('', '_blank');
        if (printWindow && data.fallbackHtml) {
          printWindow.document.write(data.fallbackHtml);
          printWindow.document.close();
          printWindow.focus();
          setTimeout(() => printWindow.print(), 600);
        }
        setPdfSuccess(true);
      }
    } catch (e) {
      console.error('Erro ao gerar proposta:', e);
      // Fallback: abre a visualização web
      handlePrintView();
    } finally {
      setLoadingPdf(false);
    }
  };

  const handlePrintView = () => {
    const query = new URLSearchParams({
      nome: nomeConsultor,
      telefone,
      agencia
    }).toString();
    window.open(`/api/site-builder/proposal-view/${lead.id}?${query}`, '_blank');
  };

  const handleSendWhatsApp = () => {
    if (!cleanLeadPhone) {
      alert('Este lead não possui número de WhatsApp informado.');
      return;
    }
    const demoUrl = `${window.location.origin}/preview/${lead.id}`;
    const msg = encodeURIComponent(
      `Olá! Tudo bem? Me chamo ${nomeConsultor} da ${agencia}.\n\n` +
      `Estive analisando a presença da *${lead.nome}* na internet e preparamos uma proposta exclusiva com um novo modelo de site de alta conversão para vocês.\n\n` +
      `Você pode conferir a demonstração navegável aqui:\n👉 ${demoUrl}\n\n` +
      `Gostaria de agendar 5 minutinhos para apresentar os detalhes sem compromisso?`
    );
    window.open(`https://wa.me/${cleanLeadPhone}?text=${msg}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-[99999] bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#121216] border border-white/10 rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl flex flex-col text-white animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between bg-black/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <FileText size={20} />
            </div>
            <div>
              <h3 className="font-bold text-base">Gerador de Proposta Comercial em PDF</h3>
              <p className="text-xs text-gray-400">Apresentação de 5 páginas personalizada para {lead?.nome}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-gray-400 hover:text-white rounded-lg transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-4 text-xs">
          <div className="p-3.5 bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20 rounded-xl space-y-1">
            <span className="font-bold text-purple-300 flex items-center gap-1.5 text-xs">
              <Sparkles size={14} /> Estrutura da Apresentação
            </span>
            <p className="text-gray-300 text-[11px] leading-relaxed">
              Pág 1: Capa de Impacto · Pág 2: Diagnóstico Digital & Oportunidades · Pág 3: Previews Desktop & Mobile · Pág 4: Especificações & CRO · Pág 5: Benefícios & Contato Comercial.
            </p>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-gray-400 font-semibold mb-1 flex items-center gap-1.5">
                <User size={13} /> Nome do Consultor / Vendedor
              </label>
              <input
                type="text"
                value={nomeConsultor}
                onChange={(e) => setNomeConsultor(e.target.value)}
                className="w-full p-2.5 bg-black/40 border border-white/10 rounded-lg text-white text-xs focus:border-purple-500 focus:outline-none"
                placeholder="Ex: Vitor Batista"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-gray-400 font-semibold mb-1 flex items-center gap-1.5">
                  <Phone size={13} /> Telefone / WhatsApp
                </label>
                <input
                  type="text"
                  value={telefone}
                  onChange={(e) => setTelefone(e.target.value)}
                  className="w-full p-2.5 bg-black/40 border border-white/10 rounded-lg text-white text-xs focus:border-purple-500 focus:outline-none"
                  placeholder="(11) 99999-9999"
                />
              </div>

              <div>
                <label className="block text-gray-400 font-semibold mb-1 flex items-center gap-1.5">
                  <Building2 size={13} /> Nome da Agência
                </label>
                <input
                  type="text"
                  value={agencia}
                  onChange={(e) => setAgencia(e.target.value)}
                  className="w-full p-2.5 bg-black/40 border border-white/10 rounded-lg text-white text-xs focus:border-purple-500 focus:outline-none"
                  placeholder="Ex: LeadScanner Studio"
                />
              </div>
            </div>
          </div>

          {pdfSuccess && (
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-center gap-2 text-emerald-400 font-semibold text-xs animate-in fade-in">
              <CheckCircle2 size={16} />
              Proposta gerada com sucesso! O download foi iniciado.
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-5 border-t border-white/10 bg-black/20 flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={handlePrintView}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-white/10 hover:bg-white/5 text-gray-300 hover:text-white text-xs font-semibold transition-all"
          >
            <Printer size={14} />
            Visualizar / Imprimir
          </button>

          <div className="flex items-center gap-2">
            {cleanLeadPhone && (
              <button
                onClick={handleSendWhatsApp}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/30 text-emerald-400 rounded-xl text-xs font-bold transition-all"
              >
                <Send size={13} />
                Enviar no WhatsApp
              </button>
            )}

            <button
              onClick={handleDownloadPdf}
              disabled={loadingPdf}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white rounded-xl text-xs font-bold transition-all shadow-[0_0_15px_rgba(124,58,237,0.3)]"
            >
              <Download size={14} />
              {loadingPdf ? 'Compilando PDF...' : 'Baixar PDF'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
