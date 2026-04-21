import { PlanAnalysis } from "@/lib/types";
import { formatHours } from "@/lib/utils";

interface ComparisonTableProps {
  analyses: PlanAnalysis[];
  bestPlanSummary: string | null;
}

export function ComparisonTable({ analyses, bestPlanSummary }: ComparisonTableProps) {
  return (
    <div className="space-y-4">
      {bestPlanSummary ? (
        <div className="rounded-3xl border border-slate-900 bg-slate-900 p-5 text-white shadow-lg shadow-slate-300/35">
          <p className="text-xs uppercase tracking-[0.16em] text-white/65">Best Overall</p>
          <p className="mt-2 text-sm leading-6 text-white/90">{bestPlanSummary}</p>
        </div>
      ) : null}

      <div className="overflow-x-auto rounded-[28px] border border-slate-200 bg-white">
        <table className="min-w-full border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50">
              <th className="px-4 py-3 font-semibold text-slate-700">Metric</th>
              {analyses.map((analysis) => (
                <th key={analysis.planId} className="px-4 py-3 font-semibold text-slate-700">
                  {analysis.planName}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-slate-100">
              <td className="px-4 py-3 text-slate-500">Profile</td>
              {analyses.map((analysis) => (
                <td key={analysis.planId} className="px-4 py-3 text-slate-700">
                  {analysis.planProfileLabel ?? "Custom"}
                </td>
              ))}
            </tr>
            <tr className="border-b border-slate-100">
              <td className="px-4 py-3 text-slate-500">Stress Score</td>
              {analyses.map((analysis) => (
                <td key={analysis.planId} className="px-4 py-3 font-semibold text-slate-900">
                  {analysis.metrics.stressScore} ({analysis.metrics.stressLabel})
                </td>
              ))}
            </tr>
            <tr className="border-b border-slate-100">
              <td className="px-4 py-3 text-slate-500">Weekly class hours</td>
              {analyses.map((analysis) => (
                <td key={analysis.planId} className="px-4 py-3 text-slate-700">
                  {formatHours(analysis.metrics.weeklyClassHours)}
                </td>
              ))}
            </tr>
            <tr className="border-b border-slate-100">
              <td className="px-4 py-3 text-slate-500">Estimated weekly study</td>
              {analyses.map((analysis) => (
                <td key={analysis.planId} className="px-4 py-3 text-slate-700">
                  {formatHours(analysis.metrics.weeklyStudyHours)}
                </td>
              ))}
            </tr>
            <tr className="border-b border-slate-100">
              <td className="px-4 py-3 text-slate-500">Conflicts</td>
              {analyses.map((analysis) => (
                <td key={analysis.planId} className="px-4 py-3 text-slate-700">
                  {analysis.metrics.classConflictCount + analysis.metrics.commitmentConflictCount}
                </td>
              ))}
            </tr>
            <tr className="border-b border-slate-100">
              <td className="px-4 py-3 text-slate-500">Busiest day</td>
              {analyses.map((analysis) => (
                <td key={analysis.planId} className="px-4 py-3 text-slate-700">
                  {analysis.metrics.busiestDay}
                </td>
              ))}
            </tr>
            <tr>
              <td className="px-4 py-3 text-slate-500">Exam clustering risk</td>
              {analyses.map((analysis) => (
                <td key={analysis.planId} className="px-4 py-3 text-slate-700">
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
