## 1. Game State Updates

- [x] 1.1 Add/confirm an explicit `lost` terminal status in the game state model.
- [x] 1.2 Update mistake increment flow to transition to `lost` immediately when mistakes reach 3.
- [x] 1.3 Ensure solved and lost states remain mutually exclusive in state transition logic.

## 2. Input and Interaction Guards

- [x] 2.1 Gate all board-editing handlers so input is ignored when game status is not `playing`.
- [x] 2.2 Verify invalid-move counting occurs once per user action across keyboard/mouse input paths.
- [x] 2.3 Ensure post-loss input attempts do not mutate board values, notes, or mistake counters.

## 3. UI Feedback and Controls

- [x] 3.1 Add a clear game-over indicator/message shown only when status is `lost`.
- [x] 3.2 Keep solved-state UI behavior unchanged and hidden during loss state.
- [x] 3.3 Verify restart/new-game controls recover from loss into a fresh playable state.

## 4. Validation and Regression Coverage

- [x] 4.1 Add or update tests for first/second invalid move behavior (game continues).
- [x] 4.2 Add or update tests confirming the third invalid move triggers immediate loss.
- [x] 4.3 Add or update tests confirming board edits are blocked after loss.
