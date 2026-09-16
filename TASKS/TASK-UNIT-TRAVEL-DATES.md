# UNIT-TRAVEL-DATES — 날짜 검증 단위 테스트

| 항목 | 값 |
|---|---|
| Task ID | `UNIT-TRAVEL-DATES` |
| Category | UNIT_TEST |
| Implementation Status | IMPLEMENT |
| Priority | M |
| Seq(Task List) | 50 |

## Context

이 Task는 `TASKS/00_TASK_LIST.md`의 Seq 50번 행(`UNIT-TRAVEL-DATES`, Category=UNIT_TEST)을 실제 개발 가능한 단위로 구체화한 것이다. 제목: **날짜 검증 단위 테스트**. 근거 문서: `docs/06_SRS_UIUX_REVISED.md`(Requirement 원문), `design-reference/UI_CONTRACT.md`/`design-reference/D-001/DESIGN.md`(디자인 계약).

## Project Scope

Implementation Status: **IMPLEMENT** (`docs/PROJECT_SCOPE.md` 기준, `docs/UIUX_TRACEABILITY.md`와 일치)

## Requirement Ref

REQ-FUNC-013, REQ-FUNC-021

## Screen / Route / Page Entry

| Screen | Route | Page Entry |
|---|---|---|
| 해당없음 | N/A | `tests/unit/travel-dates.spec.ts` |

## Design Ref

- 해당 없음 — 이 Task는 시각 디자인을 직접 다루지 않는다

## Depends On

COMP-SCR003-FLIGHT, COMP-SCR003-HOTEL

## Expected Files

신규 생성: `tests/unit/travel-dates.spec.ts`

이 Task는 위에 적힌 파일 **이외의 어떤 파일도 수정하지 않는다**(§Forbidden 참조). 파일 생성 직전에 실제 트리를 다시 확인해 "신규 생성"/"수정"을 재판단한다.

## Functional AC

- 과거 출발일/체크인
- 역전 귀국일/체크아웃
- 동일 체크인·체크아웃 경계값 전부 차단 검증

## Visual AC

- 없음

## Security/Privacy AC

- 없음

## Test Cases

- TC-FUNC-013: `REQ-FUNC-013` 수용 기준을 검증(`docs/06_SRS_UIUX_REVISED.md` 해당 행 Acceptance Criteria 참조)
- TC-FUNC-021: `REQ-FUNC-021` 수용 기준을 검증(`docs/06_SRS_UIUX_REVISED.md` 해당 행 Acceptance Criteria 참조)
- 추가 검증: 자기 자신(CI-PIPELINE-BASE에서 실행)에서 이 Task의 결과를 다시 확인

## Verify

자기 자신(CI-PIPELINE-BASE에서 실행)

## Definition of Done

- [ ] 'Expected Files'에 적힌 파일이 모두 존재하고, 그 밖의 파일은 수정되지 않았다
- [ ] 'Functional AC'의 모든 항목이 실제 동작으로 확인된다
- [ ] 'Visual AC'의 모든 항목이 `design-reference/D-001/DESIGN.md`·`UI_CONTRACT.md` 기준과 일치한다
- [ ] 'Security/Privacy AC'가 전부 충족된다(해당 없음인 경우 생략)
- [ ] 'Forbidden'에 적힌 어떤 항목도 위반하지 않았다
- [ ] `docs/UIUX_TRACEABILITY.md`에서 이 Task가 커버하는 Requirement의 Status를 갱신할 준비가 되었다

## Forbidden

- **Expected Files 목록 밖의 파일을 수정하지 않는다.** 이 Task가 건드릴 수 있는 파일은 위 'Expected Files' 절에 적힌 경로가 전부다.
- 이 Task 범위에서 EXCLUDED Requirement(예: 콘텐츠 CMS, 감사 로그, 계정 제재, 통합 검색 등)를 구현하지 않는다.
