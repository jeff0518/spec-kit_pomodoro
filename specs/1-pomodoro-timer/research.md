# 技術研究：番茄鐘應用

**分支**: `1-pomodoro-timer` | **日期**: 2025-12-18

本文件記錄番茄鐘應用的技術選型研究、最佳實踐調查，以及實作決策的理由。

## 研究範疇

根據功能規格，本應用需要解決以下技術問題：

1. **前端框架選擇**：選擇合適的框架建構單頁應用（SPA）
2. **狀態管理方案**：管理計時器狀態、歷史紀錄、多視窗同步
3. **本地資料持久化**：localStorage 的使用模式與容量管理
4. **計時器精確度**：JavaScript 定時器的精確度與改進方案
5. **多視窗通信**：視窗間的鎖定機制與狀態同步
6. **UI 組件庫與樣式方案**：快速建構響應式介面
7. **音效播放**：跨瀏覽器的音效播放相容性

---

## 技術選型決策

### 1. 前端框架：React 18+

**決策**：採用 **React 18.2+** 作為前端框架

**理由**：

- **生態系統成熟**：豐富的第三方庫、工具鏈完善（Vite、Create React App）
- **函數式組件與 Hooks**：現代化開發模式，狀態管理清晰（useState, useEffect, useReducer）
- **性能優化**：Virtual DOM、Concurrent Features（自動批次更新）適合計時器這類高頻更新場景
- **TypeScript 整合度高**：官方型別定義完善，開發體驗佳
- **社群資源豐富**：問題解決方案充足，學習曲線平緩

**替代方案評估**：

| 框架    | 優點                         | 為何未選擇                                        |
| ------- | ---------------------------- | ------------------------------------------------- |
| Vue 3   | 更簡潔的語法、更小的打包體積 | 團隊對 React 更熟悉，Redux 生態更成熟             |
| Svelte  | 編譯時優化、無 Virtual DOM   | 生態系統較小、狀態管理庫選擇較少                  |
| Vanilla | 無依賴、最小體積             | 開發效率低、狀態管理複雜、缺乏可重用組件系統      |
| Next.js | SSR/SSG 支援、路由內建       | 本應用無 SEO 需求、無伺服器端渲染需求、過度複雜化 |

---

### 2. 程式語言：TypeScript 5+

**決策**：採用 **TypeScript 5.0+** 進行開發

**理由**：

- **型別安全**：在編譯時期捕捉錯誤，減少執行期 bug（特別是狀態管理相關）
- **開發體驗**：IDE 自動補全、重構支援、即時錯誤提示
- **可維護性**：明確的介面定義（TimerState, FocusRecord, WorkMode）降低理解成本
- **Redux Toolkit 整合**：原生支援 TypeScript，reducers 和 actions 型別推導完善
- **長期價值**：隨專案擴展，型別系統價值倍增

**型別定義策略**：

- 為核心實體定義明確介面（WorkMode, TimerState, FocusRecord）
- 使用 discriminated unions 管理計時器狀態（focusing | resting | paused | stopped）
- 為 Redux actions 和 state 提供完整型別標註

---

### 3. 狀態管理：Redux Toolkit

**決策**：採用 **Redux Toolkit (RTK) 2.0+** 進行全域狀態管理

**理由**：

- **標準化最佳實踐**：內建 Immer（不可變更新）、Redux DevTools、中介軟體設定
- **減少樣板代碼**：createSlice 大幅簡化 actions/reducers 定義
- **TypeScript 整合**：自動推導 state 和 dispatch 型別
- **適合複雜狀態**：計時器狀態、歷史紀錄、多視窗鎖定等多個互動狀態
- **時間旅行除錯**：Redux DevTools 可回溯狀態變化，對計時器除錯極有價值

**狀態結構設計**：

