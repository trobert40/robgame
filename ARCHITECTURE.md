# 📚 Documentation Technique - RobGame (App Jeux Soirée)

## Architecture Globale

```
┌─────────────────────────────────────────────────────────────────────────┐
│                          NAVIGATEUR (Client React)                      │
│  ┌───────────────────────────────────────────────────────────────────┐  │
│  │                     React Application (Port 3000)                 │  │
│  │  ┌─────────────────────────────────────────────────────────────┐  │  │
│  │  │ Pages: Home, Lobby, Game                                    │  │  │
│  │  │ Jeux: PMU, Purple, NinetyNine (99)                          │  │  │
│  │  │ UI: Chat, PenaltyModal, ConfirmationModal, ToggleSwitch...  │  │  │
│  │  └─────────────────────────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────────────────────┘  │
│                               ↕ WebSockets / Socket.io ↕                │
└─────────────────────────────────────────────────────────────────────────┘
                                   ↓
┌─────────────────────────────────────────────────────────────────────────┐
│                    SERVEUR (Node.js / Express / Socket.io)              │
│  ┌───────────────────────────────────────────────────────────────────┐  │
│  │                        Socket.io Server                           │  │
│  │  • Gestion des connexions & déconnexions                          │  │
│  │  • Routage des événements (partie, chat, pénalités)               │  │
│  │  • Synchronisation d'état broadcast                              │  │
│  └───────────────────────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────────────────────┐  │
│  │                       GameRoom Manager                            │  │
│  │  • Création & gestion des salons (codes uniques à 6 caractères)   │  │
│  │  • Salons publics / privés & réassignation d'hôte                 │  │
│  │  • Cycle de vie (waiting -> rules -> playing -> finished)         │  │
│  └───────────────────────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────────────────────┐  │
│  │                         Game Engines                              │  │
│  │  • PMUGame (course de chevaux, paris, barrières de recul)         │  │
│  │  • PurpleGame (prédictions couleur, empilement de cartes)         │  │
│  │  • NinetyNineGame (compteur 99, cartes spéciales, élimination)    │  │
│  └───────────────────────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────────────────────┐  │
│  │                          Utilities                                │  │
│  │  • CardUtils (Classes Card et Deck, mélange, valeurs)             │  │
│  └───────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Structure des Dossiers

```
app-jeux-soiree/
├── server/                           # Backend Node.js
│   ├── index.js                      # Point d'entrée, Express, Socket.IO & API
│   ├── GameRoom.js                   # Gestionnaire de salon et des joueurs
│   ├── games/                        # Moteurs de règles de jeu
│   │   ├── PMUGame.js                # Logique du PMU (course et paliers)
│   │   ├── PurpleGame.js             # Logique du Purple
│   │   └── 99Game.js                 # Logique du jeu 99
│   ├── utils/
│   │   └── CardUtils.js              # Classes Deck et Card
│   └── test_*.js                     # Scripts de tests unitaires (PMU, classements)
│
├── client/                           # Frontend React (SPA)
│   ├── public/
│   │   ├── assets/                   # Cartes SVG, icônes, logo, boutons
│   │   │   └── jeux/                 # Miniatures des jeux (pmu.png, purple.png, 99.png...)
│   │   ├── CNAME                     # Configuration domaine personnalisé (robgame.fr)
│   │   └── index.html                # Template HTML
│   └── src/
│       ├── components/               # Composants transversaux
│       │   ├── Chat.js / Chat.css    # Messagerie instantanée en temps réel
│       │   ├── PenaltyModal.js       # Fenêtre surgissante des pénalités / gorgées
│       │   ├── ConfirmationModal.js  # Modale de confirmation (quitter la partie)
│       │   ├── MessagePopup.js       # Notification toast si le chat est replié
│       │   ├── ToggleSwitch.js       # Switch UI (Privé / Public)
│       │   └── games/                # Composants graphiques des jeux
│       │       ├── PMU.js / PMU.css
│       │       ├── Purple.js / Purple.css
│       │       └── 99.js / 99.css
│       ├── contexts/
│       │   └── SocketContext.js      # Contexte global Socket.io & état partagé
│       ├── hooks/
│       │   └── useSocket.js          # Hook consommateur du contexte Socket
│       ├── pages/
│       │   ├── Home.js / Home.css    # Accueil (créer, rejoindre, liste publique)
│       │   ├── Lobby.js / Lobby.css  # Salle d'attente (joueurs, choix de jeu)
│       │   └── Game.js / Game.css    # Conteneur dynamique de partie
│       ├── App.js                    # Composant racine, routes et modales globales
│       └── index.js                  # Point de montage ReactDOM
│
├── docs/                             # Build de production servi par GitHub Pages (robgame.fr)
├── commandes.txt                     # Commandes de build, synchronisation et Git
├── CHANGELOG.md                      # Journal des versions
└── ARCHITECTURE.md                  # Ce document
```

---

## Flux de Données

### 1. Création d'une Partie
```
Utilisateur entre son pseudo et clique "Créer une partie"
    ↓
