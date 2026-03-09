import { GameStatus } from '../types';

export const MAX_MISTAKES = 3;

export function canEditBoard(status: GameStatus): boolean {
  return status === 'playing';
}

export function resolveStatusAfterMove(
  currentStatus: GameStatus,
  mistakes: number,
  isCompleted: boolean
): GameStatus {
  if (isCompleted) return 'completed';
  if (canEditBoard(currentStatus) && mistakes >= MAX_MISTAKES) return 'lost';
  return currentStatus;
}
