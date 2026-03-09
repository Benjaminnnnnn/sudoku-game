# Design: Sudoku Web App

## Architecture
- **Framework:** React + TypeScript + Vite.
- **Styling:** Tailwind CSS.
- **State Management:** Custom React hook (`useSudoku`).

## State Model
```typescript
interface GameState {
  board: CellState[][];
  solution: number[][];
  difficulty: 'easy' | 'medium' | 'hard';
  status: 'playing' | 'paused' | 'completed';
  timer: number;
  mistakes: number;
  notesMode: boolean;
  selectedCell: { row: number; col: number } | null;
  history: CellState[][][];
}
```

## Sudoku Engine
- **Generation:** Generate a fully solved board using backtracking. Remove cells based on difficulty while ensuring the puzzle remains solvable.
- **Validation:** Check if a move matches the pre-calculated solution.

## Components
- `App`: Entry point.
- `Game`: Main container, manages state via `useSudoku`.
- `Header`: Title, difficulty, new game, timer, mistakes, pause.
- `SudokuBoard`: Renders the 9x9 grid, handles keyboard events.
- `SudokuCell`: Renders individual cell (value or notes), handles highlighting.
- `Controls`: Numpad, undo, erase, notes toggle, reset.
