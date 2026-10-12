/**
 * sitePromptBuilder.js
 * Gerador de Prompts Estratégicos Baseados no Framework Oficial FRONTEND-DESIGN (Anthropic)
 * - Transforma a criação de sites em um processo de Design Studio de Elite
 * - Elimina os 5 vícios de IA genérica (sem cartões repetidos, sem ALL-CAPS genéricos, sem números falsos)
 * - Princípio "Gaste a Ousadia em UM Lugar" (Spend Boldness in One Place com Showstopper Element)
 * - Análise profunda do negócio (Nicho, Cidade, Nome, Avaliações e Prova Social do Maps)
 * - Paletas com tokens nomeados de alto contraste e tipografia intencional (<80 caracteres por linha)
 */

export const FRONTEND_DESIGN_SYSTEM_PROMPT = `Você é o Design Lead em um estúdio de design e engenharia web de elite, operando sob a metodologia e as diretrizes oficiais da skill FRONTEND-DESIGN da Anthropic.

Seu compromisso inegociável é criar websites autorais, com identidade visual única e inconfundível, que NUNCA pareçam modelos prontos de IA ou templates genéricos. O cliente paga alto (R$ 800 a R$ 1.500+) justamente por uma visão de design sofisticada, intencional e focada no mundo real do negócio.

DIRETRIZES FUNDAMENTAIS DO FRONTEND-DESIGN (PADRÃO ANTHROPIC):
1. ANCORE O DESIGN NO TEMA E CONTEXTO REAL:
   - A estética deve nascer diretamente do nicho, dos materiais reais e da reputação local (Google Maps: nota, avaliações e cidade).
   - O Hero deve abrir com o elemento mais característico daquele nicho (uma composição marcante, uma prova social autêntica ou um gancho de ação direta).

2. ELIMINE TERMINANTEMENTE OS 5 VÍCIOS DE IA GENÉRICA (ANTI-AI TELLS):
   - 🚫 NUNCA use o "Kit Cartão SaaS": NÃO fatie a página inteira em cartões brancos com o mesmo raio de borda e sombra cinza suave (rgba(0,0,0,0.1)). Varie a estrutura: use faixas com fundos alternados, grids assimétricos, listas editoriais elegantes e seções de texto amplo.
   - 🚫 NUNCA use rótulos desnecessários em CAIXA ALTA (ALL-CAPS) com tracking espaçado acima de cada título.
   - 🚫 NUNCA coloque marcadores numerados falsos (01 / 02 / 03) a menos que o conteúdo seja uma sequência ou processo cronológico real.
   - 🚫 NUNCA destaque apenas uma palavra aleatória em itálico ou cor diferente nos títulos.
   - 🚫 NUNCA adicione setas genéricas ("→") ao final de todo botão ou link sem propósito de navegação.

3. GASTE A OUSADIA EM UM LUGAR (SPEND BOLDNESS IN ONE PLACE):
   - Crie UM elemento memorável que rouba a cena e é o coração visual do site (ex: simulador interativo, vitrine de especialidades, comparativo antes/depois, cardápio visual assinado).
   - Mantenha todo o restante disciplinado, elegante, com espaçamento generoso e tipografia hierarquizada.

4. TIPOGRAFIA INTENCIONAL:
   - Limite de comprimento de linha inferior a 80 caracteres para leitura confortável.
   - Use no máximo 2 famílias tipográficas distintas, com papéis e pesos claros.

5. COPYWRITING ATIVO E HUMANO (PT-BR):
   - 100% em Português do Brasil (PT-BR), tom conversacional, voz ativa, em 'sentence case' e com verbos de ação claros.
   - Zero clichês ou frases vazias ("soluções sob medida", "a melhor qualidade").

6. REGRAS TÉCNICAS E SAÍDA:
   - Retorne APENAS o código HTML completo e autônomo (iniciando com <!DOCTYPE html> e finalizando com </html>) com Tailwind CSS via CDN e fontes Google Fonts.
   - O código deve ser estruturado e conciso (máximo 8.000 caracteres), priorizando Header, Hero impactante com CTA, Showstopper de diferencial, Prova Social do Maps e Rodapé com Botão de WhatsApp.
   - NUNCA exceda o limite de tokens nem deixe o código cortado. Finalize sempre com </body></html>.
   - Sem explicações, introduções ou blocos de markdown adicionais.`;

export function resolveNicheDesignConfig(nicho = '', creativeDirection = 'frontend_design') {
  const n = (nicho || '').toLowerCase();

  // 1. Definição do Nicho e Paletas Base
  let config = {
    nicheCategory: 'Serviços Profissionais',
    accentColor: '#4f46e5', // Indigo
    primaryColor: '#0f172a', // Slate Dark
    bgColor: '#fcfbf9',      // Off-white aconchegante
    surfaceColor: '#ffffff',
    textColor: '#0f172a',
    mutedColor: '#52525b',
    heroImage: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
    secondaryImage: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80',
    fontHeadline: 'Plus Jakarta Sans',
    fontBody: 'Inter',
    vibe: 'Studio Frontend Design (Anthropic) — Layout Autoral, Sem Templates e Alta Conversão',
    showstopperElement: 'Matriz Interativa de Diagnóstico e Atendimento sem Intermediários',
    suggestedSections: ['Hero com Prova Social do Maps', 'Showstopper: Matriz de Atendimento', 'Diferenciais de Mercado', 'Depoimentos Verificados', 'FAQ Direto', 'CTA WhatsApp']
  };

  if (n.includes('academia') || n.includes('fitness') || n.includes('crossfit') || n.includes('treino') || n.includes('personal') || n.includes('luta') || n.includes('pilates')) {
    config.nicheCategory = 'Fitness & Alta Performance';
    config.accentColor = '#f43f5e'; // Rose vibrante
    config.primaryColor = '#09090b'; // Dark Zinc
    config.bgColor = '#09090b';
    config.surfaceColor = '#141417';
    config.textColor = '#f4f4f5';
    config.mutedColor = '#a1a1aa';
    config.heroImage = 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1200&q=80';
    config.secondaryImage = 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80';
    config.fontHeadline = 'Oswald';
    config.fontBody = 'Inter';
    config.vibe = 'Alta Energia, Foco em Transformação e Performance Sem Clichês';
    config.showstopperElement = 'Simulador Visual de Modalidades & Agendamento de Treino Experimental em 1 Clique';
    config.suggestedSections = ['Hero Dinâmico com Nota do Maps', 'Showstopper: Seletor de Modalidades e Metas', 'Estrutura & Equipamentos em Foco', 'Tabela Clara de Planos sem Letras Miúdas', 'Transformações de Alunos', 'FAQ Sem Rodeios', 'Matrícula Rápida no WhatsApp'];
  } else if (n.includes('médic') || n.includes('cirurgi') || n.includes('dentis') || n.includes('odonto') || n.includes('saúde') || n.includes('clínic') || n.includes('psicolog') || n.includes('fisiot') || n.includes('oftalmo')) {
    config.nicheCategory = 'Saúde & Medicina Especializada';
    config.accentColor = '#0284c7'; // Sky Blue profissional
    config.primaryColor = '#0f172a';
    config.bgColor = '#f8fafc';
    config.surfaceColor = '#ffffff';
    config.textColor = '#0f172a';
    config.mutedColor = '#64748b';
    config.heroImage = 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=1200&q=80';
    config.secondaryImage = 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80';
    config.fontHeadline = 'Plus Jakarta Sans';
    config.fontBody = 'Inter';
    config.vibe = 'Acolhimento Clínico, Humanização e Confiança Médica Padrão Ouro';
    config.showstopperElement = 'Quadro de Corpo Clínico com Credenciais e Agendamento Direto de Consulta';
    config.suggestedSections = ['Hero Humanizado com Prova Social e Selo de Especialidade', 'Tratamentos Principais com Linguagem Clara', 'Showstopper: Equipe Médica e Segurança do Paciente', 'Avaliações Reais de Pacientes no Google', 'Dúvidas Frequentes sobre Convênio e Agendamento', 'Agendamento Prioritário via WhatsApp'];
  } else if (n.includes('hamburguer') || n.includes('pizza') || n.includes('comida') || n.includes('gastronomia') || n.includes('restaurante') || n.includes('doce') || n.includes('bolo') || n.includes('confeitaria') || n.includes('padaria') || n.includes('café') || n.includes('bar')) {
    config.nicheCategory = 'Gastronomia & Restaurantes';
    config.accentColor = '#ea580c'; // Warm Orange apetitoso
    config.primaryColor = '#1c1917'; // Warm Stone Dark
    config.bgColor = '#fdfbf7';
    config.surfaceColor = '#ffffff';
    config.textColor = '#1c1917';
    config.mutedColor = '#57534e';
    config.heroImage = 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80';
    config.secondaryImage = 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80';
    config.fontHeadline = 'Playfair Display';
    config.fontBody = 'Plus Jakarta Sans';
    config.vibe = 'Experiência Gastronômica Imersiva, Visual Sofisticado e Pedido Imediato';
    config.showstopperElement = 'Vitrine Assinada de Pratos Especiais com Botão "Pedir Agora no WhatsApp"';
    config.suggestedSections = ['Hero Apetitoso com Nota Máxima no Google Maps', 'Showstopper: Pratos Destaque com Ingredientes Selecionados', 'Experiência do Salão e Reserva de Mesas', 'Depoimentos de Clientes Frequentes', 'Localização e Horários de Atendimento', 'Cardápio Completo e Pedido no WhatsApp'];
  } else if (n.includes('carro') || n.includes('automot') || n.includes('detail') || n.includes('oficina') || n.includes('mecânic') || n.includes('funilar') || n.includes('pneu') || n.includes('som automotivo')) {
    config.nicheCategory = 'Automotivo & Estética de Precisão';
    config.accentColor = '#06b6d4'; // Cyan Tech Neon
    config.primaryColor = '#09090b';
    config.bgColor = '#09090b';
    config.surfaceColor = '#141417';
    config.textColor = '#f8fafc';
    config.mutedColor = '#94a3b8';
    config.heroImage = 'https://images.unsplash.com/photo-1607860108855-64acf2078ed9?auto=format&fit=crop&w=1200&q=80';
    config.secondaryImage = 'https://images.unsplash.com/photo-1601362840469-81e4df861614?auto=format&fit=crop&w=800&q=80';
    config.fontHeadline = 'Chakra Petch';
    config.fontBody = 'Inter';
    config.vibe = 'Alta Precisão, Tecnologia Automotiva e Proteção com Garantia';
    config.showstopperElement = 'Comparativo de Proteção Cerâmica e Diagnóstico Mecânico em 30min';
    config.suggestedSections = ['Hero de Alto Impacto com Prova do Google Maps', 'Showstopper: Serviços de Precisão com Selo de Garantia', 'Processo de Trabalho Transparente Passo a Passo', 'Galeria de Veículos e Resultados', 'Avaliações de Clientes no Google', 'Orçamento Rápido pelo WhatsApp'];
  } else if (n.includes('advoc') || n.includes('juríd') || n.includes('direito') || n.includes('tributár') || n.includes('trabalhis') || n.includes('previdenc')) {
    config.nicheCategory = 'Advocacia & Direito';
    config.accentColor = '#b45309'; // Âmbar Dourado Nobre
    config.primaryColor = '#0f172a'; // Deep Navy
    config.bgColor = '#faf9f6';
    config.surfaceColor = '#ffffff';
    config.textColor = '#0f172a';
    config.mutedColor = '#64748b';
    config.heroImage = 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=1200&q=80';
    config.secondaryImage = 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=800&q=80';
    config.fontHeadline = 'Cinzel';
    config.fontBody = 'Plus Jakarta Sans';
    config.vibe = 'Autoridade Jurídica Sóbria, Discrição e Rigor Técnico';
    config.showstopperElement = 'Painel de Áreas de Atuação Especializadas com Análise Prévia de Caso';
    config.suggestedSections = ['Hero com Autoridade, Experiência e Prova de Confiança', 'Showstopper: Áreas de Atuação com Soluções Jurídicas Estratégicas', 'Diferenciais do Escritório e Atendimento Consultivo', 'Corpo Jurídico e Trajetória', 'Perguntas Frequentes Jurídicas', 'Agende uma Consulta Confidencial no WhatsApp'];
  } else if (n.includes('unha') || n.includes('cabelo') || n.includes('salão') || n.includes('maquiagem') || n.includes('sobrancelha') || n.includes('estética') || n.includes('spa') || n.includes('bronze') || n.includes('barbearia')) {
    config.nicheCategory = 'Beleza, Estética & Bem-Estar';
    config.accentColor = '#db2777'; // Rosa Luxury
    config.primaryColor = '#1c1917';
    config.bgColor = '#fdfbf9';
    config.surfaceColor = '#ffffff';
    config.textColor = '#1c1917';
    config.mutedColor = '#78716c';
    config.heroImage = 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1200&q=80';
    config.secondaryImage = 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80';
    config.fontHeadline = 'Playfair Display';
    config.fontBody = 'Inter';
    config.vibe = 'Boutique Sofisticada, Cuidado Pessoal e Transformação Visual';
    config.showstopperElement = 'Catálogo Visual de Procedimentos com Duração e Reserva Imediata de Horário';
    config.suggestedSections = ['Hero Sofisticado com Avaliação 5 Estrelas no Google', 'Showstopper: Menu de Procedimentos Assinados', 'Espaço, Conforto e Biossegurança', 'Depoimentos de Clientes Apaixonadas', 'Localização e Facilidades', 'Reserve seu Horário pelo WhatsApp'];
  } else if (n.includes('imóve') || n.includes('imobiliár') || n.includes('corretor') || n.includes('arquit') || n.includes('constru') || n.includes('engenhar')) {
    config.nicheCategory = 'Imobiliário & Arquitetura';
    config.accentColor = '#2563eb';
    config.primaryColor = '#0f172a';
    config.bgColor = '#ffffff';
    config.surfaceColor = '#f8fafc';
    config.textColor = '#0f172a';
    config.mutedColor = '#64748b';
    config.heroImage = 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80';
    config.secondaryImage = 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80';
    config.fontHeadline = 'Plus Jakarta Sans';
    config.fontBody = 'Inter';
    config.vibe = 'Alto Padrão Imobiliário, Elegância Arquitetônica e Exclusividade';
    config.showstopperElement = 'Curadoria de Imóveis Selecionados com Atendimento por Consultor Sênior';
    config.suggestedSections = ['Hero Imobiliário com Destaque para Oportunidades Únicas', 'Showstopper: Portfólio Exclusivo com Filtros Claros', 'Diferenciais de Negociação e Segurança Jurídica', 'Depoimentos de Compradores e Investidores', 'Fale com um Especialista no WhatsApp'];
  } else if (n.includes('solar') || n.includes('energia') || n.includes('painel')) {
    config.nicheCategory = 'Energia Solar & Sustentabilidade';
    config.accentColor = '#f59e0b'; // Amarelo Solar Dourado
    config.primaryColor = '#0f172a';
    config.bgColor = '#f8fafc';
    config.surfaceColor = '#ffffff';
    config.textColor = '#0f172a';
    config.mutedColor = '#64748b';
    config.heroImage = 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=1200&q=80';
    config.secondaryImage = 'https://images.unsplash.com/photo-1508873696983-2df5293cb395?auto=format&fit=crop&w=800&q=80';
    config.fontHeadline = 'Plus Jakarta Sans';
    config.fontBody = 'Inter';
    config.vibe = 'Economia Real, Engenharia Solar e Retorno sobre Investimento';
    config.showstopperElement = 'Calculadora de Economia com Estimativa de Redução de até 95% na Conta de Luz';
    config.suggestedSections = ['Hero com Economia de até 95% na Conta de Luz', 'Showstopper: Simulador Interativo de Economia', 'Como Funciona a Instalação Passo a Passo', 'Projetos Concluídos na Região', 'Simule pelo WhatsApp'];
  }

  // 2. Adaptação com base na Direção Criativa Escolhida
  switch (creativeDirection) {
    case 'frontend_design':
      // Aplica o padrão Anthropic Frontend Design puro com foco autoral
      config.bgColor = config.bgColor || '#fcfbf9';
      config.surfaceColor = '#ffffff';
      config.textColor = '#0f172a';
      config.mutedColor = '#52525b';
      config.vibe = 'Studio Frontend Design (Anthropic) — Layout Autoral Não-Clichê, Sem Cartões Repetidos e Alta Conversão';
      break;

    case 'premium_luxury':
      config.bgColor = '#090a0f';
      config.surfaceColor = '#12141c';
      config.textColor = '#fdfdfd';
      config.mutedColor = '#94a3b8';
      config.primaryColor = '#d4af37'; // Ouro Champagne
      config.accentColor = '#f59e0b';
      config.fontHeadline = 'Playfair Display';
      config.vibe = 'Dark Luxury & Exclusividade de Alto Ticket';
      break;

    case 'minimalista':
      config.bgColor = '#ffffff';
      config.surfaceColor = '#fcfcfc';
      config.textColor = '#0f172a';
      config.mutedColor = '#64748b';
      config.primaryColor = '#0f172a';
      config.accentColor = '#2563eb';
      config.fontHeadline = 'Inter';
      config.vibe = 'Minimalismo Suíço, Espaço Branco Generoso e Tipografia Precisa';
      break;

    case 'vendas_agressivo':
      config.bgColor = '#fafafa';
      config.surfaceColor = '#ffffff';
      config.textColor = '#0f172a';
      config.mutedColor = '#475569';
      config.primaryColor = '#dc2626'; // Vermelho Ação
      config.accentColor = '#ea580c';
      config.vibe = 'Conversão Máxima, Gatilhos de Prova Social e Urgência';
      break;

    case 'sofisticado_editorial':
      config.bgColor = '#faf7f2';
      config.surfaceColor = '#ffffff';
      config.textColor = '#1c1917';
      config.mutedColor = '#57534e';
      config.primaryColor = '#292524';
      config.accentColor = '#854d0e';
      config.fontHeadline = 'Playfair Display';
      config.vibe = 'Estilo Revista Boutique, Layout Assimétrico e Tipografia Clássica';
      break;

    case 'moderno':
    default:
      // Mantém a configuração base do nicho
      break;
  }

  return config;
}

