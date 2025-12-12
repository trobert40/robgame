import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSocket } from '../hooks/useSocket';
import PMU from '../components/games/PMU';
import Purple from '../components/games/Purple';
import { Chat } from '../components/Chat';
import './Game.css';

export const Game = () => {
  const { roomData, leaveRoom } = useSocket();
  const navigate = useNavigate();

  useEffect(() => {
    // If roomData exists and status is 'waiting', it means the game ended
    // and the host chose to play again, so we go back to the lobby.
    if (roomData && roomData.status === 'waiting') {
      navigate('/lobby');
    }
  }, [roomData, navigate]);

  const handleLeave = async () => {
    await leaveRoom();
    navigate('/');
  };

  if (!roomData) {
    return <div className="loading">Chargement du jeu...</div>;
  }

  const gameType = roomData.gameType;

  return (
    <div className="game-container">
      <div className="game-header">
        <button onClick={handleLeave} className="btn-leave">
          Retour à l'accueil
        </button>
      </div>
      {gameType === 'pmu' && <PMU gameState={roomData.gameState} />}
      {gameType === 'purple' && <Purple gameState={roomData.gameState} />}
      <Chat />
    </div>
  );
};
