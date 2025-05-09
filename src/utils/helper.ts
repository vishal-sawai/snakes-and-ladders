import { Pawn } from "./gameTypes";
import { GAME_STATE_KEY } from "./config";
import { GameState } from "./gameTypes";

// Calculate pawn size based on number of pawns
export const getPawnSize = (pawns: Pawn[]) => {
  const count = pawns.length;
  if (count <= 2) return "w-4 h-4 md:w-5 md:h-5";
  if (count <= 4) return "w-3 h-3 md:w-4 md:h-4";
  if (count <= 6) return "w-2.5 h-2.5 md:w-3.5 md:h-3.5";
  if (count <= 10) return "w-2 h-2 md:w-3.5 md:h-3.5";
  return "w-1 h-1 md:w-3 md:h-3.5";
};

// Determine grid layout based on number of pawns
export const getPawnGridClasses = (pawns: Pawn[]) => {
  const count = pawns.length;
  if (count <= 1) return "grid-cols-1";
  if (count <= 4) return "grid-cols-2";
  if (count <= 6) return "grid-cols-3";
  if (count <= 9) return "grid-cols-3";
  return "grid-cols-4";
};


// Convert a square number (1-100) to x,y coordinates in the SVG viewBox
export const getSquareCoordinates = (position: number) => {
  // First determine the row and column (0-indexed)
  const row = 9 - Math.floor((position - 1) / 10);

  // Determine column based on zigzag pattern
  let col: number;
  if ((9 - row) % 2 === 0) {
    // If it's an even row from bottom (row 0, 2, 4, 6, 8 in our grid), numbers increase left to right
    col = (position - 1) % 10;
  } else {
    // If it's an odd row from bottom (row 1, 3, 5, 7, 9 in our grid), numbers increase right to left
    col = 9 - ((position - 1) % 10);
  }

  // Calculate center point of the square (each square is 10% of the viewBox)
  return {
    x: col * 10 + 5,  // center of the square horizontally
    y: row * 10 + 5   // center of the square vertically
  };
};

// Helper function to get CSS color for player
export const getColorForPlayer = (playerColor: string): string => {
  const colorMap: Record<string, string> = {
    player1: '#3B82F6', // blue
    player2: '#4CAF50', // green
    player3: '#EF4444', // red
    player4: '#FFC107', // yellow
    player5: '#000000'  // purple
  };

  return colorMap[playerColor] || '#FFFFFF';
};



// LocalStorage
// Function to save game state
export const saveGameState = (state: GameState) => {
  try {
    localStorage.setItem(GAME_STATE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error('Error saving game:', error);
  }
};

// Function to load saved game state
export const loadSavedGameState = (): GameState | null => {
  try {
    const savedState = localStorage.getItem(GAME_STATE_KEY);
    if (savedState) {
      return JSON.parse(savedState);
    }
  } catch (error) {
    console.error('Error loading saved game:', error);
  }
  return null;
};

// Function to remove saved game state
export const removeSavedGameState = () => {
  try {
    localStorage.removeItem(GAME_STATE_KEY);
  } catch (error) {
    console.error('Error removing saved game:', error);
  }
}
