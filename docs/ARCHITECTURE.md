# Architecture — Free Traveler (Traveler App)

| 항목 | 내용 |
|---|---|
| Document ID | ARCH-TRAVEL-001 |
| 근거 문서 | `package.json`, `docs/06_SRS_UIUX_REVISED.md`, `docs/PROJECT_SCOPE.md`, `design-reference/D-001/DESIGN.md`, `design-reference/UI_CONTRACT.md`, `design-reference/SCREEN_ROUTE_CONTRACT.json`, `TASKS/TASK_MANIFEST.csv` |
| 목적 | 이 프로젝트가 "무엇으로, 어디까지" 구현되는지의 경계를 고정한다. 범위 확장은 이 문서를 먼저 갱신한 뒤에만 한다 |
| 현재 구현 상태 | 미구현 — `src/app`에 create-next-app 기본 스캐폴드만 존재(§17 참고) |

---

## 1. 기술 스택 — Next.js App Router + TypeScript

| 계층 | 기술 | 근거 |
|---|---|---|
| 프레임워크 | Next.js 16.3.4, App Router(Pages Router 아님) | `package.json`, SRS CON-10 |
| 언어 | TypeScript(strict) | `package.json` devDependencies, SRS CON-11 |
| UI | React 19.2.8, Tailwind CSS 4 | `package.json` |
| 배포 | Vercel(§13) | SRS CON-13 |

라우팅은 전부 App Router의 파일 기반 라우트(`src/app/**/page.tsx`)로 구성하며, Pages Router(`pages/`)나 별도 라우터 라이브러리를 도입하지 않는다.

---

## 2. 화면 구성 — 핵심 4개 · 보조 1개

`design-reference/SCREEN_ROUTE_CONTRACT.json`(schema `traveler-screen-route-v1`)이 정본이다.

| 구분 | Screen | Route |
|---|---|---|
| 보조(허브) | SCR-001 | `/` |
| 핵심 1 | SCR-002 | `/about` |
| 핵심 2 | SCR-003 | `/travel-tools` |
| 핵심 3 | SCR-004 | `/mates` |
| 핵심 4 | SCR-005 | `/account` |

SCR-001은 나머지 4개 핵심 화면과 항공·호텔 외부 이동으로 연결되는 진입 허브다(`docs/PROJECT_SCOPE.md` §3.1). 이 5개 외의 신규 디자인 Screen을 추가하지 않는다 — 필요하면 `SCREEN_ROUTE_CONTRACT.json` 개정이 선행되어야 한다.

---

## 3. Server Component와 Client Component 구분

| 유형 | 사용 위치 | 원칙 |
|---|---|---|
| **Server Component**(기본값) | 5개 Page Owner(`src/app/*/page.tsx`), 정적 데이터를 그대로 렌더링하는 부분(여행지 카드 목록, 안전정보 카드, 대표 소개 등) | 데이터 페칭(정적 `src/data` import, Supabase 서버 클라이언트 조회)은 Server Component에서 수행. `"use client"` 선언 없음 |
| **Client Component**(`"use client"` 명시) | 인터랙션이 필요한 부분만: 검색·필터 입력, 항공·숙소 Form(§4), 탭 컨트롤러, Drawer/Modal 열고 닫기, 참가 요청·신고·차단 폼, 관리자 폼, 인증 폼, Toast | 브라우저 상태(useState/useEffect), 이벤트 핸들러가 필요한 최소 단위로만 쪼갠다 |

Server Component 트리 안에 필요한 지점만 Client Component를 leaf로 배치하는 방식을 따르며, Page Owner 전체를 통째로 Client Component로 만들지 않는다.

---

## 4. 항공·숙소 입력 폼 — Client Component 일시 상태만

`COMP-SCR003-FLIGHT`, `COMP-SCR003-HOTEL`(SCR-003)은 `"use client"` Component이며 입력값을 오직 React 컴포넌트의 일시 상태(`useState`)로만 보관한다. 전역 상태 관리 라이브러리(Redux/Zustand 등), `localStorage`, 쿠키, 서버 상태 어디에도 이 입력값을 옮기지 않는다. 탭을 벗어나지 않는 한 브라우저 세션 동안만 값이 유지된다.

---

## 5. 항공·숙소 입력값 미전송 원칙

