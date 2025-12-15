import React, { createContext, useState, useEffect, useCallback } from "react";
import io from "socket.io-client";

export const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);
  const [currentRoom, setCurrentRoom] = useState(null);
  const [roomData, setRoomData] = useState(null);
  const [messages, setMessages] = useState([]);
  const [penalty, setPenalty] = useState(null);
  const [isChatVisible, setIsChatVisible] = useState(false);

  const toggleChatVisibility = () => setIsChatVisible(prev => !prev);

  const closePenaltyModal = () => setPenalty(null);

  useEffect(() => {
    // Détermine l'URL : localhost si on développe, sinon l'adresse de votre VPS
    const SERVER_URL =
      window.location.hostname === "localhost"
        ? "http://localhost:3001"
        : "https://api.robgame.fr";

    const newSocket = io(process.env.REACT_APP_SERVER_URL || SERVER_URL, {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
    });

    newSocket.on("connect", () => {
      setConnected(true);
      console.log("Connected to server");
    });

    newSocket.on("disconnect", () => {
      setConnected(false);
      console.log("Disconnected from server");
    });

    newSocket.on("playerJoined", (data) => {
      setRoomData(data.roomData);
      if (data.systemMessage) {
        setMessages((prev) => [
          ...prev,
          { ...data.systemMessage, type: "system" },
        ]);
      }
    });

    newSocket.on("playerLeft", (data) => {
      setRoomData(data.roomData);
      if (data.systemMessage) {
        setMessages((prev) => [
          ...prev,
          { ...data.systemMessage, type: "system" },
        ]);
      }
    });

    newSocket.on("gameStarted", (data) => {
      setRoomData(data.roomData);
      setMessages([]); // Clear chat on game start
    });

    newSocket.on("gameStateUpdated", (data) => {
      setRoomData(data);
    });

    newSocket.on("roomStateUpdated", (data) => {
      setRoomData(data);
    });

    newSocket.on("newMessage", (messageData) => {
      setMessages((prev) => [...prev, messageData]);
    });

    newSocket.on("penalty_received", (data) => {
      setPenalty(data.penalties);
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  const createRoom = useCallback(
    (playerName) => {
      return new Promise((resolve) => {
        socket?.emit("createRoom", playerName, (response) => {
          if (response.success) {
            setCurrentRoom(response.roomCode);
            setRoomData(response.roomData);
            setMessages([]); // Clear messages for new room
          }
          resolve(response);
        });
      });
    },
    [socket]
  );

  const joinRoom = useCallback(
    (roomCode, playerName) => {
      return new Promise((resolve) => {
        socket?.emit("joinRoom", roomCode, playerName, (response) => {
          if (response.success) {
            setCurrentRoom(roomCode);
            setRoomData(response.roomData);
            setMessages([]); // Clear messages for new room
          }
          resolve(response);
        });
      });
    },
    [socket]
  );

  const startGame = useCallback(
    (gameType) => {
      return new Promise((resolve) => {
        socket?.emit("startGame", gameType, (response) => {
          resolve(response);
        });
      });
    },
    [socket]
  );

  const sendGameAction = useCallback(
    (action) => {
      return new Promise((resolve) => {
        socket?.emit("gameAction", action, (response) => {
          resolve(response);
        });
      });
    },
    [socket]
  );

  const leaveRoom = useCallback(() => {
    return new Promise((resolve) => {
      socket?.emit("leaveRoom", (response) => {
        if (response.success) {
          setCurrentRoom(null);
          setRoomData(null);
          setMessages([]);
        }
        resolve(response);
      });
    });
  }, [socket]);

  const sendMessage = useCallback(
    (message) => {
      return new Promise((resolve) => {
        socket?.emit("sendMessage", message, (response) => {
          resolve(response);
        });
      });
    },
    [socket]
  );

  const playAgain = useCallback(() => {
    socket?.emit("playAgain");
  }, [socket]);

  const value = {
    socket,
    connected,
    currentRoom,
    roomData,
    messages,
    penalty,
    closePenaltyModal,
    createRoom,
    joinRoom,
    startGame,
    sendGameAction,
    leaveRoom,
    sendMessage,
    playAgain,
    isChatVisible,
    toggleChatVisibility,
  };

  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  );
};
