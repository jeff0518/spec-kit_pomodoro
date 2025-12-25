import React from 'react';
import { FocusRecord } from './historySlice';
import RecordItem from './RecordItem';

interface RecordListProps {
  records: FocusRecord[];
}

const RecordList: React.FC<RecordListProps> = ({ records }) => {
  if (records.length === 0) {
    return <p className="text-gray-400 text-center py-8">沒有任何歷史紀錄。</p>;
  }

  return (
    <div>
      {records.map(record => (
        <RecordItem key={record.id} record={record} />
      ))}
    </div>
  );
};

export default RecordList;
