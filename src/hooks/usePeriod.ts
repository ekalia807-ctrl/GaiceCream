"use client";

import { useMemo, useState } from "react";
import {
  resolvePeriod,
  toDateInput,
  type DateRange,
  type PeriodPreset,
} from "@/lib/admin/period";

export type PeriodState = {
  preset: PeriodPreset;
  setPreset: (preset: PeriodPreset) => void;
  custom: { from: string; to: string };
  setCustom: (custom: { from: string; to: string }) => void;
  range: DateRange;
};

export function usePeriod(initial: PeriodPreset = "month"): PeriodState {
  const [preset, setPreset] = useState<PeriodPreset>(initial);
  const [custom, setCustom] = useState(() => {
    const today = toDateInput(new Date());
    return { from: today, to: today };
  });
  const range = useMemo(() => resolvePeriod(preset, custom), [preset, custom]);
  return { preset, setPreset, custom, setCustom, range };
}
