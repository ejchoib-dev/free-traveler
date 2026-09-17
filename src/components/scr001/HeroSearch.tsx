"use client";

import { useState, useMemo } from "react";
import { destinations } from "@/data/destinations";

/**
 * COMP-SCR001-HERO-SEARCH — 검색 Hero
 *
 * REQ-FUNC-002, REQ-FUNC-003
 * - 키워드 검색 (한글 부분일치)
 * - 필터: 국가, 도시, 계절, 테마, 기간 (AND 조건)
 * - 검색 결과 표시
 *
 * 디자인:
 * - D-001 §17: Hero 높이 Desktop 최대 520px
 * - 다음 Section이 스크롤 없이 보임
 */

interface SearchFilters {
  keyword: string;
  country: string;
  season: string;
  theme: string;
}

export function HeroSearch() {
  const [filters, setFilters] = useState<SearchFilters>({
    keyword: "",
    country: "",
    season: "",
    theme: "",
  });

  // 고유한 국가 목록 추출
  const countries = useMemo(
    () =>
      Array.from(new Set(destinations.map((d) => d.country))).sort(
        (a, b) => {
          // 국내가 먼저
          if (a === "대한민국") return -1;
          if (b === "대한민국") return 1;
          return a.localeCompare(b, "ko");
        }
      ),
    []
  );

  // 고유한 테마 목록 (highlights에서 추출)
  const themes = useMemo(
    () =>
      Array.from(
        new Set(destinations.flatMap((d) => d.highlights || []))
      ).sort((a, b) => a.localeCompare(b, "ko")),
    []
  );

  // 고유한 계절 목록
  const seasons = useMemo(
    () =>
      Array.from(
        new Set(
          destinations.map((d) => d.bestSeason).filter(Boolean)
        )
      ).sort(),
    []
  );

  // 검색 결과 계산
  const results = useMemo(() => {
    let filtered = destinations;

    // 키워드 검색 (이름, 지역, 소개에서 부분일치)
    if (filters.keyword) {
      const keyword = filters.keyword.toLowerCase();
      filtered = filtered.filter(
        (d) =>
          d.name.toLowerCase().includes(keyword) ||
          d.region.toLowerCase().includes(keyword) ||
          d.intro.toLowerCase().includes(keyword)
      );
    }

    // 국가 필터
    if (filters.country) {
      filtered = filtered.filter((d) => d.country === filters.country);
    }

    // 계절 필터
    if (filters.season) {
      filtered = filtered.filter((d) =>
        d.bestSeason.includes(filters.season)
      );
    }

    // 테마 필터
    if (filters.theme) {
      filtered = filtered.filter((d) =>
        d.highlights.includes(filters.theme)
      );
    }

    return filtered;
  }, [filters]);

  const handleReset = () => {
    setFilters({
      keyword: "",
      country: "",
      season: "",
      theme: "",
    });
  };

  return (
    <section className="w-full bg-gradient-to-b from-gray-50 to-white py-12 md:py-16">
      <div className="mx-auto flex max-h-[520px] w-full max-w-screen-xl flex-col gap-6 overflow-y-auto px-5 md:max-h-[520px]">
        {/* 제목 */}
        <div>
          <h1 className="text-3xl font-bold text-ink md:text-4xl">
            여행지 검색
          </h1>
          <p className="mt-2 text-sm text-muted md:text-base">
            {results.length}개의 여행지를 찾았습니다
          </p>
        </div>

        {/* 검색 및 필터 */}
        <div className="flex flex-col gap-4 md:gap-6">
          {/* 키워드 입력 */}
          <input
            type="text"
            placeholder="여행지명, 지역 검색..."
            value={filters.keyword}
            onChange={(e) =>
              setFilters({ ...filters, keyword: e.target.value })
            }
            className="rounded-lg border border-gray-300 px-4 py-3 text-base outline-none focus:border-primary focus:ring-1 focus:ring-primary"
          />

          {/* 필터 그룹 */}
          <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-4">
            {/* 국가 */}
            <select
              value={filters.country}
              onChange={(e) =>
                setFilters({ ...filters, country: e.target.value })
              }
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            >
              <option value="">국가 (전체)</option>
              {countries.map((country) => (
                <option key={country} value={country}>
                  {country}
                </option>
              ))}
            </select>

            {/* 계절 */}
            <select
              value={filters.season}
              onChange={(e) =>
                setFilters({ ...filters, season: e.target.value })
              }
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            >
              <option value="">계절 (전체)</option>
              {seasons.map((season) => (
                <option key={season} value={season}>
                  {season}
                </option>
              ))}
            </select>

            {/* 테마 */}
            <select
              value={filters.theme}
              onChange={(e) =>
                setFilters({ ...filters, theme: e.target.value })
              }
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            >
              <option value="">테마 (전체)</option>
              {themes.slice(0, 20).map((theme) => (
                <option key={theme} value={theme}>
                  {theme}
                </option>
              ))}
            </select>

            {/* 초기화 버튼 */}
            <button
              onClick={handleReset}
              className="rounded-lg bg-gray-200 px-3 py-2 text-sm font-medium text-ink transition-colors hover:bg-gray-300"
            >
              필터 초기화
            </button>
          </div>
        </div>

        {/* 결과 요약 */}
        {results.length === 0 ? (
          <div className="flex flex-col items-center gap-3 rounded-lg bg-gray-50 px-6 py-8 text-center">
            <p className="text-base font-medium text-ink">
              검색 결과가 없습니다.
            </p>
            <p className="text-sm text-muted">
              조건을 완화하고 다시 시도해주세요.
            </p>
          </div>
        ) : (
          <p className="text-xs text-muted md:text-sm">
            검색 및 필터 조건이 적용되었습니다.
          </p>
        )}
      </div>
    </section>
  );
}
