import React, { useEffect } from 'react';
import { canEditBoard } from '../lib/gameStatus';
import { formatScore } from '../lib/score';
import { SudokuCell } from './SudokuCell';
import { useSudokuGame } from './GameContext';

export const SudokuBoard: React.FC = () => {
  const { state: gameState, actions } = useSudokuGame();
  const { board, selectedCell, status } = gameState;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!canEditBoard(status)) return;
      const target = e.target as HTMLElement | null;
      if (target && ['BUTTON', 'INPUT', 'SELECT', 'TEXTAREA'].includes(target.tagName)) {
        return;
      }

      if (e.key >= '1' && e.key <= '9') {
        void actions.setCellValue(parseInt(e.key, 10));
      } else if (e.key === 'Backspace' || e.key === 'Delete' || e.key === '0') {
        void actions.setCellValue(0);
      } else if (e.key === 'ArrowUp') {
        actions.moveSelection(-1, 0);
      } else if (e.key === 'ArrowDown') {
        actions.moveSelection(1, 0);
      } else if (e.key === 'ArrowLeft') {
        actions.moveSelection(0, -1);
      } else if (e.key === 'ArrowRight') {
        actions.moveSelection(0, 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [actions, status]);

  if (board.length === 0) return null;

  const selectedValue = selectedCell ? board[selectedCell.row][selectedCell.col].value : 0;
  const statusLabel = status === 'paused' ? 'Paused' : status === 'completed' ? 'Solved' : 'Live';

  return (
    <section aria-label="Sudoku board area" className="surface-panel flex min-h-0 flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap gap-2">
          <span className="meta-pill" data-testid="board-status">{statusLabel}</span>
          {selectedValue !== 0 ? <span className="meta-pill">Tracking {selectedValue}</span> : null}
        </div>
        <div className="text-[0.72rem] uppercase tracking-[0.18em] text-[color:var(--muted-ink)]">
          Row, column, and box stay highlighted
        </div>
      </div>

      <div className="flex min-h-0 flex-1 items-center justify-center">
        <div className="board-shell relative mx-auto aspect-square w-full max-w-[min(39rem,calc(100vw-2.5rem),calc(100dvh-18rem))] overflow-hidden sm:max-w-[min(40rem,calc(100vw-4rem),calc(100dvh-17rem))] xl:max-w-[min(40rem,calc(100vw-25rem),calc(100dvh-13rem))]">
          <div
            role="group"
            aria-label="Sudoku board"
            className="grid h-full w-full grid-cols-9 grid-rows-9 overflow-hidden rounded-[1.45rem] border-[3px] border-[color:var(--board-outer)] bg-[color:var(--board-outer)]"
          >
            {board.map((row, r) =>
              row.map((cell, c) => {
                const isSelected = selectedCell?.row === r && selectedCell?.col === c;
                const isHighlighted =
                  selectedCell !== null &&
                  !isSelected &&
                  (selectedCell.row === r ||
                    selectedCell.col === c ||
                    (Math.floor(selectedCell.row / 3) === Math.floor(r / 3) &&
                      Math.floor(selectedCell.col / 3) === Math.floor(c / 3)));
                const isMatchingValue = selectedValue !== 0 && cell.value === selectedValue;

                return (
                  <SudokuCell
                    key={`${r}-${c}`}
                    cell={cell}
                    isSelected={isSelected}
                    isHighlighted={isHighlighted}
                    isMatchingValue={isMatchingValue}
                    onClick={() => actions.selectCell(r, c)}
                  />
                );
              })
            )}
          </div>

          {status === 'paused' && (
            <div
              data-testid="paused-overlay"
              className="absolute inset-0 z-10 flex items-center justify-center bg-[color:color-mix(in_oklab,var(--page-bg)_74%,white)]/85 backdrop-blur-sm"
            >
              <span className="font-display text-4xl text-[color:var(--page-ink)] sm:text-5xl">Paused</span>
            </div>
          )}
          {gameState.isLoading && board.length > 0 && (
            <div
              role="status"
              aria-live="polite"
              className="absolute inset-0 z-10 flex items-center justify-center bg-white/68 backdrop-blur-sm"
            >
              <span className="meta-pill bg-white/90">
                Working…
              </span>
            </div>
          )}
          {status === 'completed' && (
            <div
              data-testid="solved-overlay"
              role="status"
              aria-live="polite"
              className="absolute inset-0 z-10 flex items-center justify-center bg-[color:color-mix(in_oklab,var(--good)_16%,white)]/82 backdrop-blur-sm"
            >
              <div className="rounded-[2rem] border border-[color:color-mix(in_oklab,var(--good)_24%,white)] bg-white/92 px-8 py-7 text-center shadow-[0_28px_70px_rgba(72,112,94,0.18)]">
                <span className="mb-2 block font-display text-4xl text-[color:var(--good)] sm:text-5xl">Solved</span>
                <span className="block text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-[color:var(--good)]">Time</span>
                <span className="block font-mono text-xl tabular-nums text-[color:var(--page-ink)]">{formatScore(gameState.timer)}</span>
                <span className="mt-3 block text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-[color:var(--good)]">Score</span>
                <span className="block font-display text-3xl tabular-nums text-[color:var(--page-ink)]">{gameState.timer}</span>
                <span className="mt-2 block text-[0.7rem] font-medium uppercase tracking-[0.16em] text-[color:var(--good)]">
                  Best {gameState.bestScores[gameState.difficulty] === null ? '--' : gameState.bestScores[gameState.difficulty]}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="text-[0.72rem] uppercase tracking-[0.18em] text-[color:var(--muted-ink)]">
        Arrow keys move. Numbers place. Delete clears.
      </div>
    </section>
  );
};
