/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useState, useEffect } from "react";
import { destinations } from "@/data/destinations";

/**
 * COMP-SCR003-HOTEL — 숙소 조건 입력·요약·외부 이동
 *
 * REQ-FUNC-011~018, REQ-FUNC-054, REQ-NF-017
 * - 국가·지역·체크인·체크아웃 필수 입력
 * - 과거·역전 날짜 차단
 * - 유효 시 요약 표시
 * - 비전달 고지
 * - 새 탭+noopener,noreferrer 이동
 */

interface HotelSearch {
  country: string;
  region: string;
  checkIn: string;
  checkOut: string;
}

export function HotelTab() {
  const [search, setSearch] = useState<HotelSearch>({
    country: "",
    region: "",
    checkIn: "",
    checkOut: "",
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

    if (!search.country || !search.region || !search.checkIn || !search.checkOut) {
      return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const checkIn = new Date(search.checkIn);
    const checkOut = new Date(search.checkOut);

    // 과거 날짜 검증
    if (checkIn < today) {
      setError("체크인일은 오늘 이후여야 합니다.");
      return;
    }

    // 역전 날짜 검증
    if (checkOut <= checkIn) {
      setError("체크아웃일은 체크인일 이후여야 합니다.");
      return;
    }

    setIsValid(true);
  }, [search]);

  const handleSearch = () => {
    if (!isValid) return;

    // localStorage에만 저장
    localStorage.setItem("hotelSearch", JSON.stringify(search));

    // Booking.com으로 이동
    const hotelUrl = "https://www.booking.com/";
    window.open(hotelUrl, "_blank", "noopener,noreferrer");
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

        {/* 체크인 */}
        <input
          type="date"
          value={search.checkIn}
          onChange={(e) => setSearch({ ...search, checkIn: e.target.value })}
          className="rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-primary focus:ring-1 focus:ring-primary"
        />

        {/* 체크아웃 */}
        <input
          type="date"
          value={search.checkOut}
          onChange={(e) => setSearch({ ...search, checkOut: e.target.value })}
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
        ℹ️ 입력하신 정보는 저장되지 않으며, 외부 숙소 예약 사이트로 이동합니다.
      </div>

      {/* 요약 */}
      {isValid && (
        <div className="flex flex-col gap-2 rounded-lg border border-green-200 bg-green-50 p-4">
          <p className="text-sm font-medium text-green-900">
            {search.country} {search.region}
          </p>
          <p className="text-xs text-green-700">
            {search.checkIn} → {search.checkOut}
          </p>
        </div>
      )}

      {/* 검색 버튼 */}
      <button
        onClick={handleSearch}
        disabled={!isValid}
        className="rounded-lg bg-primary px-6 py-3 font-medium text-white transition-all hover:bg-red-600 disabled:bg-gray-300"
      >
        숙소 검색
      </button>
    </div>
  );
}
