import type { CheckBoardResponse, CreateGameResponse, Difficulty, ValidateMoveResponse } from '../../../shared/types';
import { INVALID_MOVE_PENALTY_SECONDS, canEditBoard, resolveStatusAfterMove } from './gameStatus';
import type { BestScores, BoardSnapshot, CellState, GameState } from '../types';

interface EditableSelection {
  row: number;
  col: number;
}

export interface MovePreview {
  board: CellState[][];
  mistakes: number;
  timer: number;
}

export function createInitialGameState(bestScores: BestScores): GameState {
  return {
    board: [],
    gameToken: null,
    difficulty: 'easy',
    status: 'playing',
    timer: 0,
    mistakes: 0,
    notesMode: false,
    selectedCell: null,
    history: [],
    isLoading: false,
    errorMessage: null,
    bestScores,
  };
}

export function createCellStateBoard(puzzle: number[][]): CellState[][] {
  return puzzle.map((row, rowIndex) =>
    row.map((value, columnIndex) => ({
      row: rowIndex,
      col: columnIndex,
      value,
      isFixed: value !== 0,
      isError: false,
      notes: new Set<number>(),
    })),
  );
}

export function cloneBoard(board: CellState[][]): CellState[][] {
  return board.map((row) => row.map((cell) => ({ ...cell, notes: new Set(cell.notes) })));
}

export function createBoardSnapshot(board: CellState[][], mistakes: number): BoardSnapshot {
  return {
    board: cloneBoard(board),
    mistakes,
  };
}

export function hasEmptyCells(board: CellState[][]): boolean {
  return board.some((row) => row.some((cell) => cell.value === 0));
}

export function toNumberBoard(board: CellState[][]): number[][] {
  return board.map((row) => row.map((cell) => cell.value));
}

export function startGameLoading(state: GameState, difficulty: Difficulty): GameState {
  return {
    ...state,
    difficulty,
    isLoading: true,
    errorMessage: null,
    selectedCell: null,
  };
}

export function applyNewGame(state: GameState, difficulty: Difficulty, response: CreateGameResponse): GameState {
  const initialBoard = createCellStateBoard(response.puzzle);

  return {
    board: initialBoard,
    gameToken: response.gameToken,
    difficulty,
    status: 'playing',
    timer: 0,
    mistakes: 0,
    notesMode: false,
    selectedCell: null,
    history: [createBoardSnapshot(initialBoard, 0)],
    isLoading: false,
    errorMessage: null,
    bestScores: state.bestScores,
  };
}

export function beginMoveValidation(state: GameState): GameState {
  return {
    ...state,
    isLoading: true,
    errorMessage: null,
  };
}

export function finishLoading(state: GameState): GameState {
  return {
    ...state,
    isLoading: false,
  };
}

export function applyAsyncError(state: GameState, message: string): GameState {
  return {
    ...state,
    isLoading: false,
    errorMessage: message,
  };
}

export function tickTimer(state: GameState): GameState {
  return {
    ...state,
    timer: state.timer + 1,
  };
}

export function selectCell(state: GameState, row: number, col: number): GameState {
  if (state.isLoading || !canEditBoard(state.status)) {
    return state;
  }

  return {
    ...state,
    selectedCell: { row, col },
  };
}

export function moveSelection(state: GameState, dRow: number, dCol: number): GameState {
  if (state.isLoading || !state.selectedCell || !canEditBoard(state.status)) {
    return state;
  }

  const newRow = Math.max(0, Math.min(8, state.selectedCell.row + dRow));
  const newCol = Math.max(0, Math.min(8, state.selectedCell.col + dCol));

  return {
    ...state,
    selectedCell: { row: newRow, col: newCol },
  };
}

export function toggleNotesMode(state: GameState): GameState {
  if (state.isLoading || !canEditBoard(state.status)) {
    return state;
  }

  return {
    ...state,
    notesMode: !state.notesMode,
  };
}

export function getEditableSelection(state: GameState): EditableSelection | null {
  if (state.isLoading || !state.selectedCell || !state.gameToken || !canEditBoard(state.status)) {
    return null;
  }

  const cell = state.board[state.selectedCell.row]?.[state.selectedCell.col];
  if (!cell || cell.isFixed) {
    return null;
  }

  return {
    row: state.selectedCell.row,
    col: state.selectedCell.col,
  };
}

