<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/2bd5d3fd-8437-43fc-8635-695b530c7c8c

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Set `VITE_API_BASE_URL` in [.env.local](.env.local) to your local or deployed API URL
4. Run the app:
   `npm run dev`

## Frontend API URL

The frontend reads the backend URL from `VITE_API_BASE_URL`.

- Local Wrangler dev: `http://127.0.0.1:8787`
- Current deployed Worker: `https://sudoku-api.sudoku-piccollage.workers.dev`

For Vercel production, add this environment variable in the project settings:

```dotenv
VITE_API_BASE_URL=https://sudoku-api.sudoku-piccollage.workers.dev
```

You can also use [`frontend/.env.production.example`](/Users/benjaminzhuang/workspace/webdev/react/sudoku/frontend/.env.production.example) as the reference value.
