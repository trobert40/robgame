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
    {
      key: "rouge",
      label: "Rouge",
      class: "pred-rouge",
      color: "red",
    },
    {
      key: "noir",
      label: "Noir",
      class: "pred-noir",
      color: "black",
    },
    { key: "purple", label: "Purple", class: "pred-purple" },
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
  const isMyTurn = currentPlayer?.id === socket?.id;

  const renderPenaltySummary = () => (
    <div className="players-penalties">
      <h3>Pénalités Finales</h3>
      <div className="penalties-list">
        {gameState.players &&
          gameState.players.map((player) => (
            <div key={player.id} className="penalty-item">
              <img
                src={`https://robohash.org/${player.name}?set=set1`}
                alt={player.name}
                className="player-photo"
              />
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

      <h1 className="purple-title">Purple</h1>

      {/* Current Player Section */}
      <div className="current-player-section">
        <h2>Au tour de</h2>

        <img
          src={`https://robohash.org/${currentPlayer?.name}?set=set1`}
          alt={currentPlayer?.name}
          className="player-photo-Game"
        />
        <p className="player-name-Game">{currentPlayer?.name}</p>
      </div>

      <div className="cards-section">
        {/* GROUPE GAUCHE : Nombre restants + Dos de carte */}
        <div className="card-group left-group">
          <span className="card-count">{gameState.cardsRemaining}</span>
          <img
            src="/assets/dos-bleu.svg"
            alt="Deck"
            className="card-image deck"
          />
        </div>

        {/* GROUPE DROITE : Carte actuelle + Nombre empilé */}
        <div className="card-group right-group">
          {gameState.currentCard ? (
            <img
              src={getCardImage(gameState.currentCard)}
              alt={`${gameState.currentCard.value} of ${gameState.currentCard.suit}`}
              className="card-image"
            />
          ) : (
            <div className="card empty">
              <span>Vide</span>
            </div>
          )}

          <span className="card-count">
            {currentPlayer?.stackedCards.length || 0}
          </span>
        </div>
      </div>

      {/* Predictions or Results */}
      {gameState.stage === "playing" && (
        <div className="predictions-section">
          <div className="predictions-grid">
            {predictions.map((pred) => (
              <button
                key={pred.key}
                onClick={() => handlePredict(pred.key)}
                className={`${pred.class} ${!isMyTurn ? "not-my-turn" : ""}`}
                disabled={!isMyTurn}
              >
                <span className="pred-label">{pred.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
      {gameState.canPass && currentPlayer?.id === socket?.id && (
        <button onClick={handlePass} className="btn-pass">
          Passer au joueur suivant
        </button>
      )}
    </div>
  );
};

export default Purple;
