# Copilot Instructions - App Jeux Soirée

## Project Overview

**App Jeux Soirée** The whole game is in french.The game is a web-based multiplayer party game application where users can connect via a host's code or QR code, select games, and play classic card games and social games together on phones, tablets, or web browsers.

**Tech Stack** (to be determined): The project will involve a web frontend (likely React/Vue), a backend server, and real-time multiplayer mechanics.

## Core Game Library

The application implements the following games:

### PMU (Horse Racing Cards)
- **Mechanics**: Players bet gorgées (sips/penalties) on colored card suits that advance as their corresponding cards are drawn
- **Key Rules**:
  - 4 Aces (suits) act as "horses" advancing one position per matching card drawn
  - Players distribute 5 gorgées as bets before the race
  - First Ace to 7 matching cards wins
  - Winners distribute gorgées; losers pay penalties
  - Can bet multiple gorgées on different horses
- **Reference**: `Instruction app.instructions.md` lines 14-40

### Purple (Higher/Lower Variant)
- **Mechanics**: Players predict card properties (color, value, or sequences) to build streaks
- **Prediction Options**:
  - **Rouge/Noir**: Card color (Red/Black)
  - **Purple**: Next two cards are different colors
  - **Plus/Moins**: Card value higher/lower than previous (from 2nd card onward)
- **Key Rules**:
  - Correct predictions stack cards in front of player
  - After 3 consecutive correct predictions, can pass turn
  - Wrong prediction costs penalties equal to stacked cards
  - Card values: A=1, J=11, Q=12, K=13
- **Reference**: `Instruction app.instructions.md` lines 42-79

## Architecture Patterns (TBD)

When implementing the application:

1. **Game Engine Structure**: Each game should be an isolated module with turn logic, validation, and state management
2. **Multiplayer Integration**: Real-time synchronization of game state across players (consider WebSockets or similar)
3. **User Flow**: Host creates game → Others join via code/QR → Join lobby → Select game → Read rules → Start game
4. **Penalty/Gorgée Tracking**: Implement a shared state system that tracks individual player scores/penalties

## Development Notes

- Additional games may be added to the portfolio (currently only PMU and Purple planned)
- Server can run locally or be hosted on external platforms
- Keep game rules tightly aligned with the specifications in `Instruction app.instructions.md` to maintain game integrity
- Each game is language-agnostic; focus on accurate rule implementation and UI clarity

## File References

- Game specifications: `.github/instructions/Instruction app.instructions.md`
- Copilot guidelines: `.github/copilot-instructions.md` (this file)
