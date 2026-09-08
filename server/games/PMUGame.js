const { Deck } = require('../utils/CardUtils');

class PMUGame {
  constructor(players) {
    this.players = players.map(p => ({
      ...p,
      bets: {}, // { suit: amount }
      hasBet: false,
    }));

    this.deck = new Deck();
    // The 4 Aces are the horses, not in the deck
    this.deck.cards = this.deck.cards.filter(card => card.value !== 'A');
    
    // Draw 5 cards for the side barriers
    this.sideCards = [];
    for (let i = 0; i < 5; i++) {
        const card = this.deck.draw();
        if (card) {
            this.sideCards.push({ ...card, revealed: false, id: i + 1 });
        }
    }
    // Side cards are ordered from bottom to top (step 1 to 5)
    // We will check them in order.

    this.horses = {
      hearts: { suit: 'hearts', currentPosition: 0 },
      diamonds: { suit: 'diamonds', currentPosition: 0 },
      clubs: { suit: 'clubs', currentPosition: 0 },
      spades: { suit: 'spades', currentPosition: 0 }
    };

    this.stage = 'betting'; // betting, racing, finished
    this.raceRanking = [];
    this.lastDrawnCard = null;
    this.history = [];
  }

  placeBet(playerId, suit, amount) {
    const player = this.players.find(p => p.id === playerId);
    if (!player || player.hasBet || this.stage !== 'betting') return false;

    player.bets = { [suit]: amount }; // Overwrite previous bet if any, simplified logic
    player.hasBet = true;

    return true;
  }

  startRace() {
    if (this.stage !== 'betting' || !this.players.every(p => p.hasBet)) return false;
    
    this.stage = 'racing';
    return true;
  }

  drawCard() {
    if (this.stage !== 'racing' || this.deck.cardsRemaining() === 0) {
      if (this.stage === 'racing') this.endGame();
      return null;
    }

    const card = this.deck.draw();
    this.lastDrawnCard = card;
    this.history.push(card);
    const suit = card.suit;
    
    // 1. Advance the horse
    if (this.horses[suit] && this.horses[suit].currentPosition < 6) {
      this.horses[suit].currentPosition += 1;
    }

    // 2. Check for race finish
    const unrankedFinishedHorses = Object.values(this.horses).filter(h => 
        h.currentPosition >= 6 && !this.raceRanking.find(r => r.suit === h.suit)
    );

    unrankedFinishedHorses.forEach(h => {
        this.raceRanking.push({ suit: h.suit, rank: this.raceRanking.length + 1 });
    });

    if (this.raceRanking.length === 4) { // All horses finished
        this.endGame();
        return card;
    }


    // 3. Check side cards
    const minPosition = Math.min(...Object.values(this.horses).map(h => h.currentPosition));

    for (let i = 0; i < this.sideCards.length; i++) {
        // The steps are 1-based, array is 0-based
        const step = i + 1;
        if (minPosition >= step && !this.sideCards[i].revealed) {
            this.sideCards[i].revealed = true;
            const penaltySuit = this.sideCards[i].suit;
            
            // The corresponding horse moves back one space
            // Only if the horse hasn't finished yet (currentPosition < 6)
            if (this.horses[penaltySuit] && this.horses[penaltySuit].currentPosition < 6) {
                this.horses[penaltySuit].currentPosition = Math.max(0, this.horses[penaltySuit].currentPosition - 1);
            }
        }
    }
    
    // Re-check for game end after side card penalties, though it's unlikely to end here.
    if (Object.values(this.horses).every(h => h.currentPosition >=6) && this.raceRanking.length < 4) {
        this.endGame();
    }


    return card;
  }

  endGame() {
    this.stage = 'finished';

    // Complete the ranking for any horse that hasn't officially crossed the line
    const rankedSuits = this.raceRanking.map(r => r.suit);
    const unrankedHorses = Object.values(this.horses)
      .filter(h => !rankedSuits.includes(h.suit))
      .sort((a, b) => b.currentPosition - a.currentPosition);
    
    unrankedHorses.forEach(h => {
      if (!this.raceRanking.find(r => r.suit === h.suit)) {
        this.raceRanking.push({ suit: h.suit, rank: this.raceRanking.length + 1 });
      }
    });
  }

  getState() {
    return {
      stage: this.stage,
      players: this.players.map(p => ({
        id: p.id,
        name: p.name,
        isHost: p.isHost,
        hasBet: p.hasBet,
        bets: p.bets, // Keep bets simple for the new frontend
      })),
      horses: this.horses,
      sideCards: this.sideCards,
      raceRanking: this.raceRanking,
      lastDrawnCard: this.lastDrawnCard,
      allPlayersHaveBet: this.players.every(p => p.hasBet),
      cardsRemaining: this.deck.cardsRemaining(),
      history: this.history.slice(-5) // Send only the last 5 events
    };
  }

  handleAction(playerId, action) {
    const player = this.players.find(p => p.id === playerId);
    if (!player) return;

    switch (action.type) {
      case 'placeBet':
        this.placeBet(playerId, action.suit, action.amount);
        break;
      case 'startRace':
        if (player.isHost) {
          this.startRace();
        }
        break;
      case 'drawCard':
        this.drawCard();
        break;
    }

    return this.getState();
  }
}

module.exports = PMUGame;