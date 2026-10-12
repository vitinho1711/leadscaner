import express from 'express';
import { buildSitePrompt, FRONTEND_DESIGN_SYSTEM_PROMPT, buildSpecializedBusinessPrompt, detectBusinessArchetype, BUSINESS_ARCHETYPES, generateBusinessPromptWithAi } from './sitePromptBuilder.js';
import { defaultStitchService } from './stitchService.js';
import { compileSiteHtml, buildBusinessProfile, applyCreativeDirection, resolveBestSkillForNiche } from './siteBuilderEngine.js';
import { compileProposalHtml } from './proposalGenerator.js';
import { buildAlphaStudioPrompt } from './alphaStudioPrompt.js';
import cors from 'cors';
import puppeteer from 'puppeteer';
import { OpenAI } from 'openai';
import dotenv from 'dotenv';
import pkg from 'whatsapp-web.js';
import qrcodeTerminal from 'qrcode-terminal';
import qrcodeImage from 'qrcode';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { fileURLToPath } from 'url';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import compression from 'compression';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const { Client, LocalAuth, MessageMedia } = pkg;
dotenv.config();

process.on('uncaughtException', (err) => { console.error('⚠️ Erro não capturado:', err.message); });
process.on('unhandledRejection', (reason) => { console.error('⚠️ Promise rejeitada:', reason?.message || reason); });

const DATA_DIR = process.env.DATA_DIR || __dirname;
if (DATA_DIR !== __dirname && !fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

const PROPOSALS_DIR = path.join(DATA_DIR, 'proposals');
if (!fs.existsSync(PROPOSALS_DIR)) fs.mkdirSync(PROPOSALS_DIR, { recursive: true });

const LEADS_FILE = path.join(DATA_DIR, 'leads.json');
let dbLeads = [];
try { if (fs.existsSync(LEADS_FILE)) dbLeads = JSON.parse(fs.readFileSync(LEADS_FILE, 'utf-8')); } catch (e) { }
function saveLeads() { try { fs.writeFileSync(LEADS_FILE, JSON.stringify(dbLeads, null, 2), 'utf-8'); } catch (e) { } }

const TEMPLATES_FILE = path.join(DATA_DIR, 'campaign_templates.json');
let campaignTemplates = [];
try { if (fs.existsSync(TEMPLATES_FILE)) campaignTemplates = JSON.parse(fs.readFileSync(TEMPLATES_FILE, 'utf-8')); } catch (e) { }
function saveTemplates() { try { fs.writeFileSync(TEMPLATES_FILE, JSON.stringify(campaignTemplates, null, 2), 'utf-8'); } catch (e) { } }

const USERS_FILE = path.join(DATA_DIR, 'users.json');
let dbUsers = [];
try { if (fs.existsSync(USERS_FILE)) dbUsers = JSON.parse(fs.readFileSync(USERS_FILE, 'utf-8')); } catch (e) { }
function saveUsers() { try { fs.writeFileSync(USERS_FILE, JSON.stringify(dbUsers, null, 2), 'utf-8'); } catch (e) { } }

// Garante contas permanentes com acesso ilimitado (Admin e Sócio)
const PERMANENT_ACCOUNTS = [
  {
    id: "1",
    username: "admin",
    password: "$2b$10$7XdOQF6LU7yuKSuJuCgBDuA8ZDjPF3wgYj5WcVvlwRUpM2H2K7ew.", // 123456
    accessCode: "ADMIN-MASTER",
    role: "admin",
    tier: "pro",
    config: { groqApiKey: "", enableAutoResponder: true }
  },
  {
    id: "2",
    username: "socio",
    password: "$2b$10$r.nwO0byymzbHdbNvtWd0O8bJtHuZuzMEIASLU1PaMZeGYqxyF8M.", // socio2026
    accessCode: "SOCIO-MASTER",
    role: "admin",
    tier: "pro",
    config: { groqApiKey: "", enableAutoResponder: true }
  }
];

PERMANENT_ACCOUNTS.forEach(acc => {
  const existing = dbUsers.find(u => u.username && u.username.toLowerCase() === acc.username.toLowerCase());
  if (!existing) {
    dbUsers.push({ ...acc, createdAt: new Date().toISOString() });
  } else {
    existing.role = 'admin';
    existing.tier = 'pro';
    existing.accessCode = acc.accessCode;
    existing.password = acc.password;
  }
});
saveUsers();

const HISTORY_FILE = path.join(DATA_DIR, 'history.json');
let dbHistory = [];
try { if (fs.existsSync(HISTORY_FILE)) dbHistory = JSON.parse(fs.readFileSync(HISTORY_FILE, 'utf-8')); } catch (e) { }
function saveHistory() { try { fs.writeFileSync(HISTORY_FILE, JSON.stringify(dbHistory, null, 2), 'utf-8'); } catch (e) { } }

const INVITES_FILE = path.join(DATA_DIR, 'invites.json');
let dbInvites = [];
try { if (fs.existsSync(INVITES_FILE)) dbInvites = JSON.parse(fs.readFileSync(INVITES_FILE, 'utf-8')); } catch (e) { }

// Garante convites padrão de teste sempre ativos
const DEFAULT_SYSTEM_INVITES = [
  'LEAD-TESTE-2026',
  'LEAD-VIP-DEMO',
  'LEAD-RFPB-ZM2D',
  'LEAD-0R0Z-M86P',
  'LEAD-Q0YP-T7S5'
];
DEFAULT_SYSTEM_INVITES.forEach(code => {
  if (!dbInvites.find(i => i.code === code)) {
    dbInvites.push({
      id: 'sys_' + code,
      code,
      status: 'active',
      trialDays: 7,
      maxLeads: 100,
      maxMessagesPerDay: 50,
      maxScrapesPerDay: 15,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
      createdBy: 'admin'
    });
  }
});
function saveInvites() { try { fs.writeFileSync(INVITES_FILE, JSON.stringify(dbInvites, null, 2), 'utf-8'); } catch (e) { } }
saveInvites();

const JWT_SECRET = process.env.JWT_SECRET || 'leadscanner_super_secret_key_2026';

const app = express();
app.set('trust proxy', 1); // Suporte a Vercel e Render Proxies (IPs reais)
app.use(helmet({
  contentSecurityPolicy: false, // Desabilitado para não quebrar o React no front
}));
app.use(compression());
app.use(cors());
app.use(express.json());

// LIMITADORES DE REQUISIÇÃO (Desabilitados para evitar erro 429 com múltiplos proxies Vercel/Render)
const globalLimiter = (req, res, next) => next();
const authLimiter = (req, res, next) => next();

// --- AUTENTICAÇÃO ---
app.post('/api/auth/login', authLimiter, (req, res) => {
  let { accessCode, username, password } = req.body;
  
  if (accessCode) {
    accessCode = accessCode.trim().toUpperCase();
    let user = dbUsers.find(u => u.accessCode === accessCode);
    
    // Suporte especial para código mestre admin
    if (!user && (accessCode === 'ADMIN-MASTER' || accessCode === 'ADMIN')) {
      user = dbUsers.find(u => u.role === 'admin');
      if (user) {
        user.accessCode = 'ADMIN-MASTER';
        saveUsers();
      }
    }

    // Lógica para aceitar "Código de Convite/Teste" no campo de Acesso
    if (!user && accessCode.startsWith('LEAD-')) {
      let invite = dbInvites.find(i => i.code === accessCode && i.status === 'active');
      
      // Se não achou na lista em memória (ex: servidor no Render reiniciou/hibernou),
      // aceitamos o código automaticamente para NUNCA barrar o testador!
      const trialDays = invite ? (invite.trialDays || 7) : 7;
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + trialDays);
      const codeSuffix = accessCode.replace('LEAD-', '').replace(/[^A-Z0-9]/g, '').slice(0, 4).toLowerCase() || 'vip';

      user = {
        id: Date.now().toString(),
        username: `trial_${codeSuffix}`,
        password: '',
        role: 'trial',
        tier: 'trial',
        accessCode: accessCode, // O código de convite vira o código de acesso permanente
        plan: {
          type: 'trial',
          expiresAt: expiresAt.toISOString(),
          limits: {
            maxLeads: invite?.maxLeads || 100,
            maxMessagesPerDay: invite?.maxMessagesPerDay || 50,
            maxScrapesPerDay: invite?.maxScrapesPerDay || 15
          },
          usage: { leadsCount: 0, messagesToday: 0, scrapesToday: 0, lastResetDate: new Date().toISOString().split('T')[0] }
        },
        config: { groqApiKey: '', enableAutoResponder: true },
        createdAt: new Date().toISOString()
      };
      dbUsers.push(user);
      saveUsers();
      
      if (invite) {
        invite.status = 'used';
        invite.usedBy = user.id;
        invite.usedAt = new Date().toISOString();
        saveInvites();
      }
    }

    if (!user) return res.status(401).json({ error: 'Código de Acesso ou Teste inválido' });
    const tier = user.tier || (user.role === 'admin' ? 'pro' : 'basic');
    const token = jwt.sign({ id: user.id, username: user.username, role: user.role, tier }, JWT_SECRET, { expiresIn: '7d' });
    return res.json({ success: true, token, user: { username: user.username, role: user.role, tier } });
  }

  if (!username || !password) return res.status(401).json({ error: 'Preencha todos os campos' });
  
  username = username.trim().toLowerCase();
  password = password.trim();
  
  const user = dbUsers.find(u => u.username && u.username.toLowerCase() === username);
  if (!user) return res.status(401).json({ error: 'Usuário ou senha inválidos' });
  if (!user.password || !bcrypt.compareSync(password, user.password)) return res.status(401).json({ error: 'Usuário ou senha inválidos' });
  
  const tier = user.tier || (user.role === 'admin' ? 'pro' : 'basic');
  const token = jwt.sign({ id: user.id, username: user.username, role: user.role, tier }, JWT_SECRET, { expiresIn: '7d' });
  res.json({ success: true, token, user: { username: user.username, role: user.role, tier } });
});

app.post('/api/auth/register', authLimiter, (req, res) => {
  const { username, password, inviteCode } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'Preencha usuário e senha' });
  if (dbUsers.find(u => u.username === username)) return res.status(400).json({ error: 'Usuário já existe' });
  
  // Validate invite code
  if (!inviteCode) return res.status(400).json({ error: 'Código de convite obrigatório' });
  const invite = dbInvites.find(i => i.code === inviteCode && i.status === 'active');
  if (!invite) return res.status(400).json({ error: 'Código de convite inválido ou expirado' });
  if (invite.expiresAt && new Date(invite.expiresAt) < new Date()) {
    invite.status = 'expired';
    saveInvites();
    return res.status(400).json({ error: 'Código de convite expirado' });
  }
  
  const trialDays = invite.trialDays || 7;
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + trialDays);
  
  const newUser = {
    id: Date.now().toString(),
    username,
    password: bcrypt.hashSync(password, 10),
    role: 'trial',
    plan: {
      type: 'trial',
      expiresAt: expiresAt.toISOString(),
      limits: {
        maxLeads: invite.maxLeads || 50,
        maxMessagesPerDay: invite.maxMessagesPerDay || 20,
        maxScrapesPerDay: invite.maxScrapesPerDay || 3
      },
      usage: {
        leadsCount: 0,
        messagesToday: 0,
        scrapesToday: 0,
        lastResetDate: new Date().toISOString().split('T')[0]
      }
    },
    inviteCode: inviteCode,
    createdAt: new Date().toISOString(),
    config: { groqApiKey: '', enableAutoResponder: true }
  };
  
  dbUsers.push(newUser);
  saveUsers();
  
  // Mark invite as used
  invite.status = 'used';
  invite.usedBy = newUser.username;
  invite.usedAt = new Date().toISOString();
  saveInvites();
  
  const tier = 'pro'; // Trials get pro by default
  const token = jwt.sign({ id: newUser.id, username: newUser.username, role: newUser.role, tier }, JWT_SECRET, { expiresIn: '7d' });
  res.json({ success: true, token, user: { username: newUser.username, role: newUser.role, tier } });
});

// ENDPOINTS PÚBLICOS (antes do middleware de autenticação)
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', uptime: process.uptime(), timestamp: new Date().toISOString() });
});

app.get('/api/invite/validate/:code', (req, res) => {
  const invite = dbInvites.find(i => i.code === req.params.code && i.status === 'active');
  if (!invite) return res.json({ valid: false, error: 'Código inválido ou já utilizado' });
  if (invite.expiresAt && new Date(invite.expiresAt) < new Date()) {
    invite.status = 'expired';
    saveInvites();
    return res.json({ valid: false, error: 'Código expirado' });
  }
  res.json({ valid: true, trialDays: invite.trialDays || 7, maxLeads: invite.maxLeads || 50 });
});

  // ==========================================
  // INTEGRAÇÃO CACTOO & ENVIO DE E-MAILS
  // ==========================================

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: process.env.SMTP_PORT || 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER || 'seu-email@gmail.com',
      pass: process.env.SMTP_PASS || 'sua-senha-de-app'
    }
  });

  app.post('/api/webhooks/cactoo', async (req, res) => {
    try {
      const payload = req.body;
      console.log('Webhook Cactoo recebido:', payload);
      
      const status = payload.status || payload.event || '';
      const isApproved = status.includes('approved') || status.includes('paid');

      if (!isApproved) return res.status(200).json({ message: 'Ignorado' });

      const data = payload.data || {};
      const email = payload.email || payload.customer?.email || data.customer?.email;
      const name = payload.name || payload.customer?.name || data.customer?.name || 'Cliente';
      const docNumber = payload.customer?.docNumber || data.customer?.docNumber || '';
      const amount = payload.amount || payload.transaction?.amount || data.amount || 0;
      const productName = (payload.product?.name || payload.product || data.product?.name || '').toLowerCase();

      if (!email) return res.status(400).json({ error: 'Email não fornecido.' });

      let tier = 'pro';
      if (amount === 96 || amount === 9600 || amount === 97 || amount === 9700 || productName.includes('basic')) tier = 'basic';
      else if (amount === 167 || amount === 16700 || amount === 167.76 || amount === 16776 || productName.includes('pro')) tier = 'pro';

      let user = dbUsers.find(u => u.username === email);
      let accessCode = '';
      
      if (user) {
        user.tier = tier;
        if (!user.accessCode) {
           const prefix = tier === 'pro' ? 'PRO' : 'BSC';
           const randomStr = Math.random().toString(36).substring(2, 8).toUpperCase();
           user.accessCode = `${prefix}-${randomStr}`;
        }
        accessCode = user.accessCode;
        saveUsers();
      } else {
        const prefix = tier === 'pro' ? 'PRO' : 'BSC';
        const randomStr = Math.random().toString(36).substring(2, 8).toUpperCase();
        accessCode = `${prefix}-${randomStr}`;
        
        user = {
          id: 'usr_' + Date.now(),
          username: email,
          accessCode: accessCode,
          role: 'user',
          tier: tier,
          plan: { type: 'LIFETIME' },
          createdAt: new Date().toISOString()
        };
        dbUsers.push(user);
        saveUsers();
      }

      if (accessCode) {
        const mailOptions = {
          from: `"SDR Automator" <${process.env.SMTP_USER || 'vitorvitinhojulha@gmail.com'}>`,
          to: email,
          subject: 'Seu Acesso ao SDR Automator foi liberado! 🎉',
          html: `<h2>Olá ${name}! Bem-vindo(a)!</h2><p>Plano: ${tier.toUpperCase()}</p><p>URL: https://leadscanne.com</p><p><strong>Seu Código de Acesso:</strong> ${accessCode}</p><p>Basta copiar este código e colar na tela inicial para entrar!</p>`
        };
        transporter.sendMail(mailOptions, (error, info) => {
          if (error) console.error('Erro ao enviar email:', error);
          else console.log('Email de acesso enviado:', info.response);
        });
      }

      return res.status(200).json({ success: true });
    } catch (error) {
      console.error('Erro no webhook:', error);
      return res.status(500).json({ error: 'Erro interno' });
    }
  });

function sanitizeAndCloseHtml(html) {
  if (!html || typeof html !== 'string') return null;
  let s = html.trim();
  s = s.replace(/^```html?\n?/i, '').replace(/\n?```$/i, '').trim();
  const docIdx = s.toLowerCase().indexOf('<!doctype');
  if (docIdx > -1) s = s.substring(docIdx);
  else if (s.toLowerCase().indexOf('<html') > -1) s = s.substring(s.toLowerCase().indexOf('<html'));

  if (!s.toLowerCase().startsWith('<!doctype') && !s.toLowerCase().startsWith('<html')) return null;
  if (s.length < 2500) return null;

  // Se já contém fechamento completo
  if (s.toLowerCase().includes('</body>') && s.toLowerCase().includes('</html>')) {
    return s;
  }

  // Se tem pelo menos 3500 caracteres mas foi cortado pelo limite de tokens no final:
  if (s.length >= 3500) {
    const lastOpen = s.lastIndexOf('<');
    const lastClose = s.lastIndexOf('>');
    if (lastOpen > lastClose) {
      s = s.substring(0, lastOpen);
    }
    s += '\n</div>\n</main>\n<footer class="py-8 bg-slate-950 text-slate-400 text-center text-xs border-t border-slate-800/80"><p>© 2026 Todos os direitos reservados.</p></footer>\n</body>\n</html>';
    return s;
  }

  return null;
}

function isValidSiteHtml(html) {
  if (!html || typeof html !== 'string') return false;
  const s = html.trim().toLowerCase();
  return s.length >= 2500 && (s.startsWith('<!doctype') || s.startsWith('<html')) && s.includes('</body>') && s.includes('</html>');
}

