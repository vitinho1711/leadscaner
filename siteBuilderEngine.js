/**
 * siteBuilderEngine.js
 * Multi-Skill Website Compiler Engine (Anthropic Frontend Design, UI/UX Pro Max, Redesign Premium, Editorial, Direct Response)
 * - 6 Arquiteturas de layout totalmente distintas e completas (9 seções de conversão cada)
 * - 22 nichos hiper-especializados com prova social do Google Maps, avaliações reais, FAQs e WhatsApp direto
 * - Zero sites repetidos ou genéricos: copy, dores, métricas e ofertas ajustadas milimetricamente por nicho
 */

import { resolveNicheProfile } from './nicheIntelligence.js';

export function cleanWhatsAppNumber(phone) {
  if (!phone) return '';
  const digits = String(phone).replace(/\D/g, '');
  if (!digits) return '';
  if (digits.length >= 12 && digits.startsWith('55')) return digits;
  if (digits.length >= 10 && digits.length <= 11) return '55' + digits;
  return digits;
}

export function resolveBestSkillForNiche(nicho = '', nome = '') {
  const n = `${nicho || ''} ${nome || ''}`.toLowerCase();
  if (n.includes('médic') || n.includes('odonto') || n.includes('dentis') || n.includes('clínic') || n.includes('saúde') || n.includes('cirurgi') || n.includes('pediatr') || n.includes('oftalmo') || n.includes('dermato')) {
    return 'redesign_premium';
  }
  if (n.includes('doce') || n.includes('bolo') || n.includes('confeitar') || n.includes('café') || n.includes('restaurante') || n.includes('padaria') || n.includes('gastronom') || n.includes('flor') || n.includes('pizza')) {
    return 'minimalista_editorial';
  }
  if (n.includes('academia') || n.includes('fitness') || n.includes('crossfit') || n.includes('treino') || n.includes('treinamento') || n.includes('gym') || n.includes('luta') || n.includes('boxe') || n.includes('pilates') || n.includes('corpo') || n.includes('carro') || n.includes('automot') || n.includes('mecânic') || n.includes('detail') || n.includes('barbear') || n.includes('barba')) {
    return 'ui_ux_pro_max';
  }
  if (n.includes('advoc') || n.includes('juríd') || n.includes('direito') || n.includes('contabil') || n.includes('arquit') || n.includes('imobiliár') || n.includes('psicolog')) {
    return 'minimalista_editorial';
  }
  if (n.includes('solar') || n.includes('ar condicionado') || n.includes('reforma') || n.includes('pintura') || n.includes('eletric') || n.includes('marcen') || n.includes('vidraç') || n.includes('construç')) {
    return 'vendas_agressivo';
  }
  return 'frontend_design';
}

export function applyCreativeDirection(baseTheme, direction = 'moderno') {
  const theme = { ...baseTheme };

  switch (direction) {
    case 'premium_luxury':
    case 'redesign_premium':
      theme.mode = 'dark';
      theme.bg = '#08090d';
      theme.surface = '#121520';
      theme.text = '#fdfdfd';
      theme.muted = '#94a3b8';
      theme.border = 'rgba(212, 175, 55, 0.22)';
      theme.primary = '#d4af37';
      theme.primaryHover = '#bfa02e';
      theme.accent = '#f59e0b';
      theme.accentBg = 'rgba(212, 175, 55, 0.14)';
      theme.accentText = '#fef08a';
      theme.borderRadius = '20px';
      break;

    case 'ui_ux_pro_max':
    case 'tech_glassmorphism':
      theme.mode = 'dark';
      theme.bg = '#0b0d13';
      theme.surface = '#12141d';
      theme.text = '#f8fafc';
      theme.muted = '#94a3b8';
      theme.border = 'rgba(255, 255, 255, 0.08)';
      theme.primary = '#06b6d4';
      theme.primaryHover = '#0891b2';
      theme.accent = '#8b5cf6';
      theme.accentBg = 'rgba(6, 182, 212, 0.15)';
      theme.accentText = '#67e8f9';
      theme.borderRadius = '20px';
      break;

    case 'minimalista':
    case 'minimalista_editorial':
    case 'sofisticado_editorial':
      theme.mode = 'light';
      theme.bg = '#faf7f2';
      theme.surface = '#ffffff';
      theme.text = '#1c1917';
      theme.muted = '#57534e';
      theme.border = 'rgba(28, 25, 23, 0.09)';
      theme.primary = '#292524';
      theme.primaryHover = '#1c1917';
      theme.accent = '#854d0e';
      theme.accentBg = '#fef9c3';
      theme.accentText = '#713f12';
      theme.borderRadius = '16px';
      break;

    case 'vendas_agressivo':
    case 'alta_conversao':
      theme.mode = 'light';
      theme.bg = '#f8fafc';
      theme.surface = '#ffffff';
      theme.text = '#0f172a';
      theme.muted = '#475569';
      theme.border = 'rgba(220, 38, 38, 0.15)';
      theme.primary = '#dc2626';
      theme.primaryHover = '#b91c1c';
      theme.accent = '#ea580c';
      theme.accentBg = '#fee2e2';
      theme.accentText = '#991b1b';
      theme.borderRadius = '18px';
      break;

    case 'frontend_design':
      theme.mode = 'light';
      theme.bg = '#fcfbf9';
      theme.surface = '#ffffff';
      theme.text = '#0f172a';
      theme.muted = '#52525b';
      theme.border = 'rgba(15, 23, 42, 0.08)';
      theme.primary = '#0f172a';
      theme.primaryHover = '#1e293b';
      theme.accent = '#4f46e5';
      theme.accentBg = '#eef2ff';
      theme.accentText = '#3730a3';
      theme.borderRadius = '18px';
      break;

    case 'moderno':
    default:
      theme.mode = theme.mode || 'light';
      theme.bg = theme.bg || '#ffffff';
      theme.surface = theme.surface || '#f8fafc';
      theme.text = theme.text || '#0f172a';
      theme.muted = theme.muted || '#64748b';
      theme.border = theme.border || 'rgba(0, 0, 0, 0.08)';
      theme.primary = theme.primary || '#2563eb';
      theme.primaryHover = theme.primaryHover || '#1d4ed8';
      theme.accent = theme.accent || '#3b82f6';
      theme.accentBg = theme.accentBg || '#eff6ff';
      theme.accentText = theme.accentText || '#1d4ed8';
      theme.borderRadius = theme.borderRadius || '16px';
      break;
  }

  return theme;
}

export function buildBusinessProfile(lead) {
  const nicheInfo = resolveNicheProfile(lead.nicho || '', lead.nome || '');
  const nome = (lead.nome && lead.nome !== 'Sem Nome' ? lead.nome : 'Empresa Especializada').trim();
  const cidade = (lead.cidade && lead.cidade !== 'Sem cidade' ? lead.cidade : 'sua cidade').trim();
  const cleanPhone = cleanWhatsAppNumber(lead.whatsapp);
  const nota = lead.nota && Number(lead.nota) > 0 ? Number(lead.nota).toFixed(1) : '4.9';
  const reviewsCount = lead.reviews && Number(lead.reviews) > 0 ? Number(lead.reviews) : 48;

  const headline = `${nicheInfo.headlinesCRO[0].replace(/\.$/, '')} em ${cidade}.`;
  
  let subheadline = '';
  switch (nicheInfo.key) {
    case 'pizzaria':
      subheadline = `A ${nome} é a pizzaria artesanal de referência em ${cidade}. Unimos massas de fermentação lenta natural de 48h, molho de tomate pelati italiano, queijos nobres derretidos no forno a lenha e entrega expressa quentinha.`;
      break;
    case 'confeitaria_doceria':
      subheadline = `A ${nome} é o seu ateliê de confeitaria fina em ${cidade}. Criamos bolos artísticos personalizados, doces gourmet com chocolates nobres e sobremesas que marcam para sempre suas celebrações em família.`;
      break;
    case 'barbearia':
      subheadline = `A ${nome} é a barbearia clássica de referência em ${cidade}. Oferecemos corte degradê milimétrico, barboterapia com toalha quente e ozônio, produtos masculinos de elite e atendimento pontual sem filas.`;
      break;
    case 'salao_estetica':
      subheadline = `O ${nome} é o seu espaço de beleza e estética avançada em ${cidade}. Oferecemos mechas iluminadas com proteção da fibra capilar, unhas em gel impecáveis, visagismo facial e acolhimento sob medida.`;
      break;
    case 'pediatria':
      subheadline = `A ${nome} é referência em pediatria humanizada e puericultura em ${cidade}. Cuidamos do crescimento e da saúde do seu filho com escuta atenta, consultas sem pressa e apoio constante aos pais.`;
      break;
    case 'odontologia':
      subheadline = `A ${nome} é a sua clínica odontológica moderna em ${cidade}. Transformamos sorrisos com alinhadores invisíveis, cirurgia guiada de implantes em 3D, clareamento a laser e atendimento totalmente livre de dor.`;
      break;
    case 'psicologia_terapia':
      subheadline = `A ${nome} oferece um espaço clínico acolhedor e confidencial em ${cidade}. Psicoterapia baseada em evidências para o tratamento da ansiedade, depressão, estresse e fortalecimento emocional com sigilo absoluto.`;
      break;
    case 'mecanica_auto':
      subheadline = `A ${nome} é o seu centro automotivo de precisão em ${cidade}. Trabalhamos com diagnóstico eletrônico por scanner, revisão geral de 40 itens, peças originais com garantia formal e transparência em fotos e vídeos.`;
      break;
    case 'estetica_automotiva':
      subheadline = `A ${nome} é o seu centro de detailing e estética veicular em ${cidade}. Polimento técnico com correção de verniz, vitrificação cerâmica 9H com durabilidade de até 3 anos e higienização interna profunda a vapor.`;
      break;
    case 'energia_solar':
      subheadline = `A ${nome} é referência em engenharia solar fotovoltaica em ${cidade}. Projetamos e instalamos sistemas com painéis solares Tier 1 com 25 anos de garantia para reduzir até 95% da sua conta de luz.`;
      break;
    case 'academia':
      subheadline = `A ${nome} é a academia completa de referência em ${cidade}. Equipamentos biomecânicos articulados de alta precisão, instrutores presentes para orientar sua postura e planos sem taxas ou fidelidade abusiva.`;
      break;
    case 'floricultura':
      subheadline = `A ${nome} é a sua floricultura nobre em ${cidade}. Buquês exclusivos com flores frescas recém-chegadas do produtor, orquídeas selecionadas e entrega rápida no mesmo dia para emocionar quem você ama.`;
      break;
    case 'pet':
      subheadline = `A ${nome} é referência em bem-estar animal em ${cidade}. Banho relaxante com toalhas esterilizadas individuais, tosa especializada e atendimento veterinário atencioso sem traumas para cães e gatos.`;
      break;
    case 'vidracaria':
      subheadline = `A ${nome} é referência em envidraçamento de sacadas, boxes até o teto e esquadrias em ${cidade}. Precisão milimétrica, vidros certificados pelo INMETRO e garantia estrutural formal de 5 anos.`;
      break;
    case 'reforma_construcao':
      subheadline = `A ${nome} é referência em obras, reformas e marcenaria 100% MDF em ${cidade}. Execução rigorosa com contrato com multa por atraso, limpeza no canteiro e garantia pós-obra de 1 ano.`;
      break;
    case 'contabilidade':
      subheadline = `O escritório ${nome} atua com contabilidade estratégica e redução legítima de impostos em ${cidade}. Abertura rápida de CNPJ, BPO financeiro e suporte ágil direto no WhatsApp sem abertura de chamados lentos.`;
      break;
    case 'imobiliaria':
      subheadline = `A ${nome} é a sua consultoria patrimonial de confiança em ${cidade}. Carteira selecionada de casas e apartamentos, aluguel sem fiador e auditoria jurídica completa em todas as negociações.`;
      break;
    case 'advocacia':
      subheadline = `O escritório ${nome} atua com excelência jurídica e estratégia sólida em ${cidade}. Defendemos seus direitos e seu patrimônio com discrição, comunicação clara sem juridiquês e agilidade processual.`;
      break;
    default:
      subheadline = `A ${nome} é referência em ${nicheInfo.nichoLabel} em ${cidade}. Oferecemos atendimento dedicado e ágil, qualidade comprovada e compromisso total com sua plena satisfação.`;
      break;
  }

  const stats = nicheInfo.stats || [
    { valor: '+2.500', rotulo: 'Clientes Atendidos' },
    { valor: `★ ${nota}`, rotulo: 'Google Maps' },
    { valor: '100%', rotulo: 'Garantia & Pontualidade' },
    { valor: 'Local', rotulo: `Referência em ${cidade}` }
  ];

  const reviews = (nicheInfo.reviews || [
    { autor: `Cliente verificado no Google`, texto: 'Excelente atendimento! Foram muito ágeis e prestativos.', nota: 5 }
  ]).map(r => ({
    ...r,
    autor: r.autor.includes(cidade) ? r.autor : `${r.autor}, cliente em ${cidade}`
  }));

  const faq = nicheInfo.faq || [
    { pergunta: 'Como solicitar um orçamento ou atendimento?', resposta: `Basta clicar no botão do WhatsApp e nos enviar sua mensagem. Nossa equipe em ${cidade} responderá em poucos minutos!` },
    { pergunta: 'Quais as formas de pagamento aceitas?', resposta: 'Aceitamos Pix, cartões de débito e crédito com facilidade de parcelamento sem burocracia.' },
    { pergunta: 'Qual o prazo ou horário de atendimento?', resposta: 'Nosso horário oficial é de segunda a sexta das 08h às 18h e sábados das 08h às 13h.' }
  ];

  return {
    nome,
    cidade,
    nicho: lead.nicho || nicheInfo.nichoLabel,
    nicheKey: nicheInfo.key,
    nicheLabel: nicheInfo.nichoLabel,
    badgeLive: nicheInfo.badgeLive || `● Atendimento Imediato em ${cidade}`,
    avatar: nicheInfo.avatar,
    problemaCentral: nicheInfo.problemaCentral,
    objetivoPrincipal: nicheInfo.objetivoPrincipal,
    ctaPrincipal: nicheInfo.ctaPrincipal,
    ctaSecundario: nicheInfo.ctaSecundario,
    waMensagem: encodeURIComponent(nicheInfo.waMensagem),
    cleanPhone,
    nota,
    reviewsCount,
    endereco: lead.endereco || lead.address || `${cidade}, Brasil`,
    horario: lead.horario || 'Segunda a Sexta: 08:00 às 18:00 · Sábados: 08:00 às 13:00',
    headline,
    subheadline,
    servicos: nicheInfo.servicos || [],
    diferenciais: nicheInfo.diferenciais || [],
    imagens: nicheInfo.imagens,
    stats,
    reviews,
    faq,
    diretrizesVisuais: nicheInfo.diretrizesVisuais || {}
  };
}