[Home.js] émet 'createRoom(playerName)'
    ↓
[server/index.js] valide le pseudo et instancie new GameRoom(code, playerName, socket.id)
    ↓
Salon stocké dans la Map `rooms` en mémoire
    ↓
Callback renvoyé au client avec roomCode et roomData
    ↓
[SocketContext.js] met à jour l'état local et redirige vers /lobby
```

### 2. Rejoindre une Partie (Code ou Liste Publique)
```
Utilisateur saisit un code à 6 lettres OU clique sur un salon public
    ↓
[Home.js] émet 'joinRoom(roomCode, playerName)'
    ↓
[server/index.js] vérifie l'existence et la capacité du salon (max 8 joueurs)
    ↓
[GameRoom.js] ajoute le joueur à la liste
    ↓
Broadcast 'playerJoined' à tous les membres du salon
    ↓
Redirection vers /lobby avec affichage en direct des joueurs et avatars Robohash
```

### 3. Démarrage d'une Partie
```
L'hôte clique sur un jeu ('pmu', 'purple' ou '99')
    ↓
[Lobby.js] émet 'startGame(gameType)'
    ↓
[server/index.js] valide que le demandeur est bien l'hôte
    ↓
[GameRoom.js] instancie le moteur correspondant (PMUGame, PurpleGame ou NinetyNineGame)
    ↓
Broadcast 'gameStarted' à tous les clients du salon
    ↓
[Game.js] monte dynamiquement le composant de jeu adapté
```

### 4. Actions de Jeu & Synchronisation
```
Joueur effectue un coup (pari, carte jouée, prédiction)
    ↓
Le composant de jeu émet 'gameAction(action)'
    ↓
[server/index.js] valide les paramètres côté serveur
    ↓
Le Game Engine traite l'action et mute l'état interne
    ↓
Si pénalité générée -> Émission ciblée 'penalty_received' au joueur concerné
    ↓
Broadcast 'gameStateUpdated' à toute la room avec le nouvel état complet
    ↓
L'interface React se re-rend automatiquement
```

### 5. Chat en Direct
```
Joueur saisit un message et valide
    ↓
[Chat.js] émet 'sendMessage(text)'
    ↓
[server/index.js] horodate et associe l'expéditeur et son avatar
    ↓
Broadcast 'newMessage' à la room
    ↓