export function applyNotesValue(state: GameState, row: number, col: number, value: number): GameState {
  const updatedBoard = cloneBoard(state.board);
  const updatedCell = updatedBoard[row][col];

  if (value === 0) {
    updatedCell.notes.clear();
  } else if (updatedCell.notes.has(value)) {
    updatedCell.notes.delete(value);
  } else {
    updatedCell.notes.add(value);
  }

  updatedCell.value = 0;
  updatedCell.isError = false;

  return {
    ...state,
    board: updatedBoard,
    history: [...state.history, createBoardSnapshot(updatedBoard, state.mistakes)],
  };
}

export function clearCellValue(state: GameState, row: number, col: number): GameState {
  const updatedBoard = cloneBoard(state.board);
  const updatedCell = updatedBoard[row][col];

  updatedCell.value = 0;
  updatedCell.notes.clear();
  updatedCell.isError = false;

  return {
    ...state,
    board: updatedBoard,
    history: [...state.history, createBoardSnapshot(updatedBoard, state.mistakes)],
  };
}

export function createMovePreview(
  state: GameState,
  row: number,
  col: number,
  value: number,
  moveResult: ValidateMoveResponse,
): MovePreview {
  const updatedBoard = cloneBoard(state.board);
  const updatedCell = updatedBoard[row][col];
  updatedCell.value = value;
  updatedCell.notes.clear();
  updatedCell.isError = !moveResult.valid;

  return {
    board: updatedBoard,
    mistakes: state.mistakes + (moveResult.valid ? 0 : 1),
    timer: state.timer + (moveResult.valid ? 0 : INVALID_MOVE_PENALTY_SECONDS),
  };
}

export function applyMovePreview(
  state: GameState,
  preview: MovePreview,
  checkResult?: CheckBoardResponse,
): GameState {
  let nextStatus = resolveStatusAfterMove(state.status, false);
  let nextBestScores = state.bestScores;

  if (checkResult) {
    nextStatus = resolveStatusAfterMove(state.status, checkResult.solved);

    if (!checkResult.solved) {
      for (const invalidCell of checkResult.invalidCells) {
        preview.board[invalidCell.row][invalidCell.col].isError = true;
      }
    } else {
      const currentBestScore = state.bestScores[state.difficulty];
      if (currentBestScore === null || preview.timer < currentBestScore) {
        nextBestScores = {
          ...state.bestScores,
          [state.difficulty]: preview.timer,
        };
      }
    }
  }

  return {
    ...state,
    board: preview.board,
    mistakes: preview.mistakes,
    timer: preview.timer,
    status: nextStatus,
    history: [...state.history, createBoardSnapshot(preview.board, preview.mistakes)],
    isLoading: false,
    bestScores: nextBestScores,
  };
}

export function undoMove(state: GameState): GameState {
  if (state.history.length <= 1) {
    return state;
  }

  const nextHistory = state.history.slice(0, -1);
  const previousSnapshot = nextHistory[nextHistory.length - 1];

  return {
    ...state,
    board: cloneBoard(previousSnapshot.board),
    mistakes: previousSnapshot.mistakes,
    history: nextHistory,
  };
}

export function resetPuzzle(state: GameState): GameState {
  if (state.history.length === 0) {
    return state;
  }

  const initialSnapshot = state.history[0];

  return {
    ...state,
    board: cloneBoard(initialSnapshot.board),
    history: [createBoardSnapshot(initialSnapshot.board, 0)],
    mistakes: 0,
    timer: 0,
    status: 'playing',
    selectedCell: null,
  };
}

export function togglePause(state: GameState): GameState {
  return {
    ...state,
    status:
      state.status === 'playing'
        ? 'paused'
        : state.status === 'paused'
          ? 'playing'
          : state.status,
  };
}

export function createStartGameErrorMessage(error: unknown): string {
  return error instanceof Error
    ? `Unable to start a new game. ${error.message}`
    : 'Unable to start a new game. Check the connection and try again.';
}

export function createMoveErrorMessage(error: unknown): string {
  return error instanceof Error
    ? `Unable to validate that move. ${error.message}`
    : 'Unable to validate that move. Try again.';
}
