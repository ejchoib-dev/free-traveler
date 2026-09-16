---
name: prepare-task
description: 지정한 WAVE_ID·TASK_ID가 지금 바로 구현을 시작해도 되는 상태인지 8가지를 점검하고 READY_TO_IMPLEMENT/BLOCKED_* 중 하나를 보고한다. 코드를 수정하지 않는다.
argument-hint: "<WAVE_ID> <TASK_ID>"
---

# /prepare-task

이 커맨드는 **`traveler-project-pipeline` Skill을 사용한다.** 먼저 `.claude/skills/traveler-project-pipeline/SKILL.md`와 저장소 루트 `CLAUDE.md`(Harness Marker, 필수 규칙, Task 완료 순서)를 읽는다. **이 Command는 어떤 파일도 만들거나 수정하지 않는다** — 오직 읽고 판정만 한다. `CLAUDE.md` "Task 완료 순서"의 1~2단계(Task 읽기, 입력 확인)에 해당하는 게이트 역할이다.

## User Input

```text
$ARGUMENTS
```

`$ARGUMENTS`는 공백으로 구분된 `<WAVE_ID> <TASK_ID>` 두 값이어야 한다(예: `W01 PAGE-SCR001`). 둘 중 하나라도 없으면 즉시 `BLOCKED_INPUT`으로 종료한다.

## 입력

- `WAVE_ID` — `$ARGUMENTS`의 첫 번째 값.
- `TASK_ID` — `$ARGUMENTS`의 두 번째 값.
- 선택된 상세 Task 파일 — `TASKS/TASK-<TASK_ID>.md`. 없으면 즉시 `BLOCKED_INPUT`.

## 절차 — 8개 검사를 전부 실행하고 결과를 모은다

검사는 순서대로 전부 실행한다(하나가 실패해도 나머지 검사를 건너뛰지 않는다 — 사람이 한 번에 여러 문제를 볼 수 있어야 한다). 최종 판정만 우선순위(`BLOCKED_DIRTY_TREE` > `BLOCKED_INPUT` > `BLOCKED_DEPENDENCY` > `BLOCKED_SCOPE` > `READY_TO_IMPLEMENT`)에 따라 하나로 정한다.

### 1. Working Tree 상태 → `BLOCKED_DIRTY_TREE`

`git status --porcelain`을 실행한다. 추적되지 않는 파일이나 커밋되지 않은 변경이 있으면 실패로 기록한다(단, 이 Task 자신의 이전 시도로 남은 변경인지, 완전히 무관한 다른 작업 중 변경인지 구분해 설명한다 — 어느 쪽이든 새 Task를 시작하기 전에 사람이 커밋/스태시로 정리해야 한다).

### 2. Task가 현재 Wave에 포함되는지 → `BLOCKED_INPUT`

`TASKS/WAVE_PLAN.md`(Wave ID → Task ID 목록 매핑 문서)를 읽는다. **이 파일이 아직 저장소에 없으면**, Wave 소속을 확인할 근거가 없으므로 이 검사를 실패로 기록하고 "`TASKS/WAVE_PLAN.md`가 없어 `WAVE_ID` 소속을 확인할 수 없습니다"라고 명시한다(임의로 통과 처리하지 않는다). 파일이 있으면 `WAVE_ID` 행에서 `TASK_ID`가 실제로 그 Wave에 속하는지 확인한다.

### 3. Depends On 완료 여부 → `BLOCKED_DEPENDENCY`

`TASKS/TASK-<TASK_ID>.md`의 `## Depends On` 절에 있는 각 Task ID에 대해:
- `TASKS/WAVE_STATE.json`(`scripts/build_waves.py`가 생성하고 `/run-wave`가 갱신하는 상태 파일, 스키마: `waves[]` 배열)이 있으면, `waves[]`를 전부 훑어 그 의존 Task ID가 어느 Wave의 `task_status`에 들어 있는지 찾는다.
  - `task_status[의존 Task ID]`가 `"done"`이면 완료로 판단한다.
  - `task_status`에 그 ID가 있지만 `"ready"`이거나 `"blocked:..."`이면 미완료로 기록한다.
  - 그 ID가 어느 Wave의 `task_status`에도 없으면(=해당 Wave를 아직 한 번도 시작하지 않아 `task_status` 필드 자체가 없는 경우), 이 Task 하나에 한해 실제 구현 산출물(Expected Files)이 파일 트리에 존재하는지로 완료 여부를 대신 판단하고, 이 대체 판단을 사용했다는 사실을 보고에 명시한다.
- `TASKS/WAVE_STATE.json` 파일 자체가 없으면(Wave 실행이 전혀 시작되지 않았다면), 모든 의존 Task에 대해 실제 구현 산출물(Expected Files) 존재 여부로 대신 판단하고, 이 대체 판단을 사용했다는 사실을 보고에 명시한다.
- 하나라도 미완료면 실패로 기록하고 어떤 Task가 막고 있는지 나열한다.

### 4. Expected Files → `BLOCKED_INPUT`(형식 문제) 또는 `BLOCKED_DIRTY_TREE`(충돌)

`TASKS/TASK-<TASK_ID>.md`의 `## Expected Files` 절을 확인한다.
- 절이 비어 있거나 경로를 특정할 수 없으면 `BLOCKED_INPUT`으로 기록한다.
- 실제 파일 트리를 다시 확인해(Glob), Expected Files 중 이미 존재하는 파일에 이 Task와 무관해 보이는 미완료/충돌 내용이 있으면 `BLOCKED_DIRTY_TREE` 쪽 실패로 기록한다.