export const DESIGN_SKILLS_CATALOG = [
  {
    id: 'frontend_design',
    name: 'Anthropic Frontend Design',
    badge: 'Autoral & Anti-AI',
    tag: 'Recomendado',
    desc: 'Layout autoral não-clichê, showstopper memorável, paleta com tokens deliberados e zero cartões repetidos.'
  },
  {
    id: 'ui_ux_pro_max',
    name: 'UI/UX Pro Max',
    badge: 'Design Intelligence',
    tag: 'Tech & Interativo',
    desc: 'Glassmorphism moderno, micro-interações, grid fluido, bento dinâmico e simulador interativo.'
  },
  {
    id: 'redesign_premium',
    name: 'Redesign Premium & Luxo',
    badge: 'Alto Ticket & Ouro',
    tag: 'Clínicas & Luxo',
    desc: 'Autoridade de alto ticket, ouro champagne, medalha do Google Maps em destaque e concierge VIP.'
  },
  {
    id: 'minimalista_editorial',
    name: 'Editorial Boutique & Craft',
    badge: 'Revista & Tipografia',
    tag: 'Boutique & Gastronomia',
    desc: 'Espaço negativo generoso, tipografia serifada nobre, estilo ateliê autoral e elegância atemporal.'
  },
  {
    id: 'vendas_agressivo',
    name: 'Direct Response & Vendas',
    badge: 'Alta Conversão',
    tag: 'Serviços & Reparos',
    desc: 'Gatilhos de urgência ética, tabela comparativa, prova social ostensiva e botão de ação rápida.'
  },
  {
    id: 'moderno',
    name: 'Modern Split & Clean',
    badge: 'Corporativo & Clean',
    tag: 'Geral',
    desc: 'Visual moderno fluido, hero dividido e foco em usabilidade e agendamento instantâneo.'
  }
];

/**
 * Cria o prompt estruturado e altamente especializado para a IA gerar o site completo.
 * Incorpora a metodologia oficial da skill selecionada e diretrizes customizadas do usuário.
 */
export function buildSitePrompt(leadOrName, nichoArg, cidadeArg, creativeDirection = 'frontend_design', customDirectives = '') {
  let nome, nicho, cidade, nota, reviews, whatsapp, endereco;

  if (typeof leadOrName === 'object' && leadOrName !== null) {
    nome = (leadOrName.nome && leadOrName.nome !== 'Sem Nome' ? leadOrName.nome : 'Empresa').trim();
    nicho = leadOrName.nicho || 'Serviços Especializados';
    cidade = leadOrName.cidade && leadOrName.cidade !== 'Sem cidade' ? leadOrName.cidade : 'Brasil';
    nota = leadOrName.nota && Number(leadOrName.nota) > 0 ? Number(leadOrName.nota).toFixed(1) : '4.9';
    reviews = leadOrName.reviews && Number(leadOrName.reviews) > 0 ? leadOrName.reviews : 42;
    whatsapp = leadOrName.whatsapp ? leadOrName.whatsapp.replace(/\D/g, '') : '5511999999999';
    endereco = leadOrName.endereco || leadOrName.address || `${cidade}, Brasil`;
  } else {
    nome = leadOrName || 'Empresa';
    nicho = nichoArg || 'Serviços';
    cidade = cidadeArg || 'sua cidade';
    nota = '4.9';
    reviews = 38;
    whatsapp = '5511999999999';
    endereco = `${cidade}, Brasil`;
  }

  const design = resolveNicheDesignConfig(nicho, creativeDirection);
  const cleanPhone = whatsapp.startsWith('55') ? whatsapp : '55' + whatsapp;
  const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(`Olá! Vi o site da ${nome} em ${cidade} e gostaria de solicitar um atendimento/orçamento.`)}`;

  const selectedSkill = DESIGN_SKILLS_CATALOG.find(s => s.id === creativeDirection) || DESIGN_SKILLS_CATALOG[0];

  return `Você é o Design Lead da agência operando sob a Skill "${selectedSkill.name}" (${selectedSkill.badge}) para criar um site autoral, exclusivo e de alto valor comercial (R$ 800 a R$ 1.500+).

============================================================
1. BRIEFING DO NEGÓCIO REAL (GROUNDED IN SUBJECT MATTER):
- Nome Oficial: "${nome}"
- Segmento / Nicho: "${nicho}" (${design.nicheCategory})
- Localização: "${cidade}", Brasil (Endereço: "${endereco}")
- Prova Social do Google Maps: Nota ★ ${nota} com ${reviews} avaliações reais
- WhatsApp de Atendimento: +${cleanPhone}
- Vibe & Arquétipo Visual: ${design.vibe}
- Skill / Arquitetura Escolhida: ${selectedSkill.name} (${selectedSkill.badge})
- SHOWSTOPPER ELEMENT (Onde gastar a ousadia): "${design.showstopperElement}"
============================================================
${customDirectives ? `
============================================================
DIRETRIZES E PEDIDOS PERSONALIZADOS DO USUÁRIO (PRIORIDADE MÁXIMA):
${customDirectives}
============================================================
` : ''}
2. TOKEN SYSTEM DO PROJETO:
- Cor Primária: "${design.primaryColor}"
- Cor de Destaque/Ação: "${design.accentColor}"
- Fundo Principal: "${design.bgColor}"
- Superfície/Contraste: "${design.surfaceColor}"
- Texto Principal: "${design.textColor}"
- Texto de Apoio: "${design.mutedColor}"
- Tipografia Títulos: "${design.fontHeadline}" (Google Fonts)
- Tipografia Corpo: "${design.fontBody}" (Google Fonts, máx. 80 caracteres por linha)

============================================================
3. REGRAS INEGOCIÁVEIS DE DESIGN AUTORAL (SEM TEMPLATES REPETIDOS):
- 🚫 ZERO SITES CLICHÊS DE IA (ANTI-AI TELLS):
  * PROIBIDO o "Kit Cartão SaaS": NÃO fatie a página inteira em cartões brancos repetidos com cantos idênticos e sombra suave. Varie a estrutura: use faixas contrastantes, grids assimétricos, listas editoriais elegantes e seções respiradas.
  * PROIBIDO títulos com rótulos genéricos em CAIXA ALTA (ALL-CAPS) com tracking espaçado acima de cada bloco.
  * PROIBIDO numerar itens com "01 / 02 / 03" a menos que seja um fluxo passo a passo estritamente cronológico.
  * PROIBIDO itálico ou cor diferente em uma única palavra solta nos títulos.
  * PROIBIDO colocar "→" ao final de cada botão.

- 🌟 GASTE A OUSADIA EM UM LUGAR (SPEND BOLDNESS IN ONE PLACE):
  * O elemento central inesquecível da página DEVE ser o Showstopper: "${design.showstopperElement}".
  * Deixe o restante da página limpo, refinado, respirando e com tipografia hierarquizada.

- 📝 COPYWRITING ATIVO E HUMANO (PT-BR):
  * Voz ativa, tom conversacional em sentence case, citando "${nome}" e "${cidade}".
  * NUNCA use "Lorem Ipsum" ou jargões vazios ("soluções de ponta", "qualidade garantida").

============================================================
4. ARQUITETURA DA LANDING PAGE:
- [NAVBAR FIXA/FLUTUANTE]: Logo elegante com "${nome}", links âncora e botão de ação ("Falar no WhatsApp").
- [HERO SECTION DE ALTO IMPACTO]:
  * Tag de autoridade com nota real do Google Maps: "★ ${nota} no Google Maps (${reviews} avaliações em ${cidade})"
  * Título marcante centrado no benefício real para o cliente em ${cidade}.
  * Subtítulo direto em sentence case sem clichês.
  * Botão de Ação Imediata para WhatsApp: link para "${waUrl}".
  * Imagem de alta definição ("${design.heroImage}").
- [SHOWSTOPPER - ELEMENTO MEMORÁVEL]:
  * Destaque interativo ou visual do "${design.showstopperElement}".
- [DIFERENCIAIS & SOLUÇÕES ESPECÍFICAS]:
  * Soluções do nicho detalhadas para a ${nome} em ${cidade}.
- [PROVA SOCIAL DO GOOGLE MAPS]:
  * Depoimentos autênticos com nomes brasileiros reais recomendando a ${nome}.
- [AUTORIDADE & LOCALIZAÇÃO]:
  * Endereço em ${cidade}, horários e foto de estrutura ("${design.secondaryImage}").
- [FAQ E CTA FINAL]:
  * Dúvidas comuns resolvidas e botão flutuante persistente no WhatsApp.