```typescript
interface RootState {
  timer: {
    currentMode: WorkMode | null;
    state: "idle" | "focusing" | "resting" | "paused" | "options";
    remainingSeconds: number;
    startTimestamp: number | null;
    windowId: string;
  };
  history: {
    records: FocusRecord[];
    filter: {
      month: string | null;
    };
  };
  lock: {
    activeWindowId: string | null;
    lockTimestamp: number | null;
  };
}
```

**替代方案評估**：

| 方案           | 優點                   | 為何未選擇                                                     |
| -------------- | ---------------------- | -------------------------------------------------------------- |
| Zustand        | 更簡潔、無樣板代碼     | 缺乏時間旅行除錯、複雜狀態管理時結構較不清晰                   |
| Context API    | React 內建、無依賴     | 複雜狀態下性能問題、缺乏中介軟體、無時間旅行除錯               |
| Jotai / Recoil | 原子化狀態、細粒度更新 | 學習曲線較陡、社群相對較小、本專案無需極致的渲染優化           |
| MobX           | 響應式、自動追蹤依賴   | 魔法較多、可預測性較差、與 TypeScript 整合度不如 Redux Toolkit |

---

### 4. 路由管理：React Router v6

**決策**：採用 **React Router 6.x** 進行路由管理

**理由**：

- **標準事實上的標準**：React 社群最廣泛使用的路由庫
- **宣告式路由**：使用 `<Routes>` 和 `<Route>` 組件，結構清晰
- **Hooks 支援**：useNavigate, useParams, useLocation 等現代化 API
- **程式化導航**：易於在計時結束後導航到不同頁面
- **路徑參數與查詢字串**：支援報表月份篩選的 URL 狀態保存

**路由結構**：

```typescript
/                    → 首頁（模式選擇）
/adjust/:mode        → 時間調整頁面
/timer               → 計時器頁面
/reports/list        → 報表列表檢視
/reports/chart       → 報表月圖表檢視
```

**替代方案評估**：

| 方案            | 優點                                 | 為何未選擇                                     |
| --------------- | ------------------------------------ | ---------------------------------------------- |
| TanStack Router | 型別安全路由、更好的 TypeScript 支援 | 社群較小、本專案路由需求簡單，無需進階型別推導 |
| Wouter          | 極簡、體積小                         | 功能較少、缺乏巢狀路由、社群較小               |
| 手動實作        | 無依賴                               | 開發成本高、需處理歷史記錄、缺乏標準化         |

---

### 5. UI 框架：Tailwind CSS

**決策**：採用 **Tailwind CSS 3.4+** 進行樣式開發

**理由**：

- **Utility-First**：快速建構介面，無需命名 CSS 類別
- **響應式設計**：內建 breakpoint 系統（sm/md/lg/xl），易於實作跨裝置設計
- **設計系統一致性**：預設調色板、間距系統確保視覺一致
- **樹搖優化**：未使用的樣式自動移除，生產打包體積小
- **可訪問性友善**：易於實作 focus 狀態、鍵盤導航樣式

**設計 token 策略**：

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        "quick-start": "#10b981", // 綠色
        study: "#3b82f6", // 藍色
        focus: "#f97316", // 橙色
        "deep-work": "#a855f7", // 紫色
      },
    },
  },
};
```

**替代方案評估**：

| 方案              | 優點                      | 為何未選擇                                  |
| ----------------- | ------------------------- | ------------------------------------------- |
| CSS Modules       | 作用域隔離、無全域污染    | 需命名類別、樣式重用較困難                  |
| Styled Components | CSS-in-JS、動態樣式能力強 | 執行期開銷、打包體積較大、無設計 token 系統 |
| Emotion           | 類似 Styled Components    | 同上                                        |
| Bootstrap         | 預製組件豐富              | 客製化困難、打包體積大、設計風格過時        |
| Material-UI       | 遵循 Material Design      | 打包體積大、風格過於固定、本專案需簡潔設計  |

---

### 6. 本地資料持久化：localStorage + 序列化策略

**決策**：使用 **localStorage** 儲存資料，搭配自訂序列化/反序列化策略

**技術實作**：

#### 6.1 儲存結構

```typescript
// localStorage keys
const STORAGE_KEYS = {
  HISTORY: "pomodoro_history", // FocusRecord[]
  TIMER_STATE: "pomodoro_timer_state", // TimerState
  LOCK: "pomodoro_window_lock", // WindowLock
};

