"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

/** false saat render server/hidrasi, true setelah tampil di browser. */
export function useHydrated() {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}
