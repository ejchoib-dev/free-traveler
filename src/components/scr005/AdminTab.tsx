"use client";

import { useState, useEffect } from "react";

/**
 * COMP-SCR005-ADMIN — 관리자(신고 상태·외부 URL 설정)
 *
 * REQ-FUNC-041, REQ-FUNC-077
 */

type ReportStatus = "OPEN" | "REVIEWING" | "RESOLVED" | "DISMISSED";

interface Report {
  id: string;
  reason: string;
  status: ReportStatus;
  createdAt: string;
}

interface ExternalURLs {
  flightUrl: string;
  hotelUrl: string;
  error?: string;
}

const HTTPS_ALLOWED_HOSTS = [
  "skyscanner.com",
  "skyscanner.co.kr",
  "booking.com",
  "agoda.com",
];

export function AdminTab() {
  const [reports, setReports] = useState<Report[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<ReportStatus | "ALL">(
    "ALL"
  );
  const [isLoading, setIsLoading] = useState(true);

  const [urls, setUrls] = useState<ExternalURLs>({
    flightUrl: "https://skyscanner.co.kr",
    hotelUrl: "https://booking.com",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [formUrls, setFormUrls] = useState<ExternalURLs>({ ...urls });

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        await new Promise((resolve) => setTimeout(resolve, 500));
        setReports([
          {
            id: "1",
            reason: "부적절한 언어",
            status: "OPEN",
            createdAt: "2026-09-16",
          },
          {
            id: "2",
            reason: "사기성 글",
            status: "REVIEWING",
            createdAt: "2026-09-15",
          },
          {
            id: "3",
            reason: "개인정보 노출",
            status: "RESOLVED",
            createdAt: "2026-09-14",
          },
        ]);
        setIsLoading(false);
      } catch {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const validateURL = (url: string): boolean => {
    if (!url.startsWith("https://")) return false;
    try {
      const urlObj = new URL(url);
      return HTTPS_ALLOWED_HOSTS.some((host) =>
        urlObj.hostname.includes(host)
      );
    } catch {
      return false;
    }
  };

  const handleSaveURLs = () => {
    const errors: string[] = [];

    if (!validateURL(formUrls.flightUrl)) {
      errors.push("항공 URL이 유효하지 않습니다");
    }
    if (!validateURL(formUrls.hotelUrl)) {
      errors.push("호텔 URL이 유효하지 않습니다");
    }

    if (errors.length > 0) {
      setFormUrls({
        ...formUrls,
        error: errors.join("\n"),
      });
      return;
    }

    setUrls(formUrls);
    setIsEditing(false);
  };

  const filteredReports =
    selectedStatus === "ALL"
      ? reports
      : reports.filter((r) => r.status === selectedStatus);

  if (isLoading) {
    return <div className="h-32 rounded-lg bg-gray-200 animate-pulse" />;
  }

  return (
    <div className="space-y-8">
      {/* 외부 URL 설정 */}
      <div className="rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-ink mb-4">
          외부 URL 설정
        </h3>

        {isEditing ? (
          <div className="space-y-4">
            {formUrls.error && (
              <div className="rounded-lg bg-red-50 p-4 text-sm text-red-900">
                {formUrls.error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-ink mb-2">
                항공권 URL
              </label>
              <input
                type="url"
                value={formUrls.flightUrl}
                onChange={(e) =>
                  setFormUrls({ ...formUrls, flightUrl: e.target.value, error: undefined })
                }
                className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                placeholder="https://..."
              />
              <p className="text-xs text-muted mt-1">
                Skyscanner 등 HTTPS 링크만 허용
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-ink mb-2">
                숙소 URL
              </label>
              <input
                type="url"
                value={formUrls.hotelUrl}
                onChange={(e) =>
                  setFormUrls({ ...formUrls, hotelUrl: e.target.value, error: undefined })
                }
                className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                placeholder="https://..."
              />
              <p className="text-xs text-muted mt-1">
                Booking.com, Agoda 등 HTTPS 링크만 허용
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setFormUrls({ ...urls });
                  setIsEditing(false);
                }}
                className="flex-1 rounded-lg border border-gray-300 px-4 py-2 font-medium text-ink hover:bg-gray-50"
              >
                취소
              </button>
              <button
                onClick={handleSaveURLs}
                className="flex-1 rounded-lg bg-primary px-4 py-2 font-medium text-white hover:bg-red-600"
              >
                저장
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted">항공권</p>
              <p className="text-ink font-medium">{urls.flightUrl}</p>
            </div>

            <div>
              <p className="text-sm text-muted">숙소</p>
              <p className="text-ink font-medium">{urls.hotelUrl}</p>
            </div>

            <button
              onClick={() => {
                setFormUrls({ ...urls });
                setIsEditing(true);
              }}
              className="text-sm text-primary hover:underline"
            >
              수정
            </button>
          </div>
        )}
      </div>

      {/* 신고 목록 */}
      <div>
        <h3 className="text-lg font-semibold text-ink mb-4">신고 목록</h3>

        {/* 상태 필터 */}
        <div className="flex gap-2 mb-4 flex-wrap">
          {["ALL", "OPEN", "REVIEWING", "RESOLVED", "DISMISSED"].map(
            (status) => (
              <button
                key={status}
                onClick={() =>
                  setSelectedStatus(status as ReportStatus | "ALL")
                }
                className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
                  selectedStatus === status
                    ? "bg-primary text-white"
                    : "bg-gray-100 text-ink hover:bg-gray-200"
                }`}
              >
                {status === "ALL"
                  ? "전체"
                  : status === "OPEN"
                    ? "새로움"
                    : status === "REVIEWING"
                      ? "검토 중"
                      : status === "RESOLVED"
                        ? "해결"
                        : "기각"}
              </button>
            )
          )}
        </div>

        {/* 신고 목록 */}
        {filteredReports.length === 0 ? (
          <div className="text-center py-8 rounded-lg bg-gray-50">
            <p className="text-sm text-muted">신고가 없습니다.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredReports.map((report) => (
              <div
                key={report.id}
                className="flex items-start justify-between rounded-lg border border-gray-200 p-4"
              >
                <div className="flex-1">
                  <p className="font-medium text-ink">{report.reason}</p>
                  <p className="text-xs text-muted mt-1">{report.createdAt}</p>
                </div>
                <span
                  className={`inline-flex rounded-full px-3 py-1 text-xs font-medium whitespace-nowrap ${
                    report.status === "OPEN"
                      ? "bg-red-100 text-red-700"
                      : report.status === "REVIEWING"
                        ? "bg-blue-100 text-blue-700"
                        : report.status === "RESOLVED"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {report.status === "OPEN"
                    ? "새로움"
                    : report.status === "REVIEWING"
                      ? "검토 중"
                      : report.status === "RESOLVED"
                        ? "해결"
                        : "기각"}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
