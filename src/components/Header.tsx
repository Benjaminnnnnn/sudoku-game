import React from 'react';
import { MAX_MISTAKES } from '../lib/gameStatus';
import { Difficulty, GameStatus } from '../types';
import { Play, Pause } from 'lucide-react';

interface HeaderProps {
  difficulty: Difficulty;
  timer: number;
  mistakes: number;
  status: GameStatus;
  onNewGame: (difficulty: Difficulty) => void;
  onTogglePause: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  difficulty,
  timer,
  mistakes,
  status,
  onNewGame,
  onTogglePause,
}) => {
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full max-w-md mx-auto mb-6 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Sudoku</h1>
        <div className="flex items-center gap-2">
          <select
            value={difficulty}
            onChange={(e) => onNewGame(e.target.value as Difficulty)}
            className="bg-slate-100 text-slate-700 text-sm font-medium py-1.5 px-3 rounded-md border-none outline-none cursor-pointer hover:bg-slate-200 transition-colors"
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
          <button
            onClick={() => onNewGame(difficulty)}
            className="bg-indigo-600 text-white text-sm font-medium py-1.5 px-4 rounded-md hover:bg-indigo-700 transition-colors"
          >
            New Game
          </button>
        </div>
      </div>
      
      <div className="flex items-center justify-between text-slate-600 text-sm font-medium">
        <div className="flex items-center gap-4">
          <span>Mistakes: {mistakes}/{MAX_MISTAKES}</span>
          <span>{difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-mono text-base">{formatTime(timer)}</span>
          <button
            onClick={onTogglePause}
            disabled={status === 'completed' || status === 'lost'}
            className="p-1.5 rounded-full hover:bg-slate-100 text-slate-500 hover:text-indigo-600 transition-colors disabled:opacity-50"
          >
            {status === 'paused' ? <Play size={18} /> : <Pause size={18} />}
          </button>
        </div>
      </div>
    </div>
  );
};
