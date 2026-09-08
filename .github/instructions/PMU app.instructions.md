C'est un super projet ! Le PMU est un classique. Pour rendre le jeu "plus propre" et fidèle à l'image que tu as fournie (le placement vertical des cartes sur le côté), nous devons passer d'une barre de progression horizontale à une piste de course verticale.
Je vais refaire le CSS pour un look "Table de jeu" (style tapis vert ou violet sombre selon ton thème) et réécrire le composant React pour gérer l'affichage des cartes et la logique visuelle.
Voici la refonte complète.
1. La Logique et l'Affichage (PMU.js)
J'ai réorganisé le composant pour qu'il affiche :
1. La colonne de gauche (les 5 cartes de "paliers").
2. La piste de course (4 colonnes pour les As).
3. La pioche (le paquet restant).
4. L'interface de pari plus claire.


JavaScript




import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSocket } from '../../hooks/useSocket';
import './PMU.css';

// Petit composant pour afficher une carte jolie (CSS only)
const Card = ({ suit, value, flipped, isBack, small }) => {
 const getSuitColor = (s) => (s === 'hearts' || s === 'diamonds' ? 'red' : 'black');
 const getSuitIcon = (s) => {
   switch(s) {
     case 'hearts': return '♥';
     case 'diamonds': return '♦';
     case 'clubs': return '♣';
     case 'spades': return '♠';
     default: return '';
   }
 };

 if (isBack || flipped === false) {
   return (
     <div className={`playing-card back ${small ? 'small' : ''}`}>
       <div className="pattern"></div>
     </div>
   );
 }

 return (
   <div className={`playing-card ${getSuitColor(suit)} ${small ? 'small' : ''}`}>
     <div className="card-top">{value} {getSuitIcon(suit)}</div>
     <div className="card-center">{getSuitIcon(suit)}</div>
     <div className="card-bottom">{value} {getSuitIcon(suit)}</div>
   </div>
 );
};

