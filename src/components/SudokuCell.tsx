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
    'border-slate-200',
    col % 3 === 2 && col !== 8 ? 'border-r-slate-800 border-r-2' : 'border-r',
    row % 3 === 2 && row !== 8 ? 'border-b-slate-800 border-b-2' : 'border-b',
    col === 0 ? 'border-l-slate-800 border-l-2' : '',
    row === 0 ? 'border-t-slate-800 border-t-2' : '',
    col === 8 ? 'border-r-slate-800 border-r-2' : '',
    row === 8 ? 'border-b-slate-800 border-b-2' : ''
  );

  const bgClasses = cn(
    'bg-white transition-colors duration-150',
    isSelected && 'bg-indigo-200',
    !isSelected && isHighlighted && 'bg-indigo-50',
    !isSelected && isMatchingValue && value !== 0 && 'bg-indigo-100',
    isError && 'bg-red-100'
  );

  const textClasses = cn(
    'text-2xl sm:text-3xl font-medium flex items-center justify-center h-full w-full cursor-pointer select-none',
    isFixed ? 'text-slate-800' : 'text-indigo-600',
    isError && 'text-red-600'
  );

  return (
    <div
      className={cn('aspect-square', borderClasses, bgClasses)}
      onClick={onClick}
    >
      <div className={textClasses}>
        {value !== 0 ? (
          value
        ) : (
          <div className="grid grid-cols-3 grid-rows-3 w-full h-full p-0.5">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
              <div
                key={n}
                className="flex items-center justify-center text-[10px] sm:text-xs text-slate-400 font-normal leading-none"
              >
                {notes.has(n) ? n : ''}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
