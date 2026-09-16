# D-001 — Free Traveler Design Reference (정본)

| 항목 | 내용 |
|---|---|
| Design Version | D-001 |
| Status | LOCKED |
| 기준 문서 | `design-reference/vendor/airbnb/DESIGN.md`(구조 참고본), `docs/04_UIUX_PLAN.md`, `docs/STITCH_VALIDATION_REPORT.md`, 승인된 Stitch Screen(SCR-001~005, Project ID `3309361813167776154`) |
| 적용 대상 | Traveler 앱 5개 화면(SCR-001~005) 전체 |

이 문서는 Traveler 프로젝트의 **유일한 디자인 정본**이다. Airbnb 참고본(`vendor/airbnb/DESIGN.md`)은 구조적 패턴(단일 포인트 컬러, 부드러운 라운드, 얕은 그림자 1단계, 카드 밀도 대비 여백, 목록+상세 sticky 레일)만 참고했고, Rausch 색상·Cereal 서체·Guest favorite 배지·하트 저장·3-프로덕트 내비게이션·별점 등 **Airbnb 고유 상표·아이덴티티 요소는 포함하지 않는다.**

---

## 1. Visual Theme

Free Traveler는 "신뢰할 수 있는 여행 정보 허브"를 지향한다. 화려한 마케팅보다 정보의 명확성과 안전 고지를 우선하며, 흰 캔버스 + 짙은 회색 텍스트 + 코랄 포인트 컬러 1가지만 절제해서 반복 사용한다. 이 서비스는 예약·결제를 대행하지 않는 **정보/커뮤니티 허브**이며, 항공·숙소는 외부 사이트로 새 탭 연결만 한다.

---

## 2. Color Token

| 토큰 | 값 | 용도 |
|---|---|---|
| `color.primary` | `#FF6B4A` | 주요 CTA, 활성 탭 밑줄, 선택된 Chip |
| `color.primary-active` | `#E24F2E` | 코랄 버튼 눌림 상태 |
| `color.primary-disabled` | `#FFD8CC` | 비활성 코랄 버튼 |
| `color.ink` | `#26262A` | 제목, 본문 기본 텍스트 |
| `color.body` | `#46484D` | 설명문, 카드 메타 텍스트 |
| `color.muted` | `#71737B` | 보조 라벨, placeholder |
| `color.muted-soft` | `#A0A2AA` | 비활성 텍스트 |
| `color.canvas` | `#FFFFFF` | 페이지 배경(전 화면 공통, 다크모드 없음) |
| `color.surface-soft` | `#F7F7F8` | 입력 필드 배경, 보조 밴드 배경 |
| `color.surface-strong` | `#EFEFF1` | 아이콘 버튼, 비활성 필드 배경 |
| `color.hairline` | `#E3E3E6` | 카드·구분선 1px 테두리 |
| `color.hairline-soft` | `#ECECEE` | 긴 목록 내부 구분선 |
| `color.border-strong` | `#C6C7CC` | 포커스 이전 입력 테두리 |
| `color.on-primary` | `#FFFFFF` | 코랄 버튼 위 텍스트 |
| 오류 | `#D1373F` / `#FDECEC` | 폼 검증 오류, 이동 실패 |
| 경고/최신성 | `#B7791F` / `#FFF4DE` | 안전정보 stale(7일 경과) 경고 |
| 안전 중대경보 | `#B42318` / `#FBE7E5` | 여행금지·출국권고 등 중대 단계 배너 |
| 안내/정보 | `#2F6FED` / `#EAF1FE` | 입력값 비전달 고지, 일반 안내 배너 |
| 완료/성공 | `#147D53` / `#E7F6EE` | 제출 완료, 승인 상태 배지 |

규칙: 코랄은 화면당 주요 CTA 1~2곳에만 사용한다. Semantic 색상(오류/경고/중대경보/안내/완료)은 항상 텍스트 라벨과 함께 표시하며 색상만으로 의미를 전달하지 않는다. **위 표에 없는 색상은 어떤 화면에도 새로 추가하지 않는다.**

---

## 3. Typography

| 토큰 | 크기/굵기 | 용도 |
|---|---|---|
| `type.display-xl` | 32px / 700 | 홈 Hero 제목 |
| `type.display-lg` | 24px / 700 | Screen 대표 제목 |
| `type.display-md` | 20px / 600 | Section 제목 |
| `type.title-md` | 18px / 600 | 카드 제목 |
| `type.title-sm` | 16px / 600 | 폼 라벨, 탭 라벨 |
| `type.body-md` | 16px / 400 | 기본 본문 |
| `type.body-sm` | 14px / 400 | 카드 메타, 캡션 |
| `type.caption` | 13px / 500 | 배지, 보조 라벨 |
| `type.button` | 16px / 600 | 버튼 라벨 |

