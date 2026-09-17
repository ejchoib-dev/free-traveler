# Wave Plan — Free Traveler

이 문서는 `scripts/build_waves.py`가 생성한다. Wave ID는 W00~W10으로 미리 고정하지 않고,
Task 의존관계·그룹별 4~7개 배치·파일 충돌 분리 규칙에 따라 동적으로 매겨진다.
`/run-wave`·`/prepare-task`는 이 문서를 Wave 정의의 정본으로 읽는다.

| Wave | Group | Task IDs (Task ID 순으로 한 개씩 실행) | Preview Checkpoint |
|---|---|---|---|
| W01 | 2. Airbnb 스타일 공통 UI, 정적 데이터, Layout | DATA-DESTINATIONS, SHARED-DESIGN-TOKENS, SHARED-FAVORITES, SHARED-TOAST | 아니오 |
| W02 | 2. Airbnb 스타일 공통 UI, 정적 데이터, Layout | DATA-REPRESENTATIVE, DATA-SAFETY, SHARED-LAYOUT, COMP-LEGAL-DOCS | 아니오 |
| W03 | 2. Airbnb 스타일 공통 UI, 정적 데이터, Layout | SHARED-ERROR-PAGES | 아니오 |
| W04 | 3. Supabase Auth, 6개 Table, 기본 RLS | DB-SCHEMA-BASE | 아니오 |
| W05 | 3. Supabase Auth, 6개 Table, 기본 RLS | DB-RLS-BASE, SHARED-AUTH-SETUP | 아니오 |
| W06 | 3. Supabase Auth, 6개 Table, 기본 RLS | DB-ACCESS, DB-SEED-BASE | 아니오 |
| W07 | 3. Supabase Auth, 6개 Table, 기본 RLS | TEST-RLS-BASIC | 아니오 |
| W08 | 4. SCR-001 메인 Component와 Page Owner | COMP-SCR001-ABOUT-BANNER, COMP-SCR001-DOMESTIC-GRID, COMP-SCR001-HERO-SEARCH, COMP-SCR001-MATE-PREVIEW, COMP-SCR001-OVERSEAS-GRID, COMP-SCR001-SAFETY-DRAWER, COMP-SCR001-THEME-CHIPS | 아니오 |
| W09 | 4. SCR-001 메인 Component와 Page Owner | COMP-SCR001-COUNTRY-NOTICE, COMP-SCR001-DEST-DRAWER | 아니오 |
| W10 | 4. SCR-001 메인 Component와 Page Owner | PAGE-SCR001 | 예 |
| W11 | 5. SCR-002 대표 소개 Component와 Page Owner | COMP-SCR002-COUNTRIES, COMP-SCR002-GALLERY, COMP-SCR002-HERO, COMP-SCR002-RECOMMEND-CTA, COMP-SCR002-STATS, COMP-SCR002-STORY, COMP-SCR002-TIMELINE | 아니오 |
| W12 | 5. SCR-002 대표 소개 Component와 Page Owner | PAGE-SCR002 | 예 |
| W13 | 6. SCR-003 여행 입력·외부 이동·동행글 입력 Component와 Page Owner | COMP-SCR003-INTRO-TABS | 아니오 |
| W14 | 6. SCR-003 여행 입력·외부 이동·동행글 입력 Component와 Page Owner | COMP-SCR003-FLIGHT, COMP-SCR003-HOTEL, COMP-SCR003-MATE-WRITE | 아니오 |
| W15 | 6. SCR-003 여행 입력·외부 이동·동행글 입력 Component와 Page Owner | PAGE-SCR003 | 예 |
| W16 | 7. SCR-004 동행 목록·상세·신청 Component와 Page Owner | COMP-SCR004-BLOCK, COMP-SCR004-FILTER, COMP-SCR004-REPORT, COMP-SCR004-SAFETY-GUIDE | 아니오 |
| W17 | 7. SCR-004 동행 목록·상세·신청 Component와 Page Owner | COMP-SCR004-LIST | 아니오 |
| W18 | 7. SCR-004 동행 목록·상세·신청 Component와 Page Owner | COMP-SCR004-DETAIL | 아니오 |
| W19 | 7. SCR-004 동행 목록·상세·신청 Component와 Page Owner | COMP-SCR004-APPLY | 아니오 |
| W20 | 7. SCR-004 동행 목록·상세·신청 Component와 Page Owner | PAGE-SCR004 | 예 |
| W21 | 8. SCR-005 계정·내 활동·간단 관리자 Component와 Page Owner | COMP-SCR005-ADMIN, COMP-SCR005-AUTH, COMP-SCR005-MY-ACTIVITY, COMP-SCR005-PROFILE | 아니오 |
| W22 | 8. SCR-005 계정·내 활동·간단 관리자 Component와 Page Owner | PAGE-SCR005 | 예 |
| W23 | 9. Unit·Playwright·접근성·CI | E2E-MATE-AUTH, E2E-PUBLIC-SMOKE, E2E-TRAVEL-TOOLS, MANUAL-A11Y-CHECK, MANUAL-RESPONSIVE-CHECK, UNIT-CONTACT-DETECTION, UNIT-MATE-STATE | 아니오 |
| W24 | 9. Unit·Playwright·접근성·CI | UNIT-TRAVEL-DATES | 아니오 |
| W25 | 9. Unit·Playwright·접근성·CI | CI-PIPELINE-BASE | 아니오 |
| W26 | 10. Vercel Preview와 Release 확인 | DEPLOY-ENV-CHECK | 예 |
| W27 | 10. Vercel Preview와 Release 확인 | RELEASE-ACCEPTANCE-CHECK | 예 |
