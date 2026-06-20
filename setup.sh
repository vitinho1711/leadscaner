#!/bin/bash
# ============================================================
# Lead Scanner — Script de Setup Automático no Servidor
# Uso: bash setup.sh
# ============================================================

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

print_step() { echo -e "\n${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"; echo -e "${CYAN}▶ $1${NC}"; echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"; }
print_ok()   { echo -e "${GREEN}✅ $1${NC}"; }
print_warn() { echo -e "${YELLOW}⚠️  $1${NC}"; }
print_err()  { echo -e "${RED}❌ $1${NC}"; }

echo -e "${CYAN}"
echo "  ██╗     ███████╗ █████╗ ██████╗     ███████╗ ██████╗ █████╗ ███╗   ██╗███╗   ██╗███████╗██████╗ "
echo "  ██║     ██╔════╝██╔══██╗██╔══██╗    ██╔════╝██╔════╝██╔══██╗████╗  ██║████╗  ██║██╔════╝██╔══██╗"
echo "  ██║     █████╗  ███████║██║  ██║    ███████╗██║     ███████║██╔██╗ ██║██╔██╗ ██║█████╗  ██████╔╝"
echo "  ██║     ██╔══╝  ██╔══██║██║  ██║    ╚════██║██║     ██╔══██║██║╚██╗██║██║╚██╗██║██╔══╝  ██╔══██╗"
echo "  ███████╗███████╗██║  ██║██████╔╝    ███████║╚██████╗██║  ██║██║ ╚████║██║ ╚████║███████╗██║  ██║"
echo "  ╚══════╝╚══════╝╚═╝  ╚═╝╚═════╝     ╚══════╝ ╚═════╝╚═╝  ╚═╝╚═╝  ╚═══╝╚═╝  ╚═══╝╚══════╝╚═╝  ╚═╝"
echo -e "${NC}"
echo -e "${GREEN}  Setup Automático — Deploy em Produção${NC}"
echo ""

# ─── ETAPA 1: Sistema ────────────────────────────────────────
print_step "ETAPA 1/6 — Atualizando sistema"
sudo apt-get update -qq
sudo apt-get upgrade -y -qq
print_ok "Sistema atualizado"

# ─── ETAPA 2: Docker ─────────────────────────────────────────
print_step "ETAPA 2/6 — Instalando Docker"
if ! command -v docker &> /dev/null; then
    curl -fsSL https://get.docker.com | sudo sh
    sudo usermod -aG docker $USER
    print_ok "Docker instalado"
    print_warn "Você precisará sair e entrar novamente para usar Docker sem sudo."
    print_warn "O script continuará usando sudo temporariamente..."
else
    print_ok "Docker já instalado: $(docker --version)"
fi

# Instalar docker compose plugin se necessário
if ! docker compose version &> /dev/null 2>&1; then
    sudo apt-get install -y docker-compose-plugin -qq
fi
print_ok "Docker Compose: $(docker compose version --short 2>/dev/null || echo 'OK')"

# ─── ETAPA 3: Clonar/Atualizar Projeto ───────────────────────
print_step "ETAPA 3/6 — Clonando o projeto Lead Scanner"
REPO_URL="https://github.com/vitinho1711/leadscaner.git"
APP_DIR="$HOME/lead-scanner"

if [ -d "$APP_DIR" ]; then
    print_warn "Diretório já existe — atualizando com git pull..."
    cd "$APP_DIR"
    git pull origin main
else
    git clone "$REPO_URL" "$APP_DIR"
    cd "$APP_DIR"
fi
print_ok "Código em: $APP_DIR"

# ─── ETAPA 4: Configurar .env ─────────────────────────────────
print_step "ETAPA 4/6 — Configurando variáveis de ambiente"

if [ ! -f "$APP_DIR/.env" ]; then
    cp "$APP_DIR/.env.example" "$APP_DIR/.env"
    
    # Gerar JWT_SECRET automático
    JWT_SECRET=$(openssl rand -hex 32)
    sed -i "s/JWT_SECRET=/JWT_SECRET=$JWT_SECRET/" "$APP_DIR/.env"
    sed -i "s/NODE_ENV=production/NODE_ENV=production/" "$APP_DIR/.env"
    sed -i "s|DATA_DIR=/app/data|DATA_DIR=/app/data|" "$APP_DIR/.env"
    
    echo ""
    echo -e "${YELLOW}┌─────────────────────────────────────────────────┐${NC}"
    echo -e "${YELLOW}│         CONFIGURAÇÃO DO GROQ API KEY             │${NC}"
    echo -e "${YELLOW}└─────────────────────────────────────────────────┘${NC}"
    echo ""
    echo -e "  Para usar a análise de IA, você precisa de uma chave Groq gratuita."
    echo -e "  Obtenha em: ${CYAN}https://console.groq.com${NC}"
    echo ""
    read -p "  Cole sua GROQ_API_KEY aqui (ou deixe em branco para pular): " GROQ_KEY
    
    if [ -n "$GROQ_KEY" ]; then
        sed -i "s/GROQ_API_KEY=/GROQ_API_KEY=$GROQ_KEY/" "$APP_DIR/.env"
        print_ok "GROQ_API_KEY configurada"
    else
        print_warn "GROQ_API_KEY pulada — análise de IA não funcionará até configurar"
    fi
    
    print_ok "Arquivo .env criado com JWT_SECRET gerado automaticamente"
else
    print_warn ".env já existe — mantendo configuração atual"
fi

# ─── ETAPA 5: Firewall ───────────────────────────────────────
print_step "ETAPA 5/6 — Configurando firewall (porta 3001)"
sudo iptables -I INPUT 6 -m state --state NEW -p tcp --dport 3001 -j ACCEPT 2>/dev/null || true
# Salvar regras se netfilter-persistent estiver disponível
if command -v netfilter-persistent &> /dev/null; then
    sudo netfilter-persistent save
else
    sudo apt-get install -y iptables-persistent -qq 2>/dev/null || true
    sudo netfilter-persistent save 2>/dev/null || true
fi
print_ok "Porta 3001 liberada"

# ─── ETAPA 6: Build e Deploy ─────────────────────────────────
print_step "ETAPA 6/6 — Fazendo build e subindo o Lead Scanner 🚀"
cd "$APP_DIR"
sudo docker compose down 2>/dev/null || true
sudo docker compose up -d --build

# Aguardar container subir
echo ""
echo -e "  Aguardando o Lead Scanner inicializar..."
sleep 15

# Verificar status
if sudo docker compose ps | grep -q "Up"; then
    print_ok "Lead Scanner está rodando!"
else
    print_err "Houve um problema. Verifique com: docker compose logs"
fi

# ─── RESULTADO FINAL ──────────────────────────────────────────
PUBLIC_IP=$(curl -s ifconfig.me 2>/dev/null || curl -s icanhazip.com 2>/dev/null || echo "SEU_IP")

echo ""
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}  🎉 DEPLOY CONCLUÍDO COM SUCESSO!${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "  📱 Acesse o Lead Scanner em:"
echo -e "     ${CYAN}http://$PUBLIC_IP:3001${NC}"
echo ""
echo -e "  📋 Próximos passos:"
echo -e "     1. Acesse o link acima no navegador"
echo -e "     2. Faça login com sua conta admin"
echo -e "     3. Vá em ${YELLOW}Configurações → WhatsApp${NC} e escaneie o QR Code"
echo ""
echo -e "  🛠️  Comandos úteis:"
echo -e "     Ver logs:        ${YELLOW}cd ~/lead-scanner && sudo docker compose logs -f${NC}"
echo -e "     Reiniciar:       ${YELLOW}sudo docker compose restart${NC}"
echo -e "     Parar:           ${YELLOW}sudo docker compose down${NC}"
echo -e "     Atualizar:       ${YELLOW}git pull && sudo docker compose up -d --build${NC}"
echo ""
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

# ─── KEEPALIVE (evitar Oracle reclamar instância idle) ────────
print_step "Configurando keepalive para manter a instância ativa"
sudo tee /etc/systemd/system/keepalive.service > /dev/null << 'EOF'
[Unit]
Description=Keep Oracle Cloud Instance Alive
After=network.target

[Service]
ExecStart=/bin/bash -c 'while true; do dd if=/dev/urandom bs=1M count=5 | md5sum > /dev/null 2>&1; sleep 300; done'
Restart=always

[Install]
WantedBy=multi-user.target
EOF

sudo systemctl daemon-reload
sudo systemctl enable keepalive --quiet
sudo systemctl start keepalive
print_ok "Keepalive ativo — instância não será reclamada por inatividade"
