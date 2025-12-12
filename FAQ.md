# ❓ FAQ - Questions Fréquemment Posées

## Installation & Setup

### Q: Comment installer l'application?
**R:** Trois options:
1. **Windows:** Double-cliquez `install.bat`
2. **Mac/Linux:** Exécutez `chmod +x install.sh && ./install.sh`
3. **Manuel:** `npm install && cd client && npm install && cd ..`

### Q: Quel version de Node.js faut-il?
**R:** Node.js 16+ est recommandé. Vérifiez avec `node --version`

### Q: Où accéder l'application?
**R:** 
- Développement: `http://localhost:3000` (client) et `http://localhost:3001` (serveur)
- Production: Dépend de votre serveur/domaine

### Q: Pourquoi "port déjà utilisé"?
**R:** Quelque chose utilise déjà le port 3000 ou 3001
- Tuer le processus ou
- Changer le PORT dans `.env`

### Q: Je peux utiliser Windows 11/Mac M1?
**R:** Oui! L'application est compatible avec tous les systèmes.

---

## Utilisation

### Q: Comment créer une partie?
**R:**
1. Entrez votre nom
2. Cliquez "Créer une partie"
3. Partagez le code ou QR code avec vos amis

### Q: Comment rejoindre une partie?
**R:**
- **QR Code:** Scannez avec votre téléphone
- **Code:** Entrez le code (6 caractères) manuellement

### Q: Combien de joueurs maximum?
**R:** 8 joueurs par salle (configurable dans `GameRoom.js`)

### Q: Je peux jouer seul?
**R:** Non, tous les jeux nécessitent au minimum 2 joueurs.

### Q: Que se passe-t-il si quelqu'un se déconnecte?
**R:** Le joueur disparait de la liste. Si c'est le host, les autres restent mais ne peuvent pas relancer.

### Q: Je peux sauvegarder ma partie?
**R:** Non, il n'y a pas de persistance actuellement (données perdues au redémarrage).

---

## Jeux

### PMU
#### Q: Comment fonctionne PMU?
**R:** Pariez sur les chevaux → Regardez-les avancer → Gagnez ou perdez des gorgées

#### Q: Je peux parier sur plusieurs chevaux?
**R:** Oui! Vous avez 5 gorgées à répartir comme vous voulez.

#### Q: Qu'est-ce qu'une "gorgée"?
**R:** Unité de pénalité. C'est vous qui décidez: vraiment boire ou autre gage.

#### Q: Que se passe-t-il si je mise tout sur un cheval?
**R:** Si ce cheval gagne, vous distribuez le DOUBLE (10 gorgées au lieu de 5)

#### Q: Combien de cartes tirées?
**R:** Jusqu'à ce qu'un cheval atteigne 7 cartes (max 52 cartes du deck)

### Purple
#### Q: Comment fonctionne Purple?
**R:** Vous prédisez la couleur/valeur → La carte se retourne → Vous gagnez ou perdez

#### Q: Quelles prédictions sont disponibles?
**R:** 
- 🔴 Rouge (couleur)
- ⚫ Noir (couleur)
- 🟣 Violet (2 cartes différentes)
- ⬆️ Plus (valeur plus haute)
- ⬇️ Moins (valeur plus basse)

