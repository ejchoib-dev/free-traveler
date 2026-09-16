---
name: gen-tasklist
description: traveler-project-pipeline Skill을 사용해 TASKS/00_TASK_LIST.md를 승인된 5개 Screen과 114개 Requirement 기준으로 생성·갱신한다.
argument-hint: (인자 없음)
---

# /gen-tasklist

이 커맨드는 **`traveler-project-pipeline` Skill을 사용한다.** 먼저 `.claude/skills/traveler-project-pipeline/SKILL.md`를 읽고 그 규칙을 그대로 적용한다. 이 커맨드는 `TASKS/00_TASK_LIST.md`만 만들거나 갱신하며, Task 상세 파일(`TASKS/TASK-<ID>.md`)은 만들지 않는다 — 그건 `/gen-task-details`의 역할이다. **이 커맨드는 앱 구현 코드를 한 줄도 만들지 않는다.**

## 절차

1. **입력 검증**: `python scripts/validate_inputs.py`를 실행한다. 실패하면 오류를 그대로 사용자에게 보여주고 중단한다.

2. **실제 파일을 읽는다** (추측·과거 스냅샷 금지):
   - `design-reference/SCREEN_ROUTE_CONTRACT.json` — Screen 목록(정본), `schema_version`이 `traveler-screen-route-v1`인지 재확인.
   - `docs/UIUX_TRACEABILITY.md` — 114개 Requirement, Implementation Status, Screen, Route, Page Entry.
   - `docs/06_SRS_UIUX_REVISED.md` — Requirement 원문.
   - `design-reference/UI_CONTRACT.md` — 화면별 영역 순서·컴포넌트·상태·이동·금지 기능.
   - `docs/PROJECT_SCOPE.md` §4~5 — 구현 방식(정적 데이터/DB/서버 미저장 등).
   - `docs/ARCHITECTURE.md`, `docs/DECISION_LOG.md` — DB 6개 테이블·정적 데이터 3종·Playwright 범위 등 확정된 경계.
   - 현재 `src/app`, `src/data`, `src/components`, `supabase`, `tests` 실제 파일 트리(Glob 또는 `find`)를 다시 확인한다.

3. **Task 분해** — SKILL.md §3 Task 종류·ID 체계를 따른다(`PAGE-SCR00X`, `COMP-SCR00X-*`, `SHARED-*`, `DATA-*`, `DB-*`, `UNIT-*`, `TEST-RLS-*`, `E2E-*`, `CI-*`, `DEPLOY-*`, `MANUAL-*`, `RELEASE-*`).
   - SCR-001~005 각각에 Page Owner Task 1개.
   - `UI_CONTRACT.md`의 영역 순서·컴포넌트를 근거로 Component Task를 나눈다.
   - `SKILL.md` §5의 6개 테이블에 정확히 대응하는 DB Task(`DB-SCHEMA-BASE`, `DB-RLS-BASE`, `DB-ACCESS`, `DB-SEED-BASE`).
   - `SKILL.md` §6의 3개 정적 데이터 도메인에 `DATA-*` Task.
   - Header/Footer/디자인 토큰 등 공용 요소는 `SHARED-*`.
   - Playwright는 Chromium Smoke만(`E2E-*`, SKILL.md §8).
   - CI/배포 확인, 수동 접근성·반응형 확인, 최종 Release 확인 Task도 포함한다.

4. **의존성 연결**: Page Owner의 Depends On에는 같은 Screen의 Component Task를 전부 넣는다. DB/Data/Shared → Component → Page Owner → E2E → CI 순서가 되도록 한다.

5. **Requirement 커버리지**: IMPLEMENT 84개가 최소 하나의 Task `Requirement Ref`에 포함되는지 확인한다. EXCLUDED 30개는 상세 Task 없이 `## 6. NON_IMPLEMENTATION` 원장에 근거·후속 방향과 함께 기록한다(삭제 금지).

6. **작성**: `TASKS/00_TASK_LIST.md`를 SKILL.md §11에 정의된 16열 표 형식으로 쓴다. 기존 파일이 있으면 이미 상세가 작성된 Task ID는 유지하면서 갱신한다.

7. **보고**: 생성된 Task 총 개수, Page Owner 5개 확인 여부, IMPLEMENT 84개 커버리지 결과(누락 있으면 목록)를 사용자에게 요약한다. 개수가 45~65 범위를 벗어나도 실패로 보고하지 않는다(SKILL.md §14).
