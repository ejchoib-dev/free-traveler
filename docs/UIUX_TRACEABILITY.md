# UI/UX Traceability Matrix — Free Traveler

| 항목 | 내용 |
|---|---|
| Document ID | UIUX-TRACE-TRAVEL-001 |
| 근거 문서 | `docs/02_SRS_BASELINE.md`, `docs/PROJECT_SCOPE.md`, `docs/03_UI_COVERAGE_ANALYSIS.md`, `design-reference/SCREEN_ROUTE_CONTRACT.json` |
| Requirement 개수 | REQ-FUNC-001~080 (80) + REQ-NF-001~034 (34) = 114, 삭제 없음 |
| 열 정의 | Requirement, Implementation Status, Screen, Route, Page Entry, Task, Test, Status |

**열 규칙(사실 고지)**
- `Implementation Status`: `PROJECT_SCOPE.md`의 IMPLEMENT/EXCLUDED를 그대로 인용한다. 이 문서에서 상태를 바꾸지 않는다.
- `Task`: 아직 Task가 생성되지 않았으므로 IMPLEMENT 항목은 전부 `PENDING_TASK_GENERATION`, EXCLUDED 항목은 `NOT_APPLICABLE`이다.
- `Test`: `02_SRS_BASELINE.md` §5의 "요구사항과 테스트 케이스 접미사 1:1 대응" 규칙에 따라 지정된 **계획된** Test Case ID이며, 실행·통과 여부를 의미하지 않는다. EXCLUDED 항목은 `NOT_APPLICABLE`이다.
- `Status`: 현재 `src/app`에는 스캐폴드만 존재하므로 IMPLEMENT 항목은 전부 `NOT_STARTED`, EXCLUDED 항목은 `EXCLUDED`다. **구현 완료로 기록된 행은 없다.**

---

## F1. Destination Guide

| Requirement | Implementation Status | Screen | Route | Page Entry | Task | Test | Status |
|---|---|---|---|---|---|---|---|
| REQ-FUNC-001 국내·해외 목록 구분 | IMPLEMENT | SCR-001 | `/` | `src/app/page.tsx` | PENDING_TASK_GENERATION | TC-FUNC-001 | NOT_STARTED |
| REQ-FUNC-002 국가·도시·계절·테마·기간 필터 | IMPLEMENT | SCR-001 | `/` | `src/app/page.tsx` | PENDING_TASK_GENERATION | TC-FUNC-002 | NOT_STARTED |
| REQ-FUNC-003 키워드 검색 | IMPLEMENT | SCR-001 | `/` | `src/app/page.tsx` | PENDING_TASK_GENERATION | TC-FUNC-003 | NOT_STARTED |
| REQ-FUNC-004 상세 필수 콘텐츠 항목 표시 | IMPLEMENT | SCR-001 (여행지 상세 Drawer/Modal) | `/` | `src/app/page.tsx` | PENDING_TASK_GENERATION | TC-FUNC-004 | NOT_STARTED |
| REQ-FUNC-005 빈 결과 안내·초기화 | IMPLEMENT | SCR-001 | `/` | `src/app/page.tsx` | PENDING_TASK_GENERATION | TC-FUNC-005 | NOT_STARTED |
| REQ-FUNC-006 해외 상세→안전정보 연결 | IMPLEMENT | SCR-001 (Drawer 간 이동) | `/` | `src/app/page.tsx` | PENDING_TASK_GENERATION | TC-FUNC-006 | NOT_STARTED |
| REQ-FUNC-007 이미지 대체텍스트·출처·작가·라이선스 | EXCLUDED | SCR-001 (Drawer) | `/` | `src/app/page.tsx` | NOT_APPLICABLE | NOT_APPLICABLE | EXCLUDED |
| REQ-FUNC-008 게시 수량 기준 검증 | IMPLEMENT | 해당없음(콘텐츠 작성 시점 점검) | N/A | N/A | PENDING_TASK_GENERATION | TC-FUNC-008 | NOT_STARTED |
| REQ-FUNC-009 관련 여행지 최대 6개 추천 | EXCLUDED | SCR-001 (Drawer) | `/` | `src/app/page.tsx` | NOT_APPLICABLE | NOT_APPLICABLE | EXCLUDED |
| REQ-FUNC-010 필터 상태 URL query 반영 | EXCLUDED | SCR-001 | `/` | `src/app/page.tsx` | NOT_APPLICABLE | NOT_APPLICABLE | EXCLUDED |

