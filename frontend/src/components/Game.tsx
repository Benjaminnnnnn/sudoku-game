import React from 'react';
import { Header } from './Header';
import { SudokuBoard } from './SudokuBoard';
import { Controls } from './Controls';
import { SudokuGameProvider, useSudokuGame } from './GameContext';

const GameStatusBanner: React.FC = () => {
  const { state } = useSudokuGame();

  if (!state.errorMessage) {
    return null;
  }

  return (
    <div
      role="alert"
      aria-live="polite"
      className="rounded-2xl border border-rose-200 bg-rose-50/90 px-3 py-2 text-xs break-words text-rose-700 shadow-[0_10px_24px_rgba(220,38,38,0.08)] sm:px-4 sm:text-sm"
    >
      {state.errorMessage}
    </div>
  );
};

const GameControlsPanel: React.FC = () => {
  const { state } = useSudokuGame();

  return (
    <section
      aria-labelledby="controls-title"
      className="flex min-h-0 flex-col rounded-[1.75rem] border border-white/80 bg-[rgba(255,255,255,0.78)] p-3 shadow-[0_24px_60px_rgba(15,23,42,0.12)] backdrop-blur-sm sm:p-4"
    >
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <div className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
            Input Deck
          </div>
          <h2 id="controls-title" className="mt-1 font-display text-xl uppercase tracking-[0.08em] text-slate-900 sm:text-2xl">
            Controls
          </h2>
        </div>
        <div className="rounded-full border border-slate-200 bg-white px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-600 sm:text-[11px]">
          {state.notesMode ? 'Notes Mode' : 'Direct Entry'}
        </div>
      </div>

      <Controls />
    </section>
  );
};

const GameFrame: React.FC = () => {
  return (
    <>
      <a href="#main-content" className="skip-link">
        Skip to game
      </a>
      <main id="main-content" className="min-h-[100dvh] px-3 py-3 sm:px-4 sm:py-4 lg:px-6">
        <div className="mx-auto flex min-h-[calc(100dvh-1.5rem)] w-full max-w-7xl flex-col gap-3 sm:min-h-[calc(100dvh-2rem)] lg:min-h-[calc(100dvh-2.5rem)]">
          <section
            aria-labelledby="game-title"
            className="grid gap-3 rounded-[1.75rem] border border-white/75 bg-white/60 px-4 py-3 shadow-[0_20px_45px_rgba(15,23,42,0.08)] backdrop-blur sm:px-5 xl:grid-cols-[minmax(0,1fr)_auto] xl:items-center"
          >
            <div className="flex flex-col gap-2">
              <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/70 bg-white/75 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.28em] text-slate-600 shadow-[0_10px_30px_rgba(37,99,235,0.08)] backdrop-blur sm:text-[11px]">
                Logic Sprint
              </div>
              <div className="max-w-3xl">
                <h1 id="game-title" className="font-display text-3xl uppercase tracking-[0.08em] text-slate-900 sm:text-4xl lg:text-[2.6rem]">
                  Sudoku Control Deck
                </h1>
                <p className="mt-1 max-w-2xl text-sm text-slate-600 sm:text-[15px]">
                  Focus on the grid. The layout stays compact so the board, stats, and input tools remain in view.
                </p>
              </div>
            </div>
            <aside className="rounded-2xl border border-white/80 bg-white/70 px-4 py-3 text-xs font-medium text-slate-600 shadow-[0_12px_40px_rgba(15,23,42,0.08)] backdrop-blur">
              <div className="uppercase tracking-[0.22em] text-slate-500">Shortcuts</div>
              <div className="mt-1">Arrow keys move. Numbers place. Delete clears.</div>
            </aside>
          </section>

          <div className="flex flex-col gap-3">
            <Header />
            <GameStatusBanner />
          </div>

          <div className="grid min-h-0 flex-1 gap-3 md:grid-cols-[minmax(0,1fr)_17rem] xl:grid-cols-[minmax(0,1fr)_18.5rem]">
            <SudokuBoard />
            <GameControlsPanel />
          </div>
        </div>
      </main>
    </>
  );
};

export const Game: React.FC = () => {
  return (
    <SudokuGameProvider>
      <GameFrame />
    </SudokuGameProvider>
  );
};