// -------------------------------------------------------------------------------------------------
// ARQUITETURA 1: ANTHROPIC FRONTEND DESIGN (Design Autoral, Showstopper & Anti-AI Tells)
// -------------------------------------------------------------------------------------------------
function compileFrontendDesignSite(profile, nicheInfo, customOverrides = {}) {
  const cleanPhone = profile.cleanPhone || '5511999999999';
  const waUrl = `https://wa.me/${cleanPhone}?text=${profile.waMensagem}`;
  const heroImage = customOverrides.heroImage || profile.imagens.hero;
  const sobreImage = customOverrides.sobreImage || profile.imagens.sobre;
  const headline = customOverrides.headline || profile.headline;
  const subheadline = customOverrides.subheadline || profile.subheadline;
  const services = customOverrides.servicos || profile.servicos;
  const stats = profile.stats;
  const diferenciais = profile.diferenciais;
  const reviews = profile.reviews;
  const faq = profile.faq;

  return `<!DOCTYPE html>
<html lang="pt-BR" class="scroll-smooth">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${profile.nome} — ${profile.nicheLabel} em ${profile.cidade}</title>
  <meta name="description" content="${profile.subheadline.slice(0, 160)}">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Playfair+Display:ital,wght@0,600;0,700;1,400;1,600&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg: #fcfbf9;
      --surface: #ffffff;
      --text: #0f172a;
      --muted: #52525b;
      --border: rgba(15, 23, 42, 0.08);
      --accent: #4338ca;
      --accent-soft: #eef2ff;
      --gold: #f59e0b;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
      background: var(--bg); color: var(--text); line-height: 1.6;
      -webkit-font-smoothing: antialiased; overflow-x: hidden;
    }
    .container { max-width: 1180px; margin: 0 auto; padding: 0 1.5rem; }
    
    /* Top Capsule Nav */
    .top-nav {
      position: sticky; top: 16px; z-index: 99; margin-bottom: 2rem;
      background: rgba(255, 255, 255, 0.88); backdrop-filter: blur(16px);
      border: 1px solid var(--border); border-radius: 999px;
      padding: 10px 24px; display: flex; align-items: center; justify-content: space-between;
      box-shadow: 0 4px 20px rgba(0,0,0,0.04);
    }
    .brand-title { font-weight: 800; font-size: 1.05rem; letter-spacing: -0.02em; color: var(--text); }
    .nav-cta {
      background: var(--text); color: #fff; padding: 8px 18px; border-radius: 999px;
      font-size: 0.84rem; font-weight: 700; text-decoration: none; transition: 0.2s;
    }
    .nav-cta:hover { background: var(--accent); }

    /* Asymmetric Hero */
    .hero { padding: 40px 0 60px 0; }
    .hero-grid { display: grid; grid-template-columns: 1.15fr 0.85fr; gap: 3.5rem; align-items: center; }
    @media(max-width: 900px) { .hero-grid { grid-template-columns: 1fr; gap: 2rem; } }

    .trust-pill {
      display: inline-flex; align-items: center; gap: 8px;
      background: var(--surface); border: 1px solid var(--border);
      padding: 6px 14px; border-radius: 999px; font-size: 0.82rem; font-weight: 700;
      color: #1e1b4b; margin-bottom: 1.25rem; box-shadow: 0 2px 8px rgba(0,0,0,0.03);
    }
    .star-gold { color: var(--gold); }
    .hero-h1 {
      font-size: clamp(2.3rem, 4.4vw, 3.8rem); font-weight: 800; line-height: 1.12;
      letter-spacing: -0.03em; margin-bottom: 1.25rem;
    }
    .serif-accent { font-family: 'Playfair Display', Georgia, serif; font-style: italic; font-weight: 600; color: var(--accent); }
    .hero-lead { font-size: 1.12rem; color: var(--muted); line-height: 1.65; margin-bottom: 2rem; max-width: 560px; }
    
    .hero-btn {
      display: inline-flex; align-items: center; gap: 10px;
      background: var(--accent); color: #ffffff; padding: 16px 30px; border-radius: 14px;
      font-weight: 700; font-size: 1rem; text-decoration: none; transition: all 0.25s;
      box-shadow: 0 10px 25px rgba(67, 56, 202, 0.25);
    }
    .hero-btn:hover { transform: translateY(-2px); box-shadow: 0 15px 30px rgba(67, 56, 202, 0.35); }

    .hero-img-wrap {
      position: relative; border-radius: 24px; overflow: hidden;
      box-shadow: 0 25px 50px -12px rgba(0,0,0,0.15); border: 1px solid var(--border);
    }
    .hero-img-wrap img { width: 100%; height: 460px; object-fit: cover; display: block; }
    .hero-float-badge {
      position: absolute; bottom: 20px; left: 20px; right: 20px;
      background: rgba(255, 255, 255, 0.92); backdrop-filter: blur(12px);
      border-radius: 16px; padding: 14px 18px; border: 1px solid rgba(255, 255, 255, 0.6);
      font-size: 0.88rem; font-weight: 700; color: var(--text);
    }

    /* Stats Strip */
    .stats-strip { padding: 40px 0; border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); background: #ffffff; margin-top: 2rem; }
    .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1.5rem; text-align: center; }
    @media(max-width: 768px) { .stats-grid { grid-template-columns: repeat(2, 1fr); gap: 1.5rem; } }
    .stat-num { font-size: 2rem; font-weight: 800; color: var(--accent); letter-spacing: -0.03em; margin-bottom: 4px; }
    .stat-lbl { font-size: 0.85rem; color: var(--muted); font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; }

    /* Specialty Matrix */
    .showstopper-section { padding: 80px 0; background: var(--surface); border-bottom: 1px solid var(--border); }
    .kicker { text-transform: uppercase; font-size: 0.78rem; font-weight: 800; letter-spacing: 0.1em; color: var(--accent); margin-bottom: 0.5rem; display: block; }
    .sec-h2 { font-size: clamp(1.9rem, 3.2vw, 2.7rem); font-weight: 800; letter-spacing: -0.02em; margin-bottom: 1rem; }
    .sec-desc { color: var(--muted); font-size: 1.05rem; max-width: 640px; margin-bottom: 2.5rem; }

    .service-row-list { display: flex; flex-direction: column; gap: 1rem; }
    .service-strip {
      display: flex; justify-content: space-between; align-items: center;
      padding: 24px 28px; background: var(--bg); border: 1px solid var(--border);
      border-radius: 18px; transition: all 0.25s; text-decoration: none; color: inherit;
    }
    .service-strip:hover {
      background: #ffffff; border-color: var(--accent); transform: translateX(6px);
      box-shadow: 0 10px 30px rgba(67, 56, 202, 0.08);
    }
    .strip-tag { display: inline-block; font-size: 0.72rem; font-weight: 700; text-transform: uppercase; color: var(--accent); background: var(--accent-soft); padding: 3px 8px; border-radius: 6px; margin-bottom: 6px; }
    .strip-title { font-size: 1.2rem; font-weight: 800; margin-bottom: 4px; color: var(--text); }
    .strip-desc { font-size: 0.92rem; color: var(--muted); max-width: 600px; }
    .strip-action { font-weight: 700; font-size: 0.88rem; color: var(--accent); white-space: nowrap; display: flex; align-items: center; gap: 6px; }

    /* Differentials */
    .diff-section { padding: 80px 0; background: var(--bg); }
    .diff-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem; margin-top: 2rem; }
    .diff-card { background: #ffffff; border: 1px solid var(--border); border-radius: 18px; padding: 26px; box-shadow: 0 4px 15px rgba(0,0,0,0.02); }
    .diff-icon { font-size: 1.3rem; margin-bottom: 12px; color: var(--accent); font-weight: 800; }
    .diff-title { font-size: 1.15rem; font-weight: 800; margin-bottom: 8px; color: var(--text); }
    .diff-desc { font-size: 0.9rem; color: var(--muted); line-height: 1.55; }

    /* About Section */
    .about-section { padding: 80px 0; background: #ffffff; border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); }
    .about-grid { display: grid; grid-template-columns: 0.9fr 1.1fr; gap: 3.5rem; align-items: center; }
    @media(max-width: 900px) { .about-grid { grid-template-columns: 1fr; } }
    .about-img { width: 100%; height: 420px; object-fit: cover; border-radius: 20px; box-shadow: 0 15px 35px rgba(0,0,0,0.08); border: 1px solid var(--border); }
    .about-p { font-size: 1.05rem; color: var(--muted); line-height: 1.7; margin-bottom: 1.25rem; }

    /* Reviews Section */
    .reviews-section { padding: 80px 0; background: var(--bg); }
    .reviews-header { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 2.5rem; }
    @media(max-width: 768px) { .reviews-header { flex-direction: column; align-items: flex-start; gap: 1rem; } }
    .badge-google { background: #ffffff; border: 1px solid var(--border); border-radius: 999px; padding: 8px 18px; font-size: 0.9rem; font-weight: 700; display: inline-flex; align-items: center; gap: 8px; }
    .reviews-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 1.5rem; }
    .review-box { background: #ffffff; border: 1px solid var(--border); border-radius: 18px; padding: 26px; box-shadow: 0 4px 15px rgba(0,0,0,0.02); display: flex; flex-direction: column; justify-content: space-between; }
    .rev-stars { color: var(--gold); font-size: 1.1rem; margin-bottom: 10px; }
    .rev-txt { font-style: italic; color: #334155; font-size: 0.95rem; line-height: 1.6; margin-bottom: 1.25rem; }
    .rev-author { font-size: 0.85rem; font-weight: 700; color: var(--text); }

    /* FAQ Section */
    .faq-section { padding: 80px 0; background: #ffffff; border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); }
    .faq-list { display: flex; flex-direction: column; gap: 1rem; margin-top: 2rem; }
    .faq-item { background: var(--bg); border: 1px solid var(--border); border-radius: 14px; padding: 18px 24px; cursor: pointer; transition: 0.2s; }
    .faq-item[open] { background: #ffffff; border-color: var(--accent); box-shadow: 0 4px 20px rgba(67, 56, 202, 0.06); }
    .faq-question { font-size: 1.05rem; font-weight: 700; color: var(--text); list-style: none; display: flex; justify-content: space-between; align-items: center; }
    .faq-arrow { font-size: 1.3rem; color: var(--accent); font-weight: 800; transition: transform 0.2s; }
    .faq-item[open] .faq-arrow { transform: rotate(45deg); }
    .faq-answer { font-size: 0.95rem; color: var(--muted); line-height: 1.6; margin-top: 12px; }

    /* Info Section */
    .info-section { padding: 60px 0; background: var(--bg); }
    .info-card { background: #ffffff; border: 1px solid var(--border); border-radius: 20px; padding: 32px; display: grid; grid-template-columns: repeat(3, 1fr); gap: 2rem; box-shadow: 0 6px 25px rgba(0,0,0,0.03); }
    @media(max-width: 800px) { .info-card { grid-template-columns: 1fr; gap: 1.5rem; } }
    .info-col h4 { font-size: 1rem; font-weight: 800; margin-bottom: 6px; color: var(--text); }
    .info-col p { font-size: 0.92rem; color: var(--muted); }

    /* Footer & Floating CTA */
    footer { padding: 40px 0; text-align: center; font-size: 0.85rem; color: var(--muted); }
    .wa-float {
      position: fixed; bottom: 24px; right: 24px; z-index: 999;
      background: #22c55e; color: #ffffff; padding: 14px 24px; border-radius: 999px;
      font-weight: 700; font-size: 0.95rem; display: inline-flex; align-items: center; gap: 10px;
      text-decoration: none; box-shadow: 0 10px 30px rgba(34, 197, 94, 0.4); transition: transform 0.2s;
    }
    .wa-float:hover { transform: translateY(-2px); }
  </style>
</head>
<body>

  <div class="container" style="padding-top: 16px;">
    <header class="top-nav">
      <div class="brand-title">${profile.nome}</div>
      <a href="${waUrl}" target="_blank" class="nav-cta">Falar no WhatsApp</a>
    </header>
  </div>

  <section class="hero">
    <div class="container">
      <div class="hero-grid">
        <div>
          <div class="trust-pill">
            <span class="star-gold">★ ${profile.nota}</span>
            <span>Avaliação de Excelência em ${profile.cidade} (${profile.reviewsCount} opiniões)</span>
          </div>
          <h1 class="hero-h1">${headline}</h1>
          <p class="hero-lead">${subheadline}</p>
          <a href="${waUrl}" target="_blank" class="hero-btn">
            <span>Conversar Diretamente no WhatsApp</span>
          </a>
        </div>
        <div class="hero-img-wrap">
          <img src="${heroImage}" alt="${profile.nome}">
          <div class="hero-float-badge">
            <div style="font-size: 0.76rem; text-transform: uppercase; color: var(--accent); margin-bottom: 2px;">Atendimento Oficial</div>
            <div>${profile.horario} · ${profile.endereco}</div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- 1. Stats Strip -->
  <section class="stats-strip">
    <div class="container">
      <div class="stats-grid">
        ${stats.map(st => `
        <div class="stat-card">
          <div class="stat-num">${st.valor}</div>
          <div class="stat-lbl">${st.rotulo}</div>
        </div>
        `).join('')}
      </div>
    </div>
  </section>

  <!-- 2. Services Section -->
  <section class="showstopper-section">
    <div class="container">
      <span class="kicker">Especialidades & Soluções</span>
      <h2 class="sec-h2">Experiência Personalizada para Você</h2>
      <p class="sec-desc">Conheça as principais soluções prestadas pela ${profile.nome} em ${profile.cidade} com foco em alto padrão e resolução rápida.</p>

      <div class="service-row-list">
        ${services.map(s => `
        <a href="https://wa.me/${cleanPhone}?text=${encodeURIComponent(`Olá! Vim pelo site da ${profile.nome} e gostaria de informações sobre ${s.titulo}.`)}" target="_blank" class="service-strip">
          <div>
            ${s.tag ? `<span class="strip-tag">${s.tag}</span>` : ''}
            <div class="strip-title">${s.titulo}</div>
            <div class="strip-desc">${s.desc}</div>
          </div>
          <div class="strip-action">
            <span>Agendar no WhatsApp</span>
            <span>→</span>
          </div>
        </a>
        `).join('')}
      </div>
    </div>
  </section>

  <!-- 3. Differentials -->
  <section class="diff-section">
    <div class="container">
      <span class="kicker">Diferenciais de Excelência</span>
      <h2 class="sec-h2">Por Que a ${profile.nome} é Escolha de Confiança</h2>
      <div class="diff-grid">
        ${diferenciais.map(d => `
        <div class="diff-card">
          <div class="diff-icon">✓</div>
          <h3 class="diff-title">${d.titulo}</h3>
          <p class="diff-desc">${d.desc}</p>
        </div>
        `).join('')}
      </div>
    </div>
  </section>

  <!-- 4. About Story -->
  <section class="about-section">
    <div class="container">
      <div class="about-grid">
        <div>
          <img src="${sobreImage}" alt="Sobre a ${profile.nome}" class="about-img">
        </div>
        <div>
          <span class="kicker">Sobre Nossa História</span>
          <h2 class="sec-h2">Compromisso com o Mais Alto Padrão em ${profile.cidade}</h2>
          <p class="about-p">A ${profile.nome} nasceu para elevar o padrão de atendimento e entrega em ${profile.cidade}. Nosso foco diário é oferecer atendimento humanizado, precisão técnica e total respeito ao seu tempo e investimento.</p>
          <p class="about-p">Combinamos profissionais qualificados, atenção aos mínimos detalhes e canal direto no WhatsApp para que sua experiência seja ágil, transparente e sem atritos.</p>
          <div style="margin-top: 2rem;">
            <a href="${waUrl}" target="_blank" class="hero-btn" style="padding: 14px 26px; font-size: 0.95rem;">
              <span>Falar com Nossa Equipe no WhatsApp</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- 5. Real Reviews -->
  <section class="reviews-section">
    <div class="container">
      <div class="reviews-header">
        <div>
          <span class="kicker">Depoimentos Verificados</span>
          <h2 class="sec-h2">O Que Nossos Clientes Dizem no Google Maps</h2>
        </div>
        <div class="badge-google">
          <span class="star-gold">★★★★★</span>
          <span>${profile.nota} / 5.0 (${profile.reviewsCount} avaliações)</span>
        </div>
      </div>
      <div class="reviews-grid">
        ${reviews.map(r => `
        <div class="review-box">
          <div>
            <div class="rev-stars">★★★★★</div>
            <p class="rev-txt">"${r.texto}"</p>
          </div>
          <div class="rev-author">— ${r.autor}</div>
        </div>
        `).join('')}
      </div>
    </div>
  </section>

  <!-- 6. Interactive FAQ -->
  <section class="faq-section">
    <div class="container" style="max-width: 860px;">
      <span class="kicker" style="text-align: center;">Dúvidas Frequentes</span>
      <h2 class="sec-h2" style="text-align: center; margin-bottom: 2.5rem;">Perguntas Mais Comuns</h2>
      <div class="faq-list">
        ${faq.map((item, idx) => `
        <details class="faq-item" ${idx === 0 ? 'open' : ''}>
          <summary class="faq-question">
            <span>${item.pergunta}</span>
            <span class="faq-arrow">+</span>
          </summary>
          <p class="faq-answer">${item.resposta}</p>
        </details>
        `).join('')}
      </div>
    </div>
  </section>

  <!-- 7. Info & Hours -->
  <section class="info-section">
    <div class="container">
      <div class="info-card">
        <div class="info-col">
          <h4>📍 Endereço</h4>
          <p>${profile.endereco}</p>
          <p style="font-size: 0.85rem; color: var(--muted); margin-top: 4px;">Atendimento em ${profile.cidade} e região</p>
        </div>
        <div class="info-col">
          <h4>⏰ Horário de Funcionamento</h4>
          <p>${profile.horario}</p>
        </div>
        <div class="info-col">
          <h4>💬 Atendimento Direto</h4>
          <p>WhatsApp Oficial sem Robôs</p>
          <a href="${waUrl}" target="_blank" style="color: var(--accent); font-weight: 700; text-decoration: none; font-size: 0.95rem; margin-top: 6px; display: inline-block;">Iniciar Conversa Agora ➔</a>
        </div>
      </div>
    </div>
  </section>

  <footer>
    <div class="container">
      <p>© ${new Date().getFullYear()} ${profile.nome} · Todos os direitos reservados.</p>
      <p style="margin-top: 4px; opacity: 0.7;">${profile.endereco} — ${profile.cidade}</p>
    </div>
  </footer>

  <a href="${waUrl}" target="_blank" class="wa-float" aria-label="WhatsApp">
    <span>Falar no WhatsApp</span>
  </a>

</body>
</html>`;
}

