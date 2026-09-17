import { destinations } from "./destinations";

/**
 * 대표 프로필 정적 데이터 (DATA-REPRESENTATIVE)
 *
 * PROJECT_SCOPE.md §5: 대표 콘텐츠는 Supabase 테이블이 아니라 이 파일의 정적
 * TypeScript 데이터로 관리한다(Editor CMS 워크플로 없음).
 */

export interface RepresentativeMetric {
  label: string;
  value: string;
}

export interface RepresentativeTimelineEntry {
  year: string;
  place: string;
  summary: string;
}

export interface RepresentativeVisitedRegion {
  region: string;
  countries: string[];
}

/** REQ-FUNC-062: 문의·SNS 링크는 정적 설정값이며 허용 프로토콜(https/mailto)만 렌더한다 */
export interface RepresentativeContactLink {
  platform: string;
  label: string;
  url: string;
}

export interface RepresentativeProfile {
  name: string;
  /** REQ-FUNC-057: 정확히 3개(통계 카드 3) */
  metrics: [RepresentativeMetric, RepresentativeMetric, RepresentativeMetric];
  intro: string;
  philosophy: string;
  editorialPrinciple: string;
  /** REQ-FUNC-059: 30개국 이상, 국가마다 이름·권역 보유 */
  visitedRegions: RepresentativeVisitedRegion[];
  /** REQ-FUNC-060: 연도·장소·요약 */
  timeline: RepresentativeTimelineEntry[];
  contactLinks: RepresentativeContactLink[];
  /**
   * REQ-FUNC-063: 추천 여행지 6개, 전부 destinations.ts에 실재하는 공개 여행지여야 한다.
   * 이 파일 하단에서 destinations 목록에 실제로 존재하는지 모듈 로드 시점에 검증한다
   * (destinations.ts는 이 Task의 Expected Files 밖이라 타입을 직접 좁히지 않는다).
   * SCR-002는 이 중 앞 4개만 노출한다(UI_CONTRACT.md SCR-002 "추천 여행지 배너(카드 4)").
   */
  recommendedDestinationIds: [string, string, string, string, string, string];
}

export const representative: RepresentativeProfile = {
  name: "free_traveler",
  metrics: [
    { label: "Trips", value: "50+ Trips" },
    { label: "Countries", value: "30+ Countries" },
    { label: "Years", value: "6년+ 여행 콘텐츠 제작" },
  ],
  intro:
    "50개 이상의 여행을 기록하며 예약 대행이 아닌 '믿을 수 있는 정보'를 전하는 것을 목표로 콘텐츠를 만들어 왔습니다. 실제로 다녀온 곳만 소개하고, 확인되지 않은 정보는 올리지 않습니다.",
  philosophy:
    "여행은 화려한 순간보다 안전하고 정확한 준비에서 시작된다고 믿습니다. 광고성 추천이나 실시간 가격 비교 대신, 검증된 여행지 정보와 안전 수칙을 우선으로 전달합니다.",
  editorialPrinciple:
    "모든 콘텐츠는 직접 방문 또는 공식 출처(관광청·정부 안전 공지) 확인을 거쳐 작성하며, 수정일을 함께 표기해 정보의 최신성을 밝힙니다.",
  visitedRegions: [
    {
      region: "동아시아·동남아시아",
      countries: [
        "대한민국",
        "일본",
        "중국",
        "대만",
        "홍콩",
        "베트남",
        "태국",
        "싱가포르",
      ],
    },
    {
      region: "남아시아·서아시아",
      countries: [
        "필리핀",
        "인도네시아",
        "말레이시아",
        "인도",
        "네팔",
        "터키",
        "아랍에미리트",
        "요르단",
      ],
    },
    {
      region: "유럽",
      countries: [
        "프랑스",
        "이탈리아",
        "스페인",
        "독일",
        "영국",
        "포르투갈",
        "스위스",
        "그리스",
      ],
    },
    {
      region: "아메리카·오세아니아",
      countries: [
        "미국",
        "캐나다",
        "멕시코",
        "브라질",
        "페루",
        "호주",
        "뉴질랜드",
        "피지",
      ],
    },
  ],
  timeline: [
    {
      year: "2019",
      place: "동남아시아 배낭여행",
      summary: "베트남·태국·캄보디아를 3개월간 배낭 하나로 돌아본 첫 장기 여행",
    },
    {
      year: "2020",
      place: "국내 구석구석",
      summary:
        "해외 이동이 제한된 시기 국내 10개 도시를 다시 발견한 재조명 프로젝트",
    },
    {
      year: "2021",
      place: "동아시아 안전 여행 기록",
      summary:
        "일본·대만을 오가며 방역·안전 수칙을 정리한 안전 정보 콘텐츠 시작",
    },
    {
      year: "2022",
      place: "유럽 6개국 종단",
      summary:
        "프랑스에서 그리스까지 기차로 이동하며 도시별 여행 준비 체크리스트 제작",
    },
    {
      year: "2023",
      place: "아메리카 대륙 횡단",
      summary:
        "미국 서부부터 페루까지, 고산지대 안전 수칙과 현지 교통 정보를 집중 기록",
    },
    {
      year: "2024",
      place: "오세아니아·중동",
      summary:
        "호주·뉴질랜드와 아랍에미리트·요르단의 문화적 에티켓 차이를 비교 정리",
    },
  ],
  contactLinks: [
    {
      platform: "email",
      label: "이메일 문의",
      url: "mailto:contact@freetraveler.example.com",
    },
    {
      platform: "instagram",
      label: "인스타그램",
      url: "https://instagram.com/free_traveler",
    },
    {
      platform: "youtube",
      label: "유튜브",
      url: "https://youtube.com/@free_traveler",
    },
  ],
  recommendedDestinationIds: [
    "kr-jeju",
    "jp-kyoto",
    "fr-paris",
    "th-bangkok",
    "it-rome",
    "vn-danang",
  ],
};

const destinationIds = new Set(destinations.map((d) => d.id));
const missingRecommendedIds = representative.recommendedDestinationIds.filter(
  (id) => !destinationIds.has(id),
);
if (missingRecommendedIds.length > 0) {
  throw new Error(
    `representative.recommendedDestinationIds가 destinations.ts에 없는 id를 참조한다: ${missingRecommendedIds.join(", ")}`,
  );
}
