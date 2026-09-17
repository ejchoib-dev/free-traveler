"use client";

import Link from "next/link";
import { representative } from "@/data/representative";

/**
 * COMP-SCR002-HERO — Profile Hero
 *
 * REQ-FUNC-057, REQ-FUNC-058, REQ-FUNC-062
 * - 대표명, metrics, 소개문 첫 문단
 * - 문의·SNS 링크 (빈 링크 미렌더, 허용 프로토콜만)
 * - Hero 최대 520px
 *
 * 디자인:
 * - D-001 §17: Hero 최대 높이 520px
 */

export function ProfileHero() {
  // 소개문 첫 문단만 추출
  const introParagraph = representative.intro.split("\n")[0];

  // 유효한 contactLinks (https/mailto만 렌더)
  const validLinks = representative.contactLinks.filter((link) => {
    if (!link.url) return false;
    return link.url.startsWith("https://") || link.url.startsWith("mailto:");
  });

  return (
    <section className="mx-auto flex w-full max-h-[520px] max-w-screen-xl flex-col items-center justify-center gap-8 px-5 py-12 md:py-16">
      <div className="flex flex-col items-center gap-4 text-center">
        {/* 대표명 */}
        <h1 className="text-3xl font-bold text-ink md:text-4xl">
          {representative.name}
        </h1>

        {/* Metrics */}
        <p className="text-sm font-medium text-muted md:text-base">
          {representative.metrics.map((m) => m.value).join(" · ")}
        </p>

        {/* 소개문 첫 문단 */}
        <p className="max-w-xl text-sm leading-relaxed text-body md:text-base">
          {introParagraph}
        </p>

        {/* 문의·SNS 링크 */}
        {validLinks.length > 0 && (
          <div className="mt-4 flex flex-wrap justify-center gap-3">
            {validLinks.map((link) => (
              <Link
                key={link.platform}
                href={link.url}
                target={
                  link.url.startsWith("https://") ? "_blank" : undefined
                }
                rel={
                  link.url.startsWith("https://")
                    ? "noopener noreferrer"
                    : undefined
                }
                className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-ink transition-colors hover:bg-primary hover:text-white"
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
