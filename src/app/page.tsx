"use client";

import { HeroSearch } from "@/components/scr001/HeroSearch";
import { DomesticGrid } from "@/components/scr001/DomesticGrid";
import { OverseasGrid } from "@/components/scr001/OverseasGrid";
import { ThemeChips } from "@/components/scr001/ThemeChips";
import { CountryNoticeGrid } from "@/components/scr001/CountryNoticeGrid";
import { MatePreview } from "@/components/scr001/MatePreview";
import { AboutBanner } from "@/components/scr001/AboutBanner";
import { DestinationDrawer } from "@/components/scr001/DestinationDrawer";
import { useState } from "react";
import type { Destination } from "@/data/destinations";

/**
 * PAGE-SCR001 — 메인 페이지
 *
 * REQ-FUNC-001, REQ-FUNC-064, REQ-FUNC-065, REQ-FUNC-070, REQ-FUNC-079
 *
 * 디자인 정본: design-reference/UI_CONTRACT.md (SCR-001 절)
 * Section 순서:
 * 1. 검색 Hero (keyword + 필터)
 * 2. 국내 여행지 (Card Grid 6)
 * 3. 해외 여행지 (Card Grid 6)
 * 4. 여행 테마 (Chip 6)
 * 5. 국가별 주의사항 (Card Grid 6)
 * 6. 최근 동행글 (미리보기 또는 Empty)
 * 7. 대표 소개 CTA Banner
 */

export default function Home() {
  const [selectedDestination, setSelectedDestination] =
    useState<Destination | null>(null);

  return (
    <main className="min-h-screen w-full bg-white">
      {/* 1. 검색 Hero */}
      <HeroSearch />

      {/* 2. 국내 여행지 */}
      <DomesticGrid />

      {/* 3. 해외 여행지 */}
      <OverseasGrid />

      {/* 4. 여행 테마 */}
      <ThemeChips />

      {/* 5. 국가별 주의사항 */}
      <CountryNoticeGrid />

      {/* 6. 최근 동행글 */}
      <MatePreview />

      {/* 7. 대표 소개 CTA Banner */}
      <AboutBanner />

      {/* Destination Drawer (floating) */}
      <DestinationDrawer
        destination={selectedDestination}
        onClose={() => setSelectedDestination(null)}
      />
    </main>
  );
}
