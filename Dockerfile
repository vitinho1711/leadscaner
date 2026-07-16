FROM node:20-bullseye

# Instalar dependências para o Puppeteer (Chromium) - compatível com ARM64 e AMD64
RUN apt-get update && apt-get install -y \
    wget \
    gnupg \
    ca-certificates \
    procps \
    libxss1 \
    libnss3 \
    libatk-bridge2.0-0 \
    libgtk-3-0 \
    libgbm-dev \
    libasound2 \
    chromium \
    && rm -rf /var/lib/apt/lists/*

# Configurar Puppeteer para usar Chromium do sistema
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

WORKDIR /app

# Copiar arquivos do projeto
COPY package*.json ./
RUN npm install

# Copiar o resto do código
COPY . .

# Fazer build do front-end
RUN npm run build

# Criar diretório de dados
RUN mkdir -p /app/data

EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3001/api/health || exit 1

# Rodar o servidor Node
CMD ["npm", "run", "bot"]
