import { type NextRequest, NextResponse } from "next/server";

/**
 * Supabase Auth 세션 미들웨어(SHARED-AUTH-SETUP) — REQ-FUNC-066
 *
 * 모든 요청에서 Supabase 쿠키를 처리하고, 인증 상태를 유지한다.
 * CSRF 방어는 Supabase Cookie Strategy(SameSite=Lax)에 위임한다.
 */

export function middleware(request: NextRequest) {
  const response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  // Supabase 인증 쿠키가 있으면 응답에 추가 (세션 유지)
  const supabaseAuthToken = request.cookies.get("sb-auth-token");
  if (supabaseAuthToken) {
    response.cookies.set("sb-auth-token", supabaseAuthToken.value, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365, // 1년
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
    });
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * 모든 요청 경로에서 세션을 관리하되, 다음은 제외:
     * - _next/static (정적 파일)
     * - _next/image (이미지 최적화 파일)
     * - favicon.ico (파비콘)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.png).*)",
  ],
};
