/**
 * Redux Actions 定義：番茄鐘應用
 * 
 * 本檔案定義所有 Redux slices 的 actions 型別，
 * 包含 timer、history、lock、ui 四個 slices。
 * 
 * @module actions
 */

import type { PayloadAction } from '@reduxjs/toolkit';
import type {
  WorkMode,
  TimerState,
  FocusRecord,
  TimerStateEnum,
} from './types';

// ============================================================================
// Timer Slice Actions
// ============================================================================

/**
 * Timer Slice Action Types
 */
export interface TimerActions {
  /** 選擇工作模式 */
  selectMode: (mode: WorkMode) => PayloadAction<WorkMode>;
  
  /** 調整專注時間（±5 分鐘） */
  adjustFocusTime: (delta: number) => PayloadAction<number>;
  
  /** 調整休息時間（±1 分鐘） */
  adjustBreakTime: (delta: number) => PayloadAction<number>;
  
  /** 開始專注計時 */
  startFocus: () => PayloadAction<void>;
  
  /** 開始休息計時 */
  startBreak: () => PayloadAction<void>;
  
  /** 暫停計時 */
  pause: () => PayloadAction<void>;
  
  /** 繼續計時 */
  resume: () => PayloadAction<void>;
  
  /** 計時器 tick（每秒觸發） */
  tick: () => PayloadAction<void>;
  
  /** 計時結束（專注 → 休息 或 休息 → 選項） */
  timerEnd: () => PayloadAction<void>;
  
  /** 停止計時並返回首頁 */
  stop: () => PayloadAction<void>;
  
  /** 恢復計時器狀態（從 localStorage 載入） */
  restoreState: (state: Partial<TimerState>) => PayloadAction<Partial<TimerState>>;
}

// ============================================================================
// History Slice Actions
// ============================================================================

/**
 * History Slice Action Types
 */
export interface HistoryActions {
  /** 新增專注紀錄 */
  addRecord: (record: FocusRecord) => PayloadAction<FocusRecord>;
  
  /** 更新專注紀錄 */
  updateRecord: (record: FocusRecord) => PayloadAction<FocusRecord>;
  
  /** 刪除專注紀錄 */
  deleteRecord: (id: string) => PayloadAction<string>;
  
  /** 設定月份篩選器 */
  setFilterMonth: (month: string | null) => PayloadAction<string | null>;
  
  /** 設定檢視模式（列表 / 圖表） */
  setViewMode: (mode: 'list' | 'chart') => PayloadAction<'list' | 'chart'>;
  
  /** 載入所有紀錄（從 localStorage） */
  loadRecords: (records: FocusRecord[]) => PayloadAction<FocusRecord[]>;
  
  /** 清理超過 3 個月的舊紀錄 */
  cleanupOldRecords: () => PayloadAction<void>;
}

// ============================================================================
// Lock Slice Actions
// ============================================================================

/**
 * Lock Slice Action Types
 */
export interface LockActions {
  /** 獲取鎖定（開始計時時） */
  acquireLock: (windowId: string) => PayloadAction<string>;
  
  /** 釋放鎖定（計時結束時） */
  releaseLock: () => PayloadAction<void>;
  
  /** 偵測其他視窗的鎖定 */
  detectLock: (payload: { windowId: string; currentWindowId: string }) => 
    PayloadAction<{ windowId: string; currentWindowId: string }>;
}

// ============================================================================
// UI Slice Actions
// ============================================================================

/**
 * UI Slice Action Types
 */
export interface UIActions {
  /** 切換音效開關 */
  toggleAudio: () => PayloadAction<void>;
  
  /** 設定鎖定警告顯示狀態 */
  setLockWarning: (show: boolean) => PayloadAction<boolean>;
  
  /** 顯示通知訊息 */
  showNotification: (payload: { message: string; type: 'info' | 'warning' | 'error' }) => 
    PayloadAction<{ message: string; type: 'info' | 'warning' | 'error' }>;
  
  /** 清除通知訊息 */
  clearNotification: () => PayloadAction<void>;
}

// ============================================================================
// Action Creator Types（用於 dispatch）
// ============================================================================

/**
 * Timer Action Creators
 */
export type TimerActionCreators = {
  [K in keyof TimerActions]: TimerActions[K] extends (...args: infer P) => infer R
    ? (...args: P) => R
    : never;
};

/**
 * History Action Creators
 */
export type HistoryActionCreators = {
  [K in keyof HistoryActions]: HistoryActions[K] extends (...args: infer P) => infer R
    ? (...args: P) => R
    : never;
};

/**
 * Lock Action Creators
 */
export type LockActionCreators = {
  [K in keyof LockActions]: LockActions[K] extends (...args: infer P) => infer R
    ? (...args: P) => R
    : never;
};

/**
 * UI Action Creators
 */
export type UIActionCreators = {
  [K in keyof UIActions]: UIActions[K] extends (...args: infer P) => infer R
    ? (...args: P) => R
    : never;
};

// ============================================================================
// Thunk Action Types（非同步操作）
// ============================================================================

/**
 * Thunk 參數型別
 */
export interface ThunkAPI {
  dispatch: any;
  getState: () => any;
  extra?: any;
  requestId: string;
  signal: AbortSignal;
}

/**
 * 非同步 Actions
 */
export interface AsyncActions {
  /** 從 localStorage 初始化應用狀態 */
  initializeApp: () => void;
  
  /** 儲存計時器狀態至 localStorage */
  saveTimerState: () => void;
  
  /** 儲存歷史紀錄至 localStorage */
  saveHistory: () => void;
  
  /** 恢復計時器（頁面重新載入時） */
  restoreTimer: () => void;
  
  /** 播放通知音效 */
  playNotificationSound: () => void;
  
  /** 檢查並處理視窗鎖定 */
  checkWindowLock: () => void;
  
  /** 接管計時器（從其他視窗） */
  takeoverTimer: () => void;
}

// ============================================================================
// Action Payload Helpers
// ============================================================================

/**
 * 建立專注紀錄的參數
 */
export interface CreateRecordParams {
  /** 工作模式 */
  mode: WorkMode;
  
  /** 計畫專注時間（分鐘） */
  focusMinutes: number;
  
  /** 實際專注秒數 */
  actualFocusSeconds: number;
  
  /** 是否完整完成 */
  isCompleted: boolean;
}

/**
 * 更新紀錄的參數
 */
export interface UpdateRecordParams {
  /** 紀錄 ID */
  id: string;
  
  /** 要更新的欄位 */
  updates: Partial<Omit<FocusRecord, 'id' | 'timestamp'>>;
}

/**
 * 恢復計時器狀態的參數
 */
export interface RestoreTimerParams {
  /** 儲存的狀態 */
  state: TimerStateEnum;
  
  /** 工作模式 */
  currentMode: WorkMode | null;
  
  /** 專注時間（分鐘） */
  focusMinutes: number;
  
  /** 休息時間（分鐘） */
  breakMinutes: number;
  
  /** 剩餘秒數 */
  remainingSeconds: number;
  
  /** 開始時間戳 */
  startTimestamp: number;
  
  /** 視窗 ID */
  windowId: string;
}