## F2. Flight Link-out

| Requirement | Implementation Status | Screen | Route | Page Entry | Task | Test | Status |
|---|---|---|---|---|---|---|---|
| REQ-FUNC-011 국가·지역·출발일·귀국일 필수 입력 | IMPLEMENT | SCR-003 (항공편 탭) | `/travel-tools` | `src/app/travel-tools/page.tsx` | PENDING_TASK_GENERATION | TC-FUNC-011 | NOT_STARTED |
| REQ-FUNC-012 국가별 유효 지역만 선택 | IMPLEMENT | SCR-003 (항공편 탭) | `/travel-tools` | `src/app/travel-tools/page.tsx` | PENDING_TASK_GENERATION | TC-FUNC-012 | NOT_STARTED |
| REQ-FUNC-013 과거·역전 날짜 차단 | IMPLEMENT | SCR-003 (항공편 탭) | `/travel-tools` | `src/app/travel-tools/page.tsx` | PENDING_TASK_GENERATION | TC-FUNC-013 | NOT_STARTED |
| REQ-FUNC-014 입력 요약 표시 | IMPLEMENT | SCR-003 (항공편 탭) | `/travel-tools` | `src/app/travel-tools/page.tsx` | PENDING_TASK_GENERATION | TC-FUNC-014 | NOT_STARTED |
| REQ-FUNC-015 입력값 비전달 고지 | IMPLEMENT | SCR-003 (항공편 탭) | `/travel-tools` | `src/app/travel-tools/page.tsx` | PENDING_TASK_GENERATION | TC-FUNC-015 | NOT_STARTED |
| REQ-FUNC-016 외부 URL 새 탭 + noopener,noreferrer | IMPLEMENT | SCR-003 (항공편 탭) | `/travel-tools` | `src/app/travel-tools/page.tsx` | PENDING_TASK_GENERATION | TC-FUNC-016 | NOT_STARTED |
| REQ-FUNC-017 입력값 서버 미저장 | IMPLEMENT | SCR-003 (비가시 속성) | `/travel-tools` | `src/app/travel-tools/page.tsx` | PENDING_TASK_GENERATION | TC-FUNC-017 | NOT_STARTED |
| REQ-FUNC-018 외부 URL 오류 시 차단·재시도 | IMPLEMENT | SCR-003 (항공편 탭) | `/travel-tools` | `src/app/travel-tools/page.tsx` | PENDING_TASK_GENERATION | TC-FUNC-018 | NOT_STARTED |

## F3. Hotel Link-out

| Requirement | Implementation Status | Screen | Route | Page Entry | Task | Test | Status |
|---|---|---|---|---|---|---|---|
| REQ-FUNC-019 국가·지역·체크인·체크아웃 필수 입력 | IMPLEMENT | SCR-003 (숙소 탭) | `/travel-tools` | `src/app/travel-tools/page.tsx` | PENDING_TASK_GENERATION | TC-FUNC-019 | NOT_STARTED |
| REQ-FUNC-020 국가별 유효 지역만 선택 | IMPLEMENT | SCR-003 (숙소 탭) | `/travel-tools` | `src/app/travel-tools/page.tsx` | PENDING_TASK_GENERATION | TC-FUNC-020 | NOT_STARTED |
| REQ-FUNC-021 과거·역전/동일 날짜 차단 | IMPLEMENT | SCR-003 (숙소 탭) | `/travel-tools` | `src/app/travel-tools/page.tsx` | PENDING_TASK_GENERATION | TC-FUNC-021 | NOT_STARTED |
| REQ-FUNC-022 입력 요약 표시 | IMPLEMENT | SCR-003 (숙소 탭) | `/travel-tools` | `src/app/travel-tools/page.tsx` | PENDING_TASK_GENERATION | TC-FUNC-022 | NOT_STARTED |
| REQ-FUNC-023 입력값 비전달 고지 | IMPLEMENT | SCR-003 (숙소 탭) | `/travel-tools` | `src/app/travel-tools/page.tsx` | PENDING_TASK_GENERATION | TC-FUNC-023 | NOT_STARTED |
| REQ-FUNC-024 외부 URL 새 탭 + noopener,noreferrer | IMPLEMENT | SCR-003 (숙소 탭) | `/travel-tools` | `src/app/travel-tools/page.tsx` | PENDING_TASK_GENERATION | TC-FUNC-024 | NOT_STARTED |
| REQ-FUNC-025 입력값 서버 미저장 | IMPLEMENT | SCR-003 (비가시 속성) | `/travel-tools` | `src/app/travel-tools/page.tsx` | PENDING_TASK_GENERATION | TC-FUNC-025 | NOT_STARTED |
| REQ-FUNC-026 외부 URL 오류 시 차단·재시도 | IMPLEMENT | SCR-003 (숙소 탭) | `/travel-tools` | `src/app/travel-tools/page.tsx` | PENDING_TASK_GENERATION | TC-FUNC-026 | NOT_STARTED |

