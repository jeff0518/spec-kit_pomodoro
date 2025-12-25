import { describe, it, expect } from 'vitest';
import historyReducer, {
  addRecord,
  updateRecord,
  deleteRecord,
  HistoryState,
  FocusRecord,
} from '../../src/features/history/historySlice';

describe('history slice', () => {
  const initialState: HistoryState = {
    records: [],
  };

  const record1: FocusRecord = { id: '1', startTime: 1000, endTime: 2500, duration: 1500, mode: 'focus' };
  const record2: FocusRecord = { id: '2', startTime: 3000, endTime: 3300, duration: 300, mode: 'shortBreak' };

  it('should handle initial state', () => {
    expect(historyReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('should handle addRecord', () => {
    const state = historyReducer(initialState, addRecord(record1));
    expect(state.records).toHaveLength(1);
    expect(state.records[0]).toEqual(record1);
  });

  it('should handle deleteRecord', () => {
    const currentState: HistoryState = { records: [record1, record2] };
    const state = historyReducer(currentState, deleteRecord('1'));
    expect(state.records).toHaveLength(1);
    expect(state.records[0]).toEqual(record2);
  });

  it('should handle updateRecord', () => {
    const currentState: HistoryState = { records: [record1, record2] };
    const updatedRecord1 = { ...record1, duration: 1800 };
    const state = historyReducer(currentState, updateRecord(updatedRecord1));
    expect(state.records[0].duration).toEqual(1800);
  });
});
