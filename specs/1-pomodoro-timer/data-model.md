# 資料模型：番茄鐘應用

**分支**: `1-pomodoro-timer` | **日期**: 2025-12-18

本文件定義番茄鐘應用的核心資料結構、Redux 狀態樹、localStorage 儲存格式，以及資料流轉機制。

---

## 核心實體定義

### 1. WorkMode（工作模式）

代表一種預設的番茄鐘工作模式，包含預設時間與場景說明。

```typescript
interface WorkMode {
  id: "quick-start" | "study" | "focus" | "deep-work";
  name: string; // 中文名稱：快速啟動、學習模式、專注模式、深度工作
  defaultFocusMinutes: number; // 預設專注時間（分鐘）
  defaultBreakMinutes: number; // 預設休息時間（分鐘）
  description: string; // 適合場景說明
  color: string; // Tailwind 顏色類別（如 'bg-green-500'）
}
```

**範例實例**：

```typescript
const WORK_MODES: WorkMode[] = [
  {
    id: "quick-start",
    name: "快速啟動",
    defaultFocusMinutes: 20,
    defaultBreakMinutes: 5,
    description: "快速處理小任務、初次使用番茄鐘技巧、需要頻繁休息的工作",
    color: "bg-green-500",
  },
  {
    id: "study",
    name: "學習模式",
    defaultFocusMinutes: 30,
    defaultBreakMinutes: 5,
    description: "閱讀、學習新知識、溫習功課、需要專注但不過度疲勞",
    color: "bg-blue-500",
  },
  {
    id: "focus",
    name: "專注模式",
    defaultFocusMinutes: 50,
    defaultBreakMinutes: 10,
    description: "程式開發、寫作、設計工作、需要長時間專注的創作任務",
    color: "bg-orange-500",
  },
  {
    id: "deep-work",
    name: "深度工作",
    defaultFocusMinutes: 75,
    defaultBreakMinutes: 15,
    description: "複雜問題解決、深度思考、大型專案推進、高強度腦力工作",
    color: "bg-purple-500",
  },
];
```

**約束條件**：

- `id` 必須唯一且不可變更（作為識別鍵）
- `defaultFocusMinutes` 範圍：5-90 分鐘
- `defaultBreakMinutes` 範圍：1-30 分鐘
- `color` 必須為有效的 Tailwind CSS 類別名稱

---

### 2. TimerState（計時器狀態）

代表當前計時器的即時狀態，用於 Redux 狀態管理與 localStorage 持久化。

```typescript
type TimerStateEnum =
  | "idle" // 閒置（首頁、未開始計時）
  | "focusing" // 專注計時中
  | "resting" // 休息計時中
  | "paused" // 暫停中
  | "options"; // 選項畫面（休息結束後）

interface TimerState {
  state: TimerStateEnum;
  currentMode: WorkMode | null; // 當前選擇的模式
  focusMinutes: number; // 使用者調整後的專注時間（分鐘）
  breakMinutes: number; // 使用者調整後的休息時間（分鐘）
  remainingSeconds: number; // 剩餘秒數
  startTimestamp: number | null; // 計時開始的時間戳（毫秒），用於精確計算經過時間
  pausedAt: number | null; // 暫停時的時間戳（毫秒），用於計算暫停時長
  windowId: string; // 當前視窗的唯一識別碼（UUID）
}
```

**狀態轉換圖**：

```
idle → focusing (使用者點擊「開始專注」)
focusing → paused (使用者點擊「暂停」)
paused → focusing (使用者點擊「繼續」)
focusing → resting (專注時間結束)
resting → options (休息時間結束)
options → focusing (使用者點擊「繼續專注」)
options → idle (使用者點擊「返回首頁」)
focusing/resting/paused → idle (使用者點擊「停止」)
```

**約束條件**：

- `remainingSeconds` 必須 >= 0
- `startTimestamp` 在計時中（focusing/resting）時不可為 null
- `pausedAt` 僅在 `state === 'paused'` 時有值
- `windowId` 必須在應用初始化時生成（`crypto.randomUUID()`）

---

### 3. FocusRecord（專注紀錄）

