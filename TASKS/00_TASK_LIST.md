# Traveler Task List

| 항목 | 내용 |
|---|---|
| Document ID | TASKLIST-TRAVEL-001 |
| 근거 문서 | `docs/06_SRS_UIUX_REVISED.md`, `docs/PROJECT_SCOPE.md`, `docs/UIUX_TRACEABILITY.md`, `design-reference/D-001/DESIGN.md`, `design-reference/UI_CONTRACT.md`, `design-reference/SCREEN_ROUTE_CONTRACT.json`, `package.json`, `src/app/**` |
| 선행 검사 | `python scripts/validate_inputs.py` → **PASS** (오류 0건, 경고 0건 — 아래 §0 참고) |
| 생성일 | 2026-09-15 |
| 구현 코드/브랜치/커밋/이슈 | 생성하지 않음 — 이 문서는 계획 산출물만이다 |

---

## 0. 선행 검사 결과

```
[OK] SCREEN_ROUTE_CONTRACT.json: 5개 Screen, core=4, auxiliary=1, technical_routes=4개
[OK] UIUX_TRACEABILITY.md: 총 114개, IMPLEMENT=84, EXCLUDED=30
[OK] 03_UI_COVERAGE_ANALYSIS.md 집계와 일치 (IMPLEMENT=84, EXCLUDED=30)
[INFO] 현재 src/app 파일 트리 (4개): favicon.ico, globals.css, layout.tsx, page.tsx
경고 0건 / 오류 0건 → 결과: PASS
```

검사를 통과했으므로 아래 Task List를 작성한다.

---

## 1. 요약

| 구분 | 개수 |
|---|---:|
| **Task 총 개수** | 62(DEC-015로 `COMP-LEGAL-DOCS` 추가) |
| Category: PAGE_OWNER | 5 |
| Category: COMPONENT | 32 |
| Category: SHARED | 6 |
| Category: DATA | 3 |
| Category: DB | 4 |
| Category: UNIT_TEST | 3 |
| Category: RLS_TEST | 1 |
| Category: E2E_TEST | 3 |
| Category: CI/DEPLOY | 2 |
| Category: MANUAL/RELEASE | 3 |
| **Requirement 커버리지** | IMPLEMENT 84/84 Task에 연결됨, EXCLUDED 30/30 §6 NON_IMPLEMENTATION 표에 기록됨 |
| **빠진 Requirement** | 없음 (§7 자체 검증 참고) |

Task 개수(61)는 예상 범위(45~65) 안에 있으나, 개수 자체는 완료 조건이 아니다.

---

## 2. Task 표 — 열 정의

`Seq | Task ID | 제목 | Category | Implementation Status | Requirement Ref | Screen | Route | Page Entry | Depends On | Expected Files | Functional AC | Visual AC | Security/Privacy AC | Verify | Priority`

아래 표는 화면·범주별로 나누어 싣되 열 구성은 모두 동일하다. 표에 실린 Task는 전부 `Implementation Status = IMPLEMENT`다(EXCLUDED Requirement는 Task를 만들지 않고 §6에 별도 기록).

---

### 2.1 SCR-001 `/` (보조 허브)

| Seq | Task ID | 제목 | Category | Impl. | Requirement Ref | Screen | Route | Page Entry | Depends On | Expected Files | Functional AC | Visual AC | Security/Privacy AC | Verify | Priority |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | PAGE-SCR001 | 메인 페이지 조립 | PAGE_OWNER | IMPLEMENT | REQ-FUNC-001, REQ-FUNC-064, REQ-FUNC-065, REQ-FUNC-070, REQ-FUNC-079 | SCR-001 | `/` | `src/app/page.tsx` | COMP-SCR001-HERO-SEARCH, COMP-SCR001-DOMESTIC-GRID, COMP-SCR001-OVERSEAS-GRID, COMP-SCR001-DEST-DRAWER, COMP-SCR001-SAFETY-DRAWER, COMP-SCR001-THEME-CHIPS, COMP-SCR001-COUNTRY-NOTICE, COMP-SCR001-MATE-PREVIEW, COMP-SCR001-ABOUT-BANNER, DATA-DESTINATIONS, DATA-SAFETY, DATA-REPRESENTATIVE, DB-ACCESS, SHARED-LAYOUT | 신규 생성: `src/app/page.tsx`(현재 create-next-app 기본 내용 교체) | Section 순서 Hero→국내 6→해외 6→여행 동기 6→국가별 주의사항 6→최근 동행글 3(또는 완성형 Empty)→free_traveler 소개 CTA가 정확히 이 순서로 조립된다 | Section 순서: Hero→국내여행지→해외여행지→여행동기→국가별주의사항→최근동행글→소개CTA(고정). Section별 데이터 출처: 국내/해외=DATA-DESTINATIONS, 국가별주의사항=DATA-SAFETY, 소개CTA=DATA-REPRESENTATIVE, 최근동행글=DB-ACCESS. 최소 콘텐츠 수: 국내 카드 6·해외 카드 6·여행 동기 Chip 6·국가 카드 6·동행 카드 3(Empty 시 대체). 반응형 밀도: Desktop 3열→Tablet 2열→Mobile 1열(D-001 §15). Lorem ipsum·'준비 중'·'정보 확인 필요'·내용 없는 Card 금지, 데이터 없는 Section은 설명+이용 방법+CTA를 갖춘 완성형 Empty State로 표시(D-001 §14·§20) | 즐겨찾기 토글은 localStorage만 사용, 서버 전송 없음 | E2E-PUBLIC-SMOKE | M |
| 2 | COMP-SCR001-HERO-SEARCH | 검색 Hero | COMPONENT | IMPLEMENT | REQ-FUNC-002, REQ-FUNC-003 | SCR-001 | `/` | `src/components/scr001/HeroSearch.tsx` | DATA-DESTINATIONS | 신규 생성: `src/components/scr001/HeroSearch.tsx` | 키워드 검색(한글 부분일치) + 국가·도시·계절·테마·기간 필터가 AND 조건으로 동작 | Hero 높이 Desktop 최대 520px, 다음 Section 상단이 스크롤 없이 보임(D-001 §17) | 없음 | UNIT-TRAVEL-DATES(필터 날짜 검증 부분) | M |
| 3 | COMP-SCR001-DOMESTIC-GRID | 국내 여행지 카드 그리드 | COMPONENT | IMPLEMENT | REQ-FUNC-001, REQ-FUNC-005, REQ-NF-006, REQ-NF-026 | SCR-001 | `/` | `src/components/scr001/DomesticGrid.tsx` | DATA-DESTINATIONS | 신규 생성: `src/components/scr001/DomesticGrid.tsx` | 국내 여행지 6개 카드, 빈 결과 시 조건 완화 안내+초기화 버튼 | Next.js Image로 반응형·lazy load, 카드 12px radius(D-001 §5·§9) | 없음 | E2E-PUBLIC-SMOKE | M |
| 4 | COMP-SCR001-OVERSEAS-GRID | 해외 여행지 카드 그리드 | COMPONENT | IMPLEMENT | REQ-FUNC-001, REQ-FUNC-005, REQ-FUNC-006, REQ-NF-006, REQ-NF-026 | SCR-001 | `/` | `src/components/scr001/OverseasGrid.tsx` | DATA-DESTINATIONS, DATA-SAFETY | 신규 생성: `src/components/scr001/OverseasGrid.tsx` | 해외 여행지 6개 카드, 각 카드 "안전정보 보기" 링크가 국가 코드로 정확히 연결 | Domestic Grid와 동일 시각 규칙 | 없음 | E2E-PUBLIC-SMOKE | M |
| 5 | COMP-SCR001-DEST-DRAWER | 여행지 상세 Drawer | COMPONENT | IMPLEMENT | REQ-FUNC-004, REQ-FUNC-006 | SCR-001 | `/` | `src/components/scr001/DestinationDrawer.tsx` | DATA-DESTINATIONS, COMP-SCR001-SAFETY-DRAWER | 신규 생성: `src/components/scr001/DestinationDrawer.tsx` | 소개·명소 5개 이상·추천 시기·1일/3일 일정·예산·교통·음식 3개 이상·에티켓·출처·수정일 모두 표시, 해외는 하단 "국가 안전정보 보기" 버튼으로 안전정보 Drawer를 같은 스택 위에 이어 연다 | Desktop 우측 슬라이드 520px / Mobile 하단 시트 92%, `shadow.card` 1단계만 사용(D-001 §12) | 없음 | E2E-PUBLIC-SMOKE | M |
| 6 | COMP-SCR001-SAFETY-DRAWER | 국가 안전정보 Drawer | COMPONENT | IMPLEMENT | REQ-FUNC-047, REQ-FUNC-048, REQ-FUNC-049, REQ-FUNC-050, REQ-FUNC-053, REQ-FUNC-054 | SCR-001 | `/` | `src/components/scr001/SafetyDrawer.tsx` | DATA-SAFETY | 신규 생성: `src/components/scr001/SafetyDrawer.tsx` | 8개 필수 카테고리, 출처·확인일, 외교부 원문 링크(새 탭, noopener), 7일 초과 stale 경고, 긴급연락처, 공식 판단 대체 아님 고지 | Drawer 규격 동일(§5 위), 중대경보는 색상+텍스트 라벨 병기(D-001 §2) | 외부 링크 `target=_blank rel=noopener noreferrer` | UNIT 없음 / E2E-PUBLIC-SMOKE | M |
| 7 | COMP-SCR001-THEME-CHIPS | 여행 동기 Chip 목록 | COMPONENT | IMPLEMENT | REQ-FUNC-002 | SCR-001 | `/` | `src/components/scr001/ThemeChips.tsx` | DATA-DESTINATIONS | 신규 생성: `src/components/scr001/ThemeChips.tsx` | 여행 동기 Chip 6개, 선택 시 목록 필터링 | Chip은 완전 라운드(radius.full), 선택 시 코랄 강조(D-001 §5·§21) | 없음 | E2E-PUBLIC-SMOKE | M |
| 8 | COMP-SCR001-COUNTRY-NOTICE | 국가별 주의사항 카드 | COMPONENT | IMPLEMENT | REQ-FUNC-051, REQ-FUNC-052 | SCR-001 | `/` | `src/components/scr001/CountryNoticeGrid.tsx` | DATA-SAFETY, COMP-SCR001-SAFETY-DRAWER | 신규 생성: `src/components/scr001/CountryNoticeGrid.tsx` | 국가 카드 6개, 경보 단계 라벨+최종 확인일 배지+7일 경과 경고 배지, "주의사항 보기"로 안전정보 Drawer 오픈 | Domestic/Overseas Grid와 동일 카드 시각 규칙 | 없음 | E2E-PUBLIC-SMOKE | M |
| 9 | COMP-SCR001-MATE-PREVIEW | 동행 미리보기(좌우 분할) | COMPONENT | IMPLEMENT | REQ-FUNC-030, REQ-FUNC-043 | SCR-001 | `/` | `src/components/scr001/MatePreview.tsx` | DB-ACCESS, SHARED-TOAST | 신규 생성: `src/components/scr001/MatePreview.tsx` | 최근 동행글 최대 3개 카드 또는 "아직 등록된 동행글이 없습니다"+3단계 요약+"동행글 작성하기" CTA의 완성형 Empty State(D-001 §14) | 좌(설명+CTA)/우(카드) 40/60 분할, Mobile 세로 스택 | 비공개 연락처 미노출 | E2E-PUBLIC-SMOKE | M |
| 10 | COMP-SCR001-ABOUT-BANNER | 대표 소개 CTA Banner | COMPONENT | IMPLEMENT | REQ-FUNC-057 | SCR-001 | `/` | `src/components/scr001/AboutBanner.tsx` | DATA-REPRESENTATIVE | 신규 생성: `src/components/scr001/AboutBanner.tsx` | `free_traveler`, `50+ Trips`, `30+ Countries`가 대표 페이지와 정확히 일치, "free_traveler 소개 보기" CTA → `/about` | CTA Banner 패턴(D-001 §5) | 없음 | E2E-PUBLIC-SMOKE | M |