SAÍDA OBRIGATÓRIA:
Retorne APENAS o código HTML completo iniciando com <!DOCTYPE html> e finalizando com </html>. Não inclua explicações nem blocos de markdown adicionais.`;
}


// ============================================================
// ARQUÉTIPOS DE NEGÓCIOS & PROMPTS DE ENGENHARIA DE SOFTWARE DE ELITE (R$ 90.000+)
// ============================================================

export const BUSINESS_ARCHETYPES = {
  cardapio_hamburgueria: {
    id: "cardapio_hamburgueria",
    title: "Aplicativo de Delivery & Cardápio Digital Interativo",
    category: "Gastronomia, Lanches & Hamburguerias",
    icon: "🍔",
    description: "Sistema completo de delivery de lanches artesanais, combos, porções, adicionais com cálculo de taxas por bairro e finalização via WhatsApp com painel admin e Supabase.",
    targetAi: "Google Stitch, Claude 3.7 Sonnet, v0.dev, ChatGPT (GPT-4o)",
    systemObjective: "gerenciar pedidos de delivery e retiradas de lanches artesanais, combos smash, porções crocantes, bebidas e sobremesas",
    bannerHeadline: "BURGUERS ARTESANAIS FEITOS COM PAIXÃO",
    bannerSub: "Blends nobres moídos no dia, pão brioche selado na manteiga de garrafa e queijo derretido.",
    categoriesList: ["🍔 Artesanais", "🍱 Combos Smash", "🍟 Porções & Fritas", "🥤 Bebidas & Shakes", "🍫 Sobremesas", "➕ Adicionais"],
    sampleProducts: [
      { name: "SMASH DUPLO CHEDDAR BACON", price: "R$ 34,90", desc: "Dois blends smash 90g com crosta perfeita, queijo cheddar inglês fundido, tiras de bacon crocante e maionese artesanal no brioche tostado." },
      { name: "BURGER TRUFADO IMPERIAL", price: "R$ 42,00", desc: "Blend 180g Angus, queijo gouda maçaricado, cebola caramelizada na cerveja preta e azeite trufado no pão australiano." },
      { name: "BATATA RÚSTICA COM PÁPRICA", price: "R$ 22,90", desc: "Batatas com corte rústico temperadas com alecrim fresco, flor de sal e páprica defumada. Acompanha molho barbecue artesanal." },
      { name: "MILK-SHAKE NUTELLA COM LEITE NINHO", price: "R$ 19,90", desc: "Sorvete artesanal de baunilha batido com Nutella pura, borda recheada e chantilly fresco." }
    ],
    customizationRules: "Ponto da carne (Ao Ponto, Bem Passado, Mal Passado), queijo extra, bacon crispy (+R$ 4,50), ovo caipira (+R$ 3,00), remover ingredientes (cebola, picles, tomate, molho).",
    comboExample: "COMBO DUPLO SMASH: 2x Smash Burgers + 1x Batata Média + 2x Refrigerantes Lata por R$ 69,90 (Economia de R$ 14,00).",
    palette: { primary: "#FF5722", secondary: "#1F2937", bg: "#0F172A", surface: "#1E293B", text: "#F8FAFC", fontHead: "Montserrat", fontBody: "Inter" },
    showstopper: "Simulador Interativo de Ponto de Carne & Montador de Smash em Camadas",
    sqlTables: "CREATE TABLE categories (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), name VARCHAR(100) NOT NULL, slug VARCHAR(100) UNIQUE, position INT DEFAULT 0, active BOOLEAN DEFAULT TRUE);\nCREATE TABLE products (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), category_id UUID REFERENCES categories(id), name VARCHAR(150) NOT NULL, description TEXT, price DECIMAL(10,2) NOT NULL, promotional_price DECIMAL(10,2), image_url TEXT, active BOOLEAN DEFAULT TRUE);\nCREATE TABLE addon_groups (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), name VARCHAR(100) NOT NULL, min_selection INT DEFAULT 0, max_selection INT DEFAULT 5, required BOOLEAN DEFAULT FALSE);\nCREATE TABLE addons (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), addon_group_id UUID REFERENCES addon_groups(id), name VARCHAR(100) NOT NULL, price DECIMAL(10,2) DEFAULT 0.00, active BOOLEAN DEFAULT TRUE);\nCREATE TABLE delivery_neighborhoods (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), name VARCHAR(100) NOT NULL, fee DECIMAL(10,2) NOT NULL, estimated_time VARCHAR(50));\nCREATE TABLE orders (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), customer_name VARCHAR(150) NOT NULL, customer_phone VARCHAR(50) NOT NULL, delivery_type VARCHAR(20) NOT NULL, total DECIMAL(10,2) NOT NULL, status VARCHAR(30) DEFAULT \"recebido\", created_at TIMESTAMPTZ DEFAULT NOW());"
  },

  sorveteria_gelateria: {
    id: "sorveteria_gelateria",
    title: "App de Delivery de Gelateria & Potes Térmicos",
    category: "Sorveteria, Gelateria & Açaí",
    icon: "🍨",
    description: "Sistema completo de delivery de potes térmicos de sorvete e gelatos com seleção de sabores em tempo real, controle de sabores esgotados do dia e proteção térmica.",
    targetAi: "Google Stitch, Claude 3.7 Sonnet, v0.dev, ChatGPT (GPT-4o)",
    systemObjective: "gerenciar delivery e encomendas de potes de gelatos artesanais, picolés recheados, taças especiais, açaí puro batido e milk-shakes cremosos",
    bannerHeadline: "GELATOS ARTESANAIS COM FRUTAS FRESCAS",
    bannerSub: "Receitas italianas autênticas, frutas frescas locais e cremosidade incomparável sem corantes artificiais.",
    categoriesList: ["🍨 Potes Térmicos (500ml e 1L)", "🍦 Picolés Artesanais", "🥤 Milk-Shakes", "🍧 Taças & Sobremesas", "🫐 Açaí Puro", "🧇 Casquinhas & Caldas"],
    sampleProducts: [
      { name: "POTE TÉRMICO 1 LITRO (ATÉ 3 SABORES)", price: "R$ 44,90", desc: "Embalagem térmica de alta vedação. Escolha até 3 sabores frescos da vitrine de hoje. Acompanha 3 casquinhas embaladas separadamente." },
      { name: "POTE TÉRMICO 500ML (ATÉ 2 SABORES)", price: "R$ 26,90", desc: "Porção individual generosa ou para duas pessoas. Escolha até 2 sabores artesanais da vitrine." },
      { name: "TAÇA TROPICAL ARTESANAL", price: "R$ 18,90", desc: "Camadas de sorvete de manga com maracujá, kiwi fresco picado, granola artesanal crocante e chantilly de baunilha." },
      { name: "PICOLÉ PISTACHE PURO RECHEADO", price: "R$ 8,50", desc: "Picolé de pistache italiano legítimo com casquinha crocante de chocolate branco belga." }
    ],
    customizationRules: "Seleção obrigatória de sabores com limite mínimo e máximo rigoroso (Pote 500ml: 1 a 2 sabores / Pote 1L: 1 a 3 sabores). Indicação ao vivo de sabores esgotados na vitrine. Adicional de embalagem térmica com gelo extra (+R$ 4,50). Kit 3 casquinhas waffle crocantes (+R$ 6,00).",
    comboExample: "KIT FAMÍLIA GELATO: 1x Pote 1 Litro + 1x Pacote com 6 Casquinhas Waffle + 1x Pote de Calda Quente de Chocolate Belga por R$ 59,90 (Economia de R$ 9,50).",
    palette: { primary: "#FF6F61", secondary: "#2E7D32", bg: "#FAFAFA", surface: "#FFFFFF", text: "#1F2937", fontHead: "Poppins", fontBody: "Inter" },
    showstopper: "Vitrine Interativa com Atualização em Tempo Real de Sabores Esgotados e Seletor Visual de Potes",
    sqlTables: "CREATE TABLE categories (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), name VARCHAR(100) NOT NULL, slug VARCHAR(100) UNIQUE, position INT DEFAULT 0, active BOOLEAN DEFAULT TRUE);\nCREATE TABLE ice_cream_flavors (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), name VARCHAR(100) NOT NULL, badge VARCHAR(50), extra_price DECIMAL(10,2) DEFAULT 0.00, in_stock BOOLEAN DEFAULT TRUE);\nCREATE TABLE products (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), category_id UUID REFERENCES categories(id), name VARCHAR(150) NOT NULL, price DECIMAL(10,2) NOT NULL, volume_ml INT, allows_flavors BOOLEAN DEFAULT TRUE, min_flavors INT DEFAULT 1, max_flavors INT DEFAULT 3, active BOOLEAN DEFAULT TRUE);\nCREATE TABLE delivery_neighborhoods (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), name VARCHAR(100) NOT NULL, fee DECIMAL(10,2) NOT NULL, estimated_time VARCHAR(50));\nCREATE TABLE orders (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), customer_name VARCHAR(150) NOT NULL, customer_phone VARCHAR(50) NOT NULL, delivery_type VARCHAR(20) NOT NULL, total DECIMAL(10,2) NOT NULL, status VARCHAR(30) DEFAULT \"recebido\", created_at TIMESTAMPTZ DEFAULT NOW());"
  },

  confeitaria_doces: {
    id: "confeitaria_doces",
    title: "Sistema de Encomendas de Bolos & Doceria Artesanal",
    category: "Confeitaria, Bolos & Doces Finos",
    icon: "🍰",
    description: "Plataforma completa de encomendas de bolos de aniversário, casamento, doces finos e kits de festa com calculadora de fatias, escolha de massas/recheios e agendamento de data de entrega.",
    targetAi: "Google Stitch, Claude 3.7 Sonnet, v0.dev, ChatGPT (GPT-4o)",
    systemObjective: "gerenciar encomendas de bolos decorados em chantininho/pasta americana, centos de docinhos gourmet, tortas de vitrine e kits completos para festas",
    bannerHeadline: "BOLOS E DOCES QUE TORNAM CADA CELEBRAÇÃO INESQUECÍVEL",
    bannerSub: "Feitos à mão com chocolate belga puro, frutas frescas selecionadas e decorações autorais sob medida.",
    categoriesList: ["🎂 Bolos Decorados & Festivos", "🍬 Docinhos Gourmet & Centos", "🥧 Tortas & Sobremesas", "🎉 Kits Festa Pronta", "🎁 Caixas de Presente"],
    sampleProducts: [
      { name: "BOLO PERSONALIZADO CHANTININHO (20 A 25 FATIAS)", price: "R$ 130,00", desc: "Bolo alto de 2kg com 3 camadas de massa fofa e 2 camadas generosas de recheio. Decoração em chantininho com glitter comestível e topo personalizado opcional." },
      { name: "CENTO DE BRIGADEIROS GOURMET SORTIDOS", price: "R$ 140,00", desc: "100 docinhos enrolados na hora: Brigadeiro tradicional belga, Ninho com Nutella, Churros com doce de leite caseiro e Beijinho de coco queimado." },
      { name: "TORTA TRUFADA HOLANDESA SUPREMA", price: "R$ 85,00", desc: "Base de biscoito amanteigado com borda de calipso, creme holandês aerado e cobertura de ganache de chocolate meio amargo nobre." },
      { name: "KIT FESTA COMPLETA 15 PESSOAS", price: "R$ 195,00", desc: "Inclui 1 Bolo de 1,5kg decorado + 50 docinhos gourmet + 100 salgadinhos artesanais assados e fritos." }
    ],
    customizationRules: "Calculadora de fatias para convidados (15, 25, 40 fatias), escolha de massa (Baunilha, Chocolate 50%, Red Velvet), seleção de 2 recheios (Ninho, Brigadeiro Belga, Doce de Leite com Nozes, Quatro Leites, Frutas Vermelhas), escrita personalizada no topo do bolo, data e horário limite de entrega/retirada.",
    comboExample: "KIT FESTA ANIVERSÁRIO VIP: Bolo 2kg Decorado + 100 Docinhos Gourmet + 1 Vela Faísca Dourada por R$ 240,00 (Economia de R$ 35,00).",
    palette: { primary: "#E11D48", secondary: "#D97706", bg: "#FDFBF7", surface: "#FFFFFF", text: "#292524", fontHead: "Playfair Display", fontBody: "Plus Jakarta Sans" },
    showstopper: "Calculadora Interativa de Fatias & Simulador de Montagem de Bolo em Camadas",
    sqlTables: "CREATE TABLE categories (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), name VARCHAR(100) NOT NULL, slug VARCHAR(100) UNIQUE, position INT DEFAULT 0, active BOOLEAN DEFAULT TRUE);\nCREATE TABLE cake_sizes (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), name VARCHAR(50) NOT NULL, slices_estimate INT NOT NULL, base_price DECIMAL(10,2) NOT NULL);\nCREATE TABLE fillings (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), name VARCHAR(100) NOT NULL, extra_cost DECIMAL(10,2) DEFAULT 0.00, active BOOLEAN DEFAULT TRUE);\nCREATE TABLE products (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), category_id UUID REFERENCES categories(id), name VARCHAR(150) NOT NULL, price DECIMAL(10,2) NOT NULL, active BOOLEAN DEFAULT TRUE);\nCREATE TABLE orders (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), customer_name VARCHAR(150) NOT NULL, customer_phone VARCHAR(50) NOT NULL, delivery_date DATE NOT NULL, delivery_time VARCHAR(20) NOT NULL, total DECIMAL(10,2) NOT NULL, status VARCHAR(30) DEFAULT \"encomenda_recebida\", created_at TIMESTAMPTZ DEFAULT NOW());"
  },

  clinica_odontologica: {
    id: "clinica_odontologica",
    title: "Portal Odontológico de Alta Conversão & Agendamento Digital",
    category: "Odontologia, Implantes & Estética Dental",
    icon: "🦷",
    description: "Sistema completo de agendamento de consultas e avaliações odontológicas com triagem digital de sintomas, catálogo de procedimentos 3D, verificação de convênios e painel administrativo da recepção.",
    targetAi: "Google Stitch, Claude 3.7 Sonnet, v0.dev, ChatGPT (GPT-4o)",
    systemObjective: "gerenciar agendamentos de avaliações clínicas, triagem de sintomas de pacientes, apresentação de tratamentos em implantes, ortodontia invisível e estética do sorriso",
    bannerHeadline: "O SORRISO QUE VOCÊ SEMPRE SONHOU, COM TECNOLOGIA 3D E SEM DOR",
    bannerSub: "Excelência em implantes de carga imediata, alinhadores invisíveis e estética orofacial com conforto absoluto.",
    categoriesList: ["🦷 Implantes & Carga Imediata", "✨ Estética & Facetas", "🪥 Alinhadores Invisíveis", "🩹 Canal & Microscopia", "🩺 Prevenção & Check-up", "🚨 Urgência Odontológica"],
    sampleProducts: [
      { name: "IMPLANTE DE CARGA IMEDIATA DIGITAL", price: "Sob Avaliação (Condições em 24x)", desc: "Recupere dentes fixos e a segurança para mastigar em até 72 horas com guia cirúrgico guiado por computador sem cortes desnecessários." },
      { name: "ALINHADOR INVISÍVEL SMART DIGITAL", price: "Sob Avaliação (Condições em 24x)", desc: "Correção ortodôntica rápida e sem bráquetes metálicos através de placas transparentes confortáveis trocadas a cada 14 dias." },
      { name: "CLAREAMENTO A LASER EM CONSULTÓRIO", price: "R$ 950,00", desc: "Tecnologia de ativação luminosa de alta potência em sessão única de 60 minutos para clarear até 4 tons com barreira gengival protetora." },
      { name: "FACETAS E LENTES EM PORCELANA", price: "Sob Avaliação (Condições em 24x)", desc: "Lâminas ultrafinas de porcelana feldspática de 0,3mm que corrigem cor, formato e pequenos espaçamentos de forma definitiva." }
    ],
    customizationRules: "Triagem clínica preliminar: principal queixa (Falta de dentes, Dentes escurecidos, Dores agudas, Dentes desalinhados), exames prévios (Possui tomografia/raio-x recente), preferência de turno (Manhã, Tarde, Sábado) e seleção de dentista especialista.",
    comboExample: "CHECK-UP DIGITAL DO SORRISO: Consulta de Diagnóstico + Câmera Intraoral HD + Profilaxia a Jato de Bicarbonato por R$ 280,00.",
    palette: { primary: "#005BB0", secondary: "#0A74DA", bg: "#F8FAFC", surface: "#FFFFFF", text: "#0F172A", fontHead: "Montserrat", fontBody: "Roboto" },
    showstopper: "Slider Interativo Antes/Depois (\"Smile-Transform\") com Controle de Zoom e Comparativo Clínico",
    sqlTables: "CREATE TABLE specialties (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), name VARCHAR(100) NOT NULL, slug VARCHAR(100) UNIQUE, active BOOLEAN DEFAULT TRUE);\nCREATE TABLE doctors (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), name VARCHAR(150) NOT NULL, cro_number VARCHAR(50) NOT NULL, specialty_id UUID REFERENCES specialties(id), bio TEXT, active BOOLEAN DEFAULT TRUE);\nCREATE TABLE procedures (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), specialty_id UUID REFERENCES specialties(id), title VARCHAR(150) NOT NULL, short_desc TEXT, estimated_sessions VARCHAR(50), active BOOLEAN DEFAULT TRUE);\nCREATE TABLE appointment_requests (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), patient_name VARCHAR(150) NOT NULL, patient_phone VARCHAR(50) NOT NULL, procedure_id UUID REFERENCES procedures(id), doctor_id UUID REFERENCES doctors(id), preferred_shift VARCHAR(30), symptoms TEXT, status VARCHAR(30) DEFAULT \"aguardando_contato\", created_at TIMESTAMPTZ DEFAULT NOW());"
  },

  clinica_medica: {
    id: "clinica_medica",
    title: "Página de Clínica Médica & Especialidades",
    category: "Medicina & Especialidades",
    icon: "🩺",
    description: "Corpo clínico humanizado, especialidades médicas atendidas, convênios/particular e agendamento de consulta via WhatsApp.",
    targetAi: "Google Stitch, Claude 3.7 Sonnet, v0.dev, ChatGPT (GPT-4o)",
    systemObjective: "gerenciar marcação de consultas médicas presenciais e telemedicina, check-ups preventivos corporativos e familiares e encaminhamentos de exames",
    bannerHeadline: "MEDICINA HUMANIZADA E DIAGNÓSTICO PRECISO",
    bannerSub: "Corpo clínico especializado, pontualidade de atendimento e estrutura com padrão ouro de segurança.",
    categoriesList: ["🩺 Consultas Médicas", "🔬 Exames Laboratoriais", "🩻 Ultrassom & Imagem", "❤️ Cardiologia & Check-up", "👶 Pediatria & Vacinas", "💻 Telemedicina"],
    sampleProducts: [
      { name: "CHECK-UP CARDIOLÓGICO COMPLETO", price: "R$ 450,00", desc: "Consulta com médico cardiologista + Eletrocardiograma de repouso (ECG) + Teste Ergométrico computadorizado com laudo no mesmo dia." },
      { name: "CONSULTA DERMATOLÓGICA COM DERMATOSCOPIA", price: "R$ 350,00", desc: "Avaliação detalhada de lesões de pele, pintas suspeitas, acne, queda capilar e protocolos de rejuvenescimento." },
      { name: "CONSULTA PEDIÁTRICA HUMANIZADA", price: "R$ 300,00", desc: "Acompanhamento do crescimento, desenvolvimento neuropsicomotor, imunização e orientações nutricionais infantis." },
      { name: "CHECK-UP EXECUTIVO DA MULHER", price: "R$ 680,00", desc: "Ginecologia preventiva completa: Consulta + Ultrassom pélvico e transvaginal + Exame preventivo com acolhimento." }
    ],
    customizationRules: "Seleção de modalidade (Presencial na clínica ou Telemedicina online), seleção de convênio (Unimed, Bradesco, Amil, SulAmérica ou Particular), anexar sintomas e período preferencial.",
    comboExample: "PACOTE PREVENTIVO ANUAL: Consulta Clínica Geral + Exames de Sangue Completos + Eletrocardiograma por R$ 520,00.",
    palette: { primary: "#0284C7", secondary: "#0F172A", bg: "#F8FAFC", surface: "#FFFFFF", text: "#0F172A", fontHead: "Plus Jakarta Sans", fontBody: "Inter" },
    showstopper: "Seletor Interativo de Especialidades com Calendário Dinâmico de Vagas para a Semana",
    sqlTables: "CREATE TABLE specialties (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), name VARCHAR(100) NOT NULL, active BOOLEAN DEFAULT TRUE);\nCREATE TABLE doctors (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), name VARCHAR(150) NOT NULL, crm VARCHAR(50) NOT NULL, specialty_id UUID REFERENCES specialties(id), active BOOLEAN DEFAULT TRUE);\nCREATE TABLE health_insurances (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), name VARCHAR(100) NOT NULL, active BOOLEAN DEFAULT TRUE);\nCREATE TABLE appointments (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), patient_name VARCHAR(150) NOT NULL, patient_phone VARCHAR(50) NOT NULL, specialty_id UUID REFERENCES specialties(id), insurance_id UUID, appointment_type VARCHAR(30) DEFAULT \"presencial\", preferred_date DATE, status VARCHAR(30) DEFAULT \"pendente\", created_at TIMESTAMPTZ DEFAULT NOW());"
  },

  academia_fitness: {
    id: "academia_fitness",
    title: "Página de Academia & Passe Livre de Treino",
    category: "Fitness & Performance",
    icon: "🏋️",
    description: "Grade de modalidades (musculação, funcional, lutas), tour de equipamentos, tabela clara de planos sem taxas ocultas e resgate de 1 diária de treino experimental no WhatsApp.",
    targetAi: "Google Stitch, Claude 3.7 Sonnet, v0.dev, ChatGPT (GPT-4o)",
    systemObjective: "gerenciar matrículas de planos mensais/anuais, resgate de diárias experimentais gratuitas, consulta de horários de aulas coletivas e adesão online sem burocracia",
    bannerHeadline: "SUA MELHOR VERSÃO COMEÇA HOJE. TREINE EM ALTO NÍVEL",
    bannerSub: "Equipamentos biomecânicos de ponta, ambiente climatizado, vestiários com ducha quente e professores dedicados.",
    categoriesList: ["🏋️ Musculação Completa", "🥊 Lutas & Artes Marciais", "🔥 Funcional & Cross", "🚴 Spinning & Cardio", "🧘 Pilates & Postura", "📋 Planos & Passe Livre"],
    sampleProducts: [
      { name: "PLANO ANUAL VIP TOTAL PASS", price: "R$ 119,90/mês", desc: "Acesso ilimitado à musculação, todas as aulas coletivas, sem taxa oculta de manutenção e direito a 2 convites para amigos por mês." },
      { name: "PLANO SEMESTRAL PERFORMANCE", price: "R$ 139,90/mês", desc: "Livre acesso à musculação e área cardio com acompanhamento de treino por aplicativo no celular." },
      { name: "PASSE LIVRE: 1 DIÁRIA EXPERIMENTAL GRÁTIS", price: "R$ 0,00 (Cortesia)", desc: "Conheça toda a estrutura da academia por 1 dia sem nenhum custo. Resgate seu voucher instantaneamente pelo WhatsApp." },
      { name: "PROGRAMA DE PERSONAL TRAINING INDIVIDUAL", price: "R$ 450,00/mês", desc: "Treinamento 100% individualizado com acompanhamento presencial de postura, carga e periodização de hipertrofia/emagrecimento." }
    ],
    customizationRules: "Seletor de objetivo do aluno (Hipertrofia, Emagrecimento, Condicionamento físico, Saúde/Alívio de dores), turno de preferência para treinar (Madrugada/Manhã/Almoço/Noite), agendamento da primeira aula experimental com professor.",
    comboExample: "COMBO CASAL / FAMÍLIA: Duas matrículas no Plano Anual VIP com 20% de desconto na segunda mensalidade por R$ 215,80/mês.",
    palette: { primary: "#F43F5E", secondary: "#09090B", bg: "#09090B", surface: "#18181B", text: "#F4F4F5", fontHead: "Oswald", fontBody: "Inter" },
    showstopper: "Simulador Visual de Metas Corporais & Emissor de Voucher Digital de Treino Experimental",
    sqlTables: "CREATE TABLE plans (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), name VARCHAR(100) NOT NULL, duration_months INT NOT NULL, monthly_price DECIMAL(10,2) NOT NULL, benefits TEXT[], active BOOLEAN DEFAULT TRUE);\nCREATE TABLE modalities (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), name VARCHAR(100) NOT NULL, schedule_summary VARCHAR(150), coach_name VARCHAR(100), active BOOLEAN DEFAULT TRUE);\nCREATE TABLE trial_vouchers (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), student_name VARCHAR(150) NOT NULL, student_phone VARCHAR(50) NOT NULL, goal VARCHAR(100), redeemed BOOLEAN DEFAULT FALSE, created_at TIMESTAMPTZ DEFAULT NOW());\nCREATE TABLE memberships (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), student_name VARCHAR(150) NOT NULL, plan_id UUID REFERENCES plans(id), status VARCHAR(30) DEFAULT \"ativo\", created_at TIMESTAMPTZ DEFAULT NOW());"
  },

  oficina_automotivo: {
    id: "oficina_automotivo",
    title: "Página de Auto Center & Orçamento Imediato",
    category: "Automotivo & Mecânica",
    icon: "🚗",
    description: "Tabela de serviços mecânicos com garantia, diagnóstico computadorizado e envio de foto/áudio do veículo no WhatsApp para orçamento rápido.",
    targetAi: "Google Stitch, Claude 3.7 Sonnet, v0.dev, ChatGPT (GPT-4o)",
    systemObjective: "gerenciar solicitações de orçamentos rápidos para consertos mecânicos, agendamento de revisões preventivas, alinhamento 3D e socorro automotivo",
    bannerHeadline: "CUIDADO MECÂNICO DE CONFIANÇA E DIAGNÓSTICO ELETRÔNICO PRECISO",
    bannerSub: "Peças com garantia de fábrica, transparência total e sala de espera climatizada com café e Wi-Fi.",
    categoriesList: ["🔧 Revisão Geral 10k", "🛑 Freios & Suspensão", "💻 Injeção Eletrônica", "🛢️ Troca de Óleo & Filtros", "❄️ Ar Condicionado", "🎯 Alinhamento 3D & Pneus"],
    sampleProducts: [
      { name: "REVISÃO PREVENTIVA GERAL (30 ITENS)", price: "R$ 380,00 + peças", desc: "Checagem minuciosa de suspensão, pastilhas, sistema de arrefecimento, velas, correias e scanner de injeção computadorizado." },
      { name: "DIAGNÓSTICO ELETRÔNICO COM SCANNER 3D", price: "R$ 150,00", desc: "Identificação imediata de falhas na injeção, falha de ignição, sensor ABS e luzes de anomalia no painel do carro." },
      { name: "TROCA DE PASTILHAS E FLUIDO DE FREIO", price: "R$ 290,00", desc: "Substituição das pastilhas de freio dianteiras com sangria e substituição do fluido por DOT 4 de alta performance." },
      { name: "HIGIENIZAÇÃO DE AR CONDICIONADO COM OZÔNIO", price: "R$ 140,00", desc: "Oxi-sanitização completa da cabine, eliminando ácaros, mofo e bactérias dos dutos de ventilação + troca de filtro de cabine." }
    ],
    customizationRules: "Dados do veículo (Marca, Modelo, Ano e Quilometragem aproximada), seleção de sintomas (Barulho metálico na roda, Luz de injeção piscando, Carro falhando ao acelerar, Freio com chiado), opção de envio de foto do painel ou áudio do motor pelo WhatsApp.",
    comboExample: "PACOTE REVISÃO DE VIAGEM: Alinhamento 3D + Balanceamento 4 Rodas + Higienização do Ar Condicionado por R$ 220,00.",
    palette: { primary: "#0284C7", secondary: "#EAB308", bg: "#0F172A", surface: "#1E293B", text: "#F8FAFC", fontHead: "Montserrat", fontBody: "Inter" },
    showstopper: "Simulador de Diagnóstico de Falhas por Sintomas com Solicitação de Orçamento em 15 Minutos",
    sqlTables: "CREATE TABLE services (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), name VARCHAR(150) NOT NULL, base_price DECIMAL(10,2) NOT NULL, description TEXT, active BOOLEAN DEFAULT TRUE);\nCREATE TABLE quote_requests (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), customer_name VARCHAR(150) NOT NULL, customer_phone VARCHAR(50) NOT NULL, vehicle_brand VARCHAR(50) NOT NULL, vehicle_model VARCHAR(50) NOT NULL, vehicle_year VARCHAR(10), symptoms TEXT, status VARCHAR(30) DEFAULT \"aguardando_orcamento\", created_at TIMESTAMPTZ DEFAULT NOW());\nCREATE TABLE appointments (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), quote_id UUID REFERENCES quote_requests(id), scheduled_date DATE, status VARCHAR(30) DEFAULT \"confirmado\");"
  },

  estetica_salao: {
    id: "estetica_salao",
    title: "Página de Estética VIP & Procedimentos",
    category: "Beleza & Bem-Estar",
    icon: "💅",
    description: "Catálogo visual de procedimentos (cabelo, unhas, estética facial, barbearia), galeria de resultados e reserva de horário no WhatsApp.",
    targetAi: "Google Stitch, Claude 3.7 Sonnet, v0.dev, ChatGPT (GPT-4o)",
    systemObjective: "gerenciar agendamentos de horários de procedimentos estéticos, mechas, manicure em gel, tratamentos de rejuvenescimento e spa day",
    bannerHeadline: "REVELE SUA BELEZA COM ATENDIMENTO EXCLUSIVO E TÉCNICAS MODERNAS",
    bannerSub: "Ambiente aconchegante, produtos importados de primeira linha e especialistas renomadas.",
    categoriesList: ["💇 Cabelos & Mechas", "✨ Estética Facial & Glow", "💅 Manicure & Unhas em Gel", "👁️ Sobrancelhas & Cílios", "🌿 Massagens & Spa Day"],
    sampleProducts: [
      { name: "PROTOCOLO GLOW FACIAL & PEELING DE DIAMANTE", price: "R$ 240,00", desc: "Limpeza profunda de pele, extração indolor, peeling de diamante, máscara calmante de ouro e hidratação com ácido hialurônico." },
      { name: "MECHAS CRIATIVAS E TRATAMENTO RECONSTRUTOR", price: "R$ 480,00", desc: "Técnica de morena iluminada ou loiro dos sonhos com teste de mecha prévio e proteção Olaplex para saúde absoluta dos fios." },
      { name: "EXTENSÃO DE UNHAS EM FIBRA DE VIDRO", price: "R$ 180,00", desc: "Alongamento resistente com formato personalizado, acabamento natural e esmaltação em gel de longa duração." },
      { name: "DESIGN DE SOBRANCELHAS COM HENNA OU BROW LAMINATION", price: "R$ 85,00", desc: "Alinhamento dos fios rebeldes, preenchimento de falhas e mapeamento facial com visagismo exclusivo." }
    ],
    customizationRules: "Escolha de profissional de preferência, preferência de turno (Manhã, Tarde, Noite), seleção de serviços adicionais (escova modelada, massagem capilar) e observações sobre sensibilidade ou gravidez.",
    comboExample: "SPA DAY RENOVADOR: Limpeza de Pele Glow + Massagem Relaxante com Óleos Nobres + Escova Modelada por R$ 380,00.",
    palette: { primary: "#F472B6", secondary: "#D97706", bg: "#FAF5FF", surface: "#FFFFFF", text: "#18181B", fontHead: "Playfair Display", fontBody: "Plus Jakarta Sans" },
    showstopper: "Galeria Interativa de Resultados Reais & Agenda Dinâmica com Seleção de Especialistas",
    sqlTables: "CREATE TABLE professionals (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), name VARCHAR(150) NOT NULL, specialty VARCHAR(100), avatar_url TEXT, active BOOLEAN DEFAULT TRUE);\nCREATE TABLE services (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), name VARCHAR(150) NOT NULL, duration_minutes INT NOT NULL, price DECIMAL(10,2) NOT NULL, active BOOLEAN DEFAULT TRUE);\nCREATE TABLE appointments (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), client_name VARCHAR(150) NOT NULL, client_phone VARCHAR(50) NOT NULL, professional_id UUID REFERENCES professionals(id), service_id UUID REFERENCES services(id), scheduled_date DATE NOT NULL, scheduled_time VARCHAR(20) NOT NULL, status VARCHAR(30) DEFAULT \"agendado\", created_at TIMESTAMPTZ DEFAULT NOW());"
  },

  advocacia_juridico: {
    id: "advocacia_juridico",
    title: "Landing Page de Autoridade Jurídica & Sigilo",
    category: "Advocacia & Direito",
    icon: "⚖️",
    description: "Áreas de atuação especializadas, corpo jurídico, segurança e consulta confidencial de caso no WhatsApp.",
    targetAi: "Google Stitch, Claude 3.7 Sonnet, v0.dev, ChatGPT (GPT-4o)",
    systemObjective: "gerenciar triagem confidencial de clientes, agendamento de consultas jurídicas estratégicas presenciais e online e apresentação de áreas de atuação",
    bannerHeadline: "SEGURANÇA JURÍDICA ESTRATÉGICA PARA PROTEGER SEU PATRIMÔNIO E NEGÓCIO",
    bannerSub: "Mais de 15 anos de atuação com foco em soluções eficientes, sigilo absoluto e defesa intransigente dos seus direitos.",
    categoriesList: ["⚖️ Direito Tributário", "🏢 Direito Empresarial", "💼 Direito do Trabalho", "🏠 Direito Imobiliário", "📜 Sucessões & Holding"],
    sampleProducts: [
      { name: "PLANEJAMENTO TRIBUTÁRIO & RECUPERAÇÃO DE CRÉDITOS", price: "Sob Consulta Estratégica", desc: "Auditoria fiscal aprofundada para identificar créditos pagos a maior nos últimos 5 anos e reduzir a carga tributária legal da sua empresa." },
      { name: "HOLDING FAMILIAR E PROTEÇÃO PATRIMONIAL", price: "Sob Consulta Estratégica", desc: "Estruturação societária sob medida para evitar inventários onerosos, conflitos familiares e proteger seus bens contra contingências." },
      { name: "CONSULTORIA TRABALHISTA PREVENTIVA & COMPLIANCE", price: "Sob Consulta Estratégica", desc: "Revisão de contratos de trabalho, jornadas e rotinas para zerar riscos de passivos trabalhistas futuros." },
      { name: "REGULARIZAÇÃO IMOBILIÁRIA E CONTRATOS COMPLEXOS", price: "Sob Consulta Estratégica", desc: "Assessoria jurídica para compra, venda, incorporação e usucapião de imóveis com total segurança documental." }
    ],
    customizationRules: "Tipo de cliente (Pessoa Física ou Pessoa Jurídica / CNPJ), fase atual do caso (Preventivo / Notificação recebida / Processo em andamento), upload ou descrição confidencial de documentos e preferência de atendimento.",
    comboExample: "DIAGNÓSTICO JURÍDICO EMPRESARIAL 360°: Análise contratual, trabalhista e fiscal preliminar com emissão de parecer executivo.",
    palette: { primary: "#1E3A8A", secondary: "#C5A059", bg: "#0B1329", surface: "#111E3D", text: "#F8FAFC", fontHead: "Cinzel", fontBody: "Inter" },
    showstopper: "Módulo de Autoavaliação de Riscos Jurídicos e Patrimoniais com Agendamento Sigiloso",
    sqlTables: "CREATE TABLE legal_areas (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), title VARCHAR(150) NOT NULL, description TEXT, active BOOLEAN DEFAULT TRUE);\nCREATE TABLE lawyers (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), name VARCHAR(150) NOT NULL, oab_number VARCHAR(50) NOT NULL, bio TEXT, active BOOLEAN DEFAULT TRUE);\nCREATE TABLE case_consultations (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), client_name VARCHAR(150) NOT NULL, client_phone VARCHAR(50) NOT NULL, client_type VARCHAR(20) NOT NULL, legal_area_id UUID REFERENCES legal_areas(id), brief_description TEXT, status VARCHAR(30) DEFAULT \"triagem_sigilosa\", created_at TIMESTAMPTZ DEFAULT NOW());"
  },

  pet_veterinaria: {
    id: "pet_veterinaria",
    title: "Página de Pet Shop, Banho & Tosa e Vacinas",
    category: "Pets & Veterinária",
    icon: "🐶",
    description: "Banho & tosa com táxi dog, vacinas e consultas veterinárias com agendamento rápido via WhatsApp.",
    targetAi: "Google Stitch, Claude 3.7 Sonnet, v0.dev, ChatGPT (GPT-4o)",
    systemObjective: "gerenciar consultas veterinárias, agendamentos de banho e tosa com solicitação de táxi dog, vacinas e diárias de hotel pet",
    bannerHeadline: "AMOR, DEDICAÇÃO E SAÚDE COMPLETA PARA QUEM FAZ PARTE DA SUA FAMÍLIA",
    bannerSub: "Veterinários dedicados, equipamentos de exame modernos e banho e tosa com água morninha e carinho.",
    categoriesList: ["🩺 Consultas & Vacinas", "✂️ Banho & Tosa na Tesoura", "🚐 Táxi Dog Leva e Traz", "🏥 Cirurgias & Exames", "🏨 Hotel & Day Care"],
    sampleProducts: [
      { name: "BANHO & TOSA HIGIÊNICA COM HIDRATAÇÃO DE OZÔNIO", price: "R$ 95,00", desc: "Banho com shampoo hipoalergênico, água aquecida, secagem com algodão no ouvido, corte de unhas e hidratação especial de ozônio." },
      { name: "CONSULTA CLÍNICA GERAL + PROTOCOLO VACINAL V10", price: "R$ 180,00", desc: "Avaliação física completa do seu cão ou gato, ausculta, pesagem e aplicação da vacina polivalente importada com atestado." },
      { name: "SERVIÇO DE TÁXI DOG LEVA E TRAZ", price: "R$ 25,00 (por trajeto)", desc: "Transporte climatizado, seguro e higienizado para buscar e entregar o seu pet no conforto da sua residência." },
      { name: "DIÁRIA DE HOTEL & DAY CARE COM CÂMERAS AO VIVO", price: "R$ 90,00/dia", desc: "Ambiente seguro, socialização supervisionada com outros pets, brincadeiras e envio de fotos e vídeos diários no WhatsApp." }
    ],
    customizationRules: "Dados do pet (Nome, Espécie: Cão ou Gato, Raça, Porte: Pequeno/Médio/Grande, Idade), temperamento (Dócil, Tímido, Bravo), serviço de táxi dog com endereço de busca e horário.",
    comboExample: "PACOTE SPA PET MENSAL: 4 Banhos Completos + 1 Tosa Higiênica + 1 Hidratação com 15% de desconto.",
    palette: { primary: "#0284C7", secondary: "#10B981", bg: "#F8FAFC", surface: "#FFFFFF", text: "#0F172A", fontHead: "Plus Jakarta Sans", fontBody: "Inter" },
    showstopper: "Ficha Interativa do Pet com Agendamento de Táxi Dog e Histórico de Vacinas",
    sqlTables: "CREATE TABLE pet_services (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), name VARCHAR(150) NOT NULL, category VARCHAR(50), price DECIMAL(10,2) NOT NULL, active BOOLEAN DEFAULT TRUE);\nCREATE TABLE appointments (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), tutor_name VARCHAR(150) NOT NULL, tutor_phone VARCHAR(50) NOT NULL, pet_name VARCHAR(100) NOT NULL, pet_breed VARCHAR(100), pet_size VARCHAR(20), service_id UUID REFERENCES pet_services(id), needs_taxi BOOLEAN DEFAULT FALSE, scheduled_date DATE NOT NULL, status VARCHAR(30) DEFAULT \"confirmado\", created_at TIMESTAMPTZ DEFAULT NOW());"
  },

  imobiliaria_corretor: {
    id: "imobiliaria_corretor",
    title: "Página Imobiliária & Imóveis em Destaque",
    category: "Imobiliário & Construtora",
    icon: "🏠",
    description: "Destaque de imóveis à venda e locação com fotos em alta resolução, simulação de financiamento e agendamento de visita no WhatsApp.",
    targetAi: "Google Stitch, Claude 3.7 Sonnet, v0.dev, ChatGPT (GPT-4o)",
    systemObjective: "gerenciar captação de leads interessados em compra, venda e locação de imóveis de alto padrão, agendamento de visitas com corretores e simulação de crédito imobiliário",
    bannerHeadline: "ENCONTRE O IMÓVEL DOS SEUS SONHOS COM EXCLUSIVIDADE E CONFORTO",
    bannerSub: "As melhores casas em condomínio, coberturas lineares e lançamentos premium selecionados a dedo.",
    categoriesList: ["🏡 Casas em Condomínio", "🏢 Apartamentos & Coberturas", "🏗️ Lançamentos na Planta", "🌳 Terrenos em Condomínio", "🤝 Venda Seu Imóvel"],
    sampleProducts: [
      { name: "MANSÃO MODERNA COM PISCINA DE BORDA INFINITA", price: "R$ 3.850.000", desc: "4 suítes plenas, área gourmet integrada, sala com pé-direito duplo de 6m, energia solar e 4 vagas cobertas em condomínio fechado de alto luxo." },
      { name: "COBERTURA DUPLEX VISTA PANORÂMICA 360°", price: "R$ 2.400.000", desc: "3 suítes, terraço amplo com spa aquecido, acabamento em mármore importado e elevador privativo com biometria." },
      { name: "APARTAMENTO GARDEN COM JARDIM PRIVATIVO", price: "R$ 1.250.000", desc: "3 quartos sendo 1 suíte, 180m² de área total, quintal espaçoso para pets e lazer completo no condomínio." },
      { name: "LOTE PLANO EM CONDOMÍNIO FECHADO (1.000m²)", price: "R$ 680.000", desc: "Localização privilegiada no condomínio, topografia impecável, portaria blindada 24h e clube privativo com quadra de tênis de saibro." }
    ],
    customizationRules: "Filtro por faixa de investimento (Até R$ 1 milhão, R$ 1M a R$ 3M, Acima de R$ 3M), número mínimo de dormitórios e vagas, interesse em financiamento bancário e agendamento de visita presencial com corretor credenciado.",
    comboExample: "ASSESSORIA COMPLETA DE COMPRA: Avaliação de Imóvel + Análise de Crédito Caixa/Itaú + Suporte Documental até a Escritura.",
    palette: { primary: "#D97706", secondary: "#1E293B", bg: "#0F172A", surface: "#1E293B", text: "#F8FAFC", fontHead: "Montserrat", fontBody: "Inter" },
    showstopper: "Simulador Interativo de Financiamento Bancário & Tour Virtual em Galeria Mosaico",
    sqlTables: "CREATE TABLE properties (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), title VARCHAR(200) NOT NULL, property_type VARCHAR(50), price DECIMAL(12,2) NOT NULL, bedrooms INT, suites INT, bathrooms INT, garage_spots INT, area_sqm DECIMAL(10,2), city VARCHAR(100), featured BOOLEAN DEFAULT TRUE, active BOOLEAN DEFAULT TRUE);\nCREATE TABLE property_images (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), property_id UUID REFERENCES properties(id), image_url TEXT NOT NULL, position INT DEFAULT 0);\nCREATE TABLE visit_requests (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), property_id UUID REFERENCES properties(id), customer_name VARCHAR(150) NOT NULL, customer_phone VARCHAR(50) NOT NULL, preferred_date DATE, financing_interest BOOLEAN DEFAULT FALSE, status VARCHAR(30) DEFAULT \"visita_solicitada\", created_at TIMESTAMPTZ DEFAULT NOW());"
  },

  servicos_geral: {
    id: "servicos_geral",
    title: "Landing Page de Alta Conversão & Apresentação Comercial",
    category: "Comércio & Serviços",
    icon: "🌟",
    description: "Página autoral padrão Studio com prova social real do Google Maps, diferenciais do negócio e botão flutuante de WhatsApp.",
    targetAi: "Google Stitch, Claude 3.7 Sonnet, v0.dev, ChatGPT (GPT-4o)",
    systemObjective: "gerenciar solicitações de orçamentos técnicos, vistorias no local, contratos de manutenção preventiva PMOC e execução de obras civis e comerciais",
    bannerHeadline: "SOLUÇÕES DE ENGENHARIA E INSTALAÇÕES DE ALTO PADRÃO COM GARANTIA",
    bannerSub: "Equipe técnica certificada com ART, cumprimento rigoroso de prazos e mais de 500 projetos entregues com perfeição.",
    categoriesList: ["❄️ Climatização & PMOC", "☀️ Energia Solar Fotovoltaica", "⚡ Elétrica & Subestações", "🏗️ Reformas & Pintura Predial", "🛡️ Segurança & CFTV"],
    sampleProducts: [
      { name: "INSTALAÇÃO DE AR CONDICIONADO SPLIT COM VÁCUO", price: "A partir de R$ 480,00", desc: "Instalação técnica com tubulação de cobre isolada, processo rigoroso de vácuo, suporte reforçado e 1 ano de garantia de mão de obra." },
      { name: "PROJETO E HOMOLOGAÇÃO DE ENERGIA SOLAR RESIDENCIAL", price: "Sob Dimensionamento", desc: "Estudo de viabilidade técnica, instalação de inversores e painéis solares tier-1 com economia de até 95% na conta de luz." },
      { name: "MANUTENÇÃO PREVENTIVA E CORRETIVA PMOC PARA EMPRESAS", price: "Sob Contrato Mensal", desc: "Plano de Manutenção, Operação e Controle exigido pela ANVISA com laudo técnico assinado por engenheiro mecânico." },
      { name: "REFORMA INTEGRAL DE IMÓVEIS E PINTURA PREDIAL", price: "Sob Orçamento de Projeto", desc: "Gerenciamento completo de obra, troca de pisos/revestimentos, hidráulica e pintura com tinta acrílica de alta durabilidade." }
    ],
    customizationRules: "Tipo de imóvel (Residencial, Comercial, Industrial, Galpão), urgência de início da obra (Imediata, Próximos 15 dias, Planejamento anual), solicitação de visita técnica com medição.",
    comboExample: "PACOTE MANUTENÇÃO TOTAL: Higienização Química de 4 aparelhos Split + Revisão de Carga de Gás por R$ 580,00.",
    palette: { primary: "#2563EB", secondary: "#0F172A", bg: "#F8FAFC", surface: "#FFFFFF", text: "#0F172A", fontHead: "Plus Jakarta Sans", fontBody: "Inter" },
    showstopper: "Calculadora Rápida de Orçamento Técnico com Agendamento de Vistoria Presencial",
    sqlTables: "CREATE TABLE service_categories (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), name VARCHAR(100) NOT NULL, active BOOLEAN DEFAULT TRUE);\nCREATE TABLE services (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), category_id UUID REFERENCES service_categories(id), name VARCHAR(150) NOT NULL, base_price DECIMAL(10,2), description TEXT, active BOOLEAN DEFAULT TRUE);\nCREATE TABLE quote_requests (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), customer_name VARCHAR(150) NOT NULL, customer_phone VARCHAR(50) NOT NULL, service_id UUID REFERENCES services(id), property_type VARCHAR(50), urgency VARCHAR(50), notes TEXT, status VARCHAR(30) DEFAULT \"visita_agendada\", created_at TIMESTAMPTZ DEFAULT NOW());"
  }
};

/**
 * Detecta automaticamente o arquétipo comercial do lead com base no nicho e nome
 */
export function detectBusinessArchetype(leadOrData = {}) {
  const n = ((leadOrData.nicho || "") + " " + (leadOrData.nome || "")).toLowerCase();

  if (n.includes("sorvete") || n.includes("gelato") || n.includes("açaí") || n.includes("açai") || n.includes("paleta") || n.includes("picolé") || n.includes("picole") || n.includes("sorveteria")) {
    return "sorveteria_gelateria";
  }
  if (n.includes("confeitaria") || n.includes("bolo") || n.includes("torta") || n.includes("doce") || n.includes("doceria") || n.includes("padaria") || n.includes("cupcake") || n.includes("brownie")) {
    return "confeitaria_doces";
  }
  if (n.includes("hamburguer") || n.includes("burger") || n.includes("lanche") || n.includes("pizza") || n.includes("pizzaria") || n.includes("restaurante") || n.includes("delivery") || n.includes("comida") || n.includes("gastronomia") || n.includes("pastel") || n.includes("sushi") || n.includes("churrasc") || n.includes("espet") || n.includes("bar ") || n.includes("pub")) {
    return "cardapio_hamburgueria";
  }
  if (n.includes("dentis") || n.includes("odonto") || n.includes("ortodont") || n.includes("implante") || n.includes("clareamento") || n.includes("sorriso") || n.includes("prótese")) {
    return "clinica_odontologica";
  }
  if (n.includes("médic") || n.includes("clínic") || n.includes("saúde") || n.includes("pediat") || n.includes("dermatolog") || n.includes("psicolog") || n.includes("fisiot") || n.includes("oftalmo") || n.includes("cardiolog") || n.includes("ginecolog")) {
    return "clinica_medica";
  }
  if (n.includes("academia") || n.includes("fitness") || n.includes("crossfit") || n.includes("treino") || n.includes("musculação") || n.includes("personal") || n.includes("pilates") || n.includes("luta") || n.includes("jiu") || n.includes("boxe") || n.includes("muay")) {
    return "academia_fitness";
  }
  if (n.includes("unha") || n.includes("cabelo") || n.includes("salão") || n.includes("barbearia") || n.includes("estética") || n.includes("spa") || n.includes("sobrancelha") || n.includes("manicure") || n.includes("maquiagem") || n.includes("bronze")) {
    return "estetica_salao";
  }
  if (n.includes("oficina") || n.includes("mecânic") || n.includes("auto center") || n.includes("carro") || n.includes("automot") || n.includes("funilar") || n.includes("pneu") || n.includes("freio") || n.includes("troca de óleo") || n.includes("guincho")) {
    return "oficina_automotivo";
  }
  if (n.includes("advoc") || n.includes("juríd") || n.includes("direito") || n.includes("advogad") || n.includes("tributár") || n.includes("trabalhis") || n.includes("previdenc") || n.includes("contábil") || n.includes("contabilidade")) {
    return "advocacia_juridico";
  }
  if (n.includes("pet") || n.includes("veterinár") || n.includes("banho e tosa") || n.includes("tosa") || n.includes("cão") || n.includes("gato") || n.includes("animal")) {
    return "pet_veterinaria";
  }
  if (n.includes("imóve") || n.includes("imobiliár") || n.includes("corretor") || n.includes("arquit") || n.includes("constru") || n.includes("engenhar")) {
    return "imobiliaria_corretor";
  }

  return "servicos_geral";
}

/**
 * Constrói a Especificação Completa de Produto (PRD) e Prompt de Engenharia (Padrão Software House R$ 90.000+)
 */
export function buildSpecializedBusinessPrompt(leadOrData = {}, archetypeOverride = null, customDirectives = "") {
  const nome = (leadOrData.nome && leadOrData.nome !== "Sem Nome" ? leadOrData.nome : "Empresa").trim();
  const nicho = leadOrData.nicho || "Serviços";
  const cidade = leadOrData.cidade && leadOrData.cidade !== "Sem cidade" ? leadOrData.cidade : "Brasil";
  const nota = leadOrData.nota && Number(leadOrData.nota) > 0 ? Number(leadOrData.nota).toFixed(1) : "4.9";
  const reviews = leadOrData.reviews && Number(leadOrData.reviews) > 0 ? leadOrData.reviews : 87;
  const whatsapp = leadOrData.whatsapp ? leadOrData.whatsapp.replace(/\D/g, "") : "5511999999999";
  const cleanPhone = whatsapp.startsWith("55") ? whatsapp : "55" + whatsapp;
  const endereco = leadOrData.endereco || leadOrData.address || (cidade + ", Brasil");

  let instagram = leadOrData.instagram || "";
  if (!instagram && leadOrData.site && leadOrData.site.includes("instagram.com")) {
    const match = leadOrData.site.match(/instagram\.com\/([a-zA-Z0-9_.-]+)/i);
    if (match && match[1]) instagram = "@" + match[1];
  }
  if (!instagram) {
    const cleanHandle = nome.toLowerCase().replace(/[^a-z0-9]/g, "");
    instagram = cleanHandle ? ("@" + cleanHandle) : "@empresa";
  }

  const archetypeKey = archetypeOverride || detectBusinessArchetype(leadOrData);
  const arch = BUSINESS_ARCHETYPES[archetypeKey] || BUSINESS_ARCHETYPES.servicos_geral;
  const waDirectUrl = "https://wa.me/" + cleanPhone + "?text=" + encodeURIComponent("Olá! Acessei o sistema online da " + nome + " em " + cidade + " e gostaria de atendimento.");

  const waBlockStart = "```text";
  const sqlBlockStart = "```sql";
  const blockEnd = "```";

  const sections = [
    "# " + arch.icon + " SISTEMA COMPLETO & ESPECIFICAÇÃO TÉCNICA (PRD) — " + nome.toUpperCase(),
    "",
    "## 1. OBJETIVO DO SISTEMA & REGRAS DE NEGÓCIO",
    "Criar uma aplicação web completa, moderna, ultra-rápida, mobile-first e de altíssima conversão para a empresa \"" + nome + "\", localizada em " + cidade + ".",
    "O sistema representa um projeto de nível Enterprise (padrão de estúdios e software houses de R$ 50.000 a R$ 90.000+), integrando:",
    "- Apresentação autoral de alta autoridade sem nenhum texto ou layout genérico.",
    "- Sistema interativo para " + arch.systemObjective + ".",
    "- Regras de negócio com validações rigorosas (seleções mínimas/máximas, cálculo de subtotais e taxas de deslocamento/entrega por bairro de " + cidade + ").",
    "- Integração fluida com WhatsApp gerando o payload da solicitação/pedido perfeitamente estruturado e legível.",
    "- Painel Administrativo (/admin) com autenticação segura, dashboard de faturamento e controle de catálogo em tempo real.",
    "",
    "---",
    "",
    "## 2. ESTRUTURA DA PÁGINA PRINCIPAL & HEADER",
    "No topo da aplicação:",
    "- **Logo Oficial:** \"" + nome + "\" com estética refinada.",
    "- **Status da Empresa em Tempo Real:** 🟢 Atendimento Aberto Agora | 🔴 Fechado no Momento (com base nos horários reais).",
    "- **Prova Social Google Maps:** ★ " + nota + " com " + reviews + " avaliações reais de clientes em " + cidade + ".",
    "- **Endereço Físico:** " + endereco + ".",
    "- **Ações Rápidas:** Campo de busca rápida e botão de carrinho/solicitação flutuante com contador em tempo real.",
    "",
    "---",
    "",
    "## 3. BANNER PRINCIPAL (HERO DE ALTO IMPACTO)",
    "- **Headline Magnética:** \"" + arch.bannerHeadline + "\"",
    "- **Subtítulo Estratégico:** \"" + arch.bannerSub + "\"",
    "- **CTAs Primários:** Botão principal de ação imediata (\"Iniciar Agora\") e link direto de WhatsApp (" + waDirectUrl + ").",
    "- **Selo de Garantia & Confiança:** Prova social destacada com nota ★ " + nota + " no Google Maps em " + cidade + ".",
    "",
    "---",
    "",
    "## 4. SISTEMA DE CATEGORIAS",
    "Navegação horizontal suave (pills com rolagem lateral e âncoras ativas):",
    arch.categoriesList.map(cat => "- " + cat).join("\n"),
    "",
    "---",
    "",
    "## 5. BUSCA INTELIGENTE DE PRODUTOS / SERVIÇOS",
    "Campo de busca em tempo real com filtro por:",
    "- Nome do item",
    "- Ingredientes ou especificações técnicas",
    "- Categoria associada",
    "",
    "---",
    "",
    "## 6. ESTRUTURA DE CADA PRODUTO / PROCEDIMENTO",
    "Cada card no catálogo deve conter:",
    "- **Fotografia Comercial Fotorrealista (Padrão Studio R$ 90k):** Proporção 1:1 e 16:9 em altíssima definição, iluminação de estúdio profissional (softbox difusa a 45°, contraste balanceado, lente macro 50mm f/1.8 com profundidade de campo rasa e bokeh fotorrealista). Texturas táteis autênticas (vapor sutil, gotas de condensação, brilho vívido de superfícies). Sem renders 3D plásticos ou ilustrações genéricas.",
    "- **Nome Comercial Marcante:** Em tipografia limpa com peso visual forte.",
    "- **Descrição Sensorial / Técnica Completa:** Detalhando ingredientes nobres, procedência ou especificações exatas do procedimento.",
    "- **Preço em R$ & Condições Transparentes:** Destaque claro com centavos e condições de parcelamento quando aplicável.",
    "- **Status de Disponibilidade em Tempo Real:** Badge elegante indicando disponibilidade imediata.",
    "- **Botão de Ação Direta:** Microinteração suave de clique com haptic feedback e adição instantânea.",
    "",
    "### Itens de Referência para a " + nome + ":",
    arch.sampleProducts.map(p => "• **" + p.name + "** — " + p.price + "\n  " + p.desc).join("\n\n"),
    "",
    "---",
    "",
    "## 7. MODAL DE PERSONALIZAÇÃO & REGRAS DE NEGÓCIO",
    "Ao clicar em qualquer item personalizável, abre-se um modal detalhado:",
    "- **Regras de Seleção:** " + arch.customizationRules,
    "- **Observações:** Campo aberto para observações e pedidos específicos do cliente.",
    "- **Quantidade & Subtotal:** Seletor de quantidade com cálculo instantâneo do valor total.",
    "",
    "---",
    "",
    "## 8. SISTEMA DE ADICIONAIS & MODIFICADORES",
    "- Grupos de opcionais com limites de escolha mínima e máxima.",
    "- Preços individuais de cada adicional somados dinamicamente ao subtotal do item.",
    "",
    "---",
    "",
    "## 9. COMBOS & PACOTES ESPECIAIS",
    "- " + arch.comboExample,
    "",
    "---",
    "",
    "## 10. CARRINHO / SOLICITAÇÃO PERSISTENTE",
    "- Painel lateral deslizante (Drawer) ou tela cheia no celular.",
    "- Persistência de dados no LocalStorage do navegador.",
    "- Aplicação de cupons de desconto com cálculo instantâneo.",
    "- Resumo financeiro claro: Subtotal dos itens + Taxa de entrega/deslocamento - Desconto = **TOTAL**.",
    "",
    "---",
    "",
    "## 11. CHECKOUT & OPÇÕES DE ATENDIMENTO",
    "- Opção 1: Atendimento/Entrega no endereço em " + cidade + ".",
    "- Opção 2: Retirada presencial ou atendimento na sede (" + endereco + ").",
    "",
    "---",
    "",
    "## 12. DADOS DO CLIENTE & ENDEREÇO",
    "Campos:",
    "- Nome Completo",
    "- Telefone / WhatsApp com DDD",
    "- Endereço completo, Bairro e Ponto de Referência em " + cidade + " (dados salvos localmente para compras futuras).",
    "",
    "---",
    "",
    "## 13. FORMAS DE PAGAMENTO",
    "- **PIX:** Chave oficial da empresa com botão de \"Copiar Chave\".",
    "- **Cartão:** Na maquininha física na entrega ou presencial.",
    "- **Dinheiro:** Com campo interativo para cálculo de troco.",
    "",
    "---",
    "",
    "## 14. FINALIZAÇÃO PELO WHATSAPP COM COMANDA FORMATADA",
    "Ao clicar em \"Confirmar\", o sistema redireciona para o WhatsApp oficial (+ " + cleanPhone + ") com a mensagem perfeitamente alinhada:",
    "",
    waBlockStart,
    arch.icon + " *SOLICITAÇÃO OFICIAL — " + nome.toUpperCase() + "*",
    "",
    "👤 *Cliente:* [Nome do Cliente]",
    "📱 *WhatsApp:* [Telefone do Cliente]",
    "📍 *Localidade:* " + cidade + " - Brasil",
    "",
    "━━━━━━━━━━━━━━━━━━━━",
    "🛒 *DETALHES DA SOLICITAÇÃO*",
    "• [Itens selecionados com personalizações e adicionais]",
    "",
    "Subtotal: R$ [Valor]",
    "Taxa de Atendimento/Entrega: R$ [Taxa]",
    "💰 *TOTAL: R$ [Total]*",
    "💳 *Pagamento:* [PIX / Cartão / Dinheiro]",
    "━━━━━━━━━━━━━━━━━━━━",
    "📍 *Endereço:* " + endereco,
    blockEnd,
    "",
    "---",
    "",
    "## 15. PAINEL ADMINISTRATIVO (/admin)",
    "Área protegida por autenticação:",
    "- Dashboard de métricas em tempo real.",
    "- Módulo de controle rápido de disponibilidade da vitrine (ativação e pausa com 1 clique).",
    "- Gerenciamento completo de produtos, categorias, adicionais e cupons.",
    "- Histórico de solicitações e relatórios de vendas.",
    "",
    "---",
    "",
    "## 16. DASHBOARD GERENCIAL",
    "Métricas de acompanhamento:",
    "- Faturamento do dia",
    "- Quantidade de pedidos/agendamentos",
    "- Ticket médio",
    "- Itens mais procurados pelos clientes de " + cidade,
    "",
    "---",
    "",
    "## 17. GERENCIAMENTO DE CATEGORIAS",
    "- CRUD completo com controle de posição e visibilidade.",
    "",
    "---",
    "",
    "## 18. GERENCIAMENTO DE PRODUTOS & VITRINE",
    "- Upload de imagens em alta definição.",
    "- Controle de preços promocionais e estoque diário.",
    "",
    "---",
    "",
    "## 19. MODELAGEM DE BANCO DE DADOS (SUPABASE / POSTGRESQL)",
    sqlBlockStart,
    arch.sqlTables,
    blockEnd,
    "",
    "---",
    "",
    "## 20. SISTEMA DE CUPONS DE DESCONTO",
    "- Códigos promocionais com regras de validade, desconto percentual ou fixo e valor mínimo de pedido.",
    "",
    "---",
    "",
    "## 21. SISTEMA DE COBERTURA & TAXAS EM " + cidade.toUpperCase(),
    "- Cadastro de bairros e regiões atendidas com cálculo automático de taxa e tempo estimado de resposta.",
    "",
    "---",
    "",
    "## 22. CONFIGURAÇÕES DA EMPRESA",
    "- Nome Fantasia: \"" + nome + "\"",
    "- Contato: + " + cleanPhone,
    "- Instagram: " + instagram,
    "- Endereço: " + endereco,
    "",
    "---",
    "",
    "## 23. CONTROLE DE HORÁRIO EM TEMPO REAL",
    "- Verificação automática de horário para exibir status Aberto/Fechado.",
    "",
    "---",
    "",
    "## 24. DESIGN & DESIGN TOKENS (PADRÃO SOFTWARE HOUSE R$ 90.000)",
    "- **Conceito Visual:** " + arch.title + " — Estilo Sofisticado, Autoral e de Alta Conversão.",
    "- **Paleta de Cores:** Primária (" + arch.palette.primary + "), Fundo (" + arch.palette.bg + "), Superfície (" + arch.palette.surface + "), Texto (" + arch.palette.text + ").",
    "- **Tipografia:** Títulos em \"" + arch.palette.fontHead + "\" e corpo em \"" + arch.palette.fontBody + "\" (<80 caracteres por linha).",
    "- **Showstopper Element (Onde gastar a ousadia):** " + arch.showstopper + ".",
    "- **Efeitos Visuais de Alto Padrão (Enterprise Glassmorphism & Microinteractions):**",
    "  * Superfícies refinadas com backdrop-blur-md e bordas translúcidas sutis de 1px (border-white/10 no dark mode ou border-black/5 no light mode).",
    "  * Sombras volumétricas multicamada (ambient light + directional shadow) para profundidade realista sem pesar.",
    "  * Efeito shimmer luminoso sutil nos badges de destaque e no botão de conversão primário.",
    "  * Transições a 60fps com framer-motion/tailwind-animate para modais, gavetas de carrinho e seletor de categorias.",
    "  * Toast feedback instantâneo com Sonner ao customizar e adicionar itens.",
    "",
    "---",
    "",
    "## 25. TECNOLOGIAS RECOMENDADAS",
    "- Frontend: React 19 + TypeScript + Vite.",
    "- Estilização: Tailwind CSS + shadcn/ui.",
    "- Banco de Dados: Supabase (PostgreSQL + Auth + Storage).",
    "- Ícones: Lucide React.",
    "- Notificações: Sonner.",
    "",
    "---",
    "",
    "## 26. EXPERIÊNCIA MOBILE (WIREFRAME ASCII)",
    waBlockStart,
    "┌──────────────────────────────────────┐",
    "│ " + arch.icon + " " + nome.toUpperCase().padEnd(20).slice(0,20) + "   🔍  🛒  │",
    "│ 🟢 Aberto Agora • " + cidade.padEnd(16).slice(0,16) + " │",
    "├──────────────────────────────────────┤",
    "│          BANNER PRINCIPAL            │",
    "│   " + arch.bannerHeadline.slice(0,34).padEnd(34) + " │",
    "│   [AÇÃO PRINCIPAL / PEDIR AGORA]     │",
    "├──────────────────────────────────────┤",
    "│ " + arch.categoriesList.slice(0,3).join("  ").padEnd(36).slice(0,36) + " │",
    "├──────────────────────────────────────┤",
    "│ [FOTO] " + (arch.sampleProducts[0]?.name || "PRODUTO").slice(0,28).padEnd(28) + " │",
    "│        " + (arch.sampleProducts[0]?.price || "R$ 0,00").padEnd(12) + " • [VER DETALHES] │",
    "└──────────────────────────────────────┘",
    blockEnd,
    "",
    "---",
    "",
    "## 27. FLUXO COMPLETO DO USUÁRIO",
    waBlockStart,
    "CLIENTE ACESSA A PLATAFORMA DA " + nome.toUpperCase(),
    "                   ↓",
    "VISUALIZA AUTORIDADE NO MAPS (NOTA ★ " + nota + ")",
    "                   ↓",
    "EXPLORA CATEGORIAS E ITENS ESPECÍFICOS",
    "                   ↓",
    "ABRE O MODAL E PERSONALIZA O ITEM COM REGRAS REAIS",
    "                   ↓",
    "ADICIONA AO CARRINHO PERSISTENTE (LOCALSTORAGE)",
    "                   ↓",
    "APLICA CUPOM DE DESCONTO E ESCOLHE ATENDIMENTO",
    "                   ↓",
    "INFORMA DADOS E FORMA DE PAGAMENTO (PIX/CARTÃO)",
    "                   ↓",
    "CLICA EM \"CONFIRMAR SOLICITAÇÃO\"",
    "                   ↓",
    "SISTEMA GERA O PAYLOAD FORMATADO",
    "                   ↓",
    "REDIRECIONA PARA O WHATSAPP (+ " + cleanPhone + ")",
    "                   ↓",
    "A EQUIPE DA " + nome.toUpperCase() + " RECEBE A COMANDA E INICIA O ATENDIMENTO",
    blockEnd,
    "",
    "---",
    "",
    "## 28. DIFERENCIAL DE ENGENHARIA: IMPORTAÇÃO EM MASSA",
    "- Estrutura pronta para importação via CSV ou JSON com os campos: `categoria;nome;descricao;preco;foto_url;status`.",
    "",
    "---",
    "",
    "# PROMPT FINAL PARA DESENVOLVIMENTO FULL-STACK (COPIAR E COLAR NA IA)",
    waBlockStart,
    "Crie uma aplicação web completa de altíssimo padrão (nível de projeto comercial de R$ 90.000) para a empresa \"" + nome + "\", atuante em " + nicho + " na cidade de " + cidade + ".",
    "",
    "A aplicação deve ser mobile-first, moderna, responsiva e conter:",
    "1. ÁREA PÚBLICA DO CLIENTE:",
    "   - Header fixo com logo, status de atendimento ao vivo, busca inteligente, badge real do Google Maps (★ " + nota + " com " + reviews + " avaliações) e botão de carrinho/solicitação.",
    "   - Banner hero impactante com proposta de valor, botão de ação e imagens em alta definição.",
    "   - Navegação por categorias horizontal suave com âncoras ativas.",
    "   - Catálogo com itens reais do nicho, fotos 1:1, especificações detalhadas e preços em R$.",
    "   - Modal de personalização com lógica de limites mínimos e máximos de seleção e adicionais com cálculo automático.",
    "   - Carrinho persistente no LocalStorage, aplicação de cupom e resumo de valores.",
    "   - Checkout completo com escolha de atendimento (Domicílio vs Presencial), dados do cliente e forma de pagamento (PIX com botão copiar chave, Cartão na maquininha, Dinheiro com cálculo de troco).",
    "   - Finalização com redirecionamento direto para o WhatsApp (+ " + cleanPhone + ") gerando a comanda com emojis e dados completos.",
    "",
    "2. PAINEL ADMINISTRATIVO (/admin com autenticação):",
    "   - Dashboard gerencial com faturamento, pedidos e métricas do dia.",
    "   - Módulo de vitrine rápida para ativar/pausar produtos em 1 clique.",
    "   - CRUD completo de produtos, categorias, adicionais e cupons.",
    "   - Histórico de pedidos recebidos.",
    "",
    "Stack Obrigatória: React 19 + TypeScript + Tailwind CSS + shadcn/ui + Supabase (tabelas completas com chaves primárias/estrangeiras e RLS).",
    "Cores do projeto: Primária (" + arch.palette.primary + "), Fundo (" + arch.palette.bg + "), Texto (" + arch.palette.text + ").",
    "Entregue o código completo, funcional e sem textos genéricos.",
    blockEnd
  ];

  return sections.join("\n");
}

