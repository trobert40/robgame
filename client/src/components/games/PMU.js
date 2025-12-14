import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSocket } from '../../hooks/useSocket';
import './PMU.css';

const PMU = ({ gameState }) => {
  const { sendGameAction, playAgain, leaveRoom, socket } = useSocket();
  const navigate = useNavigate();
  const [selectedHorse, setSelectedHorse] = useState(null);
  const [betAmount, setBetAmount] = useState(1);

  const self = gameState?.players.find(p => p.id === socket?.id);
  const isHost = self?.isHost;

  const suits = {
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
      await sendGameAction({
        type: 'placeBet',
        suit: selectedHorse,
        amount: betAmount
      });
    }
  };

  const handleStartRace = async () => {
    await sendGameAction({ type: 'startRace' });
  };

  const handleDrawCard = async () => {
    await sendGameAction({ type: 'drawCard' });
  };

  if (!gameState) {
    return <div className="pmu-loading">Préparation du jeu...</div>;
  }

  const renderPlayerBets = () => (
    <div className="players-bets-section">
      <h3>Paris des Joueurs</h3>
      <div className="bets-list">
        {gameState.players.map(player => (
          <div key={player.id} className={`bet-item ${player.hasBet ? 'has-bet' : ''}`}>
            <img src={`https://robohash.org/${player.name}?set=set1`} alt={player.name} className="player-photo" />
            <span>{player.name}</span>
            {player.hasBet ? (
              <span className="bet-details">
                A parié sur: {Object.entries(player.bets).map(([suit, amount]) => `${amount}x ${suits[suit].emoji}`).join(', ')}
              </span>
            ) : (
              <span className="bet-details waiting">En attente...</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  const renderResults = () => (
    <div className="results-section">
      <h2>🏆 Résultats de la Course 🏆</h2>
      <div className="horse-ranking">
        <h3>Classement des Chevaux</h3>
        <ul>
          {gameState.raceRanking.map(({ suit, rank }) => (
            <li key={suit}>
              {rank}ᵉ: {suits[suit].name} {suits[suit].emoji}
            </li>
          ))}
        </ul>
      </div>
      <div className="player-penalties">
        <h3>Pénalités des Joueurs</h3>
        {gameState.players.map(player => (
          <div key={player.id} className="player-penalty-item">
            <h4>{player.name}</h4>
            {player.penalties.length > 0 ? (
              <ul>
                {player.penalties.map((p, index) => (
                  <li key={index} className={p.type}>
                    {p.type === 'distribute' ? 'Distribue' : 'Bois'} {p.amount} gorgée(s) (pari sur {suits[p.horse].emoji})
                  </li>
                ))}
              </ul>
            ) : <p>Aucune pénalité. Bravo !</p>}
          </div>
        ))}
      </div>
    </div>
  );


  return (
    <div className="pmu-container">
      {gameState.stage === 'finished' && (
        <div className="finish-overlay">
          <div className="finish-content">
            {renderResults()}
            <div className="end-game-actions">
              <button onClick={handleLeave} className="btn-endgame btn-home">
                Retour à l'accueil
              </button>
              {isHost && (
                <button onClick={playAgain} className="btn-endgame btn-again">
                  Rejouer
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="pmu-board">
        <h1 className="pmu-title">🐴 PMU - Course de Chevaux</h1>

        <div className="horses-section">
          <div className="horses-track">
            {Object.entries(gameState.horses).map(([suitKey, horse]) => (
              <div key={suitKey} className="horse-lane">
                <div className="horse-info">
                  <span className="horse-suit">{suits[suitKey].emoji}</span>
                </div>
                <div className="race-track">
                  <div className="horse-position" style={{ left: `${(horse.cardsDrawn / 7) * 100}%` }}>
                    🐎
                  </div>
                </div>
                <div className="horse-progress">{horse.cardsDrawn}/7</div>
              </div>
            ))}
          </div>
        </div>
        
        {gameState.stage === 'betting' && !self.hasBet && (
          <div className="betting-section">
            <h2>Placez votre pari</h2>
            <div className="bet-controls">
              <div className="horses-grid">
                {Object.keys(suits).map(key => (
                  <button
                    key={key}
                    className={`horse-bet-btn ${selectedHorse === key ? 'selected' : ''}`}
                    onClick={() => setSelectedHorse(key)}
                  >
                    {suits[key].emoji} {suits[key].name}
                  </button>
                ))}
              </div>

              {selectedHorse && (
                <div className="bet-amount-control">
                  <label>Mise (gorgées):</label>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={betAmount}
                    onChange={(e) => setBetAmount(parseInt(e.target.value))}
                  />
                  <span>{betAmount}</span>
                  <button onClick={handlePlaceBet} className="btn-place-bet">
                    Parier
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {gameState.stage === 'betting' && self.hasBet && (
          <div className="waiting-section">
            <h2>En attente des autres joueurs...</h2>
            <p>Vos paris ont été enregistrés.</p>
          </div>
        )}
        
        {renderPlayerBets()}

        {isHost && gameState.stage === 'betting' && (
           <div className="host-controls">
             <button onClick={handleStartRace} className="btn-finish" disabled={!gameState.allPlayersHaveBet}>
                {gameState.allPlayersHaveBet ? 'Lancer la course !' : 'En attente des paris...'}
             </button>
           </div>
        )}

        {gameState.stage === 'racing' && (
          <div className="racing-section">
             <h2>La course est lancée !</h2>
            <button onClick={handleDrawCard} className="btn-draw">
              Piocher une carte
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PMU;
