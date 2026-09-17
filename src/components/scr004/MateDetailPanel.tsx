"use client";

/**
 * COMP-SCR004-DETAIL — 동행글 상세 패널
 *
 * REQ-FUNC-033, REQ-FUNC-036, REQ-FUNC-038
 * - 모집글 상세 정보 표시 (제목, 설명, 기간, 모집인원 등)
 * - 작성자 정보
 * - 신청 버튼
 */

interface MatePost {
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

interface MateDetailPanelProps {
  post: MatePost;
  onApply: () => void;
  onClose: () => void;
  onBlock: () => void;
  onReport: () => void;
}

export function MateDetailPanel({
  post,
  onApply,
  onClose,
  onBlock,
  onReport,
}: MateDetailPanelProps) {
  return (
    <div className="fixed inset-0 z-40 flex items-end bg-black bg-opacity-50 md:items-center md:justify-end">
      <div className="h-[90vh] w-full overflow-y-auto rounded-t-2xl bg-white p-6 md:h-screen md:w-[520px] md:rounded-none md:overflow-y-auto">
        {/* 헤더 */}
        <div className="mb-6 flex items-start justify-between">
          <div className="flex-1">
            <h2 className="text-2xl font-semibold text-ink">{post.title}</h2>
            <p className="mt-1 text-sm text-muted">
              {post.country} {post.region}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-2xl text-muted hover:text-ink"
          >
            ×
          </button>
        </div>

        {/* 주요 정보 */}
        <div className="mb-6 grid gap-4 rounded-lg bg-gray-50 p-4 md:grid-cols-2">
          <div>
            <p className="text-xs text-muted">기간</p>
            <p className="text-sm font-medium text-ink">
              {post.startDate} ~ {post.endDate}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted">모집 인원</p>
            <p className="text-sm font-medium text-ink">
              {post.recruitmentCount}명
            </p>
          </div>
          <div className="md:col-span-2">
            <p className="text-xs text-muted mb-1">여행 스타일</p>
            <div className="flex flex-wrap gap-1">
              {post.travelStyle.map((style) => (
                <span
                  key={style}
                  className="inline-flex rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary"
                >
                  {style}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* 설명 */}
        <div className="mb-6">
          <h3 className="mb-2 font-semibold text-ink">여행 정보</h3>
          <p className="text-sm leading-relaxed text-body">
            {post.description}
          </p>
        </div>

        {/* 작성자 정보 */}
        <div className="mb-6 rounded-lg border border-gray-200 p-4">
          <p className="text-sm font-medium text-ink">{post.authorName}</p>
          <p className="text-xs text-muted">
            {post.authorCountry}개국 방문
          </p>
        </div>

        {/* 상태 배지 */}
        <div className="mb-6">
          <span
            className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
              post.status === "OPEN"
                ? "bg-green-100 text-green-700"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            {post.status === "OPEN" ? "모집 중" : "마감"}
          </span>
        </div>

        {/* 액션 버튼 */}
        <div className="flex flex-col gap-3">
          <button
            onClick={onApply}
            disabled={post.status === "CLOSED"}
            className="rounded-lg bg-primary px-6 py-3 font-medium text-white hover:bg-red-600 disabled:bg-gray-300"
          >
            신청하기
          </button>

          <div className="flex gap-3">
            <button
              onClick={onBlock}
              className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-ink hover:bg-gray-50"
            >
              차단
            </button>
            <button
              onClick={onReport}
              className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-ink hover:bg-gray-50"
            >
              신고
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