## F4. Travel Mate

| Requirement | Implementation Status | Screen | Route | Page Entry | Task | Test | Status |
|---|---|---|---|---|---|---|---|
| REQ-FUNC-027 동행 쓰기에 인증 세션 요구 | IMPLEMENT | SCR-005 (게이트 발생 시 리다이렉트) | `/account` | `src/app/account/page.tsx` | PENDING_TASK_GENERATION | TC-FUNC-027 | NOT_STARTED |
| REQ-FUNC-028 성인 확인 상태 요구 | IMPLEMENT | SCR-005 (성인확인) | `/account` | `src/app/account/page.tsx` | PENDING_TASK_GENERATION | TC-FUNC-028 | NOT_STARTED |
| REQ-FUNC-029 동행 프로필 필드 | IMPLEMENT | SCR-005 (프로필 탭) | `/account` | `src/app/account/page.tsx` | PENDING_TASK_GENERATION | TC-FUNC-029 | NOT_STARTED |
| REQ-FUNC-030 조건·차단 반영 필터 | IMPLEMENT | SCR-004 | `/mates` | `src/app/mates/page.tsx` | PENDING_TASK_GENERATION | TC-FUNC-030 | NOT_STARTED |
| REQ-FUNC-031 모집글 작성 필드·검증 | IMPLEMENT | SCR-003 (동행 구하기 탭) | `/travel-tools` | `src/app/travel-tools/page.tsx` | PENDING_TASK_GENERATION | TC-FUNC-031 | NOT_STARTED |
| REQ-FUNC-032 공개 연락처 패턴 탐지·차단 | IMPLEMENT | SCR-003 (동행 구하기 탭) | `/travel-tools` | `src/app/travel-tools/page.tsx` | PENDING_TASK_GENERATION | TC-FUNC-032 | NOT_STARTED |
| REQ-FUNC-033 연락처 비노출 | IMPLEMENT | SCR-004 | `/mates` | `src/app/mates/page.tsx` | PENDING_TASK_GENERATION | TC-FUNC-033 | NOT_STARTED |
| REQ-FUNC-034 참가 메시지 제출(비공개) | IMPLEMENT | SCR-004 (상세 패널) | `/mates` | `src/app/mates/page.tsx` | PENDING_TASK_GENERATION | TC-FUNC-034 | NOT_STARTED |
| REQ-FUNC-035 중복 요청 차단 | IMPLEMENT | SCR-004 (상세 패널) | `/mates` | `src/app/mates/page.tsx` | PENDING_TASK_GENERATION | TC-FUNC-035 | NOT_STARTED |
| REQ-FUNC-036 작성자의 승인·거절 | IMPLEMENT | SCR-004 (상세 패널) | `/mates` | `src/app/mates/page.tsx` | PENDING_TASK_GENERATION | TC-FUNC-036 | NOT_STARTED |
| REQ-FUNC-037 종료일 경과 시 자동 마감 | IMPLEMENT | SCR-004 | `/mates` | `src/app/mates/page.tsx` | PENDING_TASK_GENERATION | TC-FUNC-037 | NOT_STARTED |
| REQ-FUNC-038 작성자 수동 마감·수정·삭제 | IMPLEMENT | SCR-004 (상세 패널) | `/mates` | `src/app/mates/page.tsx` | PENDING_TASK_GENERATION | TC-FUNC-038 | NOT_STARTED |
| REQ-FUNC-039 글·사용자·요청 신고 | IMPLEMENT | SCR-004 | `/mates` | `src/app/mates/page.tsx` | PENDING_TASK_GENERATION | TC-FUNC-039 | NOT_STARTED |
| REQ-FUNC-040 사용자 차단·해제 | IMPLEMENT | SCR-004(시작) / SCR-005(관리) | `/mates` / `/account` | `src/app/mates/page.tsx` / `src/app/account/page.tsx` | PENDING_TASK_GENERATION | TC-FUNC-040 | NOT_STARTED |
| REQ-FUNC-041 신고 큐(상태 필터) | IMPLEMENT | SCR-005 (관리자 탭) | `/account` | `src/app/account/page.tsx` | PENDING_TASK_GENERATION | TC-FUNC-041 | NOT_STARTED |
| REQ-FUNC-042 경고·숨김·계정 제한 제재 조치 | EXCLUDED | 해당없음 | N/A | N/A | NOT_APPLICABLE | NOT_APPLICABLE | EXCLUDED |
| REQ-FUNC-043 요청 처리 결과 알림 | IMPLEMENT | 전역 (Toast) | (all routes) | `src/app/layout.tsx` | PENDING_TASK_GENERATION | TC-FUNC-043 | NOT_STARTED |
| REQ-FUNC-044 RLS 기반 비공개 데이터 접근 제어 | IMPLEMENT | 전역 (비가시) | (all routes) | `src/app/layout.tsx` | PENDING_TASK_GENERATION | TC-FUNC-044 | NOT_STARTED |
| REQ-FUNC-045 탈퇴 시 비식별화·30일 내 삭제 | EXCLUDED | 해당없음 | N/A | N/A | NOT_APPLICABLE | NOT_APPLICABLE | EXCLUDED |

