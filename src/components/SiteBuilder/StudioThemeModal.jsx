import React, { useState } from 'react';
import { X, Palette, Check, Sparkles, Sliders } from 'lucide-react';

const PRESET_PALETTES = [
  {
    id: 'ouro_luxo',
    name: 'Ouro & Luxo',
    desc: 'Alta autoridade, clínicas, mecânicas premium e serviços nobres',
    primary: '#121217',
    accent: '#d4af37',
    font: 'Montserrat',
    mode: 'dark'
  },
  {
    id: 'dark_tech',
    name: 'Dark Tech & Indigo',
    desc: 'Visual moderno de alto contraste com azul vibrante',
    primary: '#090a0f',
    accent: '#3b82f6',
    font: 'Plus Jakarta Sans',
    mode: 'dark'
  },
  {
    id: 'cyber_neon',
    name: 'Cyber & Performance',
    desc: 'Ciano neon, automotivo esportivo e academias',
    primary: '#08090d',
    accent: '#06b6d4',
    font: 'Barlow Condensed',
    mode: 'dark'
  },
  {
    id: 'esmeralda',
    name: 'Esmeralda & Conversão',
    desc: 'Gatilho de saúde, natureza, segurança e WhatsApp',
    primary: '#064e3b',
    accent: '#10b981',
    font: 'Inter',
    mode: 'dark'
  },
  {
    id: 'editorial_craft',
    name: 'Editorial Boutique',
    desc: 'Ateliês, confeitaria fina, vinhos e arquitetura',
    primary: '#faf7f2',
    accent: '#854d0e',
    font: 'Playfair Display',
    mode: 'light'
  },
  {
    id: 'vendas_urgencia',
    name: 'Direct Response',
    desc: 'Laranja vibrante para reparos rápidos e desentupidoras',
    primary: '#0f172a',
    accent: '#ea580c',
    font: 'Inter',
    mode: 'dark'
  }
];

const AVAILABLE_FONTS = [
  { id: 'Inter', name: 'Inter (Clean & Moderno)' },
  { id: 'Montserrat', name: 'Montserrat (Geométrico & Forte)' },
  { id: 'Plus Jakarta Sans', name: 'Plus Jakarta Sans (Tech & Elegante)' },
  { id: 'Barlow Condensed', name: 'Barlow Condensed (Impacto Alto & Urbano)' },
  { id: 'Playfair Display', name: 'Playfair Display (Serifado & Nobre)' },
  { id: 'Outfit', name: 'Outfit (SaaS Moderno & Limpo)' }
];

export default function StudioThemeModal({ currentTheme = {}, onApply, onClose }) {
  const [primary, setPrimary] = useState(currentTheme.primary || '#121217');
  const [accent, setAccent] = useState(currentTheme.accent || '#ea580c');
  const [font, setFont] = useState(currentTheme.font || 'Inter');
  const [mode, setMode] = useState(currentTheme.mode || 'dark');
  const [selectedPreset, setSelectedPreset] = useState(null);

  const handleSelectPreset = (p) => {
    setSelectedPreset(p.id);
    setPrimary(p.primary);
    setAccent(p.accent);
    setFont(p.font);
    setMode(p.mode);
  };

  const handleSubmit = () => {
    onApply({
      primary,
      accent,
      font,
      mode
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[10002] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-[#121216] border border-white/10 rounded-2xl p-6 max-w-lg w-full shadow-2xl space-y-5 text-white">
        <div className="flex items-center justify-between border-b border-white/5 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-purple-600/20 text-purple-400 flex items-center justify-center">
              <Palette size={18} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Tema: Cores e Fonte do Site</h3>
              <p className="text-[11px] text-gray-400">Defina a identidade visual e o peso tipográfico da página</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-white/5">
            <X size={18} />
          </button>
        </div>

        {/* Paletas Rápidas */}
        <div className="space-y-2">
          <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
            Paletas de Alto Padrão
          </label>
          <div className="grid grid-cols-2 gap-2">
            {PRESET_PALETTES.map((preset) => {
              const isSelected = selectedPreset === preset.id;
              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => handleSelectPreset(preset)}
                  className={`p-2.5 rounded-xl border text-left transition-all flex items-start gap-2.5 ${
                    isSelected
                      ? 'bg-purple-600/15 border-purple-500 shadow-sm'
                      : 'bg-white/[0.02] border-white/5 hover:border-white/15'
                  }`}
                >
                  <div className="flex -space-x-1 shrink-0 mt-0.5">
                    <span
                      className="w-4 h-4 rounded-full border border-black/30 shadow-sm"
                      style={{ background: preset.primary }}
                    />
                    <span
                      className="w-4 h-4 rounded-full border border-black/30 shadow-sm"
                      style={{ background: preset.accent }}
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-white truncate">{preset.name}</p>
                    <p className="text-[10px] text-gray-400 truncate">{preset.font}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Custom Cores */}
        <div className="grid grid-cols-2 gap-3 pt-2 border-t border-white/5">
          <div>
            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-1.5">
              Cor de Fundo / Primária
            </label>
            <div className="flex items-center gap-2 p-1.5 bg-black/40 border border-white/10 rounded-xl">
              <input
                type="color"
                value={primary}
                onChange={(e) => {
                  setPrimary(e.target.value);
                  setSelectedPreset(null);
                }}
                className="w-7 h-7 rounded cursor-pointer bg-transparent border-0"
              />
              <input
                type="text"
                value={primary}
                onChange={(e) => setPrimary(e.target.value)}
                className="bg-transparent text-xs text-white uppercase font-mono w-20 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-1.5">
              Cor de Destaque / CTA
            </label>
            <div className="flex items-center gap-2 p-1.5 bg-black/40 border border-white/10 rounded-xl">
              <input
                type="color"
                value={accent}
                onChange={(e) => {
                  setAccent(e.target.value);
                  setSelectedPreset(null);
                }}
                className="w-7 h-7 rounded cursor-pointer bg-transparent border-0"
              />
              <input
                type="text"
                value={accent}
                onChange={(e) => setAccent(e.target.value)}
                className="bg-transparent text-xs text-white uppercase font-mono w-20 outline-none"
              />
            </div>
          </div>
        </div>

        {/* Fonte */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
            Família Tipográfica
          </label>
          <select
            value={font}
            onChange={(e) => setFont(e.target.value)}
            className="w-full bg-black/50 border border-white/10 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-purple-500"
          >
            {AVAILABLE_FONTS.map((f) => (
              <option key={f.id} value={f.id} className="bg-[#121216] text-white">
                {f.name}
              </option>
            ))}
          </select>
        </div>

        {/* Footer */}
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
            className="px-5 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white rounded-xl text-xs font-bold shadow-lg"
          >
            Aplicar ao Site
          </button>
        </div>
      </div>
    </div>
  );
}