// -------------------------------------------------------------------------------------------------
// ARQUITETURA 2: UI/UX PRO MAX (Dark Glassmorphism, Tech High Energy & Micro-interações)
// -------------------------------------------------------------------------------------------------
function compileUiUxProMaxSite(profile, nicheInfo, customOverrides = {}) {
  const cleanPhone = profile.cleanPhone || '5511999999999';
  const waUrl = `https://wa.me/${cleanPhone}?text=${profile.waMensagem}`;
  const heroImage = customOverrides.heroImage || profile.imagens.hero;
  const sobreImage = customOverrides.sobreImage || profile.imagens.sobre;
  const headline = customOverrides.headline || profile.headline;
  const subheadline = customOverrides.subheadline || profile.subheadline;
  const services = customOverrides.servicos || profile.servicos;
  const stats = profile.stats;
  const diferenciais = profile.diferenciais;
  const reviews = profile.reviews;
  const faq = profile.faq;

  return `<!DOCTYPE html>
<html lang="pt-BR" class="scroll-smooth">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${profile.nome} | ${profile.nicheLabel}</title>
  <meta name="description" content="${profile.subheadline.slice(0, 160)}">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Outfit:wght@500;600;700;800;900&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg: #0a0b10;
      --surface: #12141d;
      --card-bg: rgba(255, 255, 255, 0.04);
      --card-border: rgba(255, 255, 255, 0.08);
      --cyan: #06b6d4;
      --violet: #8b5cf6;
      --text: #f8fafc;
      --muted: #94a3b8;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Inter', system-ui, sans-serif;
      background: var(--bg); color: var(--text); line-height: 1.6;
      overflow-x: hidden; position: relative;
    }
    body::before {
      content: ''; position: absolute; top: -100px; left: 50%; transform: translateX(-50%);
      width: 900px; height: 550px;
      background: radial-gradient(circle, rgba(6, 182, 212, 0.15) 0%, rgba(139, 92, 246, 0.08) 50%, transparent 80%);
      pointer-events: none; z-index: 0;
    }
    .container { max-width: 1200px; margin: 0 auto; padding: 0 1.5rem; position: relative; z-index: 1; }

    .header-nav {
      padding: 24px 0; display: flex; align-items: center; justify-content: space-between;
      border-bottom: 1px solid var(--card-border); margin-bottom: 2.5rem;
    }
    .logo-badge { font-family: 'Outfit', sans-serif; font-size: 1.25rem; font-weight: 800; color: #ffffff; }
    .status-pill {
      display: inline-flex; align-items: center; gap: 8px; font-size: 0.8rem; font-weight: 600;
      color: var(--cyan); background: rgba(6, 182, 212, 0.1); border: 1px solid rgba(6, 182, 212, 0.25);
      padding: 6px 14px; border-radius: 999px;
    }
    .pulse-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--cyan); box-shadow: 0 0 12px var(--cyan); }

    /* Tech Hero */
    .hero { padding: 40px 0 60px 0; }
    .hero-split { display: grid; grid-template-columns: 1.2fr 0.8fr; gap: 3rem; align-items: center; }
    @media(max-width: 900px) { .hero-split { grid-template-columns: 1fr; } }

    .h1-title {
      font-family: 'Outfit', sans-serif; font-size: clamp(2.4rem, 4.8vw, 3.8rem);
      font-weight: 900; line-height: 1.1; margin-bottom: 1.25rem; letter-spacing: -0.02em;
    }
    .gradient-text {
      background: linear-gradient(135deg, #38bdf8 0%, #818cf8 50%, #c084fc 100%);
      -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    }
    .lead-text { font-size: 1.1rem; color: var(--muted); margin-bottom: 2rem; max-width: 580px; }

    .btn-tech {
      background: linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%);
      color: #ffffff; font-weight: 700; font-size: 1rem; padding: 16px 32px; border-radius: 14px;
      text-decoration: none; display: inline-flex; align-items: center; gap: 10px;
      box-shadow: 0 10px 25px rgba(6, 182, 212, 0.3); transition: all 0.25s;
    }
    .btn-tech:hover { transform: translateY(-2px); box-shadow: 0 15px 35px rgba(6, 182, 212, 0.45); }

    .glass-card {
      background: var(--card-bg); backdrop-filter: blur(20px); border: 1px solid var(--card-border);
      border-radius: 24px; padding: 24px; box-shadow: 0 20px 40px rgba(0,0,0,0.4);
    }
    .glass-card img { width: 100%; height: 380px; object-fit: cover; border-radius: 18px; margin-bottom: 16px; }

    /* Stats Strip */
    .tech-stats { padding: 40px 0; border-top: 1px solid var(--card-border); border-bottom: 1px solid var(--card-border); margin: 30px 0; }
    .tech-stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1.5rem; text-align: center; }
    @media(max-width: 768px) { .tech-stats-grid { grid-template-columns: repeat(2, 1fr); } }
    .tech-stat-num { font-family: 'Outfit'; font-size: 2.2rem; font-weight: 900; color: var(--cyan); margin-bottom: 4px; }
    .tech-stat-lbl { font-size: 0.8rem; color: var(--muted); text-transform: uppercase; letter-spacing: 0.08em; }

    /* Bento Matrix */
    .bento-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 1.5rem; margin: 40px 0; }
    .bento-item {
      background: var(--card-bg); border: 1px solid var(--card-border); border-radius: 20px;
      padding: 28px; transition: all 0.3s; display: flex; flex-direction: column; justify-content: space-between;
    }
    .bento-item:hover {
      border-color: rgba(6, 182, 212, 0.4); transform: translateY(-4px);
      box-shadow: 0 15px 35px rgba(6, 182, 212, 0.1);
    }
    .bento-tag {
      align-self: flex-start; font-size: 0.74rem; font-weight: 700; text-transform: uppercase;
      color: var(--cyan); background: rgba(6, 182, 212, 0.1); padding: 4px 10px; border-radius: 6px;
      margin-bottom: 14px;
    }
    .bento-h3 { font-family: 'Outfit', sans-serif; font-size: 1.3rem; font-weight: 800; margin-bottom: 8px; color: #fff; }
    .bento-p { font-size: 0.94rem; color: var(--muted); margin-bottom: 1.5rem; flex: 1; }
    .bento-link { color: var(--cyan); font-weight: 700; text-decoration: none; font-size: 0.9rem; }

    /* Differentials */
    .tech-diff-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem; margin: 40px 0; }
    .tech-diff-card { background: var(--card-bg); border: 1px solid var(--card-border); border-radius: 18px; padding: 26px; }
    .tech-diff-h4 { font-family: 'Outfit'; font-size: 1.15rem; font-weight: 800; color: #fff; margin-bottom: 8px; }

    /* About Tech */
    .tech-about { padding: 60px 0; display: grid; grid-template-columns: 0.9fr 1.1fr; gap: 3.5rem; align-items: center; }
    @media(max-width: 900px) { .tech-about { grid-template-columns: 1fr; } }
    .tech-about-img { width: 100%; height: 400px; object-fit: cover; border-radius: 20px; border: 1px solid var(--card-border); }

    /* Reviews Tech */
    .tech-reviews-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 1.5rem; margin: 40px 0; }
    .tech-rev-card { background: var(--card-bg); border: 1px solid var(--card-border); border-radius: 18px; padding: 26px; }

    /* FAQ Tech */
    .tech-faq-item { background: var(--card-bg); border: 1px solid var(--card-border); border-radius: 14px; padding: 18px 22px; margin-bottom: 12px; cursor: pointer; }
    .tech-faq-item[open] { border-color: var(--cyan); }
    .tech-faq-q { font-family: 'Outfit'; font-weight: 700; font-size: 1.05rem; color: #fff; list-style: none; display: flex; justify-content: space-between; }
    .tech-faq-a { color: var(--muted); font-size: 0.94rem; margin-top: 10px; line-height: 1.6; }

    /* Info Bar */
    .tech-info-bar { background: var(--card-bg); border: 1px solid var(--card-border); border-radius: 20px; padding: 30px; display: grid; grid-template-columns: repeat(3, 1fr); gap: 2rem; margin: 50px 0; }
    @media(max-width: 800px) { .tech-info-bar { grid-template-columns: 1fr; } }

    /* Footer & Sticky */
    footer { padding: 50px 0; border-top: 1px solid var(--card-border); text-align: center; color: var(--muted); font-size: 0.85rem; }
    .wa-dock {
      position: fixed; bottom: 24px; right: 24px; z-index: 999;
      background: #22c55e; color: #fff; padding: 14px 26px; border-radius: 999px;
      font-weight: 700; text-decoration: none; box-shadow: 0 10px 30px rgba(34, 197, 94, 0.4);
    }
  </style>
</head>
<body>

  <div class="container">
    <header class="header-nav">
      <div class="logo-badge">${profile.nome}</div>
      <div class="status-pill">
        <span class="pulse-dot"></span>
        <span>Atendimento em Tempo Real</span>
      </div>
    </header>

    <section class="hero">
      <div class="hero-split">
        <div>
          <div style="color: var(--cyan); font-weight: 700; font-size: 0.88rem; margin-bottom: 0.75rem;">
            ★ ${profile.nota} NO GOOGLE MAPS · ${profile.cidade.toUpperCase()}
          </div>
          <h1 class="h1-title">Soluções de Alta Precisão para <span class="gradient-text">${profile.nome}</span></h1>
          <p class="lead-text">${subheadline}</p>
          <a href="${waUrl}" target="_blank" class="btn-tech">
            Falar com Especialista no WhatsApp →
          </a>
        </div>
        <div class="glass-card">
          <img src="${heroImage}" alt="${profile.nome}">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <span style="font-weight: 700;">Google Maps Verificado</span>
            <span style="color: #f59e0b; font-weight: 800;">★ ${profile.nota} (${profile.reviewsCount})</span>
          </div>
        </div>
      </div>
    </section>

    <!-- 1. Stats -->
    <div class="tech-stats">
      <div class="tech-stats-grid">
        ${stats.map(st => `
        <div>
          <div class="tech-stat-num">${st.valor}</div>
          <div class="tech-stat-lbl">${st.rotulo}</div>
        </div>
        `).join('')}
      </div>
    </div>

    <!-- 2. Services Bento -->
    <section>
      <h2 style="font-family: 'Outfit'; font-size: 2.2rem; font-weight: 800; margin-bottom: 0.5rem; color: #fff;">Serviços & Funcionalidades</h2>
      <p style="color: var(--muted); margin-bottom: 2rem;">Tudo projetado com alto rigor técnico e transparência para ${profile.cidade}.</p>
      <div class="bento-grid">
        ${services.map(s => `
        <div class="bento-item">
          <div>
            ${s.tag ? `<span class="bento-tag">${s.tag}</span>` : ''}
            <h3 class="bento-h3">${s.titulo}</h3>
            <p class="bento-p">${s.desc}</p>
          </div>
          <a href="https://wa.me/${cleanPhone}?text=${encodeURIComponent(`Olá! Gostaria de um orçamento para ${s.titulo} na ${profile.nome}.`)}" target="_blank" class="bento-link">
            Orçamento Imediato no WhatsApp →
          </a>
        </div>
        `).join('')}
      </div>
    </section>

    <!-- 3. Differentials -->
    <section style="margin: 60px 0;">
      <h2 style="font-family: 'Outfit'; font-size: 2rem; font-weight: 800; color: #fff; margin-bottom: 0.5rem;">Pilares de Alta Performance</h2>
      <div class="tech-diff-grid">
        ${diferenciais.map(d => `
        <div class="tech-diff-card">
          <div style="color: var(--cyan); font-weight: 900; font-size: 1.2rem; margin-bottom: 8px;">⚡</div>
          <h4 class="tech-diff-h4">${d.titulo}</h4>
          <p style="color: var(--muted); font-size: 0.92rem;">${d.desc}</p>
        </div>
        `).join('')}
      </div>
    </section>

    <!-- 4. About -->
    <section class="tech-about">
      <div>
        <img src="${sobreImage}" alt="Sobre a ${profile.nome}" class="tech-about-img">
      </div>
      <div>
        <div style="color: var(--cyan); font-weight: 700; font-size: 0.85rem; text-transform: uppercase; margin-bottom: 6px;">Sobre Nós</div>
        <h2 style="font-family: 'Outfit'; font-size: 2rem; font-weight: 800; color: #fff; margin-bottom: 1.25rem;">Excelência Reconhecida em ${profile.cidade}</h2>
        <p style="color: var(--muted); line-height: 1.7; margin-bottom: 1rem;">A ${profile.nome} atua com metodologia avançada e compromisso inegociável com a satisfação de cada cliente. Eliminamos burocracias com atendimento direto e focado no seu resultado.</p>
        <p style="color: var(--muted); line-height: 1.7; margin-bottom: 2rem;">Fale diretamente conosco para tirar dúvidas, alinhar orçamentos ou solicitar atendimento prioritário hoje mesmo.</p>
        <a href="${waUrl}" target="_blank" class="btn-tech">Falar no WhatsApp Agora</a>
      </div>
    </section>

    <!-- 5. Reviews -->
    <section style="margin: 60px 0;">
      <h2 style="font-family: 'Outfit'; font-size: 2rem; font-weight: 800; color: #fff; margin-bottom: 0.5rem;">Depoimentos Reais no Google Maps</h2>
      <p style="color: var(--muted);">Avaliação consolidada de ${profile.nota} estrelas da comunidade de ${profile.cidade}.</p>
      <div class="tech-reviews-grid">
        ${reviews.map(r => `
        <div class="tech-rev-card">
          <div style="color: #f59e0b; margin-bottom: 10px;">★★★★★</div>
          <p style="font-style: italic; color: #e2e8f0; font-size: 0.95rem; margin-bottom: 1rem;">"${r.texto}"</p>
          <div style="font-size: 0.85rem; font-weight: 700; color: var(--cyan);">— ${r.autor}</div>
        </div>
        `).join('')}
      </div>
    </section>

    <!-- 6. FAQ -->
    <section style="max-width: 860px; margin: 60px auto;">
      <h2 style="font-family: 'Outfit'; font-size: 2rem; font-weight: 800; color: #fff; text-align: center; margin-bottom: 2rem;">Perguntas Frequentes</h2>
      <div>
        ${faq.map((item, idx) => `
        <details class="tech-faq-item" ${idx === 0 ? 'open' : ''}>
          <summary class="tech-faq-q">
            <span>${item.pergunta}</span>
            <span>+</span>
          </summary>
          <p class="tech-faq-a">${item.resposta}</p>
        </details>
        `).join('')}
      </div>
    </section>

    <!-- 7. Info Bar -->
    <div class="tech-info-bar">
      <div>
        <div style="font-weight: 800; color: #fff; margin-bottom: 4px;">📍 Localização</div>
        <p style="color: var(--muted); font-size: 0.9rem;">${profile.endereco}</p>
      </div>
      <div>
        <div style="font-weight: 800; color: #fff; margin-bottom: 4px;">⏰ Horário de Atendimento</div>
        <p style="color: var(--muted); font-size: 0.9rem;">${profile.horario}</p>
      </div>
      <div>
        <div style="font-weight: 800; color: #fff; margin-bottom: 4px;">💬 Canal WhatsApp</div>
        <a href="${waUrl}" target="_blank" style="color: var(--cyan); font-weight: 700; text-decoration: none; font-size: 0.9rem;">Iniciar Atendimento ➔</a>
      </div>
    </div>

    <footer>
      <p>© ${new Date().getFullYear()} ${profile.nome} · ${profile.cidade} · Todos os direitos reservados</p>
    </footer>
  </div>

  <a href="${waUrl}" target="_blank" class="wa-dock">Falar no WhatsApp</a>

</body>
</html>`;
}

