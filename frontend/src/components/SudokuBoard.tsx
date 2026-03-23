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
      const target = e.target as HTMLElement | null;
      if (target && ['BUTTON', 'INPUT', 'SELECT', 'TEXTAREA'].includes(target.tagName)) {
        return;
      }

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
    <section aria-labelledby="board-title" className="rounded-[2rem] border border-white/80 bg-[rgba(255,255,255,0.78)] p-4 shadow-[0_24px_60px_rgba(15,23,42,0.12)] backdrop-blur-sm sm:p-5">
      <div className="mb-4 flex items-center justify-between gap-4">
        <div>
          <div className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Grid</div>
          <h2 id="board-title" className="mt-1 font-display text-2xl uppercase tracking-[0.08em] text-slate-900">Board Matrix</h2>
        </div>
        <div className="rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-600">
          {status === 'paused' ? 'Paused' : status === 'completed' ? 'Solved' : 'Active'}
        </div>
      </div>

      <div className="relative mx-auto aspect-square w-full max-w-[42rem] overflow-hidden rounded-[1.6rem] border border-[#b9caef] bg-[#d7e5ff] p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.75)] sm:p-4">
        <div
          role="group"
          aria-label="Sudoku board"
          className="grid h-full w-full grid-cols-9 grid-rows-9 overflow-hidden rounded-[1rem] border-2 border-slate-900 bg-slate-900"
        >
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
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/70 backdrop-blur-sm">
            <span className="font-display text-4xl uppercase tracking-[0.08em] text-slate-900">Paused</span>
          </div>
        )}
        {gameState.isLoading && board.length > 0 && (
          <div
            role="status"
            aria-live="polite"
            className="absolute inset-0 z-10 flex items-center justify-center bg-white/60 backdrop-blur-sm"
          >
            <span className="rounded-full border border-slate-200 bg-white px-5 py-2 text-sm font-semibold uppercase tracking-[0.18em] text-slate-700 shadow-[0_12px_24px_rgba(15,23,42,0.08)]">
              Working…
            </span>
          </div>
        )}
        {status === 'completed' && (
          <div
            role="status"
            aria-live="polite"
            className="absolute inset-0 z-10 flex items-center justify-center bg-emerald-100/75 backdrop-blur-sm"
          >
            <div className="rounded-[1.6rem] border border-emerald-200 bg-white/90 px-8 py-7 text-center shadow-[0_24px_60px_rgba(15,118,110,0.15)]">
              <span className="mb-2 block font-display text-4xl uppercase tracking-[0.08em] text-emerald-700">Solved!</span>
              <span className="block text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">Time</span>
              <span className="block font-mono text-xl tabular-nums text-emerald-950">{formatScore(gameState.timer)}</span>
              <span className="mt-3 block text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">Final Score</span>
              <span className="block font-display text-3xl uppercase tracking-[0.06em] tabular-nums text-emerald-900">{gameState.timer}</span>
              <span className="mt-2 block text-xs font-medium uppercase tracking-[0.16em] text-emerald-700">
                Best {gameState.bestScores[gameState.difficulty] === null ? '--' : gameState.bestScores[gameState.difficulty]}
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-medium uppercase tracking-[0.14em] text-slate-500">
        <span>Row, column, and box highlights follow your selection</span>
        {selectedValue !== 0 ? (
          <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-slate-700">
            Tracking {selectedValue}
          </span>
        ) : null}
      </div>
    </section>
  );
};
