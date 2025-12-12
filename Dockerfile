# --- 1. Build Stage ---
# Cette étape construit l'application React et installe les dépendances du serveur.
FROM node:18-alpine AS builder

WORKDIR /app

# Installer les dépendances du serveur
# Utiliser npm ci est plus rapide et plus sûr pour les builds de production
COPY package*.json ./
RUN npm ci

# Installer les dépendances du client et construire l'application React
COPY client/package*.json client/
COPY client/package-lock.json client/
RUN cd client && npm ci

COPY client/ ./client
RUN cd client && npm run build

# --- 2. Production Stage ---
# Cette étape crée l'image finale, plus légère.
FROM node:18-alpine

WORKDIR /app

# Copier les dépendances de production depuis l'étape de build
COPY package*.json ./
RUN npm install --production

# Copier le code du serveur
COPY server ./server

# Copier le build de l'application React depuis l'étape de build
COPY --from=builder /app/client/build ./client/build

EXPOSE 3001

CMD ["npm", "start"]
