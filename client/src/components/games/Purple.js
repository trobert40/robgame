import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSocket } from "../../hooks/useSocket";
import "./Purple.css";

const getCardImage = (card) => {
  if (!card) {
    // In development, you might want to see a placeholder. For production, maybe an empty div or a default image.
    return "/assets/dos-bleu.svg"; // Return a default card back image
  }

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

  const suit = suitMap[card.suit];
  const value = valueMap[card.value];

  // Make sure to handle cases where suit or value might be undefined
  if (!suit || !value) {
    return "/assets/dos-bleu.svg"; // Fallback to a card back
  }

  return `/assets/${value}-${suit}.svg`;
};

const Purple = ({ gameState }) => {
  const { sendGameAction, roomData, playAgain, leaveRoom, socket } =
    useSocket();
  const navigate = useNavigate();
  const [penaltyNotification, setPenaltyNotification] = useState(null);

  const isHost = roomData?.players.find((p) => p.id === socket?.id)?.isHost;

  useEffect(() => {
    if (penaltyNotification) {
      const timer = setTimeout(() => setPenaltyNotification(null), 3000); // Hide after 3s
      return () => clearTimeout(timer);
    }
  }, [penaltyNotification]);

  const handleLeave = async () => {
    await leaveRoom();
    navigate("/");
  };

  const predictions = [
    { key: "rouge", label: "Rouge", emoji: "🔴", color: "red" },
    { key: "noir", label: "Noir", emoji: "⚫", color: "black" },
    {
      key: "purple",
      label: "Purple",
      emoji: "🟣",
      description:
        "Couleur différente de la précédente. Compte pour 2 succès !",
    },
  ];

  const handlePredict = async (predictionKey) => {
    const response = await sendGameAction({
      type: "predict",
      prediction: predictionKey,
    });

    if (response.result === "wrong" && response.penalty > 0) {
      const self = gameState.players.find((p) => p.id === socket.id);
      if (self.isCurrentPlayer) {
        setPenaltyNotification(
          `Tu as perdu ! Bois ${response.penalty} gorgée(s).`
        );
      }
    }
  };

  const handlePass = async () => {
    await sendGameAction({ type: "pass" });
  };

  if (!gameState) {
    return <div className="purple-loading">Préparation du jeu...</div>;
  }

  const currentPlayer = gameState.currentPlayer;

  const renderPenaltySummary = () => (
    <div className="players-penalties">
      <h3>Pénalités Finales</h3>
      <div className="penalties-list">
        {gameState.players &&
          gameState.players.map((player) => (
            <div key={player.id} className="penalty-item">
              <span>{player.name}</span>
              <span className="penalty-badge">
                {player.penalties} gorgée(s)
              </span>
            </div>
          ))}
      </div>
    </div>
  );

  return (
    <div className="purple-container">
      {penaltyNotification && (
        <div className="penalty-toast show">{penaltyNotification}</div>
      )}

      {gameState.stage === "finished" && (
        <div className="finish-overlay">
          <div className="finish-content">
            <h2>🎉 Jeu terminé !</h2>
            <h3>La pioche est vide.</h3>
            {renderPenaltySummary()}
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

      <div className="purple-board">
        <h1 className="purple-title">🟣 Purple - Devinez la Carte</h1>

        {/* Current Player Section */}
        <div className="current-player-section">
          <h2>Joueur actuel</h2>
          <div className="current-player-card">
            <span className="player-name">{currentPlayer?.name}</span>
            <span className="consecutive-badge">
              {gameState.consecutiveCorrect || 0} bonnes réponses
            </span>
          </div>
          <p style={{ marginTop: "10px", fontStyle: "italic", opacity: 0.8 }}>
            Objectif : Enchaînez 2 succès pour passer la main. Un Purple correct
            compte double !
          </p>
        </div>

        {/* Cards Display */}
        <div className="cards-section">
          <div className="card-container">
            {gameState.currentCard ? (
              <img
                src={getCardImage(gameState.currentCard)}
                alt={
                  gameState.currentCard
                    ? `${gameState.currentCard.value} of ${gameState.currentCard.suit}`
                    : "Carte précédente"
                }
                className="card-image"
              />
            ) : (
              <div className="card empty">
                <span>Carte précédente</span>
              </div>
            )}
          </div>

          <div className="stacked-cards-info">
            <h3>Cartes empilées: {currentPlayer?.stackedCards.length || 0}</h3>
            <div className="stacked-cards-list">
              {currentPlayer?.stackedCards.slice(-3).map((card, idx) => (
                <img
                  key={idx}
                  src={getCardImage(card)}
                  alt={card ? `${card.value} of ${card.suit}` : "Card in stack"}
                  className="card-mini-image"
                />
              ))}
            </div>
          </div>
        </div>

        {/* Predictions or Results */}
        {gameState.stage === "playing" && (
          <div className="predictions-section">
            <h2>Prédictions disponibles</h2>
            <div className="predictions-grid">
              {predictions.map((pred) => (
                <button
                  key={pred.key}
                  onClick={() => handlePredict(pred.key)}
                  className="prediction-btn"
                  disabled={!currentPlayer || currentPlayer.id !== socket?.id}
                >
                  <span className="pred-emoji">{pred.emoji}</span>
                  <span className="pred-label">{pred.label}</span>
                  {pred.description && (
                    <span className="pred-desc">{pred.description}</span>
                  )}
                </button>
              ))}
            </div>

            {gameState.canPass && currentPlayer?.id === socket?.id && (
              <button onClick={handlePass} className="btn-pass">
                Passer au joueur suivant
              </button>
            )}
          </div>
        )}

        {/* Cards Remaining */}
        <div className="info-bar">
          <span>Cartes restantes: {gameState.cardsRemaining}</span>
        </div>
      </div>
    </div>
  );
};

export default Purple;