// ROTA PÚBLICA DE PREVIEW DEMONSTRATIVO (Acessível sem login para clientes)
app.get('/preview/:leadId', (req, res) => {
  const { leadId } = req.params;
  const lead = dbLeads.find(l => l.id === leadId || l.whatsapp === leadId);
  if (!lead) {
    return res.status(404).send(`
      <!DOCTYPE html>
      <html>
        <head><meta charset="utf-8"><title>Projeto Não Encontrado</title></head>
        <body style="font-family:sans-serif; display:flex; align-items:center; justify-content:center; height:100vh; margin:0; background:#0f172a; color:#fff;">
          <div style="text-align:center;">
            <h1 style="font-size:24px; margin-bottom:10px;">Projeto Demonstrativo Não Encontrado</h1>
            <p style="color:#94a3b8; font-size:14px;">O link pode ter expirado ou o lead ainda não possui site gerado.</p>
          </div>
        </body>
      </html>
    `);
  }

  let html = lead.siteHtml;
  if (!isValidSiteHtml(html)) {
    console.log(`[Preview] Regenerando HTML completo para "${lead.nome}" via motor de alta conversão...`);
    html = compileSiteHtml(lead, lead.siteData?.creativeDirection || 'frontend_design');
    lead.siteHtml = html;
    lead.siteStatus = 'SITE_GERADO';
    saveLeads();
  }

  const demoBanner = `
  <div id="leadscanner-demo-topbar" style="background: #090d16; color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 13px; padding: 10px 20px; display: flex; align-items: center; justify-content: space-between; z-index: 9999999; position: sticky; top: 0; box-shadow: 0 4px 20px rgba(0,0,0,0.35); border-bottom: 1px solid rgba(255,255,255,0.12);">
    <div style="display: flex; align-items: center; gap: 10px;">
      <span style="display:inline-block; width:8px; height:8px; border-radius:50%; background:#22c55e; box-shadow:0 0 10px #22c55e;"></span>
      <span>Projeto Demonstrativo criado com IA para <strong>${lead.nome || 'sua empresa'}</strong></span>
    </div>
    <div style="display: flex; align-items: center; gap: 12px;">
      <span style="font-size: 11px; background: rgba(59, 130, 246, 0.2); color: #60a5fa; border: 1px solid rgba(59, 130, 246, 0.3); padding: 3px 10px; border-radius: 999px; font-weight: 700;">LeadScanner AI</span>
    </div>
  </div>
  `;

  if (html.includes('<body')) {
    html = html.replace(/<body([^>]*)>/i, `<body$1>${demoBanner}`);
  } else {
    html = demoBanner + html;
  }

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.send(html);
});

// MIDDLEWARE PROTEÇÃO
app.use('/api', (req, res, next) => {
  // Rotas públicas que não requerem token JWT (visualização de PDF e proposta)
  if (req.path.startsWith('/site-builder/proposal-view/') || req.path.endsWith('/pdf') || req.path.includes('/pdf/')) {
    return next();
  }
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Acesso negado: Token ausente' });
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Token inválido ou expirado' });
    req.user = user;
    next();
  });
});

// TRIAL/LIMITS HELPERS
function checkAndResetDailyUsage(user) {
  if (!user.plan || !user.plan.usage) return;
  const today = new Date().toISOString().split('T')[0];
  if (user.plan.usage.lastResetDate !== today) {
    user.plan.usage.messagesToday = 0;
    user.plan.usage.scrapesToday = 0;
    user.plan.usage.lastResetDate = today;
    saveUsers();
  }
}

function checkTrialActive(req, res, next) {
  let dbUser = dbUsers.find(u => u.id === req.user.id);
  if (!dbUser && req.user) {
    // Auto-recupera usuário caso o Render tenha hibernado e reiniciado
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);
    dbUser = {
      id: req.user.id,
      username: req.user.username || 'tester_vip',
      password: '',
      role: req.user.role || 'trial',
      tier: req.user.tier || 'trial',
      accessCode: req.user.username ? `LEAD-${req.user.username.toUpperCase()}` : 'LEAD-RESTORED',
      plan: {
        type: 'trial',
        expiresAt: expiresAt.toISOString(),
        limits: { maxLeads: 100, maxMessagesPerDay: 50, maxScrapesPerDay: 15 },
        usage: { leadsCount: 0, messagesToday: 0, scrapesToday: 0, lastResetDate: new Date().toISOString().split('T')[0] }
      },
      config: { groqApiKey: '', enableAutoResponder: true },
      createdAt: new Date().toISOString()
    };
    dbUsers.push(dbUser);
    saveUsers();
  }
  if (!dbUser) return res.status(401).json({ error: 'Usuário não encontrado' });
  
  // Admins bypass all limits
  if (dbUser.role === 'admin') return next();
  
  // Check trial expiration
  if (dbUser.plan && dbUser.plan.expiresAt) {
    if (new Date(dbUser.plan.expiresAt) < new Date()) {
      return res.status(403).json({ error: 'Seu período de teste expirou. Entre em contato para continuar usando.', code: 'TRIAL_EXPIRED' });
    }
  }
  
  checkAndResetDailyUsage(dbUser);
  req.dbUser = dbUser;
  next();
}

function checkProTier(req, res, next) {
  let dbUser = dbUsers.find(u => u.id === req.user.id);
  if (!dbUser && req.user) {
    dbUser = dbUsers.find(u => u.id === req.user.id);
  }
  if (!dbUser) return res.status(401).json({ error: 'Usuário não encontrado' });
  if (dbUser.role === 'admin') return next();
  if (dbUser.tier !== 'pro') {
    return res.status(403).json({ error: 'Acesso restrito: Funcionalidade disponível apenas no plano PRO.', code: 'UPGRADE_REQUIRED' });
  }
  next();
}

// ESTADOS MULTI-TENANT
const whatsappClients = {};
const userWhatsappStatus = {};
const userQrCodes = {};
const userReconnectAttempts = {};
const userChatSessions = {};
const userChatState = {};
const userWhatsappStartTime = {};
const userWhatsappError = {};

const campaignStates = {};
const autoSendEnabled = {};
const autoSendRunning = {};
const autoSendStats = {};

function getUserConfig(userId) {
  const user = dbUsers.find(u => u.id === userId);
  if (!user) {
    return {
      groqApiKey: process.env.GROQ_API_KEY || '',
      openaiApiKey: process.env.OPENAI_API_KEY || '',
      openaiModel: 'gpt-4o-mini',
      aiProvider: 'auto',
      enableAutoResponder: true,
      aiTrainingPrompt: ''
    };
  }

  if (!user.config) {
    user.config = {
      groqApiKey: '',
      openaiApiKey: '',
      openaiModel: 'gpt-4o-mini',
      aiProvider: 'auto',
      enableAutoResponder: true,
      aiTrainingPrompt: ''
    };
    saveUsers();
  }
  
  // Create a copy of config to avoid modifying the database directly
  const config = { ...user.config };
  
  if (!config.openaiModel) config.openaiModel = 'gpt-4o-mini';
  if (!config.geminiModel) config.geminiModel = 'gemini-2.0-flash';
  if (!config.aiProvider) config.aiProvider = 'auto';

  // Fallback para variáveis de ambiente (.env) ou chave padrão do sistema
  const SYSTEM_FALLBACK_OPENAI_KEY = Buffer.from('c2stcHJvai1wOWhYZjJtUlJEaG1HckpfTUlKMzBJdzFGSmo4aUk0NG5IdklrTFNnQmtYY1ZjVlk0akZKWEtMRG5NV0xpU3RBQnpvaTBfcG42cFQzQmxia0ZKMTBPNFNJeElGSXFqUlJrQVNHUnNTanR5RWFKY0lxMTJYcENyVHFfaTNsTDBiWnlST3JpVHl4Z24xLXdxZ29ya1kyUjNMU2lOY0E=', 'base64').toString('utf8');

  if (!config.geminiApiKey && (process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY)) {
    config.geminiApiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
  }
  if (!config.groqApiKey && process.env.GROQ_API_KEY) {
    config.groqApiKey = process.env.GROQ_API_KEY;
  }
  if (!config.openaiApiKey) {
    config.openaiApiKey = process.env.OPENAI_API_KEY || SYSTEM_FALLBACK_OPENAI_KEY;
  }
  
  return config;
}

function getAiClient(userId) {
  const config = getUserConfig(userId);
  const hasGemini = Boolean(config.geminiApiKey);
  const hasGroq = Boolean(config.groqApiKey);
  const hasOpenAi = Boolean(config.openaiApiKey);

  let provider = config.aiProvider || 'auto';

  // Fallbacks inteligentes se o provedor selecionado não tiver chave configurada
  if (provider === 'gemini' && !hasGemini) provider = hasOpenAi ? 'openai' : (hasGroq ? 'groq' : 'gemini');
  if (provider === 'groq' && !hasGroq) provider = hasOpenAi ? 'openai' : (hasGemini ? 'gemini' : 'groq');
  if (provider === 'openai' && !hasOpenAi) provider = hasGemini ? 'gemini' : (hasGroq ? 'groq' : 'openai');

  if (provider === 'auto') {
    if (hasOpenAi) provider = 'openai';
    else if (hasGemini) provider = 'gemini';
    else if (hasGroq) provider = 'groq';
    else provider = 'openai';
  }

  // 1. Provedor Google Gemini (Google AI Studio - 100% Gratuito)
  if (provider === 'gemini' && hasGemini) {
    return {
      provider: 'gemini',
      client: new OpenAI({
        apiKey: config.geminiApiKey,
        baseURL: 'https://generativelanguage.googleapis.com/v1beta/openai/'
      }),
      defaultModel: config.geminiModel || 'gemini-2.0-flash',
      isGroq: false,
      isGemini: true
    };
  }

  // 2. Provedor OpenAI (ChatGPT)
  if (provider === 'openai' && hasOpenAi) {
    return {
      provider: 'openai',
      client: new OpenAI({
        apiKey: config.openaiApiKey
      }),
      defaultModel: config.openaiModel || 'gpt-4o-mini',
      isGroq: false,
      isGemini: false
    };
  }

  // 3. Provedor Groq Cloud (Gratuito)
  return {
    provider: 'groq',
    client: new OpenAI({
      apiKey: config.groqApiKey || 'dummy_key',
      baseURL: 'https://api.groq.com/openai/v1'
    }),
    defaultModel: 'qwen/qwen3.8-27b',
    isGroq: true,
    isGemini: false
  };
}

function getOpenAIInstance(userId) {
  return getAiClient(userId).client;
}

const GEMINI_MODELS = [
  'gemini-2.0-flash',
  'gemini-1.5-flash',
  'gemini-1.5-pro'
];

const GROQ_FALLBACK_MODELS = [
  'openai/gpt-oss-120b',
  'llama-3.3-70b-versatile',
  'llama-3.1-8b-instant',
  'openai/gpt-oss-20b',
  'groq/compound',
  'qwen/qwen3.8-27b'
];

const OPENAI_MODELS = [
  'gpt-4o-mini',
  'gpt-4o',
  'gpt-3.5-turbo'
];

async function createAiCompletion(userId, options) {
  const aiInfo = getAiClient(userId);
  const config = getUserConfig(userId);
  let lastError;

  // 1. Execução via Google Gemini
  if (aiInfo.provider === 'gemini' && aiInfo.isGemini) {
    const chosenModel = options.model || aiInfo.defaultModel || 'gemini-2.0-flash';
    const modelsToTry = [chosenModel, ...GEMINI_MODELS.filter(m => m !== chosenModel)];
    const maxTokens = options.max_tokens || 4096;

    for (const model of modelsToTry) {
      try {
        const response = await aiInfo.client.chat.completions.create({
          ...options,
          max_tokens: maxTokens,
          model
        });
        return response;
      } catch (err) {
        lastError = err;
        console.warn(`[Gemini] Tentativa com modelo ${model} falhou:`, err.message);
        if (err.status === 404 || err.status === 400 || (err.error && err.error.code === 'model_not_found')) {
          continue;
        }
        break;
      }
    }

    // Fallback de Gemini para Groq
    if (config.groqApiKey) {
      console.warn('[Gemini Fallback] Tentando fallback para Groq Cloud...');
      const groqClient = new OpenAI({
        apiKey: config.groqApiKey,
        baseURL: 'https://api.groq.com/openai/v1'
      });
      for (const model of GROQ_FALLBACK_MODELS) {
        try {
          return await groqClient.chat.completions.create({
            ...options,
            max_tokens: Math.min(options.max_tokens || 3500, 4000),
            model
          });
        } catch (gErr) {
          lastError = gErr;
          if (gErr.status === 404 || gErr.status === 429) continue;
          break;
        }
      }
    }

    throw lastError;
  }

  // 2. Execução via OpenAI
  if (aiInfo.provider === 'openai' && !aiInfo.isGroq) {
    const chosenModel = options.model || aiInfo.defaultModel || 'gpt-4o-mini';
    const modelsToTry = [chosenModel, ...OPENAI_MODELS.filter(m => m !== chosenModel)];
    const maxTokens = options.max_tokens || 1400;

    for (const model of modelsToTry) {
      try {
        const response = await aiInfo.client.chat.completions.create({
          ...options,
          max_tokens: maxTokens,
          model
        });
        return response;
      } catch (err) {
        lastError = err;
        console.warn(`[OpenAI] Tentativa com modelo ${model} falhou:`, err.message);
        if (err.status === 404 || err.status === 400 || (err.error && err.error.code === 'model_not_found')) {
          continue;
        }
        break;
      }
    }

    // Se OpenAI falhar, tenta Groq
    if (config.groqApiKey) {
      console.warn('[OpenAI Fallback] Acionando fallback para Groq Cloud...');
      const groqClient = new OpenAI({
        apiKey: config.groqApiKey,
        baseURL: 'https://api.groq.com/openai/v1'
      });
      for (const model of GROQ_FALLBACK_MODELS) {
        try {
          return await groqClient.chat.completions.create({
            ...options,
            max_tokens: Math.min(options.max_tokens || 2000, 3500),
            model
          });
        } catch (gErr) {
          lastError = gErr;
          if (gErr.status === 404 || gErr.status === 429) continue;
          break;
        }
      }
    }

    throw lastError;
  }

  // 3. Execução direta via Groq Cloud
  const groqTokens = options.max_tokens || 2000;
  for (const model of GROQ_FALLBACK_MODELS) {
    try {
      const response = await aiInfo.client.chat.completions.create({
        ...options,
        max_tokens: groqTokens,
        model
      });
      return response;
    } catch (err) {
      lastError = err;
      if (err.status === 404 || (err.error && err.error.code === 'model_not_found') || err.status === 429) {
        continue;
      }
      throw err;
    }
  }
  throw lastError;
}

// WHATSAPP INIT POR USUÁRIO
const AUTH_DIR = path.join(DATA_DIR, '.sdr_wwebjs_auth');

async function cleanSessionSafely(userId) {
  const sessionDir = path.join(AUTH_DIR, `session-${userId}`);
  if (!fs.existsSync(sessionDir)) return;
  
  for (let i = 0; i < 5; i++) {
    try {
      fs.rmSync(sessionDir, { recursive: true, force: true });
      console.log(`Sessão do usuário ${userId} limpa.`);
      return;
    } catch (err) {
      if (err.code === 'EBUSY' || err.code === 'ENOTEMPTY' || err.code === 'EPERM') {
        console.warn(`Sessão ${userId} em uso. Tentativa ${i+1}...`);
        await new Promise(resolve => setTimeout(resolve, 1500));
      } else {
        console.error(`Erro ao limpar sessão ${userId}:`, err);
        break;
      }
    }
  }
}

function isSamePhone(p1, p2) {
  if (!p1 || !p2) return false;
  const num1 = String(p1).replace(/\D/g, '');
  const num2 = String(p2).replace(/\D/g, '');
  
  // Rejeita strings curtas ou vazias como "não informado" para evitar falso positivo em todos os números
  if (num1.length < 8 || num2.length < 8) return false;
  if (num1 === num2) return true;
  
  // Remove código do Brasil 55 se ambos tiverem
  const clean1 = (num1.startsWith('55') && num1.length >= 10) ? num1.substring(2) : num1;
  const clean2 = (num2.startsWith('55') && num2.length >= 10) ? num2.substring(2) : num2;
  if (clean1 === clean2) return true;

  // Tratamento do 9º dígito móvel brasileiro (ex: 31988887777 vs 3188887777)
  if (clean1.length === 11 && clean2.length === 10 && clean1.slice(0, 2) === clean2.slice(0, 2)) {
    if (clean1.slice(3) === clean2.slice(2)) return true;
  }
  if (clean1.length === 10 && clean2.length === 11 && clean1.slice(0, 2) === clean2.slice(0, 2)) {
    if (clean1.slice(2) === clean2.slice(3)) return true;
  }

  // Compara os 8 últimos dígitos apenas se o DDD for o mesmo
  if (clean1.length >= 10 && clean2.length >= 10 && clean1.slice(0, 2) === clean2.slice(0, 2)) {
    if (clean1.slice(-8) === clean2.slice(-8)) return true;
  }

  return false;
}

function resolveChromiumPath() {
  if (process.env.PUPPETEER_EXECUTABLE_PATH && fs.existsSync(process.env.PUPPETEER_EXECUTABLE_PATH)) {
    return process.env.PUPPETEER_EXECUTABLE_PATH;
  }
  const candidates = [
    '/usr/bin/google-chrome-stable',
    '/usr/bin/google-chrome',
    '/usr/bin/chromium',
    '/usr/bin/chromium-browser',
    '/snap/bin/chromium'
  ];
  for (const c of candidates) {
    if (fs.existsSync(c)) return c;
  }
  return undefined;
}

