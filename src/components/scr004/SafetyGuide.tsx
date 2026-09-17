"use client";

/**
 * COMP-SCR004-SAFETY-GUIDE — 안전 가이드
 *
 * REQ-FUNC-043
 * - 동행 시 안전 수칙 표시
 * - 사기 방지, 개인정보 보호 등
 */

export function SafetyGuide() {
  return (
    <div className="rounded-lg border border-blue-200 bg-blue-50 p-6">
      <h3 className="mb-4 flex items-center gap-2 font-semibold text-blue-900">
        <span className="text-lg">🛡️</span> 안전 가이드
      </h3>

      <div className="flex flex-col gap-3 text-sm text-blue-800">
        <div>
          <p className="font-medium">✓ 안전한 연락</p>
          <p className="mt-1 text-xs text-blue-700">
            먼저 이 플랫폼에서 대화를 나눈 후 개인 연락처를 공유하세요.
          </p>
        </div>

        <div>
          <p className="font-medium">✓ 신원 확인</p>
          <p className="mt-1 text-xs text-blue-700">
            실제 프로필 정보를 사용하고 충분한 정보를 공유하는 사람을 신뢰하세요.
          </p>
        </div>

        <div>
          <p className="font-medium">✓ 개인정보 보호</p>
          <p className="mt-1 text-xs text-blue-700">
            주민등록번호, 계좌번호, 신용카드 정보는 절대 공유하지 마세요.
          </p>
        </div>

        <div>
          <p className="font-medium">✓ 공개 장소</p>
          <p className="mt-1 text-xs text-blue-700">
            처음 만날 때는 공개된 장소에서 만나고, 신뢰할 수 있는 사람에게 알리세요.
          </p>
        </div>

        <div>
          <p className="font-medium">✓ 의심스러운 경우</p>
          <p className="mt-1 text-xs text-blue-700">
            이상하거나 위협적이라고 느껴지면 즉시 신고하고 연락을 끊으세요.
          </p>
        </div>
      </div>
    </div>
  );
}
