import { PlanAnalysis, PlanId } from "@/lib/types";

interface StickyPlanSummaryProps {
  analyses: PlanAnalysis[];
  activePlanId: PlanId;
  recommendedPlanId: PlanId | null;
  recommendedTitle?: string | null;
  recommendedDescription?: string | null;
  onChange: (planId: PlanId) => void;
}

function SummaryContent({
  analyses,
  activePlanId,
  recommendedPlanId,
  recommendedTitle,
  recommendedDescription,
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
        "rounded-[24px] border border-slate-200/80 bg-white/90 backdrop-blur shadow-[0_14px_34px_rgba(15,23,42,0.08)]",
        compact ? "p-4" : "p-4 lg:px-5 lg:py-4",
      ].join(" ")}
    >
      <div className={["grid gap-4", compact ? "" : "lg:grid-cols-[1fr_auto_auto] lg:items-center"].join(" ")}>
        <div className="flex flex-wrap items-center gap-3">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
              Active plan
            </p>
            <div className="mt-1 flex flex-wrap items-center gap-2">
              <p className="text-base font-semibold text-slate-950">{activePlan.planName}</p>
              <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-semibold capitalize text-slate-600">
                {activePlan.metrics.stressLabel}
              </span>
              <span className="rounded-full border border-slate-900 bg-slate-900 px-2.5 py-1 text-xs font-semibold text-white">
                {activePlan.metrics.stressScore}
              </span>
            </div>
          </div>

          <div className="hidden h-10 w-px bg-slate-200 lg:block" />

          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
              Recommended
            </p>
            <p className="mt-1 text-sm font-semibold text-slate-950">
              {recommendedTitle ?? `Recommended: ${recommendedPlan.planName}`}
            </p>
            <p className="mt-1 max-w-xl truncate text-sm text-slate-600">
              {recommendedDescription ?? `${recommendedPlan.planName} has the lowest overall pressure.`}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {analyses.map((analysis) => {
            const isActive = analysis.planId === activePlanId;
            const isRecommended = analysis.planId === recommendedPlanId;

            return (
              <button
                key={analysis.planId}
                type="button"
                onClick={() => onChange(analysis.planId)}
                className={[
                  "rounded-full border px-3 py-1.5 text-sm font-medium transition",
                  isActive
                    ? "border-slate-900 bg-slate-900 text-white"
                    : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-slate-900",
                ].join(" ")}
              >
                {analysis.planName}
                {isRecommended ? " *" : ""}
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
      <div className="hidden lg:block lg:sticky lg:top-4 lg:z-30">
        <SummaryContent {...props} />
      </div>
      <div className="lg:hidden">
        <SummaryContent {...props} compact />
      </div>
    </>
  );
}