## F5. Country Safety

| Requirement | Implementation Status | Screen | Route | Page Entry | Task | Test | Status |
|---|---|---|---|---|---|---|---|
| REQ-FUNC-046 해외 국가 전체 안전 페이지 확보 | IMPLEMENT | 해당없음(표시는 SCR-001) | N/A | N/A | PENDING_TASK_GENERATION | TC-FUNC-046 | NOT_STARTED |
| REQ-FUNC-047 8개 필수 카테고리 섹션 | IMPLEMENT | SCR-001 (Drawer/Modal) | `/` | `src/app/page.tsx` | PENDING_TASK_GENERATION | TC-FUNC-047 | NOT_STARTED |
| REQ-FUNC-048 출처명·URL·확인일·편집자 기록 | IMPLEMENT | SCR-001 | `/` | `src/app/page.tsx` | PENDING_TASK_GENERATION | TC-FUNC-048 | NOT_STARTED |
| REQ-FUNC-049 외교부 원문 링크(새 탭) | IMPLEMENT | SCR-001 | `/` | `src/app/page.tsx` | PENDING_TASK_GENERATION | TC-FUNC-049 | NOT_STARTED |
| REQ-FUNC-050 stale 경고(7일 초과) | IMPLEMENT | SCR-001 | `/` | `src/app/page.tsx` | PENDING_TASK_GENERATION | TC-FUNC-050 | NOT_STARTED |
| REQ-FUNC-051 중대 경보 상단 텍스트 표시 | IMPLEMENT | SCR-001 | `/` | `src/app/page.tsx` | PENDING_TASK_GENERATION | TC-FUNC-051 | NOT_STARTED |
| REQ-FUNC-052 국가 전체/지역 경보 범위 구분 | IMPLEMENT | SCR-001 | `/` | `src/app/page.tsx` | PENDING_TASK_GENERATION | TC-FUNC-052 | NOT_STARTED |
| REQ-FUNC-053 긴급연락처 표시 | IMPLEMENT | SCR-001 | `/` | `src/app/page.tsx` | PENDING_TASK_GENERATION | TC-FUNC-053 | NOT_STARTED |
| REQ-FUNC-054 공식 판단 대체 아님 고지 | IMPLEMENT | SCR-001 / SCR-003 | `/` / `/travel-tools` | `src/app/page.tsx` / `src/app/travel-tools/page.tsx` | PENDING_TASK_GENERATION | TC-FUNC-054 | NOT_STARTED |
| REQ-FUNC-055 Editor/Admin 작성·검수·게시 워크플로 | EXCLUDED | 해당없음 | N/A | N/A | NOT_APPLICABLE | NOT_APPLICABLE | EXCLUDED |
| REQ-FUNC-056 안전정보 변경 이력 보존 | EXCLUDED | 해당없음 | N/A | N/A | NOT_APPLICABLE | NOT_APPLICABLE | EXCLUDED |

