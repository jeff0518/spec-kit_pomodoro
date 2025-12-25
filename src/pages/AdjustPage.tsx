import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import TimeAdjuster from '../components/TimeAdjuster';
import Button from '../components/Button';
import { useAppDispatch } from '../app/hooks';
import { startTimer } from '../features/timer/timerSlice';
import { initAudio } from '../utils/audio';

const isValidMode = (mode: string | undefined): mode is 'focus' | 'shortBreak' | 'longBreak' => {
  return ['focus', 'shortBreak', 'longBreak'].includes(mode as string);
};

const AdjustPage: React.FC = () => {
  const { modeId } = useParams<{ modeId: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const defaultTimes = {
    focus: 25,
    shortBreak: 5,
    longBreak: 15,
  };

  const [duration, setDuration] = useState(defaultTimes.focus);
  const [modeTitle, setModeTitle] = useState('專注時間');

  useEffect(() => {
    if (isValidMode(modeId)) {
      setDuration(defaultTimes[modeId]);
      const titles = { focus: '專注時間', shortBreak: '短休息', longBreak: '長休息' };
      setModeTitle(titles[modeId]);
    } else {
      navigate('/');
    }
  }, [modeId, navigate]);


  const handleStart = () => {
    initAudio();
    
    if (isValidMode(modeId)) {
      dispatch(startTimer({ mode: modeId, duration: duration * 60 }));
      navigate('/timer');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
      <h1 className="text-4xl font-bold mb-8">調整時間</h1>
      <div className="w-full max-w-md bg-gray-800 p-8 rounded-lg space-y-8">
        <TimeAdjuster
          label={`${modeTitle} (分鐘)`}
          value={duration}
          onChange={setDuration}
          min={1}
          max={120}
        />
        <Button onClick={handleStart} className="w-full text-lg">
          開始計時
        </Button>
      </div>
    </div>
  );
};

export default AdjustPage;
