# RELEASE-ACCEPTANCE-CHECK — Release Acceptance 종합 확인

| 항목 | 값 |
|---|---|
| Task ID | `RELEASE-ACCEPTANCE-CHECK` |
| Category | RELEASE_CHECK |
| Implementation Status | IMPLEMENT |
| Priority | M |
| Seq(Task List) | 62 |

## Context

이 Task는 `TASKS/00_TASK_LIST.md`의 Seq 61번 행(`RELEASE-ACCEPTANCE-CHECK`, Category=RELEASE_CHECK)을 실제 개발 가능한 단위로 구체화한 것이다. 제목: **Release Acceptance 종합 확인**. 근거 문서: `docs/06_SRS_UIUX_REVISED.md`(Requirement 원문), `design-reference/UI_CONTRACT.md`/`design-reference/D-001/DESIGN.md`(디자인 계약).

## Project Scope

Implementation Status: **IMPLEMENT** (`docs/PROJECT_SCOPE.md` 기준, `docs/UIUX_TRACEABILITY.md`와 일치)

## Requirement Ref

전체 84개 IMPLEMENT Requirement 종합

## Screen / Route / Page Entry

| Screen | Route | Page Entry |
|---|---|---|
| 전역 | (all routes) | N/A |

## Design Ref

- 해당 없음 — 이 Task는 시각 디자인을 직접 다루지 않는다

## Depends On

PAGE-SCR001, COMP-SCR001-HERO-SEARCH, COMP-SCR001-DOMESTIC-GRID, COMP-SCR001-OVERSEAS-GRID, COMP-SCR001-DEST-DRAWER, COMP-SCR001-SAFETY-DRAWER, COMP-SCR001-THEME-CHIPS, COMP-SCR001-COUNTRY-NOTICE, COMP-SCR001-MATE-PREVIEW, COMP-SCR001-ABOUT-BANNER, PAGE-SCR002, COMP-SCR002-HERO, COMP-SCR002-STATS, COMP-SCR002-STORY, COMP-SCR002-TIMELINE, COMP-SCR002-COUNTRIES, COMP-SCR002-GALLERY, COMP-SCR002-RECOMMEND-CTA, PAGE-SCR003, COMP-SCR003-INTRO-TABS, COMP-SCR003-FLIGHT, COMP-SCR003-HOTEL, COMP-SCR003-MATE-WRITE, PAGE-SCR004, COMP-SCR004-FILTER, COMP-SCR004-LIST, COMP-SCR004-DETAIL, COMP-SCR004-APPLY, COMP-SCR004-REPORT, COMP-SCR004-BLOCK, COMP-SCR004-SAFETY-GUIDE, PAGE-SCR005, COMP-SCR005-AUTH, COMP-SCR005-PROFILE, COMP-SCR005-MY-ACTIVITY, COMP-SCR005-ADMIN, SHARED-LAYOUT, SHARED-DESIGN-TOKENS, SHARED-TOAST, SHARED-AUTH-SETUP, SHARED-FAVORITES, SHARED-ERROR-PAGES, COMP-LEGAL-DOCS, DATA-DESTINATIONS, DATA-SAFETY, DATA-REPRESENTATIVE, DB-SCHEMA-BASE, DB-RLS-BASE, DB-ACCESS, DB-SEED-BASE, UNIT-TRAVEL-DATES, UNIT-CONTACT-DETECTION, UNIT-MATE-STATE, TEST-RLS-BASIC, E2E-PUBLIC-SMOKE, E2E-TRAVEL-TOOLS, E2E-MATE-AUTH, CI-PIPELINE-BASE, DEPLOY-ENV-CHECK, MANUAL-A11Y-CHECK, MANUAL-RESPONSIVE-CHECK

## Expected Files

없음(문서/체크리스트만)

이 Task는 위에 적힌 파일 **이외의 어떤 파일도 수정하지 않는다**(§Forbidden 참조). 파일 생성 직전에 실제 트리를 다시 확인해 "신규 생성"/"수정"을 재판단한다.

## Functional AC

- `docs/05_UIUX_APPROVED.md` §6 AC-REL-01~07 전부 충족 확인, `docs/UIUX_TRACEABILITY.md` Status를 DONE으로 갱신

## Visual AC

- 5개 Screen 전부 Section 순서·최소 콘텐츠 수·Empty State 규칙 최종 재확인

## Security/Privacy AC

- Do Not 목록(Airbnb 상표/구매·예약·결제 UI/Proprietary 폰트/임의 색상) 위반 없음 최종 확인

## Test Cases

- 추가 검증: 사람이 최종 승인에서 이 Task의 결과를 다시 확인

## Verify

사람이 최종 승인

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
