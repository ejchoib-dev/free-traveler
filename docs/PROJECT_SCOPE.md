# Traveler 프로젝트 범위 정의서 (PROJECT_SCOPE)

| 항목 | 내용 |
|---|---|
| Document ID | SCOPE-TRAVEL-001 |
| 기준 문서 | `docs/01_PRD.md`, `docs/02_SRS_BASELINE.md` |
| 현재 코드 기준 | `package.json`(Next.js 16.3.4 / React 19, Supabase·Playwright 미설치), `src/app`(기본 스캐폴드만 존재), `src/data`(빈 디렉터리) |
| 작성일 | 2026-09-10 |
| 상태 | 구현 착수 기준 |

---

## 1. 목적

이 문서는 `01_PRD.md`와 `02_SRS_BASELINE.md`에 정의된 요구사항 중 이번 구현 범위에서 **직접 만들 것**과 **만들지 않을 것**을 확정한다. SRS의 요구사항 ID(REQ-FUNC-001~080, REQ-NF-001~034)를 기준으로 하되, PRD·SRS가 전제한 풀스택 CMS·운영 자동화 대신 정적 콘텐츠와 최소 관리자 기능 중심으로 범위를 축소한다.

## 2. 요구사항 상태 정의

| 상태 | 의미 |
|---|---|
| **IMPLEMENT** | 이번 범위에서 구현하고 Playwright 등으로 테스트한다. |
| **EXCLUDED** | 이번 범위에서 만들지 않는다. 표에 제외 이유를 함께 기록한다. |

---

## 3. 구현 화면 범위

### 3.1 핵심 화면 4개 + 보조 화면 1개

| 구분 | 화면 | 역할 |
|---|---|---|
| 핵심 1 | `/destinations` (+ `[slug]` 상세) | 국내·해외 여행지 검색·필터·상세 |
| 핵심 2 | `/mates` (+ `[id]` 상세, `new` 작성) | 동행 모집글 조회·작성·참가 요청 |
| 핵심 3 | `/safety` (+ `[countryCode]` 상세) | 국가별 안전정보 |
| 핵심 4 | `/about` | `free_traveler` 대표 소개 |
| 보조 1 | `/` (홈) | 4개 핵심 화면과 항공·호텔 이동으로 연결되는 진입 허브 |

### 3.2 다른 구현 항목에 종속된 화면

핵심 4개·보조 1개 외에, 아래 화면은 12개 구현 항목 중 다른 번호에 종속되어 별도로 구현한다.

| 화면 | 종속 항목 |
|---|---|
| `/flights`, `/hotels` | 5. 항공·숙소 입력·검증·요약·외부 이동 |
| `/auth/*` | 6. Supabase 이메일 인증과 성인 확인 |
| `/my/*` | 10. 내 활동 탭(내 글, 참가 요청, 차단 목록) |
| `/admin/*`(신고 상태, 외부 URL 설정만) | 10. 간단한 관리자 탭 |

---

## 4. 직접 구현할 범위 요약

| # | 항목 | 관련 화면 | 관련 REQ 범위(대표) |
|---|---|---|---|
| 1 | 핵심 화면 4개 + 보조 화면 1개 | 3.1 참조 | REQ-FUNC-064, 065 |
| 2 | 여행지 검색·필터와 상세 패널 | `/destinations` | REQ-FUNC-001~006, 008 |
| 3 | 국가 안전정보 패널 | `/safety` | REQ-FUNC-046~054 |
| 4 | `free_traveler` 대표 소개 | `/about` | REQ-FUNC-057~060, 062, 063 |
| 5 | 항공·숙소 입력·검증·요약·외부 이동 | `/flights`, `/hotels` | REQ-FUNC-011~026 |
| 6 | Supabase 이메일 인증과 성인 확인 | `/auth/*` | REQ-FUNC-027~028, 066 |
| 7 | 동행글 작성·조회·수정·마감 | `/mates`, `/mates/new` | REQ-FUNC-029~033, 037~038 |
| 8 | 참가 요청·승인·거절 | `/mates/[id]` | REQ-FUNC-034~036 |
| 9 | 간단한 차단·신고 | `/mates/[id]`, `/my/*` | REQ-FUNC-039~040 |
| 10 | 내 활동과 간단한 관리자 탭 | `/my/*`, `/admin/*` | REQ-FUNC-041, 043, 044, 077 |
| 11 | Playwright 핵심 Smoke Test | 전체 핵심 흐름 | REQ-NF-031(단위테스트 대체) |
| 12 | Vercel 배포 | 인프라 | CON-13 |

