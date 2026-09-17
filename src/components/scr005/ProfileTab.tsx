"use client";

import { useState, useEffect } from "react";

/**
 * COMP-SCR005-PROFILE — 프로필·성인확인
 *
 * REQ-FUNC-029, REQ-FUNC-028
 */

interface Profile {
  nickname: string;
  ageRange: string;
  gender?: string;
  travelStyles: string[];
  bio: string;
  isAdult: boolean;
  adultVerifiedAt?: string;
}

const AGE_RANGES = ["10대", "20대", "30대", "40대", "50대", "60대+"];
const GENDERS = ["남성", "여성", "선택 안 함"];
const TRAVEL_STYLES = ["문화", "음식", "자연", "모험", "휴식", "건축"];

export function ProfileTab() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Profile>({
    nickname: "",
    ageRange: "",
    travelStyles: [],
    bio: "",
    isAdult: false,
  });

  useEffect(() => {
    const loadProfile = async () => {
      setIsLoading(true);
      try {
        await new Promise((resolve) => setTimeout(resolve, 500));
        const mockProfile: Profile = {
          nickname: "여행자_김",
          ageRange: "30대",
          gender: "여성",
          travelStyles: ["문화", "음식"],
          bio: "세계 여행을 사랑하는 콘텐츠 크리에이터입니다.",
          isAdult: true,
          adultVerifiedAt: "2026-01-15",
        };
        setProfile(mockProfile);
        setFormData(mockProfile);
        setIsLoading(false);
      } catch {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, []);

  const handleSaveProfile = () => {
    if (
      !formData.nickname.trim() ||
      !formData.ageRange ||
      formData.travelStyles.length === 0
    ) {
      alert("필수 항목을 모두 입력해주세요");
      return;
    }

    setProfile(formData);
    setIsEditing(false);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-32 rounded-lg bg-gray-200 animate-pulse" />
        <div className="h-40 rounded-lg bg-gray-200 animate-pulse" />
      </div>
    );
  }

  if (!profile) {
    return <div className="text-center py-8 text-muted">프로필을 불러올 수 없습니다.</div>;
  }

  if (isEditing) {
    return (
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-ink mb-2">
            닉네임 *
          </label>
          <input
            type="text"
            value={formData.nickname}
            onChange={(e) =>
              setFormData({ ...formData, nickname: e.target.value })
            }
            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            placeholder="닉네임"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-ink mb-2">
            연령대 *
          </label>
          <select
            value={formData.ageRange}
            onChange={(e) =>
              setFormData({ ...formData, ageRange: e.target.value })
            }
            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
          >
            <option value="">선택</option>
            {AGE_RANGES.map((range) => (
              <option key={range} value={range}>
                {range}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-ink mb-2">
            성별
          </label>
          <select
            value={formData.gender || ""}
            onChange={(e) =>
              setFormData({ ...formData, gender: e.target.value || undefined })
            }
            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
          >
            <option value="">선택 안 함</option>
            {GENDERS.map((gender) => (
              <option key={gender} value={gender}>
                {gender}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-ink mb-2">
            여행 스타일 *
          </label>
          <div className="grid grid-cols-2 gap-2">
            {TRAVEL_STYLES.map((style) => (
              <label key={style} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.travelStyles.includes(style)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setFormData({
                        ...formData,
                        travelStyles: [...formData.travelStyles, style],
                      });
                    } else {
                      setFormData({
                        ...formData,
                        travelStyles: formData.travelStyles.filter(
                          (s) => s !== style
                        ),
                      });
                    }
                  }}
                  className="rounded"
                />
                <span className="text-sm text-body">{style}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-ink mb-2">
            자기소개
          </label>
          <textarea
            value={formData.bio}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            className="min-h-24 w-full rounded-lg border border-gray-300 px-4 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary resize-none"
            placeholder="자신을 소개해주세요"
          />
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => {
              setFormData(profile || formData);
              setIsEditing(false);
            }}
            className="flex-1 rounded-lg border border-gray-300 px-4 py-2 font-medium text-ink hover:bg-gray-50"
          >
            취소
          </button>
          <button
            onClick={handleSaveProfile}
            className="flex-1 rounded-lg bg-primary px-4 py-2 font-medium text-white hover:bg-red-600"
          >
            저장
          </button>
        </div>
      </div>
    );
  }

  if (profile === null) return null;

  return (
    <div className="space-y-6">
      {/* 프로필 카드 */}
      <div className="rounded-lg border border-gray-200 p-6">
        <div className="mb-4 flex items-start justify-between">
          <h3 className="text-lg font-semibold text-ink">{profile.nickname}</h3>
          <button
            onClick={() => setIsEditing(true)}
            className="text-sm text-primary hover:underline"
          >
            수정
          </button>
        </div>

        <div className="space-y-3">
          <div>
            <p className="text-xs text-muted">연령대</p>
            <p className="text-sm text-ink">{profile.ageRange}</p>
          </div>

          {profile.gender && (
            <div>
              <p className="text-xs text-muted">성별</p>
              <p className="text-sm text-ink">{profile.gender}</p>
            </div>
          )}

          <div>
            <p className="text-xs text-muted mb-1">여행 스타일</p>
            <div className="flex flex-wrap gap-1">
              {profile.travelStyles.map((style) => (
                <span
                  key={style}
                  className="inline-flex rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary"
                >
                  {style}
                </span>
              ))}
            </div>
          </div>

          {profile.bio && (
            <div>
              <p className="text-xs text-muted">자기소개</p>
              <p className="text-sm text-ink">{profile.bio}</p>
            </div>
          )}
        </div>
      </div>

      {/* 성인 확인 */}
      <div className="rounded-lg border border-gray-200 p-4">
        <div className="flex items-start justify-between">
          <div>
            <p className="font-medium text-ink">성인 확인</p>
            {profile.isAdult ? (
              <span className="inline-flex rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700 mt-2">
                ✓ 확인 완료
              </span>
            ) : (
              <p className="text-xs text-muted mt-2">
                동행 참여를 위해 성인 확인이 필요합니다.
              </p>
            )}
          </div>
        </div>
        {!profile.isAdult && (
          <button className="mt-4 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-red-600">
            성인 확인하기
          </button>
        )}
      </div>
    </div>
  );
}
