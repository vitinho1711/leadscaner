/**
 * stitchService.js
 * Serviço de Integração com o Google Stitch MCP (https://stitch.googleapis.com/mcp)
 * Gera designs e sites HTML de altíssima fidelidade com o motor Stitch da Google.
 */

const STITCH_MCP_URL = 'https://stitch.googleapis.com/mcp';
const DEFAULT_STITCH_API_KEY = process.env.STITCH_API_KEY || '';

export class StitchService {
  constructor(apiKey = DEFAULT_STITCH_API_KEY) {
    this.apiKey = apiKey;
    this.url = STITCH_MCP_URL;
  }

  async callTool(name, args = {}) {
    const res = await fetch(this.url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': this.apiKey
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: Date.now() + Math.floor(Math.random() * 1000),
        method: 'tools/call',
        params: {
          name: name,
          arguments: args
        }
      })
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Stitch MCP HTTP ${res.status}: ${errText}`);
    }

    const data = await res.json();
    if (data.error) {
      throw new Error(`Stitch MCP Error: ${data.error.message || JSON.stringify(data.error)}`);
    }

    return data.result;
  }

  /**
   * Cria um projeto novo no Google Stitch
   */
  async createProject(title) {
    const result = await this.callTool('create_project', { title });
    let parsed = null;
    try {
      if (result.structuredContent) parsed = result.structuredContent;
      else if (result.content?.[0]?.text) parsed = JSON.parse(result.content[0].text);
    } catch (e) {
      console.warn('Erro ao parsear resposta de createProject:', e);
    }
    return parsed;
  }

  /**
   * Lista projetos existentes
   */
  async listProjects() {
    const result = await this.callTool('list_projects', {});
    try {
      if (result.structuredContent?.projects) return result.structuredContent.projects;
      if (result.content?.[0]?.text) {
        const p = JSON.parse(result.content[0].text);
        return p.projects || [];
      }
    } catch (e) {}
    return [];
  }

  /**
   * Obtém os detalhes completos de uma tela (HTML + screenshot)
   */
  async getScreen(projectId, screenId) {
    const cleanProjectId = projectId.replace(/^projects\//, '');
    const cleanScreenId = screenId.replace(/^.*\/screens\//, '');
    
    const result = await this.callTool('get_screen', {
      projectId: cleanProjectId,
      screenId: cleanScreenId
    });

    try {
      if (result.structuredContent) return result.structuredContent;
      if (result.content?.[0]?.text) return JSON.parse(result.content[0].text);
    } catch (e) {}
    return null;
  }

  /**
   * Baixa o HTML gerado pela URL do Google
   */
  async downloadHtml(url) {
    if (!url) return null;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Falha ao baixar HTML do Stitch: ${res.statusText}`);
    return await res.text();
  }

  /**
   * Dispara a geração de uma tela a partir de um prompt especializado
   */
  async generateScreen(projectId, prompt, deviceType = 'DESKTOP') {
    const cleanProjectId = projectId.replace(/^projects\//, '');
    const result = await this.callTool('generate_screen_from_text', {
      projectId: cleanProjectId,
      prompt: prompt,
      deviceType: deviceType
    });

    let parsed = null;
    try {
      if (result.structuredContent) parsed = result.structuredContent;
      else if (result.content?.[0]?.text) parsed = JSON.parse(result.content[0].text);
    } catch (e) {}

    return parsed;
  }

  /**
   * Extrai dados da tela a partir dos múltiplos formatos de retorno do Stitch MCP
   */
  extractScreenData(genResult) {
    if (!genResult) return null;

    if (Array.isArray(genResult.outputComponents)) {
      for (const comp of genResult.outputComponents) {
        if (comp.design?.screens?.[0]) {
          const sc = comp.design.screens[0];
          return {
            screenId: sc.id || sc.name,
            screenshotUrl: sc.screenshot?.downloadUrl || null,
            htmlCodeUrl: sc.htmlCode?.downloadUrl || null
          };
        }
        if (comp.screen) {
          return {
            screenId: comp.screen.id || comp.screen.name,
            screenshotUrl: comp.screen.screenshot?.downloadUrl || null,
            htmlCodeUrl: comp.screen.htmlCode?.downloadUrl || null
          };
        }
      }
    }

    if (genResult.screen) {
      return {
        screenId: genResult.screen.id || genResult.screen.name,
        screenshotUrl: genResult.screen.screenshot?.downloadUrl || null,
        htmlCodeUrl: genResult.screen.htmlCode?.downloadUrl || null
      };
    }

    return null;
  }

  /**
   * Fluxo completo: Cria projeto -> Gera tela com Stitch -> Extrai HTML e Screenshot
   */
  async generateFullSite(lead, promptToUse) {
    const projectName = `Lead - ${lead.nome || 'Empresa'} (${lead.cidade || 'Brasil'})`;
    console.log(`[StitchService] 🚀 Iniciando geração no Google Stitch: "${projectName}"...`);

    // 1. Cria projeto
    const project = await this.createProject(projectName);
    if (!project || !project.name) {
      throw new Error('Falha ao inicializar projeto no Google Stitch');
    }
    const projectId = project.name.replace(/^projects\//, '');
    console.log(`[StitchService] ✅ Projeto Stitch criado: ID ${projectId}`);

    // 2. Dispara a geração da tela
    console.log(`[StitchService] 🎨 Gerando tela com motor Stitch UI...`);
    let genResult = await this.generateScreen(projectId, promptToUse, 'DESKTOP');
    let screenData = this.extractScreenData(genResult);

    // Se o Stitch apenas inicializou o designSystem na primeira chamada, faz a geração da tela
    if (!screenData?.htmlCodeUrl) {
      console.log(`[StitchService] ⚙️ Design system registrado. Compilando tela com Tailwind e layout no Stitch...`);
      genResult = await this.generateScreen(projectId, promptToUse, 'DESKTOP');
      screenData = this.extractScreenData(genResult);
    }

    let screenId = screenData?.screenId || null;
    let screenshotUrl = screenData?.screenshotUrl || null;
    let htmlCodeUrl = screenData?.htmlCodeUrl || null;

    // Se não veio direto, consulta o projeto no Stitch
    if (!htmlCodeUrl) {
      const projDetails = await this.callTool('get_project', { name: `projects/${projectId}` });
      let pData = null;
      try {
        pData = projDetails.structuredContent || (projDetails.content?.[0]?.text ? JSON.parse(projDetails.content[0].text) : null);
      } catch (e) {}

      if (pData?.thumbnailScreenshot?.downloadUrl) {
        screenshotUrl = pData.thumbnailScreenshot.downloadUrl;
      }
      if (pData?.thumbnailScreenshot?.name) {
        const match = pData.thumbnailScreenshot.name.match(/screens\/([^/]+)/);
        if (match) screenId = match[1];
      }
    }

    // Se temos o screenId, busca os detalhes da tela
    if (screenId && !htmlCodeUrl) {
      console.log(`[StitchService] 🔍 Buscando tela ${screenId}...`);
      const screen = await this.getScreen(projectId, screenId);
      if (screen) {
        htmlCodeUrl = screen.htmlCode?.downloadUrl;
        screenshotUrl = screen.screenshot?.downloadUrl || screenshotUrl;
      }
    }

    // 4. Baixa o HTML se disponível
    let compiledHtml = null;
    if (htmlCodeUrl) {
      console.log(`[StitchService] 📥 Baixando HTML oficial do Stitch (${htmlCodeUrl})...`);
      compiledHtml = await this.downloadHtml(htmlCodeUrl);
    }

    return {
      projectId,
      screenId,
      screenshotUrl,
      htmlCodeUrl,
      compiledHtml,
      designSystem: genResult?.outputComponents?.[0]?.designSystem || null
    };
  }
}

export const defaultStitchService = new StitchService();