---

## 5. 구현 방식

| 영역 | 방식 | SRS 기준선과의 차이 |
|---|---|---|
| 여행지·안전·대표 콘텐츠 | `src/data`의 정적 TypeScript 데이터 | Supabase `DESTINATION`/`COUNTRY_SAFETY`/`REPRESENTATIVE_PROFILE` 테이블과 Editor CMS 워크플로 대신 코드 저장소에서 직접 관리 |
| 즐겨찾기 | `localStorage` | 서버 저장 없이 브라우저별로 유지 |
| 동행 알림 | Toast 또는 화면 상태(인앱) | 실제 이메일 발송 없음(SRS도 이메일은 선택 항목으로 정의) |
| 모집글 자동 마감 | 조회 시점에 종료일을 계산해 마감 여부 판정 | 배치/크론 작업 없음 |
| 안전정보 최신성(stale) | 렌더링 시점에 확인일과 현재 날짜를 비교해 계산 | 별도 stale 대시보드·배치 없음 |
| 이미지 | 일반 인터넷 URL + `alt` 텍스트만 사용 | 출처·작가·라이선스 메타데이터 관리 워크플로 없음 |
| 관리자 | 신고 상태 변경과 외부 URL 설정만 제공 | 콘텐츠 CRUD, 계정 제재 도구, 감사 로그, 운영 대시보드 없음 |

---

## 6. 제외 기능과 사유

| 제외 기능 | 사유 | 영향받는 대표 REQ |
|---|---|---|
| 전체 콘텐츠 CMS | 콘텐츠는 정적 데이터로 관리하며 편집자 승인·게시 워크플로가 필요 없음 | REQ-FUNC-055, 072, 074 |
| 미디어 업로드·라이선스 승인 워크플로 | 이미지 정책을 일반 URL + alt 텍스트로 단순화 | REQ-FUNC-007, 061, 073, REQ-NF-029 |
| 범용 감사 로그 | 관리자 작업이 신고 상태·외부 URL 설정으로 한정되어 별도 이력 추적 체계가 불필요 | REQ-FUNC-056, 076, REQ-NF-022 |
| 자동 백업·장애 알림·부하 테스트 | 운영 모니터링·인프라 자동화는 이번 범위의 배포 대상이 아님 | REQ-NF-004, 007~011, 020, 033 |
| 외부 이메일 사업자 연동 | 알림을 인앱 Toast/화면 상태로 대체 | REQ-FUNC-043(이메일 부분), ASM-05, D-02 |
| EC2·AWS 인프라 | Vercel·Supabase 관리형 서비스만 사용 | CON-13 |
| 무인 자동 Merge Runner | 병합은 사람이 검토·승인하며 CI가 자동으로 병합을 수행하지 않음 | REQ-NF-007, 031(자동 게이트 부분) |

---

## 7. 기능 요구사항 처리표 (REQ-FUNC-001~080)

### 7.1 F1. Destination Guide

