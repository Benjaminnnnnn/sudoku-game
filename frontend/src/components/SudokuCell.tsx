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
    'border-[color:var(--board-line)]',
    col % 3 === 2 && col !== 8 ? 'border-r-[3px] border-r-[color:var(--board-outer)]' : 'border-r',
    row % 3 === 2 && row !== 8 ? 'border-b-[3px] border-b-[color:var(--board-outer)]' : 'border-b',
    col === 0 ? 'border-l-[3px] border-l-[color:var(--board-outer)]' : '',
    row === 0 ? 'border-t-[3px] border-t-[color:var(--board-outer)]' : '',
    col === 8 ? 'border-r-[3px] border-r-[color:var(--board-outer)]' : '',
    row === 8 ? 'border-b-[3px] border-b-[color:var(--board-outer)]' : ''
  );

  const bgClasses = cn(
    'bg-[color:var(--cell-bg)] transition-[background-color,transform,box-shadow] duration-150',
    isSelected && 'bg-[color:var(--cell-selected)]',
    !isSelected && isHighlighted && 'bg-[color:var(--cell-highlight)]',
    !isSelected && isMatchingValue && value !== 0 && 'bg-[color:var(--cell-match)]',
    isError && 'bg-[color:var(--cell-error)]'
  );

  const textClasses = cn(
    'flex h-full w-full select-none items-center justify-center text-[clamp(1.1rem,2.7vw,1.85rem)] font-semibold transition-colors duration-150 sm:text-[clamp(1.35rem,2.6vw,2.15rem)]',
    isFixed ? 'text-[color:var(--page-ink)]' : 'text-[color:var(--accent-strong)]',
    isError && 'text-[color:var(--danger)]'
  );

  return (
    <button
      type="button"
      data-testid={`cell-${row}-${col}`}
      className={cn(
        'aspect-square cursor-pointer focus-visible:z-10 focus-visible:outline-none focus-visible:shadow-[inset_0_0_0_3px_color-mix(in_oklab,var(--accent)_58%,white)]',
        borderClasses,
        bgClasses
      )}
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
                className="flex items-center justify-center text-[9px] font-medium leading-none text-[color:var(--muted-ink)]/80 sm:text-[10px]"
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
