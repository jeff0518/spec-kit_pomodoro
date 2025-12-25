import React from 'react';
import { FocusRecord } from './historySlice';
import Button from '../../components/Button';
import { useAppDispatch } from '../../app/hooks';
import { deleteRecord } from './historySlice';

interface RecordItemProps {
  record: FocusRecord;
}

const formatTimestamp = (timestamp: number) => {
  return new Date(timestamp).toLocaleString('zh-TW', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const formatDuration = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  if (mins > 0 && secs > 0) return `${mins}分 ${secs}秒`;
  if (mins > 0) return `${mins}分鐘`;
  return `${secs}秒`;
};

const RecordItem: React.FC<RecordItemProps> = ({ record }) => {
  const dispatch = useAppDispatch();

  const handleDelete = () => {
    if (window.confirm('確定要刪除這筆紀錄嗎？')) {
      dispatch(deleteRecord(record.id));
    }
  };
  
  const modeText = {
    focus: '專注',
    shortBreak: '短休息',
    longBreak: '長休息',
  };

  return (
    <div className="bg-gray-700 p-4 rounded-lg flex items-center justify-between mb-3 transition-colors hover:bg-gray-600">
      <div>
        <p className="font-bold text-white text-lg">{modeText[record.mode]}: {formatDuration(record.duration)}</p>
        <p className="text-sm text-gray-400">
          {formatTimestamp(record.startTime)}
        </p>
      </div>
      <div>
        <Button onClick={handleDelete} variant="secondary" className="text-sm">刪除</Button>
      </div>
    </div>
  );
};

export default React.memo(RecordItem);
