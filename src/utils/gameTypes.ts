
export type PlayerColor = 'player1' | 'player2' | 'player3' | 'player4' | 'player5';

export interface Pawn {
  id: string;
  position: number;
  color: PlayerColor;
}

export interface Player {
  id: number;
  name: string;
  color: PlayerColor;
  pawns: Pawn[];
}

export interface Snake {
  head: number;
  tail: number;
}

export interface Ladder {
  bottom: number;
  top: number;
}

export interface MoveHistoryEntry {
  playerId: number;
  playerName: string;
  pawnId: string;
  diceValue: number;
  fromPosition: number;
  toPosition: number;
  turn: number;
}

export interface GameState {
  players: Player[];
  currentPlayerIndex: number;
  diceValue: number | null;
  snakes: Snake[];
  ladders: Ladder[];
  selectedPawnId: string | null;
  winner: Player | null;
  gameStarted: boolean;
  gameEnded: boolean;
  moveHistory: MoveHistoryEntry[];
  turnCount: number;
  difficulty: string;
}

export type GameAction =
  | { type: 'START_GAME'; players: number; difficulty?: string }
  | { type: 'ROLL_DICE' }
  | { type: 'SELECT_PAWN'; pawnId: string }
  | { type: 'MOVE_PAWN' }
  | { type: 'NEXT_TURN' }
  | { type: 'RESET_GAME' };
