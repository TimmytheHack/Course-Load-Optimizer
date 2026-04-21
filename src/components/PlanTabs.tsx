import { PlanAnalysis, PlanId } from "@/lib/types";

interface PlanTabsProps {
  analyses: PlanAnalysis[];
  activePlanId: PlanId;
  onChange: (planId: PlanId) => void;
}

export function PlanTabs({ analyses, activePlanId, onChange }: PlanTabsProps) {
  return (
    <div className="grid gap-3 lg:grid-cols-3">
      {analyses.map((analysis) => {
        const isActive = analysis.planId === activePlanId;

        return (
          <button
            key={analysis.planId}
            type="button"
            onClick={() => onChange(analysis.planId)}
            className={[
              "relative min-h-[188px] rounded-[26px] border px-5 py-4 text-left transition",
              isActive
                ? "border-slate-900 bg-[linear-gradient(155deg,#0f172a,#1f2937)] text-white shadow-[0_24px_50px_rgba(15,23,42,0.18)]"
                : "border-slate-200/80 bg-white text-slate-800 shadow-sm hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-lg",
            ].join(" ")}
          >
            <div className={["absolute inset-x-5 top-0 h-px", isActive ? "bg-white/20" : "bg-slate-200"].join(" ")} />
            <div className="flex items-center justify-between gap-3">
              <span className="text-base font-semibold">{analysis.planName}</span>
              <div className="flex flex-wrap justify-end gap-2">
                {analysis.courses.length > 0 && analysis.courses.length <= 4 ? (
                  <span
                    className={[
                      "rounded-full px-2.5 py-1 text-xs font-semibold",
                      isActive ? "bg-white/15 text-white" : "bg-slate-100 text-slate-600",
                    ].join(" ")}
                  >
                    Leaner load
                  </span>
                ) : null}
                <span
                  className={[
                    "rounded-full px-2.5 py-1 text-xs font-semibold capitalize",
                    isActive ? "bg-white/15 text-white" : "bg-slate-100 text-slate-600",
                  ].join(" ")}
                >
                  {analysis.metrics.stressLabel}
                </span>
              </div>
            </div>
            {analysis.planDescription ? (
              <p className={["mt-4 text-sm leading-6", isActive ? "text-white/75" : "text-slate-600"].join(" ")}>
                {analysis.planDescription}
              </p>
            ) : null}
            <div className="mt-5 grid grid-cols-2 gap-3">
              <div className={["rounded-2xl border px-3 py-3", isActive ? "border-white/10 bg-white/6" : "border-slate-200 bg-slate-50"].join(" ")}>
                <p className={["text-[11px] font-semibold uppercase tracking-[0.16em]", isActive ? "text-white/55" : "text-slate-400"].join(" ")}>
                  Stress Score
                </p>
                <p className="mt-2 text-2xl font-semibold">{analysis.metrics.stressScore}</p>
              </div>
              <div className={["rounded-2xl border px-3 py-3", isActive ? "border-white/10 bg-white/6" : "border-slate-200 bg-slate-50"].join(" ")}>
                <p className={["text-[11px] font-semibold uppercase tracking-[0.16em]", isActive ? "text-white/55" : "text-slate-400"].join(" ")}>
                  Warnings
                </p>
                <p className="mt-2 text-2xl font-semibold">{analysis.warnings.length}</p>
              </div>
            </div>
            <div className="mt-4 flex items-end justify-between gap-3">
              <div>
                <p className={["text-sm", isActive ? "text-white/70" : "text-slate-500"].join(" ")}>
                  {analysis.courses.length} courses
                </p>
              </div>
              <div className={["text-right text-sm", isActive ? "text-white/80" : "text-slate-500"].join(" ")}>
                <p>{analysis.metrics.busiestDay} busiest</p>
                <p>{analysis.metrics.heavyDayCount} heavy days</p>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
