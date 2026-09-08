import React, { useState } from "react";
import ReactDOM from "react-dom"; // <--- IMPORT CRUCIAL AJOUTÉ
import { useNavigate } from "react-router-dom";
import { useSocket } from "../../hooks/useSocket";
import "./PMU.css";

const Card = ({ suit, value, flipped, isBack, small }) => {
  const getCardImageUrl = (s, v) => {
    const suitMap = {
      hearts: "coeur",
      diamonds: "carreau",
      clubs: "trefle",
      spades: "pique",
    };
    const valueMap = {
      A: "01",
      2: "02",
      3: "03",
      4: "04",
      5: "05",
      6: "06",
      7: "07",
      8: "08",
      9: "09",
      10: "10",
      J: "V",
      Q: "D",
      K: "R",
    };
    const mappedSuit = suitMap[s];
    const mappedValue = valueMap[v];
    return !mappedSuit || !mappedValue
      ? `/assets/dos-bleu.svg`
      : `/assets/${mappedValue}-${mappedSuit}.svg`;
  };

  const imageUrl =
    isBack || flipped === false
      ? "/assets/dos-bleu.svg"
      : getCardImageUrl(suit, value);

  return (
    <div className={`card-wrapper ${small ? "small" : ""}`}>
      <img src={imageUrl} alt={`${value} of ${suit}`} className="card-image" />
    </div>
  );
};

