---
name: run-wave
description: 하나의 Wave 안에서 prepare-task→implement-task를 Task 하나씩 순차 실행한다. status/resume/dry-run 하위 명령을 지원한다. Branch·PR·Merge는 자동으로 만들지 않는다.
argument-hint: "<WXX> | status | resume | dry-run <WXX>"
---

# /run-wave

이 커맨드는 **`traveler-project-pipeline` Skill과 저장소 루트 `CLAUDE.md`(규칙 6·7·22)를 함께 사용한다.** `/run-wave`는 `/prepare-task`와 `/implement-task`를 Wave 단위로 반복 호출하는 오케스트레이터이며, 그 자체로 별도 구현 로직을 갖지 않는다 — 두 커맨드의 규칙을 그대로 따른다.

## User Input

```text
$ARGUMENTS
```

`$ARGUMENTS`는 다음 네 형태 중 하나다.

| 입력 | 동작 |
|---|---|
| `W03`(Wave ID) | 해당 Wave를 처음부터(또는 WAVE_STATE에 이미 진행된 부분이 있으면 그 다음부터) 실행 |
| `status` | 아무것도 실행하지 않고 현재 WAVE_STATE를 읽어 보고만 함 |
| `resume` | WAVE_STATE에 기록된 진행 중/대기 중 Wave를 이어서 실행 |
| `dry-run W03` | 다음에 어떤 Task가 선택되고 `/prepare-task` 결과가 무엇인지만 보여주고 **구현은 하지 않음** |

## 상태 파일 정의

### `TASKS/WAVE_PLAN.md` (`scripts/build_waves.py`가 생성, 이 커맨드는 읽기만 함)

```markdown
# Wave Plan — Free Traveler

| Wave | Group | Task IDs (Task ID 순으로 한 개씩 실행) | Preview Checkpoint |
|---|---|---|---|
| W01 | 2. Airbnb 스타일 공통 UI, 정적 데이터, Layout | DATA-DESTINATIONS, SHARED-DESIGN-TOKENS, ... | 아니오 |
| W10 | 4. SCR-001 메인 Component와 Page Owner | PAGE-SCR001 | 예 |
```

`Preview Checkpoint`가 "예"인 Wave는 모든 Task가 끝나도 다음 Wave로 자동 이어지지 않고 사람이 Preview를 확인할 때까지 멈춘다(`CLAUDE.md` 규칙 22).

**이 파일이 없으면 `/run-wave W03`·`resume`·`dry-run`은 실행할 수 없다.** "`TASKS/WAVE_PLAN.md`가 없습니다 — 먼저 `python scripts/build_waves.py`를 실행하세요"라고 보고하고 중단한다(임의로 Wave를 추정해 만들지 않는다). `/run-wave status`만은 `WAVE_STATE.json`이 있으면 계속 보고할 수 있다.

Task IDs 열은 쉼표로 구분되며, 그 순서가 곧 **Task ID 사전순**이다(`build_waves.py`가 이미 그렇게 정렬해 생성한다). 이 순서대로 한 개씩 실행한다.

### `TASKS/WAVE_STATE.json` (`scripts/build_waves.py`가 최초 생성, 이후 이 커맨드가 갱신하는 유일한 상태 파일)

`build_waves.py`가 정의한 최소 필드는 다음과 같다(스키마 자체는 바꾸지 않는다):

```json
{
  "schema_version": "traveler-wave-plan-v1",
  "generated_at": "2026-09-16T21:35:00+09:00",
  "waves": [
    {
      "wave_id": "W01",
      "title": "2. Airbnb 스타일 공통 UI, 정적 데이터, Layout",
      "task_ids": ["DATA-DESTINATIONS", "SHARED-DESIGN-TOKENS", "SHARED-FAVORITES", "SHARED-TOAST"],
      "status": "pending",
      "checkpoint_required": false,
      "checkpoint_result": null
    }
  ]
}
```

이 커맨드는 실행 중 각 Wave 객체에 **Task 단위 진행 상태를 담는 `task_status` 필드를 추가로 써서** 진행 상황을 추적한다(이 필드는 `build_waves.py`가 만들지 않고 `/run-wave`가 처음 그 Wave를 시작할 때 추가한다 — 최소 필드를 대체하지 않고 확장만 한다):

