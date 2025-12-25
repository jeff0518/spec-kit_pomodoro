import React from 'react';

interface ModeCardProps {
  title: string;
  description: string;
  onClick: () => void;
}

const ModeCard: React.FC<ModeCardProps> = ({ title, description, onClick }) => {
  const handleKeyPress = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      onClick();
    }
  };

  return (
    <div
      onClick={onClick}
      onKeyPress={handleKeyPress}
      role="button"
      tabIndex={0}
      className="bg-gray-800 p-6 rounded-lg shadow-lg cursor-pointer hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
    >
      <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
      <p className="text-gray-400">{description}</p>
    </div>
  );
};

export default ModeCard;
