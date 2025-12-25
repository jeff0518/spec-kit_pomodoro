import { configureStore } from '@reduxjs/toolkit';
import timerReducer from '../features/timer/timerSlice';
import historyReducer from '../features/history/historySlice';
import lockReducer from '../features/lock/lockSlice';
import uiReducer from '../features/ui/uiSlice';

export const store = configureStore({
  reducer: {
    timer: timerReducer,
    history: historyReducer,
    lock: lockReducer,
    ui: uiReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
