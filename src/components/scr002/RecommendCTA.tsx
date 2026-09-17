"use client";

import Link from "next/link";
import Image from "next/image";
import { destinations } from "@/data/destinations";

/**
 * COMP-SCR002-RECOMMEND-CTA — 추천 여행지 배너 카드 4개
 *
 * REQ-FUNC-063
 * - representative.recommendedDestinationIds의 처음 4개 여행지
 * - 카드: 이미지 + 이름 + 소개 일부
 */

export function RecommendCTA() {
  // 추천 여행지 4개 (처음 4개)
  const recommendedDests = destinations.filter((d) =>
    (
      [
        "kr-seoul",
        "jp-tokyo",
        "vn-hanoi",
        "th-bangkok",
      ] as string[]
    ).includes(d.id)
  );

  return (
    <section className="mx-auto w-full max-w-screen-xl px-5 py-12 md:py-16">
      <h2 className="mb-8 text-2xl font-semibold text-ink md:text-3xl">
        추천 여행 경험
      </h2>

      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
        {recommendedDests.slice(0, 4).map((dest) => (
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
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  loading="lazy"
                />
              ) : null}
            </div>

            {/* 콘텐츠 */}
            <div className="flex flex-col gap-2 p-4">
              <h3 className="font-semibold text-ink line-clamp-1">
                {dest.name}
              </h3>
              <p className="text-xs text-muted line-clamp-2">{dest.intro}</p>
              <Link
                href="/"
                className="text-xs font-medium text-primary hover:underline"
              >
                여행지 상세 보기 →
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
