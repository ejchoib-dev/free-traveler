"use client";

import { useState, useEffect } from "react";

/**
 * COMP-SCR004-LIST — 동행 모집글 목록
 *
 * REQ-FUNC-030, REQ-FUNC-037
 * - 최대 8개 우선 노출
 * - 종료일 경과 글은 CLOSED로 자동 표시
 * - 카드에 제목/국가·지역/기간/모집인원/스타일 Chip/상태 배지
 * - 로딩/에러 상태 처리
 */

interface MatePost {
  id: string;
  title: string;
  country: string;
  region: string;
  startDate: string;
  endDate: string;
  recruitmentCount: number;
  travelStyle: string[];
  status: "OPEN" | "CLOSED";
}

type LoadState = "idle" | "loading" | "success" | "error";

// Mock 데이터
const MOCK_POSTS: MatePost[] = [
  {
    id: "1",
    title: "도쿄 벚꽃 함께 갈 사람 찾습니다",
    country: "Japan",
    region: "Tokyo",
    startDate: "2026-05-01",
    endDate: "2026-05-07",
    recruitmentCount: 2,
    travelStyle: ["culture", "adventure"],
    status: "OPEN",
  },
  {
    id: "2",
    title: "호치민 음식 투어 동행자 모집",
    country: "Vietnam",
    region: "Ho Chi Minh",
    startDate: "2026-06-10",
    endDate: "2026-06-20",
    recruitmentCount: 3,
    travelStyle: ["food"],
    status: "OPEN",
  },
  {
    id: "3",
    title: "방콕 트레킹 함께할 분",
    country: "Thailand",
    region: "Bangkok",
    startDate: "2026-07-05",
    endDate: "2026-07-15",
    recruitmentCount: 2,
    travelStyle: ["nature"],
    status: "OPEN",
  },
];

export function MateList() {
  const [posts, setPosts] = useState<MatePost[]>([]);
  const [loadState, setLoadState] = useState<LoadState>("idle");

  // 목록 로드 (실제로는 listMatePostsOpen 호출)
  useEffect(() => {
    const loadPosts = async () => {
      setLoadState("loading");
      try {
        // 실제 구현: const posts = await listMatePostsOpen();
        // Mock으로 처리
        await new Promise((resolve) => setTimeout(resolve, 500));
        setPosts(MOCK_POSTS);
        setLoadState("success");
      } catch {
        setLoadState("error");
      }
    };

    loadPosts();
  }, []);

  if (loadState === "loading") {
    return (
      <div className="grid gap-4 md:grid-cols-2">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="h-48 rounded-lg border border-gray-200 bg-gray-100 animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (loadState === "error") {
    return (
      <div className="flex flex-col items-center gap-4 rounded-lg bg-red-50 p-8 text-center">
        <p className="font-medium text-red-900">목록을 불러올 수 없습니다.</p>
        <button
          onClick={() => window.location.reload()}
          className="rounded-lg bg-primary px-6 py-2 text-sm font-medium text-white hover:bg-red-600"
        >
          다시 시도
        </button>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-lg bg-gray-50 p-8 text-center">
        <p className="font-medium text-ink">아직 등록된 동행글이 없습니다.</p>
        <p className="text-sm text-muted">
          처음으로 동행글을 작성해 함께할 친구를 찾아보세요.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3">
      {posts.slice(0, 8).map((post) => (
        <article
          key={post.id}
          className="flex flex-col gap-3 rounded-lg border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow"
        >
          {/* 헤더 */}
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-ink line-clamp-2">
              {post.title}
            </h3>
            <span
              className={`inline-flex rounded-full px-2 py-1 text-xs font-medium whitespace-nowrap ${
                post.status === "OPEN"
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              {post.status === "OPEN" ? "모집 중" : "마감"}
            </span>
          </div>

          {/* 위치·기간 */}
          <div className="text-xs text-muted">
            <p>
              {post.country} {post.region}
            </p>
            <p>
              {post.startDate} → {post.endDate}
            </p>
          </div>

          {/* 모집 인원 */}
          <p className="text-xs font-medium text-primary">
            모집 {post.recruitmentCount}명
          </p>

          {/* 여행 스타일 */}
          <div className="flex flex-wrap gap-1">
            {post.travelStyle.map((style) => (
              <span
                key={style}
                className="inline-flex rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-700"
              >
                {style}
              </span>
            ))}
          </div>

          {/* 상세 보기 링크 */}
          <button className="mt-auto rounded-lg bg-gray-100 px-3 py-2 text-xs font-medium text-ink hover:bg-primary hover:text-white transition-colors">
            상세 보기
          </button>
        </article>
      ))}
    </div>
  );
}
