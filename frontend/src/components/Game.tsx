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
      className="rounded-2xl border border-rose-200 bg-rose-50/90 px-4 py-3 text-sm break-words text-rose-700 shadow-[0_10px_24px_rgba(220,38,38,0.08)]"
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
      className="rounded-[1.75rem] border border-white/80 bg-[rgba(255,255,255,0.78)] p-4 shadow-[0_24px_60px_rgba(15,23,42,0.12)] backdrop-blur-sm sm:p-5"
    >
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <div className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
            Input Deck
          </div>
          <h2 id="controls-title" className="mt-1 font-display text-2xl uppercase tracking-[0.08em] text-slate-900">
            Play Board
          </h2>
        </div>
        <div className="rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-600">
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
      <main id="main-content" className="min-h-screen px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
          <section aria-labelledby="game-title" className="flex flex-col gap-3">
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/70 bg-white/70 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-600 shadow-[0_10px_30px_rgba(37,99,235,0.08)] backdrop-blur">
              Logic Sprint
            </div>
            <div className="flex flex-col gap-2 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-2xl">
                <h1 id="game-title" className="font-display text-4xl uppercase tracking-[0.08em] text-slate-900 sm:text-5xl">
                  Sudoku Control Deck
                </h1>
              </div>
              <aside className="rounded-2xl border border-white/80 bg-white/70 px-4 py-3 text-xs font-medium text-slate-600 shadow-[0_12px_40px_rgba(15,23,42,0.08)] backdrop-blur">
                <div className="uppercase tracking-[0.22em] text-slate-500">Shortcuts</div>
                <div className="mt-1">Arrow keys move. Numbers place. Delete clears.</div>
              </aside>
            </div>
          </section>

          <Header />
          <GameStatusBanner />

          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start">
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