### 2.2 SCR-002 `/about` (핵심)

| Seq | Task ID | 제목 | Category | Impl. | Requirement Ref | Screen | Route | Page Entry | Depends On | Expected Files | Functional AC | Visual AC | Security/Privacy AC | Verify | Priority |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 11 | PAGE-SCR002 | 대표 소개 페이지 조립 | PAGE_OWNER | IMPLEMENT | REQ-FUNC-057, REQ-FUNC-058, REQ-FUNC-059, REQ-FUNC-060, REQ-FUNC-062, REQ-FUNC-063, REQ-FUNC-064, REQ-FUNC-065, REQ-FUNC-070, REQ-FUNC-079 | SCR-002 | `/about` | `src/app/about/page.tsx` | COMP-SCR002-HERO, COMP-SCR002-STATS, COMP-SCR002-STORY, COMP-SCR002-TIMELINE, COMP-SCR002-COUNTRIES, COMP-SCR002-GALLERY, COMP-SCR002-RECOMMEND-CTA, DATA-REPRESENTATIVE, DATA-DESTINATIONS, SHARED-LAYOUT | 신규 생성: `src/app/about/page.tsx` | Section 순서 Profile Hero→여행 지표→소개·철학→Timeline 6→방문국가 30→Gallery 8→기억에 남는 여행지 4+CTA가 정확히 이 순서로 조립된다 | Section 순서·데이터 출처(전부 DATA-REPRESENTATIVE, 추천 카드만 DATA-DESTINATIONS 병행) 고정. 최소 콘텐츠 수: 통계 카드 3·Timeline 6·방문국가 Chip 30·Gallery 8·추천 카드 4. 반응형: Gallery Desktop 4열→Mobile 2열 이하(D-001 §15). Lorem ipsum·'준비 중'·빈 Card 금지, 완성형 Empty State 규칙(정적 콘텐츠라 평상시 Empty 없음, 이미지 로드 실패 시에도 캡션 유지) | 대표 이미지 alt 텍스트 필수(라이선스 메타데이터 자체는 REQ-FUNC-061 EXCLUDED) | E2E-PUBLIC-SMOKE | M |
| 12 | COMP-SCR002-HERO | Profile Hero | COMPONENT | IMPLEMENT | REQ-FUNC-057, REQ-FUNC-058, REQ-FUNC-062 | SCR-002 | `/about` | `src/components/scr002/ProfileHero.tsx` | DATA-REPRESENTATIVE | 신규 생성: `src/components/scr002/ProfileHero.tsx` | 대표명·`50+ Trips`·`30+ Countries`·소개문 첫 문단, 문의·SNS 링크(빈 링크 미렌더, 허용 프로토콜만) | Hero 최대 520px(D-001 §17) | 허용 프로토콜(https/mailto)만 렌더 | E2E-PUBLIC-SMOKE | M |
| 13 | COMP-SCR002-STATS | 여행 지표 카드 | COMPONENT | IMPLEMENT | REQ-FUNC-057 | SCR-002 | `/about` | `src/components/scr002/StatsCards.tsx` | DATA-REPRESENTATIVE | 신규 생성: `src/components/scr002/StatsCards.tsx` | 통계 카드 3개(50+ Trips/30+ Countries/4개 대륙), 홈 소개 카드와 값 일치 | 3열 카드(D-001 §9 변형) | 없음 | E2E-PUBLIC-SMOKE | M |
| 14 | COMP-SCR002-STORY | 소개·철학 좌우 분할 | COMPONENT | IMPLEMENT | REQ-FUNC-058 | SCR-002 | `/about` | `src/components/scr002/StorySection.tsx` | DATA-REPRESENTATIVE | 신규 생성: `src/components/scr002/StorySection.tsx` | 확정 소개문·시작한 이유·철학·편집 원칙 4문단이 줄임 없이 표시 | 좌 목차/우 문단 분할, Mobile 세로 스택(D-001 §9) | 없음 | 해당 없음 | M |
| 15 | COMP-SCR002-TIMELINE | 여행 타임라인 | COMPONENT | IMPLEMENT | REQ-FUNC-060 | SCR-002 | `/about` | `src/components/scr002/Timeline.tsx` | DATA-REPRESENTATIVE | 신규 생성: `src/components/scr002/Timeline.tsx` | 타임라인 항목 6개, 각 항목에 연도·장소·요약 | 세로 Timeline 패턴(D-001 §5) | 없음 | 해당 없음 | M |
| 16 | COMP-SCR002-COUNTRIES | 방문 국가 목록 | COMPONENT | IMPLEMENT | REQ-FUNC-059 | SCR-002 | `/about` | `src/components/scr002/VisitedCountries.tsx` | DATA-REPRESENTATIVE | 신규 생성: `src/components/scr002/VisitedCountries.tsx` | 4개 권역 그룹 헤더 + 국가 Chip 30개 이상, 연결 오류 없음 | Chip 목록 패턴 | 없음 | 해당 없음 | M |
| 17 | COMP-SCR002-GALLERY | 사진 갤러리 | COMPONENT | IMPLEMENT | REQ-FUNC-058, REQ-NF-006 | SCR-002 | `/about` | `src/components/scr002/Gallery.tsx` | DATA-REPRESENTATIVE | 신규 생성: `src/components/scr002/Gallery.tsx` | 사진 8장 그리드, 각 사진에 촬영 장소 alt 텍스트 | Next.js Image lazy load, Gallery 패턴(D-001 §5) | 없음 | 해당 없음 | M |
| 18 | COMP-SCR002-RECOMMEND-CTA | 추천 여행지 배너 | COMPONENT | IMPLEMENT | REQ-FUNC-063 | SCR-002 | `/about` | `src/components/scr002/RecommendBanner.tsx` | DATA-REPRESENTATIVE, DATA-DESTINATIONS | 신규 생성: `src/components/scr002/RecommendBanner.tsx` | 추천 여행지 카드 4개(비공개 여행지 자동 제외) + "여행 준비 시작하기"/"동행 찾아보기" CTA 2개, 카드 클릭 시 SCR-001 상세 Drawer 오픈 | CTA Banner 패턴 | 없음 | E2E-PUBLIC-SMOKE | S |

