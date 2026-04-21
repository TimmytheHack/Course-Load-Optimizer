import { PlanAnalysis, PlanId } from "@/lib/types";

interface PlanTabsProps {
  analyses: PlanAnalysis[];
  activePlanId: PlanId;
  onChange: (planId: PlanId) => void;
}

export function PlanTabs({ analyses, activePlanId, onChange }: PlanTabsProps) {
  return (
    <div className="flex flex-wrap gap-3">
      {analyses.map((analysis) => {
        const isActive = analysis.planId === activePlanId;

        return (
          <button
            key={analysis.planId}
            type="button"
            onClick={() => onChange(analysis.planId)}
            className={[
              "min-w-40 rounded-2xl border px-4 py-3 text-left transition",
              isActive
                ? "border-slate-900 bg-slate-900 text-white shadow-lg shadow-slate-300/40"
                : "border-slate-200 bg-white text-slate-800 hover:border-slate-300 hover:shadow-sm",
            ].join(" ")}
          >
            <div className="flex items-center justify-between gap-3">
              <span className="font-semibold">{analysis.planName}</span>
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
              <p className={["mt-3 text-sm leading-5", isActive ? "text-white/75" : "text-slate-600"].join(" ")}>
                {analysis.planDescription}
              </p>
            ) : null}
            <div className="mt-3 flex items-end justify-between gap-3">
              <div>
                <p className="text-2xl font-semibold">{analysis.metrics.stressScore}</p>
                <p className={isActive ? "text-white/70" : "text-slate-500"}>Stress Score</p>
              </div>
              <div className={["text-right text-sm", isActive ? "text-white/80" : "text-slate-500"].join(" ")}>
                <p>{analysis.courses.length} courses</p>
                <p>{analysis.warnings.length} warnings</p>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
