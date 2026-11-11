"use client";

import {
  periodOptions,
  type PeriodPreset,
} from "@/lib/admin/period";
import type { PeriodState } from "@/hooks/usePeriod";
import { pillControl } from "./styles";

export function PeriodFilter({
  period,
  options = periodOptions,
}: {
  period: PeriodState;
  options?: { value: PeriodPreset; label: string }[];
}) {
  const dateInput = `${pillControl} px-[12px] py-[8px]`;

  return (
    <div className="flex flex-wrap items-center gap-[8px]">
      <select
        aria-label="Periode"
        value={period.preset}
        onChange={(event) => period.setPreset(event.target.value as PeriodPreset)}
        className={pillControl}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {period.preset === "custom" && (
        <>
          <input
            type="date"
            aria-label="Dari tanggal"
            value={period.custom.from}
            max={period.custom.to}
            onChange={(event) =>
              period.setCustom({ ...period.custom, from: event.target.value })
            }
            className={dateInput}
          />
          <span className="text-[12px] text-muted">–</span>
          <input
            type="date"
            aria-label="Sampai tanggal"
            value={period.custom.to}
            min={period.custom.from}
            onChange={(event) =>
              period.setCustom({ ...period.custom, to: event.target.value })
            }
            className={dateInput}
          />
        </>
      )}
    </div>
  );
}
