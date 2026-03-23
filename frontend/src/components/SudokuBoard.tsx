import React, { useEffect } from 'react';
import { canEditBoard } from '../lib/gameStatus';
import { formatScore } from '../lib/score';
import { GameState } from '../types';
import { SudokuCell } from './SudokuCell';

interface SudokuBoardProps {
  gameState: GameState;
  onSelectCell: (row: number, col: number) => void;
  onMoveSelection: (dRow: number, dCol: number) => void;
  onSetValue: (val: number) => void;
}

export const SudokuBoard: React.FC<SudokuBoardProps> = ({
  gameState,
  onSelectCell,
  onMoveSelection,
  onSetValue,
}) => {
  const { board, selectedCell, status } = gameState;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!canEditBoard(status)) return;

      if (e.key >= '1' && e.key <= '9') {
        onSetValue(parseInt(e.key, 10));
      } else if (e.key === 'Backspace' || e.key === 'Delete' || e.key === '0') {
        onSetValue(0);
      } else if (e.key === 'ArrowUp') {
        onMoveSelection(-1, 0);
      } else if (e.key === 'ArrowDown') {
        onMoveSelection(1, 0);
      } else if (e.key === 'ArrowLeft') {
        onMoveSelection(0, -1);
      } else if (e.key === 'ArrowRight') {
        onMoveSelection(0, 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [status, onSetValue, onMoveSelection]);

  if (board.length === 0) return null;

  const selectedValue = selectedCell ? board[selectedCell.row][selectedCell.col].value : 0;

  return (
    <div className="relative w-full max-w-md mx-auto aspect-square">
      <div className="grid grid-cols-9 grid-rows-9 w-full h-full border-2 border-slate-800 bg-slate-800 gap-px">
        {board.map((row, r) =>
          row.map((cell, c) => {
            const isSelected = selectedCell?.row === r && selectedCell?.col === c;
            const isHighlighted =
              selectedCell !== null &&
              !isSelected &&
              (selectedCell.row === r ||
                selectedCell.col === c ||
                (Math.floor(selectedCell.row / 3) === Math.floor(r / 3) &&
                  Math.floor(selectedCell.col / 3) === Math.floor(c / 3)));
            const isMatchingValue = selectedValue !== 0 && cell.value === selectedValue;

            return (
              <SudokuCell
                key={`${r}-${c}`}
                cell={cell}
                isSelected={isSelected}
                isHighlighted={isHighlighted}
                isMatchingValue={isMatchingValue}
                onClick={() => onSelectCell(r, c)}
              />
            );
          })
        )}
      </div>
      {status === 'paused' && (
        <div className="absolute inset-0 bg-slate-100/90 backdrop-blur-sm flex items-center justify-center z-10">
          <span className="text-3xl font-bold text-slate-800">Paused</span>
        </div>
      )}
      {gameState.isLoading && board.length > 0 && (
        <div className="absolute inset-0 bg-slate-100/70 backdrop-blur-sm flex items-center justify-center z-10">
          <span className="text-lg font-semibold text-slate-800">Working...</span>
        </div>
      )}
      {status === 'completed' && (
        <div className="absolute inset-0 bg-emerald-100/90 backdrop-blur-sm flex items-center justify-center z-10">
          <div className="text-center">
            <span className="text-4xl font-bold text-emerald-600 block mb-2">Solved!</span>
            <span className="text-emerald-800 font-medium block">Final score: {formatScore(gameState.timer)}</span>
            <span className="text-emerald-700 text-sm">
              Best: {gameState.bestScores[gameState.difficulty] === null ? '--:--' : formatScore(gameState.bestScores[gameState.difficulty] as number)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