### 2.3 SCR-003 `/travel-tools` (핵심)

| Seq | Task ID | 제목 | Category | Impl. | Requirement Ref | Screen | Route | Page Entry | Depends On | Expected Files | Functional AC | Visual AC | Security/Privacy AC | Verify | Priority |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 19 | PAGE-SCR003 | 여행 준비 페이지 조립 | PAGE_OWNER | IMPLEMENT | REQ-FUNC-054, REQ-FUNC-064, REQ-FUNC-065, REQ-FUNC-070, REQ-FUNC-079, REQ-FUNC-080 | SCR-003 | `/travel-tools` | `src/app/travel-tools/page.tsx` | COMP-SCR003-INTRO-TABS, COMP-SCR003-FLIGHT, COMP-SCR003-HOTEL, COMP-SCR003-MATE-WRITE, SHARED-LAYOUT | 신규 생성: `src/app/travel-tools/page.tsx` | Section 순서 Intro→탭→여행정보 Form→입력 요약·외부 이동→찾기 Tip 3→동행 작성 또는 로그인 안내·안전 안내가 이 순서로 조립되고, 항공편·숙소·동행 구하기 3개 탭이 실제로 조립되어 각 탭이 독립된 입력·검증·완료 상태를 유지한다 | Section 순서·데이터 출처(항공/숙소=클라이언트 상태만, 동행 작성=DB-ACCESS) 고정. 최소 콘텐츠 수: 찾기 Tip 3개, 탭 3개 전부 항상 노출. Lorem ipsum·'준비 중'·빈 Card 금지, 미인증 상태는 안내 카드+CTA를 갖춘 완성형 Empty State | 항공·숙소 입력값(국가·지역·날짜)은 서버 DB·서버 로그·분석 이벤트·외부 URL 쿼리 어디에도 전달·저장하지 않는다(REQ-FUNC-017·025, NF-017) | E2E-TRAVEL-TOOLS | M |
| 20 | COMP-SCR003-INTRO-TABS | Intro + 탭 컨트롤러 | COMPONENT | IMPLEMENT | REQ-FUNC-064 | SCR-003 | `/travel-tools` | `src/components/scr003/TabsShell.tsx` | 없음 | 신규 생성: `src/components/scr003/TabsShell.tsx` | [항공편][숙소][동행 구하기] 3탭, 탭 전환 시 다른 탭 상태 보존 | underline 탭, 활성 탭 코랄(D-001 §10) | 없음 | E2E-TRAVEL-TOOLS | M |
| 21 | COMP-SCR003-FLIGHT | 항공 조건 입력·요약·외부 이동 | COMPONENT | IMPLEMENT | REQ-FUNC-011, REQ-FUNC-012, REQ-FUNC-013, REQ-FUNC-014, REQ-FUNC-015, REQ-FUNC-016, REQ-FUNC-017, REQ-FUNC-018, REQ-FUNC-054, REQ-NF-017 | SCR-003 | `/travel-tools` | `src/components/scr003/FlightTab.tsx` | COMP-SCR003-INTRO-TABS | 신규 생성: `src/components/scr003/FlightTab.tsx` | 국가·지역·출발일·귀국일 필수 입력, 과거·역전 날짜 차단, 유효 시 요약 표시, 비전달 고지, 새 탭+`noopener,noreferrer` 이동, URL 오류 시 차단+재시도 | Form 좌우분할(폼+안내), 오류는 색상+텍스트 병기(D-001 §10) | **입력값을 서버 DB·서버 로그·분석 이벤트·URL 쿼리에 전달·저장하지 않는다. 전용 API Route를 만들지 않는다.**(REQ-FUNC-017, NF-017) | UNIT-TRAVEL-DATES, E2E-TRAVEL-TOOLS | M |
| 22 | COMP-SCR003-HOTEL | 숙소 조건 입력·요약·외부 이동 | COMPONENT | IMPLEMENT | REQ-FUNC-019, REQ-FUNC-020, REQ-FUNC-021, REQ-FUNC-022, REQ-FUNC-023, REQ-FUNC-024, REQ-FUNC-025, REQ-FUNC-026, REQ-NF-017 | SCR-003 | `/travel-tools` | `src/components/scr003/HotelTab.tsx` | COMP-SCR003-INTRO-TABS | 신규 생성: `src/components/scr003/HotelTab.tsx` | 국가·지역·체크인·체크아웃 필수 입력, 과거·역전/동일 날짜 차단, 요약 표시, 비전달 고지, 새 탭 이동, 오류 시 차단+재시도 | Flight Tab과 동일 시각 규칙 | **입력값을 서버 DB·서버 로그·분석 이벤트·URL 쿼리에 전달·저장하지 않는다. 전용 API Route를 만들지 않는다.**(REQ-FUNC-025, NF-017) | UNIT-TRAVEL-DATES, E2E-TRAVEL-TOOLS | M |
| 23 | COMP-SCR003-MATE-WRITE | 동행 작성 / 로그인·성인인증 안내 | COMPONENT | IMPLEMENT | REQ-FUNC-027, REQ-FUNC-028, REQ-FUNC-031, REQ-FUNC-032, REQ-FUNC-080 | SCR-003 | `/travel-tools` | `src/components/scr003/MateWriteTab.tsx` | COMP-SCR003-INTRO-TABS, DB-ACCESS, SHARED-AUTH-SETUP | 신규 생성: `src/components/scr003/MateWriteTab.tsx` | 미인증: 안내 카드+로그인/가입 CTA(→`/account`). 인증됨: 제목/국가/지역/기간/모집인원/스타일/설명/안전수칙 동의 폼, 연락처 패턴 탐지 시 제출 차단(수정 안내 포함) | 미인증 상태는 완성형 Empty State(D-001 §14) | 인증·성인확인은 서버(Server Action)에서 재검증(REQ-FUNC-027,028) | UNIT-CONTACT-DETECTION, E2E-MATE-AUTH | M |

### 2.4 SCR-004 `/mates` (핵심)

