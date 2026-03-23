import {
  handleCheckBoardRequest,
  handleCreateGameRequest,
  handleValidateMoveRequest,
} from './routes/games.ts';
import { handleHealthRequest } from './routes/health.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

function withCors(response: Response): Response {
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

function notFoundResponse(): Response {
  return Response.json({ error: 'Not found.' }, { status: 404 });
}

export default {
  async fetch(request, env) {
    const { method } = request;
    const pathname = new URL(request.url).pathname;

    if (method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: corsHeaders,
      });
    }

    let response: Response;

    switch (`${method} ${pathname}`) {
      case 'GET /api/health':
        response = handleHealthRequest();
        break;
      case 'POST /api/games':
        response = await handleCreateGameRequest(request, env);
        break;
      case 'POST /api/moves':
        response = await handleValidateMoveRequest(request, env);
        break;
      case 'POST /api/check':
        response = await handleCheckBoardRequest(request, env);
        break;
      default:
        response = notFoundResponse();
    }

    return withCors(response);
  },
} satisfies ExportedHandler<Env>;
