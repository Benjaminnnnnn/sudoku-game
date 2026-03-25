import {
  handleCheckBoardRequest,
  handleCreateGameRequest,
  handleValidateMoveRequest,
} from './routes/games.ts';
import { handleHealthRequest } from './routes/health.ts';
import { notFoundResponse, optionsResponse, RouteHandler, withCors } from './lib/http.ts';

const routes: Record<string, RouteHandler> = {
  'GET /api/health': () => handleHealthRequest(),
  'POST /api/games': handleCreateGameRequest,
  'POST /api/moves': handleValidateMoveRequest,
  'POST /api/check': handleCheckBoardRequest,
};

export default {
  async fetch(request, env) {
    const { method } = request;
    const pathname = new URL(request.url).pathname;

    if (method === 'OPTIONS') {
      return optionsResponse();
    }

    const routeKey = `${method} ${pathname}`;
    const routeHandler = routes[routeKey];
    const response = routeHandler ? await routeHandler(request, env) : notFoundResponse();

    return withCors(response);
  },
} satisfies ExportedHandler<Env>;
