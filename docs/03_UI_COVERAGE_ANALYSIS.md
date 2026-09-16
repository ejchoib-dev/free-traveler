# UI Coverage Analysis — Traveler

| 항목 | 내용 |
|---|---|
| Document ID | UICOV-TRAVEL-001 |
| 기준 문서 | `docs/02_SRS_BASELINE.md`, `docs/PROJECT_SCOPE.md` |
| 작성일 | 2026-09-10 |
| 대상 Requirement | REQ-FUNC-001~080, REQ-NF-001~034 (총 114개) |

---

## 1. 목적

`02_SRS_BASELINE.md`의 전체 요구사항을 하나도 빠짐없이 유지한 채, 5개로 고정된 디자인 Screen 위에 배치한다. 요구사항별로 UI 성격(UI_DIRECT/UI_STATE/NON_UI/OPERATIONS)과 `PROJECT_SCOPE.md`의 구현 상태(IMPLEMENT/EXCLUDED)를 함께 기록해, 화면 설계 시 어떤 요구사항이 실제 화면 요소로 나타나고 어떤 요구사항이 화면 밖(로직·데이터·운영)에서 처리되는지 구분한다.

## 2. UI 분류 정의

| 분류 | 정의 |
|---|---|
| **UI_DIRECT** | 사용자가 화면에서 직접 보는 요소 자체를 정의하는 요구사항(필드, 버튼, 배지, 안내문, 패널 구성, 링크) |
| **UI_STATE** | 화면에 나타나는 값·동작을 결정하는 로직·상태 요구사항(검증, 계산, 조건부 전이, 세션 상태) — 화면에 간접적으로 드러난다 |
| **NON_UI** | 사용자 화면과 직접 관련 없는 데이터·보안·아키텍처 요구사항(저장 정책, 전송 금지, RLS, 성능·보안 목표치) |
| **OPERATIONS** | 운영·거버넌스·모니터링·콘텐츠 관리 프로세스 요구사항(감사 로그, SLA, 백업, 게시 게이트, 대시보드, CI 게이트) |

`PROJECT_SCOPE` 열은 `docs/PROJECT_SCOPE.md`에서 확정한 **IMPLEMENT / EXCLUDED** 상태를 그대로 인용한다. 이 문서에서 상태를 변경하지 않는다.

## 3. 디자인 Screen 정의 (5개 고정)

| ID | 경로 | 사용자 목표 | 주요 영역 | 주요 상태 | 이동 목적지 |
|---|---|---|---|---|---|
| **SCR-001** | `/` 메인 | 여행지를 발견하고 상세·안전정보를 확인한 뒤 다음 행동(항공/숙소/동행/로그인)으로 넘어간다 | 검색·필터 바, 국내/해외 여행지 카드 그리드, 여행지 상세 Drawer/Modal, 국가 안전정보 Drawer/Modal, 대표 소개 티저 | 기본 목록 / 필터 적용됨 / 결과 없음 / 여행지 Drawer 열림 / 안전정보 Drawer 열림(최신·stale 경고) | SCR-002(대표 소개 전체), SCR-003(여행 준비), SCR-004(동행 목록), SCR-005(로그인·즐겨찾기) |
| **SCR-002** | `/about` | `free_traveler`의 경험과 편집 기준을 확인한다 | 수치 카드(50+/30+), 소개문·철학, 방문 권역·국가 목록, 타임라인, 추천 여행지 6개, 문의·SNS | 기본(정적) 상태 | SCR-001(추천 여행지 상세 Drawer) |
| **SCR-003** | `/travel-tools` | 항공·숙소 조건을 정리해 외부 사이트로 이동하거나 동행글을 작성한다 | 3탭 구성: [항공] [숙소] [동행 작성], 각 탭은 입력 폼→요약 단계, 외부 이동 버튼, 안전수칙 동의 | 입력 중 / 검증 오류 / 요약 확인 / 외부 이동 성공·실패 | 외부 사이트(새 탭), SCR-004(동행글 작성 완료 후 상세 이동) |
| **SCR-004** | `/mates` | 조건에 맞는 동행 모집글을 찾아 참가를 요청하거나, 내 글의 요청을 처리한다 | 목록+필터, 상세 패널(모집 조건, 참가 요청 폼, 승인/거절, 마감/수정 관리, 신고, 차단) | 목록 기본 / 필터 적용 / 상세 패널(참가자 뷰·작성자 뷰) / OPEN·CLOSED / 요청 PENDING·ACCEPTED·REJECTED | SCR-005(로그인·성인확인 필요 시), SCR-003(새 글 작성 탭) |
| **SCR-005** | `/account` | 로그인·가입하고, 프로필과 내 활동(글/요청/즐겨찾기/차단)을 관리하며, 관리자는 신고·외부 URL을 처리한다 | 4탭 구성: [로그인·가입] [프로필] [내 활동] [관리자] | 비로그인 / 로그인됨 / 성인확인 필요·완료 / 관리자 권한 있음·없음 | SCR-004(내 글·요청 상세), SCR-001(즐겨찾기 항목 상세) |