| Seq | Task ID | 제목 | Category | Impl. | Requirement Ref | Screen | Route | Page Entry | Depends On | Expected Files | Functional AC | Visual AC | Security/Privacy AC | Verify | Priority |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 24 | PAGE-SCR004 | 동행 찾기 페이지 조립 | PAGE_OWNER | IMPLEMENT | REQ-FUNC-064, REQ-FUNC-065, REQ-FUNC-070, REQ-FUNC-079 | SCR-004 | `/mates` | `src/app/mates/page.tsx` | COMP-SCR004-FILTER, COMP-SCR004-LIST, COMP-SCR004-DETAIL, COMP-SCR004-APPLY, COMP-SCR004-REPORT, COMP-SCR004-BLOCK, COMP-SCR004-SAFETY-GUIDE, DB-ACCESS, SHARED-LAYOUT | 신규 생성: `src/app/mates/page.tsx` | Section 순서 Intro→Filter·결과 요약→동행 목록→상세→신청 방법 3단계→안전·신고·차단 안내와 CTA가 이 순서로 조립된다 | Section 순서·데이터 출처(전부 DB-ACCESS) 고정. 최소 콘텐츠 수: 목록 카드 최대 8개 우선 노출, 신청 방법 3단계. Desktop 목록(좌40%)+상세(우60%) 동시 표시, Mobile 목록 전체폭+카드 탭 시 전체화면 Drawer. Lorem ipsum·'준비 중'·빈 Card 금지, 목록 0건 시 "조건에 맞는 동행글이 없습니다"+초기화+작성 CTA+이용방법 요약을 갖춘 완성형 Empty State | 차단된 사용자 간 글·프로필·요청 비노출, 연락처 미노출 | E2E-MATE-AUTH | M |
| 25 | COMP-SCR004-FILTER | 검색 Filter + 결과 요약 | COMPONENT | IMPLEMENT | REQ-FUNC-030 | SCR-004 | `/mates` | `src/components/scr004/MateFilter.tsx` | DB-ACCESS | 신규 생성: `src/components/scr004/MateFilter.tsx` | 국가·지역·기간·모집상태·스타일 필터(차단 사용자 글 제외), "총 N건" 요약 | 좌우분할(필터+결과) | 차단 목록 반영 필터링 | E2E-MATE-AUTH | M |
| 26 | COMP-SCR004-LIST | 동행 모집글 목록 | COMPONENT | IMPLEMENT | REQ-FUNC-030, REQ-FUNC-037 | SCR-004 | `/mates` | `src/components/scr004/MateList.tsx` | DB-ACCESS, COMP-SCR004-FILTER | 신규 생성: `src/components/scr004/MateList.tsx` | 최대 8개 우선 노출, 종료일 경과 글은 CLOSED로 자동 표시, 카드에 제목/국가·지역/기간/모집인원/스타일 Chip/상태 배지 | Card Grid(리스트형) | 없음 | UNIT-MATE-STATE, E2E-MATE-AUTH | M |
| 27 | COMP-SCR004-DETAIL | 상세 패널 | COMPONENT | IMPLEMENT | REQ-FUNC-033, REQ-FUNC-036, REQ-FUNC-038 | SCR-004 | `/mates` | `src/components/scr004/MateDetailPanel.tsx` | DB-ACCESS, COMP-SCR004-LIST | 신규 생성: `src/components/scr004/MateDetailPanel.tsx` | 제목/조건/설명 표시(이메일·연락처 미노출), 작성자 전용 승인/거절·마감/수정/삭제 | Desktop 우측 60% / Mobile 전체화면 Drawer | 비작성자 변경 시도는 서버에서 403 | UNIT-MATE-STATE, E2E-MATE-AUTH | M |
| 28 | COMP-SCR004-APPLY | 참가 요청 폼 | COMPONENT | IMPLEMENT | REQ-FUNC-034, REQ-FUNC-035, REQ-NF-019 | SCR-004 | `/mates` | `src/components/scr004/ApplyForm.tsx` | DB-ACCESS, COMP-SCR004-DETAIL, SHARED-AUTH-SETUP | 신규 생성: `src/components/scr004/ApplyForm.tsx` | 최대 500자 비공개 메시지, PENDING 저장, 동일 사용자 중복 PENDING/ACCEPTED 차단, 비로그인·성인미인증 시도 시 로그인·성인인증 안내로 전환(Unauthorized), 제출 실패 시 값 유지+오류 메시지+재시도(Error) | 폼 인라인 검증 | 요청은 작성자·요청자만 열람(RLS) | UNIT-MATE-STATE, TEST-RLS-BASIC | M |
| 29 | COMP-SCR004-REPORT | 신고 | COMPONENT | IMPLEMENT | REQ-FUNC-039, REQ-NF-019 | SCR-004 | `/mates` | `src/components/scr004/ReportDialog.tsx` | DB-ACCESS, SHARED-AUTH-SETUP | 신규 생성: `src/components/scr004/ReportDialog.tsx` | 사유 코드+설명 제출, 신고 ID·접수 시각 3초 이내 표시, 비로그인 시도 시 로그인·성인인증 안내로 전환(Unauthorized), 제출 실패 시 오류 메시지+재시도(Error) | Modal 패턴 | RLS로 본인 신고만 조회 | E2E-MATE-AUTH | M |
| 30 | COMP-SCR004-BLOCK | 차단 | COMPONENT | IMPLEMENT | REQ-FUNC-040 | SCR-004 | `/mates` | `src/components/scr004/BlockAction.tsx` | DB-ACCESS, SHARED-AUTH-SETUP | 신규 생성: `src/components/scr004/BlockAction.tsx` | 차단·해제 액션, 차단 후 상호 글·프로필·요청 비노출, 비로그인 시도 시 로그인·성인인증 안내로 전환(Unauthorized), 처리 실패 시 오류 메시지+재시도(Error) | 버튼/확인 Dialog | RLS로 차단 관계 반영 | E2E-MATE-AUTH | M |
| 31 | COMP-SCR004-SAFETY-GUIDE | 신청 방법 3단계 + 안전 안내 배너 | COMPONENT | IMPLEMENT | REQ-FUNC-080 | SCR-004 | `/mates` | `src/components/scr004/SafetyGuide.tsx` | 없음 | 신규 생성: `src/components/scr004/SafetyGuide.tsx` | 참가 요청 3단계 안내 + 안전 약속 CTA Banner("여행 조건 먼저 정리하기"→`/travel-tools`) | 3단계 안내 + CTA Banner 패턴 | 없음 | 해당 없음 | M |

### 2.5 SCR-005 `/account` (핵심)

| Seq | Task ID | 제목 | Category | Impl. | Requirement Ref | Screen | Route | Page Entry | Depends On | Expected Files | Functional AC | Visual AC | Security/Privacy AC | Verify | Priority |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 32 | PAGE-SCR005 | 계정 페이지 조립 | PAGE_OWNER | IMPLEMENT | REQ-FUNC-064, REQ-FUNC-065, REQ-FUNC-070, REQ-FUNC-079 | SCR-005 | `/account` | `src/app/account/page.tsx` | COMP-SCR005-AUTH, COMP-SCR005-PROFILE, COMP-SCR005-MY-ACTIVITY, COMP-SCR005-ADMIN, DB-ACCESS, SHARED-AUTH-SETUP, SHARED-LAYOUT | 신규 생성: `src/app/account/page.tsx` | Guest·Member·Admin 중 현재 역할의 Intro→핵심 작업→도움말/다음 행동이 조립되고, 역할에 없는 관리 영역(예: 일반 회원의 관리자 탭)은 렌더링하지 않는다 | Section 순서: 역할별로 다름(Guest=탭 없음 단일 화면 4블록, Member=[프로필][내 활동] 2탭, Admin=+[관리자] 1탭) — 순서는 UI_CONTRACT.md SCR-005 정의 고정. 데이터 출처: 전부 DB-ACCESS. 최소 콘텐츠: Guest 4블록, Member 2탭 각 최소 1개 콘텐츠 블록, Admin 신고 목록+URL 설정 폼. Lorem ipsum·'준비 중'·빈 Card 금지, 내 글/참가요청/차단목록 0건은 완성형 Empty State(설명+CTA) | 권한 없는 탭 직접 접근 시 "권한이 없습니다"+프로필 탭 이동(서버에서도 역할 재검증) | E2E-MATE-AUTH | M |
| 33 | COMP-SCR005-AUTH | Guest 인증(로그인/가입/재설정) | COMPONENT | IMPLEMENT | REQ-FUNC-066, REQ-FUNC-027, REQ-FUNC-028 | SCR-005 | `/account` | `src/components/scr005/AuthPanel.tsx` | SHARED-AUTH-SETUP | 신규 생성: `src/components/scr005/AuthPanel.tsx` | 이메일 로그인/가입/비밀번호 재설정 세그먼트, 인증되지 않은 이메일은 동행 쓰기 권한 없음 | 세그먼트 폼 패턴 | 비밀번호 암호화 저장(Supabase Auth 기본) | UNIT 없음 / E2E-MATE-AUTH | M |
| 34 | COMP-SCR005-PROFILE | 프로필·성인확인 | COMPONENT | IMPLEMENT | REQ-FUNC-029, REQ-FUNC-028 | SCR-005 | `/account` | `src/components/scr005/ProfileTab.tsx` | DB-ACCESS | 신규 생성: `src/components/scr005/ProfileTab.tsx` | 닉네임(필수)·연령대(필수)·성별(선택)·여행스타일(필수)·자기소개, 성인 확인 상태 배지+미완료 시 CTA | 프로필 카드+수정 폼(D-001 §10) | 정확한 생년월일 미저장(`is_adult`, `adult_verified_at`만) | E2E-MATE-AUTH | M |
| 35 | COMP-SCR005-MY-ACTIVITY | 내 활동(내 글/참가요청/차단/즐겨찾기) | COMPONENT | IMPLEMENT | REQ-FUNC-036, REQ-FUNC-038, REQ-FUNC-040, REQ-FUNC-068 | SCR-005 | `/account` | `src/components/scr005/MyActivityTab.tsx` | DB-ACCESS | 신규 생성: `src/components/scr005/MyActivityTab.tsx` | 내 글 목록(상태 배지, 클릭 시 SCR-004 상세 이동)+"새 동행글 작성" CTA, 참가 요청 목록(PENDING/ACCEPTED/REJECTED), 차단 목록+해제, 즐겨찾기 목록(중복 생성 없음) | 목록형, 0건은 완성형 Empty State | RLS로 본인 데이터만 | E2E-MATE-AUTH | M |
| 36 | COMP-SCR005-ADMIN | 관리자(신고 상태·외부 URL 설정) | COMPONENT | IMPLEMENT | REQ-FUNC-041, REQ-FUNC-077 | SCR-005 | `/account` | `src/components/scr005/AdminTab.tsx` | DB-ACCESS | 신규 생성: `src/components/scr005/AdminTab.tsx` | 신고 목록(OPEN/REVIEWING/RESOLVED/DISMISSED 필터), 항공·호텔 외부 URL 현재값+HTTPS 허용목록 검증 수정 폼(HTTP/javascript/data URL 저장 차단) | 단순 목록/폼만(복잡한 분석/KPI 대시보드 금지, D-001 §21) | Admin 역할만 접근(RLS+서버 역할 검증) | TEST-RLS-BASIC | M |

