import { z } from 'zod';
import { ApiError } from './errors.ts';
import { parseJsonBody } from './request.ts';

export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
} as const;

export type RouteHandler = (request: Request, env: Env) => Promise<Response> | Response;

interface JsonRouteOptions<TPayload, TResponse> {
  schema: z.ZodType<TPayload>;
  invalidPayloadMessage: string;
  fallbackMessage: string;
  successStatus?: number;
  handler: (payload: TPayload, env: Env) => Promise<TResponse> | TResponse;
}

export function withCors(response: Response): Response {
  const headers = new Headers(response.headers);

  for (const [key, value] of Object.entries(corsHeaders)) {
    headers.set(key, value);
  }

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

export function optionsResponse(): Response {
  return new Response(null, {
    status: 204,
    headers: corsHeaders,
  });
}

export function notFoundResponse(): Response {
  return Response.json({ error: 'Not found.' }, { status: 404 });
}

export function createJsonRoute<TPayload, TResponse>({
  schema,
  invalidPayloadMessage,
  fallbackMessage,
  successStatus = 200,
  handler,
}: JsonRouteOptions<TPayload, TResponse>): RouteHandler {
  return async (request, env) => {
    try {
      const payload = await parseJsonBody(request, schema);
      const responseBody = await handler(payload, env);

      return Response.json(responseBody, { status: successStatus });
    } catch (error) {
      return createErrorResponse(error, invalidPayloadMessage, fallbackMessage);
    }
  };
}

function createErrorResponse(
  error: unknown,
  invalidPayloadMessage: string,
  fallbackMessage: string,
): Response {
  if (error instanceof ApiError) {
    return Response.json({ error: error.message }, { status: error.statusCode });
  }

  if (error instanceof z.ZodError) {
    return Response.json({ error: invalidPayloadMessage }, { status: 400 });
  }

  return Response.json({ error: fallbackMessage }, { status: 500 });
}