interface StoredHistory {
  version: number;
  records: FocusRecord[];
  lastCleanup: number; // timestamp
}

interface StoredTimerState {
  mode: WorkMode;
  state: TimerStateEnum;
  remainingSeconds: number;
  startTimestamp: number;
  windowId: string;
}

interface StoredLock {
  windowId: string;
  timestamp: number;
}
```

#### 6.2 容量管理策略

- **3 個月自動清理**：每次讀取時檢查 `lastCleanup` 時間戳，若超過 24 小時則執行清理
- **容量限制處理**：捕捉 `QuotaExceededError`，優先刪除最舊紀錄直到寫入成功
- **版本化結構**：`version` 欄位支援未來資料遷移

#### 6.3 錯誤處理

```typescript
function safeLocalStorageWrite(key: string, value: any): boolean {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    if (error instanceof DOMException && error.name === "QuotaExceededError") {
      // 嘗試清理舊資料後重試
      cleanupOldRecords();
      try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
      } catch {
        // 顯示錯誤訊息給使用者
        return false;
      }
    }
    return false;
  }
}
```

**替代方案評估**：

| 方案           | 優點                         | 為何未選擇                                    |
| -------------- | ---------------------------- | --------------------------------------------- |
| IndexedDB      | 更大容量、結構化查詢、非阻塞 | 過於複雜、本應用資料量小、localStorage 已足夠 |
| SessionStorage | 自動清理（關閉分頁時）       | 資料不持久、不符合「保存 3 個月」需求         |
| Cookies        | 可跨域、伺服器可讀           | 容量限制 4KB、不適合儲存大量歷史紀錄          |
| 雲端儲存       | 跨裝置同步                   | 規格明確排除、需登入系統、增加複雜度          |

---

### 7. 計時器實作：Web Worker + requestAnimationFrame

**決策**：主執行緒使用 **setInterval** 搭配 **時間戳校正機制**

**理由**：

- **簡單可靠**：setInterval 足夠應對本應用需求（每秒更新一次）
- **時間戳校正**：每次 tick 時計算實際經過時間，補償 JavaScript 定時器誤差
- **無需 Web Worker**：計時器邏輯簡單，主執行緒足以處理，避免過度工程

**實作策略**：

```typescript
useEffect(() => {
  if (timerState !== "focusing" && timerState !== "resting") return;

  const startTime = Date.now();
  const expectedEnd = startTime + remainingSeconds * 1000;

  const intervalId = setInterval(() => {
    const now = Date.now();
    const actualRemaining = Math.max(0, Math.ceil((expectedEnd - now) / 1000));

    dispatch(updateRemaining(actualRemaining));

    if (actualRemaining === 0) {
      clearInterval(intervalId);
      handleTimerEnd();
    }
  }, 1000);

  return () => clearInterval(intervalId);
}, [timerState, remainingSeconds]);
```

**替代方案評估**：

| 方案                     | 優點                      | 為何未選擇                                   |
| ------------------------ | ------------------------- | -------------------------------------------- |
| Web Worker + setInterval | 不受主執行緒阻塞、更精確  | 過度複雜、本應用無複雜運算、校正機制已足夠   |
| requestAnimationFrame    | 每幀更新、更流暢          | 計時器只需每秒更新一次、浪費效能、不符合需求 |
| setTimeout 遞迴          | 避免 setInterval 累積誤差 | 時間戳校正機制已解決誤差問題、無需遞迴複雜化 |
| Date.now() 輪詢          | 最精確                    | 無意義高頻輪詢、浪費 CPU                     |

---

### 8. 多視窗同步：StorageEvent + localStorage 鎖定

**決策**：使用 **StorageEvent** 監聽 localStorage 變化，實作視窗鎖定機制

**技術實作**：

#### 8.1 鎖定機制

```typescript
interface WindowLock {
  windowId: string;
  timestamp: number;
}

