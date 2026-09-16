# UI/UX Approved Decision Record — Free Traveler

| 항목 | 내용 |
|---|---|
| Document ID | UIUX-APPROVED-TRAVEL-001 |
| 기반 SRS | `docs/02_SRS_BASELINE.md` (SRS-TRAVEL-001 v1.0) — Requirement 삭제 없음 |
| 기반 범위 문서 | `docs/PROJECT_SCOPE.md` |
| 기반 요구사항-화면 매핑 | `docs/03_UI_COVERAGE_ANALYSIS.md` |
| 기반 디자인 계약 | `design-reference/UI_CONTRACT.md`, `design-reference/SCREEN_ROUTE_CONTRACT.json`, `design-reference/D-001/DESIGN.md` |
| 승인된 Stitch 화면 | SCR-001~005 (`docs/STITCH_VALIDATION_REPORT.md` 검증 결과 기준) |
| Status | APPROVED (설계 승인) — **구현 상태는 §7 참고, 미구현** |
| 승인일 | 2026-09-15 |

---

## 1. 목적

이 문서는 `02_SRS_BASELINE.md`의 Requirement(REQ-FUNC-001~080, REQ-NF-001~034, 총 114개)를 하나도 삭제하지 않은 채, 승인된 5개 디자인 Screen(SCR-001~005)과 `PROJECT_SCOPE.md`의 구현 범위(IMPLEMENT/EXCLUDED)를 연결한 **승인 기록**이다. 이 문서 자체는 아무것도 구현하지 않으며, 구현 여부는 §7에 명시된 현재 상태를 따른다.

---

## 2. 승인된 5개 Screen

| Screen ID | Route | Page Entry | 구분(핵심/보조) | Mobile Variant |
|---|---|---|---|---|
| SCR-001 | `/` | `src/app/page.tsx` | 보조(허브) | 필요 |
| SCR-002 | `/about` | `src/app/about/page.tsx` | 핵심 | 불필요 |
| SCR-003 | `/travel-tools` | `src/app/travel-tools/page.tsx` | 핵심 | 필요 |
| SCR-004 | `/mates` | `src/app/mates/page.tsx` | 핵심 | 불필요 |
| SCR-005 | `/account` | `src/app/account/page.tsx` | 핵심 | 불필요 |

출처: `design-reference/SCREEN_ROUTE_CONTRACT.json`.

---

## 3. 기존 Route → 승인된 Screen 통합 매핑

`02_SRS_BASELINE.md` §3.5는 16개 공개 Route를 정의했다. 이번 승인으로 아래와 같이 5개 Screen의 탭·패널·모달로 통합한다. **어느 Requirement도 삭제되지 않으며, 화면상의 위치만 변경된다.**

| 기존 Route(SRS §3.5) | 기존 Page | 통합된 위치 |
|---|---|---|
| `/` | 홈 | SCR-001 (그대로) |
| `/destinations`, `/destinations/domestic`, `/destinations/overseas` | 전체/국내/해외 여행지 | SCR-001 Section 2·3 (Card Grid, 탭 대신 국내/해외 섹션 분리) |
| `/destinations/[slug]` | 여행지 상세 | SCR-001 여행지 상세 Drawer/Modal |
| `/flights` | 비행기 찾기 | SCR-003 [항공편] 탭 |
| `/hotels` | 호텔 찾기 | SCR-003 [숙소] 탭 |
| `/mates` | 동행 모집글 목록 | SCR-004 (그대로) |
| `/mates/[id]` | 동행 모집글 상세 | SCR-004 상세 패널(Desktop 우측 60% / Mobile Drawer) |
| `/mates/new` | 동행 모집글 작성 | SCR-003 [동행 구하기] 탭 |
| `/safety` | 국가별 주의사항 목록 | SCR-001 Section 5(국가별 주의사항 Card Grid) |
| `/safety/[countryCode]` | 국가별 주의사항 상세 | SCR-001 국가 안전정보 Drawer/Modal(여행지 Drawer와 같은 스택) |
| `/about` | 대표 소개 | SCR-002 (그대로) |
| `/auth/*` | 가입·로그인·성인 확인 | SCR-005 Guest 화면(탭 없음) |
| `/my/*` | 내 글·참가 요청·차단 | SCR-005 [내 활동] 탭 |
| `/admin/*` | 콘텐츠·신고·설정 | SCR-005 [관리자] 탭(신고 상태 변경, 외부 URL 설정만 — 콘텐츠 CRUD는 REQ-FUNC-072 EXCLUDED) |

기술 Route(디자인 Screen에 미포함): API Route(`/api/*`), 인증 콜백(`/auth/callback`), `not-found`, `error` — `design-reference/SCREEN_ROUTE_CONTRACT.json`의 `technical_routes` 참조.

---

## 4. 규칙 확인

