# 實作計畫：番茄鐘應用

**分支**: `1-pomodoro-timer` | **日期**: 2025-12-18 | **規格**: [spec.md](./spec.md)

本計畫基於 [spec.md](./spec.md) 的功能規格，定義番茄鐘應用的技術實作方案、架構設計與開發路徑。

---

## 摘要

番茄鐘應用是一個純前端單頁應用（SPA），使用 React + TypeScript + Redux Toolkit 建構，透過 localStorage 實作資料持久化，支援多視窗互斥計時機制。核心功能包含 4 種預設工作模式、可調整時間、計時器、歷史紀錄與月圖表。

**技術選型理由**：詳見 [research.md](./research.md)  
**資料模型設計**：詳見 [data-model.md](./data-model.md)  
**快速開始指南**：詳見 [quickstart.md](./quickstart.md)

---

## 技術背景

### 核心技術棧

| 技術                  | 版本  | 用途                                     |
| --------------------- | ----- | ---------------------------------------- |
| React                 | 18.2+ | 前端框架，建構使用者介面                 |
| TypeScript            | 5.0+  | 型別安全，減少執行期錯誤                 |
| Redux Toolkit         | 2.0+  | 狀態管理，管理計時器、歷史紀錄與鎖定狀態 |
| React Router          | 6.x   | 路由管理，處理頁面導航                   |
| Tailwind CSS          | 3.4+  | Utility-first CSS 框架，快速建構介面     |
| Vite                  | 5.x   | 建構工具，開發伺服器與生產打包           |
| Vitest                | 1.0+  | 單元測試框架                             |
| Playwright            | 1.40+ | E2E 測試框架                             |
| React Testing Library | 14.0+ | 整合測試工具                             |

### 技術決策

- **語言/版本**: TypeScript 5.0+
- **主要依賴**: React 18.2, Redux Toolkit 2.0, React Router 6.x, Tailwind CSS 3.4
- **儲存**: localStorage（本地瀏覽器儲存）
- **測試**: Vitest（單元/整合測試）、Playwright（E2E 測試）
- **目標平台**: 現代瀏覽器（Chrome 90+, Firefox 88+, Safari 14+, Edge 90+）
- **專案類型**: web（單頁應用）
- **效能目標**: UI 互動響應 < 100ms, localStorage 讀寫 < 50ms, 計時器精確度 ±1 秒
- **約束條件**: localStorage 容量 ~5MB, 單執行緒 JavaScript, 瀏覽器自動播放政策
- **規模/範疇**: 5 個路由頁面, 15+ 個 React 組件, 4 個 Redux slices, 支援 1000+ 筆歷史紀錄

---

## 憲章檢查

_閘門：必須在 Phase 0 研究前通過。Phase 1 設計後重新檢查。_

根據 `.specify/memory/constitution.md` 檢查合規性要求：

- [x] **程式碼品質**：將遵循 ESLint + Prettier 規範、模組化設計（features/ 目錄結構）、所有 PR 需程式碼審查
- [x] **測試標準**：採用 TDD 方法、單元測試覆蓋率目標 85%+、整合測試涵蓋所有使用者故事、E2E 測試驗證關鍵流程
- [x] **使用者體驗**：遵循 Tailwind 設計系統、一致的互動模式（按鈕、卡片）、符合 WCAG 2.1 AA（鍵盤導航、ARIA 標籤、色彩對比度）
- [x] **效能要求**：UI 互動 < 100ms（計時器顯示、按鈕回饋）、localStorage 讀寫 < 50ms、使用 React.memo 和 useMemo 優化渲染、虛擬化列表（100+ 筆紀錄時）
- [x] **語言要求**：所有規格文件、計畫、使用者介面使用繁體中文（zh-TW）、程式碼註解優先使用繁體中文文檔字串

**違規與正當理由**：無

**Phase 1 重新檢查結果**：

- [x] **程式碼品質**：已定義明確的模組化結構（features/timer, features/history 等）、型別定義完整（contracts/types.ts）
- [x] **測試標準**：已規劃單元測試（timerSlice, historySlice）、整合測試（完整計時流程）、E2E 測試（多視窗互動）
- [x] **使用者體驗**：已定義 Tailwind 色彩系統（4 種模式顏色）、鍵盤導航策略（Space, Esc, S 快捷鍵）、ARIA 標籤規範
- [x] **效能要求**：已規劃 localStorage middleware（防抖寫入）、selector 快取（createSelector）、虛擬化列表（react-window）
- [x] **語言要求**：所有文件已使用繁體中文撰寫