#### Q: Quand peut-on utiliser Plus/Moins?
**R:** À partir de la 2e carte seulement (besoin d'une carte précédente)

#### Q: Qu'est-ce que Violet?
**R:** Vous prédisez que les 2 prochaines cartes seront de couleurs différentes

#### Q: Comment marche la pénalité?
**R:** Pénalité = nombre de cartes empilées devant vous
- 1 carte → 1 pénalité
- 3 cartes → 3 pénalités
- 5 cartes → 5 pénalités

#### Q: Je peux passer mon tour?
**R:** Oui! Après 3 bonnes prédictions consécutives, vous pouvez choisir de passer.

#### Q: Qu'est-ce que "empiler"?
**R:** Les cartes correctes s'accumulent devant vous en pile.

---

## Technique

### Q: Quel framework utilise l'app?
**R:** 
- Frontend: React 18 + React Router
- Backend: Node.js + Express + Socket.io

### Q: Comment la communication marche?
**R:** WebSocket via Socket.io. Temps réel, bidirectionnel.

### Q: Comment les cartes sont générées?
**R:** Un deck de 52 cartes standard, mélangé via l'algorithme Fisher-Yates.

### Q: Où sont stockées les données?
**R:** En mémoire serveur seulement. Aucune base de données.

### Q: Je peux déployer sur heroku/vercel?
**R:** 
- Heroku: ✅ Oui (avec buildpack Node.js)
- Vercel: ❌ Non (API seulement, besoin serveur)
- AWS: ✅ Oui (EC2/ECS)
- Docker: ✅ Oui (Dockerfile inclus)

### Q: Comment ajouter un nouveau jeu?
**R:** 
1. Créer `server/games/MonJeuGame.js`
2. Importer dans `server/GameRoom.js`
3. Créer `client/src/components/games/MonJeu.js`
4. Ajouter le bouton dans `Lobby.js`
5. Lire `CONTRIBUTING.md` pour détails

### Q: Je peux modifier le design?
**R:** Oui! Les fichiers `.css` sont modifiables. Consultez les pages pour voir la structure.

### Q: Où mettre mes secrets (API keys)?
**R:** Dans `.env` (ne pas commiter). Exemple dans `.env.example`.

---

## Dépannage

### Q: "Cannot GET /"
**R:** 
- Client React ne démarre pas
- Vérifiez: `npm run dev:client`
- Port 3000 utilisé? Vérifiez avec `lsof -i :3000`

### Q: "Socket.io connection refused"
**R:**
- Serveur Node.js ne tourne pas
- Vérifiez: `npm run dev:server`
- Port 3001 utilisé? Vérifiez avec `lsof -i :3001`

### Q: Les joueurs ne se voient pas
**R:**
- Vérifiez que tous les clients se connectent à la même room
- Vérifiez DevTools (F12) pour erreurs Socket.io
- Redémarrez serveur et clients

### Q: QR code ne s'affiche pas
**R:**
- Vérifiez que `qrcode.react` est installé
- npm install (si besoin)
- Redémarrez le client

### Q: Une partie ne progresse plus
**R:**
- Attendez (peut être un lag réseau)
- Rechargez le navigateur
- Redémarrez la partie

### Q: Erreur "CORS"
**R:** 
- En développement: Normale (CORS ouvert)
- En production: Configurez CORS dans `server/index.js`

### Q: Les styles CSS ne s'appliquent pas
**R:**
- Vérifiez que les fichiers CSS existent
- Redémarrez le client React
- Vérifiez import dans les fichiers JS

---

## Performance

### Q: C'est normal que ça soit lent?
**R:** 
- Première charge: ~3-5 secondes (normal)
- Jeu: Doit être fluide
- Si lag: Vérifiez votre connexion réseau

### Q: Combien de joueurs le serveur peut gérer?
**R:** Actuellement illimité théoriquement, mais:
- Recommandé: <10 salles simultanées
- Pour plus: Considérez un database + load balancer

### Q: Quelle bande passante nécessaire?
**R:** Très peu! WebSocket est efficace. ~1KB par action de jeu.

---

## Sécurité

### Q: C'est sûr de jouer?
**R:** 
- Développement: À usage personnel/local seulement
- Production: À sécuriser (authentification, HTTPS, etc.)

### Q: Mes données sont sauvegardées?
**R:** Non! Aucune sauvegarde. À relancer la partie = données perdues.

### Q: Je peux attaquer l'app?
**R:** 
- Rate limiting: Non implémenté (à faire)
- SQL injection: N/A (pas de database)
- XSS: Possible en dev (à valider en prod)

### Q: Comment déployer en sécurisé?
**R:** Lire `ARCHITECTURE.md` section "Sécurité"

---

## Contribution

### Q: Je peux ajouter une fonctionnalité?
**R:** Oui! Lire `CONTRIBUTING.md`

### Q: Je peux ajouter un nouveau jeu?
**R:** Oui! Lire `CONTRIBUTING.md` section "Ajouter un Nouveau Jeu"

### Q: Comment tester mon code?
**R:** Lire `TESTING.md`. Tests manuels fournis.

### Q: Je veux que vous fassiez une fonctionnalité?
**R:** Créez une issue avec une description claire.

---

## Divers

### Q: Pourquoi "Jeux de Soirée"?
**R:** Car c'est fait pour jouer entre amis le soir! 🎉

### Q: C'est open source?
**R:** Oui! Licence MIT. Lire `README.md`

### Q: Je peux l'utiliser commercialement?
**R:** Oui, selon licence MIT. Lire le fichier LICENSE (si présent)

### Q: Qui a créé ça?
**R:** Créé pour vous par Théo avec ❤️

### Q: Comment contribuer financièrement?
**R:** Partagez le projet et dites aux autres! 😊

---

## Besoin d'Aide Supplémentaire?

**Consultez:**
1. `QUICKSTART.md` - Pour démarrer
2. `RULES.md` - Pour comprendre les jeux
3. `ARCHITECTURE.md` - Pour les détails techniques
4. `CONTRIBUTING.md` - Pour aider au projet
5. Ouvrez une issue sur GitHub

**Commandes Utiles:**
```bash
npm run dev          # Lancer l'app
npm run build        # Builder pour prod
npm install          # Installer dépendances
./debug.sh          # Diagnostic
```

---

**Dernière mise à jour:** 8 décembre 2025
**Version:** 1.0.0

Amusez-vous bien! 🎮🎉
