"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

/**
 * Toast 알림 시스템(SHARED-TOAST) — REQ-FUNC-043
 *
 * PROJECT_SCOPE.md §5: 외부 이메일 발송 없이 인앱 Toast로만 처리 결과를 알린다.
 * 이메일 발송 자체를 구현하지 않으므로 "이메일 장애가 상태 변경을 롤백하지 않는다"는
 * 애초에 이메일 경로가 없어 자연히 충족된다.
 */

export type ToastVariant = "success" | "error" | "warning" | "info";

interface ToastMessage {
  id: string;
  variant: ToastVariant;
  label: string;
  description: string;
}

interface ShowToastInput {
  variant: ToastVariant;
  description: string;
}

interface ToastContextValue {
  showToast: (input: ShowToastInput) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

/** Visual AC: 색상만이 아니라 텍스트 라벨을 항상 병기한다 */
const VARIANT_LABEL: Record<ToastVariant, string> = {
  success: "완료",
  error: "오류",
  warning: "주의",
  info: "안내",
};

/** design-reference/D-001/DESIGN.md §2 semantic 색상만 사용(임의 색상 추가 금지) */
const VARIANT_CLASS: Record<ToastVariant, string> = {
  success:
    "border-[var(--color-success)] bg-[var(--color-success-soft)] text-[var(--color-success)]",
  error:
    "border-[var(--color-danger)] bg-[var(--color-danger-soft)] text-[var(--color-danger)]",
  warning:
    "border-[var(--color-warning)] bg-[var(--color-warning-soft)] text-[var(--color-warning)]",
  info: "border-[var(--color-info)] bg-[var(--color-info-soft)] text-[var(--color-info)]",
};

const AUTO_DISMISS_MS = 4000;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const timers = useRef(new Map<string, ReturnType<typeof setTimeout>>());

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
    const timer = timers.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timers.current.delete(id);
    }
  }, []);

  const showToast = useCallback<ToastContextValue["showToast"]>(
    ({ variant, description }) => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
      setToasts((prev) => [
        ...prev,
        { id, variant, label: VARIANT_LABEL[variant], description },
      ]);
      const timer = setTimeout(() => dismissToast(id), AUTO_DISMISS_MS);
      timers.current.set(id, timer);
    },
    [dismissToast],
  );

  useEffect(() => {
    const timersMap = timers.current;
    return () => {
      timersMap.forEach((timer) => clearTimeout(timer));
      timersMap.clear();
    };
  }, []);

  const value = useMemo(() => ({ showToast }), [showToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        role="status"
        aria-live="polite"
        className="fixed inset-x-0 bottom-[var(--spacing-token-lg)] z-50 flex flex-col items-center gap-[var(--spacing-token-sm)] px-[var(--spacing-token-lg)] sm:right-[var(--spacing-token-lg)] sm:left-auto sm:items-end"
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="flex w-full max-w-sm items-start gap-[var(--spacing-token-sm)] rounded-[var(--radius-token-md)] border bg-[var(--color-canvas)] px-[var(--spacing-token-lg)] py-[var(--spacing-token-md)] shadow-[var(--shadow-card)]"
          >
            <span
              className={`shrink-0 rounded-[var(--radius-token-full)] border px-[var(--spacing-token-sm)] py-[2px] text-[13px] font-medium ${VARIANT_CLASS[toast.variant]}`}
            >
              {toast.label}
            </span>
            <p className="flex-1 text-[14px] text-[var(--color-body)]">
              {toast.description}
            </p>
            <button
              type="button"
              onClick={() => dismissToast(toast.id)}
              aria-label="알림 닫기"
              className="text-[var(--color-muted)]"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast는 ToastProvider 내부에서만 사용할 수 있다.");
  }
  return ctx;
}
