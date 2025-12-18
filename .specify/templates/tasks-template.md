---

description: "任務清單模板，用於功能實作"
---

# 任務清單: [FEATURE NAME]

**輸入**: 來自 `/specs/[###-feature-name]/` 的設計文件
**前置需求**: plan.md (必需), spec.md (使用者故事必需), research.md, data-model.md, contracts/

**注意**：本文件必須使用繁體中文（zh-TW）撰寫，遵循專案憲章的語言要求。

**測試**: 以下範例包含測試任務。測試為選擇性 - 僅在功能規格中明確要求時才包含它們。

**組織方式**: 任務按使用者故事分組，以實現每個故事的獨立實作和測試。

## 格式: `[ID] [P?] [Story] 描述`

- **[P]**: 可平行執行（不同檔案，無相依性）
- **[Story]**: 此任務屬於哪個使用者故事（例如 US1, US2, US3）
- 在描述中包含確切的檔案路徑

## 路徑慣例

- **單一專案**: 儲存庫根目錄的 `src/`, `tests/`
- **網頁應用**: `backend/src/`, `frontend/src/`
- **行動應用**: `api/src/`, `ios/src/` 或 `android/src/`
- 以下顯示的路徑假設為單一專案 - 根據 plan.md 結構調整

## 憲章合規性檢查清單

在開始實作前，確認任務遵循以下憲章要求：

- [ ] **程式碼品質**: 任務包含模組化設計、清晰命名、程式碼審查步驟
- [ ] **測試優先**: 測試任務在實作任務之前排序
- [ ] **測試覆蓋率**: 核心功能包含單元測試和整合測試
- [ ] **使用者體驗**: UI 相關任務參考設計系統和可訪問性標準
- [ ] **效能驗證**: 關鍵路徑包含效能測試任務
- [ ] **語言一致性**: 所有文件和使用者介面文字使用繁體中文

<!-- 
  ============================================================================
  重要：以下任務為範例任務，僅用於說明目的。
  
  /speckit.tasks 命令必須基於以下內容替換為實際任務：
  - 來自 spec.md 的使用者故事（及其優先級 P1, P2, P3...）
  - 來自 plan.md 的功能需求
  - 來自 data-model.md 的實體
  - 來自 contracts/ 的端點
  
  任務必須按使用者故事組織，以便每個故事可以：
  - 獨立實作
  - 獨立測試
  - 作為 MVP 增量交付
  
  不要在生成的 tasks.md 檔案中保留這些範例任務。
  ============================================================================
-->

## 階段 1: 設定（共享基礎設施）

**目的**: 專案初始化和基本結構

- [ ] T001 根據實作計畫建立專案結構
- [ ] T002 初始化 [語言] 專案及 [框架] 相依套件
- [ ] T003 [P] 配置 linting 和格式化工具

---

## 階段 2: 基礎（阻塞前置條件）

**目的**: 在實作任何使用者故事之前必須完成的核心基礎設施

**⚠️ 關鍵**: 在此階段完成前，不能開始任何使用者故事工作

基礎任務範例（根據你的專案調整）：

- [ ] T004 設定資料庫 schema 和遷移框架
- [ ] T005 [P] 實作認證/授權框架
- [ ] T006 [P] 設定 API 路由和中介軟體結構
- [ ] T007 建立所有故事依賴的基礎模型/實體
- [ ] T008 配置錯誤處理和日誌記錄基礎設施
- [ ] T009 設定環境配置管理

**檢查點**: 基礎就緒 - 使用者故事實作現在可以平行開始

---

## 階段 3: 使用者故事 1 - [標題] (優先級: P1) 🎯 MVP

**目標**: [此故事提供什麼的簡短描述]

**獨立測試**: [如何獨立驗證此故事有效]

### 使用者故事 1 的測試（選擇性 - 僅在要求測試時） ⚠️

> **注意：先撰寫這些測試，確保在實作前失敗**

