"use client";

import Link from "next/link";
import { useState } from "react";

/**
 * 전역 Header(SHARED-LAYOUT) — design-reference/D-001/DESIGN.md §7
 * Desktop(1440) 72px / Mobile(390) 56px, 내비게이션 3개 + 계정 아이콘.
 */

const NAV_LINKS = [
  { href: "/travel-tools", label: "여행 준비" },
  { href: "/mates", label: "동행 찾기" },
  { href: "/about", label: "대표 소개" },
];

function AccountIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2" />
      <path
        d="M4 20c0-4.418 3.582-7 8-7s8 2.582 8 7"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function HamburgerIcon({ isOpen }: { isOpen: boolean }) {
  if (isOpen) {
    return (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M5 5l14 14M19 5L5 19"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    );
  }
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M4 7h16M4 12h16M4 17h16"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--color-hairline)] bg-[var(--color-canvas)]">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-[var(--spacing-token-lg)] sm:h-[72px]">
        <Link
          href="/"
          className="text-[18px] font-bold text-[var(--color-ink)]"
        >
          Free Traveler
        </Link>

        <nav
          aria-label="주요 내비게이션"
          className="hidden items-center gap-[var(--spacing-token-xl)] sm:flex"
        >
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-[16px] font-semibold text-[var(--color-body)] hover:text-[var(--color-primary)]"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-[var(--spacing-token-sm)]">
          <Link
            href="/account"
            aria-label="계정"
            className="flex h-9 w-9 items-center justify-center rounded-[var(--radius-token-full)] border border-[var(--color-hairline)] text-[var(--color-ink)]"
          >
            <AccountIcon />
          </Link>

          <button
            type="button"
            aria-label={isMenuOpen ? "메뉴 닫기" : "메뉴 열기"}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-nav"
            onClick={() => setIsMenuOpen((prev) => !prev)}
            className="flex h-9 w-9 items-center justify-center rounded-[var(--radius-token-full)] border border-[var(--color-hairline)] text-[var(--color-ink)] sm:hidden"
          >
            <HamburgerIcon isOpen={isMenuOpen} />
          </button>
        </div>
      </div>

      {isMenuOpen ? (
        <nav
          id="mobile-nav"
          aria-label="모바일 내비게이션"
          className="flex flex-col gap-[var(--spacing-token-sm)] border-t border-[var(--color-hairline)] px-[var(--spacing-token-lg)] py-[var(--spacing-token-md)] sm:hidden"
        >
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsMenuOpen(false)}
              className="text-[16px] font-semibold text-[var(--color-body)]"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      ) : null}
    </header>
  );
}
