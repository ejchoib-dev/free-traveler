"use client";

import { useState } from "react";

/**
 * COMP-SCR003-INTRO-TABS — Intro + 탭 컨트롤러
 *
 * REQ-FUNC-064
 * - 3탭: 항공편, 숙소, 동행 구하기
 * - 탭 전환 시 다른 탭 상태 보존
 * - underline 탭, 활성 탭은 코랄(primary) 색상
 *
 * 디자인:
 * - D-001 §10: underline tab pattern
 * - D-001 §2: primary(코랄) 색상으로 활성 표시
 */

type Tab = "flight" | "hotel" | "mate";

interface TabConfig {
  id: Tab;
  label: string;
  icon?: string;
}

const TABS: TabConfig[] = [
  { id: "flight", label: "항공편" },
  { id: "hotel", label: "숙소" },
  { id: "mate", label: "동행 구하기" },
];

export function TabsShell() {
  const [activeTab, setActiveTab] = useState<Tab>("flight");

  return (
    <section className="mx-auto w-full max-w-screen-xl px-5 py-12 md:py-16">
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
        {TABS.map((tab) => (
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
        {activeTab === "flight" && (
          <div className="flex flex-col gap-6 rounded-lg border border-gray-200 bg-gray-50 p-6 md:p-8">
            <h2 className="text-2xl font-semibold text-ink">항공편 검색</h2>
            <p className="text-sm text-muted">
              항공편 검색 기능은 여기에 표시됩니다.
            </p>
            {/* 항공편 검색 폼 placeholder */}
            <div className="flex flex-col gap-4">
              <div className="h-10 rounded-lg bg-white" />
              <div className="h-10 rounded-lg bg-white" />
              <div className="h-10 rounded-lg bg-primary text-white" />
            </div>
          </div>
        )}

        {activeTab === "hotel" && (
          <div className="flex flex-col gap-6 rounded-lg border border-gray-200 bg-gray-50 p-6 md:p-8">
            <h2 className="text-2xl font-semibold text-ink">숙소 검색</h2>
            <p className="text-sm text-muted">
              숙소 검색 기능은 여기에 표시됩니다.
            </p>
            {/* 숙소 검색 폼 placeholder */}
            <div className="flex flex-col gap-4">
              <div className="h-10 rounded-lg bg-white" />
              <div className="h-10 rounded-lg bg-white" />
              <div className="h-10 rounded-lg bg-primary text-white" />
            </div>
          </div>
        )}

        {activeTab === "mate" && (
          <div className="flex flex-col gap-6 rounded-lg border border-gray-200 bg-gray-50 p-6 md:p-8">
            <h2 className="text-2xl font-semibold text-ink">동행 구하기</h2>
            <p className="text-sm text-muted">
              동행자 찾기 기능은 여기에 표시됩니다.
            </p>
            {/* 동행 구하기 폼 placeholder */}
            <div className="flex flex-col gap-4">
              <div className="h-10 rounded-lg bg-white" />
              <div className="h-10 rounded-lg bg-white" />
              <div className="h-10 rounded-lg bg-primary text-white" />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
