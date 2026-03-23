import React from 'react';
import { useSudoku } from '../hooks/useSudoku';
import { canEditBoard } from '../lib/gameStatus';
import { Header } from './Header';
import { SudokuBoard } from './SudokuBoard';
import { Controls } from './Controls';

export const Game: React.FC = () => {
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

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center py-8 px-4 sm:px-6">
      <Header
        difficulty={gameState.difficulty}
        timer={gameState.timer}
        mistakes={gameState.mistakes}
        status={gameState.status}
        onNewGame={startNewGame}
        onTogglePause={togglePause}
        isLoading={gameState.isLoading}
        bestScore={gameState.bestScores[gameState.difficulty]}
      />

      {gameState.errorMessage ? (
        <div className="w-full max-w-md mx-auto mb-4 rounded-md border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {gameState.errorMessage}
        </div>
      ) : null}
      
      <SudokuBoard
        gameState={gameState}
        onSelectCell={selectCell}
        onMoveSelection={moveSelection}
        onSetValue={setCellValue}
      />
      
      <Controls
        notesMode={gameState.notesMode}
        onToggleNotes={toggleNotesMode}
        onSetValue={setCellValue}
        onUndo={undo}
        onReset={resetPuzzle}
        disabled={gameState.isLoading || gameState.board.length === 0 || !canEditBoard(gameState.status)}
      />
    </div>
  );
};
