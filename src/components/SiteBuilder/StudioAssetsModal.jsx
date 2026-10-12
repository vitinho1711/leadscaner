import React, { useState } from 'react';
import { X, Image, Upload, Plus, Trash2, Check, Sparkles, ExternalLink } from 'lucide-react';

export default function StudioAssetsModal({ currentAssets = {}, onApply, onClose }) {
  const [logoUrl, setLogoUrl] = useState(currentAssets.logo || '');
  const [heroImage, setHeroImage] = useState(currentAssets.heroImage || '');
  const [gallery, setGallery] = useState(currentAssets.gallery || []);
  const [newGalleryUrl, setNewGalleryUrl] = useState('');

  const handleAddGallery = () => {
    if (!newGalleryUrl.trim()) return;
    setGallery([...gallery, newGalleryUrl.trim()]);
    setNewGalleryUrl('');
  };

  const handleRemoveGallery = (idx) => {
    setGallery(gallery.filter((_, i) => i !== idx));
  };

  const handleSubmit = () => {
    onApply({
      logo: logoUrl.trim(),
      heroImage: heroImage.trim(),
      gallery
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[10002] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-[#121216] border border-white/10 rounded-2xl p-6 max-w-lg w-full shadow-2xl space-y-5 text-white">
        <div className="flex items-center justify-between border-b border-white/5 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center">
              <Image size={18} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Fotos e Logo do Projeto</h3>
              <p className="text-[11px] text-gray-400">Insira imagens personalizadas ou fotos de trabalhos reais</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-white/5">
            <X size={18} />
          </button>
        </div>

        {/* Logo URL */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
            URL da Logo da Empresa
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={logoUrl}
              onChange={(e) => setLogoUrl(e.target.value)}
              placeholder="https://exemplo.com/logo.png"
              className="flex-1 bg-black/50 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 font-mono"
            />
            {logoUrl && (
              <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 p-1 flex items-center justify-center shrink-0">
                <img src={logoUrl} alt="Logo preview" className="max-h-full max-w-full object-contain" onError={(e) => e.target.style.display = 'none'} />
              </div>
            )}
          </div>
        </div>

        {/* Hero Background Image */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
            URL da Foto Principal (Hero Background)
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={heroImage}
              onChange={(e) => setHeroImage(e.target.value)}
              placeholder="https://images.unsplash.com/photo-..."
              className="flex-1 bg-black/50 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 font-mono"
            />
            {heroImage && (
              <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 overflow-hidden shrink-0">
                <img src={heroImage} alt="Hero preview" className="w-full h-full object-cover" onError={(e) => e.target.style.display = 'none'} />
              </div>
            )}
          </div>
        </div>

        {/* Galeria de Fotos */}
        <div className="space-y-2">
          <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
            Fotos da Galeria / Trabalhos ({gallery.length})
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={newGalleryUrl}
              onChange={(e) => setNewGalleryUrl(e.target.value)}
              placeholder="Adicionar URL de foto da galeria..."
              className="flex-1 bg-black/50 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 font-mono"
            />
            <button
              type="button"
              onClick={handleAddGallery}
              className="px-3 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-bold flex items-center gap-1 text-white"
            >
              <Plus size={14} /> Adicionar
            </button>
          </div>

          {gallery.length > 0 && (
            <div className="grid grid-cols-4 gap-2 max-h-36 overflow-y-auto custom-scrollbar p-1">
              {gallery.map((url, i) => (
                <div key={i} className="relative group rounded-lg overflow-hidden border border-white/10 h-16 bg-black/40">
                  <img src={url} alt={`Galeria ${i}`} className="w-full h-full object-cover" />
                  <button
                    onClick={() => handleRemoveGallery(i)}
                    className="absolute top-1 right-1 p-1 bg-red-600/80 rounded-md opacity-0 group-hover:opacity-100 transition-opacity text-white"
                  >
                    <Trash2 size={10} />
                  </button>
                </div>
              ))}
            </div>
          )}
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
            className="px-5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold shadow-lg"
          >
            Salvar Fotos
          </button>
        </div>
      </div>
    </div>
  );
}
