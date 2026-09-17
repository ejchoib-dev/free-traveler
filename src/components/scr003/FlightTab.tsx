/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useState, useEffect } from "react";
import { destinations } from "@/data/destinations";

/**
 * COMP-SCR003-FLIGHT — 항공 조건 입력·요약·외부 이동
 *
 * REQ-FUNC-011~018, REQ-FUNC-054, REQ-NF-017
 * - 국가·지역·출발일·귀국일 필수 입력
 * - 과거·역전 날짜 차단
 * - 유효 시 요약 표시
 * - 비전달 고지 (입력값 서버 전송 없음, localStorage만)
 * - 새 탭+noopener,noreferrer 이동
 *
 * 설계:
 * - 클라이언트 상태만 사용 (localStorage 포함 가능)
 * - 서버 전송 금지
 */

interface FlightSearch {
  country: string;
  region: string;
  departDate: string;
  returnDate: string;
}

export function FlightTab() {
  const [search, setSearch] = useState<FlightSearch>({
    country: "",
    region: "",
    departDate: "",
    returnDate: "",
  });

  const [error, setError] = useState("");
  const [isValid, setIsValid] = useState(false);

  // 선택된 국가의 지역 목록
  const selectedCountry = destinations.find((d) => d.country === search.country);
  const regions = selectedCountry
    ? Array.from(new Set(destinations.filter((d) => d.country === search.country).map((d) => d.region)))
    : [];

  // 유효성 검증
  useEffect(() => {
    setError("");
    setIsValid(false);

    if (!search.country || !search.region || !search.departDate || !search.returnDate) {
      return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const depart = new Date(search.departDate);
    const returnDate = new Date(search.returnDate);

    // 과거 날짜 검증
    if (depart < today) {
      setError("출발일은 오늘 이후여야 합니다.");
      return;
    }

    // 역전 날짜 검증
    if (returnDate <= depart) {
      setError("귀국일은 출발일 이후여야 합니다.");
      return;
    }

    setIsValid(true);
  }, [search]);

  const handleSearch = () => {
    if (!isValid) return;

    // localStorage에만 저장 (서버 전송 금지)
    localStorage.setItem(
      "flightSearch",
      JSON.stringify(search)
    );

    // Skyscanner로 이동 (외부 URL, noopener,noreferrer)
    const flightUrl = "https://www.skyscanner.co.kr/";
    window.open(flightUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="flex flex-col gap-6">
      {/* 입력 폼 */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* 국가 */}
        <select
          value={search.country}
          onChange={(e) =>
            setSearch({ ...search, country: e.target.value, region: "" })
          }
          className="rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-primary focus:ring-1 focus:ring-primary"
        >
          <option value="">국가 선택</option>
          {Array.from(new Set(destinations.map((d) => d.country))).map(
            (country) => (
              <option key={country} value={country}>
                {country}
              </option>
            )
          )}
        </select>

        {/* 지역 */}
        <select
          value={search.region}
          onChange={(e) => setSearch({ ...search, region: e.target.value })}
          disabled={!search.country}
          className="rounded-lg border border-gray-300 px-4 py-3 outline-none disabled:bg-gray-100 focus:border-primary focus:ring-1 focus:ring-primary"
        >
          <option value="">지역 선택</option>
          {regions.map((region) => (
            <option key={region} value={region}>
              {region}
            </option>
          ))}
        </select>

        {/* 출발일 */}
        <input
          type="date"
          value={search.departDate}
          onChange={(e) => setSearch({ ...search, departDate: e.target.value })}
          className="rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-primary focus:ring-1 focus:ring-primary"
        />

        {/* 귀국일 */}
        <input
          type="date"
          value={search.returnDate}
          onChange={(e) =>
            setSearch({ ...search, returnDate: e.target.value })
          }
          className="rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-primary focus:ring-1 focus:ring-primary"
        />
      </div>

      {/* 오류 메시지 */}
      {error && (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* 입력값 비전달 고지 */}
      <div className="rounded-lg bg-blue-50 p-3 text-xs text-blue-700">
        ℹ️ 입력하신 정보는 저장되지 않으며, 외부 항공권 사이트로 이동합니다.
      </div>

      {/* 요약 */}
      {isValid && (
        <div className="flex flex-col gap-2 rounded-lg border border-green-200 bg-green-50 p-4">
          <p className="text-sm font-medium text-green-900">
            {search.country} {search.region}
          </p>
          <p className="text-xs text-green-700">
            {search.departDate} → {search.returnDate}
          </p>
        </div>
      )}

      {/* 검색 버튼 */}
      <button
        onClick={handleSearch}
        disabled={!isValid}
        className="rounded-lg bg-primary px-6 py-3 font-medium text-white transition-all hover:bg-red-600 disabled:bg-gray-300"
      >
        항공권 검색
      </button>
    </div>
  );
}
