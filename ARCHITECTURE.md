# 📚 Documentation Technique - App Jeux Soirée

## Architecture Globale

```
┌─────────────────────────────────────────────────────────────┐
│                     NAVIGATEUR (Client)                      │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              React Application (Port 3000)            │   │
│  │  ┌─────────────────────────────────────────────────┐ │   │
│  │  │ Pages: Home, Lobby, Game                        │ │   │
│  │  │ Components: PMU, Purple                         │ │   │
│  │  └─────────────────────────────────────────────────┘ │   │
│  └──────────────────────────────────────────────────────┘   │
│                         ↕ Socket.io ↕                       │
└─────────────────────────────────────────────────────────────┘
           ↓
┌─────────────────────────────────────────────────────────────┐
│              Node.js Server (Port 3001)                      │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              Socket.io Server                        │   │
│  │  • Gestion des connexions                           │   │
│  │  • Routage des événements                           │   │
│  │  • Synchronisation d'état                           │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              GameRoom Manager                        │   │
│  │  • Création/gestion des salons                      │   │
│  │  • Gestion des joueurs                              │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              Game Engines                            │   │
│  │  • PMUGame                                           │   │
│  │  • PurpleGame                                        │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              Utilities                               │   │
│  │  • CardUtils (Deck, Card)                           │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

## Structure des Dossiers

```
app-jeux-soiree/
├── server/
│   ├── index.js                  # Point d'entrée du serveur
│   ├── GameRoom.js               # Classe de gestion des salons
│   ├── games/
│   │   ├── PMUGame.js            # Logique du jeu PMU
│   │   └── PurpleGame.js         # Logique du jeu Purple
│   └── utils/
│       └── CardUtils.js          # Classes Card et Deck
│
├── client/
│   ├── public/
│   │   └── index.html            # Template HTML
│   └── src/
│       ├── pages/
│       │   ├── Home.js           # Écran d'accueil
│       │   ├── Home.css
│       │   ├── Lobby.js          # Écran de salle
│       │   ├── Lobby.css
│       │   ├── Game.js           # Écran de jeu
│       │   └── Game.css
│       ├── components/
│       │   └── games/
│       │       ├── PMU.js        # Composant PMU
│       │       ├── PMU.css
│       │       ├── Purple.js     # Composant Purple
│       │       └── Purple.css
│       ├── contexts/
│       │   └── SocketContext.js  # Context Socket.io
│       ├── hooks/
│       │   └── useSocket.js      # Hook Socket.io
│       ├── App.js                # App principal
│       ├── App.css
│       └── index.js              # Entrée React
│
├── package.json                  # Dépendances serveur
├── README.md                     # Guide utilisateur
└── ARCHITECTURE.md              # Ce fichier
```

## Flux de Données

### 1. Création d'une Partie
```
Utilisateur clique "Créer une partie"
    ↓
[Home.js] envoie event 'createRoom'
    ↓
[Socket.io] reçoit et traite
    ↓
[GameRoom.js] crée une nouvelle salle
    ↓
Redirection vers /lobby
    ↓
[Lobby.js] affiche code + QR code
```

### 2. Rejoindre une Partie
```
Utilisateur entre code/scanne QR
    ↓
[Home.js] envoie event 'joinRoom'
    ↓
[Socket.io] valide la salle
    ↓
[GameRoom.js] ajoute le joueur
    ↓
Redirection vers /lobby
    ↓
[Lobby.js] affiche la salle avec tous les joueurs
```

### 3. Démarrage d'une Partie
```
Host clique sur un jeu (PMU/Purple)
    ↓
[Lobby.js] envoie event 'startGame'
    ↓
[Socket.io] instancie le game engine
    ↓
[GameRoom.js] crée PMUGame ou PurpleGame
    ↓
Redirection vers /game
    ↓
[Game.js] affiche le composant approprié
```

### 4. Action de Jeu
```
Joueur effectue une action
    ↓
[PMU.js] ou [Purple.js] envoie 'gameAction'
    ↓
[Game Engine] traite l'action
    ↓
État du jeu mis à jour
    ↓
'gameStateUpdated' envoyé à tous les clients
    ↓
