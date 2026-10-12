import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Globe, Search, Filter, Star, MapPin, Phone, Mail, Image, 
  ExternalLink, ChevronRight, X, MessageSquare, Plus, Download, Tag, Check, CheckCircle2, ChevronDown, 
  Settings, Clock, Target, DollarSign, RefreshCw, Send, Zap, Activity
} from 'lucide-react';

const COUNTRIES = [
  { code: 'BR', name: 'Brasil', emoji: '🇧🇷', currency: 'BRL', symbol: 'R$', prefix: '+55' },
  { code: 'US', name: 'Estados Unidos', emoji: '🇺🇸', currency: 'USD', symbol: '$', prefix: '+1' },
  { code: 'PT', name: 'Portugal', emoji: '🇵🇹', currency: 'EUR', symbol: '€', prefix: '+351' },
  { code: 'CA', name: 'Canadá', emoji: '🇨🇦', currency: 'CAD', symbol: '$', prefix: '+1' },
  { code: 'GB', name: 'Reino Unido', emoji: '🇬🇧', currency: 'GBP', symbol: '£', prefix: '+44' },
  { code: 'AU', name: 'Austrália', emoji: '🇦🇺', currency: 'AUD', symbol: '$', prefix: '+61' },
  { code: 'IE', name: 'Irlanda', emoji: '🇮🇪', currency: 'EUR', symbol: '€', prefix: '+353' },
  { code: 'ES', name: 'Espanha', emoji: '🇪🇸', currency: 'EUR', symbol: '€', prefix: '+34' },
];

const STATES_BY_COUNTRY = {
  US: ['Florida', 'Texas', 'California', 'New York', 'Nevada', 'Illinois', 'Washington', 'Georgia', 'Colorado', 'Arizona'],
  BR: ['São Paulo', 'Rio de Janeiro', 'Minas Gerais', 'Paraná', 'Rio Grande do Sul', 'Bahia', 'Santa Catarina', 'Ceará', 'Pernambuco', 'Goiás'],
  PT: ['Lisboa', 'Porto', 'Braga', 'Faro', 'Setúbal', 'Aveiro', 'Coimbra', 'Leiria', 'Madeira', 'Açores'],
  CA: ['Ontario', 'Quebec', 'British Columbia', 'Alberta', 'Manitoba', 'Nova Scotia'],
  GB: ['England', 'Scotland', 'Wales', 'Northern Ireland'],
  AU: ['New South Wales', 'Victoria', 'Queensland', 'Western Australia', 'South Australia'],
  IE: ['Dublin', 'Cork', 'Galway', 'Limerick', 'Waterford'],
  ES: ['Madrid', 'Catalonia', 'Andalusia', 'Valencia', 'Galicia']
};

const NICHES = [
  'Dentists', 'Dental Clinics', 'Barbershops', 'Beauty Salons', 'Restaurants', 
  'Roofing Companies', 'Plumbers', 'Electricians', 'HVAC', 'Auto Repair', 
  'Auto Detailing', 'Landscaping', 'Cleaning Services', 'Contractors', 
  'Real Estate', 'Law Firms', 'Chiropractors', 'Med Spas', 'Gyms', 'Hotels', 
  'Photographers', 'Car Dealerships', 'Local Services'
];

