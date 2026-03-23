import React from 'react';
import { Eraser, Pencil, Undo2, RotateCcw } from 'lucide-react';
import { cn } from '../lib/utils';
import { useSudokuGame } from './GameContext';

export const Controls: React.FC = () => {
  const { state, actions, meta } = useSudokuGame();
  const { notesMode } = state;
  const { controlsDisabled } = meta;
  const controlButtonClass =
    'flex min-h-[6.5rem] flex-col items-center justify-center gap-2 rounded-[1.35rem] border border-slate-200 bg-white text-slate-600 shadow-[0_10px_24px_rgba(15,23,42,0.06)] transition-[transform,border-color,color,background-color,opacity] duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:text-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:translate-y-0 disabled:opacity-50 disabled:hover:text-slate-600';

  return (
    <div className="flex w-full flex-col gap-5">
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={actions.undo}
          disabled={controlsDisabled}
          className={controlButtonClass}
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-100">
            <Undo2 size={24} aria-hidden="true" />
          </div>
          <span className="text-xs font-semibold uppercase tracking-[0.14em]">Undo</span>
        </button>
        <button
          type="button"
          onClick={() => {
            void actions.setCellValue(0);
          }}
          disabled={controlsDisabled}
          className={controlButtonClass}
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-100">
            <Eraser size={24} aria-hidden="true" />
          </div>
          <span className="text-xs font-semibold uppercase tracking-[0.14em]">Erase</span>
        </button>
        <button
          type="button"
          onClick={actions.toggleNotesMode}
          disabled={controlsDisabled}
          aria-pressed={notesMode}
          className={cn(
            'flex min-h-[6.5rem] flex-col items-center justify-center gap-2 rounded-[1.35rem] border shadow-[0_10px_24px_rgba(15,23,42,0.06)] transition-[transform,border-color,color,background-color,opacity] duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:opacity-50',
            notesMode
              ? 'border-blue-200 bg-blue-50 text-blue-700'
              : 'border-slate-200 bg-white text-slate-600 hover:-translate-y-0.5 hover:border-slate-300 hover:text-blue-700'
          )}
        >
          <div className={cn(
            'flex h-11 w-11 items-center justify-center rounded-full transition-colors',
            notesMode ? 'bg-blue-100' : 'bg-slate-100'
          )}>
            <Pencil size={24} aria-hidden="true" />
          </div>
          <span className="text-xs font-semibold uppercase tracking-[0.14em]">Notes {notesMode ? 'On' : 'Off'}</span>
        </button>
        <button
          type="button"
          onClick={actions.resetPuzzle}
          disabled={controlsDisabled}
          className={controlButtonClass}
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-100">
            <RotateCcw size={24} aria-hidden="true" />
          </div>
          <span className="text-xs font-semibold uppercase tracking-[0.14em]">Reset</span>
        </button>
      </div>

      <div>
        <div className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Number Pad</div>
        <div className="grid grid-cols-3 gap-3">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
          <button
            type="button"
            key={num}
            onClick={() => {
              void actions.setCellValue(num);
            }}
            disabled={controlsDisabled}
            aria-label={`Place ${num}`}
            className="aspect-square rounded-[1.25rem] border border-slate-200 bg-white text-3xl font-semibold text-slate-900 shadow-[0_10px_24px_rgba(15,23,42,0.06)] transition-[transform,border-color,color,background-color,opacity] duration-150 hover:-translate-y-0.5 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 active:bg-blue-100 disabled:translate-y-0 disabled:opacity-50"
          >
            {num}
          </button>
        ))}
        </div>
      </div>
    </div>
  );
};
