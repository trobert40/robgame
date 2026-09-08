const PMUGame = require('./games/PMUGame');

const players = [{ id: 'p1', name: 'Tester', isHost: true }];
const game = new PMUGame(players);

game.placeBet('p1', 'hearts', 1);
game.startRace();

// Scenario: Hearts finished and ranked. Diamonds about to finish.
game.horses.hearts.currentPosition = 6;
game.raceRanking = [{ suit: 'hearts', rank: 1 }];

game.horses.diamonds.currentPosition = 5;
game.horses.clubs.currentPosition = 0;
game.horses.spades.currentPosition = 0;

// Force next card to be Diamonds
game.deck.cards.push({ suit: 'diamonds', value: '10' });

console.log('Drawing card (Diamonds)...');
game.drawCard();

const diamondRank = game.raceRanking.find(r => r.suit === 'diamonds');
if (diamondRank) {
    console.log('SUCCESS: Diamonds was added to ranking. Rank:', diamondRank.rank);
} else {
    console.log('FAILURE: Diamonds was NOT added to ranking.');
}
