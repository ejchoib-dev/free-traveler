# COMP-LEGAL-DOCS — 정책 문서 4종(이용약관·개인정보처리방침·동행 안전수칙·콘텐츠 면책)

| 항목 | 값 |
|---|---|
| Task ID | `COMP-LEGAL-DOCS` |
| Category | COMPONENT |
| Implementation Status | IMPLEMENT |
| Priority | S |
| Seq(Task List) | 61 |

## Context

이 Task는 `docs/DECISION_LOG.md` DEC-015로 새로 추가됐다. `design-reference/D-001/DESIGN.md` §7과
REQ-FUNC-064·080은 Footer에 이용약관·개인정보처리방침·동행 안전수칙·콘텐츠 면책 안내 링크 4개를
요구하지만, 확정된 5개 Screen(SCR-001~005)에는 이 정책 본문을 담을 Page가 없었다(`SHARED-LAYOUT`의
Footer 구현 중 발견한 문서 간 공백). REQ-FUNC-080을 참조하는 다른 Task(`PAGE-SCR003`,
`COMP-SCR003-MATE-WRITE`, `COMP-SCR004-SAFETY-GUIDE`)는 동의 체크박스·안전 배너만 만들 뿐 정책
본문 페이지 자체는 만들지 않으므로, 이 Task가 그 본문 4개를 정적 페이지로 제공한다.

## Project Scope

Implementation Status: **IMPLEMENT** (`docs/PROJECT_SCOPE.md` REQ-FUNC-080 행 "정책 문서 페이지 제공"
기준, `docs/DECISION_LOG.md` DEC-015로 범위 확정)

이 Task가 만드는 4개 경로는 `design-reference/SCREEN_ROUTE_CONTRACT.json`의 `screens`(5개, 핵심
4·보조 1)가 아니라 `technical_routes`에 `type: "policy_page"`로 기록되어 있다. **Screen 개수·역할
구성은 바뀌지 않는다**(DEC-002 유지). 이 Task는 `PAGE_OWNER`로 분류하지 않는다.

## Requirement Ref

REQ-FUNC-080

## Screen / Route / Page Entry

| Screen | Route | Page Entry |
|---|---|---|
| 해당없음(5개 Screen 밖, DEC-015) | `/legal/terms`, `/legal/privacy`, `/legal/companion-guidelines`, `/legal/content-disclaimer` | `src/app/legal/terms/page.tsx` |

## Design Ref

- `design-reference/D-001/DESIGN.md` §3 — Typography 토큰만 사용(본문 텍스트 페이지, 카드/그리드 없음)
- `design-reference/D-001/DESIGN.md` §21 — Do / Do Not
- 별도 Header/Footer를 새로 만들지 않고 `SHARED-LAYOUT`의 전역 `src/app/layout.tsx` Header/Footer를
  그대로 재사용한다(App Router 규칙상 `src/app/legal/**/page.tsx`는 자동으로 Root Layout에 감싸인다)

## Depends On

SHARED-LAYOUT

## Expected Files

신규 생성: `src/app/legal/terms/page.tsx`, `src/app/legal/privacy/page.tsx`,
`src/app/legal/companion-guidelines/page.tsx`, `src/app/legal/content-disclaimer/page.tsx`

이 Task는 위에 적힌 파일 **이외의 어떤 파일도 수정하지 않는다**(§Forbidden 참조). 파일 생성 직전에
실제 트리를 다시 확인해 "신규 생성"/"수정"을 재판단한다.

## Functional AC

- 4개 정책 페이지가 각각 실제 텍스트 콘텐츠(Lorem ipsum·"준비 중" 아님)로 존재한다
- `SHARED-LAYOUT`의 Footer "정책" 열 링크 4개가 이 4개 경로와 정확히 1:1로 연결된다
- 각 페이지는 `title`/`description` 메타데이터를 가진다(`src/app/layout.tsx`의 메타데이터 헬퍼 사용)

## Visual AC

- 별도 시각 디자인을 새로 만들지 않는다 — 전역 Header/Footer만 재사용하고 본문은 D-001 §3
  Typography 토큰(`display-lg` 제목, `body-md` 본문)만 사용한다
- Empty State/Placeholder 금지 규칙(D-001 §14·§20) 준수 — 실제 정책 문안을 채운다

## Security/Privacy AC

- 없음(정적 텍스트, 서버 저장·사용자 입력 없음)

## Test Cases

- TC-FUNC-080: `REQ-FUNC-080` 수용 기준(정책 문서 제공 부분) 검증(`docs/06_SRS_UIUX_REVISED.md` 해당 행 참조)
- 추가 검증: `npm run screen:contract`(DEC-015로 허용된 `/legal/*` 경로인지) 에서 이 Task의 결과를 다시 확인

## Verify

해당 없음(수동 확인 — 4개 페이지 텍스트 렌더링·Footer 링크 연결 확인)

## Definition of Done

- [ ] 'Expected Files'에 적힌 파일이 모두 존재하고, 그 밖의 파일은 수정되지 않았다
- [ ] 'Functional AC'의 모든 항목이 실제 동작으로 확인된다
- [ ] 'Visual AC'의 모든 항목이 `design-reference/D-001/DESIGN.md` 기준과 일치한다
- [ ] 'Security/Privacy AC'가 전부 충족된다(해당 없음이므로 생략)
- [ ] 'Forbidden'에 적힌 어떤 항목도 위반하지 않았다
- [ ] `npm run screen:contract`가 이 Task의 새 경로를 오탐하지 않는다(DEC-015, `scripts/check_screen_contract.py` `TECH_ROUTE_PREFIXES`에 `/legal/` 포함 확인)
- [ ] `docs/UIUX_TRACEABILITY.md`에서 이 Task가 커버하는 Requirement의 Status를 갱신할 준비가 되었다

## Forbidden

- **Expected Files 목록 밖의 파일을 수정하지 않는다.** 이 Task가 건드릴 수 있는 파일은 위 'Expected
  Files' 절에 적힌 경로가 전부다(`src/app/layout.tsx`·`Header.tsx`·`Footer.tsx`는 이미 `SHARED-LAYOUT`이
  만들었으므로 이 Task에서 수정하지 않는다).
- 새 Screen을 추가하거나 `design-reference/SCREEN_ROUTE_CONTRACT.json`의 `screens`(5개) 배열에
  이 경로를 넣지 않는다 — 반드시 `technical_routes`(`policy_page`)로만 유지한다.
- 이 Task 범위에서 EXCLUDED Requirement(예: 콘텐츠 CMS, 감사 로그, 계정 제재, 통합 검색 등)를
  구현하지 않는다.
