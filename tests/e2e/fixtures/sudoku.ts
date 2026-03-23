import type {
  CheckBoardRequest,
  CreateGameResponse,
  InvalidCell,
  ValidateMoveRequest,
} from '../../../shared/types';

export const gameToken = 'e2e-game-token';

export const solvedBoard = [
  [5, 3, 4, 6, 7, 8, 9, 1, 2],
  [6, 7, 2, 1, 9, 5, 3, 4, 8],
  [1, 9, 8, 3, 4, 2, 5, 6, 7],
  [8, 5, 9, 7, 6, 1, 4, 2, 3],
  [4, 2, 6, 8, 5, 3, 7, 9, 1],
  [7, 1, 3, 9, 2, 4, 8, 5, 6],
  [9, 6, 1, 5, 3, 7, 2, 8, 4],
  [2, 8, 7, 4, 1, 9, 6, 3, 5],
  [3, 4, 5, 2, 8, 6, 1, 7, 9],
] satisfies number[][];

export const puzzleBoard = [
  [5, 3, 0, 6, 7, 8, 9, 1, 2],
  [6, 7, 2, 1, 9, 5, 3, 4, 8],
  [1, 9, 8, 3, 4, 2, 5, 6, 7],
  [8, 5, 9, 7, 6, 1, 4, 2, 3],
  [4, 2, 6, 8, 0, 3, 7, 9, 1],
  [7, 1, 3, 9, 2, 4, 8, 5, 6],
  [9, 6, 1, 5, 3, 7, 2, 8, 4],
  [2, 8, 7, 4, 1, 9, 6, 3, 5],
  [3, 4, 5, 2, 8, 6, 1, 7, 0],
] satisfies number[][];

export const createGameResponse: CreateGameResponse = {
  puzzle: puzzleBoard,
  gameToken,
};

export function buildValidateMoveResponse(request: ValidateMoveRequest) {
  const isFixedCell = puzzleBoard[request.row][request.col] !== 0;

  return {
    valid: !isFixedCell && solvedBoard[request.row][request.col] === request.value,
    isFixedCell,
  };
}

export function buildCheckBoardResponse(request: CheckBoardRequest) {
  const invalidCells: InvalidCell[] = [];

  for (let rowIndex = 0; rowIndex < request.board.length; rowIndex += 1) {
    for (let columnIndex = 0; columnIndex < request.board[rowIndex].length; columnIndex += 1) {
      if (request.board[rowIndex][columnIndex] !== solvedBoard[rowIndex][columnIndex]) {
        invalidCells.push({ row: rowIndex, col: columnIndex });
      }
    }
  }

  return {
    solved: invalidCells.length === 0,
    invalidCells,
  };
}
