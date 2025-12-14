import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSocket } from '../hooks/useSocket';
import './Lobby.css';

export const Lobby = () => {
  const navigate = useNavigate();
  const { roomData, currentRoom, startGame, socket } = useSocket();

  useEffect(() => {
    if (socket) {
      socket.on('gameStarted', (data) => {
        navigate('/game');
      });
    }
  }, [socket, navigate]);

  if (!roomData) {
    return <div className="loading">Chargement...</div>;
  }

  const qrValue = `${window.location.origin}?joinCode=${currentRoom}`;

  const isHost = roomData?.players.find(p => p.id === socket?.id)?.isHost;

  const handleStartPMU = () => {
    startGame('pmu');
  };

  const handleStartPurple = () => {
    startGame('purple');
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
                <img src={`https://robohash.org/${player.name}?set=set1`} alt={player.name} className="player-photo" />
                {player.isHost && '👑 '}
                {player.name}
              </li>
            ))}
          </ul>
        </div>

        {isHost && (
          <div className="games-section">
            <h2>Choisir un jeu</h2>
            <div className="games-grid">
              <div className="game-card">
                <h3>🐴 PMU</h3>
                <p>Pariez sur les chevaux et regardez-les avancer!</p>
                <button onClick={handleStartPMU} className="btn-game">
                  Démarrer PMU
                </button>
              </div>
              <div className="game-card">
                <h3>🟣 Purple</h3>
                <p>Devinez la couleur ou la valeur de la prochaine carte</p>
                <button onClick={handleStartPurple} className="btn-game">
                  Démarrer Purple
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
