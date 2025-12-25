import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TimerState } from '../timer/timerSlice';

export interface FocusRecord {
  id: string;
  startTime: number;
  endTime: number;
  duration: number;
  mode: NonNullable<TimerState['mode']>;
}

export interface HistoryState {
  records: FocusRecord[];
}

const initialState: HistoryState = {
  records: [],
};

export const historySlice = createSlice({
  name: 'history',
  initialState,
  reducers: {
    addRecord: (state, action: PayloadAction<FocusRecord>) => {
      state.records.push(action.payload);
    },
    deleteRecord: (state, action: PayloadAction<string>) => {
      state.records = state.records.filter(record => record.id !== action.payload);
    },
    updateRecord: (state, action: PayloadAction<FocusRecord>) => {
      const index = state.records.findIndex(record => record.id === action.payload.id);
      if (index !== -1) {
        state.records[index] = action.payload;
      }
    },
  },
});

export const { addRecord, deleteRecord, updateRecord } = historySlice.actions;

export default historySlice.reducer;
