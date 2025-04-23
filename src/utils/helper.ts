  import { Pawn } from "./gameTypes";

  // Calculate pawn size based on number of pawns
  export const getPawnSize = (pawns:Pawn[]) => {
    const count = pawns.length;
    if (count <= 2) return "w-2.5 h-2.5 md:w-3.5 md:h-3.5";
    if (count <= 4) return "w-2 h-2 md:w-3 md:h-3";
    if (count <= 6) return "w-1.5 h-1.5 md:w-2.5 md:h-2.5";
    return "w-1 h-1 md:w-2 md:h-2";
  };

   // Determine grid layout based on number of pawns
   export const getPawnGridClasses = (pawns:Pawn[]) => {
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
      player1: '#FF5252', // red
      player2: '#4CAF50', // green
      player3: '#2196F3', // blue
      player4: '#FFC107', // yellow
      player5: '#9C27B0'  // purple
    };
    
    return colorMap[playerColor] || '#FFFFFF';
  };
  