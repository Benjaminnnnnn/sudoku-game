import { expect, test } from 'vitest';
import {
  INVALID_MOVE_PENALTY_SECONDS,
  canEditBoard,
  resolveStatusAfterMove,
} from './gameRules.ts';

test('playing state allows board edits', () => {
  expect(canEditBoard('playing')).toBe(true);
  expect(INVALID_MOVE_PENALTY_SECONDS).toBe(30);
});

test('paused and completed states block board edits', () => {
  expect(canEditBoard('paused')).toBe(false);
  expect(canEditBoard('completed')).toBe(false);
});

test('completed move wins over the current game status', () => {
  expect(resolveStatusAfterMove('playing', true)).toBe('completed');
  expect(resolveStatusAfterMove('paused', false)).toBe('paused');
});