const PMU = ({ gameState }) => {
 const { sendGameAction, playAgain, leaveRoom, socket } = useSocket();
 const navigate = useNavigate();
 const [selectedHorse, setSelectedHorse] = useState(null);
 const [betAmount, setBetAmount] = useState(1);

 const self = gameState?.players.find(p => p.id === socket?.id);
 const isHost = self?.isHost;

 const suitsConfig = {
   hearts: { name: 'Cœur', emoji: '❤️', color: 'red' },
   diamonds: { name: 'Carreau', emoji: '💎', color: 'red' },
   clubs: { name: 'Trèfle', emoji: '♣️', color: 'black' },
   spades: { name: 'Pique', emoji: '♠️', color: 'black' }
 };

 const handleLeave = async () => {
   await leaveRoom();
   navigate('/');
 };

 const handlePlaceBet = async () => {
   if (selectedHorse && !self.hasBet) {
     await sendGameAction({ type: 'placeBet', suit: selectedHorse, amount: betAmount });
   }
 };

 const handleStartRace = async () => {
   await sendGameAction({ type: 'startRace' });
 };

 const handleDrawCard = async () => {
   await sendGameAction({ type: 'drawCard' });
 };

 if (!gameState) return <div className="pmu-loading">Mise en place de la table...</div>;

 // --- RENDERERS ---

 const renderSideCards = () => {
   // Supposons que gameState.sideCards est un tableau de 5 cartes
   // Si ton serveur ne l'envoie pas encore, il faudra l'ajouter.
   // Pour l'instant, on simule l'affichage des paliers 1 à 5.
   const steps = [5, 4, 3, 2, 1]; 
   
   return (
     <div className="side-cards-column">
       {steps.map((step, index) => {
         // Logique pour trouver si la carte latérale est retournée
         // (À adapter selon ton backend: gameState.sideCards[index])
         const sideCardData = gameState.sideCards ? gameState.sideCards[index] : null;
         
         return (
           <div key={step} className="side-step" style={{ gridRow: step }}>
              <div className="step-label">Palier {index + 1}</div>
              <div className="side-card-wrapper">
                {sideCardData && sideCardData.revealed ? (
                  <Card suit={sideCardData.suit} value={sideCardData.value} />
                ) : (
                  <Card isBack={true} />
                )}
              </div>
           </div>
         );
       })}
     </div>
   );
 };

 const renderRaceTrack = () => {
   return (
     <div className="race-track-grid">
       {/* Lignes de la grille (les paliers) */}
       {[5, 4, 3, 2, 1, 0].map(row => (
         <div key={row} className="track-row" style={{ gridRow: 6 - row }}></div>
       ))}

       {/* Les Chevaux (As) */}
       {Object.entries(gameState.horses).map(([suitKey, horse]) => {
         // Calcul de la position : 0 (départ) -> 6 (arrivée)
         // On inverse pour le CSS Grid (Row 1 est en haut)
         // Si position = 0, on est tout en bas.
         const position = horse.currentPosition || horse.cardsDrawn || 0; 
         const visualRow = 6 - position; // 6 lignes totales

         return (
           <div key={suitKey} className="horse-lane">
             <div 
               className="horse-card-container"
               style={{ 
                 transform: `translateY(${visualRow * 100 - 550}%)`, // Animation fluide
                 transition: 'transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)'
               }}
             >
               <Card suit={suitKey} value="A" />
               <div className="horse-shadow"></div>
             </div>
           </div>
         );
       })}
     </div>
   );
 };

 const renderResults = () => (
   <div className="results-panel">
     <h2>🏆 Fin de la Course ! 🏆</h2>
     <div className="ranking-list">
       {gameState.raceRanking.map(({ suit, rank }) => {
         let actionText = "";
         if(rank === 1) actionText = "Distribue 2x sa mise !";
         if(rank === 2) actionText = "Distribue sa mise.";
         if(rank === 3) actionText = "Boit sa mise.";
         if(rank === 4) actionText = "Boit 2x sa mise.";

         return (
           <div key={suit} className={`rank-item rank-${rank}`}>
             <span className="rank-num">#{rank}</span>
             <span className="rank-suit">{suitsConfig[suit].emoji} {suitsConfig[suit].name}</span>
             <span className="rank-action">{actionText}</span>
           </div>
         );
       })}
     </div>
     
     {/* Affichage des conséquences pour le joueur courant */}
     <div className="my-result">
        {(() => {
          const myBet = self.bets ? Object.entries(self.bets)[0] : null;
          if(!myBet) return null;
          const [betSuit, betVal] = myBet;
          const horseRank = gameState.raceRanking.findIndex(r => r.suit === betSuit) + 1;
          
          return (
            <div className="player-outcome">
              <p>Tu as parié {betVal} gorgée(s) sur {suitsConfig[betSuit].emoji}.</p>
              <p className="outcome-text">
                Le cheval est arrivé <strong>#{horseRank}</strong>.
                {horseRank === 1 && <span className="win"> Tu distribues {betVal * 2} gorgées !</span>}
                {horseRank === 2 && <span className="win"> Tu distribues {betVal} gorgée(s).</span>}
                {horseRank === 3 && <span className="loose"> Tu bois {betVal} gorgée(s).</span>}
                {horseRank === 4 && <span className="loose"> Tu bois {betVal * 2} gorgées.</span>}
              </p>
            </div>
          );
        })()}
     </div>

     <div className="end-actions">
       <button onClick={handleLeave} className="btn secondary">Quitter</button>
       {isHost && <button onClick={playAgain} className="btn primary">Rejouer</button>}
     </div>
   </div>
 );

 return (
   <div className="pmu-wrapper">
     {gameState.stage === 'finished' && <div className="overlay">{renderResults()}</div>}
     
     <div className="pmu-table">
       {/* En-tête : Dernière carte tirée */}
       <div className="game-info-bar">
         <div className="deck-area">
            <h3>Pioche</h3>
            {gameState.lastDrawnCard ? (
               <div className="drawn-card-display">
                  <Card suit={gameState.lastDrawnCard.suit} value={gameState.lastDrawnCard.value} />
                  <p className="last-action-text">
                    {suitsConfig[gameState.lastDrawnCard.suit].name} avance !
                  </p>
               </div>
            ) : (
              <Card isBack={true} />
            )}
         </div>
         
         <div className="game-status">
           <h1>PMU</h1>
           <p>{gameState.stage === 'betting' ? 'FAITES VOS JEUX' : 'LA COURSE EST LANCÉE'}</p>
         </div>
       </div>

       {/* Zone centrale : Piste + Cartes Coté */}
       <div className="race-area">
         <div className="side-track">
           {renderSideCards()}
         </div>
         <div className="main-track">
            {renderRaceTrack()}
         </div>
       </div>

       {/* Zone du bas : Contrôles */}
       <div className="controls-area">
         {gameState.stage === 'betting' ? (
           !self.hasBet ? (
             <div className="betting-ui">
               <h3>Choisis ton champion</h3>
               <div className="suit-selector">
                 {Object.keys(suitsConfig).map(key => (
                   <button 
                     key={key}
                     className={`suit-btn ${selectedHorse === key ? 'active' : ''} ${suitsConfig[key].color}`}
                     onClick={() => setSelectedHorse(key)}
                   >
                     {suitsConfig[key].emoji}
                   </button>
                 ))}
               </div>
               {selectedHorse && (
                 <div className="amount-selector">
                   <span>Mise : {betAmount} 🍺</span>
                   <input 
                     type="range" min="1" max="10" 
                     value={betAmount} 
                     onChange={(e) => setBetAmount(parseInt(e.target.value))} 
                   />
                   <button onClick={handlePlaceBet} className="btn confirm">Valider le pari</button>
                 </div>
               )}
             </div>
           ) : (
             <div className="waiting-msg">Pari validé ! En attente des autres...</div>
           )
         ) : (
           <div className="race-controls">
              {/* Bouton pour piocher (généralement n'importe qui peut cliquer ou juste le host) */}
              <button onClick={handleDrawCard} className="btn big-btn pulse">
                Piocher une carte
              </button>
           </div>
         )}

         {isHost && gameState.stage === 'betting' && (
           <button 
             className="btn start-race" 
             disabled={!gameState.allPlayersHaveBet}
             onClick={handleStartRace}
           >
             Lancer la course
           </button>
         )}
       </div>
     </div>
   </div>
 );
};