// 啟動計時時建立鎖定
function acquireLock(windowId: string) {
  const lock: WindowLock = {
    windowId,
    timestamp: Date.now(),
  };
  localStorage.setItem(STORAGE_KEYS.LOCK, JSON.stringify(lock));
}

// 檢查是否被其他視窗鎖定
function isLockedByOther(currentWindowId: string): boolean {
  const lockData = localStorage.getItem(STORAGE_KEYS.LOCK);
  if (!lockData) return false;

  const lock: WindowLock = JSON.parse(lockData);
  return lock.windowId !== currentWindowId;
}
```

#### 8.2 StorageEvent 監聽

```typescript
useEffect(() => {
  const handleStorageChange = (event: StorageEvent) => {
    if (event.key === STORAGE_KEYS.LOCK) {
      const newLock = event.newValue ? JSON.parse(event.newValue) : null;

      if (newLock && newLock.windowId !== currentWindowId) {
        // 其他視窗取得鎖定，禁用本視窗計時器
        dispatch(setLocked(true));
      } else {
        dispatch(setLocked(false));
      }
    }
  };

  window.addEventListener("storage", handleStorageChange);
  return () => window.removeEventListener("storage", handleStorageChange);
}, [currentWindowId]);
```

#### 8.3 接管機制

```typescript
function takeoverTimer() {
  // 更新鎖定為當前視窗
  acquireLock(currentWindowId);

  // 讀取計時器狀態並恢復
  const timerState = localStorage.getItem(STORAGE_KEYS.TIMER_STATE);
  if (timerState) {
    const state: StoredTimerState = JSON.parse(timerState);
    dispatch(restoreTimer(state));
  }
}
```

**替代方案評估**：

| 方案                 | 優點                 | 為何未選擇                                   |
| -------------------- | -------------------- | -------------------------------------------- |
| BroadcastChannel     | 更現代、更清晰的 API | 瀏覽器支援度不如 StorageEvent（IE 不支援）   |
| SharedWorker         | 共享背景執行緒       | 過於複雜、瀏覽器支援有限、本應用無需背景任務 |
| WebSocket 自建伺服器 | 即時性最佳、可跨裝置 | 規格排除雲端、需伺服器維護、過度複雜         |
| 輪詢 localStorage    | 簡單                 | 浪費效能、延遲高、StorageEvent 更優雅        |

---

### 9. 音效播放：HTML5 Audio API

**決策**：使用 **HTML5 `<audio>` 元素** + **Web Audio API 備援**

**技術實作**：

#### 9.1 音效檔案準備

- 使用 **MP3 格式**（廣泛支援）+ **OGG 格式**（Firefox 相容性）
- 音效長度 1-2 秒，柔和但清晰的提示音
- 檔案放置於 `public/assets/sounds/` 目錄

#### 9.2 播放策略

```typescript
// 預載音效
const audioRef = useRef<HTMLAudioElement | null>(null);

useEffect(() => {
  audioRef.current = new Audio("/assets/sounds/timer-end.mp3");
  audioRef.current.load();
}, []);

