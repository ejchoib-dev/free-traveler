---
name: traveler-project-pipeline
description: Traveler(Free Traveler) 프로젝트의 Task 생성·상세화·감사 파이프라인. 승인된 5개 Screen과 docs/06_SRS_UIUX_REVISED.md의 114개 Requirement를 근거로 TASKS/00_TASK_LIST.md와 TASKS/TASK-*.md를 만들고 scripts/audit_tasks.py로 검증한다. Task List/상세/감사를 만들거나 다시 확인할 때 사용한다.
user-invocable: true
disable-model-invocation: false
---

# Traveler Project Pipeline

이 Skill은 Traveler(Free Traveler) 앱의 **Task 생성·상세화·감사 파이프라인**을 정의한다. 화면 자체를 지금 구현하지 않으며, "무엇을 어떤 Task로 쪼갤지"와 "그 결과가 정본과 일치하는지"만 다룬다. **이 Skill로 실행하는 모든 작업은 실제 앱 구현 코드를 만들지 않는다** — 산출물은 항상 `TASKS/` 아래의 문서다.

## 0. 정본 문서

| 문서 | 역할 |
|---|---|
| `CLAUDE.md`(저장소 루트) | Harness Marker, 필수 규칙 23개, Task 완료 순서 — 이 Skill보다 상위의 저장소 전역 규칙 |
| `docs/06_SRS_UIUX_REVISED.md` | 114개 Requirement 원문 + Screen 매핑 |
| `docs/PROJECT_SCOPE.md` | IMPLEMENT/EXCLUDED 확정, 구현 방식(§5) |
| `docs/UIUX_TRACEABILITY.md` | Requirement × Screen × Route × Page Entry × Task × Test × Status(8열) |
| `docs/ARCHITECTURE.md` | 구현 경계(기술 스택, Server/Client 구분, DB 6개 테이블, 착수 차단 등) |
| `docs/DECISION_LOG.md` | DEC-001~014 결정 이력(Wave 실행 단위 포함) |
| `design-reference/D-001/DESIGN.md` | 디자인 정본(§14 Empty 상태, §19 Section 최소 콘텐츠 수, §21 Do/Do Not) |
| `design-reference/UI_CONTRACT.md` | 화면별 영역 순서·컴포넌트·상태·이동·금지 기능 |
| `design-reference/SCREEN_ROUTE_CONTRACT.json` | **Screen 목록의 유일한 정본**(HARNESS_SCHEMA 포함) |
| `TASKS/00_TASK_LIST.md` | Task 목록 정본(16열 표 + NON_IMPLEMENTATION 원장) |
| `TASKS/TASK-*.md` | Task 상세 정본(14개 절) |
| `TASKS/TASK_MANIFEST.csv`, `TASKS/TASK_AUDIT_REPORT.md` | 감사 산출물(생성물, 직접 손으로 고치지 않음 — `scripts/audit_tasks.py`가 매번 다시 만든다) |
| `package.json`, `src/app/**` | 현재 실제 구현 상태(스캐폴드 여부) — 매 실행 시 다시 확인 |

이 문서들의 값이 서로 다르면 위 표의 위에서 아래 순서를 우선한다(단, Screen 목록 자체는 항상 `SCREEN_ROUTE_CONTRACT.json`이 최우선).

## 1. HARNESS_SCHEMA

`HARNESS_SCHEMA = "traveler-screen-route-v1"` (`CLAUDE.md`의 Harness Marker와 동일). `SCREEN_ROUTE_CONTRACT.json`의 `schema_version`이 이 값과 다르면 파이프라인 전체를 중단하고 사람에게 보고한다.

## 2. Screen 정본 (규칙 2)

Screen 목록·Route·Page Entry·core/auxiliary 구분은 오직 `SCREEN_ROUTE_CONTRACT.json`에서 읽는다. 현재 정본 값(실행 시 반드시 파일에서 다시 확인):

| Screen | Route | Page Entry | 구분 |
|---|---|---|---|
| SCR-001 | `/` | `src/app/page.tsx` | auxiliary |
| SCR-002 | `/about` | `src/app/about/page.tsx` | core |
| SCR-003 | `/travel-tools` | `src/app/travel-tools/page.tsx` | core |
| SCR-004 | `/mates` | `src/app/mates/page.tsx` | core |
| SCR-005 | `/account` | `src/app/account/page.tsx` | core |

