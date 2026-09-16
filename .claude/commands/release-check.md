---
name: release-check
description: Task·Wave·CI·Playwright·Supabase·Vercel Preview·EXCLUDED 목록 7가지를 확인해 RELEASE_READY/RELEASE_BLOCKED를 판정한다. 코드를 수정하지 않는다.
argument-hint: (인자 없음)
---

# /release-check

이 커맨드는 **`traveler-project-pipeline` Skill과 저장소 루트 `CLAUDE.md`를 함께 사용한다.** MVP Release 여부를 최종 판정하는 게이트이며, `docs/05_UIUX_APPROVED.md` §6 Release Acceptance Criteria(AC-REL-01~07)와 `docs/02_SRS_BASELINE.md` §6.8.3 Rollout Acceptance를 근거로 삼는다. **이 Command는 어떤 파일도 만들거나 수정하지 않는다** — 읽고 실행하고(테스트 재실행 포함) 판정만 한다.

## 절차 — 7개 검사를 전부 실행하고 결과를 모은다

각 검사는 실제 파일/명령 결과를 근거로만 판정한다. 확인할 수 없는 항목은 "정보 없음(확인 필요)"로 남기고 **임의로 통과 처리하지 않는다.** 하나라도 실패 또는 확인 불가면 최종 판정은 `RELEASE_BLOCKED`다.

### 1. Task·Wave 상태

- `python scripts/audit_tasks.py`를 실행해 `AUDIT_PASS`인지 확인한다(1:1 대응, 순환 의존성, Requirement 커버리지 등 구조적 무결성).
- `TASKS/WAVE_PLAN.md`·`TASKS/WAVE_STATE.json`(스키마: `waves[]` 배열, `scripts/build_waves.py` 생성)을 읽어 `waves[]`의 모든 Wave에 대해 `status == "completed"`인지 확인한다. 어느 Wave든 `status`가 `"blocked"`이거나 `"pending"`/`"in_progress"`로 남아 있으면, 또는 `checkpoint_required`가 `true`인데 `checkpoint_result`가 여전히 `null`이면(=사람의 Preview 확인 대기 중) 실패로 기록한다. 두 파일이 아직 없으면 "Wave 실행이 시작되지 않음(`scripts/build_waves.py` 미실행)"으로 실패 기록한다.

### 2. 5개 Page Owner DONE

`TASKS/WAVE_STATE.json`의 `waves[]`를 전부 훑어 `PAGE-SCR001`, `PAGE-SCR002`, `PAGE-SCR003`, `PAGE-SCR004`, `PAGE-SCR005` 다섯 Task ID를 각각의 `task_status`에서 찾는다. 상태 파일이 없거나, 다섯 중 하나라도 어느 Wave의 `task_status`에도 없거나 값이 `"done"`이 아니면 실패로 기록하고 어떤 Screen이 남았는지 나열한다.

### 3. CI PASS

- 이 저장소에 GitHub 원격 저장소가 연결되어 있는지 `git remote -v`로 확인한다. 없으면 "GitHub 원격 저장소가 없어 CI 상태를 확인할 수 없음"으로 실패 기록한다(로컬 실행 결과로 대체하지 않는다 — `CI-PIPELINE-BASE`가 실제로 통과했다는 근거는 GitHub Actions 실행 기록이어야 한다).
- 원격 저장소가 있으면 `gh run list --branch <현재 브랜치> --limit 5` 또는 `gh pr checks`로 최신 CI 실행 결과를 확인한다. 성공이 아니면 실패로 기록한다.
- 참고용으로 `npm run lint`와 `tsc --noEmit`을 로컬에서도 실행해 결과를 함께 보고할 수 있으나, 이것만으로 "CI PASS"를 대체하지 않는다.

### 4. Playwright Smoke PASS

`TASKS/WAVE_STATE.json`의 `waves[]`를 전부 훑어 `E2E-PUBLIC-SMOKE`, `E2E-TRAVEL-TOOLS`, `E2E-MATE-AUTH` 세 Task가 각각 어느 Wave의 `task_status`에서 `"done"`인지 확인한다. 최신성을 다시 확인하고 싶으면 `npx playwright test --project=chromium`을 재실행해 실제로 통과하는지 확인한다(Chromium 프로젝트 외 다른 브라우저를 추가로 실행하지 않는다 — `docs/DECISION_LOG.md` DEC-009).