## 4. 화면 배치 원칙

- 여행지 상세와 국가 안전정보 상세는 별도 라우트가 아니라 **SCR-001의 Drawer/Modal**로 배치한다.
- 항공 입력, 숙소 입력, 동행글 작성은 **SCR-003의 탭 3개**로 배치한다.
- 동행 모집글 상세(참가 요청·승인/거절·마감/수정·신고·차단)는 **SCR-004의 상세 패널**로 배치한다.
- 로그인·회원가입, 프로필, 내 활동, 간단 관리자는 **SCR-005의 탭 4개**로 배치한다.
- API Route, 인증 콜백(`/auth/callback` 등), 404·500 등 오류 처리는 **기술 Route**로 분류하며 5개 디자인 Screen에 포함하지 않는다.

---

## 5. Requirement 매핑 표

범례: 화면란의 `전역`은 5개 Screen 공통 레이아웃/속성에 적용됨을, `기술 Route`는 디자인 Screen이 아닌 API·콜백·에러 라우트를 의미한다.

### 5.1 F1. Destination Guide (REQ-FUNC-001~010)

| ID | 요구사항 요약 | UI 분류 | PROJECT_SCOPE | 화면 |
|---|---|---|---|---|
| REQ-FUNC-001 | 국내·해외 목록 구분 | UI_DIRECT | IMPLEMENT | SCR-001 |
| REQ-FUNC-002 | 국가·도시·계절·테마·기간 필터(AND) | UI_DIRECT | IMPLEMENT | SCR-001 |
| REQ-FUNC-003 | 키워드 검색 | UI_DIRECT | IMPLEMENT | SCR-001 |
| REQ-FUNC-004 | 상세 필수 콘텐츠 항목 표시 | UI_DIRECT | IMPLEMENT | SCR-001 (Drawer/Modal) |
| REQ-FUNC-005 | 빈 결과 안내·초기화 | UI_DIRECT | IMPLEMENT | SCR-001 |
| REQ-FUNC-006 | 해외 상세→안전정보 연결 | UI_DIRECT | IMPLEMENT | SCR-001 (Drawer 간 이동) |
| REQ-FUNC-007 | 이미지 대체텍스트·출처·작가·라이선스 | UI_STATE | EXCLUDED | SCR-001 (Drawer) |
| REQ-FUNC-008 | 게시 수량 기준(국내10/해외15개국30도시) 검증 | OPERATIONS | IMPLEMENT | 해당없음(콘텐츠 작성 시점 점검) |
| REQ-FUNC-009 | 관련 여행지 최대 6개 추천 | UI_DIRECT | EXCLUDED | SCR-001 (Drawer) |
| REQ-FUNC-010 | 필터 상태 URL query 반영 | UI_STATE | EXCLUDED | SCR-001 |

### 5.2 F2. Flight Link-out (REQ-FUNC-011~018)

