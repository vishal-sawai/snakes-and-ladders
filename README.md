# Snakes and Ladders Game

A modern, responsive implementation of the classic Snakes and Ladders board game built with React, TypeScript, and Tailwind CSS.

## Features

- 🎲 Interactive dice rolling and pawn movement
- 🎮 Support for 2-5 players
- 🔄 Multiple difficulty levels (Easy, Normal, Hard)
- 🎯 Two pawns per player for strategic gameplay
- 🌈 Unique color coding for each player
- 📱 Fully responsive design
- 💾 Automatic game state saving
- 🎨 Beautiful SVG animations for snakes and ladders

## Technologies Used

- [React](https://reactjs.org/) - UI framework
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Vite](https://vitejs.dev/) - Build tool and development server
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [React Router](https://reactrouter.com/) - Navigation
- [Lucide React](https://lucide.dev/) - Icons

## Getting Started

### Prerequisites

- Node.js 18.0 or higher
- npm or pnpm

### Installation

1. Clone the repository:
```bash
git clone https://github.com/vishal-sawai/snakes-and-ladders.git
cd snakes-and-ladders
```

2. Install dependencies:
```bash
npm install
# or
pnpm install
```

3. Start the development server:
```bash
npm run dev
# or
pnpm dev
```

4. Open [http://localhost:5173](http://localhost:5173) in your browser.

## Game Rules

1. Each player gets 2 pawns starting from square 1
2. Players take turns rolling a dice
3. After rolling, select which pawn to move
4. Landing on a ladder bottom takes you up to its top
5. Landing on a snake head sends you down to its tail
6. First player to reach square 100 with any pawn wins


### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production

### Key Features Implementation

- **Game State Management**: Uses React's useReducer for state management
- **Board Generation**: Dynamic 10x10 grid with zigzag numbering
- **SVG Animations**: Enhanced visual effects for snakes and ladders
- **Responsive Design**: Adapts to different screen sizes
- **Local Storage**: Automatically saves game progress