폰트 스택: `Inter, -apple-system, 'Apple SD Gothic Neo', 'Malgun Gothic', 'Noto Sans KR', system-ui, sans-serif`. Inter는 오픈소스 웹폰트(Google Fonts CDN)이며, Inter에는 한글 글리프가 없어 한글은 시스템 fallback 폰트로 자동 렌더링된다. **Cereal VF 등 라이선스가 필요한 Proprietary 폰트 파일은 어떤 형태로도 프로젝트에 포함하지 않는다.**

---

## 4. Spacing

| 토큰 | 값 |
|---|---|
| `space.xxs~xxl` | 2 / 4 / 8 / 12 / 16 / 24 / 32 / 48px |
| `space.section-desktop` | 64~96px (Hero 64px, 표준 Section 80px, CTA Banner 96px) |
| `space.section-mobile` | 40~64px (표준 48px, Hero·CTA는 40px) |

카드 내부 패딩·그리드 거터 등 세부 값은 8px 기준 배수 체계를 따른다.

---

## 5. Radius

| 토큰 | 값 |
|---|---|
| `radius.sm` | 8px — 입력 필드, 버튼 |
| `radius.md` | 12px — 카드 |
| `radius.lg` | 16px — Drawer |
| `radius.full` | 9999px — Chip, 배지, pill 버튼 |

하드 코너(radius 0)는 페이지 전체 그리드 외에는 사용하지 않는다.

---

## 6. Shadow

`shadow.card`: `0 1px 2px rgba(20,20,20,.04), 0 4px 12px rgba(20,20,20,.08)` — **유일한 그림자 단계**이며 카드 hover, Drawer, 드롭다운에만 사용한다. 그 외 모든 표면(Hero, Section 배경, Footer 등)은 그림자 없이 평평하게 유지한다. 단계별(elevation tier) 그림자 체계를 새로 만들지 않는다.

---

## 7. Header · Footer (5개 화면 공용)

### Header

| 항목 | Desktop(1440) | Mobile(390) |
|---|---|---|
| 높이 | 72px | 56px |
| 좌측 | "Free Traveler" 텍스트 워드마크(아이콘/로고 마크 아님) → `/` | 동일 |
| 중앙/우측 | 내비게이션 링크 3개: 여행 준비(`/travel-tools`), 동행 찾기(`/mates`), 대표 소개(`/about`) | 숨김 → 햄버거 시트 |
| 우측 끝 | 계정 아이콘 버튼 → `/account` | 아이콘만 |

### Footer

3열(Desktop) → 1열(Mobile): [서비스](여행 준비/동행 찾기/대표 소개/안전정보), [정책](이용약관/개인정보처리방침/동행 안전수칙/콘텐츠 면책), [안내](공식 출처: 외교부 해외안전여행 링크, 문의). 하단 고정 고지문: "본 서비스는 항공·호텔 예약을 대행하지 않으며, 안전정보는 공식 출처 확인을 대체하지 않습니다."

---

## 8. Search · Filter

- 검색창(SCR-001 Hero): 흰 배경, `radius.sm`~pill 형태, hairline 테두리, placeholder는 muted 컬러, 우측 또는 인접에 코랄 버튼 1개.
- 필터(SCR-004): 좌우 분할 중 좌측에 국가 select, 기간 range, 모집상태 토글, 여행스타일 Chip 목록을 배치하고 우측에 "총 N건" 결과 요약을 함께 노출한다.
- 필터·검색 입력 요소도 버튼과 동일하게 44×44px 이상 터치 영역을 확보한다.

---

## 9. Destination Card

- 구성: 사진(상단, `radius.md` 클리핑) + 지역명(title-md) + 한줄 소개(body-sm, muted) + 테마/국가 Chip.
- 해외 카드는 "안전정보 보기" 링크를 카드 내부에 추가로 포함한다.
- 이미지는 반드시 실제 장소를 설명하는 한글 alt 텍스트를 갖는다(예: "제주 성산일출봉 앞 유채꽃밭"). 외부 임시 URL(예: 서명된 CDN 링크)에 의존할 경우 프로덕션 반영 전 자체 호스팅으로 교체한다.
- Card Grid는 Desktop 3~4열 / Tablet 2열 / Mobile 1열.

---

## 10. Form · Tabs

