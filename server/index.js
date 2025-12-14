const express = require("express");
const http = require("http");
const socketIO = require("socket.io");
const cors = require("cors");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const GameRoom = require("./GameRoom");

const app = express();
const server = http.createServer(app);

const allowedOrigins = [
  "https://robgame.fr",
  "https://api.robgame.fr",
  "https://trobert40.github.io",
  "http://localhost:3000",
  "http://localhost:3001",
];

const corsOptions = {
  origin: (origin, callback) => {
    if (
      !origin ||
      allowedOrigins.includes(origin) ||
      origin.startsWith("http://localhost:") ||
      origin.startsWith("http://192.168.") ||
      origin.startsWith("http://10.")
    ) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST"],
};

const io = socketIO(server, {
  cors: corsOptions,
});

app.use(cors(corsOptions));
app.use(express.json());

// Serve static files from React app
app.use(express.static(path.join(__dirname, "../client/build")));

// Store active rooms
const rooms = new Map();

// Socket.IO event handlers
io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Create a new room
  socket.on("createRoom", (playerName, callback) => {
    if (
      typeof playerName !== "string" ||
      playerName.trim().length === 0 ||
      playerName.length > 20
    ) {
      return callback({ success: false, error: "Invalid player name." });
    }

    let roomCode;
    do {
      roomCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    } while (rooms.has(roomCode));

    const room = new GameRoom(roomCode, playerName, socket.id);
    rooms.set(roomCode, room);

    socket.join(roomCode);
    socket.playerName = playerName;
    socket.currentRoom = roomCode;

    console.log(`Room created: ${roomCode} by ${playerName}`);
    callback({ success: true, roomCode, roomData: room.getState() });
  });

  // Join an existing room
  socket.on("joinRoom", (roomCode, playerName, callback) => {
    if (typeof roomCode !== "string" || roomCode.length !== 6) {
      return callback({ success: false, error: "Invalid room code." });
    }
    if (
      typeof playerName !== "string" ||
      playerName.trim().length === 0 ||
      playerName.length > 20
    ) {
      return callback({ success: false, error: "Invalid player name." });
    }

    const room = rooms.get(roomCode);

    if (!room) {
      callback({ success: false, error: "Room not found" });
      return;
    }

    if (room.isFull()) {
      callback({ success: false, error: "Room is full" });
      return;
    }

    room.addPlayer(playerName, socket.id);
    socket.join(roomCode);
    socket.playerName = playerName;
    socket.currentRoom = roomCode;

    io.to(roomCode).emit("playerJoined", {
      roomData: room.getState(),
      systemMessage: {
        id: uuidv4(),
        text: `${playerName} has joined the room.`,
        timestamp: new Date().toISOString(),
      },
    });

    callback({ success: true, roomData: room.getState() });
    console.log(`${playerName} joined room ${roomCode}`);
  });

  // Start game
  socket.on("startGame", (gameType, callback) => {
    if (!["PMU", "Purple", "pmu", "purple"].includes(gameType)) {
      return (
        callback && callback({ success: false, error: "Invalid game type." })
      );
    }

    const room = rooms.get(socket.currentRoom);
    if (!room) {
      return callback && callback({ success: false, error: "Room not found." });
    }

    const player = room.getPlayer(socket.id);
    if (!player || !player.isHost) {
      return (
        callback &&
        callback({ success: false, error: "Only the host can start the game." })
      );
    }

    room.startGame(gameType);
    io.to(socket.currentRoom).emit("gameStarted", {
      gameType,
      roomData: room.getState(),
    });
    console.log(
      `Game ${gameType} started in room ${socket.currentRoom} by host ${socket.id}`
    );
    if (callback) callback({ success: true, roomData: room.getState() });
  });

  // Game actions
  socket.on("gameAction", (action, callback) => {
    const room = rooms.get(socket.currentRoom);
    if (!room || !room.game) {
      return (
        callback && callback({ success: false, error: "Game not running." })
      );
    }

    // Server-side validation
    let isValid = true;
    const gameType = room.game.constructor.name;

    if (gameType === "PMUGame") {
      if (action.type === "placeBet") {
        const { suit, amount } = action;
        const validSuits = ["hearts", "diamonds", "clubs", "spades"];
        if (
          !validSuits.includes(suit) ||
          !Number.isInteger(amount) ||
          amount <= 0
        ) {
          isValid = false;
        }
      }
    } else if (gameType === "PurpleGame") {
      if (action.type === "predict") {
        const { prediction } = action;
        const validPredictions = ["rouge", "noir", "purple"];
        if (!validPredictions.includes(prediction)) {
          isValid = false;
        }
      }
    }

    if (!isValid) {
      console.error(`Invalid action from ${socket.id}:`, action);
      return callback && callback({ success: false, error: "Invalid action." });
    }

    if (room && room.game) {
      const game = room.game;
      const gameType = game.constructor.name;
      const oldStage = game.stage;

      const actionResult = game.handleAction(socket.id, action); // This mutates the game state

      const updatedRoomState = room.getState();

      if (gameType === "PurpleGame") {
        if (actionResult && actionResult.penalty) {
          socket.emit("penalty_received", {
            penalties: [{ amount: actionResult.penalty, type: "drink" }],
          });
        }
      } else if (gameType === "PMUGame") {
        if (
          updatedRoomState.game.stage === "finished" &&
          oldStage !== "finished"
        ) {
          updatedRoomState.game.players.forEach((player) => {
            if (player.penalties && player.penalties.length > 0) {
              const playerSocket = io.sockets.sockets.get(player.id);
              if (playerSocket) {
                playerSocket.emit("penalty_received", {
                  penalties: player.penalties,
                });
              }
            }
          });
        }
      }

      io.to(socket.currentRoom).emit("gameStateUpdated", updatedRoomState);
      if (callback) callback({ success: true, result: updatedRoomState });
    }
  });

  socket.on("playAgain", (callback) => {
    const roomCode = socket.currentRoom;
    if (roomCode) {
      const room = rooms.get(roomCode);
      if (room) {
        // Host check
        const player = room.getPlayer(socket.id);
        if (!player || !player.isHost) {
          return (
            callback &&
            callback({
              success: false,
              error: "Only the host can restart the game.",
            })
          );
        }

        room.playAgain();
        // Notify all players that the room is back to the lobby/waiting state
        io.to(roomCode).emit("roomStateUpdated", room.getState());
        if (callback) callback({ success: true });
      }
    }
  });

  socket.on("sendMessage", (message, callback) => {
    if (
      typeof message !== "string" ||
      message.trim().length === 0 ||
      message.length > 500
    ) {
      return (
        callback && callback({ success: false, error: "Invalid message." })
      );
    }
    const roomCode = socket.currentRoom;
    if (roomCode) {
      const room = rooms.get(roomCode);
      if (room) {
        const messageData = {
          id: uuidv4(), // Unique ID for each message
          senderId: socket.id,
          senderName: socket.playerName,
          text: message,
          timestamp: new Date().toISOString(),
        };
        // Broadcast to everyone in the room
        io.to(roomCode).emit("newMessage", messageData);
        if (callback) callback({ success: true });
      } else {
        if (callback) callback({ success: false, error: "Room not found." });
      }
    } else {
      if (callback)
        callback({ success: false, error: "You are not in a room." });
    }
  });

  socket.on("leaveRoom", (callback) => {
    const roomCode = socket.currentRoom;
    if (roomCode) {
      const room = rooms.get(roomCode);
      if (room) {
        const playerName = socket.playerName;
        room.removePlayer(socket.id);
        socket.leave(roomCode);
        socket.currentRoom = null;

        if (room.isEmpty()) {
          rooms.delete(roomCode);
          console.log(`Room ${roomCode} deleted as last player left.`);
        } else {
          io.to(roomCode).emit("playerLeft", {
            roomData: room.getState(),
            systemMessage: {
              id: uuidv4(),
              text: `${playerName} has left the room.`,
              timestamp: new Date().toISOString(),
            },
          });
        }
      }
    }
    if (callback)
      callback({ success: true, message: "You have left the room." });
    console.log(`User ${socket.id} gracefully left room ${roomCode}`);
  });

  // Disconnect
  socket.on("disconnect", () => {
    const roomCode = socket.currentRoom;
    if (roomCode) {
      const room = rooms.get(roomCode);
      if (room) {
        room.removePlayer(socket.id);

        if (room.isEmpty()) {
          rooms.delete(roomCode);
          console.log(`Room ${roomCode} deleted (empty)`);
        } else {
          io.to(roomCode).emit("playerLeft", {
            roomData: room.getState(),
            systemMessage: {
              id: uuidv4(),
              text: `${socket.playerName || "A player"} has left the room.`,
              timestamp: new Date().toISOString(),
            },
          });
        }
      }
    }
    console.log(`User disconnected: ${socket.id}`);
  });
});

// API routes
app.get("/api/health", (req, res) => {
  res.json({ status: "OK" });
});

app.get("/api/game", (req, res) => {
  res.json({ status: "ok", message: "API fonctionne" });
});

// Serve React app for all other routes
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/build/index.html"));
});

// Error handling
process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = server;
