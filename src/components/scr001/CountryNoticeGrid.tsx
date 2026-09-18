"use client";

import { useState } from "react";
import {
  countrySafetyInfo,
  type CountrySafetyInfo,
  isSafetyInfoStale,
} from "@/data/country-safety";

/**
 * COMP-SCR001-COUNTRY-NOTICE — 국가별 주의사항 카드
 *
 * REQ-FUNC-051, REQ-FUNC-052
 * - 국가 카드 6개
 * - 경보 단계 라벨+최종 확인일 배지+7일 경과 경고 배지
 * - "주의사항 보기"로 안전정보 Drawer 오픈
 *
 * 디자인:
 * - D-001 §5·§9: 카드 12px radius (Domestic/Overseas Grid와 동일)
 * - D-001 §13: Shadow 1단계 적용
 */

export function CountryNoticeGrid() {
  const [selectedCountry, setSelectedCountry] =
    useState<CountrySafetyInfo | null>(null);

  const displayed = countrySafetyInfo.slice(0, 6);

  return (
    <>
      <section className="mx-auto w-full max-w-screen-xl px-[var(--spacing-token-lg)] py-[var(--spacing-section-compact-mobile)] md:py-[var(--spacing-section-standard-desktop)]">
        <h2 className="text-display-md mb-[var(--spacing-token-xxl)] font-semibold text-[var(--color-ink)]">
          국가별 주의사항
        </h2>

        <div className="grid gap-[var(--spacing-token-md)] sm:grid-cols-2 md:grid-cols-3 md:gap-[var(--spacing-token-xl)]">
          {displayed.map((info) => {
            const isStale = isSafetyInfoStale(info.lastCheckedAt);
            const hasAlerts = info.alerts && info.alerts.length > 0;
            const alertLevel = hasAlerts ? info.alerts[0].level : null;

            return (
              <button
                key={info.id}
                onClick={() => setSelectedCountry(info)}
                className="flex flex-col gap-[var(--spacing-token-md)] rounded-[var(--radius-token-md)] border border-[var(--color-hairline)] bg-[var(--color-canvas)] p-[var(--spacing-token-lg)] text-left shadow-[var(--shadow-card)] transition-all duration-[var(--transition-base)] hover:shadow-[var(--shadow-card-hover)] md:p-[var(--spacing-token-xl)]"
              >
                {/* 제목 */}
                <h3 className="text-title-md font-semibold text-[var(--color-ink)]">{info.country}</h3>

                {/* 경보 상태 */}
                <div className="flex flex-wrap gap-[var(--spacing-token-sm)]">
                  {alertLevel && (
                    <span className="inline-flex rounded-[var(--radius-token-full)] bg-[var(--color-critical-soft)] px-[var(--spacing-token-md)] py-[var(--spacing-token-xs)] text-caption font-medium text-[var(--color-critical)]">
                      경보: {alertLevel}
                    </span>
                  )}

                  {isStale && (
                    <span className="inline-flex rounded-[var(--radius-token-full)] bg-[var(--color-warning-soft)] px-[var(--spacing-token-md)] py-[var(--spacing-token-xs)] text-caption font-medium text-[var(--color-warning)]">
                      ⚠️ 정보 오래됨
                    </span>
                  )}
                </div>

                {/* 최종 확인일 */}
                <p className="text-caption text-[var(--color-muted)]">
                  최종 확인: {new Date(info.lastCheckedAt).toLocaleDateString("ko-KR")}
                </p>

                {/* CTA */}
                <p className="text-caption font-medium text-[var(--color-primary)]">
                  주의사항 보기 →
                </p>
              </button>
            );
          })}
        </div>
      </section>

      {/* Drawer (SafetyDrawer와 동일) */}
      {selectedCountry && (
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
              {selectedCountry.categories.security && (
                <section>
                  <h3 className="mb-2 font-semibold text-ink">보안</h3>
                  <p className="text-sm text-body">
                    {selectedCountry.categories.security}
                  </p>
                </section>
              )}

              {selectedCountry.categories.commonScams && (
                <section>
                  <h3 className="mb-2 font-semibold text-ink">
                    흔한 사기 사례
                  </h3>
                  <p className="text-sm text-body">
                    {selectedCountry.categories.commonScams}
                  </p>
                </section>
              )}

              {selectedCountry.categories.localLaws && (
                <section>
                  <h3 className="mb-2 font-semibold text-ink">지역 법규</h3>
                  <p className="text-sm text-body">
                    {selectedCountry.categories.localLaws}
                  </p>
                </section>
              )}

              {selectedCountry.categories.transportation && (
                <section>
                  <h3 className="mb-2 font-semibold text-ink">교통</h3>
                  <p className="text-sm text-body">
                    {selectedCountry.categories.transportation}
                  </p>
                </section>
              )}

              {selectedCountry.categories.disasterClimate && (
                <section>
                  <h3 className="mb-2 font-semibold text-ink">
                    재해 및 기후
                  </h3>
                  <p className="text-sm text-body">
                    {selectedCountry.categories.disasterClimate}
                  </p>
                </section>
              )}

              {selectedCountry.categories.health && (
                <section>
                  <h3 className="mb-2 font-semibold text-ink">보건</h3>
                  <p className="text-sm text-body">
                    {selectedCountry.categories.health}
                  </p>
                </section>
              )}

              {selectedCountry.categories.cultureDressCode && (
                <section>
                  <h3 className="mb-2 font-semibold text-ink">
                    문화 및 복장 규정
                  </h3>
                  <p className="text-sm text-body">
                    {selectedCountry.categories.cultureDressCode}
                  </p>
                </section>
              )}

              {selectedCountry.emergencyContacts &&
                selectedCountry.emergencyContacts.length > 0 && (
                  <section>
                    <h3 className="mb-2 font-semibold text-ink">
                      긴급 연락처
                    </h3>
                    <ul className="flex flex-col gap-2">
                      {selectedCountry.emergencyContacts.map(
                        (contact, idx: number) => (
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
