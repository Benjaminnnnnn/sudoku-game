import React from 'react';
import { useSudoku } from '../hooks/useSudoku';
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
      />
      
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
        disabled={gameState.status !== 'playing'}
      />
    </div>
  );
};
