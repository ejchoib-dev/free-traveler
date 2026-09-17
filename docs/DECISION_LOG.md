# Decision Log — Free Traveler (Traveler App)

| 항목 | 내용 |
|---|---|
| Document ID | DECLOG-TRAVEL-001 |
| 목적 | 이 프로젝트의 주요 결정을 근거·대안·결과와 함께 고정 기록한다. 결정을 뒤집으려면 새 DEC 항목을 추가하고 이전 항목의 Status를 SUPERSEDED로 바꾼다(항목 자체는 삭제하지 않는다) |
| 작성일 | 2026-09-16 |
| 표기 | Status: **ACCEPTED**(유효) / SUPERSEDED(대체됨, 사유와 대체 ID 기록) |

---

## DEC-001 — 실제 개발 루트는 `traveler/app`

| 항목 | 내용 |
|---|---|
| Status | ACCEPTED |
| Context | `C:\AI_SERVICE`에는 서로 무관한 여러 하위 프로젝트(`egigae7/`, `클로드코드실습/`, `_qaboard/`, `traveler/`)가 공존한다. Traveler 관련 `package.json`, `src/app`, `docs/`, `design-reference/`, `TASKS/`, `scripts/`는 전부 `traveler/app/` 아래에 있다. |
| Decision | Traveler 프로젝트의 모든 문서·스크립트·Task는 `C:\AI_SERVICE\traveler\app`을 저장소 루트로 가정한다. |
| Consequence | `scripts/validate_inputs.py`, `scripts/audit_tasks.py`는 스크립트 파일 위치 기준(`Path(__file__).resolve().parent.parent`)으로 루트를 계산하므로 `traveler/app` 밖에서 실행하면 안 된다. 다른 하위 프로젝트(`_qaboard` 등)의 파일·규약과 혼동하지 않는다. |

---

## DEC-002 — 디자인 Screen은 핵심 4개·보조 1개

| 항목 | 내용 |
|---|---|
| Status | ACCEPTED |
| Context | `docs/PROJECT_SCOPE.md` §3.1은 `/`(홈)를 "4개 핵심 화면과 항공·호텔 이동으로 연결되는 진입 허브"로 정의했다. |
| Decision | SCR-002(`/about`)·SCR-003(`/travel-tools`)·SCR-004(`/mates`)·SCR-005(`/account`) 4개를 핵심(core)으로, SCR-001(`/`) 1개를 보조(auxiliary)로 분류한다. |
| Consequence | `design-reference/SCREEN_ROUTE_CONTRACT.json`의 `role` 필드와 `screen_count_summary`(core:4, auxiliary:1), `docs/ARCHITECTURE.md` §2에 반영됨. 새 디자인 Screen을 추가하려면 이 문서와 계약 JSON을 함께 개정해야 한다. |

---

## DEC-003 — `/travel-tools`에 항공·숙소·동행 작성을 통합

| 항목 | 내용 |
|---|---|
| Status | ACCEPTED |
| Context | SRS 초기 라우트 인벤토리(`02_SRS_BASELINE.md` §3.5)는 `/flights`, `/hotels`, `/mates/new`를 별도 라우트로 정의했으나, `03_UI_COVERAGE_ANALYSIS.md` §4는 "항공 입력, 숙소 입력, 동행글 작성은 SCR-003의 탭 3개로 배치"로 재정의했다. |
| Decision | 항공편·숙소·동행 구하기를 별도 페이지가 아니라 `/travel-tools`(SCR-003) 안의 3개 탭(Component Task 단위: `COMP-SCR003-FLIGHT`, `COMP-SCR003-HOTEL`, `COMP-SCR003-MATE-WRITE`)으로 통합한다. |
| Consequence | `src/app/flights/page.tsx`, `src/app/hotels/page.tsx`, `src/app/mates/new/page.tsx`를 만들지 않는다. 이 3개 기능의 Requirement(REQ-FUNC-011~026, 031~032)는 전부 SCR-003 Page Entry(`src/app/travel-tools/page.tsx`)로 귀속된다(`docs/UIUX_TRACEABILITY.md`, `TASKS/TASK_MANIFEST.csv`). |

---

## DEC-004 — 여행지·안전·대표는 정적 TypeScript Data

| 항목 | 내용 |
|---|---|
| Status | ACCEPTED |
| Context | `docs/PROJECT_SCOPE.md` §5: "여행지·안전·대표 콘텐츠는 `src/data`의 정적 TypeScript 데이터로 관리하며, Supabase 테이블과 Editor CMS 워크플로 대신 코드 저장소에서 직접 관리한다." |
| Decision | `DESTINATION`, `COUNTRY_SAFETY`, `REPRESENTATIVE_PROFILE` 계열 데이터는 Supabase 테이블이 아니라 `src/data/destinations.ts`, `src/data/country-safety.ts`, `src/data/representative.ts` 정적 파일로 구현한다(`DATA-DESTINATIONS`, `DATA-SAFETY`, `DATA-REPRESENTATIVE` Task). |
| Consequence | Editor/Admin 콘텐츠 CRUD·게시 워크플로(REQ-FUNC-055·072)를 만들지 않는다. 콘텐츠 변경은 코드 변경(PR)으로만 이루어진다. |

