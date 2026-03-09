## ADDED Requirements

### Requirement: Standard sudoku board and input
The system SHALL render a 9x9 board with visible 3x3 boundaries. The system SHALL allow selecting cells and entering values 1-9, clearing with Backspace/Delete/0, and moving selection with arrow keys.

#### Scenario: Entering a valid number
- **WHEN** a user selects an editable empty cell and enters a valid digit
- **THEN** the system SHALL display that value in the selected cell

### Requirement: Invalid entries are visually marked
The system SHALL prevent editing fixed cells and SHALL mark invalid non-zero entries with an error visual style.

#### Scenario: Entering an invalid number
- **WHEN** a user enters a value that conflicts with sudoku rules
- **THEN** the system SHALL mark the entry as invalid

### Requirement: Mistakes are tracked with a loss threshold
The system SHALL increment the mistake counter each time a player enters an invalid value into an editable cell while the game is in progress. The system SHALL transition the game to a loss state immediately when the mistake counter reaches three.

#### Scenario: Third invalid move ends the game
- **WHEN** the player makes an invalid move that increases mistakes from 2 to 3
- **THEN** the system SHALL set the game state to lost immediately
- **THEN** the system SHALL keep the displayed mistake count at 3

#### Scenario: First or second invalid move does not end the game
- **WHEN** the player makes an invalid move and total mistakes is less than 3
- **THEN** the system SHALL keep the game state in progress
- **THEN** the system SHALL increment and display the updated mistake count

### Requirement: Notes mode supports candidate digits
The system SHALL allow users to toggle notes mode and record multiple candidate digits per editable cell.

#### Scenario: Toggling notes
- **WHEN** notes mode is enabled and the player enters candidate digits for a cell
- **THEN** the cell SHALL display those candidate digits

### Requirement: Puzzle completion ends the game
The system SHALL detect when all board values match the solution and SHALL transition to a solved state.

#### Scenario: Board completion
- **WHEN** the player enters the final correct value
- **THEN** the system SHALL mark the puzzle as solved and block further edits

### Requirement: Lost games are terminal
When the game state is lost, the system SHALL block further board-editing actions and SHALL present a game-over indication that is distinct from the solved state.

#### Scenario: Input is blocked after loss
- **WHEN** the game is in a lost state and the player attempts to enter or clear a cell value
- **THEN** the system SHALL ignore the edit request and leave the board unchanged

#### Scenario: Loss indication is shown
- **WHEN** the game transitions to a lost state
- **THEN** the system SHALL display a game-over message/state
- **THEN** the system SHALL NOT display the solved-state message