### 2.6 Shared (5개 Screen 공용)

| Seq | Task ID | 제목 | Category | Impl. | Requirement Ref | Screen | Route | Page Entry | Depends On | Expected Files | Functional AC | Visual AC | Security/Privacy AC | Verify | Priority |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 37 | SHARED-LAYOUT | 전역 Header/Footer/레이아웃/SEO | SHARED | IMPLEMENT | REQ-FUNC-064, REQ-FUNC-065, REQ-FUNC-070, REQ-FUNC-079, REQ-NF-030 | 전역 | (all routes) | `src/app/layout.tsx` | SHARED-DESIGN-TOKENS | 수정: `src/app/layout.tsx`; 신규 생성: `src/components/shared/Header.tsx`, `src/components/shared/Footer.tsx` | 전역 내비게이션(여행 준비/동행 찾기/대표 소개+계정 아이콘)+Footer(3열→1열), 페이지별 title/description/canonical/OG 메타데이터 헬퍼 제공 | 320px~반응형, Header 72px/56px(D-001 §7) | 없음 | MANUAL-A11Y-CHECK, MANUAL-RESPONSIVE-CHECK | M |
| 38 | SHARED-DESIGN-TOKENS | 디자인 토큰(Tailwind 설정) | SHARED | IMPLEMENT | 없음(구조 기반) | 전역 | (all routes) | `tailwind.config` 또는 `src/app/globals.css` | 없음 | 수정: `src/app/globals.css`; 신규 생성: `src/styles/tokens.ts` | D-001/DESIGN.md의 Color/Typography/Spacing/Radius/Shadow 토큰이 Tailwind 테마로 반영 | 토큰 값이 D-001 §2~6과 정확히 일치, 임의 색상 추가 없음(D-001 §21) | 없음 | 해당 없음 | M |
| 39 | SHARED-TOAST | Toast 알림 시스템 | SHARED | IMPLEMENT | REQ-FUNC-043 | 전역 | (all routes) | `src/components/shared/Toast.tsx` | 없음 | 신규 생성: `src/components/shared/Toast.tsx` | 참가 요청 접수/승인/거절/신고 처리 결과가 1분 이내 인앱 Toast로 표시, 이메일 장애가 상태 변경을 롤백하지 않음 | 색상+텍스트 라벨 병기(semantic color) | 없음 | E2E-MATE-AUTH | M |
| 40 | SHARED-AUTH-SETUP | Supabase Auth 클라이언트/미들웨어 | SHARED | IMPLEMENT | REQ-FUNC-066, REQ-NF-013, REQ-NF-014 | 전역 | (all routes) | `src/lib/supabase/auth.ts` | DB-SCHEMA-BASE | 신규 생성: `src/lib/supabase/auth.ts`, `middleware.ts` | 세션 발급/검증, 역할(Guest/Member/Admin) 판별 | 없음 | CSRF 방어·SameSite 쿠키, 인증·역할은 서버에서 검증 | TEST-RLS-BASIC | M |
| 41 | SHARED-FAVORITES | 즐겨찾기(localStorage) | SHARED | IMPLEMENT | REQ-FUNC-068 | 전역 | (all routes) | `src/hooks/useFavorites.ts` | 없음 | 신규 생성: `src/hooks/useFavorites.ts` | 즐겨찾기 추가/해제/조회, 중복 생성 방지 | 없음 | 서버 저장 없이 브라우저별 localStorage만 사용 | 해당 없음 | S |
| 42 | SHARED-ERROR-PAGES | 404/500 복구 화면 | SHARED | IMPLEMENT | REQ-FUNC-078 | 기술 Route | `*` | `src/app/not-found.tsx` / `src/app/error.tsx` | SHARED-LAYOUT | 신규 생성: `src/app/not-found.tsx`, `src/app/error.tsx` | 홈/이전/재시도 중 최소 1개 복구 행동 제공 | 전역 레이아웃과 시각 일관성 | 없음 | 해당 없음 | M |

### 2.7 정적 데이터

| Seq | Task ID | 제목 | Category | Impl. | Requirement Ref | Screen | Route | Page Entry | Depends On | Expected Files | Functional AC | Visual AC | Security/Privacy AC | Verify | Priority |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 43 | DATA-DESTINATIONS | 여행지 정적 데이터 | DATA | IMPLEMENT | REQ-FUNC-001, REQ-FUNC-004, REQ-FUNC-005, REQ-FUNC-006, REQ-FUNC-008, REQ-NF-006, REQ-NF-026 | 해당없음(표시는 SCR-001) | N/A | `src/data/destinations.ts` | 없음 | 신규 생성: `src/data/destinations.ts` (TypeScript, `PROJECT_SCOPE.md` §5 정적 데이터 방식) | 국내 10개 이상·해외 15개국 30개 도시 이상, 각 항목 소개·명소 5개 이상·추천시기·1일/3일 일정·예산·교통·음식 3개 이상·에티켓·출처·수정일 TypeScript 타입으로 강제 | 이미지는 URL+alt 텍스트만(출처·작가·라이선스 메타데이터는 REQ-FUNC-007 EXCLUDED) | 없음 | 데이터 작성 체크리스트(수동) | M |
| 44 | DATA-SAFETY | 국가 안전정보 정적 데이터 | DATA | IMPLEMENT | REQ-FUNC-046, REQ-FUNC-047, REQ-FUNC-048, REQ-FUNC-050, REQ-FUNC-051, REQ-FUNC-052, REQ-FUNC-053, REQ-NF-027, REQ-NF-028 | 해당없음(표시는 SCR-001) | N/A | `src/data/country-safety.ts` | DATA-DESTINATIONS | 신규 생성: `src/data/country-safety.ts` | DATA-DESTINATIONS의 모든 해외 국가에 안전정보 1개 이상, 8개 필수 카테고리·출처·확인일·경보 범위(scope_type/scope_text) 타입 강제 | 없음 | 없음 | 데이터 작성 체크리스트(수동) | M |
| 45 | DATA-REPRESENTATIVE | 대표 프로필 정적 데이터 | DATA | IMPLEMENT | REQ-FUNC-057, REQ-FUNC-058, REQ-FUNC-059, REQ-FUNC-060, REQ-FUNC-062, REQ-FUNC-063 | 해당없음(표시는 SCR-002) | N/A | `src/data/representative.ts` | DATA-DESTINATIONS | 신규 생성: `src/data/representative.ts` | 대표명·지표·소개문·철학·30개국 이상 방문국·타임라인·추천 여행지 6개(그중 4개를 SCR-002에 노출) | 없음 | 없음 | 해당 없음 | M |

### 2.8 DB

