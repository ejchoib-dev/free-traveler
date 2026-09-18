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
    <section className="mx-auto w-full max-w-screen-xl px-[var(--spacing-token-lg)] py-[var(--spacing-section-compact-mobile)] md:py-[var(--spacing-section-standard-desktop)]">
      <h2 className="text-display-md mb-[var(--spacing-token-xxl)] font-semibold text-[var(--color-ink)]">
        여행 테마로 찾기
      </h2>

      <div className="flex flex-wrap gap-[var(--spacing-token-md)]">
        {THEMES.map((theme) => (
          <button
            key={theme}
            onClick={() =>
              setSelectedTheme(selectedTheme === theme ? null : theme)
            }
            className={`rounded-[var(--radius-token-full)] px-[var(--spacing-token-lg)] py-[var(--spacing-token-sm)] text-button font-semibold transition-all duration-[var(--transition-base)] ${
              selectedTheme === theme
                ? "bg-[var(--color-primary)] text-[var(--color-on-primary)] shadow-[var(--shadow-card)]"
                : "border border-[var(--color-hairline)] text-[var(--color-ink)] hover:border-[var(--color-primary)] hover:bg-[var(--color-surface-soft)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-1"
            }`}
          >
            {theme}
          </button>
        ))}
      </div>

      {selectedTheme && (
        <p className="mt-[var(--spacing-token-xl)] text-body-sm text-[var(--color-muted)]">
          <strong className="text-[var(--color-ink)]">&quot;{selectedTheme}&quot;</strong> 테마의 여행지를
          필터링했습니다.
        </p>
      )}
    </section>
  );
}
