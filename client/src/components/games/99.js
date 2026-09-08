import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSocket } from "../../hooks/useSocket";
import "./99.css";

const NinetyNine = ({ gameState }) => {
  const { socket, sendGameAction, playAgain, leaveRoom } = useSocket();
  const navigate = useNavigate();
  const [showCount, setShowCount] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);

  if (!gameState)
    return <div className="loading-screen">Chargement du 99...</div>;

  const self = gameState.players.find((p) => p.id === socket.id);
  const isHost = self?.isHost;
  const currentPlayer = gameState.players[gameState.currentPlayerIndex];
  const isMyTurn = currentPlayer?.id === socket.id;

  const handleLeave = async () => {
    await leaveRoom();
    navigate("/");
  };

  // Gestion des cartes spéciales A (1/11) et J (+10/-10)
  const handlePlayCard = (card) => {
    if (!isMyTurn) return; // Empêche de jouer si ce n'est pas le tour

    if (["A", "J"].includes(card.value)) {
      setSelectedCard(card); // Ouvre la modale de choix
    } else {
      sendGameAction({ type: "playCard", card });
    }
  };

  const handleSelectValue = (value) => {
    if (selectedCard) {
      sendGameAction({
        type: "playCard",
        card: selectedCard,
        chosenValue: value,
      });
      setSelectedCard(null);
    }
  };

  const toggleShowCount = () => {
    if (!showCount) sendGameAction({ type: "viewCount" });
    setShowCount(!showCount);
  };

  const getCardImage = (card) => {
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
    const suitMap = {
      hearts: "coeur",
      diamonds: "carreau",
      clubs: "trefle",
      spades: "pique",
    };
    return `/assets/${valueMap[card.value]}-${suitMap[card.suit]}.svg`;
  };

  return (
    <div className="nn-wrapper">
      {/* --- ZONE ADVERSAIRES (Haut) --- */}
      <div className="nn-opponents">
        {gameState.players
          .filter((p) => p.id !== socket.id)
          .map((player) => (
            <div
              key={player.id}
              className={`opponent-card ${
                player.id === currentPlayer.id ? "active-turn" : ""
              }`}
            >
              <div className="opponent-avatar">👤</div>
              <div className="opponent-info">
                <span className="opponent-name">{player.name}</span>
                <div className="opponent-cards-count">
                  {/* On affiche le dos des cartes pour visualiser le nombre */}
                  {[...Array(player.cardCount)].map((_, i) => (
                    <div
                      key={i}
                      className="mini-card-back"
                      style={{ transform: `translateX(${i * -15}px)` }}
                    ></div>
                  ))}
                </div>
              </div>
            </div>
          ))}
      </div>

      {/* --- ZONE CENTRALE (Le Plateau) --- */}
      <div className="nn-center-stage">
        {/* Le Compteur */}
        <div
          className={`count-circle ${gameState.count >= 90 ? "danger" : ""} ${
            gameState.count >= 99 ? "critical" : ""
          }`}
        >
          <div className="count-value">{showCount ? gameState.count : "?"}</div>
          <button className="btn-toggle-eye" onClick={toggleShowCount}>
            {showCount ? "👁️" : "🙈"}
          </button>
          <span className="count-label">TOTAL</span>
        </div>

        {/* La Défausse (Dernière carte jouée) */}
        <div className="discard-pile">
          {gameState.lastPlayedCard ? (
            <img
              src={getCardImage(gameState.lastPlayedCard)}
              alt="Dernière carte"
              className="last-card-img"
            />
          ) : (
            <div className="empty-pile">Début</div>
          )}
          <div className="pile-label">Dernière Jouée</div>
        </div>

        {/* Message d'action (Feedback) */}
        {gameState.lastActionMessage && (
          <div className="action-toast">{gameState.lastActionMessage}</div>
        )}
      </div>

      {/* --- ZONE JOUEUR (Bas) --- */}
      {self && (
        <div className={`my-hand-container ${isMyTurn ? "my-turn-glow" : ""}`}>
          <div className="turn-indicator">
            {isMyTurn
              ? "🟢 C'est à toi de jouer !"
              : `En attente de ${currentPlayer.name}...`}
          </div>

          <div className="my-cards-list">
            {self.hand.map((card, index) => (
              <div
                key={index}
                className="my-card-wrapper"
                onClick={() => handlePlayCard(card)}
                style={{ "--index": index }} // Pour animation CSS éventuelle
              >
                <img
                  src={getCardImage(card)}
                  alt={`${card.value} ${card.suit}`}
                  className="my-card-img"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* --- MODALE : CHOIX DE VALEUR (A ou J) --- */}
      {selectedCard && (
        <div className="nn-modal-overlay">
          <div className="nn-modal glass-panel">
            <h3>Choisis la valeur pour le {selectedCard.value}</h3>
            <div className="modal-choices">
              {selectedCard.value === "A" && (
                <>
                  <button
                    className="btn-choice"
                    onClick={() => handleSelectValue(1)}
                  >
                    +1
                  </button>
                  <button
                    className="btn-choice"
                    onClick={() => handleSelectValue(11)}
                  >
                    +11
                  </button>
                </>
              )}
              {selectedCard.value === "J" && (
                <>
                  <button
                    className="btn-choice"
                    onClick={() => handleSelectValue(10)}
                  >
                    +10
                  </button>
                  <button
                    className="btn-choice"
                    onClick={() => handleSelectValue(-10)}
                  >
                    -10
                  </button>
                </>
              )}
            </div>
            <button
              className="btn-cancel"
              onClick={() => setSelectedCard(null)}
            >
              Annuler
            </button>
          </div>
        </div>
      )}

      {/* --- MODALE : GAME OVER --- */}
      {gameState.stage === "finished" && (
        <div className="nn-modal-overlay">
          <div className="nn-modal game-over-panel">
            <h2>💥 BOOM ! 💥</h2>
            <div className="loser-display">
              <span className="loser-name">
                {gameState.loser?.name || "Un joueur"}
              </span>
              <p>a dépassé 99 !</p>
            </div>
            <div className="final-count">Total: {gameState.count}</div>
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
        </div>
      )}
    </div>
  );
};

export default NinetyNine;
