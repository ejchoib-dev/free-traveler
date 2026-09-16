# Design Manifest — Traveler

| 항목 | 값 |
|---|---|
| Active Design Version | D-001 |
| Status | LOCKED |
| Active File | `design-reference/D-001/DESIGN.md` |
| Vendor Reference | `design-reference/vendor/airbnb/DESIGN.md` |
| Approved Screens | SCR-001, SCR-002, SCR-003, SCR-004, SCR-005 |
| Mobile Variants | SCR-001, SCR-003 |
| Stitch Project ID | `3309361813167776154` |
| 근거 문서 | `docs/04_UIUX_PLAN.md`, `docs/STITCH_VALIDATION_REPORT.md` |
| 최종 갱신일 | 2026-09-15 |

## 상태 규칙

- `Status: LOCKED`인 동안 `design-reference/D-001/DESIGN.md`는 이 프로젝트의 유일한 디자인 정본이며, 구현 시 이 문서와 상충하는 임의 스타일 결정을 허용하지 않는다.
- 새 디자인 버전이 필요하면 `D-002` 디렉터리를 새로 만들고, 이 Manifest의 `Active Design Version`/`Active File`을 갱신하는 방식으로만 전환한다. `D-001/DESIGN.md`를 직접 덮어써서 버전을 올리지 않는다.

## 참고 — 미해결 항목(Known Open Items)

`docs/STITCH_VALIDATION_REPORT.md` 기준으로 아래 항목은 Approved 상태와 별개로 사람의 후속 결정이 필요하다:

- SCR-005: Admin 탭(신고 상태 변경, 외부 URL 설정)과 Guest 로그인 화면이 아직 Stitch 내보내기에 없음
- SCR-001: 데스크톱 후보안(`_scr_001_1` vs `_scr_001_2`) 중 최종 채택안 미지정
- SCR-001·SCR-002: 이미지가 임시/서명된 외부 URL(`lh3.googleusercontent.com`)에 의존 — 프로덕션 반영 전 자체 호스팅 검토 필요
