const PMUGame = require('./games/PMUGame');

const players = [{ id: 'p1', name: 'Tester', isHost: true }];
const game = new PMUGame(players);

// Setup state manually to test the specific scenario
// 1. Set stage to racing
game.placeBet('p1', 'hearts', 1);
game.startRace();

// 2. Set horses positions
// We want to trigger the 5th side card (step 5).
// So minPosition must be >= 5.
game.horses.hearts.currentPosition = 6; // Finished
game.horses.diamonds.currentPosition = 5;
game.horses.clubs.currentPosition = 5;
game.horses.spades.currentPosition = 5;

// 3. Setup side card at index 4 (step 5) to be 'hearts'
game.sideCards[4] = { suit: 'hearts', value: '7', revealed: false, id: 5 };

console.log('Initial state:');
console.log('Hearts pos:', game.horses.hearts.currentPosition);
console.log('Side card 5 suit:', game.sideCards[4].suit);
console.log('Side card 5 revealed:', game.sideCards[4].revealed);

// 4. Force deck to draw a card that advances another horse (e.g. Clubs)
// effectively replacing the draw() method or manipulating the deck
// Simplest is to push a specific card to the top of the deck (which is the end of array usually, or check draw implementation)
// Deck.draw() usually pops.
game.deck.cards.push({ suit: 'clubs', value: '10' }); // Ensure last card is Clubs

console.log('Drawing a card (expecting Clubs)...');
const card = game.drawCard();
console.log('Drawn card:', card.suit, card.value);

// 5. Check logic
// Clubs should move 5 -> 6.
// minPosition is now 5 (Diamonds and Spades are 5).
// Side card 5 (step 5) condition: minPosition (5) >= step (5). TRUE.
// Side card 5 reveals. Suit is Hearts.
// Penalty: Hearts (pos 6). Should NOT move back.

console.log('Final state:');
console.log('Hearts pos:', game.horses.hearts.currentPosition);
console.log('Side card 5 revealed:', game.sideCards[4].revealed);

if (game.horses.hearts.currentPosition === 6) {
    console.log('SUCCESS: Hearts stayed at 6.');
} else {
    console.log('FAILURE: Hearts moved back to', game.horses.hearts.currentPosition);
}