## F6. About free_traveler

| Requirement | Implementation Status | Screen | Route | Page Entry | Task | Test | Status |
|---|---|---|---|---|---|---|---|
| REQ-FUNC-057 대표명·50+ Trips·30+ Countries 표시 | IMPLEMENT | SCR-002 | `/about` | `src/app/about/page.tsx` | PENDING_TASK_GENERATION | TC-FUNC-057 | NOT_STARTED |
| REQ-FUNC-058 소개문·철학·편집 원칙 표시 | IMPLEMENT | SCR-002 | `/about` | `src/app/about/page.tsx` | PENDING_TASK_GENERATION | TC-FUNC-058 | NOT_STARTED |
| REQ-FUNC-059 방문 권역/30개국 이상 목록 | IMPLEMENT | SCR-002 | `/about` | `src/app/about/page.tsx` | PENDING_TASK_GENERATION | TC-FUNC-059 | NOT_STARTED |
| REQ-FUNC-060 여행 타임라인 | IMPLEMENT | SCR-002 | `/about` | `src/app/about/page.tsx` | PENDING_TASK_GENERATION | TC-FUNC-060 | NOT_STARTED |
| REQ-FUNC-061 대표 이미지 대체텍스트·출처·작가·라이선스 | EXCLUDED | SCR-002 | `/about` | `src/app/about/page.tsx` | NOT_APPLICABLE | NOT_APPLICABLE | EXCLUDED |
| REQ-FUNC-062 문의·SNS 링크 | IMPLEMENT | SCR-002 | `/about` | `src/app/about/page.tsx` | PENDING_TASK_GENERATION | TC-FUNC-062 | NOT_STARTED |
| REQ-FUNC-063 추천 여행지 6곳 연결 | IMPLEMENT | SCR-002 → SCR-001 | `/about` → `/` | `src/app/about/page.tsx` → `src/app/page.tsx` | PENDING_TASK_GENERATION | TC-FUNC-063 | NOT_STARTED |

## F7. Common, Admin, Governance