## 3. Task 종류와 ID 체계

실제 `TASKS/00_TASK_LIST.md`에서 쓰는 접두어는 다음과 같다(새 Task를 추가할 때도 이 패턴을 따른다).

| Category | ID 패턴 | 예시 |
|---|---|---|
| PAGE_OWNER | `PAGE-SCR00X` | `PAGE-SCR001` |
| COMPONENT | `COMP-SCR00X-<이름>` | `COMP-SCR003-FLIGHT` |
| SHARED | `SHARED-<이름>` | `SHARED-LAYOUT` |
| DATA | `DATA-<이름>` | `DATA-DESTINATIONS` |
| DB | `DB-<이름>` | `DB-SCHEMA-BASE`, `DB-RLS-BASE`, `DB-ACCESS`, `DB-SEED-BASE` |
| UNIT_TEST | `UNIT-<이름>` | `UNIT-TRAVEL-DATES` |
| RLS_TEST | `TEST-RLS-<이름>` | `TEST-RLS-BASIC` |
| E2E_TEST | `E2E-<이름>` | `E2E-PUBLIC-SMOKE` |
| CI | `CI-<이름>` | `CI-PIPELINE-BASE` |
| DEPLOY | `DEPLOY-<이름>` | `DEPLOY-ENV-CHECK` |
| MANUAL_CHECK | `MANUAL-<이름>` | `MANUAL-A11Y-CHECK` |
| RELEASE_CHECK | `RELEASE-<이름>` | `RELEASE-ACCEPTANCE-CHECK` |

Screen당 PAGE_OWNER는 정확히 1개이며, Page Owner는 같은 Screen의 COMPONENT Task를 Depends On으로 갖는다(Page Owner는 Page Entry에서 이미 만들어진 Component를 조립만 한다 — `CLAUDE.md` 규칙 9).

## 4. Expected Files 작성 규칙

Task 상세를 쓰기 직전에 **반드시** 실제 파일 트리를 다시 확인한다(Glob `src/app/**`, `src/data/**`, `src/components/**`, `supabase/**`, `tests/**`). 이미 있는 파일은 "수정"으로, 없는 파일은 "신규 생성"으로 표기한다. 과거 스냅샷이나 추측으로 경로를 적지 않는다.

## 5. DB 범위 — 정확히 6개 테이블

`USER_PROFILE`, `MATE_POST`, `MATE_APPLICATION`, `USER_BLOCK`, `REPORT`, `OUTBOUND_URL_SETTING`. 그 외 테이블(예: `AUDIT_LOG`)을 만들지 않는다(`docs/DECISION_LOG.md` DEC-006).

## 6. 정적 데이터 Task

여행지(`DATA-DESTINATIONS`)·국가 안전정보(`DATA-SAFETY`)·대표 프로필(`DATA-REPRESENTATIVE`)은 DB Task가 아니라 `src/data/*.ts` 정적 TypeScript 데이터다(DEC-004).

## 7. 항공·숙소 입력값 금지 사항

`COMP-SCR003-FLIGHT`, `COMP-SCR003-HOTEL`의 Forbidden/Security-Privacy AC에는 반드시 "서버 DB·서버 로그·분석 이벤트·외부 URL 쿼리 어디에도 전달·저장하지 않는다"를 명시한다(DEC-007, `CLAUDE.md` 규칙 12).

## 8. Playwright 범위

E2E_TEST Task는 **Chromium 단일 프로젝트의 Smoke만** 다룬다. 다중 브라우저, 시각 회귀, 부하 테스트 Task를 만들지 않는다(DEC-009).

## 9. 금지 Task

EC2·AWS·자동(무인) Merge에 해당하는 Task를 만들지 않는다(DEC-013, `CLAUDE.md` 규칙 17·21).

## 10. 114개 Requirement 전수 기록

`TASKS/00_TASK_LIST.md`는 다음 두 부분을 모두 포함해야 한다.

