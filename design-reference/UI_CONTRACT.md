# UI Contract — Traveler (Next.js App Router)

| 항목 | 내용 |
|---|---|
| 기준 문서 | `docs/03_UI_COVERAGE_ANALYSIS.md`, `docs/04_UIUX_PLAN.md`, `docs/STITCH_VALIDATION_REPORT.md`, `design-reference/D-001/DESIGN.md` |
| 현재 `src/app` 구조 | `layout.tsx`, `page.tsx`(기본 create-next-app 스캐폴드만 존재, 아래 계약으로 전면 교체 대상) |
| 목적 | 승인된 5개 Screen(SCR-001~005)을 실제 라우트·페이지 엔트리·구현 계약으로 확정 |

이 문서는 화면 구현 시 반드시 지켜야 하는 계약이며, `design-reference/SCREEN_ROUTE_CONTRACT.json`과 1:1로 대응한다. 구조·상태·이동·금지 사항은 `04_UIUX_PLAN.md` §6~7, `03_UI_COVERAGE_ANALYSIS.md` §3, `STITCH_VALIDATION_REPORT.md`의 승인 결과를 근거로 한다.

---

## SCR-001 — 메인 (보조/허브)

| 항목 | 내용 |
|---|---|
| Route | `/` |
| Page Entry | `src/app/page.tsx` |
| 영역 순서 | 1. 검색 Hero → 2. 국내 인기 여행지(Card Grid 6) → 3. 해외 인기 여행지(Card Grid 6) → 4. 여행 테마(Chip 6) → 5. 국가별 주의사항(Card Grid 6) → 6. 동행 미리보기(좌우분할+카드 3) → 7. 대표 소개 배너(CTA) |
| 주요 Component | 검색창, 여행지 Card(국내/해외), 테마 Chip, 국가 주의사항 Card, 동행 미리보기 카드, 여행지 상세 Drawer, 국가 안전정보 Drawer(같은 스택에서 이어 열림), 대표 소개 CTA Banner |
| 상태 | Loading(Section 2/3/5 카드 스켈레톤) · Success(기본) · Empty(Section 6: 안내+3단계 요약+CTA) · Error(Section 2/3/5: 재시도 버튼) |
| 사용자 행동 | 키워드/필터로 여행지 검색(REQ-FUNC-002~003) · 카드 클릭해 여행지 상세 Drawer 열기(REQ-FUNC-004) · 해외 상세에서 "국가 안전정보 보기"로 안전정보 Drawer 이어 열기(REQ-FUNC-006, 047~054) · 테마 Chip으로 목록 좁히기 · 빈 결과 시 초기화(REQ-FUNC-005) · 즐겨찾기 토글(REQ-FUNC-068) |
| 다른 화면으로의 이동 | → SCR-002(대표 소개 배너 CTA) · → SCR-003(Hero CTA, 동행 미리보기 Empty CTA) · → SCR-004(동행 미리보기 "동행 전체 보기") · → SCR-005(Header 계정 아이콘, 비로그인) |
| Desktop·Mobile 규칙 | Desktop 1440: Hero 최대 높이 520px(다음 Section 상단이 스크롤 없이 보여야 함), Card Grid 3열. Mobile 390: Card 1열, Drawer는 하단 시트(92%), Header 내비게이션은 햄버거로 축소 |
| 금지 기능 | 관련 여행지 자동 추천(REQ-FUNC-009, EXCLUDED) · 필터 상태 URL query 반영(REQ-FUNC-010, EXCLUDED) · Airbnb 상표·예약/결제 UI · 광고·별점·실시간 가격 · Lorem ipsum/준비 중 |

---

## SCR-002 — 대표 소개 (핵심)

| 항목 | 내용 |
|---|---|
| Route | `/about` |
| Page Entry | `src/app/about/page.tsx` |
| 영역 순서 | 1. Hero → 2. 여행 지표(통계 카드 3) → 3. 소개·철학(좌우분할, 문단 4) → 4. 여행 타임라인(6) → 5. 방문 국가(4권역/30개국 Chip) → 6. 사진 갤러리(8) → 7. 추천 여행지 배너(카드 4+CTA 2) |
| 주요 Component | Hero 이미지, 통계 카드, 좌측 목차+우측 문단 블록, Timeline 컴포넌트, 권역 그룹 헤더+국가 Chip, Gallery 그리드, 추천 여행지 Card+CTA Banner |
| 상태 | 정적 콘텐츠 위주로 Loading/Empty 없음. Error(이미지 로드 실패 시 플레이스홀더 대체만 정의) |
| 사용자 행동 | 방문 국가/타임라인 열람 · 추천 여행지 카드 클릭 → SCR-001 상세 Drawer 오픈(REQ-FUNC-063) · "여행 준비 시작하기"/"동행 찾아보기" CTA 클릭 |
| 다른 화면으로의 이동 | → SCR-001(추천 여행지 카드 → 상세 Drawer) · → SCR-003(하단 CTA Banner) · → SCR-004(하단 CTA Banner) |
| Desktop·Mobile 규칙 | Desktop: 소개·철학 좌우분할 40/60류 비율 유지, Gallery 4열. Mobile: 모든 좌우분할 세로 스택, Gallery 2열 이하, Timeline 세로 유지 |
| 금지 기능 | 대표 이미지 출처·작가·라이선스 메타데이터 관리 UI(REQ-FUNC-061, EXCLUDED) · Airbnb 상표·예약/결제 UI · 광고·별점 · Lorem ipsum/준비 중. 추천 카드 개수(4)와 SRS REQ-FUNC-063(6) 차이는 `04_UIUX_PLAN.md`에 이미 기재된 기지 사항이며 임의로 6개로 확장하지 않는다(콘텐츠 확정 시 별도 결정) |

