import { GameStatus } from './types';

export const INVALID_MOVE_PENALTY_SECONDS = 30;

export function canEditBoard(status: GameStatus): boolean {
  return status === 'playing';
}

export function resolveStatusAfterMove(
  currentStatus: GameStatus,
  isCompleted: boolean,
): GameStatus {
  if (isCompleted) return 'completed';
  return currentStatus;
}
