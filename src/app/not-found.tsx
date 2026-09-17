"use client";

import Link from "next/link";

/**
 * 404 복구 화면(SHARED-ERROR-PAGES) — REQ-FUNC-078
 *
 * 이 파일은 root level not-found이므로 모든 경로의 404를 처리한다.
 * 전역 Header/Footer가 root layout.tsx를 통해 자동으로 감싼다.
 * window.history.back()을 사용하므로 'use client' 필수.
 */

export default function NotFound() {
  return (
    <div className="flex items-center justify-center px-[var(--spacing-token-lg)] py-[var(--spacing-section-standard-mobile)] sm:py-[var(--spacing-section-standard-desktop)]">
      <div className="w-full max-w-md text-center">
        <div className="mb-[var(--spacing-token-xl)]">
          <h1 className="text-[96px] font-bold text-[var(--color-primary)]">
            404
          </h1>
        </div>

        <div className="mb-[var(--spacing-token-lg)]">
          <h2 className="text-[32px] font-bold text-[var(--color-ink)]">
            페이지를 찾을 수 없습니다
          </h2>
          <p className="mt-[var(--spacing-token-sm)] text-[16px] text-[var(--color-body)]">
            요청하신 페이지가 존재하지 않거나 삭제되었을 수 있습니다.
          </p>
        </div>

        <div className="flex flex-col gap-[var(--spacing-token-sm)] sm:flex-row sm:justify-center">
          <Link
            href="/"
            className="rounded-[var(--radius-token-md)] bg-[var(--color-primary)] px-[var(--spacing-token-lg)] py-[var(--spacing-token-md)] text-[16px] font-semibold text-white hover:bg-[var(--color-primary-active)]"
          >
            홈으로 돌아가기
          </Link>
          <button
            type="button"
            onClick={() => window.history.back()}
            className="rounded-[var(--radius-token-md)] border border-[var(--color-hairline)] px-[var(--spacing-token-lg)] py-[var(--spacing-token-md)] text-[16px] font-semibold text-[var(--color-body)] hover:bg-[var(--color-surface-soft)]"
          >
            이전 페이지
          </button>
        </div>
      </div>
    </div>
  );
}
