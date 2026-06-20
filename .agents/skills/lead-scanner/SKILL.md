---
name: lead-scanner
description: |
  Ativa quando o usuário fala sobre Lead Scanner, SDR, WhatsApp bot, leads,
  campanhas, prospecção, disparos, scraping de sites, ou qualquer funcionalidade
  do MVP Lead Scanner. Use este skill para guiar mudanças no projeto.
---

# Skill: Lead Scanner MVP

## Contexto do Projeto

O projeto está em: `c:\Users\User\OneDrive\Documentos\Hamburgueria demostração\`

É um **SaaS de automação de vendas** que:
1. Faz scraping de sites para coletar leads (Puppeteer)
2. Analisa leads com IA (Groq/OpenAI)
3. Dispara mensagens personalizadas via WhatsApp (whatsapp-web.js)
4. Tem painel de gestão em React

## Comandos de Desenvolvimento

```powershell
# Rodar tudo (frontend + backend):
npm run dev:all

# Só frontend (porta 5173):
npm run dev

# Só backend (porta 3001):
npm run bot

# Build de produção:
npm run build
```

## Arquitetura de API

Todas as rotas da API ficam em `server.js`. Padrão:
- Rotas públicas: `/api/auth/login`, `/api/auth/register`, `/api/qr`, `/api/status`
- Rotas protegidas: precisam de `Authorization: Bearer <JWT>`
- Middleware de auth: função `authenticateToken` em `server.js`

## Padrão de Persistência

Os dados são salvos em JSON no mesmo diretório:
```js
// Ler
let dbLeads = JSON.parse(fs.readFileSync(LEADS_FILE, 'utf-8'));

// Salvar
function saveLeads() { fs.writeFileSync(LEADS_FILE, JSON.stringify(dbLeads, null, 2)); }
```

## Padrão de Componente React

```jsx
import React, { useState, useEffect } from 'react';
import { IconName } from 'lucide-react';

export default function LeadScannerXxx({ userRole, planInfo }) {
  const [data, setData] = useState([]);
  const token = localStorage.getItem('sdr_jwt_token');

  const fetchData = async () => {
    const res = await fetch('/api/rota', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const json = await res.json();
    setData(json);
  };

  useEffect(() => { fetchData(); }, []);

  return (
    <div className="p-6 h-full overflow-y-auto">
      {/* Conteúdo com dark theme */}
    </div>
  );
}
```

## Design System (Dark Theme)

- Background principal: `#0a0a0a`
- Cards: `bg-white/5 border border-white/10 rounded-2xl`
- Texto primário: `text-white`
- Texto secundário: `text-gray-400`
- Botão primário: `bg-gradient-to-r from-blue-600 to-purple-600`
- Sucesso: `text-green-400`
- Aviso: `text-amber-400`
- Erro: `text-red-400`