항공·숙소 조건(국가·지역·출발일/체크인·귀국일/체크아웃)은 다음 중 **어디로도 전송·저장하지 않는다.**

- 자체 API Route(`src/app/api/**`) — 이 기능을 위한 API Route 자체를 만들지 않는다
- Supabase DB(§8의 6개 테이블 중 어디에도 저장하지 않는다)
- 외부 이동 URL의 query string(`FLIGHT_OUTBOUND_URL`/`HOTEL_OUTBOUND_URL`은 항상 고정된 일반 URL을 새 탭으로 열 뿐, 목적지·날짜를 붙이지 않는다)
- 서버/분석 로그(REQ-FUNC-071 분석 이벤트에도 국가·지역·날짜는 금지 속성)

검증은 `E2E-TRAVEL-TOOLS`(Playwright 네트워크 탭 검사)와 `docs/UIUX_TRACEABILITY.md`의 REQ-FUNC-017/025, REQ-NF-017로 추적한다.

---

## 6. 정적 데이터(`src/data`) — 여행지·안전정보·대표 프로필

| 데이터 | 파일 | 근거 |
|---|---|---|
| 여행지 | `src/data/destinations.ts` | `PROJECT_SCOPE.md` §5 |
| 국가 안전정보 | `src/data/country-safety.ts` | 상동 |
| 대표 프로필 | `src/data/representative.ts` | 상동 |

세 데이터는 Supabase 테이블이 아니라 **TypeScript 정적 데이터**로 코드 저장소에서 직접 관리한다(Editor/Admin CMS 워크플로 없음 — REQ-FUNC-055·072 EXCLUDED). 이미지는 URL + `alt` 텍스트만 사용하고, 출처·작가·라이선스 메타데이터 관리 워크플로는 만들지 않는다(REQ-FUNC-007·061·073 EXCLUDED).

---

## 7. Supabase — Auth와 동행 기능 중심

Supabase는 다음 두 가지 목적에만 사용한다.

1. **Auth**: 이메일 가입·인증·로그인·로그아웃·비밀번호 재설정(REQ-FUNC-066), 성인 확인 상태 저장
2. **동행(Travel Mate) 기능**: 모집글 작성·조회·마감, 참가 요청·승인/거절, 차단, 신고, 관리자의 신고 상태·외부 URL 설정

여행지·안전정보·대표 소개(§6)는 Supabase를 거치지 않는다. Supabase Storage(미디어 업로드)는 사용하지 않는다(REQ-FUNC-073 EXCLUDED).

---

## 8. DB — 정확히 6개 테이블

| # | 테이블 | 용도 |
|---|---|---|
| 1 | `USER_PROFILE` | 닉네임·연령대·여행스타일·성인확인 상태 |
| 2 | `MATE_POST` | 동행 모집글 |
| 3 | `MATE_APPLICATION` | 참가 요청 |
| 4 | `USER_BLOCK` | 차단 관계 |
| 5 | `REPORT` | 신고 |
| 6 | `OUTBOUND_URL_SETTING` | 관리자가 설정하는 항공·호텔 외부 URL |

이 6개를 넘는 테이블(예: `AUDIT_LOG` 등 감사 로그 테이블)을 만들지 않는다(REQ-FUNC-056·076·NF-022 EXCLUDED — `TASKS/TASK_MANIFEST.csv`의 `DB-SCHEMA-BASE` 행과 `TASKS/TASK_AUDIT_REPORT.md` 검사 12·17·18이 이 경계를 강제한다).

---

## 9. Supabase Client — Browser·Server 구분

| 클라이언트 | 파일(예정) | 사용 위치 | 권한 |
|---|---|---|---|
| Browser Client | `src/lib/supabase/client.ts` | Client Component(로그인 폼, 실시간 상태 없음) | `anon` key |
| Server Client | `src/lib/supabase/server.ts` | Server Component, Server Action(`src/lib/db/*.ts`) | 쿠키 기반 세션(`anon` key) 또는 관리자 작업 시 `service_role` key(서버 전용, 클라이언트 번들 미포함) |
| Middleware | `middleware.ts` | 세션 갱신·역할(Guest/Member/Admin) 판별 | `anon` key |

