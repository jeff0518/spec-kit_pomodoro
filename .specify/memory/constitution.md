<!--
Sync Impact Report:
Version Change: None → 1.0.0
Modified Principles: All principles newly defined
Added Sections: Core Principles (4), Language & Documentation Requirements, Development Standards
Removed Sections: None
Templates Requiring Updates:
  ✅ constitution.md - Updated with concrete principles
  ✅ plan-template.md - Updated with zh-TW constitution checks
  ✅ spec-template.md - Updated with zh-TW language enforcement and localized headers
  ✅ tasks-template.md - Updated with zh-TW language, constitution checklist, and test discipline
  ✅ checklist-template.md - Updated with zh-TW language
Follow-up TODOs:
  - Verify agent prompt files (.github/prompts/*.md) reference correct principles
  - Consider updating README.md with constitution summary (if README exists)
  - Review agent files (.github/agents/*.md) for language consistency
-->

# Spec-Kit Pomodoro 專案憲章

## 核心原則

### I. 程式碼品質標準（必須遵守）

所有程式碼必須達到以下品質標準：

- **可讀性優先**：程式碼必須易於理解，變數和函數命名清晰，避免縮寫
- **模組化設計**：功能必須分解為獨立、可重用的模組，單一職責原則嚴格執行
- **程式碼審查必須**：所有程式碼變更必須經過至少一位其他開發者審查才能合併
- **靜態分析工具**：必須使用 linter 和格式化工具，並在 CI/CD 中強制執行
- **技術債務追蹤**：任何已知的程式碼品質問題必須記錄為技術債務任務

**理由**：高品質的程式碼降低維護成本、減少 bug，並提升團隊協作效率。程式碼品質是長期專案成功的基石。

### II. 測試驅動開發（必須遵守）

測試是開發流程的核心，不可妥協：

- **測試優先**：必須先撰寫測試，待使用者批准後，確認測試失敗，然後才實作功能
- **測試覆蓋率**：單元測試覆蓋率必須達到 80% 以上，核心業務邏輯必須達到 100%
- **Red-Green-Refactor 循環**：嚴格遵循 TDD 週期
- **整合測試必要性**：涉及多個模組交互、API 合約變更、資料持久化的功能必須包含整合測試
- **測試即文檔**：測試應清楚展示功能的預期行為，作為活文檔

**理由**：測試驅動開發確保程式碼正確性、減少回歸錯誤，並提供即時回饋。測試是品質的保證，也是重構的安全網。

### III. 使用者體驗一致性（必須遵守）

使用者介面和互動必須保持一致性：

- **設計系統遵循**：必須遵循既定的設計系統和 UI 組件庫，不得隨意創建不一致的元件
- **互動模式統一**：相同操作在不同位置必須使用相同的互動方式（例如：確認對話框、錯誤提示）
- **可訪問性標準**：必須符合 WCAG 2.1 AA 級別標準，包括鍵盤導航、螢幕閱讀器支援
- **回應式設計**：必須在不同裝置尺寸和解析度下提供一致且可用的體驗
- **使用者測試**：關鍵使用者流程必須經過實際使用者測試或可用性評估

**理由**：一致的使用者體驗降低學習曲線、減少使用者錯誤，並提升產品的專業度和可信度。可訪問性確保所有使用者都能使用產品。

### IV. 效能要求標準（必須遵守）

效能是功能的一部分，必須明確定義和測量：

- **響應時間目標**：API 請求 p95 必須 < 500ms，UI 互動回饋必須 < 100ms
- **資源使用限制**：應用記憶體使用必須 < 200MB（基線），CPU 使用率在正常操作下 < 30%
- **效能測試必須**：涉及資料處理、網路請求、複雜運算的功能必須包含效能測試
- **效能回歸防護**：CI/CD 必須包含效能基準測試，防止效能回歸
- **優化權衡記錄**：任何效能優化必須記錄權衡決策（例如：記憶體換時間）

**理由**：效能直接影響使用者體驗和系統可擴展性。明確的效能標準確保產品在真實使用場景下可靠運行。

## 語言與文件要求

**繁體中文強制規範**：

所有規格文件（spec.md）、實作計畫（plan.md）、任務清單（tasks.md）、使用者導向文件（quickstart.md）、API 文件、以及面向使用者的介面文字必須使用繁體中文（zh-TW）撰寫。

**程式碼內註解**：可使用英文或繁體中文，但函數和類別的文檔字串應優先使用繁體中文以保持一致性。

**技術術語**：可保留英文技術術語（例如：API, HTTP, database），但應在首次出現時提供中文說明。

**理由**：語言一致性確保團隊成員和使用者都能清楚理解文件和介面，降低溝通成本和理解障礙。

## 開發標準與流程

**版本控制**：

- 使用 Git 進行版本控制
- 分支命名規範：`###-feature-name` 格式（例如：001-user-authentication）
- Commit 訊息必須清楚描述變更內容

**程式碼審查流程**：

- 所有 Pull Request 必須經過程式碼審查
- 審查者必須驗證：程式碼品質、測試覆蓋、憲章合規性
- 必須通過所有自動化測試才能合併

**持續整合/持續部署**：

- 所有變更必須通過 CI 流程（測試、靜態分析、效能測試）
- 部署必須經過階段性驗證（開發 → 測試 → 正式）

## 治理規範

本憲章優先於所有其他開發實踐和慣例。

**合規性驗證**：

- 所有 Pull Request 和程式碼審查必須驗證憲章合規性
- 任何違反核心原則的情況必須提供明確的正當理由並記錄
- 開發團隊應定期（每季度）審查憲章合規情況

**憲章修訂流程**：

- 憲章修訂必須經過團隊討論和批准
- 修訂必須記錄理由、影響範圍和遷移計畫
- 版本號遵循語義化版本控制：
  - **MAJOR**：原則移除或重大重新定義（向後不相容）
  - **MINOR**：新增原則或重大擴充
  - **PATCH**：澄清、用詞調整、非語義變更

**憲章運用指引**：

- 在開始功能開發前，必須參考本憲章進行合規性檢查
- 實作計畫（plan.md）必須包含「憲章檢查」區段
- 開發者應使用 `.specify/templates/` 中的模板確保流程一致性

**Version**: 1.0.0 | **Ratified**: 2025-12-18 | **Last Amended**: 2025-12-18
