/**
 * 型別定義：番茄鐘應用核心實體
 * 
 * 本檔案定義所有核心資料結構的 TypeScript 介面，
 * 確保前端應用的型別安全與一致性。
 * 
 * @module types
 */

// ============================================================================
// 工作模式（Work Mode）
// ============================================================================

/**
 * 工作模式 ID 列舉
 */
export type WorkModeId = 'quick-start' | 'study' | 'focus' | 'deep-work';

/**
 * 工作模式
 * 
 * 代表一種預設的番茄鐘工作模式，包含預設時間與場景說明。
 */
export interface WorkMode {
  /** 唯一識別碼 */
  id: WorkModeId;
  
  /** 中文名稱（如：快速啟動、學習模式） */
  name: string;
  
  /** 預設專注時間（分鐘），範圍：5-90 */
  defaultFocusMinutes: number;
  
  /** 預設休息時間（分鐘），範圍：1-30 */
  defaultBreakMinutes: number;
  
  /** 適合場景說明 */
  description: string;
  
  /** Tailwind CSS 顏色類別（如：'bg-green-500'） */
  color: string;
}

/**
 * 預設工作模式常數
 */
export const WORK_MODES: Record<WorkModeId, WorkMode> = {
  'quick-start': {
    id: 'quick-start',
    name: '快速啟動',
    defaultFocusMinutes: 20,
    defaultBreakMinutes: 5,
    description: '快速處理小任務、初次使用番茄鐘技巧、需要頻繁休息的工作',
    color: 'bg-green-500',
  },
  study: {
    id: 'study',
    name: '學習模式',
    defaultFocusMinutes: 30,
    defaultBreakMinutes: 5,
    description: '閱讀、學習新知識、溫習功課、需要專注但不過度疲勞',
    color: 'bg-blue-500',
  },
  focus: {
    id: 'focus',
    name: '專注模式',
    defaultFocusMinutes: 50,
    defaultBreakMinutes: 10,
    description: '程式開發、寫作、設計工作、需要長時間專注的創作任務',
    color: 'bg-orange-500',
  },
  'deep-work': {
    id: 'deep-work',
    name: '深度工作',
    defaultFocusMinutes: 75,
    defaultBreakMinutes: 15,
    description: '複雜問題解決、深度思考、大型專案推進、高強度腦力工作',
    color: 'bg-purple-500',
  },
};

// ============================================================================
// 計時器狀態（Timer State）
// ============================================================================

/**
 * 計時器狀態列舉
 */
export type TimerStateEnum =
  | 'idle'       // 閒置（首頁、未開始計時）
  | 'focusing'   // 專注計時中
  | 'resting'    // 休息計時中
  | 'paused'     // 暫停中
  | 'options';   // 選項畫面（休息結束後）

/**
 * 計時器狀態
 * 
 * 代表當前計時器的即時狀態，用於 Redux 狀態管理與 localStorage 持久化。
 */
export interface TimerState {
  /** 當前狀態 */
  state: TimerStateEnum;
  
  /** 當前選擇的工作模式 */
  currentMode: WorkMode | null;
  
  /** 使用者調整後的專注時間（分鐘），範圍：5-90 */
  focusMinutes: number;
  
  /** 使用者調整後的休息時間（分鐘），範圍：1-30 */
  breakMinutes: number;
  
  /** 剩餘秒數 */
  remainingSeconds: number;
  
  /** 計時開始的時間戳（毫秒），用於精確計算經過時間 */
  startTimestamp: number | null;
  
  /** 暫停時的時間戳（毫秒），用於計算暫停時長 */
  pausedAt: number | null;
  
  /** 當前視窗的唯一識別碼（UUID） */
  windowId: string;
}

/**
 * 計時器狀態初始值
 */
export const initialTimerState: TimerState = {
  state: 'idle',
  currentMode: null,
  focusMinutes: 0,
  breakMinutes: 0,
  remainingSeconds: 0,
  startTimestamp: null,
  pausedAt: null,
  windowId: '', // 應在應用初始化時設為 crypto.randomUUID()
};

// ============================================================================
// 專注紀錄（Focus Record）
// ============================================================================

