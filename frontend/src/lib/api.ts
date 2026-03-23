import type {
  CheckBoardRequest,
  CheckBoardResponse,
  CreateGameRequest,
  CreateGameResponse,
  ValidateMoveRequest,
  ValidateMoveResponse,
} from '../../../shared/types';

const defaultApiBaseUrl = 'http://127.0.0.1:8787';

function getApiBaseUrl(): string {
  const configuredBaseUrl = import.meta.env.VITE_API_BASE_URL;
  return (configuredBaseUrl || defaultApiBaseUrl).replace(/\/+$/, '');
}

async function requestJson<TResponse>(path: string, init?: RequestInit): Promise<TResponse> {
  const response = await fetch(`${getApiBaseUrl()}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...init?.headers,
    },
    ...init,
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => null) as { error?: string } | null;
    throw new Error(errorBody?.error || `Request failed with status ${response.status}.`);
  }

  return response.json() as Promise<TResponse>;
}

export function createGame(payload: CreateGameRequest): Promise<CreateGameResponse> {
  return requestJson<CreateGameResponse>('/api/games', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function validateMove(payload: ValidateMoveRequest): Promise<ValidateMoveResponse> {
  return requestJson<ValidateMoveResponse>('/api/moves', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function checkBoard(payload: CheckBoardRequest): Promise<CheckBoardResponse> {
  return requestJson<CheckBoardResponse>('/api/check', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}
