import { useState, useEffect, useCallback } from 'react';
import { checkBoard, createGame, validateMove } from '../lib/api';
import { canEditBoard, INVALID_MOVE_PENALTY_SECONDS, resolveStatusAfterMove } from '../lib/gameStatus';
import { loadBestScores, saveBestScores } from '../lib/score';
import { BoardSnapshot, CellState, Difficulty, GameState } from '../types';

function createCellStateBoard(puzzle: number[][]): CellState[][] {
  return puzzle.map((row, rowIndex) =>
    row.map((value, columnIndex) => ({
      row: rowIndex,
      col: columnIndex,
      value,
      isFixed: value !== 0,
      isError: false,
      notes: new Set<number>(),
    })),
  );
}

function cloneBoard(board: CellState[][]): CellState[][] {
  return board.map((row) => row.map((cell) => ({ ...cell, notes: new Set(cell.notes) })));
}

function createBoardSnapshot(board: CellState[][], mistakes: number): BoardSnapshot {
  return {
    board: cloneBoard(board),
    mistakes,
  };
}

function hasEmptyCells(board: CellState[][]): boolean {
  return board.some((row) => row.some((cell) => cell.value === 0));
}

function toNumberBoard(board: CellState[][]): number[][] {
  return board.map((row) => row.map((cell) => cell.value));
}

