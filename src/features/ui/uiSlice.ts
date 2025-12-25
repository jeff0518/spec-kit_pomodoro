// I missed uiSlice in the previous batch, adding it here.
import { createSlice } from '@reduxjs/toolkit';

export interface UIState {
  isSoundEnabled: boolean;
  notification: string | null;
}

const initialState: UIState = {
  isSoundEnabled: true,
  notification: null,
};

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    // Reducers can be added later e.g. toggleSound, setNotification
  },
});

export const { } = uiSlice.actions;

export default uiSlice.reducer;
