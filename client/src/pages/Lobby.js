import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSocket } from "../hooks/useSocket";
import { Chat } from "../components/Chat";
import ConfirmationModal from "../components/ConfirmationModal";
import ToggleSwitch from "../components/ToggleSwitch";
import "./Lobby.css";

export const Lobby = () => {
  const navigate = useNavigate();
  const {
    roomData,
    currentRoom,
    startGame,
    socket,
    leaveRoom,
    rejoinGame,
    updateRoomPrivacy,
  } = useSocket();
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isPrivate, setIsPrivate] = useState(roomData?.isPrivate || true); // Default to private

  useEffect(() => {
    if (!socket) return;
    const handleGameStarted = () => {
      navigate("/game");
    };
    socket.on("gameStarted", handleGameStarted);
    return () => {
      socket.off("gameStarted", handleGameStarted);
    };
  }, [socket, navigate]);

  const isRoomPrivate = roomData?.isPrivate;
  useEffect(() => {
    if (typeof isRoomPrivate === "boolean") {
      setIsPrivate(isRoomPrivate);
    }
  }, [isRoomPrivate]);

  if (!roomData) {
    return <div className="loading">Chargement...</div>;
  }

  const isHost = roomData?.players.find((p) => p.id === socket?.id)?.isHost;
  const isGameInProgress = roomData.status === "in_game";
  const self = roomData.players.find((p) => p.id === socket.id);
  const isPlayerInGame = self?.inGame;
  const hasEnoughPlayers = roomData.players.length >= 2;
  const canStartGame = !isGameInProgress && hasEnoughPlayers;

  const handleStartPMU = () => {
    if (!canStartGame) return;
    startGame("pmu");
  };

  const handleStartPurple = () => {
    if (!canStartGame) return;
    startGame("purple");
  };

  const handleStart99 = () => {
    if (!canStartGame) return;
    startGame("99");
  };

  const handleLeaveLobby = () => {
    setShowConfirmModal(true);
  };

  const handleConfirmLeave = async () => {
    await leaveRoom();
    navigate("/");
  };

  const handleCloseModal = () => {
    setShowConfirmModal(false);
  };

  const handleRejoinGame = () => {
    rejoinGame();
    navigate("/game");
  };

  const handlePrivacyChange = () => {
    const newIsPrivate = !isPrivate;
    setIsPrivate(newIsPrivate); // Optimistic update
    updateRoomPrivacy(newIsPrivate);
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
        message="Êtes-vous sûr de vouloir quitter le salon ? Si vous êtes l'hôte, la partie sera transférée à un autre joueur."
      />

      <div className="lobby-content">
        <h1>Salle de jeu</h1>
        <div className="code-display">
          Code: <strong>{currentRoom}</strong>
        </div>

        {isHost && (
          <div className="privacy-toggle-container">
            <ToggleSwitch
              id="room-privacy"
              checked={isPrivate}
              onChange={handlePrivacyChange}
              label="Partie"
            />
            <span style={{ marginLeft: "10px" }}>
              {isPrivate ? "Privé" : "Public"}
            </span>
          </div>
        )}

        {isGameInProgress && (
          <div className="game-in-progress">
            <h2>Partie en cours...</h2>
            {!isPlayerInGame ? (
              <button onClick={handleRejoinGame} className="btn btn-primary">
                Rejoindre la partie
              </button>
            ) : (
              <p>
                Vous êtes dans le lobby mais la partie est toujours en cours.
              </p>
            )}
          </div>
        )}

        <div className="players-section">
          <h2>Joueurs ({roomData.players.length})</h2>
          <ul className="players-list">
            {roomData.players.map((player) => (
              <li key={player.id} className="player-item">
                <img
                  src={`https://robohash.org/${player.name}?set=set1`}
                  alt={player.name}
                  className="player-photo-lobby"
                />
                <p className="player-name">
                  {player.isHost && "👑 "}
                  {player.name}
                  {!player.inGame && isGameInProgress && " (au lobby)"}
                </p>
              </li>
            ))}
          </ul>
        </div>

        {isHost && (
          <div className="games-section">
            <h2>Choisir un jeu</h2>
            <div className="games-grid">
              <button
                onClick={handleStartPMU}
                className="game-card-button"
                disabled={!canStartGame}
              >
                <img src="/assets/jeux/pmu.png" alt="PMU Game" />
                <span className="game-title">PMU</span>
              </button>
              <button
                onClick={handleStartPurple}
                className="game-card-button"
                disabled={!canStartGame}
              >
                <img src="/assets/jeux/purple.png" alt="Purple Game" />
                <span className="game-title">Purple</span>
              </button>
              <button
                onClick={handleStart99}
                className="game-card-button"
                disabled={!canStartGame}
              >
                <img src="/assets/jeux/99.png" alt="99 Game" />
                <span className="game-title">99</span>
              </button>
            </div>
            {!hasEnoughPlayers && (
              <p className="min-players-warning">
                ⏳ En attente d'autres joueurs (minimum 2 joueurs requis pour lancer)
              </p>
            )}
          </div>
        )}
      </div>
      <Chat />
    </div>
  );
};
