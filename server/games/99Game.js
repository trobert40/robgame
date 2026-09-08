const { Deck } = require("../utils/CardUtils");

class NinetyNineGame {
  constructor(players) {
    this.players = players.map((p) => ({
      ...p,
      hand: [],
    }));
    this.deck = new Deck();
    this.count = 0;
    this.currentPlayerIndex = 0;
    this.gameDirection = 1; // 1 for forward, -1 for backward
    this.history = [];
    this.stage = "playing"; // playing, finished
    this.winner = null;
    this.loser = null;
    this.lastActionMessage = null;
    this.lastPlayedCard = null;

    this.dealInitialCards();
  }

  dealInitialCards() {
    for (let i = 0; i < 4; i++) {
      for (const player of this.players) {
        player.hand.push(this.deck.draw());
      }
    }
  }

  playCard(playerId, card, chosenValue) {
    if (this.stage === "finished") return;
    const player = this.players[this.currentPlayerIndex];
    if (player.id !== playerId) return;

    const cardIndex = player.hand.findIndex(
      (c) => c.suit === card.suit && c.value === card.value,
    );
    if (cardIndex === -1) return;

    // Remove card from hand
    const playedCard = player.hand.splice(cardIndex, 1)[0];
    this.lastPlayedCard = playedCard;

    const suitNames = {
      hearts: "Cœur",
      diamonds: "Carreau",
      clubs: "Trèfle",
      spades: "Pique",
    };
    const valueNames = {
      A: "As",
      K: "Roi",
      Q: "Dame",
      J: "Valet",
    };

    const cardDisplay = `${valueNames[playedCard.value] || playedCard.value} de ${suitNames[playedCard.suit] || playedCard.suit}`;

    // Update count based on card value
    let actionMessage = `${player.name} a joué un ${cardDisplay}.`;
    switch (playedCard.value) {
      case "A":
        this.count += chosenValue; // chosenValue should be 1 or 11
        actionMessage += ` Valeur choisie : +${chosenValue}.`;
        break;
      case "K":
        this.count = 70;
        actionMessage += ` Le compteur est fixé à 70.`;
        break;
      case "Q":
        this.gameDirection *= -1;
        actionMessage += ` Le sens du jeu est inversé !`;
        break;
      case "J":
        this.count += chosenValue; // chosenValue should be 10 or -10
        actionMessage += ` Valeur choisie : ${chosenValue > 0 ? "+10" : "-10"}.`;
        break;
      case "10":
        this.count += 10;
        break;
      case "9":
        this.count += 9;
        break;
      case "8":
        this.count += 8;
        break;
      case "7":
        this.count += 7;
        break;
      case "6":
        this.count += 6;
        break;
      case "5":
        this.count += 5;
        break;
      case "4":
        this.count += 4;
        break;
      case "3":
        this.count += 3;
        break;
      case "2":
        this.count += 2;
        break;
    }

    this.lastActionMessage = actionMessage;
    this.history.push(actionMessage);

    // Draw a new card
    const newCard = this.deck.draw();
    if (newCard) {
      player.hand.push(newCard);
    }

    // Check for penalties (sips)
    if (this.count % 10 === 0 && this.count > 0) {
      const sips = this.count / 10;
      this.lastActionMessage += ` ${player.name} distribue ${sips} gorgée${sips > 1 ? "s" : ""} !`;
    }

    // Check for game end
    if (this.count > 99) {
      this.stage = "finished";
      this.loser = player;
      this.lastActionMessage = `💥 ${player.name} a dépassé 99 et a perdu !`;
      this.history.push(this.lastActionMessage);
    } else {
      // Move to the next player
      this.currentPlayerIndex =
        (this.currentPlayerIndex + this.gameDirection + this.players.length) %
        this.players.length;
    }
  }

  getState() {
    return {
      players: this.players.map((p) => ({
        id: p.id,
        name: p.name,
        isHost: p.isHost,
        hand: p.hand,
        cardCount: p.hand.length,
      })),
      count: this.count,
      currentPlayerIndex: this.currentPlayerIndex,
      gameDirection: this.gameDirection,
      stage: this.stage,
      loser: this.loser,
      lastActionMessage: this.lastActionMessage,
      lastPlayedCard: this.lastPlayedCard,
      history: this.history.slice(-5),
      cardsRemaining: this.deck.cardsRemaining(),
    };
  }

  handleAction(playerId, action) {
    let penalty = null;

    switch (action.type) {
      case "playCard":
        this.playCard(playerId, action.card, action.chosenValue);
        break;
      case "viewCount":
        const player = this.players.find((p) => p.id === playerId);
        if (player) {
          player.penalties = (player.penalties || 0) + 1;
          penalty = { amount: 1, type: "drink" };
          this.lastActionMessage = `${player.name} a regardé le compteur (+1 gorgée).`;
        }
        break;
    }
    return { ...this.getState(), penalty };
  }
}

module.exports = NinetyNineGame;
