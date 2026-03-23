import { expect, test } from 'vitest';
import type { Board } from './types.ts';
import { generateSudoku, isValid } from './sudoku.ts';

const board: Board = [
  [5, 3, 0, 0, 7, 0, 0, 0, 0],
  [6, 0, 0, 1, 9, 5, 0, 0, 0],
  [0, 9, 8, 0, 0, 0, 0, 6, 0],
  [8, 0, 0, 0, 6, 0, 0, 0, 3],
  [4, 0, 0, 8, 0, 3, 0, 0, 1],
  [7, 0, 0, 0, 2, 0, 0, 0, 6],
  [0, 6, 0, 0, 0, 0, 2, 8, 0],
  [0, 0, 0, 4, 1, 9, 0, 0, 5],
  [0, 0, 0, 0, 8, 0, 0, 7, 9],
];

test('isValid allows a legal move', () => {
  expect(isValid(board, 0, 2, 4)).toBe(true);
});

test('isValid rejects conflicting moves', () => {
  expect(isValid(board, 0, 2, 5)).toBe(false);
  expect(isValid(board, 0, 2, 8)).toBe(false);
});

test('generateSudoku returns matching puzzle and solution boards', () => {
  const { puzzle, solution } = generateSudoku('easy');

  expect(puzzle.length).toBe(9);
  expect(solution.length).toBe(9);
  expect(puzzle.every((row) => row.length === 9)).toBe(true);
  expect(solution.every((row) => row.length === 9)).toBe(true);
  expect(solution.flat().every((value) => value >= 1 && value <= 9)).toBe(true);
  expect(puzzle.flat().some((value) => value === 0)).toBe(true);

  for (let rowIndex = 0; rowIndex < puzzle.length; rowIndex++) {
    for (let columnIndex = 0; columnIndex < puzzle[rowIndex].length; columnIndex++) {
      const puzzleValue = puzzle[rowIndex][columnIndex];

      if (puzzleValue !== 0) {
        expect(puzzleValue).toBe(solution[rowIndex][columnIndex]);
      }
    }
  }
});
