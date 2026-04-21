"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { DayLoad } from "@/lib/types";

interface WeekdayWorkloadChartProps {
  dayLoads: DayLoad[];
}

export function WeekdayWorkloadChart({ dayLoads }: WeekdayWorkloadChartProps) {
  return (
    <div className="h-80 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={dayLoads} barCategoryGap={18}>
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
          <Bar dataKey="classHours" stackId="hours" fill="#111827" radius={[8, 8, 0, 0]} />
          <Bar dataKey="studyHours" stackId="hours" fill="#6b7280" radius={[8, 8, 0, 0]} />
          <Bar dataKey="commitmentHours" stackId="hours" fill="#cbd5e1" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
