# PAGE-SCR005 — 계정 페이지 조립

| 항목 | 값 |
|---|---|
| Task ID | `PAGE-SCR005` |
| Category | PAGE_OWNER |
| Implementation Status | IMPLEMENT |
| Priority | M |
| Seq(Task List) | 32 |

## Context

이 Task는 `TASKS/00_TASK_LIST.md`의 Seq 32번 행(`PAGE-SCR005`, Category=PAGE_OWNER)을 실제 개발 가능한 단위로 구체화한 것이다. 제목: **계정 페이지 조립**. 근거 문서: `docs/06_SRS_UIUX_REVISED.md`(Requirement 원문), `design-reference/UI_CONTRACT.md`/`design-reference/D-001/DESIGN.md`(디자인 계약).

## Project Scope

Implementation Status: **IMPLEMENT** (`docs/PROJECT_SCOPE.md` 기준, `docs/UIUX_TRACEABILITY.md`와 일치)

PROJECT_SCOPE.md §5, docs/PROJECT_SCOPE.md §6: 이 프로젝트는 예약·결제를 대행하지 않는 정보/커뮤니티 허브다. 내부 예약/결제 UI, 광고, 별점, 실시간 가격을 만들지 않는다.

## Requirement Ref

REQ-FUNC-064, REQ-FUNC-065, REQ-FUNC-070, REQ-FUNC-079

## Screen / Route / Page Entry

| Screen | Route | Page Entry |
|---|---|---|
| SCR-005 | `/account` | `src/app/account/page.tsx` |

## Design Ref

- `design-reference/UI_CONTRACT.md` — SCR-005 절(영역 순서·주요 Component·상태·이동·금지 기능)
- `design-reference/D-001/DESIGN.md` §19 — SCR-005 Section 순서와 최소 콘텐츠 수
- `design-reference/D-001/DESIGN.md` §2~13 — Color/Typography/Spacing/Radius/Shadow/Header·Footer/컴포넌트 패턴
- `design-reference/D-001/DESIGN.md` §14·§20 — Empty State·Placeholder 금지 규칙
- `design-reference/D-001/DESIGN.md` §21 — Do / Do Not
- `design-reference/D-001/DESIGN.md` §15~17 — Desktop·Mobile 규칙, Section 최대 폭·여백, Hero 높이 규칙

## Depends On

COMP-SCR005-AUTH, COMP-SCR005-PROFILE, COMP-SCR005-MY-ACTIVITY, COMP-SCR005-ADMIN, DB-ACCESS, SHARED-AUTH-SETUP, SHARED-LAYOUT

## Expected Files

신규 생성: `src/app/account/page.tsx`

이 Task는 위에 적힌 파일 **이외의 어떤 파일도 수정하지 않는다**(§Forbidden 참조). 파일 생성 직전에 실제 트리를 다시 확인해 "신규 생성"/"수정"을 재판단한다.

## Functional AC

- Guest·Member·Admin 중 현재 역할의 Intro→핵심 작업→도움말/다음 행동이 조립되고
- 역할에 없는 관리 영역(예: 일반 회원의 관리자 탭)은 렌더링하지 않는다
- 권한 없는 탭에 직접 접근(예: 조작된 클라이언트 상태·쿼리)이 감지되면 "권한이 없습니다" 안내와 함께 프로필 탭으로 이동시킨다(Unauthorized, `design-reference/UI_CONTRACT.md` SCR-005 상태 행)

## Visual AC

- Section 순서: 역할별로 다름(Guest=탭 없음 단일 화면 4블록
- Member=[프로필][내 활동] 2탭
- Admin=+[관리자] 1탭) — 순서는 UI_CONTRACT.md SCR-005 정의 고정. 데이터 출처: 전부 DB-ACCESS. 최소 콘텐츠: Guest 4블록
- Member 2탭 각 최소 1개 콘텐츠 블록
- Admin 신고 목록+URL 설정 폼. Lorem ipsum·'준비 중'·빈 Card 금지
- 내 글/참가요청/차단목록 0건은 완성형 Empty State(설명+CTA)

## Security/Privacy AC

- 권한 없는 탭 직접 접근 시 "권한이 없습니다"+프로필 탭 이동(서버에서도 역할 재검증)

## Test Cases

- TC-FUNC-064: `REQ-FUNC-064` 수용 기준을 검증(`docs/06_SRS_UIUX_REVISED.md` 해당 행 Acceptance Criteria 참조)
- TC-FUNC-065: `REQ-FUNC-065` 수용 기준을 검증(`docs/06_SRS_UIUX_REVISED.md` 해당 행 Acceptance Criteria 참조)
- TC-FUNC-070: `REQ-FUNC-070` 수용 기준을 검증(`docs/06_SRS_UIUX_REVISED.md` 해당 행 Acceptance Criteria 참조)
- TC-FUNC-079: `REQ-FUNC-079` 수용 기준을 검증(`docs/06_SRS_UIUX_REVISED.md` 해당 행 Acceptance Criteria 참조)
- 추가 검증: E2E-MATE-AUTH에서 이 Task의 결과를 다시 확인

## Verify

E2E-MATE-AUTH

## Definition of Done

- [ ] 'Expected Files'에 적힌 파일이 모두 존재하고, 그 밖의 파일은 수정되지 않았다
- [ ] 'Functional AC'의 모든 항목이 실제 동작으로 확인된다
- [ ] 'Visual AC'의 모든 항목이 `design-reference/D-001/DESIGN.md`·`UI_CONTRACT.md` 기준과 일치한다
- [ ] 'Security/Privacy AC'가 전부 충족된다(해당 없음인 경우 생략)
- [ ] 'Forbidden'에 적힌 어떤 항목도 위반하지 않았다
- [ ] 'Verify'에 지정된 E2E-MATE-AUTH가 통과한다
- [ ] `docs/UIUX_TRACEABILITY.md`에서 이 Task가 커버하는 Requirement의 Status를 갱신할 준비가 되었다

## Forbidden

- **Expected Files 목록 밖의 파일을 수정하지 않는다.** 이 Task가 건드릴 수 있는 파일은 위 'Expected Files' 절에 적힌 경로가 전부다.
- Airbnb 상표 요소(Rausch 색상, Cereal 서체, Guest favorite 배지, 하트 저장 아이콘, 3-프로덕트 내비게이션, 별점) 재현 금지(D-001 §21)
- 구매·예약·결제 UI, 나이트리 가격, 실시간 항공권/호텔 가격 표시 금지(D-001 §21)
- Cereal VF 등 Proprietary 폰트 파일 포함 금지, Inter(오픈소스)만 사용(D-001 §3)
- design-reference/D-001/DESIGN.md §2에 없는 임의 색상 추가 금지
- Lorem ipsum·'준비 중'·'정보 확인 필요'·내용 없는 Card 금지(D-001 §14·§20)
- **하위 Component를 이 Task 안에서 새로 만들지 않는다.** Page Owner는 이미 완료된 Component/Data/DB Task의 산출물을 실제 Route Page 파일에 조립하는 것만 범위로 한다(Component 자체의 구현은 해당 COMP-* Task의 책임).
- 이 Task 범위에서 EXCLUDED Requirement(예: 콘텐츠 CMS, 감사 로그, 계정 제재, 통합 검색 등)를 구현하지 않는다.
