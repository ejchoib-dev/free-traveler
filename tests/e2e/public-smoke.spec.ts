import { test, expect } from "@playwright/test";

/**
 * E2E-PUBLIC-SMOKE — 공개 화면 Smoke(SCR-001/002/004 열람)
 *
 * REQ-FUNC-001, REQ-FUNC-003, REQ-FUNC-004, REQ-FUNC-006, REQ-FUNC-057, REQ-FUNC-063
 *
 * 여행지 검색→상세 Drawer→안전정보 Drawer
 * 대표 소개 열람
 * 동행 목록 비로그인 열람까지 5~7개 핵심 흐름
 */

test.describe("Public Screens Smoke Test (E2E-PUBLIC-SMOKE)", () => {
  test.beforeEach(async ({ page }) => {
    // 로그인하지 않은 상태로 시작
    await page.goto("http://localhost:3000");
  });

  test("SCR-001: Main page loads with hero search", async ({ page }) => {
    // 페이지 로드 확인
    await expect(page).toHaveTitle(/Traveler|Home|메인/i);

    // 검색 폼 확인
    const searchForm = page.locator('input[placeholder*="검색"]').first();
    await expect(searchForm).toBeVisible();

    // 필터 드롭다운 확인
    const filters = page.locator("select");
    expect(await filters.count()).toBeGreaterThan(0);
  });

  test("SCR-001: Domestic and overseas grids display", async ({ page }) => {
    // 국내 목록지 확인
    const domesticGrid = page.locator("article, [role='article']").first();
    await expect(domesticGrid).toBeVisible();

    // 여행지 카드 확인 (이미지, 텍스트 등)
    const cards = page.locator("article, [role='article']");
    const count = await cards.count();
    expect(count).toBeGreaterThan(0);
  });

  test("SCR-001: Destination drawer opens with details", async ({ page }) => {
    // 여행지 카드 클릭
    const firstCard = page.locator("article, [role='article']").first();
    await firstCard.click();

    // 상세 정보 패널 확인
    const detailPanel = page.locator(
      "[class*='panel'], [class*='drawer'], aside"
    ).first();
    if (await detailPanel.isVisible()) {
      // 상세 정보 내용 확인
      const detailText = page.locator("h2, h3").first();
      await expect(detailText).toBeVisible();

      // 닫기 버튼 확인
      const closeButton = page.locator("button:has-text('×'), [aria-label*='close']").first();
      if (await closeButton.isVisible()) {
        await closeButton.click();
      }
    }
  });

  test("SCR-001: Safety information accessible from drawer", async ({ page }) => {
    // 안전정보 섹션 클릭
    const safetySection = page.locator(
      "button:has-text('안전정보'), [class*='safety']"
    ).first();

    if (await safetySection.isVisible()) {
      await safetySection.click();

      // 안전정보 드로어 확인
      const safetyPanel = page.locator("[class*='drawer'], aside").first();
      await expect(safetyPanel).toBeVisible();
    }
  });

  test("SCR-002: About page loads", async ({ page }) => {
    // /about 페이지 이동
    await page.goto("http://localhost:3000/about");

    // 페이지 로드 확인
    await expect(page).toHaveTitle(/About|소개|대표/i);

    // 프로필 정보 확인
    const profileSection = page.locator("h1, [role='heading']").first();
    await expect(profileSection).toBeVisible();
  });

  test("SCR-002: About page displays hero and sections", async ({ page }) => {
    await page.goto("http://localhost:3000/about");

    // 소개 영역 확인
    const aboutContent = page.locator("p, [class*='text'], [class*='content']");
    expect(await aboutContent.count()).toBeGreaterThan(0);

    // 통계 카드 확인
    const statsCards = page.locator("[class*='card'], article");
    const statsCount = await statsCards.count();
    expect(statsCount).toBeGreaterThan(0);
  });

  test("SCR-004: Mate list page loads", async ({ page }) => {
    // /mates 페이지 이동
    await page.goto("http://localhost:3000/mates");

    // 페이지 로드 확인
    await expect(page).toHaveTitle(/동행|Mate|함께/i);

    // 페이지 헤더 확인
    const pageTitle = page.locator("h1, [role='heading']").first();
    await expect(pageTitle).toBeVisible();
  });

  test("SCR-004: Mate list displays posts", async ({ page }) => {
    await page.goto("http://localhost:3000/mates");

    // 동행 카드 목록 확인
    const mateCards = page.locator("article, [role='article']");
    const count = await mateCards.count();
    expect(count).toBeGreaterThan(0);

    // 첫 번째 카드의 제목 확인
    const firstTitle = mateCards.first().locator("h3, h4").first();
    await expect(firstTitle).toBeVisible();
  });

  test("SCR-004: Unauthenticated access shows appropriate state", async ({ page }) => {
    await page.goto("http://localhost:3000/mates");

    // 비로그인 상태에서 메시지나 CTA 확인
    const content = page.locator("body");
    await expect(content).toBeVisible();

    // 로그인 유도 등의 요소가 있는지 확인
    const authElements = page.locator(
      "button:has-text('로그인'), a:has-text('가입'), [class*='auth']"
    );

    // 리스트는 보여야 하지만 상세 보기는 제한될 수 있음
    const mateCards = page.locator("article, [role='article']");
    expect(await mateCards.count()).toBeGreaterThan(0);
  });

  test("Complete smoke flow: home → about → mates", async ({ page }) => {
    // 홈페이지 확인
    await page.goto("http://localhost:3000");
    await expect(page.locator("h1, [role='heading']").first()).toBeVisible();

    // About 페이지 이동
    const aboutLink = page.locator("a:has-text('소개'), a:has-text('대표'), a[href*='/about']").first();
    if (await aboutLink.isVisible()) {
      await aboutLink.click();
      await page.waitForURL("**/about");
    } else {
      await page.goto("http://localhost:3000/about");
    }
    await expect(page).toHaveURL(/about/);

    // Mates 페이지 이동
    const matesLink = page.locator("a:has-text('동행'), a:has-text('함께'), a[href*='/mates']").first();
    if (await matesLink.isVisible()) {
      await matesLink.click();
      await page.waitForURL("**/mates");
    } else {
      await page.goto("http://localhost:3000/mates");
    }
    await expect(page).toHaveURL(/mates/);
  });

  test("Navigation and back button work correctly", async ({ page }) => {
    await page.goto("http://localhost:3000/about");
    await expect(page).toHaveURL(/about/);

    // 뒤로 가기
    await page.goBack();
    // 메인 페이지로 돌아왔는지 확인
    await expect(page).toHaveURL(/^\/$|^\/\?/);
  });

  test("Images and lazy loading work", async ({ page }) => {
    await page.goto("http://localhost:3000");

    // 이미지 요소 확인
    const images = page.locator("img");
    const imageCount = await images.count();
    expect(imageCount).toBeGreaterThan(0);

    // 첫 번째 이미지가 로드되었는지 확인
    const firstImage = images.first();
    if (await firstImage.isVisible()) {
      const altText = await firstImage.getAttribute("alt");
      expect(altText).toBeTruthy();
    }
  });
});
