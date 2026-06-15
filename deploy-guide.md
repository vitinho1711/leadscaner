# 🚀 Guia de Deploy — Lead Scanner na Oracle Cloud Free

## Pré-requisitos

- Conta na Oracle Cloud (https://cloud.oracle.com)
- Instância ARM (Ampere A1) provisionada — **grátis forever**
  - Shape: `VM.Standard.A1.Flex`
  - OCPUs: 1-4 (recomendado: 2)
  - RAM: 6-24GB (recomendado: 8GB)
  - Boot Volume: 47GB (pode expandir até 200GB grátis)
  - OS: Ubuntu 22.04 ou Oracle Linux 9

---

## Passo 1: Provisionar a Instância

1. Acesse **Oracle Cloud Console** → **Compute** → **Instances** → **Create Instance**
2. Selecione:
   - **Shape**: Ampere (VM.Standard.A1.Flex)
   - **OCPUs**: 2
   - **Memory**: 8 GB
   - **Image**: Ubuntu 22.04
3. Gere ou adicione sua chave SSH
4. Clique em **Create**

> ⚠️ Se aparecer "Out of Capacity", tente outra Availability Domain ou tente em horários diferentes (madrugada costuma funcionar)

---

## Passo 2: Configurar Firewall

### No Console da Oracle (Security List):
1. **Networking** → **Virtual Cloud Networks** → Sua VCN → **Security Lists**
2. Adicione **Ingress Rule**:
   - Source: `0.0.0.0/0`
   - Protocol: TCP
   - Destination Port: `3001`
   - (Opcional) Porta `80` e `443` se usar Nginx

### No servidor (iptables):
```bash
sudo iptables -I INPUT 6 -m state --state NEW -p tcp --dport 3001 -j ACCEPT
sudo netfilter-persistent save
```

---

## Passo 3: Instalar Docker

```bash
# Conectar via SSH
ssh -i sua_chave.key ubuntu@SEU_IP_PUBLICO

# Atualizar sistema
sudo apt update && sudo apt upgrade -y

# Instalar Docker
curl -fsSL https://get.docker.com | sudo sh
sudo usermod -aG docker $USER

# Instalar Docker Compose
sudo apt install docker-compose-plugin -y

# Logout e login novamente para aplicar grupo docker
exit
ssh -i sua_chave.key ubuntu@SEU_IP_PUBLICO

# Verificar instalação
docker --version
docker compose version
```

---

## Passo 4: Deploy do Lead Scanner

```bash
# Clonar o repositório (ou enviar via scp)
git clone https://github.com/SEU_USUARIO/lead-scanner.git
cd lead-scanner

# Criar arquivo .env
cp .env.example .env
nano .env
# Preencha as variáveis:
# JWT_SECRET=gere_um_valor_aleatorio_aqui
# GROQ_API_KEY=sua_chave_groq
# VITE_SUPABASE_URL=sua_url_supabase
# VITE_SUPABASE_ANON_KEY=sua_chave_supabase

# Build e iniciar
docker compose up -d --build

# Verificar se está rodando
docker compose ps
docker compose logs -f
```

---

## Passo 5: Acessar o App

Acesse no navegador:
```
http://SEU_IP_PUBLICO:3001
```

Faça login com sua conta admin. Se for a primeira vez, registre-se.

---

## Passo 6: (Opcional) Domínio + HTTPS com Nginx

```bash
# Instalar Nginx + Certbot
sudo apt install nginx certbot python3-certbot-nginx -y

# Configurar Nginx
sudo nano /etc/nginx/sites-available/leadscanner
```

Conteúdo:
```nginx
server {
    listen 80;
    server_name seu-dominio.com;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Ativar e reiniciar
sudo ln -s /etc/nginx/sites-available/leadscanner /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# SSL (HTTPS)
sudo certbot --nginx -d seu-dominio.com
```

---

## Comandos Úteis

```bash
# Ver logs em tempo real
docker compose logs -f

# Reiniciar
docker compose restart

# Parar
docker compose down

# Rebuild após mudanças
docker compose up -d --build

# Backup dos dados
docker cp lead-scanner-lead-scanner-1:/app/data ./backup_data

# Verificar uso de recursos
docker stats
```

---

## ⚠️ Manter Instância Ativa (Evitar Reclamação Oracle)

A Oracle pode reclamar instâncias "idle" (CPU < 10% por 7 dias). Para evitar:

```bash
# Criar cron job que mantém CPU ativa
crontab -e

# Adicionar esta linha (roda a cada 5 min):
*/5 * * * * dd if=/dev/urandom bs=1M count=10 | md5sum > /dev/null 2>&1
```

Ou instale o script de keepalive:
```bash
# Criar script
cat > ~/keepalive.sh << 'EOF'
#!/bin/bash
while true; do
  dd if=/dev/urandom bs=1M count=5 | md5sum > /dev/null 2>&1
  sleep 300
done
EOF
chmod +x ~/keepalive.sh

# Rodar com systemd
sudo tee /etc/systemd/system/keepalive.service << EOF
[Unit]
Description=Keep Oracle Cloud Instance Alive
After=network.target

[Service]
ExecStart=/home/ubuntu/keepalive.sh
Restart=always

[Install]
WantedBy=multi-user.target
EOF

sudo systemctl enable keepalive
sudo systemctl start keepalive
```

---

## 🔗 Compartilhar com Testers

Após o deploy, use o painel de **Convites** (como admin) para:

1. Gerar código de convite
2. Copiar o link gerado: `http://SEU_IP:3001/?invite=LEAD-XXXX-YYYY`
3. Enviar para os testers via WhatsApp/email
4. O tester acessa o link, cria conta, e começa a usar com limites de trial
