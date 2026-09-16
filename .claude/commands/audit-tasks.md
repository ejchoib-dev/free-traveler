---
name: audit-tasks
description: traveler-project-pipeline Skill을 사용해 이미 생성된 TASKS/00_TASK_LIST.md와 TASKS/TASK-*.md를 scripts/audit_tasks.py로 검증하고 결과를 그대로 보고한다. Task를 새로 만들지 않는다.
argument-hint: (인자 없음)
---

# /audit-tasks

이 커맨드는 **`traveler-project-pipeline` Skill을 사용한다.** 먼저 `.claude/skills/traveler-project-pipeline/SKILL.md`를 읽고 그 규칙(특히 §15 Audit 실패 처리)을 그대로 따른다. **아무것도 생성하지 않는다** — Task List나 상세 파일을 새로 만들거나 고치지 않는다. **이 커맨드는 앱 구현 코드를 만들지 않는다.**

## 절차

1. **실제 파일을 읽는다**: `TASKS/00_TASK_LIST.md`가 없으면 "아직 Task List가 없습니다. `/gen-tasklist`를 먼저 실행하세요"라고 안내하고 중단한다. 있으면 `TASKS/00_TASK_LIST.md`, `TASKS/TASK-*.md`, `docs/PROJECT_SCOPE.md`, `design-reference/SCREEN_ROUTE_CONTRACT.json`이 실제로 존재하는지 확인한다.

2. `python scripts/audit_tasks.py`를 실행한다. 이 스크립트는 실행할 때마다 `TASKS/TASK_MANIFEST.csv`와 `TASKS/TASK_AUDIT_REPORT.md`를 다시 만든다.

3. 표준출력을 그대로 사용자에게 보여준다 — 18개 검사 각각의 PASS/FAIL과 최종 `AUDIT_PASS`/`AUDIT_FAIL`, 통과한 검사 수를 임의로 요약하거나 낙관적으로 바꿔 말하지 않는다.

4. **감사 실패를 무시하지 않는다.** 종료 코드가 0이 아니면:
   - 실패한 각 검사가 SKILL.md의 어느 규칙(§ 번호) 또는 `docs/DECISION_LOG.md`의 어느 DEC 항목에 대응하는지 짚어서 설명한다.
   - "일부만 실패했으니 완료로 본다"거나 "사소한 실패이니 넘어간다"는 식으로 판단하지 않는다. 실패가 하나라도 있으면 전체 결과를 실패로 보고한다.
   - 이 커맨드는 실패를 발견해도 자동으로 Task 파일을 고치지 않는다 — 수정은 `/gen-task-details`(특정 Task ID 지정)로 다시 실행하도록 안내한다.

5. 실패가 없으면 "AUDIT_PASS"라고 그대로 보고하되, Task 개수 자체는 통과 조건이 아니므로(SKILL.md §14) 개수는 참고 정보로만 언급한다.
