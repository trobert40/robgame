import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSocket } from "../hooks/useSocket";
import PMU from "../components/games/PMU";
import Purple from "../components/games/Purple";
import { Chat } from "../components/Chat";
import ConfirmationModal from "../components/ConfirmationModal";
import "./Game.css";

export const Game = () => {
  const { roomData, backToLobby, socket } = useSocket();
  const navigate = useNavigate();
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  useEffect(() => {
    if (roomData && roomData.status === "waiting") {
      navigate("/lobby");
    }
  }, [roomData, navigate]);

  const handleLeaveGameClick = () => {
    setShowConfirmModal(true);
  };

  const handleConfirmLeave = () => {
    backToLobby();
    navigate("/lobby");
    setShowConfirmModal(false);
  };

  const handleCloseModal = () => {
    setShowConfirmModal(false);
  };

  if (!roomData) {
    return <div className="loading">Chargement du jeu...</div>;
  }

  const gameType = roomData.gameType;

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
      {gameType === "pmu" && <PMU gameState={roomData.gameState} />}
      {gameType === "purple" && <Purple gameState={roomData.gameState} />}
      <Chat />
    </div>
  );
};
