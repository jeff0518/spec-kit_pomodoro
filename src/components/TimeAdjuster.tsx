import React from 'react';

interface TimeAdjusterProps {
  label: string;
  value: number;
  onChange: (newValue: number) => void;
  min?: number;
  max?: number;
  step?: number;
}

const TimeAdjuster: React.FC<TimeAdjusterProps> = ({
  label,
  value,
  onChange,
  min = 1,
  max = 120,
  step = 1
}) => {
  const handleIncrement = () => {
    onChange(Math.min(max, value + step));
  };

  const handleDecrement = () => {
    onChange(Math.max(min, value - step));
  };

  return (
    <div className="flex items-center justify-between w-full max-w-xs">
      <span className="text-lg text-gray-300">{label}</span>
      <div className="flex items-center gap-4">
        <button
          onClick={handleDecrement}
          className="w-10 h-10 bg-gray-600 rounded-full text-2xl font-bold text-white hover:bg-gray-700"
          aria-label={`Decrement ${label}`}
        >
          -
        </button>
        <span className="text-2xl font-bold text-white w-12 text-center">{value}</span>
        <button
          onClick={handleIncrement}
          className="w-10 h-10 bg-gray-600 rounded-full text-2xl font-bold text-white hover:bg-gray-700"
          aria-label={`Increment ${label}`}
        >
          +
        </button>
      </div>
    </div>
  );
};

export default TimeAdjuster;
