import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Supabase Auth 클라이언트(SHARED-AUTH-SETUP) — REQ-FUNC-066, REQ-NF-013/014
 *
 * Supabase 클라이언트를 생성하고, 세션 발급/검증·역할 판별을 제공한다.
 * CSRF 방어는 Supabase 기본 쿠키 전략(SameSite=Lax)으로 자동 처리된다.
 */

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

let supabaseClient: SupabaseClient | null = null;

export function createClient(): SupabaseClient {
  if (!supabaseClient) {
    supabaseClient = createSupabaseClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        flowType: "pkce",
      },
    });
  }
  return supabaseClient;
}

export function createBrowserSupabaseClient(): SupabaseClient {
  return createSupabaseClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      flowType: "pkce",
    },
  });
}

/** 현재 세션의 사용자와 역할 정보 */
export async function getSession() {
  const supabase = createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return session;
}

export async function getUser() {
  const supabase = createClient();
  const response = await supabase.auth.getUser();
  return response.data.user;
}

/**
 * 사용자의 역할 판별
 * - "admin": auth.user_metadata.admin === true
 * - "member": authenticated user (admin 아님)
 * - "guest": unauthenticated
 */
export async function getUserRole(): Promise<"admin" | "member" | "guest"> {
  const user = await getUser();
  if (!user) return "guest";

  const isAdmin = (user.user_metadata?.admin ?? false) === true;
  return isAdmin ? "admin" : "member";
}

/** 성인 인증 여부 확인 */
export async function isAdultVerified(): Promise<boolean> {
  const user = await getUser();
  if (!user) return false;
  return (user.user_metadata?.adult_verified ?? false) === true;
}

/** Admin 권한 확인 */
export async function isAdmin(): Promise<boolean> {
  const role = await getUserRole();
  return role === "admin";
}

/** 인증된 사용자 확인 */
export async function isAuthenticated(): Promise<boolean> {
  const session = await getSession();
  return !!session;
}
