import React, { useState, useEffect, useCallback } from "react";
// Si tu as besoin de la navigation ou des websockets comme dans ton exemple, décommente ces lignes :
//import { useNavigate } from "react-router-dom";
//import { useSocket } from "../../hooks/useSocket";
import "./Minesweeper.css";

const DIFFICULTIES = {
  beginner: { rows: 9, cols: 9, mines: 10, label: "Débutant" },
  intermediate: { rows: 16, cols: 16, mines: 40, label: "Intermédiaire" },
  expert: { rows: 16, cols: 30, mines: 99, label: "Expert" },
};

const Minesweeper = () => {
  // States du jeu
  const [difficulty, setDifficulty] = useState("beginner");
  const [grid, setGrid] = useState([]);
  const [gameStatus, setGameStatus] = useState("idle"); // idle, playing, won, lost
  const [minesLeft, setMinesLeft] = useState(DIFFICULTIES.beginner.mines);
  const [time, setTime] = useState(0);
  const [isFlagMode, setIsFlagMode] = useState(false);
  const [isFirstClick, setIsFirstClick] = useState(true);

  // Chronomètre
  useEffect(() => {
    let timer;
    if (gameStatus === "playing") {
      timer = setInterval(() => setTime((t) => t + 1), 1000);
    }
    return () => clearInterval(timer);
  }, [gameStatus]);

  // Initialisation d'une grille vide
  const initializeGrid = useCallback(() => {
    const { rows, cols, mines } = DIFFICULTIES[difficulty];
    const newGrid = Array(rows)
      .fill(null)
      .map(() =>
        Array(cols)
          .fill(null)
          .map(() => ({
            isMine: false,
            isRevealed: false,
            isFlagged: false,
            neighborMines: 0,
          })),
      );
    setGrid(newGrid);
    setGameStatus("idle");
    setMinesLeft(mines);
    setTime(0);
    setIsFirstClick(true);
  }, [difficulty]);

  useEffect(() => {
    initializeGrid();
  }, [initializeGrid]);

  // Placement des mines après le premier clic pour éviter de perdre immédiatement
  const placeMinesAndCalculate = (firstR, firstC) => {
    const { rows, cols, mines } = DIFFICULTIES[difficulty];
    let newGrid = [...grid];
    let minesPlaced = 0;

    while (minesPlaced < mines) {
      const r = Math.floor(Math.random() * rows);
      const c = Math.floor(Math.random() * cols);

      // On s'assure de ne pas placer de mine sur le premier clic ni sur une case déjà minée
      if (!newGrid[r][c].isMine && (r !== firstR || c !== firstC)) {
        newGrid[r][c].isMine = true;
        minesPlaced++;
      }
    }

    // Calcul des nombres de mines voisines
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (!newGrid[r][c].isMine) {
          let count = 0;
          for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
              if (r + i >= 0 && r + i < rows && c + j >= 0 && c + j < cols) {
                if (newGrid[r + i][c + j].isMine) count++;
              }
            }
          }
          newGrid[r][c].neighborMines = count;
        }
      }
    }
    return newGrid;
  };

  const revealCell = (r, c, currentGrid) => {
    if (
      r < 0 ||
      r >= DIFFICULTIES[difficulty].rows ||
      c < 0 ||
      c >= DIFFICULTIES[difficulty].cols ||
      currentGrid[r][c].isRevealed ||
      currentGrid[r][c].isFlagged
    ) {
      return;
    }

    currentGrid[r][c].isRevealed = true;

    if (currentGrid[r][c].neighborMines === 0 && !currentGrid[r][c].isMine) {
      for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
          revealCell(r + i, c + j, currentGrid);
        }
      }
    }
  };

  const checkWin = (currentGrid) => {
    const { rows, cols, mines } = DIFFICULTIES[difficulty];
    let revealedCount = 0;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (currentGrid[r][c].isRevealed) revealedCount++;
      }
    }
    if (revealedCount === rows * cols - mines) {
      setGameStatus("won");
    }
  };

  const handleCellClick = (r, c) => {
    if (gameStatus === "won" || gameStatus === "lost" || grid[r][c].isRevealed)
      return;

    if (isFlagMode) {
      handleRightClick(null, r, c);
      return;
    }

    if (grid[r][c].isFlagged) return;

    let newGrid = [...grid.map((row) => [...row])];

    if (isFirstClick) {
      newGrid = placeMinesAndCalculate(r, c);
      setIsFirstClick(false);
      setGameStatus("playing");
    }

    if (newGrid[r][c].isMine) {
      newGrid[r][c].isRevealed = true;
      setGameStatus("lost");
      setGrid(newGrid);
      return;
    }

    revealCell(r, c, newGrid);
    setGrid(newGrid);
    checkWin(newGrid);
  };

  const handleRightClick = (e, r, c) => {
    if (e) e.preventDefault();
    if (gameStatus === "won" || gameStatus === "lost" || grid[r][c].isRevealed)
      return;

    let newGrid = [...grid.map((row) => [...row])];
    const cell = newGrid[r][c];

    if (!cell.isFlagged && minesLeft > 0) {
      cell.isFlagged = true;
      setMinesLeft((prev) => prev - 1);
    } else if (cell.isFlagged) {
      cell.isFlagged = false;
      setMinesLeft((prev) => prev + 1);
    }
    setGrid(newGrid);
  };

  const getFaceIcon = () => {
    if (gameStatus === "won") return "😎";
    if (gameStatus === "lost") return "😵";
    return "🙂";
  };

  return (
    <div className="minesweeper-container">
      {/* Header et difficulté */}
      <div className="ms-header">
        <div className="ms-difficulty-selector">
          {Object.entries(DIFFICULTIES).map(([key, config]) => (
            <button
              key={key}
              className={`ms-diff-btn ${difficulty === key ? "active" : ""}`}
              onClick={() => setDifficulty(key)}
            >
              {config.label}
            </button>
          ))}
        </div>
      </div>

      {/* Barre d'état (Mines, Smiley, Chrono) */}
      <div className="ms-status-bar">
        <div className="ms-lcd">{minesLeft.toString().padStart(3, "0")}</div>
        <button className="ms-face-btn" onClick={initializeGrid}>
          {getFaceIcon()}
        </button>
        <div className="ms-lcd">{time.toString().padStart(3, "0")}</div>
      </div>

      {/* Bouton pour les joueurs sur Mobile (Creuser vs Drapeau) */}
      <div className="ms-mobile-toggle">
        <button
          className={`ms-toggle-btn ${isFlagMode ? "flag-active" : ""}`}
          onClick={() => setIsFlagMode(!isFlagMode)}
        >
          {isFlagMode ? "🚩 Mode Drapeau" : "⛏️ Mode Creuser"}
        </button>
      </div>

      {/* Grille du jeu */}
      <div className="ms-board-wrapper">
        <div
          className="ms-grid"
          style={{
            gridTemplateColumns: `repeat(${DIFFICULTIES[difficulty].cols}, 1fr)`,
          }}
        >
          {grid.map((row, r) =>
            row.map((cell, c) => {
              // Détermination des classes CSS de chaque cellule
              let cellClass = "ms-cell";
              if (cell.isRevealed) cellClass += " revealed";
              if (cell.isRevealed && cell.isMine && gameStatus === "lost")
                cellClass += " mine-hit";
              if (cell.isFlagged) cellClass += " flagged";
              if (cell.isRevealed && cell.neighborMines > 0 && !cell.isMine) {
                cellClass += ` num-${cell.neighborMines}`;
              }

              return (
                <div
                  key={`${r}-${c}`}
                  className={cellClass}
                  onClick={() => handleCellClick(r, c)}
                  onContextMenu={(e) => handleRightClick(e, r, c)}
                >
                  {cell.isFlagged && !cell.isRevealed ? "🚩" : ""}
                  {cell.isRevealed && cell.isMine ? "💣" : ""}
                  {cell.isRevealed && !cell.isMine && cell.neighborMines > 0
                    ? cell.neighborMines
                    : ""}
                </div>
              );
            }),
          )}
        </div>
      </div>

      {/* Notifications de Fin de Partie */}
      {gameStatus === "won" && (
        <div className="ms-modal-banner won">
          🎉 Victoire ! Vous avez déminé la zone !
        </div>
      )}
      {gameStatus === "lost" && (
        <div className="ms-modal-banner lost">
          💥 Boum ! Vous avez touché une mine !
        </div>
      )}
    </div>
  );
};

export default Minesweeper;