| Seq | Task ID | 제목 | Category | Impl. | Requirement Ref | Screen | Route | Page Entry | Depends On | Expected Files | Functional AC | Visual AC | Security/Privacy AC | Verify | Priority |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 46 | DB-SCHEMA-BASE | DB 스키마(6개 테이블) | DB | IMPLEMENT | REQ-FUNC-029, REQ-FUNC-031, REQ-FUNC-034, REQ-FUNC-039, REQ-FUNC-040, REQ-FUNC-077 | 해당없음 | N/A | `supabase/migrations/0001_schema.sql` | 없음 | 신규 생성: `supabase/migrations/0001_schema.sql` | `USER_PROFILE`, `MATE_POST`, `MATE_APPLICATION`, `USER_BLOCK`, `REPORT`, `OUTBOUND_URL_SETTING` **정확히 6개 테이블**만 생성(그 외 테이블 생성 금지) | 없음 | 없음 | TEST-RLS-BASIC | M |
| 47 | DB-RLS-BASE | RLS 정책 | DB | IMPLEMENT | REQ-FUNC-044, REQ-NF-013 | 해당없음 | N/A | `supabase/migrations/0002_rls.sql` | DB-SCHEMA-BASE | 신규 생성: `supabase/migrations/0002_rls.sql` | 본인 글·요청, 요청 대상 작성자, Admin만 비공개 데이터 열람. 권한별 부정 접근은 403/빈 결과 | 없음 | RLS 정책이 모든 6개 테이블에 존재 | TEST-RLS-BASIC | M |
| 48 | DB-ACCESS | Server Action 접근 계층 | DB | IMPLEMENT | REQ-FUNC-030, REQ-FUNC-033, REQ-FUNC-034, REQ-FUNC-035, REQ-FUNC-036, REQ-FUNC-037, REQ-FUNC-038, REQ-FUNC-039, REQ-FUNC-040, REQ-FUNC-041, REQ-FUNC-077, REQ-NF-005, REQ-NF-015, REQ-NF-019 | 해당없음 | N/A | `src/lib/db/*.ts` | DB-SCHEMA-BASE, DB-RLS-BASE | 신규 생성: `src/lib/db/matePosts.ts`, `src/lib/db/applications.ts`, `src/lib/db/blocks.ts`, `src/lib/db/reports.ts`, `src/lib/db/outboundUrls.ts` | 6개 테이블에 대한 CRUD/상태 전이 Server Action, 쓰기 API p95≤3s 목표로 구현, 입력 검증·이스케이프 | 없음 | 저장 XSS 차단(파라미터 바인딩), 항공·호텔 데이터는 이 계층에 포함하지 않음(REQ-FUNC-017/025) | TEST-RLS-BASIC, UNIT-MATE-STATE | M |
| 49 | DB-SEED-BASE | 개발용 Seed 데이터 | DB | IMPLEMENT | 없음(개발 지원) | 해당없음 | N/A | `supabase/seed.sql` | DB-SCHEMA-BASE, DB-RLS-BASE | 신규 생성: `supabase/seed.sql` | 로컬 개발·E2E 테스트용 최소 샘플 행(사용자 2~3, 모집글 3~5, 요청 몇 건) | 없음 | 실제 개인정보 없이 가상 데이터만 사용 | E2E-MATE-AUTH | C |

### 2.9 Unit / RLS Test

| Seq | Task ID | 제목 | Category | Impl. | Requirement Ref | Screen | Route | Page Entry | Depends On | Expected Files | Functional AC | Visual AC | Security/Privacy AC | Verify | Priority |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 50 | UNIT-TRAVEL-DATES | 날짜 검증 단위 테스트 | UNIT_TEST | IMPLEMENT | REQ-FUNC-013, REQ-FUNC-021 | 해당없음 | N/A | `tests/unit/travel-dates.spec.ts` | COMP-SCR003-FLIGHT, COMP-SCR003-HOTEL | 신규 생성: `tests/unit/travel-dates.spec.ts` | 과거 출발일/체크인, 역전 귀국일/체크아웃, 동일 체크인·체크아웃 경계값 전부 차단 검증 | 없음 | 없음 | 자기 자신(CI-PIPELINE-BASE에서 실행) | M |
| 51 | UNIT-CONTACT-DETECTION | 연락처 탐지 단위 테스트 | UNIT_TEST | IMPLEMENT | REQ-FUNC-032 | 해당없음 | N/A | `tests/unit/contact-detection.spec.ts` | COMP-SCR003-MATE-WRITE | 신규 생성: `tests/unit/contact-detection.spec.ts` | 전화번호·이메일·메신저 ID 기준 테스트셋 탐지율 95% 이상, 오탐 5% 이하 | 없음 | 없음 | CI-PIPELINE-BASE | M |
| 52 | UNIT-MATE-STATE | 동행 상태 전이 단위 테스트 | UNIT_TEST | IMPLEMENT | REQ-FUNC-035, REQ-FUNC-036, REQ-FUNC-037 | 해당없음 | N/A | `tests/unit/mate-state.spec.ts` | DB-ACCESS | 신규 생성: `tests/unit/mate-state.spec.ts` | MATE_POST(OPEN/CLOSED/HIDDEN/DELETED), MATE_APPLICATION(PENDING/ACCEPTED/REJECTED/WITHDRAWN) 상태 전이가 `02_SRS_BASELINE.md` §6.5 상태 다이어그램과 일치 | 없음 | 없음 | CI-PIPELINE-BASE | M |
| 53 | TEST-RLS-BASIC | RLS 기본 통합 테스트 | RLS_TEST | IMPLEMENT | REQ-FUNC-044, REQ-NF-013 | 해당없음 | N/A | `tests/rls/basic.spec.ts` | DB-RLS-BASE, DB-SEED-BASE | 신규 생성: `tests/rls/basic.spec.ts` | 비회원/타인 계정으로 비공개 데이터 접근 시 전부 403 또는 빈 결과 | 없음 | 6개 테이블 전체를 대상으로 함 | CI-PIPELINE-BASE | M |

### 2.10 E2E (Playwright, Chromium Smoke만)

| Seq | Task ID | 제목 | Category | Impl. | Requirement Ref | Screen | Route | Page Entry | Depends On | Expected Files | Functional AC | Visual AC | Security/Privacy AC | Verify | Priority |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 54 | E2E-PUBLIC-SMOKE | 공개 화면 Smoke(SCR-001/002/004 열람) | E2E_TEST | IMPLEMENT | REQ-FUNC-001, REQ-FUNC-003, REQ-FUNC-004, REQ-FUNC-006, REQ-FUNC-057, REQ-FUNC-063 | SCR-001/002/004 | `/`, `/about`, `/mates` | `tests/e2e/public-smoke.spec.ts` | PAGE-SCR001, PAGE-SCR002, PAGE-SCR004 | 신규 생성: `tests/e2e/public-smoke.spec.ts` | 여행지 검색→상세 Drawer→안전정보 Drawer, 대표 소개 열람, 동행 목록 비로그인 열람까지 5~7개 핵심 흐름을 Chromium 1개 프로젝트로 실행 | 없음 | 없음 | CI-PIPELINE-BASE | M |
| 55 | E2E-TRAVEL-TOOLS | 항공·숙소 외부 이동 Smoke | E2E_TEST | IMPLEMENT | REQ-FUNC-011, REQ-FUNC-013, REQ-FUNC-016, REQ-FUNC-019, REQ-FUNC-021, REQ-FUNC-024 | SCR-003 | `/travel-tools` | `tests/e2e/travel-tools.spec.ts` | PAGE-SCR003 | 신규 생성: `tests/e2e/travel-tools.spec.ts` | 항공/숙소 입력→검증 오류→유효 요약→새 탭 이동(`noopener`) 흐름을 Chromium으로 검증, 네트워크 탭에서 입력값 미전송 확인 | 없음 | 입력값이 요청 URL/바디에 없음을 자동 검증 | CI-PIPELINE-BASE | M |
| 56 | E2E-MATE-AUTH | 인증·동행 작성·참가·승인 Smoke | E2E_TEST | IMPLEMENT | REQ-FUNC-027, REQ-FUNC-028, REQ-FUNC-031, REQ-FUNC-034, REQ-FUNC-036 | SCR-003/004/005 | `/travel-tools`, `/mates`, `/account` | `tests/e2e/mate-auth.spec.ts` | PAGE-SCR003, PAGE-SCR004, PAGE-SCR005, DB-SEED-BASE | 신규 생성: `tests/e2e/mate-auth.spec.ts` | 비회원 차단→로그인/성인확인→동행글 작성→참가 요청→작성자 승인까지 흐름을 Chromium으로 검증 | 없음 | 비회원 POST 차단을 자동 검증 | CI-PIPELINE-BASE | M |

### 2.11 CI / Deploy

