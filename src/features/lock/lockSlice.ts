import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface LockState {
  activeWindowId: string | null;
  isLockedByOther: boolean;
  thisWindowId: string;
}

const initialState: LockState = {
  activeWindowId: null,
  isLockedByOther: false,
  thisWindowId: `window_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
};

export const lockSlice = createSlice({
  name: 'lock',
  initialState,
  reducers: {
    acquireLock: (state) => {
      state.activeWindowId = state.thisWindowId;
      state.isLockedByOther = false;
    },
    setLock: (state, action: PayloadAction<string | null>) => {
      state.activeWindowId = action.payload;
      state.isLockedByOther = state.activeWindowId !== null && state.activeWindowId !== state.thisWindowId;
    },
    releaseLock: (state) => {
      if (state.activeWindowId === state.thisWindowId) {
        state.activeWindowId = null;
        state.isLockedByOther = false;
      }
    },
  },
});

export const { acquireLock, setLock, releaseLock } = lockSlice.actions;

export default lockSlice.reducer;
