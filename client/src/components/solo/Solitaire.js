import React, { useState, useEffect } from "react";
import "./Solitaire.css";

const SUITS = ["hearts", "diamonds", "clubs", "spades"];
const VALUES = [
  "A",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "J",
  "Q",
  "K",
];

const getCardImage = (card) => {
  if (!card || !card.isRevealed) return "/assets/dos-bleu.svg";
  const suitMap = {
    hearts: "coeur",
    diamonds: "carreau",
    clubs: "trefle",
    spades: "pique",
  };
  const valueMap = {
    A: "01",
    2: "02",
    3: "03",
    4: "04",
    5: "05",
    6: "06",
    7: "07",
    8: "08",
    9: "09",
    10: "10",
    J: "V",
    Q: "D",
    K: "R",
  };
  return `/assets/${valueMap[card.value]}-${suitMap[card.suit]}.svg`;
};

const Solitaire = () => {
  const [deck, setDeck] = useState([]);
  const [waste, setWaste] = useState([]);
  const [foundations, setFoundations] = useState([[], [], [], []]);
  const [tableau, setTableau] = useState([[], [], [], [], [], [], []]);

  // Initialisation de la partie
  useEffect(() => {
    startNewGame();
  }, []);

  const startNewGame = () => {
    // 1. Créer le deck
    let newDeck = [];
    SUITS.forEach((suit) => {
      VALUES.forEach((value) => {
        const color =
          suit === "hearts" || suit === "diamonds" ? "red" : "black";
        newDeck.push({
          suit,
          value,
          color,
          isRevealed: false,
          id: `${value}-${suit}`,
        });
      });
    });

    // 2. Mélanger
    newDeck.sort(() => Math.random() - 0.5);

    // 3. Distribuer le tableau (7 colonnes)
    let newTableau = [[], [], [], [], [], [], []];
    for (let i = 0; i < 7; i++) {
      for (let j = i; j < 7; j++) {
        let card = newDeck.pop();
        if (i === j) card.isRevealed = true; // Révéler la carte du dessus
        newTableau[j].push(card);
      }
    }

    setTableau(newTableau);
    setDeck(newDeck);
    setWaste([]);
    setFoundations([[], [], [], []]);
  };

  const drawCard = () => {
    if (deck.length > 0) {
      const card = deck.pop();
      card.isRevealed = true;
      setWaste([...waste, card]);
      setDeck([...deck]);
    } else if (waste.length > 0) {
      // Recycler la défausse
      const recycled = waste
        .map((c) => ({ ...c, isRevealed: false }))
        .reverse();
      setDeck(recycled);
      setWaste([]);
    }
  };

  return (
    <div className="solitaire-container">
      <div className="solitaire-top">
        <div className="solitaire-stock">
          <div className="card-slot" onClick={drawCard}>
            {deck.length > 0 ? (
              <img
                src="/assets/dos-bleu.svg"
                alt="Deck"
                className="card-image"
              />
            ) : (
              <div className="empty-slot recycle">🔄</div>
            )}
          </div>
          <div className="card-slot waste">
            {waste.length > 0 && (
              <img
                src={getCardImage(waste[waste.length - 1])}
                alt="Waste"
                className="card-image"
              />
            )}
          </div>
        </div>

        <div className="solitaire-foundations">
          {foundations.map((pile, idx) => (
            <div key={idx} className="card-slot foundation">
              {pile.length > 0 ? (
                <img
                  src={getCardImage(pile[pile.length - 1])}
                  alt="Foundation"
                  className="card-image"
                />
              ) : (
                <div className="empty-slot">A</div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="solitaire-tableau">
        {tableau.map((col, colIdx) => (
          <div key={colIdx} className="tableau-col">
            {col.length === 0 && <div className="card-slot empty-slot"></div>}
            {col.map((card, cardIdx) => (
              <div
                key={card.id}
                className="tableau-card"
                style={{ top: `${cardIdx * 30}px` }}
              >
                <img
                  src={getCardImage(card)}
                  alt={card.id}
                  className="card-image"
                />
              </div>
            ))}
          </div>
        ))}
      </div>

      <button className="btn-restart" onClick={startNewGame}>
        Recommencer
      </button>
    </div>
  );
};

export default Solitaire;