| ID | 요구사항 요약 | 분류 | 처리 방법 | 확인 방법 |
|---|---|---|---|---|
| REQ-FUNC-001 | 국내·해외 목록 구분 | IMPLEMENT | 정적 데이터의 `scope` 필드 기준 탭 필터 | Playwright smoke |
| REQ-FUNC-002 | 국가·도시·계절·테마·기간 필터(AND) | IMPLEMENT | 클라이언트 필터 로직, 정적 데이터라 p95 목표 자연 충족 | 수동 확인 + smoke |
| REQ-FUNC-003 | 키워드 검색 | IMPLEMENT | 클라이언트 부분 일치 검색 | 수동 확인 |
| REQ-FUNC-004 | 상세 필수 콘텐츠 항목 표시 | IMPLEMENT | `src/data` 스키마에 필수 필드 강제(TypeScript 타입) | 타입 검사 + 수동 검수 |
| REQ-FUNC-005 | 빈 결과 안내·초기화 | IMPLEMENT | UI 상태 분기 컴포넌트 | 수동 확인 |
| REQ-FUNC-006 | 해외 상세→안전정보 연결 | IMPLEMENT | `countryCode` 기준 안전 데이터 매칭 링크 | Playwright smoke |
| REQ-FUNC-007 | 이미지 대체텍스트·출처·작가·라이선스 | EXCLUDED | `alt` 텍스트만 데이터에 포함, 출처·작가·라이선스 필드는 관리하지 않음(§5 이미지 정책) | 해당 없음 |
| REQ-FUNC-008 | 국내 10곳·해외 15개국 30도시 이상 검증 | IMPLEMENT | 정적 데이터 작성 시 수량 수동 확인(자동 게이트 없음) | 데이터 작성 체크리스트 |
| REQ-FUNC-009 | 관련 여행지 최대 6개 추천 | EXCLUDED | Should 항목으로 MVP 상세 패널 핵심 범위 밖 | 해당 없음 |
| REQ-FUNC-010 | 필터 상태 URL query 반영 | EXCLUDED | Should 항목으로 후속 과제 | 해당 없음 |

### 7.2 F2. Flight Link-out

| ID | 요구사항 요약 | 분류 | 처리 방법 | 확인 방법 |
|---|---|---|---|---|
| REQ-FUNC-011 | 국가·지역·출발일·귀국일 필수 입력 | IMPLEMENT | 클라이언트 폼(Client Component) | Playwright smoke |
| REQ-FUNC-012 | 국가별 유효 지역만 선택 | IMPLEMENT | 국가 변경 시 지역 값 초기화 | 수동 확인 |
| REQ-FUNC-013 | 과거 출발일·역전 귀국일 차단 | IMPLEMENT | 클라이언트 날짜 검증 | Playwright smoke |
| REQ-FUNC-014 | 입력 요약 표시 | IMPLEMENT | 폼 상태를 요약 컴포넌트로 렌더 | 수동 확인 |
| REQ-FUNC-015 | 입력값 비전달 고지 | IMPLEMENT | 폼·요약 화면에 고정 안내 문구 | 수동 확인 |
| REQ-FUNC-016 | 외부 URL 새 탭 + noopener,noreferrer | IMPLEMENT | `<a target=_blank rel=noopener noreferrer>` | Playwright smoke |
| REQ-FUNC-017 | 입력값 서버 미저장 | IMPLEMENT | 서버 API 자체를 만들지 않음(클라이언트 상태만 사용) | 네트워크 탭 수동 확인 |
| REQ-FUNC-018 | 외부 URL 오류 시 차단·재시도 | IMPLEMENT | 환경변수 URL 유효성 확인 후 오류 UI 표시(운영 알림 자동화는 제외) | 수동 확인 |

### 7.3 F3. Hotel Link-out

| ID | 요구사항 요약 | 분류 | 처리 방법 | 확인 방법 |
|---|---|---|---|---|
| REQ-FUNC-019 | 국가·지역·체크인·체크아웃 필수 입력 | IMPLEMENT | 클라이언트 폼 | Playwright smoke |
| REQ-FUNC-020 | 국가별 유효 지역만 선택 | IMPLEMENT | 국가 변경 시 지역 값 초기화 | 수동 확인 |
| REQ-FUNC-021 | 과거 체크인·역전/동일 체크아웃 차단 | IMPLEMENT | 클라이언트 날짜 검증 | Playwright smoke |
| REQ-FUNC-022 | 입력 요약 표시 | IMPLEMENT | 폼 상태를 요약 컴포넌트로 렌더 | 수동 확인 |
| REQ-FUNC-023 | 입력값 비전달 고지 | IMPLEMENT | 폼·요약 화면에 고정 안내 문구 | 수동 확인 |
| REQ-FUNC-024 | 외부 URL 새 탭 + noopener,noreferrer | IMPLEMENT | `<a target=_blank rel=noopener noreferrer>` | Playwright smoke |
| REQ-FUNC-025 | 입력값 서버 미저장 | IMPLEMENT | 서버 API 없음, 클라이언트 상태만 사용 | 네트워크 탭 수동 확인 |
| REQ-FUNC-026 | 외부 URL 오류 시 차단·재시도 | IMPLEMENT | 오류 UI + 재시도 버튼(자동 운영 알림 제외) | 수동 확인 |

