import fc from 'fast-check';
import { expect, test } from 'vitest';
import type { Board, Difficulty } from './types.ts';
import { generateSudoku, isValid } from './sudoku.ts';

const expectedDigits = new Set([1, 2, 3, 4, 5, 6, 7, 8, 9]);
const difficultyArbitrary = fc.constantFrom<Difficulty>('easy', 'medium', 'hard');

function cloneBoard(source: Board): Board {
  return source.map((row) => [...row]);
}

function countGivens(board: Board): number {
  return board.flat().filter((value) => value !== 0).length;
}

function expectPuzzleMatchesSolution(puzzle: Board, solution: Board) {
  for (let rowIndex = 0; rowIndex < puzzle.length; rowIndex++) {
    for (let columnIndex = 0; columnIndex < puzzle[rowIndex].length; columnIndex++) {
      const puzzleValue = puzzle[rowIndex][columnIndex];

      if (puzzleValue !== 0) {
        expect(puzzleValue).toBe(solution[rowIndex][columnIndex]);
      }
    }
  }
}

function expectValidSolvedBoard(board: Board) {
  expect(board).toHaveLength(9);

  for (let index = 0; index < 9; index++) {
    expect(new Set(board[index])).toEqual(expectedDigits);
    expect(new Set(board.map((row) => row[index]))).toEqual(expectedDigits);
  }

  for (let boxRow = 0; boxRow < 3; boxRow++) {
    for (let boxCol = 0; boxCol < 3; boxCol++) {
      const values: number[] = [];

      for (let row = boxRow * 3; row < boxRow * 3 + 3; row++) {
        for (let col = boxCol * 3; col < boxCol * 3 + 3; col++) {
          values.push(board[row][col]);
        }
      }

      expect(new Set(values)).toEqual(expectedDigits);
    }
  }
}

test('generated solutions always satisfy Sudoku row, column, and box constraints', () => {
  fc.assert(
    fc.property(difficultyArbitrary, (difficulty) => {
      const { solution } = generateSudoku(difficulty);

      expectValidSolvedBoard(solution);
    }),
    { numRuns: 2 },
  );
}, 10000);

test('generated puzzles never contain conflicting clues', () => {
  fc.assert(
    fc.property(difficultyArbitrary, (difficulty) => {
      const { puzzle, solution } = generateSudoku(difficulty);

      expectPuzzleMatchesSolution(puzzle, solution);
    }),
    { numRuns: 2 },
  );
}, 10000);

test('generated boards always use only digits 1-9, with 0 reserved for puzzle blanks', () => {
  fc.assert(
    fc.property(difficultyArbitrary, (difficulty) => {
      const { puzzle, solution } = generateSudoku(difficulty);

      expect(solution.flat().every((value) => value >= 1 && value <= 9)).toBe(true);
      expect(puzzle.flat().every((value) => value >= 0 && value <= 9)).toBe(true);
      expect(puzzle.flat().some((value) => value === 0)).toBe(true);
    }),
    { numRuns: 2 },
  );
}, 10000);

test('filled cells in a generated puzzle are always clues from the solved board', () => {
  fc.assert(
    fc.property(difficultyArbitrary, (difficulty) => {
      const { puzzle, solution } = generateSudoku(difficulty);

      expectPuzzleMatchesSolution(puzzle, solution);
      expect(puzzle.flat().filter((value) => value !== 0).every((value) => value >= 1 && value <= 9)).toBe(true);
    }),
    { numRuns: 2 },
  );
}, 10000);

test('the original value from a solved board is the only valid value for an emptied cell', () => {
  fc.assert(
    fc.property(
      difficultyArbitrary,
      fc.integer({ min: 0, max: 8 }),
      fc.integer({ min: 0, max: 8 }),
      (difficulty, row, col) => {
        const { solution } = generateSudoku(difficulty);
        const boardWithHole = cloneBoard(solution);
        const expectedValue = solution[row][col];
        boardWithHole[row][col] = 0;

        expect(isValid(boardWithHole, row, col, expectedValue)).toBe(true);

        for (let candidate = 1; candidate <= 9; candidate++) {
          if (candidate !== expectedValue) {
            expect(isValid(boardWithHole, row, col, candidate)).toBe(false);
          }
        }
      },
    ),
    { numRuns: 2 },
  );
}, 10000);

test('hard puzzles never contain more givens than medium puzzles, and medium never contain more than easy', () => {
  fc.assert(
    fc.property(fc.constant(null), () => {
      const easy = generateSudoku('easy');
      const medium = generateSudoku('medium');
      const hard = generateSudoku('hard');

      expect(countGivens(easy.puzzle)).toBeGreaterThanOrEqual(countGivens(medium.puzzle));
      expect(countGivens(medium.puzzle)).toBeGreaterThanOrEqual(countGivens(hard.puzzle));
    }),
    { numRuns: 2 },
  );
}, 10000);
