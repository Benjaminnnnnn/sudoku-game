import assert from 'node:assert/strict';
import test from 'node:test';
import { canEditBoard, MAX_MISTAKES, resolveStatusAfterMove } from './gameStatus';

test('first and second invalid moves keep game in progress', () => {
  const afterFirstMistake = resolveStatusAfterMove('playing', 1, false);
  const afterSecondMistake = resolveStatusAfterMove('playing', 2, false);

  assert.equal(afterFirstMistake, 'playing');
  assert.equal(afterSecondMistake, 'playing');
});

test('third invalid move immediately ends game as lost', () => {
  const afterThirdMistake = resolveStatusAfterMove('playing', MAX_MISTAKES, false);

  assert.equal(afterThirdMistake, 'lost');
});

test('completed state takes precedence over loss transition', () => {
  const completedStatus = resolveStatusAfterMove('playing', MAX_MISTAKES, true);

  assert.equal(completedStatus, 'completed');
});

test('board editing is blocked for lost and other non-playing states', () => {
  assert.equal(canEditBoard('playing'), true);
  assert.equal(canEditBoard('paused'), false);
  assert.equal(canEditBoard('completed'), false);
  assert.equal(canEditBoard('lost'), false);
});
