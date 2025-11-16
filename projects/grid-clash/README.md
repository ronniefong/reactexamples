# Grid Clash

Grid Clash is a modern React take on tic-tac-toe. Play hot-seat matches or flip into solo mode where you control X and the CPU plays O with a quick heuristic engine.

## Highlights

- **Solo or Local Play** – Toggle between a live opponent and an AI that blocks, wins, and prioritizes optimal moves.
- **Score Tracking** – Persistent in-session scoreboard with quick “Next Round” and “Reset Scores” controls.
- **Accessible Board** – Grid uses ARIA roles, keyboard navigation, and live status messaging.
- **Stylized UI** – Responsive card layout with animated buttons and winning-line highlights.

## Getting Started

```sh
npm install
npm start
```

Visit `http://localhost:3000` to play. Run tests with `npm test -- --watchAll=false`.

## Gameplay Guide

- Click or focus + Enter/Space to claim squares.
- In solo mode you always play X; the CPU responds after a short delay.
- Wins add to the respective score bucket; use **Next Round** to clear the board or **Reset Scores** to wipe totals.

## Flow Chart

```
[Start App component]
      |
      v
[Initialize state: board, isXNext, scores, mode]
      |
      v
[Derive status: winner, draw, CPU turn, labels]
      |
      v
+-------------------------------+
| On cell click (handleSquareClick) |
+-------------------------------+
      |
      v
[Cell empty & no winner & not CPU turn?]
      | yes
      v
[Place X/O → check winner → update scores → flip turn]
      |
      v
[Render board + status + scores + controls]

Mode toggle buttons ----> [handleModeChange → reset board & turn]

“Next Round” button ----> [resetBoard → empty board + X starts]

“Reset Scores” button -> [resetEverything → empty board + scores zeroed]

CPU turn? (solo mode & O to move)
      |
     yes
      |
      v
[useEffect delay 500ms]
      |
      v
[pickCpuMove → place O → check winner → update scores]
      |
      v
[Set isXNext true]
      |
      v
[Repeat render updates until winner or draw]
```

## Project Scripts

- `npm start` – Launch dev server with hot reload.
- `npm test` – Run the Jest test suite once or in watch mode.
- `npm run build` – Produce an optimized production bundle.

## Tech Stack

- React 18 + hooks for state and effects.
- `react-scripts` (Create React App) build pipeline.
- CSS modules for layout and motion.
