"use client";

import Link from "next/link";
import { representative } from "@/data/representative";

/**
 * COMP-SCR001-ABOUT-BANNER — 대표 소개 CTA Banner
 *
 * REQ-FUNC-057: 대표 프로필과 정확히 일치하는 메트릭 표시,
 * "소개 보기" CTA로 /about로 이동
 *
 * 디자인:
 * - D-001 §5: CTA Banner 패턴 (제목 → 설명 → CTA)
 * - D-001 §2: Primary 색상(#FF6B4A)으로 CTA 강조
 * - D-001 §7: Desktop 96px, Mobile 40px 상하 여백
 */

export function AboutBanner() {
  const metricsText = representative.metrics.map((m) => m.value).join(" · ");

  return (
    <section className="mx-auto w-full max-w-screen-xl px-5 py-[40px] md:py-[96px]">
      <div className="flex flex-col items-center gap-6 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 px-6 py-12 md:px-12 md:py-16">
        {/* 제목 */}
        <h2 className="text-center text-2xl font-semibold text-ink md:text-3xl">
          {representative.name}
        </h2>

        {/* 메트릭 */}
        <p className="text-center text-sm font-medium text-muted md:text-base">
          {metricsText}
        </p>

        {/* 설명 */}
        <p className="max-w-md text-center text-sm leading-relaxed text-body md:text-base">
          정보에 기반한 여행을 돕고, 안전하고 정확한 가이드를 제공하는 것을
          목표로 합니다.
        </p>

        {/* CTA 버튼 */}
        <Link
          href="/about"
          className="mt-4 inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-medium text-white transition-all hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 md:px-8 md:py-4 md:text-base"
        >
          {representative.name} 소개 보기
        </Link>
      </div>
    </section>
  );
}