### 7.4 F4. Travel Mate

| ID | 요구사항 요약 | 분류 | 처리 방법 | 확인 방법 |
|---|---|---|---|---|
| REQ-FUNC-027 | 동행 쓰기에 인증 세션 요구 | IMPLEMENT | Supabase Auth 세션 검사(미들웨어/서버 액션) | Playwright smoke(비회원 차단) |
| REQ-FUNC-028 | 성인 확인 상태 요구, 생년월일 미저장 | IMPLEMENT | `is_adult`, `adult_verified_at`만 Supabase에 저장 | 수동 확인 + smoke |
| REQ-FUNC-029 | 동행 프로필 필드 | IMPLEMENT | 닉네임·연령대·여행스타일 필수, 성별 선택 폼 | 수동 확인 |
| REQ-FUNC-030 | 조건·차단 반영 필터 | IMPLEMENT | 클라이언트/서버 필터 + 차단 목록 제외 로직 | 수동 확인 |
| REQ-FUNC-031 | 모집글 작성 필드·검증 | IMPLEMENT | 폼 검증(필수값, 날짜 역전·과거 종료일 차단) | Playwright smoke |
| REQ-FUNC-032 | 공개 연락처 패턴 탐지 | IMPLEMENT | 정규식 기반 전화번호·이메일·메신저 ID 탐지 | 수동 테스트셋 확인 |
| REQ-FUNC-033 | 연락처 비노출 | IMPLEMENT | 응답 데이터에서 연락처 필드 제외 | 수동 확인 |
| REQ-FUNC-034 | 참가 메시지 제출(비공개) | IMPLEMENT | Supabase에 PENDING 저장, 작성자·요청자만 조회 | Playwright smoke |
| REQ-FUNC-035 | 중복 요청 차단 | IMPLEMENT | Supabase unique 제약 + UI 오류 | 수동 확인 |
| REQ-FUNC-036 | 작성자의 승인·거절 | IMPLEMENT | 작성자 전용 상태 변경 액션 | Playwright smoke |
| REQ-FUNC-037 | 종료일 경과 시 자동 마감 | IMPLEMENT | 배치 없이 조회 시점에 `end_date` 계산해 CLOSED로 표시 | 수동 확인 |
| REQ-FUNC-038 | 작성자 수동 마감·수정·삭제 | IMPLEMENT | 작성자 전용 CRUD 액션 | 수동 확인 |
| REQ-FUNC-039 | 글·사용자·요청 신고 | IMPLEMENT | 신고 사유 코드·설명 제출 폼 | Playwright smoke |
| REQ-FUNC-040 | 사용자 차단·해제 | IMPLEMENT | 차단 목록 Supabase 저장, 상호 노출 제한 | 수동 확인 |
| REQ-FUNC-041 | 신고 큐(상태 필터) | IMPLEMENT | 관리자 탭에서 신고 상태(OPEN/REVIEWING/RESOLVED/DISMISSED)만 필터·변경 | 수동 확인 |
| REQ-FUNC-042 | 경고·숨김·계정 제한 등 제재 조치 | EXCLUDED | 관리자는 신고 상태 변경과 외부 URL 설정만 다룸(§5) | 해당 없음 |
| REQ-FUNC-043 | 요청 처리 결과 알림(이메일 선택) | IMPLEMENT | 인앱 Toast/화면 상태로 알림, 이메일 발송은 하지 않음(원 요구사항도 이메일을 선택 항목으로 정의) | 수동 확인 |
| REQ-FUNC-044 | RLS 기반 비공개 데이터 접근 제어 | IMPLEMENT | Supabase RLS 정책(본인/대상 작성자/Moderator·Admin만 조회) | 권한별 수동 접근 테스트 |
| REQ-FUNC-045 | 탈퇴 시 비식별화·30일 내 삭제 | EXCLUDED | 자동 삭제 파이프라인 미구축(운영 자동화 제외 기조), 관리자 수동 처리로 대체 | 해당 없음 |