- [ ] T010 [P] [US1] 在 tests/contract/test_[name].py 中為 [端點] 建立合約測試
- [ ] T011 [P] [US1] 在 tests/integration/test_[name].py 中為 [使用者旅程] 建立整合測試

### 使用者故事 1 的實作

- [ ] T012 [P] [US1] 在 src/models/[entity1].py 中建立 [Entity1] 模型
- [ ] T013 [P] [US1] 在 src/models/[entity2].py 中建立 [Entity2] 模型
- [ ] T014 [US1] 在 src/services/[service].py 中實作 [Service]（依賴 T012, T013）
- [ ] T015 [US1] 在 src/[location]/[file].py 中實作 [端點/功能]
- [ ] T016 [US1] 新增驗證和錯誤處理
- [ ] T017 [US1] 為使用者故事 1 的操作新增日誌記錄

**檢查點**: 此時，使用者故事 1 應完全可用且可獨立測試

---

## Phase 4: User Story 2 - [Title] (Priority: P2)

**Goal**: [Brief description of what this story delivers]

**Independent Test**: [How to verify this story works on its own]

### Tests for User Story 2 (OPTIONAL - only if tests requested) ⚠️

- [ ] T018 [P] [US2] Contract test for [endpoint] in tests/contract/test_[name].py
- [ ] T019 [P] [US2] Integration test for [user journey] in tests/integration/test_[name].py

### Implementation for User Story 2

- [ ] T020 [P] [US2] Create [Entity] model in src/models/[entity].py
- [ ] T021 [US2] Implement [Service] in src/services/[service].py
- [ ] T022 [US2] Implement [endpoint/feature] in src/[location]/[file].py
- [ ] T023 [US2] Integrate with User Story 1 components (if needed)

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - [Title] (Priority: P3)

**Goal**: [Brief description of what this story delivers]

**Independent Test**: [How to verify this story works on its own]

### Tests for User Story 3 (OPTIONAL - only if tests requested) ⚠️

- [ ] T024 [P] [US3] Contract test for [endpoint] in tests/contract/test_[name].py
- [ ] T025 [P] [US3] Integration test for [user journey] in tests/integration/test_[name].py

### Implementation for User Story 3

- [ ] T026 [P] [US3] Create [Entity] model in src/models/[entity].py
- [ ] T027 [US3] Implement [Service] in src/services/[service].py
- [ ] T028 [US3] Implement [endpoint/feature] in src/[location]/[file].py

**Checkpoint**: All user stories should now be independently functional

---

[Add more user story phases as needed, following the same pattern]

---

## Phase N: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] TXXX [P] Documentation updates in docs/
- [ ] TXXX Code cleanup and refactoring
- [ ] TXXX Performance optimization across all stories
- [ ] TXXX [P] Additional unit tests (if requested) in tests/unit/
- [ ] TXXX Security hardening
- [ ] TXXX Run quickstart.md validation

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3)
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - May integrate with US1 but should be independently testable
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - May integrate with US1/US2 but should be independently testable

### Within Each User Story

- Tests (if included) MUST be written and FAIL before implementation
- Models before services
- Services before endpoints
- Core implementation before integration
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks marked [P] can run in parallel (within Phase 2)
- Once Foundational phase completes, all user stories can start in parallel (if team capacity allows)
- All tests for a user story marked [P] can run in parallel
- Models within a story marked [P] can run in parallel
- Different user stories can be worked on in parallel by different team members

---

## Parallel Example: User Story 1

```bash
# Launch all tests for User Story 1 together (if tests requested):
Task: "Contract test for [endpoint] in tests/contract/test_[name].py"
Task: "Integration test for [user journey] in tests/integration/test_[name].py"

# Launch all models for User Story 1 together:
Task: "Create [Entity1] model in src/models/[entity1].py"
Task: "Create [Entity2] model in src/models/[entity2].py"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test User Story 1 independently
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Test independently → Deploy/Demo
4. Add User Story 3 → Test independently → Deploy/Demo
5. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1
   - Developer B: User Story 2
   - Developer C: User Story 3
3. Stories complete and integrate independently

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Verify tests fail before implementing
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
