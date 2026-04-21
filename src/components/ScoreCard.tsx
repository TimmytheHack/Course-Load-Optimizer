import { PlanAnalysis } from "@/lib/types";
import { formatHours } from "@/lib/utils";

interface ScoreCardProps {
  analysis: PlanAnalysis;
  highlighted?: boolean;
}

export function ScoreCard({ analysis, highlighted = false }: ScoreCardProps) {
  const { metrics } = analysis;

  return (
    <article
      className={[
        "rounded-[28px] border p-5 shadow-sm transition",
        highlighted
          ? "border-slate-900 bg-slate-900 text-white shadow-xl shadow-slate-300/40"
          : "border-slate-200 bg-white text-slate-900",
      ].join(" ")}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className={highlighted ? "text-white/70" : "text-slate-500"}>{analysis.planName}</p>
          {analysis.planProfileLabel ? (
            <p className={["mt-1 text-sm", highlighted ? "text-white/80" : "text-slate-600"].join(" ")}>
              {analysis.planProfileLabel}
            </p>
          ) : null}
          <p className="mt-3 text-4xl font-semibold">{metrics.stressScore}</p>
          <p className={["mt-1 text-sm capitalize", highlighted ? "text-white/75" : "text-slate-600"].join(" ")}>
            {metrics.stressLabel}
          </p>
        </div>
        <div className="min-w-28 rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-right">
          <p className="text-xs uppercase tracking-[0.16em] text-current/60">Warnings</p>
          <p className="mt-1 text-2xl font-semibold">{analysis.warnings.length}</p>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
          <p className={highlighted ? "text-white/65" : "text-slate-500"}>Weekly class</p>
          <p className="mt-1 font-semibold">{formatHours(metrics.weeklyClassHours)}</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
          <p className={highlighted ? "text-white/65" : "text-slate-500"}>Weekly study</p>
          <p className="mt-1 font-semibold">{formatHours(metrics.weeklyStudyHours)}</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
          <p className={highlighted ? "text-white/65" : "text-slate-500"}>Busiest day</p>
          <p className="mt-1 font-semibold">{metrics.busiestDay}</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
          <p className={highlighted ? "text-white/65" : "text-slate-500"}>Heavy days</p>
          <p className="mt-1 font-semibold">{metrics.heavyDayCount}</p>
        </div>
      </div>
    </article>
  );
}
