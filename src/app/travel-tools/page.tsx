"use client";

import { useState } from "react";
import { FlightTab } from "@/components/scr003/FlightTab";
import { HotelTab } from "@/components/scr003/HotelTab";
import { MateWriteTab } from "@/components/scr003/MateWriteTab";

/**
 * PAGE-SCR003 — 여행 준비 도구 페이지 (/travel-tools)
 *
 * REQ-FUNC-011~018, REQ-FUNC-030~033, REQ-FUNC-064
 *
 * Section:
 * 1. Intro + 탭 네비게이션 (항공편, 숙소, 동행 구하기)
 * 2. 각 탭의 콘텐츠
 *   - FlightTab: 항공권 검색
 *   - HotelTab: 숙소 검색
 *   - MateWriteTab: 동행글 작성
 */

type Tab = "flight" | "hotel" | "mate";

const TAB_CONFIG = [
  { id: "flight" as const, label: "항공편" },
  { id: "hotel" as const, label: "숙소" },
  { id: "mate" as const, label: "동행 구하기" },
];

export default function TravelToolsPage() {
  const [activeTab, setActiveTab] = useState<Tab>("flight");

  return (
    <main className="min-h-screen w-full bg-white">
      <div className="mx-auto w-full max-w-screen-xl px-5 py-12 md:py-16">
        {/* 소개 */}
        <div className="mb-8 flex flex-col gap-3">
          <h1 className="text-3xl font-bold text-ink md:text-4xl">
            여행 준비 도구
          </h1>
          <p className="max-w-2xl text-sm leading-relaxed text-body md:text-base">
            항공권 검색, 숙소 예약, 동행자 찾기까지 여행에 필요한 모든 것을 한
            곳에서 준비하세요.
          </p>
        </div>

        {/* 탭 네비게이션 */}
        <div className="mb-8 flex border-b border-gray-200">
          {TAB_CONFIG.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 font-medium transition-colors md:px-6 md:py-4 ${
                activeTab === tab.id
                  ? "border-b-2 border-primary text-primary"
                  : "border-b-2 border-transparent text-muted hover:text-ink"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* 탭 콘텐츠 */}
        <div className="min-h-96">
          {activeTab === "flight" && <FlightTab />}
          {activeTab === "hotel" && <HotelTab />}
          {activeTab === "mate" && <MateWriteTab />}
        </div>
      </div>
    </main>
  );
}
