# 任務清單: 番茄鐘應用

**輸入**: 來自 `/specs/1-pomodoro-timer/` 的設計文件
**前置需求**: plan.md, spec.md, data-model.md, contracts/

**注意**：本文件必須使用繁體中文（zh-TW）撰寫，遵循專案憲章的語言要求。

## 格式: `[ID] [P?] 描述`

- **[P]**: 可平行執行（不同檔案，無相依性）

## 路徑慣例

- **專案結構**: `frontend/src/`

## 憲章合規性檢查清單

在開始實作前，確認任務遵循以下憲章要求：

- [ ] **程式碼品質**: 任務包含模組化設計、清晰命名、程式碼審查步驟
- [ ] **測試優先**: 測試任務在實作任務之前排序
- [ ] **測試覆蓋率**: 核心功能包含單元測試和整合測試
- [ ] **使用者體驗**: UI 相關任務參考設計系統和可訪問性標準
- [ ] **效能驗證**: 關鍵路徑包含效能測試任務
- [ ] **語言一致性**: 所有文件和使用者介面文字使用繁體中文

---

## 階段 1: 基礎設施 (第 1-2 天)

**目的**: 專案初始化與基本結構

- [ ] T001 根據 `plan.md`，使用 `npm create vite@latest frontend` 建立專案目錄結構。
- [ ] T002 安裝核心依賴: `cd frontend && npm install react react-dom react-router-dom @reduxjs/toolkit react-redux`
- [ ] T003 安裝開發依賴: `npm install -D typescript @types/react @types/react-dom vite @vitejs/plugin-react tailwindcss postcss autoprefixer eslint prettier eslint-plugin-react-hooks eslint-plugin-react-refresh vitest jsdom @testing-library/react @testing-library/jest-dom playwright`
- [ ] T004 [P] 初始化 Tailwind CSS 配置: `npx tailwindcss init -p` 並設定 `tailwind.config.js` 與 `index.css`。
- [ ] T005 [P] 初始化 `tsconfig.json` 與 `vite.config.ts`。
- [ ] T006 [P] 初始化 ESLint 與 Prettier 配置 (`.eslintrc.cjs`, `.prettierrc`)。
- [ ] T007 撰寫 `frontend/tests/unit/utils.test.ts` 中的 localStorage 工具單元測試 (TDD)。
- [ ] T008 實作 `frontend/src/utils/localStorage.ts` 中的 `safeWrite`, `safeRead`, `validation` 工具函數，並通過 T007 的測試。
- [ ] T009 根據 `plan.md` 在 `frontend/src/app/store.ts` 中配置 Redux store，包含 `timer`, `history`, `lock`, `ui` 的空 slices。
- [ ] T010 [P] 在 `frontend/src/components/` 中建立基礎組件 (`Button.tsx`, `ModeCard.tsx`, `TimeAdjuster.tsx`)。
- [ ] T011 [P] 配置 Vitest (`vite.config.ts`) 和 Playwright (`playwright.config.ts`) 測試環境。

**檢查點**: 基礎設施就緒。Redux DevTools 可顯示 4 個 slices，localStorage 工具函數有單元測試，基礎組件可渲染。

---

## 階段 2: 核心計時功能 (第 3-5 天)

**目的**: 實作應用程式的核心計時流程。

### 測試 (Test First)

- [ ] T012 撰寫 `frontend/tests/unit/timerSlice.test.ts` 單元測試，涵蓋計時器啟動、停止、重置、tick 等邏輯。
- [ ] T013 撰寫 `frontend/tests/integration/timerFlow.test.tsx` 整合測試，模擬從首頁選擇模式到計時結束的完整流程。

### 實作