代表一次完成或中斷的專注紀錄，儲存於 localStorage。

```typescript
interface FocusRecord {
  id: string; // 唯一識別碼（UUID）
  timestamp: number; // 紀錄建立時間（毫秒），用於排序與 3 個月過濾
  modeId: WorkMode["id"]; // 工作模式 ID
  modeName: string; // 工作模式名稱（冗餘欄位，避免查找）
  focusMinutes: number; // 計畫專注時間（分鐘）
  actualFocusMinutes: number; // 實際專注時間（分鐘）
  isCompleted: boolean; // 是否完整完成（true: 完整完成, false: 提前中斷）
}
```

**計算規則**：

- `actualFocusMinutes` = 實際專注秒數 / 60，無條件進位至整數
  - 例如：專注 18 分 30 秒 → actualFocusMinutes = 19
- `isCompleted` 判斷：
  - 計時器自然倒數至 0 秒 → `true`
  - 使用者點擊「停止」按鈕 → `false`

**範例實例**：

```typescript
const record: FocusRecord = {
  id: "550e8400-e29b-41d4-a716-446655440000",
  timestamp: 1703001600000, // 2023-12-19 20:00:00
  modeId: "study",
  modeName: "學習模式",
  focusMinutes: 30,
  actualFocusMinutes: 28, // 提前 2 分鐘停止
  isCompleted: false,
};
```

**約束條件**：

- `id` 必須唯一（UUID v4）
- `actualFocusMinutes` 必須 > 0（最小計時 1 秒即創建紀錄）
- `actualFocusMinutes` <= `focusMinutes`（實際時間不可超過計畫時間）

---

### 4. WindowLock（視窗鎖定）

用於多視窗同步機制，確保只有一個視窗可計時。

```typescript
interface WindowLock {
  windowId: string; // 持有鎖定的視窗 ID
  timestamp: number; // 鎖定建立時間（毫秒）
  state: TimerStateEnum; // 鎖定時的計時器狀態（用於接管恢復）
}
```

**鎖定機制規則**：

1. **獲取鎖定**：視窗開始計時時，寫入 `windowId` 和當前時間戳
2. **檢查鎖定**：其他視窗載入時，檢查 localStorage 中的 `windowId` 是否與自己相同
3. **釋放鎖定**：計時結束或停止時，移除 localStorage 中的鎖定資料
4. **接管鎖定**：使用者點擊「接管計時」時，更新 `windowId` 為當前視窗

**約束條件**：

- `timestamp` 用於檢測過期鎖定（超過 10 分鐘無更新視為過期）
- 鎖定檢查應在每個計時 tick 時觸發（每秒一次）

---

## Redux 狀態樹結構

### 完整狀態樹

```typescript
interface RootState {
  timer: TimerState;
  history: HistoryState;
  lock: LockState;
  ui: UIState;
}
```

---

### 1. timer Slice

