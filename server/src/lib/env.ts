import { ConfigurationError } from './errors.ts';

export function requireGameTokenSecret(env: Env): string {
  const tokenSecret = env.GAME_TOKEN_SECRET;

  if (!tokenSecret) {
    throw new ConfigurationError('GAME_TOKEN_SECRET is not configured.');
  }

  return tokenSecret;
}