| Requirement | Implementation Status | Screen | Route | Page Entry | Task | Test | Status |
|---|---|---|---|---|---|---|---|
| REQ-FUNC-064 전역 내비게이션·푸터 | IMPLEMENT | 전역 | (all routes) | `src/app/layout.tsx` | PENDING_TASK_GENERATION | TC-FUNC-064 | NOT_STARTED |
| REQ-FUNC-065 반응형 레이아웃(320px~) | IMPLEMENT | 전역 | (all routes) | `src/app/layout.tsx` | PENDING_TASK_GENERATION | TC-FUNC-065 | NOT_STARTED |
| REQ-FUNC-066 이메일 가입·인증·로그인·로그아웃·재설정 | IMPLEMENT | SCR-005 (로그인·가입) | `/account` | `src/app/account/page.tsx` | PENDING_TASK_GENERATION | TC-FUNC-066 | NOT_STARTED |
| REQ-FUNC-067 여행지·안전정보 통합 검색 | EXCLUDED | 해당없음 | N/A | N/A | NOT_APPLICABLE | NOT_APPLICABLE | EXCLUDED |
| REQ-FUNC-068 여행지 즐겨찾기 | IMPLEMENT | SCR-001(토글) / SCR-005(목록) | `/` / `/account` | `src/app/page.tsx` / `src/app/account/page.tsx` | PENDING_TASK_GENERATION | TC-FUNC-068 | NOT_STARTED |
| REQ-FUNC-069 공개 페이지 URL 공유 | EXCLUDED | 해당없음 | N/A | N/A | NOT_APPLICABLE | NOT_APPLICABLE | EXCLUDED |
| REQ-FUNC-070 페이지별 SEO 메타데이터 | IMPLEMENT | 전역 | (all routes) | `src/app/layout.tsx` | PENDING_TASK_GENERATION | TC-FUNC-070 | NOT_STARTED |
| REQ-FUNC-071 행동 분석 이벤트 기록 | EXCLUDED | 해당없음 | N/A | N/A | NOT_APPLICABLE | NOT_APPLICABLE | EXCLUDED |
| REQ-FUNC-072 Editor/Admin 콘텐츠 CRUD·미리보기 | EXCLUDED | 해당없음 | N/A | N/A | NOT_APPLICABLE | NOT_APPLICABLE | EXCLUDED |
| REQ-FUNC-073 미디어 업로드 출처·작가·라이선스 필수 입력 | EXCLUDED | 해당없음 | N/A | N/A | NOT_APPLICABLE | NOT_APPLICABLE | EXCLUDED |
| REQ-FUNC-074 게시 전 완전성 게이트 | EXCLUDED | 해당없음 | N/A | N/A | NOT_APPLICABLE | NOT_APPLICABLE | EXCLUDED |
| REQ-FUNC-075 안전정보 stale 대시보드 | EXCLUDED | 해당없음 | N/A | N/A | NOT_APPLICABLE | NOT_APPLICABLE | EXCLUDED |
| REQ-FUNC-076 관리자 변경·신고 처리 감사 로그 | EXCLUDED | 해당없음 | N/A | N/A | NOT_APPLICABLE | NOT_APPLICABLE | EXCLUDED |
| REQ-FUNC-077 Admin 외부 URL 허용목록 설정 | IMPLEMENT | SCR-005 (관리자 탭) | `/account` | `src/app/account/page.tsx` | PENDING_TASK_GENERATION | TC-FUNC-077 | NOT_STARTED |
| REQ-FUNC-078 404·500·권한없음·연결실패 복구 화면 | IMPLEMENT | 기술 Route | `*` | `src/app/not-found.tsx` / `src/app/error.tsx` | PENDING_TASK_GENERATION | TC-FUNC-078 | NOT_STARTED |
| REQ-FUNC-079 폼·모달·탭·알림 ARIA/HTML 의미 | IMPLEMENT | 전역 | (all routes) | `src/app/layout.tsx` | PENDING_TASK_GENERATION | TC-FUNC-079 | NOT_STARTED |
| REQ-FUNC-080 약관·정책·안전수칙 동의 기록 | IMPLEMENT | SCR-003(동의 체크박스) / 전역(정책 링크) | `/travel-tools` / (all routes) | `src/app/travel-tools/page.tsx` / `src/app/layout.tsx` | PENDING_TASK_GENERATION | TC-FUNC-080 | NOT_STARTED |

## NFR — Performance

| Requirement | Implementation Status | Screen | Route | Page Entry | Task | Test | Status |
|---|---|---|---|---|---|---|---|
| REQ-NF-001 LCP p75 ≤2.5s | IMPLEMENT | 전역 | (all routes) | `src/app/layout.tsx` | PENDING_TASK_GENERATION | TC-NF-001 | NOT_STARTED |
| REQ-NF-002 INP p75 ≤200ms | IMPLEMENT | 전역 | (all routes) | `src/app/layout.tsx` | PENDING_TASK_GENERATION | TC-NF-002 | NOT_STARTED |
| REQ-NF-003 CLS p75 ≤0.1 | IMPLEMENT | 전역 | (all routes) | `src/app/layout.tsx` | PENDING_TASK_GENERATION | TC-NF-003 | NOT_STARTED |
| REQ-NF-004 필터 응답 p95≤1s(동시 50명) | EXCLUDED | 해당없음 | N/A | N/A | NOT_APPLICABLE | NOT_APPLICABLE | EXCLUDED |
| REQ-NF-005 쓰기 API p95≤3s | IMPLEMENT | 전역 | (all routes) | `src/app/layout.tsx` | PENDING_TASK_GENERATION | TC-NF-005 | NOT_STARTED |
| REQ-NF-006 이미지 반응형·lazy load | IMPLEMENT | 전역 | (all routes) | `src/app/layout.tsx` | PENDING_TASK_GENERATION | TC-NF-006 | NOT_STARTED |
| REQ-NF-007 배포 전 Lighthouse≥85 CI 게이트 | EXCLUDED | 해당없음 | N/A | N/A | NOT_APPLICABLE | NOT_APPLICABLE | EXCLUDED |

