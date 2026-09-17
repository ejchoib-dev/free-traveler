"use client";

import { useState } from "react";

/**
 * COMP-SCR004-REPORT — 글 신고 모달
 *
 * REQ-FUNC-039
 * - 동행글 신고 기능
 * - 신고 사유 선택 및 설명
 */

interface ReportPostProps {
  postTitle: string;
  onReport: (reason: string, description: string) => void;
  onCancel: () => void;
}

const REPORT_REASONS = [
  "부적절한 내용",
  "사기 의심",
  "안전 위협",
  "개인정보 노출",
  "기타",
];

export function ReportPost({
  postTitle,
  onReport,
  onCancel,
}: ReportPostProps) {
  const [reason, setReason] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isValid = reason && description.trim().length > 0;

  const handleSubmit = async () => {
    if (!isValid) return;

    setIsSubmitting(true);
    // 실제 구현에서는 createReport Server Action 호출
    await new Promise((resolve) => setTimeout(resolve, 500));
    onReport(reason, description);
    setIsSubmitting(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="flex flex-col gap-4 rounded-lg bg-white p-6 md:max-w-md">
        <h2 className="text-lg font-semibold text-ink">글 신고</h2>
        <p className="text-sm text-muted">{postTitle}</p>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-ink">신고 사유</label>
          <select
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
          >
            <option value="">선택해주세요</option>
            {REPORT_REASONS.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>

        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="min-h-24 rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
          placeholder="자세한 내용을 입력해주세요..."
          maxLength={500}
        />
        <p className="text-xs text-muted">{description.length}/500</p>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-ink hover:bg-gray-50"
          >
            취소
          </button>
          <button
            onClick={handleSubmit}
            disabled={!isValid || isSubmitting}
            className="flex-1 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-red-600 disabled:bg-gray-300"
          >
            {isSubmitting ? "신고 중..." : "신고"}
          </button>
        </div>
      </div>
    </div>
  );
}
