import React from 'react';
import { CellState } from '../types';
import { cn } from '../lib/utils';

interface SudokuCellProps {
  cell: CellState;
  isSelected: boolean;
  isHighlighted: boolean; // Same row/col/box
  isMatchingValue: boolean; // Same value as selected
  onClick: () => void;
}

export const SudokuCell: React.FC<SudokuCellProps> = ({
  cell,
  isSelected,
  isHighlighted,
  isMatchingValue,
  onClick,
}) => {
  const { value, isFixed, isError, notes, row, col } = cell;

  const borderClasses = cn(
    'border-[#c7d6f5]',
    col % 3 === 2 && col !== 8 ? 'border-r-slate-900 border-r-[3px]' : 'border-r',
    row % 3 === 2 && row !== 8 ? 'border-b-slate-900 border-b-[3px]' : 'border-b',
    col === 0 ? 'border-l-slate-900 border-l-[3px]' : '',
    row === 0 ? 'border-t-slate-900 border-t-[3px]' : '',
    col === 8 ? 'border-r-slate-900 border-r-[3px]' : '',
    row === 8 ? 'border-b-slate-900 border-b-[3px]' : ''
  );

  const bgClasses = cn(
    'bg-white transition-colors duration-150',
    isSelected && 'bg-[#8fb5ff]',
    !isSelected && isHighlighted && 'bg-[#edf3ff]',
    !isSelected && isMatchingValue && value !== 0 && 'bg-[#dce8ff]',
    isError && 'bg-[#ffe0e0]'
  );

  const textClasses = cn(
    'text-2xl sm:text-3xl font-semibold flex items-center justify-center h-full w-full select-none transition-colors duration-150',
    isFixed ? 'text-slate-900' : 'text-blue-700',
    isError && 'text-red-600'
  );

  return (
    <button
      type="button"
      className={cn('aspect-square cursor-pointer focus:outline-none focus-visible:z-10 focus-visible:shadow-[inset_0_0_0_3px_rgba(15,23,42,0.55)]', borderClasses, bgClasses)}
      onClick={onClick}
      aria-label={`Row ${row + 1} Column ${col + 1}${value !== 0 ? ` Value ${value}` : ' Empty'}`}
    >
      <div className={textClasses}>
        {value !== 0 ? (
          value
        ) : (
          <div className="grid h-full w-full grid-cols-3 grid-rows-3 p-1">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
              <div
                key={n}
                className="flex items-center justify-center text-[10px] font-medium leading-none text-slate-400 sm:text-xs"
              >
                {notes.has(n) ? n : ''}
              </div>
            ))}
          </div>
        )}
      </div>
    </button>
  );
};
