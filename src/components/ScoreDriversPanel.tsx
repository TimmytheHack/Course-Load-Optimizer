import {
  describeScoreDriver,
  getRankedScoreDrivers,
  ScoreDriverKey,
} from "@/lib/recommendations";
import { SCORE_WEIGHTS } from "@/lib/scoring";
import { PlanAnalysis } from "@/lib/types";

interface ScoreDriversPanelProps {
  analysis: PlanAnalysis;
}

const DRIVER_TITLES: Record<ScoreDriverKey, string> = {
  courseIntensity: "Course load",
  workloadIntensity: "Weekly workload",
  dailyBalance: "Day balance",
  scheduleFriction: "Schedule shape",
  commitmentPressure: "Outside commitments",
  examPressure: "Deadline timing",
  conflictPressure: "Conflicts",
};

const DRIVER_INPUTS: Record<ScoreDriverKey, string> = {
  courseIntensity: "courses, hard courses, class hours",
  workloadIntensity: "study hours, hard courses, deadlines",
  dailyBalance: "heavy days, class/day limits, study/day limits",
  scheduleFriction: "back-to-backs and long gaps",
  commitmentPressure: "commitment hours, overlaps, sleep conflicts",
  examPressure: "clustered deadlines and tight exam gaps",
  conflictPressure: "class conflicts and commitment overlaps",
};

function getPressureLevel(value: number) {
  if (value >= 75) {
    return {
      label: "High pressure",
      className: "border-rose-200 bg-rose-50 text-rose-700",
    };
  }

  if (value >= 45) {
    return {
      label: "Medium pressure",
      className: "border-amber-200 bg-amber-50 text-amber-700",
    };
  }

  return {
    label: "Low pressure",
    className: "border-emerald-200 bg-emerald-50 text-emerald-700",
  };
}

export function ScoreDriversPanel({ analysis }: ScoreDriversPanelProps) {
  const rankedDrivers = getRankedScoreDrivers(analysis).map((driver) => ({
    ...driver,
    weight: SCORE_WEIGHTS[driver.key],
    contribution: driver.value * SCORE_WEIGHTS[driver.key],
  }));
  const weightedBaseScore = rankedDrivers.reduce((sum, driver) => sum + driver.contribution, 0);
  const classConflictFloor =
    analysis.metrics.classConflictCount > 0
      ? 78 + analysis.metrics.classConflictCount * 8
      : null;
  const classConflictOverride =
    classConflictFloor !== null && classConflictFloor > weightedBaseScore
      ? Math.round(classConflictFloor - weightedBaseScore)
      : 0;
  const commitmentPenalty =
    analysis.metrics.commitmentConflictCount > 0
      ? 4 + analysis.metrics.commitmentConflictCount * 3
      : 0;
  const capOverage =
    classConflictOverride > 0 || commitmentPenalty > 0
      ? Math.max(
          0,
          Math.round(weightedBaseScore) + classConflictOverride + commitmentPenalty - 100,
        )
      : 0;
  const topDriverLabels = rankedDrivers
    .slice(0, 3)
    .map((driver) => DRIVER_TITLES[driver.key])
    .join(", ");

  return (
    <div className="space-y-3.5">
      <div className="rounded-[26px] border border-slate-200 bg-slate-50/80 p-4">
        <p className="text-sm leading-6 text-slate-700">
          Seven weighted categories build the base score, then overlap rules raise the result when they apply.
        </p>
        <div className="mt-3.5 grid gap-3 sm:grid-cols-2">
          <div className="rounded-[22px] border border-slate-200 bg-white px-4 py-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
              Base score
            </p>
            <p className="mt-2 text-2xl font-semibold text-slate-950">
              ~{Math.round(weightedBaseScore)}
            </p>
          </div>
          <div className="rounded-[22px] border border-slate-200 bg-white px-4 py-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
              Final score
            </p>
            <p className="mt-2 text-2xl font-semibold text-slate-950">
              {analysis.metrics.stressScore}
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-3">
        {rankedDrivers.map((driver) => (
          <article key={driver.key} className="rounded-[26px] border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-base font-semibold text-slate-950">
                    {DRIVER_TITLES[driver.key]}
                  </p>
                  <span className="rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-[11px] font-semibold text-slate-600">
                    {Math.round(driver.weight * 100)}% weight
                  </span>
                  <span
                    className={[
                      "rounded-full border px-2 py-0.5 text-[11px] font-semibold",
                      getPressureLevel(driver.value).className,
                    ].join(" ")}
                  >
                    {getPressureLevel(driver.value).label}
                  </span>
                </div>
                <p className="mt-2 text-sm leading-6 text-slate-700">
                  {describeScoreDriver(analysis, driver.key)}
                </p>
                <p className="mt-2 text-[11px] uppercase tracking-[0.16em] text-slate-400">
                  Inputs: {DRIVER_INPUTS[driver.key]}
                </p>
              </div>
              <div className="rounded-[22px] border border-slate-200 bg-slate-50 px-3.5 py-3 text-right">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                  Contribution
                </p>
                <p className="mt-1 text-2xl font-semibold text-slate-950">
                  ~{Math.round(driver.contribution)} pts
                </p>
                <p className="mt-1 text-xs font-medium text-slate-500">
                  {Math.round(driver.value)} / 100 pressure
                </p>
              </div>
            </div>
            <div className="mt-3 h-2 rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-slate-900"
                style={{ width: `${Math.max(driver.value, 8)}%` }}
              />
            </div>
          </article>
        ))}
      </div>

      {classConflictOverride > 0 || commitmentPenalty > 0 || capOverage > 0 ? (
        <div className="rounded-[26px] border border-amber-200 bg-amber-50/80 p-4 text-sm leading-6 text-amber-950">
          <p className="font-semibold">Score adjustments</p>
          <div className="mt-2 space-y-2">
            {classConflictOverride > 0 ? (
              <p>
                Class-conflict override: a direct class conflict pushes this plan to at least{" "}
                {classConflictFloor}.
              </p>
            ) : null}
            {commitmentPenalty > 0 ? (
              <p>
                Commitment-overlap penalty: {analysis.metrics.commitmentConflictCount} overlap
                {analysis.metrics.commitmentConflictCount > 1 ? "s" : ""} add +{commitmentPenalty}.
              </p>
            ) : null}
            {capOverage > 0 ? <p>Score cap: the final result is capped at 100.</p> : null}
          </div>
        </div>
      ) : null}

      <div className="rounded-[26px] border border-emerald-200 bg-emerald-50/80 p-4 text-sm leading-6 text-emerald-950">
        Biggest drivers: <span className="font-semibold">{topDriverLabels}</span>.
      </div>
    </div>
  );
}
