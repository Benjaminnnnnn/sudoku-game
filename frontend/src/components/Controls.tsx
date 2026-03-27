import React from 'react';
import { Eraser, Pencil, Undo2, RotateCcw } from 'lucide-react';
import { cn } from '../lib/utils';
import { useSudokuGame } from './GameContext';

export const Controls: React.FC = () => {
  const { state, actions, meta } = useSudokuGame();
  const { notesMode } = state;
  const { controlsDisabled } = meta;
  const utilityButtonClass =
    'tool-button flex min-h-[4.5rem] flex-col items-center justify-center gap-1.5 px-2 py-3 text-center';

  return (
    <div className="flex w-full min-h-0 flex-col gap-5">
      <div className="grid grid-cols-2 gap-2.5">
        <button
          type="button"
          onClick={actions.undo}
          disabled={controlsDisabled}
          className={utilityButtonClass}
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[color:var(--accent-soft)] text-[color:var(--accent-strong)]">
            <Undo2 size={20} aria-hidden="true" />
          </div>
          <span className="text-[11px] font-semibold uppercase tracking-[0.14em] sm:text-xs">Undo</span>
        </button>
        <button
          type="button"
          onClick={() => {
            void actions.setCellValue(0);
          }}
          disabled={controlsDisabled}
          className={utilityButtonClass}
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[color:var(--accent-soft)] text-[color:var(--accent-strong)]">
            <Eraser size={20} aria-hidden="true" />
          </div>
          <span className="text-[11px] font-semibold uppercase tracking-[0.14em] sm:text-xs">Erase</span>
        </button>
        <button
          type="button"
          onClick={actions.toggleNotesMode}
          disabled={controlsDisabled}
          aria-pressed={notesMode}
          className={cn(
            utilityButtonClass,
            notesMode
              ? 'border-[color:var(--accent)] bg-[color:var(--accent)] text-white shadow-[0_14px_34px_rgba(160,92,45,0.22)]'
              : ''
          )}
        >
          <div className={cn(
            'flex h-9 w-9 items-center justify-center rounded-full transition-colors',
            notesMode ? 'bg-white/20 text-white' : 'bg-[color:var(--accent-soft)] text-[color:var(--accent-strong)]'
          )}>
            <Pencil size={20} aria-hidden="true" />
          </div>
          <span className="text-[11px] font-semibold uppercase tracking-[0.14em] sm:text-xs">Notes {notesMode ? 'On' : 'Off'}</span>
        </button>
        <button
          type="button"
          onClick={actions.resetPuzzle}
          disabled={controlsDisabled}
          className={utilityButtonClass}
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[color:var(--accent-soft)] text-[color:var(--accent-strong)]">
            <RotateCcw size={20} aria-hidden="true" />
          </div>
          <span className="text-[11px] font-semibold uppercase tracking-[0.14em] sm:text-xs">Reset</span>
        </button>
      </div>

      <div className="min-h-0">
        <div className="mb-2 flex items-center justify-between gap-3">
          <div className="text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-[color:var(--muted-ink)]">Digits</div>
          <div className="text-[0.7rem] uppercase tracking-[0.18em] text-[color:var(--muted-ink)]">Keyboard works too</div>
        </div>
        <div className="grid grid-cols-3 gap-2.5">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <button
              type="button"
              key={num}
              onClick={() => {
                void actions.setCellValue(num);
              }}
              disabled={controlsDisabled}
              aria-label={`Place ${num}`}
              className="digit-button aspect-square text-[1.55rem] font-semibold sm:text-[1.8rem]"
            >
              {num}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
