import React, { createContext, useState, useEffect, useCallback } from 'react';
import io from 'socket.io-client';

export const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);
  const [currentRoom, setCurrentRoom] = useState(null);
  const [players, setPlayers] = useState([]);
  const [roomData, setRoomData] = useState(null);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const newSocket = io(process.env.REACT_APP_SERVER_URL || `http://${window.location.hostname}:3001`, {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5
    });

    newSocket.on('connect', () => {
      setConnected(true);
      console.log('Connected to server');
    });

    newSocket.on('disconnect', () => {
      setConnected(false);
      console.log('Disconnected from server');
    });

    newSocket.on('playerJoined', (data) => {
      setPlayers(data.players);
      setRoomData(prev => ({ ...prev, players: data.players }));
      if (data.systemMessage) {
        setMessages(prev => [...prev, { ...data.systemMessage, type: 'system' }]);
      }
    });

    newSocket.on('playerLeft', (data) => {
      setPlayers(data.players);
      setRoomData(prev => ({ ...prev, players: data.players }));
      if (data.systemMessage) {
        setMessages(prev => [...prev, { ...data.systemMessage, type: 'system' }]);
      }
    });

    newSocket.on('gameStarted', (data) => {
      setRoomData(data.roomData);
      setMessages([]); // Clear chat on game start
    });

    newSocket.on('gameStateUpdated', (data) => {
      setRoomData(data);
    });
    
    newSocket.on('roomStateUpdated', (data) => {
      setRoomData(data);
    });

    newSocket.on('newMessage', (messageData) => {
      setMessages(prev => [...prev, messageData]);
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  const createRoom = useCallback((playerName) => {
    return new Promise((resolve) => {
      socket?.emit('createRoom', playerName, (response) => {
        if (response.success) {
          setCurrentRoom(response.roomCode);
          setRoomData(response.roomData);
          setPlayers(response.roomData.players);
          setMessages([]); // Clear messages for new room
        }
        resolve(response);
      });
    });
  }, [socket]);

  const joinRoom = useCallback((roomCode, playerName) => {
    return new Promise((resolve) => {
      socket?.emit('joinRoom', roomCode, playerName, (response) => {
        if (response.success) {
          setCurrentRoom(roomCode);
          setRoomData(response.roomData);
          setPlayers(response.roomData.players);
          setMessages([]); // Clear messages for new room
        }
        resolve(response);
      });
    });
  }, [socket]);

  const startGame = useCallback((gameType) => {
    return new Promise((resolve) => {
      socket?.emit('startGame', gameType, (response) => {
        resolve(response);
      });
    });
  }, [socket]);

  const sendGameAction = useCallback((action) => {
    return new Promise((resolve) => {
      socket?.emit('gameAction', action, (response) => {
        resolve(response);
      });
    });
  }, [socket]);

  const leaveRoom = useCallback(() => {
    return new Promise((resolve) => {
      socket?.emit('leaveRoom', (response) => {
        if (response.success) {
          setCurrentRoom(null);
          setRoomData(null);
          setPlayers([]);
          setMessages([]);
        }
        resolve(response);
      });
    });
  }, [socket]);

  const sendMessage = useCallback((message) => {
    return new Promise((resolve) => {
      socket?.emit('sendMessage', message, (response) => {
        resolve(response);
      });
    });
  }, [socket]);

  const playAgain = useCallback(() => {
    socket?.emit('playAgain');
  }, [socket]);

  const value = {
    socket,
    connected,
    currentRoom,
    players,
    roomData,
    messages,
    createRoom,
    joinRoom,
    startGame,
    sendGameAction,
    leaveRoom,
    sendMessage,
    playAgain
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};

