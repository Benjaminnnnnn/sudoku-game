import { z } from 'zod';
import type {
  CheckBoardRequest,
  CreateGameRequest,
  ValidateMoveRequest,
} from '../../../shared/types.ts';
import { requireGameTokenSecret } from '../lib/env.ts';
import { checkBoard, createGame, validateMove } from '../lib/gameService.ts';
import { createJsonRoute } from '../lib/http.ts';

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

export const handleCreateGameRequest = createJsonRoute<CreateGameRequest, Awaited<ReturnType<typeof createGame>>>({
  schema: createGameSchema,
  invalidPayloadMessage: 'Invalid game creation payload.',
  fallbackMessage: 'Failed to create game.',
  successStatus: 201,
  handler: (payload, env) => createGame(payload, requireGameTokenSecret(env)),
});

export const handleValidateMoveRequest = createJsonRoute<
  ValidateMoveRequest,
  Awaited<ReturnType<typeof validateMove>>
>({
  schema: validateMoveSchema,
  invalidPayloadMessage: 'Invalid move payload.',
  fallbackMessage: 'Failed to validate move.',
  handler: (payload, env) => validateMove(payload, requireGameTokenSecret(env)),
});

export const handleCheckBoardRequest = createJsonRoute<
  CheckBoardRequest,
  Awaited<ReturnType<typeof checkBoard>>
>({
  schema: checkBoardSchema,
  invalidPayloadMessage: 'Invalid board check payload.',
  fallbackMessage: 'Failed to check board.',
  handler: (payload, env) => checkBoard(payload, requireGameTokenSecret(env)),
});