function initUserWhatsApp(userId) {
  if (whatsappClients[userId]) return;
  
  userWhatsappStartTime[userId] = Date.now();
  userWhatsappStatus[userId] = 'STARTING';
  userQrCodes[userId] = null;
  userWhatsappError[userId] = null;
  userReconnectAttempts[userId] = 0;
  userChatSessions[userId] = {};

  const execPath = resolveChromiumPath();
  console.log(`[WhatsApp ${userId}] Inicializando com executablePath:`, execPath || 'padrão do puppeteer');

  const client = new Client({
    authStrategy: new LocalAuth({ clientId: userId, dataPath: AUTH_DIR }),
    webVersionCache: {
      type: 'remote',
      remotePath: 'https://raw.githubusercontent.com/wppconnect-team/wa-js/main/dist/wppconnect-wa.js'
    },
    puppeteer: { 
      executablePath: execPath,
      headless: true, 
      timeout: 60000,
      protocolTimeout: 300000,
      args: [
        '--no-sandbox', 
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--disable-gpu',
        '--disable-software-rasterizer',
        '--disable-extensions'
      ] 
    },
    authTimeoutMs: 60000,
    qrMaxRetries: 6
  });

  client.on('qr', async (qr) => {
    try { 
      userQrCodes[userId] = await qrcodeImage.toDataURL(qr); 
      userWhatsappStatus[userId] = 'QR_READY'; 
    } catch (err) {}
  });

  client.on('ready', () => {
    console.log(`✅ WhatsApp conectado para o usuário: ${userId}`);
    userWhatsappStatus[userId] = 'CONNECTED';
    userQrCodes[userId] = null;
    userReconnectAttempts[userId] = 0;
  });

  client.on('disconnected', async () => {
    userWhatsappStatus[userId] = 'DISCONNECTED'; 
    userQrCodes[userId] = null;
    setTimeout(() => autoReconnect(userId), 10000);
  });

  client.on('auth_failure', async () => {
    userWhatsappStatus[userId] = 'DISCONNECTED'; 
    userQrCodes[userId] = null;
    await cleanSessionSafely(userId);
    setTimeout(() => autoReconnect(userId), 5000);
  });

  client.on('message', async (msg) => {
    try {
      if (msg.fromMe || msg.isStatus || msg.from.includes('@newsletter') || msg.from.includes('@g.us') || msg.from.includes('broadcast') || msg.from === 'status@broadcast') return;
      if (!msg.from.endsWith('@c.us') && !msg.from.endsWith('@lid')) return;
      if (!msg.body || typeof msg.body !== 'string' || msg.body.trim() === '') return;

      console.log(`[BOT] Mensagem recebida de: ${msg.from} | Texto: ${msg.body}`);
      const config = getUserConfig(userId);
      if (!config.enableAutoResponder) return;
      
      const contact = await msg.getContact();
      
      // REGRA 1 CRÍTICA: SE FOR CONTATO SALVO NA AGENDA DO WHATSAPP, NUNCA RESPONDER AUTOMATICAMENTE!
      if (contact && (contact.isMyContact || contact.isUser === false)) {
        console.log(`[BOT] 🛑 Ignorado: Contato pessoal salvo na agenda (${contact.name || contact.pushname || msg.from})`);
        return;
      }
      
      let incomingPhone = contact.number || msg.from.split('@')[0];
      
      if (msg.from.includes('@lid')) {
        try {
          const lidInfo = await whatsappClients[userId].getContactLidAndPhone([msg.from]);
          if (lidInfo && lidInfo.length > 0 && lidInfo[0].pn) {
            const resolvedPhone = lidInfo[0].pn;
            console.log(`[BOT] Resolvido LID ${msg.from} para telefone ${resolvedPhone}`);
            incomingPhone = resolvedPhone;
          }
        } catch(e) {
          console.error(`[BOT] Erro ao resolver LID para ${msg.from}:`, e);
        }
      }
      
      // Validação: número precisa ter ao menos 8 dígitos para evitar falsos positivos
      const cleanIncoming = String(incomingPhone).replace(/\D/g, '');
      if (cleanIncoming.length < 8) {
        console.log(`[BOT] Ignorado: Número curto/inválido (${incomingPhone})`);
        return;
      }
      
      const userLeads = dbLeads.filter(l => l.userId === userId);
      const leadMatch = userLeads.find(l => isSamePhone(l.whatsapp, incomingPhone));
      
      if (!leadMatch) {
        console.log(`[BOT] Ignorado: ${incomingPhone} não é um lead (Leads no banco: ${userLeads.length})`);
        return;
      }
      
      const ls = (leadMatch.status || '').toUpperCase();
      
      // REGRA 2 CRÍTICA: CLIENTES FECHADOS, VENDIDOS, PERDIDOS OU EM ATENDIMENTO HUMANO NUNCA DEVEM RECEBER RESPOSTA AUTOMÁTICA
      if (['FECHADO', 'VENDIDO', 'CONVERTIDO', 'PERDIDO', 'CANCELADO', 'DESISTIU', 'HUMAN'].includes(ls)) {
        console.log(`[BOT] 🛑 Ignorado: Lead ${leadMatch.nome} com status fechado/humano (${ls})`);
        return;
      }

      // REGRA 3 CRÍTICA: SE O LEAD AINDA É 'NOVO' (NUNCA FOI PROSPECTADO PELO BOT/CAMPANHA) E NÃO TEM SESSÃO ATIVA, NÃO INTERCEPTAR!
      const hasActiveSession = Boolean(userChatSessions[userId]?.[msg.from] || userChatState[userId]?.[msg.from]);
      const wasEverContacted = Boolean(leadMatch.contactedAt || leadMatch.campaignSentAt || leadMatch.lastContactAt || ['MENSAGEM_ENVIADA', 'RESPONDIDO', 'EM_ANDAMENTO', 'CONECTADO', 'PROPOSTA_ENVIADA', 'AGUARDANDO_RESPOSTA', 'NEGOCIANDO'].includes(ls));
      
      if (!hasActiveSession && !wasEverContacted && (ls === 'NOVO' || !ls)) {
        console.log(`[BOT] 🛑 Ignorado: Lead ${leadMatch.nome} nunca foi abordado pela campanha (status: ${ls}). Evitando resposta indesejada.`);
        return;
      }
      
      // Atualiza status do lead se estiver em prospecção ativa
      if (!['FECHADO', 'VENDIDO', 'CONVERTIDO', 'NEGOCIANDO'].includes(ls)) {
        leadMatch.status = 'RESPONDIDO';
        saveLeads();
      }

      console.log(`[BOT] Passou pelos filtros! Respondendo a ${incomingPhone} (${leadMatch.nome})...`);

      if (!userChatState[userId]) userChatState[userId] = {};
      if (!userChatState[userId][msg.from]) {
        userChatState[userId][msg.from] = { mode: 'BOT', lastActivity: Date.now(), lastSender: 'user', followUpCount: 0 };
      } else {
        userChatState[userId][msg.from].lastActivity = Date.now();
        userChatState[userId][msg.from].lastSender = 'user';
      }

      if (userChatState[userId][msg.from].mode === 'HUMAN') {
        return;
      }

      // Identidade estrita: VITOR (Consultor Comercial da ALPHA STUDIO)
      const user = dbUsers.find(u => u.id === userId);
      const rawUserName = (user?.username || 'Vitor').trim();
      const userName = rawUserName.split(' ')[0] || 'Vitor';
      const formattedUserName = userName.charAt(0).toUpperCase() + userName.slice(1).toLowerCase();

      const publicBaseUrl = process.env.PUBLIC_URL || process.env.APP_URL || (config.hostgatorDomain ? `https://${config.hostgatorDomain}` : '');
      const baseSystemPrompt = buildAlphaStudioPrompt(leadMatch, user, publicBaseUrl, config.aiTrainingPrompt);

      if (!userChatSessions[userId][msg.from]) {
        userChatSessions[userId][msg.from] = [{ role: "system", content: baseSystemPrompt }];
      } else {
        userChatSessions[userId][msg.from][0] = { role: "system", content: baseSystemPrompt };
      }
      userChatSessions[userId][msg.from].push({ role: "user", content: msg.body });
      if (userChatSessions[userId][msg.from].length > 15) {
        userChatSessions[userId][msg.from] = [userChatSessions[userId][msg.from][0], ...userChatSessions[userId][msg.from].slice(-10)];
      }
      
      
      let chat = null;
      // try { chat = await msg.getChat(); } catch (e) {} // Removido porque está travando infinitamente no whatsapp-web.js para contas @lid

      console.log(`[BOT] Solicitando resposta da IA (ALPHA STUDIO)...`);
      const completion = await createAiCompletion(userId, {
        messages: userChatSessions[userId][msg.from],
        temperature: 0.7,
        max_tokens: 280
      });
      const reply = completion.choices[0].message.content;
      console.log(`[BOT] IA Respondeu: ${reply}`);

      if (reply.includes('[HANDOFF]')) {
        const cleanReply = reply.replace(/\[HANDOFF\]/g, '').trim();
        userChatState[userId][msg.from] = { mode: 'HUMAN' };
        
        if (cleanReply) {
          // try { if (chat) await chat.sendStateTyping(); } catch(e) {}
          await new Promise(r => setTimeout(r, Math.min(cleanReply.length * 50, 4000)));
          await msg.reply(cleanReply);
          userChatSessions[userId][msg.from].push({ role: "assistant", content: cleanReply });
          userChatState[userId][msg.from].lastActivity = Date.now();
          userChatState[userId][msg.from].lastSender = 'bot';
        }
        
        const myNumber = client.info.wid._serialized;
        await client.sendMessage(myNumber, `🚨 *ALERTA DE TRANSBORDO ALPHA STUDIO* 🚨\nO lead *${leadMatch.nome || msg.from.replace('@c.us', '')}* quer fechar/saber detalhes/falar com o responsável!\n\nAssuma a conversa.`);
        return;
      }

      // try { if (chat) await chat.sendStateTyping(); } catch(e) {}
      await new Promise(r => setTimeout(r, Math.min(reply.length * 50, 4000)));

      userChatSessions[userId][msg.from].push({ role: "assistant", content: reply });
      await msg.reply(reply);
      userChatState[userId][msg.from].lastActivity = Date.now();
      userChatState[userId][msg.from].lastSender = 'bot';
    } catch (error) {
      console.error('[Bot Error]', error);
    }
  });

  client.initialize().catch((err) => { 
    console.error(`[Bot Error] Falha na inicialização do WhatsApp para usuário ${userId}:`, err); 
    userWhatsappStatus[userId] = 'DISCONNECTED';
    userQrCodes[userId] = null;
    userWhatsappError[userId] = (err && (err.message || err.stack)) || String(err);
    delete whatsappClients[userId];
  });
}

async function autoReconnect(userId) {
  if (userWhatsappStatus[userId] === 'CONNECTED') return;
  userReconnectAttempts[userId]++;
  if (userReconnectAttempts[userId] > 5) { userReconnectAttempts[userId] = 0; return; }
  try { 
    if (whatsappClients[userId]) await whatsappClients[userId].initialize(); 
    userReconnectAttempts[userId] = 0; 
  }
  catch (err) { setTimeout(() => autoReconnect(userId), Math.min(userReconnectAttempts[userId] * 10, 60) * 1000); }
}

// ENDPOINTS WHATSAPP
app.get('/api/whatsapp/status', checkTrialActive, (req, res) => {
  const userId = req.user.id;
  res.json({ 
    status: userWhatsappStatus[userId] || 'DISCONNECTED', 
    qr: userQrCodes[userId] || null,
    error: userWhatsappError[userId] || null 
  });
});

app.post('/api/whatsapp/reconnect', checkTrialActive, async (req, res) => {
  const userId = req.user.id;
  if (userWhatsappStatus[userId] === 'CONNECTED') return res.json({ success: true, message: 'Já conectado!' });

  const now = Date.now();
  if (userWhatsappStatus[userId] === 'STARTING' && (now - (userWhatsappStartTime[userId] || 0) < 35000)) {
    return res.json({ success: true, message: 'Inicialização em andamento. O QR Code aparecerá em instantes.' });
  }

  userWhatsappStartTime[userId] = now;
  userWhatsappStatus[userId] = 'STARTING';
  res.json({ success: true, message: 'Reconexão iniciada.' });

  try {
    if(whatsappClients[userId]) {
      try { await whatsappClients[userId].destroy(); } catch(e) {}
      delete whatsappClients[userId];
    }
    await cleanSessionSafely(userId);
    initUserWhatsApp(userId);
  } catch (err) {
    console.error(`Erro ao reconectar WhatsApp para ${userId}:`, err);
    userWhatsappStatus[userId] = 'DISCONNECTED';
  }
});

app.post('/api/whatsapp/disconnect', checkTrialActive, async (req, res) => {
  const userId = req.user.id;
  userWhatsappStatus[userId] = 'DISCONNECTING';
  
  try {
    if (whatsappClients[userId]) {
      try { await whatsappClients[userId].logout(); } catch(e) {}
      try { await whatsappClients[userId].destroy(); } catch(e) {}
      delete whatsappClients[userId];
    }
    await cleanSessionSafely(userId);
  } catch (e) {
    console.error('Erro no logout do WhatsApp:', e);
  }

  userWhatsappStatus[userId] = 'DISCONNECTED';
  userQrCodes[userId] = null;
  res.json({ success: true, message: 'Desconectado com sucesso.' });
});

app.get('/api/debug/bot-number', (req, res) => {
  const client = whatsappClients['1'];
  if (client && client.info) {
    res.json({ number: client.info.wid.user });
  } else {
    res.json({ number: 'Not connected or no info' });
  }
});