`service_role` 키는 서버 전용 코드(Server Action, Route Handler)에서만 사용하고 클라이언트에 노출하지 않는다(SRS REQ-NF-016).

---

## 10. RLS 원칙(간단)

| 원칙 | 내용 |
|---|---|
| 기본 거부 | 모든 테이블은 RLS를 활성화하고, 정책이 명시적으로 허용하지 않으면 접근 불가 |
| 본인 데이터 | `USER_PROFILE`, `MATE_APPLICATION`, `REPORT`, `USER_BLOCK`은 본인(auth.uid())이 작성·요청한 행만 조회/수정 |
| 대상 작성자 | `MATE_APPLICATION`은 해당 모집글(`MATE_POST`) 작성자도 조회 가능(승인/거절을 위해) |
| 공개 읽기 | `MATE_POST`는 OPEN 상태인 글은 비로그인 사용자도 목록/상세 조회 가능(비공개 필드 제외) |
| Admin | `REPORT` 상태 변경, `OUTBOUND_URL_SETTING` 수정은 Admin 역할만 |
| 복잡한 정책 지양 | Row 단위를 넘는 복잡한 다단계 정책(예: 조직 계층, 다중 테넌시)은 만들지 않는다 — 이 프로젝트 규모에 필요하지 않다 |

세부 정책은 `TASK-DB-RLS-BASE.md`에서 구현 단위로 다룬다.

---

## 11. ORM 미사용

Prisma, Drizzle, TypeORM 등 어떤 ORM도 도입하지 않는다. DB 접근은 `@supabase/supabase-js`(또는 `@supabase/ssr`)의 쿼리 빌더와 `supabase/migrations/*.sql`(순수 SQL)로만 수행한다. 스키마 마이그레이션 도구(Prisma Migrate 등)도 사용하지 않고 Supabase CLI 마이그레이션만 사용한다.

---

## 12. 테스트 — Vitest + Playwright(Chromium Smoke)

| 종류 | 도구 | 범위 |
|---|---|---|
| Unit | Vitest | 날짜 검증(`UNIT-TRAVEL-DATES`), 연락처 탐지(`UNIT-CONTACT-DETECTION`), 동행 상태 전이(`UNIT-MATE-STATE`) |
| RLS 통합 | Vitest 또는 Playwright API 테스트 | `TEST-RLS-BASIC` |
| E2E | **Playwright, Chromium 프로젝트 1개만** | `E2E-PUBLIC-SMOKE`, `E2E-TRAVEL-TOOLS`, `E2E-MATE-AUTH` (핵심 흐름 Smoke) |

Jest는 사용하지 않는다(Vitest로 통일). Playwright에 Firefox/WebKit 등 다중 브라우저 매트릭스, 시각 회귀(visual regression), 부하 테스트 프로젝트를 추가하지 않는다(`TASKS/TASK_AUDIT_REPORT.md` 검사 15가 이를 강제).

---

## 13. CI/CD — GitHub Actions + Vercel Preview

| 단계 | 도구 | 내용 |
|---|---|---|
| CI | GitHub Actions(`.github/workflows/ci.yml`) | `tsc --noEmit`, `next lint`, Vitest, Playwright(Chromium) — PR마다 실행(`CI-PIPELINE-BASE`) |
| Preview 배포 | Vercel | PR/브랜치마다 자동 Preview 배포 |
| Production 배포 | Vercel | `main` 병합 후 배포 |
| 병합 | **사람이 검토·승인** | §15 참고 |

---

## 14. 인프라 제외 — AWS·EC2 미사용

이 프로젝트는 Vercel(애플리케이션 호스팅)과 Supabase(DB·Auth) 관리형 서비스만 사용한다. AWS의 어떤 서비스(EC2, S3, RDS, Lambda 등)도 인프라로 도입하지 않는다(SRS CON-13, `PROJECT_SCOPE.md` §6). 월 인프라 비용 목표는 콘텐츠 인건비를 제외하고 10만원 이하다(REQ-NF-034).

---

## 15. Merge 정책 — 자동 Merge 미사용

CI가 통과해도 **자동(무인) 병합을 수행하지 않는다.** 모든 병합은 사람이 PR을 검토하고 직접 승인·병합한다(SRS REQ-NF-031, `TASKS/TASK_AUDIT_REPORT.md` 검사 16). GitHub의 auto-merge 기능이나 봇 기반 자동 병합 워크플로를 설정하지 않는다.

