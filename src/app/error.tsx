"use client";

import Link from "next/link";
import { useEffect } from "react";

/**
 * 500/런타임 오류 복구 화면(SHARED-ERROR-PAGES) — REQ-FUNC-078
 *
 * 이 Client Component는 root level error.tsx로 모든 경로의 런타임 오류를 처리한다.
 * 전역 Header/Footer가 root layout.tsx를 통해 자동으로 감싼다.
 */

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="flex items-center justify-center px-[var(--spacing-token-lg)] py-[var(--spacing-section-standard-mobile)] sm:py-[var(--spacing-section-standard-desktop)]">
      <div className="w-full max-w-md text-center">
        <div className="mb-[var(--spacing-token-xl)]">
          <h1 className="text-[96px] font-bold text-[var(--color-danger)]">
            500
          </h1>
        </div>

        <div className="mb-[var(--spacing-token-lg)]">
          <h2 className="text-[32px] font-bold text-[var(--color-ink)]">
            문제가 발생했습니다
          </h2>
          <p className="mt-[var(--spacing-token-sm)] text-[16px] text-[var(--color-body)]">
            잠시 후 다시 시도하거나 홈으로 돌아가세요.
          </p>
          {error.digest ? (
            <p className="mt-[var(--spacing-token-xs)] text-[14px] text-[var(--color-muted)]">
              오류 ID: {error.digest}
            </p>
          ) : null}
        </div>

        <div className="flex flex-col gap-[var(--spacing-token-sm)] sm:flex-row sm:justify-center">
          <button
            type="button"
            onClick={() => reset()}
            className="rounded-[var(--radius-token-md)] bg-[var(--color-primary)] px-[var(--spacing-token-lg)] py-[var(--spacing-token-md)] text-[16px] font-semibold text-white hover:bg-[var(--color-primary-active)]"
          >
            다시 시도
          </button>
          <Link
            href="/"
            className="rounded-[var(--radius-token-md)] border border-[var(--color-hairline)] px-[var(--spacing-token-lg)] py-[var(--spacing-token-md)] text-[16px] font-semibold text-[var(--color-body)] hover:bg-[var(--color-surface-soft)]"
          >
            홈으로 돌아가기
          </Link>
        </div>
      </div>
    </div>
  );
}
