import React from 'react';
import { Eraser, Pencil, Undo2, RotateCcw } from 'lucide-react';
import { cn } from '../lib/utils';

interface ControlsProps {
  notesMode: boolean;
  onToggleNotes: () => void;
  onSetValue: (val: number) => void;
  onUndo: () => void;
  onReset: () => void;
  disabled: boolean;
}

export const Controls: React.FC<ControlsProps> = ({
  notesMode,
  onToggleNotes,
  onSetValue,
  onUndo,
  onReset,
  disabled,
}) => {
  return (
    <div className="w-full max-w-md mx-auto mt-6 flex flex-col gap-4">
      <div className="flex justify-between px-2">
        <button
          onClick={onUndo}
          disabled={disabled}
          className="flex flex-col items-center gap-1 text-slate-600 hover:text-indigo-600 disabled:opacity-50 disabled:hover:text-slate-600 transition-colors"
        >
          <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center">
            <Undo2 size={24} />
          </div>
          <span className="text-xs font-medium">Undo</span>
        </button>
        <button
          onClick={() => onSetValue(0)}
          disabled={disabled}
          className="flex flex-col items-center gap-1 text-slate-600 hover:text-indigo-600 disabled:opacity-50 disabled:hover:text-slate-600 transition-colors"
        >
          <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center">
            <Eraser size={24} />
          </div>
          <span className="text-xs font-medium">Erase</span>
        </button>
        <button
          onClick={onToggleNotes}
          disabled={disabled}
          className={cn(
            "flex flex-col items-center gap-1 transition-colors disabled:opacity-50",
            notesMode ? "text-indigo-600" : "text-slate-600 hover:text-indigo-600"
          )}
        >
          <div className={cn(
            "w-12 h-12 rounded-full flex items-center justify-center transition-colors",
            notesMode ? "bg-indigo-100" : "bg-slate-100"
          )}>
            <Pencil size={24} />
          </div>
          <span className="text-xs font-medium">Notes {notesMode ? 'On' : 'Off'}</span>
        </button>
        <button
          onClick={onReset}
          disabled={disabled}
          className="flex flex-col items-center gap-1 text-slate-600 hover:text-indigo-600 disabled:opacity-50 disabled:hover:text-slate-600 transition-colors"
        >
          <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center">
            <RotateCcw size={24} />
          </div>
          <span className="text-xs font-medium">Reset</span>
        </button>
      </div>

      <div className="grid grid-cols-9 gap-1 sm:gap-2">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
          <button
            key={num}
            onClick={() => onSetValue(num)}
            disabled={disabled}
            className="aspect-square rounded-lg bg-slate-100 text-slate-800 text-2xl font-medium hover:bg-indigo-100 hover:text-indigo-700 active:bg-indigo-200 transition-colors disabled:opacity-50"
          >
            {num}
          </button>
        ))}
      </div>
    </div>
  );
};
