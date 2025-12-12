---
applyTo: '*App-jeux-soiree*'
---
Le but de cette application est de poposer differents jeux pour jouer à plusieur en soirée. 
Le jeux se jour sur telephone ou tablette sur une page web. Le serveur hébergeant la page web sera un ordinateur local ou un hebergement web.

On doit pouvoir se connecter à plusieur sur la meme partie avec un hote de la partie à l'aide d'un code ou d'un qr code que l'on scan, choisir un jeu, lire les règles et lancer une partie.
Les jeux proposés sont des jeux de société classique ou des jeux d'ambiance.
Voici les differents jeux à implémenter dans l'application:

- PMU :
Pariez sur un As et regardez-le avancer comme un cheval de course : mettez vos pénalités, le premier à franchir la ligne fait perdre les autres !

Mise en place :
Utilisez un jeu de 52 cartes
Triez les 4 As et placez les faces visibles sur la table (ce sont les « chevaux »)
Mélangez le reste du paquet et placez les faces cachées
Chaque joueur dispose de 5 gorgées à distribuer comme mises

Règles du jeu :
Chaque As représente un cheval d'une couleur (Cœur, Carreau, Trèfle, Pique)
Avant le début de la course, les joueurs mettent leurs gorgées sur le ou les chevaux de leur choix
Le croupier retourne ensuite les cartes du paquet une par une
À chaque carte retournée, le cheval de la même couleur avance d'une case
Le premier cheval (As) qui atteint 7 cartes de sa couleur gagne la course
Les joueurs ayant misé sur le cheval gagnant distribuent leurs gorgées aux autres joueurs
Les joueurs ayant misé sur les chevaux perdants restituent les gorgées qu'ils avaient mises

Points importants :
On peut répartir ses 5 gorgées sur plusieurs chevaux
Si un joueur met toutes ses gorgées sur le cheval gagnant, il peut distribuer le double

- Purple:
Devinez la couleur ou la valeur de la prochaine carte pour enchaîner les bonnes réponses: chaque erreur vous fait prendre autant de pénalités que de cartes empilées!

Mise en place :
Utilisez un jeu de 52 cartes
Mélangez bien les cartes et placez le paquet face cachée au centre
Préparez les pénalités avant de commencer le jeu

Règles du jeu :
À son tour, le joueur doit deviner quelque chose à propos de la prochaine carte qui sera retournée

Le joueur a cinq options pour sa prédiction :
  Rouge: prédire que la carte sera rouge (Cœur ou Carreau)
  Noir: prédire que la carte sera noire (Pique ou Trèfle)
  Purple: prédire que les deux prochaines cartes seront de couleurs différentes (rouge puis noir ou l'inverse)
  Plus: prédire que la valeur de la carte sera supérieure à celle de la carte précédente (disponible à partir de la deuxième carte)
  Moins: prédire que la valeur de la carte sera inférieure à celle de la carte précédente (disponible à partir de la deuxième carte)

Après avoir annoncé sa prédiction, le joueur retourne la carte supérieure du paquet
Si la prédiction est correcte, le joueur empile la carte devant lui et continue à jouer
Le but est d'enchaîner un maximum de bonnes prédictions
Après 3 bonnes prédictions consécutives, le joueur peut choisir de passer son tour au joueur suivant
Si le joueur se trompe, il prend autant de pénalités qu'il y a de cartes empilées devant lui, puis défausse les cartes

Points importants :
Pour les valeurs des cartes: As = 1, Valet = 11, Dame = 12, Roi = 13
La prédiction Purple nécessite de deviner correctement deux cartes consécutives
Les prédictions Plus/Moins ne sont disponibles qu'à partir de la deuxième carte empilée (Logique mdr)
Plus la séquence est longue, plus le risque de pénalités est élevé

d'autres jeux peuvent être ajoutés ultérieurement.