// -------------------------------------------------------------------------------------------------
// ARQUITETURA 3: REDESIGN PREMIUM (Dark Luxury, Medalha de Ouro Google Maps & Alto Ticket)
// -------------------------------------------------------------------------------------------------
function compileRedesignPremiumSite(profile, nicheInfo, customOverrides = {}) {
  const cleanPhone = profile.cleanPhone || '5511999999999';
  const waUrl = `https://wa.me/${cleanPhone}?text=${profile.waMensagem}`;
  const heroImage = customOverrides.heroImage || profile.imagens.hero;
  const sobreImage = customOverrides.sobreImage || profile.imagens.sobre;
  const headline = customOverrides.headline || profile.headline;
  const subheadline = customOverrides.subheadline || profile.subheadline;
  const services = customOverrides.servicos || profile.servicos;
  const stats = profile.stats;
  const diferenciais = profile.diferenciais;
  const reviews = profile.reviews;
  const faq = profile.faq;

  return `<!DOCTYPE html>
<html lang="pt-BR" class="scroll-smooth">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${profile.nome} | Excelência & Alto Padrão em ${profile.cidade}</title>
  <meta name="description" content="${profile.subheadline.slice(0, 160)}">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@500;600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg: #08090d;
      --card: #121520;
      --gold: #d4af37;
      --gold-light: #fef08a;
      --border: rgba(212, 175, 55, 0.22);
      --text: #fdfdfd;
      --muted: #94a3b8;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
      background: var(--bg); color: var(--text); line-height: 1.6;
    }
    .container { max-width: 1140px; margin: 0 auto; padding: 0 1.5rem; }

    /* Luxury Header */
    .lux-header {
      padding: 24px 0; border-bottom: 1px solid var(--border);
      display: flex; justify-content: space-between; align-items: center;
    }
    .brand-lux { font-family: 'Cinzel', serif; font-size: 1.25rem; font-weight: 700; letter-spacing: 0.08em; color: var(--gold); }
    .btn-lux-gold {
      background: linear-gradient(135deg, #d4af37 0%, #bfa02e 100%);
      color: #08090d; font-weight: 800; font-size: 0.85rem; padding: 10px 22px; border-radius: 999px;
      text-decoration: none; letter-spacing: 0.04em; transition: all 0.25s;
    }
    .btn-lux-gold:hover { transform: translateY(-2px); box-shadow: 0 8px 25px rgba(212, 175, 55, 0.35); }

    /* Hero */
    .hero-lux { padding: 60px 0 60px 0; text-align: center; }
    .prestige-medal {
      display: inline-flex; align-items: center; gap: 10px;
      background: rgba(212, 175, 55, 0.12); border: 1px solid var(--border);
      padding: 8px 18px; border-radius: 999px; color: var(--gold-light);
      font-size: 0.82rem; font-weight: 700; letter-spacing: 0.05em; margin-bottom: 2rem;
    }
    .lux-h1 {
      font-family: 'Cinzel', serif; font-size: clamp(2.2rem, 4.5vw, 3.6rem);
      font-weight: 700; line-height: 1.2; letter-spacing: 0.02em; margin-bottom: 1.5rem; color: #ffffff;
    }
    .lux-lead { font-size: 1.15rem; color: var(--muted); max-width: 720px; margin: 0 auto 2.5rem auto; line-height: 1.7; }
    
    /* Stats Luxury */
    .lux-stats { padding: 35px 0; border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); margin-bottom: 50px; }
    .lux-stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1.5rem; text-align: center; }
    @media(max-width: 768px) { .lux-stats-grid { grid-template-columns: repeat(2, 1fr); } }
    .lux-stat-val { font-family: 'Cinzel', serif; font-size: 2.2rem; color: var(--gold); font-weight: 700; }
    .lux-stat-lbl { font-size: 0.8rem; color: var(--muted); text-transform: uppercase; letter-spacing: 0.08em; }

    /* Authority Pillars */
    .pillars-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 1.5rem; margin: 40px 0; }
    .pillar-box {
      background: var(--card); border: 1px solid var(--border); border-radius: 16px;
      padding: 24px; text-align: left;
    }
    .pillar-title { font-family: 'Cinzel', serif; font-size: 1.1rem; color: var(--gold); margin-bottom: 6px; font-weight: 700; }
    .pillar-desc { font-size: 0.9rem; color: var(--muted); }

    /* Services Luxury */
    .services-lux-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 1.5rem; margin: 40px 0; }
    .lux-card {
      background: var(--card); border: 1px solid var(--border); border-radius: 18px;
      padding: 28px; transition: all 0.25s; text-align: left;
    }
    .lux-card:hover { border-color: var(--gold); transform: translateY(-3px); }
    .lux-card-tag { font-size: 0.74rem; font-weight: 700; text-transform: uppercase; color: var(--gold); margin-bottom: 8px; display: block; }
    .lux-card-h3 { font-family: 'Cinzel', serif; font-size: 1.25rem; color: #ffffff; margin-bottom: 8px; font-weight: 700; }
    .lux-card-p { font-size: 0.92rem; color: var(--muted); margin-bottom: 1.5rem; }
    .lux-card-link { color: var(--gold); font-size: 0.88rem; font-weight: 700; text-decoration: none; }

    /* About Luxury */
    .lux-about { padding: 60px 0; display: grid; grid-template-columns: 0.9fr 1.1fr; gap: 3.5rem; align-items: center; }
    @media(max-width: 900px) { .lux-about { grid-template-columns: 1fr; } }
    .lux-about-img { width: 100%; height: 420px; object-fit: cover; border-radius: 20px; border: 1px solid var(--border); }

    /* Reviews Luxury */
    .lux-rev-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 1.5rem; margin: 40px 0; }
    .lux-rev-card { background: var(--card); border: 1px solid var(--border); border-radius: 18px; padding: 26px; }

    /* FAQ Luxury */
    .lux-faq-item { background: var(--card); border: 1px solid var(--border); border-radius: 14px; padding: 18px 22px; margin-bottom: 12px; cursor: pointer; }
    .lux-faq-item[open] { border-color: var(--gold); }
    .lux-faq-q { font-family: 'Cinzel'; font-weight: 700; font-size: 1.05rem; color: #fff; list-style: none; display: flex; justify-content: space-between; }
    .lux-faq-a { color: var(--muted); font-size: 0.94rem; margin-top: 10px; line-height: 1.6; }

    /* VIP Concierge */
    .concierge-box {
      background: linear-gradient(135deg, rgba(212, 175, 55, 0.15) 0%, rgba(18, 21, 32, 0.9) 100%);
      border: 1px solid var(--gold); border-radius: 24px; padding: 40px; text-align: center; margin: 60px 0;
    }
    .concierge-h2 { font-family: 'Cinzel', serif; font-size: 1.8rem; color: #ffffff; margin-bottom: 1rem; }

    footer { padding: 40px 0; text-align: center; color: var(--muted); font-size: 0.85rem; border-top: 1px solid var(--border); }
    .wa-lux-float {
      position: fixed; bottom: 24px; right: 24px; z-index: 999;
      background: #22c55e; color: #ffffff; padding: 14px 24px; border-radius: 999px;
      font-weight: 700; text-decoration: none; box-shadow: 0 10px 30px rgba(34, 197, 94, 0.4);
    }
  </style>
</head>
<body>

  <div class="container">
    <header class="lux-header">
      <div class="brand-lux">${profile.nome}</div>
      <a href="${waUrl}" target="_blank" class="btn-lux-gold">Atendimento VIP</a>
    </header>

    <section class="hero-lux">
      <div class="prestige-medal">
        <span>★ ${profile.nota} NO GOOGLE MAPS</span>
        <span>·</span>
        <span>EXCELÊNCIA RECONHECIDA EM ${profile.cidade.toUpperCase()}</span>
      </div>
      <h1 class="lux-h1">${headline}</h1>
      <p class="lux-lead">${subheadline}</p>
      <a href="${waUrl}" target="_blank" class="btn-lux-gold" style="font-size: 1rem; padding: 16px 36px;">
        Agendar Atendimento Exclusivo via WhatsApp →
      </a>
    </section>

    <!-- 1. Stats -->
    <div class="lux-stats">
      <div class="lux-stats-grid">
        ${stats.map(st => `
        <div>
          <div class="lux-stat-val">${st.valor}</div>
          <div class="lux-stat-lbl">${st.rotulo}</div>
        </div>
        `).join('')}
      </div>
    </div>

    <!-- 2. Pillars -->
    <div class="pillars-grid">
      ${diferenciais.map(d => `
      <div class="pillar-box">
        <div class="pillar-title">${d.titulo}</div>
        <div class="pillar-desc">${d.desc}</div>
      </div>
      `).join('')}
    </div>

    <!-- 3. Services -->
    <section>
      <div style="text-align: center; margin-bottom: 2rem;">
        <h2 style="font-family: 'Cinzel'; font-size: 2rem; color: #ffffff;">Especialidades Selecionadas</h2>
        <p style="color: var(--muted); font-size: 0.95rem;">Conheça nossas soluções sob medida para sua necessidade em ${profile.cidade}.</p>
      </div>

      <div class="services-lux-grid">
        ${services.map(s => `
        <div class="lux-card">
          ${s.tag ? `<span class="lux-card-tag">${s.tag}</span>` : ''}
          <h3 class="lux-card-h3">${s.titulo}</h3>
          <p class="lux-card-p">${s.desc}</p>
          <a href="https://wa.me/${cleanPhone}?text=${encodeURIComponent(`Olá! Gostaria de agendar um atendimento para ${s.titulo} com a ${profile.nome}.`)}" target="_blank" class="lux-card-link">
            Solicitar Horário VIP no WhatsApp →
          </a>
        </div>
        `).join('')}
      </div>
    </section>

    <!-- 4. About Story -->
    <section class="lux-about">
      <div>
        <img src="${sobreImage}" alt="Sobre a ${profile.nome}" class="lux-about-img">
      </div>
      <div>
        <div style="color: var(--gold); font-family: 'Cinzel'; font-size: 0.9rem; letter-spacing: 0.1em; margin-bottom: 6px;">Sobre Nossa Trajetória</div>
        <h2 style="font-family: 'Cinzel'; font-size: 2rem; color: #ffffff; margin-bottom: 1.25rem;">A Referência em ${profile.cidade}</h2>
        <p style="color: var(--muted); line-height: 1.7; margin-bottom: 1rem;">Com anos de dedicação ao aperfeiçoamento contínuo, a ${profile.nome} construiu uma reputação inabalável fundamentada em resultados concretos e ética profissional.</p>
        <p style="color: var(--muted); line-height: 1.7; margin-bottom: 2rem;">Cada detalhe do nosso atendimento foi desenhado para oferecer serenidade, segurança e uma experiência verdadeiramente memorável.</p>
        <a href="${waUrl}" target="_blank" class="btn-lux-gold">Conversar com Nossos Especialistas</a>
      </div>
    </section>

    <!-- 5. Real Reviews -->
    <section style="margin: 60px 0;">
      <h2 style="font-family: 'Cinzel'; font-size: 2rem; color: #ffffff; text-align: center; margin-bottom: 0.5rem;">Reconhecimento no Google Maps</h2>
      <p style="color: var(--muted); text-align: center; margin-bottom: 2rem;">Opiniões comprovadas de clientes atendidos em ${profile.cidade}:</p>
      <div class="lux-rev-grid">
        ${reviews.map(r => `
        <div class="lux-rev-card">
          <div style="color: var(--gold); margin-bottom: 8px;">★★★★★</div>
          <p style="font-style: italic; color: #e2e8f0; font-size: 0.94rem; margin-bottom: 1rem;">"${r.texto}"</p>
          <div style="font-size: 0.85rem; font-weight: 700; color: var(--gold);">— ${r.autor}</div>
        </div>
        `).join('')}
      </div>
    </section>

    <!-- 6. FAQ -->
    <section style="max-width: 860px; margin: 60px auto;">
      <h2 style="font-family: 'Cinzel'; font-size: 2rem; color: #ffffff; text-align: center; margin-bottom: 2rem;">Dúvidas Frequentes</h2>
      <div>
        ${faq.map((item, idx) => `
        <details class="lux-faq-item" ${idx === 0 ? 'open' : ''}>
          <summary class="lux-faq-q">
            <span>${item.pergunta}</span>
            <span>+</span>
          </summary>
          <p class="lux-faq-a">${item.resposta}</p>
        </details>
        `).join('')}
      </div>
    </section>

    <!-- 7. Concierge Box -->
    <div class="concierge-box">
      <h2 class="concierge-h2">Experiência sem Filas ou Esperas</h2>
      <p style="color: var(--muted); margin-bottom: 1.5rem; max-width: 600px; margin-left: auto; margin-right: auto;">
        Nosso canal direto no WhatsApp está disponível para tirar dúvidas, reservar horários prioritários e alinhar orçamentos com discrição total.
      </p>
      <a href="${waUrl}" target="_blank" class="btn-lux-gold" style="font-size: 1rem; padding: 14px 32px;">
        Falar com Nosso Concierge no WhatsApp
      </a>
    </div>

    <footer>
      <p>© ${new Date().getFullYear()} ${profile.nome} · ${profile.endereco} · ${profile.cidade}</p>
    </footer>
  </div>

  <a href="${waUrl}" target="_blank" class="wa-lux-float">Falar no WhatsApp</a>

</body>
</html>`;
}