// ============================================================
// GERAÇÃO DE PROMPTS COM CHATGPT / IA (PADRÃO SOFTWARE HOUSE R$ 90.000+)
// ============================================================

export const CHATGPT_PROMPT_ENGINEER_SYSTEM_PROMPT = `Você é um Diretor de Arte e UI/UX Designer de altíssima conversão, especialista em criar Landing Pages Premium (Single Page Applications) que convertem visitantes em clientes de alto valor.
Sua missão inegociável é analisar a empresa real e gerar um PROMPT MESTRE DE DESENVOLVIMENTO FRONT-END focado na criação de uma Landing Page impecável, elegante e persuasiva, baseada na melhor estrutura de alta conversão do mercado.

O PROMPT GERADO POR VOCÊ DEVE INSTRUIR A IA CONSTRUTORA (Google Stitch, Claude, v0) A CRIAR EXATAMENTE A SEGUINTE ESTRUTURA ESTRATÉGICA (ADAPTADA AO NICHO DA EMPRESA):

1. HEADER PROFISSIONAL: Logo ou Nome da empresa, Menu de navegação (Benefícios, Serviços, Equipe, Contato), botão CTA em destaque para o WhatsApp e informações rápidas no topo (telefone/horário).
2. HERO SECTION DE ALTO IMPACTO: Título principal persuasivo focado na dor/desejo do cliente (Ex: "Seu sorriso merece mais do que um tratamento. Merece cuidado." ou "Estética automotiva que devolve o brilho de fábrica."). Subtítulo detalhando o serviço. Prova social explícita (★ 4.9 no Google Maps). Dois botões: CTA Principal com ícone de agendamento e CTA Secundário mais brando. Imagem profissional premium à direita da tela.
3. POR QUE ESCOLHER A [NOME DA EMPRESA]?: Seção de diferenciais/benefícios com 3 a 4 cards arredondados (Ex: Tecnologia Digital, Atendimento Humanizado, Materiais Premium). Fundo da seção em tom pastel suave ou branco.
4. SOLUÇÕES/SERVIÇOS INTEGRADAS: Catálogo de serviços/produtos principais do nicho (Ex: Implantes, Alinhadores // ou // Polimento, Lavagem, etc.). Cards estilizados contendo: foto real do serviço, título forte, descrição curta (e preço quando viável) e botão de ação ("Saber mais" ou "Agendar").
5. SEÇÃO DE DESTAQUE (HIGHLIGHT) - FUNDO DARK: Bloco de alto contraste com fundo em cor forte/institucional (ex: Azul Escuro, Preto, Vinho). Imagem grande de um lado, e do outro um texto marcante resolvendo uma dor profunda do cliente, seguido por um checklist de benefícios com ícones de "check" e um botão chamativo verde de WhatsApp.
6. CONHEÇA NOSSA ESTRUTURA / GALERIA: Cards horizontais amplos ou grid elegante com fotos reais do ambiente físico da empresa (recepção, equipamentos, atendimento), transmitindo muito conforto e autoridade de marca.
7. PROFISSIONAL & EQUIPE: Foto circular ou perfil do(a) profissional responsável/equipe, nome, especialidade, registro profissional (se aplicável), breve biografia e lista de credenciais acadêmicas ou experiência.
8. VEJA A DIFERENÇA NA PRÁTICA: Seção focada em resultados concretos. Pode ser um slider de Antes/Depois visualmente elegante ou depoimentos reais detalhados de clientes para gerar máxima confiança.
9. RESERVE SUA AVALIAÇÃO / FORMULÁRIO DE CAPTAÇÃO: Seção lateral dividida (Split-screen). Esquerda: Textos persuasivos de convencimento com ícones garantindo rapidez ("Avaliação rápida e sem compromisso"). Direita: Formulário limpo (Nome, Telefone, Motivo) envolto em um card flutuante, acompanhado de um botão verde bem visível chamando para o WhatsApp. Fundo escuro com a cor da marca.
10. NOSSA LOCALIZAÇÃO & FOOTER: Endereço completo formatado em bloco, mapa incorporado ou simulação de rotas, horário de funcionamento detalhado e canais de contato. Rodapé completo com logo, links rápidos, política de privacidade, CNPJ e Direitos Autorais.

PROIBIÇÃO TERMINAL DE CONTEÚDO GENÉRICO:
- NUNCA use textos clichês como "soluções sob medida" ou "qualidade garantida". Crie copywriting persuasivo real e específico do nicho.
- Você deve INVENTAR nomes de serviços, tratamentos e descrições técnicas perfeitamente coerentes com o nicho para o prompt.
- Não use "Lorem Ipsum".
- O prompt gerado deve OBRIGAR a IA construtora a gerar um código React/Tailwind CSS em um arquivo único completo (Single Page), aplicando tipografia limpa, sombras suaves (shadow-lg), bordas arredondadas (rounded-xl) e um design moderno.

RETORNE APENAS O TEXTO DO PROMPT GERADO, PRONTO PARA SER USADO DIRETAMENTE NO GOOGLE STITCH MCP, CLAUDE OU CHATGPT. SEM INTRODUÇÕES OU CONCLUSÕES FORA DO PROMPT.`;