### 7.5 F5. Country Safety

| ID | 요구사항 요약 | 분류 | 처리 방법 | 확인 방법 |
|---|---|---|---|---|
| REQ-FUNC-046 | 해외 국가 전체 안전 페이지 | IMPLEMENT | 정적 데이터로 소개 국가 전체 커버 | 데이터 작성 체크리스트 |
| REQ-FUNC-047 | 8개 필수 카테고리 | IMPLEMENT | 정적 데이터 스키마에 8개 카테고리 필드 강제 | 타입 검사 |
| REQ-FUNC-048 | 출처명·URL·확인일·편집자 기록 | IMPLEMENT | 정적 데이터 필드로 기록(편집자=콘텐츠 작성자) | 수동 검수 |
| REQ-FUNC-049 | 외교부 원문 링크(새 탭) | IMPLEMENT | `<a target=_blank rel=noopener noreferrer>` | Playwright smoke |
| REQ-FUNC-050 | 확인 7일 초과 시 stale 경고 | IMPLEMENT | 렌더링 시점에 확인일과 현재 날짜 비교해 계산(§5) | 수동 확인 |
| REQ-FUNC-051 | 중대 경보 상단 텍스트 표시 | IMPLEMENT | 경보 단계 필드 기준 상단 배너, 텍스트 라벨 병기 | 수동 확인 |
| REQ-FUNC-052 | 국가 전체/지역 경보 범위 구분 | IMPLEMENT | `scope_type`, `scope_text` 정적 데이터 필드 | 수동 검수 |
| REQ-FUNC-053 | 긴급연락처(현지·영사콜센터) | IMPLEMENT | 정적 데이터 필드로 번호·링크 제공 | 수동 검수 |
| REQ-FUNC-054 | 공식 판단 대체 아님 고지 | IMPLEMENT | 안전 페이지·항공 요약에 고정 안내 문구 | 수동 확인 |
| REQ-FUNC-055 | Editor/Admin 작성·검수·게시 워크플로 | EXCLUDED | 전체 콘텐츠 CMS 제외(§6), 정적 데이터 직접 편집으로 대체 | 해당 없음 |
| REQ-FUNC-056 | 변경 이력(이전/이후/사유/담당자) 보존 | EXCLUDED | 범용 감사 로그 제외(§6), git 커밋 이력으로 대체 | 해당 없음 |

### 7.6 F6. About free_traveler

| ID | 요구사항 요약 | 분류 | 처리 방법 | 확인 방법 |
|---|---|---|---|---|
| REQ-FUNC-057 | 대표명·50+ Trips·30+ Countries 표시 | IMPLEMENT | 정적 프로필 데이터, 홈·대표 페이지 공용 소스 | 수동 확인 |
| REQ-FUNC-058 | 소개문·철학·편집 원칙 표시 | IMPLEMENT | PRD 확정 소개문을 정적 데이터로 반영 | 수동 확인 |
| REQ-FUNC-059 | 방문 권역/30개국 이상 목록 | IMPLEMENT | 정적 데이터 목록 렌더 | 수동 확인 |
| REQ-FUNC-060 | 여행 타임라인 | IMPLEMENT | 정적 데이터 목록 렌더 | 수동 확인 |
| REQ-FUNC-061 | 대표 이미지 대체텍스트·출처·작가·라이선스 | EXCLUDED | `alt` 텍스트만 사용, 출처·작가·라이선스 관리는 제외(§5) | 해당 없음 |
| REQ-FUNC-062 | 문의·SNS 링크 | IMPLEMENT | 정적 설정값, 허용 프로토콜만 렌더 | 수동 확인 |
| REQ-FUNC-063 | 추천 여행지 6곳 연결 | IMPLEMENT | 정적 여행지 데이터 중 6개를 지정해 링크 | 수동 확인 |

