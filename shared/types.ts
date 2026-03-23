export type Board = number[][];

export type Difficulty = 'easy' | 'medium' | 'hard';

export type GameStatus = 'playing' | 'paused' | 'completed';

export interface CellPosition {
  row: number;
  col: number;
}

export interface InvalidCell extends CellPosition {}

export interface PuzzlePayload {
  puzzle: Board;
  solution: Board;
  difficulty: Difficulty;
}

export interface CreateGameRequest {
  difficulty: Difficulty;
}

export interface CreateGameResponse {
  puzzle: Board;
  gameToken: string;
}

export interface ValidateMoveRequest extends CellPosition {
  gameToken: string;
  value: number;
}

export interface ValidateMoveResponse {
  valid: boolean;
  isFixedCell: boolean;
}

export interface CheckBoardRequest {
  gameToken: string;
  board: Board;
}

export interface CheckBoardResponse {
  solved: boolean;
  invalidCells: InvalidCell[];
}
