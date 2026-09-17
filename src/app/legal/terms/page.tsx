import type { Metadata } from "next";

import { buildPageMetadata } from "@/app/layout";

export const metadata: Metadata = buildPageMetadata({
  title: "이용약관",
  description: "Free Traveler 서비스 이용약관",
  path: "/legal/terms",
});

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-[var(--spacing-token-lg)] py-[var(--spacing-section-standard-mobile)] sm:py-[var(--spacing-section-standard-desktop)]">
      <h1 className="text-[var(--text-display-lg)] font-bold text-[var(--color-ink)]">
        이용약관
      </h1>
      <p className="mt-[var(--spacing-token-sm)] text-[14px] text-[var(--color-muted)]">
        시행일: 2026-09-17
      </p>

      <div className="mt-[var(--spacing-token-xl)] flex flex-col gap-[var(--spacing-token-lg)] text-[16px] leading-relaxed text-[var(--color-body)]">
        <section>
          <h2 className="text-[18px] font-semibold text-[var(--color-ink)]">
            제1조 (목적)
          </h2>
          <p className="mt-[var(--spacing-token-xs)]">
            이 약관은 Free Traveler(이하 &ldquo;서비스&rdquo;)가 제공하는 여행지
            정보, 안전정보, 동행 찾기 기능의 이용 조건과 절차, 이용자와 서비스의
            권리·의무를 정합니다.
          </p>
        </section>

        <section>
          <h2 className="text-[18px] font-semibold text-[var(--color-ink)]">
            제2조 (서비스의 범위)
          </h2>
          <p className="mt-[var(--spacing-token-xs)]">
            서비스는 여행지·안전 정보를 제공하고, 회원 간 동행 모집글 작성·참가
            요청·승인 기능을 제공합니다. 서비스는 항공권·숙소 예약이나 결제를
            대행하지 않으며, 항공· 숙소 관련 화면은 외부 사이트로 이동하는
            링크만 제공합니다.
          </p>
        </section>

        <section>
          <h2 className="text-[18px] font-semibold text-[var(--color-ink)]">
            제3조 (회원가입 및 성인 인증)
          </h2>
          <p className="mt-[var(--spacing-token-xs)]">
            동행 모집글 작성, 참가 요청, 신고·차단 등 일부 기능은 회원가입과
            성인 인증을 완료한 이용자만 사용할 수 있습니다. 미인증 이용자는 해당
            화면에서 안내에 따라 로그인 또는 가입 절차를 진행해야 합니다.
          </p>
        </section>

        <section>
          <h2 className="text-[18px] font-semibold text-[var(--color-ink)]">
            제4조 (이용자의 의무)
          </h2>
          <p className="mt-[var(--spacing-token-xs)]">
            이용자는 동행 모집글·참가 메시지에 연락처 등 개인정보를 직접
            노출하지 않아야 하며, 허위 정보를 게시하거나 타인에게 피해를 주는
            행위를 해서는 안 됩니다. 안전수칙을 위반한 게시물은 신고 대상이
            되며, 서비스는 신고된 게시물의 상태를 변경할 수 있습니다.
          </p>
        </section>

        <section>
          <h2 className="text-[18px] font-semibold text-[var(--color-ink)]">
            제5조 (면책)
          </h2>
          <p className="mt-[var(--spacing-token-xs)]">
            서비스가 제공하는 여행지·안전 정보와 동행 모집글은 참고용이며, 실제
            여행 전 공식 출처(외교부 해외안전여행 등)를 통한 확인이 필요합니다.
            자세한 내용은
            <a
              href="/legal/content-disclaimer"
              className="text-[var(--color-primary)] underline"
            >
              콘텐츠 면책 안내
            </a>
            를 참고하세요.
          </p>
        </section>

        <section>
          <h2 className="text-[18px] font-semibold text-[var(--color-ink)]">
            제6조 (약관의 개정)
          </h2>
          <p className="mt-[var(--spacing-token-xs)]">
            이 약관은 서비스 개선에 따라 개정될 수 있으며, 개정 시 이 페이지를
            통해 공지합니다.
          </p>
        </section>
      </div>
    </div>
  );
}