```typescript
interface TimerState {
  state: TimerStateEnum;
  currentMode: WorkMode | null;
  focusMinutes: number;
  breakMinutes: number;
  remainingSeconds: number;
  startTimestamp: number | null;
  pausedAt: number | null;
  windowId: string;
}

// Actions
const timerSlice = createSlice({
  name: "timer",
  initialState: {
    state: "idle",
    currentMode: null,
    focusMinutes: 0,
    breakMinutes: 0,
    remainingSeconds: 0,
    startTimestamp: null,
    pausedAt: null,
    windowId: crypto.randomUUID(),
  } as TimerState,
  reducers: {
    selectMode(state, action: PayloadAction<WorkMode>) {
      state.currentMode = action.payload;
      state.focusMinutes = action.payload.defaultFocusMinutes;
      state.breakMinutes = action.payload.defaultBreakMinutes;
    },
    adjustFocusTime(state, action: PayloadAction<number>) {
      // ±5 分鐘，範圍 5-90
      state.focusMinutes = Math.max(
        5,
        Math.min(90, state.focusMinutes + action.payload)
      );
    },
    adjustBreakTime(state, action: PayloadAction<number>) {
      // ±1 分鐘，範圍 1-30
      state.breakMinutes = Math.max(
        1,
        Math.min(30, state.breakMinutes + action.payload)
      );
    },
    startFocus(state) {
      state.state = "focusing";
      state.remainingSeconds = state.focusMinutes * 60;
      state.startTimestamp = Date.now();
      state.pausedAt = null;
    },
    startBreak(state) {
      state.state = "resting";
      state.remainingSeconds = state.breakMinutes * 60;
      state.startTimestamp = Date.now();
      state.pausedAt = null;
    },
    pause(state) {
      state.state = "paused";
      state.pausedAt = Date.now();
    },
    resume(state) {
      if (state.pausedAt && state.startTimestamp) {
        const pauseDuration = Date.now() - state.pausedAt;
        state.startTimestamp += pauseDuration; // 調整開始時間以補償暫停時長
      }
      state.state = state.remainingSeconds > 0 ? "focusing" : "resting";
      state.pausedAt = null;
    },
    tick(state) {
      if (state.state === "focusing" || state.state === "resting") {
        if (state.startTimestamp) {
          const elapsed = Math.floor(
            (Date.now() - state.startTimestamp) / 1000
          );
          const total =
            state.state === "focusing"
              ? state.focusMinutes * 60
              : state.breakMinutes * 60;
          state.remainingSeconds = Math.max(0, total - elapsed);
        }
      }
    },
    timerEnd(state) {
      if (state.state === "focusing") {
        state.state = "resting";
        state.remainingSeconds = state.breakMinutes * 60;
        state.startTimestamp = Date.now();
      } else if (state.state === "resting") {
        state.state = "options";
        state.remainingSeconds = 0;
        state.startTimestamp = null;
      }
    },
    stop(state) {
      state.state = "idle";
      state.remainingSeconds = 0;
      state.startTimestamp = null;
      state.pausedAt = null;
    },
    restoreState(state, action: PayloadAction<Partial<TimerState>>) {
      return { ...state, ...action.payload };
    },
  },
});
```

---

### 2. history Slice

```typescript
interface HistoryState {
  records: FocusRecord[];
  filterMonth: string | null; // 格式：'YYYY-MM' 或 null（顯示全部）
  viewMode: "list" | "chart"; // 列表檢視 / 月圖表檢視
}

const historySlice = createSlice({
  name: "history",
  initialState: {
    records: [],
    filterMonth: null,
    viewMode: "list",
  } as HistoryState,
  reducers: {
    addRecord(state, action: PayloadAction<FocusRecord>) {
      state.records.unshift(action.payload); // 新紀錄加到最前面
    },
    updateRecord(state, action: PayloadAction<FocusRecord>) {
      const index = state.records.findIndex((r) => r.id === action.payload.id);
      if (index !== -1) {
        state.records[index] = action.payload;
      }
    },
    deleteRecord(state, action: PayloadAction<string>) {
      state.records = state.records.filter((r) => r.id !== action.payload);
    },
    setFilterMonth(state, action: PayloadAction<string | null>) {
      state.filterMonth = action.payload;
    },
    setViewMode(state, action: PayloadAction<"list" | "chart">) {
      state.viewMode = action.payload;
    },
    loadRecords(state, action: PayloadAction<FocusRecord[]>) {
      state.records = action.payload;
    },
    cleanupOldRecords(state) {
      const threeMonthsAgo = Date.now() - 90 * 24 * 60 * 60 * 1000;
      state.records = state.records.filter((r) => r.timestamp > threeMonthsAgo);
    },
  },
});
```

---

### 3. lock Slice

```typescript
interface LockState {
  activeWindowId: string | null; // 當前持有鎖定的視窗 ID
  isLockedByOther: boolean; // 當前視窗是否被其他視窗鎖定
}

const lockSlice = createSlice({
  name: "lock",
  initialState: {
    activeWindowId: null,
    isLockedByOther: false,
  } as LockState,
  reducers: {
    acquireLock(state, action: PayloadAction<string>) {
      state.activeWindowId = action.payload;
      state.isLockedByOther = false;
    },
    releaseLock(state) {
      state.activeWindowId = null;
      state.isLockedByOther = false;
    },
    detectLock(
      state,
      action: PayloadAction<{ windowId: string; currentWindowId: string }>
    ) {
      state.activeWindowId = action.payload.windowId;
      state.isLockedByOther =
        action.payload.windowId !== action.payload.currentWindowId;
    },
  },
});
```

