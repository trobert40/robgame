const { Deck } = require('../utils/CardUtils');

class PurpleGame {
  constructor(players) {
    this.players = players.map(p => ({
      ...p,
      stackedCards: [],
      penalties: 0,
      isCurrentPlayer: false
    }));

    this.deck = new Deck();
    this.currentPlayerIndex = 0;
    this.players[0].isCurrentPlayer = true;

    this.stage = 'playing'; // playing, finished
    this.currentCard = null;
    this.previousCard = null;
    this.consecutiveCorrect = 0;
    this.history = [];
  }

  getCurrentPlayer() {
    return this.players[this.currentPlayerIndex];
  }

  makePrediction(playerId, predictionType) {
    const player = this.players.find(p => p.id === playerId);
    if (!player || !player.isCurrentPlayer) return { success: false };

    if (this.deck.cardsRemaining() === 0) {
      this.endGame();
      return { success: false, message: 'Deck exhausted' };
    }

    // Handle Purple case separately as it involves two cards
    if (predictionType === 'purple') {
      if (this.deck.cardsRemaining() < 2) {
        this.nextPlayer();
        return { success: true, result: 'wrong', penalty: 0, message: 'Not enough cards for Purple' };
      }

      const card1 = this.deck.draw();
      const card2 = this.deck.draw();
      this.previousCard = this.currentCard; // Keep old previous
      this.currentCard = card2; // The last card drawn is now the current one

      const isCorrect = card1.getColor() !== card2.getColor();

      if (isCorrect) {
        player.stackedCards.push(card1, card2);
        this.consecutiveCorrect += 2; // Purple counts as two correct guesses

        this.history.push({
          player: player.name,
          prediction: predictionType,
          cards: [card1, card2],
          result: 'correct'
        });

        return {
          success: true,
          result: 'correct',
          cards: [card1, card2],
          consecutiveCorrect: this.consecutiveCorrect,
          canPass: this.consecutiveCorrect >= 2
        };
      } else {
        const penalty = player.stackedCards.length + 2;
        player.penalties += penalty;
        player.stackedCards = [];
        this.consecutiveCorrect = 0;

        this.history.push({
          player: player.name,
          prediction: predictionType,
          cards: [card1, card2],
          result: 'wrong',
          penalty
        });

        return {
          success: true,
          result: 'wrong',
          cards: [card1, card2],
          penalty,
        };
      }
    }

    // Standard prediction for all other cases
    this.previousCard = this.currentCard;
    this.currentCard = this.deck.draw();

    const isCorrect = this.checkPrediction(predictionType, this.currentCard, this.previousCard);

    if (isCorrect) {
      player.stackedCards.push(this.currentCard);
      this.consecutiveCorrect += 1;

      this.history.push({
        player: player.name,
        prediction: predictionType,
        card: this.currentCard,
        result: 'correct'
      });

      return {
        success: true,
        result: 'correct',
        card: this.currentCard,
        consecutiveCorrect: this.consecutiveCorrect,
        canPass: this.consecutiveCorrect >= 2
      };
    } else {
      const penalty = player.stackedCards.length + 1;
      player.penalties += penalty;
      player.stackedCards = [];
      this.consecutiveCorrect = 0;

      this.history.push({
        player: player.name,
        prediction: predictionType,
        card: this.currentCard,
        result: 'wrong',
        penalty
      });

      return {
        success: true,
        result: 'wrong',
        card: this.currentCard,
        penalty,
      };
    }
  }

  checkPrediction(predictionType, card, previousCard) {
    if (!card) return false;

    switch (predictionType) {
      case 'rouge':
        return card.getColor() === 'red';
      case 'noir':
        return card.getColor() === 'black';
      default:
        return false;
    }
  }

  passToNextPlayer() {
    this.consecutiveCorrect = 0;
    const currentPlayer = this.getCurrentPlayer();
    const nextPlayerIndex = (this.currentPlayerIndex + 1) % this.players.length;
    const nextPlayer = this.players[nextPlayerIndex];

    nextPlayer.stackedCards.push(...currentPlayer.stackedCards);
    currentPlayer.stackedCards = [];

    this.nextPlayer();
  }

  nextPlayer() {
    this.players[this.currentPlayerIndex].isCurrentPlayer = false;
    this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.players.length;
    this.players[this.currentPlayerIndex].isCurrentPlayer = true;
    this.consecutiveCorrect = 0;
  }

  endGame() {
    this.stage = 'finished';
  }

  getState() {
    return {
      stage: this.stage,
      players: this.players,
      currentPlayer: this.getCurrentPlayer(),
      currentCard: this.currentCard,
      previousCard: this.previousCard,
      cardsRemaining: this.deck.cardsRemaining(),
      consecutiveCorrect: this.consecutiveCorrect,
      canPass: this.consecutiveCorrect >= 2,
      history: this.history
    };
  }

  handleAction(playerId, action) {
    if (action.type === 'predict') {
      return this.makePrediction(playerId, action.prediction);
    } else if (action.type === 'pass') {
      this.passToNextPlayer();
    }

    return this.getState();
  }
}

module.exports = PurpleGame;