### 5. Supabase 6개 Table·기본 RLS 확인 기록

- `supabase/migrations/*.sql`을 읽어 `USER_PROFILE`, `MATE_POST`, `MATE_APPLICATION`, `USER_BLOCK`, `REPORT`, `OUTBOUND_URL_SETTING` 정확히 6개 테이블의 `CREATE TABLE`이 있는지, 그 외 테이블이 없는지 확인한다.
- 같은 마이그레이션 파일 또는 별도 파일에 6개 테이블 전부에 대해 `ENABLE ROW LEVEL SECURITY`와 정책(`CREATE POLICY`)이 있는지 확인한다.
- `TASKS/WAVE_STATE.json`의 `waves[]`를 전부 훑어 `DB-SCHEMA-BASE`, `DB-RLS-BASE`, `DB-ACCESS`, `DB-SEED-BASE`, `TEST-RLS-BASIC`이 각각 어느 Wave의 `task_status`에서 `"done"`인지 확인한다.
- 실제 Supabase 클라우드 프로젝트에 마이그레이션이 적용됐는지는 이 세션에서 직접 확인할 수 없다 — 로컬 마이그레이션 파일과 Task 상태만으로 판단하고, 그 한계를 보고에 명시한다.

### 6. Vercel Preview Checkpoint

- `TASKS/WAVE_PLAN.md`에서 `Preview Checkpoint`가 "예"로 표시된 모든 Wave에 대해, `TASKS/WAVE_STATE.json`의 해당 Wave 객체에서 `checkpoint_required == true`이고 `checkpoint_result`가 `null`이 아닌 값(예: `"approved"`)으로 채워져 있는지 확인한다(= 사람이 실제로 Preview를 확인하고 결과를 기록했는지). `checkpoint_result`가 여전히 `null`이면 실패로 기록한다.
- GitHub 원격 저장소와 PR이 있으면 `gh pr view --json statusCheckRollup`으로 Vercel 배포 체크(Preview Deployment)가 성공했는지 함께 확인한다. 원격/PR이 없으면 "Vercel Preview 배포 상태를 확인할 근거가 없음"으로 실패 기록한다(추측하지 않는다).

### 7. EXCLUDED 목록

- `TASKS/00_TASK_LIST.md`의 `## 6. NON_IMPLEMENTATION` 원장과 `docs/PROJECT_SCOPE.md`의 분류가 여전히 일치하는지 확인한다(이미 1번 검사의 `audit_tasks.py` 실행에 포함되어 있으면 그 결과를 재사용한다).
- EXCLUDED Requirement 30개 중 어느 것도 이번 Release에서 새로 구현되지 않았는지 확인한다(= `audit_tasks.py` 검사 16의 재확인).
- 원장에 근거·후속 방향이 비어 있는 행이 없는지 확인한다.

## 출력

```
[PASS|FAIL|정보 없음] 1. Task·Wave 상태
[PASS|FAIL|정보 없음] 2. 5개 Page Owner DONE
[PASS|FAIL|정보 없음] 3. CI PASS
[PASS|FAIL|정보 없음] 4. Playwright Smoke PASS
[PASS|FAIL|정보 없음] 5. Supabase 6개 Table·기본 RLS 확인 기록
[PASS|FAIL|정보 없음] 6. Vercel Preview Checkpoint
[PASS|FAIL|정보 없음] 7. EXCLUDED 목록
```

`PASS`가 아닌 항목(FAIL 또는 정보 없음)이 하나라도 있으면 최종 판정은 `RELEASE_BLOCKED`다. 7개 전부 `PASS`일 때만 `RELEASE_READY`다.

```
RELEASE_CHECK_RESULT: RELEASE_READY
```

또는

```
RELEASE_CHECK_RESULT: RELEASE_BLOCKED
```

`RELEASE_BLOCKED`면 실패/정보 없음 항목 각각에 대해 무엇을 해야 다음 검사에서 통과하는지 한 줄씩 덧붙인다.

## 하지 않는 것

- 실패나 정보 부족을 이유로 임의로 통과 처리하지 않는다("아마 될 것"이라고 추정해 `PASS`로 적지 않는다).
- 실패를 해결하기 위해 코드를 고치거나, Task 상태를 직접 `DONE`으로 바꾸거나, 커밋·푸시·PR·배포를 실행하지 않는다. 이 커맨드는 확인만 한다.
