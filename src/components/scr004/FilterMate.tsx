"use client";

import { useState } from "react";

/**
 * COMP-SCR004-FILTER — 동행글 필터
 *
 * REQ-FUNC-023
 * - 국가·지역·날짜·테마로 필터링
 */

interface MateFilter {
  country: string;
  dateRange: string;
  theme: string;
}

interface FilterMateProps {
  onFilter: (filters: MateFilter) => void;
}

export function FilterMate({ onFilter }: FilterMateProps) {
  const [filters, setFilters] = useState<MateFilter>({
    country: "",
    dateRange: "",
    theme: "",
  });

  const handleChange = (key: keyof MateFilter, value: string) => {
    const updated = { ...filters, [key]: value };
    setFilters(updated);
    onFilter(updated);
  };

  return (
    <div className="flex flex-col gap-4 rounded-lg border border-gray-200 bg-gray-50 p-4">
      <h3 className="font-semibold text-ink">필터</h3>

      <select
        value={filters.country}
        onChange={(e) => handleChange("country", e.target.value)}
        className="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
      >
        <option value="">국가 (전체)</option>
        <option value="KR">대한민국</option>
        <option value="JP">일본</option>
        <option value="VN">베트남</option>
      </select>

      <select
        value={filters.dateRange}
        onChange={(e) => handleChange("dateRange", e.target.value)}
        className="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
      >
        <option value="">날짜 (전체)</option>
        <option value="thisMonth">이번 달</option>
        <option value="nextMonth">다음 달</option>
        <option value="future">미래</option>
      </select>

      <select
        value={filters.theme}
        onChange={(e) => handleChange("theme", e.target.value)}
        className="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
      >
        <option value="">테마 (전체)</option>
        <option value="adventure">모험</option>
        <option value="culture">문화</option>
        <option value="nature">자연</option>
      </select>
    </div>
  );
}
