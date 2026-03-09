export type Board = number[][];

export function isValid(board: Board, row: number, col: number, num: number): boolean {
  for (let i = 0; i < 9; i++) {
    if (board[row][i] === num) return false;
    if (board[i][col] === num) return false;
    const boxRow = Math.floor(row / 3) * 3 + Math.floor(i / 3);
    const boxCol = Math.floor(col / 3) * 3 + (i % 3);
    if (board[boxRow][boxCol] === num) return false;
  }
  return true;
}

function fillBoard(board: Board): boolean {
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (board[r][c] === 0) {
        const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9].sort(() => Math.random() - 0.5);
        for (const num of nums) {
          if (isValid(board, r, c, num)) {
            board[r][c] = num;
            if (fillBoard(board)) return true;
            board[r][c] = 0;
          }
        }
        return false;
      }
    }
  }
  return true;
}

function countSolutions(board: Board, count: { value: number }) {
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (board[r][c] === 0) {
        for (let num = 1; num <= 9; num++) {
          if (isValid(board, r, c, num)) {
            board[r][c] = num;
            countSolutions(board, count);
            board[r][c] = 0;
            if (count.value > 1) return;
          }
        }
        return;
      }
    }
  }
  count.value++;
}

export function generateSudoku(difficulty: 'easy' | 'medium' | 'hard') {
  const board: Board = Array(9).fill(null).map(() => Array(9).fill(0));
  fillBoard(board);
  const solution = board.map((row) => [...row]);

  let cellsToRemove = 0;
  if (difficulty === 'easy') cellsToRemove = 30;
  if (difficulty === 'medium') cellsToRemove = 45;
  if (difficulty === 'hard') cellsToRemove = 55;

  const puzzle = board.map((row) => [...row]);
  const positions = Array.from({ length: 81 }, (_, i) => i).sort(() => Math.random() - 0.5);

  let removed = 0;
  for (const pos of positions) {
    if (removed >= cellsToRemove) break;
    const r = Math.floor(pos / 9);
    const c = pos % 9;
    if (puzzle[r][c] !== 0) {
      const backup = puzzle[r][c];
      puzzle[r][c] = 0;

      const count = { value: 0 };
      countSolutions(puzzle, count);
      if (count.value !== 1) {
        puzzle[r][c] = backup; // Put it back if it breaks uniqueness
      } else {
        removed++;
      }
    }
  }

  return { puzzle, solution };
}