---

## SCR-003 — 여행 준비 (핵심)

| 항목 | 내용 |
|---|---|
| Route | `/travel-tools` |
| Page Entry | `src/app/travel-tools/page.tsx` |
| 영역 순서 | 1. Intro(축소형 Hero) → 2. 탭[항공편][숙소][동행 구하기] → 3. 조건 입력 Form → 4. 요약과 이동(CTA Banner) → 5. 고지와 팁(3단계) → 6. 동행 구하기 탭 콘텐츠(좌우분할) |
| 주요 Component | 3탭 컨트롤러(항공/숙소/동행구하기, 독립 상태 유지), 국가·지역·날짜 Form, 인라인 오류 메시지, 요약 Card+외부 이동 버튼, 3단계 팁 카드, 동행 작성 Form(제목/국가/지역/기간/모집인원/스타일/설명/안전수칙 동의) 또는 미인증 안내 카드 |
| 상태 | Loading(국가/지역 옵션) · Success(요약 표시/모집글 등록 완료) · Error(검증 실패, 외부 URL 연결 실패) · Unauthorized(동행 탭 미인증 시 안내 카드로 대체) |
| 사용자 행동 | 항공/숙소 조건 입력 후 검증(REQ-FUNC-011~013, 019~021) · 요약 확인 후 "항공편/호텔 보러가기"로 외부 이동, 새 탭+`noopener,noreferrer`(REQ-FUNC-016, 024) · 동행 탭에서 로그인·성인인증 완료 시 모집글 작성(REQ-FUNC-031), 연락처 패턴 자동 탐지·차단(REQ-FUNC-032) · 안전수칙 동의 체크(REQ-FUNC-080) |
| 다른 화면으로의 이동 | → 외부 사이트(항공·숙소 "보러가기", 새 탭) · → SCR-005(동행 탭 미인증 안내 CTA) · → SCR-004(동행글 작성 완료 후 이동) |
| Desktop·Mobile 규칙 | Desktop: 조건 입력 Form을 좌우 분할(폼+안내)로 배치. Mobile: 세로 스택, 하단 고정 탭바(홈/여행도구/동행찾기/내정보) 노출 |
| 금지 기능 | 입력값 서버 저장(REQ-FUNC-017/025, "서버 API 자체를 만들지 않음") · 내부 예약/결제 UI(항공·숙소는 외부 링크 이동만) · Airbnb 상표 요소 · 광고·별점·실시간 항공권/호텔 가격 표시 · Lorem ipsum/준비 중. 하나의 참고 화면에서 Error/Success 두 상태를 동시에 보여줄 경우 반드시 "상태 시연용" 주석/라벨로 구분한다(`STITCH_VALIDATION_REPORT.md` 확인 사항) |

---

## SCR-004 — 동행 찾기 (핵심)

| 항목 | 내용 |
|---|---|
| Route | `/mates` |
| Page Entry | `src/app/mates/page.tsx` |
| 영역 순서 | 1. Intro(축소형 Hero) → 2. 검색 Filter(좌우분할) → 3. 목록(Card Grid, 최대 8개 우선 노출) → 4. 상세 패널(Desktop 좌40/우60, Mobile Drawer) → 5. 이용 방법(3단계) → 6. 안전 안내 배너(CTA) |
| 주요 Component | 국가/기간/모집상태 필터+여행스타일 Chip, 결과 요약("총 N건"), 모집글 목록 Card(제목/국가/기간/인원/스타일 Chip/상태 배지), 상세 패널(설명, 참가 요청 폼, 승인/거절 목록, 마감/수정/삭제, 신고·차단 버튼), 3단계 안내, 안전 안내 CTA Banner |
| 상태 | Loading(목록 스켈레톤) · Success(기본) · Empty(조건 초기화+작성 CTA+이용방법 축약) · Error(참가 요청/신고 제출 실패) · Unauthorized(참가 요청/신고/차단 시도 시 로그인·성인인증 안내) |
| 사용자 행동 | 조건 필터링(REQ-FUNC-030) · 목록에서 카드 클릭→상세 패널 갱신 · 참가 메시지 제출(REQ-FUNC-034), 중복 요청 차단(REQ-FUNC-035) · 작성자의 승인/거절(REQ-FUNC-036), 마감/수정/삭제(REQ-FUNC-038) · 신고(REQ-FUNC-039)·차단(REQ-FUNC-040) |
| 다른 화면으로의 이동 | → SCR-003(Intro/안전 안내 배너 CTA, "여행 조건 먼저 정리하기"/새 동행글 작성) · → SCR-005(Unauthorized 안내 CTA) |
| Desktop·Mobile 규칙 | Desktop 1440: 목록(좌 40%)과 상세 패널(우 60%)을 항상 함께 표시, 카드 클릭 시 우측만 갱신. Mobile 390: 목록이 전체 폭, 카드 탭 시 하단에서 올라오는 전체화면 Drawer로 상세, "닫기"로 목록 복귀 |
| 금지 기능 | 연락처 노출(REQ-FUNC-033, 응답 데이터에서 항상 제외) · 경고/숨김/계정 제한 등 제재 조치 UI(REQ-FUNC-042, EXCLUDED — 관리자는 SCR-005에서 신고 상태 변경만 수행) · Airbnb 상표·예약/결제 UI · 별점·광고 · Lorem ipsum/준비 중 |

