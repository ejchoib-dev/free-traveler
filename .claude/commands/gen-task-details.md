---
name: gen-task-details
description: traveler-project-pipeline Skill을 사용해 TASKS/00_TASK_LIST.md의 각 Task에 대해 TASKS/TASK-<ID>.md 상세 파일을 생성하고, 완료 후 scripts/audit_tasks.py를 반드시 실행한다.
argument-hint: "[Task ID 또는 비워두면 전체]"
---

# /gen-task-details

이 커맨드는 **`traveler-project-pipeline` Skill을 사용한다.** 먼저 `.claude/skills/traveler-project-pipeline/SKILL.md`를 읽고 그 규칙을 그대로 적용한다. **이 커맨드는 앱 구현 코드를 만들지 않는다** — 산출물은 오직 `TASKS/TASK-<ID>.md` 문서다.

`TASKS/00_TASK_LIST.md`가 먼저 존재해야 한다(없으면 `/gen-tasklist`를 먼저 실행하라고 안내하고 중단). `$ARGUMENTS`에 특정 Task ID가 주어지면 그 Task만, 비어 있으면 상세 파일이 없는 모든 Task를 대상으로 한다.

## User Input

```text
$ARGUMENTS
```

## 절차

1. **실제 파일을 읽는다**: `TASKS/00_TASK_LIST.md`를 읽어 대상 Task 행(들)을 찾는다. 존재하지 않는 Task ID가 지정되면 오류로 중단한다. `docs/06_SRS_UIUX_REVISED.md`, `docs/PROJECT_SCOPE.md`, `design-reference/D-001/DESIGN.md`, `design-reference/UI_CONTRACT.md`도 함께 읽어 근거로 삼는다.

2. 대상 Task마다, 쓰기 직전에 **실제 파일 트리를 다시 확인**한다(Glob `src/app/**`, `src/data/**`, `src/components/**`, `supabase/**`, `tests/**`). 이미 있는 파일은 "수정"으로, 없는 파일은 "신규 생성"으로 Expected Files에 적는다. 추측이나 이전 스냅샷을 그대로 베끼지 않는다.

3. SKILL.md §11에 정의된 형식으로 `TASKS/TASK-<Task ID>.md`를 쓴다(YAML front matter 없이 아래 14개 `##` 절을 이 순서로 포함):

   `Context`, `Project Scope`, `Requirement Ref`, `Screen / Route / Page Entry`, `Design Ref`, `Depends On`, `Expected Files`, `Functional AC`, `Visual AC`, `Security/Privacy AC`, `Test Cases`, `Verify`, `Definition of Done`, `Forbidden`.

   - `Forbidden` 절에는 반드시 "Expected Files 목록 밖의 파일을 수정하지 않는다"를 포함한다.
   - `Project Scope`/`Forbidden` 절에서 금지 대상(테이블명, EC2/AWS 등)을 이름으로 언급하는 것은 정상이다(감사 스크립트가 이 두 절은 금지 문맥으로 처리한다) — 다만 그 밖의 절(Functional AC 등)에 같은 이름이 실제 사용처럼 등장하지 않게 한다.

4. **Page Owner Task 전용 규칙**(SKILL.md §12) — 대상이 Page Owner Task면 반드시 포함한다.
   - `UI_CONTRACT.md`의 해당 Screen "영역 순서"를 순서 그대로.
   - `D-001/DESIGN.md` §19의 최소 콘텐츠 수(카드/타임라인/갤러리 개수 등).
   - Empty State/Placeholder 금지 규칙(D-001 §14·§20).
   - `PAGE-SCR001`: "create-next-app 기본 스캐폴드가 완전히 제거되었다".
   - `PAGE-SCR003`: "항공편·숙소·동행 구하기 3개 탭이 실제로 조립되어 있고 각 탭이 독립된 입력·상태를 유지한다".
   - `PAGE-SCR005`: "Guest·Member·Admin 3개 역할 상태가 실제로 조립되어 있고 역할에 없는 탭은 렌더링하지 않는다".

5. **DB Task 전용 규칙**: 테이블명은 SKILL.md §5의 6개(`USER_PROFILE`, `MATE_POST`, `MATE_APPLICATION`, `USER_BLOCK`, `REPORT`, `OUTBOUND_URL_SETTING`) 중에서만 언급한다. 새 테이블명을 만들지 않는다.

6. **금지 사항 재확인**: 항공·숙소 Task(SKILL.md §7), Playwright Task(§8), CI/배포/인프라 Task(§9)가 각 규칙을 정확히 반영하는지 다시 확인한다.

7. **완료 후 필수 실행**: 모든 대상 Task 상세 작성이 끝나면 **반드시** `python scripts/audit_tasks.py`를 실행한다.

8. **감사 실패를 무시하지 않는다**: 종료 코드가 0이 아니거나 출력이 `AUDIT_FAIL`이면, 그 결과를 그대로 사용자에게 보여주고 **"완료"로 보고하지 않는다.** 실패 항목이 이번에 만든/고친 Task 상세의 문제면 바로 고쳐서 다시 감사한다. 실패 원인이 이 커맨드의 범위 밖이면(예: 다른 Task의 기존 결함) 그 사실을 명확히 알리고 사용자 판단을 구한다. 실패를 숨기거나 성공으로 재기록하지 않는다.

9. **보고**: 생성/갱신한 상세 파일 목록과 `scripts/audit_tasks.py` 실행 결과(`AUDIT_PASS`/`AUDIT_FAIL`, 통과·실패 검사 수)를 있는 그대로 사용자에게 알린다.