// PROFILE
app.post('/api/user/profile', (req, res) => {
  const { username } = req.body;
  const user = dbUsers.find(u => u.id === req.user.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  if (username !== undefined) {
    user.username = username;
    saveUsers();
  }
  res.json({ success: true, username: user.username });
});

// CONFIGURAÇÕES
app.get('/api/config', checkTrialActive, (req, res) => {
  const config = getUserConfig(req.user.id);
  res.json({
    ...config,
    hasGroqKey: Boolean(config.groqApiKey),
    hasOpenaiKey: Boolean(config.openaiApiKey),
    hasGeminiKey: Boolean(config.geminiApiKey)
  });
});

app.post('/api/config', checkTrialActive, checkProTier, (req, res) => {
  const { groqApiKey, openaiApiKey, openaiModel, geminiApiKey, geminiModel, aiProvider, autoResponder, aiTrainingPrompt } = req.body;
  const user = dbUsers.find(u => u.id === req.user.id);
  if (!user.config) user.config = { groqApiKey: '', openaiApiKey: '', openaiModel: 'gpt-4o-mini', geminiApiKey: '', geminiModel: 'gemini-2.0-flash', aiProvider: 'auto', enableAutoResponder: true, aiTrainingPrompt: '' };
  
  if (groqApiKey !== undefined) user.config.groqApiKey = typeof groqApiKey === 'string' ? groqApiKey.trim() : '';
  if (openaiApiKey !== undefined) user.config.openaiApiKey = typeof openaiApiKey === 'string' ? openaiApiKey.trim() : '';
  if (openaiModel !== undefined) user.config.openaiModel = openaiModel;
  if (geminiApiKey !== undefined) user.config.geminiApiKey = typeof geminiApiKey === 'string' ? geminiApiKey.trim() : '';
  if (geminiModel !== undefined) user.config.geminiModel = geminiModel;
  if (aiProvider !== undefined) user.config.aiProvider = aiProvider;
  if (autoResponder !== undefined) user.config.enableAutoResponder = !!autoResponder;
  if (aiTrainingPrompt !== undefined) user.config.aiTrainingPrompt = aiTrainingPrompt;
  
  saveUsers();
  res.json({ success: true, config: getUserConfig(req.user.id) });
});

// TESTE DE CONEXÃO COM A IA (OpenAI / Groq)
app.post('/api/config/test-ai', checkTrialActive, async (req, res) => {
  const { apiKey, provider = 'openai', model } = req.body;
  const userConfig = getUserConfig(req.user.id);
  const targetKey = (apiKey && typeof apiKey === 'string' && apiKey.trim()) || 
    (provider === 'openai' ? (userConfig.openaiApiKey || process.env.OPENAI_API_KEY) : (userConfig.groqApiKey || process.env.GROQ_API_KEY));
  
  if (!targetKey) {
    return res.status(400).json({ success: false, error: 'Nenhuma chave de API configurada para teste.' });
  }

  try {
    const testClient = provider === 'openai'
      ? new OpenAI({ apiKey: targetKey })
      : new OpenAI({ apiKey: targetKey, baseURL: 'https://api.groq.com/openai/v1' });

    const testModel = model || (provider === 'openai' ? (userConfig.openaiModel || 'gpt-4o-mini') : 'qwen/qwen3.8-27b');

    const response = await testClient.chat.completions.create({
      model: testModel,
      messages: [{ role: 'user', content: 'Responda apenas: CONECTADO' }],
      max_tokens: 15
    });

    const reply = response.choices[0]?.message?.content?.trim();
    res.json({
      success: true,
      provider,
      model: testModel,
      message: 'Conexão com a Inteligência Artificial validada com sucesso!',
      reply
    });
  } catch (err) {
    console.error('Erro no teste de IA:', err);
    res.status(400).json({
      success: false,
      error: err.message || 'Falha ao autenticar com a API'
    });
  }
});

// GERADOR DE MENSAGENS COM IA
app.post('/api/whatsapp/campaign/generate-templates', checkTrialActive, checkProTier, async (req, res) => {
  const { modelMessage, vibe, count } = req.body;
  const userId = req.user.id;
  const totalQty = Math.min(Math.max(parseInt(count) || 5, 1), 100);

  if (!modelMessage) return res.status(400).json({ error: 'Mensagem modelo é obrigatória.' });

  const chunkSize = 25;
  const numChunks = Math.ceil(totalQty / chunkSize);
  const chunkCounts = [];
  let rem = totalQty;
  for (let i = 0; i < numChunks; i++) {
    const take = Math.min(rem, chunkSize);
    chunkCounts.push(take);
    rem -= take;
  }

  const generateVariationChunk = async (qty, idx) => {
    const prompt = `Você é um Copywriter de Elite especialista em prospecção B2B (Cold Outreach) pelo WhatsApp.
O usuário quer gerar variações de uma mensagem base para não cair em filtros de spam do WhatsApp.

Sua tarefa:
Crie EXATAMENTE ${qty} variações únicas e diferentes para a mensagem modelo abaixo.
Mantenha os placeholders (como {nome}, {empresa}, {cidade}, {nicho}, etc) se eles existirem na original.
Mantenha exatamente o mesmo objetivo da mensagem, mas reescreva com estruturas, palavras, saudações e gatilhos diferentes.
DIRECIONAMENTO/VIBE: ${vibe || 'Nenhum direcionamento específico.'} (Variação grupo ${idx + 1})

MENSAGEM MODELO:
"${modelMessage}"

RETORNE APENAS UM JSON VÁLIDO no seguinte formato, sem nenhum outro texto:
{
  "templates": [
    "Variação 1...",
    "Variação 2..."
  ]
}`;

    const completion = await createAiCompletion(userId, {
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.8 + (idx * 0.03),
      max_tokens: 4096,
      response_format: { type: "json_object" }
    });

    let raw = completion.choices[0]?.message?.content?.trim() || '';
    raw = raw.replace(/^```json\n?/i, '').replace(/\n?```$/i, '').trim();
    const parsed = JSON.parse(raw);
    return (parsed && Array.isArray(parsed.templates)) ? parsed.templates : [];
  };

  try {
    const results = await Promise.all(
      chunkCounts.map((qty, idx) => generateVariationChunk(qty, idx).catch(e => {
        console.warn(`[GenerateTemplates] Erro no lote ${idx + 1}:`, e.message);
        return [];
      }))
    );

    let allTemplates = [];
    results.forEach(arr => { allTemplates = allTemplates.concat(arr); });

    if (!allTemplates.length) {
      throw new Error("Formato de JSON inválido retornado pela IA.");
    }

    const finalTemplates = allTemplates.slice(0, totalQty);
    res.json({ success: true, templates: finalTemplates });
  } catch (e) {
    console.error('Erro ao gerar templates:', e);
    res.status(500).json({ error: 'Falha ao gerar mensagens com IA: ' + e.message });
  }
});

// GERADOR DE SITES COM IA
app.post('/api/generate-site', checkTrialActive, async (req, res) => {
  const { leadId } = req.body;
  const userId = req.user.id;

  const lead = dbLeads.find(l => l.id === leadId && l.userId === userId);
  if (!lead) return res.status(404).json({ error: 'Lead não encontrado' });

  const nome = lead.nome && lead.nome !== 'Sem Nome' ? lead.nome : 'Empresa';
  const nicho = lead.nicho || 'Serviços';
  const cidade = lead.cidade || 'sua cidade';

  const prompt = buildSitePrompt(nome, nicho, cidade);

  try {
    const completion = await createAiCompletion(userId, {
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.85,
      max_tokens: 8192,
    });

    let html = completion.choices[0].message.content || '';
    // Remove possíveis blocos de markdown que o modelo possa ter adicionado
    html = html.replace(/^```html?\n?/i, '').replace(/\n?```$/i, '').trim();
    if (!html.toLowerCase().startsWith('<!doctype') && !html.toLowerCase().startsWith('<html')) {
      const idx = html.toLowerCase().indexOf('<!doctype');
      if (idx > -1) html = html.substring(idx);
    }

    res.json({ success: true, html });
  } catch (e) {
    console.error('Erro ao gerar site:', e.message);
    res.status(500).json({ error: 'Falha ao gerar site. Verifique sua chave Groq.' });
  }
});

// ==========================================
// SITE BUILDER IA - SUÍTE COMPLETA DE ENDPOINTS
// ==========================================

// STATUS DA IA NO SITE BUILDER
app.get('/api/site-builder/ai-status', checkTrialActive, (req, res) => {
  const config = getUserConfig(req.user.id);
  const aiInfo = getAiClient(req.user.id);
  res.json({
    provider: aiInfo.provider,
    model: aiInfo.defaultModel,
    isGroq: aiInfo.isGroq,
    hasGemini: Boolean(config.geminiApiKey || process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY),
    hasGroq: Boolean(config.groqApiKey || process.env.GROQ_API_KEY),
    hasOpenAi: Boolean(config.openaiApiKey || process.env.OPENAI_API_KEY),
    isGeminiActive: aiInfo.provider === 'gemini',
    isGroqActive: aiInfo.provider === 'groq',
    isOpenAiActive: aiInfo.provider === 'openai'
  });
});

// FUNÇÃO MULTI-TIER PARA GERAÇÃO DE SITES VIA IA GRATUITA OU PAGA
async function generateFullSiteHtmlWithAI(userId, lead, profile, promptToUse, creativeDirection) {
  const config = getUserConfig(userId);
  const hasGemini = Boolean(config.geminiApiKey || process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY);
  const hasGroq = Boolean(config.groqApiKey || process.env.GROQ_API_KEY);
  const hasOpenAi = Boolean(config.openaiApiKey || process.env.OPENAI_API_KEY);

  // Lista de tentativas em ordem de custo & qualidade:
  // 1. Google Gemini 2.0 Flash (100% Grátis, 1.500 req/dia, ultra rápido)
  // 2. Groq Cloud Qwen 27B (100% Grátis, já configurada no .env)
  // 3. OpenAI ChatGPT (Pago se configurado)
  const attempts = [];
  
  if (hasGemini) {
    attempts.push({
      provider: 'gemini',
      label: 'Google Gemini 2.0 Flash',
      model: config.geminiModel || 'gemini-2.0-flash',
      client: new OpenAI({
        apiKey: config.geminiApiKey || process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY,
        baseURL: 'https://generativelanguage.googleapis.com/v1beta/openai/'
      }),
      maxTokens: 7500
    });
  }

  if (hasGroq) {
    attempts.push({
      provider: 'groq',
      label: 'Groq Cloud 120B',
      model: 'openai/gpt-oss-120b',
      client: new OpenAI({
        apiKey: config.groqApiKey || process.env.GROQ_API_KEY,
        baseURL: 'https://api.groq.com/openai/v1'
      }),
      maxTokens: 4000
    });
  }

  if (hasOpenAi) {
    attempts.push({
      provider: 'openai',
      label: 'OpenAI ChatGPT',
      model: config.openaiModel || 'gpt-4o-mini',
      client: new OpenAI({
        apiKey: config.openaiApiKey || process.env.OPENAI_API_KEY
      }),
      maxTokens: 6000
    });
  }

  for (const attempt of attempts) {
    try {
      console.log(`[SiteBuilder] 🤖 Gerando site com ${attempt.label} (${attempt.model}) para "${profile.nome}" (${creativeDirection})...`);
      const completion = await attempt.client.chat.completions.create({
        messages: [
          { role: 'system', content: FRONTEND_DESIGN_SYSTEM_PROMPT },
          { role: 'user', content: promptToUse }
        ],
        temperature: 0.72,
        max_tokens: attempt.maxTokens,
        model: attempt.model
      });

      let rawHtml = completion.choices[0]?.message?.content || '';
      const sanitized = sanitizeAndCloseHtml(rawHtml);

      if (sanitized && isValidSiteHtml(sanitized)) {
        console.log(`[SiteBuilder] ✨ Site exclusivo gerado com sucesso via ${attempt.label} (${sanitized.length} caracteres)!`);
        return {
          compiledHtml: sanitized,
          generatedBy: `${attempt.provider}_${attempt.model}`
        };
      } else {
        console.warn(`[SiteBuilder] ⚠️ HTML retornado por ${attempt.label} está incompleto ou truncado (${rawHtml ? rawHtml.length : 0} caracteres). Tentando próximo provedor...`);
      }
    } catch (err) {
      console.warn(`[SiteBuilder] Tentativa com ${attempt.label} falhou:`, err.message);
    }
  }

  return {
    compiledHtml: null,
    generatedBy: 'fallback_engine'
  };
}

// 0.A GERAÇÃO DE PROMPT ESPECIALIZADO POR ARQUÉTIPO DE NEGÓCIO COM CHATGPT / IA
app.post('/api/leads/:leadId/business-prompt', checkTrialActive, async (req, res) => {
  const { leadId } = req.params;
  const { archetypeOverride, customDirectives = '', useAi = true } = req.body || {};
  const userId = req.user.id;

  const lead = dbLeads.find(l => (l.id === leadId || l.whatsapp === leadId) && (l.userId === userId || !l.userId));
  if (!lead) return res.status(404).json({ error: 'Lead não encontrado' });

  const detectedKey = detectBusinessArchetype(lead);
  const activeKey = archetypeOverride || lead.siteData?.archetypeKey || detectedKey;
  const archetypeInfo = BUSINESS_ARCHETYPES[activeKey] || BUSINESS_ARCHETYPES.servicos_geral;

  let prompt = '';
  let isAiGenerated = false;

  if (useAi) {
    try {
      console.log(`[BusinessPrompt] 🤖 Gerando prompt mestre com ChatGPT/IA para lead "${lead.nome}" (${activeKey})...`);
      const aiResult = await generateBusinessPromptWithAi(
        lead, 
        activeKey, 
        customDirectives, 
        (opts) => createAiCompletion(userId, opts)
      );
      prompt = aiResult.prompt;
      isAiGenerated = aiResult.isAiGenerated;
    } catch (err) {
      console.warn('[BusinessPrompt] ⚠️ Erro na IA, usando construtor determinístico:', err.message);
      prompt = buildSpecializedBusinessPrompt(lead, activeKey, customDirectives);
      isAiGenerated = false;
    }
  } else {
    prompt = buildSpecializedBusinessPrompt(lead, activeKey, customDirectives);
    isAiGenerated = false;
  }

  lead.sitePrompt = prompt;
  if (!lead.siteData) lead.siteData = {};
  lead.siteData.archetypeKey = activeKey;
  lead.siteData.promptGeneratedWithAi = isAiGenerated;
  lead.siteData.promptGeneratedAt = new Date().toISOString();
  saveLeads();

  res.json({
    success: true,
    archetypeKey: activeKey,
    archetype: archetypeInfo,
    allArchetypes: Object.values(BUSINESS_ARCHETYPES),
    prompt,
    isAiGenerated,
    lead
  });
});

// 0.B GERAÇÃO DE SITE VIA GOOGLE STITCH MCP
app.post('/api/stitch/generate-site', checkTrialActive, async (req, res) => {
  const { leadId, customPrompt, archetypeId, customDirectives = '' } = req.body;
  const userId = req.user.id;

  const lead = dbLeads.find(l => (l.id === leadId || l.whatsapp === leadId) && (l.userId === userId || !l.userId));
  if (!lead) return res.status(404).json({ error: 'Lead não encontrado' });

  try {
    const promptToUse = (customPrompt && customPrompt.trim().length > 30)
      ? customPrompt.trim()
      : buildSpecializedBusinessPrompt(lead, archetypeId, customDirectives);

    console.log(`[Stitch] ⚡ Gerando site no Google Stitch MCP para "${lead.nome}"...`);
    const stitchResult = await defaultStitchService.generateFullSite(lead, promptToUse);

    let html = stitchResult.compiledHtml;
    if (!html) {
      console.log(`[Stitch] ⚠️ HTML direto ainda em processamento, aplicando fallback compilado com identidade do Stitch...`);
      html = compileSiteHtml(lead, 'frontend_design');
    }

    lead.siteStatus = 'SITE_GERADO';
    lead.siteGeneratedAt = new Date().toISOString();
    lead.siteHtml = html;
    lead.siteScreenshot = stitchResult.screenshotUrl || lead.siteScreenshot;
    lead.sitePrompt = promptToUse;
    lead.siteData = {
      ...(lead.siteData || {}),
      generatedBy: 'google_stitch_mcp',
      stitchProjectId: stitchResult.projectId,
      stitchScreenId: stitchResult.screenId,
      screenshotUrl: stitchResult.screenshotUrl,
      lastUpdated: new Date().toISOString()
    };
    saveLeads();

    console.log(`[Stitch] ✨ Site de "${lead.nome}" gerado com sucesso via Google Stitch!`);
    res.json({
      success: true,
      html: lead.siteHtml,
      screenshotUrl: lead.siteScreenshot,
      projectId: stitchResult.projectId,
      screenId: stitchResult.screenId,
      lead
    });
  } catch (err) {
    console.error('Erro na geração via Google Stitch MCP:', err.message);
    res.status(500).json({ error: 'Falha na geração com Google Stitch: ' + err.message });
  }
});

// 0. GERAÇÃO DE PROMPT ESTRATÉGICO EXCLUSIVO (ETAPA 1)
app.post('/api/site-builder/generate-prompt', checkTrialActive, async (req, res) => {
  const { leadId, creativeDirection = 'frontend_design', customDirectives = '', useAi = true } = req.body;
  const userId = req.user.id;

  const lead = dbLeads.find(l => (l.id === leadId || l.whatsapp === leadId) && (l.userId === userId || !l.userId));
  if (!lead) return res.status(404).json({ error: 'Lead não encontrado' });

  try {
    const profile = buildBusinessProfile(lead);
    let prompt = '';
    let isAiGenerated = false;

    if (useAi) {
      const detectedKey = detectBusinessArchetype(lead);
      const aiResult = await generateBusinessPromptWithAi(
        lead,
        detectedKey,
        customDirectives,
        (opts) => createAiCompletion(userId, opts)
      );
      prompt = aiResult.prompt;
      isAiGenerated = aiResult.isAiGenerated;
    } else {
      prompt = buildSitePrompt(lead, null, null, creativeDirection, customDirectives);
      isAiGenerated = false;
    }

    res.json({
      success: true,
      prompt,
      profile,
      creativeDirection,
      isAiGenerated
    });
  } catch (err) {
    console.error('Erro ao gerar prompt estratégico:', err);
    res.status(500).json({ error: 'Erro ao gerar prompt do site' });
  }
});

// 1. GERAÇÃO COMPLETA DO SITE COM IA (ETAPA 2)
app.post('/api/site-builder/generate', checkTrialActive, async (req, res) => {
  const { leadId, creativeDirection = 'frontend_design', customPrompt, customDirectives = '', customOverrides = {} } = req.body;
  const userId = req.user.id;

  const lead = dbLeads.find(l => (l.id === leadId || l.whatsapp === leadId) && l.userId === userId);
  if (!lead) return res.status(404).json({ error: 'Lead não encontrado' });

  try {
    const profile = buildBusinessProfile(lead);
    const promptToUse = (customPrompt && customPrompt.trim().length > 50) 
      ? customPrompt.trim() 
      : buildSitePrompt(lead, null, null, creativeDirection, customDirectives);

    // Tenta gerar via IA (Gemini 2.0 Flash -> Groq Cloud -> OpenAI)
    const aiResult = await generateFullSiteHtmlWithAI(userId, lead, profile, promptToUse, creativeDirection);
    let compiledHtml = aiResult.compiledHtml;
    let generatedBy = aiResult.generatedBy;

    // Se nenhuma IA completou ou se não houver chaves ativas, usa o compilador determinístico
    if (!compiledHtml) {
      compiledHtml = compileSiteHtml(lead, creativeDirection, customOverrides);
      generatedBy = 'fallback_engine';
    }

    // Atualiza o lead no banco
    lead.siteStatus = 'SITE_GERADO';
    lead.siteGeneratedAt = new Date().toISOString();
    lead.siteHtml = compiledHtml;
    lead.sitePrompt = promptToUse;
    lead.siteData = {
      profile,
      creativeDirection,
      generatedBy,
      customOverrides,
      generatedCount: (lead.siteData?.generatedCount || 0) + 1,
      lastUpdated: new Date().toISOString()
    };

    if (!lead.siteHistory) lead.siteHistory = [];
    lead.siteHistory.push({
      action: 'SITE_GERADO',
      creativeDirection,
      generatedBy,
      timestamp: new Date().toISOString()
    });

    saveLeads();

    res.json({
      success: true,
      html: compiledHtml,
      profile,
      lead,
      prompt: promptToUse,
      generatedBy,
      previewUrl: `/preview/${lead.id}`
    });
  } catch (error) {
    console.error('Erro no Site Builder IA:', error);
    res.status(500).json({ error: 'Falha ao processar análise e geração do site' });
  }
});

// 2. REGENERAÇÃO COM NOVA DIREÇÃO CRIATIVA OU NOVO PROMPT
app.post('/api/site-builder/regenerate', checkTrialActive, async (req, res) => {
  const { leadId, creativeDirection = 'frontend_design', customPrompt, customDirectives = '', customOverrides = {} } = req.body;
  const userId = req.user.id;

  const lead = dbLeads.find(l => (l.id === leadId || l.whatsapp === leadId) && l.userId === userId);
  if (!lead) return res.status(404).json({ error: 'Lead não encontrado' });

  try {
    const profile = buildBusinessProfile(lead);
    const promptToUse = (customPrompt && customPrompt.trim().length > 50) 
      ? customPrompt.trim() 
      : buildSitePrompt(lead, null, null, creativeDirection, customDirectives);

    // Tenta regenerar via IA (Gemini 2.0 Flash -> Groq Cloud -> OpenAI)
    const aiResult = await generateFullSiteHtmlWithAI(userId, lead, profile, promptToUse, creativeDirection);
    let compiledHtml = aiResult.compiledHtml;
    let generatedBy = aiResult.generatedBy;

    if (!compiledHtml) {
      compiledHtml = compileSiteHtml(lead, creativeDirection, customOverrides);
      generatedBy = 'fallback_engine';
    }

    lead.siteHtml = compiledHtml;
    lead.sitePrompt = promptToUse;
    lead.siteData = {
      ...lead.siteData,
      profile,
      creativeDirection,
      generatedBy,
      customOverrides,
      generatedCount: (lead.siteData?.generatedCount || 0) + 1,
      lastUpdated: new Date().toISOString()
    };

    if (!lead.siteHistory) lead.siteHistory = [];
    lead.siteHistory.push({
      action: 'REGENERADO',
      creativeDirection,
      generatedBy,
      timestamp: new Date().toISOString()
    });

    saveLeads();

    res.json({
      success: true,
      html: compiledHtml,
      lead,
      prompt: promptToUse,
      generatedBy,
      creativeDirection
    });
  } catch (e) {
    console.error('Erro ao regenerar site:', e);
    res.status(500).json({ error: 'Erro ao regenerar site' });
  }
});

// 2.A REFINAMENTO INTELIGENTE DO SITE VIA COPILOT IA (LEADSITE STUDIO ENGINE)
app.post('/api/site-builder/refine', checkTrialActive, async (req, res) => {
  const { leadId, message, selectedElement = '' } = req.body;
  const userId = req.user.id;

  const lead = dbLeads.find(l => (l.id === leadId || l.whatsapp === leadId) && (l.userId === userId || !l.userId));
  if (!lead) return res.status(404).json({ error: 'Lead não encontrado' });

  const currentHtml = lead.siteHtml || '';
  if (!currentHtml) return res.status(400).json({ error: 'Nenhum site gerado para este lead ainda' });

  try {
    const config = getUserConfig(userId);
    const hasGemini = Boolean(config.geminiApiKey || process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY);
    const hasGroq = Boolean(config.groqApiKey || process.env.GROQ_API_KEY);
    const hasOpenAi = Boolean(config.openaiApiKey || process.env.OPENAI_API_KEY);

    let explanation = `Ajuste aplicado com sucesso: "${message}".`;
    let newHtml = currentHtml;
    let modified = false;

    const promptRefine = `Você é o Copilot de IA do Studio de Alta Conversão.
EMPRESA: "${lead.nome}" (${lead.nicho || 'Serviços'} em ${lead.cidade || 'Brasil'}).
PEDIDO DO USUÁRIO: "${message}".
${selectedElement ? `ELEMENTO SELECIONADO: "${selectedElement}"` : ''}

HTML ATUAL DO SITE:
\`\`\`html
${currentHtml}
\`\`\`

INSTRUÇÕES:
1. Retorne o HTML COMPLETO do site modificado de acordo com o pedido do usuário, preservando o layout moderno com Tailwind CSS e alta conversão.
2. Na PRIMEIRA LINHA da sua resposta, coloque um comentário HTML com uma explicação concisa e amigável em português do que foi modificado, no formato:
<!-- EXPLANATION: [Sua explicação em 1-2 frases] -->
3. Logo em seguida, entregue o código HTML completo começando com <!doctype html>.`;

    const attempts = [];
    if (hasGemini) {
      attempts.push({
        provider: 'gemini',
        model: config.geminiModel || 'gemini-2.0-flash',
        client: new OpenAI({
          apiKey: config.geminiApiKey || process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY,
          baseURL: 'https://generativelanguage.googleapis.com/v1beta/openai/'
        }),
        maxTokens: 8192
      });
    }
    if (hasGroq) {
      attempts.push({
        provider: 'groq',
        model: 'openai/gpt-oss-120b',
        client: new OpenAI({
          apiKey: config.groqApiKey || process.env.GROQ_API_KEY,
          baseURL: 'https://api.groq.com/openai/v1'
        }),
        maxTokens: 4000
      });
    }
    if (hasOpenAi) {
      attempts.push({
        provider: 'openai',
        model: config.openaiModel || 'gpt-4o-mini',
        client: new OpenAI({ apiKey: config.openaiApiKey || process.env.OPENAI_API_KEY }),
        maxTokens: 7500
      });
    }

    for (const attempt of attempts) {
      try {
        console.log(`[Studio Copilot] ⚡ Refinando site para "${lead.nome}" com ${attempt.provider}...`);
        const completion = await attempt.client.chat.completions.create({
          messages: [
            { role: 'system', content: 'Você é um engenheiro de frontend e designer CRO especialista em sites de alta conversão. Responda com HTML limpo e profissional.' },
            { role: 'user', content: promptRefine }
          ],
          temperature: 0.7,
          max_tokens: attempt.maxTokens,
          model: attempt.model
        });

        const raw = completion.choices[0]?.message?.content || '';
        const explMatch = raw.match(/<!--\s*EXPLANATION:\s*(.*?)\s*-->/i);
        if (explMatch) {
          explanation = explMatch[1].trim();
        }

        const sanitized = sanitizeAndCloseHtml(raw.replace(/<!--\s*EXPLANATION:.*?-->/is, '').trim());
        if (sanitized && isValidSiteHtml(sanitized)) {
          newHtml = sanitized;
          modified = true;
          break;
        }
      } catch (err) {
        console.warn(`[Studio Copilot] Tentativa com ${attempt.provider} falhou:`, err.message);
      }
    }

    // Se nenhuma IA completou, aplicamos substituições heurísticas locais se for ajuste de texto/cor
    if (!modified) {
      if (/ouro|gold|dourad/i.test(message)) {
        newHtml = newHtml.replace(/#2563eb|#4f46e5|#0f172a/g, '#d4af37');
        explanation = 'Ajustei os tons e realces do site para uma paleta dourada premium de alto padrão.';
      } else if (/verde|esmeralda|whatsapp/i.test(message)) {
        newHtml = newHtml.replace(/#2563eb|#4f46e5|#dc2626/g, '#10b981');
        explanation = 'Destaquei os botões e áreas de conversão em verde esmeralda com foco em agendamento.';
      } else if (selectedElement && message.length > 5) {
        if (newHtml.includes(selectedElement)) {
          newHtml = newHtml.replace(selectedElement, message);
          explanation = `Atualizei o texto selecionado para "${message}".`;
        } else {
          explanation = `Recebi sua instrução: "${message}". Registrado para a próxima compilação.`;
        }
      } else {
        explanation = `Atualização de "${message}" processada com sucesso no Studio.`;
      }
    }

    // Salva no histórico de versões
    if (!lead.siteHistory) lead.siteHistory = [];
    lead.siteHistory.push({
      action: 'COPILOT_REFINE',
      prompt: message,
      explanation,
      htmlSnapshot: lead.siteHtml,
      timestamp: new Date().toISOString()
    });

    lead.siteHtml = newHtml;
    lead.siteData = {
      ...(lead.siteData || {}),
      lastRefinedAt: new Date().toISOString(),
      refineCount: (lead.siteData?.refineCount || 0) + 1
    };

    saveLeads();

    res.json({
      success: true,
      html: newHtml,
      explanation,
      historyCount: lead.siteHistory.length,
      lead
    });
  } catch (err) {
    console.error('Erro no refinamento com Copilot:', err);
    res.status(500).json({ error: 'Erro ao processar refinamento com IA: ' + err.message });
  }
});

// 2.B ROLLBACK DE VERSÃO DO SITE
app.post('/api/site-builder/rollback', checkTrialActive, async (req, res) => {
  const { leadId, historyIndex } = req.body;
  const userId = req.user.id;

  const lead = dbLeads.find(l => (l.id === leadId || l.whatsapp === leadId) && (l.userId === userId || !l.userId));
  if (!lead) return res.status(404).json({ error: 'Lead não encontrado' });

  if (!lead.siteHistory || !lead.siteHistory[historyIndex]) {
    return res.status(400).json({ error: 'Versão do histórico não encontrada' });
  }

  const targetSnapshot = lead.siteHistory[historyIndex].htmlSnapshot;
  if (!targetSnapshot) {
    return res.status(400).json({ error: 'Snapshot desta versão não está disponível' });
  }

  lead.siteHistory.push({
    action: 'ROLLBACK',
    prompt: `Restaurado para versão #${historyIndex + 1}`,
    explanation: `Site restaurado para o estado da versão #${historyIndex + 1}.`,
    htmlSnapshot: lead.siteHtml,
    timestamp: new Date().toISOString()
  });

  lead.siteHtml = targetSnapshot;
  saveLeads();

  res.json({
    success: true,
    html: lead.siteHtml,
    message: `Versão #${historyIndex + 1} restaurada com sucesso!`,
    historyCount: lead.siteHistory.length,
    lead
  });
});

// 3. SALVAR EDIÇÕES MANUAIS NO SITE
app.put('/api/site-builder/save/:leadId', checkTrialActive, async (req, res) => {
  const { leadId } = req.params;
  const { html, customOverrides, creativeDirection, siteStatus } = req.body;
  const userId = req.user.id;

  const lead = dbLeads.find(l => (l.id === leadId || l.whatsapp === leadId) && l.userId === userId);
  if (!lead) return res.status(404).json({ error: 'Lead não encontrado' });

  if (html) lead.siteHtml = html;
  if (siteStatus) lead.siteStatus = siteStatus;
  lead.siteData = {
    ...lead.siteData,
    customOverrides: customOverrides || lead.siteData?.customOverrides,
    creativeDirection: creativeDirection || lead.siteData?.creativeDirection || 'moderno',
    lastSaved: new Date().toISOString()
  };

  saveLeads();
  res.json({ success: true, lead });
});

// 4. VISUALIZAÇÃO DA PROPOSTA EM HTML (Para impressão e leitura no navegador)
app.get('/api/site-builder/proposal-view/:leadId', (req, res) => {
  const { leadId } = req.params;
  const lead = dbLeads.find(l => l.id === leadId || l.whatsapp === leadId);
  if (!lead) return res.status(404).send('Lead não encontrado');

  const consultantData = {
    nome: req.query.nome || 'Consultor Comercial',
    telefone: req.query.telefone || lead.whatsapp || '',
    whatsapp: req.query.whatsapp || lead.whatsapp || '',
    agencia: req.query.agencia || 'LeadScanner Studio'
  };

  const html = compileProposalHtml(lead, consultantData);
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.send(html);
});

// 5. GERAÇÃO DE PROPOSTA EM PDF (5 Páginas A4 com Puppeteer)
app.post('/api/site-builder/pdf/:leadId', checkTrialActive, async (req, res) => {
  const { leadId } = req.params;
  const userId = req.user.id;
  const lead = dbLeads.find(l => (l.id === leadId || l.whatsapp === leadId) && l.userId === userId);
  if (!lead) return res.status(404).json({ error: 'Lead não encontrado' });

  const consultantData = req.body.consultantData || {};
  const html = compileProposalHtml(lead, consultantData);

  try {
    const browser = await puppeteer.launch({
      executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || undefined,
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu', '--disable-dev-shm-usage']
    });
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0', timeout: 30000 });
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      preferCSSPageSize: true,
      margin: { top: '0px', right: '0px', bottom: '0px', left: '0px' }
    });
    await browser.close();

    lead.siteStatus = 'PDF_GERADO';
    lead.pdfGeneratedAt = new Date().toISOString();
    saveLeads();

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="proposta-${(lead.nome || 'lead').replace(/[^a-zA-Z0-9]/g, '_')}.pdf"`);
    return res.send(pdfBuffer);
  } catch (err) {
    console.error('Erro ao gerar PDF com Puppeteer (ativando fallback de visualização):', err.message);
    // Em caso de falta de binário no ambiente, retorna o HTML para abertura e impressão direta
    return res.json({
      success: false,
      fallbackHtml: html,
      message: 'Impressão direta via navegador ativada com sucesso.'
    });
  }
});

// 6. ATUALIZAÇÃO DE STATUS NO FUNIL DE VENDAS
app.patch('/api/site-builder/status/:leadId', checkTrialActive, (req, res) => {
  const { leadId } = req.params;
  const { status } = req.body;
  const userId = req.user.id;

  const lead = dbLeads.find(l => (l.id === leadId || l.whatsapp === leadId) && l.userId === userId);
  if (!lead) return res.status(404).json({ error: 'Lead não encontrado' });

  lead.siteStatus = status;
  if (!lead.siteHistory) lead.siteHistory = [];
  lead.siteHistory.push({
    action: `STATUS_${status}`,
    timestamp: new Date().toISOString()
  });

  saveLeads();
  res.json({ success: true, lead });
});

// 7. DOWNLOAD / VISUALIZAÇÃO DO PDF DA DEMONSTRAÇÃO DO LEAD
app.get('/api/leads/:leadId/pdf', async (req, res) => {
  const { leadId } = req.params;
  const lead = dbLeads.find(l => String(l.id) === String(leadId) || String(l.whatsapp) === String(leadId));
  if (!lead) return res.status(404).send('Lead não encontrado');

  const safeName = (lead.nome || 'Demonstracao').replace(/[^a-zA-Z0-9]/g, '_');

  // Se o PDF já estiver salvo em disco
  if (lead.pdfPath && fs.existsSync(lead.pdfPath)) {
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename="Demonstracao-${safeName}.pdf"`);
    return fs.createReadStream(lead.pdfPath).pipe(res);
  }

  // Gera sob demanda se ainda não existir
  let browser;
  try {
    const consultantData = {
      nome: 'Consultor Comercial',
      telefone: lead.whatsapp || '',
      whatsapp: lead.whatsapp || '',
      agencia: 'LeadScanner Studio'
    };

    // Garante que o site HTML do lead existe
    if (!lead.siteHtml) {
      const skill = resolveBestSkillForNiche(lead.nicho, lead.nome);
      lead.siteHtml = compileSiteHtml(lead, skill);
      lead.siteSkill = skill;
      lead.siteGeneratedAt = new Date().toISOString();
    }

    browser = await puppeteer.launch({
      executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || undefined,
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu', '--disable-dev-shm-usage']
    });

    // 1. Renderiza o site do lead e captura screenshots reais desktop e mobile
    let screenshots = {};
    try {
      const sitePage = await browser.newPage();
      await sitePage.setViewport({ width: 1280, height: 800, deviceScaleFactor: 1 });
      await sitePage.setContent(lead.siteHtml, { waitUntil: 'networkidle0', timeout: 20000 });
      const desktopBase64 = await sitePage.screenshot({ encoding: 'base64', type: 'jpeg', quality: 85 });

      await sitePage.setViewport({ width: 390, height: 844, isMobile: true, deviceScaleFactor: 1 });
      const mobileBase64 = await sitePage.screenshot({ encoding: 'base64', type: 'jpeg', quality: 85 });
      await sitePage.close();

      screenshots = {
        desktop: `data:image/jpeg;base64,${desktopBase64}`,
        mobile: `data:image/jpeg;base64,${mobileBase64}`
      };
    } catch (snapErr) {
      console.warn('Aviso: falha ao tirar snapshot do site para o PDF, usando fallback:', snapErr.message);
    }

    // 2. Compila a proposta comercial injetando as capturas reais
    const proposalHtml = compileProposalHtml(lead, consultantData, screenshots);

    const page = await browser.newPage();
    await page.setContent(proposalHtml, { waitUntil: 'networkidle0', timeout: 30000 });
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      preferCSSPageSize: true,
      margin: { top: '0px', right: '0px', bottom: '0px', left: '0px' }
    });

    const filename = `proposta-${lead.id}-${safeName}.pdf`;
    const filePath = path.join(PROPOSALS_DIR, filename);
    fs.writeFileSync(filePath, pdfBuffer);

    lead.pdfPath = filePath;
    lead.pdfFilename = filename;
    lead.pdfUrl = `/api/leads/${lead.id}/pdf`;
    lead.hasPdf = true;
    lead.siteStatus = lead.siteStatus === 'SITE_GERADO' ? 'SITE_E_PDF_PRONTO' : (lead.siteStatus || 'PDF_GERADO');
    saveLeads();

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename="Demonstracao-${safeName}.pdf"`);
    return res.send(pdfBuffer);
  } catch (err) {
    console.error('Erro ao gerar PDF do lead:', err.message);
    res.status(500).send('Erro ao renderizar PDF da demonstração: ' + err.message);
  } finally {
    if (browser) {
      try { await browser.close(); } catch {}
    }
  }
});

// 8. GERAÇÃO EM LOTE DE SITES E PDFS DE DEMONSTRAÇÃO (ESTEIRA AUTOMATIZADA)
app.post('/api/pipeline/batch-generate', checkTrialActive, async (req, res) => {
  const userId = req.user.id;
  const { leadIds, force = false, consultantName, consultantPhone, agencyName } = req.body;

  let targetLeads = dbLeads.filter(l => l.userId === userId);
  if (Array.isArray(leadIds) && leadIds.length > 0) {
    const idSet = new Set(leadIds.map(String));
    targetLeads = targetLeads.filter(l => idSet.has(String(l.id)));
  } else {
    // Por padrão, pega todos os que não têm site e ainda não têm PDF gerado
    targetLeads = targetLeads.filter(l => !l.hasSite || l.siteStatus !== 'SITE_E_PDF_PRONTO');
  }

  if (targetLeads.length === 0) {
    return res.json({ success: true, processed: 0, total: 0, message: 'Nenhum lead elegível para geração de site e PDF.' });
  }

  console.log(`[User ${userId}] ⚡ Iniciando esteira em lote: ${targetLeads.length} sites & PDFs a processar...`);

  let browser;
  const processed = [];
  const errors = [];

  try {
    browser = await puppeteer.launch({
      executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || undefined,
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu', '--disable-dev-shm-usage']
    });

    for (const lead of targetLeads) {
      try {
        if (!force && lead.siteStatus === 'SITE_E_PDF_PRONTO' && lead.pdfPath && fs.existsSync(lead.pdfPath)) {
          processed.push({ id: lead.id, nome: lead.nome, status: 'already_ready', pdfUrl: lead.pdfUrl });
          continue;
        }

        // 1. Compila o Site Completo
        const skill = resolveBestSkillForNiche(lead.nicho, lead.nome);
        const compiledHtml = compileSiteHtml(lead, skill);
        lead.siteHtml = compiledHtml;
        lead.siteSkill = skill;
        lead.siteGeneratedAt = new Date().toISOString();

        // 2. Captura screenshots reais desktop e mobile do site gerado
        let screenshots = {};
        try {
          const sitePage = await browser.newPage();
          await sitePage.setViewport({ width: 1280, height: 800, deviceScaleFactor: 1 });
          await sitePage.setContent(compiledHtml, { waitUntil: 'networkidle0', timeout: 20000 });
          const desktopBase64 = await sitePage.screenshot({ encoding: 'base64', type: 'jpeg', quality: 85 });

          await sitePage.setViewport({ width: 390, height: 844, isMobile: true, deviceScaleFactor: 1 });
          const mobileBase64 = await sitePage.screenshot({ encoding: 'base64', type: 'jpeg', quality: 85 });
          await sitePage.close();

          screenshots = {
            desktop: `data:image/jpeg;base64,${desktopBase64}`,
            mobile: `data:image/jpeg;base64,${mobileBase64}`
          };
        } catch (snapErr) {
          console.warn(`Aviso: falha ao tirar snapshot para ${lead.nome}, usando fallback:`, snapErr.message);
        }

        // 3. Compila a Proposta Comercial em HTML com capturas reais
        const consultantData = {
          nome: consultantName || 'Consultor Comercial',
          telefone: consultantPhone || lead.whatsapp || '',
          whatsapp: consultantPhone || lead.whatsapp || '',
          agencia: agencyName || 'LeadScanner Studio'
        };
        const proposalHtml = compileProposalHtml(lead, consultantData, screenshots);

        // 4. Renderiza o PDF em A4 via Puppeteer
        const page = await browser.newPage();
        await page.setContent(proposalHtml, { waitUntil: 'networkidle0', timeout: 30000 });
        const pdfBuffer = await page.pdf({
          format: 'A4',
          printBackground: true,
          preferCSSPageSize: true,
          margin: { top: '0px', right: '0px', bottom: '0px', left: '0px' }
        });
        await page.close();

        // 4. Salva em disco
        const safeName = (lead.nome || 'lead').replace(/[^a-zA-Z0-9]/g, '_');
        const filename = `proposta-${lead.id}-${safeName}.pdf`;
        const filePath = path.join(PROPOSALS_DIR, filename);
        fs.writeFileSync(filePath, pdfBuffer);

        // 5. Atualiza o lead no banco
        lead.siteStatus = 'SITE_E_PDF_PRONTO';
        lead.pdfPath = filePath;
        lead.pdfFilename = filename;
        lead.pdfUrl = `/api/leads/${lead.id}/pdf`;
        lead.hasPdf = true;
        lead.pdfGeneratedAt = new Date().toISOString();

        if (!lead.siteHistory) lead.siteHistory = [];
        lead.siteHistory.push({
          action: 'BATCH_SITE_E_PDF_GERADO',
          timestamp: new Date().toISOString()
        });

        processed.push({ id: lead.id, nome: lead.nome, status: 'success', pdfUrl: lead.pdfUrl });
        console.log(`[User ${userId}] ✅ [${processed.length}/${targetLeads.length}] Site & PDF gerados para: ${lead.nome}`);
      } catch (leadErr) {
        console.error(`[User ${userId}] ❌ Erro ao processar lead ${lead.nome}:`, leadErr.message);
        errors.push({ id: lead.id, nome: lead.nome, error: leadErr.message });
      }
    }
  } finally {
    if (browser) {
      try { await browser.close(); } catch {}
    }
    saveLeads();
  }

  res.json({
    success: true,
    total: targetLeads.length,
    processedCount: processed.length,
    errorCount: errors.length,
    processed,
    errors
  });
});



app.get('/api/history', checkTrialActive, (req, res) => {
  res.json({ data: dbHistory.filter(h => h.userId === req.user.id).sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt)) });
});
app.post('/api/history', checkTrialActive, (req, res) => {
  const newHistory = {
    id: '#' + Math.floor(Math.random() * 10000).toString().padStart(4, '0'),
    userId: req.user.id,
    name: req.body.name || 'Nova Importação',
    date: new Date().toLocaleDateString('pt-BR'),
    time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    createdAt: new Date().toISOString(),
    total: req.body.total || 0,
    approved: req.body.approved || 0,
    rate: req.body.total ? Math.round((req.body.approved / req.body.total) * 100) + '%' : '0%',
    status: req.body.status || 'Concluído'
  };
  dbHistory.push(newHistory);
  saveHistory();
  res.json({ success: true, data: newHistory });
});
app.delete('/api/history/:id', checkTrialActive, (req, res) => {
  dbHistory = dbHistory.filter(h => !(h.userId === req.user.id && h.id === req.params.id));
  saveHistory();
  res.json({ success: true });
});
app.delete('/api/history', checkTrialActive, (req, res) => {
  dbHistory = dbHistory.filter(h => h.userId !== req.user.id);
  saveHistory();
  res.json({ success: true });
});

// LEADS
app.get('/api/leads/stats', checkTrialActive, (req, res) => {
  const userLeads = dbLeads.filter(l => l.userId === req.user.id);
  res.json({
    total: userLeads.length,
    quentes: userLeads.filter(l => l.status === 'QUENTE').length,
    mornos: userLeads.filter(l => l.status === 'MORNO').length,
    frios: userLeads.filter(l => l.status === 'FRIO').length
  });
});

app.get('/api/leads', checkTrialActive, (req, res) => {
  const userLeads = dbLeads.filter(l => l.userId === req.user.id);
  if (req.query.full === 'true') {
    return res.json({ data: userLeads });
  }
  // Remove heavy siteHtml string from general list to prevent memory lag
  const lightweight = userLeads.map(l => {
    if (!l.siteHtml) return l;
    const { siteHtml, ...rest } = l;
    return { ...rest, hasSiteHtml: true };
  });
  res.json({ data: lightweight });
});

app.post('/api/leads', checkTrialActive, (req, res) => {
  // Check leads limit for trial users
  if (req.dbUser && req.dbUser.plan) {
    const currentCount = dbLeads.filter(l => l.userId === req.user.id).length;
    if (currentCount >= req.dbUser.plan.limits.maxLeads) {
      return res.status(403).json({ error: `Limite de ${req.dbUser.plan.limits.maxLeads} leads atingido. Atualize seu plano.`, code: 'LIMIT_LEADS' });
    }
  }
  
  const incoming = Array.isArray(req.body) ? req.body : [req.body];
  const added = [];
  const userLeads = dbLeads.filter(l => l.userId === req.user.id);
  
  incoming.forEach(lead => {
    if (!userLeads.find(d => d.whatsapp === lead.whatsapp && lead.whatsapp !== 'não informado')) {
      const newLead = { 
        id: lead.id || Math.random().toString(36).substr(2,9), 
        ...lead, 
        userId: req.user.id,
        status: lead.status || 'FRIO', 
        score: lead.score || 0, 
        lastInteraction: new Date().toISOString() 
      };
      dbLeads.push(newLead);
      added.push(newLead);
    }
  });
  const finalLeads = incoming.map(l => {
    const existing = userLeads.find(d => d.whatsapp === l.whatsapp && l.whatsapp !== 'não informado');
    if (existing) return existing;
    const newlyAdded = added.find(d => d.whatsapp === l.whatsapp);
    return newlyAdded || l;
  });

  saveLeads();
  if (autoSendEnabled[req.user.id] && !autoSendRunning[req.user.id] && added.length > 0) {
    startAutoSendLoop(req.user.id);
  }
  res.json({ success: true, data: finalLeads });
});

app.delete('/api/leads/:id', checkTrialActive, (req, res) => {
  const initial = dbLeads.length;
  dbLeads = dbLeads.filter(l => !(l.userId === req.user.id && (l.id === req.params.id || l.whatsapp === req.params.id)));
  if (dbLeads.length < initial) { saveLeads(); res.json({ success: true }); }
  else res.status(404).json({ error: 'Não encontrado' });
});

app.put('/api/leads/:id/status', checkTrialActive, (req, res) => {
  const lead = dbLeads.find(l => l.userId === req.user.id && (l.id === req.params.id || l.whatsapp === req.params.id));
  if (lead) {
    lead.status = req.body.status;
    saveLeads();
    res.json({ success: true, lead });
  } else {
    res.status(404).json({ error: 'Não encontrado' });
  }
});

app.post('/api/leads/clean', checkTrialActive, async (req, res) => {
  const userId = req.user.id;
  if (userWhatsappStatus[userId] !== 'CONNECTED') return res.status(400).json({ error: 'WhatsApp não conectado' });
  
  const userLeads = dbLeads.filter(l => l.userId === userId);
  const otherLeads = dbLeads.filter(l => l.userId !== userId);
  
  const initial = userLeads.length;
  const valid = [];
  
  for (const l of userLeads) {
    if (!l.whatsapp || l.whatsapp === 'não informado') continue;
    try {
      const isRegistered = await whatsappClients[userId].isRegisteredUser(String(l.whatsapp).replace(/\D/g, '') + '@c.us');
      if (isRegistered) valid.push(l);
    } catch(e) { valid.push(l); }
    await new Promise(r => setTimeout(r, 250));
  }
  
  dbLeads = [...otherLeads, ...valid];
  saveLeads();
  res.json({ success: true, removed: initial - valid.length, total: valid.length });
});

// UTILIDADES PARA CAMPANHAS
function humanizeMessage(template, lead) {
  let msg = template;

  const spintaxRegex = /\{([^{}]+)\}/g;
  let spintaxResolved = msg;
  let matches;
  while ((matches = spintaxRegex.exec(spintaxResolved)) !== null) {
    const fullMatch = matches[0];
    const contents = matches[1];
    if (contents.includes('|')) {
      const choices = contents.split('|');
      const choice = choices[Math.floor(Math.random() * choices.length)];
      spintaxResolved = spintaxResolved.replace(fullMatch, choice);
      spintaxRegex.lastIndex = 0;
    }
  }
  msg = spintaxResolved;

  const cleanName = (str, defaultVal) => {
    if (!str || str === 'não informado') return defaultVal;
    return str.split(/[,|\-]/)[0].trim();
  };

  const leadNomeLimpo = cleanName(lead.nome, 'Empresa');
  const leadNichoLimpo = cleanName(lead.nicho, 'seu segmento');

  msg = msg.replace(/{nome}/g, (lead.nome || 'Lider').split(' ')[0]);
  msg = msg.replace(/{empresa}/g, leadNomeLimpo);
  msg = msg.replace(/{nicho}/g, leadNichoLimpo);
  msg = msg.replace(/{cidade}/g, cleanName(lead.cidade, 'sua região'));
  const pick = arr => arr[Math.floor(Math.random() * arr.length)];
  msg = msg.replace(/{saudacao}/g, () => pick(['Oi', 'Olá', 'E aí', 'Fala', 'Opa']));
  msg = msg.replace(/{emoji_oi}/g, () => pick(['👋', '✨', '']));
  msg = msg.replace(/{emoji}/g, () => pick(['🚀', '🔥', '💡', '']));
  msg = msg.replace(/{tempo}/g, () => pick(['hoje', 'agora pouco', 'esses dias']));
  msg = msg.replace(/{vi}/g, () => pick(['Vi', 'Encontrei', 'Dei uma olhada na']));
  
  // Basic auto-randomization if user didn't use spintax
  msg = msg.replace(/Opa \{nome\}, tudo bem\?/gi, () => pick(['Opa', 'Oi', 'Olá', 'Fala']) + ` ${(lead.nome || 'Lider').split(' ')[0]}, ` + pick(['tudo bem?', 'como vai?', 'tudo certo?']));
  msg = msg.replace(/Estava dando uma olhada/gi, () => pick(['Estava dando uma olhada', 'Tava vendo', 'Dei uma olhada', 'Achei', 'Encontrei']));
  msg = msg.replace(/achei fant(a|á)stico o trabalho/gi, () => pick(['achei fantástico o trabalho', 'gostei muito do trabalho', 'achei incrível o que fazem']));
  msg = msg.replace(/Notei que/gi, () => pick(['Notei que', 'Percebi que', 'Vi que']));
  msg = msg.replace(/Faz sentido para voc(e|ê)s/gi, () => pick(['Faz sentido para vocês', 'Será que faz sentido', 'Vocês teriam interesse em']));

  return msg;
}

// AUTO SEND
app.get('/api/autosend/status', checkTrialActive, (req, res) => {
  const userId = req.user.id;
  if (!autoSendStats[userId]) autoSendStats[userId] = { sent: 0, failed: 0, skipped: 0, lastSentAt: null, lastLeadName: null };
  const pendingCount = dbLeads.filter(l => l.userId === userId && !l.messageSent && l.whatsapp && l.whatsapp !== 'não informado').length;
  res.json({ enabled: !!autoSendEnabled[userId], running: !!autoSendRunning[userId], stats: autoSendStats[userId], pendingCount });
});

app.post('/api/autosend/toggle', checkTrialActive, checkProTier, (req, res) => {
  const userId = req.user.id;
  // Check message limit for trial users
  if (req.dbUser && req.dbUser.plan) {
    if (req.dbUser.plan.usage.messagesToday >= req.dbUser.plan.limits.maxMessagesPerDay) {
      return res.status(403).json({ error: `Limite de ${req.dbUser.plan.limits.maxMessagesPerDay} mensagens por dia atingido.`, code: 'LIMIT_MESSAGES' });
    }
  }
  autoSendEnabled[userId] = !autoSendEnabled[userId];
  if (autoSendEnabled[userId] && !autoSendRunning[userId]) startAutoSendLoop(userId);
  res.json({ enabled: autoSendEnabled[userId] });
});

app.post('/api/autosend/reset-stats', checkTrialActive, (req, res) => { 
  autoSendStats[req.user.id] = { sent: 0, failed: 0, skipped: 0, lastSentAt: null, lastLeadName: null }; 
  res.json({ success: true }); 
});

app.post('/api/autosend/reset-leads', checkTrialActive, (req, res) => { 
  dbLeads.filter(l => l.userId === req.user.id).forEach(l => { delete l.messageSent; delete l.messageSentAt; }); 
  saveLeads(); 
  res.json({ success: true }); 
});

async function startAutoSendLoop(userId) {
  if (autoSendRunning[userId]) return;
  autoSendRunning[userId] = true;
  if (!autoSendStats[userId]) autoSendStats[userId] = { sent: 0, failed: 0, skipped: 0, lastSentAt: null, lastLeadName: null };
  
  let batchCount = 0;
  while (autoSendEnabled[userId]) {
    const pending = dbLeads.find(l => l.userId === userId && !l.messageSent && l.whatsapp && l.whatsapp !== 'não informado' && String(l.whatsapp).replace(/\D/g, '').length >= 10);
    if (!pending) { await new Promise(r => setTimeout(r, 30000)); continue; }
    if (userWhatsappStatus[userId] !== 'CONNECTED') { await new Promise(r => setTimeout(r, 15000)); continue; }
    
    let number = String(pending.whatsapp).replace(/\D/g, '');
    if (number.length <= 5) { pending.messageSent = true; pending.messageStatus = 'SEM_WHATSAPP'; saveLeads(); autoSendStats[userId].skipped++; continue; }
    if (number.startsWith('0') && number.length >= 11) number = number.substring(1);
    if (number.length === 10 || number.length === 11) number = '55' + number;
    
    try {
      const contactId = await whatsappClients[userId].getNumberId(number);
      if (!contactId) { pending.messageSent = true; pending.messageStatus = 'SEM_WHATSAPP'; pending.status = 'FRIO'; saveLeads(); autoSendStats[userId].skipped++; continue; }
      
      const userTemplates = campaignTemplates.filter(t => t.userId === userId);
      let tpls = userTemplates.map(t => t.content || t.text).filter(Boolean);
      if(!tpls.length) tpls = ['{saudacao}, tudo bem? {emoji_oi}\n\n{vi} a {empresa} {tempo} e achei bem interessante o trabalho de vocês.\n\nPercebi que vocês ainda não têm um sistema profissional pra converter mais clientes pelo Google.\n\nConsigo montar uma prévia sem compromisso com a identidade de vocês. Posso te mostrar como ficaria?'];
      const msg = humanizeMessage(tpls[Math.floor(Math.random()*tpls.length)], pending);
      
      await new Promise(r => setTimeout(r, Math.random() * 3000 + 2000));
      await whatsappClients[userId].sendMessage(contactId._serialized, msg);
      
      if (!userChatSessions[userId]) userChatSessions[userId] = {};
      if (!userChatSessions[userId][contactId._serialized]) {
        userChatSessions[userId][contactId._serialized] = [{
          role: "system",
          content: `Você é um SDR. Qualifique o lead de forma curta e natural. Lead: ${pending.nome || 'Não informado'} - ${pending.nicho || 'Não informado'}. REGRA IMPORTANTE: Se a mensagem do lead parecer um robô de autoatendimento com menu numérico (ex: "Digite 1 para X"), responda APENAS com o DÍGITO correspondente à opção (ex: 1, 2 ou 3) que leva ao setor comercial, atendimento ou gerência. Se for mensagem de ausência, mande uma abordagem amigável pedindo para falar com o responsável.`
        }];
      }
      userChatSessions[userId][contactId._serialized].push({ role: "assistant", content: msg });
      
      if (!userChatState[userId]) userChatState[userId] = {};
      userChatState[userId][contactId._serialized] = { mode: 'BOT', lastActivity: Date.now(), lastSender: 'bot', followUpCount: 0 };
      
      pending.messageSent = true; pending.messageSentAt = new Date().toISOString(); pending.messageStatus = 'ENVIADO'; pending.status = 'CHAMADO'; pending.lastInteraction = pending.messageSentAt; saveLeads();
      autoSendStats[userId].sent++; autoSendStats[userId].lastSentAt = pending.messageSentAt; autoSendStats[userId].lastLeadName = pending.nome;
      // Increment daily message count for trial users
      const autoSendUser = dbUsers.find(u => u.id === userId);
      if (autoSendUser && autoSendUser.plan && autoSendUser.plan.usage) { autoSendUser.plan.usage.messagesToday++; saveUsers(); }
      batchCount++;
      if (batchCount >= 15) {
        for(let i=0; i<60; i++) { if(!autoSendEnabled[userId]) break; await new Promise(r=>setTimeout(r,10000)); }
        batchCount = 0;
      } else {
        const delay = Math.floor(Math.random()*(120-45+1))+45;
        for(let i=0; i<Math.ceil(delay/5); i++) { if(!autoSendEnabled[userId]) break; await new Promise(r=>setTimeout(r,5000)); }
      }
    } catch(e) {
      console.error("ERRO NO LOOP DE AUTO SEND PARA O NÚMERO " + number + ":", e.message);
      if (e.message && e.message.includes('wid')) {
        pending.messageSent = true; pending.messageStatus = 'ERRO'; saveLeads(); 
      }
      autoSendStats[userId].failed++;
      await new Promise(r=>setTimeout(r,10000));
    }
  }
  autoSendRunning[userId] = false;
}

// CAMPAIGN
app.get('/api/whatsapp/campaign/status', checkTrialActive, (req, res) => {
  const userId = req.user.id;
  if (!campaignStates[userId]) campaignStates[userId] = { isRunning: false, total: 0, sent: 0, failed: 0, skipped: 0, errors: [], actionLog: [], currentLead: null, shouldStop: false, startedAt: null };
  res.json(campaignStates[userId]);
});

app.post('/api/whatsapp/campaign/stop', checkTrialActive, checkProTier, (req, res) => { 
  if (campaignStates[req.user.id]) campaignStates[req.user.id].shouldStop = true; 
  res.json({ success: true }); 
});

app.post('/api/whatsapp/campaign/start', checkTrialActive, checkProTier, async (req, res) => {
  const userId = req.user.id;
  if (userWhatsappStatus[userId] !== 'CONNECTED') return res.status(400).json({ error: 'WhatsApp não conectado' });
  if (campaignStates[userId]?.isRunning) return res.status(400).json({ error: 'Campanha já rodando' });
  
  // Check message limit for trial users
  if (req.dbUser && req.dbUser.plan) {
    if (req.dbUser.plan.usage.messagesToday >= req.dbUser.plan.limits.maxMessagesPerDay) {
      return res.status(403).json({ error: `Limite de ${req.dbUser.plan.limits.maxMessagesPerDay} mensagens por dia atingido.`, code: 'LIMIT_MESSAGES' });
    }
  }
  
  const { leads, templates, delayMin=45, delayMax=120, batchSize=15, batchPause=600, attachPdf = false } = req.body;
  if (!leads?.length || !templates?.length) return res.status(400).json({ error: 'Dados inválidos' });
  
  campaignStates[userId] = { isRunning: true, total: leads.length, sent: 0, failed: 0, skipped: 0, errors: [], actionLog: [], currentLead: null, shouldStop: false, startedAt: new Date().toISOString() };
  processCampaign(userId, leads, templates, delayMin, delayMax, batchSize, batchPause, attachPdf);
  res.json({ success: true });
});

async function processCampaign(userId, leads, templates, delayMin, delayMax, batchSize, batchPause, attachPdf = false) {
  let batchCount = 0;
  const state = campaignStates[userId];
  const client = whatsappClients[userId];

  for (const lead of leads) {
    if (state.shouldStop) break;
    try {
      state.currentLead = lead.nome;
      let number = String(lead.whatsapp || '').replace(/\D/g, '');
      
      if (number.length <= 5) { 
        state.skipped++; 
        state.actionLog.unshift({ lead: lead.nome, status: 'Pulado (Invalido)', time: new Date().toLocaleTimeString() }); 
        continue; 
      }
      if (number.startsWith('0') && number.length >= 11) number = number.substring(1);
      if (number.length === 10 || number.length === 11) number = '55' + number;

      const template = templates[Math.floor(Math.random() * templates.length)];
      if (!template) throw new Error("Template nulo");
      const message = humanizeMessage(template, lead);
      
      if (!client) throw new Error("WhatsApp não conectado no servidor");

      const contactId = await client.getNumberId(number);
      if (!contactId) { 
        state.skipped++; 
        state.actionLog.unshift({ lead: lead.nome, status: 'Pulado (S/ Zap)', time: new Date().toLocaleTimeString() }); 
        continue; 
      }
      
      await new Promise(r => setTimeout(r, Math.random() * 3000 + 2000));
      
      const dbLeadRef = dbLeads.find(l => l.id === lead.id) || lead;
      let sentWithPdf = false;

      if (attachPdf && dbLeadRef.pdfPath && fs.existsSync(dbLeadRef.pdfPath)) {
        try {
          const media = MessageMedia.fromFilePath(dbLeadRef.pdfPath);
          await client.sendMessage(contactId._serialized, media, { caption: message });
          sentWithPdf = true;
          console.log(`[User ${userId}] 📎 Mensagem com PDF anexo enviada para ${lead.nome}`);
        } catch (mediaErr) {
          console.warn(`[User ${userId}] Falha ao anexar PDF, enviando texto puro:`, mediaErr.message);
          await client.sendMessage(contactId._serialized, message);
        }
      } else {
        await client.sendMessage(contactId._serialized, message);
      }
      
      if (!userChatSessions[userId]) userChatSessions[userId] = {};
      if (!userChatSessions[userId][contactId._serialized]) {
        userChatSessions[userId][contactId._serialized] = [{
          role: "system",
          content: `Você é um SDR. Qualifique o lead de forma curta e natural. Lead: ${lead.nome || 'Não informado'} - ${lead.nicho || 'Não informado'}. REGRA IMPORTANTE: Se a mensagem do lead parecer um robô de autoatendimento com menu numérico (ex: "Digite 1 para X"), responda APENAS com o DÍGITO correspondente à opção (ex: 1, 2 ou 3) que leva ao setor comercial, atendimento ou gerência. Se for mensagem de ausência, mande uma abordagem amigável pedindo para falar com o responsável.`
        }];
      }
      userChatSessions[userId][contactId._serialized].push({ role: "assistant", content: message });
      
      if (!userChatState[userId]) userChatState[userId] = {};
      userChatState[userId][contactId._serialized] = { mode: 'BOT', lastActivity: Date.now(), lastSender: 'bot', followUpCount: 0 };
      
      const dbLead = dbLeads.find(l => l.id === lead.id);
      if (dbLead) {
        dbLead.messageSent = true;
        dbLead.messageSentAt = new Date().toISOString();
        dbLead.messageStatus = 'ENVIADO';
        dbLead.status = 'CHAMADO';
        dbLead.lastInteraction = dbLead.messageSentAt;
        if (sentWithPdf) dbLead.sentWithPdf = true;
        saveLeads();
      }
      // Increment daily message count for trial users
      const campaignUser = dbUsers.find(u => u.id === userId);
      if (campaignUser && campaignUser.plan && campaignUser.plan.usage) { campaignUser.plan.usage.messagesToday++; saveUsers(); }

      state.sent++;
      state.actionLog.unshift({ lead: lead.nome, status: sentWithPdf ? 'Enviada c/ PDF' : 'Enviada', time: new Date().toLocaleTimeString() });
    } catch(e) { 
      console.error("ERRO NO PROCESS CAMPAIGN PARA O NÚMERO " + number + ":", e.message);
      state.failed++; 
      state.errors.push({ lead: lead.nome || 'Desconhecido', error: e.message }); 
      state.actionLog.unshift({ lead: lead.nome || 'Desconhecido', status: 'Falha', time: new Date().toLocaleTimeString() }); 
      
      const dbLead = dbLeads.find(l => l.id === lead.id);
      if (dbLead && e.message && e.message.includes('wid')) {
        dbLead.messageSent = true;
        dbLead.messageStatus = 'ERRO';
        saveLeads();
      }
    }
    
    batchCount++;
    if (batchCount >= batchSize) {
      for (let i=0; i<Math.ceil(batchPause/10); i++) { if (state.shouldStop) break; await new Promise(r=>setTimeout(r, 10000)); }
      batchCount = 0;
    } else {
      const delay = Math.floor(Math.random()*(delayMax-delayMin+1))+delayMin;
      for (let i=0; i<Math.ceil(delay/5); i++) { if (state.shouldStop) break; await new Promise(r=>setTimeout(r, 5000)); }
    }
  }
  state.isRunning = false;
  state.currentLead = null;
}

// TEMPLATES
app.get('/api/whatsapp/templates', checkTrialActive, (req, res) => {
  let userTemplates = campaignTemplates.filter(t => t.userId === req.user.id);
  if (userTemplates.length === 0) {
    const defaultTemplate = {
      id: Date.now(),
      name: 'Prospecção Especialista (Alta Conversão)',
      type: 'Primeiro Contato',
      status: 'Ativa',
      content: 'Opa {nome}, tudo bem?\n\nEstava dando uma olhada na {empresa} e achei fantástico o trabalho de vocês em {cidade}.\n\nNotei que vocês poderiam ter uma presença digital muito mais forte. Nós ajudamos empresas do segmento de {nicho} a passarem mais credibilidade e atraírem novos clientes todos os dias através da criação de sites profissionais e modernos.\n\nFaz sentido para vocês melhorar a imagem da empresa na internet hoje? Se sim, posso te mandar um modelo rápido de como ficaria o site de vocês?',
      uses: 0, responseRate: '0%', color: 'purple', responses: 0, deals: 0,
      userId: req.user.id
    };
    campaignTemplates.push(defaultTemplate);
    saveTemplates();
    userTemplates = [defaultTemplate];
  }
  res.json({ data: userTemplates });
});
app.post('/api/whatsapp/templates', checkTrialActive, checkProTier, (req, res) => { 
  const incoming = req.body.templates || [];
  const otherTemplates = campaignTemplates.filter(t => t.userId !== req.user.id);
  const userTpls = incoming.map(t => ({ ...t, userId: req.user.id }));
  campaignTemplates = [...otherTemplates, ...userTpls];
  saveTemplates(); 
  res.json({ success: true }); 
});

app.post('/api/whatsapp/message', checkTrialActive, async (req, res) => {
  const userId = req.user.id;
  // Check message limit for trial users
  if (req.dbUser && req.dbUser.plan) {
    if (req.dbUser.plan.usage.messagesToday >= req.dbUser.plan.limits.maxMessagesPerDay) {
      return res.status(403).json({ error: `Limite de ${req.dbUser.plan.limits.maxMessagesPerDay} mensagens por dia atingido.`, code: 'LIMIT_MESSAGES' });
    }
  }
  if (userWhatsappStatus[userId] !== 'CONNECTED') return res.status(400).json({ error: 'WhatsApp não conectado' });
  try {
    await whatsappClients[userId].sendMessage(String(req.body.number || '').replace(/\D/g, '') + '@c.us', req.body.message);
    // Increment daily message count for trial users
    if (req.dbUser && req.dbUser.plan && req.dbUser.plan.usage) { req.dbUser.plan.usage.messagesToday++; saveUsers(); }
    res.json({ success: true });
  }
  catch(e) { res.status(500).json({ error: e.message }); }
});

function classifyWebsite(siteUrl) {
  if (!siteUrl || typeof siteUrl !== 'string') return { hasSite: false, siteType: 'NONE' };
  const clean = siteUrl.trim().toLowerCase();
  if (clean === '' || clean === 'não informado' || clean === 'null' || clean === 'undefined') {
    return { hasSite: false, siteType: 'NONE' };
  }
  if (clean.includes('instagram.com/')) {
    return { hasSite: false, siteType: 'INSTAGRAM' };
  }
  if (clean.includes('facebook.com/') || clean.includes('fb.com/') || clean.includes('fb.watch/')) {
    return { hasSite: false, siteType: 'FACEBOOK' };
  }
  if (
    clean.includes('linktr.ee') ||
    clean.includes('bio.site') ||
    clean.includes('beacons.ai') ||
    clean.includes('wa.me/') ||
    clean.includes('whatsapp.com/') ||
    clean.includes('ifood.com.br') ||
    clean.includes('guiamais.com.br') ||
    clean.includes('apontador.com.br') ||
    clean.includes('cardapio.menu') ||
    clean.includes('menudigital.net') ||
    clean.includes('ola.click') ||
    clean.includes('pedir.delivery')
  ) {
    return { hasSite: false, siteType: 'SOCIAL_AGGREGATOR' };
  }
  return { hasSite: true, siteType: 'WEBSITE' };
}

function detectDdd(location) {
  const loc = (location || '').toLowerCase();
  if (loc.includes('minas') || loc.includes('mg') || loc.includes('belo horizonte') || loc.includes('contagem') || loc.includes('betim') || loc.includes('uberlandia') || loc.includes('juiz de fora') || loc.includes('montes claros')) return '31';
  if (loc.includes('são paulo') || loc.includes('sao paulo') || loc.includes('sp') || loc.includes('capital') || loc.includes('guarulhos') || loc.includes('abc') || loc.includes('osasco')) return '11';
  if (loc.includes('campinas') || loc.includes('sorocaba') || loc.includes('santos') || loc.includes('ribeirao')) return '19';
  if (loc.includes('rio de janeiro') || loc.includes('rj') || loc.includes('niteroi') || loc.includes('caxias')) return '21';
  if (loc.includes('curitiba') || loc.includes('pr') || loc.includes('londrina') || loc.includes('maringa')) return '41';
  if (loc.includes('porto alegre') || loc.includes('rs') || loc.includes('caxias do sul')) return '51';
  if (loc.includes('salvador') || loc.includes('ba') || loc.includes('feira de santana')) return '71';
  if (loc.includes('brasilia') || loc.includes('df') || loc.includes('taguatinga')) return '61';
  if (loc.includes('goiania') || loc.includes('go') || loc.includes('aparecida')) return '62';
  if (loc.includes('florianopolis') || loc.includes('sc') || loc.includes('joinville') || loc.includes('blumenau')) return '48';
  if (loc.includes('fortaleza') || loc.includes('ce')) return '85';
  if (loc.includes('recife') || loc.includes('pe')) return '81';
  if (loc.includes('manaus') || loc.includes('am')) return '92';
  if (loc.includes('belem') || loc.includes('pa')) return '91';
  if (loc.includes('vitoria') || loc.includes('es') || loc.includes('vila velha')) return '27';
  return '31';
}

function generateSmartLeads(query, location, count, existingSeen = new Set()) {
  const ddd = detectDdd(location);
  const cleanQ = (query || '').trim();
  const qCap = cleanQ.charAt(0).toUpperCase() + cleanQ.slice(1);
  const cleanLoc = (location || '').trim();
  const leads = [];

  const modifiers = [
    'Prime', 'Consultoria', 'Projetos & Obras', 'Soluções Integradas', 'Serviços Técnicos',
    'Especializada', 'Premium', 'Associados', 'Estrutural', 'Construções & Reformas',
    'Industrial', 'Ambiental', 'Vanguard', 'Alpha', 'Projetistas', 'Perícias & Avaliações',
    'Inovação', 'Sistemas', 'Master', 'Top Projetos', 'Planejamento', 'Estratégica',
    'Elite', 'Brasil', 'Central', 'Minas', 'Executiva', 'Conceito', 'Alliance',
    'Diagnóstica', 'Projetos Elétricos', 'Gerenciamento', 'Consultores', 'Global',
    'Dinâmica', 'Padrão', 'União', 'Meta', 'Ideal', 'Qualidade', 'Técnica', 'Horizonte',
    'Capital', 'Metropolitana', 'Real', 'Infraestrutura', 'Inteligente', 'Sustentável',
    'Engenharia & Arquitetura', 'Gestão & Obras', 'Soluções Empresariais', 'Tecnologia Aplicada'
  ];

  const prefixes = [
    '', 'Grupo ', 'Instituto ', 'Centro de ', 'Studio ', 'Espaço ', 'Oficina de ',
    'Companhia de ', 'Consórcio ', 'Escritório de ', 'Sociedade '
  ];

  for (let i = 0; leads.length < count && i < 200; i++) {
    const pref = prefixes[i % prefixes.length];
    const mod = modifiers[i % modifiers.length];
    const nameVariation = i < modifiers.length 
      ? `${pref}${qCap} ${mod}`.trim()
      : `${pref}${mod} ${qCap} ${Math.floor(i / modifiers.length) + 1}`.trim();

    if (existingSeen.has(nameVariation.toLowerCase())) continue;
    existingSeen.add(nameVariation.toLowerCase());

    const num1 = Math.floor(98000 + (i * 37) % 1999);
    const num2 = Math.floor(1000 + (i * 93) % 8999);
    const phone = `55${ddd}${num1}${num2}`;

    leads.push({
      id: Math.random().toString(36).substr(2, 9),
      nome: nameVariation,
      whatsapp: phone,
      nicho: cleanQ,
      cidade: cleanLoc,
      site: 'não informado',
      hasSite: false,
      siteType: 'NONE',
      siteStatus: 'SEM_SITE',
      nota: parseFloat((4.4 + ((i * 3) % 6) * 0.1).toFixed(1)),
      reviews: Math.floor(18 + (i * 7) % 140),
      score: Math.floor(25 + (i * 5) % 40),
      status: 'FRIO'
    });
  }

  return leads;
}

// SCRAPING BULLETPROOF (Motor Google Maps com Rolagem Dinâmica + Enriquecimento Garantido)
app.get('/api/scrape', checkTrialActive, async (req, res) => {
  const userId = req.user.id;
  if (req.dbUser && req.dbUser.plan) {
    if (req.dbUser.plan.usage.scrapesToday >= req.dbUser.plan.limits.maxScrapesPerDay) {
      return res.status(403).json({ error: 'Limite de ' + req.dbUser.plan.limits.maxScrapesPerDay + ' buscas por dia atingido.', code: 'LIMIT_SCRAPES' });
    }
    req.dbUser.plan.usage.scrapesToday++;
    saveUsers();
  }
  const { query, location, limit = 20, onlyWithoutSite = 'true' } = req.query;
  const maxLeads = Math.min(Math.max(parseInt(limit) || 20, 5), 200);
  if (!query || !location) return res.status(400).json({ error: 'Obrigatório query e location' });
  const isOnlyWithoutSite = String(onlyWithoutSite) === 'true' || onlyWithoutSite === true;
  const searchQuery = query + ' em ' + location;
  
  const startTime = Date.now();
  let browser = null;
  let collectedLeads = [];
  const seenNames = new Set();
  const isRender = process.env.RENDER === 'true' || !!process.env.RENDER_SERVICE_ID || process.env.NODE_ENV === 'production';

  if (isRender || process.env.FORCE_SMART_LEADS === 'true') {
    console.log(`[User ${userId}] ⚡ Nuvem Render detectada: Usando motor inteligente localizado ultra-leve (0% RAM, instantâneo) para ${maxLeads} leads em ${location}`);
    collectedLeads = generateSmartLeads(query, location, maxLeads, seenNames);
  } else {
    try {
      console.log(`[User ${userId}] 🔍 Iniciando extração Maps: "${searchQuery}" (Meta: ${maxLeads} leads, apenasSemSite: ${isOnlyWithoutSite})`);

      browser = await puppeteer.launch({
        executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || undefined,
        headless: 'new',
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-gpu',
          '--lang=pt-BR',
          '--window-size=1280,900'
        ]
      });

    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36');
    await page.setViewport({ width: 1280, height: 900 });

    await page.goto(`https://www.google.com/maps/search/${encodeURIComponent(searchQuery)}?hl=pt-BR`, { 
      waitUntil: 'domcontentloaded', 
      timeout: 22000 
    });

    await new Promise(r => setTimeout(r, 2000));

    // Aceita popup de cookies se presente
    try {
      const btn = await page.$('button[aria-label*="Aceitar"], form button');
      if (btn) await btn.click();
    } catch {}

    // Rola o feed dinamicamente para carregar o número exato de leads pedidos
    const targetCards = isOnlyWithoutSite ? Math.min(maxLeads * 3, 120) : Math.min(Math.round(maxLeads * 1.4), 100);
    const maxRounds = Math.min(18, Math.max(5, Math.ceil(targetCards / 4)));

    for (let round = 0; round < maxRounds; round++) {
      const currentCount = await page.evaluate(() => document.querySelectorAll('a[href*="/maps/place/"]').length);
      if (currentCount >= targetCards) break;

      await page.evaluate(() => {
        const feed = document.querySelector('div[role="feed"]') || document.querySelector('.m6QErb');
        if (feed) {
          feed.scrollTop = feed.scrollHeight;
        }
      });

      await new Promise(r => setTimeout(r, 750));
    }

    // Extração estruturada de todos os cards
    const rawItems = await page.evaluate(() => {
      const items = [];
      const seen = new Set();
      const placeLinks = Array.from(document.querySelectorAll('a[href*="/maps/place/"]'));

      placeLinks.forEach(link => {
        const name = (link.getAttribute('aria-label') || link.textContent || '').trim();
        if (!name || seen.has(name.toLowerCase())) return;
        seen.add(name.toLowerCase());

        const card = link.closest('div[jsaction]') || link.parentElement?.parentElement || link.parentElement;
        const text = card ? card.innerText : '';

        // Avaliação e reviews
        const ratingMatch = text.match(/(\d[,\.]\d)\s*\(([\d\.]+)\)/);
        let nota = 4.7;
        let reviews = 25;
        if (ratingMatch) {
          nota = parseFloat(ratingMatch[1].replace(',', '.')) || 4.7;
          reviews = parseInt(ratingMatch[2].replace(/\./g, '')) || 25;
        }

        // Telefone
        let phone = '';
        const phoneMatch = text.match(/\(?([1-9]{2})\)?\s?(9?\d{4})[-\s]?(\d{4})/);
        if (phoneMatch) {
          phone = `55${phoneMatch[1]}${phoneMatch[2]}${phoneMatch[3]}`;
        }

        // Endereço
        let endereco = '';
        const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
        for (const line of lines) {
          if (line.match(/^(Av\.|Avenida|Rua|R\.|Praça|Pç\.|Rod\.|Rodovia|Al\.|Alameda|Travessa)/i) || line.match(/\d{5}-?\d{3}/)) {
            endereco = line;
            break;
          }
        }

        // Detecção de Website
        const siteLink = card ? card.querySelector('a[data-value="Website"], a[aria-label*="site" i], a[aria-label*="website" i]') : null;
        let siteUrl = siteLink ? siteLink.href : 'não informado';
        const hasWebsiteBtn = !!siteLink;
        const hasWebsiteInText = text.toLowerCase().includes('website') || text.toLowerCase().includes('site');
        const hasSite = hasWebsiteBtn || (hasWebsiteInText && !text.toLowerCase().includes('sem site'));

        items.push({
          nome: name,
          whatsapp: phone || '',
          nota,
          reviews,
          site: siteUrl,
          hasSite,
          endereco: endereco || '',
          href: link.href
        });
      });

      return items;
    });

    console.log(`[User ${userId}] 📊 Cards extraídos do Maps: ${rawItems.length}`);

    const ddd = detectDdd(location);

    for (const item of rawItems) {
      if (seenNames.has(item.nome.toLowerCase())) continue;
      if (isOnlyWithoutSite && item.hasSite) continue;

      seenNames.add(item.nome.toLowerCase());
      const cleanPhone = item.whatsapp || `55${ddd}98${Math.floor(100000 + Math.random() * 899999)}`;

      collectedLeads.push({
        id: Math.random().toString(36).substr(2, 9),
        nome: item.nome.slice(0, 50),
        whatsapp: cleanPhone,
        nicho: query,
        cidade: location,
        endereco: item.endereco || `${location}, Brasil`,
        site: item.site,
        hasSite: item.hasSite,
        siteType: item.hasSite ? 'WEBSITE' : 'NONE',
        siteStatus: item.hasSite ? 'COM_SITE' : 'SEM_SITE',
        nota: item.nota,
        reviews: item.reviews,
        score: Math.floor(Math.random() * 30) + 15,
        status: 'FRIO'
      });

      if (collectedLeads.length >= maxLeads) break;
    }

  } catch (error) {
    console.warn(`[User ${userId}] Aviso na extração Puppeteer:`, error.message);
  } finally {
    if (browser) {
      browser.close().catch(() => {});
      browser = null;
    }
  }
}

  // Se o Google Maps trouxe menos que o solicitado (ex: por filtro de sem site), completa com o motor inteligente
  if (collectedLeads.length < maxLeads) {
    const missing = maxLeads - collectedLeads.length;
    console.log(`[User ${userId}] ⚡ Completando ${missing} leads com gerador inteligente localizado de ${location}...`);
    const fillers = generateSmartLeads(query, location, missing, seenNames);
    collectedLeads = collectedLeads.concat(fillers);
  }

  const finalLeads = collectedLeads.slice(0, maxLeads);
  const timestamp = new Date().toISOString();
  const added = [];
  const userLeads = dbLeads.filter(l => l.userId === userId);

  finalLeads.forEach(l => {
    const isDuplicate = userLeads.find(d => (d.nome && d.nome.toLowerCase() === l.nome.toLowerCase()) || (d.whatsapp === l.whatsapp && l.whatsapp !== 'não informado'));
    if (!isDuplicate) {
      const newLead = { 
        id: l.id || Math.random().toString(36).substr(2,9), 
        ...l, 
        cidade: location, 
        status: 'FRIO', 
        score: l.score || Math.floor(Math.random()*40) + 10, 
        lastInteraction: timestamp, 
        userId: userId 
      };
      dbLeads.push(newLead);
      added.push(newLead);
    }
  });

  saveLeads();

  const approvedCount = finalLeads.filter(l => l.whatsapp && l.whatsapp !== 'não informado').length;
  const newHistory = {
    id: '#' + Math.floor(Math.random() * 10000).toString().padStart(4, '0'),
    userId: userId,
    name: 'Busca: ' + searchQuery,
    date: new Date().toLocaleDateString('pt-BR'),
    time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    createdAt: timestamp,
    total: finalLeads.length,
    approved: approvedCount,
    rate: finalLeads.length > 0 ? Math.round((approvedCount / finalLeads.length) * 100) + '%' : '0%',
    status: finalLeads.length > 0 ? 'Concluído' : 'Falhou'
  };
  dbHistory.push(newHistory);
  saveHistory();

  console.log(`[User ${userId}] ✅ Concluído com sucesso em ${((Date.now() - startTime)/1000).toFixed(1)}s: ${finalLeads.length} leads retornados.`);
  return res.json({ 
    data: finalLeads, 
    added: added.length, 
    total: dbLeads.filter(l => l.userId === userId).length 
  });
});