| Seq | Task ID | 제목 | Category | Impl. | Requirement Ref | Screen | Route | Page Entry | Depends On | Expected Files | Functional AC | Visual AC | Security/Privacy AC | Verify | Priority |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 57 | CI-PIPELINE-BASE | CI 파이프라인(타입체크/린트/유닛/E2E) | CI | IMPLEMENT | REQ-NF-031 | 해당없음 | N/A | `.github/workflows/ci.yml`(또는 동등 CI 설정) | UNIT-TRAVEL-DATES, UNIT-CONTACT-DETECTION, UNIT-MATE-STATE, TEST-RLS-BASIC, E2E-PUBLIC-SMOKE, E2E-TRAVEL-TOOLS, E2E-MATE-AUTH | 신규 생성: CI 워크플로 파일 | `tsc --noEmit`, `next lint`, 위 Unit/RLS/E2E Task가 main 병합 전 통과 | 없음 | 무인 자동 Merge를 수행하지 않는다(사람이 검토·승인, SRS REQ-NF-031) | 해당 없음(이 Task 자체가 게이트) | M |
| 58 | DEPLOY-ENV-CHECK | Vercel/Supabase 배포·환경변수 확인 | DEPLOY | IMPLEMENT | REQ-NF-012, REQ-NF-016, REQ-NF-034 | 해당없음 | N/A | `docs/deploy-checklist.md` 또는 Vercel 대시보드 | DB-SCHEMA-BASE, SHARED-AUTH-SETUP | 신규 생성: 배포 체크리스트 문서 | `FLIGHT_OUTBOUND_URL`/`HOTEL_OUTBOUND_URL`/`MOFA_SAFETY_URL`/Supabase 키가 Vercel 환경변수로 설정, TLS 기본 적용 확인, 월 인프라 비용 10만원 이하 요금제 확인 | 없음 | 비밀키가 클라이언트 번들에 포함되지 않음을 빌드 산출물로 확인. **EC2/AWS 사용 안 함(Vercel·Supabase만).** | MANUAL 확인 | M |

### 2.12 Manual Check / Release Check

| Seq | Task ID | 제목 | Category | Impl. | Requirement Ref | Screen | Route | Page Entry | Depends On | Expected Files | Functional AC | Visual AC | Security/Privacy AC | Verify | Priority |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 59 | MANUAL-A11Y-CHECK | 접근성 수동 확인 | MANUAL_CHECK | IMPLEMENT | REQ-NF-023, REQ-NF-025 | 전역 | (all routes) | N/A(브라우저 수동 확인) | SHARED-LAYOUT, PAGE-SCR001, PAGE-SCR002, PAGE-SCR003, PAGE-SCR004, PAGE-SCR005 | 없음(문서/체크리스트만) | 키보드만으로 핵심 UC(UC-01~09) 100% 완료, 스크린리더로 폼·모달·탭·알림 의미 확인 | 포커스 링이 `:focus-visible`에서만 표시(D-001 §2) | 없음 | 사람이 브라우저에서 직접 확인 | M |
| 60 | MANUAL-RESPONSIVE-CHECK | 반응형·Core Web Vitals 수동 확인 | MANUAL_CHECK | IMPLEMENT | REQ-FUNC-065, REQ-NF-001, REQ-NF-002, REQ-NF-003 | 전역 | (all routes) | N/A(브라우저 수동 확인) | SHARED-LAYOUT, PAGE-SCR001, PAGE-SCR002, PAGE-SCR003, PAGE-SCR004, PAGE-SCR005 | 없음(문서/체크리스트만) | 320px~Desktop까지 가로 스크롤·겹침 없음, Lighthouse로 LCP/INP/CLS 목표치 확인 | 5개 Screen 전부 D-001 §15 Breakpoint 규칙 준수 | 없음 | 사람이 브라우저에서 직접 확인 | M |
| 61 | COMP-LEGAL-DOCS | 정책 문서 4종(이용약관·개인정보처리방침·동행 안전수칙·콘텐츠 면책) | COMPONENT | IMPLEMENT | REQ-FUNC-080 | 해당없음(5개 Screen 밖, DEC-015) | `/legal/terms`, `/legal/privacy`, `/legal/companion-guidelines`, `/legal/content-disclaimer` | `src/app/legal/terms/page.tsx` | SHARED-LAYOUT | 신규 생성: `src/app/legal/terms/page.tsx`, `src/app/legal/privacy/page.tsx`, `src/app/legal/companion-guidelines/page.tsx`, `src/app/legal/content-disclaimer/page.tsx` | 4개 정책 페이지가 각각 실제 텍스트 콘텐츠로 존재하고 Footer의 정책 링크 4개와 1:1로 연결된다 | 별도 시각 디자인 없이 SHARED-LAYOUT의 전역 Header/Footer만 재사용, 본문은 D-001 §3 Typography 토큰 사용 | 없음 | 해당 없음 | S |
| 62 | RELEASE-ACCEPTANCE-CHECK | Release Acceptance 종합 확인 | RELEASE_CHECK | IMPLEMENT | 전체 84개 IMPLEMENT Requirement 종합 | 전역 | (all routes) | N/A | PAGE-SCR001, COMP-SCR001-HERO-SEARCH, COMP-SCR001-DOMESTIC-GRID, COMP-SCR001-OVERSEAS-GRID, COMP-SCR001-DEST-DRAWER, COMP-SCR001-SAFETY-DRAWER, COMP-SCR001-THEME-CHIPS, COMP-SCR001-COUNTRY-NOTICE, COMP-SCR001-MATE-PREVIEW, COMP-SCR001-ABOUT-BANNER, PAGE-SCR002, COMP-SCR002-HERO, COMP-SCR002-STATS, COMP-SCR002-STORY, COMP-SCR002-TIMELINE, COMP-SCR002-COUNTRIES, COMP-SCR002-GALLERY, COMP-SCR002-RECOMMEND-CTA, PAGE-SCR003, COMP-SCR003-INTRO-TABS, COMP-SCR003-FLIGHT, COMP-SCR003-HOTEL, COMP-SCR003-MATE-WRITE, PAGE-SCR004, COMP-SCR004-FILTER, COMP-SCR004-LIST, COMP-SCR004-DETAIL, COMP-SCR004-APPLY, COMP-SCR004-REPORT, COMP-SCR004-BLOCK, COMP-SCR004-SAFETY-GUIDE, PAGE-SCR005, COMP-SCR005-AUTH, COMP-SCR005-PROFILE, COMP-SCR005-MY-ACTIVITY, COMP-SCR005-ADMIN, SHARED-LAYOUT, SHARED-DESIGN-TOKENS, SHARED-TOAST, SHARED-AUTH-SETUP, SHARED-FAVORITES, SHARED-ERROR-PAGES, COMP-LEGAL-DOCS, DATA-DESTINATIONS, DATA-SAFETY, DATA-REPRESENTATIVE, DB-SCHEMA-BASE, DB-RLS-BASE, DB-ACCESS, DB-SEED-BASE, UNIT-TRAVEL-DATES, UNIT-CONTACT-DETECTION, UNIT-MATE-STATE, TEST-RLS-BASIC, E2E-PUBLIC-SMOKE, E2E-TRAVEL-TOOLS, E2E-MATE-AUTH, CI-PIPELINE-BASE, DEPLOY-ENV-CHECK, MANUAL-A11Y-CHECK, MANUAL-RESPONSIVE-CHECK | 없음(문서/체크리스트만) | `docs/05_UIUX_APPROVED.md` §6 AC-REL-01~07 전부 충족 확인, `docs/UIUX_TRACEABILITY.md` Status를 DONE으로 갱신 | 5개 Screen 전부 Section 순서·최소 콘텐츠 수·Empty State 규칙 최종 재확인 | Do Not 목록(Airbnb 상표/구매·예약·결제 UI/Proprietary 폰트/임의 색상) 위반 없음 최종 확인 | 사람이 최종 승인 | M |

---

## 3. 의존성 요약 (Category 간 큰 그림)

```
DB-SCHEMA-BASE → DB-RLS-BASE → DB-ACCESS → DB-SEED-BASE
SHARED-DESIGN-TOKENS → SHARED-LAYOUT → SHARED-ERROR-PAGES
SHARED-AUTH-SETUP → COMP-SCR005-AUTH, COMP-SCR003-MATE-WRITE
DATA-DESTINATIONS → DATA-SAFETY, DATA-REPRESENTATIVE
(DATA/DB/SHARED 완료) → 각 Screen의 Component Task → 각 Screen의 PAGE-* Owner
(모든 PAGE-*) → E2E_TEST → CI-PIPELINE-BASE → DEPLOY-ENV-CHECK → MANUAL_CHECK → RELEASE-ACCEPTANCE-CHECK
```

---

## 4. 화면별 콘텐츠 계약 반영 확인

