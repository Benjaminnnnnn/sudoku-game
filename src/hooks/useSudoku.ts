import { useState, useEffect, useCallback } from 'react';
import { generateSudoku } from '../lib/sudoku';
import { canEditBoard, resolveStatusAfterMove } from '../lib/gameStatus';
import { CellState, Difficulty, GameState } from '../types';

export function useSudoku() {
  const [gameState, setGameState] = useState<GameState>({
    board: [],
    solution: [],
    difficulty: 'easy',
    status: 'playing',
    timer: 0,
    mistakes: 0,
    notesMode: false,
    selectedCell: null,
    history: [],
  });

  const startNewGame = useCallback((difficulty: Difficulty = gameState.difficulty) => {
    const { puzzle, solution } = generateSudoku(difficulty);
    const initialBoard: CellState[][] = puzzle.map((row, r) =>
      row.map((val, c) => ({
        row: r,
        col: c,
        value: val,
        isFixed: val !== 0,
        isError: false,
        notes: new Set<number>(),
      }))
    );

    setGameState({
      board: initialBoard,
      solution,
      difficulty,
      status: 'playing',
      timer: 0,
      mistakes: 0,
      notesMode: false,
      selectedCell: null,
      history: [initialBoard],
    });
  }, [gameState.difficulty]);

  useEffect(() => {
    if (gameState.board.length === 0) {
      startNewGame('easy');
    }
  }, [gameState.board.length, startNewGame]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (gameState.status === 'playing') {
      interval = setInterval(() => {
        setGameState((prev) => ({ ...prev, timer: prev.timer + 1 }));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [gameState.status]);

  const selectCell = (row: number, col: number) => {
    if (!canEditBoard(gameState.status)) return;
    setGameState((prev) => ({ ...prev, selectedCell: { row, col } }));
  };

  const moveSelection = (dRow: number, dCol: number) => {
    if (!gameState.selectedCell || !canEditBoard(gameState.status)) return;
    const newRow = Math.max(0, Math.min(8, gameState.selectedCell.row + dRow));
    const newCol = Math.max(0, Math.min(8, gameState.selectedCell.col + dCol));
    setGameState((prev) => ({ ...prev, selectedCell: { row: newRow, col: newCol } }));
  };

  const setCellValue = (val: number) => {
    if (!gameState.selectedCell || !canEditBoard(gameState.status)) return;

    setGameState((prev) => {
      if (!prev.selectedCell || !canEditBoard(prev.status)) return prev;
      const { row, col } = prev.selectedCell;
      if (prev.board[row][col].isFixed) return prev;

      const newBoard = prev.board.map((r) => r.map((c) => ({ ...c, notes: new Set(c.notes) })));
      const newCell = newBoard[row][col];

      if (prev.notesMode) {
        if (val === 0) {
          newCell.notes.clear();
        } else {
          if (newCell.notes.has(val)) {
            newCell.notes.delete(val);
          } else {
            newCell.notes.add(val);
          }
        }
        newCell.value = 0;
        newCell.isError = false;
      } else {
        newCell.value = val;
        newCell.notes.clear();
        newCell.isError = val !== 0 && val !== prev.solution[row][col];
      }

      const mistakes = prev.mistakes + (newCell.isError ? 1 : 0);
      
      // Check completion
      let isCompleted = true;
      for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
          if (newBoard[r][c].value !== prev.solution[r][c]) {
            isCompleted = false;
            break;
          }
        }
      }

      return {
        ...prev,
        board: newBoard,
        mistakes,
        status: resolveStatusAfterMove(prev.status, mistakes, isCompleted),
        history: [...prev.history, newBoard],
      };
    });
  };

  const toggleNotesMode = () => {
    if (!canEditBoard(gameState.status)) return;
    setGameState((prev) => ({ ...prev, notesMode: !prev.notesMode }));
  };

  const undo = () => {
    setGameState((prev) => {
      if (prev.history.length <= 1) return prev;
      const newHistory = prev.history.slice(0, -1);
      return {
        ...prev,
        board: newHistory[newHistory.length - 1],
        history: newHistory,
      };
    });
  };

  const resetPuzzle = () => {
    setGameState((prev) => {
      if (prev.history.length === 0) return prev;
      return {
        ...prev,
        board: prev.history[0],
        history: [prev.history[0]],
        mistakes: 0,
        timer: 0,
        status: 'playing',
      };
    });
  };

  const togglePause = () => {
    setGameState((prev) => ({
      ...prev,
      status:
        prev.status === 'playing'
          ? 'paused'
          : prev.status === 'paused'
            ? 'playing'
            : prev.status,
    }));
  };

  return {
    gameState,
    startNewGame,
    selectCell,
    moveSelection,
    setCellValue,
    toggleNotesMode,
    undo,
    resetPuzzle,
    togglePause,
  };
}
