"use client";

import { useState } from "react";
import type { Destination } from "@/data/destinations";
import {
  countrySafetyInfo,
  type CountrySafetyInfo,
} from "@/data/country-safety";

/**
 * COMP-SCR001-DEST-DRAWER — 여행지 상세 Drawer
 *
 * REQ-FUNC-004, REQ-FUNC-006
 * - 여행지 상세 정보 표시 (소개, 명소, 일정, 예산, 교통, 음식, 에티켓, 출처)
 * - 해외는 "국가 안전정보 보기" 버튼으로 안전정보 Drawer 연결
 * - Desktop 우측 슬라이드 520px / Mobile 하단 시트 92%
 *
 * 디자인:
 * - D-001 §10·§12: Drawer 패턴, shadow.card 1단계
 */

interface DestinationDrawerProps {
  destination: Destination | null;
  onClose: () => void;
}

export function DestinationDrawer({
  destination,
  onClose,
}: DestinationDrawerProps) {
  const [safetyInfo, setSafetyInfo] = useState<CountrySafetyInfo | null>(null);

  if (!destination) return null;

  const isInternational = destination.scope === "international";
  const relatedSafetyInfo = isInternational
    ? countrySafetyInfo.find((info) => info.countryCode === destination.countryCode)
    : null;

  return (
    <>
      {/* 여행지 Drawer */}
      <div className="fixed inset-0 z-40 flex items-end bg-black bg-opacity-50 md:items-center md:justify-end md:inset-auto md:right-0 md:left-auto md:top-0 md:bottom-0 md:bg-transparent">
        <div className="h-[92vh] w-full rounded-t-2xl bg-white p-6 shadow-md md:h-screen md:w-[520px] md:rounded-none md:overflow-y-auto">
          {/* 헤더 */}
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-ink">
                {destination.name}
              </h2>
              <p className="mt-1 text-sm text-muted">{destination.country}</p>
            </div>
            <button
              onClick={onClose}
              className="text-2xl text-muted hover:text-ink"
            >
              ×
            </button>
          </div>

          {/* 내용 */}
          <div className="flex flex-col gap-6 overflow-y-auto md:gap-8">
            {/* 소개 */}
            {destination.intro && (
              <section>
                <h3 className="mb-2 font-semibold text-ink">소개</h3>
                <p className="text-sm text-body">{destination.intro}</p>
              </section>
            )}

            {/* 명소 */}
            {destination.highlights && destination.highlights.length > 0 && (
              <section>
                <h3 className="mb-2 font-semibold text-ink">명소</h3>
                <ul className="flex flex-col gap-1">
                  {destination.highlights.map((highlight, idx: number) => (
                    <li key={idx} className="text-sm text-body">
                      • {highlight}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* 추천 시기 */}
            {destination.bestSeason && (
              <section>
                <h3 className="mb-2 font-semibold text-ink">추천 시기</h3>
                <p className="text-sm text-body">{destination.bestSeason}</p>
              </section>
            )}

            {/* 1일 일정 */}
            {destination.oneDayItinerary && destination.oneDayItinerary.length > 0 && (
              <section>
                <h3 className="mb-2 font-semibold text-ink">1일 일정</h3>
                <ol className="flex flex-col gap-1">
                  {destination.oneDayItinerary.map((item, idx: number) => (
                    <li key={idx} className="text-sm text-body">
                      {idx + 1}. {item}
                    </li>
                  ))}
                </ol>
              </section>
            )}

            {/* 3일 일정 */}
            {destination.threeDayItinerary &&
              destination.threeDayItinerary.length > 0 && (
                <section>
                  <h3 className="mb-2 font-semibold text-ink">3일 일정</h3>
                  <div className="flex flex-col gap-3">
                    {destination.threeDayItinerary.map((day, dayIdx: number) => (
                      <div key={dayIdx}>
                        <p className="text-xs font-medium text-muted">
                          Day {dayIdx + 1}
                        </p>
                        <ol className="flex flex-col gap-1">
                          {(Array.isArray(day) ? day : [day]).map(
                            (item, idx: number) => (
                              <li
                                key={idx}
                                className="text-sm text-body"
                              >
                                • {item}
                              </li>
                            )
                          )}
                        </ol>
                      </div>
                    ))}
                  </div>
                </section>
              )}

            {/* 예산 */}
            {destination.budget && (
              <section>
                <h3 className="mb-2 font-semibold text-ink">예산</h3>
                <p className="text-sm text-body">{destination.budget}</p>
              </section>
            )}

            {/* 교통 */}
            {destination.transportation && (
              <section>
                <h3 className="mb-2 font-semibold text-ink">교통</h3>
                <p className="text-sm text-body">{destination.transportation}</p>
              </section>
            )}

            {/* 음식 */}
            {destination.food && destination.food.length > 0 && (
              <section>
                <h3 className="mb-2 font-semibold text-ink">음식</h3>
                <ul className="flex flex-col gap-1">
                  {destination.food.map((food, idx: number) => (
                    <li key={idx} className="text-sm text-body">
                      • {food}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* 에티켓 */}
            {destination.etiquette && (
              <section>
                <h3 className="mb-2 font-semibold text-ink">에티켓</h3>
                <p className="text-sm text-body">{destination.etiquette}</p>
              </section>
            )}

            {/* 출처 및 수정일 */}
            <section className="border-t border-gray-200 pt-4">
              <p className="text-xs text-muted">
                출처: {destination.source} | 최종 수정:{" "}
                {new Date(destination.updatedAt).toLocaleDateString("ko-KR")}
              </p>
            </section>

            {/* 해외 - 안전정보 연결 */}
            {isInternational && relatedSafetyInfo && (
              <button
                onClick={() => setSafetyInfo(relatedSafetyInfo)}
                className="mt-6 w-full rounded-lg bg-primary px-4 py-3 text-sm font-medium text-white transition-all hover:bg-red-600"
              >
                국가 안전정보 보기
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 안전정보 Drawer (같은 스택 위에) */}
      {safetyInfo && (
        <div className="fixed inset-0 z-50 flex items-end bg-black bg-opacity-50 md:items-center md:justify-center">
          <div className="h-[92vh] w-full rounded-t-2xl bg-white p-6 md:h-auto md:w-full md:max-w-2xl md:rounded-lg">
            {/* 헤더 */}
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-ink">
                {safetyInfo.country} - 안전정보
              </h2>
              <button
                onClick={() => setSafetyInfo(null)}
                className="text-2xl text-muted hover:text-ink"
              >
                ×
              </button>
            </div>

            {/* 내용 */}
            <div className="flex flex-col gap-6 overflow-y-auto">
              {safetyInfo.categories.security && (
                <section>
                  <h3 className="mb-2 font-semibold text-ink">보안</h3>
                  <p className="text-sm text-body">
                    {safetyInfo.categories.security}
                  </p>
                </section>
              )}

              {safetyInfo.categories.commonScams && (
                <section>
                  <h3 className="mb-2 font-semibold text-ink">
                    흔한 사기 사례
                  </h3>
                  <p className="text-sm text-body">
                    {safetyInfo.categories.commonScams}
                  </p>
                </section>
              )}

              {safetyInfo.categories.localLaws && (
                <section>
                  <h3 className="mb-2 font-semibold text-ink">지역 법규</h3>
                  <p className="text-sm text-body">
                    {safetyInfo.categories.localLaws}
                  </p>
                </section>
              )}

              {safetyInfo.categories.transportation && (
                <section>
                  <h3 className="mb-2 font-semibold text-ink">교통</h3>
                  <p className="text-sm text-body">
                    {safetyInfo.categories.transportation}
                  </p>
                </section>
              )}

              {safetyInfo.categories.disasterClimate && (
                <section>
                  <h3 className="mb-2 font-semibold text-ink">
                    재해 및 기후
                  </h3>
                  <p className="text-sm text-body">
                    {safetyInfo.categories.disasterClimate}
                  </p>
                </section>
              )}

              {safetyInfo.categories.health && (
                <section>
                  <h3 className="mb-2 font-semibold text-ink">보건</h3>
                  <p className="text-sm text-body">
                    {safetyInfo.categories.health}
                  </p>
                </section>
              )}

              {safetyInfo.categories.cultureDressCode && (
                <section>
                  <h3 className="mb-2 font-semibold text-ink">
                    문화 및 복장 규정
                  </h3>
                  <p className="text-sm text-body">
                    {safetyInfo.categories.cultureDressCode}
                  </p>
                </section>
              )}

              {safetyInfo.emergencyContacts &&
                safetyInfo.emergencyContacts.length > 0 && (
                  <section>
                    <h3 className="mb-2 font-semibold text-ink">
                      긴급 연락처
                    </h3>
                    <ul className="flex flex-col gap-2">
                      {safetyInfo.emergencyContacts.map(
                        (contact, idx: number) => (
                          <li key={idx} className="text-sm text-body">
                            <strong>{contact.phone}</strong> -{" "}
                            {contact.source}
                          </li>
                        )
                      )}
                    </ul>
                  </section>
                )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
