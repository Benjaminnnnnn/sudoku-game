import React from 'react';
import { Pause, Play } from 'lucide-react';
import { INVALID_MOVE_PENALTY_SECONDS } from '../lib/gameStatus';
import { formatScore } from '../lib/score';
import { Difficulty } from '../types';
import { SudokuBoard } from './SudokuBoard';
import { Controls } from './Controls';
import { SudokuGameProvider, useSudokuGame } from './GameContext';

const difficultyCopy: Record<Difficulty, string> = {
  easy: 'Easy',
  medium: 'Medium',
  hard: 'Hard',
};

const GameFrame: React.FC = () => {
  const { state, actions, meta } = useSudokuGame();
  const { difficulty, timer, mistakes, status, isLoading, notesMode, errorMessage } = state;
  const statusLabel = status === 'paused' ? 'Paused' : status === 'completed' ? 'Solved' : 'Playing';

  return (
    <>
      <a href="#main-content" className="skip-link">
        Skip to game
      </a>
      <main id="main-content" className="min-h-[100dvh] px-4 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
        <div className="mx-auto flex min-h-[calc(100dvh-2.5rem)] w-full max-w-6xl flex-col gap-4 sm:min-h-[calc(100dvh-3rem)]">
          <section
            aria-labelledby="game-title"
            className="surface-panel grid gap-4 overflow-hidden lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start"
          >
            <div className="space-y-4">
              <div className="inline-flex w-fit items-center rounded-full border border-[var(--line-strong)] bg-white/80 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.26em] text-[color:var(--muted-ink)]">
                Daily grid
              </div>
              <div className="max-w-2xl">
                <h1 id="game-title" className="font-display text-[clamp(2.5rem,6vw,4.75rem)] leading-[0.95] text-[color:var(--page-ink)]">
                  Sudoku for a quick reset.
                </h1>
                <p className="mt-3 max-w-xl text-sm leading-6 text-[color:var(--muted-ink)] sm:text-[0.98rem]">
                  Built for short web sessions: one clean board, fast controls, and just enough feedback to keep your pace.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="meta-pill">{statusLabel}</span>
                <span className="meta-pill">{formatScore(timer)}</span>
                <span className="meta-pill">
                  {mistakes} mistake{mistakes === 1 ? '' : 's'}
                </span>
                <span className="meta-pill">+{INVALID_MOVE_PENALTY_SECONDS}s per miss</span>
              </div>
            </div>

            <div className="flex flex-col gap-3 lg:pl-2">
              <label htmlFor="difficulty" className="sr-only">Difficulty</label>
              <select
                id="difficulty"
                name="difficulty"
                data-testid="difficulty-select"
                value={difficulty}
                onChange={(e) => {
                  void actions.startNewGame(e.target.value as Difficulty);
                }}
                disabled={isLoading}
                className="control-select"
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  data-testid="new-game-button"
                  onClick={() => {
                    void actions.startNewGame(difficulty);
                  }}
                  disabled={isLoading}
                  className="primary-action"
                >
                  {isLoading ? 'Loading…' : 'New board'}
                </button>
                <button
                  type="button"
                  data-testid="pause-toggle"
                  onClick={actions.togglePause}
                  disabled={isLoading || status === 'completed'}
                  className="secondary-action"
                  aria-label={status === 'paused' ? 'Resume game' : 'Pause game'}
                >
                  <span className="inline-flex items-center gap-2">
                    {status === 'paused' ? <Play size={16} aria-hidden="true" /> : <Pause size={16} aria-hidden="true" />}
                    {status === 'paused' ? 'Resume' : 'Pause'}
                  </span>
                </button>
              </div>
              <div className="rounded-[1.6rem] border border-[var(--line)] bg-white/72 px-4 py-3 text-sm text-[color:var(--muted-ink)]">
                <div className="flex items-center justify-between gap-3">
                  <span className="font-semibold text-[color:var(--page-ink)]">{difficultyCopy[difficulty]}</span>
                  <span className="text-xs uppercase tracking-[0.16em]">{notesMode ? 'Notes on' : 'Direct entry'}</span>
                </div>
                <div className="mt-2 text-xs uppercase tracking-[0.16em]">
                  Best {meta.bestScore === null ? '--' : formatScore(meta.bestScore)}
                </div>
              </div>
            </div>
          </section>

          {errorMessage ? (
            <div
              role="alert"
              aria-live="polite"
              className="rounded-[1.4rem] border border-[color:color-mix(in_oklab,var(--danger)_30%,white)] bg-[color:color-mix(in_oklab,var(--danger)_10%,white)] px-4 py-3 text-sm break-words text-[color:var(--danger)] shadow-[0_16px_40px_rgba(180,50,40,0.08)]"
            >
              {errorMessage}
            </div>
          ) : null}

          <div className="grid min-h-0 flex-1 gap-4 xl:grid-cols-[minmax(0,1fr)_18rem]">
            <SudokuBoard />
            <aside className="surface-panel flex min-h-0 flex-col gap-4">
              <div className="space-y-2">
                <div className="text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-[color:var(--muted-ink)]">
                  Input
                </div>
                <p className="text-sm leading-6 text-[color:var(--muted-ink)]">
                  Keep the rhythm. Tap digits, switch to notes when you need to test a line, and reset only when the board turns noisy.
                </p>
              </div>
              <Controls />
            </aside>
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