| ID | 요구사항 요약 | UI 분류 | PROJECT_SCOPE | 화면 |
|---|---|---|---|---|
| REQ-FUNC-011 | 국가·지역·출발일·귀국일 필수 입력 | UI_DIRECT | IMPLEMENT | SCR-003 (항공 탭) |
| REQ-FUNC-012 | 국가별 유효 지역만 선택 | UI_STATE | IMPLEMENT | SCR-003 (항공 탭) |
| REQ-FUNC-013 | 과거 출발일·역전 귀국일 차단 | UI_STATE | IMPLEMENT | SCR-003 (항공 탭) |
| REQ-FUNC-014 | 입력 요약 표시 | UI_DIRECT | IMPLEMENT | SCR-003 (항공 탭) |
| REQ-FUNC-015 | 입력값 비전달 고지 | UI_DIRECT | IMPLEMENT | SCR-003 (항공 탭) |
| REQ-FUNC-016 | 외부 URL 새 탭 + noopener,noreferrer | UI_STATE | IMPLEMENT | SCR-003 (항공 탭) |
| REQ-FUNC-017 | 입력값 서버 미저장 | NON_UI | IMPLEMENT | SCR-003 (비가시 속성) |
| REQ-FUNC-018 | 외부 URL 오류 시 차단·재시도 | UI_DIRECT | IMPLEMENT | SCR-003 (항공 탭) |

### 5.3 F3. Hotel Link-out (REQ-FUNC-019~026)

| ID | 요구사항 요약 | UI 분류 | PROJECT_SCOPE | 화면 |
|---|---|---|---|---|
| REQ-FUNC-019 | 국가·지역·체크인·체크아웃 필수 입력 | UI_DIRECT | IMPLEMENT | SCR-003 (숙소 탭) |
| REQ-FUNC-020 | 국가별 유효 지역만 선택 | UI_STATE | IMPLEMENT | SCR-003 (숙소 탭) |
| REQ-FUNC-021 | 과거 체크인·역전/동일 체크아웃 차단 | UI_STATE | IMPLEMENT | SCR-003 (숙소 탭) |
| REQ-FUNC-022 | 입력 요약 표시 | UI_DIRECT | IMPLEMENT | SCR-003 (숙소 탭) |
| REQ-FUNC-023 | 입력값 비전달 고지 | UI_DIRECT | IMPLEMENT | SCR-003 (숙소 탭) |
| REQ-FUNC-024 | 외부 URL 새 탭 + noopener,noreferrer | UI_STATE | IMPLEMENT | SCR-003 (숙소 탭) |
| REQ-FUNC-025 | 입력값 서버 미저장 | NON_UI | IMPLEMENT | SCR-003 (비가시 속성) |
| REQ-FUNC-026 | 외부 URL 오류 시 차단·재시도 | UI_DIRECT | IMPLEMENT | SCR-003 (숙소 탭) |

### 5.4 F4. Travel Mate (REQ-FUNC-027~045)