Affichage dans le chat OU sous forme de notification flottante (MessagePopup) si replié
```

---

## API Socket.io

### Client → Server

| Événement | Paramètres | Description |
| :--- | :--- | :--- |
| `createRoom` | `playerName` *(string)*, `callback` | Crée un nouveau salon avec un code unique de 6 lettres |
| `joinRoom` | `roomCode` *(string)*, `playerName` *(string)*, `callback` | Rejoint un salon existant |
| `getPublicRooms` | `callback` | Récupère la liste des salons publics disponibles |
| `updateRoomPrivacy` | `isPrivate` *(boolean)* | Bascule la confidentialité du salon (réservé à l'hôte) |
| `startGame` | `gameType` *(string)*, `callback` | Démarre un jeu (`'pmu'`, `'purple'`, `'99'`) |
| `gameAction` | `action` *(object)*, `callback` | Transmet une action de jeu au moteur en cours |
| `sendMessage` | `message` *(string)*, `callback` | Envoie un message dans le chat du salon |
| `playAgain` | `callback` | Remet le salon en état d'attente (lobby) pour relancer une partie |
| `leaveRoom` | `callback` | Quitte proprement le salon (réassigne l'hôte si besoin) |

#### Détail des `gameAction` selon le jeu :

* **PMU** :
  * `{ type: 'placeBet', suit: 'hearts'|'diamonds'|'clubs'|'spades', amount: number }`
  * `{ type: 'startRace' }` (hôte uniquement)
  * `{ type: 'drawCard' }`
* **Purple** :
  * `{ type: 'predict', prediction: 'rouge'|'noir'|'purple' }`
  * `{ type: 'pass' }` (si au moins 2 réussites consécutives)
* **99** :
  * `{ type: 'playCard', card: Object, chosenValue?: number }` (pour l'As : 1 ou 11 ; pour le Valet : 10 ou -10)
  * `{ type: 'viewCount' }` (déclenche 1 gorgée de pénalité)

---

### Server → Client

| Événement | Données reçues | Description |
| :--- | :--- | :--- |
| `playerJoined` | `{ roomData, systemMessage }` | Un nouveau joueur a rejoint le salon |
| `playerLeft` | `{ roomData, systemMessage }` | Un joueur a quitté le salon |
| `roomStateUpdated`| `roomData` | Mise à jour générale du salon (confidentialité, reset) |
| `gameStarted` | `{ gameType, roomData }` | La partie commence, déclenche la navigation vers `/game` |
| `gameStateUpdated`| `roomData` | État complet du jeu mis à jour après une action |
| `penalty_received`| `{ penalties: Array }` | Notifie le joueur qu'il doit boire ou distribuer des gorgées |
| `newMessage` | `{ id, senderId, senderName, text, timestamp }` | Réception d'un message de chat |

---

## Modèles d'État (Game State)

### PMU Game State
```javascript
{
  stage: 'betting' | 'racing' | 'finished',
  players: [
    {
      id: string,
      name: string,
      isHost: boolean,
      hasBet: boolean,
      bets: { [suit]: amount }
    }
  ],
  horses: {
    hearts: { suit: 'hearts', currentPosition: number },   // 0 à 6
    diamonds: { suit: 'diamonds', currentPosition: number },
    clubs: { suit: 'clubs', currentPosition: number },
    spades: { suit: 'spades', currentPosition: number }
  },
  sideCards: [
    { id: number, suit: string, value: string, revealed: boolean } // 5 paliers
  ],
  raceRanking: [
    { suit: string, rank: number } // 1er à 4e
  ],
  lastDrawnCard: Card | null,
  allPlayersHaveBet: boolean,
  cardsRemaining: number,
  history: Array
}
```

### Purple Game State
```javascript
{
  stage: 'playing' | 'finished',
  players: [
    {
      id: string,
      name: string,
      isHost: boolean,
      stackedCards: Array<Card>,
      penalties: number,
      isCurrentPlayer: boolean
    }
  ],
  currentPlayer: Object,
  currentCard: Card | null,
  previousCard: Card | null,
  cardsRemaining: number,
  consecutiveCorrect: number,
  canPass: boolean,
  history: Array
}
```

### NinetyNine (99) Game State
```javascript
{
  stage: 'playing' | 'finished',
  players: [
    {
      id: string,
      name: string,
      isHost: boolean,
      hand: Array<Card>,
      cardCount: number
    }
  ],
  count: number,                 // Total cumulé (0 à 99+)
  currentPlayerIndex: number,
  gameDirection: 1 | -1,         // Sens horaire ou inversé (Dame)
  loser: Object | null,          // Joueur ayant fait dépasser 99
  lastActionMessage: string,     // Feedback textuel de la dernière action
  lastPlayedCard: Card | null,   // Dernière carte posée au centre
  cardsRemaining: number,
  history: Array
}
```

---

## Modèles de Données

### Card
```javascript
{
  suit: 'hearts' | 'diamonds' | 'clubs' | 'spades',
  value: 'A' | '2'-'10' | 'J' | 'Q' | 'K',
  getNumericValue(): number, // 1 à 13
  getColor(): 'red' | 'black',
  toString(): string
}
```

### GameRoom
```javascript
{
  code: string,                  // 6 lettres majuscules
  players: Array<Player>,
  game: PMUGame | PurpleGame | NinetyNineGame | null,
  gameType: 'pmu' | 'purple' | '99' | null,
  status: 'waiting' | 'rules' | 'playing' | 'finished',
  maxPlayers: 8,
  isPrivate: boolean
}
```

---

## Déploiement & Environnement

### Production
* **Frontend** : Hébergé sur **GitHub Pages** via le dossier `/docs/`.
  * Domaine personnalisé : `https://robgame.fr` (fichier `CNAME` injecté automatiquement depuis `client/public/CNAME`).
* **Backend** : Hébergé sur un serveur VPS distant (ou conteneur Docker).
  * URL API : `https://api.robgame.fr`.
  * Reverse proxy HTTPS configuré avec redirection WebSockets `/socket.io`.

### Développement Local
* **Client** : `http://localhost:3000` (démarré avec `npm run dev:client` ou `npm run dev`).
* **Serveur** : `http://localhost:3001` (démarré avec `nodemon server/index.js`).
* Détection automatique de l'URL dans `SocketContext.js` :
  ```javascript
  const SERVER_URL = window.location.hostname === "localhost"
    ? "http://localhost:3001"
    : "https://api.robgame.fr";
  ```

### Variables d'Environnement
* Fichier `.env.development` :
  ```env
  PORT=3001
  NODE_ENV=development
  REACT_APP_SERVER_URL=http://localhost:3001
  ```
* Fichier `.env.production` :
  ```env
  PORT=3001
  NODE_ENV=production
  REACT_APP_SERVER_URL=https://api.robgame.fr
  ```