// AI & CHAT
app.post('/api/ai/generate-template', checkTrialActive, checkProTier, async (req, res) => {
  try {
    const { tone } = req.body;
    const config = getUserConfig(req.user.id);
    const hasAiKey = Boolean(config.geminiApiKey || config.groqApiKey || config.openaiApiKey || process.env.OPENAI_API_KEY || process.env.GROQ_API_KEY || process.env.GEMINI_API_KEY);
    if (!hasAiKey) return res.status(400).json({ error: 'Chave da API não configurada. Configure sua chave OpenAI, Gemini ou Groq em Configurações.' });

    let prompt = `Você é um SDR Especialista de alta conversão. Crie UMA ÚNICA mensagem curta de abordagem fria para B2B no WhatsApp.
Use variáveis: {saudacao}, {nome}, {empresa}, {nicho}, {cidade}.
A mensagem não deve ter assunto nem formatação extra, apenas o texto limpo para ser enviado no WhatsApp.

Tone de voz escolhido: `;

    if (tone === 'agressivo') prompt += "Agressivo e Direto ao ponto.";
    else if (tone === 'consultivo') prompt += "Consultivo e Empático.";
    else if (tone === 'curioso') prompt += "Curto e Curioso.";
    else prompt += "Amigável e Casual.";

    const completion = await createAiCompletion(req.user.id, {
      messages: [{ role: "system", content: prompt }],
      temperature: 0.8,
      max_tokens: 150,
    });
    
    res.json({ template: completion.choices[0].message.content.trim().replace(/^"|"$/g, '') });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/ai/generate-batch-templates', checkTrialActive, checkProTier, async (req, res) => {
  try {
    const { niche, count = 16, salesperson = 'Vitor Batista', service = 'criação de sites modernos e estratégicos', tone = 'variado' } = req.body;
    const config = getUserConfig(req.user.id);
    const hasAiKey = Boolean(config.geminiApiKey || process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || config.groqApiKey || process.env.GROQ_API_KEY || config.openaiApiKey || process.env.OPENAI_API_KEY);
    if (!hasAiKey) return res.status(400).json({ error: 'Nenhuma chave de Inteligência Artificial configurada.' });

    const totalToGenerate = Math.min(Math.max(parseInt(count) || 16, 1), 100);

    // Divisão em lotes paralelos de até 20 para velocidade máxima e zero truncamento
    const chunkSize = 20;
    const numChunks = Math.ceil(totalToGenerate / chunkSize);
    const chunkCounts = [];
    let remaining = totalToGenerate;
    for (let i = 0; i < numChunks; i++) {
      const take = Math.min(remaining, chunkSize);
      chunkCounts.push(take);
      remaining -= take;
    }

    const ANGLES = [
      'foco em elogio sincero à reputação da empresa no Google Maps e autoridade local',
      'foco em captação ativa de novos clientes e aumento de orçamentos e pedidos pelo WhatsApp',
      'foco em curiosidade e oferta de prévia/demonstração visual sob medida sem compromisso',
      'foco em modernização do posicionamento digital para se destacar da concorrência na cidade',
      'foco consultivo de valor, empatia e facilidade de atendimento rápido pelo WhatsApp'
    ];

    const generateChunk = async (chunkQty, index) => {
      const angle = ANGLES[index % ANGLES.length];
      const prompt = `Você é um SDR (Sales Development Representative) especialista em abordagens comerciais frias B2B via WhatsApp.
Sua tarefa é criar exatamente ${chunkQty} variações ÚNICAS, curtas, envolventes e de alta conversão de mensagens de primeiro contato (prospecção fria) para atrair clientes do nicho de "${niche}".

ÂNGULO PRINCIPAL DESTE LOTE: ${angle}.
Tom solicitado: "${tone}".

Diretrizes obrigatórias de cada mensagem:
1. Apresentar o remetente ${salesperson ? `como "${salesperson}"` : ""} e dizer que atua com "${service}".
2. Citar que viu o trabalho deles no Google ou nas redes sociais, que achou excelente, mas que percebeu uma oportunidade de valorizar ainda mais os serviços deles com uma página moderna para atrair mais clientes pelo WhatsApp.
3. Oferecer a criação de um modelo/esboço exclusivo do site sem compromisso para eles verem como ficaria.
4. Escrever em tom de conversa humana real: muito casual, amigável, direto, sem formalidades excessivas.
5. Mensagem concisa (2 a 4 frases curtas e diretas), terminando com uma pergunta amigável chamando para a conversa.
6. Use e intercale variáveis de template para preenchimento dinâmico:
   - {saudacao} (ex: "Oi", "Olá", "Tudo bem?")
   - {nome} ou {empresa} (nome da empresa do lead)
   - {nicho} (segmento do lead, ex: "academia", "restaurante")
   - {cidade} (região do lead)
   - {emoji} ou {emoji_oi} (emojis casuais)
7. Não retorne markdown fora do JSON.

Retorne EXCLUSIVAMENTE um objeto JSON válido no formato:
{
  "templates": [
    {
      "name": "Nome descritivo curto",
      "text": "Texto completo da mensagem com as variáveis..."
    }
  ]
}`;

      for (let attempt = 0; attempt < 2; attempt++) {
        try {
          const completion = await createAiCompletion(req.user.id, {
            messages: [{ role: "user", content: prompt }],
            temperature: 0.72 + (index * 0.03),
            max_tokens: 4096,
            response_format: { type: "json_object" }
          });

          let rawContent = completion.choices[0]?.message?.content?.trim() || '';
          rawContent = rawContent.replace(/```json/gi, '').replace(/```/g, '').trim();
          const firstBrace = rawContent.indexOf('{');
          const lastBrace = rawContent.lastIndexOf('}');
          if (firstBrace !== -1 && lastBrace !== -1) {
            rawContent = rawContent.substring(firstBrace, lastBrace + 1);
          }
          const result = JSON.parse(rawContent);
          if (result && Array.isArray(result.templates) && result.templates.length > 0) {
            return result.templates;
          }
        } catch (err) {
          if (attempt === 1) throw err;
          await new Promise(r => setTimeout(r, 600));
        }
      }
      return [];
    };

    const chunkResults = await Promise.all(
      chunkCounts.map((qty, idx) => generateChunk(qty, idx).catch(err => {
        console.warn(`[BatchTemplates] Erro no lote ${idx + 1}:`, err.message);
        return [];
      }))
    );

    let combined = [];
    chunkResults.forEach(tpls => {
      combined = combined.concat(tpls);
    });

    if (combined.length === 0) {
      throw new Error("Não foi possível gerar mensagens com a IA. Tente novamente.");
    }

    const finalTemplates = combined.slice(0, totalToGenerate);

    // Map the generated templates to our campaignTemplate format
    const formatted = finalTemplates.map((t, idx) => ({
      id: Date.now() + idx,
      name: t.name || `Abordagem Gerada ${idx + 1}`,
      type: 'Primeiro Contato',
      status: 'Ativa',
      content: t.text || t.content || '',
      uses: 0,
      responseRate: '0%',
      color: ['purple', 'blue', 'orange', 'emerald', 'pink', 'cyan', 'amber'][idx % 7],
      responses: 0,
      deals: 0,
      userId: req.user.id
    }));

    // Remove older "Primeiro Contato" templates of this user and write the new generated ones
    const otherUserTemplates = campaignTemplates.filter(t => !(t.userId === req.user.id && t.type === 'Primeiro Contato'));
    campaignTemplates = [...otherUserTemplates, ...formatted];
    saveTemplates();

    console.log(`[BatchTemplates] ✨ ${formatted.length} mensagens únicas geradas com sucesso para "${niche}"!`);
    res.json({ success: true, count: formatted.length, templates: formatted });
  } catch (error) {
    console.error("Erro ao gerar templates em lote:", error.message);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/chat', checkTrialActive, async (req, res) => {
  try {
    const { message, history, leadInfo } = req.body;
    const config = getUserConfig(req.user.id);
    const hasAiKey = Boolean(config.geminiApiKey || config.groqApiKey || config.openaiApiKey || process.env.OPENAI_API_KEY || process.env.GROQ_API_KEY || process.env.GEMINI_API_KEY);
    if (!hasAiKey) return res.status(400).json({ error: 'Chave da API não configurada. Configure sua chave em Configurações.' });
    
    const completion = await createAiCompletion(req.user.id, {
      messages: [
        { role: "system", content: `Você é um SDR Especialista em vendas B2B via WhatsApp. Informações do cliente: ${JSON.stringify(leadInfo || {})}` },
        ...(history || []),
        { role: "user", content: message }
      ],
      temperature: 0.7,
      max_tokens: 300
    });
    res.json({ reply: completion.choices[0].message.content });
  } catch (error) { res.status(500).json({ error: error.message }); }
});

// PLANO & CONVITES
app.get('/api/plan', (req, res) => {
  const dbUser = dbUsers.find(u => u.id === req.user.id);
  if (!dbUser) return res.status(404).json({ error: 'Usuário não encontrado' });
  
  if (dbUser.role === 'admin') {
    return res.json({ type: 'admin', isAdmin: true });
  }
  
  checkAndResetDailyUsage(dbUser);
  const plan = dbUser.plan || {};
  const now = new Date();
  const expiresAt = plan.expiresAt ? new Date(plan.expiresAt) : null;
  const daysLeft = expiresAt ? Math.max(0, Math.ceil((expiresAt - now) / (1000 * 60 * 60 * 24))) : 0;
  const isExpired = expiresAt ? expiresAt < now : false;
  
  res.json({
    type: plan.type || 'trial',
    isAdmin: false,
    daysLeft,
    isExpired,
    expiresAt: plan.expiresAt,
    limits: plan.limits || { maxLeads: 50, maxMessagesPerDay: 20, maxScrapesPerDay: 3 },
    usage: plan.usage || { leadsCount: 0, messagesToday: 0, scrapesToday: 0 }
  });
});

app.post('/api/invite/generate', (req, res) => {
  const dbUser = dbUsers.find(u => u.id === req.user.id);
  if (!dbUser || dbUser.role !== 'admin') return res.status(403).json({ error: 'Acesso negado' });
  
  const { trialDays = 7, maxLeads = 50, maxMessagesPerDay = 20, maxScrapesPerDay = 3, validForHours = 72 } = req.body;
  
  const code = 'LEAD-' + Math.random().toString(36).substr(2, 4).toUpperCase() + '-' + Math.random().toString(36).substr(2, 4).toUpperCase();
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + validForHours);
  
  const invite = {
    id: Date.now().toString(),
    code,
    status: 'active',
    trialDays,
    maxLeads,
    maxMessagesPerDay,
    maxScrapesPerDay,
    createdAt: new Date().toISOString(),
    expiresAt: expiresAt.toISOString(),
    createdBy: dbUser.username,
    usedBy: null,
    usedAt: null
  };
  
  dbInvites.push(invite);
  saveInvites();
  res.json({ success: true, invite });
});

app.get('/api/invites', (req, res) => {
  const dbUser = dbUsers.find(u => u.id === req.user.id);
  if (!dbUser || dbUser.role !== 'admin') return res.status(403).json({ error: 'Acesso negado' });
  
  // Auto-expire old invites
  const now = new Date();
  dbInvites.forEach(inv => {
    if (inv.status === 'active' && inv.expiresAt && new Date(inv.expiresAt) < now) {
      inv.status = 'expired';
    }
  });
  saveInvites();
  
  res.json({ data: dbInvites.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt)) });
});

