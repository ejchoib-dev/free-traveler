"use client";

import Image from "next/image";
import { destinations } from "@/data/destinations";

/**
 * COMP-SCR001-OVERSEAS-GRID — 해외 여행지 카드 그리드
 *
 * REQ-FUNC-001, REQ-FUNC-005, REQ-NF-006, REQ-NF-026
 * - 해외 여행지를 카드 그리드로 표시
 * - 반응형: Desktop 3열, Mobile 1열
 * - 이미지는 Next.js Image (lazy load, 최적화)
 *
 * 디자인:
 * - D-001 §5·§9: 카드 12px radius
 * - D-001 §13: Shadow 1단계 적용
 */

export function OverseasGrid() {
  const overseasDestinations = destinations.filter(
    (d) => d.scope === "international"
  );

  const displayed = overseasDestinations.slice(0, 6);

  if (displayed.length === 0) {
    return (
      <section className="mx-auto w-full max-w-screen-xl px-[var(--spacing-token-lg)] py-[var(--spacing-section-compact-mobile)] md:py-[var(--spacing-section-standard-desktop)]">
        <h2 className="text-display-md mb-[var(--spacing-token-xxl)] font-semibold text-[var(--color-ink)]">
          해외 추천 여행지
        </h2>
        <div className="flex flex-col items-center gap-[var(--spacing-token-md)] rounded-[var(--radius-token-md)] bg-[var(--color-surface-soft)] px-[var(--spacing-token-xl)] py-[var(--spacing-section-compact-mobile)] text-center">
          <p className="text-title-md font-semibold text-[var(--color-ink)]">
            아직 등록된 해외 여행지가 없습니다.
          </p>
          <p className="text-body-sm text-[var(--color-muted)]">
            조건을 완화해보시거나 다시 시도해주세요.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-[var(--spacing-token-lg)] rounded-[var(--radius-token-sm)] bg-[var(--color-primary)] px-[var(--spacing-token-xl)] py-[var(--spacing-token-sm)] text-button font-semibold text-[var(--color-on-primary)] transition-all duration-[var(--transition-base)] hover:bg-[var(--color-primary-active)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-2"
          >
            초기화
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto w-full max-w-screen-xl px-[var(--spacing-token-lg)] py-[var(--spacing-section-compact-mobile)] md:py-[var(--spacing-section-standard-desktop)]">
      <h2 className="text-display-md mb-[var(--spacing-token-xxl)] font-semibold text-[var(--color-ink)]">
        해외 추천 여행지
      </h2>

      <div className="grid gap-[var(--spacing-token-md)] sm:grid-cols-2 md:grid-cols-3 md:gap-[var(--spacing-token-xl)]">
        {displayed.map((dest) => (
          <article
            key={dest.id}
            className="group overflow-hidden rounded-[var(--radius-token-md)] bg-[var(--color-canvas)] shadow-[var(--shadow-card)] transition-all duration-[var(--transition-base)] hover:shadow-[var(--shadow-card-hover)]"
          >
            {/* 이미지 */}
            <div className="relative h-48 w-full overflow-hidden bg-[var(--color-surface-soft)]">
              {dest.images && dest.images.length > 0 ? (
                <Image
                  src={dest.images[0].url}
                  alt={dest.images[0].alt}
                  fill
                  className="object-cover transition-transform duration-[var(--transition-base)] group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  loading="lazy"
                />
              ) : (
                <div className="flex h-full items-center justify-center bg-[var(--color-surface-soft)] text-[var(--color-muted-soft)]">
                  이미지 없음
                </div>
              )}
            </div>

            {/* 콘텐츠 */}
            <div className="flex flex-col gap-[var(--spacing-token-sm)] p-[var(--spacing-token-lg)]">
              <h3 className="text-title-md line-clamp-1 font-semibold text-[var(--color-ink)]">
                {dest.name}
              </h3>
              <p className="text-body-sm line-clamp-2 text-[var(--color-body)]">{dest.intro}</p>
              <p className="text-caption font-medium text-[var(--color-primary)]">
                {dest.country}
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
