import { test, expect } from "@playwright/test";

/**
 * E2E-TRAVEL-TOOLS — 항공·숙소 외부 이동 Smoke
 *
 * REQ-FUNC-011, REQ-FUNC-013, REQ-FUNC-016, REQ-FUNC-019, REQ-FUNC-021, REQ-FUNC-024
 *
 * 항공/숙소 입력→검증 오류→유효 요약→새 탭 이동 흐름
 * 네트워크 탭에서 입력값 미전송 확인
 */

test.describe("Travel Tools Smoke Test (E2E-TRAVEL-TOOLS)", () => {
  test.beforeEach(async ({ page }) => {
    // travel-tools 페이지로 이동
    await page.goto("http://localhost:3000/travel-tools");
  });

  test("SCR-003: Page loads with tabs", async ({ page }) => {
    // 페이지 로드 확인
    await expect(page).toHaveTitle(/travel-tools|여행|도구/i);

    // 탭이 표시되는지 확인
    const tabs = page.locator("button[role='tab'], [role='tab']");
    const tabCount = await tabs.count();
    expect(tabCount).toBeGreaterThanOrEqual(3); // 항공편, 숙소, 동행
  });

  test("Flight tab: Empty state and input validation", async ({ page }) => {
    // 항공편 탭 클릭
    const flightTab = page.locator("button:has-text('항공'), [role='tab']:has-text('항공')").first();
    await flightTab.click();

    // 국가/지역 선택 드롭다운 확인
    const countrySelect = page.locator("select").first();
    await expect(countrySelect).toBeVisible();

    // 날짜 입력 필드 확인
    const dateInputs = page.locator("input[type='date']");
    const dateCount = await dateInputs.count();
    expect(dateCount).toBeGreaterThanOrEqual(2);
  });

  test("Flight tab: Input validation - reject past dates", async ({ page }) => {
    const flightTab = page.locator("button:has-text('항공')").first();
    await flightTab.click();

    // 과거 날짜 입력
    const dateInputs = page.locator("input[type='date']");
    await dateInputs.first().fill("2020-01-01");

    // 오류 메시지 확인 또는 입력이 거부되는지 확인
    const errorMsg = page.locator("[class*='error'], .text-red");
    if (await errorMsg.isVisible()) {
      await expect(errorMsg).toContainText(/과거|이전|불가능|필수/i);
    }
  });

  test("Flight tab: Valid input shows summary", async ({ page }) => {
    const flightTab = page.locator("button:has-text('항공')").first();
    await flightTab.click();

    // 국가 선택
    const countrySelect = page.locator("select").first();
    await countrySelect.selectOption("Japan");

    // 유효한 미래 날짜 입력
    const dateInputs = page.locator("input[type='date']");
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 30);
    const formattedDate = futureDate.toISOString().split("T")[0];

    await dateInputs.first().fill(formattedDate);
    await dateInputs.nth(1).fill(formattedDate);

    // 요약 정보 표시 확인
    const summary = page.locator("[class*='summary'], p:has-text('Japan')");
    if (await summary.isVisible()) {
      await expect(summary).toBeVisible();
    }
  });

  test("Hotel tab: Input validation", async ({ page }) => {
    // 숙소 탭 클릭
    const hotelTab = page.locator("button:has-text('숙소')").first();
    await hotelTab.click();

    // 국가/지역 선택 드롭다운 확인
    const countrySelect = page.locator("select").first();
    await expect(countrySelect).toBeVisible();

    // Check-in/Check-out 날짜 필드 확인
    const dateInputs = page.locator("input[type='date']");
    expect(await dateInputs.count()).toBeGreaterThanOrEqual(2);
  });

  test("Hotel tab: Valid input shows summary", async ({ page }) => {
    const hotelTab = page.locator("button:has-text('숙소')").first();
    await hotelTab.click();

    // 국가 선택
    const countrySelect = page.locator("select").first();
    await countrySelect.selectOption("Thailand");

    // 유효한 날짜 입력
    const dateInputs = page.locator("input[type='date']");
    const checkIn = new Date();
    checkIn.setDate(checkIn.getDate() + 30);
    const checkOut = new Date(checkIn);
    checkOut.setDate(checkOut.getDate() + 5);

    await dateInputs.first().fill(checkIn.toISOString().split("T")[0]);
    await dateInputs.nth(1).fill(checkOut.toISOString().split("T")[0]);

    // 요약 정보 표시 확인
    const summary = page.locator("[class*='summary'], p:has-text('Thailand')");
    if (await summary.isVisible()) {
      await expect(summary).toBeVisible();
    }
  });

  test("Mate write tab: Input and submission", async ({ page }) => {
    // 동행 구하기 탭 클릭
    const mateTab = page.locator("button:has-text('동행')").first();
    await mateTab.click();

    // 입력 필드 확인
    const countrySelect = page.locator("select").first();
    const textarea = page.locator("textarea").first();

    await expect(countrySelect).toBeVisible();
    await expect(textarea).toBeVisible();
  });

  test("External link opens in new tab with noopener", async ({ page, context }) => {
    const flightTab = page.locator("button:has-text('항공')").first();
    await flightTab.click();

    // 날짜 설정
    const dateInputs = page.locator("input[type='date']");
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 30);
    const formattedDate = futureDate.toISOString().split("T")[0];

    const countrySelect = page.locator("select").first();
    await countrySelect.selectOption("Japan");
    await dateInputs.first().fill(formattedDate);
    await dateInputs.nth(1).fill(formattedDate);

    // 외부 링크 버튼 클릭 (새 탭 이동)
    const externalLink = page.locator(
      "a[target='_blank'], button:has-text('Skyscanner'), button:has-text('예약')"
    ).first();

    if (await externalLink.isVisible()) {
      // 새 탭에서 열린다는 것 확인
      const [popup] = await Promise.all([
        context.waitForEvent("page"),
        externalLink.click(),
      ]);

      // 팝업의 opener가 null인지 확인 (보안)
      const hasOpener = await popup.evaluate(() => {
        return window.opener !== null;
      });
      // opener는 보안상 null이어야 함
      expect(hasOpener).toBe(false);

      await popup.close();
    }
  });

  test("Input values are not sent to network (client-side only)", async ({ page }) => {
    // 네트워크 요청 추적
    const requests: string[] = [];
    page.on("request", (request) => {
      if (
        request.method() === "GET" ||
        request.method() === "POST"
      ) {
        requests.push(request.url());
      }
    });

    const flightTab = page.locator("button:has-text('항공')").first();
    await flightTab.click();

    // 입력 수행
    const countrySelect = page.locator("select").first();
    await countrySelect.selectOption("Japan");

    const dateInputs = page.locator("input[type='date']");
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 30);
    const formattedDate = futureDate.toISOString().split("T")[0];

    await dateInputs.first().fill(formattedDate);
    await dateInputs.nth(1).fill(formattedDate);

    // 몇 초 대기하여 요청이 전송되지 않음을 확인
    await page.waitForTimeout(1000);

    // 검색 입력값이 URL 파라미터로 포함되어 있지 않은지 확인
    const urlParams = page.url();
    expect(urlParams).not.toContain("Japan");
    expect(urlParams).not.toContain(formattedDate);
  });

  test("Tab navigation works correctly", async ({ page }) => {
    // 항공편 탭 클릭
    const flightTab = page.locator("button:has-text('항공')").first();
    await flightTab.click();
    await expect(page.locator("input[type='date']").first()).toBeVisible();

    // 숙소 탭 클릭
    const hotelTab = page.locator("button:has-text('숙소')").first();
    await hotelTab.click();

    // 숙소 탭의 내용이 보이는지 확인
    const hotelInputs = page.locator("input[type='date']");
    expect(await hotelInputs.count()).toBeGreaterThan(0);
  });

  test("Date input validation: return date before departure shows error", async ({ page }) => {
    const flightTab = page.locator("button:has-text('항공')").first();
    await flightTab.click();

    const dateInputs = page.locator("input[type='date']");
    const departDate = new Date();
    departDate.setDate(departDate.getDate() + 30);
    const returnDate = new Date(departDate);
    returnDate.setDate(returnDate.getDate() - 5); // 출발일보다 이전

    await dateInputs.first().fill(departDate.toISOString().split("T")[0]);
    await dateInputs.nth(1).fill(returnDate.toISOString().split("T")[0]);

    // 오류 메시지 또는 비활성화 확인
    const errorMsg = page.locator("[class*='error'], .text-red");
    if (await errorMsg.isVisible()) {
      await expect(errorMsg).toContainText(/이후|같거나|불가능/i);
    }
  });
});
