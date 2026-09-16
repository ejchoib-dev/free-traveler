# DB-ACCESS — Server Action 접근 계층

| 항목 | 값 |
|---|---|
| Task ID | `DB-ACCESS` |
| Category | DB |
| Implementation Status | IMPLEMENT |
| Priority | M |
| Seq(Task List) | 48 |

## Context

이 Task는 `TASKS/00_TASK_LIST.md`의 Seq 48번 행(`DB-ACCESS`, Category=DB)을 실제 개발 가능한 단위로 구체화한 것이다. 제목: **Server Action 접근 계층**. 근거 문서: `docs/06_SRS_UIUX_REVISED.md`(Requirement 원문), `design-reference/UI_CONTRACT.md`/`design-reference/D-001/DESIGN.md`(디자인 계약).

## Project Scope

Implementation Status: **IMPLEMENT** (`docs/PROJECT_SCOPE.md` 기준, `docs/UIUX_TRACEABILITY.md`와 일치)

PROJECT_SCOPE.md §5·SKILL.md §5: DB는 `USER_PROFILE, MATE_POST, MATE_APPLICATION, USER_BLOCK, REPORT, OUTBOUND_URL_SETTING` **정확히 6개 테이블**로 제한한다. AUDIT_LOG 등 7번째 테이블을 만들지 않는다(REQ-FUNC-056·076·NF-022 EXCLUDED).

## Requirement Ref

REQ-FUNC-030, REQ-FUNC-033, REQ-FUNC-034, REQ-FUNC-035, REQ-FUNC-036, REQ-FUNC-037, REQ-FUNC-038, REQ-FUNC-039, REQ-FUNC-040, REQ-FUNC-041, REQ-FUNC-077, REQ-NF-005, REQ-NF-015, REQ-NF-019

## Screen / Route / Page Entry

| Screen | Route | Page Entry |
|---|---|---|
| 해당없음 | N/A | `src/lib/db/*.ts` |

## Design Ref

- 해당 없음 — 이 Task는 시각 디자인을 직접 다루지 않는다

## Depends On

DB-SCHEMA-BASE, DB-RLS-BASE

## Expected Files

신규 생성: `src/lib/db/matePosts.ts`, `src/lib/db/applications.ts`, `src/lib/db/blocks.ts`, `src/lib/db/reports.ts`, `src/lib/db/outboundUrls.ts`

이 Task는 위에 적힌 파일 **이외의 어떤 파일도 수정하지 않는다**(§Forbidden 참조). 파일 생성 직전에 실제 트리를 다시 확인해 "신규 생성"/"수정"을 재판단한다.

## Functional AC

- 6개 테이블에 대한 CRUD/상태 전이 Server Action
- 쓰기 API p95≤3s 목표로 구현
- 입력 검증·이스케이프

## Visual AC

- 없음

## Security/Privacy AC

- 저장 XSS 차단(파라미터 바인딩)
- 항공·호텔 데이터는 이 계층에 포함하지 않음(REQ-FUNC-017/025)

## Test Cases

- TC-FUNC-030: `REQ-FUNC-030` 수용 기준을 검증(`docs/06_SRS_UIUX_REVISED.md` 해당 행 Acceptance Criteria 참조)
- TC-FUNC-033: `REQ-FUNC-033` 수용 기준을 검증(`docs/06_SRS_UIUX_REVISED.md` 해당 행 Acceptance Criteria 참조)
- TC-FUNC-034: `REQ-FUNC-034` 수용 기준을 검증(`docs/06_SRS_UIUX_REVISED.md` 해당 행 Acceptance Criteria 참조)
- TC-FUNC-035: `REQ-FUNC-035` 수용 기준을 검증(`docs/06_SRS_UIUX_REVISED.md` 해당 행 Acceptance Criteria 참조)
- TC-FUNC-036: `REQ-FUNC-036` 수용 기준을 검증(`docs/06_SRS_UIUX_REVISED.md` 해당 행 Acceptance Criteria 참조)
- TC-FUNC-037: `REQ-FUNC-037` 수용 기준을 검증(`docs/06_SRS_UIUX_REVISED.md` 해당 행 Acceptance Criteria 참조)
- TC-FUNC-038: `REQ-FUNC-038` 수용 기준을 검증(`docs/06_SRS_UIUX_REVISED.md` 해당 행 Acceptance Criteria 참조)
- TC-FUNC-039: `REQ-FUNC-039` 수용 기준을 검증(`docs/06_SRS_UIUX_REVISED.md` 해당 행 Acceptance Criteria 참조)
- TC-FUNC-040: `REQ-FUNC-040` 수용 기준을 검증(`docs/06_SRS_UIUX_REVISED.md` 해당 행 Acceptance Criteria 참조)
- TC-FUNC-041: `REQ-FUNC-041` 수용 기준을 검증(`docs/06_SRS_UIUX_REVISED.md` 해당 행 Acceptance Criteria 참조)
- TC-FUNC-077: `REQ-FUNC-077` 수용 기준을 검증(`docs/06_SRS_UIUX_REVISED.md` 해당 행 Acceptance Criteria 참조)
- TC-NF-005: `REQ-NF-005` 수용 기준을 검증(`docs/06_SRS_UIUX_REVISED.md` 해당 행 Acceptance Criteria 참조)
- TC-NF-015: `REQ-NF-015` 수용 기준을 검증(`docs/06_SRS_UIUX_REVISED.md` 해당 행 Acceptance Criteria 참조)
- TC-NF-019: `REQ-NF-019` 수용 기준을 검증(`docs/06_SRS_UIUX_REVISED.md` 해당 행 Acceptance Criteria 참조)
- 추가 검증: TEST-RLS-BASIC, UNIT-MATE-STATE에서 이 Task의 결과를 다시 확인

## Verify

TEST-RLS-BASIC, UNIT-MATE-STATE

## Definition of Done

- [ ] 'Expected Files'에 적힌 파일이 모두 존재하고, 그 밖의 파일은 수정되지 않았다
- [ ] 'Functional AC'의 모든 항목이 실제 동작으로 확인된다
- [ ] 'Visual AC'의 모든 항목이 `design-reference/D-001/DESIGN.md`·`UI_CONTRACT.md` 기준과 일치한다
- [ ] 'Security/Privacy AC'가 전부 충족된다(해당 없음인 경우 생략)
- [ ] 'Forbidden'에 적힌 어떤 항목도 위반하지 않았다
- [ ] 'Verify'에 지정된 TEST-RLS-BASIC, UNIT-MATE-STATE가 통과한다
- [ ] `docs/UIUX_TRACEABILITY.md`에서 이 Task가 커버하는 Requirement의 Status를 갱신할 준비가 되었다

## Forbidden

- **Expected Files 목록 밖의 파일을 수정하지 않는다.** 이 Task가 건드릴 수 있는 파일은 위 'Expected Files' 절에 적힌 경로가 전부다.
- **다음 6개 외의 테이블을 만들지 않는다:** USER_PROFILE, MATE_POST, MATE_APPLICATION, USER_BLOCK, REPORT, OUTBOUND_URL_SETTING. AUDIT_LOG 등 감사 로그 테이블은 만들지 않는다(REQ-FUNC-056·076 EXCLUDED).
- 이 Task 범위에서 EXCLUDED Requirement(예: 콘텐츠 CMS, 감사 로그, 계정 제재, 통합 검색 등)를 구현하지 않는다.
