"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { DayLoad } from "@/lib/types";

interface WeekdayWorkloadChartProps {
  dayLoads: DayLoad[];
}

export function WeekdayWorkloadChart({ dayLoads }: WeekdayWorkloadChartProps) {
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-1.5">
        <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-medium text-slate-600">
          <span className="h-2.5 w-2.5 rounded-full bg-slate-900" />
          Class
        </span>
        <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-medium text-slate-600">
          <span className="h-2.5 w-2.5 rounded-full bg-slate-500" />
          Study
        </span>
        <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-medium text-slate-600">
          <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />
          Commitments
        </span>
      </div>
      <div className="h-[19rem] w-full rounded-[24px] border border-slate-200/80 bg-[linear-gradient(180deg,rgba(248,250,252,0.85),rgba(255,255,255,0.96))] px-2.5 py-3">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={dayLoads} barCategoryGap={16}>
          <CartesianGrid stroke="rgba(148, 163, 184, 0.25)" vertical={false} />
          <XAxis dataKey="day" tickLine={false} axisLine={false} />
          <YAxis tickLine={false} axisLine={false} />
          <Tooltip
            cursor={{ fill: "rgba(148, 163, 184, 0.08)" }}
            contentStyle={{
              borderRadius: 18,
              border: "1px solid rgba(226, 232, 240, 0.9)",
              boxShadow: "0 10px 35px rgba(15, 23, 42, 0.1)",
            }}
          />
          <Bar
            dataKey="classHours"
            stackId="hours"
            fill="#111827"
            radius={[8, 8, 0, 0]}
            isAnimationActive={!prefersReducedMotion}
            animationDuration={260}
          />
          <Bar
            dataKey="studyHours"
            stackId="hours"
            fill="#6b7280"
            radius={[8, 8, 0, 0]}
            isAnimationActive={!prefersReducedMotion}
            animationDuration={260}
          />
          <Bar
            dataKey="commitmentHours"
            stackId="hours"
            fill="#cbd5e1"
            radius={[8, 8, 0, 0]}
            isAnimationActive={!prefersReducedMotion}
            animationDuration={260}
          />
        </BarChart>
      </ResponsiveContainer>
      </div>
    </div>
  );
}