/**
 * 專注紀錄
 * 
 * 代表一次完成或中斷的專注紀錄，儲存於 localStorage。
 */
export interface FocusRecord {
  /** 唯一識別碼（UUID v4） */
  id: string;
  
  /** 紀錄建立時間（毫秒），用於排序與 3 個月過濾 */
  timestamp: number;
  
  /** 工作模式 ID */
  modeId: WorkModeId;
  
  /** 工作模式名稱（冗餘欄位，避免查找） */
  modeName: string;
  
  /** 計畫專注時間（分鐘） */
  focusMinutes: number;
  
  /** 實際專注時間（分鐘），無條件進位至整數 */
  actualFocusMinutes: number;
  
  /** 是否完整完成（true: 完整完成, false: 提前中斷） */
  isCompleted: boolean;
}

// ============================================================================
// 視窗鎖定（Window Lock）
// ============================================================================

/**
 * 視窗鎖定
 * 
 * 用於多視窗同步機制，確保只有一個視窗可計時。
 */
export interface WindowLock {
  /** 持有鎖定的視窗 ID（UUID） */
  windowId: string;
  
  /** 鎖定建立時間（毫秒） */
  timestamp: number;
  
  /** 鎖定時的計時器狀態（用於接管恢復） */
  state: TimerStateEnum;
}

// ============================================================================
// Redux 狀態樹（Root State）
// ============================================================================

/**
 * 歷史紀錄狀態
 */
export interface HistoryState {
  /** 專注紀錄列表 */
  records: FocusRecord[];
  
  /** 月份篩選器（格式：'YYYY-MM'），null 表示顯示全部 */
  filterMonth: string | null;
  
  /** 檢視模式：列表 / 月圖表 */
  viewMode: 'list' | 'chart';
}

/**
 * 鎖定狀態
 */
export interface LockState {
  /** 當前持有鎖定的視窗 ID */
  activeWindowId: string | null;
  
  /** 當前視窗是否被其他視窗鎖定 */
  isLockedByOther: boolean;
}

/**
 * UI 狀態
 */
export interface UIState {
  /** 是否啟用音效 */
  isAudioEnabled: boolean;
  
  /** 是否顯示「其他視窗計時中」警告 */
  showLockWarning: boolean;
  
  /** 通知訊息 */
  notification: {
    message: string | null;
    type: 'info' | 'warning' | 'error' | null;
  };
}

/**
 * Redux 根狀態樹
 */
export interface RootState {
  timer: TimerState;
  history: HistoryState;
  lock: LockState;
  ui: UIState;
}

// ============================================================================
// localStorage 儲存格式
// ============================================================================

/**
 * 儲存的歷史紀錄格式
 */
export interface StoredHistory {
  /** 資料版本號（目前為 1） */
  version: number;
  
  /** 專注紀錄列表 */
  records: FocusRecord[];
  
  /** 最後清理時間戳（毫秒） */
  lastCleanup: number;
}

/**
 * 儲存的計時器狀態格式
 */
export interface StoredTimerState {
  /** 當前狀態 */
  state: TimerStateEnum;
  
  /** 當前工作模式 */
  currentMode: WorkMode | null;
  
  /** 專注時間（分鐘） */
  focusMinutes: number;
  
  /** 休息時間（分鐘） */
  breakMinutes: number;
  
  /** 剩餘秒數 */
  remainingSeconds: number;
  
  /** 開始時間戳（毫秒） */
  startTimestamp: number;
  
  /** 視窗 ID */
  windowId: string;
}

/**
 * 儲存的視窗鎖定格式
 */
export interface StoredWindowLock {
  /** 視窗 ID */
  windowId: string;
  
  /** 時間戳（毫秒） */
  timestamp: number;
  
  /** 計時器狀態 */
  state: TimerStateEnum;
}

// ============================================================================
// localStorage Key 常數
// ============================================================================

/**
 * localStorage 鍵名常數
 */
export const STORAGE_KEYS = {
  /** 歷史紀錄 */
  HISTORY: 'pomodoro_history',
  
  /** 計時器狀態 */
  TIMER_STATE: 'pomodoro_timer_state',
  
  /** 視窗鎖定 */
  LOCK: 'pomodoro_window_lock',
} as const;

