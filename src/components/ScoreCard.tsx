import { PlanAnalysis } from "@/lib/types";
import { formatHours } from "@/lib/utils";

interface ScoreCardProps {
  analysis: PlanAnalysis;
  highlighted?: boolean;
  recommended?: boolean;
}

export function ScoreCard({ analysis, highlighted = false, recommended = false }: ScoreCardProps) {
  const { metrics } = analysis;
  const quickRead = recommended
    ? "Best tradeoff in this comparison."
    : analysis.warnings[0]
      ? `Main issue: ${analysis.warnings[0].title.toLowerCase()}.`
      : "Open this plan to review the tradeoffs.";

  return (
    <article
      className={[
        "relative overflow-hidden rounded-[30px] border p-5 transition-all duration-200 ease-out motion-reduce:transition-none",
        highlighted
          ? "border-slate-900 bg-[linear-gradient(155deg,#0f172a,#1f2937)] text-white shadow-[0_26px_56px_rgba(15,23,42,0.18)] motion-safe:-translate-y-0.5"
          : "border-slate-200/80 bg-white/95 text-slate-900 shadow-[0_12px_32px_rgba(15,23,42,0.06)]",
      ].join(" ")}
    >
      <div className={["absolute inset-x-5 top-0 h-px", highlighted ? "bg-white/20" : "bg-slate-200"].join(" ")} />
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <p className={highlighted ? "text-white/65" : "text-slate-500"}>{analysis.planName}</p>
            {recommended ? (
              <span
                className={[
                  "rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.16em]",
                  highlighted ? "bg-white/15 text-white" : "border border-slate-200 bg-slate-100 text-slate-700",
                ].join(" ")}
              >
                Recommended
              </span>
            ) : null}
            {highlighted ? (
              <span
                className={[
                  "rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.16em]",
                  "bg-white/15 text-white",
                ].join(" ")}
              >
                Selected
              </span>
            ) : null}
          </div>
          {analysis.planProfileLabel ? (
            <p className={["mt-1 text-sm font-medium", highlighted ? "text-white/80" : "text-slate-600"].join(" ")}>
              {analysis.planProfileLabel}
            </p>
          ) : null}
          <div className="mt-4 flex items-end gap-3">
            <p className="text-5xl font-semibold tracking-tight">{metrics.stressScore}</p>
            <p className={["pb-1 text-sm capitalize", highlighted ? "text-white/75" : "text-slate-600"].join(" ")}>
              {metrics.stressLabel}
            </p>
          </div>
          <div className={["mt-4 h-2 rounded-full", highlighted ? "bg-white/10" : "bg-slate-100"].join(" ")}>
            <div
              className={["h-full rounded-full", highlighted ? "bg-white" : "bg-slate-900"].join(" ")}
              style={{ width: `${metrics.stressScore}%` }}
            />
          </div>
          <p className={["mt-2 text-xs uppercase tracking-[0.18em]", highlighted ? "text-white/55" : "text-slate-400"].join(" ")}>
            Overall schedule pressure
          </p>
        </div>
        <div className={["min-w-28 rounded-[22px] border px-3 py-3 text-right", highlighted ? "border-white/10 bg-white/6" : "border-slate-200 bg-slate-50"].join(" ")}>
          <p className="text-[11px] uppercase tracking-[0.16em] text-current/60">Warnings</p>
          <p className="mt-2 text-3xl font-semibold">{analysis.warnings.length}</p>
          <p className="mt-1 text-xs text-current/60">active flags</p>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
        <div className={["rounded-[22px] border p-4", highlighted ? "border-white/10 bg-white/6" : "border-slate-200 bg-slate-50"].join(" ")}>
          <p className={highlighted ? "text-white/60" : "text-slate-500"}>Weekly class</p>
          <p className="mt-2 text-lg font-semibold">{formatHours(metrics.weeklyClassHours)}</p>
        </div>
        <div className={["rounded-[22px] border p-4", highlighted ? "border-white/10 bg-white/6" : "border-slate-200 bg-slate-50"].join(" ")}>
          <p className={highlighted ? "text-white/60" : "text-slate-500"}>Weekly study</p>
          <p className="mt-2 text-lg font-semibold">{formatHours(metrics.weeklyStudyHours)}</p>
        </div>
        <div className={["rounded-[22px] border p-4", highlighted ? "border-white/10 bg-white/6" : "border-slate-200 bg-slate-50"].join(" ")}>
          <p className={highlighted ? "text-white/60" : "text-slate-500"}>Busiest day</p>
          <p className="mt-2 text-lg font-semibold">{metrics.busiestDay}</p>
        </div>
        <div className={["rounded-[22px] border p-4", highlighted ? "border-white/10 bg-white/6" : "border-slate-200 bg-slate-50"].join(" ")}>
          <p className={highlighted ? "text-white/60" : "text-slate-500"}>Heavy days</p>
          <p className="mt-2 text-lg font-semibold">{metrics.heavyDayCount}</p>
        </div>
      </div>
      <p className={["mt-4 text-sm leading-6", highlighted ? "text-white/75" : "text-slate-600"].join(" ")}>
        {quickRead}
      </p>
    </article>
  );
}
