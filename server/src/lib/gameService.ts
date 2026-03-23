import * as sudoku from '../../../shared/sudoku.ts';
import type {
  CheckBoardRequest,
  CheckBoardResponse,
  CreateGameRequest,
  CreateGameResponse,
  InvalidCell,
  ValidateMoveRequest,
  ValidateMoveResponse,
} from '../../../shared/types.ts';
import { decodeGameToken, encodeGameToken } from './token.ts';

const sudokuModule = sudoku as typeof import('../../../shared/sudoku.ts') & {
  default?: typeof import('../../../shared/sudoku.ts');
};
const { generateSudoku } = sudokuModule.default ?? sudokuModule;

export async function createGame(
  request: CreateGameRequest,
  tokenSecret: string,
): Promise<CreateGameResponse> {
  const { puzzle, solution } = generateSudoku(request.difficulty);
  const gameToken = await encodeGameToken(
    {
      puzzle,
      solution,
      difficulty: request.difficulty,
    },
    tokenSecret,
  );

  return {
    puzzle,
    gameToken,
  };
}

export async function validateMove(
  request: ValidateMoveRequest,
  tokenSecret: string,
): Promise<ValidateMoveResponse> {
  const { puzzle, solution } = await decodeGameToken(request.gameToken, tokenSecret);
  const isFixedCell = puzzle[request.row][request.col] !== 0;

  return {
    valid: !isFixedCell && solution[request.row][request.col] === request.value,
    isFixedCell,
  };
}

export async function checkBoard(
  request: CheckBoardRequest,
  tokenSecret: string,
): Promise<CheckBoardResponse> {
  const { solution } = await decodeGameToken(request.gameToken, tokenSecret);
  const invalidCells = findInvalidCells(request.board, solution);

  return {
    solved: invalidCells.length === 0,
    invalidCells,
  };
}

function findInvalidCells(board: number[][], solution: number[][]): InvalidCell[] {
  const invalidCells: InvalidCell[] = [];

  for (let rowIndex = 0; rowIndex < board.length; rowIndex++) {
    for (let columnIndex = 0; columnIndex < board[rowIndex].length; columnIndex++) {
      if (board[rowIndex][columnIndex] !== solution[rowIndex][columnIndex]) {
        invalidCells.push({ row: rowIndex, col: columnIndex });
      }
    }
  }

  return invalidCells;
}
