
import { Snake, Ladder, Player, PlayerColor } from './gameTypes';

// Generate a random integer between min and max (inclusive)
export const getRandomInt = (min: number, max: number): number => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Generate random snakes
export const generateSnakes = (count: number): Snake[] => {
  const snakes: Snake[] = [];
  const usedPositions = new Set<number>();
  
  while (snakes.length < count) {
    // Snake head can't be on square 1 or after 94 (to ensure there's room for tail)
    const head = getRandomInt(20, 99);
    // Tail must be lower than head and not less than square 1
    const tail = getRandomInt(1, head - 10);
    
    // Skip if positions already used or head is 100 (final square)
    if (head === 100 || usedPositions.has(head) || usedPositions.has(tail)) {
      continue;
    }
    
    snakes.push({ head, tail });
    usedPositions.add(head);
    usedPositions.add(tail);
  }
  
  return snakes;
};

// Generate random ladders, avoiding snake positions
export const generateLadders = (count: number, snakes: Snake[]): Ladder[] => {
  const ladders: Ladder[] = [];
  const usedPositions = new Set<number>();
  
  // Add snake positions to used positions
  snakes.forEach(snake => {
    usedPositions.add(snake.head);
    usedPositions.add(snake.tail);
  });
  
  while (ladders.length < count) {
    // Ladder bottom can't be after square 80 (to ensure there's room for top)
    const bottom = getRandomInt(2, 80);
    // Top must be higher than bottom but not exceeding 100
    const top = getRandomInt(bottom + 10, 99);
    
    // Skip if positions already used, or bottom is 1 (start) or top is 100 (end)
    if (bottom === 1 || top === 100 || usedPositions.has(bottom) || usedPositions.has(top)) {
      continue;
    }
    
    ladders.push({ bottom, top });
    usedPositions.add(bottom);
    usedPositions.add(top);
  }
  
  return ladders;
};

// Create players with their pawns
export const createPlayers = (count: number): Player[] => {
  const playerColors: PlayerColor[] = ['player1', 'player2', 'player3', 'player4', 'player5'];
  const players: Player[] = [];
  
  for (let i = 0; i < count; i++) {
    const color = playerColors[i];
    players.push({
      id: i + 1,
      name: `Player ${i + 1}`,
      color,
      pawns: [
        { id: `${i}-1`, position: 1, color },
        { id: `${i}-2`, position: 1, color }
      ]
    });
  }
  
  return players;
};

// Calculate the destination after moving a pawn
export const calculateDestination = (
  currentPosition: number,
  diceValue: number,
  snakes: Snake[],
  ladders: Ladder[]
): number => {
  // Calculate new position after dice roll
  const newPosition = currentPosition + diceValue;
  
  // Cannot exceed 100
  if (newPosition > 100) {
    return currentPosition;
  }
  
  // Check if landed on a snake head
  const snake = snakes.find(s => s.head === newPosition);
  if (snake) {
    return snake.tail;
  }
  
  // Check if landed on a ladder bottom
  const ladder = ladders.find(l => l.bottom === newPosition);
  if (ladder) {
    return ladder.top;
  }
  
  return newPosition;
};

// Check if a player has won (any pawn reached square 100)
export const checkWinner = (players: Player[]): Player | null => {
  for (const player of players) {
    for (const pawn of player.pawns) {
      if (pawn.position === 100) {
        return player;
      }
    }
  }
  return null;
};
