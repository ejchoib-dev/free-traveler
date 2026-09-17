"use client";

import { useCallback, useSyncExternalStore } from "react";

/**
 * 즐겨찾기(SHARED-FAVORITES) — REQ-FUNC-068
 *
 * PROJECT_SCOPE.md §5: 서버 저장 없이 브라우저별 localStorage만 사용한다.
 * 여러 컴포넌트가 동시에 이 훅을 사용해도 같은 상태를 공유하도록
 * 모듈 스코프 store + useSyncExternalStore로 구현한다.
 */

const STORAGE_KEY = "traveler:favorites";

function readFromStorage(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return new Set();
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return new Set();
    return new Set(parsed.filter((id): id is string => typeof id === "string"));
  } catch {
    return new Set();
  }
}

function writeToStorage(ids: Set<string>): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(ids)));
  } catch {
    // localStorage 접근 불가(프라이빗 모드·용량 초과 등)는 조용히 무시한다.
  }
}

let snapshot: ReadonlySet<string> = readFromStorage();
const listeners = new Set<() => void>();

function emit(): void {
  listeners.forEach((listener) => listener());
}

function commit(next: Set<string>): void {
  snapshot = next;
  writeToStorage(next);
  emit();
}

function handleStorageEvent(event: StorageEvent): void {
  if (event.key !== STORAGE_KEY) return;
  snapshot = readFromStorage();
  emit();
}

function subscribe(onStoreChange: () => void): () => void {
  listeners.add(onStoreChange);
  window.addEventListener("storage", handleStorageEvent);
  return () => {
    listeners.delete(onStoreChange);
    if (listeners.size === 0) {
      window.removeEventListener("storage", handleStorageEvent);
    }
  };
}

function getSnapshot(): ReadonlySet<string> {
  return snapshot;
}

function getServerSnapshot(): ReadonlySet<string> {
  return new Set();
}

export interface UseFavoritesResult {
  favoriteIds: string[];
  isFavorite: (id: string) => boolean;
  addFavorite: (id: string) => void;
  removeFavorite: (id: string) => void;
  toggleFavorite: (id: string) => void;
}

export function useFavorites(): UseFavoritesResult {
  const current = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  const isFavorite = useCallback((id: string) => current.has(id), [current]);

  const addFavorite = useCallback((id: string) => {
    if (snapshot.has(id)) return; // 중복 생성 방지
    commit(new Set(snapshot).add(id));
  }, []);

  const removeFavorite = useCallback((id: string) => {
    if (!snapshot.has(id)) return;
    const next = new Set(snapshot);
    next.delete(id);
    commit(next);
  }, []);

  const toggleFavorite = useCallback((id: string) => {
    const next = new Set(snapshot);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    commit(next);
  }, []);

  return {
    favoriteIds: Array.from(current),
    isFavorite,
    addFavorite,
    removeFavorite,
    toggleFavorite,
  };
}