---

### 4. ui Slice（輔助 UI 狀態）

```typescript
interface UIState {
  isAudioEnabled: boolean; // 是否啟用音效
  showLockWarning: boolean; // 是否顯示「其他視窗計時中」警告
  notification: {
    message: string | null;
    type: "info" | "warning" | "error" | null;
  };
}

const uiSlice = createSlice({
  name: "ui",
  initialState: {
    isAudioEnabled: true,
    showLockWarning: false,
    notification: { message: null, type: null },
  } as UIState,
  reducers: {
    toggleAudio(state) {
      state.isAudioEnabled = !state.isAudioEnabled;
    },
    setLockWarning(state, action: PayloadAction<boolean>) {
      state.showLockWarning = action.payload;
    },
    showNotification(
      state,
      action: PayloadAction<{
        message: string;
        type: "info" | "warning" | "error";
      }>
    ) {
      state.notification = action.payload;
    },
    clearNotification(state) {
      state.notification = { message: null, type: null };
    },
  },
});
```

---

## localStorage 儲存格式

### 1. 歷史紀錄（`pomodoro_history`）

```typescript
interface StoredHistory {
  version: number; // 資料版本號（目前為 1）
  records: FocusRecord[];
  lastCleanup: number; // 最後清理時間戳（毫秒）
}

// 範例
const storedHistory: StoredHistory = {
  version: 1,
  records: [
    {
      id: "550e8400-e29b-41d4-a716-446655440000",
      timestamp: 1703001600000,
      modeId: "study",
      modeName: "學習模式",
      focusMinutes: 30,
      actualFocusMinutes: 30,
      isCompleted: true,
    },
    // ... 更多紀錄
  ],
  lastCleanup: 1703001600000,
};

localStorage.setItem("pomodoro_history", JSON.stringify(storedHistory));
```

**清理機制**：

- 每次讀取時檢查 `lastCleanup`，若距今超過 24 小時則執行清理
- 清理邏輯：移除 `timestamp < (Date.now() - 90天)` 的紀錄
- 清理後更新 `lastCleanup` 為當前時間

---

### 2. 計時器狀態（`pomodoro_timer_state`）

```typescript
interface StoredTimerState {
  state: TimerStateEnum;
  currentMode: WorkMode | null;
  focusMinutes: number;
  breakMinutes: number;
  remainingSeconds: number;
  startTimestamp: number;
  windowId: string;
}

// 範例
const storedTimerState: StoredTimerState = {
  state: "focusing",
  currentMode: {
    id: "study",
    name: "學習模式",
    defaultFocusMinutes: 30,
    defaultBreakMinutes: 5,
    description: "...",
    color: "bg-blue-500",
  },
  focusMinutes: 30,
  breakMinutes: 5,
  remainingSeconds: 1200, // 20:00
  startTimestamp: 1703001600000,
  windowId: "abc-123-def-456",
};

localStorage.setItem("pomodoro_timer_state", JSON.stringify(storedTimerState));
```

**寫入時機**：

- 計時器每次 tick（每秒）時更新
- 使用防抖（debounce 500ms）避免過度寫入

**恢復邏輯**：

```typescript
function restoreTimerState(
  stored: StoredTimerState,
  currentTime: number
): TimerState {
  const elapsed = Math.floor((currentTime - stored.startTimestamp) / 1000);
  const totalSeconds =
    stored.state === "focusing"
      ? stored.focusMinutes * 60
      : stored.breakMinutes * 60;
  const remainingSeconds = Math.max(0, totalSeconds - elapsed);

  return {
    ...stored,
    remainingSeconds,
    startTimestamp: stored.startTimestamp,
  };
}
```

---

### 3. 視窗鎖定（`pomodoro_window_lock`）