Interface mise à jour en temps réel
```

## API Socket.io

### Client → Server

#### createRoom
```javascript
socket.emit('createRoom', playerName, callback)
```
**Params:**
- `playerName` (string): Nom du joueur

**Response:**
```javascript
{
  success: boolean,
  roomCode: string,
  roomData: {
    code: string,
    players: Array,
    gameType: string,
    status: string
  }
}
```

#### joinRoom
```javascript
socket.emit('joinRoom', roomCode, playerName, callback)
```
**Params:**
- `roomCode` (string): Code de la salle
- `playerName` (string): Nom du joueur

#### startGame
```javascript
socket.emit('startGame', gameType)
```
**Params:**
- `gameType` (string): 'pmu' ou 'purple'

#### gameAction
```javascript
socket.emit('gameAction', action, callback)
```
**Params (PMU):**
```javascript
{
  type: 'placeBet',
  suit: 'hearts|diamonds|clubs|spades',
  amount: number
}
// ou
{
  type: 'finishBetting'
}
// ou
{
  type: 'drawCard'
}
```

**Params (Purple):**
```javascript
{
  type: 'predict',
  prediction: 'rouge|noir|purple|plus|moins'
}
// ou
{
  type: 'pass'
}
```

### Server → Client

#### playerJoined
```javascript
io.to(roomCode).emit('playerJoined', {
  players: Array,
  message: string
})
```

#### playerLeft
```javascript
io.to(roomCode).emit('playerLeft', {
  players: Array
})
```

#### gameStarted
```javascript
io.to(roomCode).emit('gameStarted', {
  gameType: string,
  roomData: Object
})
```

#### gameStateUpdated
```javascript
io.to(roomCode).emit('gameStateUpdated', gameState)
```

## État du Jeu (Game State)

### PMU Game State
```javascript
{
  stage: 'betting|racing|finished',
  players: [
    {
      id: string,
      name: string,
      isHost: boolean,
      bets: { hearts: 0, diamonds: 0, clubs: 0, spades: 0 },
      gorgeesToDistribute: number,
      gorgeesToPay: number
    }
  ],
  horses: {
    hearts: { suit: string, position: number, cardsDrawn: number },
    // ...
  },
  winnerSuit: string|null,
  cardsRemaining: number,
  history: Array
}
```

### Purple Game State
```javascript
{
  stage: 'playing|finished',
  players: [
    {
      id: string,
      name: string,
      isHost: boolean,
      stackedCards: Array,
      penalties: number,
      isCurrentPlayer: boolean
    }
  ],
  currentPlayer: Object,
  currentCard: Card|null,
  previousCard: Card|null,
  cardsRemaining: number,
  consecutiveCorrect: number,
  history: Array
}
```

## Modèles de Données

### Card
```javascript
{
  suit: 'hearts'|'diamonds'|'clubs'|'spades',
  value: 'A'|'2'-'10'|'J'|'Q'|'K',
  getNumericValue(): number,     // 1-13
  getColor(): 'red'|'black',
  toString(): string
}
```

### GameRoom
```javascript
{
  code: string,
  players: Array,
  game: PMUGame|PurpleGame|null,
  gameType: string|null,
  status: 'waiting'|'rules'|'playing'|'finished',
  maxPlayers: number
}
```

## Flux d'Authentification

Actuellement, il n'y a pas d'authentification. Chaque joueur est identifié par:
- `socket.id` (généré par Socket.io)
- `playerName` (défini par l'utilisateur)

Pour une production, considérez:
- JWT tokens
- Base de données utilisateurs
- Validation de session

## Considérations de Performance

### Optimisations Actuelles:
- State synchronization via WebSockets
- Broadcast limité à la room spécifique
- Card shuffling une seule fois par partie

### Améliorations Futures:
- Compression des messages Socket.io
- Caching du QR code généré
- Limite de débit des actions (rate limiting)
- Pagination de l'historique

## Sécurité

### Actuellement Implémenté:
- CORS activé
- Validation de room code
- Vérification des joueurs actifs

### À Ajouter:
- Rate limiting
- Input validation/sanitization
- Message encryption
- Code injection prevention
- DDoS protection

## Évolutivité

### Limitée à:
- Un serveur unique
- Base de données en mémoire

### Pour Scale Horizontalement:
1. Adapter Room Store (Redis)
2. Ajouter Load Balancer
3. Session persistence
4. Adapter Socket.io adapter (Redis adapter)

## Déploiement

### Heroku
```bash
heroku create app-jeux-soiree
git push heroku main
```

### Docker
```bash
docker build -t app-jeux-soiree .
docker run -p 3001:3001 app-jeux-soiree
```

### Variables d'Environnement
```
PORT=3001
NODE_ENV=production
```