export default function LeadScannerInternational() {
  const [country, setCountry] = useState('US');
  const [state, setState] = useState('');
  const [city, setCity] = useState('');
  const [niche, setNiche] = useState('');
  
  const [isSearching, setIsSearching] = useState(false);
  const [leads, setLeads] = useState([]);
  const [selectedLeads, setSelectedLeads] = useState([]);
  const [viewLead, setViewLead] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  const [selectedLang, setSelectedLang] = useState('EN');
  const [generatedMessage, setGeneratedMessage] = useState('');

  useEffect(() => {
    if (viewLead) {
      generateOutreach(viewLead, 'EN');
    }
  }, [viewLead]);

  const generateOutreach = (lead, lang) => {
    setSelectedLang(lang);
    setGeneratedMessage('Gerando mensagem com IA...');
    
    setTimeout(() => {
      let msg = '';
      const name = lead.company_name;
      const niche = lead.category;
      
      if (lang === 'EN') {
        const templates = [
          `Hi team at ${name}, I was searching for ${niche} in ${lead.city} and your profile stood out!

I noticed you have ${lead.google_reviews} reviews which is awesome, but ${lead.has_website ? 'your current website seems a bit outdated and might be losing mobile traffic' : 'you don\'t seem to have an official website yet'}.

I just built a quick interactive preview of what a modern, high-converting digital presence could look like for you. Would you mind if I sent the link over?`,
          
          `Hey ${name}, quick question. I saw your ${lead.google_rating}-star rating on Google Maps and loved the feedback from your clients.

However, without a ${lead.has_website ? 'modern, fast-loading website' : 'professional website'}, you're likely missing out on people who search for ${niche} locally.

I put together a quick mockup of a system that helps capture those lost leads. Want to take a look? No strings attached.`,
          
          `Hello! I help ${niche} get more local clients and ${name} caught my eye today.

You clearly provide great service, but your online presence ${lead.has_instagram ? 'is heavily reliant on Instagram' : 'could use a serious boost'}.

I created a custom preview of a website for you that actually drives bookings. Let me know if I can drop the link here.`
        ];
        msg = templates[Math.floor(Math.random() * templates.length)];
      } 
      else if (lang === 'PT') {
        const templates = [
          `Olá equipe da ${name}, tudo bem? Estava buscando por ${niche} aqui na região de ${lead.city} e o perfil de vocês me chamou muita atenção!

Vi que vocês têm ${lead.google_reviews} avaliações, o que é excelente. Porém, notei que ${lead.has_website ? 'o site atual de vocês parece um pouco antigo e pode estar perdendo acessos pelo celular' : 'vocês ainda não possuem um site profissional configurado'}.

Eu montei uma prévia rápida de como seria um sistema moderno e focado em atrair mais clientes para vocês. Posso enviar o link para darem uma olhada?`,
          
          `Oi ${name}! Vi a nota de ${lead.google_rating} estrelas de vocês no Google e achei incrível o serviço que prestam.

Mas percebi que sem um ${lead.has_website ? 'site mais rápido e moderno' : 'site oficial'}, muitos clientes que pesquisam por ${niche} acabam indo para a concorrência.

Desenhei uma demonstração de uma página de alta conversão exclusiva para vocês. Querem dar uma olhadinha sem compromisso?`
        ];
        msg = templates[Math.floor(Math.random() * templates.length)];
      }
      else if (lang === 'ES') {
        const templates = [
          `¡Hola equipo de ${name}! Estaba buscando ${niche} en ${lead.city} y su perfil me pareció excelente.

Noté que tienen ${lead.google_reviews} reseñas, lo cual es genial. Sin embargo, ${lead.has_website ? 'su sitio web actual podría mejorar para no perder tráfico móvil' : 'parece que aún no tienen un sitio web oficial'}.

He creado una vista previa rápida de cómo podría verse una presencia digital moderna para ustedes. ¿Les importaría si les envío el enlace para que lo vean?`,
          
          `¡Hola ${name}! Vi su calificación de ${lead.google_rating} estrellas en Google y me encantó el feedback de sus clientes.

Pero sin un ${lead.has_website ? 'sitio web moderno y rápido' : 'sitio web profesional'}, es probable que estén perdiendo clientes locales que buscan ${niche}.

Armé una demostración de un sistema que ayuda a captar esos clientes. ¿Quieren echarle un vistazo? Sin compromiso.`
        ];
        msg = templates[Math.floor(Math.random() * templates.length)];
      }
      
      setGeneratedMessage(msg);
    }, 600);
  };


  // Filters State
  const [filters, setFilters] = useState({
    website: 'any', // any, has, no
    Image: 'any',
    MessageSquare: 'any',
    minRating: 0,
    minReviews: 0,
    phone: 'any',
    email: 'any',
    status: 'all'
  });

  const handleSearch = async () => {
    if (!niche || !city) {
      alert('Por favor, preencha Nicho e Cidade.');
      return;
    }
    setIsSearching(true);
    setLeads([]);
    try {
      const selectedCountry = COUNTRIES.find(c => c.code === country);
      const locationString = city + ', ' + (state ? state + ', ' : '') + selectedCountry.name;
      const token = localStorage.getItem('sdr_jwt_token');
      const res = await fetch('/api/scrape?query=' + encodeURIComponent(niche) + '&location=' + encodeURIComponent(locationString) + '&limit=50&onlyWithoutSite=false', {
        headers: token ? { 'Authorization': 'Bearer ' + token } : {}
      });
      const json = await res.json();
      if (json.error) {
        alert('Erro: ' + json.error);
        setIsSearching(false);
        return;
      }
      const scraped = json.data || [];
      const formattedLeads = scraped.map((lead, index) => {
        const ratingNum = parseFloat(lead.rating) || 0;
        const reviewsNum = parseInt(lead.reviews) || 0;
        const hasSite = lead.site && lead.site.length > 5;
        const hasInsta = lead.instagram && lead.instagram.length > 3;
        let score = 30;
        const reasons = [];
        if (!hasSite) { score += 35; reasons.push('No website'); }
        if (reviewsNum > 50) { score += 15; reasons.push('High reviews'); }
        if (ratingNum >= 4.5) { score += 10; reasons.push('Great rating'); }
        if (hasInsta) { score += 10; reasons.push('Instagram active'); }
        return {
          id: 'int-real-' + index,
          company_name: lead.nome || 'Empresa Desconhecida',
          country: selectedCountry.code,
          country_code: selectedCountry.code,
          state: state || '',
          city: city,
          address: lead.endereco || locationString,
          category: niche,
          phone: lead.telefone || '',
          phone_international: lead.telefone ? selectedCountry.prefix + lead.telefone.replace(/\D/g, '') : '',
          email: lead.email || '',
          website: hasSite ? lead.site : null,
          has_website: hasSite,
          instagram: lead.instagram,
          has_instagram: hasInsta,
          facebook: lead.facebook,
          has_facebook: !!lead.facebook,
          google_rating: ratingNum,
          google_reviews: reviewsNum,
          opportunity_score: Math.min(score, 100),
          opportunity_reasons: reasons,
          status: 'Novo lead',
          tags: [selectedCountry.emoji + ' ' + selectedCountry.code, !hasSite ? '? No Website' : ''],
          created_at: new Date().toISOString(),
          timezone: 'Auto',
          currency: selectedCountry.currency,
          ai_analysis: {
            overview: (lead.nome || 'The business') + ' is a ' + niche + ' business located in ' + city + ', ' + selectedCountry.name + '.',
            presence: (hasSite ? 'Has a website.' : 'No website found.') + ' ' + (hasInsta ? 'Active on Instagram.' : '') + ' ' + (reviewsNum > 0 ? 'Has ' + reviewsNum + ' reviews on Google (' + ratingNum + ' stars).' : ''),
            opportunity: !hasSite ? 'Great opportunity for website creation.' : 'Opportunity for website redesign or marketing.',
            pain_points: !hasSite ? 'Missing direct booking channel.' : 'Could improve conversion rate.',
            suggested_offer: !hasSite ? 'Website Development' : 'Marketing & Automation'
          }
        };
      });
      setLeads(formattedLeads);
    } catch (err) {
      alert('Falha ao conectar com o servidor local.');
    } finally {
      setIsSearching(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
    if (score >= 60) return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
    if (score >= 40) return 'text-orange-400 bg-orange-400/10 border-orange-400/20';
    return 'text-red-400 bg-red-400/10 border-red-400/20';
  };

  const getTime = (timezone) => {
    try {
      return new Date().toLocaleTimeString('en-US', { timeZone: timezone, hour: '2-digit', minute: '2-digit' });
    } catch {
      return '--:--';
    }
  };

  
  
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveToCRM = async () => {
    if (selectedLeads.length === 0) return;
    setIsSaving(true);
    try {
      const leadsToSave = leads.filter(l => selectedLeads.includes(l.id)).map(l => ({
        nome: l.company_name,
        nicho: l.category,
        cidade: l.city,
        endereco: l.address,
        telefone: l.phone_international || l.phone,
        whatsapp: (l.phone_international || l.phone || '').replace(/\D/g, '') || 'não informado',
        site: l.website,
        instagram: l.instagram,
        facebook: l.facebook,
        rating: l.google_rating,
        reviews: l.google_reviews,
        status: 'NOVO',
        score: l.opportunity_score,
        tags: l.tags,
        isInternational: true
      }));

      const token = localStorage.getItem('sdr_jwt_token');
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify(leadsToSave)
      });
      
      const json = await res.json();
      if (json.error) {
        alert(json.error);
      } else {
        alert(`${leadsToSave.length} leads salvos no CRM com sucesso!`);
        setSelectedLeads([]);
      }
    } catch (e) {
      alert('Erro ao salvar no CRM');
    } finally {
      setIsSaving(false);
    }
  };

  const handleExportCSV = () => {
    const dataToExport = selectedLeads.length > 0 ? leads.filter(l => selectedLeads.includes(l.id)) : leads;
    if (dataToExport.length === 0) {
      alert('Nenhum lead para exportar. Faça uma busca primeiro.');
      return;
    }

    const headers = ['Company Name', 'Country', 'State', 'City', 'Address', 'Category', 'Phone', 'Email', 'Website', 'Instagram', 'Google Rating', 'Google Reviews', 'Opportunity Score', 'Tags'];
    
    const csvContent = [
      headers.join(';'),
      ...dataToExport.map(lead => {
        return [
          `"${(lead.company_name || '').replace(/"/g, '""')}"`,
          `"${lead.country || ''}"`,
          `"${lead.state || ''}"`,
          `"${lead.city || ''}"`,
          `"${(lead.address || '').replace(/"/g, '""')}"`,
          `"${lead.category || ''}"`,
          `"${lead.phone_international || lead.phone || ''}"`,
          `"${lead.email || ''}"`,
          `"${lead.website || ''}"`,
          `"${lead.instagram || ''}"`,
          lead.google_rating || 0,
          lead.google_reviews || 0,
          lead.opportunity_score || 0,
          `"${(lead.tags || []).join(', ')}"`
        ].join(';');
      })
    ].join('\n');

    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `leads_internacionais_${country}_${niche || 'todos'}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="h-full flex flex-col animate-fade-in relative text-gray-200">
      
      {/* Header */}
      <header className="mb-6 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <Globe className="text-blue-500" size={32} />
            Prospecção Internacional
          </h1>
          <p className="text-gray-400">Encontre, qualifique e prospecte empresas no mundo inteiro.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={handleExportCSV} className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition">
            <Download size={16} /> Exportar CSV
          </button>
        </div>
      </header>

      {/* Main Container */}
      <div className="flex-1 flex flex-col xl:flex-row gap-6 overflow-y-auto xl:overflow-hidden">
        
        {/* Search Panel */}
        <div className="w-full xl:w-80 flex flex-col gap-6 overflow-y-auto custom-scrollbar pr-2">
          <div className="bg-[#121215] border border-white/10 rounded-2xl p-5">
            <h2 className="font-bold text-white mb-4 flex items-center gap-2">
              <Search size={18} className="text-blue-400" /> Nova Busca
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5 block">País</label>
                <div className="relative">
                  <select 
                    value={country} 
                    onChange={(e) => {
                      setCountry(e.target.value);
                      setState('');
                    }}
                    className="w-full appearance-none bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-blue-500 outline-none transition-all"
                  >
                    {COUNTRIES.map(c => (
                      <option key={c.code} value={c.code}>{c.emoji} {c.name}</option>
                    ))}
                  </select>
                  <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5 block">Estado / Região</label>
                <div className="relative">
                  <select 
                    value={state} 
                    onChange={(e) => setState(e.target.value)}
                    className="w-full appearance-none bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-blue-500 outline-none transition-all"
                  >
                    <option value="">Todos</option>
                    {(STATES_BY_COUNTRY[country] || []).map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                  <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5 block">Cidade</label>
                <input 
                  type="text" 
                  value={city} 
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Ex: Miami, Orlando..."
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-blue-500 outline-none transition-all"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5 block">Nicho</label>
                <input 
                  type="text" 
                  list="niches"
                  value={niche} 
                  onChange={(e) => setNiche(e.target.value)}
                  placeholder="Ex: Dentists"
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-blue-500 outline-none transition-all"
                />
                <datalist id="niches">
                  {NICHES.map(n => <option key={n} value={n} />)}
                </datalist>
              </div>

              <button 
                onClick={handleSearch}
                disabled={isSearching}
                className="w-full mt-2 py-3 bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-500 hover:to-emerald-500 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(59,130,246,0.3)]"
              >
                {isSearching ? <RefreshCw size={18} className="animate-spin" /> : <Search size={18} />}
                {isSearching ? 'Buscando...' : 'Buscar Leads'}
              </button>
            </div>
          </div>

          {/* Mini Dashboard */}
          <div className="bg-[#121215] border border-white/10 rounded-2xl p-5">
            <h3 className="font-bold text-white mb-4 flex items-center gap-2 text-sm"><Activity size={16} className="text-purple-400"/> Status da Busca</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-black/40 border border-white/5 rounded-xl p-3">
                <p className="text-2xl font-bold text-white">{leads.length}</p>
                <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">Encontrados</p>
              </div>
              <div className="bg-black/40 border border-white/5 rounded-xl p-3">
                <p className="text-2xl font-bold text-emerald-400">{leads.filter(l => l.opportunity_score >= 80).length}</p>
                <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">Hot Leads</p>
              </div>
            </div>
          </div>
        </div>

        {/* Results Area */}
        <div className="flex-1 bg-[#121215] border border-white/10 rounded-2xl flex flex-col overflow-hidden relative">
          
          {/* Toolbar */}
          <div className="p-4 border-b border-white/10 flex flex-wrap gap-4 items-center justify-between bg-black/20">
            <div className="flex gap-2">
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm border transition-all ${showFilters ? 'bg-blue-500/20 border-blue-500/30 text-blue-400' : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'}`}
              >
                <Filter size={16} /> Filtros Avançados
              </button>
              
              {selectedLeads.length > 0 && (
                <div className="flex items-center gap-2 pl-4 border-l border-white/10 animate-fade-in">
                  <span className="text-xs text-gray-400 font-bold">{selectedLeads.length} selecionados</span>
                  <button onClick={handleSaveToCRM} disabled={isSaving} className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-xs hover:bg-white/10 flex items-center gap-1"><Plus size={14}/> {isSaving ? 'Salvando...' : 'Salvar no CRM'}</button>
                  <button className="px-3 py-1.5 bg-blue-500/20 border border-blue-500/30 text-blue-400 rounded-lg text-xs hover:bg-blue-500/30 flex items-center gap-1"><MessageSquare size={14}/> Gerar Mensagens</button>
                </div>
              )}
            </div>
          </div>

          {/* Filters Drawer */}
          <AnimatePresence>
            {showFilters && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="border-b border-white/10 bg-black/40 overflow-hidden"
              >
                <div className="p-4 flex flex-wrap gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block">Website</label>
                    <select className="bg-black/60 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-gray-300 outline-none">
                      <option value="any">Qualquer</option>
                      <option value="has">Possui Website</option>
                      <option value="no">Sem Website</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block">Image</label>
                    <select className="bg-black/60 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-gray-300 outline-none">
                      <option value="any">Qualquer</option>
                      <option value="has">Possui Insta</option>
                      <option value="no">Sem Insta</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block">Min. Reviews</label>
                    <select className="bg-black/60 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-gray-300 outline-none">
                      <option value="0">0+</option>
                      <option value="10">10+</option>
                      <option value="50">50+</option>
                      <option value="100">100+</option>
                    </select>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Table */}
          <div className="flex-1 overflow-auto custom-scrollbar">
            {leads.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 opacity-50">
                <Globe size={48} className="mb-4 text-gray-600" />
                <h3 className="text-xl font-bold text-white mb-2">Nenhum lead internacional</h3>
                <p className="text-sm text-gray-400">Configure a busca na lateral para iniciar a prospecção global.</p>
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead className="sticky top-0 bg-[#1a1a1f] shadow-md z-10 text-[10px] uppercase tracking-wider text-gray-500">
                  <tr>
                    <th className="p-4 font-bold border-b border-white/5 w-12 text-center">
                      <input type="checkbox" className="rounded bg-black border-gray-600 cursor-pointer" 
                        checked={leads.length > 0 && selectedLeads.length === leads.length}
                        onChange={(e) => {
                          if (e.target.checked) setSelectedLeads(leads.map(l => l.id));
                          else setSelectedLeads([]);
                        }}
                      />
                    </th>
                    <th className="p-4 font-bold border-b border-white/5">Empresa</th>
                    <th className="p-4 font-bold border-b border-white/5">Score</th>
                    <th className="p-4 font-bold border-b border-white/5">Local</th>
                    <th className="p-4 font-bold border-b border-white/5 text-center">Website</th>
                    <th className="p-4 font-bold border-b border-white/5 text-center">Redes</th>
                    <th className="p-4 font-bold border-b border-white/5">Avaliações</th>
                    <th className="p-4 font-bold border-b border-white/5 text-right">Ação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {leads.map(lead => (
                    <tr key={lead.id} className="hover:bg-white/[0.02] transition-colors group">
                      <td className="p-4 text-center">
                        <input 
                          type="checkbox" 
                          checked={selectedLeads.includes(lead.id)}
                          onChange={(e) => {
                            if (e.target.checked) setSelectedLeads([...selectedLeads, lead.id]);
                            else setSelectedLeads(selectedLeads.filter(id => id !== lead.id));
                          }}
                          className="rounded bg-black border-gray-600" 
                        />
                      </td>
                      <td className="p-4">
                        <div className="font-bold text-sm text-white mb-1">{lead.company_name}</div>
                        <div className="flex gap-1 flex-wrap">
                          {lead.tags.map(t => (
                            <span key={t} className="text-[9px] px-1.5 py-0.5 bg-white/5 border border-white/10 rounded text-gray-400 truncate max-w-[100px]">{t}</span>
                          ))}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-bold ${getScoreColor(lead.opportunity_score)}`}>
                          <Zap size={14}/> {lead.opportunity_score}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-1.5 text-xs text-gray-300">
                          {COUNTRIES.find(c => c.code === lead.country)?.emoji} {lead.city}, {lead.state}
                        </div>
                        <div className="text-[10px] text-gray-500 mt-1 flex items-center gap-1"><Clock size={10}/> {getTime(lead.timezone)}</div>
                      </td>
                      <td className="p-4 text-center">
                        {lead.has_website ? (
                          <a href={lead.website} target="_blank" rel="noreferrer" className="inline-flex p-1.5 bg-white/5 text-blue-400 hover:bg-blue-500/20 rounded-lg transition" title={lead.website}>
                            <Globe size={16} />
                          </a>
                        ) : (
                          <span className="inline-flex p-1.5 bg-red-500/10 text-red-400 border border-red-500/20 rounded-lg" title="Sem website">
                            <Globe size={16} />
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-center flex items-center justify-center gap-1">
                        <span className={`p-1.5 rounded-lg ${lead.has_instagram ? 'bg-pink-500/10 text-pink-400' : 'bg-white/5 text-gray-600'}`}>
                          <Image size={14} />
                        </span>
                        <span className={`p-1.5 rounded-lg ${lead.has_facebook ? 'bg-blue-500/10 text-blue-400' : 'bg-white/5 text-gray-600'}`}>
                          <MessageSquare size={14} />
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-1 text-sm font-bold text-amber-400">
                          <Star size={14} className="fill-amber-400" /> {lead.google_rating}
                        </div>
                        <div className="text-[10px] text-gray-500">{lead.google_reviews} reviews</div>
                      </td>
                      <td className="p-4 text-right">
                        <button 
                          onClick={() => setViewLead(lead)}
                          className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-white rounded-lg text-xs font-bold transition flex items-center gap-1 ml-auto"
                        >
                          Ver <ChevronRight size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {/* LEAD PROFILE SLIDE OVER */}
      <AnimatePresence>
        {viewLead && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setViewLead(null)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 right-0 w-full max-w-2xl bg-[#0f0f13] border-l border-white/10 shadow-2xl z-[101] flex flex-col overflow-hidden"
            >
              {/* Header */}
              <div className="p-6 border-b border-white/10 flex items-center justify-between bg-black/20">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-xl font-bold shadow-lg">
                    {viewLead.company_name.charAt(0)}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">{viewLead.company_name}</h2>
                    <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                      {COUNTRIES.find(c => c.code === viewLead.country)?.emoji} {viewLead.category} · {viewLead.city}
                    </p>
                  </div>
                </div>
                <button onClick={() => setViewLead(null)} className="p-2 bg-white/5 hover:bg-white/10 rounded-xl text-gray-400 transition">
                  <X size={20} />
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6">
                
                {/* Score Banner */}
                <div className={`p-5 rounded-2xl border flex items-center justify-between ${getScoreColor(viewLead.opportunity_score)}`}>
                  <div className="flex items-center gap-3">
                    <Zap size={24} />
                    <div>
                      <p className="text-xs uppercase tracking-widest font-bold opacity-80">Opportunity Score</p>
                      <p className="text-2xl font-black">{viewLead.opportunity_score} / 100</p>
                    </div>
                  </div>
                  <div className="text-right max-w-[200px]">
                    {viewLead.opportunity_reasons.map((r, i) => (
                      <div key={i} className="text-[10px] font-bold opacity-80 flex items-center gap-1 justify-end">
                        <Check size={10} /> {r}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Contact Info & Meta */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                    <h4 className="text-[10px] uppercase font-bold tracking-widest text-gray-500 mb-3">Contato Direto</h4>
                    <div className="space-y-3">
                      {viewLead.phone && (
                        <div className="flex items-center gap-2 text-sm text-gray-300">
                          <Phone size={14} className="text-blue-400"/> {viewLead.phone_international}
                        </div>
                      )}
                      {viewLead.email && (
                        <div className="flex items-center gap-2 text-sm text-gray-300 truncate">
                          <Mail size={14} className="text-purple-400"/> {viewLead.email}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                    <h4 className="text-[10px] uppercase font-bold tracking-widest text-gray-500 mb-3">Presença Digital</h4>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm text-gray-300">
                        <Globe size={14} className={viewLead.has_website ? "text-blue-400" : "text-gray-600"}/> 
                        {viewLead.has_website ? <a href={viewLead.website} target="_blank" className="hover:underline text-blue-400 truncate max-w-[150px]">{viewLead.website}</a> : <span className="text-gray-500">Sem website</span>}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-300">
                        <Image size={14} className={viewLead.has_instagram ? "text-pink-400" : "text-gray-600"}/> 
                        {viewLead.has_instagram ? viewLead.Image : <span className="text-gray-500">Sem Image</span>}
                      </div>
                    </div>
                  </div>
                </div>

                {/* AI Business Analysis */}
                <div className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 rounded-2xl p-6 border border-blue-500/20 relative overflow-y-auto xl:overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>
                  <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                    <Bot size={18} className="text-blue-400" /> AI Business Analysis
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <p className="text-[10px] uppercase font-bold text-gray-400 mb-1 tracking-wider">Business Overview</p>
                      <p className="text-sm text-gray-300 leading-relaxed">{viewLead.ai_analysis.overview}</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-bold text-gray-400 mb-1 tracking-wider">Digital Presence</p>
                      <p className="text-sm text-gray-300 leading-relaxed">{viewLead.ai_analysis.presence}</p>
                    </div>
                    <div className="bg-black/30 p-3 rounded-xl border border-white/5">
                      <p className="text-[10px] uppercase font-bold text-blue-400 mb-1 tracking-wider flex items-center gap-1"><Target size={12}/> Sales Opportunity</p>
                      <p className="text-sm text-gray-200">{viewLead.ai_analysis.opportunity}</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-bold text-gray-400 mb-1 tracking-wider">Suggested Offer</p>
                      <p className="text-sm font-bold text-emerald-400">{viewLead.ai_analysis.suggested_offer} ({viewLead.currency})</p>
                    </div>
                  </div>
                </div>

                {/* AI Outreach Generator */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                   <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                    <MessageSquare size={18} className="text-emerald-400" /> AI Outreach Generator
                  </h3>
                  
                  <div className="bg-black/40 border border-white/5 rounded-xl p-4 mb-4 relative group min-h-[120px]">
      <p className="text-sm text-gray-300 leading-relaxed font-mono whitespace-pre-wrap">
                      {generatedMessage}
                    </p>
    </div>
                  
                  <div className="flex gap-2">
                    <button className="flex-1 py-2.5 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2">
                      <Globe size={14} /> EN
                    </button>
                    <button className="flex-1 py-2.5 bg-white/5 hover:bg-white/10 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 text-gray-400">
                      PT
                    </button>
                    <button className="flex-1 py-2.5 bg-white/5 hover:bg-white/10 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 text-gray-400">
                      ES
                    </button>
                  </div>
                </div>

              </div>
              
              {/* Footer Actions */}
              <div className="p-4 border-t border-white/10 bg-black/40 flex gap-3">
                {viewLead.phone && (
                  <button className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition">
                    <Phone size={18} /> WhatsApp
                  </button>
                )}
                {viewLead.email && (
                  <button className="flex-1 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition">
                    <Mail size={18} /> Email
                  </button>
                )}
              </div>

            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
}


