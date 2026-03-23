# Build a TypeScript REST API on Cloudflare

Verified against Cloudflare docs on March 22, 2026.

If you are new to Cloudflare, the simplest backend stack is:

- `Cloudflare Workers` for your API runtime
- `Wrangler` for local development and deployment
- `workers.dev` for the first public URL
- `D1` only if you need a database later

Do not think of this like deploying an Express server to a VM. On Cloudflare, your API usually runs as a Worker: a small TypeScript module that handles HTTP requests with a `fetch()` function.

## Mental Model

- `Worker`: your backend code
- `Wrangler`: the CLI that runs and deploys the Worker
- `wrangler.jsonc`: the Worker config file
- `bindings`: Cloudflare-provided resources attached to your Worker, like secrets, D1, KV, R2, or AI
- `workers.dev`: the default Cloudflare-hosted URL for your deployed Worker
- `custom domain`: your own domain, like `api.example.com`

For a REST API, this is usually enough:

1. Create a Worker project.
2. Write route handlers in `src/index.ts`.
3. Run it locally with `wrangler dev`.
4. Add secrets with Wrangler.
5. Deploy with `wrangler deploy`.

## Best First Stack

For your first backend on Cloudflare, use:

- TypeScript
- one Worker
- JSON endpoints
- stateless logic first
- D1 later if you need persistence

This keeps the learning curve low. You can add auth, a database, queues, cron jobs, or object storage later.

## Option A: Start From Scratch

### 1. Create the project

Cloudflare’s current CLI flow uses `create-cloudflare`:

```bash
npm create cloudflare@latest -- my-api
cd my-api
```

Choose:

- `Hello World example`
- `Worker only`
- `TypeScript`
- `Yes` for git if you want it
- `No` for deploy at first

### 2. Understand the generated files

The important files are usually:

- `src/index.ts`
- `wrangler.jsonc`
- `package.json`

### 3. Replace `src/index.ts` with a minimal REST API

```ts
export interface Env {
  API_KEY: string;
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type,Authorization",
};

function json(data: unknown, init: ResponseInit = {}) {
  return new Response(JSON.stringify(data), {
    ...init,
    headers: {
      "content-type": "application/json; charset=utf-8",
      ...corsHeaders,
      ...(init.headers ?? {}),
    },
  });
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    if (request.method === "GET" && url.pathname === "/api/health") {
      return json({ ok: true, runtime: "cloudflare-workers" });
    }

    if (request.method === "POST" && url.pathname === "/api/echo") {
      const authHeader = request.headers.get("authorization");

      if (authHeader !== `Bearer ${env.API_KEY}`) {
        return json({ error: "Unauthorized" }, { status: 401 });
      }

      const body = await request.json();
      return json({ received: body }, { status: 201 });
    }

    return json({ error: "Not found" }, { status: 404 });
  },
};
```

### 4. Run locally

```bash
npm install
npx wrangler dev
```

You will get a local URL for testing.

Example:

```bash
curl http://127.0.0.1:8787/api/health
```

### 5. Add local secrets

For local development, Cloudflare recommends using `.dev.vars` or `.env` next to `wrangler.jsonc`.

Example `.dev.vars`:

```dotenv
API_KEY=replace-me
```

Do not commit real secrets.

### 6. Deploy

First authenticate:

```bash
npx wrangler login
```

Then add the production secret:

```bash
npx wrangler secret put API_KEY
```

Important: `wrangler secret put` creates a new Worker version and deploys it immediately.

Then deploy normally:

```bash
npx wrangler deploy
```

After deploy, Cloudflare gives you a URL like:

```txt
https://my-api.<your-subdomain>.workers.dev
```

## Option B: Use This Repo’s Existing Backend

This repo already has a Cloudflare Worker backend in [`server/wrangler.jsonc`](/Users/benjaminzhuang/workspace/webdev/react/sudoku/server/wrangler.jsonc) and [`server/src/index.ts`](/Users/benjaminzhuang/workspace/webdev/react/sudoku/server/src/index.ts).

That means you do not need to create a new Worker project. You already have one.

### Current structure

- Worker name: `sudoku-api`
- entry file: [`server/src/index.ts`](/Users/benjaminzhuang/workspace/webdev/react/sudoku/server/src/index.ts)
- config file: [`server/wrangler.jsonc`](/Users/benjaminzhuang/workspace/webdev/react/sudoku/server/wrangler.jsonc)
- scripts: [`server/package.json`](/Users/benjaminzhuang/workspace/webdev/react/sudoku/server/package.json)

