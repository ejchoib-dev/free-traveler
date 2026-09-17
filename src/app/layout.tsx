import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { Footer } from "@/components/shared/Footer";
import { Header } from "@/components/shared/Header";
import { ToastProvider } from "@/components/shared/Toast";
import "./globals.css";

/**
 * 전역 레이아웃(SHARED-LAYOUT) — REQ-FUNC-064·065·070·079, REQ-NF-030
 *
 * Inter 폰트는 design-reference/D-001/DESIGN.md §3이 명시한 오픈소스 Google Fonts를
 * `next/font/google`로 셀프호스팅한다(App Router 권장 방식, 수동 `<link>`보다 빠르고
 * `no-page-custom-font` 경고도 없다). `src/app/globals.css`의 `--font-sans` 토큰
 * (SHARED-DESIGN-TOKENS)이 이미 "Inter"를 1순위로 지정해 두었으므로, 실제 @font-face가
 * "Inter"라는 이름으로 등록되면 별도 변수 연결 없이 그대로 적용된다.
 */

const inter = Inter({ subsets: ["latin"], display: "swap" });

const SITE_NAME = "Free Traveler";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

interface BuildPageMetadataInput {
  title: string;
  description: string;
  /** "/about"처럼 도메인을 뺀 경로 */
  path: string;
}

/** REQ-FUNC-070: 페이지별 title/description/canonical/OG 메타데이터 헬퍼 */
export function buildPageMetadata({
  title,
  description,
  path,
}: BuildPageMetadataInput): Metadata {
  const fullTitle = `${title} | ${SITE_NAME}`;
  return {
    title: fullTitle,
    description,
    alternates: { canonical: path },
    openGraph: {
      title: fullTitle,
      description,
      url: path,
      siteName: SITE_NAME,
      type: "website",
    },
  };
}

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  ...buildPageMetadata({
    title: SITE_NAME,
    description:
      "예약을 대행하지 않는 여행 정보/커뮤니티 허브 — 여행지 정보, 안전 정보, 동행 찾기를 한곳에서.",
    path: "/",
  }),
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko" className={`${inter.className} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <ToastProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </ToastProvider>
      </body>
    </html>
  );
}