// 播放音效（處理自動播放政策）
async function playNotificationSound() {
  if (!audioRef.current) return;

  try {
    await audioRef.current.play();
  } catch (error) {
    if (error instanceof DOMException && error.name === "NotAllowedError") {
      // 瀏覽器阻止自動播放，顯示提示
      showNotification("請點擊頁面以啟用音效通知");
    }
  }
}
```

#### 9.3 使用者互動啟用

```typescript
// 在使用者首次互動時請求音效播放權限
useEffect(() => {
  const enableAudio = () => {
    audioRef.current?.play().then(() => {
      audioRef.current?.pause();
      audioRef.current!.currentTime = 0;
    });
  };

  document.addEventListener("click", enableAudio, { once: true });
  return () => document.removeEventListener("click", enableAudio);
}, []);
```

**替代方案評估**：

| 方案                   | 優點                   | 為何未選擇                                  |
| ---------------------- | ---------------------- | ------------------------------------------- |
| Web Audio API 原生使用 | 更精確控制、可合成音效 | 過於複雜、本應用只需播放簡單音效檔案        |
| Notification API       | 系統級通知             | 需權限請求、不適合本應用輕量化需求          |
| Howler.js              | 跨瀏覽器相容性佳、易用 | 增加依賴、本應用音效需求簡單、原生 API 足夠 |
| 純 Web Audio 合成      | 無需音效檔案           | 開發複雜、音效品質不如預錄檔案              |

---

### 10. 建構工具：Vite

**決策**：使用 **Vite 5.x** 作為建構工具

**理由**：

- **開發速度快**：基於 ESM 的即時編譯，熱模組替換（HMR）速度極快
- **React + TypeScript 模板**：官方提供完整模板，零配置即可使用
- **生產打包優化**：基於 Rollup，樹搖、壓縮、程式碼分割自動處理
- **現代化預設**：預設支援 TypeScript、JSX、PostCSS、CSS Modules
- **Tailwind 整合簡單**：透過 PostCSS 外掛無縫整合

**專案初始化命令**：

```bash
npm create vite@latest pomodoro-app -- --template react-ts
cd pomodoro-app
npm install
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
npm install @reduxjs/toolkit react-redux
npm install react-router-dom
```

**替代方案評估**：

| 方案             | 優點               | 為何未選擇                               |
| ---------------- | ------------------ | ---------------------------------------- |
| Create React App | 零配置、官方支援   | 建構速度慢、Webpack 配置複雜、已逐漸過時 |
| Webpack          | 配置靈活、插件豐富 | 配置複雜、建構速度慢、學習曲線陡         |
| Parcel           | 零配置、自動處理   | 社群較小、插件生態不如 Vite              |
| Rollup           | 適合函式庫打包     | 不適合應用開發、無 HMR、開發體驗差       |

---

## 效能優化策略

### 1. 程式碼分割（Code Splitting）

```typescript
// 路由層級分割
const ReportList = lazy(() => import("./pages/ReportList"));
const ReportChart = lazy(() => import("./pages/ReportChart"));

<Suspense fallback={<LoadingSpinner />}>
  <Routes>
    <Route path="/reports/list" element={<ReportList />} />
    <Route path="/reports/chart" element={<ReportChart />} />
  </Routes>
</Suspense>;
```

### 2. 虛擬化列表（Virtualization）

- **僅在歷史紀錄超過 100 筆時啟用**
- 使用 `react-window` 或 `react-virtualized`
- 減少 DOM 節點數量，提升滾動效能

### 3. localStorage 讀寫優化

- **防抖寫入**：計時器狀態寫入使用 debounce（500ms），避免每秒觸發
- **批次讀取**：頁面載入時一次性讀取所有資料，存入 Redux
- **增量更新**：編輯/刪除紀錄時只更新變更部分

### 4. 組件渲染優化

```typescript
// 使用 React.memo 避免不必要的重新渲染
const TimerDisplay = memo(({ remainingSeconds }: Props) => {
  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;
  return <div>{`${minutes}:${seconds.toString().padStart(2, "0")}`}</div>;
});

