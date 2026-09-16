# DATA-DESTINATIONS — 여행지 정적 데이터

| 항목 | 값 |
|---|---|
| Task ID | `DATA-DESTINATIONS` |
| Category | DATA |
| Implementation Status | IMPLEMENT |
| Priority | M |
| Seq(Task List) | 43 |

## Context

이 Task는 `TASKS/00_TASK_LIST.md`의 Seq 43번 행(`DATA-DESTINATIONS`, Category=DATA)을 실제 개발 가능한 단위로 구체화한 것이다. 제목: **여행지 정적 데이터**. 근거 문서: `docs/06_SRS_UIUX_REVISED.md`(Requirement 원문), `design-reference/UI_CONTRACT.md`/`design-reference/D-001/DESIGN.md`(디자인 계약).

## Project Scope

Implementation Status: **IMPLEMENT** (`docs/PROJECT_SCOPE.md` 기준, `docs/UIUX_TRACEABILITY.md`와 일치)

PROJECT_SCOPE.md §5: 여행지·안전정보·대표 콘텐츠는 Supabase 테이블이 아니라 `src/data`의 정적 TypeScript 데이터로 관리한다(Editor CMS 워크플로 없음).

## Requirement Ref

REQ-FUNC-001, REQ-FUNC-004, REQ-FUNC-005, REQ-FUNC-006, REQ-FUNC-008, REQ-NF-006, REQ-NF-026

## Screen / Route / Page Entry

| Screen | Route | Page Entry |
|---|---|---|
| 해당없음(표시는 SCR-001) | N/A | `src/data/destinations.ts` |

## Design Ref

- 해당 없음 — 이 Task는 시각 디자인을 직접 다루지 않는다

## Depends On

없음

## Expected Files

신규 생성: `src/data/destinations.ts` (TypeScript, `PROJECT_SCOPE.md` §5 정적 데이터 방식)

이 Task는 위에 적힌 파일 **이외의 어떤 파일도 수정하지 않는다**(§Forbidden 참조). 파일 생성 직전에 실제 트리를 다시 확인해 "신규 생성"/"수정"을 재판단한다.

## Functional AC

- 국내 10개 이상·해외 15개국 30개 도시 이상
- 각 항목 소개·명소 5개 이상·추천시기·1일/3일 일정·예산·교통·음식 3개 이상·에티켓·출처·수정일 TypeScript 타입으로 강제

## Visual AC

- 이미지는 URL+alt 텍스트만(출처·작가·라이선스 메타데이터는 REQ-FUNC-007 EXCLUDED)

## Security/Privacy AC

- 없음

## Test Cases

- TC-FUNC-001: `REQ-FUNC-001` 수용 기준을 검증(`docs/06_SRS_UIUX_REVISED.md` 해당 행 Acceptance Criteria 참조)
- TC-FUNC-004: `REQ-FUNC-004` 수용 기준을 검증(`docs/06_SRS_UIUX_REVISED.md` 해당 행 Acceptance Criteria 참조)
- TC-FUNC-005: `REQ-FUNC-005` 수용 기준을 검증(`docs/06_SRS_UIUX_REVISED.md` 해당 행 Acceptance Criteria 참조)
- TC-FUNC-006: `REQ-FUNC-006` 수용 기준을 검증(`docs/06_SRS_UIUX_REVISED.md` 해당 행 Acceptance Criteria 참조)
- TC-FUNC-008: `REQ-FUNC-008` 수용 기준을 검증(`docs/06_SRS_UIUX_REVISED.md` 해당 행 Acceptance Criteria 참조)
- TC-NF-006: `REQ-NF-006` 수용 기준을 검증(`docs/06_SRS_UIUX_REVISED.md` 해당 행 Acceptance Criteria 참조)
- TC-NF-026: `REQ-NF-026` 수용 기준을 검증(`docs/06_SRS_UIUX_REVISED.md` 해당 행 Acceptance Criteria 참조)
- 추가 검증: 데이터 작성 체크리스트(수동)에서 이 Task의 결과를 다시 확인

## Verify

데이터 작성 체크리스트(수동)

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
