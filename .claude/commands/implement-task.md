---
name: implement-task
description: prepare-task가 READY_TO_IMPLEMENT로 판정한 Task 하나를 실제로 구현한다(Expected Files 범위 안에서만). 기본적으로 Commit·Push·PR은 하지 않는다.
argument-hint: "<WAVE_ID> <TASK_ID>"
---

# /implement-task

이 커맨드는 **`traveler-project-pipeline` Skill과 저장소 루트 `CLAUDE.md`(Harness Marker, 필수 규칙 23개, Task 완료 순서)를 함께 사용한다.** 이 커맨드는 이 파이프라인에서 **실제 앱 구현 코드를 만드는 유일한 단계**다(`/gen-tasklist`, `/gen-task-details`, `/audit-tasks`, `/prepare-task`는 전부 문서만 다룬다).

## User Input

```text
$ARGUMENTS
```

`$ARGUMENTS`는 `<WAVE_ID> <TASK_ID>` 두 값이어야 한다(예: `W01 PAGE-SCR001`).

## 절차 (CLAUDE.md "Task 완료 순서"의 3~7단계에 해당)

### 0. 선행 조건 확인 (규칙 1)

`/prepare-task <WAVE_ID> <TASK_ID>`를 실행하거나, 같은 세션에서 이미 실행한 결과가 있으면 그 결과를 그대로 사용한다(다시 실행해도 무방하다 — 상태가 바뀌었을 수 있으므로 오래된 결과를 재사용하지 않는다). 최종 판정이 정확히 `READY_TO_IMPLEMENT`가 아니면 **여기서 중단한다.** `BLOCKED_*` 결과와 사유를 그대로 사용자에게 보고하고, 이 Task를 구현하지 않는다. 예외를 스스로 판단해 진행하지 않는다.

### 1. Task 읽기 · 입력 확인

`TASKS/TASK-<TASK_ID>.md`의 `Context`/`Project Scope`/`Requirement Ref`/`Screen·Route·Page Entry`/`Design Ref`/`Depends On`/`Expected Files`/`Functional AC`/`Visual AC`/`Security-Privacy AC`/`Test Cases`/`Verify`/`Definition of Done`/`Forbidden`을 전부 읽는다. `design-reference/D-001/DESIGN.md`, `design-reference/UI_CONTRACT.md` 중 `Design Ref`가 가리키는 절도 함께 읽는다.

### 2. Expected Files 안에서만 작업 (규칙 2)

`## Expected Files`에 나열된 경로만 만들거나 수정한다. 그 밖의 파일(다른 Task의 산출물, 설정 파일, 다른 Screen의 컴포넌트 등)은 건드리지 않는다 — `## Forbidden`에 명시된 제약과 동일하다. 작업 도중 Expected Files에 없는 파일을 고쳐야 할 필요가 생기면, 임의로 확장하지 말고 그 사실을 사용자에게 알리고 판단을 구한다.

### 3. Functional·Visual·Security AC 반영 (규칙 3)

- `Functional AC`의 각 항목이 실제로 동작하도록 구현한다.
- `Visual AC`는 `design-reference/D-001/DESIGN.md`(색상·타이포·간격·라운드·그림자 토큰, Empty State/Placeholder 금지 규칙)와 `design-reference/UI_CONTRACT.md`(영역 순서·최소 콘텐츠 수)를 그대로 따른다.
- `Security/Privacy AC`(서버 미저장, RLS, Service Role Key 서버 전용 등)를 빠짐없이 반영한다.

### 4. Page Owner는 실제 Page Entry를 조립 (규칙 4)

