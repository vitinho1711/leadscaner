/**
 * nicheIntelligence.js
 * Base de inteligência de mercado especializada para geração de sites de alto valor (R$ 800 - R$ 1.500+).
 * Contém psicologia de consumo, dores reais, acervo de serviços específicos, depoimentos, FAQs e CRO por nicho.
 */

export const NICHE_PROFILES = {
  // 1. HAMBURGUERIA & LANCHES
  hamburgueria: {
    aliases: ['hamburguer', 'hamburgueria', 'burger', 'burguer', 'smash', 'snack', 'hot dog', 'dogueria', 'pit dog', 'chapa'],
    nichoLabel: 'Hamburgueria & Lanches Artesanais',
    avatar: 'Clientes buscando burger artesanal suculento, carne fresca, maionese temperada e entrega rápida.',
    problemaCentral: 'Medo de burger frio, carne seca ou sem tempero, demora na entrega e cardápio confuso.',
    objetivoPrincipal: 'Fazer pedido imediato de burgers e combos pelo WhatsApp',
    ctaPrincipal: 'Ver Cardápio & Fazer Pedido',
    ctaSecundario: 'Pedir pelo WhatsApp',
    waMensagem: 'Olá! Vim pelo cardápio digital e gostaria de fazer um pedido para entrega.',
    tomVoz: 'Apetitoso, descontraído, enérgico, focado em carne suculenta grelhada, queijo derretido e entrega rápida.',
    badgeLive: '● Chapa Quente & Entregas Abertas Hoje',
    diretrizesVisuais: {
      modo: 'dark',
      bg: '#0a0b0e',
      surface: '#12141a',
      text: '#f8fafc',
      muted: '#94a3b8',
      border: 'rgba(255, 255, 255, 0.08)',
      primary: '#f59e0b',
      primaryHover: '#d97706',
      accent: '#ff5722',
      accentBg: 'rgba(255, 87, 34, 0.15)',
      accentText: '#ff7043',
      badgeBg: 'rgba(245, 158, 11, 0.15)',
      badgeText: '#fbbf24',
      fontSans: "'Plus Jakarta Sans', sans-serif",
      fontSerif: "'Bricolage Grotesque', sans-serif",
      borderRadius: '20px'
    },
    imagens: {
      hero: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=1400&q=80',
      sobre: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=900&q=80',
      galeria: [
        'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1561758033-d89a9ad46330?auto=format&fit=crop&w=800&q=80'
      ]
    },
    headlinesCRO: [
      'Blends 100% bovinos grelhados no ponto, queijo derretido e entrega rápida na sua porta.',
      'O melhor smash burger artesanal: sabor marcante, maionese da casa e batata crocante.',
      'Fome de verdade pede burger artesanal: suculento, farto e feito na hora.'
    ],
    stats: [
      { valor: '+15.000', rotulo: 'Pedidos Entregues' },
      { valor: '35 min', rotulo: 'Tempo Médio de Entrega' },
      { valor: '★ 4.9', rotulo: 'Avaliação no Google' },
      { valor: '100%', rotulo: 'Carne Bovina Fresca' }
    ],
    servicos: [
      {
        titulo: 'Classic Smash Duplo Bacon',
        desc: '2x smash burgers 90g com crostinha crocante na chapa, queijo cheddar derretido, fatias de bacon artesanal crocante e maionese especial em pão brioche selado.',
        preco: 'R$ 32,90',
        tag: 'Mais Pedido 🏆',
        categoria: 'Burgers',
        icone: 'flame'
      },
      {
        titulo: 'Cheddar Melt Supreme (180g)',
        desc: 'Blend nobre 180g grelhado ao ponto, piscina de creme cheddar artesanal, cebola caramelizada lentamente e cubos crocantes de bacon.',
        preco: 'R$ 36,90',
        tag: 'Favorito da Casa',
        categoria: 'Burgers',
        icone: 'star'
      },
      {
        titulo: 'Combo Smash + Batata + Refri',
        desc: '1 Smash Burger artesanal à escolha + 1 porção individual de batata frita temperada e sequinha + 1 refrigerante lata 350ml gelado.',
        preco: 'R$ 44,90',
        tag: 'Combo Econômico 💥',
        categoria: 'Combos',
        icone: 'zap'
      },
      {
        titulo: 'Batata Rústica com Cheddar & Bacon',
        desc: 'Porção generosa de 400g de batata com corte rústico, temperada com páprica defumada e alecrim, piscina de cheddar cremoso e farofa de bacon.',
        preco: 'R$ 26,90',
        tag: 'Porção',
        categoria: 'Porções',
        icone: 'heart'
      }
    ],
    diferenciais: [
      { titulo: 'Blends 100% Bovinos Frescos', desc: 'Carne moída no dia, sem conservantes, grelhada com crostinha irresistível.' },
      { titulo: 'Entrega Rápida & Lanche Quente', desc: 'Embalagens térmicas desenvolvidas para o burger chegar quentinho e crocante.' },
      { titulo: 'Molhos Artesanais Exclusivos', desc: 'Maionese verde da casa, barbecue artesanal defumado e creme cheddar próprio.' }
    ],
    reviews: [
      { autor: 'Lucas Menezes', texto: 'O melhor hambúrguer que já comi na cidade! A carne é super suculenta, o pão é macio e a maionese verde é um espetáculo.', nota: 5 },
      { autor: 'Juliana Rossi', texto: 'Entrega rápida e veio embalado impecavelmente. Chegou quentinho parecendo que saiu da chapa agora.', nota: 5 },
      { autor: 'Rodrigo Silveira', texto: 'Pedir pelo WhatsApp foi super simples e prático. O burger duplo com bacon é sensacional!', nota: 5 }
    ],
    faq: [
      { pergunta: 'Qual é o tempo médio de entrega?', resposta: 'Nosso tempo médio de entrega é de 30 a 45 minutos dependendo do bairro.' },
      { pergunta: 'Quais as formas de pagamento aceitas?', resposta: 'Aceitamos Pix, cartões de crédito e débito na entrega, além de dinheiro com troco.' },
      { pergunta: 'É possível personalizar os ingredientes do burger?', resposta: 'Sim! No momento do pedido pelo WhatsApp você pode solicitar alterações como retirar cebola, molho à parte ou adicionar adicionais.' }
    ]
  },

  // 2. PIZZARIA & FORNO A LENHA
  pizzaria: {
    aliases: ['pizza', 'pizzaria', 'calzone', 'forno a lenha', 'pizzas', 'pizzaria delivery'],
    nichoLabel: 'Pizzaria & Forno a Lenha Artesanal',
    avatar: 'Famílias e amigos reunidos buscando pizza quentinha com massa de fermentação lenta, queijo derretido e entrega rápida.',
    problemaCentral: 'Medo de pizza borrachuda, borda ressecada, ingredientes de baixa qualidade e entrega fria ou revirada.',
    objetivoPrincipal: 'Fazer pedido de pizzas tradicionais e especiais pelo WhatsApp',
    ctaPrincipal: 'Ver Cardápio de Pizzas & Pedir',
    ctaSecundario: 'Pedir Pizza no WhatsApp',
    waMensagem: 'Olá! Vim pelo site da pizzaria e gostaria de fazer um pedido para entrega.',
    tomVoz: 'Aconchegante, apetitoso, focado na tradição da massa italiana, no queijo borbulhante e no momento em família.',
    badgeLive: '● Forno a Lenha Aceso & Entregas Rápidas',
    diretrizesVisuais: {
      modo: 'dark',
      bg: '#0c0a09',
      surface: '#1c1917',
      text: '#fafaf9',
      muted: '#a8a29e',
      border: 'rgba(239, 68, 68, 0.2)',
      primary: '#ef4444', // Vermelho Molho de Tomate Rústico
      primaryHover: '#dc2626',
      accent: '#f59e0b', // Dourado Forno / Queijo
      accentBg: 'rgba(239, 68, 68, 0.15)',
      accentText: '#fca5a5',
      badgeBg: 'rgba(245, 158, 11, 0.15)',
      badgeText: '#fde047',
      fontSans: "'Plus Jakarta Sans', sans-serif",
      fontSerif: "'Playfair Display', serif",
      borderRadius: '20px'
    },
    imagens: {
      hero: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1400&q=80',
      sobre: 'https://images.unsplash.com/photo-1579751626657-72bc17010498?auto=format&fit=crop&w=900&q=80',
      galeria: [
        'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=800&q=80'
      ]
    },
    headlinesCRO: [
      'Pizzas artesanais com fermentação lenta de 48h, molho de tomate rústico e forno a lenha.',
      'A verdadeira pizza com massa leve, crocante por fora e macia por dentro entregue quentinha.',
      'Sua noite de pizza inesquecível: ingredientes selecionados e queijo gratinado de verdade.'
    ],
    stats: [
      { valor: '+20.000', rotulo: 'Pizzas Assadas no Forno' },
      { valor: '48 Horas', rotulo: 'Fermentação Lenta Natural' },
      { valor: '★ 4.9', rotulo: 'Avaliações no Google' },
      { valor: '100% Lenha', rotulo: 'Sabor Defumado Autêntico' }
    ],
    servicos: [
      {
        titulo: 'Pizzas Especiais da Casa (Grandes)',
        desc: 'Sabores autorais com muçarela de búfala, presunto parma, cogumelos salteados, alho poró e queijo brie com geleia de pimenta.',
        preco: 'A partir de R$ 58,90',
        tag: 'Mais Pedida 🏆',
        icone: 'star'
      },
      {
        titulo: 'Pizzas Tradicionais Clássicas',
        desc: 'Calabresa artesanal com cebola roxa, Frango com Catupiry legítimo, Quatro Queijos nobres e Margherita com manjericão fresco.',
        preco: 'A partir de R$ 46,90',
        tag: 'Clássicos Favoritos',
        icone: 'flame'
      },
      {
        titulo: 'Bordas Vulcânicas Artesanais',
        desc: 'Recheios generosos de Catupiry original, Cheddar cremoso, Cream Cheese Philadelphia ou Chocolate ao Leite.',
        preco: 'R$ 14,90',
        tag: 'Opcional Irresistível',
        icone: 'heart'
      },
      {
        titulo: 'Pizzas Doces Gourmet',
        desc: 'Massa fina crocante coberta com chocolate nobre belga, morangos frescos, Nutella pura com leite Ninho e banana com canela e doce de leite.',
        preco: 'A partir de R$ 38,90',
        tag: 'Sobremesa Imperdível',
        icone: 'gift'
      }
    ],
    diferenciais: [
      { titulo: 'Massa com Fermentação Lenta de 48h', desc: 'Muito mais leve e digestiva. Você come sem aquela sensação de estômago pesado.' },
      { titulo: 'Molho de Tomate Pelati Italiano', desc: 'Feito artesanalmente com tomates selecionados, azeite extravirgem e ervas frescas.' },
      { titulo: 'Forno a Lenha de Alta Temperatura', desc: 'Cozimento rápido a mais de 400°C que mantém o recheio suculento e a massa crocante.' }
    ],
    reviews: [
      { autor: 'Fernando Diniz', texto: 'A melhor pizza da cidade! A massa é leve, não pesa no estômago e o recheio é muito farto e saboroso.', nota: 5 },
      { autor: 'Camila Albuquerque', texto: 'Pedimos para o aniversário da minha filha e foi um sucesso total. Chegou super rápida e quentinha.', nota: 5 },
      { autor: 'Marcos Vinicius', texto: 'O Catupiry é original mesmo, nada daquele amido barato. E a borda recheada é uma loucura de boa!', nota: 5 }
    ],
    faq: [
      { pergunta: 'Posso pedir pizza meio a meio?', resposta: 'Sim! Nossas pizzas grandes podem ser montadas com até 2 sabores diferentes.' },
      { pergunta: 'A massa é feita na hora?', resposta: 'Nossa massa descansa por 48 horas em processo de maturação e é aberta à mão no momento do pedido.' },
      { pergunta: 'Qual a média de tempo do delivery?', resposta: 'Entregamos em média entre 35 e 50 minutos nos bairros atendidos.' }
    ]
  },

  // 3. CONFEITARIA & DOCERIA
  confeitaria_doceria: {
    aliases: ['confeitaria', 'doceria', 'bolo', 'bolos', 'torta', 'tortas', 'brigadeiro', 'doces', 'docinhos', 'cupcake', 'confeiteira'],
    nichoLabel: 'Confeitaria Fina & Doceria Artesanal',
    avatar: 'Pessoas buscando bolos artísticos, doces nobres para aniversários, casamentos ou sobremesas afetivas para o final de semana.',
    problemaCentral: 'Medo de bolo seco, recheio enjoativo ou com gosto artificial, atraso na entrega da encomenda e decoração diferente da foto.',
    objetivoPrincipal: 'Fazer encomendas de bolos decorados e doces pelo WhatsApp',
    ctaPrincipal: 'Ver Cardápio & Fazer Encomenda',
    ctaSecundario: 'Encomendar pelo WhatsApp',
    waMensagem: 'Olá! Vim pelo site da confeitaria e gostaria de conhecer as opções de bolos e doces para encomenda.',
    tomVoz: 'Doce, afetuoso, elegante, focado em sabor inesquecível, memórias de infância e celebrações marcantes.',
    badgeLive: '● Fornada & Produção Artesanal Ativa',
    diretrizesVisuais: {
      modo: 'light',
      bg: '#fdf8f6',
      surface: '#ffffff',
      text: '#291b22',
      muted: '#6e5d66',
      border: 'rgba(219, 39, 119, 0.12)',
      primary: '#be185d', // Rosa Framboesa Fino
      primaryHover: '#9d174d',
      accent: '#f472b6',
      accentBg: '#fce7f3',
      accentText: '#9d174d',
      badgeBg: '#fdf2f8',
      badgeText: '#be185d',
      fontSans: "'Plus Jakarta Sans', sans-serif",
      fontSerif: "'Playfair Display', serif",
      borderRadius: '24px'
    },
    imagens: {
      hero: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=1400&q=80',
      sobre: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=900&q=80',
      galeria: [
        'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1535141192574-5d4897c13136?auto=format&fit=crop&w=800&q=80'
      ]
    },
    headlinesCRO: [
      'Bolos artísticos e doces finos que transformam qualquer comemoração em um momento inesquecível.',
      'Receitas autorais com chocolate nobre, frutas frescas e equilíbrio perfeito de açúcar.',
      'O sabor marcante e o acabamento impecável que seus convidados vão elogiar.'
    ],
    stats: [
      { valor: '+3.500', rotulo: 'Bolos & Festas Entregues' },
      { valor: '100% Nobre', rotulo: 'Chocolates & Ingredientes Puros' },
      { valor: '★ 5.0', rotulo: 'Nota de Avaliação no Google' },
      { valor: '0 Conservante', rotulo: 'Produção 100% Fresca do Dia' }
    ],
    servicos: [
      {
        titulo: 'Bolos Artísticos & Personalizados',
        desc: 'Massa fofinha umedecida na medida, recheios generosos trufados e acabamentos modernos em buttercream ou chantininho para aniversários e casamentos.',
        tag: 'Mais Pedido 🎂',
        icone: 'cake'
      },
      {
        titulo: 'Doces Finos & Mesa de Celebração',
        desc: 'Brigadeiros gourmet de pistache, ninho com Nutella, bombons belgas banhados e camafeus de nozes para eventos elegantes.',
        tag: 'Especialidade',
        icone: 'gift'
      },
      {
        titulo: 'Tortas de Vitrine & Sobremesas',
        desc: 'Banoffee artesanal com doce de leite caseiro, Cheesecake de frutas vermelhas e Torta Holandesa com ganache pura.',
        tag: 'Sobremesa de Domingo',
        icone: 'sparkles'
      },
      {
        titulo: 'Caixas Presenteáveis & Pronta Entrega',
        desc: 'Kits especiais com fita de cetim, brownies recheados, palhas italianas e fatias de bolo para presentear com carinho.',
        tag: 'Presente Afetivo',
        icone: 'heart'
      }
    ],
    diferenciais: [
      { titulo: 'Chocolates Nobres e Puros', desc: 'Trabalhamos exclusivamente com chocolate de alta qualidade, sem gordura hidrogenada.' },
      { titulo: 'Pontualidade na Encomenda', desc: 'Sua festa não pode esperar: entregamos seu bolo no dia e horário combinado sem imprevistos.' },
      { titulo: 'Personalização Exclusiva', desc: 'Design sob medida alinhado à paleta e ao tema da sua comemoração.' }
    ],
    reviews: [
      { autor: 'Beatriz Vasconcelos', texto: 'O bolo de aniversário do meu filho ficou impecável! Lindo por fora e incrivelmente molhadinho e saboroso por dentro.', nota: 5 },
      { autor: 'Renata Prado', texto: 'Os brigadeiros gourmet foram o comentário da festa toda. Não sobrou nem um para contar história!', nota: 5 },
      { autor: 'Marcelo Siqueira', texto: 'A banoffee é simplesmente a melhor que já comi. Doce na medida certa, sem ser enjoativa.', nota: 5 }
    ],
    faq: [
      { pergunta: 'Com quanto tempo de antecedência devo encomendar?', resposta: 'Para bolos personalizados e doces finos, recomendamos antecedência mínima de 3 a 5 dias. Para pronta entrega consulte o dia!' },
      { pergunta: 'Como é feito o cálculo do peso do bolo?', resposta: 'Calculamos em média 100g a 120g de bolo por convidado para garantir que todos sejam bem servidos.' },
      { pergunta: 'Vocês fazem entregas em domicílio?', resposta: 'Sim, realizamos entrega climatizada e segura para garantir que o bolo chegue 100% perfeito.' }
    ]
  },

  // 4. RESTAURANTE & GASTRONOMIA
  restaurante_gastronomia: {
    aliases: ['restaurante', 'churrascaria', 'bistrô', 'bistro', 'buffet', 'self-service', 'comida caseira', 'gastronomia', 'marmitaria', 'marmita', 'almoço'],
    nichoLabel: 'Restaurante & Gastronomia de Sabor Afetuoso',
    avatar: 'Pessoas e famílias buscando almoço caseiro caprichado, cortes nobres na brasa ou refeições saborosas para o dia a dia.',
    problemaCentral: 'Comida com gosto industrial, tempero fraco, porção pequena e demora no atendimento da mesa ou delivery.',
    objetivoPrincipal: 'Ver cardápio do dia e fazer reservas ou pedidos pelo WhatsApp',
    ctaPrincipal: 'Ver Cardápio & Reservar Mesa',
    ctaSecundario: 'Pedir Marmitex / Delivery',
    waMensagem: 'Olá! Vim pelo site do restaurante e gostaria de consultar o cardápio e fazer um pedido/reserva.',
    tomVoz: 'Acolhedor, caseiro, generoso, focado em pratos bem servidos, carinho no preparo e ingredientes da roça.',
    badgeLive: '● Cozinha Aberta & Pratos do Dia Servidos',
    diretrizesVisuais: {
      modo: 'light',
      bg: '#faf6f0',
      surface: '#ffffff',
      text: '#22150c',
      muted: '#6c584c',
      border: 'rgba(154, 52, 18, 0.12)',
      primary: '#9a3412', // Terracota Cozinha da Roça
      primaryHover: '#7c2d12',
      accent: '#ea580c',
      accentBg: '#ffedd5',
      accentText: '#9a3412',
      badgeBg: '#fef3c7',
      badgeText: '#92400e',
      fontSans: "'Plus Jakarta Sans', sans-serif",
      fontSerif: "'Playfair Display', serif",
      borderRadius: '22px'
    },
    imagens: {
      hero: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1400&q=80',
      sobre: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=900&q=80',
      galeria: [
        'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80'
      ]
    },
    headlinesCRO: [
      'Comida de verdade feita com tempero caseiro fresco, ingredientes da terra e afeto em cada prato.',
      'Almoço farto, carnes suculentas e receitas tradicionais servidas quentinhas para você e sua família.',
      'O endereço do sabor autêntico: porções generosas e ambiente acolhedor.'
    ],
    stats: [
      { valor: '+50.000', rotulo: 'Refeições Servidas' },
      { valor: '100% Fresco', rotulo: 'Ingredientes e Temperos do Dia' },
      { valor: '★ 4.9', rotulo: 'Avaliação no Google' },
      { valor: 'Família', rotulo: 'Ambiente Confortável & Climatizado' }
    ],
    servicos: [
      {
        titulo: 'Pratos Executivos & Almoço do Dia',
        desc: 'Comida caseira com arroz soltinho, feijão com tempero da roça, farofa crocante e cortes nobres grelhados na hora.',
        tag: 'Mais Pedido 🍛',
        icone: 'star'
      },
      {
        titulo: 'Grelhados Nobres & Carnes na Brasa',
        desc: 'Picanha fatiada, filé mignon ao molho madeira, costela suculenta desmanchando e frango grelhado marinado.',
        tag: 'Churrasco Especial',
        icone: 'flame'
      },
      {
        titulo: 'Marmitex Executivo para Entrega Rápida',
        desc: 'Embalagens seladas com divisórias térmicas que mantêm a comida quentinha e organizada até chegar à sua mesa.',
        tag: 'Delivery Express',
        icone: 'truck'
      },
      {
        titulo: 'Reservas para Eventos & Almoços em Família',
        desc: 'Espaço reservado para aniversários, reuniões de equipe e comemorações com cardápios especiais sob medida.',
        tag: 'Eventos & Grupos',
        icone: 'users'
      }
    ],
    diferenciais: [
      { titulo: 'Tempero Natural Sem Conservantes', desc: 'Alho fresco, cebola, cheiro verde da horta e caldo artesanal em todas as receitas.' },
      { titulo: 'Porções Generosas e Preço Justo', desc: 'Pratos bem servidos para saciar de verdade com excelente custo-benefício.' },
      { titulo: 'Atendimento Rápido e Gentil', desc: 'Equipe pronta para receber você e sua família com sorriso e atenção.' }
    ],
    reviews: [
      { autor: 'Claudio Barreto', texto: 'Comida com gosto de comida de mãe! Feijão bem temperado e a carne super macia. Almoço aqui quase todo dia.', nota: 5 },
      { autor: 'Patricia Morais', texto: 'O delivery chegou em 25 minutos, comida fumegando e porção muito farta. Virei cliente fiel.', nota: 5 },
      { autor: 'Guilherme Toledo', texto: 'Ambiente muito agradável para ir com a família no domingo. Atendimento nota 10.', nota: 5 }
    ],
    faq: [
      { pergunta: 'Qual o horário de funcionamento do restaurante?', resposta: 'Nosso restaurante serve almoço de terça a domingo das 11h às 15h, e jantar às sextas e sábados das 18h às 23h.' },
      { pergunta: 'Vocês têm opções vegetarianas no cardápio?', resposta: 'Sim, oferecemos saladas frescas selecionadas, legumes grelhados na brasa, massas caseiras e omeletes.' },
      { pergunta: 'Como fazer reserva de mesa para aniversários?', resposta: 'Basta nos enviar uma mensagem no WhatsApp com a data, horário e quantidade de pessoas que reservamos para você!' }
    ]
  },

  // 5. BARBEARIA & ESTILO MASCULINO
  barbearia: {
    aliases: ['barbearia', 'barbeiro', 'barba', 'corte masculino', 'barbershop', 'navalha', 'fade', 'degradê', 'corte de cabelo masculino'],
    nichoLabel: 'Barbearia Clássica & Estilo Masculino',
    avatar: 'Homens que prezam pelo visual alinhado, corte degradê impecável, barba bem desenhada e um ambiente descontraído.',
    problemaCentral: 'Medo de corte torto, pezinho mal feito, irritação na pele pós-barba, fila de espera demorada e barbeiro desatento.',
    objetivoPrincipal: 'Agendar horário de cabelo e barba pelo WhatsApp',
    ctaPrincipal: 'Agendar Horário no WhatsApp',
    ctaSecundario: 'Ver Cortes & Estilos',
    waMensagem: 'Olá! Vim pelo site da barbearia e gostaria de agendar um horário para corte/barba.',
    tomVoz: 'Masculino, confiante, direto, com atmosfera de cerveja gelada, navalha afiada e respeito à tradição.',
    badgeLive: '● Cadeiras Livres & Agenda Aberta Hoje',
    diretrizesVisuais: {
      modo: 'dark',
      bg: '#0f1015',
      surface: '#181920',
      text: '#f8fafc',
      muted: '#94a3b8',
      border: 'rgba(217, 119, 6, 0.25)',
      primary: '#d97706', // Âmbar Couro / Madeira Nobre
      primaryHover: '#b45309',
      accent: '#f59e0b',
      accentBg: 'rgba(217, 119, 6, 0.15)',
      accentText: '#fcd34d',
      badgeBg: 'rgba(217, 119, 6, 0.12)',
      badgeText: '#fbbf24',
      fontSans: "'Plus Jakarta Sans', sans-serif",
      fontSerif: "'Cinzel', serif",
      borderRadius: '16px'
    },
    imagens: {
      hero: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=1400&q=80',
      sobre: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&w=900&q=80',
      galeria: [
        'https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&w=800&q=80'
      ]
    },
    headlinesCRO: [
      'Corte degradê navalhado perfeito, alinhamento de barba e a experiência que você merece.',
      'Sua imagem é seu cartão de visitas: barba feita na toalha quente e acabamento milimétrico.',
      'Mais que um corte: um momento para relaxar, tomar uma cerveja gelada e renovar a autoestima.'
    ],
    stats: [
      { valor: '+8.000', rotulo: 'Cortes & Barbas Realizados' },
      { valor: '★ 4.9', rotulo: 'Avaliação Máxima no Google' },
      { valor: 'Zero Fila', rotulo: 'Agendamento com Horário Marcado' },
      { valor: 'Toalha Quente', rotulo: 'Protocolo Anti-Irritação de Pele' }
    ],
    servicos: [
      {
        titulo: 'Corte Degradê / Fade & Freestyle',
        desc: 'Técnicas de fade (low, mid, high taper fade) com transição milimétrica suave, texturização superior e pezinho navalhado sem falhas.',
        tag: 'Mais Pedido 💈',
        icone: 'scissors'
      },
      {
        titulo: 'Barboterapia com Toalha Quente & Ozônio',
        desc: 'Abertura dos poros com vapor de ozônio e toalha aquecida, massagem facial com óleos nobres, navalhete descartável e pós-barba refrescante.',
        tag: 'Experiência VIP',
        icone: 'sparkles'
      },
      {
        titulo: 'Combo Completo: Cabelo + Barba + Sobrancelha',
        desc: 'Transformação visual total com alinhamento facial completo, lavagem relaxante dos fios e finalização com pomada modeladora matte.',
        tag: 'Melhor Custo-Benefício',
        icone: 'star'
      },
      {
        titulo: 'Pigmentação & Camuflagem de Fios Brancos',
        desc: 'Técnica natural para disfarçar falhas na barba ou cabelo branco sem deixar visual pesado ou artificial.',
        tag: 'Estilo & Rejuvenescimento',
        icone: 'shield'
      }
    ],
    diferenciais: [
      { titulo: 'Horário Marcado Sem Espera', desc: 'Respeito ao seu tempo: você senta na cadeira pontualmente no horário agendado.' },
      { titulo: 'Lâminas Descartáveis & Esterilização', desc: 'Biossegurança total com material descartável de uso único para cada cliente.' },
      { titulo: 'Ambiente com Cerveja & Café Cortesia', desc: 'Espaço climatizado com música boa, sinuca, café expresso e cerveja bem gelada.' }
    ],
    reviews: [
      { autor: 'Diego Furtado', texto: 'Melhor barbearia da região disparada! O fade fica impecável e a barboterapia é relaxamento puro.', nota: 5 },
      { autor: 'Arthur Silveira', texto: 'Pontualidade britânica! Agendei às 14h, sentei na cadeira às 14h. Barbeiros muito técnicos e simpáticos.', nota: 5 },
      { autor: 'Leonardo Castro', texto: 'Atendimento de primeira, cerveja gelada e o corte durou alinhado muito mais tempo que em outros lugares.', nota: 5 }
    ],
    faq: [
      { pergunta: 'Preciso agendar com antecedência?', resposta: 'Trabalhamos preferencialmente com horário marcado pelo WhatsApp para evitar filas, mas encaixes no dia são bem-vindos!' },
      { pergunta: 'Quanto tempo dura o atendimento completo (corte + barba)?', resposta: 'Nosso atendimento completo dura em média de 45 a 60 minutos de muito capricho e relaxamento.' },
      { pergunta: 'Quais produtos vocês usam na finalização?', resposta: 'Utilizamos apenas pomadas e óleos de barba premium com ação hidratante e fixação de alta durabilidade.' }
    ]
  },

  // 6. SALÃO DE BELEZA & ESTÉTICA FEMININA
  salao_estetica: {
    aliases: ['salão', 'salao', 'cabelo', 'cabeleireir', 'estética', 'estetica', 'unha', 'manicure', 'sobrancelha', 'make', 'maquiagem', 'spa', 'depilação', 'lash', 'alongamento de unhas', 'loira', 'mechas'],
    nichoLabel: 'Salão de Beleza & Estética Avançada',
    avatar: 'Mulheres buscando realçar sua beleza natural, cuidar dos cabelos com produtos nobres, fazer unhas perfeitas e relaxar.',
    problemaCentral: 'Medo de cabelo quebrado por química agressiva, mechas manchadas, atraso nos horários e atendimento impessoal.',
    objetivoPrincipal: 'Agendar horário para procedimentos ou avaliação no WhatsApp',
    ctaPrincipal: 'Agendar Horário VIP',
    ctaSecundario: 'Ver Transformações no WhatsApp',
    waMensagem: 'Olá! Vim pelo site e gostaria de consultar horários disponíveis para agendamento.',
    tomVoz: 'Sofisticado, elegante, acolhedor, focado em autocuidado, bem-estar e elevação da autoestima feminina.',
    badgeLive: '● Horários Especiais para Esta Semana',
    diretrizesVisuais: {
      modo: 'light',
      bg: '#faf6f5',
      surface: '#ffffff',
      text: '#291b22',
      muted: '#6e5d66',
      border: 'rgba(219, 39, 119, 0.1)',
      primary: '#9d174d', // Rose Chic Profundo
      primaryHover: '#831843',
      accent: '#db2777',
      accentBg: '#fce7f3',
      accentText: '#9d174d',
      badgeBg: '#fae8ff',
      badgeText: '#86198f',
      fontSans: "'Plus Jakarta Sans', sans-serif",
      fontSerif: "'Playfair Display', serif",
      borderRadius: '24px'
    },
    imagens: {
      hero: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1400&q=80',
      sobre: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=900&q=80',
      galeria: [
        'https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?auto=format&fit=crop&w=800&q=80'
      ]
    },
    headlinesCRO: [
      'Revele sua beleza autêntica com protocolos capilares de elite e atendimento acolhedor.',
      'Loiros saudáveis, mechas iluminadas e tratamentos que recuperam a força e o brilho dos seus fios.',
      'O momento de relaxamento e transformação visual que você merece viver.'
    ],
    stats: [
      { valor: '+10.000', rotulo: 'Mulheres Transformadas' },
      { valor: 'Marcas Top', rotulo: 'L’Oréal, Wella & Kérastase' },
      { valor: '★ 4.9', rotulo: 'Avaliação no Google' },
      { valor: 'Visagismo', rotulo: 'Cortes & Tons Personalizados' }
    ],
    servicos: [
      {
        titulo: 'Mechas Criativas & Morena Iluminada',
        desc: 'Clareamento seguro com proteção de fibra Plex, criando nuances personalizadas que harmonizam perfeitamente com seu tom de pele.',
        tag: 'Destaque 👑',
        icone: 'sparkles'
      },
      {
        titulo: 'Cronograma de Alta Nutrição & Reconstrução',
        desc: 'Recuperação intensiva de fios elásticos e porosos com ativos nobres, devolvendo massa, maleabilidade e brilho espelhado.',
        tag: 'Saúde Capilar',
        icone: 'heart'
      },
      {
        titulo: 'Unhas em Gel, Fibra de Vidro & Manicure Russa',
        desc: 'Alongamento resistente com curvatura natural, cutilagem profunda impecável e esmaltação duradoura que não descasca.',
        tag: 'Durabilidade',
        icone: 'star'
      },
      {
        titulo: 'Nanoblading & Harmonização do Olhar',
        desc: 'Desenho milimétrico fio a fio para preencher falhas e valorizar a expressividade do seu olhar com total naturalidade.',
        tag: 'Estética Facial',
        icone: 'eye'
      }
    ],
    diferenciais: [
      { titulo: 'Avaliação com Teste de Mecha', desc: 'Saúde do seu cabelo em primeiro lugar: checamos a resistência dos fios antes de qualquer química.' },
      { titulo: 'Produtos Originais de Linha Premium', desc: 'Trabalhamos apenas com cosméticos profissionais reconhecidos internacionalmente.' },
      { titulo: 'Ambiente Climatizado com Café Especial', desc: 'Espaço pensado para você desconectar da rotina com todo o carinho e conforto.' }
    ],
    reviews: [
      { autor: 'Mariana Duarte', texto: 'Fiz minhas mechas e o resultado superou todas as expectativas! Meu cabelo clareou sem emborrachar nadinha.', nota: 5 },
      { autor: 'Larissa Esteves', texto: 'Equipe super atenciosa, espaço lindo e o cafezinho é maravilhoso. Minhas unhas em fibra duram o mês todo.', nota: 5 },
      { autor: 'Fernanda Peixoto', texto: 'Salão de altíssimo padrão com preço justo pelo serviço entregue. Indico de olhos fechados!', nota: 5 }
    ],
    faq: [
      { pergunta: 'O salão realiza teste de mecha antes de descolorir?', resposta: 'Sim, o teste de mecha é obrigatório e gratuito para garantir a integridade total do seu cabelo.' },
      { pergunta: 'Qual a durabilidade da manutenção do alongamento de unhas?', resposta: 'Recomendamos manutenção periódica a cada 20 a 25 dias para manter as unhas fortes e intactas.' },
      { pergunta: 'É possível parcelar procedimentos de mechas?', resposta: 'Sim, parcelamos procedimentos químicos em até 6x sem juros no cartão de crédito.' }
    ]
  },

  // 7. ODONTOLOGIA & ESTÉTICA DO SORRISO
  odontologia: {
    aliases: ['dentis', 'odonto', 'ortodont', 'implant', 'clareamento', 'sorriso', 'prótese dentária', 'harmonização orofacial', 'invisalign', 'alinhador invisivel'],
    nichoLabel: 'Odontologia Especializada & Estética do Sorriso',
    avatar: 'Pacientes em busca de tratamentos odontológicos modernos, alinhadores sem dor, implantes seguros e estética do sorriso.',
    problemaCentral: 'Medo de dor na cadeira do dentista, traumas antigos, orçamentos confusos e falta de explicação do plano de tratamento.',
    objetivoPrincipal: 'Agendar avaliação odontológica pelo WhatsApp',
    ctaPrincipal: 'Agendar Avaliação no WhatsApp',
    ctaSecundario: 'Conhecer Tratamentos Dentários',
    waMensagem: 'Olá! Gostaria de agendar uma avaliação odontológica para conversar sobre meu sorriso.',
    tomVoz: 'Acolhedor, seguro, científico, empático, com foco em conforto total, eliminação do medo e tecnologia moderna.',
    badgeLive: '● Agenda Aberta para Avaliações Esta Semana',
    diretrizesVisuais: {
      modo: 'light',
      bg: '#f8fafc',
      surface: '#ffffff',
      text: '#0f172a',
      muted: '#64748b',
      border: 'rgba(2, 132, 199, 0.12)',
      primary: '#0284c7', // Azul Céu Clínico
      primaryHover: '#0369a1',
      accent: '#06b6d4',
      accentBg: '#e0f2fe',
      accentText: '#0369a1',
      badgeBg: '#ecfdf5',
      badgeText: '#047857',
      fontSans: "'Plus Jakarta Sans', sans-serif",
      fontSerif: "'Playfair Display', serif",
      borderRadius: '20px'
    },
    imagens: {
      hero: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=1400&q=80',
      sobre: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=900&q=80',
      galeria: [
        'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80'
      ]
    },
    headlinesCRO: [
      'Recupere a confiança de sorrir com alinhadores invisíveis, implantes guiados e atendimento sem dor.',
      'Odontologia digital de alta precisão com acolhimento humano que elimina o medo do dentista.',
      'Seu novo sorriso planejado em 3D: estética natural, mastigação perfeita e saúde duradoura.'
    ],
    stats: [
      { valor: '+12.000', rotulo: 'Sorrisos Transformados' },
      { valor: 'Zero Dor', rotulo: 'Tecnologias Anestésicas Modernas' },
      { valor: '★ 4.9', rotulo: 'Avaliação no Google' },
      { valor: '3D Digital', rotulo: 'Planejamento Computadorizado' }
    ],
    servicos: [
      {
        titulo: 'Alinhadores Invisíveis & Ortodontia Digital',
        desc: 'Correção ortodôntica rápida, confortável e discreta sem o uso de braquetes metálicos, com planejamento visual 3D do início ao fim.',
        tag: 'Tecnologia 3D 🦷',
        icone: 'sparkles'
      },
      {
        titulo: 'Implantes Dentários de Alta Precisão',
        desc: 'Recuperação definitiva da mastigação e da estética com cirurgia guiada por computador, cicatrizando com rapidez e conforto.',
        tag: 'Especialidade',
        icone: 'shield'
      },
      {
        titulo: 'Clareamento a Laser & Facetas em Resina/Porcelana',
        desc: 'Harmonização do formato, cor e alinhamento dos dentes para um sorriso luminoso com aparência totalmente natural.',
        tag: 'Estética Dental',
        icone: 'star'
      },
      {
        titulo: 'Check-up Preventivo & Limpeza Ultrassônica',
        desc: 'Prevenção de cáries e tártaro com remoção suave sem sensibilidade, garantindo gengivas saudáveis e hálito puro.',
        tag: 'Prevenção',
        icone: 'heart'
      }
    ],
    diferenciais: [
      { titulo: 'Atendimento Humanizado Sem Dor', desc: 'Técnicas anestésicas computadorizadas para seu conforto absoluto durante toda a consulta.' },
      { titulo: 'Planejamento Digital em 3D', desc: 'Você visualiza como seu sorriso vai ficar na tela do computador antes mesmo de iniciar.' },
      { titulo: 'Ambiente Confortável e Biosseguro', desc: 'Consultórios modernos com controle rigoroso de assepsia e esterilização de padrão cirúrgico.' }
    ],
    reviews: [
      { autor: 'Marcelo Penteado', texto: 'Eu tinha pânico de dentista por traumas de infância. Aqui o atendimento foi tão gentil e cuidadoso que não senti absolutamente nada!', nota: 5 },
      { autor: 'Camila Zanin', texto: 'Coloquei implante guiado e a recuperação foi muito tranquila. Em poucos dias já estava comendo normalmente.', nota: 5 },
      { autor: 'Thiago Nogueira', texto: 'Os alinhadores invisíveis mudaram meus dentes em 6 meses sem ninguém notar que eu estava usando aparelho.', nota: 5 }
    ],
    faq: [
      { pergunta: 'O procedimento de implante dentário dói?', resposta: 'Não! Usamos anestesia local moderna e técnicas minimamente invasivas que garantem total ausência de dor durante e no pós-operatório.' },
      { pergunta: 'Qual a vantagem do alinhador invisível frente ao aparelho fixo?', resposta: 'Você pode retirar para comer e escovar os dentes, não machuca a bochecha e ninguém repara que você está de aparelho.' },
      { pergunta: 'Como funciona a primeira consulta de avaliação?', resposta: 'Realizamos um exame clínico detalhado, fotos intraorais e montamos um plano com todas as etapas e valores explicados com clareza.' }
    ]
  },

  // 8. PEDIATRIA & SAÚDE INFANTIL
  pediatria: {
    aliases: ['pediatra', 'pediatria', 'infantil', 'puericultura', 'médico infantil', 'médica infantil', 'bebe', 'bebê', 'criança', 'crianca', 'maternidade'],
    nichoLabel: 'Pediatria Humanizada & Puericultura',
    avatar: 'Mães e pais buscando cuidado amoroso, escuta atenta e dedicação médica integral à saúde e crescimento do bebê ou da criança.',
    problemaCentral: 'Consultas de 5 minutos, frieza no atendimento, médicos inacessíveis em momentos de febre e desespero dos pais.',
    objetivoPrincipal: 'Agendar consulta pediátrica ou puericultura pelo WhatsApp',
    ctaPrincipal: 'Agendar Consulta no WhatsApp',
    ctaSecundario: 'Conhecer Cuidados Pediátricos',
    waMensagem: 'Olá! Vim pelo site e gostaria de agendar uma consulta pediátrica para meu filho(a).',
    tomVoz: 'Amoroso, acolhedor, empático, sereno, protetor e de autoridade médica que tranquiliza o coração dos pais.',
    badgeLive: '● Consultório Infantil Acolhedor & Horários Marcados',
    diretrizesVisuais: {
      modo: 'light',
      bg: '#f8fafc',
      surface: '#ffffff',
      text: '#1e293b',
      muted: '#64748b',
      border: 'rgba(56, 189, 248, 0.2)',
      primary: '#0284c7', // Azul Sereno
      primaryHover: '#0369a1',
      accent: '#38bdf8',
      accentBg: '#f0f9ff',
      accentText: '#0369a1',
      badgeBg: '#f0fdf4',
      badgeText: '#166534',
      fontSans: "'Plus Jakarta Sans', sans-serif",
      fontSerif: "'Playfair Display', serif",
      borderRadius: '24px'
    },
    imagens: {
      hero: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=1400&q=80',
      sobre: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=900&q=80',
      galeria: [
        'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=800&q=80'
      ]
    },
    headlinesCRO: [
      'Cuidado pediátrico acolhedor, escuta atenta e atenção dedicada à saúde do seu maior tesouro.',
      'Acompanhamento do crescimento, puericultura afetuosa e suporte que tranquiliza o coração dos pais.',
      'Consultas sem pressa em um ambiente lúdico e seguro feito especialmente para as crianças.'
    ],
    stats: [
      { valor: '+6.000', rotulo: 'Crianças Acompanhadas' },
      { valor: '60 min', rotulo: 'Duração Média das Consultas' },
      { valor: '★ 5.0', rotulo: 'Avaliações de Mães no Google' },
      { valor: 'Suporte', rotulo: 'Acolhimento aos Pais com Escuta Atenta' }
    ],
    servicos: [
      {
        titulo: 'Consulta de Puericultura & Acompanhamento Mensal',
        desc: 'Avaliação detalhada do ganho de peso, estatura, reflexos, introdução alimentar e marcos de desenvolvimento neuropsicomotor do bebê.',
        tag: 'Primeira Infância 👶',
        icone: 'heart'
      },
      {
        titulo: 'Urgências Leves & Diagnóstico Infantil',
        desc: 'Avaliação cuidadosa de quadros de febre, tosse, resfriados, alergias e desconfortos abdominais com prescrições precisas e seguras.',
        tag: 'Cuidado Imediato',
        icone: 'shield'
      },
      {
        titulo: 'Apoio à Amamentação & Introdução Alimentar',
        desc: 'Orientação prática e empática para pega correta, alívio de cólicas e transição alimentar saudável sem traumas para a família.',
        tag: 'Apoio à Mãe',
        icone: 'sparkles'
      },
      {
        titulo: 'Check-up Preventivo & Calendário Vacinal',
        desc: 'Checagem clínica completa para volta às aulas, atividades esportivas e conferência minuciosa da caderneta de vacinação.',
        tag: 'Prevenção',
        icone: 'activity'
      }
    ],
    diferenciais: [
      { titulo: 'Consultas Sem Pressa e Escuta Verdadeira', desc: 'Tempo de sobra para tirar todas as dúvidas das mães e dos pais sem correria de relógio.' },
      { titulo: 'Espaço Lúdico Adaptado para Crianças', desc: 'Ambiente com brinquedos educativos onde seu filho se sente seguro e acolhido sem medo de jaleco.' },
      { titulo: 'Comunicação Clara e Direta', desc: 'Explicações em linguagem humana sobre diagnósticos, sem termos médicos inacessíveis.' }
    ],
    reviews: [
      { autor: 'Juliana Paes', texto: 'Uma médica espetacular! Teve uma paciência sem igual com o meu filho de 1 ano, examinou com muito carinho e tirou todas as minhas dúvidas.', nota: 5 },
      { autor: 'Caroline Mendonça', texto: 'A consulta dura quase 1 hora, você não se sente despachada. Foi essencial na fase de introdução alimentar da minha bebê.', nota: 5 },
      { autor: 'Felipe Santana', texto: 'Minha filha não chora para ir ao médico mais. O consultório é super acolhedor e a equipe é maravilhosa.', nota: 5 }
    ],
    faq: [
      { pergunta: 'Com que frequência o bebê deve passar pelo pediatra no primeiro ano?', resposta: 'No primeiro ano de vida, as consultas são mensais até os 6 meses, e depois a cada 2 meses para acompanhar o desenvolvimento.' },
      { pergunta: 'O que levar na primeira consulta do recém-nascido?', resposta: 'Traga a caderneta de saúde da criança, os testes do pezinho e orelhinha, além de anotações com as principais dúvidas dos pais.' },
      { pergunta: 'A clínica realiza atendimento por ordem de chegada ou agendamento?', resposta: 'Trabalhamos com horários marcados espaçados para que você não precise aguardar na sala de espera com seu filho.' }
    ]
  },

  // 9. CLÍNICA MÉDICA & CIRURGIA
  clinica_medica: {
    aliases: ['médic', 'medica', 'médica', 'clínic', 'clinica', 'oftalmo', 'dermatolog', 'vascular', 'ginecolog', 'cardiolog', 'otorrino', 'hospital', 'cirurgi', 'cirurgião', 'cirurgiao', 'policlínic'],
    nichoLabel: 'Clínica Médica & Especialidades Integradas',
    avatar: 'Pacientes em busca de diagnósticos precisos, médicos experientes, exames modernos e segurança clínica total.',
    problemaCentral: 'Medo de erros de diagnóstico, tratamentos ineficazes, atendimentos frios e demora na marcação de consultas.',
    objetivoPrincipal: 'Agendar consulta com médico especialista pelo WhatsApp',
    ctaPrincipal: 'Agendar Consulta no WhatsApp',
    ctaSecundario: 'Conhecer Corpo Clínico',
    waMensagem: 'Olá! Vim pelo site da clínica e gostaria de agendar uma consulta médica especializada.',
    tomVoz: 'Científico, ético, solene, empático, transmitindo solidez técnica e respeito rigoroso à vida do paciente.',
    badgeLive: '● Corpo Clínico Especializado em Atendimento',
    diretrizesVisuais: {
      modo: 'light',
      bg: '#f8fafc',
      surface: '#ffffff',
      text: '#0f172a',
      muted: '#475569',
      border: 'rgba(15, 23, 42, 0.08)',
      primary: '#0369a1', // Azul Médico Nobre
      primaryHover: '#075985',
      accent: '#0284c7',
      accentBg: '#e0f2fe',
      accentText: '#0369a1',
      badgeBg: '#f0fdf4',
      badgeText: '#166534',
      fontSans: "'Plus Jakarta Sans', sans-serif",
      fontSerif: "'Playfair Display', serif",
      borderRadius: '20px'
    },
    imagens: {
      hero: 'https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&w=1400&q=80',
      sobre: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=900&q=80',
      galeria: [
        'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=800&q=80'
      ]
    },
    headlinesCRO: [
      'Medicina de precisão, tecnologia diagnóstica avançada e acolhimento humano dedicado.',
      'Sua saúde e longevidade cuidadas por especialistas renomados em um só lugar.',
      'Diagnósticos minuciosos e tratamentos embasados nas melhores evidências científicas.'
    ],
    stats: [
      { valor: '+25.000', rotulo: 'Consultas Realizadas' },
      { valor: 'Rigor Máximo', rotulo: 'Protocolos Médicos Internacionais' },
      { valor: '★ 4.9', rotulo: 'Avaliação no Google' },
      { valor: 'Multidisciplinar', rotulo: 'Equipe de Especialistas' }
    ],
    servicos: [
      {
        titulo: 'Consultas Médicas Especializadas',
        desc: 'Atendimento aprofundado com escuta clínica cuidadosa, análise do histórico familiar e definição de conduta terapêutica personalizada.',
        tag: 'Especialistas 🩺',
        icone: 'activity'
      },
      {
        titulo: 'Exames Diagnósticos & Check-up Preventivo',
        desc: 'Avaliação laboratorial e por imagem para detecção precoce de alterações e preservação da sua qualidade de vida.',
        tag: 'Prevenção',
        icone: 'shield'
      },
      {
        titulo: 'Procedimentos Ambulatoriais & Cirurgias Eletivas',
        desc: 'Técnicas modernas minimamente invasivas com alta segurança, anestesia confortável e rápida recuperação pós-procedimento.',
        tag: 'Alta Precisão',
        icone: 'heart'
      },
      {
        titulo: 'Acompanhamento de Doenças Crônicas & Longevidade',
        desc: 'Controle contínuo de pressão arterial, diabetes e equilíbrio metabólico com plano terapêutico individualizado.',
        tag: 'Saúde Contínua',
        icone: 'file-text'
      }
    ],
    diferenciais: [
      { titulo: 'Corpo Clínico Titulado e Experiente', desc: 'Médicos especialistas com residência reconhecida e atualização científica constante.' },
      { titulo: 'Estrutura Completa e Confortável', desc: 'Ambientes modernos, acessibilidade total e equipamentos diagnósticos de última geração.' },
      { titulo: 'Pontualidade e Respeito ao Paciente', desc: 'Gestão responsável de agenda para evitar esperas exaustivas em consultório.' }
    ],
    reviews: [
      { autor: 'Henrique Barcellos', texto: 'Excelente atendimento desde a recepção até a consulta médica. Médico atencioso, explicou o diagnóstico com calma.', nota: 5 },
      { autor: 'Luciana Fontes', texto: 'Clínica muito moderna, limpa e organizada. Consegui agendar com rapidez pelo WhatsApp.', nota: 5 },
      { autor: 'Valéria Meireles', texto: 'Profissionais muito capacitados e humanos. O tratamento indicado resolveu um problema que eu tinha há anos.', nota: 5 }
    ],
    faq: [
      { pergunta: 'Como funciona o agendamento de consultas?', resposta: 'Você pode agendar diretamente pelo nosso WhatsApp escolhendo a especialidade médica e os dias disponíveis de sua preferência.' },
      { pergunta: 'A clínica fornece nota fiscal para reembolso com plano de saúde?', resposta: 'Sim, emitimos recibo médico e nota fiscal detalhada para que você possa solicitar reembolso junto ao seu plano.' },
      { pergunta: 'Qual a política para consultas de retorno?', resposta: 'Garantimos direito a consulta de retorno para avaliação de exames solicitados em conformidade com as diretrizes do CFM.' }
    ]
  },

  // 10. PSICOLOGIA & TERAPIA
  psicologia_terapia: {
    aliases: ['psicolog', 'psicólog', 'terapia', 'psicoterapia', 'psicanalise', 'psicanálise', 'saúde mental', 'ansiedade', 'terapeuta'],
    nichoLabel: 'Psicologia Clínica & Acolhimento Emocional',
    avatar: 'Pessoas enfrentando ansiedade, esgotamento (burnout), depressão, luto ou crises nos relacionamentos em busca de clareza mental e paz.',
    problemaCentral: 'Medo de julgamento, receio sobre o sigilo das sessões, terapeutas frios ou abordagens que não trazem evolução prática.',
    objetivoPrincipal: 'Agendar primeira sessão de acolhimento pelo WhatsApp',
    ctaPrincipal: 'Agendar Sessão no WhatsApp',
    ctaSecundario: 'Conhecer a Abordagem Terapêutica',
    waMensagem: 'Olá! Gostaria de saber mais sobre as sessões de psicoterapia e consultar horários disponíveis.',
    tomVoz: 'Acolhedor, seguro, sereno, empático, confidencial e livre de qualquer julgamento.',
    badgeLive: '● Atendimento Presencial & Online com Sigilo Absoluto',
    diretrizesVisuais: {
      modo: 'light',
      bg: '#faf8f5',
      surface: '#ffffff',
      text: '#1c1917',
      muted: '#57534e',
      border: 'rgba(28, 25, 23, 0.08)',
      primary: '#0f766e', // Verde Petróleo Calmante
      primaryHover: '#115e59',
      accent: '#14b8a6',
      accentBg: '#ccfbf1',
      accentText: '#0f766e',
      badgeBg: '#f0fdfa',
      badgeText: '#134e4a',
      fontSans: "'Plus Jakarta Sans', sans-serif",
      fontSerif: "'Playfair Display', serif",
      borderRadius: '22px'
    },
    imagens: {
      hero: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1400&q=80',
      sobre: 'https://images.unsplash.com/photo-1527689368864-3a821dbccc34?auto=format&fit=crop&w=900&q=80',
      galeria: [
        'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=800&q=80'
      ]
    },
    headlinesCRO: [
      'Espaço seguro e acolhedor para desarmar a ansiedade, ressignificar feridas e reencontrar o equilíbrio.',
      'Psicoterapia humanizada e científica para você lidar com suas emoções com leveza e clareza.',
      'Cuidar da sua mente é o primeiro passo para reconstruir sua paz e suas relações.'
    ],
    stats: [
      { valor: '+5.000', rotulo: 'Horas de Atendimento Clínico' },
      { valor: '100% Sigilo', rotulo: 'Código de Ética do CRP' },
      { valor: '★ 5.0', rotulo: 'Avaliação no Google' },
      { valor: 'Flexível', rotulo: 'Sessões Presenciais & Online' }
    ],
    servicos: [
      {
        titulo: 'Psicoterapia Individual para Adultos (Ansiedade & Burnout)',
        desc: 'Acompanhamento terapêutico para identificar gatilhos emocionais, reduzir pensamentos acelerados e restaurar a qualidade do sono e rotina.',
        tag: 'Mais Procurado 🌿',
        icone: 'heart'
      },
      {
        titulo: 'Terapia Cognitivo-Comportamental (TCC) Baseada em Evidências',
        desc: 'Abordagem estruturada com ferramentas práticas para reestruturação de crenças limitantes e enfrentamento de fobias e inseguranças.',
        tag: 'Foco em Ferramentas',
        icone: 'target'
      },
      {
        titulo: 'Terapia de Casal & Relacionamentos',
        desc: 'Mediação de diálogos difíceis, alinhamento de expectativas e reconstrução da intimidade e do respeito na vida a dois.',
        tag: 'Casais',
        icone: 'users'
      },
      {
        titulo: 'Orientação Psicológica Online (Em Todo o Brasil)',
        desc: 'Sessões por videochamada criptografada com a mesma profundidade e sigilo do consultório presencial no conforto da sua casa.',
        tag: 'Atendimento Online',
        icone: 'sparkles'
      }
    ],
    diferenciais: [
      { titulo: 'Escuta Atenta Sem Qualquer Julgamento', desc: 'Um ambiente neutro e seguro onde você pode ser exatamente quem você é sem medo de ser criticado.' },
      { titulo: 'Sigilo Absoluto e Confidencialidade', desc: 'Respeito irrestrito ao sigilo profissional em todas as mensagens e conversas terapêuticas.' },
      { titulo: 'Metodologia Científica com Aplicação Prática', desc: 'Você desenvolve recursos internos concretos para lidar com as dificuldades do dia a dia.' }
    ],
    reviews: [
      { autor: 'Renata Camargo', texto: 'A terapia mudou minha relação com a ansiedade. Hoje consigo respirar e lidar com a rotina de trabalho sem entrar em desespero.', nota: 5 },
      { autor: 'Bruno Naves', texto: 'Profissional de uma sensibilidade ímpar. O consultório transmite uma paz inacreditável logo que você entra.', nota: 5 },
      { autor: 'Tatiane Lopes', texto: 'Faço as sessões online há 6 meses e foi o melhor investimento que fiz na minha saúde emocional.', nota: 5 }
    ],
    faq: [
      { pergunta: 'Como funciona a primeira sessão?', resposta: 'A primeira sessão é um momento de acolhimento para você contar o que te trouxe à terapia e para alinharmos os objetivos do processo.' },
      { pergunta: 'Qual é a duração e a frequência das sessões?', resposta: 'As sessões têm duração de 50 minutos e ocorrem preferencialmente uma vez por semana em dia e horário fixo.' },
      { pergunta: 'A psicoterapia online tem a mesma eficácia que a presencial?', resposta: 'Sim, estudos comprovam que a psicoterapia online tem a mesma eficácia clínica da modalidade presencial quando realizada em ambiente privado.' }
    ]
  },

  // 11. MECÂNICA & AUTO CENTER
  mecanica_auto: {
    aliases: ['mecânica', 'mecanica', 'oficina', 'auto center', 'autocenter', 'suspensão', 'freios', 'troca de óleo', 'revisão automotiva', 'pneu', 'escapamento', 'motor', 'câmbio'],
    nichoLabel: 'Centro Automotivo & Oficina Mecânica de Precisão',
    avatar: 'Motoristas e proprietários de veículos em busca de manutenção confiável, peças genuínas, diagnóstico rápido e sem surpresas na conta.',
    problemaCentral: 'Medo de oficinas desonestas que inventam problemas fictícios, cobram preços abusivos e colocam peças de segunda linha.',
    objetivoPrincipal: 'Solicitar diagnóstico mecânico ou cotação de revisão no WhatsApp',
    ctaPrincipal: 'Pedir Orçamento no WhatsApp',
    ctaSecundario: 'Ver Serviços Mecânicos',
    waMensagem: 'Olá! Gostaria de solicitar um orçamento/revisão para o meu veículo.',
    tomVoz: 'Técnico, transparente, honesto, focado em precisão mecânica, segurança viária e garantia comprovada.',
    badgeLive: '● Diagnóstico Computadorizado & Elevadores Disponíveis',
    diretrizesVisuais: {
      modo: 'dark',
      bg: '#090a0f',
      surface: '#12141c',
      text: '#f8fafc',
      muted: '#94a3b8',
      border: 'rgba(6, 182, 212, 0.18)',
      primary: '#06b6d4', // Ciano Técnico de Precisão
      primaryHover: '#0891b2',
      accent: '#3b82f6',
      accentBg: 'rgba(6, 182, 212, 0.12)',
      accentText: '#67e8f9',
      badgeBg: 'rgba(6, 182, 212, 0.15)',
      badgeText: '#22d3ee',
      fontSans: "'Plus Jakarta Sans', sans-serif",
      fontSerif: "'Plus Jakarta Sans', sans-serif",
      borderRadius: '16px'
    },
    imagens: {
      hero: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=1400&q=80',
      sobre: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=900&q=80',
      galeria: [
        'https://images.unsplash.com/photo-1601362840469-81e4df861614?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1607860108855-64acf2078ed9?auto=format&fit=crop&w=800&q=80'
      ]
    },
    headlinesCRO: [
      'Manutenção automotiva de precisão com diagnóstico computadorizado e transparência total.',
      'A performance, economia e segurança que seu carro precisa para rodar sem sustos.',
      'Orçamentos explicados item a item, peças originais com garantia formal e entrega no prazo.'
    ],
    stats: [
      { valor: '+14.000', rotulo: 'Veículos Revisados' },
      { valor: 'Scanner 3D', rotulo: 'Diagnóstico Eletrônico Avançado' },
      { valor: '★ 4.9', rotulo: 'Avaliação no Google' },
      { valor: 'Garantia', rotulo: 'Termo Formal em Peças e Mão de Obra' }
    ],
    servicos: [
      {
        titulo: 'Revisão Preventiva Completa de 40 Itens',
        desc: 'Checagem minuciosa de fluidos, correias, velas, filtros, bateria e sistema elétrico antes de viagens ou revisões periódicas.',
        tag: 'Mais Procurado 🚗',
        icone: 'activity'
      },
      {
        titulo: 'Diagnóstico Eletrônico por Scanner Computadorizado',
        desc: 'Varredura rápida da injeção eletrônica identificando falhas de sensores com precisão milimétrica sem troca desnecessária de peças.',
        tag: 'Tecnologia',
        icone: 'zap'
      },
      {
        titulo: 'Manutenção de Freios, Suspensão & Amortecedores',
        desc: 'Substituição de pastilhas, discos, pivôs, buchas e alinhamento 3D a laser para estabilidade máxima e frenagem precisa.',
        tag: 'Segurança Máxima',
        icone: 'shield'
      },
      {
        titulo: 'Troca de Óleo de Motor & Filtros Homologados',
        desc: 'Lubrificantes 100% sintéticos com viscosidade recomendada pelo manual da montadora, protegendo o motor contra desgaste prematuro.',
        tag: 'Manutenção Essencial',
        icone: 'star'
      }
    ],
    diferenciais: [
      { titulo: 'Transparência em Fotos e Vídeos no WhatsApp', desc: 'Enviamos fotos da peça danificada e da peça nova instalada para sua total tranquilidade.' },
      { titulo: 'Peças de Primeira Linha com Garantia em Nota', desc: 'Trabalhamos exclusivamente com marcas homologadas pelas principais montadoras do país.' },
      { titulo: 'Sem Serviços Desnecessários na Conta', desc: 'Só trocamos o que realmente precisa ser trocado com sua autorização prévia por escrito.' }
    ],
    reviews: [
      { autor: 'Gustavo Paiva', texto: 'Oficina de extrema confiança! Me mandaram vídeos de todas as peças trocadas e o orçamento foi cumprido à risca.', nota: 5 },
      { autor: 'Marcio Fontes', texto: 'Fizeram a revisão do meu carro antes de viajar e o carro rodou 2.000 km como novo. Atendimento de primeira.', nota: 5 },
      { autor: 'Daniela Rezende', texto: 'Sou mulher e sempre tinha receio de ir em mecânica. Aqui fui tratada com respeito e clareza total. Recomendo muito!', nota: 5 }
    ],
    faq: [
      { pergunta: 'O orçamento tem custo?', resposta: 'Não cobramos para avaliar e apresentar o orçamento detalhado de peças e mão de obra do seu veículo.' },
      { pergunta: 'Vocês dão garantia nos serviços prestados?', resposta: 'Sim! Todos os nossos serviços mecânicos e peças contam com garantia legal e formal em nota fiscal.' },
      { pergunta: 'Quanto tempo demora uma revisão básica com troca de óleo?', resposta: 'Em média de 1h30 a 2h quando agendada previamente pelo WhatsApp.' }
    ]
  },

  // 12. ESTÉTICA AUTOMOTIVA & DETAILING
  estetica_automotiva: {
    aliases: ['detailing', 'estética automotiva', 'estetica automotiva', 'polimento', 'vitrificação', 'vitrificacao', 'higienização interna', 'lavagem detalhada', 'martelinho de ouro', 'lavajato premium'],
    nichoLabel: 'Estética Automotiva & Detailing de Alto Padrão',
    avatar: 'Entusiastas e donos de veículos exigentes que buscam pintura espelhada, proteção cerâmica e interior com cheiro de zero km.',
    problemaCentral: 'Medo de riscos circulares (swirls) causados por lavagens amadoras, produtos ácidos que mancham plásticos e estofados úmidos com mofo.',
    objetivoPrincipal: 'Agendar serviço de estética veicular ou vitrificação pelo WhatsApp',
    ctaPrincipal: 'Agendar Detailing no WhatsApp',
    ctaSecundario: 'Ver Antes e Depois',
    waMensagem: 'Olá! Gostaria de consultar pacotes e agendar um serviço de estética automotiva para o meu carro.',
    tomVoz: 'Imponente, detalhista, focado em acabamento espelhado, nanotecnologia e proteção do patrimônio.',
    badgeLive: '● Box de Iluminação Técnica & Agenda Aberta',
    diretrizesVisuais: {
      modo: 'dark',
      bg: '#08080a',
      surface: '#141418',
      text: '#ffffff',
      muted: '#a1a1aa',
      border: 'rgba(255, 255, 255, 0.1)',
      primary: '#ffffff',
      primaryHover: '#e4e4e7',
      accent: '#e11d48', // Vermelho Racing
      accentBg: 'rgba(225, 29, 72, 0.15)',
      accentText: '#fb7185',
      badgeBg: 'rgba(255, 255, 255, 0.08)',
      badgeText: '#f4f4f5',
      fontSans: "'Plus Jakarta Sans', sans-serif",
      fontSerif: "'Outfit', sans-serif",
      borderRadius: '16px'
    },
    imagens: {
      hero: 'https://images.unsplash.com/photo-1607860108855-64acf2078ed9?auto=format&fit=crop&w=1400&q=80',
      sobre: 'https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?auto=format&fit=crop&w=900&q=80',
      galeria: [
        'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80'
      ]
    },
    headlinesCRO: [
      'Polimento técnico, vitrificação cerâmica 9H e estética automotiva de elite.',
      'Devolva o brilho espelhado de concessionária e proteja a pintura do seu veículo contra o tempo.',
      'Cuidado artesanal milimétrico em cada detalhe interno e externo do seu carro.'
    ],
    stats: [
      { valor: '+4.000', rotulo: 'Veículos Detalhados' },
      { valor: 'Até 3 Anos', rotulo: 'Durabilidade da Vitrificação' },
      { valor: '★ 5.0', rotulo: 'Avaliações no Google' },
      { valor: 'pH Neutro', rotulo: 'Produtos Importados Nobres' }
    ],
    servicos: [
      {
        titulo: 'Polimento Técnico em 3 Etapas & Correção de Verniz',
        desc: 'Eliminação de até 95% de riscos superficiais, marcas de chuva ácida e hologramas, revelando a cor pura e profunda da pintura.',
        tag: 'Brilho Extremo ✨',
        icone: 'sparkles'
      },
      {
        titulo: 'Vitrificação Cerâmica 9H com Nanotecnologia',
        desc: 'Camada de quartzo hidrofóbica com durabilidade de até 3 anos contra raios UV, seiva de árvores e repelência instantânea de água e sujeira.',
        tag: 'Proteção Máxima',
        icone: 'shield'
      },
      {
        titulo: 'Higienização Interna com Vapor & Oxi-Sanitização',
        desc: 'Limpeza térmica profunda de bancos de couro ou tecido, teto e carpetes eliminando fungos, ácaros e odores desagradáveis.',
        tag: 'Saúde & Conforto',
        icone: 'wind'
      },
      {
        titulo: 'Lavagem Detalhada de Chassi & Motor',
        desc: 'Limpeza minuciosa com pincéis de cerdas naturais, produtos dielétricos seguros e verniz térmico protetor de plásticos.',
        tag: 'Detailing Completo',
        icone: 'star'
      }
    ],
    diferenciais: [
      { titulo: 'Box Climatizado com Luzes de Inspeção', desc: 'Trabalho realizado sob iluminação técnica de alta intensidade para não deixar nenhum defeito passar.' },
      { titulo: 'Produtos Premium de Alta Performance', desc: 'Utilizamos apenas compostos alemães e japoneses que preservam a espessura original do verniz.' },
      { titulo: 'Certificado de Garantia e Manutenção', desc: 'Acompanhamento periódico com manutenções programadas para manter o brilho vitrificado sempre vivo.' }
    ],
    reviews: [
      { autor: 'Rafael Antunes', texto: 'Meu carro é preto e estava cheio de teias de aranha. Depois do polimento técnico virou um espelho verdadeiro!', nota: 5 },
      { autor: 'Eduardo Mello', texto: 'A vitrificação vale cada centavo. A água simplesmente escorrega da lataria e a sujeira não gruda.', nota: 5 },
      { autor: 'Vinicius Prado', texto: 'Higienização interna impecável. Os bancos de couro caramelo voltaram a ter aspecto fosco original de fábrica.', nota: 5 }
    ],
    faq: [
      { pergunta: 'Quanto tempo dura o processo de vitrificação cerâmica?', resposta: 'O processo completo de descontaminação, polimento técnico e aplicação da vitrificação leva de 1 a 2 dias inteiros de trabalho cuidadoso.' },
      { pergunta: 'O polimento técnico desgasta o verniz do carro?', resposta: 'Nosso método remove o mínimo possível de micras de verniz utilizando micropolidores de precisão, preservando a vida útil da pintura.' },
      { pergunta: 'Como lavar o carro após a vitrificação?', resposta: 'Orientamos o uso exclusivo de shampoo neutro e toalhas de microfibra, sem esfregar ceras abrasivas.' }
    ]
  },

  // 13. ADVOCACIA & CONSULTORIA JURÍDICA
  advocacia: {
    aliases: ['advog', 'jurídic', 'direito', 'tributár', 'trabalhista', 'criminal', 'família', 'previdenciár', 'imobiliário', 'escritório de advocacia', 'advogado', 'advogada'],
    nichoLabel: 'Advocacia & Assessoria Jurídica Estratégica',
    avatar: 'Pessoas e empresas que enfrentam riscos legais, burocráticos ou patrimoniais e necessitam de respaldo seguro e resolutivo.',
    problemaCentral: 'Medo de perdas financeiras, termos jurídicos confusos e incerteza sobre o futuro dos seus direitos.',
    objetivoPrincipal: 'Consulta com especialista para análise do caso',
    ctaPrincipal: 'Falar com Advogado no WhatsApp',
    ctaSecundario: 'Conhecer Áreas do Direito',
    waMensagem: 'Olá! Preciso de uma orientação jurídica com urgência para o meu caso.',
    tomVoz: 'Sóbrio, imponente, confiante, estratégico e extremamente claro na comunicação.',
    badgeLive: '● Plantão de Análise Jurídica Disponível',
    diretrizesVisuais: {
      modo: 'light',
      bg: '#fafaf9',
      surface: '#ffffff',
      text: '#1c1917',
      muted: '#57534e',
      border: 'rgba(28, 25, 23, 0.08)',
      primary: '#1c1917',
      primaryHover: '#292524',
      accent: '#b45309', // Ouro Antigo
      accentBg: '#fef3c7',
      accentText: '#92400e',
      badgeBg: '#f5f5f4',
      badgeText: '#44403c',
      fontSans: "'Plus Jakarta Sans', sans-serif",
      fontSerif: "'Playfair Display', serif",
      borderRadius: '16px'
    },
    imagens: {
      hero: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=1400&q=80',
      sobre: 'https://images.unsplash.com/photo-1505664194779-8beaceb93744?auto=format&fit=crop&w=900&q=80',
      galeria: [
        'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1479142506502-19b3a3b7ff33?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80'
      ]
    },
    headlinesCRO: [
      'Defesa firme e estratégia jurídica de alto impacto para proteger o seu patrimônio e seus direitos.',
      'Assessoria jurídica experiente para solucionar pendências legais com agilidade e sigilo.',
      'Comunicação clara sem juridiquês: você no controle de cada etapa do seu processo.'
    ],
    stats: [
      { valor: '+2.500', rotulo: 'Causas Solucionadas' },
      { valor: '100% Ético', rotulo: 'Inscrição Regular na OAB' },
      { valor: '★ 4.9', rotulo: 'Avaliação no Google' },
      { valor: 'Sigilo', rotulo: 'Confidencialidade Rigorosa' }
    ],
    servicos: [
      {
        titulo: 'Aposentadorias & Planejamento Previdenciário (INSS)',
        desc: 'Cálculo minucioso de tempo de contribuição e regras de transição para obter o maior valor de benefício sem perdas financeiras.',
        tag: 'Previdenciário ⚖️',
        icone: 'file-text'
      },
      {
        titulo: 'Direito do Trabalho & Rescisões Contratuais',
        desc: 'Atuação enérgica na cobrança de horas extras, desvio de função, verbas rescisórias retidas e indenizações por danos morais.',
        tag: 'Trabalhista',
        icone: 'briefcase'
      },
      {
        titulo: 'Inventários, Heranças & Direito de Família',
        desc: 'Condução ágil e pacífica de divórcios, partilha de bens e inventários extrajudiciais em cartório sem morosidade.',
        tag: 'Família & Sucessões',
        icone: 'users'
      },
      {
        titulo: 'Assessoria Contratual & Prevenção de Riscos Empresariais',
        desc: 'Blindagem de contratos imobiliários e comerciais para evitar litígios caros e execuções indevidas.',
        tag: 'Empresarial',
        icone: 'shield'
      }
    ],
    diferenciais: [
      { titulo: 'Comunicação Clara Sem Juridiquês', desc: 'Você entende cada andamento do seu processo com relatórios periódicos em linguagem simples.' },
      { titulo: 'Atuação Ágil e Estratégica', desc: 'Foco em acelerar a resolução pelas vias mais seguras e econômicas.' },
      { titulo: 'Sigilo Absoluto e Confidencialidade', desc: 'Proteção completa de dados e sigilo profissional em todas as etapas.' }
    ],
    reviews: [
      { autor: 'Otavio Magalhães', texto: 'Dr. resolveu meu inventário em cartório em menos de 4 meses com uma competência admirável. Recomendo fortemente!', nota: 5 },
      { autor: 'Simone Toledo', texto: 'Consegui minha aposentadoria com o valor correto graças ao planejamento previdenciário que eles fizeram.', nota: 5 },
      { autor: 'Marcos Aurelio', texto: 'Excelente escritório. Sempre me mantiveram informado pelo WhatsApp sem enrolação.', nota: 5 }
    ],
    faq: [
      { pergunta: 'Como agendar uma consulta com o advogado?', resposta: 'Basta nos enviar uma mensagem no WhatsApp com um breve resumo do seu caso para agendarmos o atendimento.' },
      { pergunta: 'O atendimento pode ser feito de forma 100% online?', resposta: 'Sim, realizamos consultas por videochamada e envio de documentos digitalizados com total validade jurídica.' },
      { pergunta: 'Quanto tempo leva para dar entrada no processo?', resposta: 'Após a entrega de toda a documentação necessária, nossa equipe ajuíza a ação ou requerimento em poucos dias úteis.' }
    ]
  },

  // 14. ENERGIA SOLAR FOTOVOLTAICA
  energia_solar: {
    aliases: ['solar', 'energia solar', 'fotovoltaica', 'painel solar', 'placa solar', 'sistema solar', 'inversor solar'],
    nichoLabel: 'Energia Solar Fotovoltaica & Engenharia Sustentável',
    avatar: 'Famílias e empresários cansados de pagar contas de luz altíssimas querendo gerar sua própria energia limpa com retorno garantido.',
    problemaCentral: 'Medo de empresas amadoras que furam o telhado e causam vazamentos, inversores que queimam e lentidão na homologação.',
    objetivoPrincipal: 'Solicitar simulação gratuita de economia na conta de luz no WhatsApp',
    ctaPrincipal: 'Simular Economia no WhatsApp',
    ctaSecundario: 'Ver Projetos Instalados',
    waMensagem: 'Olá! Gostaria de fazer uma simulação gratuita de energia solar para o meu imóvel.',
    tomVoz: 'Inovador, confiável, focado em retorno financeiro, engenharia segura e economia de até 95%.',
    badgeLive: '● Engenharia Homologada & Simulações Gratuitas',
    diretrizesVisuais: {
      modo: 'light',
      bg: '#fafafa',
      surface: '#ffffff',
      text: '#0f172a',
      muted: '#475569',
      border: 'rgba(234, 88, 12, 0.15)',
      primary: '#ea580c', // Laranja Solar Vibrante
      primaryHover: '#c2410c',
      accent: '#f59e0b',
      accentBg: '#ffedd5',
      accentText: '#c2410c',
      badgeBg: '#fef3c7',
      badgeText: '#b45309',
      fontSans: "'Plus Jakarta Sans', sans-serif",
      fontSerif: "'Plus Jakarta Sans', sans-serif",
      borderRadius: '18px'
    },
    imagens: {
      hero: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=1400&q=80',
      sobre: 'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?auto=format&fit=crop&w=900&q=80',
      galeria: [
        'https://images.unsplash.com/photo-1545208942-e1c9c916524b?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1558441719-8b449c6ff673?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1497440001374-f26997328c1b?auto=format&fit=crop&w=800&q=80'
      ]
    },
    headlinesCRO: [
      'Reduza até 95% da sua conta de luz com energia solar garantida por 25 anos.',
      'Transforme sua despesa de energia elétrica em investimento lucrativo e valorização do imóvel.',
      'Engenharia completa: simulação, instalação segura sem goteiras e homologação rápida.'
    ],
    stats: [
      { valor: 'Até 95%', rotulo: 'Redução na Conta de Luz' },
      { valor: '25 Anos', rotulo: 'Garantia de Eficiência dos Módulos' },
      { valor: '★ 4.9', rotulo: 'Avaliação no Google' },
      { valor: '+1.200', rotulo: 'Sistemas Conectados à Rede' }
    ],
    servicos: [
      {
        titulo: 'Estudo de Viabilidade Gratuito & Simulação de Economia',
        desc: 'Análise minuciosa do seu consumo médio nos últimos 12 meses para dimensionar a quantidade ideal de placas solares.',
        tag: '100% Gratuito ☀️',
        icone: 'sun'
      },
      {
        titulo: 'Instalação de Módulos Monocristalinos Tier 1',
        desc: 'Painéis solares com tecnologia anti-sombreamento e estruturas de fixação em alumínio anodizado que vedam e protegem seu telhado.',
        tag: 'Alta Tecnologia',
        icone: 'zap'
      },
      {
        titulo: 'Projeto de Engenharia & Homologação na Concessionária',
        desc: 'Cuidamos de 100% da burocracia com a distribuidora de energia elétrica local até a troca oficial do relógio bidirecional.',
        tag: 'Zero Burocracia',
        icone: 'shield'
      },
      {
        titulo: 'Monitoramento em Tempo Real por Aplicativo no Celular',
        desc: 'Acompanhe a geração de energia em kWh e a economia financeira em tempo real na palma da sua mão a qualquer momento.',
        tag: 'Controle Total',
        icone: 'smartphone'
      }
    ],
    diferenciais: [
      { titulo: 'Engenheiros Eletricistas Próprios', desc: 'Instalação conduzida por engenheiros certificados sem terceirização aventureira.' },
      { titulo: 'Financiamento que se Paga com a Economia', desc: 'A parcela do financiamento solar substitui a conta de luz sem pesar no seu orçamento.' },
      { titulo: 'Garantia Contra Infiltrações no Telhado', desc: 'Sistemas de vedação específicos para cada tipo de telha garantindo zero vazamentos.' }
    ],
    reviews: [
      { autor: 'Ricardo Silveira', texto: 'Minha conta de luz que vinha R$ 900 caiu para a taxa mínima de R$ 85! O sistema se paga sozinho.', nota: 5 },
      { autor: 'Marcelo Bittencourt', texto: 'Instalação impecável em apenas 2 dias. Pessoal muito educado e a homologação foi mais rápida do que o esperado.', nota: 5 },
      { autor: 'Claudia Fontoura', texto: 'O aplicativo de monitoramento é sensacional, consigo ver exatamente quanto estou gerando a cada hora do dia.', nota: 5 }
    ],
    faq: [
      { pergunta: 'O sistema solar gera energia em dias nublados ou chuvosos?', resposta: 'Sim! Os painéis funcionam com a radiação solar (luminosidade), mantendo a geração mesmo em dias de tempo encoberto.' },
      { pergunta: 'Qual é o prazo de retorno do investimento (Payback)?', resposta: 'O retorno médio do investimento fica entre 3 a 5 anos, com vida útil do sistema superando os 25 anos.' },
      { pergunta: 'Preciso de quanto espaço no telhado para instalar?', resposta: 'Depende do seu consumo, mas sistemas residenciais comuns ocupam entre 15m² e 35m² de telhado voltado para boa incidência solar.' }
    ]
  },

  // 15. ACADEMIA & FITNESS
  academia: {
    aliases: ['academia', 'fitness', 'musculação', 'musculacao', 'crossfit', 'treino', 'treinamento', 'gym', 'personal', 'pilates', 'boxe', 'luta', 'funcional'],
    nichoLabel: 'Academia & Centro de Treinamento',
    avatar: 'Pessoas buscando emagrecimento, hipertrofia, energia diária e evolução física com estrutura moderna e acolhimento.',
    problemaCentral: 'Medo de pagar anuidade e não ter resultado, academias lotadas com aparelhos quebrados e falta de atenção dos instrutores.',
    objetivoPrincipal: 'Agendar aula experimental gratuita ou conhecer planos no WhatsApp',
    ctaPrincipal: 'Agendar Aula Experimental Grátis',
    ctaSecundario: 'Ver Planos & Modalidades',
    waMensagem: 'Olá! Vim pelo site e gostaria de agendar uma aula experimental gratuita e saber os valores dos planos.',
    tomVoz: 'Energético, motivador, acolhedor, focado em superação, saúde e consistência diária.',
    badgeLive: '● Aulas Experimentais Gratuitas Disponíveis Esta Semana',
    diretrizesVisuais: {
      modo: 'dark',
      bg: '#09090b',
      surface: '#141417',
      text: '#f4f4f5',
      muted: '#a1a1aa',
      border: 'rgba(244, 63, 94, 0.2)',
      primary: '#f43f5e', // Crimson Energy
      primaryHover: '#e11d48',
      accent: '#fb7185',
      accentBg: 'rgba(244, 63, 94, 0.12)',
      accentText: '#fecdd3',
      badgeBg: 'rgba(244, 63, 94, 0.2)',
      badgeText: '#fda4af',
      fontSans: "'Plus Jakarta Sans', sans-serif",
      fontSerif: "'Outfit', sans-serif",
      borderRadius: '20px'
    },
    imagens: {
      hero: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1400&q=80',
      sobre: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=900&q=80',
      galeria: [
        'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&w=800&q=80'
      ]
    },
    headlinesCRO: [
      'Treine com estrutura de ponta, acompanhamento de verdade e foco na sua evolução física.',
      'O ambiente motivador e os equipamentos que você precisa para conquistar sua melhor versão.',
      'Transforme sua rotina, saúde e autoestima em uma academia completa feita para você.'
    ],
    stats: [
      { valor: '+3.000', rotulo: 'Alunos Ativos' },
      { valor: 'Sem Filas', rotulo: 'Aparelhos Biomecânicos Duplicados' },
      { valor: '★ 4.9', rotulo: 'Avaliação no Google' },
      { valor: 'Zero Taxas', rotulo: 'Planos Sem Fidelidade Abusiva' }
    ],
    servicos: [
      {
        titulo: 'Musculação & Hipertrofia com Aparelhos Biomecânicos',
        desc: 'Equipamentos articulados de alta precisão que isolam a musculatura com segurança, prevenindo lesões e acelerando resultados.',
        tag: 'Mais Procurado 🏋️',
        icone: 'activity'
      },
      {
        titulo: 'Treinamento Funcional & Condicionamento Cardiovascular',
        desc: 'Circuitos de alta queima calórica que aumentam sua resistência, fôlego e mobilidade para as atividades do dia a dia.',
        tag: 'Alta Energia',
        icone: 'zap'
      },
      {
        titulo: 'Acompanhamento com Bioimpedância & Treino Personalizado',
        desc: 'Avaliação corporal detalhada e ficha de treino adaptada ao seu objetivo individual: emagrecimento, definição ou ganho de força.',
        tag: 'Individualizado',
        icone: 'target'
      },
      {
        titulo: 'Aulas Coletivas Dinâmicas (Pilates, Dança & Spinning)',
        desc: 'Turmas contagiantes com professores dedicados para queimar calorias em um ambiente descontraído e motivador.',
        tag: 'Coletivo',
        icone: 'users'
      }
    ],
    diferenciais: [
      { titulo: 'Professores de Salão Sempre Presentes', desc: 'Você nunca treina sozinho nem na dúvida: nossa equipe orienta postura e execução correta em cada exercício.' },
      { titulo: 'Ambiente Climatizado & Sem Filas nos Aparelhos', desc: 'Espaço amplo com quantidade ideal de equipamentos para seu treino fluir sem interrupções.' },
      { titulo: 'Planos Sem Fidelidade Abusiva', desc: 'Mensalidades transparentes no débito recorrente sem bloquear o limite do seu cartão de crédito.' }
    ],
    reviews: [
      { autor: 'Matheus Nogueira', texto: 'A melhor academia que já treinei! Aparelhos novos, ar-condicionado funcionando de verdade e os instrutores são super prestativos.', nota: 5 },
      { autor: 'Camila Peixoto', texto: 'Perdi 8kg nos primeiros 3 meses com os treinos que montaram para mim. O ambiente é muito acolhedor.', nota: 5 },
      { autor: 'Guilherme Rosa', texto: 'Não tem aquela música ensurdecedora nem fila para revezar aparelho. Dá gosto vir treinar.', nota: 5 }
    ],
    faq: [
      { pergunta: 'Como funciona a aula experimental gratuita?', resposta: 'Basta entrar em contato pelo WhatsApp e agendar o dia de sua preferência para treinar com acesso total sem nenhum compromisso!' },
      { pergunta: 'Preciso pagar anuidade ou matrícula?', resposta: 'Trabalhamos com planos mensais transparentes sem taxas surpresa nem matrículas caras.' },
      { pergunta: 'Tem instrutor para quem está começando do zero?', resposta: 'Sim! Nossos professores montam seu treino de adaptação e te acompanham em cada exercício para você treinar com segurança total.' }
    ]
  },

  // 16. PET SHOP & VETERINÁRIA
  pet: {
    aliases: ['pet', 'pet shop', 'veterinár', 'veterinar', 'banho e tosa', 'clínica veterinária', 'clinica veterinaria', 'ração', 'racao', 'adestramento', 'hotelzinho'],
    nichoLabel: 'Pet Care & Clínica Veterinária Acolhedora',
    avatar: 'Tutores que consideram seus pets como membros da família e exigem carinho, paciência e medicina veterinária preventiva.',
    problemaCentral: 'Medo de maus-tratos em banho e tosa, toalhas contaminadas, estresse do animal em consultas e diagnósticos apressados.',
    objetivoPrincipal: 'Agendar banho, tosa ou consulta no WhatsApp',
    ctaPrincipal: 'Agendar Horário no WhatsApp',
    ctaSecundario: 'Conhecer Cuidados Pet',
    waMensagem: 'Olá! Vim pelo site e gostaria de agendar um horário para o meu pet.',
    tomVoz: 'Afetuoso, alegre, protetor, zeloso e acolhedor.',
    badgeLive: '● Atendimento Pet com Carinho e Paciência',
    diretrizesVisuais: {
      modo: 'light',
      bg: '#faf8f5',
      surface: '#ffffff',
      text: '#1c1917',
      muted: '#57534e',
      border: 'rgba(2, 132, 199, 0.12)',
      primary: '#0284c7', // Azul Acolhedor
      primaryHover: '#0369a1',
      accent: '#f59e0b',
      accentBg: '#fef3c7',
      accentText: '#b45309',
      badgeBg: '#e0f2fe',
      badgeText: '#0369a1',
      fontSans: "'Plus Jakarta Sans', sans-serif",
      fontSerif: "'Playfair Display', serif",
      borderRadius: '24px'
    },
    imagens: {
      hero: 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=1400&q=80',
      sobre: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=900&q=80',
      galeria: [
        'https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1537151625747-768eb6cf92b2?auto=format&fit=crop&w=800&q=80'
      ]
    },
    headlinesCRO: [
      'Cuidado, carinho e saúde de alto nível para o membro mais especial da sua família.',
      'Banho relaxante com toalhas esterilizadas, tosa especializada e atendimento veterinário sem traumas.',
      'O amor e a proteção que o seu melhor amigo merece todos os dias.'
    ],
    stats: [
      { valor: '+18.000', rotulo: 'Banhos & Cuidados Realizados' },
      { valor: 'Toalhas 100%', rotulo: 'Esterilizadas e Embaladas Individualmente' },
      { valor: '★ 4.9', rotulo: 'Avaliação no Google' },
      { valor: 'Sem Traumas', rotulo: 'Manejo Pet Friendly com Amor' }
    ],
    servicos: [
      {
        titulo: 'Banho Terapêutico & Tosa Especializada',
        desc: 'Produtos hipoalergênicos dermatológicos, hidratação profunda e profissionais pacientes e carinhosos com toalhas de uso único.',
        tag: 'Mais Procurado 🐾',
        icone: 'sparkles'
      },
      {
        titulo: 'Consultas Veterinárias & Vacinação Importada',
        desc: 'Acompanhamento preventivo completo com vacinas de alta pureza e ambiente adaptado para minimizar o estresse do animal.',
        tag: 'Saúde Pet',
        icone: 'shield'
      },
      {
        titulo: 'Exames Laboratoriais & Diagnóstico por Imagem',
        desc: 'Resultados ágeis para identificação precoce de alterações e tratamento rápido e assertivo para seu cão ou gato.',
        tag: 'Diagnóstico',
        icone: 'activity'
      },
      {
        titulo: 'Farmácia Veterinária & Nutrição Super Premium',
        desc: 'Medicamentos prescritos e rações selecionadas para a longevidade, pelagem brilhante e energia do seu companheiro.',
        tag: 'Nutrição',
        icone: 'heart'
      }
    ],
    diferenciais: [
      { titulo: 'Manejo Cat & Dog Friendly Sem Estresse', desc: 'Espaço e técnicas projetadas para acalmar o pet durante todo o atendimento.' },
      { titulo: 'Toalhas Higienizadas Individuais e Esterilizadas', desc: 'Padrão hospitalar contra proliferação de fungos e bactérias na pele do seu pet.' },
      { titulo: 'Profissionais Que Amam o Que Fazem', desc: 'Dedicação genuína e paciência infinita com filhotes, idosos e animais agitados.' }
    ],
    reviews: [
      { autor: 'Leticia Vasconcelos', texto: 'Meu cachorrinho morria de medo de banho, mas aqui ele entra abanando o rabo! O carinho dos profissionais é nítido.', nota: 5 },
      { autor: 'Fernando Camargo', texto: 'A veterinária foi extremamente minuciosa e atenciosa no diagnóstico da minha gatinha. Recomendo a todos.', nota: 5 },
      { autor: 'Barbara Couto', texto: 'Tosa na tesoura impecável e o cheirinho gostoso dura a semana inteira. Melhor pet shop da cidade.', nota: 5 }
    ],
    faq: [
      { pergunta: 'Como é feita a higienização das toalhas?', resposta: 'Nossas toalhas são lavadas e esterilizadas em lavanderia industrial especializada e chegam lacradas em embalagens individuais para cada pet.' },
      { pergunta: 'Vocês realizam serviço de busca e entrega (Táxi Dog)?', resposta: 'Sim, dispomos de transporte seguro e climatizado com caixas de transporte higienizadas para buscar seu amigo em casa.' },
      { pergunta: 'Quais vacinas meu filhote precisa tomar?', resposta: 'O protocolo básico inclui as vacinas polivalentes (V8/V10), vacina antirrábica, além de proteção contra gripe canina e giárdia.' }
    ]
  },

  // 17. VIDRAÇARIA & ESQUADRIAS
  vidracaria: {
    aliases: ['vidraç', 'vidrac', 'vidro', 'box', 'espelho', 'esquadria', 'guarda-corpo', 'alumínio', 'sacada', 'janela'],
    nichoLabel: 'Vidraçaria & Esquadrias de Alto Padrão',
    avatar: 'Proprietários de imóveis em reforma ou construção, arquitetos e designers em busca de acabamento milimétrico e durabilidade.',
    problemaCentral: 'Vidraceiros que quebram prazos, vazamentos em instalações de sacada e materiais com folga ou baixa segurança.',
    objetivoPrincipal: 'Solicitar orçamento técnico sob medida no WhatsApp',
    ctaPrincipal: 'Solicitar Orçamento no WhatsApp',
    ctaSecundario: 'Ver Galeria de Projetos',
    waMensagem: 'Olá! Gostaria de um orçamento para vidros/esquadrias para minha obra/reforma.',
    tomVoz: 'Técnico, imponente, preciso, transmitindo solidez, segurança e alto acabamento arquitetônico.',
    badgeLive: '● Atendimento Técnico em Toda a Região',
    diretrizesVisuais: {
      modo: 'light',
      bg: '#f8fafc',
      surface: '#ffffff',
      text: '#0f172a',
      muted: '#475569',
      border: 'rgba(15, 23, 42, 0.08)',
      primary: '#0f172a',
      primaryHover: '#1e293b',
      accent: '#2563eb', // Azul Royal Técnico
      accentBg: '#eff6ff',
      accentText: '#1d4ed8',
      badgeBg: '#e0e7ff',
      badgeText: '#3730a3',
      fontSans: "'Plus Jakarta Sans', sans-serif",
      fontSerif: "'Plus Jakarta Sans', sans-serif",
      borderRadius: '18px'
    },
    imagens: {
      hero: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=80',
      sobre: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=900&q=80',
      galeria: [
        'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1502005229762-ee152da92e06?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1541123437800-1bb1317badc2?auto=format&fit=crop&w=800&q=80'
      ]
    },
    headlinesCRO: [
      'Engenharia do vidro e esquadrias de alto padrão com precisão milimétrica.',
      'Elegância, luminosidade natural e segurança máxima para o seu imóvel.',
      'Projetos em vidro e alumínio com acabamento impecável e entrega no prazo garantida.'
    ],
    stats: [
      { valor: '+5.000', rotulo: 'Projetos Instalados' },
      { valor: 'ABNT NBR', rotulo: 'Vidros de Segurança Homologados' },
      { valor: '★ 4.9', rotulo: 'Avaliação no Google' },
      { valor: '5 Anos', rotulo: 'Garantia Estrutural em Contrato' }
    ],
    servicos: [
      {
        titulo: 'Box para Banheiro Elegance & Até o Teto',
        desc: 'Vidro temperado 8mm certificado ABNT com roldanas aparentes em aço inox 304, garantindo deslizamento suave e vedação total.',
        tag: 'Mais Procurado 🚿',
        icone: 'shield'
      },
      {
        titulo: 'Envidraçamento Panorâmico de Sacadas & Varandas',
        desc: 'Sistema articulado europeu com abertura total, isolamento térmico, atenuação acústica e vedação reforçada contra chuvas fortes.',
        tag: 'Alto Padrão',
        icone: 'maximize'
      },
      {
        titulo: 'Espelhos Bisotados & Painéis Iluminados em LED',
        desc: 'Cristal legítimo prata com tratamento anti-mancha e lapidação nobre, valorizando halls, salas e banheiros modernos.',
        tag: 'Decoração',
        icone: 'sparkles'
      },
      {
        titulo: 'Guarda-Corpos & Coberturas em Vidro Laminado',
        desc: 'Máxima proteção para mezaninos, escadas e piscinas com torres em inox e vidros multilaminados de altíssima resistência mecânica.',
        tag: 'Segurança',
        icone: 'lock'
      }
    ],
    diferenciais: [
      { titulo: 'Vidros Certificados pelo INMETRO', desc: 'Utilizamos exclusivamente vidros com têmpera controlada para segurança total da sua família.' },
      { titulo: 'Instalação por Técnicos Próprios', desc: 'Equipe especializada sem terceirização aventureira: acabamento perfeito sem folgas.' },
      { titulo: 'Garantia com Contrato e Nota Fiscal', desc: 'Respeito ao seu patrimônio com termo formal de garantia e pontualidade na entrega.' }
    ],
    reviews: [
      { autor: 'Carlos Eduardo Ramos', texto: 'O fechamento da minha sacada ficou perfeito! Veda a chuva 100% e o acabamento dos perfis é finíssimo.', nota: 5 },
      { autor: 'Renata Beltrão', texto: 'Coloquei espelhos na sala toda e box até o teto nos banheiros. Mudou a cara da minha casa, equipe muito limpa e rápida.', nota: 5 },
      { autor: 'Marcio Guimarães', texto: 'Preço justo, cumpriram o prazo combinado de 15 dias sem atrasar nem uma hora. Recomendo a todos.', nota: 5 }
    ],
    faq: [
      { pergunta: 'Qual a diferença entre vidro temperado e laminado?', resposta: 'O vidro temperado é até 5x mais resistente ao impacto mecânico; o laminado permanece preso à película protetora mesmo se quebrar, sendo ideal para guarda-corpos.' },
      { pergunta: 'Vocês fazem visita técnica para medição no local?', resposta: 'Sim, enviamos um técnico especialista com instrumentos a laser para medição exata no seu imóvel sem custo.' },
      { pergunta: 'Qual é o prazo médio de fabricação e instalação?', resposta: 'Para boxes e espelhos, o prazo médio é de 7 a 10 dias úteis; para envidraçamento de sacadas, de 15 a 20 dias.' }
    ]
  },

  // 18. REFORMA & CONSTRUÇÃO
  reforma_construcao: {
    aliases: ['reforma', 'construção', 'construcao', 'marcenaria', 'móveis planejados', 'moveis planejados', 'pintura', 'eletricista', 'gesso', 'drywall', 'pedreiro', 'engenharia civil', 'empreiteira'],
    nichoLabel: 'Engenharia, Reformas & Marcenaria Sob Medida',
    avatar: 'Proprietários de imóveis que desejam transformar seus espaços com acabamento impecável, pontualidade e sem dor de cabeça de obra.',
    problemaCentral: 'Obras que nunca terminam, sujeira excessiva, cobranças surpresa e retrabalho por falta de capricho técnico.',
    objetivoPrincipal: 'Solicitar visita técnica para orçamento no WhatsApp',
    ctaPrincipal: 'Solicitar Visita Técnica Gratuita',
    ctaSecundario: 'Ver Galeria de Obras',
    waMensagem: 'Olá! Vim pelo site e gostaria de solicitar um orçamento para minha obra/reforma.',
    tomVoz: 'Sólido, prático, transparente, focado em entrega no prazo e acabamento milimétrico.',
    badgeLive: '● Cronograma Rigoroso com Contrato e Garantia',
    diretrizesVisuais: {
      modo: 'light',
      bg: '#f8fafc',
      surface: '#ffffff',
      text: '#0f172a',
      muted: '#475569',
      border: 'rgba(15, 23, 42, 0.08)',
      primary: '#0f172a',
      primaryHover: '#1e293b',
      accent: '#ea580c',
      accentBg: '#fff7ed',
      accentText: '#c2410c',
      badgeBg: '#f1f5f9',
      badgeText: '#334155',
      fontSans: "'Plus Jakarta Sans', sans-serif",
      fontSerif: "'Plus Jakarta Sans', sans-serif",
      borderRadius: '16px'
    },
    imagens: {
      hero: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1400&q=80',
      sobre: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=900&q=80',
      galeria: [
        'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80'
      ]
    },
    headlinesCRO: [
      'Execução impecável de obras e reformas com respeito total ao seu prazo e orçamento.',
      'Transforme seu imóvel com segurança estrutural, capricho nos acabamentos e garantia formal.',
      'Sua reforma conduzida do início ao fim sem surpresas desagradáveis.'
    ],
    stats: [
      { valor: '+800', rotulo: 'Obras Entregues no Prazo' },
      { valor: '100% MDF', rotulo: 'Marcenaria de Alta Durabilidade' },
      { valor: '★ 4.9', rotulo: 'Avaliação no Google' },
      { valor: '1 Ano', rotulo: 'Garantia Pós-Obra Completa' }
    ],
    servicos: [
      {
        titulo: 'Reformas Residenciais & Comerciais Completas',
        desc: 'Planejamento e execução de alvenaria, pisos porcelanato, revestimentos e pintura com gestão unificada de profissionais.',
        tag: 'Turnkey 🔨',
        icone: 'home'
      },
      {
        titulo: 'Marcenaria Fina & Móveis Planejados 100% MDF',
        desc: 'Projetos sob medida milimétricos com ferragens com amortecimento, puxadores sofisticados e máxima otimização de espaço.',
        tag: 'Alto Padrão',
        icone: 'layout'
      },
      {
        titulo: 'Instalações Elétricas, Iluminação LED & Automação',
        desc: 'Projetos luminotécnicos modernos com circuitos dimensionados para segurança total contra sobrecargas elétricas.',
        tag: 'Segurança',
        icone: 'zap'
      },
      {
        titulo: 'Gesso Acartonado, Drywall & Isolamento Acústico',
        desc: 'Rebaixamento de teto, forros tabicados e divisórias com agilidade e limpeza superior à alvenaria tradicional.',
        tag: 'Acabamento',
        icone: 'layers'
      }
    ],
    diferenciais: [
      { titulo: 'Contrato Formal com Multa por Atraso', desc: 'Assumimos o compromisso com o seu cronograma por escrito sem desculpas.' },
      { titulo: 'Obra Limpa e Organizada', desc: 'Descarte ecológico de entulho e limpeza periódica para minimizar poeira e transtornos.' },
      { titulo: 'Garantia Pós-Obra de 1 Ano', desc: 'Suporte imediato para qualquer ajuste fino necessário após a entrega das chaves.' }
    ],
    reviews: [
      { autor: 'Rodrigo Nogueira', texto: 'Fizeram a reforma do meu apartamento inteiro e entregaram 5 dias antes do prazo do contrato! Fiquei impressionado com o capricho.', nota: 5 },
      { autor: 'Juliana Pires', texto: 'A marcenaria planejada da cozinha e dos quartos ficou perfeita. Corrediças macias e acabamento sem emendas aparentes.', nota: 5 },
      { autor: 'Marcelo Siqueira', texto: 'Obra limpa, profissionais educados e o custo final bateu certinho com o orçamento inicial sem acréscimos malucos.', nota: 5 }
    ],
    faq: [
      { pergunta: 'Como é feito o controle do cronograma da obra?', resposta: 'Montamos um cronograma semanal de evolução e enviamos relatórios fotográficos periódicos no WhatsApp para você acompanhar cada etapa.' },
      { pergunta: 'Vocês fornecem a mão de obra ou também os materiais?', resposta: 'Trabalhamos tanto na modalidade de gestão completa com fornecimento de materiais quanto apenas de mão de obra técnica especializada.' },
      { pergunta: 'A marcenaria é 100% MDF?', resposta: 'Sim, trabalhamos exclusivamente com chapas de MDF de marcas líderes com tratamento antifúngico e fitas de borda impermeabilizantes.' }
    ]
  },

  // 19. CONTABILIDADE & GESTÃO FINANCEIRA
  contabilidade: {
    aliases: ['contabil', 'contábil', 'contabilidade', 'contador', 'abertura de empresa', 'bpo financeiro', 'imposto de renda', 'escritório contábil'],
    nichoLabel: 'Contabilidade Estratégica & Gestão Tributária',
    avatar: 'Empresários e profissionais liberais buscando pagar menos impostos dentro da lei, abrir CNPJ sem burocracia e organizar as finanças.',
    problemaCentral: 'Contadores que não respondem no WhatsApp, guias de impostos enviadas em cima da hora com multas e bitributação por enquadramento errado.',
    objetivoPrincipal: 'Falar com um contador especialista para análise tributária',
    ctaPrincipal: 'Falar com Contador no WhatsApp',
    ctaSecundario: 'Simular Economia Tributária',
    waMensagem: 'Olá! Vim pelo site da contabilidade e gostaria de uma consultoria para minha empresa.',
    tomVoz: 'Profissional, consultivo, transparente, focado em redução de custos, conformidade legal e agilidade contábil.',
    badgeLive: '● Plantão Fiscal & Abertura Rápida de CNPJ',
    diretrizesVisuais: {
      modo: 'light',
      bg: '#f8fafc',
      surface: '#ffffff',
      text: '#0f172a',
      muted: '#475569',
      border: 'rgba(15, 23, 42, 0.08)',
      primary: '#0f172a',
      primaryHover: '#1e293b',
      accent: '#059669', // Verde Economia / Financeiro
      accentBg: '#ecfdf5',
      accentText: '#047857',
      badgeBg: '#f0fdf4',
      badgeText: '#166534',
      fontSans: "'Plus Jakarta Sans', sans-serif",
      fontSerif: "'Plus Jakarta Sans', sans-serif",
      borderRadius: '16px'
    },
    imagens: {
      hero: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=1400&q=80',
      sobre: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=900&q=80',
      galeria: [
        'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=800&q=80'
      ]
    },
    headlinesCRO: [
      'Contabilidade proativa para sua empresa pagar o menor imposto possível dentro da lei.',
      'Abertura rápida de CNPJ, emissão descomplicada de notas fiscais e suporte diário no WhatsApp.',
      'Sua empresa 100% regularizada enquanto você foca no crescimento das suas vendas.'
    ],
    stats: [
      { valor: '+1.500', rotulo: 'Empresas Atendidas' },
      { valor: 'Até 40%', rotulo: 'Redução em Impostos com Planejamento' },
      { valor: '★ 4.9', rotulo: 'Avaliação no Google' },
      { valor: '48 Horas', rotulo: 'Abertura Rápida de CNPJ' }
    ],
    servicos: [
      {
        titulo: 'Abertura Gratuita & Regularização Rápida de CNPJ',
        desc: 'Cuidamos de todo o processo na Junta Comercial, Receita Federal e Prefeitura com enquadramento no melhor regime tributário.',
        tag: 'Abertura Rápida 🚀',
        icone: 'file-text'
      },
      {
        titulo: 'Planejamento Tributário & Economia Legal de Impostos',
        desc: 'Estudo minucioso entre Simples Nacional, Lucro Presumido e Lucro Real para reduzir sua carga fiscal de forma legítima.',
        tag: 'Economia Real',
        icone: 'trending-up'
      },
      {
        titulo: 'BPO Financeiro & Gestão de Contas a Pagar/Receber',
        desc: 'Terceirização financeira com conciliação bancária diária, relatórios de fluxo de caixa e emissão de notas fiscais sem dor de cabeça.',
        tag: 'Gestão Inteligente',
        icone: 'pie-chart'
      },
      {
        titulo: 'Folha de Pagamento, Pró-Labore & eSocial',
        desc: 'Cálculo pontual de salários, férias, rescisões e obrigações trabalhistas com total segurança jurídica para seu negócio.',
        tag: 'Departamento Pessoal',
        icone: 'users'
      }
    ],
    diferenciais: [
      { titulo: 'Atendimento Rápido Sem Chamados Lentos', desc: 'Canal direto no WhatsApp com seu contador dedicado sem esperar dias por uma resposta.' },
      { titulo: 'Avisos Antecipados de Vencimentos', desc: 'Suas guias chegam com antecedência para você nunca mais pagar multas por esquecimento.' },
      { titulo: 'Visão Consultiva de Crescimento', desc: 'Não apenas calculamos guias: analisamos seus números e sugerimos melhorias para seu lucro.' }
    ],
    reviews: [
      { autor: 'Renato Fialho', texto: 'Migrei minha empresa para cá e conseguimos economizar quase R$ 2.000 por mês só com o re-enquadramento tributário correto.', nota: 5 },
      { autor: 'Fabiana Rios', texto: 'Atendimento nota mil! Respondem na hora no WhatsApp, tiram todas as dúvidas e nunca atrasaram uma guia.', nota: 5 },
      { autor: 'Tiago Bernardes', texto: 'Abriram meu CNPJ em menos de 3 dias sem eu precisar sair de casa. Serviço impecável.', nota: 5 }
    ],
    faq: [
      { pergunta: 'Como funciona a troca de contador para a sua empresa?', resposta: 'A troca é muito simples e 100% gratuita! Nós mesmos solicitamos a transferência de documentos ao seu contador anterior sem atritos.' },
      { pergunta: 'Vocês atendem MEI e pequenas empresas?', resposta: 'Sim, temos planos específicos e acessíveis para MEIs em transição, ME e empresas de pequeno porte.' },
      { pergunta: 'Como recebo as guias de impostos e relatórios?', resposta: 'Enviamos mensalmente pelo WhatsApp e por e-mail com antecedência confortável antes do vencimento.' }
    ]
  },

  // 20. IMOBILIÁRIA & CORRETAGEM
  imobiliaria: {
    aliases: ['imobiliár', 'imobiliaria', 'corretor', 'corretora', 'imóveis', 'imoveis', 'aluguel', 'venda de casas', 'apartamento', 'lançamento imobiliário'],
    nichoLabel: 'Imobiliária & Consultoria Patrimonial',
    avatar: 'Compradores e investidores buscando o imóvel ideal com segurança jurídica, além de proprietários querendo vender ou alugar rápido.',
    problemaCentral: 'Burocracia excessiva, imóveis com documentação irregular, corretores desatentos e falta de suporte pós-venda.',
    objetivoPrincipal: 'Consultar imóveis disponíveis ou anunciar imóvel no WhatsApp',
    ctaPrincipal: 'Ver Imóveis no WhatsApp',
    ctaSecundario: 'Anunciar Meu Imóvel',
    waMensagem: 'Olá! Vim pelo site da imobiliária e gostaria de conhecer as opções de imóveis disponíveis.',
    tomVoz: 'Seguro, acolhedor, sofisticado, focado em patrimônio familiar, investimento seguro e transparência contratual.',
    badgeLive: '● Carteira Selecionada & Plantão de Atendimento',
    diretrizesVisuais: {
      modo: 'light',
      bg: '#f8fafc',
      surface: '#ffffff',
      text: '#0f172a',
      muted: '#475569',
      border: 'rgba(15, 23, 42, 0.08)',
      primary: '#0f172a',
      primaryHover: '#1e293b',
      accent: '#2563eb',
      accentBg: '#eff6ff',
      accentText: '#1d4ed8',
      badgeBg: '#f1f5f9',
      badgeText: '#334155',
      fontSans: "'Plus Jakarta Sans', sans-serif",
      fontSerif: "'Playfair Display', serif",
      borderRadius: '18px'
    },
    imagens: {
      hero: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=80',
      sobre: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=900&q=80',
      galeria: [
        'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80'
      ]
    },
    headlinesCRO: [
      'O imóvel dos seus sonhos com curadoria exclusiva e total segurança jurídica.',
      'Casas e apartamentos selecionados nos melhores bairros para morar bem ou investir.',
      'Assessoria imobiliária completa: da escolha do imóvel até a assinatura da escritura.'
    ],
    stats: [
      { valor: '+2.000', rotulo: 'Negócios Imobiliários Fechados' },
      { valor: '100% Seguro', rotulo: 'Auditoria Jurídica em Cada Contrato' },
      { valor: '★ 4.9', rotulo: 'Avaliação no Google' },
      { valor: 'Agilidade', rotulo: 'Aprovação de Crédito Imobiliário' }
    ],
    servicos: [
      {
        titulo: 'Venda & Compra de Casas e Apartamentos',
        desc: 'Curadoria criteriosa de imóveis prontos, novos e em condomínio fechado, avaliados dentro da realidade de mercado.',
        tag: 'Destaque 🏡',
        icone: 'home'
      },
      {
        titulo: 'Aluguel Descomplicado Sem Fiador',
        desc: 'Processo ágil de locação com análise de crédito digital em até 24h através de seguro-fiança ou cartão de crédito.',
        tag: 'Sem Burocracia',
        icone: 'key'
      },
      {
        titulo: 'Assessoria de Financiamento Habitacional',
        desc: 'Simulação simultânea nos principais bancos (Caixa, Itaú, Bradesco, Santander) para obter as menores taxas de juros.',
        tag: 'Menor Taxa',
        icone: 'percent'
      },
      {
        titulo: 'Avaliação Mercadológica & Perícia Imobiliária',
        desc: 'Laudo técnico preciso do valor real de venda ou locação do seu patrimônio com base em comparativos de mercado.',
        tag: 'Avaliação Precisa',
        icone: 'file-text'
      }
    ],
    diferenciais: [
      { titulo: 'Auditoria Jurídica Prévia', desc: 'Checamos todas as certidões do imóvel e dos proprietários para você comprar com tranquilidade absoluta.' },
      { titulo: 'Fotos Profissionais e Tour em Vídeo', desc: 'Divulgação de alto impacto para valorizar seu imóvel e acelerar o fechamento do negócio.' },
      { titulo: 'Suporte Completo no Cartório', desc: 'Acompanhamos você pessoalmente em cada etapa do registro e da escritura.' }
    ],
    reviews: [
      { autor: 'Guilherme Peixoto', texto: 'Comprei meu primeiro apartamento com eles e o suporte jurídico foi essencial. Me senti 100% seguro em cada assinatura.', nota: 5 },
      { autor: 'Luciana Queiroz', texto: 'Coloquei minha casa para vender e conseguiram um comprador qualificado em menos de 45 dias.', nota: 5 },
      { autor: 'Eduardo Silveira', texto: 'Aluguei um apartamento sem precisar de fiador e peguei as chaves na mesma semana. Equipe muito prestativa.', nota: 5 }
    ],
    faq: [
      { pergunta: 'Vocês ajudam na aprovação do financiamento imobiliário?', resposta: 'Sim! Cuidamos de todo o processo de aprovação de crédito bancário sem cobrar nenhuma taxa extra por isso.' },
      { pergunta: 'O que é necessário para anunciar meu imóvel?', resposta: 'Basta entrar em contato pelo WhatsApp que agendamos a sessão de fotos profissionais e a conferência da matrícula do imóvel.' },
      { pergunta: 'É possível usar o FGTS na compra do imóvel?', resposta: 'Sim, para imóveis residenciais enquadrados nas regras do SFH podemos utilizar seu saldo de FGTS como entrada.' }
    ]
  },

  // 21. FLORICULTURA & ARRANJOS FLORAIS
  floricultura: {
    aliases: ['floricultura', 'flor', 'flores', 'buquê', 'buque', 'arranjo', 'orquídea', 'orquidea', 'plantas', 'entrega de flores', 'cesta de café', 'cestas'],
    nichoLabel: 'Floricultura & Arranjos Florais Nobres',
    avatar: 'Pessoas querendo emocionar entes queridos em datas comemorativas, pedidos de desculpas, aniversários ou decoração afetiva.',
    problemaCentral: 'Flores murchas na entrega, atraso no envio em datas surpresa e buquês que não correspondem às fotos do catálogo.',
    objetivoPrincipal: 'Encomendar buquê ou arranjo para entrega rápida no WhatsApp',
    ctaPrincipal: 'Pedir Buquê no WhatsApp',
    ctaSecundario: 'Ver Catálogo Floral',
    waMensagem: 'Olá! Vim pelo site e gostaria de encomendar flores/buquê para entrega.',
    tomVoz: 'Sensível, poético, carinhoso, elegante e acolhedor.',
    badgeLive: '● Entregas Rápidas no Mesmo Dia Disponíveis',
    diretrizesVisuais: {
      modo: 'light',
      bg: '#fdfbf9',
      surface: '#ffffff',
      text: '#27272a',
      muted: '#71717a',
      border: 'rgba(39, 39, 42, 0.08)',
      primary: '#059669', // Verde Esmeralda Floral
      primaryHover: '#047857',
      accent: '#e11d48', // Rosa Botão
      accentBg: '#fef2f2',
      accentText: '#be123c',
      badgeBg: '#ecfdf5',
      badgeText: '#065f46',
      fontSans: "'Plus Jakarta Sans', sans-serif",
      fontSerif: "'Playfair Display', serif",
      borderRadius: '24px'
    },
    imagens: {
      hero: 'https://images.unsplash.com/photo-1563241527-3004b7be0ffd?auto=format&fit=crop&w=1400&q=80',
      sobre: 'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&w=900&q=80',
      galeria: [
        'https://images.unsplash.com/photo-1561181286-d3fee7d55364?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1508610048659-a06b669e3321?auto=format&fit=crop&w=800&q=80'
      ]
    },
    headlinesCRO: [
      'Flores frescas selecionadas que transformam gestos de afeto em momentos eternos.',
      'Buquês e arranjos exclusivos preparados artesanalmente com entrega expressa.',
      'A beleza e o perfume da natureza entregues com pontualidade e carinho.'
    ],
    stats: [
      { valor: '+10.000', rotulo: 'Momentos Emocionados' },
      { valor: 'Frescas', rotulo: 'Flores Colhidas Direto do Produtor' },
      { valor: '★ 5.0', rotulo: 'Avaliação no Google' },
      { valor: 'Mesmo Dia', rotulo: 'Entrega Expressa Disponível' }
    ],
    servicos: [
      {
        titulo: 'Buquês de Rosas Selecionadas & Flores Nobres',
        desc: 'Hastes importadas frescas com acabamento em papéis nobres, laços de cetim e cartão personalizado feito à mão.',
        tag: 'Mais Vendido 🌹',
        icone: 'heart'
      },
      {
        titulo: 'Arranjos Especiais de Orquídeas & Folhagens',
        desc: 'Vasos elegantes e orquídeas premium de longa durabilidade para presentear com classe e decorar lares e escritórios.',
        tag: 'Elegância',
        icone: 'sparkles'
      },
      {
        titulo: 'Cestas de Café da Manhã & Presentes Afetivos',
        desc: 'Combinações deliciosas com pães artesanais, geleias nobres, frutas frescas e flores para surpreender logo ao acordar.',
        tag: 'Surpresa Especial',
        icone: 'gift'
      },
      {
        titulo: 'Assinatura Floral & Decoração para Eventos',
        desc: 'Substituição semanal de arranjos para recepções, clínicas e escritórios, além de montagem cenográfica para jantares.',
        tag: 'Corporativo & Festas',
        icone: 'calendar'
      }
    ],
    diferenciais: [
      { titulo: 'Flores Frescas Chegadas do Produtor', desc: 'Trabalhamos apenas com lotes recém-colhidos, garantindo máxima durabilidade em sua casa.' },
      { titulo: 'Entrega Rápida com Horário Agendado', desc: 'Sua surpresa chega intacta e exatamente no momento planejado sem atrasos.' },
      { titulo: 'Envio de Foto Prévia no WhatsApp', desc: 'Enviamos foto do arranjo pronto antes do envio para sua total tranquilidade e aprovação.' }
    ],
    reviews: [
      { autor: 'Camila Guimarães', texto: 'O buquê de rosas que recebi durou mais de 10 dias fresco! O perfume era incrível e a embalagem linda.', nota: 5 },
      { autor: 'Lucas Albuquerque', texto: 'Pedi a entrega surpresa para minha noiva e eles entregaram no minuto combinado. Ela chorou de emoção!', nota: 5 },
      { autor: 'Patricia Neves', texto: 'A cesta de café da manhã é muito farta e caprichada. Tudo fresquinho e com apresentação de revista.', nota: 5 }
    ],
    faq: [
      { pergunta: 'É possível entregar flores no mesmo dia?', resposta: 'Sim! Pedidos confirmados até as 14h podem ser entregues no mesmo dia na sua cidade.' },
      { pergunta: 'Posso incluir uma mensagem personalizada no cartão?', resposta: 'Com certeza! Você nos envia o texto pelo WhatsApp e nós caligrafamos em um cartão especial que acompanha o arranjo.' },
      { pergunta: 'Vocês enviam foto do arranjo pronto antes de sair para entrega?', resposta: 'Sim, sempre enviamos uma foto real no WhatsApp para você aprovar antes de o entregador partir.' }
    ]
  },

  // 22. PADRÃO / FALLBACK (COMÉRCIO & SERVIÇOS GERAIS)
  padrao: {
    aliases: ['serviço', 'empresa', 'comércio', 'comercio', 'loja', 'atendimento', 'geral'],
    nichoLabel: 'Comércio & Atendimento Especializado',
    avatar: 'Clientes buscando atendimento de confiança, agilidade, produtos/serviços de qualidade e suporte dedicado.',
    problemaCentral: 'Dificuldade de encontrar empresas transparentes que cumpram o combinado e ofereçam atendimento humano.',
    objetivoPrincipal: 'Falar com um especialista no WhatsApp e solicitar atendimento',
    ctaPrincipal: 'Falar no WhatsApp Agora',
    ctaSecundario: 'Conhecer Nossos Serviços',
    waMensagem: 'Olá! Vim pelo site e gostaria de saber mais informações e solicitar um orçamento.',
    tomVoz: 'Acolhedor, dinâmico, confiável, transparente e focado em resolver sua necessidade.',
    badgeLive: '● Atendimento Online e Imediato no WhatsApp',
    diretrizesVisuais: {
      modo: 'light',
      bg: '#faf9f6',
      surface: '#ffffff',
      text: '#18181b',
      muted: '#52525b',
      border: 'rgba(24, 24, 27, 0.08)',
      primary: '#0f172a',
      primaryHover: '#1e293b',
      accent: '#2563eb',
      accentBg: '#eff6ff',
      accentText: '#1d4ed8',
      badgeBg: '#f0fdf4',
      badgeText: '#15803d',
      fontSans: "'Plus Jakarta Sans', sans-serif",
      fontSerif: "'Plus Jakarta Sans', sans-serif",
      borderRadius: '20px'
    },
    imagens: {
      hero: 'https://images.unsplash.com/photo-1556742049-0a67c5574f73?auto=format&fit=crop&w=1400&q=80',
      sobre: 'https://images.unsplash.com/photo-1556740758-90de374c12ad?auto=format&fit=crop&w=900&q=80',
      galeria: [
        'https://images.unsplash.com/photo-1556740738-b6a63e27c4df?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1556740749-887f6717d7e4?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1556742208-999815fca738?auto=format&fit=crop&w=800&q=80'
      ]
    },
    headlinesCRO: [
      'Qualidade superior, atendimento dedicado e compromisso com você.',
      'Experiência comprovada, agilidade e atenção a cada detalhe para superar suas expectativas.',
      'A solução confiável e prática que você procura para o seu dia a dia.'
    ],
    stats: [
      { valor: '+10.000', rotulo: 'Clientes Atendidos' },
      { valor: '100% Pontual', rotulo: 'Compromisso com Prazos' },
      { valor: '★ 4.9', rotulo: 'Avaliação no Google' },
      { valor: 'Direto', rotulo: 'Atendimento Rápido no WhatsApp' }
    ],
    servicos: [
      {
        titulo: 'Atendimento Personalizado & Consultivo',
        desc: 'Escuta atenta para entender sua real necessidade e indicar as opções ideais com máxima clareza e transparência.',
        tag: 'Dedicado ⭐',
        icone: 'heart'
      },
      {
        titulo: 'Produtos & Serviços de Alto Padrão de Qualidade',
        desc: 'Seleção criteriosa de matérias-primas e métodos que garantem durabilidade, eficácia e sua plena satisfação.',
        tag: 'Garantido',
        icone: 'star'
      },
      {
        titulo: 'Orçamento Rápido & Sem Burocracia no WhatsApp',
        desc: 'Condições facilitadas, valores justos e respostas ágeis diretamente pelo nosso canal oficial sem intermediários.',
        tag: 'Ágil',
        icone: 'zap'
      },
      {
        titulo: 'Garantia de Satisfação & Pós-Atendimento Atencioso',
        desc: 'Acompanhamos seu pedido do primeiro contato até a conclusão com suporte contínuo para sua tranquilidade.',
        tag: 'Confiança',
        icone: 'shield'
      }
    ],
    diferenciais: [
      { titulo: 'Atendimento Humano e Sem Robôs', desc: 'Você conversa com pessoas de verdade prontas para te ajudar a encontrar a melhor solução.' },
      { titulo: 'Compromisso Rigoroso com Prazos', desc: 'Respeitamos seu tempo e entregamos exatamente o combinado no horário agendado.' },
      { titulo: 'Facilidade e Transparência no Pagamento', desc: 'Diversas formas de pagamento e clareza absoluta em cada orçamento sem taxas ocultas.' }
    ],
    reviews: [
      { autor: 'Carlos Eduardo Ramos', texto: 'Empresa séria, transparente e que cumpre exatamente o que promete. Atendimento nota dez!', nota: 5 },
      { autor: 'Mariana Duarte', texto: 'Fui muito bem atendida desde o primeiro contato no WhatsApp. Resolveram meu problema com agilidade.', nota: 5 },
      { autor: 'Felipe Santana', texto: 'Preço justo e serviço de muita qualidade. Com certeza voltarei a fazer negócios.', nota: 5 }
    ],
    faq: [
      { pergunta: 'Como solicitar um orçamento?', resposta: 'Basta clicar no botão do WhatsApp e nos enviar sua dúvida ou necessidade que nossa equipe responderá em poucos minutos.' },
      { pergunta: 'Quais as formas de pagamento disponíveis?', resposta: 'Aceitamos Pix, transferências, cartões de crédito e débito, com opções de parcelamento.' },
      { pergunta: 'Qual a garantia oferecida nos serviços?', resposta: 'Oferecemos garantia formal de satisfação e suporte contínuo para qualquer ajuste necessário.' }
    ]
  }
};

