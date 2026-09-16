# CLAUDE.md — Free Traveler (Traveler App)

이 파일은 이 저장소(`traveler/app`)에서 작업하는 모든 Agent(Claude Code 세션)를 위한 **단일 규칙 파일**이다. 다른 Agent 규칙 파일(`AGENTS.md` 등)을 가져오지 않으며, 필요한 규칙은 전부 이 문서 안에 직접 적는다.

---

## Harness Marker

```
HARNESS_SCHEMA=traveler-screen-route-v1
DESIGN_PATH=design-reference/D-001/DESIGN.md
SCREEN_CONTRACT=design-reference/SCREEN_ROUTE_CONTRACT.json
PROJECT_SCOPE=docs/PROJECT_SCOPE.md
PLAYWRIGHT_ENABLED=true
PLAYWRIGHT_SCOPE=chromium-smoke
AUTO_MERGE=false
AWS_ENABLED=false
```

이 값들은 도구·스크립트(`scripts/validate_inputs.py`, `scripts/audit_tasks.py`)와 사람이 동일하게 참조하는 마커다. 값을 바꾸려면 `docs/DECISION_LOG.md`에 새 결정을 먼저 기록한다.

---

## 정본 문서 (Source of Truth)

| 마커 | 파일 | 정본 대상 |
|---|---|---|
| — | `docs/06_SRS_UIUX_REVISED.md` | SRS 정본 — Requirement 114개(REQ-FUNC-001~080, REQ-NF-001~034) 원문과 Screen 매핑 |
| `PROJECT_SCOPE` | `docs/PROJECT_SCOPE.md` | Scope 분류 정본 — IMPLEMENT/EXCLUDED |
| `DESIGN_PATH` | `design-reference/D-001/DESIGN.md` | 디자인 정본 — Airbnb 참고본(`design-reference/vendor/airbnb/DESIGN.md`)은 구조만 참고, 색상·서체 등 실제 값은 D-001을 따른다 |
| `SCREEN_CONTRACT` | `design-reference/SCREEN_ROUTE_CONTRACT.json` | Screen 정본 — Route·Page Entry·핵심/보조 구분 |

추가로 작업 중 자주 참조할 문서: `design-reference/UI_CONTRACT.md`(화면별 영역 순서·컴포넌트·상태), `docs/UIUX_TRACEABILITY.md`(Requirement별 Task/Route/Test 추적), `TASKS/00_TASK_LIST.md`·`TASKS/TASK-*.md`·`TASKS/TASK_MANIFEST.csv`(Task 정의), `docs/ARCHITECTURE.md`(구현 경계), `docs/DECISION_LOG.md`(결정 이력).

---

## 필수 규칙

