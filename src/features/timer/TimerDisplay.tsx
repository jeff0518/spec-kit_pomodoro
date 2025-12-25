import React from 'react';

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
};

interface TimerDisplayProps {
  remainingSeconds: number;
}

const TimerDisplay: React.FC<TimerDisplayProps> = ({ remainingSeconds }) => {
  return (
    <div 
      className="text-9xl font-bold mb-8"
      role="timer"
      aria-live="polite"
    >
      {formatTime(remainingSeconds)}
    </div>
  );
};

export default React.memo(TimerDisplay);
