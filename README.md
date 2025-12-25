# 番茄鐘應用 (Pomodoro Timer)

一個現代化、功能豐富的番茄鐘網頁應用程式，旨在幫助您提高專注力與工作效率。

![專案截圖](https://via.placeholder.com/800x450.png?text=Pomodoro+App+Screenshot)
*(請替換為實際的專案截圖)*

---

## ✨ 主要功能

-   **多種計時模式**: 支援專注、短休息、長休息等不同工作週期。
-   **自訂時間**: 在開始前可以自由調整每個工作週期的時間長度。
-   **歷史紀錄**: 自動追蹤並顯示您已完成的專注時段（尚未實作儲存邏輯）。
-   **多視窗同步**: 獨特的鎖定機制，確保您不會在多個瀏覽器分頁中意外啟動多個計時器。
-   **音效提醒**: 計時結束時會發出聲音提醒。
-   **響應式設計**: 在桌面和行動裝置上都有良好的使用體驗。
-   **高可訪問性**: 遵循網頁可訪問性標準，方便鍵盤與螢幕閱讀器使用者操作。

---

## 🛠️ 技術棧

-   **前端框架**: [React](https://reactjs.org/) 18+
-   **程式語言**: [TypeScript](https://www.typescriptlang.org/)
-   **建構工具**: [Vite](https://vitejs.dev/)
-   **狀態管理**: [Redux Toolkit](https://redux-toolkit.js.org/)
-   **路由**: [React Router](https://reactrouter.com/)
-   **樣式**: [Tailwind CSS](https://tailwindcss.com/)
-   **測試**: [Vitest](https://vitest.dev/) & [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)

---

## 🚀 快速開始

請確保您的環境中已安裝 [Node.js](https://nodejs.org/) (建議版本 18+)。

1.  **Clone 專案** (如果需要)
    ```bash
    git clone <repository-url>
    cd <repository-name>
    ```

2.  **安裝依賴套件**
    在專案根目錄執行：
    ```bash
    npm install
    ```

3.  **準備音效檔案**
    請手動建立 `public/assets/sounds/` 目錄，並將一個名為 `timer-end.mp3` 的音效檔案放置其中。

4.  **啟動開發伺服器**
    ```bash
    npm run dev
    ```
    應用程式將會在 `http://localhost:5173` (或另一個可用的 port) 上運行。

---

## 📜 可用腳本

在 `package.json` 中定義了以下腳本：

-   `npm run dev`: 啟動 Vite 開發伺服器。
-   `npm run build`: 編譯 TypeScript 並打包專案以進行生產部署。
-   `npm run test`: 執行 Vitest 單元與整合測試。
-   `npm run lint`: 使用 ESLint 檢查程式碼品質。
-   `npm run preview`: 在本地預覽生產打包後的應用程式。

---