// 使用 useMemo 快取計算結果
const totalFocusTime = useMemo(() => {
  return records
    .filter((r) => r.month === selectedMonth)
    .reduce((sum, r) => sum + r.duration, 0);
}, [records, selectedMonth]);
```

---

## 可訪問性實作策略

### 1. 鍵盤導航

- 所有互動元素支援 Tab 鍵導航
- 焦點樣式明確（Tailwind: `focus:ring-2 focus:ring-blue-500`）
- 計時器頁面支援快捷鍵：
  - `Space`: 暫停/繼續
  - `Esc`: 停止計時
  - `S`: 跳過休息（僅休息時）

### 2. ARIA 標籤

```typescript
<button
  aria-label="暫停計時器"
  aria-pressed={isPaused}
  onClick={handlePause}
>
  {isPaused ? '繼續' : '暫停'}
</button>

<div role="timer" aria-live="polite" aria-atomic="true">
  <span aria-label={`剩餘 ${minutes} 分 ${seconds} 秒`}>
    {displayTime}
  </span>
</div>
```

### 3. 色彩對比度

- 使用 Tailwind 預設調色板確保對比度符合 WCAG 2.1 AA
- 關鍵資訊（剩餘時間、按鈕）使用高對比度組合
- 完成狀態除了顏色外，搭配圖標（✓/⚠）作為視覺提示

### 4. 螢幕閱讀器支援

- 頁面標題（`<title>`）即時更新反映當前狀態
- 狀態變化（計時開始/結束）使用 `aria-live="polite"` 宣告
- 表單標籤（`<label>`）正確關聯到輸入元素

---

## 測試策略

### 1. 單元測試（Jest + React Testing Library）

**覆蓋範圍**：

- Redux slices（timerSlice, historySlice）的 reducers 邏輯
- 工具函數（calculateRemaining, filterRecords, cleanupOldRecords）
- 自訂 Hooks（useTimer, useWindowLock）

**測試範例**：

```typescript
describe("timerSlice", () => {
  it("應正確更新剩餘時間", () => {
    const initialState = { remainingSeconds: 1200 };
    const nextState = timerReducer(initialState, updateRemaining(1195));
    expect(nextState.remainingSeconds).toBe(1195);
  });

  it("應在時間歸零時切換為休息狀態", () => {
    const initialState = { state: "focusing", remainingSeconds: 0 };
    const nextState = timerReducer(initialState, timerEnd());
    expect(nextState.state).toBe("resting");
  });
});
```

### 2. 整合測試

**覆蓋範圍**：

- 完整的計時流程（選擇模式 → 調整時間 → 開始計時 → 結束 → 儲存紀錄）
- localStorage 讀寫與資料恢復
- 多視窗鎖定機制（使用 jsdom 模擬 StorageEvent）

**測試範例**：

```typescript
it("應在計時結束後自動儲存紀錄到 localStorage", async () => {
  render(<App />);

  // 選擇快速啟動模式
  fireEvent.click(screen.getByText("快速啟動"));

  // 開始計時
  fireEvent.click(screen.getByText("開始專注"));

  // 模擬時間經過 20 分鐘
  act(() => {
    vi.advanceTimersByTime(20 * 60 * 1000);
  });

  // 驗證 localStorage 中有紀錄
  const records = JSON.parse(localStorage.getItem("pomodoro_history")!);
  expect(records).toHaveLength(1);
  expect(records[0].mode).toBe("quick-start");
});
```

### 3. E2E 測試（Playwright）

**覆蓋範圍**：

- 完整使用者旅程（從首頁到報表查看）
- 瀏覽器重新整理後的狀態恢復
- 多視窗同時開啟的互動行為

**測試範例**：

```typescript
test("應在瀏覽器重新整理後恢復計時器", async ({ page }) => {
  await page.goto("http://localhost:5173");

  // 開始計時
  await page.click("text=快速啟動");
  await page.click("text=開始專注");

  // 等待 5 秒
  await page.waitForTimeout(5000);

  // 重新整理頁面
  await page.reload();

  // 驗證計時器仍在執行
  await expect(page.locator('[role="timer"]')).toBeVisible();
  const remainingTime = await page.locator('[role="timer"]').textContent();
  expect(remainingTime).toContain("19:"); // 應該約為 19 分多秒
});
```

---

## 開發工具與輔助庫

| 類別         | 工具/函式庫               | 用途                                |
| ------------ | ------------------------- | ----------------------------------- |
| 程式碼格式化 | Prettier + ESLint         | 統一程式碼風格、捕捉潛在錯誤        |
| 型別檢查     | TypeScript                | 靜態型別檢查                        |
| 測試框架     | Vitest + RTL + Playwright | 單元/整合/E2E 測試                  |
| 狀態除錯     | Redux DevTools            | 時間旅行除錯、狀態檢視              |
| 音效處理     | Audacity（音效檔案編輯）  | 製作/編輯計時結束提示音             |
| 圖標庫       | Heroicons（可選）         | React 組件圖標（✓, ⚠, i 等）        |
| 日期處理     | 原生 Date + Intl          | 避免引入 date-fns/dayjs（需求簡單） |
| 虛擬化列表   | react-window（按需）      | 僅在歷史紀錄超過 100 筆時使用       |

---

## 未解決問題與風險

### 1. 瀏覽器自動播放政策

**問題**：Chrome/Safari 限制未經使用者互動的音效自動播放

**緩解措施**：

- 在使用者首次點擊時預載音效並請求播放權限
- 若音效播放失敗，顯示明確的提示訊息
- 提供設定頁面讓使用者選擇靜音模式

### 2. localStorage 容量不足

**問題**：使用者累積大量歷史紀錄後可能觸及 5MB 限制

**緩解措施**：

- 3 個月自動清理機制已涵蓋大部分情況
- 捕捉 `QuotaExceededError` 並自動刪除最舊紀錄
- 顯示錯誤訊息並建議使用者手動刪除部分紀錄

### 3. 系統時間變更

**問題**：使用者手動調整系統時間可能導致計時器異常

**緩解措施**：

- 使用 `Date.now()` 取得時間戳，搭配 `performance.now()` 作為備援
- 偵測系統時間大幅跳躍（> 10 秒），顯示警告並重置計時器
- 歷史紀錄篩選時驗證時間戳合理性

### 4. 多視窗競爭條件

**問題**：兩個視窗幾乎同時啟動計時器時可能發生鎖定衝突

**緩解措施**：

- 使用時間戳作為仲裁依據，較早取得鎖定的視窗獲勝
- 定期檢查鎖定狀態（每 5 秒），自動同步
- 提供「接管計時」按鈕作為手動解決方案

---

## 部署與 CI/CD

### 建議部署平台

- **Vercel**：零配置、自動 HTTPS、邊緣網路 CDN
- **Netlify**：類似 Vercel，免費層額度充足
- **GitHub Pages**：免費、與 GitHub 整合良好（需配置 base path）

### CI/CD 流程

```yaml
# .github/workflows/ci.yml
name: CI

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: "18"
      - run: npm ci
      - run: npm run lint
      - run: npm run type-check
      - run: npm run test
      - run: npm run build
```

---

## 總結

本研究文件確立了番茄鐘應用的技術基礎：

- **前端框架**：React 18 + TypeScript 5
- **狀態管理**：Redux Toolkit
- **路由**：React Router v6
- **樣式**：Tailwind CSS
- **建構工具**：Vite
- **資料儲存**：localStorage + 序列化策略
- **計時器**：setInterval + 時間戳校正
- **多視窗同步**：StorageEvent + 鎖定機制
- **音效**：HTML5 Audio API

所有技術選擇均符合專案憲章要求，並經過替代方案評估。下一階段將進入 **Phase 1：設計與合約**，產出資料模型與 TypeScript 介面定義。