1. **작업 전 `package.json`과 현재 Next.js 문서를 확인한다.** 이 저장소의 Next.js 버전(16.x)은 학습 데이터 시점보다 최신이라 App Router 세부 동작이 다를 수 있다. 코드를 쓰기 전에 `package.json`의 실제 버전과 `node_modules/next/dist/docs/`(있는 경우) 또는 공식 문서를 확인해 추측으로 구식 API를 쓰지 않는다.
2. SRS 정본은 `docs/06_SRS_UIUX_REVISED.md`다. Requirement 본문을 다르게 해석해야 하면 이 파일을 먼저 개정한다.
3. Scope 분류 정본은 `docs/PROJECT_SCOPE.md`다. 어떤 기능이 IMPLEMENT인지 EXCLUDED인지는 여기서만 확인한다.
4. 디자인 정본은 `design-reference/D-001/DESIGN.md`다. 색상·타이포·간격·Do/Do Not은 전부 여기 기준이다.
5. Screen 정본은 `design-reference/SCREEN_ROUTE_CONTRACT.json`이다. Route·Page Entry·Screen 개수(5개, 핵심 4·보조 1)를 다른 문서와 다르게 임의로 바꾸지 않는다.
6. `/run-wave WXX`를 표준 개발 명령으로 사용한다(`WXX`는 Wave 번호, 예: `/run-wave W01`). 임의의 순서로 Task를 골라 시작하지 않는다.
7. Wave 내부 Task는 `TASKS/00_TASK_LIST.md`의 Depends On 순서를 따라 **한 번에 하나만** 구현한다. 여러 Task를 동시에 병렬로 건드리지 않는다.
8. 현재 Task의 'Expected Files' 목록 밖 파일은 수정하지 않는다(`TASKS/TASK-<ID>.md`의 Expected Files/Forbidden 절 참고).
9. Page Owner Task는 Page Entry(`src/app/**/page.tsx`) 안에서 이미 완료된 Component를 **실제로 조립**한다. Page Owner Task 안에서 새 Component를 만들지 않는다.
10. SCR-001(`/`, `src/app/page.tsx`) 완료 시 create-next-app 기본 스캐폴드(Next.js Starter)를 완전히 제거한다.
11. SCR-003(`/travel-tools`)은 항공·숙소·동행 구하기 3개 탭을 모두 조립한다. 하나라도 빠진 채 완료로 보고하지 않는다.
12. 항공·숙소 입력값(국가·지역·날짜)은 서버 API, DB, 외부 URL 쿼리, 로그, 분석 이벤트 **어디로도 보내지 않는다.** Client Component의 일시 상태(`useState`)로만 유지한다.
13. Supabase 쓰기는 Auth·동행(모집글/참가요청/차단)·신고·외부 URL 설정 범위로 제한한다. 그 외 목적(콘텐츠 CMS, 미디어 업로드 등)으로 Supabase 테이블을 새로 만들지 않는다.
14. RLS를 우회하는 Client 코드를 작성하지 않는다(예: RLS가 걸린 테이블을 `service_role` 키로 클라이언트에서 직접 조회하는 우회로).
15. Service Role Key(`SUPABASE_SERVICE_ROLE_KEY`)를 Client Component나 클라이언트 번들에 포함되는 코드에서 사용하지 않는다. 서버 전용 코드(Server Action/Route Handler)에서만 사용한다.
16. 여행지·안전정보·대표 프로필은 `src/data/*.ts` 정적 Data를 사용한다. Supabase 테이블로 만들지 않는다.
17. Prisma 등 ORM, AWS, EC2를 추가하지 않는다. DB 접근은 Supabase 클라이언트 + SQL 마이그레이션만 사용하고, 배포·인프라는 Vercel + Supabase만 사용한다.
18. Playwright는 핵심 Smoke만 작성한다(`PLAYWRIGHT_SCOPE=chromium-smoke`) — Chromium 단일 프로젝트, 다중 브라우저·시각 회귀·부하 테스트를 추가하지 않는다.
19. EXCLUDED로 분류된 기능을 임의로 구현하지 않는다. 필요하다고 판단되면 먼저 사람에게 확인하고 `docs/PROJECT_SCOPE.md`와 `docs/DECISION_LOG.md`를 개정한 뒤에만 진행한다.
20. destructive Git 명령(`git reset --hard`, `git push --force`, `git clean -f`, 브랜치 강제 삭제 등)을 임의로 사용하지 않는다. 꼭 필요하면 사람에게 먼저 확인한다.
21. 자동 PR 생성·자동 Merge를 실행하지 않는다(`AUTO_MERGE=false`). PR 생성 여부와 병합은 사람이 직접 수행한다.
22. 한 화면(Screen)의 Task를 끝냈으면, 사람이 Preview를 확인할 때까지 기다린 뒤 다음 화면 Wave로 진행한다. 확인 없이 이어서 다음 Wave를 시작하지 않는다.
23. 작업 완료 시 다음 세 가지를 보고한다: **변경 파일 목록**, **검증 결과**(Unit/Playwright 실행 결과 또는 수동 확인 필요 여부), **남은 제한사항**(아직 안 된 것, 다음에 필요한 것).

---

## Task 완료 순서

Task 하나를 구현할 때는 항상 이 순서를 따른다.

1. **Task 읽기** — `TASKS/TASK-<ID>.md`의 Context/Project Scope/Requirement Ref/Design Ref/Depends On/Expected Files/각종 AC/Forbidden을 전부 읽는다.
2. **입력 확인** — Depends On으로 지정된 Task가 실제로 끝났는지, 관련 정본 문서(SRS/Scope/Design/Screen Contract)와 현재 파일 트리를 확인한다.
3. **구현** — Expected Files에 적힌 파일만 만들거나 수정한다. Functional/Visual/Security-Privacy AC를 전부 충족하도록 작성한다.
4. **관련 포맷·Unit Test** — 린트/포맷을 통과시키고, Task에 연결된 Unit Test(있으면)를 작성·실행한다.
5. **필요 시 Playwright** — Task의 Verify 열에 E2E Task가 연결되어 있으면 해당 Chromium Smoke를 실행한다(없으면 생략).
6. **Diff 확인** — 실제로 변경된 파일이 Expected Files와 일치하는지, 그 밖의 파일이 건드려지지 않았는지 diff로 재확인한다.
7. **완료 보고** — 규칙 23에 따라 변경 파일·검증 결과·남은 제한사항을 보고한다.

이 순서를 건너뛰거나 뒤바꿔 진행하지 않는다.
