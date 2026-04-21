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
  return (
    <section className="relative overflow-hidden rounded-[36px] border border-white/70 bg-[linear-gradient(140deg,rgba(255,255,255,0.96),rgba(244,243,238,0.92))] px-6 py-8 shadow-[0_28px_90px_rgba(15,23,42,0.08)] sm:px-10 sm:py-10 lg:px-12 lg:py-12">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.9),transparent_28%),radial-gradient(circle_at_85%_15%,rgba(148,163,184,0.16),transparent_25%)]" />
      <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-1/2 bg-[radial-gradient(circle_at_top,rgba(148,163,184,0.12),transparent_60%)] lg:block" />
      <div className="relative grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:gap-10">
        <div className="max-w-2xl">
          <p className="inline-flex rounded-full border border-slate-200/80 bg-white/85 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500 shadow-sm">
            {isSampleLoaded ? "Submission Demo Ready" : "Frontend MVP"}
          </p>
          <h1 className="mt-6 max-w-2xl font-serif text-4xl leading-tight text-slate-950 sm:text-5xl lg:text-[3.6rem] lg:leading-[1.02]">
            Course Load Optimizer
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-700">
            Compare semester plans, spot overload risk, and choose the schedule that is actually realistic.
          </p>
          <p className="mt-4 max-w-xl text-sm leading-7 text-slate-600">
            {isSampleLoaded
              ? "The app opens on a preloaded semester so a reviewer can immediately see three different outcomes: overloaded, balanced, and deadline-clustered."
              : "This is a decision tool, not just a timetable viewer. Load the sample semester or start from scratch and compare Plan A, Plan B, and Plan C side by side."}
          </p>
          {isSampleLoaded && bestPlanSummary ? (
            <div className="mt-6 rounded-[26px] border border-slate-200/80 bg-white/82 p-4 shadow-sm">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                What a reviewer should see first
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-700">{bestPlanSummary}</p>
            </div>
          ) : null}
          <div className="mt-8 flex flex-wrap gap-3">
            <button type="button" onClick={onTrySample} className="button-primary">
              {isSampleLoaded ? "Reset Demo Semester" : "Try Sample Semester"}
            </button>
            <button type="button" onClick={onBuildOwn} className="button-secondary">
              Build Your Own Plan
            </button>
            {onJumpToComparison ? (
              <button type="button" onClick={onJumpToComparison} className="button-secondary">
                Jump to Comparison
              </button>
            ) : null}
          </div>
          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            <div className="rounded-[24px] border border-slate-200/70 bg-white/75 p-4 shadow-sm">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                Reviewer Hook
              </p>
              <p className="mt-2 text-sm font-semibold text-slate-900">Not just a timetable</p>
            </div>
            <div className="rounded-[24px] border border-slate-200/70 bg-white/75 p-4 shadow-sm">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                Instant Signal
              </p>
              <p className="mt-2 text-sm font-semibold text-slate-900">Scores and tradeoffs in seconds</p>
            </div>
            <div className="rounded-[24px] border border-slate-200/70 bg-white/75 p-4 shadow-sm">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                Demo Story
              </p>
              <p className="mt-2 text-sm font-semibold text-slate-900">A, B, and C fail differently</p>
            </div>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
          {isSampleLoaded && demoPlans.length > 0 ? (
            <>
              <div className="rounded-[28px] border border-slate-200/80 bg-white/88 p-5 shadow-[0_16px_40px_rgba(15,23,42,0.05)] lg:row-span-2">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                  15-Second Story
                </p>
                <p className="mt-3 text-base font-semibold text-slate-950">
                  The product value should be obvious immediately
                </p>
                <div className="mt-4 space-y-3">
                  {demoPlans.map((plan, index) => (
                    <div key={plan.name} className="rounded-[22px] border border-slate-200 bg-slate-50/80 p-4">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                        Step {index + 1}
                      </p>
                      <div className="mt-2 flex items-center justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold text-slate-900">
                            {plan.name} · {plan.profileLabel}
                          </p>
                          <p className="mt-1 text-xs capitalize text-slate-500">{plan.stressLabel}</p>
                        </div>
                        <div className="rounded-full border border-slate-200 bg-white px-3 py-1 text-sm font-semibold text-slate-900">
                          {plan.stressScore}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-[28px] border border-slate-200/80 bg-white/88 p-5 shadow-[0_16px_40px_rgba(15,23,42,0.05)]">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">Best Overall</p>
                <p className="mt-3 text-base font-semibold text-slate-950">
                  {bestPlanName ? `${bestPlanName} should win clearly.` : "Balanced plan should emerge clearly."}
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-700">
                  The first takeaway should be that the app recommends a better option, not just displays schedules.
                </p>
              </div>
              <div className="rounded-[28px] border border-slate-200/80 bg-white/88 p-5 shadow-[0_16px_40px_rgba(15,23,42,0.05)]">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">Core Reveal</p>
                <p className="mt-3 text-base font-semibold text-slate-950">Timetable fit is not enough</p>
                <p className="mt-2 text-sm leading-6 text-slate-700">
                  One plan overloads the week, one is sustainable, and one only breaks when deadlines start stacking.
                </p>
              </div>
            </>
          ) : (
            <>
              <div className="rounded-[28px] border border-slate-200/80 bg-white/88 p-5 shadow-[0_16px_40px_rgba(15,23,42,0.05)]">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                  Compare Plans
                </p>
                <p className="mt-3 text-base font-semibold text-slate-950">Make the comparison the centerpiece</p>
                <p className="mt-2 text-sm leading-6 text-slate-700">
                  Weigh stress score, study load, conflicts, and exam timing before you commit
                  to a registration path.
                </p>
              </div>
              <div className="rounded-[28px] border border-slate-200/80 bg-white/88 p-5 shadow-[0_16px_40px_rgba(15,23,42,0.05)]">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                  Detect Pressure
                </p>
                <p className="mt-3 text-base font-semibold text-slate-950">Expose the schedule weak spots</p>
                <p className="mt-2 text-sm leading-6 text-slate-700">
                  Surface class conflicts, commitment collisions, heavy days, back-to-backs,
                  and wasted gaps across the week.
                </p>
              </div>
              <div className="rounded-[28px] border border-slate-200/80 bg-white/88 p-5 shadow-[0_16px_40px_rgba(15,23,42,0.05)]">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                  Stay Realistic
                </p>
                <p className="mt-3 text-base font-semibold text-slate-950">Model life outside class</p>
                <p className="mt-2 text-sm leading-6 text-slate-700">
                  Account for work, clubs, sleep goals, and daily limits so the chosen plan
                  matches actual life outside class.
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