/**
 * Monta a diretiva enviada para o ChatGPT criar o prompt mestre do negócio
 */
export function buildAiPromptGeneratorDirective(leadOrData = {}, archetypeOverride = null, customDirectives = "") {
  const nome = (leadOrData.nome && leadOrData.nome !== "Sem Nome" ? leadOrData.nome : "Empresa").trim();
  const nicho = leadOrData.nicho || "Serviços Especializados";
  const cidade = leadOrData.cidade && leadOrData.cidade !== "Sem cidade" ? leadOrData.cidade : "Brasil";
  const nota = leadOrData.nota && Number(leadOrData.nota) > 0 ? Number(leadOrData.nota).toFixed(1) : "4.9";
  const reviews = leadOrData.reviews && Number(leadOrData.reviews) > 0 ? leadOrData.reviews : 42;
  const whatsapp = leadOrData.whatsapp ? leadOrData.whatsapp.replace(/\D/g, "") : "5511999999999";
  const cleanPhone = whatsapp.startsWith("55") ? whatsapp : "55" + whatsapp;
  const endereco = leadOrData.endereco || leadOrData.address || (cidade + ", Brasil");

  let instagram = leadOrData.instagram || "";
  if (!instagram && leadOrData.site && leadOrData.site.includes("instagram.com")) {
    const match = leadOrData.site.match(/instagram\.com\/([a-zA-Z0-9_.-]+)/i);
    if (match && match[1]) instagram = "@" + match[1];
  }
  if (!instagram) {
    const cleanHandle = nome.toLowerCase().replace(/[^a-z0-9]/g, "");
    instagram = cleanHandle ? ("@" + cleanHandle) : "@empresa";
  }

  return "Crie um PROMPT MESTRE DE DESENVOLVIMENTO DE LANDING PAGE DE ALTA CONVERSÃO para gerar o site da seguinte empresa:\n\n" +
    "DADOS REAIS DO NEGÓCIO:\n" +
    "- Nome Oficial: \"" + nome + "\"\n" +
    "- Segmento / Nicho Específico: \"" + nicho + "\"\n" +
    "- Localização Exata (Endereço Físico): \"" + endereco + "\" (Cidade: \"" + cidade + "\")\n" +
    "- Telefone / WhatsApp para Contato: +" + cleanPhone + "\n" +
    "- Link Direto WhatsApp: https://wa.me/" + cleanPhone + "?text=" + encodeURIComponent("Olá! Gostaria de falar com a equipe da " + nome + " em " + cidade + ".") + "\n" +
    "- Instagram Oficial: " + instagram + " (Link: https://instagram.com/" + instagram.replace("@", "") + ")\n" +
    "- Reputação Google Maps: Nota ★ " + nota + " (" + reviews + " avaliações reais de clientes)\n" +
    "- Site Atual: " + (leadOrData.site || "Não possui site atualmente") + "\n" +
    (customDirectives ? ("\nDIRETRIZES E REQUISITOS ADICIONAIS DO CLIENTE:\n" + customDirectives + "\n") : "") +
    "\nINSTRUÇÕES DE EXECUÇÃO OBRIGATÓRIAS:\n" +
    "- Estruture o prompt detalhando OBRIGATORIAMENTE as 10 seções da Landing Page Premium (Header, Hero, Por Que Escolher, Soluções/Serviços, Destaque Dark, Estrutura, Equipe, Diferença na Prática, Formulário de Avaliação e Localização).\n" +
    "- Adapte TODOS os textos, nomes de serviços e argumentações e copy de vendas explicitamente para o nicho de \"" + nicho + "\", utilizando copy muito persuasivo.\n" +
    "- Exija que a IA construtora crie um código completo com React e Tailwind CSS, componentes modernos, tipografia bem definida e espaçamento generoso.\n" +
    "- Retorne EXCLUSIVAMENTE o texto final do prompt estruturado.";
}

