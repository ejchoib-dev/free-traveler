import { destinations } from "./destinations";

/**
 * 국가 안전정보 정적 데이터 (DATA-SAFETY)
 *
 * PROJECT_SCOPE.md §5: Supabase 테이블이 아니라 정적 TypeScript 데이터로 관리한다.
 * REQ-FUNC-047: 8개 필수 카테고리(치안/흔한 사기/현지 법규/교통/재난·기후/보건/
 * 문화·복장/긴급연락처) 중 긴급연락처는 REQ-FUNC-053에 따라 구조화된 연락처로 분리한다.
 */

export type SafetyAlertScopeType = "country" | "region";

/** REQ-FUNC-052: scope_type/scope_text가 없으면 지역 경보를 게시할 수 없다 */
export interface SafetyAlertScope {
  scopeType: SafetyAlertScopeType;
  /** scopeType이 "region"이면 필수(어느 지역인지 텍스트로 명시) */
  scopeText?: string;
}

export type SafetyAlertLevel =
  "여행유의" | "여행자제" | "출국권고" | "여행금지" | "특별여행주의보";

/** REQ-FUNC-051: 색상만이 아니라 단계·행동요령·범위를 텍스트로 표시 */
export interface SafetyAlert {
  level: SafetyAlertLevel;
  actionGuidance: string;
  scope: SafetyAlertScope;
}

/** REQ-FUNC-053: 번호·링크·출처·확인일을 표시 */
export interface EmergencyContact {
  label: string;
  phone: string;
  url: string;
  source: string;
  lastCheckedAt: string;
}

export interface SafetyCategories {
  security: string;
  commonScams: string;
  localLaws: string;
  transportation: string;
  disasterClimate: string;
  health: string;
  cultureDressCode: string;
}

/** REQ-FUNC-048: 공식 출처명·URL·최종 확인일·편집자 */
export interface CountrySafetyInfo {
  id: string;
  /** destinations.ts의 international countryCode와 일치(REQ-FUNC-006) */
  countryCode: string;
  country: string;
  categories: SafetyCategories;
  /** REQ-FUNC-053: 최소 1개 이상(현지 긴급전화 + 영사콜센터) */
  emergencyContacts: [EmergencyContact, ...EmergencyContact[]];
  /** 평시에는 빈 배열(중대 경보 없음) */
  alerts: SafetyAlert[];
  sourceName: string;
  sourceUrl: string;
  lastCheckedAt: string;
  editor: string;
}

/** REQ-NF-028: 최종 확인 후 7일 경과 시 stale */
const STALE_THRESHOLD_DAYS = 7;

export function isSafetyInfoStale(
  lastCheckedAt: string,
  now: Date = new Date(),
): boolean {
  const checked = new Date(`${lastCheckedAt}T00:00:00`);
  const diffMs = now.getTime() - checked.getTime();
  const diffDays = diffMs / (1000 * 60 * 60 * 24);
  return diffDays > STALE_THRESHOLD_DAYS;
}

const CONSULAR_CALL_CENTER: Pick<
  EmergencyContact,
  "label" | "phone" | "url" | "source"
> = {
  label: "대한민국 영사콜센터(24시간)",
  phone: "+82-2-3210-0404",
  url: "https://www.0404.go.kr/callcenter/callcenter_main.jsp",
  source: "외교부 영사콜센터",
};

const LAST_CHECKED = "2026-09-17";
const EDITOR = "free_traveler 편집팀";
const SOURCE_NAME = "외교부 해외안전여행";
const SOURCE_URL = "https://www.0404.go.kr";

function contacts(
  localLabel: string,
  localPhone: string,
): [EmergencyContact, EmergencyContact] {
  return [
    {
      label: localLabel,
      phone: localPhone,
      url: SOURCE_URL,
      source: SOURCE_NAME,
      lastCheckedAt: LAST_CHECKED,
    },
    { ...CONSULAR_CALL_CENTER, lastCheckedAt: LAST_CHECKED },
  ];
}

