import { expect, test } from 'vitest';
import {
  applyMovePreview,
  applyNotesValue,
  createBoardSnapshot,
  createCellStateBoard,
  createInitialGameState,
  createMovePreview,
  resetPuzzle,
} from './gameState';
import { createEmptyBestScores } from './score';
import type { GameState } from '../types';

function createTestState(): GameState {
  const board = createCellStateBoard([
    [1, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
  ]);

  return {
    ...createInitialGameState(createEmptyBestScores()),
    board,
    gameToken: 'game-token',
    selectedCell: { row: 0, col: 1 },
    history: [createBoardSnapshot(board, 0)],
  };
}

test('notes updates stay local and append to history', () => {
  const state = createTestState();

  const withNote = applyNotesValue({ ...state, notesMode: true }, 0, 1, 4);
  const withoutNote = applyNotesValue(withNote, 0, 1, 4);

  expect(withNote.board[0][1].value).toBe(0);
  expect(Array.from(withNote.board[0][1].notes)).toEqual([4]);
  expect(withNote.history).toHaveLength(2);
  expect(withoutNote.board[0][1].notes.size).toBe(0);
  expect(withoutNote.history).toHaveLength(3);
});

test('invalid move preview applies error styling and penalties', () => {
  const state = createTestState();

  const preview = createMovePreview(state, 0, 1, 9, {
    valid: false,
    isFixedCell: false,
  });
  const nextState = applyMovePreview(state, preview);

  expect(nextState.board[0][1].value).toBe(9);
  expect(nextState.board[0][1].isError).toBe(true);
  expect(nextState.mistakes).toBe(1);
  expect(nextState.timer).toBe(30);
});

test('solved move stores a new best score for the active difficulty', () => {
  const state = {
    ...createTestState(),
    board: createCellStateBoard([
      [1, 0, 3, 4, 5, 6, 7, 8, 9],
      [4, 5, 6, 7, 8, 9, 1, 2, 3],
      [7, 8, 9, 1, 2, 3, 4, 5, 6],
      [2, 1, 4, 3, 6, 5, 8, 9, 7],
      [3, 6, 5, 8, 9, 7, 2, 1, 4],
      [8, 9, 7, 2, 1, 4, 3, 6, 5],
      [5, 3, 1, 6, 4, 2, 9, 7, 8],
      [6, 4, 2, 9, 7, 8, 5, 3, 1],
      [9, 7, 8, 5, 3, 1, 6, 4, 2],
    ]),
    timer: 42,
    history: [],
  };

  const preview = createMovePreview(state, 0, 1, 2, {
    valid: true,
    isFixedCell: false,
  });
  const nextState = applyMovePreview(state, preview, {
    solved: true,
    invalidCells: [],
  });

  expect(nextState.status).toBe('completed');
  expect(nextState.bestScores.easy).toBe(42);
});

test('reset restores the initial puzzle snapshot and clears session counters', () => {
  const initialState = createTestState();
  const changedState = applyMovePreview(
    initialState,
    createMovePreview(initialState, 0, 1, 5, {
      valid: true,
      isFixedCell: false,
    }),
  );

  const resetState = resetPuzzle(changedState);

  expect(resetState.board[0][1].value).toBe(0);
  expect(resetState.mistakes).toBe(0);
  expect(resetState.timer).toBe(0);
  expect(resetState.status).toBe('playing');
  expect(resetState.history).toHaveLength(1);
});
