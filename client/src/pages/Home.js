import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSocket } from '../hooks/useSocket';
import './Home.css';

export const Home = () => {
  const navigate = useNavigate();
  const [playerName, setPlayerName] = useState('');
  const [showJoin, setShowJoin] = useState(false);
  const [roomCode, setRoomCode] = useState('');
  const { createRoom, joinRoom, roomData } = useSocket();

  // Naviguez vers le lobby quand roomData est défini
  useEffect(() => {
    if (roomData) {
      navigate('/lobby');
    }
  }, [roomData, navigate]);

  const handleCreateRoom = async () => {
    if (playerName.trim()) {
      await createRoom(playerName);
    }
  };

  const handleJoinRoom = async () => {
    if (playerName.trim() && roomCode.trim()) {
      const response = await joinRoom(roomCode, playerName);
      if (!response.success) {
        alert(response.error || 'Impossible to join la room');
      }
    }
  };

  return (
    <div className="home-container">
      <div className="home-card">
        <h1 className="game-title">🎮 Jeux de Soirée</h1>
        <p className="subtitle">Jeux de cartes en multijoueur</p>

        <div className="form-group">
          <input
            type="text"
            placeholder="Votre nom"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && !showJoin && handleCreateRoom()}
            className="input-field"
          />
        </div>

        {!showJoin ? (
          <div className="button-group">
            <button onClick={handleCreateRoom} className="btn btn-primary">
              ➕ Créer une partie
            </button>
            <button onClick={() => setShowJoin(true)} className="btn btn-secondary">
              🔗 Rejoindre une partie
            </button>
          </div>
        ) : (
          <div className="form-group">
            <input
              type="text"
              placeholder="Code de la partie"
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
              onKeyPress={(e) => e.key === 'Enter' && handleJoinRoom()}
              className="input-field"
              maxLength="6"
            />
            <div className="button-group">
              <button onClick={handleJoinRoom} className="btn btn-primary">
                ✓ Rejoindre
              </button>
              <button onClick={() => setShowJoin(false)} className="btn btn-secondary">
                ← Retour
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};