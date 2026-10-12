/**
 * proposalGenerator.js
 * Gerador da Proposta Comercial em PDF (5 páginas estratégicas de fechamento)
 * Formatação A4 vetorial pronta para exportação via Puppeteer ou impressão no navegador.
 */

import { buildBusinessProfile, cleanWhatsAppNumber } from './siteBuilderEngine.js';

export function compileProposalHtml(lead, consultantData = {}, screenshots = {}) {
  const profile = buildBusinessProfile(lead);

  const vendedorNome = consultantData.nome || 'Consultor Comercial';
  const vendedorTelefone = consultantData.telefone || '(11) 99999-9999';
  const vendedorWa = consultantData.whatsapp || vendedorTelefone;
  const agenciaNome = consultantData.agencia || 'LeadScanner Studio';
  const dataHoje = new Date().toLocaleDateString('pt-BR');

  const desktopPreview = screenshots.desktop || profile.imagens.hero;
  const mobilePreview = screenshots.mobile || profile.imagens.sobre;

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>Proposta Comercial - ${profile.nome}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Playfair+Display:ital,wght@0,700;1,400&display=swap" rel="stylesheet">
  
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Plus Jakarta Sans', sans-serif;
      background: #f1f5f9;
      color: #0f172a;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }

    /* Cada página equivale a uma folha A4 */
    .page {
      width: 210mm;
      min-height: 297mm;
      padding: 24mm 20mm;
      margin: 20px auto;
      background: #ffffff;
      box-shadow: 0 10px 30px rgba(0,0,0,0.08);
      position: relative;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      page-break-after: always;
      overflow: hidden;
    }

    @media print {
      body { background: transparent; }
      .page {
        margin: 0;
        box-shadow: none;
        width: 100%;
        height: 100vh;
        min-height: auto;
      }
    }

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 2px solid #f1f5f9;
      padding-bottom: 12px;
      margin-bottom: 25px;
    }
    .header-logo {
      font-weight: 800;
      font-size: 14px;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      color: #0284c7;
    }
    .header-date {
      font-size: 11px;
      color: #64748b;
      font-weight: 600;
    }

    .page-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-top: 1px solid #e2e8f0;
      padding-top: 12px;
      font-size: 10px;
      color: #94a3b8;
    }

    /* PÁGINA 1: CAPA */
    .cover-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      padding: 40px 0;
    }
    .cover-badge {
      display: inline-block;
      padding: 6px 14px;
      background: #e0f2fe;
      color: #0369a1;
      border-radius: 999px;
      font-size: 12px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      margin-bottom: 24px;
      width: max-content;
    }
    .cover-title {
      font-size: 40px;
      font-weight: 800;
      line-height: 1.15;
      color: #0f172a;
      margin-bottom: 16px;
    }
    .cover-company {
      font-family: 'Playfair Display', serif;
      font-style: italic;
      color: #0284c7;
      display: block;
      margin-top: 8px;
    }
    .cover-subtitle {
      font-size: 17px;
      color: #64748b;
      line-height: 1.6;
      max-width: 600px;
      margin-bottom: 35px;
    }
    .cover-preview-img {
      width: 100%;
      height: 300px;
      object-fit: cover;
      object-position: top;
      border-radius: 18px;
      box-shadow: 0 16px 40px rgba(0,0,0,0.12);
      border: 1px solid #e2e8f0;
    }

    /* PÁGINA 2: ANÁLISE DIGITAL */
    .title-h2 {
      font-size: 26px;
      font-weight: 800;
      color: #0f172a;
      margin-bottom: 10px;
    }
    .text-intro {
      font-size: 14px;
      color: #475569;
      line-height: 1.6;
      margin-bottom: 24px;
    }
    .card-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
      margin-bottom: 24px;
    }
    .info-box {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 14px;
      padding: 18px;
    }
    .info-box-title {
      font-size: 14px;
      font-weight: 700;
      color: #0f172a;
      margin-bottom: 6px;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .info-box-desc {
      font-size: 12px;
      color: #64748b;
      line-height: 1.5;
    }

    /* PÁGINA 3: O NOVO SITE */
    .mockup-grid {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 18px;
      align-items: center;
      margin-top: 20px;
    }
    .desktop-mockup {
      border: 1px solid #cbd5e1;
      border-radius: 14px;
      overflow: hidden;
      box-shadow: 0 12px 30px rgba(0,0,0,0.1);
    }
    .desktop-bar {
      background: #e2e8f0;
      padding: 6px 12px;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .desktop-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #94a3b8;
    }
    .desktop-img {
      width: 100%;
      height: 320px;
      object-fit: cover;
      object-position: top;
      display: block;
    }
    .mobile-mockup {
      border: 6px solid #1e293b;
      border-radius: 24px;
      overflow: hidden;
      box-shadow: 0 16px 40px rgba(0,0,0,0.15);
      background: #ffffff;
    }
    .mobile-img {
      width: 100%;
      height: 340px;
      object-fit: cover;
      object-position: top;
      display: block;
    }

    /* PÁGINA 4: O QUE O SITE POSSUI */
    .checklist-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
      margin-top: 15px;
    }
    .check-item {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 14px 18px;
    }
    .check-icon {
      background: #dcfce7;
      color: #15803d;
      width: 26px;
      height: 26px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 800;
      font-size: 13px;
      flex-shrink: 0;
    }
    .check-title {
      font-size: 13px;
      font-weight: 700;
      color: #0f172a;
    }
    .check-desc {
      font-size: 11px;
      color: #64748b;
      margin-top: 2px;
    }

    /* PÁGINA 5: RESULTADO ESPERADO & CTA */
    .benefits-box {
      background: #f0fdf4;
      border: 1px solid #bbf7d0;
      border-radius: 16px;
      padding: 24px;
      margin-bottom: 30px;
    }
    .contact-card {
      background: #0f172a;
      color: #ffffff;
      border-radius: 18px;
      padding: 30px;
      text-align: center;
    }
    .contact-card h3 {
      font-size: 22px;
      font-weight: 800;
      margin-bottom: 8px;
    }
    .contact-card p {
      font-size: 13px;
      color: #94a3b8;
      margin-bottom: 20px;
    }
    .btn-wa-print {
      display: inline-block;
      background: #22c55e;
      color: #ffffff;
      font-weight: 700;
      font-size: 14px;
      padding: 12px 28px;
      border-radius: 999px;
      text-decoration: none;
      margin-bottom: 16px;
    }
    .rep-info {
      font-size: 12px;
      color: #cbd5e1;
      line-height: 1.6;
    }
  </style>