// -------------------------------------------------------------------------------------------------
// ARQUITETURA 4: EDITORIAL BOUTIQUE & CRAFT (Warm Paper, Serifas Nobres & Espaço Amplo)
// -------------------------------------------------------------------------------------------------
function compileMinimalEditorialSite(profile, nicheInfo, customOverrides = {}) {
  const cleanPhone = profile.cleanPhone || '5511999999999';
  const waUrl = `https://wa.me/${cleanPhone}?text=${profile.waMensagem}`;
  const heroImage = customOverrides.heroImage || profile.imagens.hero;
  const sobreImage = customOverrides.sobreImage || profile.imagens.sobre;
  const headline = customOverrides.headline || profile.headline;
  const subheadline = customOverrides.subheadline || profile.subheadline;
  const services = customOverrides.servicos || profile.servicos;
  const stats = profile.stats;
  const diferenciais = profile.diferenciais;
  const reviews = profile.reviews;
  const faq = profile.faq;

  return `<!DOCTYPE html>
<html lang="pt-BR" class="scroll-smooth">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${profile.nome} — Tradição & Excelência em ${profile.cidade}</title>
  <meta name="description" content="${profile.subheadline.slice(0, 160)}">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,500;0,600;1,400;1,600&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    :root {
      --paper: #faf7f2;
      --ink: #1c1917;
      --muted: #57534e;
      --border: rgba(28, 25, 23, 0.1);
      --bronze: #854d0e;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
      background: var(--paper); color: var(--ink); line-height: 1.7;
    }
    .container { max-width: 1080px; margin: 0 auto; padding: 0 1.5rem; }

    .edi-nav {
      padding: 30px 0; border-bottom: 1px solid var(--border);
      display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 3rem;
    }
    .edi-brand { font-family: 'Lora', serif; font-size: 1.35rem; font-weight: 600; letter-spacing: -0.01em; }
    .edi-city { font-size: 0.85rem; color: var(--muted); text-transform: uppercase; letter-spacing: 0.1em; }

    .edi-hero { padding: 40px 0 60px 0; }
    .edi-kicker { font-size: 0.82rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.12em; color: var(--bronze); margin-bottom: 1.25rem; display: block; }
    .edi-h1 {
      font-family: 'Lora', serif; font-size: clamp(2.4rem, 4.6vw, 3.8rem);
      font-weight: 500; line-height: 1.2; letter-spacing: -0.02em; margin-bottom: 1.5rem;
    }
    .edi-p { font-size: 1.15rem; color: var(--muted); max-width: 680px; margin-bottom: 2.5rem; }
    .edi-btn {
      display: inline-block; background: var(--ink); color: #fff; padding: 16px 34px;
      font-size: 0.95rem; font-weight: 600; text-decoration: none; border-radius: 8px; transition: 0.2s;
    }
    .edi-btn:hover { background: var(--bronze); }

    /* Stats Strip */
    .edi-stats { padding: 35px 0; border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); margin: 40px 0; }
    .edi-stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1.5rem; text-align: center; }
    @media(max-width: 768px) { .edi-stats-grid { grid-template-columns: repeat(2, 1fr); } }
    .edi-stat-num { font-family: 'Lora', serif; font-size: 2rem; font-weight: 600; color: var(--bronze); }
    .edi-stat-lbl { font-size: 0.8rem; color: var(--muted); text-transform: uppercase; }

    /* Services Grid */
    .edi-services { margin: 60px 0; }
    .edi-cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem; margin-top: 2rem; }
    .edi-card { background: #ffffff; border: 1px solid var(--border); border-radius: 12px; padding: 30px; box-shadow: 0 4px 15px rgba(0,0,0,0.02); }
    .edi-card-h3 { font-family: 'Lora', serif; font-size: 1.3rem; margin-bottom: 8px; font-weight: 600; }
    .edi-card-p { font-size: 0.95rem; color: var(--muted); margin-bottom: 1.5rem; }
    .edi-card-link { color: var(--bronze); font-weight: 600; text-decoration: none; font-size: 0.9rem; }

    /* Differentials */
    .edi-diff-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 1.5rem; margin: 40px 0; }
    .edi-diff-item { border-left: 2px solid var(--bronze); padding-left: 18px; }
    .edi-diff-title { font-family: 'Lora', serif; font-size: 1.1rem; font-weight: 600; margin-bottom: 4px; }

    /* About Story */
    .edi-about { padding: 60px 0; display: grid; grid-template-columns: 1fr 1fr; gap: 3.5rem; align-items: center; border-top: 1px solid var(--border); }
    @media(max-width: 800px) { .edi-about { grid-template-columns: 1fr; } }
    .edi-about-img { width: 100%; height: 380px; object-fit: cover; border-radius: 12px; }

    /* Reviews */
    .edi-reviews { padding: 60px 0; border-top: 1px solid var(--border); }
    .edi-rev-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1.5rem; margin-top: 2rem; }
    .edi-rev-card { background: #fff; border: 1px solid var(--border); border-radius: 12px; padding: 24px; }

    /* FAQ */
    .edi-faq-item { border-bottom: 1px solid var(--border); padding: 18px 0; cursor: pointer; }
    .edi-faq-q { font-family: 'Lora'; font-weight: 600; font-size: 1.1rem; list-style: none; display: flex; justify-content: space-between; }
    .edi-faq-a { color: var(--muted); font-size: 0.95rem; margin-top: 10px; }

    /* Info */
    .edi-info { background: #ffffff; border: 1px solid var(--border); border-radius: 14px; padding: 30px; display: grid; grid-template-columns: repeat(3, 1fr); gap: 2rem; margin: 50px 0; }
    @media(max-width: 768px) { .edi-info { grid-template-columns: 1fr; } }

    footer { padding: 50px 0; border-top: 1px solid var(--border); text-align: center; color: var(--muted); font-size: 0.88rem; }
    .wa-dock { position: fixed; bottom: 24px; right: 24px; z-index: 999; background: #22c55e; color: #fff; padding: 14px 24px; border-radius: 999px; font-weight: 700; text-decoration: none; box-shadow: 0 10px 25px rgba(34, 197, 94, 0.4); }
  </style>
</head>
<body>

  <div class="container">
    <header class="edi-nav">
      <div class="edi-brand">${profile.nome}</div>
      <div class="edi-city">${profile.cidade} · ★ ${profile.nota} Google Maps</div>
    </header>

    <section class="edi-hero">
      <span class="edi-kicker">Tradição & Cuidado Artesanal</span>
      <h1 class="edi-h1">${headline}</h1>
      <p class="edi-p">${subheadline}</p>
      <a href="${waUrl}" target="_blank" class="edi-btn">Conversar Conosco no WhatsApp →</a>
    </section>

    <!-- 1. Stats -->
    <div class="edi-stats">
      <div class="edi-stats-grid">
        ${stats.map(st => `
        <div>
          <div class="edi-stat-num">${st.valor}</div>
          <div class="edi-stat-lbl">${st.rotulo}</div>
        </div>
        `).join('')}
      </div>
    </div>

    <!-- 2. Services -->
    <section class="edi-services">
      <span class="edi-kicker">Nossas Soluções</span>
      <h2 style="font-family: 'Lora', serif; font-size: 2.2rem; font-weight: 500;">Cardápio de Serviços em ${profile.cidade}</h2>
      <div class="edi-cards">
        ${services.map(s => `
        <div class="edi-card">
          ${s.tag ? `<div style="font-size: 0.74rem; font-weight: 700; color: var(--bronze); text-transform: uppercase; margin-bottom: 6px;">${s.tag}</div>` : ''}
          <h3 class="edi-card-h3">${s.titulo}</h3>
          <p class="edi-card-p">${s.desc}</p>
          <a href="https://wa.me/${cleanPhone}?text=${encodeURIComponent(`Olá! Vim pelo site da ${profile.nome} e gostaria de informações sobre ${s.titulo}.`)}" target="_blank" class="edi-card-link">
            Consultar Disponibilidade ➔
          </a>
        </div>
        `).join('')}
      </div>
    </section>

    <!-- 3. Differentials -->
    <section style="margin: 60px 0;">
      <span class="edi-kicker">Por Que Nos Escolher</span>
      <h2 style="font-family: 'Lora', serif; font-size: 2rem; font-weight: 500; margin-bottom: 2rem;">Atenção aos Detalhes em Cada Etapa</h2>
      <div class="edi-diff-grid">
        ${diferenciais.map(d => `
        <div class="edi-diff-item">
          <div class="edi-diff-title">${d.titulo}</div>
          <p style="color: var(--muted); font-size: 0.92rem;">${d.desc}</p>
        </div>
        `).join('')}
      </div>
    </section>

    <!-- 4. About Story -->
    <section class="edi-about">
      <div>
        <img src="${sobreImage}" alt="História da ${profile.nome}" class="edi-about-img">
      </div>
      <div>
        <span class="edi-kicker">Nossa História</span>
        <h2 style="font-family: 'Lora', serif; font-size: 2rem; font-weight: 500; margin-bottom: 1.25rem;">Feito com Paixão em ${profile.cidade}</h2>
        <p style="color: var(--muted); margin-bottom: 1rem;">Nossa história com ${profile.cidade} começou com uma meta simples: unir receitas e processos autênticos ao acolhimento mais genuíno possível.</p>
        <p style="color: var(--muted); margin-bottom: 2rem;">Você é nosso convidado de honra para experimentar nosso padrão de qualidade sem compromisso.</p>
        <a href="${waUrl}" target="_blank" class="edi-btn">Falar no WhatsApp</a>
      </div>
    </section>

    <!-- 5. Reviews -->
    <section class="edi-reviews">
      <span class="edi-kicker">Reconhecimento</span>
      <h2 style="font-family: 'Lora', serif; font-size: 2rem; font-weight: 500;">Opiniões dos Nossos Clientes no Google</h2>
      <div class="edi-rev-grid">
        ${reviews.map(r => `
        <div class="edi-rev-card">
          <div style="color: var(--bronze); margin-bottom: 6px;">★★★★★</div>
          <p style="font-style: italic; color: #44403c; font-size: 0.94rem; margin-bottom: 1rem;">"${r.texto}"</p>
          <div style="font-size: 0.85rem; font-weight: 600; color: var(--ink);">— ${r.autor}</div>
        </div>
        `).join('')}
      </div>
    </section>

    <!-- 6. FAQ -->
    <section style="max-width: 800px; margin: 60px auto;">
      <span class="edi-kicker" style="text-align: center;">Dúvidas Comuns</span>
      <h2 style="font-family: 'Lora', serif; font-size: 2rem; font-weight: 500; text-align: center; margin-bottom: 2rem;">Perguntas Frequentes</h2>
      <div>
        ${faq.map((item, idx) => `
        <details class="edi-faq-item" ${idx === 0 ? 'open' : ''}>
          <summary class="edi-faq-q">
            <span>${item.pergunta}</span>
            <span>+</span>
          </summary>
          <p class="edi-faq-a">${item.resposta}</p>
        </details>
        `).join('')}
      </div>
    </section>

    <!-- 7. Info -->
    <div class="edi-info">
      <div>
        <div style="font-weight: 700; margin-bottom: 4px;">📍 Localização</div>
        <p style="color: var(--muted); font-size: 0.9rem;">${profile.endereco}</p>
      </div>
      <div>
        <div style="font-weight: 700; margin-bottom: 4px;">⏰ Horário de Funcionamento</div>
        <p style="color: var(--muted); font-size: 0.9rem;">${profile.horario}</p>
      </div>
      <div>
        <div style="font-weight: 700; margin-bottom: 4px;">💬 Contato Oficial</div>
        <a href="${waUrl}" target="_blank" style="color: var(--bronze); font-weight: 700; text-decoration: none; font-size: 0.9rem;">Abrir WhatsApp ➔</a>
      </div>
    </div>

    <footer>
      <p>© ${new Date().getFullYear()} ${profile.nome} · ${profile.endereco} · ${profile.cidade}</p>
    </footer>
  </div>

  <a href="${waUrl}" target="_blank" class="wa-dock">Falar no WhatsApp</a>

</body>
</html>`;
}

