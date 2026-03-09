## MODIFIED Requirements

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

## ADDED Requirements

### Requirement: Lost games are terminal
When the game state is lost, the system SHALL block further board-editing actions and SHALL present a game-over indication that is distinct from the solved state.

#### Scenario: Input is blocked after loss
- **WHEN** the game is in a lost state and the player attempts to enter or clear a cell value
- **THEN** the system SHALL ignore the edit request and leave the board unchanged

#### Scenario: Loss indication is shown
- **WHEN** the game transitions to a lost state
- **THEN** the system SHALL display a game-over message/state
- **THEN** the system SHALL NOT display the solved-state message