### 5. SRS·Scope·Design·Screen Ref → `BLOCKED_INPUT`

`TASKS/TASK-<TASK_ID>.md`의 `## Requirement Ref`, `## Screen / Route / Page Entry`, `## Design Ref` 절을 읽고 다음을 확인한다.
- `Requirement Ref`의 각 ID가 `docs/06_SRS_UIUX_REVISED.md`에 실제로 존재하는가.
- `Screen / Route / Page Entry`가 `design-reference/SCREEN_ROUTE_CONTRACT.json`과 일치하는가(Screen이 있는 경우).
- `Design Ref`가 가리키는 문서(`design-reference/D-001/DESIGN.md`, `design-reference/UI_CONTRACT.md`)가 실제로 존재하는가.
- 하나라도 어긋나면 실패로 기록한다.

### 6. 필요한 환경변수 이름 확인 → `BLOCKED_INPUT`

Task 상세와 `docs/ARCHITECTURE.md` §9·§17을 근거로 이 Task가 필요로 하는 환경변수 이름을 나열한다(예: Supabase/Auth 관련 Task면 `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`; 외부 URL 관련 Task면 `FLIGHT_OUTBOUND_URL`, `HOTEL_OUTBOUND_URL`, `MOFA_SAFETY_URL`). 이 Task에 필요한 환경변수가 하나도 없으면 "해당 없음"으로 통과 처리한다. 필요한 환경변수가 있는데 `.env.local`/`.env.example`이 저장소에 없거나 해당 키가 선언되어 있지 않으면 실패로 기록하고 이름을 그대로 나열한다(실제 값을 추측하거나 만들어내지 않는다 — 이름 존재 여부만 확인한다).

### 7. Secret 하드코딩 위험 → `BLOCKED_INPUT`

이 Task가 API 키·URL·토큰 등 민감한 값을 다루는지(§6에서 나열한 환경변수와 연결되는지) 확인한다. 다루는 경우:
- `CLAUDE.md` 규칙 15(Service Role Key를 Client에서 사용 금지)에 해당하는 Task인지 확인하고, Task 상세의 Forbidden/Security-Privacy AC에 이 제약이 명시되어 있는지 확인한다.
- §6의 환경변수 인프라(`.env.local` 등)가 아직 없어서 값을 코드에 직접 적어 넣을 위험이 있는 상태면 실패로 기록한다("환경변수 인프라 없이 진행하면 하드코딩 위험이 있습니다").
- Task 상세에 이미 서버 전용 처리(Service Role Key는 서버 코드에서만)가 명시되어 있고 §6 검사도 통과했다면 통과로 기록한다.

### 8. EXCLUDED 범위 침범 여부 → `BLOCKED_SCOPE`

`docs/PROJECT_SCOPE.md`와 `TASKS/00_TASK_LIST.md`의 `## 6. NON_IMPLEMENTATION` 원장을 읽는다. Task 상세의 `Requirement Ref`에 EXCLUDED로 분류된 Requirement ID가 하나라도 포함되어 있으면, 또는 `Functional AC`/`Expected Files`가 EXCLUDED 기능(콘텐츠 CMS, 감사 로그, 계정 제재, 통합 검색, AUDIT_LOG 등 `docs/ARCHITECTURE.md` §18 제외 항목 포함)을 구현하는 것으로 읽히면 실패로 기록한다.

## 출력

각 검사를 아래 형식으로 먼저 나열한다.

```
[PASS|FAIL] 1. Working Tree 상태
[PASS|FAIL] 2. Wave 소속 확인
[PASS|FAIL] 3. Depends On 완료 여부
[PASS|FAIL] 4. Expected Files
[PASS|FAIL] 5. SRS·Scope·Design·Screen Ref
[PASS|FAIL] 6. 필요한 환경변수 이름
[PASS|FAIL] 7. Secret 하드코딩 위험
[PASS|FAIL] 8. EXCLUDED 범위 침범 여부
```

그 다음 정확히 한 줄로 최종 판정을 출력한다(우선순위: `BLOCKED_DIRTY_TREE` > `BLOCKED_INPUT` > `BLOCKED_DEPENDENCY` > `BLOCKED_SCOPE` > `READY_TO_IMPLEMENT`).

```
PREPARE_TASK_RESULT: READY_TO_IMPLEMENT
```

또는

```
PREPARE_TASK_RESULT: BLOCKED_DEPENDENCY
```

`BLOCKED_*`인 경우, 무엇을 먼저 해결해야 `READY_TO_IMPLEMENT`가 되는지 한두 문장으로 덧붙인다. 여러 검사가 동시에 실패해도 판정 코드는 위 우선순위에 따라 하나만 낸다 — 다만 실패한 검사 전부를 목록에서는 숨기지 않는다.

## 하지 않는 것

- 이 Command는 코드를 수정하지 않는다. `git add`, `git commit`, 파일 생성/수정, `TASKS/WAVE_PLAN.md` 자동 생성 등 어떤 쓰기 작업도 하지 않는다.
- 판정이 `BLOCKED_*`라고 해서 임의로 원인을 없애거나 우회하지 않는다(예: dirty tree를 발견했다고 `git stash`를 마음대로 실행하지 않는다 — 사람에게 보고하고 판단을 맡긴다).
