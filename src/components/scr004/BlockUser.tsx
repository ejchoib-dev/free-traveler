"use client";

import { useState } from "react";

/**
 * COMP-SCR004-BLOCK — 사용자 차단 모달
 *
 * REQ-FUNC-040
 * - 사용자 차단 기능
 * - 모달 형태로 제공
 */

interface BlockUserProps {
  userId: string;
  userName: string;
  onBlock: (userId: string) => void;
  onCancel: () => void;
}

export function BlockUser({
  userId,
  userName,
  onBlock,
  onCancel,
}: BlockUserProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleBlock = async () => {
    setIsSubmitting(true);
    // 실제 구현에서는 blockUser Server Action 호출
    await new Promise((resolve) => setTimeout(resolve, 500));
    onBlock(userId);
    setIsSubmitting(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="flex flex-col gap-4 rounded-lg bg-white p-6 md:max-w-md">
        <h2 className="text-lg font-semibold text-ink">사용자 차단</h2>
        <p className="text-sm text-body">
          <strong>{userName}</strong>을(를) 차단하면 더 이상 이 사용자의 글을
          보거나 연락할 수 없습니다.
        </p>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-ink hover:bg-gray-50"
          >
            취소
          </button>
          <button
            onClick={handleBlock}
            disabled={isSubmitting}
            className="flex-1 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:bg-gray-300"
          >
            {isSubmitting ? "차단 중..." : "차단"}
          </button>
        </div>
      </div>
    </div>
  );
}
