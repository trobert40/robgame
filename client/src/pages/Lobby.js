import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSocket } from "../hooks/useSocket";
import { Chat } from "../components/Chat";
import "./Lobby.css";

export const Lobby = () => {
  const navigate = useNavigate();
  const { roomData, currentRoom, startGame, socket } = useSocket();

  useEffect(() => {
    if (socket) {
      socket.on("gameStarted", (data) => {
        navigate("/game");
      });
    }
  }, [socket, navigate]);

  if (!roomData) {
    return <div className="loading">Chargement...</div>;
  }

  const isHost = roomData?.players.find((p) => p.id === socket?.id)?.isHost;

  const handleStartPMU = () => {
    startGame("pmu");
  };

  const handleStartPurple = () => {
    startGame("purple");
  };

  return (
    <div className="lobby-container">
      <div className="lobby-content">
        <h1>Salle de jeu</h1>
        <div className="code-display">
          Code: <strong>{currentRoom}</strong>
        </div>

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
                </p>
              </li>
            ))}
          </ul>
        </div>

        {isHost && (
          <div className="games-section">
            <h2>Choisir un jeu</h2>
            <div className="games-grid">
              <button onClick={handleStartPMU} className="game-card-button">
                <img src="/assets/jeux/pmu.png" alt="PMU Game" />
                <span className="game-title">PMU</span>
              </button>

              <div className="game-grid">
                <button
                  onClick={handleStartPurple}
                  className="game-card-button"
                >
                  <img src="/assets/jeux/purple.png" alt="Purple Game" />
                  <span className="game-title">Purple</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <Chat />
    </div>
  );
};
