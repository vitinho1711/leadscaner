import express from 'express';
import { buildSitePrompt } from './sitePromptBuilder.js';
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

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const { Client, LocalAuth } = pkg;
dotenv.config();

process.on('uncaughtException', (err) => { console.error('⚠️ Erro não capturado:', err.message); });
process.on('unhandledRejection', (reason) => { console.error('⚠️ Promise rejeitada:', reason?.message || reason); });

const DATA_DIR = process.env.DATA_DIR || __dirname;
if (DATA_DIR !== __dirname && !fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

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

const HISTORY_FILE = path.join(DATA_DIR, 'history.json');
let dbHistory = [];
try { if (fs.existsSync(HISTORY_FILE)) dbHistory = JSON.parse(fs.readFileSync(HISTORY_FILE, 'utf-8')); } catch (e) { }
function saveHistory() { try { fs.writeFileSync(HISTORY_FILE, JSON.stringify(dbHistory, null, 2), 'utf-8'); } catch (e) { } }

const INVITES_FILE = path.join(DATA_DIR, 'invites.json');
let dbInvites = [];
try { if (fs.existsSync(INVITES_FILE)) dbInvites = JSON.parse(fs.readFileSync(INVITES_FILE, 'utf-8')); } catch (e) { }
function saveInvites() { try { fs.writeFileSync(INVITES_FILE, JSON.stringify(dbInvites, null, 2), 'utf-8'); } catch (e) { } }

const JWT_SECRET = process.env.JWT_SECRET || 'leadscanner_super_secret_key_2026';

const app = express();
app.use(cors());
app.use(express.json());

// --- AUTENTICAÇÃO ---
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  const user = dbUsers.find(u => u.username === username);
  if (!user) return res.status(401).json({ error: 'Usuário ou senha inválidos' });
  if (!bcrypt.compareSync(password, user.password)) return res.status(401).json({ error: 'Usuário ou senha inválidos' });
  const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
  res.json({ success: true, token, user: { username: user.username, role: user.role } });
});

