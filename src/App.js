import { useEffect, useMemo, useState } from 'react';
import './App.css';

const WINNING_LINES = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

const MODES = {
  DUO: 'duo',
  SOLO: 'solo',
};

const emptyBoard = () => Array(9).fill(null);

const findCriticalMove = (board, player) => {
  for (const line of WINNING_LINES) {
    const marks = line.map((index) => board[index]);
    const playerMarks = marks.filter((mark) => mark === player).length;
    const emptySquares = line.filter((index) => !board[index]);
    if (playerMarks === 2 && emptySquares.length === 1) {
      return emptySquares[0];
    }
  }
  return null;
};

const pickRandomIndex = (options) => {
  if (!options.length) {
    return null;
  }
  const randomPosition = Math.floor(Math.random() * options.length);
  return options[randomPosition];
};

const pickCpuMove = (board) => {
  const availableSquares = board.reduce((acc, value, index) => {
    if (!value) {
      acc.push(index);
    }
    return acc;
  }, []);

  if (!availableSquares.length) {
    return null;
  }

  const finishingMove = findCriticalMove(board, 'O');
  if (finishingMove !== null) {
    return finishingMove;
  }

  const blockingMove = findCriticalMove(board, 'X');
  if (blockingMove !== null) {
    return blockingMove;
  }

  if (!board[4]) {
    return 4;
  }

  const corners = [0, 2, 6, 8].filter((index) => !board[index]);
  if (corners.length) {
    return pickRandomIndex(corners);
  }

  const sides = [1, 3, 5, 7].filter((index) => !board[index]);
  if (sides.length) {
    return pickRandomIndex(sides);
  }

  return availableSquares[0];
};

const getWinner = (board) => {
  for (const [a, b, c] of WINNING_LINES) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { player: board[a], line: [a, b, c] };
    }
  }
  return null;
};

function App() {
  const [board, setBoard] = useState(emptyBoard);
  const [isXNext, setIsXNext] = useState(true);
  const [scores, setScores] = useState({ X: 0, O: 0 });
  const [mode, setMode] = useState(MODES.DUO);

  const winnerInfo = useMemo(() => getWinner(board), [board]);
  const winner = winnerInfo?.player ?? null;
  const winningLine = winnerInfo?.line ?? [];
  const isDraw = !winner && board.every(Boolean);
  const isCpuTurn = mode === MODES.SOLO && !isXNext;
  const playerXLabel = mode === MODES.SOLO ? 'You (X)' : 'Player X';
  const playerOLabel = mode === MODES.SOLO ? 'CPU (O)' : 'Player O';

  const statusMessage = (() => {
    if (winner) {
      if (mode === MODES.SOLO) {
        return winner === 'O' ? 'CPU claims the round!' : 'You win this round!';
      }
      return `Player ${winner} wins!`;
    }
    if (isDraw) {
      return 'No moves left. It is a draw.';
    }
    if (isCpuTurn) {
      return 'CPU is planning its move...';
    }
    const playerLabel = mode === MODES.SOLO && isXNext ? 'You' : `Player ${isXNext ? 'X' : 'O'}`;
    return `${playerLabel} to move`;
  })();

  const handleSquareClick = (index) => {
    if (board[index] || winner || isCpuTurn) {
      return;
    }

    const nextBoard = board.slice();
    const currentPlayer = isXNext ? 'X' : 'O';
    nextBoard[index] = currentPlayer;

    const victory = getWinner(nextBoard);
    if (victory) {
      setScores((prev) => ({
        ...prev,
        [victory.player]: prev[victory.player] + 1,
      }));
    }

    setBoard(nextBoard);
    setIsXNext((prev) => !prev);
  };

  const resetBoard = () => {
    setBoard(emptyBoard());
    setIsXNext(true);
  };

  const resetEverything = () => {
    setBoard(emptyBoard());
    setIsXNext(true);
    setScores({ X: 0, O: 0 });
  };

  const handleModeChange = (selectedMode) => {
    if (selectedMode === mode) {
      return;
    }
    setMode(selectedMode);
    setBoard(emptyBoard());
    setIsXNext(true);
  };

  useEffect(() => {
    if (!isCpuTurn || winner || isDraw) {
      return undefined;
    }

    const timeoutId = setTimeout(() => {
      const move = pickCpuMove(board);
      if (move === null || move === undefined) {
        setIsXNext(true);
        return;
      }

      const nextBoard = board.slice();
      nextBoard[move] = 'O';
      const victory = getWinner(nextBoard);
      if (victory) {
        setScores((prev) => ({
          ...prev,
          [victory.player]: prev[victory.player] + 1,
        }));
      }

      setBoard(nextBoard);
      setIsXNext(true);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [board, isCpuTurn, isDraw, winner]);

  return (
    <main className="app-shell">
      <section className="game-card" aria-label="Grid Clash game">
        <header>
          <h1>Grid Clash</h1>
          <p className="tagline">
            Play classic tic-tac-toe locally or toggle solo mode to battle a quick-thinking CPU.
          </p>
        </header>

        <div className="mode-toggle" role="group" aria-label="Select game mode">
          <button
            type="button"
            className={`mode-option ${mode === MODES.DUO ? 'active' : ''}`}
            onClick={() => handleModeChange(MODES.DUO)}
          >
            <span className="mode-title">Local Duel</span>
            <span className="mode-description">Two players, one board</span>
          </button>
          <button
            type="button"
            className={`mode-option ${mode === MODES.SOLO ? 'active' : ''}`}
            onClick={() => handleModeChange(MODES.SOLO)}
          >
            <span className="mode-title">Solo vs CPU</span>
            <span className="mode-description">You play X, CPU plays O</span>
          </button>
        </div>

        <div
          className="status"
          role="status"
          aria-live="polite"
        >
          {statusMessage}
        </div>

        <div className="scoreboard" aria-label="Scoreboard">
          <span className="score player-x">
            <span className="label">{playerXLabel}</span>
            <strong>{scores.X}</strong>
          </span>
          <span className="score player-o">
            <span className="label">{playerOLabel}</span>
            <strong>{scores.O}</strong>
          </span>
        </div>

        <div
          className="board"
          role="grid"
          aria-label="Tic tac toe board"
        >
          {board.map((value, index) => {
            const isWinningSquare = winningLine.includes(index);
            return (
              <button
                key={index}
                type="button"
                role="gridcell"
                className={`cell ${value ? 'filled' : ''} ${isWinningSquare ? 'winning' : ''}`}
                onClick={() => handleSquareClick(index)}
                aria-label={`Cell ${index + 1}, ${value ? `occupied by ${value}` : 'empty'}`}
                aria-pressed={Boolean(value)}
              >
                {value || '\u00A0'}
              </button>
            );
          })}
        </div>

        <div className="controls">
          <button type="button" className="primary" onClick={resetBoard}>
            Next Round
          </button>
          <button type="button" className="ghost" onClick={resetEverything}>
            Reset Scores
          </button>
        </div>

        <ul className="tips">
          <li>Squares lock once played. Study ahead to trap your rival.</li>
          <li>The scoreboard keeps running totals until you reset it.</li>
          <li>Solo mode gives the CPU a slight delay so you can read the board.</li>
          <li>Use the keyboard: tab to a tile and press space or enter.</li>
        </ul>
      </section>
    </main>
  );
}

export default App;
