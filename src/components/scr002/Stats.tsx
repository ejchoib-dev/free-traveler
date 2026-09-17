"use client";

import { representative } from "@/data/representative";

/**
 * COMP-SCR002-STATS — 통계 카드 3개
 *
 * REQ-FUNC-057
 * - 정확히 3개의 metrics 카드 표시
 */

export function Stats() {
  return (
    <section className="mx-auto w-full max-w-screen-xl px-5 py-12 md:py-16">
      <div className="grid gap-6 md:grid-cols-3">
        {representative.metrics.map((metric) => (
          <div
            key={metric.label}
            className="flex flex-col items-center gap-2 rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
          >
            <p className="text-2xl font-bold text-primary md:text-3xl">
              {metric.value}
            </p>
            <p className="text-sm text-muted">{metric.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