---

## 16. Page Entry 매핑

| Screen | Page Entry |
|---|---|
| SCR-001 | `src/app/page.tsx` |
| SCR-002 | `src/app/about/page.tsx` |
| SCR-003 | `src/app/travel-tools/page.tsx` |
| SCR-004 | `src/app/mates/page.tsx` |
| SCR-005 | `src/app/account/page.tsx` |

각 Page Entry는 정확히 하나의 Page Owner Task(`TASKS/TASK_MANIFEST.csv`의 `PAGE-SCR00X` 행)가 소유하며, 하나의 Page Entry를 두 개 이상의 Task가 소유하지 않는다.

---

## 17. 착수 차단(Blocking) — 실제로 확인된 누락 항목만

아래는 현재 저장소를 직접 확인해 실제로 없는 것만 기록했다. 추측이나 일반론은 포함하지 않는다.

| 항목 | 현재 상태(확인됨) | 어떤 Task 착수 전에 필요한가 |
|---|---|---|
| `@supabase/supabase-js`, `@supabase/ssr` 패키지 | `package.json`에 없음, `node_modules`에 미설치 | `SHARED-AUTH-SETUP`, `DB-ACCESS`, `COMP-SCR005-AUTH` 등 Supabase를 쓰는 모든 Task |
| `vitest` 패키지 | `package.json`에 없음 | `UNIT-TRAVEL-DATES`, `UNIT-CONTACT-DETECTION`, `UNIT-MATE-STATE`, `TEST-RLS-BASIC` |
| `@playwright/test` 패키지 | `package.json`에 없음 | `E2E-PUBLIC-SMOKE`, `E2E-TRAVEL-TOOLS`, `E2E-MATE-AUTH` |
| `.env.local` / `.env.example` | 저장소에 없음(확인됨) | `SHARED-AUTH-SETUP`, `DB-ACCESS`, `COMP-SCR003-FLIGHT`/`HOTEL`(외부 URL), `DEPLOY-ENV-CHECK`. 필요한 키: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `FLIGHT_OUTBOUND_URL`, `HOTEL_OUTBOUND_URL`, `MOFA_SAFETY_URL` |
| `supabase/` 디렉터리(마이그레이션·seed) | 저장소에 없음(확인됨) | `DB-SCHEMA-BASE`, `DB-RLS-BASE`, `DB-SEED-BASE` |
| `.github/workflows/` | 저장소에 없음(확인됨) | `CI-PIPELINE-BASE` |
| `tests/` 디렉터리 | 저장소에 없음(확인됨) | 모든 UNIT/RLS/E2E Task |
| Supabase 프로젝트 자체(실제 클라우드 리소스) | 이 세션에서 존재 여부를 확인할 수 없음(로컬 저장소 범위 밖) | `DB-SCHEMA-BASE` 이전에 사람이 Supabase 프로젝트를 생성하고 URL/키를 발급해야 함 |

---

## 18. 명시적 범위 제외

다음은 이 프로젝트의 아키텍처에 포함하지 않는다(`docs/PROJECT_SCOPE.md` §6 근거).

| 제외 항목 | 사유 |
|---|---|
| **콘텐츠 CMS**(Editor/Admin 콘텐츠 CRUD·게시 워크플로) | 여행지·안전·대표 콘텐츠는 §6의 정적 데이터로 직접 관리(REQ-FUNC-055·072 EXCLUDED) |
| **외부 Email 공급자 연동**(트랜잭셔널 이메일 발송) | 알림은 인앱 Toast/화면 상태로 대체, 이메일 발송 자체를 구현하지 않음(REQ-FUNC-043 부분, ASM-05 관련 EXCLUDED 처리) |
| **Monitoring/구조화 로그·장애 알림 인프라** | 별도 로깅·모니터링 파이프라인을 구축하지 않고 콘솔 로그 수준으로 대체(REQ-NF-032·033 EXCLUDED) |

이 세 가지가 필요해지면 이 문서(§18)와 `docs/PROJECT_SCOPE.md`를 먼저 개정한 뒤 `TASKS/00_TASK_LIST.md`에 새 Task를 추가한다 — 이 문서 개정 없이 구현부터 시작하지 않는다.
