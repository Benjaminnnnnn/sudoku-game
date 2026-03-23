import React from 'react';
import { INVALID_MOVE_PENALTY_SECONDS } from '../lib/gameStatus';
import { formatScore } from '../lib/score';
import { Difficulty } from '../types';
import { Play, Pause } from 'lucide-react';
import { useSudokuGame } from './GameContext';

export const Header: React.FC = () => {
  const { state, actions, meta } = useSudokuGame();
  const { difficulty, timer, mistakes, status, isLoading } = state;
  const statusLabel = status === 'paused' ? 'Paused' : status === 'completed' ? 'Solved' : 'Active';

  return (
    <div className="rounded-[1.75rem] border border-white/80 bg-[rgba(255,255,255,0.78)] p-3 shadow-[0_24px_60px_rgba(15,23,42,0.12)] backdrop-blur-sm sm:p-4">
      <div className="flex flex-col gap-3 xl:flex-row xl:items-start xl:justify-between">
        <div className="flex flex-wrap items-center gap-3">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Session</div>
            <div className="mt-1 font-display text-2xl uppercase tracking-[0.08em] text-slate-900 sm:text-[1.7rem]">
              Pressure Grid
            </div>
          </div>
          <div className="flex flex-wrap gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] sm:text-[11px]">
            <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-slate-600">
              {statusLabel}
            </span>
            <span className="rounded-full border border-orange-200 bg-orange-50 px-3 py-1 text-orange-700">
              +{INVALID_MOVE_PENALTY_SECONDS}s per miss
            </span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 sm:items-center sm:justify-end">
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
            className="rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold uppercase tracking-[0.12em] text-slate-700 shadow-[0_8px_24px_rgba(15,23,42,0.06)] transition-colors hover:border-slate-300 hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
          <button
            type="button"
            data-testid="new-game-button"
            onClick={() => {
              void actions.startNewGame(difficulty);
            }}
            disabled={isLoading}
            className="rounded-2xl bg-slate-900 px-5 py-2.5 text-sm font-semibold uppercase tracking-[0.14em] text-white shadow-[0_16px_30px_rgba(15,23,42,0.18)] transition-[transform,background-color,opacity] duration-200 hover:-translate-y-0.5 hover:bg-slate-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 disabled:translate-y-0 disabled:opacity-60"
          >
            {isLoading ? 'Loading…' : 'New Game'}
          </button>
          <button
            type="button"
            data-testid="pause-toggle"
            onClick={actions.togglePause}
            disabled={isLoading || status === 'completed'}
            className="rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold uppercase tracking-[0.14em] text-slate-600 shadow-[0_10px_24px_rgba(15,23,42,0.08)] transition-colors hover:border-slate-300 hover:bg-slate-50 hover:text-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:opacity-50"
            aria-label={status === 'paused' ? 'Resume game' : 'Pause game'}
          >
            <span className="inline-flex items-center gap-2">
              {status === 'paused' ? <Play size={16} aria-hidden="true" /> : <Pause size={16} aria-hidden="true" />}
              {status === 'paused' ? 'Resume' : 'Pause'}
            </span>
          </button>
        </div>
      </div>

      <div className="mt-3 grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-[1.35rem] border border-white/80 bg-[rgba(255,255,255,0.88)] px-4 py-3 shadow-[0_18px_45px_rgba(15,23,42,0.1)] backdrop-blur-sm">
          <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-500 sm:text-[11px]">Score</div>
          <div data-testid="score-value" className="mt-1 font-display text-3xl uppercase tracking-[0.06em] tabular-nums text-slate-900 sm:text-[2rem]">{timer}</div>
          <div className="mt-1 text-[10px] font-medium uppercase tracking-[0.16em] text-slate-500 sm:text-xs">
            Best {meta.bestScore === null ? '--' : meta.bestScore}
          </div>
        </div>

        <div className="rounded-[1.35rem] border border-white/80 bg-[rgba(255,255,255,0.88)] px-4 py-3 shadow-[0_18px_45px_rgba(15,23,42,0.1)] backdrop-blur-sm">
          <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-500 sm:text-[11px]">Time</div>
          <div className="mt-1 font-mono text-2xl tabular-nums text-slate-900 sm:text-[1.7rem]">{formatScore(timer)}</div>
          <div className="mt-1 text-[10px] font-medium uppercase tracking-[0.16em] text-slate-500 sm:text-xs">
            Session clock
          </div>
        </div>

        <div className="rounded-[1.35rem] border border-white/80 bg-[rgba(255,255,255,0.88)] px-4 py-3 shadow-[0_18px_45px_rgba(15,23,42,0.1)] backdrop-blur-sm">
          <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-500 sm:text-[11px]">Mistakes</div>
          <div data-testid="mistakes-value" className="mt-1 font-display text-3xl uppercase tracking-[0.06em] tabular-nums text-slate-900 sm:text-[2rem]">{mistakes}</div>
          <div className="mt-1 text-[10px] font-medium uppercase tracking-[0.16em] text-slate-500 sm:text-xs">
            Penalty +{INVALID_MOVE_PENALTY_SECONDS}s each
          </div>
        </div>

        <div className="flex items-center justify-between gap-4 rounded-[1.35rem] border border-white/80 bg-[rgba(255,255,255,0.88)] px-4 py-3 shadow-[0_18px_45px_rgba(15,23,42,0.1)] backdrop-blur-sm">
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-500 sm:text-[11px]">Difficulty</div>
            <div className="mt-1 font-display text-2xl uppercase tracking-[0.06em] text-slate-900 sm:text-[1.7rem]">{difficulty}</div>
            <div className="mt-1 text-[10px] font-medium uppercase tracking-[0.16em] text-slate-500 sm:text-xs">
              {meta.bestScore === null ? 'No record yet' : `Best ${meta.bestScore}`}
            </div>
          </div>
          <div className="rounded-full border border-slate-200 bg-white px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-600 sm:text-[11px]">
            {statusLabel}
          </div>
        </div>
      </div>
    </div>
  );
};
