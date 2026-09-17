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
      <section className="mx-auto w-full max-w-screen-xl px-5 py-12 md:py-16">
        <h2 className="mb-8 text-2xl font-semibold text-ink md:text-3xl">
          해외 추천 여행지
        </h2>
        <div className="flex flex-col items-center gap-4 rounded-lg bg-gray-50 px-6 py-12 text-center">
          <p className="text-base font-medium text-ink">
            아직 등록된 해외 여행지가 없습니다.
          </p>
          <p className="text-sm text-muted">
            조건을 완화해보시거나 다시 시도해주세요.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 rounded-lg bg-primary px-6 py-2 text-sm font-medium text-white transition-all hover:bg-red-600"
          >
            초기화
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto w-full max-w-screen-xl px-5 py-12 md:py-16">
      <h2 className="mb-8 text-2xl font-semibold text-ink md:text-3xl">
        해외 추천 여행지
      </h2>

      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 md:gap-6">
        {displayed.map((dest) => (
          <article
            key={dest.id}
            className="group overflow-hidden rounded-[12px] bg-white shadow-md transition-shadow hover:shadow-lg"
          >
            {/* 이미지 */}
            <div className="relative h-48 w-full overflow-hidden bg-gray-200">
              {dest.images && dest.images.length > 0 ? (
                <Image
                  src={dest.images[0].url}
                  alt={dest.images[0].alt}
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  loading="lazy"
                />
              ) : (
                <div className="flex h-full items-center justify-center bg-gray-200 text-gray-400">
                  이미지 없음
                </div>
              )}
            </div>

            {/* 콘텐츠 */}
            <div className="flex flex-col gap-2 p-4">
              <h3 className="font-semibold text-ink line-clamp-1">
                {dest.name}
              </h3>
              <p className="text-sm text-muted line-clamp-2">{dest.intro}</p>
              <p className="text-xs font-medium text-primary">
                {dest.country}
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
