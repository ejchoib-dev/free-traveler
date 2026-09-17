"use client";

import { representative } from "@/data/representative";

/**
 * COMP-SCR002-COUNTRIES — 방문 국가 목록
 *
 * REQ-FUNC-059
 * - 권역별 국가 목록 (30개국 이상, 4개 권역)
 */

export function Countries() {
  return (
    <section className="mx-auto w-full max-w-screen-xl px-5 py-12 md:py-16">
      <h2 className="mb-8 text-2xl font-semibold text-ink md:text-3xl">
        방문한 국가
      </h2>

      <div className="grid gap-8 md:grid-cols-2">
        {representative.visitedRegions.map((region) => (
          <div key={region.region} className="flex flex-col gap-3">
            <h3 className="font-semibold text-ink">{region.region}</h3>
            <div className="flex flex-wrap gap-2">
              {region.countries.map((country) => (
                <span
                  key={country}
                  className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-ink"
                >
                  {country}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
