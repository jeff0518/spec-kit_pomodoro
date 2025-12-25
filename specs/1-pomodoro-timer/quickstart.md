# 快速開始指南：番茄鐘應用

**分支**: `1-pomodoro-timer` | **日期**: 2025-12-18

本指南幫助開發者快速建立開發環境、理解專案結構，並開始開發番茄鐘應用。

---

## 專案概述

**番茄鐘應用** 是一個基於瀏覽器的專注時間管理工具，使用 React + TypeScript + Redux Toolkit 建構，支援：

- 4 種預設工作模式（快速啟動、學習、專注、深度工作）
- 可調整的專注與休息時間
- localStorage 資料持久化
- 多視窗互斥計時機制
- 3 個月歷史紀錄追蹤

---

## 環境需求

### 必要軟體

- **Node.js**: 18.x 或更高版本
- **npm**: 9.x 或更高版本（或 pnpm 8.x / yarn 3.x）
- **Git**: 用於版本控制
- **現代瀏覽器**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+

### 推薦工具

- **Visual Studio Code** 或其他支援 TypeScript 的編輯器
- **VS Code 擴充套件**:
  - ESLint
  - Prettier
  - Tailwind CSS IntelliSense
  - TypeScript + JavaScript Language Features

---

## 專案設置

### 1. 初始化專案

```bash
# 建立專案目錄並進入
npm create vite@latest pomodoro-app -- --template react-ts
cd pomodoro-app
```

### 2. 安裝核心依賴

```bash
# 核心框架與路由
npm install react@^18.2.0 react-dom@^18.2.0
npm install react-router-dom@^6.20.0

# 狀態管理
npm install @reduxjs/toolkit@^2.0.0 react-redux@^9.0.0

# 開發依賴
npm install -D @types/react@^18.2.0 @types/react-dom@^18.2.0
npm install -D typescript@^5.3.0
npm install -D vite@^5.0.0
```

### 3. 安裝 Tailwind CSS

```bash
# 安裝 Tailwind 及相關工具
npm install -D tailwindcss@^3.4.0 postcss@^8.4.0 autoprefixer@^10.4.0

# 初始化 Tailwind 配置
npx tailwindcss init -p
```

**配置 `tailwind.config.js`**：

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
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
  plugins: [],
};
```

**在 `src/index.css` 中引入 Tailwind**：

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### 4. 安裝測試工具

```bash
# 單元測試
npm install -D vitest@^1.0.0 @testing-library/react@^14.0.0 @testing-library/jest-dom@^6.0.0
npm install -D @testing-library/user-event@^14.0.0 jsdom@^23.0.0

