import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
// Import des jeux solo
import Demineur from "../components/solo/Minesweeper";
import Solitaire from "../components/solo/Solitaire";

import ConfirmationModal from "../components/ConfirmationModal";
import "./Solo.css";

export const Solo = () => {
  const navigate = useNavigate();
  const location = useLocation(); // Permet de récupérer les infos passées par le LobbySolo
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // On récupère le jeu choisi, par défaut on met "minesweeper" si on accède directement à la page
  const gameType = location.state?.gameType || "minesweeper";

  const handleLeaveGameClick = () => {
    setShowConfirmModal(true);
  };

  const handleConfirmLeave = () => {
    // On retourne au Lobby Solo au lieu de l'accueil global
    navigate("/lobbysolo");
    setShowConfirmModal(false);
  };

  const handleCloseModal = () => {
    setShowConfirmModal(false);
  };

  return (
    <div className="game-container">
      <div className="game-header">
        <img
          src="/assets/back-button.png"
          alt="Retour au lobby"
          onClick={handleLeaveGameClick}
          className="back-button"
          title="Quitter la partie"
        />
      </div>

      <ConfirmationModal
        show={showConfirmModal}
        onClose={handleCloseModal}
        onConfirm={handleConfirmLeave}
        message="Êtes-vous sûr de vouloir quitter la partie ? Vous retournerez au lobby solo."
      />

      {/* Affichage conditionnel du jeu selon ce qui a été choisi dans le lobby */}
      {gameType === "minesweeper" && <Demineur />}
      {gameType === "solitaire" && <Solitaire />}
    </div>
  );
};
