# Spec: Sudoku Game

## Core Gameplay
- **Board:** 9x9 grid with 3x3 subgrid borders.
- **Input:** Click to select, type 1-9 to enter a number. Arrow keys to navigate. Backspace/Delete/0 to clear.
- **Validation:** Prevent editing prefilled cells. Highlight selected cell, related row/col/box, and matching numbers. Visually mark invalid entries (red text/background).
- **Completion:** Detect when the board matches the solution and show a success state.

## Game Logic
- **Generation:** Generate valid puzzles with unique solutions (or at least one valid solution) for Easy, Medium, and Hard difficulties.
- **Mistakes:** Track mistakes.

## Features
- **Controls:** New Game, Difficulty selector, Reset Puzzle, Undo, Notes toggle, Eraser.
- **Timer:** Starts on new game, pauses on pause, stops on completion.
- **Notes Mode:** Allows entering multiple candidate numbers (1-9) in a single cell.

## Scenarios
- **Scenario 1: Entering a valid number.** User selects an empty cell and presses '5'. The cell displays '5'.
- **Scenario 2: Entering an invalid number.** User selects an empty cell and presses '5'. '5' conflicts with the row. The cell displays '5' in red. Mistake counter increments.
- **Scenario 3: Toggling notes.** User clicks 'Notes'. User selects an empty cell and presses '2' and '3'. The cell displays small '2' and '3'.
- **Scenario 4: Board completion.** User enters the final correct number. The board becomes uneditable and a "Solved!" message appears.