---

## 專案結構

### 文件結構（當前功能）

```text
specs/1-pomodoro-timer/
├── spec.md              # 功能規格（完整需求定義）
├── plan.md              # 本檔案（實作計畫）
├── research.md          # 技術研究與選型理由
├── data-model.md        # 資料結構與狀態設計
├── quickstart.md        # 快速開始指南
└── contracts/           # TypeScript 型別定義
    ├── types.ts         # 核心實體型別
    └── actions.ts       # Redux actions 型別
```

### 原始碼結構（版本庫根目錄）

```text
frontend/
├── src/
│   ├── app/
│   │   ├── store.ts             # Redux store 配置
│   │   ├── hooks.ts             # 型別化 hooks (useAppDispatch, useAppSelector)
│   │   └── middleware/
│   │       └── localStorage.ts  # localStorage 自動持久化 middleware
│   ├── features/
│   │   ├── timer/
│   │   │   ├── timerSlice.ts    # 計時器 Redux slice
│   │   │   ├── TimerDisplay.tsx # 計時器顯示組件
│   │   │   ├── TimerControls.tsx # 控制按鈕組件
│   │   │   └── useTimer.ts      # 計時器自訂 Hook
│   │   ├── history/
│   │   │   ├── historySlice.ts  # 歷史紀錄 Redux slice
│   │   │   ├── RecordList.tsx   # 列表檢視組件
│   │   │   ├── MonthChart.tsx   # 月圖表組件
│   │   │   └── RecordItem.tsx   # 單筆紀錄組件
│   │   ├── lock/
│   │   │   ├── lockSlice.ts     # 視窗鎖定 Redux slice
│   │   │   ├── LockWarning.tsx  # 鎖定警告組件
│   │   │   └── useWindowLock.ts # 視窗鎖定 Hook
│   │   └── ui/
│   │       ├── uiSlice.ts       # UI 狀態 Redux slice
│   │       └── Notification.tsx # 通知組件
│   ├── pages/
│   │   ├── HomePage.tsx         # 首頁（模式選擇）
│   │   ├── AdjustPage.tsx       # 時間調整頁面
│   │   ├── TimerPage.tsx        # 計時器頁面
│   │   └── ReportPage.tsx       # 報表頁面
│   ├── components/
│   │   ├── ModeCard.tsx         # 模式卡片組件
│   │   ├── TimeAdjuster.tsx     # 時間調整器組件
│   │   └── Button.tsx           # 通用按鈕組件
│   ├── types/
│   │   ├── index.ts             # 匯出所有型別
│   │   ├── workMode.ts          # WorkMode 型別
│   │   ├── timer.ts             # Timer 相關型別
│   │   └── storage.ts           # localStorage 型別
│   ├── utils/
│   │   ├── localStorage.ts      # localStorage 讀寫工具
│   │   ├── timeFormat.ts        # 時間格式化工具
│   │   ├── validation.ts        # 資料驗證工具
│   │   └── audio.ts             # 音效播放工具
│   ├── constants/
│   │   └── workModes.ts         # 工作模式常數
│   ├── App.tsx                  # 根組件（路由配置）
│   ├── main.tsx                 # 應用入口點
│   └── index.css                # 全域樣式（Tailwind 引入）
├── tests/
│   ├── unit/
│   │   ├── timerSlice.test.ts
│   │   ├── historySlice.test.ts
│   │   └── utils.test.ts
│   ├── integration/
│   │   ├── timerFlow.test.tsx
│   │   └── localStorage.test.tsx
│   └── e2e/
│       ├── full-workflow.spec.ts
│       └── multi-window.spec.ts
├── public/
│   └── assets/
│       └── sounds/
│           └── timer-end.mp3    # 計時結束提示音
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
├── .eslintrc.cjs
└── README.md
```

**結構決策**：採用 **單一 web 應用** 結構，將功能模組化至 `features/` 目錄（Redux Toolkit 推薦的 "feature folders" 模式）。此結構清晰分離關注點，易於擴展和維護。

---

## 複雜度追蹤

> **僅在憲章檢查有違規需正當理由時填寫**

