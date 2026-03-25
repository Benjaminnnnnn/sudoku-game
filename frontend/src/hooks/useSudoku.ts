import { useCallback, useEffect, useState } from 'react';
import type { CheckBoardResponse } from '../../../shared/types';
import { checkBoard, createGame, validateMove } from '../lib/api';
import {
  applyAsyncError,
  applyMovePreview,
  applyNewGame,
  applyNotesValue,
  beginMoveValidation,
  clearCellValue,
  createInitialGameState,
  createMoveErrorMessage,
  createMovePreview,
  createStartGameErrorMessage,
  finishLoading,
  getEditableSelection,
  hasEmptyCells,
  moveSelection as moveSelectionInState,
  resetPuzzle as resetPuzzleInState,
  selectCell as selectCellInState,
  startGameLoading,
  tickTimer,
  toNumberBoard,
  toggleNotesMode as toggleNotesModeInState,
  togglePause as togglePauseInState,
  undoMove,
} from '../lib/gameState';
import { loadBestScores, saveBestScores } from '../lib/score';
import { Difficulty, GameState } from '../types';

export function useSudoku() {
  const [gameState, setGameState] = useState<GameState>(() => createInitialGameState(loadBestScores()));

  const startNewGame = useCallback(async (difficulty: Difficulty = gameState.difficulty) => {
    setGameState((prev) => startGameLoading(prev, difficulty));

    try {
      const response = await createGame({ difficulty });

      setGameState((prev) => applyNewGame(prev, difficulty, response));
    } catch (error) {
      setGameState((prev) => applyAsyncError(prev, createStartGameErrorMessage(error)));
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
    if (gameState.status !== 'playing') {
      return;
    }

    const interval = window.setInterval(() => {
      setGameState((prev) => tickTimer(prev));
    }, 1000);

    return () => window.clearInterval(interval);
  }, [gameState.status]);

  const selectCell = useCallback((row: number, col: number) => {
    setGameState((prev) => selectCellInState(prev, row, col));
  }, []);

  const moveSelection = useCallback((dRow: number, dCol: number) => {
    setGameState((prev) => moveSelectionInState(prev, dRow, dCol));
  }, []);

  const setCellValue = useCallback(async (value: number) => {
    const selection = getEditableSelection(gameState);
    if (!selection || !gameState.gameToken) {
      return;
    }

    const { row, col } = selection;

    if (gameState.notesMode) {
      setGameState((prev) => applyNotesValue(prev, row, col, value));
      return;
    }

    if (value === 0) {
      setGameState((prev) => clearCellValue(prev, row, col));
      return;
    }

    setGameState((prev) => beginMoveValidation(prev));

    try {
      const moveResult = await validateMove({
        gameToken: gameState.gameToken,
        row,
        col,
        value,
      });

      if (moveResult.isFixedCell) {
        setGameState((prev) => finishLoading(prev));
        return;
      }

      const movePreview = createMovePreview(gameState, row, col, value, moveResult);
      let checkResult: CheckBoardResponse | undefined;

      if (moveResult.valid && !hasEmptyCells(movePreview.board)) {
        checkResult = await checkBoard({
          gameToken: gameState.gameToken,
          board: toNumberBoard(movePreview.board),
        });
      }

      const nextState = applyMovePreview(gameState, movePreview, checkResult);
      if (nextState.bestScores !== gameState.bestScores) {
        saveBestScores(nextState.bestScores);
      }

      setGameState(nextState);
    } catch (error) {
      setGameState((prev) => applyAsyncError(prev, createMoveErrorMessage(error)));
    }
  }, [gameState]);

  const toggleNotesMode = useCallback(() => {
    setGameState((prev) => toggleNotesModeInState(prev));
  }, []);

  const undo = useCallback(() => {
    setGameState((prev) => undoMove(prev));
  }, []);

  const resetPuzzle = useCallback(() => {
    setGameState((prev) => resetPuzzleInState(prev));
  }, []);

  const togglePause = useCallback(() => {
    setGameState((prev) => togglePauseInState(prev));
  }, []);

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