export const countrySafetyInfo: CountrySafetyInfo[] = [
  {
    id: "safety-jp",
    countryCode: "JP",
    country: "일본",
    categories: {
      security: "전반적으로 치안이 양호하나 관광지 소매치기는 주의가 필요하다.",
      commonScams: "번화가 호객 바(캐치바)의 과도한 청구 사례가 보고된다.",
      localLaws:
        "공공장소 흡연 제한 구역이 세분화되어 있고 위반 시 과태료가 있다.",
      transportation:
        "지진 등으로 대중교통이 지연될 수 있어 여유 있는 환승 시간이 필요하다.",
      disasterClimate:
        "태풍(8~10월)·지진 상시 대비, 호텔 비상구·대피 경로를 확인한다.",
      health: "여행자 보험 가입을 권장하며 의료비가 높은 편이다.",
      cultureDressCode:
        "온천·사찰 등 시설별 복장·타투 관련 규정을 사전 확인한다.",
    },
    emergencyContacts: contacts("경찰 110 / 구급·화재 119", "110"),
    alerts: [],
    sourceName: SOURCE_NAME,
    sourceUrl: SOURCE_URL,
    lastCheckedAt: LAST_CHECKED,
    editor: EDITOR,
  },
  {
    id: "safety-vn",
    countryCode: "VN",
    country: "베트남",
    categories: {
      security: "관광지 소매치기·오토바이 날치기에 유의한다.",
      commonScams: "환전소 바꿔치기, 택시 미터기 조작 사례가 보고된다.",
      localLaws:
        "마약류 관련 처벌이 매우 엄격해 소지·복용 시 중형에 처해질 수 있다.",
      transportation:
        "오토바이 통행량이 많아 도로 횡단 시 일정한 속도로 이동해야 한다.",
      disasterClimate: "우기(5~10월) 집중호우·홍수에 대비한다.",
      health: "길거리 음식 위생 상태를 확인하고 식수는 생수를 이용한다.",
      cultureDressCode: "사찰 방문 시 어깨·무릎을 가리는 복장이 필요하다.",
    },
    emergencyContacts: contacts("경찰 113 / 구급 115 / 화재 114", "113"),
    alerts: [],
    sourceName: SOURCE_NAME,
    sourceUrl: SOURCE_URL,
    lastCheckedAt: LAST_CHECKED,
    editor: EDITOR,
  },
  {
    id: "safety-th",
    countryCode: "TH",
    country: "태국",
    categories: {
      security:
        "관광지 소매치기·바가지 요금에 주의하고 야간 인적 드문 지역은 피한다.",
      commonScams: "보석 사기, 투어 이중 결제 등 관광객 대상 사기가 보고된다.",
      localLaws:
        "왕실을 모독하는 언행은 불경죄로 처벌될 수 있어 각별히 주의한다.",
      transportation:
        "툭툭·택시 이용 시 사전에 요금을 협의하거나 그랩 앱을 이용한다.",
      disasterClimate: "우기(6~10월) 홍수·산사태 가능 지역을 사전 확인한다.",
      health: "뎅기열 등 모기 매개 감염병 예방을 위해 방충 조치를 한다.",
      cultureDressCode: "사원 방문 시 어깨·무릎을 가리는 복장이 필수다.",
      // 국경 인접지역 관련 최신 공지는 alerts에서 예시로 안내한다.
    },
    emergencyContacts: contacts("관광경찰 1155 / 일반경찰 191", "191"),
    alerts: [
      {
        level: "여행유의",
        actionGuidance:
          "일부 국경 인접 지역은 방문 전 외교부 해외안전여행 홈페이지에서 최신 공지를 확인한다.",
        scope: {
          scopeType: "region",
          scopeText: "태국-말레이시아 국경 인접 남부 일부 지역",
        },
      },
    ],
    sourceName: SOURCE_NAME,
    sourceUrl: SOURCE_URL,
    lastCheckedAt: LAST_CHECKED,
    editor: EDITOR,
  },
  {
    id: "safety-tw",
    countryCode: "TW",
    country: "대만",
    categories: {
      security: "전반적으로 치안이 매우 양호한 편이다.",
      commonScams: "관광지 인력거·투어 요금 사전 미고지 사례에 주의한다.",
      localLaws:
        "대중교통 내 음식물 섭취가 금지되며 위반 시 과태료가 부과된다.",
      transportation: "지진 시 대중교통이 일시 중단될 수 있다.",
      disasterClimate: "태풍(7~9월)·지진에 대비해 숙소의 대피 안내를 확인한다.",
      health: "의료 체계가 우수하나 여행자 보험 가입을 권장한다.",
      cultureDressCode:
        "사찰 방문 시 정숙을 유지하고 노출이 심한 복장은 자제한다.",
    },
    emergencyContacts: contacts("경찰 110 / 구급·화재 119", "110"),
    alerts: [],
    sourceName: SOURCE_NAME,
    sourceUrl: SOURCE_URL,
    lastCheckedAt: LAST_CHECKED,
    editor: EDITOR,
  },
  {
    id: "safety-sg",
    countryCode: "SG",
    country: "싱가포르",
    categories: {
      security:
        "치안이 매우 우수하나 관광지 소매치기는 여전히 주의가 필요하다.",
      commonScams: "온라인 티켓 재판매 사기에 주의한다.",
      localLaws:
        "껌 반입·판매 금지, 무단횡단·공공장소 흡연에 높은 벌금이 부과된다.",
      transportation: "MRT·버스망이 잘 갖춰져 있어 대중교통 이용이 편리하다.",
      disasterClimate: "스콜성 소나기가 잦아 우산을 상시 휴대한다.",
      health: "의료 수준이 높으나 비용이 비싼 편이라 보험 가입을 권장한다.",
      cultureDressCode: "종교시설 방문 시 복장 규정을 사전 확인한다.",
    },
    emergencyContacts: contacts("경찰 999 / 구급·화재 995", "999"),
    alerts: [],
    sourceName: SOURCE_NAME,
    sourceUrl: SOURCE_URL,
    lastCheckedAt: LAST_CHECKED,
    editor: EDITOR,
  },
  {
    id: "safety-ph",
    countryCode: "PH",
    country: "필리핀",
    categories: {
      security: "일부 지역의 소매치기·날치기에 주의하고 야간 외출을 자제한다.",
      commonScams: "환전 사기, 관광 가이드 바가지 요금에 주의한다.",
      localLaws: "마약류 관련 처벌이 매우 엄격하다.",
      transportation: "지프니·트라이시클 이용 시 사전에 요금을 확인한다.",
      disasterClimate: "태풍(6~11월)이 잦아 기상 특보를 상시 확인한다.",
      health: "뎅기열 예방을 위해 방충 조치를 한다.",
      cultureDressCode: "성당 방문 시 단정한 복장을 갖춘다.",
    },
    emergencyContacts: contacts("긴급신고 911", "911"),
    alerts: [
      {
        level: "여행유의",
        actionGuidance: "일부 남부 지역은 방문 전 최신 안전 공지를 확인한다.",
        scope: { scopeType: "region", scopeText: "민다나오 일부 지역" },
      },
    ],
    sourceName: SOURCE_NAME,
    sourceUrl: SOURCE_URL,
    lastCheckedAt: LAST_CHECKED,
    editor: EDITOR,
  },
  {
    id: "safety-id",
    countryCode: "ID",
    country: "인도네시아",
    categories: {
      security: "관광지 소매치기에 주의하고 귀중품은 최소한으로 소지한다.",
      commonScams: "렌터카·오토바이 대여 시 손상 트집 사기에 주의한다.",
      localLaws: "마약류 관련 처벌이 매우 엄격해 사형까지 가능하다.",
      transportation:
        "오토바이 렌트 시 국제운전면허증이 필요하며 도로 상태가 고르지 않다.",
      disasterClimate: "지진·화산 활동 지역이 있어 관련 안내를 사전 확인한다.",
      health: "뎅기열 등 모기 매개 감염병 예방 조치를 한다.",
      cultureDressCode: "사원 방문 시 사롱(전통 천) 착용이 필요한 경우가 있다.",
    },
    emergencyContacts: contacts("경찰 110 / 구급 118 / 화재 113", "110"),
    alerts: [],
    sourceName: SOURCE_NAME,
    sourceUrl: SOURCE_URL,
    lastCheckedAt: LAST_CHECKED,
    editor: EDITOR,
  },
  {
    id: "safety-my",
    countryCode: "MY",
    country: "말레이시아",
    categories: {
      security: "대도시 소매치기·오토바이 날치기에 주의한다.",
      commonScams: "온라인 쇼핑·투자 관련 사기에 주의한다.",
      localLaws: "마약류 관련 처벌이 매우 엄격하다.",
      transportation:
        "LRT·그랩 이용이 편리하며 대중교통망이 비교적 잘 갖춰져 있다.",
      disasterClimate: "우기(11~2월) 홍수 가능 지역을 사전 확인한다.",
      health: "뎅기열 예방을 위해 방충 조치를 한다.",
      cultureDressCode: "이슬람 사원 방문 시 복장 규정을 준수한다.",
    },
    emergencyContacts: contacts("긴급신고 999", "999"),
    alerts: [],
    sourceName: SOURCE_NAME,
    sourceUrl: SOURCE_URL,
    lastCheckedAt: LAST_CHECKED,
    editor: EDITOR,
  },
  {
    id: "safety-cn",
    countryCode: "CN",
    country: "중국",
    categories: {
      security: "대도시는 비교적 안전하나 관광지 소매치기에 주의한다.",
      commonScams: "찻집·미술품 판매 사기에 주의한다.",
      localLaws: "마약류·출판물 관련 규제가 엄격하며 인터넷 접속 제한이 있다.",
      transportation:
        "고속철도망이 잘 갖춰져 있으나 주요 관광지는 보안 검색이 엄격하다.",
      disasterClimate: "지역에 따라 황사·폭염에 대비가 필요하다.",
      health: "대도시 의료 수준은 양호하나 여행자 보험 가입을 권장한다.",
      cultureDressCode: "사원·사적지에서는 정숙을 유지한다.",
    },
    emergencyContacts: contacts("경찰 110 / 구급 120 / 화재 119", "110"),
    alerts: [],
    sourceName: SOURCE_NAME,
    sourceUrl: SOURCE_URL,
    lastCheckedAt: LAST_CHECKED,
    editor: EDITOR,
  },
  {
    id: "safety-hk",
    countryCode: "HK",
    country: "홍콩",
    categories: {
      security: "치안이 양호하나 번화가 소매치기에 주의한다.",
      commonScams: "관광지 인근 환전소의 불리한 환율에 주의한다.",
      localLaws: "공공장소 흡연 제한 구역이 세분화되어 있다.",
      transportation:
        "MTR망이 편리하며 에스컬레이터에서는 오른쪽으로 서는 것이 관례다.",
      disasterClimate: "태풍(6~9월) 시 대중교통이 일시 중단될 수 있다.",
      health: "의료 수준이 높으나 비용이 비싼 편이다.",
      cultureDressCode:
        "특별한 복장 제한은 없으나 사찰 방문 시 정숙을 유지한다.",
    },
    emergencyContacts: contacts("긴급신고 999", "999"),
    alerts: [],
    sourceName: SOURCE_NAME,
    sourceUrl: SOURCE_URL,
    lastCheckedAt: LAST_CHECKED,
    editor: EDITOR,
  },
  {
    id: "safety-fr",
    countryCode: "FR",
    country: "프랑스",
    categories: {
      security:
        "주요 관광지·대중교통에서 소매치기가 빈번해 소지품 관리에 유의한다.",
      commonScams: "서명 청원·팔찌 강매 등 관광객 대상 소액 사기에 주의한다.",
      localLaws: "공공장소 음주·소음 관련 규정을 준수한다.",
      transportation: "파업으로 대중교통이 지연될 수 있어 일정에 여유를 둔다.",
      disasterClimate: "여름철 폭염에 대비해 수분 섭취에 유의한다.",
      health: "응급 시 112로 연락하며 여행자 보험 가입을 권장한다.",
      cultureDressCode: "종교시설 방문 시 단정한 복장을 갖춘다.",
    },
    emergencyContacts: contacts("긴급신고 112", "112"),
    alerts: [],
    sourceName: SOURCE_NAME,
    sourceUrl: SOURCE_URL,
    lastCheckedAt: LAST_CHECKED,
    editor: EDITOR,
  },
  {
    id: "safety-it",
    countryCode: "IT",
    country: "이탈리아",
    categories: {
      security: "관광지·기차역 소매치기가 빈번해 소지품 관리에 유의한다.",
      commonScams: "가짜 서명 청원, 팔찌 강매 등 소액 사기에 주의한다.",
      localLaws: "일부 유적지에서 취식·착석이 금지되어 벌금이 부과될 수 있다.",
      transportation: "기차 파업이 종종 발생해 일정에 여유를 둔다.",
      disasterClimate: "여름철 폭염, 화산 지대는 관련 안내를 확인한다.",
      health: "응급 시 112로 연락하며 여행자 보험 가입을 권장한다.",
      cultureDressCode:
        "성당(바티칸 포함) 방문 시 어깨·무릎을 가리는 복장이 필수다.",
    },
    emergencyContacts: contacts("긴급신고 112", "112"),
    alerts: [],
    sourceName: SOURCE_NAME,
    sourceUrl: SOURCE_URL,
    lastCheckedAt: LAST_CHECKED,
    editor: EDITOR,
  },
  {
    id: "safety-es",
    countryCode: "ES",
    country: "스페인",
    categories: {
      security:
        "바르셀로나 등 관광 도시의 소매치기가 빈번해 가방은 앞으로 멘다.",
      commonScams: "레스토랑 사전 고지 없는 추가 요금에 주의한다.",
      localLaws: "공공장소 음주 관련 규정을 준수한다.",
      transportation: "대중교통 파업이 종종 발생해 일정에 여유를 둔다.",
      disasterClimate: "여름철 폭염에 대비해 수분 섭취에 유의한다.",
      health: "응급 시 112로 연락하며 여행자 보험 가입을 권장한다.",
      cultureDressCode: "성당 방문 시 단정한 복장을 갖춘다.",
    },
    emergencyContacts: contacts("긴급신고 112", "112"),
    alerts: [],
    sourceName: SOURCE_NAME,
    sourceUrl: SOURCE_URL,
    lastCheckedAt: LAST_CHECKED,
    editor: EDITOR,
  },
  {
    id: "safety-us",
    countryCode: "US",
    country: "미국",
    categories: {
      security:
        "도시별 치안 편차가 크므로 방문 지역의 치안 정보를 사전 확인한다.",
      commonScams: "렌터카 보험 강매, 관광지 소액 사기에 주의한다.",
      localLaws: "주(州)마다 법규가 달라 음주·대마 관련 규정을 사전 확인한다.",
      transportation:
        "도시 간 이동은 렌터카·국내선 항공이 일반적이며 대중교통 배차가 긴 지역이 있다.",
      disasterClimate: "지역에 따라 허리케인·산불·폭설 등 기후 위험이 다르다.",
      health: "의료비가 매우 높아 여행자 보험 가입이 필수적이다.",
      cultureDressCode:
        "특별한 복장 제한은 없으나 종교시설 방문 시 단정한 복장을 갖춘다.",
    },
    emergencyContacts: contacts("긴급신고 911", "911"),
    alerts: [],
    sourceName: SOURCE_NAME,
    sourceUrl: SOURCE_URL,
    lastCheckedAt: LAST_CHECKED,
    editor: EDITOR,
  },
  {
    id: "safety-au",
    countryCode: "AU",
    country: "호주",
    categories: {
      security: "전반적으로 치안이 양호한 편이다.",
      commonScams: "온라인 숙박 예약 사기에 주의한다.",
      localLaws: "생물 반입 규정이 엄격해 농축산물 반입 시 신고가 필요하다.",
      transportation:
        "도시 간 거리가 멀어 장거리 이동은 국내선 항공을 이용한다.",
      disasterClimate:
        "여름철(12~2월) 산불·폭염에 대비하고 관련 경보를 확인한다.",
      health: "해파리·상어 등 해양 생물 안전수칙을 준수한다.",
      cultureDressCode: "특별한 복장 제한은 없다.",
    },
    emergencyContacts: contacts("긴급신고 000", "000"),
    alerts: [],
    sourceName: SOURCE_NAME,
    sourceUrl: SOURCE_URL,
    lastCheckedAt: LAST_CHECKED,
    editor: EDITOR,
  },
  {
    id: "safety-de",
    countryCode: "DE",
    country: "독일",
    categories: {
      security: "전반적으로 치안이 양호하나 대도시 관광지 소매치기에 주의한다.",
      commonScams: "기차역 인근 가짜 검표원 사기에 주의한다.",
      localLaws: "나치 관련 상징물 전시·판매가 법으로 금지된다.",
      transportation: "기차 지연이 잦은 편이라 환승 시간을 여유 있게 잡는다.",
      disasterClimate: "겨울철 폭설·결빙에 대비한다.",
      health: "응급 시 112로 연락하며 여행자 보험 가입을 권장한다.",
      cultureDressCode:
        "특별한 복장 제한은 없으나 추모시설 방문 시 정숙을 유지한다.",
    },
    emergencyContacts: contacts("긴급신고 112", "112"),
    alerts: [],
    sourceName: SOURCE_NAME,
    sourceUrl: SOURCE_URL,
    lastCheckedAt: LAST_CHECKED,
    editor: EDITOR,
  },
];

const internationalCountryCodes = new Set(
  destinations
    .filter((d) => d.scope === "international")
    .map((d) => d.countryCode),
);
const coveredCountryCodes = new Set(
  countrySafetyInfo.map((s) => s.countryCode),
);
const missingCountryCodes = [...internationalCountryCodes].filter(
  (code) => !coveredCountryCodes.has(code),
);
if (missingCountryCodes.length > 0) {
  throw new Error(
    `destinations.ts의 해외 국가 중 안전정보가 없는 국가가 있다: ${missingCountryCodes.join(", ")}`,
  );
}
