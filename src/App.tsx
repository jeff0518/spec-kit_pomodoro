import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AdjustPage from './pages/AdjustPage';
import TimerPage from './pages/TimerPage';
import ReportPage from './pages/ReportPage';
import { useWindowLock } from './features/lock/useWindowLock';
import LockWarning from './features/lock/LockWarning';

function App() {
  const { isLockedByOther } = useWindowLock();

  return (
    <>
      {isLockedByOther && <LockWarning />}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/adjust/:modeId" element={<AdjustPage />} />
        <Route path="/timer" element={<TimerPage />} />
        <Route path="/reports/:view" element={<ReportPage />} />
      </Routes>
    </>
  );
}

export default App;