| ID | 요구사항 요약 | UI 분류 | PROJECT_SCOPE | 화면 |
|---|---|---|---|---|
| REQ-FUNC-027 | 동행 쓰기에 인증 세션 요구 | NON_UI | IMPLEMENT | SCR-005 (게이트 발생 시 리다이렉트) |
| REQ-FUNC-028 | 성인 확인 상태 요구, 생년월일 미저장 | NON_UI | IMPLEMENT | SCR-005 (성인확인) |
| REQ-FUNC-029 | 동행 프로필 필드 | UI_DIRECT | IMPLEMENT | SCR-005 (프로필 탭) |
| REQ-FUNC-030 | 조건·차단 반영 필터 | UI_DIRECT | IMPLEMENT | SCR-004 |
| REQ-FUNC-031 | 모집글 작성 필드·검증 | UI_DIRECT | IMPLEMENT | SCR-003 (동행 작성 탭) |
| REQ-FUNC-032 | 공개 연락처 패턴 탐지·제출 차단 | UI_STATE | IMPLEMENT | SCR-003 (동행 작성 탭) |
| REQ-FUNC-033 | 연락처 비노출(응답에 미포함) | NON_UI | IMPLEMENT | SCR-004 |
| REQ-FUNC-034 | 참가 메시지 제출(비공개) | UI_DIRECT | IMPLEMENT | SCR-004 (상세 패널) |
| REQ-FUNC-035 | 중복 요청 차단 | UI_STATE | IMPLEMENT | SCR-004 (상세 패널) |
| REQ-FUNC-036 | 작성자의 승인·거절 | UI_DIRECT | IMPLEMENT | SCR-004 (상세 패널) |
| REQ-FUNC-037 | 종료일 경과 시 자동 마감 | UI_STATE | IMPLEMENT | SCR-004 |
| REQ-FUNC-038 | 작성자 수동 마감·수정·삭제 | UI_DIRECT | IMPLEMENT | SCR-004 (상세 패널) |
| REQ-FUNC-039 | 글·사용자·요청 신고 | UI_DIRECT | IMPLEMENT | SCR-004 |
| REQ-FUNC-040 | 사용자 차단·해제 | UI_DIRECT | IMPLEMENT | SCR-004(시작) / SCR-005(관리) |
| REQ-FUNC-041 | 신고 큐(상태 필터) | UI_DIRECT | IMPLEMENT | SCR-005 (관리자 탭) |
| REQ-FUNC-042 | 경고·숨김·계정 제한 등 제재 조치 | OPERATIONS | EXCLUDED | 해당없음 |
| REQ-FUNC-043 | 요청 처리 결과 알림(이메일 선택) | UI_DIRECT | IMPLEMENT | 전역 (Toast) |
| REQ-FUNC-044 | RLS 기반 비공개 데이터 접근 제어 | NON_UI | IMPLEMENT | 전역 (비가시) |
| REQ-FUNC-045 | 탈퇴 시 비식별화·30일 내 삭제 | OPERATIONS | EXCLUDED | 해당없음 |

### 5.5 F5. Country Safety (REQ-FUNC-046~056)

| ID | 요구사항 요약 | UI 분류 | PROJECT_SCOPE | 화면 |
|---|---|---|---|---|
| REQ-FUNC-046 | 해외 국가 전체 안전 페이지 확보 | OPERATIONS | IMPLEMENT | 해당없음(표시는 SCR-001) |
| REQ-FUNC-047 | 8개 필수 카테고리 섹션 | UI_DIRECT | IMPLEMENT | SCR-001 (Drawer/Modal) |
| REQ-FUNC-048 | 출처명·URL·확인일·편집자 기록 | UI_DIRECT | IMPLEMENT | SCR-001 |
| REQ-FUNC-049 | 외교부 원문 링크(새 탭) | UI_DIRECT | IMPLEMENT | SCR-001 |
| REQ-FUNC-050 | 확인 7일 초과 시 stale 경고 | UI_STATE | IMPLEMENT | SCR-001 |
| REQ-FUNC-051 | 중대 경보 상단 텍스트 표시 | UI_DIRECT | IMPLEMENT | SCR-001 |
| REQ-FUNC-052 | 국가 전체/지역 경보 범위 구분 | UI_DIRECT | IMPLEMENT | SCR-001 |
| REQ-FUNC-053 | 긴급연락처 표시 | UI_DIRECT | IMPLEMENT | SCR-001 |
| REQ-FUNC-054 | 공식 판단 대체 아님 고지 | UI_DIRECT | IMPLEMENT | SCR-001 / SCR-003 |
| REQ-FUNC-055 | Editor/Admin 작성·검수·게시 워크플로 | OPERATIONS | EXCLUDED | 해당없음 |
| REQ-FUNC-056 | 안전정보 변경 이력 보존 | OPERATIONS | EXCLUDED | 해당없음 |

### 5.6 F6. About free_traveler (REQ-FUNC-057~063)

