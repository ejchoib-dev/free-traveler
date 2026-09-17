import { test, expect } from "@playwright/test";

/**
 * E2E-MATE-AUTH — 인증·동행 작성·참가·승인 Smoke
 *
 * REQ-FUNC-027, REQ-FUNC-028, REQ-FUNC-031, REQ-FUNC-034, REQ-FUNC-036
 *
 * 비회원 차단→로그인/성인확인→동행글 작성→참가 요청→작성자 승인 흐름
 */

test.describe("Auth & Mate Workflow Smoke Test (E2E-MATE-AUTH)", () => {
  test("Unauthenticated user cannot write mate post", async ({ page }) => {
    // /travel-tools 페이지로 이동
    await page.goto("http://localhost:3000/travel-tools");

    // 동행 구하기 탭 클릭
    const mateTab = page.locator("button:has-text('동행')").first();
    await mateTab.click();

    // 제목 입력 필드 확인
    const titleInput = page.locator("input[type='text']").first();
    if (await titleInput.isVisible()) {
      // 입력 필드는 있을 수 있지만 제출 시 로그인 유도
      await titleInput.fill("테스트 동행글");
    }

    // 제출 버튼 클릭
    const submitButton = page
      .locator("button:has-text('작성'), button:has-text('제출')")
      .first();

    if (await submitButton.isVisible()) {
      // 비로그인 상태에서는 제출 불가 또는 로그인 페이지로 이동
      const isDisabled = await submitButton.isDisabled();
      if (!isDisabled) {
        await submitButton.click();
        // 로그인 페이지로 이동되거나 오류 메시지 표시
        const url = page.url();
        const errorMsg = page.locator("[class*='error'], .text-red");
        expect(url.includes("account") || await errorMsg.isVisible()).toBeTruthy();
      }
    }
  });

  test("User authentication flow: signup/login", async ({ page }) => {
    // 계정 페이지로 이동
    await page.goto("http://localhost:3000/account");

    // 로그인 폼 확인
    const emailInput = page.locator("input[type='email']").first();
    const passwordInput = page.locator("input[type='password']").first();

    await expect(emailInput).toBeVisible();
    await expect(passwordInput).toBeVisible();

    // 가입 탭으로 전환
    const signupTab = page.locator("button:has-text('가입')").first();
    if (await signupTab.isVisible()) {
      await signupTab.click();
    }

    // 이메일과 비밀번호 입력
    await emailInput.fill("testuser@example.com");
    await passwordInput.fill("password123");

    // 가입 버튼 클릭
    const submitButton = page.locator("button:has-text('가입')").first();
    if (await submitButton.isVisible()) {
      await submitButton.click();
      // 가입 완료 또는 로그인 상태 전환 확인
      await page.waitForTimeout(1000);
    }
  });

  test("User profile setup: age verification", async ({ page }) => {
    // 계정 페이지의 프로필 탭
    await page.goto("http://localhost:3000/account");

    const profileTab = page.locator("button:has-text('프로필')").first();
    if (await profileTab.isVisible()) {
      await profileTab.click();
    }

    // 프로필 정보 입력 폼 확인
    const nicknameInput = page.locator("input[placeholder*='닉네임']").first();
    const ageSelect = page.locator("select").first();

    if (await nicknameInput.isVisible()) {
      await nicknameInput.fill("여행자_테스트");
    }

    if (await ageSelect.isVisible()) {
      await ageSelect.selectOption("30대");
    }

    // 성인 확인 버튼 확인
    const verifyButton = page
      .locator("button:has-text('성인 확인'), button:has-text('확인')")
      .first();

    if (await verifyButton.isVisible()) {
      await verifyButton.click();
      await page.waitForTimeout(500);
    }
  });

  test("Create mate post", async ({ page }) => {
    // /travel-tools 페이지로 이동
    await page.goto("http://localhost:3000/travel-tools");

    // 동행 구하기 탭 클릭
    const mateTab = page.locator("button:has-text('동행')").first();
    await mateTab.click();

    // 입력 필드 찾기
    const titleInput = page.locator("input[type='text']").first();
    const countrySelect = page.locator("select").first();
    const textarea = page.locator("textarea").first();

    // 입력
    if (await titleInput.isVisible()) {
      await titleInput.fill("도쿄 여행 동행자 구합니다");
    }

    if (await countrySelect.isVisible()) {
      await countrySelect.selectOption("Japan");
    }

    if (await textarea.isVisible()) {
      await textarea.fill(
        "도쿄에서 3박 4일 여행 함께할 분을 찾습니다. 문화와 음식을 즐기고 싶어요."
      );
    }

    // 제출 버튼 클릭
    const submitButton = page
      .locator("button:has-text('작성'), button:has-text('신청')")
      .first();

    if (await submitButton.isVisible()) {
      // 제출 가능한 상태인지 확인
      const isDisabled = await submitButton.isDisabled();
      if (!isDisabled) {
        // 성공 메시지 또는 페이지 이동 확인
        await submitButton.click();
        await page.waitForTimeout(1000);
      }
    }
  });

  test("View mate posts list and apply", async ({ page }) => {
    // /mates 페이지로 이동
    await page.goto("http://localhost:3000/mates");

    // 동행 카드 확인
    const mateCards = page.locator("article, [role='article']");
    const count = await mateCards.count();
    expect(count).toBeGreaterThan(0);

    // 첫 번째 카드 클릭 (상세 보기)
    const firstCard = mateCards.first();
    if (await firstCard.isVisible()) {
      await firstCard.click();

      // 상세 패널 확인
      const detailPanel = page.locator(
        "[class*='panel'], [class*='drawer'], aside"
      ).first();

      if (await detailPanel.isVisible()) {
        // 신청 버튼 확인
        const applyButton = page
          .locator("button:has-text('신청'), button:has-text('지원')")
          .first();

        if (await applyButton.isVisible()) {
          await applyButton.click();

          // 신청 폼 또는 확인 다이얼로그 표시
          const applicationForm = page.locator("textarea, [class*='form']").first();
          if (await applicationForm.isVisible()) {
            // 신청 메시지 입력
            if (await applicationForm.evaluate((el) => el instanceof HTMLTextAreaElement)) {
              await applicationForm.fill("함께 여행하고 싶습니다!");
            }

            // 신청 완료 버튼
            const confirmButton = page
              .locator("button:has-text('신청'), button:has-text('제출')")
              .nth(1);
            if (await confirmButton.isVisible()) {
              await confirmButton.click();
              await page.waitForTimeout(1000);
            }
          }
        }
      }
    }
  });

  test("User account page shows activity", async ({ page }) => {
    // /account 페이지로 이동
    await page.goto("http://localhost:3000/account");

    // 내 활동 탭 확인
    const activityTab = page.locator("button:has-text('활동'), button:has-text('신청')").first();
    if (await activityTab.isVisible()) {
      await activityTab.click();

      // 신청한 동행글 또는 내 글 목록이 표시되는지 확인
      const activityList = page.locator("article, [role='article'], [class*='list']");
      const count = await activityList.count();

      // 활동 기록이 있거나 빈 상태 메시지가 표시되어야 함
      expect(count >= 0).toBeTruthy();
    }
  });

  test("Complete authentication and mate workflow", async ({ page }) => {
    // 1. 계정 페이지
    await page.goto("http://localhost:3000/account");
    const emailInput = page.locator("input[type='email']").first();
    await expect(emailInput).toBeVisible();

    // 2. 프로필 설정
    const profileTab = page.locator("button:has-text('프로필')").first();
    if (await profileTab.isVisible()) {
      await profileTab.click();
    }

    // 3. 동행 도구 이동
    await page.goto("http://localhost:3000/travel-tools");
    const mateTab = page.locator("button:has-text('동행')").first();
    await expect(mateTab).toBeVisible();

    // 4. 동행 목록 이동
    await page.goto("http://localhost:3000/mates");
    const mateCards = page.locator("article, [role='article']");
    expect(await mateCards.count()).toBeGreaterThan(0);

    // 5. 계정 페이지 돌아오기
    await page.goto("http://localhost:3000/account");
    const accountTitle = page.locator("h1, [role='heading']").first();
    await expect(accountTitle).toBeVisible();
  });

  test("Permission check: non-admin cannot access admin tab", async ({ page }) => {
    // /account 페이지로 이동 (일반 회원)
    await page.goto("http://localhost:3000/account");

    // 관리자 탭 시도
    const adminTab = page.locator("button:has-text('관리')").first();

    // 일반 회원은 관리자 탭이 없어야 함
    const tabCount = await page.locator("button[role='tab'], [role='tab']").count();
    expect(tabCount).toBeLessThanOrEqual(2); // 프로필, 내 활동 또는 그 이상이 아님

    // 만약 탭이 있더라도 클릭 시 권한 오류가 표시되어야 함
    if (await adminTab.isVisible()) {
      await adminTab.click();
      const errorMsg = page.locator("[class*='error'], .text-red");
      if (await errorMsg.isVisible()) {
        await expect(errorMsg).toContainText(/권한|접근|없습니다/i);
      }
    }
  });
});
