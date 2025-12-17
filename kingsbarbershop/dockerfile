# =========================
# Stage 1: Build
# =========================
FROM node:20-bullseye-slim AS builder

WORKDIR /app

# Copiar package.json e package-lock.json
COPY package*.json ./

# Instalar todas dependências (dev + prod) para build
RUN npm ci

# Copiar o restante do código
COPY . .

# Build da aplicação Next.js
RUN npm run build

# =========================
# Stage 2: Produção
# =========================
FROM node:20-bullseye-slim

WORKDIR /app

# Criar usuário não-root
RUN useradd -m appuser

# Copiar arquivos essenciais do build
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

# Instalar apenas prod dependencies (para rodar)
RUN npm ci --only=production

# Mudar para usuário não-root
USER appuser

# Porta padrão Next.js
EXPOSE 3000

# Start da aplicação
CMD ["npm", "run", "start"]