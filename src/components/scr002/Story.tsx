"use client";

import { representative } from "@/data/representative";

/**
 * COMP-SCR002-STORY — 여행 철학·편집 원칙
 *
 * REQ-FUNC-058
 * - 여행 철학 (philosophy)
 * - 편집 원칙 (editorialPrinciple)
 */

export function Story() {
  return (
    <section className="mx-auto w-full max-w-screen-xl px-5 py-12 md:py-16">
      <div className="grid gap-8 md:grid-cols-2">
        {/* 여행 철학 */}
        <div className="flex flex-col gap-3">
          <h2 className="text-2xl font-semibold text-ink">여행 철학</h2>
          <p className="text-sm leading-relaxed text-body md:text-base">
            {representative.philosophy}
          </p>
        </div>

        {/* 편집 원칙 */}
        <div className="flex flex-col gap-3">
          <h2 className="text-2xl font-semibold text-ink">편집 원칙</h2>
          <p className="text-sm leading-relaxed text-body md:text-base">
            {representative.editorialPrinciple}
          </p>
        </div>
      </div>
    </section>
  );
}
