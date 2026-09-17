"use client";

import { useState, useEffect } from "react";

/**
 * COMP-SCR005-MY-ACTIVITY — 내 활동(내 글/참가요청/차단/즐겨찾기)
 *
 * REQ-FUNC-036, REQ-FUNC-038, REQ-FUNC-040, REQ-FUNC-068
 */

type ActivityTab = "posts" | "applications" | "blocked" | "favorites";

interface MatePost {
  id: string;
  title: string;
  country: string;
  status: "OPEN" | "CLOSED";
}

interface MateApplication {
  id: string;
  postTitle: string;
  status: "PENDING" | "ACCEPTED" | "REJECTED";
}

interface BlockedUser {
  id: string;
  name: string;
}

interface Favorite {
  id: string;
  title: string;
  country: string;
}

export function MyActivityTab() {
  const [activeTab, setActiveTab] = useState<ActivityTab>("posts");
  const [isLoading, setIsLoading] = useState(true);

  const [myPosts, setMyPosts] = useState<MatePost[]>([]);
  const [applications, setApplications] = useState<MateApplication[]>([]);
  const [blockedUsers, setBlockedUsers] = useState<BlockedUser[]>([]);
  const [favorites, setFavorites] = useState<Favorite[]>([]);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        await new Promise((resolve) => setTimeout(resolve, 500));
        setMyPosts([
          { id: "1", title: "도쿄 벚꽃 함께 갈 사람", country: "Japan", status: "OPEN" },
          { id: "2", title: "방콕 트레킹 동행자", country: "Thailand", status: "CLOSED" },
        ]);
        setApplications([
          { id: "1", postTitle: "서울 한옥마을 투어", status: "PENDING" },
          { id: "2", postTitle: "제주도 해변 여행", status: "ACCEPTED" },
          { id: "3", postTitle: "강릉 스노우보드", status: "REJECTED" },
        ]);
        setBlockedUsers([
          { id: "1", name: "사용자_A" },
          { id: "2", name: "사용자_B" },
        ]);
        setFavorites([
          { id: "1", title: "도쿄 벚꽃 함께 갈 사람", country: "Japan" },
          { id: "2", title: "호치민 음식 투어", country: "Vietnam" },
        ]);
        setIsLoading(false);
      } catch {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const handleUnblockUser = (id: string) => {
    setBlockedUsers(blockedUsers.filter((u) => u.id !== id));
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="h-20 rounded-lg bg-gray-200 animate-pulse"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 탭 */}
      <div className="flex gap-2 border-b border-gray-200 overflow-x-auto">
        {[
          { id: "posts" as ActivityTab, label: "내 글", count: myPosts.length },
          { id: "applications" as ActivityTab, label: "참가 요청", count: applications.length },
          { id: "blocked" as ActivityTab, label: "차단 목록", count: blockedUsers.length },
          { id: "favorites" as ActivityTab, label: "즐겨찾기", count: favorites.length },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 font-medium text-sm whitespace-nowrap border-b-2 transition-colors ${
              activeTab === tab.id
                ? "border-primary text-primary"
                : "border-transparent text-muted hover:text-ink"
            }`}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      {/* 콘텐츠 */}
      <div>
        {/* 내 글 */}
        {activeTab === "posts" && (
          <div className="space-y-4">
            {myPosts.length === 0 ? (
              <div className="text-center py-8">
                <p className="font-medium text-ink">아직 작성한 동행글이 없습니다.</p>
                <button className="mt-4 rounded-lg bg-primary px-6 py-2 text-sm font-medium text-white hover:bg-red-600">
                  새 동행글 작성
                </button>
              </div>
            ) : (
              myPosts.map((post) => (
                <div
                  key={post.id}
                  className="flex items-start justify-between rounded-lg border border-gray-200 p-4 hover:shadow-sm transition-shadow"
                >
                  <div className="flex-1">
                    <h4 className="font-medium text-ink">{post.title}</h4>
                    <p className="text-xs text-muted mt-1">{post.country}</p>
                  </div>
                  <span
                    className={`inline-flex rounded-full px-2 py-1 text-xs font-medium whitespace-nowrap ${
                      post.status === "OPEN"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {post.status === "OPEN" ? "모집 중" : "마감"}
                  </span>
                </div>
              ))
            )}
          </div>
        )}

        {/* 참가 요청 */}
        {activeTab === "applications" && (
          <div className="space-y-4">
            {applications.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-sm text-muted">신청한 동행글이 없습니다.</p>
              </div>
            ) : (
              applications.map((app) => (
                <div
                  key={app.id}
                  className="flex items-start justify-between rounded-lg border border-gray-200 p-4"
                >
                  <div className="flex-1">
                    <h4 className="font-medium text-ink">{app.postTitle}</h4>
                  </div>
                  <span
                    className={`inline-flex rounded-full px-2 py-1 text-xs font-medium whitespace-nowrap ${
                      app.status === "PENDING"
                        ? "bg-blue-100 text-blue-700"
                        : app.status === "ACCEPTED"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                    }`}
                  >
                    {app.status === "PENDING"
                      ? "검토 중"
                      : app.status === "ACCEPTED"
                        ? "수락"
                        : "거절"}
                  </span>
                </div>
              ))
            )}
          </div>
        )}

        {/* 차단 목록 */}
        {activeTab === "blocked" && (
          <div className="space-y-4">
            {blockedUsers.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-sm text-muted">차단한 사용자가 없습니다.</p>
              </div>
            ) : (
              blockedUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between rounded-lg border border-gray-200 p-4"
                >
                  <p className="font-medium text-ink">{user.name}</p>
                  <button
                    onClick={() => handleUnblockUser(user.id)}
                    className="text-sm text-primary hover:underline"
                  >
                    해제
                  </button>
                </div>
              ))
            )}
          </div>
        )}

        {/* 즐겨찾기 */}
        {activeTab === "favorites" && (
          <div className="space-y-4">
            {favorites.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-sm text-muted">즐겨찾기한 동행글이 없습니다.</p>
              </div>
            ) : (
              favorites.map((fav) => (
                <div
                  key={fav.id}
                  className="flex items-start justify-between rounded-lg border border-gray-200 p-4 hover:shadow-sm transition-shadow"
                >
                  <div className="flex-1">
                    <h4 className="font-medium text-ink">{fav.title}</h4>
                    <p className="text-xs text-muted mt-1">{fav.country}</p>
                  </div>
                  <button className="text-primary hover:underline text-sm">
                    보기
                  </button>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
