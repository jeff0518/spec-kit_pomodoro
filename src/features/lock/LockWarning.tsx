import React from 'react';

const LockWarning: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div
        className="bg-gray-800 p-8 rounded-lg text-center shadow-xl max-w-sm w-full"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="lock-warning-title"
        aria-describedby="lock-warning-desc"
      >
        <h2 id="lock-warning-title" className="text-2xl font-bold text-yellow-400 mb-4">計時器在另一個分頁中執行</h2>
        <p id="lock-warning-desc" className="text-gray-300">
          為了避免衝突，番茄鐘一次只能在一個分頁中計時。
        </p>
      </div>
    </div>
  );
};

export default LockWarning;
