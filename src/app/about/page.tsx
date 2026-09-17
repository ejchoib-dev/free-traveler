import { ProfileHero } from "@/components/scr002/ProfileHero";
import { Stats } from "@/components/scr002/Stats";
import { Story } from "@/components/scr002/Story";
import { Timeline } from "@/components/scr002/Timeline";
import { Countries } from "@/components/scr002/Countries";
import { Gallery } from "@/components/scr002/Gallery";
import { RecommendCTA } from "@/components/scr002/RecommendCTA";

/**
 * PAGE-SCR002 — 대표 소개 페이지 (/about)
 *
 * REQ-FUNC-057~063, REQ-FUNC-064, REQ-FUNC-065, REQ-FUNC-070, REQ-FUNC-079
 *
 * Section 순서:
 * 1. Profile Hero (대표명, metrics, 소개, 링크)
 * 2. 여행 지표 (Stats, 3개)
 * 3. 소개·철학 (Story)
 * 4. Timeline (6개)
 * 5. 방문국가 (Countries, 30개국)
 * 6. Gallery (8개 이미지, 추천 여행지 사진)
 * 7. 기억에 남는 여행지 (RecommendCTA, 4개)
 */

export default function AboutPage() {
  return (
    <main className="min-h-screen w-full bg-white">
      {/* 1. Profile Hero */}
      <ProfileHero />

      {/* 2. 여행 지표 */}
      <Stats />

      {/* 3. 소개·철학 */}
      <Story />

      {/* 4. Timeline */}
      <Timeline />

      {/* 5. 방문국가 */}
      <Countries />

      {/* 6. Gallery */}
      <Gallery />

      {/* 7. 기억에 남는 여행지 */}
      <RecommendCTA />
    </main>
  );
}