- **탭**: pill 또는 underline 스타일, 활성 탭은 코랄 밑줄 + `color.primary` 텍스트, 비활성은 `color.muted`. 각 탭은 독립된 입력값·검증·완료 상태를 유지하며 다른 탭으로 이동해도 값이 보존된다(예: SCR-003 항공/숙소/동행구하기 3탭).
- **입력 필드**: `radius.sm`, hairline 테두리, 포커스 시 2px 코랄 테두리(`:focus-visible`만, 마우스 클릭 시 표시 안 함).
- **검증 오류**: 테두리를 오류 semantic color로 바꾸고, 입력 아래 아이콘+오류 문구를 함께 표시한다. 색상만으로 오류를 표시하지 않는다.
- 하나의 참고 화면 안에서 여러 상태(Error/Success 등)를 나란히 보여줄 때는 반드시 주석 또는 라벨로 "상태 시연용"임을 명시해 실제 동시 발생 상태로 오인되지 않게 한다.

---

## 11. Mate Post Card

- 구성: 제목(title-md), 국가/지역, 기간, 모집인원(N/M명), 여행스타일 Chip, 상태 배지(모집중=경고 semantic color 계열/마감=muted 배지).
- 목록은 최대 8개까지 우선 노출하고 초과분은 페이지네이션/더보기로 처리한다.
- 카드에는 사진을 요구하지 않는다(텍스트 메타 중심 카드).

---

## 12. Drawer · Modal

- **Desktop**: 우측 슬라이드 패널, 폭 520px, `shadow.card` 적용.
- **Mobile**: 하단 시트, 높이 92%.
- 여행지 상세 Drawer는 REQ-FUNC-004 필수 항목(소개/명소/시기/일정/예산/교통/음식/에티켓/출처)을 순서대로 배치하고, 해외 여행지는 하단에 "국가 안전정보 보기"로 안전정보 Drawer를 같은 스택 위에 이어서 연다.
- 안전정보 Drawer는 8개 카테고리 + 출처·확인일 + stale 경고 배지 + 외교부 링크(새 탭) + 중대경보 시 상단 고정 배너로 구성한다.

---

## 13. Alert · Toast

- 배너/토스트는 항상 semantic color(§2) + 텍스트 라벨 조합으로 표시하며, 색상 단독으로 의미를 전달하지 않는다.
- 정보 고지(예: "입력값은 서버에 저장되지 않습니다")는 `안내/정보` 토큰을 사용한다.
- 안전 중대경보는 상단 고정 배너로, 다른 토스트보다 우선 노출한다.

---

## 14. Loading · Empty · Error 상태

| 상태 | 처리 규칙 |
|---|---|
| Loading | 카드 스켈레톤(회색 블록 + 텍스트 라인) 또는 셀렉트 비활성+스피너. 빈 화면으로 두지 않는다 |
| Empty | **설명 문장 + 이용 방법 요약 + 다음 행동 CTA**를 항상 함께 표시한다(예: "아직 등록된 동행글이 없습니다" + 3단계 요약 + "동행글 작성하기" CTA). 설명·CTA 없는 빈 화면(bare blank state)은 금지 |
| Error | 오류 semantic color + "무엇이 실패했는지" 문구 + 재시도/대안 행동 버튼을 함께 표시 |
| Unauthorized | 권한 안내 문구 + 로그인/이동 CTA로 대체(빈 화면 대신 사용) |

---

## 15. Desktop · Mobile 규칙

| 기준 | 폭 | 규칙 |
|---|---|---|
| Desktop 기준 | 1440px | 콘텐츠는 container-max로 중앙 정렬 |
| Tablet | 744~1128px | Card Grid 3→2열, 좌우 분할 비율 유지·폭만 축소 |
| Mobile 기준 | 390px | Card 1열, Drawer는 하단 시트로 전환, Header 내비게이션은 햄버거로 접힘 |

모든 인터랙티브 요소(버튼/탭/Chip 포함)는 44×44px 이상 터치 영역을 갖는다.

---

## 16. Page Section 최대 폭과 Desktop·Mobile 상하 여백

- `layout.container-max`: 1200~1280px(기본 1240px), Section 콘텐츠 폭에 따라 조정.
- Desktop Section 상하 여백: Hero 64px, 표준 Section 80px, CTA Banner 96px.
- Mobile Section 상하 여백: 표준 48px, Hero·CTA는 40px로 압축.

---

## 17. Hero 높이와 첫 화면에서 다음 Section을 보여주는 규칙

Desktop 1440×900 기준 Hero 최대 높이는 **520px**로 제한한다. Hero가 뷰포트 전체를 채우면 안 되며, 스크롤 없이도 다음 Section 상단 카드 일부가 보이도록 구성한다. 이는 SCR-001뿐 아니라 축소형 Hero를 쓰는 SCR-003·SCR-004의 Intro 영역에도 동일하게 적용한다.

---

## 18. Section별 제목·설명·본문·CTA 계층과 시각적 리듬

