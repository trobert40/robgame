# 🎮 App Jeux Soirée

Une application web multijoueur pour jouer à des jeux de cartes en soirée avec vos amis!

## 🎯 Fonctionnalités

### Jeux disponibles:

1. **🐴 PMU (Course de Chevaux)**
   - Pariez vos gorgées sur les chevaux
   - Regardez-les avancer en fonction des cartes tirées
   - Le premier à 7 cartes gagne!

2. **🟣 Purple (Devinez la Carte)**
   - Prédisez la couleur ou la valeur de la prochaine carte
   - Construisez des séries de bonnes réponses
   - Attention: plus la série est longue, plus la pénalité est lourde!

## 🚀 Installation

### Prérequis
- Node.js (v16+)
- npm ou yarn

### Setup

1. Clonez le repository:
```bash
git clone <repository-url>
cd app-jeux-soiree
```

2. Installez les dépendances:
```bash
npm install
cd client && npm install && cd ..
```

3. Lancez l'application:
```bash
npm run dev
```

Le serveur sera sur `http://localhost:3001` et le client React sur `http://localhost:3000`

## 📱 Utilisation

1. **Créer une partie:**
   - Cliquez sur "Créer une partie"
   - Entrez votre nom
   - Vous recevrez un code à partager

2. **Rejoindre une partie:**
   - Scannez le QR code ou entrez le code
   - Entrez votre nom
   - Attendez le host pour démarrer

3. **Lancer un jeu:**
   - Sélectionnez un jeu dans le lobby
   - Lisez les règles
   - Jouez!

## 🏗️ Architecture

```
app-jeux-soiree/
├── server/
│   ├── index.js              # Server principal
│   ├── GameRoom.js           # Gestion des salons
│   ├── games/
│   │   ├── PMUGame.js        # Logique du jeu PMU
│   │   └── PurpleGame.js     # Logique du jeu Purple
│   └── utils/
│       └── CardUtils.js      # Utilitaires cartes
├── client/
│   ├── public/
│   │   └── index.html
│   └── src/
│       ├── pages/            # Pages React
│       ├── components/       # Composants
│       ├── contexts/         # Context Socket.io
│       ├── hooks/            # Custom hooks
│       └── App.js
└── package.json
```

## 🔌 Communication

L'application utilise **Socket.io** pour la communication en temps réel entre le serveur et les clients.

### Événements principaux:
- `createRoom` - Créer une nouvelle partie
- `joinRoom` - Rejoindre une partie existante
- `startGame` - Démarrer un jeu
- `gameAction` - Effectuer une action de jeu
- `playerJoined` - Un joueur a rejoint
- `gameStateUpdated` - L'état du jeu a changé

## 🎨 Styles

L'interface utilise:
- Gradient coloré (bleu/violet)
- Design responsive pour mobile/desktop
- Animations fluides

## 📝 Règles des Jeux

### PMU
- 4 Aces = 4 chevaux
- 5 gorgées à distribuer par joueur
- Premier cheval à 7 cartes gagne
- Winners distribuent, losers paient

### Purple
- Prédictions: Rouge, Noir, Violet, Plus, Moins
- Cartes empilées = risque de pénalité
- Après 3 bonnes: possibilité de passer
- Pénalité = nombre de cartes empilées

## 🤝 Contribution

Les contributions sont les bienvenues! N'hésitez pas à forker et créer des pull requests.

## 📄 Licence

MIT

## 👨‍💻 Développeur

Créé par Théo - App Jeux Soirée

---

**Amusez-vous bien! 🎉** 

