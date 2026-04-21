import { PlanAnalysis } from "@/lib/types";
import { formatHours } from "@/lib/utils";

interface ComparisonTableProps {
  analyses: PlanAnalysis[];
  recommendedPlanId: PlanAnalysis["planId"] | null;
}

export function ComparisonTable({
  analyses,
  recommendedPlanId,
}: ComparisonTableProps) {
  const bestStressScore = Math.min(...analyses.map((analysis) => analysis.metrics.stressScore));
  const worstStressScore = Math.max(...analyses.map((analysis) => analysis.metrics.stressScore));
  const bestClassConflicts = Math.min(
    ...analyses.map((analysis) => analysis.metrics.classConflictCount),
  );
  const worstClassConflicts = Math.max(
    ...analyses.map((analysis) => analysis.metrics.classConflictCount),
  );
  const bestCommitmentOverlaps = Math.min(
    ...analyses.map((analysis) => analysis.metrics.commitmentConflictCount),
  );
  const worstCommitmentOverlaps = Math.max(
    ...analyses.map((analysis) => analysis.metrics.commitmentConflictCount),
  );
  const bestStudyHours = Math.min(...analyses.map((analysis) => analysis.metrics.weeklyStudyHours));
  const worstStudyHours = Math.max(...analyses.map((analysis) => analysis.metrics.weeklyStudyHours));
  const bestHeavyDays = Math.min(...analyses.map((analysis) => analysis.metrics.heavyDayCount));
  const worstHeavyDays = Math.max(...analyses.map((analysis) => analysis.metrics.heavyDayCount));
  const bestExamClusters = Math.min(
    ...analyses.map((analysis) => analysis.metrics.examClusterPairs),
  );
  const worstExamClusters = Math.max(
    ...analyses.map((analysis) => analysis.metrics.examClusterPairs),
  );
  const bestBusiestDayHours = Math.min(
    ...analyses.map((analysis) => analysis.metrics.busiestDayHours),
  );
  const worstBusiestDayHours = Math.max(
    ...analyses.map((analysis) => analysis.metrics.busiestDayHours),
  );
  const bestClassHours = Math.min(...analyses.map((analysis) => analysis.metrics.weeklyClassHours));
  const worstClassHours = Math.max(...analyses.map((analysis) => analysis.metrics.weeklyClassHours));

  function getColumnClasses(planId: PlanAnalysis["planId"], area: "header" | "cell") {
    if (planId !== recommendedPlanId) {
      return area === "header" ? "" : "";
    }

    return area === "header"
      ? "bg-slate-100/95"
      : "bg-slate-50/70";
  }

  function renderValueBadge({
    isBest,
    isWorst,
  }: {
    isBest: boolean;
    isWorst: boolean;
  }) {
    if (isBest && !isWorst) {
      return (
        <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-emerald-800">
          Best
        </span>
      );
    }

    if (isWorst && !isBest) {
      return (
        <span className="rounded-full border border-rose-200 bg-rose-50 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-rose-700">
          Highest
        </span>
      );
    }

    return null;
  }

  return (
    <div className="space-y-5">
      <div className="overflow-x-auto rounded-[28px] border border-slate-200/80 bg-white shadow-[0_14px_36px_rgba(15,23,42,0.05)]">
        <table className="min-w-full border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/90">
              <th className="sticky left-0 bg-slate-50/95 px-5 py-4 font-semibold text-slate-700">Metric</th>
              {analyses.map((analysis) => (
                <th
                  key={analysis.planId}
                  className={[
                    "min-w-44 px-5 py-4 font-semibold text-slate-700",
                    getColumnClasses(analysis.planId, "header"),
                  ].join(" ")}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-slate-900">{analysis.planName}</p>
                      {recommendedPlanId === analysis.planId ? (
                        <span className="rounded-full border border-slate-900 bg-slate-900 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-white">
                          Recommended
                        </span>
                      ) : null}
                    </div>
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
              <td className="sticky left-0 bg-white px-5 py-4 text-slate-500">Stress score</td>
              {analyses.map((analysis) => (
                <td
                  key={analysis.planId}
                  className={["px-5 py-4", getColumnClasses(analysis.planId, "cell")].join(" ")}
                >
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="text-xl font-semibold text-slate-900">
                      {analysis.metrics.stressScore}
                    </span>
                    <span
                      className={[
                        "rounded-full border px-2.5 py-1 text-xs font-semibold capitalize",
                        analysis.metrics.stressScore >= 81
                          ? "border-rose-200 bg-rose-50 text-rose-700"
                          : analysis.metrics.stressScore >= 61
                            ? "border-amber-200 bg-amber-50 text-amber-700"
                            : "border-slate-200 bg-slate-50 text-slate-600",
                      ].join(" ")}
                    >
                      {analysis.metrics.stressLabel}
                    </span>
                    {renderValueBadge({
                      isBest: analysis.metrics.stressScore === bestStressScore,
                      isWorst: analysis.metrics.stressScore === worstStressScore,
                    })}
                  </div>
                </td>
              ))}
            </tr>
            <tr className="border-b border-slate-100">
              <td className="sticky left-0 bg-white px-5 py-4 text-slate-500">Class conflicts</td>
              {analyses.map((analysis) => (
                <td
                  key={analysis.planId}
                  className={["px-5 py-4 text-slate-700", getColumnClasses(analysis.planId, "cell")].join(" ")}
                >
                  <div className="flex flex-wrap items-center gap-3">
                    <span className={analysis.metrics.classConflictCount > 0 ? "font-semibold text-rose-700" : "font-semibold text-slate-900"}>
                      {analysis.metrics.classConflictCount}
                    </span>
                    {renderValueBadge({
                      isBest: analysis.metrics.classConflictCount === bestClassConflicts,
                      isWorst: analysis.metrics.classConflictCount === worstClassConflicts,
                    })}
                  </div>
                </td>
              ))}
            </tr>
            <tr className="border-b border-slate-100">
              <td className="sticky left-0 bg-white px-5 py-4 text-slate-500">Commitment overlaps</td>
              {analyses.map((analysis) => (
                <td
                  key={analysis.planId}
                  className={["px-5 py-4 text-slate-700", getColumnClasses(analysis.planId, "cell")].join(" ")}
                >
                  <div className="flex flex-wrap items-center gap-3">
                    <span className={analysis.metrics.commitmentConflictCount > 0 ? "font-semibold text-amber-700" : "font-semibold text-slate-900"}>
                      {analysis.metrics.commitmentConflictCount}
                    </span>
                    {renderValueBadge({
                      isBest: analysis.metrics.commitmentConflictCount === bestCommitmentOverlaps,
                      isWorst: analysis.metrics.commitmentConflictCount === worstCommitmentOverlaps,
                    })}
                  </div>
                </td>
              ))}
            </tr>
            <tr className="border-b border-slate-100">
              <td className="sticky left-0 bg-white px-5 py-4 text-slate-500">Weekly study hours</td>
              {analyses.map((analysis) => (
                <td
                  key={analysis.planId}
                  className={["px-5 py-4 text-slate-700", getColumnClasses(analysis.planId, "cell")].join(" ")}
                >
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="font-semibold text-slate-900">
                      {formatHours(analysis.metrics.weeklyStudyHours)}
                    </span>
                    {renderValueBadge({
                      isBest: analysis.metrics.weeklyStudyHours === bestStudyHours,
                      isWorst: analysis.metrics.weeklyStudyHours === worstStudyHours,
                    })}
                  </div>
                </td>
              ))}
            </tr>
            <tr className="border-b border-slate-100">
              <td className="sticky left-0 bg-white px-5 py-4 text-slate-500">Heavy days</td>
              {analyses.map((analysis) => (
                <td
                  key={analysis.planId}
                  className={["px-5 py-4 text-slate-700", getColumnClasses(analysis.planId, "cell")].join(" ")}
                >
                  <div className="flex flex-wrap items-center gap-3">
                    <span className={analysis.metrics.heavyDayCount >= 3 ? "font-semibold text-amber-700" : "font-semibold text-slate-900"}>
                      {analysis.metrics.heavyDayCount}
                    </span>
                    {renderValueBadge({
                      isBest: analysis.metrics.heavyDayCount === bestHeavyDays,
                      isWorst: analysis.metrics.heavyDayCount === worstHeavyDays,
                    })}
                  </div>
                </td>
              ))}
            </tr>
            <tr className="border-b border-slate-100">
              <td className="sticky left-0 bg-white px-5 py-4 text-slate-500">Exam clustering risk</td>
              {analyses.map((analysis) => (
                <td
                  key={analysis.planId}
                  className={["px-5 py-4 text-slate-700", getColumnClasses(analysis.planId, "cell")].join(" ")}
                >
                  <div className="flex flex-wrap items-center gap-3">
                    <span className={analysis.metrics.examClusterPairs > 0 ? "font-semibold text-amber-700" : "font-semibold text-slate-900"}>
                      {analysis.metrics.examClusterPairs > 0
                        ? `${analysis.metrics.examClusterPairs} pair${analysis.metrics.examClusterPairs > 1 ? "s" : ""}`
                        : "Low"}
                    </span>
                    {renderValueBadge({
                      isBest: analysis.metrics.examClusterPairs === bestExamClusters,
                      isWorst: analysis.metrics.examClusterPairs === worstExamClusters,
                    })}
                  </div>
                </td>
              ))}
            </tr>
            <tr className="border-b border-slate-100">
              <td className="sticky left-0 bg-white px-5 py-4 text-slate-500">Busiest day</td>
              {analyses.map((analysis) => (
                <td
                  key={analysis.planId}
                  className={["px-5 py-4 text-slate-700", getColumnClasses(analysis.planId, "cell")].join(" ")}
                >
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="font-semibold text-slate-900">
                      {analysis.metrics.busiestDay} · {formatHours(analysis.metrics.busiestDayHours)}
                    </span>
                    {renderValueBadge({
                      isBest: analysis.metrics.busiestDayHours === bestBusiestDayHours,
                      isWorst: analysis.metrics.busiestDayHours === worstBusiestDayHours,
                    })}
                  </div>
                </td>
              ))}
            </tr>
            <tr>
              <td className="sticky left-0 bg-white px-5 py-4 text-slate-500">Weekly class hours</td>
              {analyses.map((analysis) => (
                <td
                  key={analysis.planId}
                  className={["px-5 py-4 text-slate-700", getColumnClasses(analysis.planId, "cell")].join(" ")}
                >
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="font-semibold text-slate-900">
                      {formatHours(analysis.metrics.weeklyClassHours)}
                    </span>
                    {renderValueBadge({
                      isBest: analysis.metrics.weeklyClassHours === bestClassHours,
                      isWorst: analysis.metrics.weeklyClassHours === worstClassHours,
                    })}
                  </div>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
