import { ReactNode, createContext, use } from 'react';
import { canEditBoard } from '../lib/gameStatus';
import { useSudoku } from '../hooks/useSudoku';
import { Difficulty, GameState } from '../types';

interface SudokuGameActions {
  startNewGame: (difficulty?: Difficulty) => Promise<void>;
  selectCell: (row: number, col: number) => void;
  moveSelection: (dRow: number, dCol: number) => void;
  setCellValue: (value: number) => Promise<void>;
  toggleNotesMode: () => void;
  undo: () => void;
  resetPuzzle: () => void;
  togglePause: () => void;
}

interface SudokuGameMeta {
  canEdit: boolean;
  controlsDisabled: boolean;
  bestScore: number | null;
}

interface SudokuGameContextValue {
  state: GameState;
  actions: SudokuGameActions;
  meta: SudokuGameMeta;
}

const SudokuGameContext = createContext<SudokuGameContextValue | null>(null);

export function SudokuGameProvider({ children }: { children: ReactNode }) {
  const {
    gameState,
    startNewGame,
    selectCell,
    moveSelection,
    setCellValue,
    toggleNotesMode,
    undo,
    resetPuzzle,
    togglePause,
  } = useSudoku();

  const contextValue: SudokuGameContextValue = {
    state: gameState,
    actions: {
      startNewGame,
      selectCell,
      moveSelection,
      setCellValue,
      toggleNotesMode,
      undo,
      resetPuzzle,
      togglePause,
    },
    meta: {
      canEdit: canEditBoard(gameState.status),
      controlsDisabled: gameState.isLoading || gameState.board.length === 0 || !canEditBoard(gameState.status),
      bestScore: gameState.bestScores[gameState.difficulty],
    },
  };

  return <SudokuGameContext value={contextValue}>{children}</SudokuGameContext>;
}

export function useSudokuGame() {
  const context = use(SudokuGameContext);

  if (context === null) {
    throw new Error('useSudokuGame must be used inside SudokuGameProvider.');
  }

  return context;
}