### 7.7 F7. Common, Admin, Governance

| ID | 요구사항 요약 | 분류 | 처리 방법 | 확인 방법 |
|---|---|---|---|---|
| REQ-FUNC-064 | 전역 내비게이션·푸터 | IMPLEMENT | `layout.tsx` 공통 레이아웃 | Playwright smoke |
| REQ-FUNC-065 | 반응형 레이아웃(320px~) | IMPLEMENT | Tailwind CSS 반응형 유틸리티 | 수동 확인(모바일 뷰포트) |
| REQ-FUNC-066 | 이메일 가입·인증·로그인·로그아웃·재설정 | IMPLEMENT | Supabase Auth 표준 기능 사용 | Playwright smoke |
| REQ-FUNC-067 | 여행지·안전정보 통합 검색 | EXCLUDED | 화면별 개별 검색(REQ-FUNC-003)으로 한정, 통합 검색 UI는 범위 밖 | 해당 없음 |
| REQ-FUNC-068 | 여행지 즐겨찾기 | IMPLEMENT | `localStorage` 기반(§5), 서버 저장 없음 | 수동 확인 |
| REQ-FUNC-069 | 공개 페이지 URL 공유 | EXCLUDED | Should 항목으로 후속 과제 | 해당 없음 |
| REQ-FUNC-070 | 페이지별 SEO 메타데이터 | IMPLEMENT | Next.js Metadata API로 title/description/canonical/OG 구성 | 수동 확인 |
| REQ-FUNC-071 | 행동 분석 이벤트 기록 | EXCLUDED | 분석 이벤트 파이프라인 구축은 범위 밖 | 해당 없음 |
| REQ-FUNC-072 | Editor/Admin 콘텐츠 CRUD·미리보기 | EXCLUDED | 전체 콘텐츠 CMS 제외(§6) | 해당 없음 |
| REQ-FUNC-073 | 미디어 업로드 시 출처·작가·라이선스 필수 입력 | EXCLUDED | 미디어 업로드·라이선스 승인 워크플로 제외(§6) | 해당 없음 |
| REQ-FUNC-074 | 게시 전 완전성 게이트 | EXCLUDED | CMS 게시 워크플로 성격, 정적 데이터는 작성 시 수동 확인으로 대체 | 해당 없음 |
| REQ-FUNC-075 | 안전정보 stale 대시보드 | EXCLUDED | 페이지별 stale 배지(REQ-FUNC-050)로 대체, 별도 대시보드 없음 | 해당 없음 |
| REQ-FUNC-076 | 관리자 변경·신고 처리 감사 로그 | EXCLUDED | 범용 감사 로그 제외(§6) | 해당 없음 |
| REQ-FUNC-077 | Admin 외부 URL 허용목록 설정 | IMPLEMENT | 관리자 탭에서 HTTPS·허용목록 검증 후 저장 | Playwright smoke |
| REQ-FUNC-078 | 404·500·권한없음·연결실패 복구 화면 | IMPLEMENT | Next.js `not-found`/`error` 페이지 + 재시도 버튼 | 수동 확인 |
| REQ-FUNC-079 | 폼·모달·탭·알림 ARIA/HTML 의미 | IMPLEMENT | 표준 HTML 시맨틱·ARIA 속성으로 컴포넌트 구현 | 수동 키보드 점검 |
| REQ-FUNC-080 | 약관·정책·안전수칙 동의 기록 | IMPLEMENT | 정책 문서 페이지 제공, 동행글 작성 시 동의 시각 Supabase 저장 | Playwright smoke |

---

## 8. 비기능 요구사항 처리표 (REQ-NF-001~034)

### 8.1 Performance

