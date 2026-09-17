/**
 * 디자인 토큰(TypeScript) — SHARED-DESIGN-TOKENS
 *
 * design-reference/D-001/DESIGN.md §2~6과 값이 정확히 일치해야 한다(Visual AC).
 * Tailwind 유틸리티(`src/app/globals.css`의 `@theme inline`)와 동일한 값의 짝이며,
 * Tailwind 클래스로 표현하기 어려운 JS 로직(예: 차트, 인라인 style)에서만 사용한다.
 */

export const colorTokens = {
  primary: "#FF6B4A",
  primaryActive: "#E24F2E",
  primaryDisabled: "#FFD8CC",
  ink: "#26262A",
  body: "#46484D",
  muted: "#71737B",
  mutedSoft: "#A0A2AA",
  canvas: "#FFFFFF",
  surfaceSoft: "#F7F7F8",
  surfaceStrong: "#EFEFF1",
  hairline: "#E3E3E6",
  hairlineSoft: "#ECECEE",
  borderStrong: "#C6C7CC",
  onPrimary: "#FFFFFF",
  danger: "#D1373F",
  dangerSoft: "#FDECEC",
  warning: "#B7791F",
  warningSoft: "#FFF4DE",
  critical: "#B42318",
  criticalSoft: "#FBE7E5",
  info: "#2F6FED",
  infoSoft: "#EAF1FE",
  success: "#147D53",
  successSoft: "#E7F6EE",
} as const;

export const fontStack =
  'Inter, -apple-system, "Apple SD Gothic Neo", "Malgun Gothic", "Noto Sans KR", system-ui, sans-serif';

export const typographyTokens = {
  displayXl: { size: "32px", weight: 700 },
  displayLg: { size: "24px", weight: 700 },
  displayMd: { size: "20px", weight: 600 },
  titleMd: { size: "18px", weight: 600 },
  titleSm: { size: "16px", weight: 600 },
  bodyMd: { size: "16px", weight: 400 },
  bodySm: { size: "14px", weight: 400 },
  caption: { size: "13px", weight: 500 },
  button: { size: "16px", weight: 600 },
} as const;

export const spacingTokens = {
  xxs: "2px",
  xs: "4px",
  sm: "8px",
  md: "12px",
  lg: "16px",
  xl: "24px",
  xxl: "32px",
  xxxl: "48px",
} as const;

export const sectionSpacingTokens = {
  heroDesktop: "64px",
  standardDesktop: "80px",
  ctaDesktop: "96px",
  standardMobile: "48px",
  compactMobile: "40px",
} as const;

export const radiusTokens = {
  sm: "8px",
  md: "12px",
  lg: "16px",
  full: "9999px",
} as const;

/** D-001 §6: 유일한 그림자 단계(카드 hover/Drawer/드롭다운 전용) */
export const shadowCard =
  "0 1px 2px rgba(20, 20, 20, 0.04), 0 4px 12px rgba(20, 20, 20, 0.08)";