```json
{
  "wave_id": "W01",
  "title": "2. Airbnb 스타일 공통 UI, 정적 데이터, Layout",
  "task_ids": ["DATA-DESTINATIONS", "SHARED-DESIGN-TOKENS", "SHARED-FAVORITES", "SHARED-TOAST"],
  "status": "in_progress",
  "checkpoint_required": false,
  "checkpoint_result": null,
  "task_status": {
    "DATA-DESTINATIONS": "done",
    "SHARED-DESIGN-TOKENS": "ready",
    "SHARED-FAVORITES": "ready",
    "SHARED-TOAST": "ready"
  }
}
```

**필드 의미**

- `waves[].status` — `pending`(아직 시작 안 함) | `in_progress`(진행 중) | `blocked`(Task 하나가 막혀 정지) | `completed`(이 Wave의 모든 Task가 `done`). 전부 소문자다.
- `waves[].task_status[TASK_ID]` — `ready`(대기) | `done`(검증 PASS까지 완료) | `blocked:<코드>`(예: `blocked:BLOCKED_DEPENDENCY`, `blocked:VERIFICATION_FAILED`).
- `waves[].checkpoint_required` — `build_waves.py`가 Wave Plan으로부터 그대로 옮겨 적은 값. 이 커맨드는 이 값을 바꾸지 않는다.
- `waves[].checkpoint_result` — 사람이 Preview를 확인하기 전에는 `null`이다. `status`가 `completed`이고 `checkpoint_required`가 `true`인데 `checkpoint_result`가 여전히 `null`이면 "사람의 Preview 확인 대기 중"을 뜻한다. **이 커맨드는 `checkpoint_result`에 값을 쓰지 않는다** — 사람이 Preview를 확인한 뒤 직접(또는 사람의 명시적 지시에 따라) `"approved"` 또는 `"rejected: <사유>"`를 적어 넣는다.
- 파일이 없으면 이 커맨드는 아무것도 만들지 않는다(§"하지 않는 것" 참고) — `python scripts/build_waves.py`를 먼저 실행해야 한다.

## `/run-wave <WXX>` 절차

1. `TASKS/WAVE_PLAN.md`에서 `<WXX>` 행을 찾는다. 없으면 `BLOCKED_INPUT`으로 중단.
2. `TASKS/WAVE_STATE.json`을 읽는다. 파일 자체가 없으면 "`TASKS/WAVE_STATE.json`이 없습니다 — 먼저 `python scripts/build_waves.py`를 실행하세요"라고 보고하고 중단한다(이 커맨드는 상태 파일을 새로 만들지 않는다).
3. `waves[]`에서 `wave_id == <WXX>`인 객체를 찾는다. 없으면 `BLOCKED_INPUT`(`build_waves.py`를 다시 실행해 Wave 구성이 바뀌었는지 확인하라고 안내).
4. 그 Wave 객체에 `task_status`가 없으면(=이 Wave를 처음 시작하는 것) `task_ids`의 모든 항목을 `ready`로 채운 `task_status`를 추가하고 `status`를 `in_progress`로 바꾼다.
5. **다음 반복을 이 Wave의 모든 Task가 `done`이 될 때까지 계속한다:**
   1. `task_ids` 순서(=Task ID 사전순, `CLAUDE.md` 규칙 7 — 한 번에 하나씩)를 따라, `task_status`에서 아직 `done`이 아닌 **첫 번째** Task를 선택한다.
   2. 그 Task에 대해 `/prepare-task <WXX> <TASK_ID>` 규칙을 그대로 적용한다.
      - 결과가 `READY_TO_IMPLEMENT`가 아니면: `task_status[TASK_ID]`를 `blocked:<코드>`로 기록하고, Wave `status`를 `blocked`로 저장한 뒤 **여기서 전체 실행을 멈춘다.** 다른 Task로 건너뛰지 않는다.
   3. `READY_TO_IMPLEMENT`면 `/implement-task <WXX> <TASK_ID>` 규칙을 그대로 적용해 이 Task **하나만** 구현한다.
   4. 관련 검증(Unit Test/Playwright, Task 상세의 `## Verify`)이 **PASS**하면 `task_status[TASK_ID]`를 `done`으로 갱신한다. **실패하면 `done`으로 표시하지 않고** `blocked:VERIFICATION_FAILED`로 기록한 뒤 Wave `status`를 `blocked`로 저장하고 실행을 멈춘다.
