import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSocket } from "../hooks/useSocket";
import "./Home.css";

export const Home = () => {
  const navigate = useNavigate();
  const [playerName, setPlayerName] = useState("");
  const [showJoin, setShowJoin] = useState(false);
  const [roomCode, setRoomCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { createRoom, joinRoom, roomData, getPublicRooms, connected } =
    useSocket();

  const [publicRooms, setPublicRooms] = useState([]);

  // Naviguez vers le lobby quand roomData est défini
  useEffect(() => {
    if (roomData) {
      navigate("/lobby");
    }
  }, [roomData, navigate]);

  // new useEffect to fetch public rooms
  useEffect(() => {
    let intervalId;

    const fetchPublicRooms = async () => {
      try {
        const rooms = await getPublicRooms();
        setPublicRooms(rooms);
        setError(""); // Clear error on success
      } catch (e) {
        setError("Impossible de récupérer les parties publiques.");
        if (intervalId) {
          clearInterval(intervalId);
        }
      }
    };

    if (showJoin) {
      console.log("Statut de la connexion :", connected);
      if (connected) {
        setIsLoading(true);
        fetchPublicRooms().finally(() => setIsLoading(false));
        intervalId = setInterval(fetchPublicRooms, 5000); // Poll every 5 seconds
      } else {
        setError("Non connecté au serveur.");
      }
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [showJoin, getPublicRooms, connected]);

  const handleCreateRoom = async () => {
    if (playerName.trim()) {
      setIsLoading(true);
      setError("");
      const response = await createRoom(playerName);
      if (!response.success) {
        setError(response.error || "Impossible de créer la partie.");
      }
      setIsLoading(false);
    }
  };

  const handleJoinRoom = async (code) => {
    const codeToJoin = code || roomCode;
    if (playerName.trim() && codeToJoin.trim()) {
      setIsLoading(true);
      setError("");
      const response = await joinRoom(codeToJoin.toUpperCase(), playerName);
      if (!response.success) {
        setError(response.error || "Impossible de rejoindre la partie.");
      }
      setIsLoading(false);
    }
  };

  const renderPublicRooms = () => (
    <div className="public-rooms-list">
      <h3>Parties publiques</h3>
      {publicRooms.length > 0 ? (
        <ul>
          {publicRooms.map((room) => (
            <li
              key={room.roomCode}
              onClick={() => handleJoinRoom(room.roomCode)}
            >
              <span>Salon de {room.hostName}</span>
              <span>
                {room.playerCount} joueur(s)
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p>Aucune partie publique en cours.</p>
      )}
    </div>
  );

  return (
    <div className="home-container">
      <div className="home-card">
        <h1
          className="game-title"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <img
            src="/assets/logo.png"
            alt="Logo"
            style={{ height: "70px", marginRight: "15px" }}
          />
          RobGame
        </h1>
        <p
          className="subtitle"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          Jeux de cartes en multijoueur
        </p>

        {error && <p className="error-message">{error}</p>}

        <div className="form-group">
          <input
            type="text"
            placeholder="Votre nom"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            onKeyPress={(e) =>
              e.key === "Enter" && !showJoin && handleCreateRoom()
            }
            className="input-field"
            disabled={isLoading}
          />
        </div>

        {!showJoin ? (
          <div className="button-group">
            <button
              onClick={handleCreateRoom}
              className="btn btn-primary"
              disabled={isLoading || !playerName.trim()}
            >
              {isLoading ? "Création..." : "➕ Créer une partie"}
            </button>
            <button
              onClick={() => setShowJoin(true)}
              className="btn btn-secondary"
              disabled={isLoading}
            >
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
              onKeyPress={(e) => e.key === "Enter" && handleJoinRoom()}
              className="input-field"
              maxLength="6"
              disabled={isLoading}
            />
            <div className="button-group">
              <button
                onClick={() => handleJoinRoom()}
                className="btn btn-primary"
                disabled={isLoading || !playerName.trim() || !roomCode.trim()}
              >
                {isLoading ? "Connexion..." : "✓ Rejoindre"}
              </button>
              <button
                onClick={() => setShowJoin(false)}
                className="btn btn-secondary"
                disabled={isLoading}
              >
                ← Retour
              </button>
            </div>
            {renderPublicRooms()}
          </div>
        )}
      </div>
    </div>
  );
};