---

## DEC-005 — Supabase는 Auth와 동행 기능 중심

| 항목 | 내용 |
|---|---|
| Status | ACCEPTED |
| Context | DEC-004로 콘텐츠 데이터가 Supabase 밖으로 빠지면서, Supabase의 실제 쓰기 대상은 인증과 동행(Travel Mate) 기능만 남는다. |
| Decision | Supabase는 (1) 이메일 인증·로그인·성인확인 상태 저장, (2) 동행 모집글·참가요청·차단·신고·관리자 설정, 이 두 목적에만 사용한다. |
| Consequence | Supabase Storage(미디어 업로드)는 사용하지 않는다(REQ-FUNC-073 EXCLUDED). `docs/ARCHITECTURE.md` §7. |

---

## DEC-006 — DB는 6개 Table로 제한

| 항목 | 내용 |
|---|---|
| Status | ACCEPTED |
| Context | `02_SRS_BASELINE.md` §6.3의 13개 엔터티 중 DEC-004로 7개(COUNTRY, REGION, DESTINATION, DESTINATION_CONTENT, COUNTRY_SAFETY, MEDIA_ASSET, REPRESENTATIVE_PROFILE)가 정적 데이터로 빠지고, AUDIT_LOG는 범용 감사 로그 제외(REQ-FUNC-056·076·NF-022 EXCLUDED)로 만들지 않는다. |
| Decision | 실제 DB 테이블은 `USER_PROFILE`, `MATE_POST`, `MATE_APPLICATION`, `USER_BLOCK`, `REPORT`, `OUTBOUND_URL_SETTING` 정확히 6개로 제한한다. |
| Consequence | `DB-SCHEMA-BASE` Task가 이 6개 외 테이블을 만들면 `scripts/audit_tasks.py` 검사 12(허용 목록 밖 테이블)에서 실패 처리된다. 새 테이블이 필요해지면 이 문서에 새 DEC 항목을 먼저 추가한다. |

---

## DEC-007 — 항공·숙소 입력은 Browser Memory에만 유지

| 항목 | 내용 |
|---|---|
| Status | ACCEPTED |
| Context | SRS CON-01: "항공·호텔 입력값은 브라우저 메모리 상태로만 처리하고 서버 DB·로그·외부 URL에 저장하지 않는다." REQ-FUNC-017·025, REQ-NF-017. |
| Decision | `COMP-SCR003-FLIGHT`, `COMP-SCR003-HOTEL`은 Client Component의 `useState` 등 일시 상태만 사용하고, 전용 API Route/Server Action, `localStorage`, 쿠키, DB, 분석 로그 어디에도 값을 옮기지 않는다. |
| Consequence | `docs/ARCHITECTURE.md` §4·§5. `E2E-TRAVEL-TOOLS`가 네트워크 요청에 입력값이 없는지 자동 검증한다. |

---

## DEC-008 — Airbnb DESIGN.md는 vendor 참고본, D-001이 실제 정본

| 항목 | 내용 |
|---|---|
| Status | ACCEPTED |
| Context | `design-reference/vendor/airbnb/DESIGN.md`는 구조적 패턴(단일 포인트 컬러, 얕은 그림자 1단계, 카드 밀도 대비 여백 등)만 참고하기 위한 자료이며, Rausch 색상·Cereal 서체 등 Airbnb 고유 상표 요소는 그대로 쓸 수 없다. |
| Decision | `design-reference/D-001/DESIGN.md`를 이 프로젝트의 유일한 디자인 정본으로 삼는다. Airbnb 참고본은 구조만 인용하고, 색상·서체·배지·내비게이션 패턴 등 상표 요소는 D-001에서 독자적으로 재정의한 값(코랄 `#FF6B4A`, Inter 폰트 등)을 따른다. |
| Consequence | `design-reference/DESIGN_MANIFEST.md`에 `Active Design Version: D-001`, `Status: LOCKED`, `Vendor Reference: design-reference/vendor/airbnb/DESIGN.md`로 기록됨. 구현 중 Airbnb 원본 값을 그대로 복사하면 D-001 §21 Do Not 위반이다. |

---

## DEC-009 — Playwright는 Chromium Smoke만 필수

