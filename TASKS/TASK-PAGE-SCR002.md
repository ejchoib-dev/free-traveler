# PAGE-SCR002 — 대표 소개 페이지 조립

| 항목 | 값 |
|---|---|
| Task ID | `PAGE-SCR002` |
| Category | PAGE_OWNER |
| Implementation Status | IMPLEMENT |
| Priority | M |
| Seq(Task List) | 11 |

## Context

이 Task는 `TASKS/00_TASK_LIST.md`의 Seq 11번 행(`PAGE-SCR002`, Category=PAGE_OWNER)을 실제 개발 가능한 단위로 구체화한 것이다. 제목: **대표 소개 페이지 조립**. 근거 문서: `docs/06_SRS_UIUX_REVISED.md`(Requirement 원문), `design-reference/UI_CONTRACT.md`/`design-reference/D-001/DESIGN.md`(디자인 계약).

## Project Scope

Implementation Status: **IMPLEMENT** (`docs/PROJECT_SCOPE.md` 기준, `docs/UIUX_TRACEABILITY.md`와 일치)

PROJECT_SCOPE.md §5, docs/PROJECT_SCOPE.md §6: 이 프로젝트는 예약·결제를 대행하지 않는 정보/커뮤니티 허브다. 내부 예약/결제 UI, 광고, 별점, 실시간 가격을 만들지 않는다.

## Requirement Ref

REQ-FUNC-057, REQ-FUNC-058, REQ-FUNC-059, REQ-FUNC-060, REQ-FUNC-062, REQ-FUNC-063, REQ-FUNC-064, REQ-FUNC-065, REQ-FUNC-070, REQ-FUNC-079

## Screen / Route / Page Entry

| Screen | Route | Page Entry |
|---|---|---|
| SCR-002 | `/about` | `src/app/about/page.tsx` |

## Design Ref

- `design-reference/UI_CONTRACT.md` — SCR-002 절(영역 순서·주요 Component·상태·이동·금지 기능)
- `design-reference/D-001/DESIGN.md` §19 — SCR-002 Section 순서와 최소 콘텐츠 수
- `design-reference/D-001/DESIGN.md` §2~13 — Color/Typography/Spacing/Radius/Shadow/Header·Footer/컴포넌트 패턴
- `design-reference/D-001/DESIGN.md` §14·§20 — Empty State·Placeholder 금지 규칙
- `design-reference/D-001/DESIGN.md` §21 — Do / Do Not
- `design-reference/D-001/DESIGN.md` §15~17 — Desktop·Mobile 규칙, Section 최대 폭·여백, Hero 높이 규칙

## Depends On

COMP-SCR002-HERO, COMP-SCR002-STATS, COMP-SCR002-STORY, COMP-SCR002-TIMELINE, COMP-SCR002-COUNTRIES, COMP-SCR002-GALLERY, COMP-SCR002-RECOMMEND-CTA, DATA-REPRESENTATIVE, DATA-DESTINATIONS, SHARED-LAYOUT

## Expected Files

신규 생성: `src/app/about/page.tsx`

이 Task는 위에 적힌 파일 **이외의 어떤 파일도 수정하지 않는다**(§Forbidden 참조). 파일 생성 직전에 실제 트리를 다시 확인해 "신규 생성"/"수정"을 재판단한다.

## Functional AC

- Section 순서 Profile Hero→여행 지표→소개·철학→Timeline 6→방문국가 30→Gallery 8→기억에 남는 여행지 4+CTA가 정확히 이 순서로 조립된다

## Visual AC

- Section 순서·데이터 출처(전부 DATA-REPRESENTATIVE
- 추천 카드만 DATA-DESTINATIONS 병행) 고정. 최소 콘텐츠 수: 통계 카드 3·Timeline 6·방문국가 Chip 30·Gallery 8·추천 카드 4. 반응형: Gallery Desktop 4열→Mobile 2열 이하(D-001 §15). Lorem ipsum·'준비 중'·빈 Card 금지
- 완성형 Empty State 규칙(정적 콘텐츠라 평상시 Empty 없음
- 이미지 로드 실패 시에도 캡션 유지)

## Security/Privacy AC

- 대표 이미지 alt 텍스트 필수(라이선스 메타데이터 자체는 REQ-FUNC-061 EXCLUDED)

## Test Cases

- TC-FUNC-057: `REQ-FUNC-057` 수용 기준을 검증(`docs/06_SRS_UIUX_REVISED.md` 해당 행 Acceptance Criteria 참조)
- TC-FUNC-058: `REQ-FUNC-058` 수용 기준을 검증(`docs/06_SRS_UIUX_REVISED.md` 해당 행 Acceptance Criteria 참조)
- TC-FUNC-059: `REQ-FUNC-059` 수용 기준을 검증(`docs/06_SRS_UIUX_REVISED.md` 해당 행 Acceptance Criteria 참조)
- TC-FUNC-060: `REQ-FUNC-060` 수용 기준을 검증(`docs/06_SRS_UIUX_REVISED.md` 해당 행 Acceptance Criteria 참조)
- TC-FUNC-062: `REQ-FUNC-062` 수용 기준을 검증(`docs/06_SRS_UIUX_REVISED.md` 해당 행 Acceptance Criteria 참조)
- TC-FUNC-063: `REQ-FUNC-063` 수용 기준을 검증(`docs/06_SRS_UIUX_REVISED.md` 해당 행 Acceptance Criteria 참조)
- TC-FUNC-064: `REQ-FUNC-064` 수용 기준을 검증(`docs/06_SRS_UIUX_REVISED.md` 해당 행 Acceptance Criteria 참조)
- TC-FUNC-065: `REQ-FUNC-065` 수용 기준을 검증(`docs/06_SRS_UIUX_REVISED.md` 해당 행 Acceptance Criteria 참조)
- TC-FUNC-070: `REQ-FUNC-070` 수용 기준을 검증(`docs/06_SRS_UIUX_REVISED.md` 해당 행 Acceptance Criteria 참조)
- TC-FUNC-079: `REQ-FUNC-079` 수용 기준을 검증(`docs/06_SRS_UIUX_REVISED.md` 해당 행 Acceptance Criteria 참조)
- 추가 검증: E2E-PUBLIC-SMOKE에서 이 Task의 결과를 다시 확인

## Verify

E2E-PUBLIC-SMOKE

## Definition of Done

- [ ] 'Expected Files'에 적힌 파일이 모두 존재하고, 그 밖의 파일은 수정되지 않았다
- [ ] 'Functional AC'의 모든 항목이 실제 동작으로 확인된다
- [ ] 'Visual AC'의 모든 항목이 `design-reference/D-001/DESIGN.md`·`UI_CONTRACT.md` 기준과 일치한다
- [ ] 'Security/Privacy AC'가 전부 충족된다(해당 없음인 경우 생략)
- [ ] 'Forbidden'에 적힌 어떤 항목도 위반하지 않았다
- [ ] 'Verify'에 지정된 E2E-PUBLIC-SMOKE가 통과한다
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
