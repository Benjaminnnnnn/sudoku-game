export type Difficulty = 'easy' | 'medium' | 'hard';

export interface CellState {
  row: number;
  col: number;
  value: number; // 0 means empty
  isFixed: boolean;
  isError: boolean;
  notes: Set<number>;
}

export interface GameState {
  board: CellState[][];
  solution: number[][];
  difficulty: Difficulty;
  status: 'playing' | 'paused' | 'completed';
  timer: number;
  mistakes: number;
  notesMode: boolean;
  selectedCell: { row: number; col: number } | null;
  history: CellState[][][]; // Array of board states
}