| ID | 요구사항 요약 | 분류 | 처리 방법 | 확인 방법 |
|---|---|---|---|---|
| REQ-NF-001 | LCP p75 ≤2.5s | IMPLEMENT | Next.js 기본 최적화(이미지·코드 분할) | 수동 Lighthouse 확인 |
| REQ-NF-002 | INP p75 ≤200ms | IMPLEMENT | 경량 클라이언트 상호작용 구현 | 수동 확인 |
| REQ-NF-003 | CLS p75 ≤0.1 | IMPLEMENT | 이미지 크기 고정, 레이아웃 안정성 고려 | 수동 Lighthouse 확인 |
| REQ-NF-004 | 필터 응답 p95≤1s(동시 50명) | EXCLUDED | 부하 테스트 제외(§6), 정적 데이터 특성상 응답성은 자연 확보 | 해당 없음 |
| REQ-NF-005 | 쓰기 API p95≤3s | IMPLEMENT | Supabase 쓰기 경로 기본 목표(부하 테스트는 제외) | 수동 확인 |
| REQ-NF-006 | 이미지 반응형·lazy load | IMPLEMENT | Next.js `Image` 컴포넌트 사용 | 수동 확인 |
| REQ-NF-007 | 배포 전 Lighthouse≥85 CI 게이트 | EXCLUDED | CI 자동 게이트/무인 병합 인프라 제외(§6), 배포 전 수동 확인으로 대체 | 해당 없음 |

### 8.2 Reliability and Recovery

| ID | 요구사항 요약 | 분류 | 처리 방법 | 확인 방법 |
|---|---|---|---|---|
| REQ-NF-008 | 월간 가용성 ≥99.5% | EXCLUDED | 가용성 모니터링 체계 미구축, Vercel 기본 인프라에 의존 | 해당 없음 |
| REQ-NF-009 | 내부 API 5xx ≤0.5% | EXCLUDED | 별도 오류율 모니터링 체계 미구축 | 해당 없음 |
| REQ-NF-010 | DB 백업 RPO≤24h/RTO≤8h | EXCLUDED | 자동 백업 제외(§6) | 해당 없음 |
| REQ-NF-011 | 주1회 링크 자동 점검·Admin 알림 | EXCLUDED | 자동 장애 알림 제외(§6), 배포 전 수동 링크 점검으로 대체 | 해당 없음 |

### 8.3 Security and Privacy

| ID | 요구사항 요약 | 분류 | 처리 방법 | 확인 방법 |
|---|---|---|---|---|
| REQ-NF-012 | TLS 1.2 이상 | IMPLEMENT | Vercel·Supabase 기본 제공 | 배포 설정 확인 |
| REQ-NF-013 | 인증·역할·RLS 서버 검증 | IMPLEMENT | Supabase RLS 정책(REQ-FUNC-044 연계) | 권한별 수동 접근 테스트 |
| REQ-NF-014 | CSRF 방어·SameSite 쿠키 | IMPLEMENT | Next.js 서버 액션 기본 보호 + SameSite 쿠키 설정 | 수동 확인 |
| REQ-NF-015 | 입력 검증·이스케이프, 저장 XSS 차단 | IMPLEMENT | 폼 검증 및 Supabase 파라미터 바인딩 | 수동 확인 |
| REQ-NF-016 | 비밀키 환경변수 관리 | IMPLEMENT | Vercel 환경변수, 클라이언트 번들 미포함 | 빌드 산출물 수동 확인 |
| REQ-NF-017 | 항공·호텔 원시 입력값 미보존 | IMPLEMENT | 서버 API 없음, 클라이언트 상태만 사용(REQ-FUNC-017/025 연계) | 네트워크 탭 수동 확인 |
| REQ-NF-018 | 개인정보 내보내기·탈퇴·삭제 요청 | EXCLUDED | 자동 파이프라인 미구축(REQ-FUNC-045와 동일 사유), 관리자 수동 처리 | 해당 없음 |

### 8.4 Safety and Moderation

| ID | 요구사항 요약 | 분류 | 처리 방법 | 확인 방법 |
|---|---|---|---|---|
| REQ-NF-019 | 신고 접수 응답 p95≤3s | IMPLEMENT | 경량 신고 제출 폼(REQ-FUNC-039 연계) | 수동 확인 |
| REQ-NF-020 | 신고 1차 검토 24h 이내 90% | EXCLUDED | 운영 SLA 측정 체계 미구축, 신고 상태 관리 UI만 제공 | 해당 없음 |
| REQ-NF-021 | 글·요청·신고 속도 제한(429) | EXCLUDED | Rate limiting 인프라는 범위 밖, 남용 발생 시 수동 신고 처리로 대응 | 해당 없음 |
| REQ-NF-022 | Moderator 조치 추적 가능성 | EXCLUDED | 범용 감사 로그 제외(§6) | 해당 없음 |

