import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTimer } from '../features/timer/useTimer';
import Button from '../components/Button';
import TimerDisplay from '../features/timer/TimerDisplay';

const TimerPage: React.FC = () => {
  const navigate = useNavigate();
  const { status, remainingSeconds, mode, pause, resume, reset } = useTimer();

  useEffect(() => {
    if (status === 'idle') {
      navigate('/');
    }
  }, [status, navigate]);

  const modeText = {
    focus: '專注中',
    shortBreak: '短休息',
    longBreak: '長休息',
  };
  
  useEffect(() => {
    if (status === 'running' || status === 'paused') {
      const mins = Math.floor(remainingSeconds / 60);
      const secs = remainingSeconds % 60;
      const timeString = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
      document.title = `${timeString} - ${mode ? modeText[mode] : ''}`;
    } else {
      document.title = '番茄鐘';
    }
  }, [remainingSeconds, status, mode]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <div className="text-center">
        <p className="text-2xl text-gray-400 mb-2">{mode ? modeText[mode] : '計時器'}</p>
        <TimerDisplay remainingSeconds={remainingSeconds} />
        <div className="flex items-center justify-center gap-4">
          {status === 'running' && (
            <Button onClick={pause} variant="secondary" className="w-32">
              暫停
            </Button>
          )}
          {status === 'paused' && (
            <Button onClick={resume} variant="primary" className="w-32">
              繼續
            </Button>
          )}
          <Button onClick={reset} variant="secondary" className="w-32">
            重設
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TimerPage;