// -------------------------------------------------------------------------------------------------
// ARQUITETURA 5: DIRECT RESPONSE (Alta Conversão, Tabela Comparativa & Urgência)
// -------------------------------------------------------------------------------------------------
function compileDirectResponseSite(profile, nicheInfo, customOverrides = {}) {
  const cleanPhone = profile.cleanPhone || '5511999999999';
  const waUrl = `https://wa.me/${cleanPhone}?text=${profile.waMensagem}`;
  const heroImage = customOverrides.heroImage || profile.imagens.hero;
  const sobreImage = customOverrides.sobreImage || profile.imagens.sobre;
  const headline = customOverrides.headline || profile.headline;
  const subheadline = customOverrides.subheadline || profile.subheadline;
  const services = customOverrides.servicos || profile.servicos;
  const stats = profile.stats;
  const diferenciais = profile.diferenciais;
  const reviews = profile.reviews;
  const faq = profile.faq;

  return `<!DOCTYPE html>
<html lang="pt-BR" class="scroll-smooth">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${profile.nome} — Orçamento Rápido em ${profile.cidade}</title>
  <meta name="description" content="${profile.subheadline.slice(0, 160)}">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@600;700;800;900&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg: #f8fafc;
      --surface: #ffffff;
      --primary: #dc2626;
      --primary-hover: #b91c1c;
      --text: #0f172a;
      --muted: #475569;
      --border: #e2e8f0;
      --green: #16a34a;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Inter', system-ui, sans-serif;
      background: var(--bg); color: var(--text); line-height: 1.6;
    }
    .urgency-bar {
      background: #0f172a; color: #f8fafc; text-align: center;
      padding: 10px 16px; font-size: 0.82rem; font-weight: 700;
    }
    .container { max-width: 1140px; margin: 0 auto; padding: 0 1.5rem; }

    .header-resp {
      padding: 20px 0; display: flex; justify-content: space-between; align-items: center;
    }
    .brand-resp { font-family: 'Montserrat', sans-serif; font-size: 1.25rem; font-weight: 900; color: #0f172a; }

    .hero-resp { padding: 40px 0 50px 0; text-align: center; }
    .hero-badge {
      display: inline-block; background: #fee2e2; color: #991b1b; font-weight: 800;
      font-size: 0.78rem; text-transform: uppercase; padding: 5px 14px; border-radius: 999px; margin-bottom: 1rem;
    }
    .hero-h1 {
      font-family: 'Montserrat', sans-serif; font-size: clamp(2.3rem, 4.8vw, 3.6rem);
      font-weight: 900; line-height: 1.15; margin-bottom: 1.25rem; color: #0f172a;
    }
    .hero-lead { font-size: 1.15rem; color: var(--muted); max-width: 700px; margin: 0 auto 2rem auto; }
    
    .btn-action {
      background: var(--primary); color: #fff; font-family: 'Montserrat', sans-serif;
      font-size: 1.1rem; font-weight: 800; padding: 18px 40px; border-radius: 14px;
      text-decoration: none; display: inline-flex; align-items: center; gap: 10px;
      box-shadow: 0 10px 30px rgba(220, 38, 38, 0.35); transition: all 0.2s;
    }
    .btn-action:hover { background: var(--primary-hover); transform: translateY(-2px); }

    /* Stats */
    .resp-stats { padding: 35px 0; border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); background: #ffffff; margin: 30px 0; }
    .resp-stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1.5rem; text-align: center; }
    @media(max-width: 768px) { .resp-stats-grid { grid-template-columns: repeat(2, 1fr); } }
    .resp-stat-num { font-family: 'Montserrat'; font-size: 2.2rem; font-weight: 900; color: var(--primary); }
    .resp-stat-lbl { font-size: 0.8rem; color: var(--muted); text-transform: uppercase; font-weight: 700; }

    /* Comparison Table */
    .compare-sec { padding: 50px 0; }
    .compare-table {
      width: 100%; border-collapse: collapse; background: #fff;
      border-radius: 18px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.05);
      margin-top: 2rem;
    }
    .compare-table th, .compare-table td { padding: 18px 24px; text-align: left; border-bottom: 1px solid var(--border); }
    .compare-table th { background: #0f172a; color: #fff; font-family: 'Montserrat'; font-size: 0.95rem; }
    .th-brand { background: var(--primary) !important; color: #fff; }

    /* Action Cards */
    .action-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 1.5rem; margin: 40px 0; }
    .action-card {
      background: #fff; border: 2px solid var(--border); border-radius: 18px;
      padding: 26px; text-align: left; transition: 0.25s;
    }
    .action-card:hover { border-color: var(--primary); transform: translateY(-3px); }
    .action-card h3 { font-family: 'Montserrat'; font-size: 1.2rem; font-weight: 800; margin-bottom: 8px; }
    .action-card p { font-size: 0.94rem; color: var(--muted); margin-bottom: 1.5rem; }
    .card-btn {
      display: block; text-align: center; background: #0f172a; color: #fff;
      padding: 12px; border-radius: 10px; font-weight: 700; text-decoration: none; font-size: 0.9rem;
    }
    .card-btn:hover { background: var(--primary); }

    /* Reviews */
    .resp-rev-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 1.5rem; margin: 30px 0; }
    .resp-rev-card { background: #ffffff; border: 1px solid var(--border); border-radius: 14px; padding: 22px; }

    /* FAQ */
    .resp-faq-item { background: #ffffff; border: 1px solid var(--border); border-radius: 12px; padding: 16px 20px; margin-bottom: 10px; cursor: pointer; }
    .resp-faq-item[open] { border-color: var(--primary); }
    .resp-faq-q { font-family: 'Montserrat'; font-weight: 700; font-size: 1rem; list-style: none; display: flex; justify-content: space-between; }
    .resp-faq-a { color: var(--muted); font-size: 0.94rem; margin-top: 8px; }

    footer { padding: 40px 0; text-align: center; color: var(--muted); font-size: 0.85rem; border-top: 1px solid var(--border); }
    .wa-float {
      position: fixed; bottom: 24px; right: 24px; z-index: 999;
      background: #22c55e; color: #fff; padding: 14px 24px; border-radius: 999px;
      font-weight: 800; font-family: 'Montserrat'; text-decoration: none; box-shadow: 0 10px 30px rgba(34, 197, 94, 0.4);
    }
  </style>
</head>
<body>

  <div class="urgency-bar">
    ⚡ ATENDIMENTO PRIORITÁRIO EM ${profile.cidade.toUpperCase()} — Resposta rápida no WhatsApp
  </div>

  <div class="container">
    <header class="header-resp">
      <div class="brand-resp">${profile.nome}</div>
      <div style="font-weight: 700; color: var(--green);">★ ${profile.nota} no Google Maps</div>
    </header>

    <section class="hero-resp">
      <span class="hero-badge">Orçamento Imediato Sem Compromisso</span>
      <h1 class="hero-h1">${headline}</h1>
      <p class="hero-lead">${subheadline}</p>
      <a href="${waUrl}" target="_blank" class="btn-action">
        Solicitar Orçamento no WhatsApp Agora →
      </a>
    </section>

    <!-- 1. Stats -->
    <div class="resp-stats">
      <div class="resp-stats-grid">
        ${stats.map(st => `
        <div>
          <div class="resp-stat-num">${st.valor}</div>
          <div class="resp-stat-lbl">${st.rotulo}</div>
        </div>
        `).join('')}
      </div>
    </div>

    <!-- 2. Comparison Table -->
    <section class="compare-sec">
      <h2 style="font-family: 'Montserrat'; font-size: 1.8rem; text-align: center; margin-bottom: 0.5rem;">Por Que Escolher a ${profile.nome}?</h2>
      <p style="text-align: center; color: var(--muted);">Veja a diferença clara no nosso atendimento em ${profile.cidade}:</p>

      <table class="compare-table">
        <thead>
          <tr>
            <th>Critério</th>
            <th>Outros Prestadores ❌</th>
            <th class="th-brand">${profile.nome} ✅</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Tempo de Resposta</strong></td>
            <td>Horas ou dias para responder</td>
            <td style="color: var(--green); font-weight: 700;">Resposta em poucos minutos no WhatsApp</td>
          </tr>
          <tr>
            <td><strong>Transparência</strong></td>
            <td>Orçamentos confusos e surpresas no valor</td>
            <td style="color: var(--green); font-weight: 700;">Orçamento claro, sem taxas escondidas</td>
          </tr>
          <tr>
            <td><strong>Reputação Real</strong></td>
            <td>Sem avaliações comprovadas</td>
            <td style="color: var(--green); font-weight: 700;">Nota ${profile.nota} com ${profile.reviewsCount} avaliações reais no Google</td>
          </tr>
        </tbody>
      </table>
    </section>

    <!-- 3. Services -->
    <section>
      <h2 style="font-family: 'Montserrat'; font-size: 1.8rem; margin-bottom: 1.5rem;">Soluções Mais Solicitadas</h2>
      <div class="action-grid">
        ${services.map(s => `
        <div class="action-card">
          ${s.tag ? `<span style="font-size: 0.72rem; font-weight: 800; color: var(--primary); text-transform: uppercase;">${s.tag}</span>` : ''}
          <h3>${s.titulo}</h3>
          <p>${s.desc}</p>
          <a href="https://wa.me/${cleanPhone}?text=${encodeURIComponent(`Olá! Gostaria de um orçamento para ${s.titulo} na ${profile.nome}.`)}" target="_blank" class="card-btn">
            Pedir Orçamento Deste Serviço →
          </a>
        </div>
        `).join('')}
      </div>
    </section>

    <!-- 4. Reviews -->
    <section style="margin: 50px 0;">
      <h2 style="font-family: 'Montserrat'; font-size: 1.8rem; margin-bottom: 1rem;">O Que Clientes Reais Dizem</h2>
      <div class="resp-rev-grid">
        ${reviews.map(r => `
        <div class="resp-rev-card">
          <div style="color: #f59e0b; margin-bottom: 6px;">★★★★★</div>
          <p style="font-style: italic; color: #334155; font-size: 0.94rem; margin-bottom: 1rem;">"${r.texto}"</p>
          <div style="font-size: 0.85rem; font-weight: 700; color: var(--text);">— ${r.autor}</div>
        </div>
        `).join('')}
      </div>
    </section>

    <!-- 5. FAQ -->
    <section style="max-width: 800px; margin: 50px auto;">
      <h2 style="font-family: 'Montserrat'; font-size: 1.8rem; text-align: center; margin-bottom: 2rem;">Perguntas Frequentes</h2>
      <div>
        ${faq.map((item, idx) => `
        <details class="resp-faq-item" ${idx === 0 ? 'open' : ''}>
          <summary class="resp-faq-q">
            <span>${item.pergunta}</span>
            <span>+</span>
          </summary>
          <p class="resp-faq-a">${item.resposta}</p>
        </details>
        `).join('')}
      </div>
    </section>

    <footer>
      <p>© ${new Date().getFullYear()} ${profile.nome} · ${profile.endereco} · ${profile.cidade}</p>
    </footer>
  </div>

  <a href="${waUrl}" target="_blank" class="wa-float">Falar no WhatsApp</a>

</body>
</html>`;
}

