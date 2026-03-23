# MVP Plan

## Goal

Build the smallest version that is easy to change later.

Use:

- `frontend/` for the React app
- `shared/` for pure Sudoku logic and shared types
- `server/` for an Express REST API on Cloudflare Workers
- Cloudflare Pages for the frontend
- No database for the MVP

## Target Folder Structure

```text
/
  frontend/                 # existing frontend
  shared/
    sudoku.ts               # pure board generation / validation helpers
    gameRules.ts            # pure move and completion rules
    types.ts                # board + API-safe shared types
  server/
    src/
      index.ts              # Express app entrypoint for Worker
      routes/
        health.ts
        games.ts
      lib/
        token.ts            # sign/encrypt game payloads
    package.json
    tsconfig.json
    wrangler.jsonc
  plan.md
```

## MVP Scope

Use Express for the backend.

Start with only these endpoints:

- `GET /api/health`
- `POST /api/games`
- `POST /api/moves`
- `POST /api/check`

Backend responsibilities:

- generate a puzzle
- keep the solution out of the browser
- validate a move
- check a final board

## No-DB Design

For the MVP, do not store games in a database.

Instead:

- `POST /api/games` returns a `puzzle` and a `gameToken`
- `gameToken` contains the data needed to validate moves later
- the token must be encrypted or otherwise unreadable by the client
- the frontend sends the token back to the API for move validation and final checking

Why this is enough:

- no saved games yet
- no accounts yet
- no cross-device resume yet
- much less setup than D1

Add a database later only if you need persistence.

## API Shape

### `GET /api/health`

Simple deployment check.

### `POST /api/games`

Request:

```json
{ "difficulty": "easy" }
```

Response:

```json
{
  "puzzle": [[0,0,0],[...]],
  "gameToken": "opaque-token"
}
```

### `POST /api/moves`

Request:

```json
{
  "gameToken": "opaque-token",
  "row": 0,
  "col": 1,
  "value": 7
}
```

Response:

```json
{
  "valid": true,
  "isFixedCell": false
}
```

### `POST /api/check`

Request:

```json
{
  "gameToken": "opaque-token",
  "board": [[0,0,0],[...]]
}
```

Response:

```json
{
  "solved": false,
  "invalidCells": [{ "row": 3, "col": 5 }]
}
```

## Minimal Implementation Plan

### 1. Restructure the repo

- move the current frontend code into `frontend/`
- create `shared/`
- create `server/`

### 2. Move shared logic

Put pure logic in `shared/`:

- `shared/sudoku.ts`
- `shared/gameRules.ts`
- `shared/types.ts`

Keep React-only state and components inside `frontend/`.

### 3. Create the Express backend

Inside `server/`, add:

- `src/index.ts`
- `src/routes/health.ts`
- `src/routes/games.ts`
- `src/lib/token.ts`
- `wrangler.jsonc`

Recommended backend packages:

- `express`
- `cors`
- `zod`
- `wrangler`
- `typescript`
- `tsx`
- `@types/express`

### 4. Implement token handling

The token should include:

- puzzle
- solution
- difficulty

Rules:

- do not return the solution separately
- do not make the token readable in plaintext
- sign and encrypt it with a server secret stored in Workers secrets

### 5. Update the frontend

Frontend flow:

1. start a game with `POST /api/games`
2. store `puzzle` and `gameToken`
3. validate moves with `POST /api/moves`
4. check the board with `POST /api/check`

Also:

- use `VITE_API_BASE_URL`
- remove client-side ownership of the full solution

## Minimal Local Dev Setup

### Frontend

From `frontend/`:

```bash
npm install
npm run dev
```

### Backend

From `server/`:

```bash
npm install
npx wrangler dev
```

## Deploy Frontend to Cloudflare Pages

### 1. Push the repo to GitHub or GitLab

### 2. Create a Pages project

In Cloudflare dashboard:

1. go to `Workers & Pages`
2. choose `Create application`
3. choose `Pages`
4. connect the repository

### 3. Configure the frontend build

Use:

- Root directory: `frontend`
- Build command: `npm run build`
- Build output directory: `dist`

Environment variables:

- `VITE_API_BASE_URL=https://api.yourdomain.com`
- `NODE_VERSION=22`

### 4. Deploy

After deploy, you will get a `*.pages.dev` URL.

## Deploy Backend to Cloudflare Workers

### 1. Log in to Wrangler

From `server/`:

```bash
npx wrangler login
```

### 2. Add the Worker secret

Store the token secret in Cloudflare:

```bash
npx wrangler secret put GAME_TOKEN_SECRET
```

### 3. Deploy the API

```bash
npx wrangler deploy
```

After deploy, you will get a `*.workers.dev` URL.

## Custom Domains

Recommended:

- frontend: `www.yourdomain.com`
- backend: `api.yourdomain.com`

After the Worker custom domain is active, set:

```text
VITE_API_BASE_URL=https://api.yourdomain.com
```

Then redeploy the frontend.

## Important Notes

- keep the MVP stateless
- use Express on Workers with `nodejs_compat`
- keep the solution out of the client
- add a database later only if you need saved sessions or accounts

## Suggested Build Order

1. move the current app into `frontend/`
2. create `shared/`
3. create `server/`
4. add the Express routes
5. add token signing/encryption
6. connect the frontend to the API
7. deploy the Worker
8. deploy the Pages frontend
