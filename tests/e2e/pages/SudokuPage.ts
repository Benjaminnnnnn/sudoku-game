import { expect, type Locator, type Page } from '@playwright/test';

export class SudokuPage {
  readonly page: Page;
  readonly board: Locator;
  readonly newGameButton: Locator;
  readonly difficultySelect: Locator;
  readonly pauseToggle: Locator;
  readonly scoreValue: Locator;
  readonly mistakesValue: Locator;
  readonly boardStatus: Locator;
  readonly pausedOverlay: Locator;
  readonly solvedOverlay: Locator;

  constructor(page: Page) {
    this.page = page;
    this.board = page.getByRole('group', { name: 'Sudoku board' });
    this.newGameButton = page.getByTestId('new-game-button');
    this.difficultySelect = page.getByTestId('difficulty-select');
    this.pauseToggle = page.getByTestId('pause-toggle');
    this.scoreValue = page.getByTestId('score-value');
    this.mistakesValue = page.getByTestId('mistakes-value');
    this.boardStatus = page.getByTestId('board-status');
    this.pausedOverlay = page.getByTestId('paused-overlay');
    this.solvedOverlay = page.getByTestId('solved-overlay');
  }

  cell(row: number, col: number): Locator {
    return this.page.getByTestId(`cell-${row}-${col}`);
  }

  numberButton(value: number): Locator {
    return this.page.getByRole('button', { name: `Place ${value}` });
  }

  async goto() {
    await this.page.goto('/');
    await expect(this.board).toBeVisible();
    await expect(this.cell(0, 2)).toBeVisible();
  }

  async selectCell(row: number, col: number) {
    await this.cell(row, col).click();
  }

  async placeValue(row: number, col: number, value: number) {
    await this.selectCell(row, col);
    await this.numberButton(value).click();
    await expect(this.cell(row, col)).toContainText(`${value}`);
  }

  async pauseGame() {
    await this.pauseToggle.click();
    await expect(this.pausedOverlay).toBeVisible();
    await expect(this.boardStatus).toHaveText('Paused');
  }

  async resumeGame() {
    await this.pauseToggle.click();
    await expect(this.pausedOverlay).toHaveCount(0);
    await expect(this.boardStatus).toHaveText('Active');
  }
}