// -------------------------------------------------------------------------------------------------
// ARQUITETURA 6: MODERNO CLEAN SPLIT (Layout Clássico & Fluido)
// -------------------------------------------------------------------------------------------------
function compileModernoSite(profile, nicheInfo, customOverrides = {}) {
  const cleanPhone = profile.cleanPhone || '5511999999999';
  const waUrl = `https://wa.me/${cleanPhone}?text=${profile.waMensagem}`;
  const heroImage = customOverrides.heroImage || profile.imagens.hero;
  const sobreImage = customOverrides.sobreImage || profile.imagens.sobre;
  const headline = customOverrides.headline || profile.headline;
  const subheadline = customOverrides.subheadline || profile.subheadline;
  const services = customOverrides.servicos || profile.servicos;
  const stats = profile.stats;
  const diferenciais = profile.diferenciais;
  const reviews = profile.reviews;
  const faq = profile.faq;

  return `<!DOCTYPE html>
<html lang="pt-BR" class="scroll-smooth">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${profile.nome} | ${profile.cidade}</title>
  <meta name="description" content="${profile.subheadline.slice(0, 160)}">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg: #ffffff;
      --surface: #f8fafc;
      --text: #0f172a;
      --muted: #64748b;
      --primary: #2563eb;
      --border: #e2e8f0;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Plus Jakarta Sans', system-ui, sans-serif; background: var(--bg); color: var(--text); line-height: 1.6; }
    .container { max-width: 1160px; margin: 0 auto; padding: 0 1.5rem; }

    .nav-bar { padding: 20px 0; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border); }
    .nav-logo { font-weight: 800; font-size: 1.15rem; color: #0f172a; }
    .nav-btn { background: var(--primary); color: #fff; padding: 9px 20px; border-radius: 999px; font-weight: 700; text-decoration: none; font-size: 0.88rem; }

    .hero-split { display: grid; grid-template-columns: 1.1fr 0.9fr; gap: 3rem; align-items: center; padding: 50px 0 60px 0; }
    @media(max-width: 850px) { .hero-split { grid-template-columns: 1fr; } }
    .hero-h1 { font-size: clamp(2.2rem, 4.4vw, 3.5rem); font-weight: 800; line-height: 1.15; margin-bottom: 1.25rem; letter-spacing: -0.02em; }
    .hero-p { font-size: 1.1rem; color: var(--muted); margin-bottom: 2rem; }
    .hero-img { width: 100%; height: 420px; object-fit: cover; border-radius: 20px; box-shadow: 0 20px 40px rgba(0,0,0,0.08); }

    /* Stats */
    .mod-stats { padding: 35px 0; border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); margin: 30px 0; }
    .mod-stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1.5rem; text-align: center; }
    @media(max-width: 768px) { .mod-stats-grid { grid-template-columns: repeat(2, 1fr); } }
    .mod-stat-num { font-size: 2.2rem; font-weight: 800; color: var(--primary); }
    .mod-stat-lbl { font-size: 0.8rem; color: var(--muted); text-transform: uppercase; font-weight: 700; }

    .cards-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1.5rem; margin: 40px 0; }
    .card-item { background: var(--surface); border: 1px solid var(--border); border-radius: 16px; padding: 24px; }
    .card-h3 { font-size: 1.2rem; font-weight: 700; margin-bottom: 6px; }
    .card-p { font-size: 0.92rem; color: var(--muted); margin-bottom: 1.25rem; }
    .card-link { color: var(--primary); font-weight: 700; text-decoration: none; font-size: 0.88rem; }

    /* Reviews */
    .mod-rev-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1.5rem; margin: 30px 0; }
    .mod-rev-card { background: var(--surface); border: 1px solid var(--border); border-radius: 14px; padding: 22px; }

    /* FAQ */
    .mod-faq-item { background: var(--surface); border: 1px solid var(--border); border-radius: 12px; padding: 16px 20px; margin-bottom: 10px; cursor: pointer; }
    .mod-faq-item[open] { border-color: var(--primary); background: #ffffff; }
    .mod-faq-q { font-weight: 700; font-size: 1rem; list-style: none; display: flex; justify-content: space-between; }
    .mod-faq-a { color: var(--muted); font-size: 0.94rem; margin-top: 8px; }

    footer { padding: 40px 0; text-align: center; color: var(--muted); font-size: 0.85rem; border-top: 1px solid var(--border); }
    .wa-float { position: fixed; bottom: 24px; right: 24px; z-index: 999; background: #22c55e; color: #fff; padding: 12px 22px; border-radius: 999px; font-weight: 700; text-decoration: none; box-shadow: 0 10px 25px rgba(34, 197, 94, 0.4); }
  </style>
</head>
<body>

  <div class="container">
    <header class="nav-bar">
      <div class="nav-logo">${profile.nome}</div>
      <a href="${waUrl}" target="_blank" class="nav-btn">WhatsApp Direto</a>
    </header>

    <section class="hero-split">
      <div>
        <div style="font-weight: 700; color: var(--primary); font-size: 0.85rem; margin-bottom: 0.75rem;">★ ${profile.nota} no Google Maps · ${profile.cidade}</div>
        <h1 class="hero-h1">${headline}</h1>
        <p class="hero-p">${subheadline}</p>
        <a href="${waUrl}" target="_blank" class="nav-btn" style="padding: 15px 30px; font-size: 1rem; display: inline-block;">Falar no WhatsApp →</a>
      </div>
      <div>
        <img src="${heroImage}" alt="${profile.nome}" class="hero-img">
      </div>
    </section>

    <!-- 1. Stats -->
    <div class="mod-stats">
      <div class="mod-stats-grid">
        ${stats.map(st => `
        <div>
          <div class="mod-stat-num">${st.valor}</div>
          <div class="mod-stat-lbl">${st.rotulo}</div>
        </div>
        `).join('')}
      </div>
    </div>

    <!-- 2. Services -->
    <section>
      <h2 style="font-size: 1.8rem; font-weight: 800; margin-bottom: 0.5rem;">Nossas Soluções</h2>
      <p style="color: var(--muted);">Serviços dedicados com atendimento de ponta em ${profile.cidade}.</p>
      <div class="cards-grid">
        ${services.map(s => `
        <div class="card-item">
          ${s.tag ? `<div style="font-size: 0.74rem; font-weight: 700; color: var(--primary); text-transform: uppercase; margin-bottom: 4px;">${s.tag}</div>` : ''}
          <h3 class="card-h3">${s.titulo}</h3>
          <p class="card-p">${s.desc}</p>
          <a href="https://wa.me/${cleanPhone}?text=${encodeURIComponent(`Olá! Vim pelo site da ${profile.nome} e gostaria de informações sobre ${s.titulo}.`)}" target="_blank" class="card-link">Saber Mais no WhatsApp →</a>
        </div>
        `).join('')}
      </div>
    </section>

    <!-- 3. Reviews -->
    <section style="margin: 50px 0;">
      <h2 style="font-size: 1.8rem; font-weight: 800; margin-bottom: 1rem;">O Que Nossos Clientes Dizem</h2>
      <div class="mod-rev-grid">
        ${reviews.map(r => `
        <div class="mod-rev-card">
          <div style="color: #f59e0b; margin-bottom: 6px;">★★★★★</div>
          <p style="font-style: italic; color: #334155; font-size: 0.94rem; margin-bottom: 1rem;">"${r.texto}"</p>
          <div style="font-size: 0.85rem; font-weight: 700; color: var(--text);">— ${r.autor}</div>
        </div>
        `).join('')}
      </div>
    </section>

    <!-- 4. FAQ -->
    <section style="max-width: 800px; margin: 50px auto;">
      <h2 style="font-size: 1.8rem; font-weight: 800; text-align: center; margin-bottom: 2rem;">Perguntas Frequentes</h2>
      <div>
        ${faq.map((item, idx) => `
        <details class="mod-faq-item" ${idx === 0 ? 'open' : ''}>
          <summary class="mod-faq-q">
            <span>${item.pergunta}</span>
            <span>+</span>
          </summary>
          <p class="mod-faq-a">${item.resposta}</p>
        </details>
        `).join('')}
      </div>
    </section>

    <footer>
      <p>© ${new Date().getFullYear()} ${profile.nome} · ${profile.endereco} · ${profile.cidade}</p>
    </footer>
  </div>

  <a href="${waUrl}" target="_blank" class="wa-float">Falar no WhatsApp</a>

</body>
</html>`;
}

// -------------------------------------------------------------------------------------------------
// ARQUITETURA ESPECIALIZADA: CARDÁPIO DIGITAL DE DEMONSTRAÇÃO (Hamburgueria / Food Truck / Lanchonete)
// -------------------------------------------------------------------------------------------------
export function compileHamburgueriaCardapio(profile, nicheInfo, customOverrides = {}) {
  const cleanPhone = profile.cleanPhone || '5511999999999';
  const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(`Olá! Vim pelo Cardápio Digital da ${profile.nome} e gostaria de fazer um pedido.`)}`;
  const endereco = profile.endereco || `${profile.cidade}, Brasil`;
  const nota = profile.nota || '4.8';
  const reviews = profile.reviewsCount || '120+';

  const menuItems = [
    {
      id: 'smash-bacon',
      categoria: 'burgers',
      badge: 'MAIS PEDIDO 🏆',
      titulo: 'Classic Smash Duplo Bacon',
      desc: '2x blends smash 90g com crostinha crocante na chapa, queijo cheddar cremoso derretido, fatias de bacon artesanal crocante e maionese especial da casa em pão brioche selado na manteiga.',
      preco: 'R$ 32,90',
      foto: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'cheddar-melt',
      categoria: 'burgers',
      badge: 'FAVORITO DA CASA 🔥',
      titulo: 'Cheddar Melt Supreme (180g)',
      desc: 'Blend bovino nobre 180g grelhado ao ponto no fogo, avalanche de creme cheddar artesanal, cebola caramelizada lentamente e cubinhos crocantes de bacon em pão australiano.',
      preco: 'R$ 36,90',
      foto: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'monster-burger',
      categoria: 'burgers',
      badge: 'FOME MONSTRO 🍔',
      titulo: `Monster ${profile.nome || 'Burguer'} (300g)`,
      desc: '2 blends de 150g (300g de pura carne), queijo prato duplo, fatias de bacon, ovo na chapa, alface americana fresca, tomate maduro e molho especial secreto.',
      preco: 'R$ 42,90',
      foto: 'https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'barbecue-crunch',
      categoria: 'burgers',
      badge: 'CROCANTE 🧅',
      titulo: 'Smash Barbecue Crunch',
      desc: 'Blend 160g suculento, queijo cheddar, anéis de cebola empanados crocantes por dentro do lanche, molho barbecue artesanal defumado e tiras de bacon.',
      preco: 'R$ 34,90',
      foto: 'https://images.unsplash.com/photo-1561758033-d89a9ad46330?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'combo-casal',
      categoria: 'combos',
      badge: 'COMBO CASAL 💥',
      titulo: 'Combo 2x Smash + Batata G + 2 Refris',
      desc: '2 burgers artesanais à escolha + 1 batata rústica farta para compartilhar + 2 refrigerantes latas geladinhos.',
      preco: 'R$ 74,90',
      foto: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'combo-individual',
      categoria: 'combos',
      badge: 'COMBO INDIVIDUAL',
      titulo: 'Combo Smash + Batata Individual + Refri',
      desc: '1 burger smash à escolha + 1 porção de batata individual crocante + 1 refrigerante lata.',
      preco: 'R$ 44,90',
      foto: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'batata-cheddar-bacon',
      categoria: 'porcoes',
      badge: 'PORÇÃO SUPREMA 🍟',
      titulo: 'Batata Rústica com Cheddar & Bacon (400g)',
      desc: 'Batatas com corte rústico temperadas com páprica defumada e alecrim fresco, piscina de creme cheddar artesanal e farofa crocante de bacon.',
      preco: 'R$ 28,90',
      foto: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'nuggets-artesanais',
      categoria: 'porcoes',
      badge: 'CROCANTE DOURADO',
      titulo: 'Nuggets Artesanais de Frango (10 unid)',
      desc: 'Feitos com 100% peito de frango temperado e empanados em farinha panko crocante. Acompanha maionese verde da casa e molho barbecue.',
      preco: 'R$ 24,90',
      foto: 'https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'milkshake-nutella',
      categoria: 'bebidas',
      badge: 'SOBREMESA 🥤',
      titulo: 'Milkshake de Nutella com Ninho (400ml)',
      desc: 'Sorvete artesanal de baunilha batido com Nutella pura, calda generosa no copo e finalizado com leite Ninho em pó.',
      preco: 'R$ 21,90',
      foto: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'refrigerantes-sucos',
      categoria: 'bebidas',
      badge: 'GELADINHO 🧊',
      titulo: 'Refrigerantes Lata 350ml & Sucos Naturais',
      desc: 'Coca-Cola (Normal ou Zero), Guaraná Antarctica, Fanta Laranja ou Suco Natural de Laranja espremido na hora.',
      preco: 'R$ 6,90',
      foto: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=800&q=80'
    }
  ];

  return `<!DOCTYPE html>
