import fc from 'fast-check';
import { expect, test } from 'vitest';
import { INVALID_MOVE_PENALTY_SECONDS, canEditBoard, resolveStatusAfterMove } from './gameRules.ts';

test('only the playing state allows board edits', () => {
  fc.assert(
    fc.property(fc.constantFrom('playing', 'paused', 'completed'), (status) => {
      expect(canEditBoard(status)).toBe(status === 'playing');
    }),
  );
});

test('a completed move always transitions the game to completed', () => {
  fc.assert(
    fc.property(fc.constantFrom('playing', 'paused', 'completed'), (status) => {
      expect(resolveStatusAfterMove(status, true)).toBe('completed');
    }),
  );
});

test('non-completing moves preserve the current status', () => {
  fc.assert(
    fc.property(fc.constantFrom('playing', 'paused', 'completed'), (status) => {
      expect(resolveStatusAfterMove(status, false)).toBe(status);
    }),
  );
});

test('invalid move penalty is always a positive number of seconds', () => {
  expect(Number.isInteger(INVALID_MOVE_PENALTY_SECONDS)).toBe(true);
  expect(INVALID_MOVE_PENALTY_SECONDS).toBeGreaterThan(0);
});