### Current endpoints

The Worker currently routes:

- `GET /api/health`
- `POST /api/games`
- `POST /api/moves`
- `POST /api/check`

Those routes are dispatched from [`server/src/index.ts`](/Users/benjaminzhuang/workspace/webdev/react/sudoku/server/src/index.ts).

### Local development for this repo

From the repo root:

```bash
cd server
npm install
```

Create `server/.dev.vars`:

```dotenv
GAME_TOKEN_SECRET=replace-this-with-a-long-random-secret
```

Run the Worker locally:

```bash
npm run dev
```

Test it:

```bash
curl http://127.0.0.1:8787/api/health
curl -X POST http://127.0.0.1:8787/api/games \
  -H 'Content-Type: application/json' \
  -d '{"difficulty":"easy"}'
```

### Deploy this repo’s backend

From `server/`:

```bash
npx wrangler login
npx wrangler secret put GAME_TOKEN_SECRET
npm run deploy
```

Because [`server/wrangler.jsonc`](/Users/benjaminzhuang/workspace/webdev/react/sudoku/server/wrangler.jsonc) has `"workers_dev": true`, the first deployment should be available on a `workers.dev` URL.

## Add a Custom Domain Later

Start with `workers.dev`. Move to a custom domain after the API works.

If your domain is already managed by Cloudflare, add a route in `wrangler.jsonc` like this:

```jsonc
{
  "name": "sudoku-api",
  "main": "src/index.ts",
  "compatibility_date": "2026-03-22",
  "routes": [
    {
      "pattern": "api.example.com",
      "custom_domain": true
    }
  ]
}
```

Then redeploy:

```bash
npx wrangler deploy
```

For API projects where the Worker is the main origin, Cloudflare recommends `Custom Domains` over staying on `workers.dev`.

## When To Add D1

Your current Sudoku backend is mostly stateless, so a database is optional right now.

Use `D1` when you need:

- saved users
- saved games
- leaderboard data
- sessions or persistent records

Basic flow:

```bash
npx wrangler d1 create sudoku-db
```

Cloudflare will return a `database_id` and a config snippet to paste into `wrangler.jsonc`.

After that, your Worker can query the DB through `env.DB`.

If you want, the next practical step after this guide is:

1. deploy the current `server/` Worker first
2. point the frontend at the deployed URL
3. only add D1 if you later need persistent data

## Important Cloudflare Differences

These are the common beginner mistakes:

- Do not start an HTTP server with `app.listen()`. Workers use a `fetch()` handler.
- Do not assume full Node.js server behavior. Workers run in Cloudflare’s runtime, which is Web-API-first.
- Use Wrangler secrets, not plain config values, for sensitive data.
- Use `workers.dev` first, then add a custom domain.
- Keep the first version stateless unless persistence is clearly required.

## Practical Deployment Checklist

For this repo, the shortest path is:

1. `cd server`
2. `npm install`
3. create `.dev.vars` with `GAME_TOKEN_SECRET`
4. `npm run dev`
5. `npx wrangler login`
6. `npx wrangler secret put GAME_TOKEN_SECRET`
7. `npm run deploy`
8. test the returned `workers.dev` URL
9. update the frontend to call that API URL

## Official Docs

- Cloudflare Workers overview: https://developers.cloudflare.com/workers/
- Get started with Workers CLI: https://developers.cloudflare.com/workers/get-started/guide/
- TypeScript on Workers: https://developers.cloudflare.com/workers/languages/typescript/
- Wrangler config: https://developers.cloudflare.com/workers/wrangler/configuration/
- Wrangler install/update: https://developers.cloudflare.com/workers/wrangler/install-and-update/
- Workers secrets: https://developers.cloudflare.com/workers/configuration/secrets/
- `workers.dev` routing: https://developers.cloudflare.com/workers/configuration/routing/workers-dev/
- Custom domains: https://developers.cloudflare.com/workers/configuration/routing/custom-domains/
- D1 Worker bindings: https://developers.cloudflare.com/d1/worker-api/

## Recommendation

For your project, do not build a separate backend from scratch unless you want the learning exercise. You already have the right Cloudflare deployment model in `server/`.

The pragmatic path is:

1. treat `server/` as your TypeScript REST API
2. add the secret
3. deploy it with Wrangler
4. connect the frontend to the deployed Worker URL