| 항목 | 내용 |
|---|---|
| Status | ACCEPTED |
| Context | `02_SRS_BASELINE.md` §6.8.1은 E2E 범위를 핵심 흐름(UC-01~09) Smoke로 한정했고, 다중 브라우저 매트릭스·시각 회귀·부하 테스트는 각각 REQ-NF-024·007·004 EXCLUDED다. |
| Decision | Playwright는 Chromium 단일 프로젝트로 핵심 흐름만 검증하는 Smoke Task 3개(`E2E-PUBLIC-SMOKE`, `E2E-TRAVEL-TOOLS`, `E2E-MATE-AUTH`)로 한정한다. |
| Consequence | Firefox/WebKit 추가, 시각 회귀, 부하 테스트 Task를 만들지 않는다. `scripts/audit_tasks.py` 검사 15가 이를 강제한다. |

---

## DEC-010 — 사용자의 개발 실행 단위는 Wave

| 항목 | 내용 |
|---|---|
| Status | ACCEPTED |
| Context | 이 문서에서 처음 확정. `TASKS/00_TASK_LIST.md`의 61개 Task를 한 번에 전부 착수하지 않고, 의존성 순서(§DEC-011)에 따라 여러 회차로 나눠 진행하기 위한 실행 단위가 필요하다. |
| Decision | 사용자는 Task를 "Wave" 단위로 묶어 순서대로 실행한다. 하나의 Wave는 서로 의존성이 없거나, 이전 Wave에서 이미 완료된 Task에만 의존하는 Task들의 묶음이다. |
| Consequence | Wave 분할표(어떤 Task가 몇 번째 Wave에 속하는지)는 이 결정과 별도 문서에서 다룬다. 이 로그는 "Wave가 실행 단위"라는 결정 자체만 기록한다. |

---

## DEC-011 — Single Agent가 Wave 내부 Task를 순차 수행

| 항목 | 내용 |
|---|---|
| Status | ACCEPTED |
| Context | 이 문서에서 처음 확정. DEC-010의 Wave 안에 여러 Task가 있을 때 병렬로 여러 Agent가 동시에 작업하게 할지, 한 Agent가 순서대로 처리하게 할지 결정이 필요했다. |
| Decision | 하나의 Wave 내부 Task는 Single Agent(단일 세션)가 `TASKS/00_TASK_LIST.md`의 Seq/Depends On 순서를 따라 하나씩 순차 수행한다. 여러 Agent를 병렬로 동시 투입하지 않는다. |
| Consequence | Wave 내부에서 동시 편집으로 인한 충돌(같은 파일을 여러 Agent가 동시에 수정)을 원천적으로 배제한다. Task 하나가 끝나야 다음 Task로 넘어간다. |

---

## DEC-012 — PR·Merge는 사용자가 수동 수행

| 항목 | 내용 |
|---|---|
| Status | ACCEPTED |
| Context | `docs/ARCHITECTURE.md` §15("자동 Merge 미사용")를 더 구체화한다 — "사람이 검토·승인"이 아니라 "이 프로젝트의 사용자 본인"이 수행 주체임을 명시한다. |
| Decision | Task 구현이 끝나도 Agent가 PR을 자동으로 생성·병합하지 않는다. PR 생성 여부와 시점, 리뷰, Merge는 전부 사용자가 직접 판단하고 수동으로 수행한다. |
| Consequence | 어떤 Task 상세 파일에도 "자동으로 PR을 만든다/병합한다"는 내용을 넣지 않는다(이미 `TASKS/TASK-*.md` Forbidden 절에 반영됨). Agent는 구현 완료를 보고할 뿐 병합을 진행하지 않는다. |

---

## DEC-013 — EC2·AWS는 사용하지 않음

| 항목 | 내용 |
|---|---|
| Status | ACCEPTED |
| Context | SRS CON-13: "Vercel에 배포하고 환경변수로 외부 URL과 비밀정보를 관리한다." `docs/PROJECT_SCOPE.md` §6에서 EC2·AWS 인프라를 명시적으로 제외했다. |
| Decision | 애플리케이션 호스팅은 Vercel, 데이터는 Supabase 관리형 서비스만 사용한다. AWS의 어떤 서비스(EC2, S3, RDS, Lambda 등)도 도입하지 않는다. |
| Consequence | `docs/ARCHITECTURE.md` §14. `scripts/audit_tasks.py` 검사 16(AWS·EC2·자동 Merge 구현 Task 0)이 이를 강제한다. |

---

## DEC-014 — 제외 기능은 EXCLUDED로 관리

