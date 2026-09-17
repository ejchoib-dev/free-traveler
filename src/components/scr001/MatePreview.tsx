"use client";

import Link from "next/link";

/**
 * COMP-SCR001-MATE-PREVIEW — 동행 미리보기(좌우 분할)
 *
 * REQ-FUNC-030, REQ-FUNC-043
 * - 좌: 동행 모집 안내 텍스트
 * - 우: 열린 모집글 카드 3개
 * - 빈 결과 시 CTA로 동행글 작성 유도
 *
 * 디자인:
 * - D-001 §17: 좌우 분할 레이아웃
 */

const mockMates = [
  {
    id: "mate-1",
    title: "도쿄 벚꽃 함께 갈 사람 찾습니다",
    country: "Japan",
    startDate: "2026-05-01",
    endDate: "2026-05-07",
    recruitmentCount: 2,
  },
  {
    id: "mate-2",
    title: "호치민 음식 투어 동행자 모집",
    country: "Vietnam",
    startDate: "2026-06-10",
    endDate: "2026-06-20",
    recruitmentCount: 3,
  },
  {
    id: "mate-3",
    title: "방콕 트레킹 함께할 분",
    country: "Thailand",
    startDate: "2026-07-05",
    endDate: "2026-07-15",
    recruitmentCount: 2,
  },
];

export function MatePreview() {
  const hasData = mockMates && mockMates.length > 0;

  return (
    <section className="mx-auto w-full max-w-screen-xl px-5 py-12 md:py-16">
      <div className="grid gap-8 md:grid-cols-2 md:gap-12">
        {/* 좌: 안내 텍스트 */}
        <div className="flex flex-col justify-center gap-4">
          <h2 className="text-2xl font-semibold text-ink md:text-3xl">
            함께하는 여행
          </h2>
          <p className="text-sm text-muted md:text-base">
            같은 시기에 같은 곳을 가는 여행자들을 만나세요. 안전하고 즐거운
            동행을 위해 신뢰할 수 있는 정보를 공유합니다.
          </p>

          {hasData ? (
            <Link
              href="/travel-tools"
              className="mt-4 inline-flex w-fit items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-medium text-white transition-all hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
              동행 전체 보기 →
            </Link>
          ) : (
            <Link
              href="/travel-tools"
              className="mt-4 inline-flex w-fit items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-medium text-white transition-all hover:bg-red-600"
            >
              동행글 작성하기 →
            </Link>
          )}
        </div>

        {/* 우: 카드 그리드 */}
        {hasData ? (
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2">
            {mockMates.map((mate) => (
              <article
                key={mate.id}
                className="flex flex-col gap-3 rounded-lg border border-gray-200 bg-white p-4 transition-shadow hover:shadow-md"
              >
                <h3 className="font-semibold text-ink line-clamp-2">
                  {mate.title}
                </h3>
                <div className="flex items-center justify-between text-xs text-muted">
                  <span>{mate.country}</span>
                  <span>모집 {mate.recruitmentCount}명</span>
                </div>
                <p className="text-xs text-body">
                  {mate.startDate} ~ {mate.endDate}
                </p>
              </article>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-4 rounded-lg bg-gray-50 p-12 text-center">
            <p className="text-base font-medium text-ink">
              현재 등록된 동행글이 없습니다.
            </p>
            <p className="text-sm text-muted">
              처음으로 동행글을 작성해보세요.
            </p>
            <Link
              href="/travel-tools"
              className="mt-4 rounded-lg bg-primary px-6 py-2 text-sm font-medium text-white transition-all hover:bg-red-600"
            >
              동행글 작성하기
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