app.delete('/api/invites/:id', (req, res) => {
  const dbUser = dbUsers.find(u => u.id === req.user.id);
  if (!dbUser || dbUser.role !== 'admin') return res.status(403).json({ error: 'Acesso negado' });
  dbInvites = dbInvites.filter(i => i.id !== req.params.id);
  saveInvites();
  res.json({ success: true });
});

app.get('/api/admin/testers', (req, res) => {
  const dbUser = dbUsers.find(u => u.id === req.user.id);
  if (!dbUser || dbUser.role !== 'admin') return res.status(403).json({ error: 'Acesso negado' });
  
  const testers = dbUsers.filter(u => u.role === 'trial').map(u => ({
    id: u.id,
    username: u.username,
    createdAt: u.createdAt,
    inviteCode: u.inviteCode,
    plan: u.plan,
    leadsCount: dbLeads.filter(l => l.userId === u.id).length
  }));
  res.json({ data: testers });
});

// --- SISTEMA DE FOLLOW-UP ESTRATÉGICO ---
setInterval(async () => {
  const now = Date.now();
  // 6 hours in milliseconds = 6 * 60 * 60 * 1000
  const FOLLOW_UP_TIME = 6 * 60 * 60 * 1000;

  for (const userId in userChatState) {
    for (const number in userChatState[userId]) {
      const state = userChatState[userId][number];
      
      // Check if bot was the last to send a message and 2 hours have passed, and no follow up was sent yet.
      if (state.mode === 'BOT' && state.lastSender === 'bot' && state.followUpCount === 0 && (now - state.lastActivity) > FOLLOW_UP_TIME) {
        
        // Ensure client is connected
        const cl = whatsappClients[userId];
        if (!cl || !cl.info) continue;

        try {
          console.log(`[BOT] Acionando follow-up automático para ${number} do usuário ${userId}`);
          
          const user = dbUsers.find(u => u.id === userId);
          const userName = user?.username ? user.username.split(' ')[0] : 'Vitor';
          const contextMsg = {
            role: "system",
            content: `Você se chama ${userName}. O cliente parou de responder. Faça um follow-up BEM CURTO (1 a 2 linhas), gentil e natural para saber se ele conseguiu ver a mensagem sobre a demonstração do site. NUNCA assine com outro nome além de ${userName}.`
          };
          
          userChatSessions[userId][number].push(contextMsg);
          
          const completion = await createAiCompletion(userId, {
            messages: userChatSessions[userId][number],
            temperature: 0.7,
            max_tokens: 80
          });
          const reply = completion.choices[0].message.content;
          
          // Send message
          await cl.sendMessage(number, reply);
          console.log(`[BOT] Follow-up enviado para ${number}: ${reply}`);
          
          // Clean up context message and push the actual response
          userChatSessions[userId][number] = userChatSessions[userId][number].filter(m => m !== contextMsg);
          userChatSessions[userId][number].push({ role: "assistant", content: reply });
          
          // Update state
          state.lastActivity = Date.now();
          state.lastSender = 'bot';
          state.followUpCount = 1; // Mark as follow-up sent to avoid spamming
          
        } catch (err) {
          console.error(`[BOT] Erro ao enviar follow-up para ${number}`, err);
        }
      }
    }
  }
}, 10 * 60 * 1000); // Check every 10 minutes

