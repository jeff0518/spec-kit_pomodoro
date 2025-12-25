import { describe, it, expect } from 'vitest';
import timerReducer, {
  startTimer,
  pauseTimer,
  resumeTimer,
  resetTimer,
  tick,
  TimerState,
} from '../../src/features/timer/timerSlice';

describe('timer slice', () => {
  const initialState: TimerState = {
    mode: null,
    status: 'idle',
    remainingSeconds: 0,
  };

  it('should handle initial state', () => {
    expect(timerReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('should handle startTimer', () => {
    const state = timerReducer(initialState, startTimer({ mode: 'focus', duration: 1500 }));
    expect(state.mode).toEqual('focus');
    expect(state.status).toEqual('running');
    expect(state.remainingSeconds).toEqual(1500);
  });

  it('should handle pauseTimer', () => {
    const runningState: TimerState = { mode: 'focus', status: 'running', remainingSeconds: 1400 };
    const state = timerReducer(runningState, pauseTimer());
    expect(state.status).toEqual('paused');
  });
});
