import Link from "next/link";
import type { ReactNode } from "react";

import { representative } from "@/data/representative";

/**
 * 전역 Footer(SHARED-LAYOUT) — design-reference/D-001/DESIGN.md §7
 * 3열(Desktop) → 1열(Mobile): 서비스 / 정책 / 안내. 하단 고지문 고정.
 *
 * "정책" 4개 경로는 docs/DECISION_LOG.md DEC-015로 추가된 정적 페이지다
 * (COMP-LEGAL-DOCS Task가 실제 본문을 만든다).
 */

const MOFA_SAFETY_URL = process.env.MOFA_SAFETY_URL ?? "https://www.0404.go.kr";

const SERVICE_LINKS = [
  { href: "/travel-tools", label: "여행 준비" },
  { href: "/mates", label: "동행 찾기" },
  { href: "/about", label: "대표 소개" },
  { href: "/", label: "국가별 안전정보" },
];

const POLICY_LINKS = [
  { href: "/legal/terms", label: "이용약관" },
  { href: "/legal/privacy", label: "개인정보처리방침" },
  { href: "/legal/companion-guidelines", label: "동행 안전수칙" },
  { href: "/legal/content-disclaimer", label: "콘텐츠 면책" },
];

function FooterColumn({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-[var(--spacing-token-sm)]">
      <h2 className="text-[13px] font-semibold text-[var(--color-muted)]">
        {title}
      </h2>
      {children}
    </div>
  );
}

export function Footer() {
  const contactEmail = representative.contactLinks.find(
    (link) => link.platform === "email",
  );

  return (
    <footer className="border-t border-[var(--color-hairline)] bg-[var(--color-surface-soft)]">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-[var(--spacing-token-xl)] px-[var(--spacing-token-lg)] py-[var(--spacing-section-standard-mobile)] sm:grid-cols-3 sm:py-[var(--spacing-token-xxl)]">
        <FooterColumn title="서비스">
          <ul className="flex flex-col gap-[var(--spacing-token-xs)]">
            {SERVICE_LINKS.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className="text-[14px] text-[var(--color-body)] hover:text-[var(--color-primary)]"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </FooterColumn>

        <FooterColumn title="정책">
          <ul className="flex flex-col gap-[var(--spacing-token-xs)]">
            {POLICY_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-[14px] text-[var(--color-body)] hover:text-[var(--color-primary)]"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </FooterColumn>

        <FooterColumn title="안내">
          <ul className="flex flex-col gap-[var(--spacing-token-xs)]">
            <li>
              <a
                href={MOFA_SAFETY_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[14px] text-[var(--color-body)] hover:text-[var(--color-primary)]"
              >
                공식 출처: 외교부 해외안전여행
              </a>
            </li>
            {contactEmail ? (
              <li>
                <a
                  href={contactEmail.url}
                  className="text-[14px] text-[var(--color-body)] hover:text-[var(--color-primary)]"
                >
                  문의
                </a>
              </li>
            ) : null}
          </ul>
        </FooterColumn>
      </div>

      <div className="border-t border-[var(--color-hairline-soft)] px-[var(--spacing-token-lg)] py-[var(--spacing-token-md)]">
        <p className="mx-auto max-w-6xl text-[13px] text-[var(--color-muted)]">
          본 서비스는 항공·호텔 예약을 대행하지 않으며, 안전정보는 공식 출처
          확인을 대체하지 않습니다.
        </p>
      </div>
    </footer>
  );
}
