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
    <div className="w-full max-w-md mx-auto mb-6 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Sudoku</h1>
        <div className="flex items-center gap-2">
          <select
            value={difficulty}
            onChange={(e) => onNewGame(e.target.value as Difficulty)}
            disabled={isLoading}
            className="bg-slate-100 text-slate-700 text-sm font-medium py-1.5 px-3 rounded-md border-none outline-none cursor-pointer hover:bg-slate-200 transition-colors"
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
          <button
            onClick={() => onNewGame(difficulty)}
            disabled={isLoading}
            className="bg-indigo-600 text-white text-sm font-medium py-1.5 px-4 rounded-md hover:bg-indigo-700 transition-colors"
          >
            {isLoading ? 'Loading...' : 'New Game'}
          </button>
        </div>
      </div>
      
      <div className="flex items-center justify-between text-slate-600 text-sm font-medium">
        <div className="flex items-center gap-4">
          <span>Mistakes: {mistakes}</span>
          <span>Penalty: +{INVALID_MOVE_PENALTY_SECONDS}s</span>
          <span>{difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-right">
            <div className="font-mono text-base text-slate-800">Score {formatScore(timer)}</div>
            <div className="text-xs text-slate-500">
              Best {bestScore === null ? '--:--' : formatScore(bestScore)}
            </div>
          </div>
          <button
            onClick={onTogglePause}
            disabled={isLoading || status === 'completed'}
            className="p-1.5 rounded-full hover:bg-slate-100 text-slate-500 hover:text-indigo-600 transition-colors disabled:opacity-50"
          >
            {status === 'paused' ? <Play size={18} /> : <Pause size={18} />}
          </button>
        </div>
      </div>
    </div>
  );
};