/**
 * Identifica o perfil de inteligência de nicho com casamento exato e ordenação por especificidade.
 * Ex: 'energia solar' casa antes de 'solar', 'estética automotiva' casa antes de 'estética', 'pizzaria' casa antes de 'restaurante'.
 */
export function resolveNicheProfile(nichoText = '', nomeText = '') {
  const cleanNicho = (nichoText || '').toLowerCase().trim();
  const cleanNome = (nomeText || '').toLowerCase().trim();
  const combined = `${cleanNicho} ${cleanNome}`.trim();

  // Coleta todas as chaves ordenadas com base no comprimento do maior alias correspondente
  // para dar preferência a termos mais específicos (ex: 'confeitaria' antes de 'comida', 'pizzaria' antes de 'restaurante')
  const profilesList = Object.entries(NICHE_PROFILES).filter(([k]) => k !== 'padrao');

  // 1. Tenta correspondência primeiro pelo nicho específico
  for (const [key, profile] of profilesList) {
    // Ordena aliases mais longos primeiro
    const sortedAliases = [...profile.aliases].sort((a, b) => b.length - a.length);
    if (sortedAliases.some(alias => cleanNicho.includes(alias))) {
      return { key, ...profile };
    }
  }

  // 2. Se nicho não correspondeu, busca pelo nome da empresa ou texto combinado
  for (const [key, profile] of profilesList) {
    const sortedAliases = [...profile.aliases].sort((a, b) => b.length - a.length);
    if (sortedAliases.some(alias => combined.includes(alias))) {
      return { key, ...profile };
    }
  }

  return { key: 'padrao', ...NICHE_PROFILES.padrao };
}
