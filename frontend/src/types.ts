export type { Difficulty, GameStatus } from '../../shared/types';
import type { Difficulty, GameStatus } from '../../shared/types';

export interface CellState {
  row: number;
  col: number;
  value: number; // 0 means empty
  isFixed: boolean;
  isError: boolean;
  notes: Set<number>;
}

export type BestScores = Record<Difficulty, number | null>;

export interface BoardSnapshot {
  board: CellState[][];
  mistakes: number;
}

export interface GameState {
  board: CellState[][];
  gameToken: string | null;
  difficulty: Difficulty;
  status: GameStatus;
  timer: number;
  mistakes: number;
  notesMode: boolean;
  selectedCell: { row: number; col: number } | null;
  history: BoardSnapshot[];
  isLoading: boolean;
  errorMessage: string | null;
  bestScores: BestScores;
}
