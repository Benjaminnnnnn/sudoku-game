import { expect, test } from 'vitest';
import { canEditBoard, resolveStatusAfterMove } from './gameStatus.ts';

test('an incomplete move keeps the game in progress', () => {
  const statusAfterMove = resolveStatusAfterMove('playing', false);

  expect(statusAfterMove).toBe('playing');
});

test('completed state takes precedence over the current state', () => {
  const completedStatus = resolveStatusAfterMove('playing', true);

  expect(completedStatus).toBe('completed');
});

test('board editing is blocked for paused and completed states', () => {
  expect(canEditBoard('playing')).toBe(true);
  expect(canEditBoard('paused')).toBe(false);
  expect(canEditBoard('completed')).toBe(false);
});
