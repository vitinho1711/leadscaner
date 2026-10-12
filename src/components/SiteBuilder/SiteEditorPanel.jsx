import React, { useState } from 'react';
import { Palette, Type, Layers, Check, Sparkles, MessageCircle, Save } from 'lucide-react';

export default function SiteEditorPanel({ lead, onSave, onClose }) {
  const currentOverrides = lead.siteData?.customOverrides || {};
  const currentTheme = currentOverrides.theme || {};

  const [activeSubTab, setActiveSubTab] = useState('conteudo');
  const [headline, setHeadline] = useState(currentOverrides.headline || lead.siteData?.profile?.headline || '');
  const [subheadline, setSubheadline] = useState(currentOverrides.subheadline || lead.siteData?.profile?.subheadline || '');
  const [ctaText, setCtaText] = useState(currentOverrides.ctaText || lead.siteData?.profile?.ctaPrincipal || 'Solicitar Orçamento');
  const [heroImage, setHeroImage] = useState(currentOverrides.heroImage || lead.siteData?.profile?.imagens?.hero || '');
  const [primaryColor, setPrimaryColor] = useState(currentTheme.primary || '#0f172a');
  const [accentColor, setAccentColor] = useState(currentTheme.accent || '#2563eb');
  const [siteStatus, setSiteStatus] = useState(lead.siteStatus || 'SITE_GERADO');
  const [saving, setSaving] = useState(false);

  const handleApply = async () => {
    setSaving(true);
    const overrides = {
      ...currentOverrides,
      headline,
      subheadline,
      ctaText,
      heroImage,
      theme: {
        ...currentTheme,
        primary: primaryColor,
        accent: accentColor
      }
    };

    await onSave(overrides, siteStatus);
    setSaving(false);
  };

  return (
    <div className="w-80 border-l border-white/10 bg-[#121216] flex flex-col h-full z-20 text-white select-none">
      {/* Header */}
      <div className="p-4 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2 font-bold text-sm">
          <Sparkles size={16} className="text-purple-400" />
          <span>Editor do Site</span>
        </div>
        <button
          onClick={handleApply}
          disabled={saving}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 rounded-lg text-xs font-bold transition-all shadow-md"
        >
          <Save size={14} />
          {saving ? 'Salvando...' : 'Salvar'}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-white/5 bg-black/20 text-xs">
        <button
          onClick={() => setActiveSubTab('conteudo')}
          className={`flex-1 py-2.5 font-medium text-center border-b-2 transition-all ${
            activeSubTab === 'conteudo'
              ? 'border-purple-500 text-purple-400 bg-purple-500/10'
              : 'border-transparent text-gray-400 hover:text-white'
          }`}
        >
          Conteúdo
        </button>
        <button
          onClick={() => setActiveSubTab('identidade')}
          className={`flex-1 py-2.5 font-medium text-center border-b-2 transition-all ${
            activeSubTab === 'identidade'
              ? 'border-purple-500 text-purple-400 bg-purple-500/10'
              : 'border-transparent text-gray-400 hover:text-white'
          }`}
        >
          Identidade
        </button>
        <button
          onClick={() => setActiveSubTab('funil')}
          className={`flex-1 py-2.5 font-medium text-center border-b-2 transition-all ${
            activeSubTab === 'funil'
              ? 'border-purple-500 text-purple-400 bg-purple-500/10'
              : 'border-transparent text-gray-400 hover:text-white'
          }`}
        >
          Funil
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
        {activeSubTab === 'conteudo' && (
          <div className="space-y-4">
            <div>
              <label className="block text-gray-400 font-semibold mb-1">Headline Principal</label>
              <textarea
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                rows={3}
                className="w-full p-2.5 bg-black/40 border border-white/10 rounded-lg focus:border-purple-500 focus:outline-none text-white text-xs leading-relaxed"
                placeholder="Título de alto impacto..."
              />
            </div>

            <div>
              <label className="block text-gray-400 font-semibold mb-1">Subheadline Estratégica</label>
              <textarea
                value={subheadline}
                onChange={(e) => setSubheadline(e.target.value)}
                rows={4}
                className="w-full p-2.5 bg-black/40 border border-white/10 rounded-lg focus:border-purple-500 focus:outline-none text-white text-xs leading-relaxed"
                placeholder="Subtítulo persuasivo..."
              />
            </div>

            <div>
              <label className="block text-gray-400 font-semibold mb-1">Texto do Botão (CTA)</label>
              <input
                type="text"
                value={ctaText}
                onChange={(e) => setCtaText(e.target.value)}
                className="w-full p-2.5 bg-black/40 border border-white/10 rounded-lg focus:border-purple-500 focus:outline-none text-white text-xs"
                placeholder="Ex: Solicitar Orçamento"
              />
            </div>

            <div>
              <label className="block text-gray-400 font-semibold mb-1">URL Imagem Hero</label>
              <input
                type="text"
                value={heroImage}
                onChange={(e) => setHeroImage(e.target.value)}
                className="w-full p-2.5 bg-black/40 border border-white/10 rounded-lg focus:border-purple-500 focus:outline-none text-white text-xs"
                placeholder="https://..."
              />
            </div>
          </div>
        )}

        {activeSubTab === 'identidade' && (
          <div className="space-y-4">
            <div>
              <label className="block text-gray-400 font-semibold mb-2">Cor Primária (Botões & Títulos)</label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="w-9 h-9 rounded cursor-pointer bg-transparent border-0"
                />
                <input
                  type="text"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="flex-1 p-2 bg-black/40 border border-white/10 rounded-lg font-mono text-xs uppercase"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-400 font-semibold mb-2">Cor de Destaque / Acento</label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={accentColor}
                  onChange={(e) => setAccentColor(e.target.value)}
                  className="w-9 h-9 rounded cursor-pointer bg-transparent border-0"
                />
                <input
                  type="text"
                  value={accentColor}
                  onChange={(e) => setAccentColor(e.target.value)}
                  className="flex-1 p-2 bg-black/40 border border-white/10 rounded-lg font-mono text-xs uppercase"
                />
              </div>
            </div>

            <div className="p-3 bg-white/5 rounded-xl border border-white/5 space-y-2">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">Paletas Rápidas</span>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { name: 'Azul Tech', p: '#0f172a', a: '#2563eb' },
                  { name: 'Ouro Luxo', p: '#1c1917', a: '#d4af37' },
                  { name: 'Esmeralda', p: '#064e3b', a: '#059669' },
                  { name: 'Vibrante', p: '#9a3412', a: '#ea580c' },
                ].map((palette, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setPrimaryColor(palette.p);
                      setAccentColor(palette.a);
                    }}
                    className="p-2 rounded-lg bg-black/40 border border-white/5 hover:border-purple-500/50 flex flex-col items-center gap-1.5 transition-all"
                  >
                    <div className="flex gap-1">
                      <div className="w-3 h-3 rounded-full" style={{ background: palette.p }} />
                      <div className="w-3 h-3 rounded-full" style={{ background: palette.a }} />
                    </div>
                    <span className="text-[9px] text-gray-400 truncate w-full text-center">{palette.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeSubTab === 'funil' && (
          <div className="space-y-4">
            <div>
              <label className="block text-gray-400 font-semibold mb-2">Status da Negociação no CRM</label>
              <select
                value={siteStatus}
                onChange={(e) => setSiteStatus(e.target.value)}
                className="w-full p-2.5 bg-black/40 border border-white/10 rounded-lg text-xs text-white focus:border-purple-500 focus:outline-none"
              >
                <option value="SEM_SITE">SEM SITE GERADO</option>
                <option value="SITE_GERADO">SITE GERADO ✨</option>
                <option value="PDF_GERADO">PROPOSTA PDF GERADA</option>
                <option value="ENVIADO_AO_CLIENTE">ENVIADO AO CLIENTE</option>
                <option value="CLIENTE_INTERESSADO">CLIENTE INTERESSADO 🔥</option>
                <option value="PROPOSTA_ENVIADA">PROPOSTA FORMAL ENVIADA</option>
                <option value="VENDA_REALIZADA">VENDA REALIZADA 🏆</option>
              </select>
            </div>

            <div className="p-3 bg-purple-500/10 border border-purple-500/20 rounded-xl space-y-2">
              <span className="text-xs font-bold text-purple-400 block">Dica Comercial:</span>
              <p className="text-[11px] text-gray-300 leading-relaxed">
                Após gerar o site e a proposta em PDF, envie o link de demonstração diretamente para o WhatsApp do cliente para despertar desejo imediato.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