本專案無違反憲章原則，無需記錄複雜度正當理由。

---

## 架構設計

### 1. 狀態管理架構

**Redux 狀態樹**：

```typescript
interface RootState {
  timer: TimerState; // 計時器狀態（當前模式、剩餘秒數、窗口 ID）
  history: HistoryState; // 歷史紀錄（records, 篩選月份, 檢視模式）
  lock: LockState; // 視窗鎖定狀態（activeWindowId, isLockedByOther）
  ui: UIState; // UI 輔助狀態（音效開關、通知訊息）
}
```

**資料流向**：

1. **使用者操作** → dispatch action
2. **Reducer** 更新 state
3. **Middleware** 監聽特定 actions，自動寫入 localStorage
4. **組件** 透過 useAppSelector 讀取 state 並重新渲染

**關鍵設計決策**：

- 使用 **Redux Toolkit createSlice** 減少樣板代碼
- 使用 **middleware** 自動持久化（避免手動同步）
- 使用 **Immer**（RTK 內建）確保不可變更新

---

### 2. 路由架構

| 路由              | 組件       | 用途                     |
| ----------------- | ---------- | ------------------------ |
| `/`               | HomePage   | 模式選擇（4 種模式卡片） |
| `/adjust/:modeId` | AdjustPage | 調整專注與休息時間       |
| `/timer`          | TimerPage  | 計時器頁面（倒數顯示）   |
| `/reports/list`   | ReportPage | 歷史紀錄列表檢視         |
| `/reports/chart`  | ReportPage | 歷史紀錄月圖表檢視       |

**導航流程**：

```
首頁 → 調整頁面 → 計時器頁面 → 選項畫面 → 首頁/計時器
                                           ↓
                                       報表頁面
```

---

### 3. localStorage 架構

**儲存鍵值**：

| 鍵名                   | 內容                           | 寫入時機                     |
| ---------------------- | ------------------------------ | ---------------------------- |
| `pomodoro_history`     | 歷史紀錄（StoredHistory）      | 新增/編輯/刪除紀錄時         |
| `pomodoro_timer_state` | 計時器狀態（StoredTimerState） | 每秒 tick（debounced 500ms） |
| `pomodoro_window_lock` | 視窗鎖定（StoredWindowLock）   | 開始/停止計時時              |

**自動持久化機制**：

- Redux middleware 監聽 `history/*` 和 `timer/*` actions
- 使用 **debounce** 避免計時器 tick 時過度寫入
- 捕捉 `QuotaExceededError` 並自動清理舊紀錄

**恢復機制**：

- 應用啟動時讀取 localStorage
- 計算實際經過時間（`Date.now() - startTimestamp`）
- 更新 Redux state 並恢復計時器

---

### 4. 多視窗同步架構

**鎖定機制**：

1. **視窗 A** 開始計時 → 寫入 `windowId_A` 至 localStorage
2. **視窗 B** 載入時檢查 localStorage → 發現鎖定
3. **視窗 B** 顯示警告訊息 + 「接管計時」按鈕
4. **StorageEvent** 監聽實時同步（視窗間通信）

**接管流程**：

```
視窗 B 點擊「接管計時」
  ↓
更新 localStorage: windowId_A → windowId_B
  ↓
StorageEvent 觸發
  ↓
視窗 A 收到事件 → 顯示鎖定警告
視窗 B 收到事件 → 恢復計時器
```

---

## 實作階段規劃

### Phase 0: 技術研究（已完成）

**輸出**：[research.md](./research.md)

已完成以下研究：

- ✅ 前端框架選擇（React vs Vue vs Svelte）
- ✅ 狀態管理方案（Redux Toolkit vs Zustand vs Context API）
- ✅ UI 框架（Tailwind CSS vs CSS Modules vs Styled Components）
- ✅ 計時器實作策略（setInterval + 時間戳校正）
- ✅ 多視窗同步機制（StorageEvent + localStorage 鎖定）
- ✅ localStorage 容量管理與錯誤處理

---

### Phase 1: 資料模型與合約（已完成）

**輸出**：

- ✅ [data-model.md](./data-model.md) - 完整資料結構定義
- ✅ [contracts/types.ts](./contracts/types.ts) - TypeScript 型別定義
- ✅ [contracts/actions.ts](./contracts/actions.ts) - Redux actions 型別
- ✅ [quickstart.md](./quickstart.md) - 開發環境設置指南

