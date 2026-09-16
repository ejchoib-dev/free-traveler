# MANUAL-RESPONSIVE-CHECK — 반응형·Core Web Vitals 수동 확인

| 항목 | 값 |
|---|---|
| Task ID | `MANUAL-RESPONSIVE-CHECK` |
| Category | MANUAL_CHECK |
| Implementation Status | IMPLEMENT |
| Priority | M |
| Seq(Task List) | 60 |

## Context

이 Task는 `TASKS/00_TASK_LIST.md`의 Seq 60번 행(`MANUAL-RESPONSIVE-CHECK`, Category=MANUAL_CHECK)을 실제 개발 가능한 단위로 구체화한 것이다. 제목: **반응형·Core Web Vitals 수동 확인**. 근거 문서: `docs/06_SRS_UIUX_REVISED.md`(Requirement 원문), `design-reference/UI_CONTRACT.md`/`design-reference/D-001/DESIGN.md`(디자인 계약).

## Project Scope

Implementation Status: **IMPLEMENT** (`docs/PROJECT_SCOPE.md` 기준, `docs/UIUX_TRACEABILITY.md`와 일치)

## Requirement Ref

REQ-FUNC-065, REQ-NF-001, REQ-NF-002, REQ-NF-003

## Screen / Route / Page Entry

| Screen | Route | Page Entry |
|---|---|---|
| 전역 | (all routes) | N/A(브라우저 수동 확인) |

## Design Ref

- 해당 없음 — 이 Task는 시각 디자인을 직접 다루지 않는다

## Depends On

SHARED-LAYOUT, PAGE-SCR001, PAGE-SCR002, PAGE-SCR003, PAGE-SCR004, PAGE-SCR005

## Expected Files

없음(문서/체크리스트만)

이 Task는 위에 적힌 파일 **이외의 어떤 파일도 수정하지 않는다**(§Forbidden 참조). 파일 생성 직전에 실제 트리를 다시 확인해 "신규 생성"/"수정"을 재판단한다.

## Functional AC

- 320px~Desktop까지 가로 스크롤·겹침 없음
- Lighthouse로 LCP/INP/CLS 목표치 확인

## Visual AC

- 5개 Screen 전부 D-001 §15 Breakpoint 규칙 준수

## Security/Privacy AC

- 없음

## Test Cases

- TC-FUNC-065: `REQ-FUNC-065` 수용 기준을 검증(`docs/06_SRS_UIUX_REVISED.md` 해당 행 Acceptance Criteria 참조)
- TC-NF-001: `REQ-NF-001` 수용 기준을 검증(`docs/06_SRS_UIUX_REVISED.md` 해당 행 Acceptance Criteria 참조)
- TC-NF-002: `REQ-NF-002` 수용 기준을 검증(`docs/06_SRS_UIUX_REVISED.md` 해당 행 Acceptance Criteria 참조)
- TC-NF-003: `REQ-NF-003` 수용 기준을 검증(`docs/06_SRS_UIUX_REVISED.md` 해당 행 Acceptance Criteria 참조)
- 추가 검증: 사람이 브라우저에서 직접 확인에서 이 Task의 결과를 다시 확인

## Verify

사람이 브라우저에서 직접 확인

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
