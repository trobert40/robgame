# Changelog

Tous les changements notables de ce projet seront documentés dans ce fichier.

## [1.0.0] - 2025-12-08

### Ajouté
- ✨ Application web initiale avec React
- 🎮 Jeu PMU (Course de Chevaux)
  - Système de paris avec gorgées
  - Animation progressive des chevaux
  - Calcul automatique des gagnants et perdants
- 🟣 Jeu Purple (Devinez la Carte)
  - 5 types de prédictions (Rouge, Noir, Violet, Plus, Moins)
  - Système d'empilage de cartes
  - Pénalités basées sur le nombre d'erreurs
- 🔌 Système multiplayer via Socket.io
  - Création de salons avec codes uniques
  - QR code pour rejoindre facilement
  - Synchronisation d'état en temps réel
- 📱 Interface responsive
  - Support mobile complet
  - Design moderne avec gradient
  - Animations fluides
- 📚 Documentation complète
  - Guide de démarrage rapide
  - Architecture technique
  - Règles détaillées des jeux
- 🐳 Configuration Docker
  - Dockerfile pour déploiement
  - Docker Compose pour développement

### À Faire (Futures versions)

#### v1.1.0 - Fonctionnalités Sociales
- [ ] Chat en temps réel dans la salle
- [ ] Profils joueurs basiques
- [ ] Statistiques de joueur (victoires/défaites)
- [ ] Système de classement

#### v1.2.0 - Jeux Supplémentaires
- [ ] Jeu 3: Président/Trou du cul
- [ ] Jeu 4: Bataille navale
- [ ] Jeu 5: Menteur

#### v1.3.0 - Améliorations UI/UX
- [ ] Thème sombre/clair
- [ ] Animations plus fluides
- [ ] Son et vibrations
- [ ] Emojis personnalisés

#### v2.0.0 - Authentification & Persistance
- [ ] Authentification utilisateur
- [ ] Sauvegarde des profils
- [ ] Base de données
- [ ] Historique des parties
- [ ] Achievements/Trophées

### Changements Techniques

#### Stack
- React 18.2
- Node.js + Express
- Socket.io 4.5
- QR Code generation
- CSS3 moderne

#### Architecture
- Pattern Context pour état global
- Custom hooks pour Socket.io
- Séparation serveur/client
- Game engines modulaires

### Limitations Connues
- [ ] Pas de persistance de données (redémarrage = perte de partie)
- [ ] Pas d'authentification
- [ ] Un seul serveur (pas de scaling horizontal)
- [ ] Pas de base de données
- [ ] Pas de chat

### Sécurité
- ⚠️ CORS ouvert (à restreindre en production)
- ⚠️ Pas de validation entrée stricte
- ⚠️ Pas de rate limiting
- ⚠️ Pas de chiffrement

## [0.1.0] - 2025-12-07 (Template Initial)

### Ajouté
- Structure du projet
- Configuration npm
- Dépendances de base