/**
 * Gera o prompt do site usando Inteligência Artificial (ChatGPT / Groq / Gemini).
 * Se a IA falhar ou estiver offline, utiliza o construtor determinístico como fallback seguro.
 */
export async function generateBusinessPromptWithAi(lead, archetypeOverride, customDirectives, createAiCompletionFn) {
  if (typeof createAiCompletionFn === "function") {
    try {
      const userPrompt = buildAiPromptGeneratorDirective(lead, archetypeOverride, customDirectives);
      console.log("[PromptBuilder] 🤖 Gerando especificação PRD Enterprise (R$ 90k) com ChatGPT/IA para " + lead.nome + "...");

      const completion = await createAiCompletionFn({
        messages: [
          { role: "system", content: CHATGPT_PROMPT_ENGINEER_SYSTEM_PROMPT },
          { role: "user", content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 4000
      });

      const aiPrompt = completion.choices[0]?.message?.content?.trim();
      if (aiPrompt && aiPrompt.length > 300) {
        console.log("[PromptBuilder] ✨ Especificação PRD gerada com IA com sucesso (" + aiPrompt.length + " caracteres)!");
        return {
          prompt: aiPrompt,
          isAiGenerated: true
        };
      }
    } catch (err) {
      console.warn("[PromptBuilder] ⚠️ Falha na geração com IA: " + err.message + ". Usando construtor especializado determinístico...");
    }
  }

  // Fallback seguro de nível Enterprise caso a IA não esteja disponível
  const fallbackPrompt = buildSpecializedBusinessPrompt(lead, archetypeOverride, customDirectives);
  return {
    prompt: fallbackPrompt,
    isAiGenerated: false
  };
}
