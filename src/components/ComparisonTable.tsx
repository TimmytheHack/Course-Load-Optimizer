import { PlanAnalysis } from "@/lib/types";
import { formatHours } from "@/lib/utils";

interface ComparisonTableProps {
  analyses: PlanAnalysis[];
  bestPlanSummary: string | null;
}

export function ComparisonTable({ analyses, bestPlanSummary }: ComparisonTableProps) {
  return (
    <div className="space-y-5">
      {bestPlanSummary ? (
        <div className="rounded-[28px] border border-slate-900 bg-[linear-gradient(150deg,#0f172a,#1f2937)] p-5 text-white shadow-[0_24px_50px_rgba(15,23,42,0.16)]">
          <p className="text-[11px] uppercase tracking-[0.18em] text-white/60">Best Overall</p>
          <p className="mt-3 text-base leading-7 text-white/92">{bestPlanSummary}</p>
        </div>
      ) : null}

      <div className="overflow-x-auto rounded-[28px] border border-slate-200/80 bg-white shadow-[0_14px_36px_rgba(15,23,42,0.05)]">
        <table className="min-w-full border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/90">
              <th className="sticky left-0 bg-slate-50/95 px-5 py-4 font-semibold text-slate-700">Metric</th>
              {analyses.map((analysis) => (
                <th key={analysis.planId} className="min-w-44 px-5 py-4 font-semibold text-slate-700">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{analysis.planName}</p>
                    <p className="mt-1 text-xs font-medium uppercase tracking-[0.16em] text-slate-400">
                      {analysis.planProfileLabel ?? "Custom"}
                    </p>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-slate-100">
              <td className="sticky left-0 bg-white px-5 py-4 text-slate-500">Profile</td>
              {analyses.map((analysis) => (
                <td key={analysis.planId} className="px-5 py-4 text-slate-700">
                  {analysis.planProfileLabel ?? "Custom"}
                </td>
              ))}
            </tr>
            <tr className="border-b border-slate-100">
              <td className="sticky left-0 bg-white px-5 py-4 text-slate-500">Stress Score</td>
              {analyses.map((analysis) => (
                <td key={analysis.planId} className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-semibold text-slate-900">
                      {analysis.metrics.stressScore}
                    </span>
                    <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-semibold capitalize text-slate-600">
                      {analysis.metrics.stressLabel}
                    </span>
                  </div>
                </td>
              ))}
            </tr>
            <tr className="border-b border-slate-100">
              <td className="sticky left-0 bg-white px-5 py-4 text-slate-500">Weekly class hours</td>
              {analyses.map((analysis) => (
                <td key={analysis.planId} className="px-5 py-4 text-slate-700">
                  {formatHours(analysis.metrics.weeklyClassHours)}
                </td>
              ))}
            </tr>
            <tr className="border-b border-slate-100">
              <td className="sticky left-0 bg-white px-5 py-4 text-slate-500">Estimated weekly study</td>
              {analyses.map((analysis) => (
                <td key={analysis.planId} className="px-5 py-4 text-slate-700">
                  {formatHours(analysis.metrics.weeklyStudyHours)}
                </td>
              ))}
            </tr>
            <tr className="border-b border-slate-100">
              <td className="sticky left-0 bg-white px-5 py-4 text-slate-500">Conflicts</td>
              {analyses.map((analysis) => (
                <td key={analysis.planId} className="px-5 py-4 text-slate-700">
                  {analysis.metrics.classConflictCount + analysis.metrics.commitmentConflictCount}
                </td>
              ))}
            </tr>
            <tr className="border-b border-slate-100">
              <td className="sticky left-0 bg-white px-5 py-4 text-slate-500">Busiest day</td>
              {analyses.map((analysis) => (
                <td key={analysis.planId} className="px-5 py-4 text-slate-700">
                  {analysis.metrics.busiestDay}
                </td>
              ))}
            </tr>
            <tr>
              <td className="sticky left-0 bg-white px-5 py-4 text-slate-500">Exam clustering risk</td>
              {analyses.map((analysis) => (
                <td key={analysis.planId} className="px-5 py-4 text-slate-700">
                  {analysis.metrics.examClusterPairs > 0
                    ? `${analysis.metrics.examClusterPairs} clustered pair${analysis.metrics.examClusterPairs > 1 ? "s" : ""}`
                    : "Low"}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