app.post('/api/auth/register', (req, res) => {
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
  
  const token = jwt.sign({ id: newUser.id, username: newUser.username, role: newUser.role }, JWT_SECRET, { expiresIn: '7d' });
  res.json({ success: true, token, user: { username: newUser.username, role: newUser.role } });
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

// MIDDLEWARE PROTEÇÃO
app.use('/api', (req, res, next) => {
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
  const dbUser = dbUsers.find(u => u.id === req.user.id);
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

// ESTADOS MULTI-TENANT
const whatsappClients = {};
const userWhatsappStatus = {};
const userQrCodes = {};
const userReconnectAttempts = {};
const userChatSessions = {};

const campaignStates = {};
const autoSendEnabled = {};
const autoSendRunning = {};
const autoSendStats = {};

function getUserConfig(userId) {
  const user = dbUsers.find(u => u.id === userId);
  if (!user.config) {
    user.config = { groqApiKey: '', enableAutoResponder: true };
    saveUsers();
  }
  
  // Create a copy of config to avoid modifying the database directly
  const config = { ...user.config };
  
  // Fallback to environment variable if user hasn't set their own key
  if (!config.groqApiKey && process.env.GROQ_API_KEY) {
    config.groqApiKey = process.env.GROQ_API_KEY;
  }
  
  return config;
}

function getOpenAIInstance(userId) {
  const config = getUserConfig(userId);
  return new OpenAI({
    apiKey: config.groqApiKey || 'dummy_key',
    baseURL: 'https://api.groq.com/openai/v1'
  });
}

// WHATSAPP INIT POR USUÁRIO
const AUTH_DIR = path.join(os.homedir(), '.sdr_wwebjs_auth');

async function cleanSessionSafely(userId) {
  const sessionDir = path.join(AUTH_DIR, `session-${userId}`);
  try {
    if (fs.existsSync(sessionDir)) {
      // The previous logic of deleting just some files left corrupted state
      // Removing the whole directory is the correct way to reset local auth
      fs.rmSync(sessionDir, { recursive: true, force: true });
    }
  } catch(e) {
    console.error(`Erro ao limpar sessão do usuário ${userId}:`, e);
  }
}

async function initUserWhatsApp(userId) {
  if (whatsappClients[userId]) return;
  await cleanSessionSafely(userId);
  
  const client = new Client({
    authStrategy: new LocalAuth({ clientId: userId, dataPath: AUTH_DIR }),
    puppeteer: { 
      headless: true, 
      args: [
        '--no-sandbox', 
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--disable-gpu'
      ] 
    }
  });
  
  whatsappClients[userId] = client;
  userWhatsappStatus[userId] = 'DISCONNECTED';
  userQrCodes[userId] = null;
  userReconnectAttempts[userId] = 0;
  userChatSessions[userId] = {};

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
      const config = getUserConfig(userId);
      if (!config.enableAutoResponder) return;
      if (!msg.from.endsWith('@c.us') || msg.isStatus) return;
      
      const senderNumber = msg.from.replace('@c.us', '');
      const userLeads = dbLeads.filter(l => l.userId === userId);
      const leadMatch = userLeads.find(l => {
        if (!l.whatsapp) return false;
        const cleanNum = String(l.whatsapp).replace(/\D/g, '');
        return senderNumber.includes(cleanNum) || cleanNum.includes(senderNumber);
      });
      if (!leadMatch) return;
      
      const contact = await msg.getContact();
      if (contact.isMyContact) return;

      if (!userChatSessions[userId][msg.from]) {
        userChatSessions[userId][msg.from] = [{
          role: "system",
          content: `Você é um SDR profissional especializado em prospecção de empresas para criação de sites premium.

Seu objetivo é:
* iniciar conversas naturais
* gerar interesse
* descobrir dores da empresa
* qualificar o lead
* levar a conversa até o agendamento

Regras:
* fale de forma humana
* mensagens curtas
* não pareça robô
* nunca envie textos gigantes
* use perguntas para continuar a conversa
* seja persuasivo sem parecer insistente

Quando o cliente disser:
"não tenho interesse"
Responda mostrando que hoje empresas perdem clientes por não terem presença profissional online.

Quando o cliente perguntar preço:
Nunca dê preço direto antes de entender o negócio.

Seu foco é marcar uma apresentação.

Você vende:
* sites premium
* estrutura de conversão
* automação
* posicionamento digital
* integração WhatsApp
* captação de clientes

---
CONTEXTO DO LEAD:
Nome: ${leadMatch.nome || 'Não informado'}
Nicho/Área: ${leadMatch.nicho || 'Não informado'}

REGRA IMPORTANTE: Se a mensagem do lead parecer um robô de autoatendimento com menu numérico (ex: "Digite 1 para X"), responda APENAS com o número que leva ao setor comercial, atendimento ou gerência. Se for mensagem de ausência, mande uma abordagem amigável pedindo para falar com o responsável.`
        }];
      }
      userChatSessions[userId][msg.from].push({ role: "user", content: msg.body });
      if (userChatSessions[userId][msg.from].length > 15) {
        userChatSessions[userId][msg.from] = [userChatSessions[userId][msg.from][0], ...userChatSessions[userId][msg.from].slice(-10)];
      }
      
      const chat = await msg.getChat();
      await chat.sendStateTyping();

      const openai = getOpenAIInstance(userId);
      const completion = await openai.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: userChatSessions[userId][msg.from],
        temperature: 0.7, max_tokens: 150,
      });
      const reply = completion.choices[0].message.content;
      userChatSessions[userId][msg.from].push({ role: "assistant", content: reply });
      await msg.reply(reply);
    } catch (error) {
      console.error('[Bot Error]', error);
    }
  });

  client.initialize().catch((err)=>{ console.error('[Bot Error] Falha na inicialização do WhatsApp:', err); });
}

async function autoReconnect(userId) {
  if (userWhatsappStatus[userId] === 'CONNECTED') return;
  userReconnectAttempts[userId]++;
  if (userReconnectAttempts[userId] > 5) { userReconnectAttempts[userId] = 0; return; }
  try { 
    await cleanSessionSafely(userId); 
    if (whatsappClients[userId]) await whatsappClients[userId].initialize(); 
    userReconnectAttempts[userId] = 0; 
  }
  catch (err) { setTimeout(() => autoReconnect(userId), Math.min(userReconnectAttempts[userId] * 10, 60) * 1000); }
}

