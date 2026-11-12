"use client";

import {
  Area,
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { SeriesPoint } from "@/lib/admin/analytics";
import { formatCompactIDR, formatIDR } from "@/lib/utils";

export const cashflowLegend = [
  { label: "Omzet", color: "#e58fa8", dashed: false },
  { label: "Modal", color: "#8b719c", dashed: false },
  { label: "Pengeluaran", color: "#a66b4d", dashed: true },
  { label: "Keuntungan", color: "#5b965a", dashed: false },
];

export function CashflowChart({ data }: { data: SeriesPoint[] }) {
  return (
    <div className="h-[230px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="omzetFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#F5B8C9" stopOpacity={0.5} />
              <stop offset="1" stopColor="#F5B8C9" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} stroke="#f1e6df" />
          <XAxis
            dataKey="label"
            tickLine={false}
            axisLine={{ stroke: "#e9ddd4" }}
            tick={{ fontSize: 10, fill: "#78716c" }}
            interval="preserveStartEnd"
          />
          <YAxis
            width={46}
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 10, fill: "#78716c" }}
            tickFormatter={(value) => formatCompactIDR(Number(value))}
          />
          <Tooltip formatter={(value) => formatIDR(Number(value))} />
          <Area
            type="monotone"
            dataKey="revenue"
            name="Omzet"
            stroke="#e58fa8"
            strokeWidth={3}
            fill="url(#omzetFill)"
          />
          <Line type="monotone" dataKey="cogs" name="Modal" stroke="#8b719c" strokeWidth={2} dot={false} />
          <Line
            type="monotone"
            dataKey="expenses"
            name="Pengeluaran"
            stroke="#a66b4d"
            strokeWidth={2}
            strokeDasharray="6 4"
            dot={false}
          />
          <Line type="monotone" dataKey="profit" name="Keuntungan" stroke="#5b965a" strokeWidth={2} dot={false} />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
