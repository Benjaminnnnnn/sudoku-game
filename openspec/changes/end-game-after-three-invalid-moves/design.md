## Context

The Sudoku app already tracks invalid entries as mistakes and visually marks invalid moves, but gameplay currently continues regardless of mistake count. The requested change introduces a hard loss condition after three invalid moves, which affects state transitions between active play and terminal game states.

## Goals / Non-Goals

**Goals:**
- Define a deterministic loss condition that triggers on the third invalid move.
- Ensure post-loss behavior is consistent: gameplay stops and the UI communicates game over.
- Keep solved-state behavior unchanged and clearly distinct from the new loss state.
- Keep mistake counting logic aligned with the loss threshold across all input paths.

**Non-Goals:**
- Changing puzzle generation, difficulty tuning, or solution validation algorithms.
- Adding retries, lives settings, or configurable mistake thresholds.
- Redesigning the broader UI beyond the game-over indication needed by this change.

## Decisions

- Introduce an explicit terminal game status for loss (e.g., `lost`) in the same state model that represents `playing` and `solved`.
  - Rationale: a first-class status simplifies disabling input and rendering terminal messaging.
  - Alternative considered: deriving loss implicitly from `mistakes >= 3`; rejected because implicit state tends to scatter checks and risks inconsistent behavior.

- Evaluate loss condition immediately after mistake increment and transition to `lost` when count reaches three.
  - Rationale: ensures the third invalid move is the exact transition point and avoids off-by-one behavior.
  - Alternative considered: checking only on next render/input; rejected due to delayed or inconsistent state updates.

- Block board-editing interactions while in `lost` state, similar to solved-state input lock.
  - Rationale: terminal states should be immutable for predictable UX.
  - Alternative considered: allowing continued play for practice; rejected because it conflicts with explicit game-over semantics.

- Preserve existing invalid-entry visualization and mistake counter, adding only game-over messaging/controls needed for recovery (e.g., start new game).
  - Rationale: minimize scope while making loss condition visible and actionable.
  - Alternative considered: clearing board or auto-reveal on loss; rejected as unnecessary behavior expansion.

## Risks / Trade-offs

- [Risk] Off-by-one or double-counted mistakes from multiple validation paths -> Mitigation: centralize mistake increment + threshold check in one update path.
- [Risk] Input still accepted after terminal transition due to stale event handlers -> Mitigation: gate all edit handlers by `gameStatus === playing`.
- [Trade-off] Strict terminal loss may frustrate users who prefer unlimited mistakes -> Mitigation: keep current request scope, consider configurability in a separate change.
