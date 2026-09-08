# 💡 Boîte à Idées & Roadmap - RobGame

Ce document regroupe toutes les idées d'extensions, nouveaux jeux et améliorations d'expérience utilisateur (UX) imaginées pour les futures versions de RobGame.

---

## 🎮 1. Nouveaux Jeux Multijoueurs (Soirée)

Les assets d'icônes pour plusieurs de ces jeux sont déjà disponibles dans `client/public/assets/jeux/` :

### 🔺 La Pyramide (`pyramide.png`)

- **Concept** : Un classique absolu des soirées étudiantes.
- **Mécanique** :
  1. _Distribution_ : Chaque joueur reçoit 4 cartes en main (visibles uniquement par lui).
  2. _La Pyramide_ : Une pyramide de cartes face cachée est disposée au centre (ex: 5 étages : 5, 4, 3, 2, 1 cartes).
  3. _Montée des marches_ : On retourne les cartes étage par étage. À chaque carte retournée, si un joueur prétend avoir cette valeur dans sa main, il peut donner des gorgées à un autre joueur (1 gorgée au 1er étage, 2 au 2e, etc.).
  4. _Bluff & Contre-bluff_ : La cible peut boire ou crier au bluff ! Si le donneur a menti, il boit double ; s'il disait vrai, la cible boit double.

### 🌊 La Rivière (`riviere.png`)

- **Concept** : Un joueur tente de traverser une ligne de cartes face cachée sans tomber à l'eau.
- **Mécanique** :
  - Une ligne de cartes est posée. Le joueur doit deviner si la carte suivante est plus grande, plus petite, rouge ou noire.
  - À la moindre erreur, il boit et recommence depuis le début de la rivière avec de nouvelles cartes !

### 👑 Le Président / Trou du Cul (`president.png`)

- **Concept** : Jeu de défausse et de hiérarchie sociale avec cartes de 3 au 2 (le 2 étant la plus forte).
- **Rôles** : Président, Vice-Président, Neutres, Vice-Trou du Cul, Trou du Cul.
- **Règle des impôts** : En début de manche, le Trou du Cul donne ses meilleures cartes au Président et vice-versa.

### 🍺 Le Barbu / Le Roi des Buveurs (King's Cup / Cercle de la mort)

- **Concept** : Les cartes sont disposées en cercle autour d'un verre central. Chaque carte tirée correspond à une règle universelle :
  - **As** : _Cascade_ (tout le monde boit en continu jusqu'à ce que le joueur précédent s'arrête).
  - **7** : _Dans ma valise_ (jeu de mémoire collectif).
  - **8** : _Partenaire de boisson_ (choisir un binôme qui boit en même temps).
  - **Valet** : _Les gars boivent_.
  - **Dame** : _Les filles boivent_.
  - **Roi** : _Inventer une règle_ ou verser une gorgée dans le verre central (le 4e Roi boit le tout).

### 🃏 Le Menteur (Bluff)

- **Concept** : Chaque joueur pose des cartes face cachée en annonçant une valeur (ex: « Deux Dames »). Les autres peuvent annoncer « Menteur ! » pour vérifier.

---

## 🕹️ 2. Autres Idées de Jeux Solo

- **2048** : Puzzle numérique classique jouable directement au clavier ou au swipe mobile.
- **Memory (Jeu de paires)** : Retrouver les paires de cartes identiques le plus vite possible avec les SVG du jeu.
- **Bataille contre une IA** : Un duel de cartes simple et rapide contre l'ordinateur.

---

## ✨ 3. Améliorations UX & Ambiance de Soirée

### 💾 Mémorisation automatique du pseudo (`localStorage`)

- Sauvegarder automatiquement le nom saisi dans le navigateur.
- À chaque retour sur le site, le champ « Votre nom » est déjà pré-rempli.

### 🔊 Sons & Vibrations Mobile

- Effets sonores facultatifs (bruit de cartes qui claquent, bruit de chope qui trinque, sirène de fin de partie).
- Utilisation de l'API standard `navigator.vibrate([100, 50, 100])` pour faire vibrer le téléphone quand c'est votre tour de jouer ou quand vous recevez une pénalité.

### 👁️ Mode Spectateur

- Permettre aux joueurs qui arrivent en cours de partie (au PMU ou au 99) de rejoindre la table en tant que simples spectateurs sans attendre au lobby et sans bloquer le déroulement de la manche.

### 🎡 La Roue des Gages

- Option pour remplacer ou compléter les gorgées : quand un joueur perd (ex: au 99 ou dernier au PMU), une roue interactive tourne avec des petits gages personnalisables (imiter quelqu'un, chanter un refrain, faire 10 pompes...).

### 🏆 Statistiques & Profils Locaux

- Compteur de victoires / défaites par joueur stocké localement.
- Titre honorifique affiché à côté du pseudo (ex: « Champion du PMU », « Survivant du 99 »).
