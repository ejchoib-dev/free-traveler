# DEPLOY-ENV-CHECK — Vercel/Supabase 배포·환경변수 확인

| 항목 | 값 |
|---|---|
| Task ID | `DEPLOY-ENV-CHECK` |
| Category | DEPLOY |
| Implementation Status | IMPLEMENT |
| Priority | M |
| Seq(Task List) | 58 |

## Context

이 Task는 `TASKS/00_TASK_LIST.md`의 Seq 58번 행(`DEPLOY-ENV-CHECK`, Category=DEPLOY)을 실제 개발 가능한 단위로 구체화한 것이다. 제목: **Vercel/Supabase 배포·환경변수 확인**. 근거 문서: `docs/06_SRS_UIUX_REVISED.md`(Requirement 원문), `design-reference/UI_CONTRACT.md`/`design-reference/D-001/DESIGN.md`(디자인 계약).

## Project Scope

Implementation Status: **IMPLEMENT** (`docs/PROJECT_SCOPE.md` 기준, `docs/UIUX_TRACEABILITY.md`와 일치)

SRS CON-13: Vercel·Supabase 관리형 서비스만 사용한다. EC2·AWS·자동(무인) Merge는 범위 밖이다.

## Requirement Ref

REQ-NF-012, REQ-NF-016, REQ-NF-034

## Screen / Route / Page Entry

| Screen | Route | Page Entry |
|---|---|---|
| 해당없음 | N/A | `docs/deploy-checklist.md` 또는 Vercel 대시보드 |

## Design Ref

- 해당 없음 — 이 Task는 시각 디자인을 직접 다루지 않는다

## Depends On

DB-SCHEMA-BASE, SHARED-AUTH-SETUP

## Expected Files

신규 생성: 배포 체크리스트 문서

이 Task는 위에 적힌 파일 **이외의 어떤 파일도 수정하지 않는다**(§Forbidden 참조). 파일 생성 직전에 실제 트리를 다시 확인해 "신규 생성"/"수정"을 재판단한다.

## Functional AC

- `FLIGHT_OUTBOUND_URL`/`HOTEL_OUTBOUND_URL`/`MOFA_SAFETY_URL`/Supabase 키가 Vercel 환경변수로 설정
- TLS 기본 적용 확인
- 월 인프라 비용 10만원 이하 요금제 확인

## Visual AC

- 없음

## Security/Privacy AC

- 비밀키가 클라이언트 번들에 포함되지 않음을 빌드 산출물로 확인. **EC2/AWS 사용 안 함(Vercel·Supabase만).**

## Test Cases

- TC-NF-012: `REQ-NF-012` 수용 기준을 검증(`docs/06_SRS_UIUX_REVISED.md` 해당 행 Acceptance Criteria 참조)
- TC-NF-016: `REQ-NF-016` 수용 기준을 검증(`docs/06_SRS_UIUX_REVISED.md` 해당 행 Acceptance Criteria 참조)
- TC-NF-034: `REQ-NF-034` 수용 기준을 검증(`docs/06_SRS_UIUX_REVISED.md` 해당 행 Acceptance Criteria 참조)
- 추가 검증: MANUAL 확인에서 이 Task의 결과를 다시 확인

## Verify

MANUAL 확인

## Definition of Done

- [ ] 'Expected Files'에 적힌 파일이 모두 존재하고, 그 밖의 파일은 수정되지 않았다
- [ ] 'Functional AC'의 모든 항목이 실제 동작으로 확인된다
- [ ] 'Visual AC'의 모든 항목이 `design-reference/D-001/DESIGN.md`·`UI_CONTRACT.md` 기준과 일치한다
- [ ] 'Security/Privacy AC'가 전부 충족된다(해당 없음인 경우 생략)
- [ ] 'Forbidden'에 적힌 어떤 항목도 위반하지 않았다
- [ ] `docs/UIUX_TRACEABILITY.md`에서 이 Task가 커버하는 Requirement의 Status를 갱신할 준비가 되었다

## Forbidden

- **Expected Files 목록 밖의 파일을 수정하지 않는다.** 이 Task가 건드릴 수 있는 파일은 위 'Expected Files' 절에 적힌 경로가 전부다.
- EC2·AWS를 사용하지 않는다. 무인 자동 Merge 게이트를 만들지 않는다(사람이 검토·승인).
- 이 Task 범위에서 EXCLUDED Requirement(예: 콘텐츠 CMS, 감사 로그, 계정 제재, 통합 검색 등)를 구현하지 않는다.
