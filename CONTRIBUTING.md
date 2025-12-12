# 🤝 Guide de Contribution

Merci de votre intérêt pour contribuer à App Jeux Soirée!

## Code de Conduite

- Respectez les autres contributeurs
- Testez votre code avant de soumettre
- Soyez bienveillant dans vos reviews
- Documentez vos changements

## Avant de Commencer

1. **Fork** le repository
2. **Clone** votre fork
3. Créez une **branche** pour votre feature:
```bash
git checkout -b feature/nom-de-la-feature
```

## Processus de Développement

### 1. Environnement de Développement
```bash
npm run install:all  # Installer les dépendances
npm run dev          # Démarrer le développement
```

### 2. Effectuer vos Changements

#### Structure du Code
```
- Chaque jeu = Un fichier dans /server/games/
- Chaque page = Un fichier dans /client/src/pages/
- Composants réutilisables = /client/src/components/
- Styles = Fichiers .css côte à côte avec composants
```

#### Conventions de Nommage
- **Fichiers**: PascalCase.js pour composants React
- **Fichiers**: camelCase.js pour utilitaires
- **Variables**: camelCase
- **Constantes**: UPPER_SNAKE_CASE
- **Fonctions**: camelCase

#### Style de Code
```javascript
// ✅ BON
const handleClick = (event) => {
  console.log('Clicked!');
};

// ❌ MAUVAIS
const handleclick=()=>{console.log('Clicked!')}

// ✅ BON
if (player.gorgees > 0) {
  distributeGorgees(player);
}

// ❌ MAUVAIS
if(player.gorgees>0){distributeGorgees(player);}
```

### 3. Tester votre Code

```bash
# Tester dans le navigateur
npm run dev

# Ouvrir http://localhost:3000

# Tester avec plusieurs clients
# Ouvrir plusieurs onglets/fenêtres
```

### 4. Commit et Push

```bash
# Voir vos changements
git status

# Ajouter les fichiers
git add .

# Commit avec message clair
git commit -m "feat: Ajouter le jeu XYZ"

# Push vers votre fork
git push origin feature/nom-de-la-feature
```

### 5. Pull Request

1. Allez sur GitHub
2. Créez une Pull Request
3. Décrivez vos changements
4. Attendez la review

## Types de Changements

### 🎮 Ajouter un Nouveau Jeu

1. Créer `/server/games/NouveauJeuGame.js`:
```javascript
class NouveauJeuGame {
  constructor(players) {
    this.players = players;
    this.stage = 'playing';
    this.history = [];
  }

  getState() {
    return {
      stage: this.stage,
      players: this.players,
      history: this.history
    };
  }

  handleAction(playerId, action) {
    // Votre logique
  }
}

module.exports = NouveauJeuGame;
```

2. Importer dans `/server/GameRoom.js`:
```javascript
const NouveauJeuGame = require('./games/NouveauJeuGame');
```

3. Ajouter dans la logique de startGame:
```javascript
if (gameType === 'nouveaujeu') {
  this.game = new NouveauJeuGame(this.players);
}
```

4. Créer `/client/src/components/games/NouveauJeu.js`
5. Ajouter le bouton dans `/client/src/pages/Lobby.js`

### 🎨 Améliorations UI

- Respectez le design actuel (gradient bleu/violet)
- Testez sur mobile
- Assurez-vous que c'est accessible
- Pas de breaking changes sur layout existant

### 🔧 Corrections de Bugs

1. Créer une issue pour documenter le bug
2. Référencer l'issue dans votre PR
3. Tester la correction
4. Ajouter des commentaires si nécessaire

### 📚 Documentation

- Mettez à jour README.md si nécessaire
- Documentez les APIs Socket.io
- Ajoutez des exemples si complexe
- Vérifiez les liens (ils changent!)

## Checklist avant Submission

- [ ] Code testé localement
- [ ] Pas d'erreurs console
- [ ] Pas de `console.log` de debug
- [ ] Code formaté proprement
- [ ] Messages de commit clairs
- [ ] Documentation mise à jour
- [ ] Pas de changements inutiles

## Structure des Messages de Commit

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types
- **feat**: Nouvelle fonctionnalité
- **fix**: Correction de bug
- **docs**: Changements de documentation
- **style**: Formatage, missing semicolons, etc
- **refactor**: Restructuration de code
- **perf**: Améliorations de performance
- **test**: Ajout/modification de tests
- **chore**: Dépendances, configuration

### Exemples
```
feat(pmu): Ajouter animation du cheval

fix(purple): Corriger calcul des pénalités

docs: Mettre à jour RULES.md

refactor: Simplifier logique PlayerList
```

## Questions de Design

### Ajouter une Nouvelle Page
- Créer dans `/client/src/pages/`
- Importer dans `App.js`
- Ajouter route React Router
- Créer fichier CSS associé

### Ajouter un Nouvel Événement Socket
- Définir dans `/server/index.js`
- Documenter dans `ARCHITECTURE.md`
- Ajouter dans `SocketContext.js` côté client
- Tester bidirectionnellement

### Ajouter une Nouvelle Dépendance
- ⚠️ Demander en issue d'abord
- Documenter pourquoi
- Vérifier la taille
- Vérifier les vulnérabilités (`npm audit`)

## Performance

- Évitez les re-renders inutiles (React.memo)
- Pas de listeners non-nettoyés
- Limit broadcast Socket.io à room spécifique
- Pas de gros fichiers transférés

## Sécurité

- Validez les inputs côté serveur
- Pas de secrets en hardcoded
- Pas de données sensibles en localStorage
- Utilisez HTTPS en production

## Aider sans Coder

- Rapporter des bugs détaillés
- Suggérer des améliorations
- Améliorer la documentation
- Tester sur différents navigateurs/devices

## Besoin d'Aide?

1. Vérifiez `QUICKSTART.md` et `ARCHITECTURE.md`
2. Créez une issue avec vos questions
3. Cherchez dans les issues existantes

## Remerciements

Merci de contribuer! Chaque contribution aide à rendre ce projet meilleur! 🙏

---

**Heureux de coder!** ✨