| 항목 | 내용 |
|---|---|
| Status | ACCEPTED |
| Context | `docs/PROJECT_SCOPE.md` §2가 IMPLEMENT/EXCLUDED 두 상태를 정의했고, REQ-FUNC-001~080·REQ-NF-001~034 중 30개(FUNC 16 + NF 14)가 EXCLUDED로 확정되었다. |
| Decision | 범위에서 제외된 Requirement는 삭제하지 않고 "EXCLUDED" 상태로 계속 추적한다. EXCLUDED Requirement에는 상세 구현 Task 파일을 만들지 않되, `TASKS/00_TASK_LIST.md` §6 NON_IMPLEMENTATION 표와 `docs/UIUX_TRACEABILITY.md`에 근거·후속 방향과 함께 남긴다. |
| Consequence | `scripts/audit_tasks.py` 검사 17(114개 전부 Task 또는 EXCLUDED 표에 존재)·18(EXCLUDED 상세 구현 파일 미생성)이 이를 강제한다. 향후 범위가 넓어지면 EXCLUDED 항목을 IMPLEMENT로 승격하고 이 로그에 새 DEC 항목을 추가한다(기존 §6 표의 해당 행은 이력으로 남긴다). |

---

## DEC-015 — 정책 문서 4종은 `/legal/*` 정적 경로로 추가(5개 Screen 수에는 미포함)

| 항목 | 내용 |
|---|---|
| Status | ACCEPTED |
| Context | `design-reference/D-001/DESIGN.md` §7과 REQ-FUNC-064·080은 Footer에 이용약관·개인정보처리방침·동행 안전수칙·콘텐츠 면책 안내 링크 4개를 요구한다. 그러나 확정된 5개 Screen(SCR-001~005)·`design-reference/SCREEN_ROUTE_CONTRACT.json`에는 이 정책 본문을 담을 Page가 없고, REQ-FUNC-080을 참조하는 다른 Task(`PAGE-SCR003`, `COMP-SCR003-MATE-WRITE`, `COMP-SCR004-SAFETY-GUIDE`)도 동의 체크박스·안전 배너만 만들 뿐 정책 본문 페이지 자체는 만들지 않는다. `SHARED-LAYOUT`(Footer) 구현 중 발견했다. |
| Decision | `/legal/terms`, `/legal/privacy`, `/legal/companion-guidelines`, `/legal/content-disclaimer` 4개 정적 콘텐츠 경로를 추가한다. 이 경로들은 `design-reference/SCREEN_ROUTE_CONTRACT.json`의 `screens`(5개, 핵심 4·보조 1)가 아니라 기존 `technical_routes`(원래 `/auth/callback`, `/api/*`, not-found, error-boundary가 있던 목록)에 `type: "policy_page"`로 추가한다 — **Screen 개수·역할 구성(핵심 4·보조 1)은 바뀌지 않는다**(DEC-002 유지). Task는 `COMP-LEGAL-DOCS`(Category=COMPONENT, Screen 칸은 "해당없음")로 `TASKS/00_TASK_LIST.md`에 추가하고 `PAGE_OWNER`로 분류하지 않는다(5개 Screen의 Page Owner 유일성 검사에 걸리지 않도록). |
| Consequence | `scripts/check_screen_contract.py`의 `TECH_ROUTE_PREFIXES`에 `/legal/`을 추가해 이 경로들을 "계약에 없는 예상치 못한 Page"로 오탐하지 않게 한다. `FIXED_SCREENS`(5개)는 그대로 유지한다. 향후 정책 문서가 실제 법무 검토를 거치면 이 로그에 새 DEC 항목을 추가하고 본문을 갱신한다. |

---

## 요약 표

| ID | 결정 | 상태 |
|---|---|---|
| DEC-001 | 실제 개발 루트는 `traveler/app` | ACCEPTED |
| DEC-002 | 디자인 Screen은 핵심 4개·보조 1개 | ACCEPTED |
| DEC-003 | `/travel-tools`에 항공·숙소·동행 작성 통합 | ACCEPTED |
| DEC-004 | 여행지·안전·대표는 정적 TypeScript Data | ACCEPTED |
| DEC-005 | Supabase는 Auth와 동행 기능 중심 | ACCEPTED |
| DEC-006 | DB는 6개 Table로 제한 | ACCEPTED |
| DEC-007 | 항공·숙소 입력은 Browser Memory에만 유지 | ACCEPTED |
| DEC-008 | Airbnb DESIGN.md는 vendor 참고본, D-001이 정본 | ACCEPTED |
| DEC-009 | Playwright는 Chromium Smoke만 필수 | ACCEPTED |
| DEC-010 | 사용자의 개발 실행 단위는 Wave | ACCEPTED |
| DEC-011 | Single Agent가 Wave 내부 Task를 순차 수행 | ACCEPTED |
| DEC-012 | PR·Merge는 사용자가 수동 수행 | ACCEPTED |
| DEC-013 | EC2·AWS는 사용하지 않음 | ACCEPTED |
| DEC-014 | 제외 기능은 EXCLUDED로 관리 | ACCEPTED |
| DEC-015 | 정책 문서 4종은 `/legal/*` 정적 경로로 추가(5개 Screen 수 불변) | ACCEPTED |
