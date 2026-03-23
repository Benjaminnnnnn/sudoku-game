import assert from 'node:assert/strict';
import test from 'node:test';
import { canEditBoard, resolveStatusAfterMove } from './gameStatus';

test('an incomplete move keeps the game in progress', () => {
  const statusAfterMove = resolveStatusAfterMove('playing', false);

  assert.equal(statusAfterMove, 'playing');
});

test('completed state takes precedence over the current state', () => {
  const completedStatus = resolveStatusAfterMove('playing', true);

  assert.equal(completedStatus, 'completed');
});

test('board editing is blocked for paused and completed states', () => {
  assert.equal(canEditBoard('playing'), true);
  assert.equal(canEditBoard('paused'), false);
  assert.equal(canEditBoard('completed'), false);
});
