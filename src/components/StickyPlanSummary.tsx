import { PlanAnalysis, PlanId } from "@/lib/types";

interface StickyPlanSummaryProps {
  analyses: PlanAnalysis[];
  activePlanId: PlanId;
  recommendedPlanId: PlanId | null;
  onChange: (planId: PlanId) => void;
}

function SummaryContent({
  analyses,
  activePlanId,
  recommendedPlanId,
  onChange,
  compact = false,
}: StickyPlanSummaryProps & { compact?: boolean }) {
  const activePlan = analyses.find((analysis) => analysis.planId === activePlanId) ?? analyses[0];
  const recommendedPlan =
    analyses.find((analysis) => analysis.planId === recommendedPlanId) ?? analyses[0];

  if (!activePlan || !recommendedPlan) {
    return null;
  }

  return (
    <div
      className={[
        "rounded-[22px] border border-slate-200/80 bg-white/90 backdrop-blur shadow-[0_14px_34px_rgba(15,23,42,0.08)]",
        compact ? "p-3" : "px-3.5 py-2.5",
      ].join(" ")}
    >
      <div
        className={[
          "flex flex-wrap items-center gap-2",
          compact ? "justify-between" : "lg:flex-nowrap lg:gap-3",
        ].join(" ")}
      >
        <div className="flex min-w-0 flex-wrap items-center gap-1.5">
          <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-semibold text-slate-700">
            Active: <span className="text-slate-950">{activePlan.planName}</span>
          </span>
          <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-semibold text-slate-700">
            Status: <span className="capitalize text-slate-950">{activePlan.metrics.stressLabel}</span>
          </span>
          <span className="rounded-full border border-slate-900 bg-slate-900 px-2.5 py-1 text-[11px] font-semibold text-white">
            Score: {activePlan.metrics.stressScore}
          </span>
        </div>

        <div className="flex min-w-0 flex-wrap items-center gap-1.5">
          <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-semibold text-slate-700">
            Recommended: <span className="text-slate-950">{recommendedPlan.planName}</span>
          </span>
        </div>

        <div
          className={[
            "flex flex-wrap gap-1.5",
            compact ? "w-full sm:w-auto" : "lg:ml-auto lg:justify-end",
          ].join(" ")}
        >
          {analyses.map((analysis) => {
            const isActive = analysis.planId === activePlanId;
            const isRecommended = analysis.planId === recommendedPlanId;

            return (
              <button
                key={analysis.planId}
                type="button"
                onClick={() => onChange(analysis.planId)}
                className={[
                  "rounded-full border px-2.5 py-1 text-xs font-semibold transition motion-reduce:transition-none",
                  isActive
                    ? "border-slate-900 bg-slate-900 text-white"
                    : isRecommended
                      ? "border-slate-300 bg-slate-50 text-slate-900 hover:border-slate-400"
                    : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-slate-900",
                ].join(" ")}
              >
                {analysis.planName}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export function StickyPlanSummary(props: StickyPlanSummaryProps) {
  return (
    <>
      <div className="hidden lg:block lg:sticky lg:top-3 lg:z-30">
        <SummaryContent {...props} />
      </div>
      <div className="lg:hidden">
        <SummaryContent {...props} compact />
      </div>
    </>
  );
}