| Screen | 콘텐츠 계약(이번 지시) | 반영 위치 |
|---|---|---|
| PAGE-SCR001 | Hero→국내6→해외6→여행동기6→국가별주의사항6→최근동행글3/Empty→소개 | PAGE-SCR001 Functional/Visual AC |
| PAGE-SCR002 | Hero→지표→소개철학→Timeline6→국가30→Gallery8→추천4+CTA | PAGE-SCR002 Functional/Visual AC |
| PAGE-SCR003 | Intro→탭→Form→요약·이동→Tip3→동행작성/로그인안내 | PAGE-SCR003 Functional/Visual AC |
| PAGE-SCR004 | Intro→Filter·요약→목록→상세→3단계→안전·신고·차단 CTA | PAGE-SCR004 Functional/Visual AC |
| PAGE-SCR005 | 역할별 Intro→핵심작업→도움말/CTA, 역할 없는 영역 비렌더 | PAGE-SCR005 Functional/Visual AC |

---

## 5. 필수 Page Owner 확인

| Screen | Route | Page Entry | Task ID | 확인 |
|---|---|---|---|---|
| SCR-001 | `/` | `src/app/page.tsx` | PAGE-SCR001 | ✅ 일치 |
| SCR-002 | `/about` | `src/app/about/page.tsx` | PAGE-SCR002 | ✅ 일치 |
| SCR-003 | `/travel-tools` | `src/app/travel-tools/page.tsx` | PAGE-SCR003 | ✅ 일치 |
| SCR-004 | `/mates` | `src/app/mates/page.tsx` | PAGE-SCR004 | ✅ 일치 |
| SCR-005 | `/account` | `src/app/account/page.tsx` | PAGE-SCR005 | ✅ 일치 |

각 Page Owner는 정확히 하나의 Page Entry만 소유한다(규칙 16 — 위 표에서 중복 없음 확인).

---

## 6. NON_IMPLEMENTATION 표 (EXCLUDED Requirement 30건 — 삭제하지 않음)

| Requirement | 근거(PROJECT_SCOPE.md) | 후속 방향 |
|---|---|---|
| REQ-FUNC-007 | 이미지 출처·작가·라이선스 메타데이터 관리 워크플로 제외, alt 텍스트만 사용 | 후속 범위에서 미디어 라이선스 관리가 필요해지면 MEDIA_ASSET 테이블과 관리자 업로드 폼을 별도 Task로 추가 |
| REQ-FUNC-009 | 관련 여행지 자동 추천은 Should 항목, MVP 상세 패널 핵심 범위 밖 | 여행지 콘텐츠가 안정화된 후 추천 알고리즘 Task로 별도 검토 |
| REQ-FUNC-010 | 필터 상태 URL query 반영은 Should, 후속 과제 | `useSearchParams` 기반 직렬화를 후속 스프린트에서 COMP-SCR001-HERO-SEARCH 확장으로 검토 |
| REQ-FUNC-042 | 관리자는 신고 상태 변경과 외부 URL 설정만 다룸, 제재 조치는 범위 밖 | 남용 심각해지면 계정 제한 기능을 COMP-SCR005-ADMIN 확장으로 검토 |
| REQ-FUNC-045 | 자동 삭제 파이프라인 미구축, 관리자 수동 처리로 대체 | 개인정보 요청 급증 시 배치 삭제 파이프라인을 별도 Task로 추가 |
| REQ-FUNC-055 | 전체 콘텐츠 CMS 제외, 정적 데이터 직접 편집으로 대체 | 편집자 인원이 늘면 Editor 워크플로 UI를 DATA-* Task 확장으로 검토 |
| REQ-FUNC-056 | 범용 감사 로그 제외, git 커밋 이력으로 대체 | 규제 요구 발생 시 AUDIT_LOG 테이블을 DB-SCHEMA-BASE 확장(7번째 테이블)으로 추가 검토 |
| REQ-FUNC-061 | 대표 이미지 라이선스 메타데이터 관리 제외 | REQ-FUNC-007과 동일한 후속 방향 |
| REQ-FUNC-067 | 통합 검색 제외, 화면별 개별 검색(REQ-FUNC-003)으로 한정 | 검색 UX 요구가 커지면 별도 SearchIndex Task로 검토 |
| REQ-FUNC-069 | 공개 페이지 URL 공유(Web Share API)는 Should, 후속 과제 | 공유 버튼을 SHARED-LAYOUT 확장으로 후속 추가 검토 |
| REQ-FUNC-071 | 행동 분석 이벤트 파이프라인 구축은 범위 밖 | 분석 필요 시 Vercel Analytics 등 경량 도구를 SHARED 확장으로 검토 |
| REQ-FUNC-072 | Editor/Admin 콘텐츠 CRUD·미리보기, 전체 CMS 제외 | REQ-FUNC-055와 동일한 후속 방향 |
| REQ-FUNC-073 | 미디어 업로드 라이선스 필수 입력 워크플로 제외 | REQ-FUNC-007과 동일한 후속 방향 |
| REQ-FUNC-074 | 게시 전 완전성 게이트는 CMS 게시 워크플로 성격, 정적 데이터는 수동 확인으로 대체 | DATA-* Task의 "데이터 작성 체크리스트"로 부분 대체 중, 자동 게이트는 후속 검토 |
| REQ-FUNC-075 | 안전정보 stale 대시보드 제외, 페이지별 stale 배지(REQ-FUNC-050)로 대체 | 국가 수가 크게 늘면 별도 대시보드 Task 검토 |
| REQ-FUNC-076 | 범용 감사 로그 제외 | REQ-FUNC-056과 동일한 후속 방향 |
| REQ-NF-004 | 필터 응답 부하 테스트 제외, 정적 데이터 특성상 자연 충족 가정 | 실사용자 증가 시 CI-PIPELINE-BASE에 부하 테스트 단계 추가 검토 |
| REQ-NF-007 | 배포 전 Lighthouse CI 게이트 제외, 수동 확인으로 대체 | MANUAL-RESPONSIVE-CHECK 결과가 반복 불안정하면 CI-PIPELINE-BASE에 Lighthouse CI 추가 검토 |
| REQ-NF-008 | 월간 가용성 모니터링 체계 미구축, Vercel 기본 인프라 의존 | SLA 요구 발생 시 모니터링 도구 도입 Task 검토 |
| REQ-NF-009 | 내부 API 5xx 비율 모니터링 체계 미구축 | REQ-NF-008과 동일한 후속 방향 |
| REQ-NF-010 | 자동 백업 제외 | Supabase 관리형 백업 옵션 활성화를 DEPLOY-ENV-CHECK 확장으로 검토 |
| REQ-NF-011 | 자동 링크 점검·Admin 알림 제외, 배포 전 수동 점검으로 대체 | 링크 실패가 잦아지면 주기 점검 Cron Task 추가 검토 |
| REQ-NF-018 | 개인정보 자동 삭제 파이프라인 미구축, 관리자 수동 처리 | REQ-FUNC-045와 동일한 후속 방향 |
| REQ-NF-020 | 신고 1차 검토 SLA 측정 체계 미구축 | 신고 처리량 증가 시 SLA 대시보드 Task 검토 |
| REQ-NF-021 | Rate limiting 인프라 범위 밖, 남용 시 수동 신고 처리로 대응 | 남용 발생 시 미들웨어 레벨 Rate Limit Task 추가 검토 |
| REQ-NF-022 | 범용 감사 로그 제외 | REQ-FUNC-056과 동일한 후속 방향 |
| REQ-NF-024 | 자동 접근성 검사(axe) 스위트 구축 범위 밖, Playwright는 핵심 흐름만 검증 | 접근성 이슈가 반복되면 axe-core를 CI-PIPELINE-BASE에 추가 검토 |
| REQ-NF-029 | 미디어 라이선스 메타데이터 관리 제외 | REQ-FUNC-007과 동일한 후속 방향 |
| REQ-NF-032 | 별도 구조화 로깅 파이프라인 구축 범위 밖, 콘솔 로그 수준으로 대체 | 운영 규모 확대 시 로깅 인프라 Task 검토 |
| REQ-NF-033 | 장애 알림 자동화 제외 | REQ-NF-008과 동일한 후속 방향 |

---

## 7. 자체 검증 — 빠진 Requirement 확인

- REQ-FUNC-001~080 중 IMPLEMENT 64개 전부 §2.1~2.11의 Task `Requirement Ref`에 최소 1회 등장함을 확인했다.
- REQ-NF-001~034 중 IMPLEMENT 20개 전부 §2.1~2.12의 Task `Requirement Ref`에 최소 1회 등장함을 확인했다.
- REQ-FUNC/REQ-NF EXCLUDED 30개(FUNC 16 + NF 14) 전부 §6 NON_IMPLEMENTATION 표에 등장함을 확인했다.
- 84 + 30 = **114**, `docs/UIUX_TRACEABILITY.md`의 전체 Requirement 수와 일치한다.

**결론: 빠진 Requirement ID 없음 — 완료로 보고한다.**
