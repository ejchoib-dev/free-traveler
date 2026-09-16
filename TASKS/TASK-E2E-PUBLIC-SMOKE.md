# E2E-PUBLIC-SMOKE — 공개 화면 Smoke(SCR-001/002/004 열람)

| 항목 | 값 |
|---|---|
| Task ID | `E2E-PUBLIC-SMOKE` |
| Category | E2E_TEST |
| Implementation Status | IMPLEMENT |
| Priority | M |
| Seq(Task List) | 54 |

## Context

이 Task는 `TASKS/00_TASK_LIST.md`의 Seq 54번 행(`E2E-PUBLIC-SMOKE`, Category=E2E_TEST)을 실제 개발 가능한 단위로 구체화한 것이다. 제목: **공개 화면 Smoke(SCR-001/002/004 열람)**. 근거 문서: `docs/06_SRS_UIUX_REVISED.md`(Requirement 원문), `design-reference/UI_CONTRACT.md`/`design-reference/D-001/DESIGN.md`(디자인 계약).

## Project Scope

Implementation Status: **IMPLEMENT** (`docs/PROJECT_SCOPE.md` 기준, `docs/UIUX_TRACEABILITY.md`와 일치)

PROJECT_SCOPE.md §9: Playwright 핵심 Smoke만 범위이며 Chromium 단일 프로젝트로 한정한다.

## Requirement Ref

REQ-FUNC-001, REQ-FUNC-003, REQ-FUNC-004, REQ-FUNC-006, REQ-FUNC-057, REQ-FUNC-063

## Screen / Route / Page Entry

| Screen | Route | Page Entry |
|---|---|---|
| SCR-001/002/004 | `/`, `/about`, `/mates` | `tests/e2e/public-smoke.spec.ts` |

## Design Ref

- `design-reference/UI_CONTRACT.md` — SCR-001/002/004 절(영역 순서·주요 Component·상태·이동·금지 기능)
- `design-reference/D-001/DESIGN.md` §19 — SCR-001/002/004 Section 순서와 최소 콘텐츠 수

## Depends On

PAGE-SCR001, PAGE-SCR002, PAGE-SCR004

## Expected Files

신규 생성: `tests/e2e/public-smoke.spec.ts`

이 Task는 위에 적힌 파일 **이외의 어떤 파일도 수정하지 않는다**(§Forbidden 참조). 파일 생성 직전에 실제 트리를 다시 확인해 "신규 생성"/"수정"을 재판단한다.

## Functional AC

- 여행지 검색→상세 Drawer→안전정보 Drawer
- 대표 소개 열람
- 동행 목록 비로그인 열람까지 5~7개 핵심 흐름을 Chromium 1개 프로젝트로 실행

## Visual AC

- 없음

## Security/Privacy AC

- 없음

## Test Cases

- TC-FUNC-001: `REQ-FUNC-001` 수용 기준을 검증(`docs/06_SRS_UIUX_REVISED.md` 해당 행 Acceptance Criteria 참조)
- TC-FUNC-003: `REQ-FUNC-003` 수용 기준을 검증(`docs/06_SRS_UIUX_REVISED.md` 해당 행 Acceptance Criteria 참조)
- TC-FUNC-004: `REQ-FUNC-004` 수용 기준을 검증(`docs/06_SRS_UIUX_REVISED.md` 해당 행 Acceptance Criteria 참조)
- TC-FUNC-006: `REQ-FUNC-006` 수용 기준을 검증(`docs/06_SRS_UIUX_REVISED.md` 해당 행 Acceptance Criteria 참조)
- TC-FUNC-057: `REQ-FUNC-057` 수용 기준을 검증(`docs/06_SRS_UIUX_REVISED.md` 해당 행 Acceptance Criteria 참조)
- TC-FUNC-063: `REQ-FUNC-063` 수용 기준을 검증(`docs/06_SRS_UIUX_REVISED.md` 해당 행 Acceptance Criteria 참조)
- 추가 검증: CI-PIPELINE-BASE에서 이 Task의 결과를 다시 확인

## Verify

CI-PIPELINE-BASE

## Definition of Done

- [ ] 'Expected Files'에 적힌 파일이 모두 존재하고, 그 밖의 파일은 수정되지 않았다
- [ ] 'Functional AC'의 모든 항목이 실제 동작으로 확인된다
- [ ] 'Visual AC'의 모든 항목이 `design-reference/D-001/DESIGN.md`·`UI_CONTRACT.md` 기준과 일치한다
- [ ] 'Security/Privacy AC'가 전부 충족된다(해당 없음인 경우 생략)
- [ ] 'Forbidden'에 적힌 어떤 항목도 위반하지 않았다
- [ ] 'Verify'에 지정된 CI-PIPELINE-BASE가 통과한다
- [ ] `docs/UIUX_TRACEABILITY.md`에서 이 Task가 커버하는 Requirement의 Status를 갱신할 준비가 되었다

## Forbidden

- **Expected Files 목록 밖의 파일을 수정하지 않는다.** 이 Task가 건드릴 수 있는 파일은 위 'Expected Files' 절에 적힌 경로가 전부다.
- Firefox/WebKit 등 다중 브라우저 매트릭스, 시각 회귀(visual regression), 부하 테스트를 추가하지 않는다. Chromium Smoke만 다룬다.
- 이 Task 범위에서 EXCLUDED Requirement(예: 콘텐츠 CMS, 감사 로그, 계정 제재, 통합 검색 등)를 구현하지 않는다.