<html lang="pt-BR" class="scroll-smooth">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Cardápio Digital Oficial | ${profile.nome} - Peça Online</title>
  <meta name="description" content="Cardápio digital oficial da ${profile.nome}. Hambúrgueres artesanais, combos e porções com entrega rápida em ${profile.cidade}. Peça pelo WhatsApp!">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&family=Bricolage+Grotesque:opsz,wght@12..96,700;12..96,800;12..96,900&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg: #090a0f;
      --card-bg: #13151f;
      --card-border: rgba(255, 255, 255, 0.08);
      --primary: #f59e0b;
      --primary-hover: #d97706;
      --accent: #ff4757;
      --green: #22c55e;
      --text: #f8fafc;
      --muted: #94a3b8;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
      background: var(--bg);
      color: var(--text);
      line-height: 1.5;
      padding-bottom: 90px;
    }
    .container { max-width: 1140px; margin: 0 auto; padding: 0 1rem; }
    .font-brand { font-family: 'Bricolage Grotesque', sans-serif; }

    /* Sticky Header */
    .header-bar {
      position: sticky; top: 0; z-index: 100;
      background: rgba(9, 10, 15, 0.95);
      backdrop-filter: blur(16px);
      border-bottom: 1px solid var(--card-border);
      padding: 12px 0;
    }
    .header-inner { display: flex; align-items: center; justify-content: space-between; }
    .brand-logo-wrap { display: flex; align-items: center; gap: 10px; }
    .brand-emoji { font-size: 1.6rem; }
    .brand-name { font-size: 1.2rem; font-weight: 900; letter-spacing: -0.02em; color: #fff; }
    .status-badge {
      display: inline-flex; align-items: center; gap: 6px;
      background: rgba(34, 197, 94, 0.15); border: 1px solid rgba(34, 197, 94, 0.3);
      color: #4ade80; font-size: 0.76rem; font-weight: 700;
      padding: 4px 10px; border-radius: 999px;
    }
    .status-dot { width: 7px; height: 7px; border-radius: 50%; background: #22c55e; box-shadow: 0 0 8px #22c55e; }

    /* Hero Banner */
    .hero-banner {
      background: linear-gradient(180deg, rgba(245, 158, 11, 0.1) 0%, rgba(9, 10, 15, 0) 100%);
      padding: 30px 0 20px 0; text-align: center;
    }
    .hero-h1 { font-size: clamp(1.8rem, 4vw, 2.8rem); font-weight: 900; line-height: 1.15; margin-bottom: 8px; }
    .hero-p { color: var(--muted); font-size: 0.95rem; max-width: 600px; margin: 0 auto 16px auto; }
    .highlight-pill { color: var(--primary); font-weight: 700; }
    .meta-badges { display: flex; flex-wrap: wrap; justify-content: center; gap: 10px; margin-top: 14px; }
    .badge-pill {
      background: var(--card-bg); border: 1px solid var(--card-border);
      padding: 6px 14px; border-radius: 999px; font-size: 0.8rem; font-weight: 600;
    }

    /* Category Nav */
    .cat-nav {
      position: sticky; top: 61px; z-index: 90;
      background: var(--bg);
      padding: 12px 0;
      display: flex; gap: 8px; overflow-x: auto;
      scrollbar-width: none;
      margin-bottom: 20px;
      border-bottom: 1px solid rgba(255,255,255,0.05);
    }
    .cat-nav::-webkit-scrollbar { display: none; }
    .cat-btn {
      background: var(--card-bg); border: 1px solid var(--card-border);
      color: var(--muted); font-size: 0.84rem; font-weight: 700;
      padding: 8px 16px; border-radius: 999px; white-space: nowrap;
      cursor: pointer; transition: all 0.2s;
    }
    .cat-btn.active, .cat-btn:hover {
      background: var(--primary); color: #000; border-color: var(--primary);
    }

    /* Menu Cards Grid */
    .menu-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 16px; margin-bottom: 40px;
    }
    .menu-card {
      background: var(--card-bg);
      border: 1px solid var(--card-border);
      border-radius: 18px;
      overflow: hidden;
      display: flex; flex-direction: column;
      transition: transform 0.2s, border-color 0.2s;
    }
    .menu-card:hover {
      transform: translateY(-3px);
      border-color: rgba(245, 158, 11, 0.4);
    }
    .card-thumb-wrap { position: relative; width: 100%; height: 180px; overflow: hidden; }
    .card-thumb { width: 100%; height: 100%; object-fit: cover; transition: transform 0.3s; }
    .menu-card:hover .card-thumb { transform: scale(1.05); }
    .card-badge {
      position: absolute; top: 10px; left: 10px;
      background: rgba(0, 0, 0, 0.85); backdrop-filter: blur(8px);
      border: 1px solid rgba(245, 158, 11, 0.4);
      color: var(--primary); font-size: 0.7rem; font-weight: 800;
      padding: 4px 10px; border-radius: 8px;
    }
    .card-body { padding: 16px; flex: 1; display: flex; flex-direction: column; justify-content: space-between; }
    .card-title { font-size: 1.15rem; font-weight: 800; margin-bottom: 6px; color: #fff; }
    .card-desc { font-size: 0.84rem; color: var(--muted); line-height: 1.5; margin-bottom: 16px; }
    .card-footer { display: flex; align-items: center; justify-content: space-between; margin-top: auto; }
    .card-price { font-size: 1.25rem; font-weight: 900; color: #fff; }
    .btn-item-pedir {
      background: var(--primary); color: #000;
      font-weight: 800; font-size: 0.82rem;
      padding: 8px 16px; border-radius: 10px;
      text-decoration: none; display: inline-flex; align-items: center; gap: 6px;
      transition: background 0.2s;
    }
    .btn-item-pedir:hover { background: var(--primary-hover); }

    /* Google Maps Social Proof */
    .maps-section {
      background: #10121a; border: 1px solid var(--card-border);
      border-radius: 20px; padding: 24px; margin: 30px 0;
    }
    .maps-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 18px; flex-wrap: wrap; gap: 10px; }
    .reviews-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 14px; }
    .review-card {
      background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.05);
      border-radius: 14px; padding: 16px;
    }
    .rev-stars { color: #fbbf24; font-size: 0.95rem; margin-bottom: 6px; }
    .rev-text { font-size: 0.85rem; color: #cbd5e1; font-style: italic; line-height: 1.45; margin-bottom: 8px; }
    .rev-author { font-size: 0.78rem; font-weight: 700; color: var(--muted); }

    /* Info Bar */
    .info-bar {
      display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 16px; margin-top: 30px;
    }
    .info-item {
      background: var(--card-bg); border: 1px solid var(--card-border);
      padding: 16px; border-radius: 14px;
    }
    .info-item h4 { font-size: 0.9rem; font-weight: 800; color: #fff; margin-bottom: 4px; }
    .info-item p { font-size: 0.82rem; color: var(--muted); }

    /* Sticky Bottom WhatsApp Order Bar */
    .wa-dock {
      position: fixed; bottom: 0; left: 0; right: 0; z-index: 999;
      background: rgba(18, 20, 29, 0.96); backdrop-filter: blur(16px);
      border-top: 1px solid var(--card-border);
      padding: 12px 1rem;
      display: flex; align-items: center; justify-content: space-between;
      box-shadow: 0 -8px 25px rgba(0,0,0,0.5);
      text-decoration: none; color: #fff;
    }
    .wa-dock-info { display: flex; align-items: center; gap: 10px; font-weight: 700; font-size: 0.9rem; }
    .wa-dock-btn {
      background: var(--green); color: #fff; font-weight: 800; font-size: 0.88rem;
      padding: 10px 20px; border-radius: 12px; display: inline-flex; align-items: center; gap: 8px;
    }
  </style>
</head>
<body>

  <!-- Sticky Top Header -->
  <header class="header-bar">
    <div class="container header-inner">
      <div class="brand-logo-wrap">
        <span class="brand-emoji">🍔</span>
        <div>
          <div class="brand-name font-brand">${profile.nome}</div>
          <div style="font-size: 0.72rem; color: var(--muted);">Cardápio Digital Oficial · ${profile.cidade}</div>
        </div>
      </div>
      <div class="status-badge">
        <span class="status-dot"></span>
        <span>Aberto Agora</span>
      </div>
    </div>
  </header>

  <!-- Hero Section -->
  <section class="hero-banner">
    <div class="container">
      <h1 class="hero-h1 font-brand">Burgers Artesanais & Batata Crocante</h1>
      <p class="hero-p">Feitos na chapa quente com <span class="highlight-pill">blends 100% bovinos frescos</span> e entregues na sua porta em ${profile.cidade}.</p>
      <div class="meta-badges">
        <div class="badge-pill">★ ${nota} no Google Maps (${reviews} avaliações)</div>
        <div class="badge-pill">🛵 Entrega Rápida</div>
        <div class="badge-pill">💳 Pix e Cartões</div>
      </div>
    </div>
  </section>

  <!-- Menu Section -->
  <section id="cardapio">
    <div class="container">
      
      <!-- Category Tabs -->
      <div class="cat-nav">
        <button class="cat-btn active" onclick="filterCategory('todos', this)">🍔 Todos os Itens</button>
        <button class="cat-btn" onclick="filterCategory('burgers', this)">🔥 Burgers Artesanais</button>
        <button class="cat-btn" onclick="filterCategory('combos', this)">💥 Combos Especiais</button>
        <button class="cat-btn" onclick="filterCategory('porcoes', this)">🍟 Porções</button>
        <button class="cat-btn" onclick="filterCategory('bebidas', this)">🥤 Bebidas & Shakes</button>
      </div>

      <!-- Menu Grid -->
      <div class="menu-grid" id="menuGrid">
        ${menuItems.map(item => `
        <div class="menu-card" data-category="${item.categoria}">
          <div class="card-thumb-wrap">
            <img src="${item.foto}" alt="${item.titulo}" class="card-thumb">
            <span class="card-badge">${item.badge}</span>
          </div>
          <div class="card-body">
            <div>
              <h3 class="card-title font-brand">${item.titulo}</h3>
              <p class="card-desc">${item.desc}</p>
            </div>
            <div class="card-footer">
              <span class="card-price font-brand">${item.preco}</span>
              <a href="https://wa.me/${cleanPhone}?text=${encodeURIComponent(`Olá! Gostaria de pedir o ${item.titulo} (${item.preco}) na ${profile.nome}.`)}" target="_blank" class="btn-item-pedir">
                Pedir no WhatsApp ➔
              </a>
            </div>
          </div>
        </div>
        `).join('')}
      </div>

      <!-- Google Maps Social Proof -->
      <div class="maps-section">
        <div class="maps-header">
          <div>
            <h3 class="font-brand" style="font-size: 1.4rem; color: #fff;">O que dizem nossos clientes no Google Maps</h3>
            <p style="color: var(--muted); font-size: 0.88rem;">Avaliações reais comprovadas da comunidade de ${profile.cidade}</p>
          </div>
          <div style="background: rgba(245, 158, 11, 0.15); border: 1px solid rgba(245, 158, 11, 0.3); padding: 8px 18px; border-radius: 999px; color: #fbbf24; font-weight: 800; font-size: 0.95rem;">
            ★ ${nota} / 5.0 (${reviews} avaliações)
          </div>
        </div>

        <div class="reviews-grid">
          <div class="review-card">
            <div class="rev-stars">★★★★★</div>
            <p class="rev-text">"O melhor hambúrguer da região sem dúvida! A carne é super suculenta, o pão é macio e a batata rústica com cheddar é surreal."</p>
            <span class="rev-author">— Lucas M., cliente de ${profile.cidade}</span>
          </div>
          <div class="review-card">
            <div class="rev-stars">★★★★★</div>
            <p class="rev-text">"Entrega muito rápida, chegou quentinho e com uma apresentação impecável. O combo casal vale muito a pena!"</p>
            <span class="rev-author">— Juliana R., cliente de ${profile.cidade}</span>
          </div>
          <div class="review-card">
            <div class="rev-stars">★★★★★</div>
            <p class="rev-text">"Atendimento excelente no WhatsApp. Dá pra pedir em 1 minuto sem complicação. Nota 10!"</p>
            <span class="rev-author">— Rodrigo S., cliente de ${profile.cidade}</span>
          </div>
        </div>
      </div>

      <!-- Info & Hours -->
      <div class="info-bar">
        <div class="info-item">
          <h4>📍 Localização</h4>
          <p>${endereco}</p>
        </div>
        <div class="info-item">
          <h4>⏰ Horário de Atendimento</h4>
          <p>Terça a Domingo: 18:00 às 23:30</p>
        </div>
        <div class="info-item">
          <h4>🛵 Entrega Expressa</h4>
          <p>Receba em média em 35 a 45 min</p>
        </div>
      </div>

      <footer style="text-align: center; color: var(--muted); font-size: 0.82rem; padding: 20px 0;">
        <p>© ${new Date().getFullYear()} ${profile.nome} · Todos os direitos reservados · Cardápio Digital Interativo</p>
      </footer>

    </div>
  </section>

  <!-- Sticky Bottom Order Bar -->
  <a href="${waUrl}" target="_blank" class="wa-dock">
    <div class="wa-dock-info">
      <span>🍔</span>
      <span>Fazer Pedido no WhatsApp com Entrega Rápida</span>
    </div>
    <span class="wa-dock-btn font-brand">PEDIR AGORA ➔</span>
  </a>

  <script>
    function filterCategory(cat, btn) {
      document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cards = document.querySelectorAll('.menu-card');
      cards.forEach(c => {
        if (cat === 'todos' || c.getAttribute('data-category') === cat) {
          c.style.display = 'flex';
        } else {
          c.style.display = 'none';
        }
      });
    }
  </script>

</body>
</html>`;
}

// -------------------------------------------------------------------------------------------------
// DISPACHADOR CENTRAL MULTI-SKILL
// -------------------------------------------------------------------------------------------------
export function compileSiteHtml(lead, creativeDirection = 'auto', customOverrides = {}) {
  const profile = buildBusinessProfile(lead);
  const nicheInfo = resolveNicheProfile(lead.nicho || '', lead.nome || '');

  // VERIFICAÇÃO PRIORITÁRIA POR ARQUÉTIPO DO NEGÓCIO
  const n = `${lead.nicho || ''} ${lead.nome || ''}`.toLowerCase();
  const archetype = lead.siteData?.archetypeKey || '';

  if (
    archetype === 'cardapio_hamburgueria' ||
    n.includes('burger') ||
    n.includes('hamburguer') ||
    n.includes('lanche') ||
    n.includes('food truck') ||
    n.includes('snack') ||
    n.includes('pit dog') ||
    n.includes('trailer')
  ) {
    return compileHamburgueriaCardapio(profile, nicheInfo, customOverrides);
  }

  let direction = creativeDirection;
  if (!direction || direction === 'auto') {
    direction = resolveBestSkillForNiche(lead.nicho || '', lead.nome || '');
  }

  switch (direction) {
    case 'frontend_design':
      return compileFrontendDesignSite(profile, nicheInfo, customOverrides);
    case 'ui_ux_pro_max':
    case 'tech_glassmorphism':
      return compileUiUxProMaxSite(profile, nicheInfo, customOverrides);
    case 'redesign_premium':
    case 'premium_luxury':
      return compileRedesignPremiumSite(profile, nicheInfo, customOverrides);
    case 'minimalista':
    case 'minimalista_editorial':
    case 'sofisticado_editorial':
      return compileMinimalEditorialSite(profile, nicheInfo, customOverrides);
    case 'vendas_agressivo':
    case 'alta_conversao':
      return compileDirectResponseSite(profile, nicheInfo, customOverrides);
    case 'moderno':
    default:
      return compileModernoSite(profile, nicheInfo, customOverrides);
  }
}