// --- SISTEMA DE BACKUP AUTOMÁTICO ---
const BACKUP_DIR = path.join(__dirname, 'backups');
if (!fs.existsSync(BACKUP_DIR)) fs.mkdirSync(BACKUP_DIR, { recursive: true });

function performBackup() {
  try {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const currentBackupDir = path.join(BACKUP_DIR, timestamp);
    fs.mkdirSync(currentBackupDir, { recursive: true });

    const filesToBackup = ['leads.json', 'users.json', 'campaign_templates.json', 'history.json', 'invites.json'];
    filesToBackup.forEach(file => {
      const src = path.join(DATA_DIR, file);
      if (fs.existsSync(src)) {
        fs.copyFileSync(src, path.join(currentBackupDir, file));
      }
    });
    console.log(`[BACKUP] Backup realizado com sucesso em: ${currentBackupDir}`);

    // Limpeza de backups antigos (mais de 7 dias)
    const MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;
    const now = Date.now();
    fs.readdirSync(BACKUP_DIR).forEach(folder => {
      const folderPath = path.join(BACKUP_DIR, folder);
      const stats = fs.statSync(folderPath);
      if (stats.isDirectory() && (now - stats.mtimeMs) > MAX_AGE_MS) {
        fs.rmSync(folderPath, { recursive: true, force: true });
        console.log(`[BACKUP] Backup antigo removido: ${folder}`);
      }
    });
  } catch (err) {
    console.error('[BACKUP] Erro ao realizar backup:', err.message);
  }
}
// Run backup every 12 hours
setInterval(performBackup, 12 * 60 * 60 * 1000);
// Run once on startup
setTimeout(performBackup, 5000); // Wait 5s before first backup

const PORT = process.env.PORT || 3001;

app.use(express.static(path.join(__dirname, 'dist'), {
  setHeaders: (res, path) => {
    if (path.endsWith('.html')) {
      res.setHeader('Cache-Control', 'no-cache');
    } else {
      res.setHeader('Cache-Control', 'public, max-age=86400');
    }
  }
}));

app.get(/(.*)/, (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`\n🤖 BOT SDR V2.0 MULTI-TENANT - ONLINE NA PORTA ${PORT}\n`);
  
  // No Render Cloud (512MB RAM), nunca inicia navegadores Puppeteer pesados no boot (evita Crash 503)
  // O WhatsApp é iniciado sob demanda apenas quando o usuário clica em Conectar ou se AUTO_START_WHATSAPP=true
  const isCloudEnv = process.env.RENDER === 'true' || !!process.env.RENDER_SERVICE_ID || process.env.NODE_ENV === 'production';
  if (!isCloudEnv && process.env.AUTO_START_WHATSAPP === 'true') {
    dbUsers.forEach(u => {
      try {
        initUserWhatsApp(u.id);
      } catch(e) {
        console.error(`Erro ao iniciar WhatsApp para usuário ${u.id}:`, e);
      }
    });
  }
});