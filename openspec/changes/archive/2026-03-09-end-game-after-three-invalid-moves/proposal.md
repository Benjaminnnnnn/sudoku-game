## Why

The game currently tracks mistakes but does not enforce a loss condition, so mistakes have limited gameplay consequence. Adding a clear fail state after repeated invalid moves improves game tension and aligns mistakes tracking with an explicit game outcome.

## What Changes

- Add a game-over condition that triggers immediately when the player makes a third invalid move.
- End active gameplay when the game-over condition is reached (no further board edits).
- Surface a clear "game over" state/message distinct from the existing solved state.
- Ensure the mistake counter behavior and loss condition are consistent across input methods.

## Capabilities

### New Capabilities
- None.

### Modified Capabilities
- `sudoku`: change gameplay requirements so the session ends in a loss state after exactly three invalid moves.

## Impact

- Affected code: game state management, mistake tracking, input handling, and end-state UI logic.
- APIs: no external API changes expected.
- Dependencies: none expected.
- Systems: core gameplay flow and UI state transitions.