각 Section은 예외 없이 다음 4요소를 갖는다: **제목**(`type.display-md`) → **1~3문장 설명**(`type.body-md`, muted 또는 body 톤) → **실제 콘텐츠 또는 명확한 CTA**. 같은 레이아웃 패턴(Hero / Card Grid / 좌우 분할 / Chip 목록 / 3단계 안내 / CTA Banner, SCR-002 한정 Timeline·Gallery)을 연속된 두 Section에서 반복하지 않고 교차 사용해 시각적 리듬을 만든다.

---

## 19. 화면별 Section 순서와 Card·Timeline·Gallery 최소 콘텐츠 수

| 화면 | Section 순서(고정) | 최소 콘텐츠 수 |
|---|---|---|
| SCR-001 `/` | 검색 Hero → 국내 인기 여행지 → 해외 인기 여행지 → 여행 테마 → 국가별 주의사항 → 동행 미리보기 → 대표 소개 배너 | 국내 카드 6 / 해외 카드 6 / 테마 Chip 6 / 국가 카드 6 / 동행 카드 3(Empty 시 안내 대체) |
| SCR-002 `/about` | Hero → 여행 지표 → 소개·철학 → 여행 타임라인 → 방문 국가 → 사진 갤러리 → 추천 여행지 배너 | 통계 카드 3 / 소개 문단 4 / 타임라인 6 / 방문국가 4권역·30개국 Chip / 갤러리 사진 8 / 추천 카드 4 |
| SCR-003 `/travel-tools` | Intro → 탭(항공/숙소/동행구하기) → 조건 입력 Form → 요약과 이동 → 고지와 팁 → 동행 구하기 탭 | 탭 3개 전부 존재 / 팁 카드 3 |
| SCR-004 `/mates` | Intro → 검색 Filter → 목록 → 상세 패널 → 이용 방법 → 안전 안내 배너 | 목록 카드 최대 8(우선 노출) / 이용 방법 3단계 |
| SCR-005 `/account` | (Guest) Intro → 로그인·가입 Card → 로그인 후 기능 안내 → 보안 안내 / (Member) 탭[프로필][내 활동] / (Admin) 추가 탭[관리자]: 신고 상태 변경, 외부 URL 설정 | Guest/Member/Admin 3개 역할 화면 모두 존재해야 함(역할에 없는 탭은 렌더링하지 않음) |

---

## 20. 완성형 Empty State와 Placeholder 문구 금지 규칙

- **금지 문구/상태**: Lorem ipsum, "준비 중", "정보 확인 필요", 빈 Card(설명 없는 빈 사각형), 장식용 빈 여백 블록.
- Empty 상태는 항상 "완성형"으로 만든다 — 무엇이 비어있는지 설명 + 이용 방법 안내 + 다음 행동 CTA 3요소를 모두 포함해야 하며, 이 중 하나라도 빠진 빈 화면은 정본 위반이다.
- 이미지가 아직 없는 경우에도 "이미지 없음" 아이콘만 방치하지 않고, 최소한 대체 텍스트와 캡션을 완성된 형태로 채운다.

---

## 21. Do / Do Not

### Do (Airbnb 참고본에서 구조만 차용)
- 단일 포인트 컬러(코랄)를 절제해서 사용
- 부드러운 라운드 코너(카드 12px, 버튼 8~10px, Chip/배지 완전 라운드)
- 얕은 그림자 1단계만 사용(카드 hover/Drawer/드롭다운)
- Section마다 밀도 대비: 여유로운 Hero/CTA Banner ↔ 조밀한 Card Grid
- 목록+상세 sticky 레일 패턴(SCR-004 Desktop 40/60 분할)
- 오픈소스 Inter 폰트 + 시스템 한글 fallback 사용

### Do Not
- **Airbnb 상표 요소 금지**: Rausch(`#ff385c`) 등 Airbnb 고유 색상, Cereal 서체, "Guest favorite" 배지, 하트 저장 아이콘, 3-프로덕트 내비게이션, 별점(rating-display) 재현 금지
- **구매·예약·결제 UI 금지**: "Reserve"류 예약 카드, 나이트리 가격, 결제 폼, 실시간 항공권/호텔 가격 표시 금지. 항공·숙소는 조건 요약 후 외부 사이트로 새 탭 이동만 한다
- **Proprietary Font 파일 금지**: Cereal VF 등 라이선스 필요 폰트 파일을 프로젝트에 포함하지 않는다. Inter(오픈소스)만 사용
- **디자인 토큰 외 임의 색상 추가 금지**: §2에 없는 색상을 어떤 화면에도 새로 만들지 않는다
- 광고 배너, 별점, 관련 없는 자동 추천 위젯 추가 금지
- 같은 Card/Section 레이아웃을 연속 반복 금지(§18)
- Lorem ipsum·"준비 중"·"정보 확인 필요"·빈 Card 금지(§20)
