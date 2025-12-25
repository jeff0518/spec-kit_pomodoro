import React from 'react';
import { useAppSelector } from '../app/hooks';
import RecordList from '../features/history/RecordList';
import { selectSortedRecordsNewestFirst } from '../features/history/historySelectors';

const ReportPage: React.FC = () => {
  const sortedRecords = useAppSelector(selectSortedRecordsNewestFirst);

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-900 text-white p-4 md:p-8">
      <h1 className="text-4xl font-bold mb-8">歷史紀錄</h1>
      <div className="w-full max-w-3xl">
        <div className="bg-gray-800 p-2 rounded-lg mb-4">
          <button className="px-4 py-2 text-white font-semibold bg-gray-700 rounded w-full">
            列表檢視
          </button>
        </div>
        <div className="bg-gray-800 p-4 md:p-6 rounded-lg">
          <RecordList records={sortedRecords} />
        </div>
      </div>
    </div>
  );
};

export default ReportPage;
