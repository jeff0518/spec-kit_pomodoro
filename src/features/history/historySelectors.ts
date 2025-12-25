import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { HistoryState } from './historySlice';

const selectHistory = (state: RootState): HistoryState => state.history;

export const selectAllRecords = createSelector(
  [selectHistory],
  (history) => history.records
);

export const selectSortedRecordsNewestFirst = createSelector(
  [selectAllRecords],
  (records) => [...records].sort((a, b) => b.startTime - a.startTime)
);
