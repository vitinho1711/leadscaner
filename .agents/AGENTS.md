# Lead Scanner — Regras do Projeto para o Antigravity

## Visão Geral do Projeto

**Lead Scanner** é um MVP SaaS de prospecção e automação de vendas via WhatsApp.  
O sistema coleta leads de sites (via Puppeteer/web scraping), analisa-os com IA (OpenAI/Groq),
e dispara mensagens automatizadas de vendas via WhatsApp Web.js.

## Stack Tecnológica

### Frontend
- **React 19** + **Vite 8**
- **Lucide React** para ícones
- **Framer Motion** para animações
- CSS customizado (sem Tailwind — usa classes utilitárias definidas em `src/index.css`)
- Arquivos: `src/App.jsx`, `src/components/`

### Backend
- **Node.js** com **Express 5**
- **whatsapp-web.js** para automação WhatsApp
- **Puppeteer** para web scraping de leads
- **OpenAI / Groq API** para análise de leads com IA
- **JWT (jsonwebtoken)** + **bcryptjs** para autenticação
- **Supabase** (configurado, uso futuro)
- Arquivo principal: `server.js`
- Persistência: arquivos JSON locais (`leads.json`, `users.json`, `history.json`, `invites.json`, `campaign_templates.json`)

## Estrutura de Arquivos

```
/
├── server.js               # Backend Express + WhatsApp Bot + API
├── sitePromptBuilder.js    # Builder de prompts para scraping de sites
├── src/
│   ├── App.jsx             # Auth + roteamento principal
│   ├── index.css           # Design system completo (dark theme)
│   ├── components/
│   │   ├── SdrSystem.jsx           # App principal (navegação entre módulos)
│   │   ├── Menu.jsx                # Cardápio digital (/menu e /cardapio)
│   │   ├── LeadScannerDashboard.jsx
│   │   ├── LeadScannerLeads.jsx
│   │   ├── LeadScannerMessages.jsx
│   │   ├── LeadScannerAnalysis.jsx
│   │   ├── LeadScannerHistory.jsx
│   │   ├── LeadScannerSettings.jsx
│   │   ├── LeadScannerAccount.jsx
│   │   ├── LeadScannerInvites.jsx
│   │   ├── SdrSystem.jsx
│   │   └── SdrSitePrompts.jsx
├── leads.json              # Base de dados de leads
├── users.json              # Usuários do sistema
├── invites.json            # Códigos de convite
├── history.json            # Histórico de mensagens
├── campaign_templates.json # Templates de campanhas
├── .env                    # Variáveis de ambiente (não commitar)
└── .env.example            # Template de variáveis
```

## Regras de Desenvolvimento

1. **Não modificar `.env`** — nunca editar ou expor credenciais.
2. **Persistência é via JSON** — os dados ficam em arquivos locais (`leads.json`, etc.), não em banco de dados externo (por enquanto).
3. **Design dark theme** — o sistema usa tema escuro (`#0a0a0a` como base). Manter consistência visual.
4. **Classes CSS do `index.css`** — não usar Tailwind. Usar as classes utilitárias definidas no `index.css` do projeto.
5. **Autenticação JWT** — todas as rotas protegidas usam o header `Authorization: Bearer <token>`.
6. **WhatsApp Session** — a sessão do WhatsApp fica em `.wwebjs_auth/`. Nunca deletar sem confirmação do usuário.
7. **Scripts disponíveis**:
   - `npm run dev` — inicia apenas o frontend (Vite)
   - `npm run bot` — inicia apenas o backend (Express + WhatsApp)
   - `npm run dev:all` — inicia frontend + backend simultaneamente
8. **Porta do backend**: `3001` (configurável via `PORT` no `.env`)
9. **Sistema de planos**: usuários têm plano `trial` (com `trialDays` e expiração) ou `admin`.

## Funcionalidades Principais

- **Dashboard**: métricas de leads, conversões, atividade
- **Leads**: gerenciamento da base de leads (import CSV, visualização, filtros)
- **Mensagens**: disparos WhatsApp, templates, campanhas
- **Análise**: análise de leads com IA (Groq/OpenAI), score de qualidade
- **Histórico**: registro de todas as interações
- **Configurações**: configurações do bot, personalização
- **Conta**: gerenciamento de conta do usuário
- **Convites**: sistema de convites para novos usuários (trial)
- **Cardápio** (`/menu`): cardápio digital para hamburguerias (rota pública)
- **SDR Site Prompts**: sistema de prompts para scraping e prospecção

## Contexto de Negócio

- O produto é um **SaaS de automação de vendas** via WhatsApp
- Público-alvo: times de vendas, SDRs, pequenas empresas
- Funciona como uma ferramenta de prospecção automática
- O nome do repositório (`Hamburgueria demonstração`) é apenas o projeto demonstração/piloto
- O produto real se chama **Lead Scanner**