1. **Task 표**: IMPLEMENT Requirement 84개가 하나 이상의 Task `Requirement Ref`에 전부 등장.
2. **`## 6. NON_IMPLEMENTATION` 원장**: EXCLUDED Requirement 30개를 근거·후속 방향과 함께 기록(삭제 금지, DEC-014).

## 11. Task List ↔ 상세 파일 1:1, 파일 형식

- Task List: `TASKS/00_TASK_LIST.md` — 열: `Seq | Task ID | 제목 | Category | Impl. | Requirement Ref | Screen | Route | Page Entry | Depends On | Expected Files | Functional AC | Visual AC | Security/Privacy AC | Verify | Priority`.
- 상세 파일: `TASKS/TASK-<Task ID>.md` — YAML front matter 없이, 다음 14개 `##` 절을 이 순서로 포함한다.

```
# <Task ID> — <제목>

## Context
## Project Scope
## Requirement Ref
## Screen / Route / Page Entry
## Design Ref
## Depends On
## Expected Files
## Functional AC
## Visual AC
## Security/Privacy AC
## Test Cases
## Verify
## Definition of Done
## Forbidden
```

`TASKS/00_TASK_LIST.md`에 있는 모든 Task ID는 정확히 하나의 `TASKS/TASK-<ID>.md`를 가져야 하고, 상세 파일만 있고 목록에 없는 경우(orphan)도 없어야 한다.

## 12. Page Owner 공통 규칙

- **PAGE-SCR001**: "create-next-app 기본 스캐폴드가 완전히 제거되었다"를 Functional/Definition of Done에 포함(`CLAUDE.md` 규칙 10).
- **PAGE-SCR003**: "항공편·숙소·동행 구하기 3개 탭이 실제로 조립되어 각각 독립된 상태를 유지한다"를 포함(규칙 11).
- **PAGE-SCR005**: "Guest(탭 없음)·Member(프로필/내 활동)·Admin(+관리자 탭) 3개 역할 상태가 실제로 조립되어 있고 역할에 없는 탭은 렌더링되지 않는다"를 포함.
- 모든 Page Owner: `design-reference/UI_CONTRACT.md`의 해당 Screen "영역 순서"와 `D-001/DESIGN.md` §19 최소 콘텐츠 수를 Visual AC에 그대로 옮기고, Empty State/Placeholder 금지 규칙(§14·§20)을 포함한다.

## 13. 실행 순서

1. `python scripts/validate_inputs.py` 실행 — 실패 시 중단.
2. `/gen-tasklist` — `TASKS/00_TASK_LIST.md` 생성/갱신.
3. `/gen-task-details` — Task List의 각 행에 대해 `TASKS/TASK-<Task ID>.md` 생성/갱신, 완료 후 **자동으로** `python scripts/audit_tasks.py` 실행.
4. `/audit-tasks` — 생성 없이 감사만 다시 확인하고 싶을 때.

세 커맨드 모두 이 Skill을 사용하며, 실제 앱 구현 코드(`src/app`, `src/components`, `src/data`, `src/lib`, `supabase/*.sql`, `tests/*`의 실제 소스)는 만들지 않는다. Task 상세 문서를 근거로 실제 구현하는 것은 `CLAUDE.md`의 "Task 완료 순서"를 따르는 별도의 구현 세션(`/run-wave`)이 담당한다.

## 14. Task 개수에 대한 방침

약 45~65개를 예상하지만, 개수 자체를 통과·실패 기준으로 쓰지 않는다. `scripts/audit_tasks.py`는 개수를 정보로만 출력한다.

## 15. Audit 실패 처리

`scripts/audit_tasks.py`가 `AUDIT_FAIL`(종료 코드 1)을 반환하면, 그 결과를 그대로 사용자에게 보여주고 **완료로 보고하지 않는다.** 실패 항목을 임의로 통과로 재기록하거나, 검사를 건너뛰거나, 실패를 숨기고 다음 단계로 진행하지 않는다. 실패를 없애려면 원인이 된 Task List/상세 파일을 고친 뒤 다시 감사를 실행한다(감사 스크립트 자체를 검사가 통과하도록 느슨하게 고치는 방식은 그 변경이 실제로 정당한 오탐 수정일 때만 한다).
