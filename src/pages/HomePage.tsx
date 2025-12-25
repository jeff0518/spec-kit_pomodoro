import React from 'react';
import { useNavigate } from 'react-router-dom';
import ModeCard from '../components/ModeCard';

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  const modes = [
    { id: 'focus', title: '專注', description: '25 分鐘專注工作' },
    { id: 'shortBreak', title: '短休息', description: '5 分鐘短暫休息' },
    { id: 'longBreak', title: '長休息', description: '15 分鐘長時間休息' },
    { id: 'settings', title: '設定', description: '調整預設時間' },
  ];

  const handleModeSelect = (modeId: string) => {
    if (modeId === 'settings') {
      navigate(`/adjust/focus`);
    } else {
      navigate(`/adjust/${modeId}`);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
      <h1 className="text-5xl font-bold mb-4">番茄鐘</h1>
      <p className="text-xl text-gray-400 mb-12">請選擇一個模式來開始</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-2xl">
        {modes.map((mode) => (
          <ModeCard
            key={mode.id}
            title={mode.title}
            description={mode.description}
            onClick={() => handleModeSelect(mode.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default HomePage;
