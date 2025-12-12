const { Deck } = require('../utils/CardUtils');

class PMUGame {
  constructor(players) {
    this.players = players.map(p => ({
      ...p,
      bets: {}, // { suit: amount }
      penalties: [], // Array of penalty objects { type: 'drink'/'distribute', amount: X }
      hasBet: false,
    }));

    this.deck = new Deck();
    // Remove Aces as they are not used for horse progression
    this.deck.cards = this.deck.cards.filter(card => !['A'].includes(card.value));

    this.horses = {
      hearts: { suit: 'hearts', cardsDrawn: 0 },
      diamonds: { suit: 'diamonds', cardsDrawn: 0 },
      clubs: { suit: 'clubs', cardsDrawn: 0 },
      spades: { suit: 'spades', cardsDrawn: 0 }
    };

    this.stage = 'betting'; // betting, race-starting, racing, finished
    this.raceRanking = [];
    this.history = [];
  }

  placeBet(playerId, suit, amount) {
    const player = this.players.find(p => p.id === playerId);
    if (!player || player.hasBet) return false;

    // For simplicity, let's assume players can bet whatever they want for now
    // A real implementation might check against a player's available points/drinks
    player.bets[suit] = (player.bets[suit] || 0) + amount;
    player.hasBet = true;

    return true;
  }

  // Host action to start the race after everyone has bet
  startRace() {
    if (this.stage !== 'betting') return false;
    
    const allPlayersHaveBet = this.players.every(p => p.hasBet);
    if (!allPlayersHaveBet) return false;
    
    this.stage = 'racing';
    return true;
  }

  drawCard() {
    if (this.stage !== 'racing' || this.deck.cardsRemaining() === 0) {
      // If the deck runs out, end the game with the current ranking
      this.endGame();
      return null;
    }

    const card = this.deck.draw();
    const suit = card.suit;
    
    if (this.horses[suit]) {
      this.horses[suit].cardsDrawn += 1;
      this.history.push(card);

      // Check if a horse has finished the race
      if (this.horses[suit].cardsDrawn >= 7 && !this.raceRanking.find(r => r.suit === suit)) {
        this.raceRanking.push({ suit, rank: this.raceRanking.length + 1 });
      }

      // If all horses have finished, end the game
      if (this.raceRanking.length === 4) {
        this.endGame();
      }
    }

    return card;
  }

  endGame() {
    this.stage = 'finished';

    // If the game ends prematurely, complete the ranking based on cards drawn
    const rankedSuits = this.raceRanking.map(r => r.suit);
    const unrankedHorses = Object.values(this.horses)
      .filter(h => !rankedSuits.includes(h.suit))
      .sort((a, b) => b.cardsDrawn - a.cardsDrawn); // Sort descending by progress
    
    unrankedHorses.forEach(h => {
      this.raceRanking.push({ suit: h.suit, rank: this.raceRanking.length + 1 });
    });

    // Calculate penalties based on final ranking
    this.players.forEach(player => {
      player.penalties = []; // Reset penalties
      for (const [suit, betAmount] of Object.entries(player.bets)) {
        const rankInfo = this.raceRanking.find(r => r.suit === suit);
        if (rankInfo) {
          switch (rankInfo.rank) {
            case 1: // 1st place -> Distribute x2
              player.penalties.push({ type: 'distribute', amount: betAmount * 2, horse: suit });
              break;
            case 2: // 2nd place -> Distribute x1
              player.penalties.push({ type: 'distribute', amount: betAmount, horse: suit });
              break;
            case 3: // 3rd place -> Drink x1
              player.penalties.push({ type: 'drink', amount: betAmount, horse: suit });
              break;
            case 4: // 4th place -> Drink x2
              player.penalties.push({ type: 'drink', amount: betAmount * 2, horse: suit });
              break;
            default:
              break;
          }
        }
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
        bets: p.bets,
        penalties: p.penalties,
      })),
      horses: this.horses,
      raceRanking: this.raceRanking,
      allPlayersHaveBet: this.players.every(p => p.hasBet),
      cardsRemaining: this.deck.cardsRemaining(),
      history: this.history
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
        // Only host can start the race
        if (player.isHost) {
          this.startRace();
        }
        break;
      case 'drawCard':
        // In this version, anyone can draw, but could be restricted to current player if needed
        this.drawCard();
        break;
    }

    return this.getState();
  }
}

module.exports = PMUGame;
