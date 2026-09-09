import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ConfirmationModal from "../components/ConfirmationModal";
import "./Lobby.css"; // On réutilise ton super CSS du lobby multijoueur

export const LobbySolo = () => {
  const navigate = useNavigate();
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const handleLeaveLobby = () => {
    setShowConfirmModal(true);
  };

  const handleConfirmLeave = () => {
    navigate("/"); // Retour à l'accueil (Home)
    setShowConfirmModal(false);
  };

  const handleCloseModal = () => {
    setShowConfirmModal(false);
  };

  // Fonction pour lancer le jeu choisi
  const handleStartGame = (gameName) => {
    // On navigue vers la page du jeu solo en lui passant le nom du jeu en paramètre "state"
    navigate("/solo", { state: { gameType: gameName } });
  };

  return (
    <div className="lobby-container">
      <div className="lobby-header">
        <img
          src="/assets/back-button.png"
          alt="Retour à l'accueil"
          onClick={handleLeaveLobby}
          className="back-button"
          title="Retour à l'accueil"
        />
      </div>

      <ConfirmationModal
        show={showConfirmModal}
        onClose={handleCloseModal}
        onConfirm={handleConfirmLeave}
        message="Êtes-vous sûr de vouloir retourner à l'accueil ?"
      />

      <div className="lobby-content">
        <h1>Mode Solo</h1>
        <p
          style={{
            color: "var(--text-muted)",
            fontSize: "1.2em",
            marginBottom: "30px",
          }}
        >
          Choisissez un jeu pour commencer
        </p>

        {/* Section des jeux (adaptée de ton Lobby multijoueur) */}
        <div
          className="games-section"
          style={{ marginTop: "0", borderTop: "none" }}
        >
          <div className="games-grid">
            {/* Carte Démineur */}
            <button
              onClick={() => handleStartGame("minesweeper")}
              className="game-card-button"
            >
              {/* N'oublie pas de mettre une image pour le démineur dans ton dossier assets */}
              <img src="/assets/jeux/minesweeper.png" alt="Démineur" />
              <span className="game-title">Démineur</span>
            </button>

            {/* Exemple d'un futur jeu Solo grisé (désactivé) */}
            <button
              className="game-card-button"
              disabled={true}
              title="Prochainement..."
            >
              <img src="/assets/jeux/solitaire.png" alt="Solitaire" />
              <span className="game-title">
                Solitaire <br />
                <span style={{ fontSize: "0.5em" }}>(Bientôt)</span>
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