## NFR — Reliability and Recovery

| Requirement | Implementation Status | Screen | Route | Page Entry | Task | Test | Status |
|---|---|---|---|---|---|---|---|
| REQ-NF-008 월간 가용성 ≥99.5% | EXCLUDED | 해당없음 | N/A | N/A | NOT_APPLICABLE | NOT_APPLICABLE | EXCLUDED |
| REQ-NF-009 내부 API 5xx ≤0.5% | EXCLUDED | 해당없음 | N/A | N/A | NOT_APPLICABLE | NOT_APPLICABLE | EXCLUDED |
| REQ-NF-010 DB 백업 RPO≤24h/RTO≤8h | EXCLUDED | 해당없음 | N/A | N/A | NOT_APPLICABLE | NOT_APPLICABLE | EXCLUDED |
| REQ-NF-011 주1회 링크 자동 점검·Admin 알림 | EXCLUDED | 해당없음 | N/A | N/A | NOT_APPLICABLE | NOT_APPLICABLE | EXCLUDED |

## NFR — Security and Privacy

| Requirement | Implementation Status | Screen | Route | Page Entry | Task | Test | Status |
|---|---|---|---|---|---|---|---|
| REQ-NF-012 TLS 1.2 이상 | IMPLEMENT | 전역 | (all routes) | `src/app/layout.tsx` | PENDING_TASK_GENERATION | TC-NF-012 | NOT_STARTED |
| REQ-NF-013 인증·역할·RLS 서버 검증 | IMPLEMENT | 전역 | (all routes) | `src/app/layout.tsx` | PENDING_TASK_GENERATION | TC-NF-013 | NOT_STARTED |
| REQ-NF-014 CSRF 방어·SameSite 쿠키 | IMPLEMENT | 전역 | (all routes) | `src/app/layout.tsx` | PENDING_TASK_GENERATION | TC-NF-014 | NOT_STARTED |
| REQ-NF-015 입력 검증·이스케이프, 저장 XSS 차단 | IMPLEMENT | 전역 | (all routes) | `src/app/layout.tsx` | PENDING_TASK_GENERATION | TC-NF-015 | NOT_STARTED |
| REQ-NF-016 비밀키 환경변수 관리 | IMPLEMENT | 전역 | (all routes) | `src/app/layout.tsx` | PENDING_TASK_GENERATION | TC-NF-016 | NOT_STARTED |
| REQ-NF-017 항공·호텔 원시 입력값 미보존 | IMPLEMENT | SCR-003 (비가시) | `/travel-tools` | `src/app/travel-tools/page.tsx` | PENDING_TASK_GENERATION | TC-NF-017 | NOT_STARTED |
| REQ-NF-018 개인정보 내보내기·탈퇴·삭제 요청 | EXCLUDED | 해당없음 | N/A | N/A | NOT_APPLICABLE | NOT_APPLICABLE | EXCLUDED |

## NFR — Safety and Moderation

| Requirement | Implementation Status | Screen | Route | Page Entry | Task | Test | Status |
|---|---|---|---|---|---|---|---|
| REQ-NF-019 신고 접수 응답 p95≤3s | IMPLEMENT | SCR-004 (비가시) | `/mates` | `src/app/mates/page.tsx` | PENDING_TASK_GENERATION | TC-NF-019 | NOT_STARTED |
| REQ-NF-020 신고 1차 검토 24h 이내 90% | EXCLUDED | 해당없음 | N/A | N/A | NOT_APPLICABLE | NOT_APPLICABLE | EXCLUDED |
| REQ-NF-021 글·요청·신고 속도 제한(429) | EXCLUDED | 전역(비가시) | (all routes) | `src/app/layout.tsx` | NOT_APPLICABLE | NOT_APPLICABLE | EXCLUDED |
| REQ-NF-022 Moderator 조치 추적 가능성 | EXCLUDED | 해당없음 | N/A | N/A | NOT_APPLICABLE | NOT_APPLICABLE | EXCLUDED |