Task 유형(`TASKS/00_TASK_LIST.md`의 Category)이 `PAGE_OWNER`면, 이미 구현되어 있는 Component/Data/DB 산출물을 해당 Screen의 실제 Page Entry(`src/app/**/page.tsx`) 파일 안에 조립한다. **이 단계에서 새로운 Component를 만들지 않는다** — Component가 아직 없다면 그 Component의 Task가 먼저 `READY_TO_IMPLEMENT`/구현 완료 상태여야 한다(그렇지 않다면 애초에 `/prepare-task`의 Depends On 검사에서 걸러졌어야 한다). `PAGE-SCR001`이면 create-next-app 기본 스캐폴드를 완전히 제거했는지 다시 확인한다.

### 5. 관련 Unit Test 실행 (규칙 5)

`## Test Cases`/`## Verify`에 연결된 Unit Test(Vitest, 예: `UNIT-TRAVEL-DATES`, `UNIT-CONTACT-DETECTION`, `UNIT-MATE-STATE`)가 이 Task와 관련 있으면 실행한다. 관련 Unit Test가 아직 구현되어 있지 않다면(해당 Task 자체가 아직 `READY_TO_IMPLEMENT`가 아니었다면) 그 사실을 보고에 남기고, 임의로 새 테스트를 대신 작성해 범위를 넘기지 않는다(이 Task의 Expected Files 안에 있는 테스트만 다룬다).

### 6. 필요할 때만 Playwright 실행 (규칙 6)

**이 Task의 Category가 `PAGE_OWNER` 또는 `E2E_TEST`일 때만** 관련 Playwright Smoke(Chromium)를 실행한다.
- `PAGE_OWNER`: `TASKS/00_TASK_LIST.md`에서 이 Screen과 연결된 `E2E-*` Task(예: SCR-001/002/004 → `E2E-PUBLIC-SMOKE`, SCR-003 → `E2E-TRAVEL-TOOLS`, SCR-004/005 관련 → `E2E-MATE-AUTH`)를 실행한다.
- `E2E_TEST` 카테고리 자체를 구현하는 Task라면 그 Task가 만드는 Smoke를 직접 실행한다.
- 그 외 Category(`COMPONENT`, `SHARED`, `DATA`, `DB` 등)는 Playwright를 실행하지 않는다 — Unit Test로 충분하다.

### 7. 금지 사항 재확인 (규칙 7)

구현 중 다음을 추가하지 않았는지 다시 확인한다: AWS·EC2(모든 형태의 인프라), Prisma 등 ORM, 자동(무인) Merge/자동 PR 병합 기능. `## Forbidden` 절과 `CLAUDE.md` 규칙 17·21을 다시 확인한다.

### 8. Diff 확인

`git status`/`git diff`로 실제 변경된 파일이 Expected Files와 정확히 일치하는지 확인한다. 그 밖의 파일이 의도치 않게 바뀌었으면 되돌리거나 사용자에게 알린다.

### 9. 완료 보고 (규칙 8)

다음 세 가지를 반드시 포함해 보고한다.
- **변경 파일**: 실제로 만들거나 수정한 파일 목록(Expected Files와 대조 결과 포함).
- **검증 결과**: 실행한 Unit Test/Playwright 결과(통과/실패), 실행하지 않은 항목과 그 이유.
- **남은 제약**: 이 Task의 `Definition of Done` 중 아직 확인되지 않은 항목, 사람이 직접 확인해야 할 것(예: 브라우저 수동 확인이 필요한 Visual AC), 다음에 필요한 Task.

## Commit·Push·PR 정책

- **기본값: 아무것도 하지 않는다.** 구현이 끝나도 `git add`/`git commit`/`git push`/PR 생성을 자동으로 수행하지 않는다(`docs/DECISION_LOG.md` DEC-012, `CLAUDE.md` 규칙 21).
- **사용자가 명시적으로 요청한 경우에만**, 이 Task의 변경 파일만 포함하는 **Task 단위 Commit**까지 수행할 수 있다(한 Commit에 여러 Task를 섞지 않는다, `git add`는 이 Task의 Expected Files만 지정한다).
- 요청이 있어도 **Push와 PR 생성은 이 커맨드의 범위가 아니다** — 항상 사용자가 직접 수행한다.