| ID | 요구사항 요약 | UI 분류 | PROJECT_SCOPE | 화면 |
|---|---|---|---|---|
| REQ-FUNC-057 | 대표명·50+ Trips·30+ Countries 표시 | UI_DIRECT | IMPLEMENT | SCR-002 |
| REQ-FUNC-058 | 소개문·철학·편집 원칙 표시 | UI_DIRECT | IMPLEMENT | SCR-002 |
| REQ-FUNC-059 | 방문 권역/30개국 이상 목록 | UI_DIRECT | IMPLEMENT | SCR-002 |
| REQ-FUNC-060 | 여행 타임라인 | UI_DIRECT | IMPLEMENT | SCR-002 |
| REQ-FUNC-061 | 대표 이미지 대체텍스트·출처·작가·라이선스 | UI_STATE | EXCLUDED | SCR-002 |
| REQ-FUNC-062 | 문의·SNS 링크 | UI_DIRECT | IMPLEMENT | SCR-002 |
| REQ-FUNC-063 | 추천 여행지 6곳 연결 | UI_DIRECT | IMPLEMENT | SCR-002 → SCR-001 |

### 5.7 F7. Common, Admin, Governance (REQ-FUNC-064~080)

| ID | 요구사항 요약 | UI 분류 | PROJECT_SCOPE | 화면 |
|---|---|---|---|---|
| REQ-FUNC-064 | 전역 내비게이션·푸터 | UI_DIRECT | IMPLEMENT | 전역 |
| REQ-FUNC-065 | 반응형 레이아웃(320px~) | UI_DIRECT | IMPLEMENT | 전역 |
| REQ-FUNC-066 | 이메일 가입·인증·로그인·로그아웃·재설정 | UI_DIRECT | IMPLEMENT | SCR-005 (로그인·가입 탭) |
| REQ-FUNC-067 | 여행지·안전정보 통합 검색 | UI_DIRECT | EXCLUDED | 해당없음 |
| REQ-FUNC-068 | 여행지 즐겨찾기 | UI_DIRECT | IMPLEMENT | SCR-001(토글) / SCR-005(목록) |
| REQ-FUNC-069 | 공개 페이지 URL 공유 | UI_DIRECT | EXCLUDED | 해당없음 |
| REQ-FUNC-070 | 페이지별 SEO 메타데이터 | NON_UI | IMPLEMENT | 전역 |
| REQ-FUNC-071 | 행동 분석 이벤트 기록 | OPERATIONS | EXCLUDED | 해당없음 |
| REQ-FUNC-072 | Editor/Admin 콘텐츠 CRUD·미리보기 | OPERATIONS | EXCLUDED | 해당없음 |
| REQ-FUNC-073 | 미디어 업로드 시 출처·작가·라이선스 필수 입력 | OPERATIONS | EXCLUDED | 해당없음 |
| REQ-FUNC-074 | 게시 전 완전성 게이트 | OPERATIONS | EXCLUDED | 해당없음 |
| REQ-FUNC-075 | 안전정보 stale 대시보드 | OPERATIONS | EXCLUDED | 해당없음 |
| REQ-FUNC-076 | 관리자 변경·신고 처리 감사 로그 | OPERATIONS | EXCLUDED | 해당없음 |
| REQ-FUNC-077 | Admin 외부 URL 허용목록 설정 | UI_DIRECT | IMPLEMENT | SCR-005 (관리자 탭) |
| REQ-FUNC-078 | 404·500·권한없음·연결실패 복구 화면 | UI_DIRECT | IMPLEMENT | 기술 Route |
| REQ-FUNC-079 | 폼·모달·탭·알림 ARIA/HTML 의미 | UI_STATE | IMPLEMENT | 전역 |
| REQ-FUNC-080 | 약관·정책·안전수칙 동의 기록 | UI_DIRECT | IMPLEMENT | SCR-003(동의 체크박스) / 전역(정책 링크) |

### 5.8 NFR — Performance (REQ-NF-001~007)

