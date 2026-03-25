import { z } from 'zod';
import { describe, expect, it } from 'vitest';
import { BadRequestError } from './errors.ts';
import { createJsonRoute } from './http.ts';

const testEnv = {
  GAME_TOKEN_SECRET: 'test-secret',
} as Env;

describe('createJsonRoute', () => {
  it('returns a JSON response for valid payloads', async () => {
    const route = createJsonRoute({
      schema: z.object({
        value: z.number().int(),
      }),
      invalidPayloadMessage: 'Invalid payload.',
      fallbackMessage: 'Request failed.',
      successStatus: 201,
      handler: async (payload: { value: number }) => ({
        doubled: payload.value * 2,
      }),
    });

    const response = await route(
      new Request('http://localhost/api/example', {
        method: 'POST',
        body: JSON.stringify({ value: 21 }),
        headers: { 'Content-Type': 'application/json' },
      }),
      testEnv,
    );

    expect(response.status).toBe(201);
    await expect(response.json()).resolves.toEqual({ doubled: 42 });
  });

  it('maps payload validation failures to 400 responses', async () => {
    const route = createJsonRoute({
      schema: z.object({
        value: z.number().int(),
      }),
      invalidPayloadMessage: 'Invalid payload.',
      fallbackMessage: 'Request failed.',
      handler: async (payload: { value: number }) => payload,
    });

    const response = await route(
      new Request('http://localhost/api/example', {
        method: 'POST',
        body: JSON.stringify({ value: '21' }),
        headers: { 'Content-Type': 'application/json' },
      }),
      testEnv,
    );

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({ error: 'Invalid payload.' });
  });

  it('preserves ApiError status codes and messages', async () => {
    const route = createJsonRoute({
      schema: z.object({
        value: z.number().int(),
      }),
      invalidPayloadMessage: 'Invalid payload.',
      fallbackMessage: 'Request failed.',
      handler: async () => {
        throw new BadRequestError('Nope.');
      },
    });

    const response = await route(
      new Request('http://localhost/api/example', {
        method: 'POST',
        body: JSON.stringify({ value: 1 }),
        headers: { 'Content-Type': 'application/json' },
      }),
      testEnv,
    );

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({ error: 'Nope.' });
  });

  it('hides unexpected error details behind the fallback message', async () => {
    const route = createJsonRoute({
      schema: z.object({
        value: z.number().int(),
      }),
      invalidPayloadMessage: 'Invalid payload.',
      fallbackMessage: 'Request failed.',
      handler: async () => {
        throw new Error('Unexpected failure.');
      },
    });

    const response = await route(
      new Request('http://localhost/api/example', {
        method: 'POST',
        body: JSON.stringify({ value: 1 }),
        headers: { 'Content-Type': 'application/json' },
      }),
      testEnv,
    );

    expect(response.status).toBe(500);
    await expect(response.json()).resolves.toEqual({ error: 'Request failed.' });
  });
});
