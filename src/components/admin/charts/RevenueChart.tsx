"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { SeriesPoint } from "@/lib/admin/analytics";
import { formatIDR } from "@/lib/utils";

export function RevenueChart({ data }: { data: SeriesPoint[] }) {
  return (
    <div className="h-[200px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 4, left: 4, bottom: 0 }}>
          <defs>
            <linearGradient id="revenueBar" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#e98da8" />
              <stop offset="1" stopColor="#f7c4d2" />
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
          <YAxis hide />
          <Tooltip
            cursor={{ fill: "rgba(245,184,201,.15)" }}
            formatter={(value) => formatIDR(Number(value))}
          />
          <Bar
            dataKey="revenue"
            name="Pendapatan"
            fill="url(#revenueBar)"
            radius={[5, 5, 0, 0]}
            maxBarSize={40}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