# E2E 測試
npm install -D @playwright/test@^1.40.0
npx playwright install
```

---

## 專案結構

### 完整目錄樹

```
pomodoro-app/
├── public/
│   └── assets/
│       └── sounds/
│           └── timer-end.mp3      # 計時結束提示音
├── src/
│   ├── app/
│   │   ├── store.ts               # Redux store 配置
│   │   └── hooks.ts               # 型別化的 useDispatch/useSelector
│   ├── features/
│   │   ├── timer/
│   │   │   ├── timerSlice.ts      # 計時器 Redux slice
│   │   │   ├── TimerDisplay.tsx   # 計時器顯示組件
│   │   │   ├── TimerControls.tsx  # 計時器控制按鈕
│   │   │   └── useTimer.ts        # 計時器自訂 Hook
│   │   ├── history/
│   │   │   ├── historySlice.ts    # 歷史紀錄 Redux slice
│   │   │   ├── RecordList.tsx     # 列表檢視組件
│   │   │   ├── MonthChart.tsx     # 月圖表組件
│   │   │   └── RecordItem.tsx     # 單筆紀錄組件
│   │   ├── lock/
│   │   │   ├── lockSlice.ts       # 視窗鎖定 Redux slice
│   │   │   ├── LockWarning.tsx    # 鎖定警告組件
│   │   │   └── useWindowLock.ts   # 視窗鎖定自訂 Hook
│   │   └── ui/
│   │       ├── uiSlice.ts         # UI 狀態 Redux slice
│   │       └── Notification.tsx   # 通知組件
│   ├── pages/
│   │   ├── HomePage.tsx           # 首頁（模式選擇）
│   │   ├── AdjustPage.tsx         # 時間調整頁面
│   │   ├── TimerPage.tsx          # 計時器頁面
│   │   └── ReportPage.tsx         # 報表頁面
│   ├── components/
│   │   ├── ModeCard.tsx           # 模式卡片組件
│   │   ├── TimeAdjuster.tsx       # 時間調整器組件
│   │   └── Button.tsx             # 通用按鈕組件
│   ├── types/
│   │   ├── index.ts               # 匯出所有型別
│   │   ├── workMode.ts            # WorkMode 型別
│   │   ├── timer.ts               # Timer 相關型別
│   │   └── storage.ts             # localStorage 型別
│   ├── utils/
│   │   ├── localStorage.ts        # localStorage 讀寫工具
│   │   ├── timeFormat.ts          # 時間格式化工具
│   │   ├── validation.ts          # 資料驗證工具
│   │   └── audio.ts               # 音效播放工具
│   ├── constants/
│   │   └── workModes.ts           # 工作模式常數
│   ├── App.tsx                    # 根組件
│   ├── main.tsx                   # 應用入口點
│   └── index.css                  # 全域樣式
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
├── specs/                          # 規格文件（非 src）
│   └── 1-pomodoro-timer/
│       ├── spec.md
│       ├── plan.md
│       ├── research.md
│       ├── data-model.md
│       ├── quickstart.md (本檔案)
│       └── contracts/
│           ├── types.ts
│           └── actions.ts
├── .github/
│   └── workflows/
│       └── ci.yml                 # CI/CD 配置
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
├── .eslintrc.cjs
└── README.md
```

---

## 開發流程

### 1. 啟動開發伺服器

```bash
npm run dev
```

訪問 `http://localhost:5173` 查看應用。

### 2. 開發建議順序

#### 階段 1：基礎設施（第 1-2 天）

1. **建立 Redux store**

   - 配置 Redux Toolkit store
   - 建立 timer, history, lock, ui 四個 slices
   - 實作型別化的 hooks（useAppDispatch, useAppSelector）

2. **實作 localStorage 工具**

   - 讀寫、驗證、錯誤處理函數
   - 3 個月自動清理機制

3. **建立基礎組件**
   - Button, ModeCard, TimeAdjuster
   - 使用 Tailwind CSS 樣式

#### 階段 2：核心功能（第 3-5 天）

4. **首頁與模式選擇**

   - HomePage 組件
   - ModeCard 顯示 4 種模式
   - 點擊導航到 AdjustPage

5. **時間調整頁面**

   - AdjustPage 組件
   - TimeAdjuster 組件（+ / - 按鈕）
   - 範圍驗證（專注 5-90 分鐘，休息 1-30 分鐘）

6. **計時器核心**
   - TimerPage 組件
   - TimerDisplay 顯示倒數時間
   - TimerControls（暫停/繼續、停止、跳過休息）
   - useTimer Hook 實作 tick 邏輯

#### 階段 3：進階功能（第 6-8 天）

7. **歷史紀錄系統**

   - RecordList 列表檢視
   - MonthChart 圖表檢視
   - 編輯/刪除功能

8. **多視窗同步**

   - useWindowLock Hook
   - StorageEvent 監聽
   - LockWarning 組件
   - 接管計時功能

9. **音效與通知**
   - 計時結束音效播放
   - 通知組件（錯誤、警告、提示）

#### 階段 4：測試與優化（第 9-10 天）

10. **單元測試**

    - Redux slices 測試
    - 工具函數測試
    - 自訂 Hooks 測試

11. **整合測試**

    - 完整計時流程測試
    - localStorage 讀寫測試