| ID | 요구사항 요약 | UI 분류 | PROJECT_SCOPE | 화면 |
|---|---|---|---|---|
| REQ-NF-001 | LCP p75 ≤2.5s | NON_UI | IMPLEMENT | 전역 |
| REQ-NF-002 | INP p75 ≤200ms | NON_UI | IMPLEMENT | 전역 |
| REQ-NF-003 | CLS p75 ≤0.1 | NON_UI | IMPLEMENT | 전역 |
| REQ-NF-004 | 필터 응답 p95≤1s(동시 50명) | OPERATIONS | EXCLUDED | 해당없음 |
| REQ-NF-005 | 쓰기 API p95≤3s | NON_UI | IMPLEMENT | 전역 |
| REQ-NF-006 | 이미지 반응형·lazy load | UI_STATE | IMPLEMENT | 전역 |
| REQ-NF-007 | 배포 전 Lighthouse≥85 CI 게이트 | OPERATIONS | EXCLUDED | 해당없음 |

### 5.9 NFR — Reliability and Recovery (REQ-NF-008~011)

| ID | 요구사항 요약 | UI 분류 | PROJECT_SCOPE | 화면 |
|---|---|---|---|---|
| REQ-NF-008 | 월간 가용성 ≥99.5% | OPERATIONS | EXCLUDED | 해당없음 |
| REQ-NF-009 | 내부 API 5xx ≤0.5% | OPERATIONS | EXCLUDED | 해당없음 |
| REQ-NF-010 | DB 백업 RPO≤24h/RTO≤8h | OPERATIONS | EXCLUDED | 해당없음 |
| REQ-NF-011 | 주1회 링크 자동 점검·Admin 알림 | OPERATIONS | EXCLUDED | 해당없음 |

### 5.10 NFR — Security and Privacy (REQ-NF-012~018)

| ID | 요구사항 요약 | UI 분류 | PROJECT_SCOPE | 화면 |
|---|---|---|---|---|
| REQ-NF-012 | TLS 1.2 이상 | NON_UI | IMPLEMENT | 전역 |
| REQ-NF-013 | 인증·역할·RLS 서버 검증 | NON_UI | IMPLEMENT | 전역 |
| REQ-NF-014 | CSRF 방어·SameSite 쿠키 | NON_UI | IMPLEMENT | 전역 |
| REQ-NF-015 | 입력 검증·이스케이프, 저장 XSS 차단 | NON_UI | IMPLEMENT | 전역 |
| REQ-NF-016 | 비밀키 환경변수 관리 | NON_UI | IMPLEMENT | 전역 |
| REQ-NF-017 | 항공·호텔 원시 입력값 미보존 | NON_UI | IMPLEMENT | SCR-003 (비가시) |
| REQ-NF-018 | 개인정보 내보내기·탈퇴·삭제 요청 | OPERATIONS | EXCLUDED | 해당없음 |

### 5.11 NFR — Safety and Moderation (REQ-NF-019~022)

| ID | 요구사항 요약 | UI 분류 | PROJECT_SCOPE | 화면 |
|---|---|---|---|---|
| REQ-NF-019 | 신고 접수 응답 p95≤3s | NON_UI | IMPLEMENT | SCR-004 (비가시) |
| REQ-NF-020 | 신고 1차 검토 24h 이내 90% | OPERATIONS | EXCLUDED | 해당없음 |
| REQ-NF-021 | 글·요청·신고 속도 제한(429) | NON_UI | EXCLUDED | 전역 (비가시) |
| REQ-NF-022 | Moderator 조치 추적 가능성 | OPERATIONS | EXCLUDED | 해당없음 |

### 5.12 NFR — Accessibility (REQ-NF-023~025)

| ID | 요구사항 요약 | UI 분류 | PROJECT_SCOPE | 화면 |
|---|---|---|---|---|
| REQ-NF-023 | WCAG 2.2 Level AA 목표 | NON_UI | IMPLEMENT | 전역 |
| REQ-NF-024 | 자동 접근성 검사(axe) | OPERATIONS | EXCLUDED | 해당없음 |
| REQ-NF-025 | 키보드·스크린리더 수동 검사 | OPERATIONS | IMPLEMENT | 해당없음 |