const PMU = ({ gameState }) => {
  const { sendGameAction, playAgain, leaveRoom, socket } = useSocket();
  const navigate = useNavigate();
  const [selectedHorse, setSelectedHorse] = useState(null);
  const [betAmount, setBetAmount] = useState(1);

  const self = gameState?.players.find((p) => p.id === socket?.id);
  const isHost = self?.isHost;

  const suitsConfig = {
    hearts: { name: "Cœur", emoji: "❤️", color: "red" },
    diamonds: { name: "Carreau", emoji: "💎", color: "red" },
    clubs: { name: "Trèfle", emoji: "♣️", color: "black" },
    spades: { name: "Pique", emoji: "♠️", color: "black" },
  };

  const handleLeave = async () => {
    await leaveRoom();
    navigate("/");
  };

  const handlePlaceBet = async () => {
    if (selectedHorse && !self.hasBet) {
      await sendGameAction({
        type: "placeBet",
        suit: selectedHorse,
        amount: betAmount,
      });
    }
  };

  const handleStartRace = async () => {
    await sendGameAction({ type: "startRace" });
  };
  const handleDrawCard = async () => {
    await sendGameAction({ type: "drawCard" });
  };

  if (!gameState)
    return <div className="pmu-loading">Chargement du PMU...</div>;

  // --- RENDERERS ---

  const renderSideCards = () => {
    const steps = [5, 4, 3, 2, 1];

    return (
      <div className="side-track-column">
        <div className="side-placeholder"></div>
        {steps.map((step, index) => {
          const cardIndex = step - 1;
          const sideCardData = gameState.sideCards
            ? gameState.sideCards[cardIndex]
            : null;

          return (
            <div key={step} className="side-step-cell">
              <div className="side-card-content">
                <span className="step-number">{step}</span>
                {sideCardData && sideCardData.revealed ? (
                  <Card
                    suit={sideCardData.suit}
                    value={sideCardData.value}
                    small
                  />
                ) : (
                  <Card isBack={true} small />
                )}
              </div>
            </div>
          );
        })}
        <div className="side-placeholder"></div>
      </div>
    );
  };

  const renderRaceTrack = () => {
    return (
      <div className="track-grid">
        <div className="track-lines">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="track-line"></div>
          ))}
        </div>
        {Object.entries(gameState.horses).map(([suitKey, horse]) => {
          const position = horse.currentPosition || 0;
          const gridRow = 7 - position;

          return (
            <div
              key={suitKey}
              className="horse-token"
              style={{
                gridRow: gridRow,
                gridColumn: Object.keys(suitsConfig).indexOf(suitKey) + 1,
              }}
            >
              <Card suit={suitKey} value="A" small />
            </div>
          );
        })}
      </div>
    );
  };

  // --- MODIFICATION ICI : Utilisation de ReactDOM.createPortal ---
  const renderBettingOverlay = () => {
    if (!self) return null;

    // Le contenu est injecté directement dans le body, contournant le game-container
    return ReactDOM.createPortal(
      <div className="game-overlay">
        <div className="modal-content">
          {!self.hasBet ? (
            <>
              <h2>Faites vos jeux !</h2>
              <div className="bet-selector">
                <div className="suits-row">
                  {Object.keys(suitsConfig).map((key) => (
                    <button
                      key={key}
                      className={`suit-choice ${
                        selectedHorse === key ? "selected" : ""
                      }`}
                      onClick={() => setSelectedHorse(key)}
                    >
                      {suitsConfig[key].emoji}
                    </button>
                  ))}
                </div>
                {selectedHorse && (
                  <div className="amount-row">
                    <label>Mise: {betAmount} 🍺</label>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={betAmount}
                      onChange={(e) => setBetAmount(parseInt(e.target.value))}
                    />
                    <button onClick={handlePlaceBet} className="btn-confirm">
                      Valider
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="waiting-message">
              <h3>Pari validé !</h3>
              <p>En attente des autres parieurs...</p>
              {isHost && (
                <button
                  className="btn-start"
                  disabled={!gameState.allPlayersHaveBet}
                  onClick={handleStartRace}
                >
                  Lancer la course 🏁
                </button>
              )}
            </div>
          )}
        </div>
      </div>,
      document.body, // Cible du portail
    );
  };

  // --- MODIFICATION ICI : Utilisation de ReactDOM.createPortal ---
  const renderResultsOverlay = () => {
    return ReactDOM.createPortal(
      <div className="game-overlay">
        <div className="modal-content results">
          <h2>🏆 Fin de la Course !</h2>
          <div className="rankings">
            {gameState.raceRanking.map(({ suit, rank }) => (
              <div key={suit} className={`rank-row rank-${rank}`}>
                <span className="rank-pos">#{rank}</span>
                <span className="rank-name">
                  {suitsConfig[suit].emoji} {suitsConfig[suit].name}
                </span>
                <span className="rank-rule">
                  {rank === 1 && "Distribue 2x"}
                  {rank === 2 && "Distribue 1x"}
                  {rank === 3 && "Boit 1x"}
                  {rank === 4 && "Boit 2x"}
                </span>
              </div>
            ))}
          </div>

          {(() => {
            const myBet = self?.bets ? Object.entries(self.bets)[0] : null;
            if (!myBet) return null;
            const [betSuit, betVal] = myBet;
            const horseRank =
              gameState.raceRanking.findIndex((r) => r.suit === betSuit) + 1;
            const isWin = horseRank <= 2;

            return (
              <div className={`player-result ${isWin ? "win" : "loose"}`}>
                Tu avais misé {betVal} sur {suitsConfig[betSuit].emoji}.<br />
                <strong>
                  {horseRank === 1 &&
                    `Tu distribues ${betVal * 2} gorgées ! 🍻`}
                  {horseRank === 2 && `Tu distribues ${betVal} gorgée(s). 🍺`}
                  {horseRank === 3 && `Tu bois ${betVal} gorgée(s). 🥴`}
                  {horseRank === 4 && `Tu bois ${betVal * 2} gorgées. 💀`}
                </strong>
              </div>
            );
          })()}

          <div className="modal-actions">
            <button onClick={handleLeave} className="btn-secondary">
              Quitter
            </button>
            {isHost && (
              <button onClick={playAgain} className="btn-primary">
                Rejouer
              </button>
            )}
          </div>
        </div>
      </div>,
      document.body, // Cible du portail
    );
  };

  return (
    <div className="pmu-container">
      {gameState.stage === "betting" && renderBettingOverlay()}
      {gameState.stage === "finished" && renderResultsOverlay()}

      <header className="pmu-header">
        <div className="deck-info">
          <div className="deck-placeholder">
            {gameState.lastDrawnCard ? (
              <Card
                suit={gameState.lastDrawnCard.suit}
                value={gameState.lastDrawnCard.value}
                small
              />
            ) : (
              <div className="empty-slot">?</div>
            )}
          </div>
          <span className="last-card-label">
            {gameState.lastDrawnCard
              ? `${suitsConfig[gameState.lastDrawnCard.suit].name} avance !`
              : "En attente..."}
          </span>
        </div>
        <h1 className="PMU-title">PMU</h1>
      </header>

      <main className="pmu-track-area">
        <div className="board-container">
          {renderSideCards()}
          {renderRaceTrack()}
        </div>
      </main>

      <footer className="pmu-controls">
        {gameState.stage === "racing" && (
          <button onClick={handleDrawCard} className="btn-draw">
            🃏 Tirer une carte
          </button>
        )}
        {gameState.stage !== "racing" &&
          gameState.stage !== "betting" &&
          gameState.stage !== "finished" && (
            <div className="status-text">Prêt pour le départ...</div>
          )}
      </footer>
    </div>
  );
};

export default PMU;
