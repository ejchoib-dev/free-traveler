"use client";

import { representative } from "@/data/representative";

/**
 * COMP-SCR002-TIMELINE — 여행 타임라인
 *
 * REQ-FUNC-060
 * - 연도, 장소, 요약을 시간 순서로 표시
 */

export function Timeline() {
  return (
    <section className="mx-auto w-full max-w-screen-xl px-5 py-12 md:py-16">
      <h2 className="mb-8 text-2xl font-semibold text-ink md:text-3xl">
        여행 기록
      </h2>

      <div className="flex flex-col gap-6">
        {representative.timeline.map((entry, idx) => (
          <div key={idx} className="flex gap-4 md:gap-8">
            {/* 연도 */}
            <div className="flex flex-col items-center">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-semibold text-white">
                {entry.year}
              </div>
              {idx < representative.timeline.length - 1 && (
                <div className="h-12 w-0.5 bg-gray-200" />
              )}
            </div>

            {/* 내용 */}
            <div className="flex flex-col gap-1 pb-6">
              <p className="font-semibold text-ink">{entry.place}</p>
              <p className="text-sm text-muted">{entry.summary}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
