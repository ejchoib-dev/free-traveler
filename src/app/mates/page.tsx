"use client";

import { useState } from "react";
import { MateList } from "@/components/scr004/MateList";
import { FilterMate } from "@/components/scr004/FilterMate";
import { MateDetailPanel } from "@/components/scr004/MateDetailPanel";
import { MateApplyForm } from "@/components/scr004/MateApplyForm";
import { SafetyGuide } from "@/components/scr004/SafetyGuide";

/**
 * PAGE-SCR004 — 동행 찾기 페이지 (/mates)
 *
 * REQ-FUNC-023, REQ-FUNC-030, REQ-FUNC-033~040, REQ-FUNC-043
 *
 * 구성:
 * 1. 소개 + 안전 가이드
 * 2. 필터
 * 3. 동행글 목록
 * 4. 상세 패널 (선택 시)
 * 5. 신청 폼 (신청 클릭 시)
 */

interface MockPost {
  id: string;
  title: string;
  description: string;
  country: string;
  region: string;
  startDate: string;
  endDate: string;
  recruitmentCount: number;
  travelStyle: string[];
  status: "OPEN" | "CLOSED";
  authorName: string;
  authorCountry: number;
}

const MOCK_POSTS: MockPost[] = [
  {
    id: "1",
    title: "도쿄 벚꽃 함께 갈 사람 찾습니다",
    description:
      "도쿄 벚꽃 시즌에 주요 관광지를 도는 여행입니다. 아키하바라, 센소지, 메이지 신궁 등을 함께 즐길 분을 찾고 있습니다.",
    country: "Japan",
    region: "Tokyo",
    startDate: "2026-05-01",
    endDate: "2026-05-07",
    recruitmentCount: 2,
    travelStyle: ["culture", "adventure"],
    status: "OPEN",
    authorName: "여행자_김",
    authorCountry: 15,
  },
];

export default function MatesPage() {
  const [selectedPost, setSelectedPost] = useState<MockPost | null>(null);
  const [showApplyForm, setShowApplyForm] = useState(false);

  return (
    <main className="min-h-screen w-full bg-white">
      <div className="mx-auto w-full max-w-screen-xl px-5 py-12 md:py-16">
        {/* 소개 */}
        <div className="mb-8 flex flex-col gap-3">
          <h1 className="text-3xl font-bold text-ink md:text-4xl">
            함께하는 여행
          </h1>
          <p className="max-w-2xl text-sm leading-relaxed text-body md:text-base">
            같은 시기에 같은 곳을 가는 여행자들을 만나세요. 안전하고 즐거운
            동행을 위해 신뢰할 수 있는 정보를 공유합니다.
          </p>
        </div>

        {/* 안전 가이드 */}
        <div className="mb-8">
          <SafetyGuide />
        </div>

        {/* 필터 */}
        <div className="mb-8">
          <h2 className="mb-4 text-xl font-semibold text-ink">검색</h2>
          <FilterMate
            onFilter={(filters) => {
              // 필터 적용 로직
            }}
          />
        </div>

        {/* 목록 */}
        <div className="mb-8">
          <h2 className="mb-4 text-xl font-semibold text-ink">모집 중인 동행</h2>
          <MateList />
        </div>
      </div>

      {/* 상세 패널 */}
      {selectedPost && (
        <MateDetailPanel
          post={selectedPost}
          onApply={() => setShowApplyForm(true)}
          onClose={() => setSelectedPost(null)}
          onBlock={() => {
            alert("사용자를 차단했습니다.");
            setSelectedPost(null);
          }}
          onReport={() => {
            alert("글을 신고했습니다.");
            setSelectedPost(null);
          }}
        />
      )}

      {/* 신청 폼 */}
      {showApplyForm && selectedPost && (
        <MateApplyForm
          matePostId={selectedPost.id}
          onSubmit={(message) => {
            alert("신청이 완료되었습니다.");
            setShowApplyForm(false);
            setSelectedPost(null);
          }}
          onCancel={() => setShowApplyForm(false)}
        />
      )}
    </main>
  );
}
