"use client";

import { useState } from "react";
import {
  countrySafetyInfo,
  type CountrySafetyInfo,
} from "@/data/country-safety";

/**
 * COMP-SCR001-SAFETY-DRAWER — 국가별 주의사항 Drawer
 *
 * REQ-FUNC-006, REQ-FUNC-047~054
 * - 국가별 안전정보 카드 6개
 * - 클릭해서 상세 정보 Drawer로 열기
 *
 * 디자인:
 * - D-001 §10: Drawer 패턴
 */

interface SafetyInfoDisplay {
  country: string;
  title: string;
}

export function SafetyDrawer() {
  const [selectedCountry, setSelectedCountry] =
    useState<SafetyInfoDisplay | null>(null);

  // 처음 6개 국가의 안전정보 표시
  const displayedCountries = countrySafetyInfo.slice(0, 6).map(
    (info: CountrySafetyInfo) => ({
      country: info.country,
      title: info.country,
    })
  );

  const selectedInfo = selectedCountry
    ? countrySafetyInfo.find(
        (info: CountrySafetyInfo) =>
          info.country === selectedCountry.country
      )
    : null;

  return (
    <>
      <section className="mx-auto w-full max-w-screen-xl px-5 py-12 md:py-16">
        <h2 className="mb-8 text-2xl font-semibold text-ink md:text-3xl">
          국가별 주의사항
        </h2>

        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 md:gap-6">
          {displayedCountries.map((item: SafetyInfoDisplay) => (
            <button
              key={item.country}
              onClick={() => setSelectedCountry(item)}
              className="rounded-lg border border-gray-200 bg-white p-6 text-left transition-all hover:border-primary hover:shadow-md"
            >
              <h3 className="font-semibold text-ink">{item.title}</h3>
              <p className="mt-2 text-xs text-muted">
                자세히 보기 →
              </p>
            </button>
          ))}
        </div>
      </section>

      {/* Drawer */}
      {selectedCountry && selectedInfo && (
        <div className="fixed inset-0 z-50 flex items-end bg-black bg-opacity-50 md:items-center md:justify-center">
          <div className="h-[92vh] w-full rounded-t-2xl bg-white p-6 md:h-auto md:w-full md:max-w-2xl md:rounded-lg">
            {/* 헤더 */}
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-ink">
                {selectedCountry.country}
              </h2>
              <button
                onClick={() => setSelectedCountry(null)}
                className="text-2xl text-muted hover:text-ink"
              >
                ×
              </button>
            </div>

            {/* 내용 */}
            <div className="flex flex-col gap-6 overflow-y-auto">
              {selectedInfo.categories.security && (
                <section>
                  <h3 className="mb-2 font-semibold text-ink">보안</h3>
                  <p className="text-sm text-body">
                    {selectedInfo.categories.security}
                  </p>
                </section>
              )}

              {selectedInfo.categories.commonScams && (
                <section>
                  <h3 className="mb-2 font-semibold text-ink">
                    흔한 사기 사례
                  </h3>
                  <p className="text-sm text-body">
                    {selectedInfo.categories.commonScams}
                  </p>
                </section>
              )}

              {selectedInfo.categories.localLaws && (
                <section>
                  <h3 className="mb-2 font-semibold text-ink">지역 법규</h3>
                  <p className="text-sm text-body">
                    {selectedInfo.categories.localLaws}
                  </p>
                </section>
              )}

              {selectedInfo.categories.transportation && (
                <section>
                  <h3 className="mb-2 font-semibold text-ink">교통</h3>
                  <p className="text-sm text-body">
                    {selectedInfo.categories.transportation}
                  </p>
                </section>
              )}

              {selectedInfo.categories.disasterClimate && (
                <section>
                  <h3 className="mb-2 font-semibold text-ink">
                    재해 및 기후
                  </h3>
                  <p className="text-sm text-body">
                    {selectedInfo.categories.disasterClimate}
                  </p>
                </section>
              )}

              {selectedInfo.categories.health && (
                <section>
                  <h3 className="mb-2 font-semibold text-ink">보건</h3>
                  <p className="text-sm text-body">
                    {selectedInfo.categories.health}
                  </p>
                </section>
              )}

              {selectedInfo.categories.cultureDressCode && (
                <section>
                  <h3 className="mb-2 font-semibold text-ink">
                    문화 및 복장 규정
                  </h3>
                  <p className="text-sm text-body">
                    {selectedInfo.categories.cultureDressCode}
                  </p>
                </section>
              )}

              {selectedInfo.emergencyContacts &&
                selectedInfo.emergencyContacts.length > 0 && (
                  <section>
                    <h3 className="mb-2 font-semibold text-ink">
                      긴급 연락처
                    </h3>
                    <ul className="flex flex-col gap-2">
                      {selectedInfo.emergencyContacts.map((contact, idx) => (
                        <li key={idx} className="text-sm text-body">
                          <strong>{contact.phone}</strong> -{" "}
                          {contact.source} (
                          {contact.lastCheckedAt
                            ? new Date(
                                contact.lastCheckedAt
                              ).toLocaleDateString("ko-KR")
                            : "확인일 미상"}
                          )
                        </li>
                      ))}
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
