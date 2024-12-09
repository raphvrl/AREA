# Étape de build
FROM node:16-alpine AS builder

WORKDIR /app

# Copier les fichiers de dépendances
COPY package*.json ./
COPY tsconfig.json ./

# Installer toutes les dépendances (dev + prod)
RUN npm ci

# Copier les sources
COPY . .

# Build l'application TypeScript
RUN npm run build

# Étape de production
FROM node:16-alpine

WORKDIR /app

# Copier les fichiers nécessaires
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/ssl ./ssl
COPY package*.json ./

# Installer uniquement les dépendances de production
RUN npm ci --only=production

# Configuration
ENV NODE_ENV=production
EXPOSE 8080

CMD ["npm", "run", "start:prod"]