---

## SCR-005 — 계정 (핵심)

| 항목 | 내용 |
|---|---|
| Route | `/account` |
| Page Entry | `src/app/account/page.tsx` |
| 영역 순서 | **Guest**(탭 없음): 계정 기능 Intro → 로그인·가입·재설정 Card → 로그인 후 가능한 기능(Chip) → 보안 안내. **Member**(탭 2개): [프로필](프로필·성인확인 요약) [내 활동](내 글/참가 요청/차단 목록). **Admin**(+탭 1개): [관리자](관리 Intro, 신고 상태 변경, 외부 URL 설정) |
| 주요 Component | 이메일 로그인/가입/재설정 세그먼트 폼, 프로필 카드+수정 폼(닉네임/스타일 Chip/자기소개), 내 글·참가요청·차단목록 리스트(Empty 상태 포함), 관리자 신고 목록+상태 select, 외부 URL 설정 폼(HTTPS 검증) |
| 상태 | Loading(프로필/내 활동 스켈레톤) · Success(기본) · Empty(내 글/참가 요청/차단 목록: 설명+다음 행동 CTA) · Error(로그인 실패, URL 저장 실패) · Unauthorized(권한 없는 탭 직접 접근 시 "권한이 없습니다"+프로필 탭 이동) |
| 사용자 행동 | 이메일 가입/로그인/로그아웃/재설정(REQ-FUNC-066) · 성인 확인(REQ-FUNC-028) · 프로필 수정(REQ-FUNC-029) · 내 글/참가요청 열람 및 관리 · 차단 해제 · (Admin) 신고 상태 변경(REQ-FUNC-041), 외부 URL 허용목록 설정(REQ-FUNC-077) |
| 다른 화면으로의 이동 | → SCR-004(내 글/참가 요청 항목 클릭) · → SCR-003(새 동행글 작성 CTA) |
| Desktop·Mobile 규칙 | Desktop: 탭 underline 스타일 상단 고정. Mobile: 상단 탭 유지하되 하단 고정 탭바(홈/여행도구/동행찾기/내정보)와 별도로 공존. 역할에 없는 탭(예: 일반 회원의 관리자 탭)은 렌더링 자체를 하지 않는다 |
| 금지 기능 | 경고·숨김·계정 제한 등 제재 조치(REQ-FUNC-042, EXCLUDED) · 콘텐츠 CRUD/미리보기(REQ-FUNC-072, EXCLUDED) · 감사 로그 UI(REQ-FUNC-076, EXCLUDED) · 복잡한 분석/KPI 대시보드(`D-001/DESIGN.md` §21) — 관리자 화면은 신고 상태 변경과 외부 URL 설정 두 가지 단순 목록/폼만 유지 · Airbnb 상표·예약/결제 UI · Lorem ipsum/준비 중. **현재 승인된 Stitch 내보내기에는 Guest·Admin 화면이 없음(`STITCH_VALIDATION_REPORT.md` NEEDS_REVISION) — 구현 시 이 계약(§SCR-005)을 기준으로 신규 작성해야 한다** |

---

## 공통 규칙 (5개 화면 전체)

- Header/Footer는 `design-reference/D-001/DESIGN.md` §7을 그대로 따른다.
- 모든 인터랙티브 요소는 44×44px 이상 터치 영역을 갖는다.
- Empty 상태는 설명+이용 방법+다음 행동 CTA 3요소를 항상 포함한다(D-001 §14, §20).
- 금지: Airbnb 상표 요소, 구매·예약·결제 UI, Proprietary Font 파일, 디자인 토큰 외 임의 색상, 광고, 별점, 실시간 항공권/호텔 가격, Lorem ipsum/"준비 중"/"정보 확인 필요"/빈 Card.