export function useSudoku() {
  const [gameState, setGameState] = useState<GameState>(() => ({
    board: [],
    gameToken: null,
    difficulty: 'easy',
    status: 'playing',
    timer: 0,
    mistakes: 0,
    notesMode: false,
    selectedCell: null,
    history: [],
    isLoading: false,
    errorMessage: null,
    bestScores: loadBestScores(),
  }));

  const startNewGame = useCallback(async (difficulty: Difficulty = gameState.difficulty) => {
    setGameState((prev) => ({
      ...prev,
      difficulty,
      isLoading: true,
      errorMessage: null,
      selectedCell: null,
    }));

    try {
      const { puzzle, gameToken } = await createGame({ difficulty });
      const initialBoard = createCellStateBoard(puzzle);

      setGameState((prev) => ({
        board: initialBoard,
        gameToken,
        difficulty,
        status: 'playing',
        timer: 0,
        mistakes: 0,
        notesMode: false,
        selectedCell: null,
        history: [createBoardSnapshot(initialBoard, 0)],
        isLoading: false,
        errorMessage: null,
        bestScores: prev.bestScores,
      }));
    } catch (error) {
      setGameState((prev) => ({
        ...prev,
        isLoading: false,
        errorMessage: error instanceof Error ? error.message : 'Failed to create a new game.',
      }));
    }
  }, [gameState.difficulty]);

  useEffect(() => {
    if (
      gameState.board.length === 0 &&
      !gameState.isLoading &&
      gameState.gameToken === null &&
      gameState.errorMessage === null
    ) {
      void startNewGame('easy');
    }
  }, [gameState.board.length, gameState.errorMessage, gameState.gameToken, gameState.isLoading, startNewGame]);

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
    if (gameState.isLoading || !canEditBoard(gameState.status)) return;
    setGameState((prev) => ({ ...prev, selectedCell: { row, col } }));
  };

  const moveSelection = (dRow: number, dCol: number) => {
    if (gameState.isLoading || !gameState.selectedCell || !canEditBoard(gameState.status)) return;
    const newRow = Math.max(0, Math.min(8, gameState.selectedCell.row + dRow));
    const newCol = Math.max(0, Math.min(8, gameState.selectedCell.col + dCol));
    setGameState((prev) => ({ ...prev, selectedCell: { row: newRow, col: newCol } }));
  };

  const setCellValue = useCallback(async (value: number) => {
    if (
      gameState.isLoading ||
      !gameState.selectedCell ||
      !gameState.gameToken ||
      !canEditBoard(gameState.status)
    ) {
      return;
    }

    const { row, col } = gameState.selectedCell;
    const selectedCell = gameState.board[row]?.[col];
    if (!selectedCell || selectedCell.isFixed) return;

    if (gameState.notesMode) {
      const updatedBoard = cloneBoard(gameState.board);
      const updatedCell = updatedBoard[row][col];

      if (value === 0) {
        updatedCell.notes.clear();
      } else if (updatedCell.notes.has(value)) {
        updatedCell.notes.delete(value);
      } else {
        updatedCell.notes.add(value);
      }

      updatedCell.value = 0;
      updatedCell.isError = false;

      setGameState((prev) => ({
        ...prev,
        board: updatedBoard,
        history: [...prev.history, createBoardSnapshot(updatedBoard, prev.mistakes)],
      }));
      return;
    }

    if (value === 0) {
      const updatedBoard = cloneBoard(gameState.board);
      const updatedCell = updatedBoard[row][col];
      updatedCell.value = 0;
      updatedCell.notes.clear();
      updatedCell.isError = false;

      setGameState((prev) => ({
        ...prev,
        board: updatedBoard,
        history: [...prev.history, createBoardSnapshot(updatedBoard, prev.mistakes)],
      }));
      return;
    }

    setGameState((prev) => ({
      ...prev,
      isLoading: true,
      errorMessage: null,
    }));

    try {
      const moveResult = await validateMove({
        gameToken: gameState.gameToken,
        row,
        col,
        value,
      });

      if (moveResult.isFixedCell) {
        setGameState((prev) => ({
          ...prev,
          isLoading: false,
        }));
        return;
      }

      const updatedBoard = cloneBoard(gameState.board);
      const updatedCell = updatedBoard[row][col];
      updatedCell.value = value;
      updatedCell.notes.clear();
      updatedCell.isError = !moveResult.valid;

      const nextMistakes = gameState.mistakes + (moveResult.valid ? 0 : 1);
      const nextTimer = gameState.timer + (moveResult.valid ? 0 : INVALID_MOVE_PENALTY_SECONDS);
      let nextStatus = resolveStatusAfterMove(gameState.status, false);
      let nextBestScores = gameState.bestScores;

      if (moveResult.valid && !hasEmptyCells(updatedBoard)) {
        const checkResult = await checkBoard({
          gameToken: gameState.gameToken,
          board: toNumberBoard(updatedBoard),
        });

        nextStatus = resolveStatusAfterMove(gameState.status, checkResult.solved);

        if (!checkResult.solved) {
          for (const invalidCell of checkResult.invalidCells) {
            updatedBoard[invalidCell.row][invalidCell.col].isError = true;
          }
        } else {
          const currentBestScore = gameState.bestScores[gameState.difficulty];
          if (currentBestScore === null || nextTimer < currentBestScore) {
            nextBestScores = {
              ...gameState.bestScores,
              [gameState.difficulty]: nextTimer,
            };
            saveBestScores(nextBestScores);
          }
        }
      }

      setGameState((prev) => ({
        ...prev,
        board: updatedBoard,
        mistakes: nextMistakes,
        timer: nextTimer,
        status: nextStatus,
        history: [...prev.history, createBoardSnapshot(updatedBoard, nextMistakes)],
        isLoading: false,
        bestScores: nextBestScores,
      }));
    } catch (error) {
      setGameState((prev) => ({
        ...prev,
        isLoading: false,
        errorMessage: error instanceof Error ? error.message : 'Failed to validate move.',
      }));
    }
  }, [gameState]);

  const toggleNotesMode = () => {
    if (gameState.isLoading || !canEditBoard(gameState.status)) return;
    setGameState((prev) => ({ ...prev, notesMode: !prev.notesMode }));
  };

  const undo = () => {
    setGameState((prev) => {
      if (prev.history.length <= 1) return prev;
      const newHistory = prev.history.slice(0, -1);
      const previousSnapshot = newHistory[newHistory.length - 1];
      return {
        ...prev,
        board: cloneBoard(previousSnapshot.board),
        mistakes: previousSnapshot.mistakes,
        history: newHistory,
      };
    });
  };

  const resetPuzzle = () => {
    setGameState((prev) => {
      if (prev.history.length === 0) return prev;
      const initialSnapshot = prev.history[0];
      return {
        ...prev,
        board: cloneBoard(initialSnapshot.board),
        history: [createBoardSnapshot(initialSnapshot.board, 0)],
        mistakes: 0,
        timer: 0,
        status: 'playing',
        selectedCell: null,
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
