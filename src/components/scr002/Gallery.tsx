"use client";

import Image from "next/image";
import { destinations } from "@/data/destinations";

/**
 * COMP-SCR002-GALLERY — 추천 여행지 이미지 갤러리
 *
 * REQ-FUNC-063
 * - representative.recommendedDestinationIds의 처음 4개 여행지 이미지
 * - 각 여행지의 첫 이미지 표시
 */

export function Gallery() {
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
        추천 여행지
      </h2>

      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
        {recommendedDests.slice(0, 4).map((dest) => (
          <div
            key={dest.id}
            className="relative overflow-hidden rounded-lg bg-gray-200"
          >
            <div className="relative h-48 w-full">
              {dest.images && dest.images.length > 0 ? (
                <Image
                  src={dest.images[0].url}
                  alt={dest.images[0].alt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  loading="lazy"
                />
              ) : null}
            </div>
            <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/60 to-transparent p-4">
              <p className="text-sm font-semibold text-white">{dest.name}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
