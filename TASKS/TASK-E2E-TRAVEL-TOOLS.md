# E2E-TRAVEL-TOOLS — 항공·숙소 외부 이동 Smoke

| 항목 | 값 |
|---|---|
| Task ID | `E2E-TRAVEL-TOOLS` |
| Category | E2E_TEST |
| Implementation Status | IMPLEMENT |
| Priority | M |
| Seq(Task List) | 55 |

## Context

이 Task는 `TASKS/00_TASK_LIST.md`의 Seq 55번 행(`E2E-TRAVEL-TOOLS`, Category=E2E_TEST)을 실제 개발 가능한 단위로 구체화한 것이다. 제목: **항공·숙소 외부 이동 Smoke**. 근거 문서: `docs/06_SRS_UIUX_REVISED.md`(Requirement 원문), `design-reference/UI_CONTRACT.md`/`design-reference/D-001/DESIGN.md`(디자인 계약).

## Project Scope

Implementation Status: **IMPLEMENT** (`docs/PROJECT_SCOPE.md` 기준, `docs/UIUX_TRACEABILITY.md`와 일치)

PROJECT_SCOPE.md §9: Playwright 핵심 Smoke만 범위이며 Chromium 단일 프로젝트로 한정한다.

## Requirement Ref

REQ-FUNC-011, REQ-FUNC-013, REQ-FUNC-016, REQ-FUNC-019, REQ-FUNC-021, REQ-FUNC-024

## Screen / Route / Page Entry

| Screen | Route | Page Entry |
|---|---|---|
| SCR-003 | `/travel-tools` | `tests/e2e/travel-tools.spec.ts` |

## Design Ref

- `design-reference/UI_CONTRACT.md` — SCR-003 절(영역 순서·주요 Component·상태·이동·금지 기능)
- `design-reference/D-001/DESIGN.md` §19 — SCR-003 Section 순서와 최소 콘텐츠 수

## Depends On

PAGE-SCR003

## Expected Files

신규 생성: `tests/e2e/travel-tools.spec.ts`

이 Task는 위에 적힌 파일 **이외의 어떤 파일도 수정하지 않는다**(§Forbidden 참조). 파일 생성 직전에 실제 트리를 다시 확인해 "신규 생성"/"수정"을 재판단한다.

## Functional AC

- 항공/숙소 입력→검증 오류→유효 요약→새 탭 이동(`noopener`) 흐름을 Chromium으로 검증
- 네트워크 탭에서 입력값 미전송 확인

## Visual AC

- 없음

## Security/Privacy AC

- 입력값이 요청 URL/바디에 없음을 자동 검증

## Test Cases

- TC-FUNC-011: `REQ-FUNC-011` 수용 기준을 검증(`docs/06_SRS_UIUX_REVISED.md` 해당 행 Acceptance Criteria 참조)
- TC-FUNC-013: `REQ-FUNC-013` 수용 기준을 검증(`docs/06_SRS_UIUX_REVISED.md` 해당 행 Acceptance Criteria 참조)
- TC-FUNC-016: `REQ-FUNC-016` 수용 기준을 검증(`docs/06_SRS_UIUX_REVISED.md` 해당 행 Acceptance Criteria 참조)
- TC-FUNC-019: `REQ-FUNC-019` 수용 기준을 검증(`docs/06_SRS_UIUX_REVISED.md` 해당 행 Acceptance Criteria 참조)
- TC-FUNC-021: `REQ-FUNC-021` 수용 기준을 검증(`docs/06_SRS_UIUX_REVISED.md` 해당 행 Acceptance Criteria 참조)
- TC-FUNC-024: `REQ-FUNC-024` 수용 기준을 검증(`docs/06_SRS_UIUX_REVISED.md` 해당 행 Acceptance Criteria 참조)
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
