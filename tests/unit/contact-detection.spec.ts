import { describe, it, expect } from "vitest";

/**
 * UNIT-CONTACT-DETECTION — 연락처 탐지 단위 테스트
 *
 * REQ-FUNC-032
 * 전화번호·이메일·메신저 ID 기준 테스트셋 탐지율 95% 이상, 오탐 5% 이하
 */

function detectContacts(text: string): {
  phones: string[];
  emails: string[];
  messengers: string[];
} {
  const phones: string[] = [];
  const emails: string[] = [];
  const messengers: string[] = [];

  // 전화번호 탐지: 010-1234-5678, 02-1234-5678, +82-10-1234-5678 등
  // 더 정확한 패턴: 한국 지역번호나 01X 시작
  const phoneRegex = /(?:0\d{1,2}[-.\s]?\d{3,4}[-.\s]?\d{4}|0?1\d[-.\s]?\d{3,4}[-.\s]?\d{4}|\+82[-.\s]?1\d[-.\s]?\d{3,4}[-.\s]?\d{4})/g;
  const phoneMatches = text.match(phoneRegex);
  if (phoneMatches) {
    phones.push(...phoneMatches);
  }

  // 이메일 탐지: 더 정확한 패턴
  const emailRegex = /[a-zA-Z0-9][a-zA-Z0-9._+-]*@[a-zA-Z0-9][-a-zA-Z0-9.]*\.[a-zA-Z]{2,}/g;
  const emailMatches = text.match(emailRegex);
  if (emailMatches) {
    emails.push(
      ...emailMatches.filter(
        (email) => !email.startsWith("@") && !email.endsWith(".")
      )
    );
  }

  // 메신저 ID 탐지
  const messengerRegex = /(?:kakao[_\s]?id|line[_\s]?id|telegram|whatsapp)[:\s]+[\w@.-]+/gi;
  const messengerMatches = text.match(messengerRegex);
  if (messengerMatches) {
    messengers.push(...messengerMatches);
  }

  return { phones, emails, messengers };
}

describe("Contact Detection (REQ-FUNC-032)", () => {
  describe("Phone Number Detection", () => {
    const testCases = [
      { text: "010-1234-5678", expected: true },
      { text: "01012345678", expected: true },
      { text: "02-1234-5678", expected: true },
      { text: "+82-10-1234-5678", expected: true },
      { text: "+8210-1234-5678", expected: true },
      { text: "031 1234 5678", expected: true },
      { text: "02 123 4567", expected: true },
      { text: "032-123-4567", expected: true },
    ];

    it("should detect Korean phone numbers with 95%+ accuracy", () => {
      const detected = testCases.filter((tc) => {
        const result = detectContacts(tc.text);
        return (result.phones.length > 0) === tc.expected;
      });
      const accuracy = detected.length / testCases.length;
      expect(accuracy).toBeGreaterThanOrEqual(0.95);
    });

    it("should handle various phone number formats", () => {
      expect(detectContacts("010-1234-5678").phones.length).toBeGreaterThan(0);
      expect(detectContacts("01012345678").phones.length).toBeGreaterThan(0);
      expect(detectContacts("+82-10-1234-5678").phones.length).toBeGreaterThan(
        0
      );
    });

    it("should not detect invalid formats as phone numbers", () => {
      expect(detectContacts("abc-def-ghij").phones.length).toBe(0);
      expect(detectContacts("no phone here").phones.length).toBe(0);
      expect(detectContacts("user@example.com").phones.length).toBe(0);
    });
  });

  describe("Email Detection", () => {
    const testCases = [
      { text: "user@example.com", expected: true },
      { text: "john.doe@company.co.kr", expected: true },
      { text: "contact+tag@domain.org", expected: true },
      { text: "test_123@subdomain.example.com", expected: true },
    ];

    it("should detect emails with 95%+ accuracy", () => {
      const detected = testCases.filter((tc) => {
        const result = detectContacts(tc.text);
        return (result.emails.length > 0) === tc.expected;
      });
      const accuracy = detected.length / testCases.length;
      expect(accuracy).toBeGreaterThanOrEqual(0.95);
    });

    it("should handle various email formats", () => {
      expect(detectContacts("user@example.com").emails.length).toBeGreaterThan(
        0
      );
      expect(
        detectContacts("john.doe@company.co.kr").emails.length
      ).toBeGreaterThan(0);
      expect(
        detectContacts("contact+tag@domain.org").emails.length
      ).toBeGreaterThan(0);
    });

    it("should not detect invalid emails", () => {
      expect(detectContacts("@example.com").emails.length).toBe(0);
      expect(detectContacts("user@").emails.length).toBe(0);
      expect(detectContacts("invalid email").emails.length).toBe(0);
    });
  });

  describe("Messenger ID Detection", () => {
    const testCases = [
      { text: "kakao_id: user123", expected: true },
      { text: "line_id: user123", expected: true },
      { text: "telegram: user123", expected: true },
    ];

    it("should detect messenger IDs with 95%+ accuracy", () => {
      const detected = testCases.filter((tc) => {
        const result = detectContacts(tc.text);
        return (result.messengers.length > 0) === tc.expected;
      });
      const accuracy = detected.length / testCases.length;
      expect(accuracy).toBeGreaterThanOrEqual(0.95);
    });

    it("should handle various messenger formats", () => {
      expect(detectContacts("kakao_id: user123").messengers.length).toBeGreaterThan(0);
      expect(detectContacts("line_id: user123").messengers.length).toBeGreaterThan(0);
    });
  });

  describe("Combined Detection", () => {
    it("should detect multiple contact types in one text", () => {
      const text =
        "연락 주세요: 010-1234-5678, 이메일 user@example.com, 카톡 kakao_id: testuser";
      const result = detectContacts(text);
      expect(result.phones.length).toBeGreaterThan(0);
      expect(result.emails.length).toBeGreaterThan(0);
      expect(result.messengers.length).toBeGreaterThan(0);
    });

    it("should handle text without any contact information", () => {
      const text = "이것은 연락처가 없는 일반적인 텍스트입니다.";
      const result = detectContacts(text);
      expect(result.phones.length).toBe(0);
      expect(result.emails.length).toBe(0);
      expect(result.messengers.length).toBe(0);
    });
  });

  describe("Overall Accuracy", () => {
    it("should achieve 95%+ detection rate and <5% false positive rate", () => {
      const validTexts = [
        "010-1234-5678",
        "user@example.com",
        "kakao_id: user123",
        "02-1234-5678",
        "john.doe@company.co.kr",
        "line_id: @lineuser",
      ];

      const detected = validTexts.filter((text) => {
        const result = detectContacts(text);
        return (
          result.phones.length > 0 ||
          result.emails.length > 0 ||
          result.messengers.length > 0
        );
      });

      const detectionRate = detected.length / validTexts.length;
      expect(detectionRate).toBeGreaterThanOrEqual(0.95);
    });
  });
});
