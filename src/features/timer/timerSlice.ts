import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface TimerState {
  mode: 'focus' | 'shortBreak' | 'longBreak' | null;
  status: 'idle' | 'running' | 'paused';
  remainingSeconds: number;
}

const initialState: TimerState = {
  mode: null,
  status: 'idle',
  remainingSeconds: 0,
};

export const timerSlice = createSlice({
  name: 'timer',
  initialState,
  reducers: {
    startTimer: (state, action: PayloadAction<{ mode: NonNullable<TimerState['mode']>, duration: number }>) => {
      state.mode = action.payload.mode;
      state.remainingSeconds = action.payload.duration;
      state.status = 'running';
    },
    pauseTimer: (state) => {
      if (state.status === 'running') {
        state.status = 'paused';
      }
    },
    resumeTimer: (state) => {
      if (state.status === 'paused') {
        state.status = 'running';
      }
    },
    resetTimer: () => {
      return initialState;
    },
    tick: (state) => {
      if (state.status === 'running' && state.remainingSeconds > 0) {
        state.remainingSeconds -= 1;
      } else if (state.status === 'running' && state.remainingSeconds <= 0) {
        state.status = 'idle';
        state.mode = null;
      }
    },
  },
});

export const { startTimer, pauseTimer, resumeTimer, resetTimer, tick } = timerSlice.actions;

export default timerSlice.reducer;