**產出內容**：

1. **核心實體定義**：WorkMode, TimerState, FocusRecord, WindowLock
2. **Redux 狀態樹**：timer, history, lock, ui slices
3. **localStorage 格式**：StoredHistory, StoredTimerState, StoredWindowLock
4. **型別守衛函數**：validateFocusRecord, validateStoredHistory 等
5. **開發指南**：專案設置、開發流程、測試策略

---

### Phase 2: 開發路徑（下一步）

**建議開發順序**（共 10 天）：

#### 第 1-2 天：基礎設施

- [ ] 建立專案（`npm create vite@latest`）
- [ ] 安裝所有依賴（React, Redux, Router, Tailwind）
- [ ] 配置 Redux store（timer, history, lock, ui slices）
- [ ] 實作 localStorage 工具函數（safeWrite, safeRead, validation）
- [ ] 建立基礎組件（Button, ModeCard, TimeAdjuster）
- [ ] 配置測試環境（Vitest, Playwright）

**驗收標準**：

- Redux DevTools 可顯示 4 個 slices
- localStorage 工具函數有完整單元測試
- 基礎組件可在 Storybook 或測試中渲染

#### 第 3-5 天：核心計時功能

- [ ] 實作 HomePage（4 種模式卡片）
- [ ] 實作 AdjustPage（時間調整器 + 範圍驗證）
- [ ] 實作 TimerPage（計時器顯示 + 控制按鈕）
- [ ] 實作 useTimer Hook（tick 邏輯 + 時間戳校正）
- [ ] 實作計時結束流程（專注 → 休息 → 選項畫面）
- [ ] 實作音效播放（timer-end.mp3）

**驗收標準**：

- 可完整執行一個番茄鐘週期（專注 → 休息 → 首頁）
- 計時器精確度誤差 < 2 秒
- 計時結束播放提示音

#### 第 6-8 天：歷史紀錄與進階功能

- [ ] 實作 historySlice（addRecord, updateRecord, deleteRecord）
- [ ] 實作 RecordList 組件（列表檢視）
- [ ] 實作 MonthChart 組件（月圖表檢視）
- [ ] 實作月份篩選器（只顯示最近 3 個月）
- [ ] 實作編輯/刪除功能
- [ ] 實作 3 個月自動清理機制
- [ ] 實作多視窗同步（useWindowLock Hook + LockWarning）

**驗收標準**：

- 可新增、編輯、刪除歷史紀錄
- 月圖表正確顯示 4 種模式的時長分布
- 多視窗互斥機制正常運作

#### 第 9-10 天：測試與優化

- [ ] 撰寫單元測試（timerSlice, historySlice, utils）
- [ ] 撰寫整合測試（完整計時流程、localStorage 讀寫）
- [ ] 撰寫 E2E 測試（瀏覽器重新載入恢復、多視窗互動）
- [ ] 效能優化（React.memo, useMemo, 虛擬化列表）
- [ ] 可訪問性檢查（鍵盤導航、ARIA 標籤、色彩對比度）
- [ ] 憲章合規性最終檢查

**驗收標準**：

- 測試覆蓋率 > 85%
- 所有 E2E 測試通過
- 憲章檢查無違規

---

## 風險與緩解策略

### 風險 1：瀏覽器自動播放政策限制

**描述**：Chrome/Safari 限制未經使用者互動的音效自動播放

**緩解措施**：

- 在使用者首次點擊時預載音效並請求播放權限
- 若音效播放失敗，顯示明確的提示訊息
- 提供設定頁面讓使用者選擇靜音模式

### 風險 2：localStorage 容量不足

**描述**：使用者累積大量歷史紀錄後可能觸及 5MB 限制

**緩解措施**：

- 3 個月自動清理機制已涵蓋大部分情況
- 捕捉 `QuotaExceededError` 並自動刪除最舊紀錄
- 顯示錯誤訊息並建議使用者手動刪除部分紀錄

### 風險 3：系統時間變更

**描述**：使用者手動調整系統時間可能導致計時器異常

**緩解措施**：

- 偵測系統時間大幅跳躍（> 10 秒），顯示警告並重置計時器
- 歷史紀錄篩選時驗證時間戳合理性

### 風險 4：多視窗競爭條件

