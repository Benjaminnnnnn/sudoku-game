import { z } from 'zod';
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
import { decodeGameToken, encodeGameToken } from '../lib/token.ts';

const sudokuModule = sudoku as typeof import('../../../shared/sudoku.ts') & {
  default?: typeof import('../../../shared/sudoku.ts');
};
const { generateSudoku } = sudokuModule.default ?? sudokuModule;

const difficultySchema = z.enum(['easy', 'medium', 'hard']);
const boardSchema = z.array(z.array(z.number().int().min(0).max(9)).length(9)).length(9);

const createGameSchema = z.object({
  difficulty: difficultySchema,
});

const validateMoveSchema = z.object({
  gameToken: z.string().min(1),
  row: z.number().int().min(0).max(8),
  col: z.number().int().min(0).max(8),
  value: z.number().int().min(1).max(9),
});

const checkBoardSchema = z.object({
  gameToken: z.string().min(1),
  board: boardSchema,
});

class BadRequestError extends Error {}

function getGameTokenSecret(env: Env): string {
  const tokenSecret = env.GAME_TOKEN_SECRET;
  if (!tokenSecret) {
    throw new Error('GAME_TOKEN_SECRET is not configured.');
  }

  return tokenSecret;
}

async function parseJsonBody<T>(request: Request, schema: z.ZodType<T>): Promise<T> {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    throw new BadRequestError('Invalid JSON body.');
  }

  return schema.parse(body);
}

export async function handleCreateGameRequest(request: Request, env: Env): Promise<Response> {
  try {
    const { difficulty } = await parseJsonBody(request, createGameSchema) as CreateGameRequest;
    const { puzzle, solution } = generateSudoku(difficulty);
    const gameToken = await encodeGameToken(
      {
        puzzle,
        solution,
        difficulty,
      },
      getGameTokenSecret(env),
    );

    const responseBody: CreateGameResponse = {
      puzzle,
      gameToken,
    };

    return Response.json(responseBody, { status: 201 });
  } catch (error) {
    if (error instanceof BadRequestError) {
      return Response.json({ error: error.message }, { status: 400 });
    }

    if (error instanceof z.ZodError) {
      return Response.json({ error: 'Invalid game creation payload.' }, { status: 400 });
    }

    return Response.json({ error: error instanceof Error ? error.message : 'Failed to create game.' }, { status: 500 });
  }
}

export async function handleValidateMoveRequest(request: Request, env: Env): Promise<Response> {
  try {
    const { gameToken, row, col, value } = await parseJsonBody(request, validateMoveSchema) as ValidateMoveRequest;
    const { puzzle, solution } = await decodeGameToken(gameToken, getGameTokenSecret(env));
    const isFixedCell = puzzle[row][col] !== 0;

    const responseBody: ValidateMoveResponse = {
      valid: !isFixedCell && solution[row][col] === value,
      isFixedCell,
    };

    return Response.json(responseBody);
  } catch (error) {
    if (error instanceof BadRequestError) {
      return Response.json({ error: error.message }, { status: 400 });
    }

    if (error instanceof z.ZodError) {
      return Response.json({ error: 'Invalid move payload.' }, { status: 400 });
    }

    if (error instanceof Error && error.message === 'Invalid game token.') {
      return Response.json({ error: error.message }, { status: 400 });
    }

    return Response.json({ error: error instanceof Error ? error.message : 'Failed to validate move.' }, { status: 500 });
  }
}

export async function handleCheckBoardRequest(request: Request, env: Env): Promise<Response> {
  try {
    const { gameToken, board } = await parseJsonBody(request, checkBoardSchema) as CheckBoardRequest;
    const { solution } = await decodeGameToken(gameToken, getGameTokenSecret(env));
    const invalidCells: InvalidCell[] = [];

    for (let rowIndex = 0; rowIndex < board.length; rowIndex++) {
      for (let columnIndex = 0; columnIndex < board[rowIndex].length; columnIndex++) {
        if (board[rowIndex][columnIndex] !== solution[rowIndex][columnIndex]) {
          invalidCells.push({ row: rowIndex, col: columnIndex });
        }
      }
    }

    const responseBody: CheckBoardResponse = {
      solved: invalidCells.length === 0,
      invalidCells,
    };

    return Response.json(responseBody);
  } catch (error) {
    if (error instanceof BadRequestError) {
      return Response.json({ error: error.message }, { status: 400 });
    }

    if (error instanceof z.ZodError) {
      return Response.json({ error: 'Invalid board check payload.' }, { status: 400 });
    }

    if (error instanceof Error && error.message === 'Invalid game token.') {
      return Response.json({ error: error.message }, { status: 400 });
    }

    return Response.json({ error: error instanceof Error ? error.message : 'Failed to check board.' }, { status: 500 });
  }
}