## NFR — Accessibility

| Requirement | Implementation Status | Screen | Route | Page Entry | Task | Test | Status |
|---|---|---|---|---|---|---|---|
| REQ-NF-023 WCAG 2.2 Level AA 목표 | IMPLEMENT | 전역 | (all routes) | `src/app/layout.tsx` | PENDING_TASK_GENERATION | TC-NF-023 | NOT_STARTED |
| REQ-NF-024 자동 접근성 검사(axe) | EXCLUDED | 해당없음 | N/A | N/A | NOT_APPLICABLE | NOT_APPLICABLE | EXCLUDED |
| REQ-NF-025 키보드·스크린리더 수동 검사 | IMPLEMENT | 해당없음 | N/A | N/A | PENDING_TASK_GENERATION | TC-NF-025 | NOT_STARTED |

## NFR — Content, Freshness, SEO, Copyright

| Requirement | Implementation Status | Screen | Route | Page Entry | Task | Test | Status |
|---|---|---|---|---|---|---|---|
| REQ-NF-026 여행지 콘텐츠 완전성 100% | IMPLEMENT | 해당없음(표시는 SCR-001) | N/A | N/A | PENDING_TASK_GENERATION | TC-NF-026 | NOT_STARTED |
| REQ-NF-027 해외 안전정보 커버리지 100% | IMPLEMENT | 해당없음(표시는 SCR-001) | N/A | N/A | PENDING_TASK_GENERATION | TC-NF-027 | NOT_STARTED |
| REQ-NF-028 안전정보 7일 이내 확인/경고 100% | IMPLEMENT | 해당없음(경고표시는 SCR-001) | N/A | N/A | PENDING_TASK_GENERATION | TC-NF-028 | NOT_STARTED |
| REQ-NF-029 미디어 라이선스 메타데이터 100% | EXCLUDED | 해당없음 | N/A | N/A | NOT_APPLICABLE | NOT_APPLICABLE | EXCLUDED |
| REQ-NF-030 공개 페이지 SEO 메타데이터 누락 0건 | IMPLEMENT | 전역 | (all routes) | `src/app/layout.tsx` | PENDING_TASK_GENERATION | TC-NF-030 | NOT_STARTED |

## NFR — Maintainability, Monitoring, Cost

| Requirement | Implementation Status | Screen | Route | Page Entry | Task | Test | Status |
|---|---|---|---|---|---|---|---|
| REQ-NF-031 TypeScript strict·lint·unit test | IMPLEMENT | 해당없음 | N/A | N/A | PENDING_TASK_GENERATION | TC-NF-031 | NOT_STARTED |
| REQ-NF-032 구조화 로그 | EXCLUDED | 해당없음 | N/A | N/A | NOT_APPLICABLE | NOT_APPLICABLE | EXCLUDED |
| REQ-NF-033 핵심 오류 5분 이내 알림 | EXCLUDED | 해당없음 | N/A | N/A | NOT_APPLICABLE | NOT_APPLICABLE | EXCLUDED |
| REQ-NF-034 MVP 월 인프라 비용 ≤10만원 | IMPLEMENT | 해당없음 | N/A | N/A | PENDING_TASK_GENERATION | TC-NF-034 | NOT_STARTED |

---

## 집계 (검증용)

| 구분 | 개수 |
|---|---:|
| 전체 Requirement | 114 |
| Implementation Status = IMPLEMENT | 84 (FUNC 64 + NF 20) |
| Implementation Status = EXCLUDED | 30 (FUNC 16 + NF 14) |
| Task = PENDING_TASK_GENERATION | 84 |
| Task = NOT_APPLICABLE | 30 |
| Status = NOT_STARTED | 84 |
| Status = EXCLUDED | 30 |
| Status = DONE | **0** (현재 구현된 화면 없음) |

이 집계는 `docs/PROJECT_SCOPE.md` §6.2·§6.3의 84/30 분포와 일치한다.
