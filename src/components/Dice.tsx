
import React from 'react';
import { Dice1, Dice2, Dice3, Dice4, Dice5, Dice6, DicesIcon } from 'lucide-react';

interface DiceProps {
  value: number | null;
  onRoll: () => void;
  disabled: boolean;
}

const Dice: React.FC<DiceProps> = ({ value, onRoll, disabled }) => {
  const renderDiceIcon = () => {
    switch (value) {
      case 1: return <Dice1 className="w-8 h-8 md:w-10 md:h-10" />;
      case 2: return <Dice2 className="w-8 h-8 md:w-10 md:h-10" />;
      case 3: return <Dice3 className="w-8 h-8 md:w-10 md:h-10" />;
      case 4: return <Dice4 className="w-8 h-8 md:w-10 md:h-10" />;
      case 5: return <Dice5 className="w-8 h-8 md:w-10 md:h-10" />;
      case 6: return <Dice6 className="w-8 h-8 md:w-10 md:h-10" />;
      default: return <DicesIcon className="w-8 h-8 md:w-10 md:h-10" />;
    }
  };

  return (
    <button
      onClick={onRoll}
      disabled={disabled}
      className={`
        p-4 rounded-lg shadow-lg flex items-center justify-center
        transition-transform duration-200 active:scale-95 animate-dice-roll
        ${disabled ? 'bg-gray-300 cursor-not-allowed' : 'bg-white hover:bg-gray-50'}
      `}
    >
      {renderDiceIcon()}
    </button>
  );
};

export default Dice;