12. **E2E 測試**
    - Playwright 測試
    - 瀏覽器重新載入恢復測試
    - 多視窗互動測試

---

## 關鍵實作重點

### 1. Redux Store 配置

**`src/app/store.ts`**：

```typescript
import { configureStore } from "@reduxjs/toolkit";
import timerReducer from "../features/timer/timerSlice";
import historyReducer from "../features/history/historySlice";
import lockReducer from "../features/lock/lockSlice";
import uiReducer from "../features/ui/uiSlice";
import { localStorageMiddleware } from "./middleware/localStorage";

export const store = configureStore({
  reducer: {
    timer: timerReducer,
    history: historyReducer,
    lock: lockReducer,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(localStorageMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

**`src/app/hooks.ts`**：

```typescript
import { useDispatch, useSelector, TypedUseSelectorHook } from "react-redux";
import type { RootState, AppDispatch } from "./store";

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
```

---

### 2. 計時器核心邏輯

**`src/features/timer/useTimer.ts`**：

```typescript
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { tick, timerEnd } from "./timerSlice";

export function useTimer() {
  const dispatch = useAppDispatch();
  const { state, remainingSeconds, startTimestamp } = useAppSelector(
    (state) => state.timer
  );

  useEffect(() => {
    if (state !== "focusing" && state !== "resting") return;

    const intervalId = setInterval(() => {
      dispatch(tick());

      // 檢查是否結束
      const currentRemaining = useAppSelector(
        (state) => state.timer.remainingSeconds
      );
      if (currentRemaining === 0) {
        dispatch(timerEnd());
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, [state, startTimestamp, dispatch]);
}
```

---

### 3. localStorage 自動持久化 Middleware

**`src/app/middleware/localStorage.ts`**：

```typescript
import { Middleware } from "@reduxjs/toolkit";
import { STORAGE_KEYS } from "../../types";
import { safeWrite } from "../../utils/localStorage";

export const localStorageMiddleware: Middleware =
  (store) => (next) => (action) => {
    const result = next(action);

    // 監聽 history actions
    if (action.type.startsWith("history/")) {
      const state = store.getState();
      safeWrite(STORAGE_KEYS.HISTORY, {
        version: 1,
        records: state.history.records,
        lastCleanup: Date.now(),
      });
    }

    // 監聽 timer actions（防抖）
    if (action.type.startsWith("timer/") && action.type !== "timer/tick") {
      const state = store.getState();
      debouncedWrite(STORAGE_KEYS.TIMER_STATE, state.timer);
    }

    return result;
  };

// Debounce 實作
let timeoutId: NodeJS.Timeout | null = null;
function debouncedWrite(key: string, value: any) {
  if (timeoutId) clearTimeout(timeoutId);
  timeoutId = setTimeout(() => {
    safeWrite(key, value);
  }, 500);
}
```

---

### 4. 多視窗同步監聽

**`src/features/lock/useWindowLock.ts`**：

```typescript
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { detectLock } from "./lockSlice";
import { STORAGE_KEYS } from "../../types";

export function useWindowLock() {
  const dispatch = useAppDispatch();
  const windowId = useAppSelector((state) => state.timer.windowId);

  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === STORAGE_KEYS.LOCK && event.newValue) {
        const lock = JSON.parse(event.newValue);
        dispatch(
          detectLock({ windowId: lock.windowId, currentWindowId: windowId })
        );
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [windowId, dispatch]);
}
```

---

## 測試指南

### 運行所有測試

```bash
# 單元測試 + 整合測試
npm run test

# E2E 測試
npm run test:e2e

# 測試覆蓋率報告
npm run test:coverage
```

### 測試範例

**單元測試** (`tests/unit/timerSlice.test.ts`):

```typescript
import { describe, it, expect } from "vitest";
import timerReducer, {
  adjustFocusTime,
  initialState,
} from "../../src/features/timer/timerSlice";

describe("timerSlice", () => {
  it("應正確調整專注時間", () => {
    const state = { ...initialState, focusMinutes: 30 };
    const nextState = timerReducer(state, adjustFocusTime(5));
    expect(nextState.focusMinutes).toBe(35);
  });

  it("應限制專注時間在 5-90 分鐘範圍內", () => {
    const state = { ...initialState, focusMinutes: 90 };
    const nextState = timerReducer(state, adjustFocusTime(5));
    expect(nextState.focusMinutes).toBe(90); // 不超過 90
  });
});
```

**E2E 測試** (`tests/e2e/full-workflow.spec.ts`):

```typescript
import { test, expect } from "@playwright/test";

test("完整番茄鐘流程", async ({ page }) => {
  await page.goto("http://localhost:5173");

  // 選擇快速啟動模式
  await page.click("text=快速啟動");

  // 開始計時
  await page.click("text=開始專注");

  // 驗證計時器顯示
  await expect(page.locator('[role="timer"]')).toContainText("20:00");

  // 暫停計時
  await page.click("text=暫停");
  await expect(page.locator("button")).toContainText("繼續");
});
```

---

## 建構與部署

### 生產建構

```bash
npm run build
```

輸出目錄：`dist/`

### 預覽生產建構

```bash
npm run preview
```

### 部署到 Vercel

```bash
# 安裝 Vercel CLI
npm install -g vercel

# 登入
vercel login

# 部署
vercel --prod
```

### 部署到 Netlify

```bash
# 安裝 Netlify CLI
npm install -g netlify-cli

# 登入
netlify login

# 部署
netlify deploy --prod --dir=dist
```

---

## 常見問題

### Q1: 為何計時器每次 tick 會有 1-2 秒誤差？

**A**: JavaScript 的 `setInterval` 不保證精確執行。使用 **時間戳校正機制**：

```typescript
const elapsed = Math.floor((Date.now() - startTimestamp) / 1000);
const remainingSeconds = Math.max(0, totalSeconds - elapsed);
```

### Q2: localStorage 容量不足怎麼辦？

**A**: 實作 `safeWrite` 函數，捕捉 `QuotaExceededError` 並自動清理舊紀錄。

### Q3: 如何測試多視窗同步？

**A**: 使用 Playwright 的 `context.newPage()` 開啟多個頁面模擬多視窗。

### Q4: 音效無法自動播放？

**A**: 瀏覽器的自動播放政策限制。在使用者首次互動時預載音效：

```typescript
useEffect(() => {
  const enableAudio = () => {
    audioRef.current?.play().then(() => audioRef.current?.pause());
  };
  document.addEventListener("click", enableAudio, { once: true });
}, []);
```

---

## 開發資源

### 官方文件

- [React 官方文件](https://react.dev/)
- [Redux Toolkit 官方文件](https://redux-toolkit.js.org/)
- [React Router 官方文件](https://reactrouter.com/)
- [Tailwind CSS 官方文件](https://tailwindcss.com/)
- [Vite 官方文件](https://vitejs.dev/)

### 範例程式碼

- [Redux Toolkit 範例](https://github.com/reduxjs/redux-toolkit/tree/master/examples)
- [React Router 範例](https://github.com/remix-run/react-router/tree/main/examples)

### 社群資源

- [React Discord](https://discord.gg/reactiflux)
- [Stack Overflow - React](https://stackoverflow.com/questions/tagged/reactjs)

---

## 下一步

完成環境設置後，建議按照以下順序進行：

1. ✅ 閱讀 `spec.md` 理解完整功能需求
2. ✅ 閱讀 `data-model.md` 理解資料結構
3. ✅ 閱讀 `research.md` 理解技術選型理由
4. ⏭ 開始實作基礎設施（Redux store、localStorage 工具）
5. ⏭ 逐步實作核心功能（計時器 → 歷史紀錄 → 多視窗同步）
6. ⏭ 撰寫測試確保品質
7. ⏭ 執行 `/speckit.tasks` 生成詳細任務清單

祝開發順利！🍅