### 8.5 Accessibility

| ID | 요구사항 요약 | 분류 | 처리 방법 | 확인 방법 |
|---|---|---|---|---|
| REQ-NF-023 | WCAG 2.2 Level AA 목표 | IMPLEMENT | 시맨틱 HTML·명도 대비 등 설계 원칙 반영 | 수동 확인 |
| REQ-NF-024 | 자동 접근성 검사(axe) | EXCLUDED | 별도 접근성 자동화 스위트 구축은 범위 밖(Playwright는 핵심 흐름만 검증) | 해당 없음 |
| REQ-NF-025 | 키보드·스크린리더 수동 검사 | IMPLEMENT | 핵심 화면 대상 배포 전 수동 점검 | 수동 확인 |

### 8.6 Content, Freshness, SEO, Copyright

| ID | 요구사항 요약 | 분류 | 처리 방법 | 확인 방법 |
|---|---|---|---|---|
| REQ-NF-026 | 여행지 콘텐츠 완전성 100% | IMPLEMENT | 정적 데이터 작성 시 필수 필드 수동 확인 | 데이터 작성 체크리스트 |
| REQ-NF-027 | 해외 안전정보 커버리지 100% | IMPLEMENT | 정적 데이터로 소개 국가 전체 커버 | 데이터 작성 체크리스트 |
| REQ-NF-028 | 안전정보 7일 이내 확인 95%+/초과 시 경고 100% | IMPLEMENT | 경고 로직만 보장(REQ-FUNC-050), 실제 갱신 주기는 콘텐츠 운영 몫 | 수동 확인 |
| REQ-NF-029 | 미디어 라이선스 메타데이터 100% | EXCLUDED | 이미지 정책 변경으로 라이선스 메타데이터 자체를 관리하지 않음(§5) | 해당 없음 |
| REQ-NF-030 | 공개 페이지 SEO 메타데이터 누락 0건 | IMPLEMENT | Next.js Metadata API 적용(REQ-FUNC-070 연계) | 수동 확인 |

### 8.7 Maintainability, Monitoring, Cost

| ID | 요구사항 요약 | 분류 | 처리 방법 | 확인 방법 |
|---|---|---|---|---|
| REQ-NF-031 | TypeScript strict·lint·unit test 병합 전 통과 | IMPLEMENT | `tsconfig` strict, ESLint 유지; 별도 단위테스트 프레임워크 대신 Playwright smoke로 핵심 로직 검증, 병합은 수동 검토(무인 자동 Merge 없음) | PR 리뷰 시 수동 확인 |
| REQ-NF-032 | 구조화 로그 | EXCLUDED | 별도 로깅 파이프라인 구축은 범위 밖, 콘솔 로그 수준으로 대체 | 해당 없음 |
| REQ-NF-033 | 핵심 오류 5분 이내 알림 | EXCLUDED | 장애 알림 자동화 제외(§6) | 해당 없음 |
| REQ-NF-034 | MVP 월 인프라 비용 ≤10만원 | IMPLEMENT | Vercel·Supabase 무료/저가 티어 사용(EC2·AWS 미사용) | 요금제 선택 시 확인 |

---

## 9. 참고 — 테스트와 배포

| 항목 | 범위 |
|---|---|
| Playwright 핵심 Smoke Test | 여행지 검색·상세, 안전정보 열람, 항공·호텔 요약·외부 이동, 회원가입·성인확인, 동행글 작성·참가 요청·승인, 신고·차단, 관리자 신고 상태 변경 |
| 배포 | Vercel, 환경변수로 `FLIGHT_OUTBOUND_URL`/`HOTEL_OUTBOUND_URL`/`MOFA_SAFETY_URL` 등 외부 URL 관리 |
