import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSocket } from '../hooks/useSocket';
import './Home.css';

export const Home = () => {
  const navigate = useNavigate();
  const [playerName, setPlayerName] = useState('');
  const [showJoin, setShowJoin] = useState(false);
  const [roomCode, setRoomCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { createRoom, joinRoom, roomData } = useSocket();

  // Naviguez vers le lobby quand roomData est défini
  useEffect(() => {
    if (roomData) {
      navigate('/lobby');
    }
  }, [roomData, navigate]);

  const handleCreateRoom = async () => {
    if (playerName.trim()) {
      setIsLoading(true);
      setError('');
      const response = await createRoom(playerName);
      if (!response.success) {
        setError(response.error || 'Impossible de créer la partie.');
      }
      setIsLoading(false);
    }
  };

  const handleJoinRoom = async () => {
    if (playerName.trim() && roomCode.trim()) {
      setIsLoading(true);
      setError('');
      const response = await joinRoom(roomCode, playerName);
      if (!response.success) {
        setError(response.error || 'Impossible de rejoindre la partie.');
      }
      setIsLoading(false);
    }
  };

  return (
    <div className="home-container">
      <div className="home-card">
        <h1 className="game-title">🎮 Jeux de Soirée</h1>
        <p className="subtitle">Jeux de cartes en multijoueur</p>

        {error && <p className="error-message">{error}</p>}

        <div className="form-group">
          <input
            type="text"
            placeholder="Votre nom"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && !showJoin && handleCreateRoom()}
            className="input-field"
            disabled={isLoading}
          />
        </div>

        {!showJoin ? (
          <div className="button-group">
            <button onClick={handleCreateRoom} className="btn btn-primary" disabled={isLoading}>
              {isLoading ? 'Création...' : '➕ Créer une partie'}
            </button>
            <button onClick={() => setShowJoin(true)} className="btn btn-secondary" disabled={isLoading}>
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
              disabled={isLoading}
            />
            <div className="button-group">
              <button onClick={handleJoinRoom} className="btn btn-primary" disabled={isLoading}>
                {isLoading ? 'Connexion...' : '✓ Rejoindre'}
              </button>
              <button onClick={() => setShowJoin(false)} className="btn btn-secondary" disabled={isLoading}>
                ← Retour
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};