import type { BestScores } from '../types';

const BEST_SCORES_STORAGE_KEY = 'sudoku-best-scores';

export function formatScore(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

export function createEmptyBestScores(): BestScores {
  return {
    easy: null,
    medium: null,
    hard: null,
  };
}

export function loadBestScores(): BestScores {
  if (typeof window === 'undefined') {
    return createEmptyBestScores();
  }

  const storedValue = window.localStorage.getItem(BEST_SCORES_STORAGE_KEY);
  if (!storedValue) {
    return createEmptyBestScores();
  }

  try {
    const parsedValue = JSON.parse(storedValue) as Partial<BestScores>;

    return {
      easy: typeof parsedValue.easy === 'number' ? parsedValue.easy : null,
      medium: typeof parsedValue.medium === 'number' ? parsedValue.medium : null,
      hard: typeof parsedValue.hard === 'number' ? parsedValue.hard : null,
    };
  } catch {
    return createEmptyBestScores();
  }
}

export function saveBestScores(bestScores: BestScores): void {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(BEST_SCORES_STORAGE_KEY, JSON.stringify(bestScores));
}