// ============================================================================
// 型別守衛（Type Guards）
// ============================================================================

/**
 * 檢查是否為有效的工作模式 ID
 */
export function isWorkModeId(value: unknown): value is WorkModeId {
  return typeof value === 'string' && value in WORK_MODES;
}

/**
 * 檢查是否為有效的計時器狀態
 */
export function isTimerStateEnum(value: unknown): value is TimerStateEnum {
  return (
    typeof value === 'string' &&
    ['idle', 'focusing', 'resting', 'paused', 'options'].includes(value)
  );
}

/**
 * 驗證專注紀錄格式
 */
export function validateFocusRecord(record: unknown): record is FocusRecord {
  if (typeof record !== 'object' || record === null) return false;
  
  const r = record as FocusRecord;
  
  return (
    typeof r.id === 'string' &&
    typeof r.timestamp === 'number' &&
    isWorkModeId(r.modeId) &&
    typeof r.modeName === 'string' &&
    typeof r.focusMinutes === 'number' &&
    typeof r.actualFocusMinutes === 'number' &&
    typeof r.isCompleted === 'boolean' &&
    r.actualFocusMinutes > 0 &&
    r.actualFocusMinutes <= r.focusMinutes &&
    r.focusMinutes >= 5 &&
    r.focusMinutes <= 90
  );
}

/**
 * 驗證儲存的歷史紀錄格式
 */
export function validateStoredHistory(data: unknown): data is StoredHistory {
  if (typeof data !== 'object' || data === null) return false;
  
  const d = data as StoredHistory;
  
  return (
    typeof d.version === 'number' &&
    Array.isArray(d.records) &&
    d.records.every(validateFocusRecord) &&
    typeof d.lastCleanup === 'number'
  );
}

/**
 * 驗證儲存的計時器狀態格式
 */
export function validateStoredTimerState(data: unknown): data is StoredTimerState {
  if (typeof data !== 'object' || data === null) return false;
  
  const d = data as StoredTimerState;
  
  return (
    isTimerStateEnum(d.state) &&
    (d.currentMode === null || (typeof d.currentMode === 'object' && isWorkModeId(d.currentMode.id))) &&
    typeof d.focusMinutes === 'number' &&
    typeof d.breakMinutes === 'number' &&
    typeof d.remainingSeconds === 'number' &&
    typeof d.startTimestamp === 'number' &&
    typeof d.windowId === 'string' &&
    d.focusMinutes >= 5 &&
    d.focusMinutes <= 90 &&
    d.breakMinutes >= 1 &&
    d.breakMinutes <= 30 &&
    d.remainingSeconds >= 0
  );
}

/**
 * 驗證儲存的視窗鎖定格式
 */
export function validateStoredWindowLock(data: unknown): data is StoredWindowLock {
  if (typeof data !== 'object' || data === null) return false;
  
  const d = data as StoredWindowLock;
  
  return (
    typeof d.windowId === 'string' &&
    typeof d.timestamp === 'number' &&
    isTimerStateEnum(d.state)
  );
}

// ============================================================================
// 工具型別（Utility Types）
// ============================================================================

/**
 * 月份統計資料
 */
export interface MonthlyStats {
  /** 月份（格式：'YYYY-MM'） */
  month: string;
  
  /** 總專注時數（小時） */
  totalHours: number;
  
  /** 各模式的時長（分鐘） */
  modeBreakdown: Record<WorkModeId, number>;
  
  /** 完成的番茄鐘數量 */
  completedCount: number;
  
  /** 未完成的番茄鐘數量 */
  incompletedCount: number;
}

/**
 * 時間顯示格式（MM:SS）
 */
export interface TimeDisplay {
  /** 分鐘 */
  minutes: number;
  
  /** 秒數 */
  seconds: number;
  
  /** 格式化字串（如：'25:30'） */
  formatted: string;
}

/**
 * 可用月份選項
 */
export interface MonthOption {
  /** 月份值（格式：'YYYY-MM'） */
  value: string;
  
  /** 顯示標籤（如：'2023年12月'） */
  label: string;
}
