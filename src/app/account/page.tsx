"use client";

import { useState, useEffect } from "react";
import { AuthPanel } from "@/components/scr005/AuthPanel";
import { ProfileTab } from "@/components/scr005/ProfileTab";
import { MyActivityTab } from "@/components/scr005/MyActivityTab";
import { AdminTab } from "@/components/scr005/AdminTab";

/**
 * PAGE-SCR005 — 계정 페이지 조립
 *
 * REQ-FUNC-064, REQ-FUNC-065, REQ-FUNC-070, REQ-FUNC-079
 *
 * 역할별로 다른 탭 구성:
 * - Guest: 로그인/가입/재설정 (AuthPanel만)
 * - Member: [프로필][내 활동]
 * - Admin: [프로필][내 활동][관리자]
 */

type UserRole = "guest" | "member" | "admin";
type AccountTab = "auth" | "profile" | "activity" | "admin";

/* eslint-disable react-hooks/set-state-in-effect */

export default function AccountPage() {
  const [userRole] = useState<UserRole>("member");
  const [activeTab, setActiveTab] = useState<AccountTab>("profile");
  const [showUnauthorizedError, setShowUnauthorizedError] = useState(false);

  // 권한 검증
  useEffect(() => {
    if (userRole === "guest" && activeTab !== "auth") {
      setShowUnauthorizedError(true);
      setActiveTab("auth");
    } else if (userRole === "member" && activeTab === "admin") {
      setShowUnauthorizedError(true);
      setActiveTab("profile");
    }
  }, [activeTab, userRole]);

  return (
    <main className="min-h-screen w-full bg-white">
      <div className="mx-auto w-full max-w-screen-xl px-5 py-12 md:py-16">
        {/* 헤더 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-ink md:text-4xl">
            {userRole === "guest"
              ? "계정"
              : userRole === "member"
                ? "내 계정"
                : "계정 관리"}
          </h1>
          <p className="mt-2 text-sm text-body md:text-base">
            {userRole === "guest"
              ? "로그인하거나 새 계정을 만들어보세요"
              : userRole === "member"
                ? "프로필을 관리하고 활동 내역을 확인하세요"
                : "계정을 관리하고 신고를 처리하세요"}
          </p>
        </div>

        {/* 권한 없음 에러 */}
        {showUnauthorizedError && (
          <div className="mb-6 rounded-lg bg-red-50 p-4 text-sm text-red-900">
            <p className="font-medium">권한이 없습니다</p>
            <p className="mt-1 text-xs">접근할 수 없는 영역입니다.</p>
          </div>
        )}

        {/* Guest: 로그인/가입만 */}
        {userRole === "guest" && (
          <div className="max-w-md mx-auto">
            <AuthPanel />
          </div>
        )}

        {/* Member/Admin: 탭 */}
        {(userRole === "member" || userRole === "admin") && (
          <>
            {/* 탭 네비게이션 */}
            <div className="mb-8 flex gap-2 border-b border-gray-200 overflow-x-auto">
              {/* 프로필 탭 */}
              <button
                onClick={() => {
                  setShowUnauthorizedError(false);
                  setActiveTab("profile");
                }}
                className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === "profile"
                    ? "border-primary text-primary"
                    : "border-transparent text-muted hover:text-ink"
                }`}
              >
                프로필
              </button>

              {/* 내 활동 탭 */}
              <button
                onClick={() => {
                  setShowUnauthorizedError(false);
                  setActiveTab("activity");
                }}
                className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === "activity"
                    ? "border-primary text-primary"
                    : "border-transparent text-muted hover:text-ink"
                }`}
              >
                내 활동
              </button>

              {/* 관리자 탭 (Admin만) */}
              {userRole === "admin" && (
                <button
                  onClick={() => {
                    setShowUnauthorizedError(false);
                    setActiveTab("admin");
                  }}
                  className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors whitespace-nowrap ${
                    activeTab === "admin"
                      ? "border-primary text-primary"
                      : "border-transparent text-muted hover:text-ink"
                  }`}
                >
                  관리자
                </button>
              )}
            </div>

            {/* 탭 콘텐츠 */}
            <div className="max-w-4xl">
              {activeTab === "profile" && <ProfileTab />}
              {activeTab === "activity" && <MyActivityTab />}
              {activeTab === "admin" && userRole === "admin" && <AdminTab />}
            </div>
          </>
        )}
      </div>
    </main>
  );
}