**描述**：兩個視窗幾乎同時啟動計時器時可能發生鎖定衝突

**緩解措施**：

- 使用時間戳作為仲裁依據，較早取得鎖定的視窗獲勝
- 定期檢查鎖定狀態（每 5 秒），自動同步
- 提供「接管計時」按鈕作為手動解決方案

---

## 測試策略

### 單元測試（Vitest）

**覆蓋範圍**：

- Redux slices（timerSlice, historySlice, lockSlice, uiSlice）
- 工具函數（localStorage, timeFormat, validation, audio）
- 自訂 Hooks（useTimer, useWindowLock）

**目標覆蓋率**：85%+

### 整合測試（React Testing Library）

**覆蓋範圍**：

- 完整的計時流程（選擇模式 → 調整時間 → 開始計時 → 結束 → 儲存紀錄）
- localStorage 讀寫與資料恢復
- 多視窗鎖定機制（使用 jsdom 模擬 StorageEvent）

### E2E 測試（Playwright）

**覆蓋範圍**：

- 完整使用者旅程（從首頁到報表查看）
- 瀏覽器重新整理後的狀態恢復
- 多視窗同時開啟的互動行為

---

## 效能優化清單

- [ ] 使用 **React.memo** 避免不必要的組件重新渲染（TimerDisplay, RecordItem）
- [ ] 使用 **useMemo** 快取計算結果（totalFocusTime, filteredRecords）
- [ ] 使用 **useCallback** 快取事件處理函數（避免子組件重新渲染）
- [ ] 使用 **react-window** 虛擬化列表（歷史紀錄 > 100 筆時）
- [ ] localStorage 寫入使用 **debounce**（計時器 tick 時延遲 500ms）
- [ ] 使用 **createSelector**（Redux Toolkit）快取 selector 結果
- [ ] 程式碼分割（React.lazy + Suspense）按路由載入

---

## 憲章合規性檢查清單

### 程式碼品質

- [ ] 配置 ESLint + Prettier
- [ ] 建立 `.eslintrc.cjs` 規則檔
- [ ] 所有 PR 需經過程式碼審查
- [ ] 模組化目錄結構（features/ 目錄）

### 測試驅動開發

- [ ] 先撰寫測試，後實作功能
- [ ] 測試覆蓋率 > 85%
- [ ] Red-Green-Refactor 循環
- [ ] 整合測試涵蓋所有使用者故事

### 使用者體驗

- [ ] Tailwind 設計系統（色彩、間距一致）
- [ ] 鍵盤導航支援（Space, Esc, S 快捷鍵）
- [ ] ARIA 標籤（role="timer", aria-live="polite"）
- [ ] 色彩對比度 > WCAG 2.1 AA

### 效能要求

- [ ] UI 互動響應 < 100ms
- [ ] localStorage 讀寫 < 50ms
- [ ] 效能測試（計時器 CPU 使用率 < 5%）
- [ ] React DevTools Profiler 驗證無效能瓶頸

### 語言要求

- [ ] 所有規格文件使用繁體中文
- [ ] 所有 UI 文字使用繁體中文
- [ ] 程式碼文檔字串優先使用繁體中文

---

## 下一步行動

1. ✅ 執行 `/speckit.plan` 完成實作計畫（本檔案）
2. ⏭ 開始實作基礎設施（Redux store、localStorage 工具）
3. ⏭ 實作核心計時功能（HomePage → AdjustPage → TimerPage）
4. ⏭ 實作歷史紀錄與多視窗同步
5. ⏭ 撰寫測試確保品質
6. ⏭ 執行 `/speckit.tasks` 生成詳細任務清單

---

## 參考文件

- [spec.md](./spec.md) - 功能規格
- [research.md](./research.md) - 技術研究
- [data-model.md](./data-model.md) - 資料模型
- [quickstart.md](./quickstart.md) - 快速開始指南
- [constitution.md](../../.specify/memory/constitution.md) - 專案憲章
- [contracts/types.ts](./contracts/types.ts) - TypeScript 型別定義
- [contracts/actions.ts](./contracts/actions.ts) - Redux actions 型別

---

**計畫完成日期**：2025-12-18  
**計畫狀態**：✅ 完成（Phase 0 研究 + Phase 1 設計）  
**下一階段**：Phase 2 開發（執行 `/speckit.tasks` 生成任務清單）
