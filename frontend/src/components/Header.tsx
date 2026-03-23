import React from 'react';
import { INVALID_MOVE_PENALTY_SECONDS } from '../lib/gameStatus';
import { formatScore } from '../lib/score';
import { Difficulty, GameStatus } from '../types';
import { Play, Pause } from 'lucide-react';

interface HeaderProps {
  difficulty: Difficulty;
  timer: number;
  mistakes: number;
  status: GameStatus;
  onNewGame: (difficulty: Difficulty) => void;
  onTogglePause: () => void;
  isLoading: boolean;
  bestScore: number | null;
}

export const Header: React.FC<HeaderProps> = ({
  difficulty,
  timer,
  mistakes,
  status,
  onNewGame,
  onTogglePause,
  isLoading,
  bestScore,
}) => {
  return (
    <div className="flex w-full flex-col gap-4">
      <div className="flex flex-col gap-3 rounded-[1.75rem] border border-white/80 bg-[rgba(255,255,255,0.78)] p-4 shadow-[0_24px_60px_rgba(15,23,42,0.12)] backdrop-blur-sm sm:p-5 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-md">
          <div className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Session</div>
          <div className="mt-2 font-display text-3xl uppercase tracking-[0.08em] text-slate-900">
            Pressure Grid
          </div>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Keep the streak clean, avoid penalties, and drive the board to a perfect finish.
          </p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <label htmlFor="difficulty" className="sr-only">Difficulty</label>
          <select
            id="difficulty"
            value={difficulty}
            onChange={(e) => onNewGame(e.target.value as Difficulty)}
            disabled={isLoading}
            className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold uppercase tracking-[0.12em] text-slate-700 shadow-[0_8px_24px_rgba(15,23,42,0.06)] transition-colors hover:border-slate-300 hover:bg-slate-50"
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
          <button
            onClick={() => onNewGame(difficulty)}
            disabled={isLoading}
            className="rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-white shadow-[0_16px_30px_rgba(15,23,42,0.18)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-slate-800 disabled:translate-y-0 disabled:opacity-60"
          >
            {isLoading ? 'Loading...' : 'New Game'}
          </button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-[1.2fr_1fr_0.9fr]">
        <div className="rounded-[1.5rem] border border-white/80 bg-[rgba(255,255,255,0.78)] px-4 py-4 shadow-[0_18px_45px_rgba(15,23,42,0.1)] backdrop-blur-sm">
          <div className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Score</div>
          <div className="mt-2 font-display text-4xl uppercase tracking-[0.08em] text-slate-900">{timer}</div>
          <div className="mt-2 text-xs font-medium uppercase tracking-[0.16em] text-slate-500">
            Best {bestScore === null ? '--' : bestScore}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-[1.5rem] border border-white/80 bg-[rgba(255,255,255,0.78)] px-4 py-4 shadow-[0_18px_45px_rgba(15,23,42,0.1)] backdrop-blur-sm">
            <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">Mistakes</div>
            <div className="mt-2 font-display text-3xl uppercase tracking-[0.06em] text-slate-900">{mistakes}</div>
          </div>
          <div className="rounded-[1.5rem] border border-white/80 bg-[rgba(255,255,255,0.78)] px-4 py-4 shadow-[0_18px_45px_rgba(15,23,42,0.1)] backdrop-blur-sm">
            <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">Penalty</div>
            <div className="mt-2 font-display text-3xl uppercase tracking-[0.06em] text-slate-900">
              +{INVALID_MOVE_PENALTY_SECONDS}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between rounded-[1.5rem] border border-white/80 bg-[rgba(255,255,255,0.78)] px-4 py-4 shadow-[0_18px_45px_rgba(15,23,42,0.1)] backdrop-blur-sm">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">Time</div>
            <div className="mt-2 font-mono text-2xl text-slate-900">{formatScore(timer)}</div>
          </div>
          <button
            onClick={onTogglePause}
            disabled={isLoading || status === 'completed'}
            className="rounded-full border border-slate-200 bg-white p-3 text-slate-500 shadow-[0_10px_24px_rgba(15,23,42,0.08)] transition-colors hover:border-slate-300 hover:bg-slate-50 hover:text-blue-700 disabled:opacity-50"
            aria-label={status === 'paused' ? 'Resume game' : 'Pause game'}
          >
            {status === 'paused' ? <Play size={18} /> : <Pause size={18} />}
          </button>
        </div>
      </div>
    </div>
  );
};