- [ ] T014 [P] 實作 `frontend/src/features/timer/timerSlice.ts`，並通過 T012 的測試。
- [ ] T015 [P] 實作 `frontend/src/pages/HomePage.tsx`，顯示四種模式卡片 (`ModeCard`)。
- [ ] T016 實作 `frontend/src/pages/AdjustPage.tsx`，包含 `TimeAdjuster` 組件用於調整時間，並加入範圍驗證。
- [ ] T017 實作 `frontend/src/features/timer/useTimer.ts` 自訂 Hook，封裝 `setInterval` 與時間戳校正邏輯。
- [ ] T018 實作 `frontend/src/pages/TimerPage.tsx`，包含 `TimerDisplay` 和 `TimerControls` 組件，並使用 `useTimer` Hook。
- [ ] T019 整合路由 (`/`, `/adjust/:modeId`, `/timer`) 於 `frontend/src/App.tsx`。
- [ ] T020 實作計時結束流程（專注 -> 休息 -> 選項畫面）。
- [ ] T021 [P] 實作 `frontend/src/utils/audio.ts`，並在計時結束時播放 `public/assets/sounds/timer-end.mp3` 音效。
- [ ] T022 通過 T013 的整合測試。

**檢查點**: 核心計時功能完成。可完整執行一個番茄鐘週期，計時器精準，並在結束時播放音效。

---

## 階段 3: 歷史紀錄與進階功能 (第 6-8 天)

**目的**: 增加歷史紀錄儲存、檢視以及多視窗同步功能。

### 測試 (Test First)

- [ ] T023 [P] 撰寫 `frontend/tests/unit/historySlice.test.ts` 單元測試，涵蓋紀錄的新增、編輯、刪除。
- [ ] T024 [P] 撰寫 `frontend/tests/e2e/multi-window.spec.ts` E2E 測試，驗證多視窗計時互斥行為。

### 實作

- [ ] T025 實作 `frontend/src/features/history/historySlice.ts`，並通過 T023 的測試。
- [ ] T026 [P] 實作 `frontend/src/features/history/RecordList.tsx` 列表檢視組件，並整合 `react-window` 進行虛擬化。
- [ ] T027 [P] 實作 `frontend/src/features/history/MonthChart.tsx` 月圖表組件。
- [ ] T028 實作 `frontend/src/pages/ReportPage.tsx`，並加入路由 (`/reports/list`, `/reports/chart`)。
- [ ] T029 在 `ReportPage` 中實作月份篩選器。
- [ ] T030 [P] 在 `RecordList.tsx` 中實作單筆紀錄的編輯與刪除功能。
- [ ] T031 在 `historySlice.ts` 中實作 3 個月自動清理舊紀錄的機制。
- [ ] T032 實作 `frontend/src/features/lock/lockSlice.ts` 和 `useWindowLock.ts` Hook，處理多視窗鎖定邏輯。
- [ ] T033 在 `App.tsx` 或 `TimerPage.tsx` 中使用 `useWindowLock` Hook，並顯示 `LockWarning.tsx` 組件。
- [ ] T034 通過 T024 的 E2E 測試。

**檢查點**: 歷史紀錄與進階功能完成。可新增、編輯、刪除紀錄；月圖表可正確顯示；多視窗互斥機制正常運作。

---

## 階段 4: 測試與優化 (第 9-10 天)

**目的**: 完善測試覆蓋率、進行效能優化與可訪問性檢查。

- [ ] T035 補全 `frontend/tests/unit/` 中 `timerSlice`, `historySlice`, `utils` 的單元測試，達成覆蓋率 > 85%。
- [ ] T036 撰寫 `frontend/tests/integration/localStorage.test.tsx` 整合測試，驗證瀏覽器重整後的狀態恢復。
- [ ] T037 撰寫 `frontend/tests/e2e/full-workflow.spec.ts` E2E 測試，涵蓋從首頁到報表查看的完整使用者旅程。
- [ ] T038 [P] 應用效能優化策略：在 `TimerDisplay` 和 `RecordItem` 中使用 `React.memo`。
- [ ] T039 [P] 應用效能優化策略：在 `historySlice` selector 和 `MonthChart` 中使用 `useMemo` 或 `createSelector` 快取計算結果。
- [ ] T040 進行可訪問性檢查：確保所有互動元素都可鍵盤操作，並為 `TimerDisplay` 等動態區域加上 ARIA 標籤。
- [ ] T041 進行憲章合規性最終檢查，更新所有檢查清單。
- [ ] T042 驗證 `quickstart.md` 指南，確保新開發者可順利啟動專案。

**檢查點**: 專案交付就緒。測試覆蓋率達標，所有 E2E 測試通過，效能與可訪問性符合要求。
