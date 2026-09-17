"use client";

import { useState } from "react";

/**
 * COMP-SCR004-APPLY — 동행 신청 폼
 *
 * REQ-FUNC-034, REQ-FUNC-035
 * - 신청 메시지 입력 (최대 500자)
 * - 신청 제출
 */

interface MateApplyFormProps {
  matePostId: string;
  onSubmit: (message: string) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export function MateApplyForm({
  onSubmit,
  onCancel,
  isSubmitting = false,
}: MateApplyFormProps) {
  const [message, setMessage] = useState("");

  const isValid = message.trim().length > 0 && message.length <= 500;

  const handleSubmit = () => {
    if (isValid) {
      onSubmit(message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end bg-black bg-opacity-50 md:items-center md:justify-center">
      <div className="w-full rounded-t-2xl bg-white p-6 md:rounded-lg md:max-w-md">
        <h2 className="mb-4 text-lg font-semibold text-ink">
          동행글에 신청하기
        </h2>

        <p className="mb-4 text-sm text-muted">
          자신을 소개하고 함께 여행하고 싶은 이유를 설명해주세요.
        </p>

        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="min-h-32 w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary resize-none"
          placeholder="안녕하세요. 함께 여행하고 싶습니다..."
          maxLength={500}
        />

        <p className="mb-4 text-xs text-muted text-right">
          {message.length}/500
        </p>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 rounded-lg border border-gray-300 px-4 py-2 font-medium text-ink hover:bg-gray-50"
          >
            취소
          </button>
          <button
            onClick={handleSubmit}
            disabled={!isValid || isSubmitting}
            className="flex-1 rounded-lg bg-primary px-4 py-2 font-medium text-white hover:bg-red-600 disabled:bg-gray-300"
          >
            {isSubmitting ? "신청 중..." : "신청"}
          </button>
        </div>
      </div>
    </div>
  );
}