export default PMU;

2. Le Style "Casino/Propre" (PMU.css)
J'utilise des variables CSS pour un thème cohérent, des animations fluides et du CSS Grid pour le placement parfait.


CSS




:root {
 --table-green: #2d5a3f;
 --table-dark: #1e3c2b;
 --gold: #d4af37;
 --card-white: #f5f5f5;
 --red-suit: #e74c3c;
 --black-suit: #2c3e50;
 --felt-texture: repeating-linear-gradient(
   45deg,
   transparent,
   transparent 10px,
   rgba(0, 0, 0, 0.03) 10px,
   rgba(0, 0, 0, 0.03) 20px
 );
}

.pmu-wrapper {
 width: 100%;
 height: 100vh; /* Prend tout l'écran */
 background-color: var(--table-green);
 background-image: var(--felt-texture), radial-gradient(circle at center, #356b4b 0%, #1a3324 100%);
 color: white;
 display: flex;
 flex-direction: column;
 overflow: hidden;
 font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

/* --- CARTE CSS GENERIQUE --- */
.playing-card {
 width: 60px;
 height: 84px;
 background: var(--card-white);
 border-radius: 6px;
 position: relative;
 box-shadow: 0 2px 5px rgba(0,0,0,0.3);
 display: flex;
 flex-direction: column;
 justify-content: space-between;
 padding: 5px;
 font-weight: bold;
 font-size: 14px;
 user-select: none;
 transition: transform 0.3s;
}

.playing-card.small {
 width: 40px;
 height: 56px;
 font-size: 10px;
}

.playing-card.red { color: var(--red-suit); }
.playing-card.black { color: var(--black-suit); }

.playing-card.back {
 background: #fff;
 padding: 4px;
}

.playing-card.back .pattern {
 width: 100%;
 height: 100%;
 background: repeating-linear-gradient(45deg, #b71c1c 0, #b71c1c 5px, #fff 5px, #fff 7px);
 border-radius: 4px;
}

.card-center {
 position: absolute;
 top: 50%;
 left: 50%;
 transform: translate(-50%, -50%);
 font-size: 1.8em;
}
.card-bottom { transform: rotate(180deg); }

/* --- LAYOUT --- */
.pmu-table {
 flex: 1;
 display: flex;
 flex-direction: column;
 padding: 20px;
 max-width: 1200px;
 margin: 0 auto;
 width: 100%;
}

.game-info-bar {
 display: flex;
 justify-content: space-between;
 align-items: center;
 margin-bottom: 20px;
}

.game-status h1 {
 font-size: 3em;
 color: var(--gold);
 text-shadow: 2px 2px 0px rgba(0,0,0,0.5);
 margin: 0;
 text-align: center;
}

.drawn-card-display {
 display: flex;
 align-items: center;
 gap: 15px;
 animation: popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

@keyframes popIn {
 from { transform: scale(0); opacity: 0; }
 to { transform: scale(1); opacity: 1; }
}

/* --- RACE AREA (VERTICALE) --- */
.race-area {
 flex: 1;
 display: flex;
 gap: 40px;
 justify-content: center;
 perspective: 1000px;
}

/* Colonne des cartes latérales */
.side-track {
 display: flex;
 flex-direction: column-reverse; /* Du bas (départ) vers le haut */
 justify-content: space-evenly;
 margin-right: 20px;
 position: relative;
}

.side-step {
 display: flex;
 align-items: center;
 gap: 10px;
 height: 84px; /* Hauteur d'une carte */
}

.step-label {
 font-size: 0.8em;
 opacity: 0.7;
 text-align: right;
 width: 60px;
}

/* Piste principale */
.main-track {
 display: flex;
 gap: 20px; /* Espace entre les couloirs */
 border-bottom: 4px solid var(--gold); /* Ligne de départ */
 border-top: 4px dashed rgba(255,255,255,0.3); /* Ligne d'arrivée */
 padding: 0 20px;
 background: rgba(0,0,0,0.1);
 border-radius: 10px;
 position: relative;
 height: 500px; /* Hauteur fixe pour la course */
 align-items: flex-end; /* Chevaux partent du bas */
}

.horse-lane {
 width: 60px;
 height: 100%;
 position: relative;
 border-right: 1px dashed rgba(255,255,255,0.1);
}
.horse-lane:last-child { border-right: none; }

.horse-card-container {
 position: absolute;
 bottom: 0; /* Position initiale */
 left: 0;
 z-index: 10;
 /* L'animation se fait via transform dans le JS */
}

.horse-shadow {
 width: 60px;
 height: 10px;
 background: rgba(0,0,0,0.5);
 border-radius: 50%;
 margin-top: -5px;
 filter: blur(2px);
}

/* --- CONTROLS --- */
.controls-area {
 margin-top: 20px;
 background: rgba(0,0,0,0.3);
 padding: 15px;
 border-radius: 15px;
 backdrop-filter: blur(5px);
 text-align: center;
}

.suit-selector {
 display: flex;
 justify-content: center;
 gap: 15px;
 margin: 15px 0;
}

.suit-btn {
 font-size: 2em;
 background: #fff;
 border: 2px solid transparent;
 border-radius: 10px;
 width: 60px;
 height: 60px;
 cursor: pointer;
 transition: all 0.2s;
}
.suit-btn.active {
 border-color: var(--gold);
 transform: translateY(-5px);
 box-shadow: 0 5px 15px rgba(212, 175, 55, 0.4);
}
.suit-btn.red { color: var(--red-suit); }
.suit-btn.black { color: var(--black-suit); }

.amount-selector {
 display: flex;
 align-items: center;
 justify-content: center;
 gap: 20px;
 font-size: 1.2em;
}

.btn {
 padding: 12px 24px;
 border: none;
 border-radius: 8px;
 font-weight: bold;
 cursor: pointer;
 text-transform: uppercase;
 transition: filter 0.2s;
}
.btn.primary { background: var(--gold); color: #000; }
.btn.secondary { background: rgba(255,255,255,0.2); color: #fff; }
.btn.confirm { background: #27ae60; color: white; }

.btn.big-btn {
 font-size: 1.5em;
 background: var(--gold);
 color: var(--table-dark);
 box-shadow: 0 0 20px rgba(212, 175, 55, 0.3);
}

.pulse { animation: pulse 2s infinite; }
@keyframes pulse {
 0% { transform: scale(1); }
 50% { transform: scale(1.05); }
 100% { transform: scale(1); }
}

/* --- OVERLAY RESULTATS --- */
.overlay {
 position: fixed;
 inset: 0;
 background: rgba(0,0,0,0.85);
 z-index: 100;
 display: flex;
 justify-content: center;
 align-items: center;
}

.results-panel {
 background: #fff;
 color: #333;
 padding: 40px;
 border-radius: 10px;
 width: 90%;
 max-width: 500px;
 text-align: center;
 border: 4px solid var(--gold);
}

.rank-item {
 display: flex;
 justify-content: space-between;
 padding: 10px;
 border-bottom: 1px solid #eee;
 font-size: 1.1em;
}
.rank-item.rank-1 { background: rgba(255, 215, 0, 0.2); font-weight: bold; }
.rank-item.rank-4 { opacity: 0.7; }

.win { color: #27ae60; font-weight: bold; }
.loose { color: #c0392b; font-weight: bold; }

/* Responsive mobile */
@media (max-width: 768px) {
 .race-area { gap: 10px; }
 .horse-lane { width: 40px; }
 .playing-card { width: 40px; height: 56px; font-size: 10px; }
 .card-center { font-size: 1.2em; }
 .main-track { height: 350px; }
 .suit-btn { width: 45px; height: 45px; font-size: 1.5em; }
}

3. Note Importante sur la Logique Serveur (Backend)
Comme je ne peux pas voir ton code serveur, voici la logique cruciale que tu dois implémenter côté serveur (index.js ou rooms.js) pour que la règle du "retournement de carte" fonctionne :
1. Structure du GameState : Ajoute un tableau sideCards.
JavaScript
// État initial
sideCards: [
  { id: 1, suit: 'hearts', value: '7', revealed: false }, // Exemple
  { id: 2, suit: 'spades', value: 'K', revealed: false },
  // ... 5 cartes
]

2. Logique drawCard (Côté Serveur) :
À chaque fois qu'une carte est tirée :
   * Fais avancer le cheval correspondant.
   * Vérification de la ligne de côté :
Regarde la position minimum de tous les chevaux (ex: si les chevaux sont aux positions 2, 3, 2, 4 -> le minimum est 2).
Si minPosition >= 1 et sideCards[0].revealed === false :
      1. Révèle sideCards[0].
      2. Récupère la couleur de cette carte (ex: Coeur).
      3. Fais reculer le cheval Coeur de 1 case.
      4. Envoie la mise à jour aux clients (revealed: true déclenchera l'animation du composant Card).
Résumé des améliorations :
      * Design : Tapis vert texturé, style casino, cartes visuelles (plus de carrés gris).
      * Layout : Vertical (fidèle au vrai jeu PMU), séparation claire entre la zone de pari et la zone de course.
      * Feedback : Animations CSS pour le mouvement des chevaux, mise en évidence du vainqueur et des pénalités claires dans la modale de fin.
      * Responsive : Le CSS s'adapte aux écrans mobiles en réduisant la taille des cartes.
Tu peux copier-coller ces fichiers directement. N'oublie pas d'importer les nouvelles classes CSS.