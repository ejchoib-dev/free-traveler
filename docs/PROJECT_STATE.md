# Project State — Free Traveler (Traveler App)

| 항목 | 내용 |
|---|---|
| Document ID | PROJECT-STATE-TRAVEL-001 |
| 최종 갱신일 | 2026-09-17 (CI/검증 Script/run-wave.md 최신화 후 갱신) |
| 갱신 방법 | 이 문서는 **스냅샷**이다. `/run-wave`가 Wave를 진행하거나 `/release-check`를 실행할 때마다 사람 또는 Agent가 아래 필드를 실제 상태(`TASKS/WAVE_STATE.json`, `TASKS/00_TASK_LIST.md`, `git`, `gh`, `supabase/`)에 맞춰 다시 써야 한다. 오래된 값을 그대로 두지 않는다. |

---

## Harness Schema

`traveler-screen-route-v1` (`design-reference/SCREEN_ROUTE_CONTRACT.json`, `CLAUDE.md` Harness Marker와 일치)

## Design Version

`D-001` — Status: `LOCKED` (`design-reference/DESIGN_MANIFEST.md`)

## Scope Mode

구현 착수 기준(`docs/PROJECT_SCOPE.md` 상태) — IMPLEMENT 84개 / EXCLUDED 30개 고정(`docs/UIUX_TRACEABILITY.md`, `TASKS/00_TASK_LIST.md` §6 NON_IMPLEMENTATION)

## Current Wave

**아직 시작 전** — `scripts/build_waves.py`가 `TASKS/WAVE_PLAN.md`·`TASKS/WAVE_STATE.json`을 생성했다(27개 Wave, `TASKS/TASK_DAG.md`에 전체 의존관계 기록, 순환 의존성 0건). `WAVE_STATE.json`의 모든 Wave가 `status=pending`이며, `current_wave` 지정 없이 `/run-wave W01`부터 시작하면 된다.

## Current Task

**없음** — Wave 실행 전이라 선택된 Task가 없다.

## Completed Tasks

**0 / 61** — `TASKS/00_TASK_LIST.md`의 모든 행이 아직 `PENDING`이다(`TASKS/TASK-*.md` 상세는 61개 전부 작성 완료됐지만, 실제 구현은 착수되지 않았다).

## Blocked Tasks

**0**(진행 자체가 시작되지 않아 개별 Task가 BLOCKED로 기록된 적 없음). 다만 `docs/ARCHITECTURE.md` §17에 기록된 착수 전 공통 차단 요인 중 아래는 아직 해소되지 않았다:
- `@supabase/supabase-js`, `@supabase/ssr` 미설치 (`vitest`·`@playwright/test`·`prettier`는 설치 완료)
- `.env.local`/`.env.example` 없음
- `supabase/`, `tests/` 디렉터리 없음 (`.github/workflows/ci.yml`은 작성 완료)
- Supabase 클라우드 프로젝트 존재 여부 미확인(로컬에서 확인 불가)

## Latest CI

**없음(실행 이력 기준)** — GitHub 원격(`origin=https://github.com/ejchoib-dev/free-traveler.git`, `main` 브랜치)은 연결되어 있고 harness 문서 98개 파일이 이미 push되었다. `.github/workflows/ci.yml`도 작성되었지만, ci.yml 자체와 `package.json`/검증 Script 변경분은 아직 커밋·push 전이라 Actions 실행 이력은 없다.

## Supabase State

**없음** — `supabase/` 디렉터리와 마이그레이션 파일이 아직 생성되지 않았다(`DB-SCHEMA-BASE`/`DB-RLS-BASE`/`DB-ACCESS`/`DB-SEED-BASE` Task 모두 미착수).

## Vercel Preview URL

**없음** — 배포 이력 없음.

## Screen Checkpoints

| Screen | Route | Checkpoint |
|---|---|---|
| SCR-001 | `/` | PENDING |
| SCR-002 | `/about` | PENDING |
| SCR-003 | `/travel-tools` | PENDING |
| SCR-004 | `/mates` | PENDING |
| SCR-005 | `/account` | PENDING |
| FINAL | — | PENDING |

## Playwright State

**없음** — `tests/` 디렉터리가 없고 `E2E-PUBLIC-SMOKE`, `E2E-TRAVEL-TOOLS`, `E2E-MATE-AUTH` 모두 미착수. Chromium Smoke 전용 범위는 확정되어 있다(`docs/DECISION_LOG.md` DEC-009).

## Deferred Items

| 항목 | 근거 |
|---|---|
| EXCLUDED Requirement 30개(콘텐츠 CMS, 감사 로그, 계정 제재, 통합 검색 등) | `TASKS/00_TASK_LIST.md` §6 NON_IMPLEMENTATION, `docs/DECISION_LOG.md` DEC-014 |
| SCR-001 데스크톱 후보안(`_scr_001_1` vs `_scr_001_2`) 중 최종 채택안 미지정 | `docs/STITCH_VALIDATION_REPORT.md` |
| SCR-001·SCR-002 이미지가 임시/서명된 외부 URL(`lh3.googleusercontent.com`)에 의존 — 프로덕션 전 자체 호스팅 검토 필요 | `docs/STITCH_VALIDATION_REPORT.md` |
| ~~`run-wave.md` 옛 `WAVE_STATE.json` 형식 불일치~~ — `run-wave.md`·`prepare-task.md`·`release-check.md`를 전부 `waves[]` 배열 스키마(`task_status`, `checkpoint_result`)에 맞게 갱신 완료 | `.claude/commands/run-wave.md`, `.claude/commands/prepare-task.md`, `.claude/commands/release-check.md` |
| CMS·외부 Email 공급자·Monitoring은 이번 범위에서 완전히 제외(재도입 시 `docs/ARCHITECTURE.md` §18부터 개정) | `docs/ARCHITECTURE.md` §18 |
| `.github/workflows/ci.yml`, 검증 Script 13종(`package.json`), `vitest.config.ts`, `playwright.config.ts`, `scripts/check_format.py`·`check_screen_contract.py`·`run_release_smoke.py` 작성 완료했으나 GitHub에는 아직 push 전(로컬 uncommitted) | 로컬 `git status` |

## Next Action

1. (선택) 지금까지 작성된 CI/검증 Script 변경분을 GitHub `main`에 commit·push할지 결정 — 아직 요청받지 않아 대기 중.
2. `docs/ARCHITECTURE.md` §17의 남은 착수 차단 항목 해소: `@supabase/supabase-js`/`@supabase/ssr` 설치, `.env.local`/`.env.example` 작성, Supabase 클라우드 프로젝트 생성·`supabase/` 디렉터리 구성.
3. 위가 끝나면 `TASKS/WAVE_PLAN.md`의 `W01`(DATA-DESTINATIONS/SHARED-DESIGN-TOKENS/SHARED-FAVORITES/SHARED-TOAST)부터 `/run-wave W01`로 실제 구현을 시작한다.