6. 이 Wave의 모든 Task가 `done`이 되면 `status`를 `completed`로 저장한다.
   - `checkpoint_required`가 `false`면 여기서 종료. 다음 Wave는 사람이 직접 `/run-wave <다음 WXX>`로 호출해야 한다.
   - `checkpoint_required`가 `true`면 `checkpoint_result`는 그대로 `null`로 남겨 두고, "이 Wave는 완료됐지만 Preview Checkpoint 대상입니다 — 사람이 Preview를 확인한 뒤 `checkpoint_result`에 결과를 기록하고 다음 Wave를 시작하세요"라고 보고한다.
7. `generated_at`은 `build_waves.py`가 쓴 원래 값을 보존한다(이 커맨드는 갱신하지 않는다). 파일을 저장할 때마다 이 커맨드가 갱신한 시각을 알고 싶다면 개별 Wave 객체 안에 `last_updated`를 추가로 남길 수 있다.

## `/run-wave status`

`TASKS/WAVE_STATE.json`(없으면 "진행 중인 Wave가 없습니다 — `python scripts/build_waves.py`를 실행해 먼저 생성하세요"라고만 보고하고 종료)을 읽어 `waves[]`를 표로 보여준다: `wave_id`, `title`, `status`, Task별 `task_status`(없으면 "시작 전"), `checkpoint_required`/`checkpoint_result`. **아무것도 쓰지 않는다.**

## `/run-wave resume`

`TASKS/WAVE_STATE.json`의 `waves[]`를 순서대로 훑어 `status`가 `in_progress`이거나 `blocked`인 첫 Wave를 찾는다(둘 다 없으면 `status == "pending"`인 첫 Wave). 그 `wave_id`로 `/run-wave <WXX>`와 동일하게 진행한다. 단, 재개 시점에 상황이 바뀌었을 수 있으므로 다음에 선택될 Task에 대해 `/prepare-task`를 **다시** 실행한다(직전 실행 결과를 그대로 재사용하지 않는다). 찾은 Wave의 `status`가 이미 `completed`면(=모든 Wave가 끝난 경우) 그 사실만 보고하고 종료한다.

## `/run-wave dry-run <WXX>`

절차 1~5-ii까지만 수행한다(WAVE_PLAN/STATE 읽기 → 다음 선택될 Task 결정 → `/prepare-task` 실행). **`/implement-task`는 절대 호출하지 않는다.** 결과로 "다음에 어떤 Task가 선택될 것인지"와 "그 Task가 지금 `READY_TO_IMPLEMENT`인지, 아니라면 왜 아닌지"만 보고한다. `TASKS/WAVE_STATE.json`을 포함해 어떤 파일도 쓰지 않는다.

## 하지 않는 것

- **자동 Branch 생성, 자동 PR 생성, 자동 Merge를 하지 않는다.** 이 커맨드는 물론, 이 커맨드가 호출하는 `/implement-task`도 기본적으로 Commit조차 하지 않는다(사용자가 명시적으로 요청한 경우에만 `/implement-task`가 Task 단위 Commit을 수행할 수 있다 — `docs/DECISION_LOG.md` DEC-012).
- Wave 하나가 끝났다고 다음 Wave를 자동으로 이어서 시작하지 않는다. 항상 사람이 다음 `/run-wave <WXX>`를 직접 호출한다.
- `checkpoint_required`가 `true`인 Wave의 `checkpoint_result`를 이 커맨드가 임의로 채우지 않는다(예: `"approved"`로 자동 기록 금지) — 오직 사람의 확인 결과만 기록한다.
- `TASKS/WAVE_PLAN.md`나 `TASKS/WAVE_STATE.json`이 없는데 임의로 Wave 구성을 추측해서 만들지 않는다. 두 파일 모두 `python scripts/build_waves.py`가 생성한다.
- `build_waves.py`가 정의한 최소 필드(`schema_version`, `generated_at`, `waves[].wave_id`/`title`/`task_ids`/`status`/`checkpoint_required`/`checkpoint_result`)의 이름이나 의미를 바꾸지 않는다. `task_status`처럼 필요한 필드는 추가만 한다.
