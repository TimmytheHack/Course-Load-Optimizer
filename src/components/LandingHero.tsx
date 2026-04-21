interface LandingHeroProps {
  onTrySample: () => void;
  onBuildOwn: () => void;
}

export function LandingHero({ onTrySample, onBuildOwn }: LandingHeroProps) {
  return (
    <section className="relative overflow-hidden rounded-[32px] border border-white/70 bg-[linear-gradient(135deg,rgba(255,255,255,0.94),rgba(247,247,244,0.92))] px-6 py-10 shadow-[0_24px_80px_rgba(15,23,42,0.08)] sm:px-10 lg:px-12">
      <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-1/2 bg-[radial-gradient(circle_at_top,rgba(148,163,184,0.15),transparent_60%)] lg:block" />
      <div className="relative grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="max-w-2xl">
          <p className="inline-flex rounded-full border border-slate-200 bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
            Semester Planning MVP
          </p>
          <h1 className="mt-6 max-w-xl font-serif text-4xl leading-tight text-slate-950 sm:text-5xl">
            Course Load Optimizer
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-700">
            Compare semester plans, detect overload, and choose the most realistic
            schedule before registration.
          </p>
          <p className="mt-4 max-w-xl text-sm leading-6 text-slate-600">
            This is a decision tool, not just a timetable viewer. Load a realistic sample
            semester or start from scratch, then compare Plan A, Plan B, and Plan C
            side by side.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <button type="button" onClick={onTrySample} className="button-primary">
              Try Sample Semester
            </button>
            <button type="button" onClick={onBuildOwn} className="button-secondary">
              Build Your Own Plan
            </button>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
          <div className="rounded-3xl border border-slate-200/80 bg-white/90 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
              Compare Plans
            </p>
            <p className="mt-3 text-sm leading-6 text-slate-700">
              Weigh stress score, study load, conflicts, and exam timing before you commit
              to a registration path.
            </p>
          </div>
          <div className="rounded-3xl border border-slate-200/80 bg-white/90 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
              Detect Pressure
            </p>
            <p className="mt-3 text-sm leading-6 text-slate-700">
              Surface class conflicts, commitment collisions, heavy days, back-to-backs,
              and wasted gaps across the week.
            </p>
          </div>
          <div className="rounded-3xl border border-slate-200/80 bg-white/90 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
              Stay Realistic
            </p>
            <p className="mt-3 text-sm leading-6 text-slate-700">
              Account for work, clubs, sleep goals, and daily limits so the chosen plan
              matches actual life outside class.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
