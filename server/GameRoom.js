const PMUGame = require("./games/PMUGame");
const PurpleGame = require("./games/PurpleGame");

class GameRoom {
  constructor(code, hostName, hostId) {
    this.code = code;
    this.players = [
      {
        id: hostId,
        name: hostName,
        isHost: true,
        gorgees: 0,
        penalties: 0,
      },
    ];
    this.game = null;
    this.gameType = null;
    this.status = "waiting"; // waiting, rules, playing, finished
    this.maxPlayers = 8;
  }

  addPlayer(name, id) {
    if (this.players.length < this.maxPlayers) {
      this.players.push({
        id,
        name,
        isHost: false,
        gorgees: 0,
        penalties: 0,
      });
      return true;
    }
    return false;
  }

  removePlayer(id) {
    const playerWasHost = this.players.find((p) => p.id === id)?.isHost;
    this.players = this.players.filter((p) => p.id !== id);

    // If the host left and there are other players, assign a new host.
    if (
      playerWasHost &&
      this.players.length > 0 &&
      !this.players.some((p) => p.isHost)
    ) {
      this.players[0].isHost = true;
      console.log(`New host assigned to: ${this.players[0].name}`);
    }
  }

  getPlayers() {
    return this.players;
  }

  getPlayer(id) {
    return this.players.find((p) => p.id === id);
  }

  isEmpty() {
    return this.players.length === 0;
  }

  isFull() {
    return this.players.length >= this.maxPlayers;
  }

  startGame(gameType) {
    this.gameType = gameType;
    this.status = "rules";

    if (gameType === "pmu") {
      this.game = new PMUGame(this.players);
    } else if (gameType === "purple") {
      this.game = new PurpleGame(this.players);
    }

    this.status = "playing";
  }

  playAgain() {
    this.game = null;
    this.gameType = null;
    this.status = "waiting";
    this.players.forEach((p) => {
      p.penalties = 0;
      p.gorgees = 0;
    });
  }

  getState() {
    return {
      code: this.code,
      players: this.getPlayers(),
      gameType: this.gameType,
      status: this.status,
      gameState: this.game ? this.game.getState() : null,
    };
  }
}

module.exports = GameRoom;
