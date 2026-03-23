import { env } from 'cloudflare:workers';
import type { Express } from 'express';
import { z } from 'zod';
import { generateSudoku } from '../../../shared/sudoku';
import type {
  CheckBoardRequest,
  CheckBoardResponse,
  CreateGameRequest,
  CreateGameResponse,
  InvalidCell,
  ValidateMoveRequest,
  ValidateMoveResponse,
} from '../../../shared/types';
import { decodeGameToken, encodeGameToken } from '../lib/token';

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

function getGameTokenSecret(): string {
  const tokenSecret = (env as { GAME_TOKEN_SECRET?: string }).GAME_TOKEN_SECRET;
  if (!tokenSecret) {
    throw new Error('GAME_TOKEN_SECRET is not configured.');
  }

  return tokenSecret;
}

export function registerGameRoutes(app: Express) {
  app.post('/api/games', async (req, res) => {
    try {
      const { difficulty } = createGameSchema.parse(req.body) as CreateGameRequest;
      const { puzzle, solution } = generateSudoku(difficulty);
      const gameToken = await encodeGameToken(
        {
          puzzle,
          solution,
          difficulty,
        },
        getGameTokenSecret(),
      );

      const responseBody: CreateGameResponse = {
        puzzle,
        gameToken,
      };

      res.status(201).json(responseBody);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: 'Invalid game creation payload.' });
        return;
      }

      res.status(500).json({ error: error instanceof Error ? error.message : 'Failed to create game.' });
    }
  });

  app.post('/api/moves', async (req, res) => {
    try {
      const { gameToken, row, col, value } = validateMoveSchema.parse(req.body) as ValidateMoveRequest;
      const { puzzle, solution } = await decodeGameToken(gameToken, getGameTokenSecret());
      const isFixedCell = puzzle[row][col] !== 0;

      const responseBody: ValidateMoveResponse = {
        valid: !isFixedCell && solution[row][col] === value,
        isFixedCell,
      };

      res.json(responseBody);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: 'Invalid move payload.' });
        return;
      }

      if (error instanceof Error && error.message === 'Invalid game token.') {
        res.status(400).json({ error: error.message });
        return;
      }

      res.status(500).json({ error: error instanceof Error ? error.message : 'Failed to validate move.' });
    }
  });

  app.post('/api/check', async (req, res) => {
    try {
      const { gameToken, board } = checkBoardSchema.parse(req.body) as CheckBoardRequest;
      const { solution } = await decodeGameToken(gameToken, getGameTokenSecret());
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

      res.json(responseBody);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: 'Invalid board check payload.' });
        return;
      }

      if (error instanceof Error && error.message === 'Invalid game token.') {
        res.status(400).json({ error: error.message });
        return;
      }

      res.status(500).json({ error: error instanceof Error ? error.message : 'Failed to check board.' });
    }
  });
}
