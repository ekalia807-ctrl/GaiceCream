"use client";

import { useSyncExternalStore } from "react";
import {
  ordersStore,
  poStore,
  productsStore,
  settingsStore,
  transactionsStore,
} from "@/lib/admin/repository";
import type { RemoteCollection } from "@/lib/supabase/collection";
import type { CashTransaction, Order, PoPeriod, StoreSettings } from "@/types/admin";
import type { Product } from "@/types/product";
import { useHydrated } from "./useHydrated";

function useStore<T extends { id: string }>(store: RemoteCollection<T>) {
  return useSyncExternalStore(
    store.subscribe,
    store.getSnapshot,
    store.getServerSnapshot,
  );
}

function useStoreReady<T extends { id: string }>(store: RemoteCollection<T>) {
  return useSyncExternalStore(store.subscribe, store.isReady, () => false);
}

export const useAdminProducts = (): Product[] => useStore(productsStore);
export const useAdminOrders = (): Order[] => useStore(ordersStore);
export const useAdminTransactions = (): CashTransaction[] => useStore(transactionsStore);
export const useAdminSettings = (): StoreSettings | undefined => useStore(settingsStore)[0];
export const usePoPeriods = (): PoPeriod[] => useStore(poStore);

/** true setelah semua data admin selesai dimuat dari Supabase. */
export function useAdminReady() {
  const hydrated = useHydrated();
  const products = useStoreReady(productsStore);
  const orders = useStoreReady(ordersStore);
  const transactions = useStoreReady(transactionsStore);
  const settings = useStoreReady(settingsStore);
  const periods = useStoreReady(poStore);
  return hydrated && products && orders && transactions && settings && periods;
}