// ENDPOINTS WHATSAPP
app.get('/api/whatsapp/status', checkTrialActive, (req, res) => {
  const userId = req.user.id;
  if (!whatsappClients[userId]) {
    initUserWhatsApp(userId);
  }
  res.json({ status: userWhatsappStatus[userId] || 'STARTING', qr: userQrCodes[userId] || null });
});

app.post('/api/whatsapp/reconnect', checkTrialActive, async (req, res) => {
  const userId = req.user.id;
  if (userWhatsappStatus[userId] === 'CONNECTED') return res.json({ success: true, message: 'Já conectado!' });
  res.json({ success: true, message: 'Reconexão iniciada.' });
  try { await cleanSessionSafely(userId); if(whatsappClients[userId]) await whatsappClients[userId].initialize(); } catch (err) {}
});

// CONFIGURAÇÕES
app.get('/api/config', checkTrialActive, (req, res) => {
  res.json(getUserConfig(req.user.id));
});

app.post('/api/config', checkTrialActive, (req, res) => {
  const { groqApiKey, autoResponder } = req.body;
  const user = dbUsers.find(u => u.id === req.user.id);
  if (!user.config) user.config = { groqApiKey: '', enableAutoResponder: true };
  
  if (groqApiKey !== undefined) user.config.groqApiKey = groqApiKey;
  if (autoResponder !== undefined) user.config.enableAutoResponder = !!autoResponder;
  
  saveUsers();
  res.json({ success: true });
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
    const openai = getOpenAIInstance(userId);
    const completion = await openai.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
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
app.get('/api/leads', checkTrialActive, (req, res) => {
  res.json({ data: dbLeads.filter(l => l.userId === req.user.id) });
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

app.post('/api/autosend/toggle', checkTrialActive, (req, res) => {
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
          content: `Você é um SDR. Qualifique o lead de forma curta e natural. Lead: ${pending.nome || 'Não informado'} - ${pending.nicho || 'Não informado'}. REGRA IMPORTANTE: Se a mensagem do lead parecer um robô de autoatendimento com menu numérico (ex: "Digite 1 para X"), responda APENAS com o número que leva ao setor comercial, atendimento ou gerência. Se for mensagem de ausência, mande uma abordagem amigável pedindo para falar com o responsável.`
        }];
      }
      userChatSessions[userId][contactId._serialized].push({ role: "assistant", content: msg });
      
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

app.post('/api/whatsapp/campaign/stop', checkTrialActive, (req, res) => { 
  if (campaignStates[req.user.id]) campaignStates[req.user.id].shouldStop = true; 
  res.json({ success: true }); 
});

app.post('/api/whatsapp/campaign/start', checkTrialActive, async (req, res) => {
  const userId = req.user.id;
  if (userWhatsappStatus[userId] !== 'CONNECTED') return res.status(400).json({ error: 'WhatsApp não conectado' });
  if (campaignStates[userId]?.isRunning) return res.status(400).json({ error: 'Campanha já rodando' });
  
  // Check message limit for trial users
  if (req.dbUser && req.dbUser.plan) {
    if (req.dbUser.plan.usage.messagesToday >= req.dbUser.plan.limits.maxMessagesPerDay) {
      return res.status(403).json({ error: `Limite de ${req.dbUser.plan.limits.maxMessagesPerDay} mensagens por dia atingido.`, code: 'LIMIT_MESSAGES' });
    }
  }
  
  const { leads, templates, delayMin=45, delayMax=120, batchSize=15, batchPause=600 } = req.body;
  if (!leads?.length || !templates?.length) return res.status(400).json({ error: 'Dados inválidos' });
  
  campaignStates[userId] = { isRunning: true, total: leads.length, sent: 0, failed: 0, skipped: 0, errors: [], actionLog: [], currentLead: null, shouldStop: false, startedAt: new Date().toISOString() };
  processCampaign(userId, leads, templates, delayMin, delayMax, batchSize, batchPause);
  res.json({ success: true });
});

async function processCampaign(userId, leads, templates, delayMin, delayMax, batchSize, batchPause) {
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
      await client.sendMessage(contactId._serialized, message);
      
      if (!userChatSessions[userId]) userChatSessions[userId] = {};
      if (!userChatSessions[userId][contactId._serialized]) {
        userChatSessions[userId][contactId._serialized] = [{
          role: "system",
          content: `Você é um SDR. Qualifique o lead de forma curta e natural. Lead: ${lead.nome || 'Não informado'} - ${lead.nicho || 'Não informado'}. REGRA IMPORTANTE: Se a mensagem do lead parecer um robô de autoatendimento com menu numérico (ex: "Digite 1 para X"), responda APENAS com o número que leva ao setor comercial, atendimento ou gerência. Se for mensagem de ausência, mande uma abordagem amigável pedindo para falar com o responsável.`
        }];
      }
      userChatSessions[userId][contactId._serialized].push({ role: "assistant", content: message });
      
      const dbLead = dbLeads.find(l => l.id === lead.id);
      if (dbLead) {
        dbLead.messageSent = true;
        dbLead.messageSentAt = new Date().toISOString();
        dbLead.messageStatus = 'ENVIADO';
        dbLead.status = 'CHAMADO';
        dbLead.lastInteraction = dbLead.messageSentAt;
        saveLeads();
      }
      // Increment daily message count for trial users
      const campaignUser = dbUsers.find(u => u.id === userId);
      if (campaignUser && campaignUser.plan && campaignUser.plan.usage) { campaignUser.plan.usage.messagesToday++; saveUsers(); }

      state.sent++;
      state.actionLog.unshift({ lead: lead.nome, status: 'Enviada', time: new Date().toLocaleTimeString() });
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
app.post('/api/whatsapp/templates', checkTrialActive, (req, res) => { 
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

// SCRAPING
app.get('/api/scrape', checkTrialActive, async (req, res) => {
  const userId = req.user.id;
  // Check scrape limit for trial users
  if (req.dbUser && req.dbUser.plan) {
    if (req.dbUser.plan.usage.scrapesToday >= req.dbUser.plan.limits.maxScrapesPerDay) {
      return res.status(403).json({ error: `Limite de ${req.dbUser.plan.limits.maxScrapesPerDay} buscas por dia atingido.`, code: 'LIMIT_SCRAPES' });
    }
    req.dbUser.plan.usage.scrapesToday++;
    saveUsers();
  }
  const { query, location, limit = 100 } = req.query;
  const maxLeads = Math.min(parseInt(limit) || 100, 500);
  if (!query || !location) return res.status(400).json({ error: 'Obrigatório query e location' });
  const searchQuery = `${query} em ${location}`;
  let browser;
  try {
    console.log(`[User ${userId}] 🔍 Iniciando scraping: "${searchQuery}" (limite: ${maxLeads})`);
    browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-notifications', '--disable-geolocation', '--lang=pt-BR', '--disable-blink-features=AutomationControlled']
    });
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
    await page.setViewport({ width: 1280, height: 900 });
    await page.setExtraHTTPHeaders({ 'Accept-Language': 'pt-BR,pt;q=0.9,en;q=0.8' });

    await page.goto(`https://www.google.com/maps/search/${encodeURIComponent(searchQuery)}`, { waitUntil: 'domcontentloaded', timeout: 90000 });
    await new Promise(r => setTimeout(r, 5000));

    try {
      const consentSelectors = ['button[aria-label*="Aceitar"]', 'button[aria-label*="Accept"]', 'form[action*="consent"] button', 'button[jsname="b3VHJd"]', '[data-consent-set]', 'button.VfPpkd-LgbsSe'];
      for (const sel of consentSelectors) {
        const btn = await page.$(sel);
        if (btn) { await btn.click(); await new Promise(r => setTimeout(r, 3000)); break; }
      }
    } catch {}

    try { await page.waitForSelector('div[role="feed"]', { timeout: 30000 }); } 
    catch {
      try { await page.waitForSelector('a[href*="/maps/place/"]', { timeout: 15000 }); } 
      catch {
        await page.goto(`https://www.google.com/maps/search/${encodeURIComponent(searchQuery)}`, { waitUntil: 'domcontentloaded', timeout: 90000 });
        await new Promise(r => setTimeout(r, 8000));
        try { await page.waitForSelector('div[role="feed"]', { timeout: 20000 }); } catch {}
      }
    }
    
    let previousCount = 0; let sameCountRounds = 0;
    while (sameCountRounds < 5) {
      await page.evaluate(() => {
        const feed = document.querySelector('div[role="feed"]') || document.querySelector('div.m6QErb.DxyBCb') || document.querySelector('div.m6QErb');
        if (feed) feed.scrollTop = feed.scrollHeight;
      });
      await new Promise(r => setTimeout(r, 2000));
      const currentCount = await page.evaluate(() => document.querySelectorAll('a[href*="/maps/place/"]').length);
      if (currentCount === previousCount) sameCountRounds++; else sameCountRounds = 0;
      previousCount = currentCount;
      const endOfList = await page.evaluate(() => {
        for (const s of document.querySelectorAll('span, p')) {
          const t = (s.textContent || '').toLowerCase();
          if (t.includes('final da lista') || t.includes('end of') || t.includes('não há mais resultados')) return true;
        }
        return false;
      });
      if (endOfList || currentCount >= maxLeads) break;
    }
    
    const hrefs = await page.evaluate((maxResults) => {
      const results = []; const seenLinks = new Set();
      document.querySelectorAll('a[href*="/maps/place/"]').forEach(link => {
        if (results.length >= maxResults) return;
        if (!seenLinks.has(link.href)) {
           seenLinks.add(link.href);
           results.push(link.href);
        }
      });
      return results;
    }, maxLeads);

    let leads = [];
    const batchSize = 2;
    for (let i = 0; i < hrefs.length; i += batchSize) {
      const batch = hrefs.slice(i, i + batchSize);
      const promises = batch.map(async (href) => {
        let p;
        try {
          p = await browser.newPage();
          await p.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
          await p.goto(href, { waitUntil: 'domcontentloaded', timeout: 20000 });
          await new Promise(r => setTimeout(r, 1500));

          const extracted = await p.evaluate(() => {
            const getTitle = () => document.querySelector('h1')?.textContent?.trim() || '';
            const getRating = () => {
               const r = document.querySelector('div.F7nice')?.textContent || '';
               const m = r.match(/([\d,.]+)/);
               return m ? parseFloat(m[0].replace(',', '.')) : 0;
            };
            const getReviews = () => {
               const text = document.querySelector('div.F7nice')?.textContent || '';
               const m = text.match(/\(([\d,.]+)\)/);
               return m ? parseInt(m[1].replace(/[^\d]/g, '')) : 0;
            };
            const getCategory = () => document.querySelector('button.DkEaL')?.textContent?.trim() || '';
            const getPhone = () => {
               const phoneBtn = document.querySelector('button[data-tooltip*="telefone"], button[data-item-id^="phone:tel:"]');
               if (phoneBtn) {
                   const text = phoneBtn.textContent || phoneBtn.getAttribute('aria-label') || '';
                   const match = text.match(/\(?\d{2}\)?\s?\d{4,5}[-\s]?\d{4}/);
                   if (match) return match[0];
               }
               const match = document.body.innerText.match(/\(?\d{2}\)?\s?\d{4,5}[-\s]?\d{4}/);
               return match ? match[0] : 'n\u00E3o informado';
            };
            const getSite = () => {
               const siteBtn = document.querySelector('a[data-item-id^="authority:"]');
               return siteBtn ? siteBtn.href : 'n\u00E3o informado';
            };

            let phone = getPhone().replace(/[^\d+]/g, '');
            if (phone.length === 10 || phone.length === 11) phone = '55' + phone;

            return {
               nome: getTitle(),
               nicho: getCategory() || 'Extra\u00EDdo',
               whatsapp: phone,
               nota: getRating(),
               reviews: getReviews(),
               site: getSite()
            };
          });

          return extracted;
        } catch (e) {
          return null;
        } finally {
          if (p) {
            try { await p.close(); } catch {}
          }
        }
      });

      const results = await Promise.all(promises);
      results.forEach(r => {
        if (r && r.nome && r.nome !== 'Sem Nome') {
          leads.push({ ...r, cidade: '' });
        }
      });
    }

    try { await browser.close(); browser = null; } catch {}
    
    const timestamp = new Date().toISOString();
    const added = [];
    const userLeads = dbLeads.filter(l => l.userId === userId);
    
    leads.forEach(l => {
      const isDuplicate = userLeads.find(d => d.nome === l.nome || (d.whatsapp === l.whatsapp && l.whatsapp !== 'não informado'));
      if (!isDuplicate) {
        const newLead = { id: Math.random().toString(36).substr(2,9), ...l, cidade: location, status: 'FRIO', score: Math.floor(Math.random()*40), lastInteraction: timestamp, userId: userId };
        dbLeads.push(newLead);
        added.push(newLead);
      }
    });
    const finalLeads = leads.map(l => {
      const existing = userLeads.find(d => d.nome === l.nome || (d.whatsapp === l.whatsapp && l.whatsapp !== 'não informado'));
      if (existing) return existing;
      const newlyAdded = added.find(d => d.nome === l.nome);
      return newlyAdded || l;
    });
    saveLeads();
    
    // Salvar no histórico
    const approvedCount = added.filter(l => l.whatsapp && l.whatsapp !== 'não informado').length;
    const newHistory = {
      id: '#' + Math.floor(Math.random() * 10000).toString().padStart(4, '0'),
      userId: userId,
      name: `Busca: ${searchQuery}`,
      date: new Date().toLocaleDateString('pt-BR'),
      time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      createdAt: timestamp,
      total: leads.length,
      approved: approvedCount,
      rate: leads.length > 0 ? Math.round((approvedCount / leads.length) * 100) + '%' : '0%',
      status: leads.length > 0 ? 'Concluído' : 'Falhou'
    };
    dbHistory.push(newHistory);
    saveHistory();

    if (autoSendEnabled[userId] && !autoSendRunning[userId] && added.some(l => l.whatsapp !== 'não informado')) startAutoSendLoop(userId);
    res.json({ data: finalLeads, added: added.length, total: dbLeads.filter(l => l.userId === userId).length });
  } catch (error) {
    if (browser) try { await browser.close(); } catch {}
    res.status(500).json({ error: error.message });
  }
});

// AI & CHAT
app.post('/api/ai/generate-template', checkTrialActive, async (req, res) => {
  try {
    const { tone } = req.body;
    const config = getUserConfig(req.user.id);
    if (!config.groqApiKey) return res.status(400).json({ error: 'Chave da API não configurada.' });

    let prompt = `Você é um SDR Especialista de alta conversão. Crie UMA ÚNICA mensagem curta de abordagem fria para B2B no WhatsApp.
Use variáveis: {saudacao}, {nome}, {empresa}, {nicho}, {cidade}.
A mensagem não deve ter assunto nem formatação extra, apenas o texto limpo para ser enviado no WhatsApp.

Tone de voz escolhido: `;

    if (tone === 'agressivo') prompt += "Agressivo e Direto ao ponto.";
    else if (tone === 'consultivo') prompt += "Consultivo e Empático.";
    else if (tone === 'curioso') prompt += "Curto e Curioso.";
    else prompt += "Amigável e Casual.";

    const openai = getOpenAIInstance(req.user.id);
    const completion = await openai.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "system", content: prompt }],
      temperature: 0.8,
      max_tokens: 150,
    });
    
    res.json({ template: completion.choices[0].message.content.trim().replace(/^"|"$/g, '') });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/ai/generate-batch-templates', checkTrialActive, async (req, res) => {
  try {
    const { niche, count = 16, salesperson = 'Vitor Batista', service = 'criação de sites modernos e estratégicos', tone = 'variado' } = req.body;
    const config = getUserConfig(req.user.id);
    if (!config.groqApiKey) return res.status(400).json({ error: 'Chave da API não configurada.' });

    const totalToGenerate = Math.min(Math.max(parseInt(count) || 16, 1), 50);

    const prompt = `Você é um SDR (Sales Development Representative) especialista em abordagens comerciais frias B2B via WhatsApp.
Sua tarefa é criar exatamente ${totalToGenerate} variações ÚNICAS, curtas e de alta conversão de mensagens de primeiro contato (prospecção fria) para atrair clientes do nicho de "${niche}".

Diretrizes obrigatórias de cada mensagem:
1. Apresentar o remetente ${salesperson ? `como "${salesperson}"` : ""} e dizer que trabalha com "${service}".
2. Citar que viu o perfil/trabalho deles no Google ou nas redes sociais, que achou excelente, mas que percebeu uma oportunidade de melhoria no posicionamento digital/site deles para trazer mais clientes e orçamentos pelo WhatsApp.
3. Oferecer a criação de um modelo/esboço gratuito do site ou sistema sem qualquer compromisso para eles verem como ficaria.
4. Escrever em tom de conversa humana real: muito casual, amigável, direto, sem formalidades excessivas.
5. Manter a mensagem curta (máximo 4-5 parágrafos pequenos) para facilitar a leitura no celular e terminar com uma pergunta amigável chamando para a conversa.
6. Use e intercale variáveis de template para que o sistema consiga preencher dinamicamente. As variáveis válidas são:
   - {saudacao} (ex: "Oi", "Olá", "Tudo bem?")
   - {nome} ou {empresa} (nome da empresa do lead)
   - {nicho} (segmento do lead, ex: "academia", "restaurante")
   - {cidade} (região do lead)
   - {emoji} ou {emoji_oi} (emojis casuais)
7. Tom das mensagens (MUITO IMPORTANTE): O usuário solicitou que as mensagens tenham um tom focado em: "${tone}". Adapte fortemente o estilo, vocabulário e a abordagem para refletir esse tom. Se o tom for "variado", alterne os estilos entre as mensagens (ex: algumas com elogio, outras mais diretas).
8. Não retorne nenhum tipo de formatação em markdown no texto das mensagens. Retorne apenas o JSON.

Retorne EXCLUSIVAMENTE um objeto JSON válido, sem explicações adicionais, sem blocos de markdown adicionais, obedecendo a este formato exato:
{
  "templates": [
    {
      "name": "Nome descritivo curto (ex: Abordagem Elogio 1)",
      "text": "Texto completo da mensagem contendo as variáveis de template..."
    }
  ]
}`;

    const openai = getOpenAIInstance(req.user.id);
    const completion = await openai.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "system", content: prompt }],
      temperature: 0.85,
      response_format: { type: "json_object" }
    });

    const result = JSON.parse(completion.choices[0].message.content.trim());
    if (!result || !Array.isArray(result.templates)) {
      throw new Error("Formato inválido retornado pela IA");
    }

    // Map the generated templates to our campaignTemplate format
    const formatted = result.templates.map((t, idx) => ({
      id: Date.now() + idx,
      name: t.name || `Abordagem Gerada ${idx + 1}`,
      type: 'Primeiro Contato',
      status: 'Ativa',
      content: t.text || t.content || '',
      uses: 0,
      responseRate: '0%',
      color: ['purple', 'blue', 'orange', 'emerald', 'pink'][idx % 5],
      responses: 0,
      deals: 0,
      userId: req.user.id
    }));

    // Remove older "Primeiro Contato" templates of this user and write the new generated ones
    const otherUserTemplates = campaignTemplates.filter(t => !(t.userId === req.user.id && t.type === 'Primeiro Contato'));
    campaignTemplates = [...otherUserTemplates, ...formatted];
    saveTemplates();

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
    if (!config.groqApiKey) return res.status(400).json({ error: 'Chave da API não configurada.' });
    
    const openai = getOpenAIInstance(req.user.id);
    const completion = await openai.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "system", content: `Você é um SDR. Informações: ${JSON.stringify(leadInfo)}` }, ...history, { role: "user", content: message }],
      temperature: 0.7, max_tokens: 150,
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

const PORT = process.env.PORT || 3001;

app.use(express.static(path.join(__dirname, 'dist')));
app.get(/(.*)/, (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`\n🤖 BOT SDR V2.0 MULTI-TENANT - ONLINE NA PORTA ${PORT}\n`);
});