- **`/travel-tools`(SCR-003)는 항공·숙소·동행 작성 3개 탭을 포함한다** — REQ-FUNC-011~026(항공·숙소), REQ-FUNC-031~032·080(동행 작성·안전수칙 동의)이 이 화면에 모인다.
- **`/account`(SCR-005)는 인증·프로필·내 활동·간단 관리자를 포함한다** — REQ-FUNC-027~029·066(인증·프로필), REQ-FUNC-036·038·040(내 활동에서의 처리), REQ-FUNC-041·077(간단 관리자: 신고 상태 변경, 외부 URL 설정)이 이 화면에 모인다. 콘텐츠 CRUD·감사 로그 열람·제재 조치(REQ-FUNC-042·072·076)는 PROJECT_SCOPE에서 EXCLUDED이므로 관리자 탭에 포함하지 않는다.

---

## 5. UI Route Contract

승인된 라우트 계약은 `design-reference/SCREEN_ROUTE_CONTRACT.json`(schema `traveler-screen-route-v1`)에 있으며 요약은 다음과 같다.

- `screens`: SCR-001~005 정확히 5개, Route·Page Entry 중복 없음(검증됨).
- 모든 Screen: `page_owner_task_required=true`, `preview_required=true`.
- SCR-001: `starter_template_forbidden=true`(create-next-app 기본 스캐폴드로 대체 불가).
- `technical_routes`: auth callback(`/auth/callback`), API Route(`/api/*`), `not-found`, `error` — Screen 수(5)에 포함하지 않음.
- `required_navigation`: 14건의 실제 화면 간 이동(외부 사이트 이동 1건 포함) — `design-reference/UI_CONTRACT.md`와 `SCREEN_ROUTE_CONTRACT.json`에 동일하게 기록됨.
- `screen_count_summary`: 핵심(core) 4 — SCR-002·003·004·005, 보조(auxiliary) 1 — SCR-001.

세부 화면별 영역 순서·컴포넌트·상태·이동·금지 기능은 `design-reference/UI_CONTRACT.md`를 정본으로 한다.

---

## 6. Release Acceptance Criteria

MVP Release로 표시하려면 아래 조건을 **모두** 충족해야 한다. 어느 하나라도 미충족 시 이 문서의 승인은 "설계 승인"에 한정되며 "구현 완료"를 의미하지 않는다.

| # | 기준 | 근거 |
|---|---|---|
| AC-REL-01 | REQ-FUNC-001~080, REQ-NF-001~034 중 PROJECT_SCOPE IMPLEMENT로 분류된 84개(FUNC 64 + NF 20) 전부가 `docs/UIUX_TRACEABILITY.md`에서 Status=DONE, 지정된 Test 통과 | `PROJECT_SCOPE.md` §4, `docs/UIUX_TRACEABILITY.md` |
| AC-REL-02 | EXCLUDED로 분류된 30개(FUNC 16 + NF 14)는 구현하지 않으며, 화면 어디에도 해당 기능의 UI가 노출되지 않음 | `PROJECT_SCOPE.md` §6 |
| AC-REL-03 | SCR-001~005 Route·Page Entry가 `SCREEN_ROUTE_CONTRACT.json`과 정확히 일치, 중복 없음 | `design-reference/SCREEN_ROUTE_CONTRACT.json` |
| AC-REL-04 | SCR-005의 Guest·Admin 화면이 `UI_CONTRACT.md` 계약대로 실제 구현됨(현재 승인된 Stitch 산출물에는 없음 — `STITCH_VALIDATION_REPORT.md` NEEDS_REVISION) | `docs/STITCH_VALIDATION_REPORT.md` |
| AC-REL-05 | `design-reference/D-001/DESIGN.md`의 Do Not(Airbnb 상표, 구매·예약·결제 UI, Proprietary 폰트, 임의 색상)이 실제 코드에 없음 | `design-reference/D-001/DESIGN.md` §21 |
| AC-REL-06 | Empty/Error/Loading 상태가 `D-001/DESIGN.md` §14·§20 규칙(설명+이용방법+CTA, Lorem ipsum/준비 중 금지)을 충족 | `design-reference/D-001/DESIGN.md` |
| AC-REL-07 | `02_SRS_BASELINE.md` §6.8 Rollout Acceptance(Content Alpha~MVP Release) 단계 기준 충족 | `docs/02_SRS_BASELINE.md` §6.8.3 |

---

## 7. 현재 구현 상태 (사실 고지)

`src/app`에는 `layout.tsx`, `page.tsx`(create-next-app 기본 스캐폴드)만 존재한다. **SCR-001~005 중 실제로 구현된 화면은 없다.** 이 문서는 설계·범위 승인 기록이며, §6의 Release Acceptance Criteria가 충족되기 전까지 어떤 Requirement도 "구현 완료"로 기록하지 않는다. 실제 구현 진행 상황은 `docs/UIUX_TRACEABILITY.md`의 Task/Status 열에서 추적한다.
