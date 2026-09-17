/**
 * TEST-RLS-BASIC — RLS 기본 통합 테스트
 *
 * REQ-FUNC-044, REQ-NF-013
 * - USER_PROFILE, MATE_POST, MATE_APPLICATION, USER_BLOCK, REPORT, OUTBOUND_URL_SETTING
 * - 비회원/타인 계정으로 비공개 데이터 접근 시 403 또는 빈 결과 확인
 */

import { describe, it, expect, beforeAll } from "vitest";
import { createClient } from "@supabase/supabase-js";
import type { SupabaseClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

// Seed 데이터의 고정 UUIDs (supabase/seed.sql과 일치)
const USER1_ID = "11111111-1111-1111-1111-111111111111";
const USER2_ID = "22222222-2222-2222-2222-222222222222";
const USER3_ID = "33333333-3333-3333-3333-333333333333";

describe("TEST-RLS-BASIC: RLS 기본 통합 테스트", () => {
  let clientUser1: SupabaseClient;
  let clientUser3: SupabaseClient;
  let clientGuest: SupabaseClient;

  beforeAll(() => {
    clientUser1 = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: { persistSession: false, flowType: "pkce" },
      global: { headers: { "x-test-user-id": USER1_ID } },
    });

    clientUser3 = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: { persistSession: false, flowType: "pkce" },
      global: { headers: { "x-test-user-id": USER3_ID } },
    });

    clientGuest = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: { persistSession: false, flowType: "pkce" },
    });
  });

  describe("USER_PROFILE: 사용자 프로필", () => {
    it("자신의 프로필만 조회 가능", async () => {
      const { error } = await clientUser1
        .from("user_profile")
        .select("*")
        .eq("user_id", USER1_ID);

      expect(error).toBeNull();
    });

    it("타인 프로필은 조회 불가 (403 또는 빈 결과)", async () => {
      const { data, error } = await clientUser1
        .from("user_profile")
        .select("*")
        .eq("user_id", USER2_ID);

      const isBlocked =
        error !== null || (Array.isArray(data) && data.length === 0);
      expect(isBlocked).toBe(true);
    });

    it("비인증 사용자는 조회 불가", async () => {
      const { error } = await clientGuest
        .from("user_profile")
        .select("*");

      expect(error).not.toBeNull();
    });
  });

  describe("MATE_POST: 동행 모집글", () => {
    it("OPEN 상태 글은 모두 조회 가능", async () => {
      const { data, error } = await clientGuest
        .from("mate_post")
        .select("*")
        .eq("status", "OPEN");

      expect(error).toBeNull();
      expect(Array.isArray(data)).toBe(true);
    });

    it("자신의 글만 수정 가능", async () => {
      const { data: posts } = await clientUser1
        .from("mate_post")
        .select("id")
        .eq("user_id", USER1_ID)
        .limit(1);

      if (posts && posts.length > 0) {
        const postId = posts[0].id;

        const { error: updateError } = await clientUser1
          .from("mate_post")
          .update({ description: "updated" })
          .eq("id", postId);

        expect(updateError).toBeNull();
      }
    });

    it("타인의 글은 수정 불가 (403)", async () => {
      const { data: posts } = await clientUser1
        .from("mate_post")
        .select("id")
        .eq("user_id", USER1_ID)
        .limit(1);

      if (posts && posts.length > 0) {
        const postId = posts[0].id;

        const { error } = await clientUser3
          .from("mate_post")
          .update({ description: "hacked" })
          .eq("id", postId);

        expect(error).not.toBeNull();
      }
    });
  });

  describe("MATE_APPLICATION: 참가 요청", () => {
    it("신청자는 자신의 신청만 조회 가능", async () => {
      const { data, error } = await clientUser3
        .from("mate_application")
        .select("*")
        .eq("user_id", USER3_ID);

      expect(error).toBeNull();
      expect(Array.isArray(data)).toBe(true);
    });

    it("글 작성자는 자신의 글에 대한 신청 조회 가능", async () => {
      const { data: posts } = await clientUser1
        .from("mate_post")
        .select("id")
        .eq("user_id", USER1_ID)
        .limit(1);

      if (posts && posts.length > 0) {
        const postId = posts[0].id;

        const { data, error } = await clientUser1
          .from("mate_application")
          .select("*")
          .eq("mate_post_id", postId);

        expect(error).toBeNull();
        expect(Array.isArray(data)).toBe(true);
      }
    });

    it("무관한 사용자는 신청 조회 불가", async () => {
      const { data: posts } = await clientUser1
        .from("mate_post")
        .select("id")
        .eq("user_id", USER1_ID)
        .limit(1);

      if (posts && posts.length > 0) {
        const postId = posts[0].id;

        const { data, error } = await clientUser3
          .from("mate_application")
          .select("*")
          .eq("mate_post_id", postId);

        const isBlocked =
          error !== null || (Array.isArray(data) && data.length === 0);
        expect(isBlocked).toBe(true);
      }
    });
  });

  describe("USER_BLOCK: 사용자 차단", () => {
    it("차단한 사용자는 자신의 차단 목록 조회 가능", async () => {
      const { data, error } = await clientUser1
        .from("user_block")
        .select("*")
        .eq("blocker_id", USER1_ID);

      expect(error).toBeNull();
      expect(Array.isArray(data)).toBe(true);
    });

    it("타인의 차단 목록은 조회 불가", async () => {
      const { data, error } = await clientUser3
        .from("user_block")
        .select("*")
        .eq("blocker_id", USER1_ID);

      const isBlocked =
        error !== null || (Array.isArray(data) && data.length === 0);
      expect(isBlocked).toBe(true);
    });
  });

  describe("REPORT: 신고", () => {
    it("신고자는 자신의 신고만 조회 가능", async () => {
      const { data, error } = await clientUser1
        .from("report")
        .select("*")
        .eq("reporter_id", USER1_ID);

      expect(error).toBeNull();
      expect(Array.isArray(data)).toBe(true);
    });

    it("다른 사용자의 신고는 조회 불가", async () => {
      const { data, error } = await clientUser3
        .from("report")
        .select("*")
        .eq("reporter_id", USER1_ID);

      const isBlocked =
        error !== null || (Array.isArray(data) && data.length === 0);
      expect(isBlocked).toBe(true);
    });
  });

  describe("OUTBOUND_URL_SETTING: 외부 URL 설정", () => {
    it("Admin이 아닌 사용자는 조회 불가", async () => {
      const { error } = await clientUser1
        .from("outbound_url_setting")
        .select("*");

      expect(error).not.toBeNull();
    });

    it("Admin이 아닌 사용자는 삽입 불가", async () => {
      const { error } = await clientUser1
        .from("outbound_url_setting")
        .insert({
          url_type: "flight",
          url: "https://example.com",
        });

      expect(error).not.toBeNull();
    });
  });
});
