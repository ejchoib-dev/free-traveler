"use client";

import { useState } from "react";
import { destinations } from "@/data/destinations";

/**
 * COMP-SCR003-MATE-WRITE — 동행글 입력·작성
 *
 * REQ-FUNC-030, REQ-FUNC-031, REQ-FUNC-032, REQ-FUNC-033
 * - 여행지, 출발일, 귀국일, 모집 인원, 여행 스타일, 설명 입력
 * - 유효성 검증
 * - 작성 완료 후 /travel-tools로 표시
 *
 * 설계:
 * - 클라이언트 상태 관리 (미리보기)
 * - 서버 전송은 DB-ACCESS의 createMatePost 사용
 */

interface MatePostForm {
  country: string;
  startDate: string;
  endDate: string;
  recruitmentCount: number;
  travelStyle: string[];
  description: string;
  safetyAgreed: boolean;
}

export function MateWriteTab() {
  const [form, setForm] = useState<MatePostForm>({
    country: "",
    startDate: "",
    endDate: "",
    recruitmentCount: 1,
    travelStyle: [],
    description: "",
    safetyAgreed: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const isValid =
    form.country &&
    form.startDate &&
    form.endDate &&
    form.recruitmentCount > 0 &&
    form.travelStyle.length > 0 &&
    form.description.trim().length > 0 &&
    form.safetyAgreed;

  const handleTravelStyleToggle = (style: string) => {
    setForm((prev) => ({
      ...prev,
      travelStyle: prev.travelStyle.includes(style)
        ? prev.travelStyle.filter((s) => s !== style)
        : [...prev.travelStyle, style],
    }));
  };

  const handleSubmit = async () => {
    if (!isValid) return;

    setIsSubmitting(true);
    // 실제 구현에서는 createMatePost Server Action을 호출
    // await createMatePost({ ... })
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 1000);
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-lg bg-green-50 p-8 text-center">
        <p className="text-lg font-semibold text-green-900">
          동행글이 등록되었습니다!
        </p>
        <p className="text-sm text-green-700">
          다른 여행자들과 함께 안전하고 즐거운 여행을 시작하세요.
        </p>
        <button
          onClick={() => setSubmitted(false)}
          className="mt-4 rounded-lg bg-primary px-6 py-2 text-sm font-medium text-white hover:bg-red-600"
        >
          다시 작성
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* 국가·지역 */}
      <div className="grid gap-4 md:grid-cols-2">
        <select
          value={form.country}
          onChange={(e) => setForm({ ...form, country: e.target.value })}
          className="rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-primary focus:ring-1 focus:ring-primary"
        >
          <option value="">국가 선택</option>
          {Array.from(new Set(destinations.map((d) => d.country))).map(
            (country) => (
              <option key={country} value={country}>
                {country}
              </option>
            )
          )}
        </select>

        {/* 모집 인원 */}
        <input
          type="number"
          min="1"
          max="20"
          value={form.recruitmentCount}
          onChange={(e) =>
            setForm({
              ...form,
              recruitmentCount: parseInt(e.target.value) || 1,
            })
          }
          className="rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-primary focus:ring-1 focus:ring-primary"
          placeholder="모집 인원"
        />
      </div>

      {/* 출발일·귀국일 */}
      <div className="grid gap-4 md:grid-cols-2">
        <input
          type="date"
          value={form.startDate}
          onChange={(e) => setForm({ ...form, startDate: e.target.value })}
          className="rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-primary focus:ring-1 focus:ring-primary"
        />

        <input
          type="date"
          value={form.endDate}
          onChange={(e) => setForm({ ...form, endDate: e.target.value })}
          className="rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-primary focus:ring-1 focus:ring-primary"
        />
      </div>

      {/* 여행 스타일 */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-ink">여행 스타일</label>
        <div className="flex flex-wrap gap-2">
          {["모험", "문화", "음식", "자연", "휴식"].map((style) => (
            <button
              key={style}
              onClick={() => handleTravelStyleToggle(style)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                form.travelStyle.includes(style)
                  ? "bg-primary text-white"
                  : "border border-gray-300 text-ink hover:border-primary"
              }`}
            >
              {style}
            </button>
          ))}
        </div>
      </div>

      {/* 설명 */}
      <textarea
        value={form.description}
        onChange={(e) => setForm({ ...form, description: e.target.value })}
        className="min-h-32 rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-primary focus:ring-1 focus:ring-primary"
        placeholder="여행에 대해 소개해주세요..."
        maxLength={500}
      />
      <p className="text-xs text-muted">
        {form.description.length}/500
      </p>

      {/* 안전 동의 */}
      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={form.safetyAgreed}
          onChange={(e) =>
            setForm({ ...form, safetyAgreed: e.target.checked })
          }
          className="h-4 w-4 rounded border-gray-300"
        />
        <span className="text-sm text-body">
          안전 수칙을 이해하고 동의합니다.
        </span>
      </label>

      {/* 제출 버튼 */}
      <button
        onClick={handleSubmit}
        disabled={!isValid || isSubmitting}
        className="rounded-lg bg-primary px-6 py-3 font-medium text-white transition-all hover:bg-red-600 disabled:bg-gray-300"
      >
        {isSubmitting ? "등록 중..." : "동행글 등록"}
      </button>
    </div>
  );
}