</head>
<body>

  <!-- PÁGINA 1: CAPA -->
  <div class="page">
    <div class="page-header">
      <div class="header-logo">${agenciaNome}</div>
      <div class="header-date">${dataHoje}</div>
    </div>

    <div class="cover-content">
      <span class="cover-badge">Proposta de Valor Digital</span>
      <h1 class="cover-title">
        Criamos uma Proposta Exclusiva Para
        <span class="cover-company">${profile.nome}</span>
      </h1>
      <p class="cover-subtitle">
        Apresentamos uma visão estratégica de posicionamento na internet: um site moderno, rápido e desenhado para converter visitantes em clientes no seu WhatsApp.
      </p>
      <img src="${desktopPreview}" alt="Capa" class="cover-preview-img">
    </div>

    <div class="page-footer">
      <span>Projeto elaborado para ${profile.nome} · ${profile.cidade}</span>
      <span>Página 1 de 5</span>
    </div>
  </div>

  <!-- PÁGINA 2: ANÁLISE DIGITAL -->
  <div class="page">
    <div class="page-header">
      <div class="header-logo">${agenciaNome}</div>
      <div class="header-date">Diagnóstico de Presença</div>
    </div>

    <div>
      <h2 class="title-h2">Diagnóstico de Mercado & Oportunidades</h2>
      <p class="text-intro">
        Analisamos a presença digital da <strong>${profile.nome}</strong> e os padrões de busca do nicho de <strong>${profile.nicheLabel}</strong> em <strong>${profile.cidade}</strong>. Identificamos pontos de alto potencial para acelerar seus contatos comerciais.
      </p>

      <div class="card-grid">
        <div class="info-box">
          <div class="info-box-title">📍 Presença no Google Maps</div>
          <div class="info-box-desc">
            Sua empresa possui reputação de destaque com nota <strong>${profile.nota} estrelas</strong>. Transformar esse prestígio em um site oficial multiplica a confiança do cliente imediato.
          </div>
        </div>

        <div class="info-box">
          <div class="info-box-title">⚡ Velocidade no Mobile</div>
          <div class="info-box-desc">
            Mais de 80% das buscas locais acontecem via smartphone. Uma página otimizada reduz desistências e leva o cliente direto ao botão do WhatsApp.
          </div>
        </div>

        <div class="info-box">
          <div class="info-box-title">🎯 Clareza na Oferta</div>
          <div class="info-box-desc">
            Apresentar os principais diferenciais e especialidades de forma escaneável elimina dúvidas e reduz o tempo de fechamento comercial.
          </div>
        </div>

        <div class="info-box">
          <div class="info-box-title">🛡️ Autoridade & Segurança</div>
          <div class="info-box-desc">
            Um design com padrão estético de grandes marcas transmite solidez institucional instantânea frente a concorrentes genéricos.
          </div>
        </div>
      </div>
    </div>

    <div class="page-footer">
      <span>Confidencial · Desenvolvido para ${profile.nome}</span>
      <span>Página 2 de 5</span>
    </div>
  </div>

  <!-- PÁGINA 3: SEU NOVO SITE -->
  <div class="page">
    <div class="page-header">
      <div class="header-logo">${agenciaNome}</div>
      <div class="header-date">Visualização do Projeto</div>
    </div>

    <div>
      <h2 class="title-h2">A Nova Experiência da Sua Marca</h2>
      <p class="text-intro">
        Projetamos uma interface moderna e acolhedora, destacando a essência e os valores da <strong>${profile.nome}</strong> em todos os dispositivos.
      </p>

      <div class="mockup-grid">
        <div class="desktop-mockup">
          <div class="desktop-bar">
            <span class="desktop-dot"></span>
            <span class="desktop-dot"></span>
            <span class="desktop-dot"></span>
            <span style="font-size: 10px; color: #64748b; margin-left: 8px;">${profile.nome.toLowerCase().replace(/\s+/g, '')}.com.br</span>
          </div>
          <img src="${desktopPreview}" class="desktop-img" alt="Desktop Preview">
        </div>

        <div class="mobile-mockup">
          <img src="${mobilePreview}" class="mobile-img" alt="Mobile Preview">
        </div>
      </div>
    </div>

    <div class="page-footer">
      <span>Design 100% Responsivo adaptado a qualquer tela</span>
      <span>Página 3 de 5</span>
    </div>
  </div>

  <!-- PÁGINA 4: O QUE O SITE POSSUI -->
  <div class="page">
    <div class="page-header">
      <div class="header-logo">${agenciaNome}</div>
      <div class="header-date">Especificações Técnicas</div>
    </div>

    <div>
      <h2 class="title-h2">Tudo o Que Seu Site Possui</h2>
      <p class="text-intro">
        Cada elemento foi planejado estrategicamente com foco em velocidade, facilidade de navegação e aumento de conversão.
      </p>

      <div class="checklist-list">
        <div class="check-item">
          <div class="check-icon">✓</div>
          <div>
            <div class="check-title">Integração Direta com WhatsApp</div>
            <div class="check-desc">Botões flutuantes e chamadas com mensagens automáticas pré-preenchidas para o cliente chamar sem atrito.</div>
          </div>
        </div>

        <div class="check-item">
          <div class="check-icon">✓</div>
          <div>
            <div class="check-title">Design 100% Personalizado e Responsivo</div>
            <div class="check-desc">Layout que se adapta perfeitamente a computadores, notebooks, tablets e smartphones.</div>
          </div>
        </div>

        <div class="check-item">
          <div class="check-icon">✓</div>
          <div>
            <div class="check-title">Otimização de Conversão (CRO)</div>
            <div class="check-desc">Textos persuasivos com estrutura PAS (Problema, Agitação, Solução) sem clichês ou promessas irreais.</div>
          </div>
        </div>

        <div class="check-item">
          <div class="check-icon">✓</div>
          <div>
            <div class="check-title">SEO Local (Google & Buscas)</div>
            <div class="check-desc">Meta tags configuradas com seu nome, nicho e cidade (${profile.cidade}) para melhor indexação no Google.</div>
          </div>
        </div>

        <div class="check-item">
          <div class="check-icon">✓</div>
          <div>
            <div class="check-title">Velocidade Extrema de Carregamento</div>
            <div class="check-desc">Estrutura leve e otimizada que abre instantaneamente até em conexões 4G móveis.</div>
          </div>
        </div>
      </div>
    </div>

    <div class="page-footer">
      <span>Padrão de engenharia moderno e seguro</span>
      <span>Página 4 de 5</span>
    </div>
  </div>

  <!-- PÁGINA 5: RESULTADO & FECHAMENTO -->
  <div class="page">
    <div class="page-header">
      <div class="header-logo">${agenciaNome}</div>
      <div class="header-date">Próximos Passos</div>
    </div>

    <div>
      <h2 class="title-h2">Resultados Esperados & Próximo Passo</h2>
      <p class="text-intro">
        Ao colocar esse projeto no ar, a <strong>${profile.nome}</strong> alcança um novo patamar de autoridade e disponibilidade para o público de ${profile.cidade}.
      </p>

      <div class="benefits-box">
        <h4 style="font-size: 15px; font-weight: 700; color: #15803d; margin-bottom: 12px;">Principais Benefícios:</h4>
        <ul style="list-style: none; display: flex; flex-direction: column; gap: 8px; font-size: 13px; color: #166534;">
          <li>✓ <strong>Autoridade Imediata:</strong> Clientes que buscarem sua empresa encontrarão um endereço oficial de alto padrão.</li>
          <li>✓ <strong>Presença 24 Horas:</strong> Sua marca trabalhando e recebendo contatos mesmo fora do horário comercial.</li>
          <li>✓ <strong>Mais Contatos Qualificados:</strong> O cliente tira dúvidas básicas e chega ao WhatsApp pronto para fechar.</li>
        </ul>
      </div>

      <div class="contact-card">
        <h3>Gostou do Que Criamos Para Sua Empresa?</h3>
        <p>Podemos colocar este projeto no ar com domínio próprio e todos os ajustes necessários em poucos dias.</p>
        <a href="https://wa.me/${cleanWhatsAppNumber(vendedorWa)}" class="btn-wa-print">
          Falar com ${vendedorNome} no WhatsApp
        </a>
        <div class="rep-info">
          <div><strong>Responsável:</strong> ${vendedorNome}</div>
          <div><strong>WhatsApp / Telefone:</strong> ${vendedorTelefone}</div>
          <div><strong>Agência:</strong> ${agenciaNome}</div>
        </div>
      </div>
    </div>

    <div class="page-footer">
      <span>${agenciaNome} · Conectando empresas a resultados extraordinários</span>
      <span>Página 5 de 5</span>
    </div>
  </div>

</body>
</html>`;
}
