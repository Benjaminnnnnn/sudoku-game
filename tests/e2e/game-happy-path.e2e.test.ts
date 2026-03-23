import { expect, test, type Page, type Route } from '@playwright/test';
import type { CheckBoardRequest, ValidateMoveRequest } from '../../shared/types';
import { buildCheckBoardResponse, buildValidateMoveResponse, createGameResponse } from './fixtures/sudoku';
import { SudokuPage } from './pages/SudokuPage';

function fulfillJson(route: Route, body: unknown, status = 200) {
  return route.fulfill({
    status,
    contentType: 'application/json',
    body: JSON.stringify(body),
  });
}

async function mockSudokuApi(page: Page) {
  await page.route('**/api/games', async (route) => {
    await fulfillJson(route, createGameResponse, 201);
  });

  await page.route('**/api/moves', async (route) => {
    const request = route.request().postDataJSON() as ValidateMoveRequest;
    await fulfillJson(route, buildValidateMoveResponse(request));
  });

  await page.route('**/api/check', async (route) => {
    const request = route.request().postDataJSON() as CheckBoardRequest;
    await fulfillJson(route, buildCheckBoardResponse(request));
  });
}

test.describe('Sudoku happy path', () => {
  let sudokuPage: SudokuPage;

  test.beforeEach(async ({ page }) => {
    await mockSudokuApi(page);
    await page.addInitScript(() => {
      window.localStorage.clear();
    });

    sudokuPage = new SudokuPage(page);
    await sudokuPage.goto();
  });

  test('solves the board through the main player flow', async ({ page }, testInfo) => {
    await expect(sudokuPage.newGameButton).toBeEnabled();
    await expect(sudokuPage.difficultySelect).toHaveValue('easy');
    await expect(sudokuPage.scoreValue).toHaveText('0');
    await expect(sudokuPage.mistakesValue).toHaveText('0');
    await expect(sudokuPage.boardStatus).toHaveText('Active');

    await sudokuPage.placeValue(0, 2, 4);
    await sudokuPage.pauseGame();
    await sudokuPage.resumeGame();
    await sudokuPage.placeValue(4, 4, 5);
    await sudokuPage.placeValue(8, 8, 9);

    await expect(sudokuPage.solvedOverlay).toBeVisible();
    await expect(sudokuPage.boardStatus).toHaveText('Solved');
    await expect(page.getByText('Solved!')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Place 1' })).toBeDisabled();
    await expect(sudokuPage.pauseToggle).toBeDisabled();

    await page.screenshot({
      path: testInfo.outputPath('happy-path-solved.png'),
      fullPage: true,
    });
  });
});
