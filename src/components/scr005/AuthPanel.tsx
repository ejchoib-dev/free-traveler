"use client";

import { useState } from "react";

/**
 * COMP-SCR005-AUTH — Guest 인증(로그인/가입/재설정)
 *
 * REQ-FUNC-066, REQ-FUNC-027, REQ-FUNC-028
 */

type AuthMode = "login" | "signup" | "reset";

export function AuthPanel() {
  const [mode, setMode] = useState<AuthMode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async () => {
    setError("");
    if (!email || !password) {
      setError("이메일과 비밀번호를 입력해주세요");
      return;
    }

    setIsSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      setEmail("");
      setPassword("");
      alert("로그인 성공");
      setIsSubmitting(false);
    } catch {
      setError("로그인에 실패했습니다");
      setIsSubmitting(false);
    }
  };

  const handleSignup = async () => {
    setError("");
    if (!email || !password) {
      setError("이메일과 비밀번호를 입력해주세요");
      return;
    }

    if (password.length < 6) {
      setError("비밀번호는 6자 이상이어야 합니다");
      return;
    }

    setIsSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      setEmail("");
      setPassword("");
      alert("가입 완료");
      setMode("login");
      setIsSubmitting(false);
    } catch {
      setError("가입에 실패했습니다");
      setIsSubmitting(false);
    }
  };

  const handleReset = async () => {
    setError("");
    if (!email) {
      setError("이메일을 입력해주세요");
      return;
    }

    setIsSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      alert("재설정 링크가 이메일로 발송되었습니다");
      setEmail("");
      setMode("login");
      setIsSubmitting(false);
    } catch {
      setError("요청에 실패했습니다");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* 세그먼트 탭 */}
      <div className="flex gap-2 border-b border-gray-200">
        {[
          { id: "login" as AuthMode, label: "로그인" },
          { id: "signup" as AuthMode, label: "가입" },
          { id: "reset" as AuthMode, label: "비밀번호 재설정" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setMode(tab.id);
              setError("");
            }}
            className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
              mode === tab.id
                ? "border-primary text-primary"
                : "border-transparent text-muted hover:text-ink"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 폼 */}
      <div className="space-y-4">
        {/* 에러 메시지 */}
        {error && (
          <div className="rounded-lg bg-red-50 p-4 text-sm text-red-900">
            {error}
          </div>
        )}

        {/* 이메일 입력 */}
        <div>
          <label className="block text-sm font-medium text-ink mb-2">
            이메일
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (error) setError("");
            }}
            disabled={isSubmitting}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary disabled:bg-gray-50"
            placeholder="your@email.com"
          />
        </div>

        {/* 비밀번호 입력 (로그인/가입만) */}
        {mode !== "reset" && (
          <div>
            <label className="block text-sm font-medium text-ink mb-2">
              비밀번호
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (error) setError("");
              }}
              disabled={isSubmitting}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary disabled:bg-gray-50"
              placeholder="••••••"
            />
            {mode === "signup" && (
              <p className="mt-1 text-xs text-muted">6자 이상</p>
            )}
          </div>
        )}

        {/* 제출 버튼 */}
        <button
          onClick={() => {
            if (mode === "login") handleLogin();
            else if (mode === "signup") handleSignup();
            else handleReset();
          }}
          disabled={isSubmitting}
          className="w-full rounded-lg bg-primary px-4 py-2 font-medium text-white hover:bg-red-600 disabled:bg-gray-300 transition-colors"
        >
          {isSubmitting
            ? "처리 중..."
            : mode === "login"
              ? "로그인"
              : mode === "signup"
                ? "가입"
                : "재설정 링크 발송"}
        </button>

        {/* 안내 문구 */}
        <p className="text-xs text-muted text-center">
          {mode === "login" && "계정이 없으신가요? "}
          {mode === "signup" && "이미 계정이 있으신가요? "}
          {mode === "reset" && "기억나셨나요? "}

          {mode === "login" && (
            <button
              onClick={() => setMode("signup")}
              className="text-primary hover:underline"
            >
              가입하기
            </button>
          )}
          {mode === "signup" && (
            <button
              onClick={() => setMode("login")}
              className="text-primary hover:underline"
            >
              로그인하기
            </button>
          )}
          {mode === "reset" && (
            <button
              onClick={() => setMode("login")}
              className="text-primary hover:underline"
            >
              로그인하기
            </button>
          )}
        </p>
      </div>

      {/* 비밀번호 재설정 링크 */}
      {mode === "login" && (
        <div className="text-center">
          <button
            onClick={() => setMode("reset")}
            className="text-xs text-primary hover:underline"
          >
            비밀번호를 잊으셨나요?
          </button>
        </div>
      )}
    </div>
  );
}
