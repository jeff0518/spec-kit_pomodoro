# Spec-Kit Pomodoro - AI Agent Context

**專案名稱**: Spec-Kit Pomodoro  
**建立日期**: 2025-12-18  
**最後更新**: 2025-12-18

## Active Technologies

- **React 18.2** + **TypeScript 5.0** + **Tailwind CSS 3.4** (1-pomodoro-timer)
- **Redux Toolkit 2.0** + **React Router 6.x** (1-pomodoro-timer)
- **Vite 5.x** (建構工具) (1-pomodoro-timer)

## Project Structure

```
frontend/
├── src/
│   ├── app/                    # Redux store 配置
│   ├── features/               # 功能模組（timer, history, lock, ui）
│   ├── pages/                  # 路由頁面組件
│   ├── components/             # 可重用組件
│   ├── types/                  # TypeScript 型別定義
│   ├── utils/                  # 工具函數
│   └── constants/              # 常數定義
├── tests/                      # 測試檔案
│   ├── unit/
│   ├── integration/
│   └── e2e/
└── specs/                      # 規格文件
    └── 1-pomodoro-timer/
        ├── spec.md
        ├── plan.md
        ├── research.md
        ├── data-model.md
        ├── quickstart.md
        └── contracts/
```

## Run Commands

```bash
# 開發伺服器
npm run dev

# 測試
npm run test              # 單元測試 + 整合測試
npm run test:e2e          # E2E 測試
npm run test:coverage     # 測試覆蓋率

# 建構
npm run build
npm run preview

# 程式碼品質
npm run lint
npm run format
npm run type-check
```

## Recent Changes

- 2025-12-18: 新增 React 18.2 + TypeScript 5.0 + Tailwind CSS 3.4 技術棧 (1-pomodoro-timer)
- 2025-12-18: 新增 Redux Toolkit 2.0 + React Router 6.x 狀態管理與路由 (1-pomodoro-timer)
- 2025-12-18: 新增 Vite 5.x 作為建構工具 (1-pomodoro-timer)

## Language Conventions

**繁體中文（zh-TW）強制要求**：

- 所有規格文件（spec.md, plan.md, tasks.md）必須使用繁體中文
- 所有使用者介面文字必須使用繁體中文
- 所有文件檔案（quickstart.md, README.md）必須使用繁體中文
- 程式碼註解可使用英文或繁體中文，但文檔字串應優先使用繁體中文

**技術術語**：可保留英文（如 API, HTTP, localStorage），但首次出現應提供中文說明。

## Constitution Compliance

根據 `.specify/memory/constitution.md`，所有開發必須遵守：

1. **程式碼品質標準**：可讀性優先、模組化設計、程式碼審查必須、靜態分析工具
2. **測試驅動開發**：測試優先、覆蓋率 80%+、Red-Green-Refactor 循環
3. **使用者體驗一致性**：設計系統遵循、互動模式統一、WCAG 2.1 AA 標準
4. **效能要求標準**：API < 500ms p95, UI < 100ms, 效能測試必須

## Slash Commands

使用 `.github/prompts/` 中的 slash commands：

- `/speckit.clarify` - 澄清規格模糊點
- `/speckit.plan` - 生成實作計畫
- `/speckit.tasks` - 生成任務清單

We're going to be using slash command from `.github\prompts\`
