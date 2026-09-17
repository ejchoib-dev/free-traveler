"use client";

import { useState } from "react";

/**
 * COMP-SCR001-THEME-CHIPS — 여행 테마 Chip 필터
 *
 * REQ-FUNC-001
 * - 여행 테마를 Chip으로 표시
 * - 클릭해서 목록 필터링 가능
 *
 * 디자인:
 * - D-001 §9: Chip 패턴
 * - D-001 §2: Primary 색상으로 활성 상태 표시
 */

const THEMES = [
  "문화",
  "음식",
  "자연",
  "모험",
  "휴식",
  "건축",
];

export function ThemeChips() {
  const [selectedTheme, setSelectedTheme] = useState<string | null>(null);

  return (
    <section className="mx-auto w-full max-w-screen-xl px-5 py-12 md:py-16">
      <h2 className="mb-8 text-2xl font-semibold text-ink md:text-3xl">
        여행 테마로 찾기
      </h2>

      <div className="flex flex-wrap gap-3">
        {THEMES.map((theme) => (
          <button
            key={theme}
            onClick={() =>
              setSelectedTheme(selectedTheme === theme ? null : theme)
            }
            className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
              selectedTheme === theme
                ? "bg-primary text-white"
                : "border border-gray-300 text-ink hover:border-primary"
            }`}
          >
            {theme}
          </button>
        ))}
      </div>

      {selectedTheme && (
        <p className="mt-6 text-sm text-muted">
          <strong>&quot;{selectedTheme}&quot;</strong> 테마의 여행지를
          필터링했습니다.
        </p>
      )}
    </section>
  );
}
