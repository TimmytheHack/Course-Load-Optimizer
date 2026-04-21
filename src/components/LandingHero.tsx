interface LandingHeroProps {
  onTrySample: () => void;
  onBuildOwn: () => void;
  onJumpToComparison?: () => void;
  isSampleLoaded?: boolean;
  bestPlanName?: string | null;
  bestPlanSummary?: string | null;
  demoPlans?: Array<{
    name: string;
    profileLabel?: string;
    stressScore: number;
    stressLabel: string;
  }>;
}

export function LandingHero({
  onTrySample,
  onBuildOwn,
  onJumpToComparison,
  isSampleLoaded = false,
  bestPlanName = null,
  bestPlanSummary = null,
  demoPlans = [],
}: LandingHeroProps) {
  const planPreview =
    demoPlans.length > 0
      ? demoPlans
      : [
          { name: "Plan A", profileLabel: "Option 1", stressScore: 0, stressLabel: "ready" },
          { name: "Plan B", profileLabel: "Option 2", stressScore: 0, stressLabel: "ready" },
          { name: "Plan C", profileLabel: "Option 3", stressScore: 0, stressLabel: "ready" },
        ];

  return (
    <section className="relative overflow-hidden rounded-[36px] border border-white/70 bg-[linear-gradient(140deg,rgba(255,255,255,0.96),rgba(244,243,238,0.92))] px-6 py-8 shadow-[0_28px_90px_rgba(15,23,42,0.08)] sm:px-10 sm:py-10 lg:px-12 lg:py-12">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.9),transparent_28%),radial-gradient(circle_at_85%_15%,rgba(148,163,184,0.16),transparent_25%)]" />
      <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-1/2 bg-[radial-gradient(circle_at_top,rgba(148,163,184,0.12),transparent_60%)] lg:block" />
      <div className="relative space-y-5">
        <div className="grid gap-3 sm:grid-cols-3">
          {planPreview.map((plan) => {
            const isRecommended = bestPlanName === plan.name;

            return (
              <article
                key={plan.name}
                className="rounded-[24px] border border-slate-200/80 bg-white/84 p-4 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{plan.name}</p>
                    <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                      {plan.profileLabel ?? "Custom"}
                    </p>
                  </div>
                  {isRecommended ? (
                    <span className="rounded-full border border-slate-900 bg-slate-900 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-white">
                      Recommended
                    </span>
                  ) : null}
                </div>
                <div className="mt-4 flex items-end justify-between gap-3">
                  <div>
                    <p className="text-2xl font-semibold text-slate-950">
                      {plan.stressScore > 0 ? plan.stressScore : "—"}
                    </p>
                    <p className="mt-1 text-xs capitalize text-slate-500">
                      {plan.stressLabel}
                    </p>
                  </div>
                  <div className="h-2 w-16 rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-slate-900"
                      style={{ width: `${Math.max(plan.stressScore, 12)}%` }}
                    />
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        <div className="rounded-[28px] border border-slate-900 bg-[linear-gradient(150deg,#0f172a,#1f2937)] p-5 text-white shadow-[0_24px_50px_rgba(15,23,42,0.16)]">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/60">
            Recommended plan
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <h2 className="text-2xl font-semibold text-white">
              {bestPlanName ?? "Plan B"}
            </h2>
            {bestPlanName ? (
              <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-sm font-semibold text-white">
                Lowest pressure
              </span>
            ) : null}
          </div>
          <p className="mt-3 text-sm leading-6 text-white/85">
            {bestPlanSummary ??
              "Keeps workload, conflicts, commitments, and deadlines in a healthier range."}
          </p>
        </div>

        <div className="max-w-2xl">
          <p className="inline-flex rounded-full border border-slate-200/80 bg-white/85 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500 shadow-sm">
            {isSampleLoaded ? "Sample semester" : "Semester planner"}
          </p>
          <h1 className="mt-4 max-w-2xl font-serif text-4xl leading-tight text-slate-950 sm:text-5xl lg:text-[3.6rem] lg:leading-[1.02]">
            Course Load Optimizer
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-700">
            Compare three semester options and keep the one that stays sustainable, not just schedulable.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <button type="button" onClick={onTrySample} className="button-primary">
              {isSampleLoaded ? "Reload sample semester" : "Try sample semester"}
            </button>
            <button type="button" onClick={onBuildOwn} className="button-secondary">
              Build your own plan
            </button>
            {onJumpToComparison ? (
              <button type="button" onClick={onJumpToComparison} className="button-tertiary">
                Compare plans
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
