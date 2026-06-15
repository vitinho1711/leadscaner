export function buildSitePrompt(nome, nicho, cidade) {
  const n = (nicho || '').toLowerCase();
  
  // Base configuration: SaaS Dribbble Editorial (Light Luxury Tech)
  let theme = {
    mode: 'light',
    bg: '#f8fafc',
    surface: '#ffffff',
    text: '#0f172a',
    muted: '#475569',
    border: 'rgba(15, 23, 42, 0.08)',
    primary: '#0f172a', // Charcoal Dark Button/Accents
    primaryHover: '#1e293b',
    accent: '#3b82f6', // Electric Blue for charts/highlights
    accentGlow: 'rgba(59, 130, 246, 0.15)',
    accentBg: '#dbeafe', // Soft blue badge
    accentText: '#1e40af',
    badgeColor: '#d1fae5', // Soft green badge
    badgeText: '#065f46',
    fontsImport: "@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Playfair+Display:ital,wght@0,400;0,700;1,400;1,700&display=swap');",
    fontFamilyDisplay: "'Plus Jakarta Sans', sans-serif",
    fontFamilySerif: "'Playfair Display', serif",
    imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80', // Premium architectural home
    secondaryImageUrl: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80'
  };

  // Dynamic customization based on the lead's niche
  if (n.includes('médic') || n.includes('cirurgi') || n.includes('dentis') || n.includes('saúde') || n.includes('clínic') || n.includes('terapia') || n.includes('psicolog') || n.includes('fisiot')) {
    theme.accent = '#0891b2'; // Cyan/Medical Blue
    theme.accentBg = '#ecfeff';
    theme.accentText = '#155e75';
    theme.imageUrl = 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=1200&q=80'; // Clinic modern interior
    theme.secondaryImageUrl = 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80';
  } else if (n.includes('hamburguer') || n.includes('pizza') || n.includes('comida') || n.includes('gastronomia') || n.includes('restaurante') || n.includes('doce') || n.includes('bolo') || n.includes('confeitaria') || n.includes('padaria')) {
    theme.bg = '#fdfaf5'; // Warm cream
    theme.primary = '#271206'; // Chocolate Brown
    theme.primaryHover = '#451a03';
    theme.accent = '#ea580c'; // Warm Orange
    theme.accentBg = '#ffedd5';
    theme.accentText = '#9a3412';
    theme.imageUrl = 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=1200&q=80'; // Burger gourmet
    theme.secondaryImageUrl = 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=800&q=80';
  } else if (n.includes('carro') || n.includes('automot') || n.includes('detail') || n.includes('moto') || n.includes('funilar') || n.includes('pintura')) {
    // Dark SaaS Tech for automotive
    theme.mode = 'dark';
    theme.bg = '#09090b';
    theme.surface = '#18181b';
    theme.text = '#f4f4f5';
    theme.muted = '#a1a1aa';
    theme.border = 'rgba(255, 255, 255, 0.08)';
    theme.primary = '#ffffff';
    theme.primaryHover = '#e4e4e7';
    theme.accent = '#06b6d4'; // Cyan neon
    theme.accentBg = 'rgba(6, 182, 212, 0.1)';
    theme.accentText = '#22d3ee';
    theme.imageUrl = 'https://images.unsplash.com/photo-1607860108855-64acf2078ed9?auto=format&fit=crop&w=1200&q=80'; // Detailing detail
    theme.secondaryImageUrl = 'https://images.unsplash.com/photo-1601362840469-81e4df861614?auto=format&fit=crop&w=800&q=80';
  } else if (n.includes('unha') || n.includes('cabelo') || n.includes('salão') || n.includes('maquiagem') || n.includes('sobrancelha') || n.includes('estética corporal') || n.includes('spa') || n.includes('bronze')) {
    theme.bg = '#faf6f2'; // Soft warm luxury sand
    theme.primary = '#3f251d';
    theme.primaryHover = '#573328';
    theme.accent = '#db2777'; // Luxury Rose
    theme.accentBg = '#fce7f3';
    theme.accentText = '#9d174d';
    theme.imageUrl = 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80'; // Luxury Spa
    theme.secondaryImageUrl = 'https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?auto=format&fit=crop&w=800&q=80';
  }

  return `You are a world-class UI/UX designer and senior frontend developer specialized in high-end SaaS Dribbble design aesthetics (minimalist, clean structures, floating mockups, elegant hybrid typography, and grid-aligned cards).

YOUR RESPONSABILITY: Output ONLY raw HTML. No explanations, no markdown. Start with <!DOCTYPE html>.

STYLE GUIDELINES (SAAS DRIBBBLE EDITORIAL):
- Palette: Background: "${theme.bg}", Surface Cards: "${theme.surface}", Main Text: "${theme.text}", Muted Text: "${theme.muted}", Border: "${theme.border}".
- Colors: Primary Button/Accents: "${theme.primary}" (Hover: "${theme.primaryHover}"), Special Highlight: "${theme.accent}".
- Typography:
  1. Base: Import 'Plus Jakarta Sans' (weights 300, 400, 500, 600, 700, 800) and 'Playfair Display' (italics enabled).
  2. Heading Rule: Titles must mix a geometric Sans-Serif font (var(--font-sans)) with an elegant, serif italic font (var(--font-serif)) to highlight key concepts. E.g.: "Conquiste resultados <em>extraordinários</em> em sua <em>jornada</em>."
  3. CSS Properties:
     --bg: ${theme.bg};
     --surface: ${theme.surface};
     --border: ${theme.border};
     --text: ${theme.text};
     --muted: ${theme.muted};
     --primary: ${theme.primary};
     --primary-hover: ${theme.primaryHover};
     --accent: ${theme.accent};
     --font-sans: ${theme.fontFamilyDisplay};
     --font-serif: ${theme.fontFamilySerif};
- Layout and Elements:
  1. Floating Capsule Nav: A center-aligned capsule header: "position: absolute; top: 20px; left: 50%; transform: translateX(-50%); background: rgba(255,255,255,0.7); border: 1px solid var(--border); border-radius: 999px; padding: 6px 24px; display: flex; align-items: center; gap: 2rem; backdrop-filter: blur(12px); z-index: 100; max-width: 600px; width: max-content;". (Adjust background opacity/color if dark mode).
  2. Hero Section:
     - Center-aligned heading: "text-align: center; max-width: 900px; font-size: clamp(2.5rem, 5.5vw, 4.2rem); font-weight: 700; line-height: 1.15; letter-spacing: -0.03em;".
     - Center-aligned subtitle: "text-align: center; max-width: 600px; margin: 1.5rem auto; font-size: 1.1rem; color: var(--muted);".
     - Primary Button: A neat dark rounded pill button centered below subtitle.
     - Central Hero Mockup: A huge 3D-like container showing "${theme.imageUrl}" with border-radius: 32px.
     - FLOATING WIDGETS overlayed on the image container (absolutely positioned, rounded 20px cards, border 1px solid var(--border), background: rgba(255,255,255,0.85) with blur(10px)):
       * Left floating widget: A stats ring or progress graph (SVG circular chart) + number.
       * Right floating widget: An interactive user list/activity log showing active agents or clients.
  3. Features bento-style section:
     - Subtitle/Badge on top: small capsules with colors like background "${theme.accentBg}" and text "${theme.accentText}", font-weight 700, padding 4px 12px, border-radius 999px.
     - Section is split in two columns: Left H2 title + description, Right: A styled dashboard card showing "Receita Mensal $96.437" (Revenue) with a beautiful CSS bar chart (bars made with rounded divs).
  4. Services grid section:
     - 3-column grid with rounded card boxes (border-radius: 28px, padding: 2.5rem, background: var(--surface), border: 1px solid var(--border)).
     - Clean vector SVGs inside styled circles, customized copy about the services of ${nicho}.
  5. Interactive counter logic in JS for stats cards.
  6. Styled FAQ using details/summary tags.
  7. WhatsApp floating pill in bottom-right corner.

CONTENT REQUIREMENTS:
- Fully written in Portuguese (PT-BR). No placeholders.
- Copy must be professional, persuasive, and customized to the business "${nome}" and the city "${cidade}".

Write complete, high-fidelity, untruncated HTML starting with <!DOCTYPE html>.`;
}
