import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
// On importe le démineur (attention à la majuscule)
import Demineur from "../components/solo/Minesweeper";
import ConfirmationModal from "../components/ConfirmationModal";
import "./Solo.css";

export const Solo = () => {
  const navigate = useNavigate();
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const handleLeaveGameClick = () => {
    setShowConfirmModal(true);
  };

  const handleConfirmLeave = () => {
    // Plus besoin de "backToLobby()" côté serveur, on redirige juste l'utilisateur
    navigate("/lobby"); // ou "/" selon la structure de ton app
    setShowConfirmModal(false);
  };

  const handleCloseModal = () => {
    setShowConfirmModal(false);
  };

  // On a supprimé le bloc "if (!roomData) return chargement..."
  // Le jeu se lance instantanément maintenant !

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
        message="Êtes-vous sûr de vouloir quitter la partie ? Vous retournerez au lobby."
      />

      {/* On appelle le composant Démineur directement, sans lui passer de gameState du serveur */}
      <Demineur />

      {/* J'ai retiré <Chat /> car en mode solo, tu n'as personne avec qui discuter ! */}
    </div>
  );
};