### 5.13 NFR — Content, Freshness, SEO, Copyright (REQ-NF-026~030)

| ID | 요구사항 요약 | UI 분류 | PROJECT_SCOPE | 화면 |
|---|---|---|---|---|
| REQ-NF-026 | 여행지 콘텐츠 완전성 100% | OPERATIONS | IMPLEMENT | 해당없음(표시는 SCR-001) |
| REQ-NF-027 | 해외 안전정보 커버리지 100% | OPERATIONS | IMPLEMENT | 해당없음(표시는 SCR-001) |
| REQ-NF-028 | 안전정보 7일 이내 확인 95%+/초과 시 경고 100% | OPERATIONS | IMPLEMENT | 해당없음(경고표시는 SCR-001) |
| REQ-NF-029 | 미디어 라이선스 메타데이터 100% | OPERATIONS | EXCLUDED | 해당없음 |
| REQ-NF-030 | 공개 페이지 SEO 메타데이터 누락 0건 | NON_UI | IMPLEMENT | 전역 |

### 5.14 NFR — Maintainability, Monitoring, Cost (REQ-NF-031~034)

| ID | 요구사항 요약 | UI 분류 | PROJECT_SCOPE | 화면 |
|---|---|---|---|---|
| REQ-NF-031 | TypeScript strict·lint·unit test 병합 전 통과 | OPERATIONS | IMPLEMENT | 해당없음 |
| REQ-NF-032 | 구조화 로그 | OPERATIONS | EXCLUDED | 해당없음 |
| REQ-NF-033 | 핵심 오류 5분 이내 알림 | OPERATIONS | EXCLUDED | 해당없음 |
| REQ-NF-034 | MVP 월 인프라 비용 ≤10만원 | OPERATIONS | IMPLEMENT | 해당없음 |

---

## 6. 집계 검증

### 6.1 총 개수

| 구분 | 개수 |
|---|---:|
| REQ-FUNC-001~080 | 80 |
| REQ-NF-001~034 | 34 |
| **합계** | **114** |

### 6.2 UI 분류별 개수

| 분류 | FUNC | NF | 합계 |
|---|---:|---:|---:|
| UI_DIRECT | 47 | 0 | 47 |
| UI_STATE | 14 | 1 | 15 |
| NON_UI | 7 | 14 | 21 |
| OPERATIONS | 12 | 19 | 31 |
| **합계** | **80** | **34** | **114** |

### 6.3 PROJECT_SCOPE 상태별 개수

| 상태 | FUNC | NF | 합계 |
|---|---:|---:|---:|
| IMPLEMENT | 64 | 20 | 84 |
| EXCLUDED | 16 | 14 | 30 |
| **합계** | **80** | **34** | **114** |

### 6.4 화면별 배치 요약 (Requirement 기준, 중복 배치 포함)

| 화면 | 주 배치 Requirement 수(대략) | 비고 |
|---|---:|---|
| SCR-001 | 22 | 여행지 목록/검색/필터 + 여행지·안전정보 Drawer/Modal |
| SCR-002 | 7 | 대표 소개 |
| SCR-003 | 20 | 항공·숙소 입력, 동행 작성 3탭 |
| SCR-004 | 15 | 동행 목록·상세 패널 |
| SCR-005 | 12 | 로그인·프로필·내 활동·관리자 4탭 |
| 전역 | 17 | 공통 레이아웃/보안/성능/접근성 속성 |
| 기술 Route | 1 | 오류 화면(REQ-FUNC-078) |
| 해당없음 | 30 | 대부분 EXCLUDED 항목 또는 화면과 직접 매핑되지 않는 운영·데이터 항목 |

PROJECT_SCOPE에서 EXCLUDED로 확정된 30개 요구사항의 분류·제외 사유는 변경하지 않았으며, 이 문서는 화면 배치를 위한 분류만 추가했다.