```typescript
interface StoredWindowLock {
  windowId: string;
  timestamp: number;
  state: TimerStateEnum;
}

// 範例
const storedLock: StoredWindowLock = {
  windowId: "abc-123-def-456",
  timestamp: 1703001600000,
  state: "focusing",
};

localStorage.setItem("pomodoro_window_lock", JSON.stringify(storedLock));
```

**過期檢測**：

```typescript
function isLockExpired(lock: StoredWindowLock, now: number): boolean {
  return now - lock.timestamp > 10 * 60 * 1000; // 超過 10 分鐘視為過期
}
```

---

## 資料流轉圖

### 1. 計時流程資料流

```
使用者選擇模式
  ↓
selectMode(WorkMode) → timer.currentMode, focusMinutes, breakMinutes
  ↓
調整時間（可選）
  ↓
adjustFocusTime(±5) / adjustBreakTime(±1) → timer.focusMinutes, breakMinutes
  ↓
點擊「開始專注」
  ↓
startFocus() → timer.state = 'focusing', startTimestamp = Date.now()
  ↓
acquireLock(windowId) → lock.activeWindowId = windowId
  ↓
localStorage.setItem('pomodoro_window_lock', {...})
  ↓
每秒 tick()
  ↓
計算 remainingSeconds = total - (Date.now() - startTimestamp) / 1000
  ↓
localStorage.setItem('pomodoro_timer_state', {...}) // debounced
  ↓
remainingSeconds === 0
  ↓
timerEnd() → state = 'resting', startTimestamp = Date.now()
  ↓
addRecord(FocusRecord) → history.records.unshift(record)
  ↓
localStorage.setItem('pomodoro_history', {...})
  ↓
休息結束
  ↓
timerEnd() → state = 'options'
  ↓
releaseLock() → lock.activeWindowId = null
  ↓
localStorage.removeItem('pomodoro_window_lock')
```

---

### 2. 瀏覽器重新載入恢復流程

```
頁面載入
  ↓
讀取 localStorage.getItem('pomodoro_timer_state')
  ↓
存在計時狀態？
  Yes ↓                                   No ↓
  計算實際剩餘時間                         顯示首頁（idle 狀態）
    elapsed = Date.now() - startTimestamp
    remainingSeconds = total - elapsed
  ↓
  restoreState(StoredTimerState)
  ↓
  檢查 localStorage.getItem('pomodoro_window_lock')
  ↓
  windowId 相符？
    Yes ↓                                   No ↓
    繼續計時（tick）                        顯示鎖定警告 + 「接管計時」按鈕
```

---

### 3. 多視窗同步流程

```
視窗 A 開始計時
  ↓
acquireLock(windowId_A)
  ↓
localStorage.setItem('pomodoro_window_lock', { windowId: 'A', ... })
  ↓
StorageEvent 觸發（視窗 B 監聽到）
  ↓
視窗 B 執行 detectLock()
  ↓
windowId_A !== windowId_B
  ↓
setLockWarning(true) → ui.showLockWarning = true
  ↓
顯示「其他視窗正在計時中」+ 「接管計時」按鈕
  ↓
使用者點擊「接管計時」
  ↓
acquireLock(windowId_B)
  ↓
localStorage.setItem('pomodoro_window_lock', { windowId: 'B', ... })
  ↓
restoreState(StoredTimerState)
  ↓
視窗 B 開始計時，視窗 A 顯示鎖定警告
```

---

## 資料驗證與錯誤處理

### 1. localStorage 容量不足

```typescript
function safeWrite(key: string, value: any): boolean {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    if (error instanceof DOMException && error.name === "QuotaExceededError") {
      // 嘗試清理舊紀錄
      const history = getHistory();
      if (history.records.length > 100) {
        history.records = history.records.slice(0, 100); // 只保留最近 100 筆
        try {
          localStorage.setItem("pomodoro_history", JSON.stringify(history));
          localStorage.setItem(key, JSON.stringify(value)); // 重試
          return true;
        } catch {
          showNotification({
            message: "儲存空間不足，請手動刪除部分歷史紀錄",
            type: "error",
          });
          return false;
        }
      }
    }
    return false;
  }
}
```

---

### 2. 資料格式驗證

