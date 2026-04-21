interface LandingHeroProps {
  onTrySample: () => void;
  onBuildOwn: () => void;
  onJumpToComparison?: () => void;
  isSampleLoaded?: boolean;
  bestPlanName?: string | null;
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
  demoPlans = [],
}: LandingHeroProps) {
  return (
    <section className="relative overflow-hidden rounded-[36px] border border-white/70 bg-[linear-gradient(140deg,rgba(255,255,255,0.96),rgba(244,243,238,0.92))] px-6 py-8 shadow-[0_28px_90px_rgba(15,23,42,0.08)] sm:px-10 sm:py-10 lg:px-12 lg:py-12">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.9),transparent_28%),radial-gradient(circle_at_85%_15%,rgba(148,163,184,0.16),transparent_25%)]" />
      <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-1/2 bg-[radial-gradient(circle_at_top,rgba(148,163,184,0.12),transparent_60%)] lg:block" />
      <div className="relative grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:gap-10">
        <div className="max-w-2xl">
          <p className="inline-flex rounded-full border border-slate-200/80 bg-white/85 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500 shadow-sm">
            {isSampleLoaded ? "Demo-Ready Sample Loaded" : "Frontend MVP"}
          </p>
          <h1 className="mt-6 max-w-2xl font-serif text-4xl leading-tight text-slate-950 sm:text-5xl lg:text-[3.6rem] lg:leading-[1.02]">
            Course Load Optimizer
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-700">
            Compare semester plans, detect overload, and choose the most realistic
            schedule before registration.
          </p>
          <p className="mt-4 max-w-xl text-sm leading-7 text-slate-600">
            {isSampleLoaded
              ? "The sample below is already staged for a fast demo: Plan A shows overload risk, Plan B is the realistic choice, and Plan C looks fine on a timetable but breaks at exam time."
              : "This is a decision tool, not just a timetable viewer. Load a realistic sample semester or start from scratch, then compare Plan A, Plan B, and Plan C side by side."}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <button type="button" onClick={onTrySample} className="button-primary">
              {isSampleLoaded ? "Reload Demo Semester" : "Try Sample Semester"}
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
                Core Value
              </p>
              <p className="mt-2 text-sm font-semibold text-slate-900">Compare realistic tradeoffs</p>
            </div>
            <div className="rounded-[24px] border border-slate-200/70 bg-white/75 p-4 shadow-sm">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                Inputs
              </p>
              <p className="mt-2 text-sm font-semibold text-slate-900">Courses, workload, commitments</p>
            </div>
            <div className="rounded-[24px] border border-slate-200/70 bg-white/75 p-4 shadow-sm">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                Output
              </p>
              <p className="mt-2 text-sm font-semibold text-slate-900">Stress score and plan recommendation</p>
            </div>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
          {isSampleLoaded && demoPlans.length > 0 ? (
            <>
              <div className="rounded-[28px] border border-slate-200/80 bg-white/88 p-5 shadow-[0_16px_40px_rgba(15,23,42,0.05)] lg:row-span-2">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                  Demo Story
                </p>
                <p className="mt-3 text-base font-semibold text-slate-950">
                  Show the tradeoff in under three minutes
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
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                  Best Overall
                </p>
                <p className="mt-3 text-base font-semibold text-slate-950">
                  {bestPlanName ? `${bestPlanName} is the easiest recommendation to defend.` : "Balanced plan should emerge clearly."}
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-700">
                  The audience should immediately see that this app compares realistic options, not just calendar layouts.
                </p>
              </div>
              <div className="rounded-[28px] border border-slate-200/80 bg-white/88 p-5 shadow-[0_16px_40px_rgba(15,23,42,0.05)]">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                  Core Reveal
                </p>
                <p className="mt-3 text-base font-semibold text-slate-950">Timetable fit is not enough</p>
                <p className="mt-2 text-sm leading-6 text-slate-700">
                  One plan overloads the week, one is sustainable, and one looks clean until exams cluster together.
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
