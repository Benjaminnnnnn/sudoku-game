import { z } from 'zod';
import type {
  CheckBoardRequest,
  CreateGameRequest,
  ValidateMoveRequest,
} from '../../../shared/types.ts';
import { requireGameTokenSecret } from '../lib/env.ts';
import { BadRequestError, InvalidGameTokenError } from '../lib/errors.ts';
import { checkBoard, createGame, validateMove } from '../lib/gameService.ts';
import { parseJsonBody } from '../lib/request.ts';

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

function handleGamesError(
  error: unknown,
  invalidPayloadMessage: string,
  fallbackMessage: string,
): Response {
  if (error instanceof BadRequestError) {
    return Response.json({ error: error.message }, { status: 400 });
  }

  if (error instanceof z.ZodError) {
    return Response.json({ error: invalidPayloadMessage }, { status: 400 });
  }

  if (error instanceof InvalidGameTokenError) {
    return Response.json({ error: error.message }, { status: 400 });
  }

  return Response.json(
    { error: error instanceof Error ? error.message : fallbackMessage },
    { status: 500 },
  );
}

export async function handleCreateGameRequest(request: Request, env: Env): Promise<Response> {
  try {
    const payload = await parseJsonBody(request, createGameSchema) as CreateGameRequest;
    const responseBody = await createGame(payload, requireGameTokenSecret(env));

    return Response.json(responseBody, { status: 201 });
  } catch (error) {
    return handleGamesError(error, 'Invalid game creation payload.', 'Failed to create game.');
  }
}

export async function handleValidateMoveRequest(request: Request, env: Env): Promise<Response> {
  try {
    const payload = await parseJsonBody(request, validateMoveSchema) as ValidateMoveRequest;
    const responseBody = await validateMove(payload, requireGameTokenSecret(env));

    return Response.json(responseBody);
  } catch (error) {
    return handleGamesError(error, 'Invalid move payload.', 'Failed to validate move.');
  }
}

export async function handleCheckBoardRequest(request: Request, env: Env): Promise<Response> {
  try {
    const payload = await parseJsonBody(request, checkBoardSchema) as CheckBoardRequest;
    const responseBody = await checkBoard(payload, requireGameTokenSecret(env));

    return Response.json(responseBody);
  } catch (error) {
    return handleGamesError(error, 'Invalid board check payload.', 'Failed to check board.');
  }
}