```typescript
function validateFocusRecord(record: any): record is FocusRecord {
  return (
    typeof record.id === "string" &&
    typeof record.timestamp === "number" &&
    typeof record.modeId === "string" &&
    typeof record.modeName === "string" &&
    typeof record.focusMinutes === "number" &&
    typeof record.actualFocusMinutes === "number" &&
    typeof record.isCompleted === "boolean" &&
    record.actualFocusMinutes > 0 &&
    record.actualFocusMinutes <= record.focusMinutes
  );
}

function loadHistory(): StoredHistory {
  const raw = localStorage.getItem("pomodoro_history");
  if (!raw) return { version: 1, records: [], lastCleanup: Date.now() };

  try {
    const data = JSON.parse(raw);
    if (data.version !== 1) {
      // 版本不符，執行遷移或重置
      return { version: 1, records: [], lastCleanup: Date.now() };
    }
    const validRecords = data.records.filter(validateFocusRecord);
    return { ...data, records: validRecords };
  } catch {
    return { version: 1, records: [], lastCleanup: Date.now() };
  }
}
```

---

### 3. 時間戳異常檢測

```typescript
function detectTimeJump(startTimestamp: number, now: number): boolean {
  const elapsed = now - startTimestamp;
  const maxElapsed = 100 * 60 * 1000; // 100 分鐘（超過任何模式的最大時長）

  if (elapsed < 0 || elapsed > maxElapsed) {
    // 系統時間異常（時間回撥或大幅跳躍）
    showNotification({
      message: "偵測到系統時間異常，計時器已重置",
      type: "warning",
    });
    return true;
  }
  return false;
}
```

---

## 效能優化策略

### 1. localStorage 讀寫優化

- **讀取**：應用啟動時一次性讀取全部資料至 Redux
- **寫入**：使用 Redux middleware 監聽特定 actions 並寫入（避免手動同步）

```typescript
// localStorage middleware
const localStorageMiddleware: Middleware = (store) => (next) => (action) => {
  const result = next(action);

  // 監聽需要持久化的 actions
  if (action.type.startsWith("history/")) {
    const state = store.getState();
    safeWrite("pomodoro_history", {
      version: 1,
      records: state.history.records,
      lastCleanup: Date.now(),
    });
  }

  if (action.type.startsWith("timer/") && action.type !== "timer/tick") {
    const state = store.getState();
    debouncedWrite("pomodoro_timer_state", state.timer);
  }

  return result;
};
```

---

### 2. 大量紀錄渲染優化

- 使用 `react-window` 虛擬化列表（僅當紀錄數 > 100 時）
- 月份篩選在 Redux selector 層級進行（使用 `createSelector` 快取）

```typescript
import { createSelector } from "@reduxjs/toolkit";

const selectFilteredRecords = createSelector(
  [
    (state: RootState) => state.history.records,
    (state: RootState) => state.history.filterMonth,
  ],
  (records, filterMonth) => {
    if (!filterMonth) return records;
    return records.filter((r) => {
      const date = new Date(r.timestamp);
      const month = `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, "0")}`;
      return month === filterMonth;
    });
  }
);
```

---

## 資料遷移策略

### 版本升級範例（v1 → v2）

```typescript
function migrateHistory(data: any): StoredHistory {
  if (data.version === 1) {
    // v1 → v2: 新增 modeColor 欄位
    return {
      version: 2,
      records: data.records.map((r: any) => ({
        ...r,
        modeColor: getModeColor(r.modeId),
      })),
      lastCleanup: data.lastCleanup,
    };
  }
  return data;
}
```

---

## 總結

本資料模型文件定義了：

1. **4 個核心實體**：WorkMode, TimerState, FocusRecord, WindowLock
2. **Redux 狀態樹**：timer, history, lock, ui 四個 slices
3. **localStorage 格式**：3 個 key 的儲存結構與恢復邏輯
4. **資料流轉**：計時、恢復、多視窗同步的完整流程
5. **錯誤處理**：容量不足、資料驗證、時間異常檢測
6. **效能優化**：middleware 自動持久化、虛擬化列表、selector 快取

下一步將進入 **contracts/** 目錄，生成完整的 TypeScript 介面定義與型別守衛函數。
