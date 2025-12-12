#!/bin/bash

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${BLUE}🚀 Déploiement - App Jeux Soirée${NC}\n"

# Check Node.js
echo "Vérification de Node.js..."
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js n'est pas installé${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Node.js $(node -v)${NC}"

# Check npm
echo "Vérification de npm..."
if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm n'est pas installé${NC}"
    exit 1
fi
echo -e "${GREEN}✅ npm $(npm -v)${NC}\n"

# Install dependencies
echo -e "${YELLOW}📦 Installation des dépendances serveur...${NC}"
npm install
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Erreur lors de l'installation serveur${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Dépendances serveur installées${NC}\n"

# Install client dependencies
echo -e "${YELLOW}📦 Installation des dépendances client...${NC}"
cd client
npm install
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Erreur lors de l'installation client${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Dépendances client installées${NC}\n"

# Build client
echo -e "${YELLOW}🔨 Build du client React...${NC}"
npm run build
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Erreur lors du build${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Client construit avec succès${NC}\n"

# Go back to root
cd ..

echo -e "${GREEN}✅ Déploiement complété!${NC}\n"
echo -e "${BLUE}Prochaines étapes:${NC}"
echo "1. Définir les variables d'environnement:"
echo "   PORT=3001"
echo "   NODE_ENV=production"
echo ""
echo "2. Démarrer le serveur:"
echo "   npm start"
echo ""
echo "3. L'application sera disponible sur:"
echo "   http://localhost:3001"
