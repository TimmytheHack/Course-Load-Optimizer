"use client";

import { useMemo, useRef, useState } from "react";

import { CommitmentForm } from "@/components/CommitmentForm";
import { CommitmentList } from "@/components/CommitmentList";
import { ComparisonTable } from "@/components/ComparisonTable";
import { CourseForm } from "@/components/CourseForm";
import { CourseLibrary } from "@/components/CourseLibrary";
import { LandingHero } from "@/components/LandingHero";
import { PlanContentTransition } from "@/components/PlanContentTransition";
import { PlanTabs } from "@/components/PlanTabs";
import { PreferencesCard } from "@/components/PreferencesCard";
import { RecommendationPanel } from "@/components/RecommendationPanel";
import { ScoreDriversPanel } from "@/components/ScoreDriversPanel";
import { ScoreCard } from "@/components/ScoreCard";
import { SectionCard } from "@/components/SectionCard";
import { StickyPlanSummary } from "@/components/StickyPlanSummary";
import { StressLegend } from "@/components/StressLegend";
import { Timetable } from "@/components/Timetable";
import { WarningList } from "@/components/WarningList";
import { WeekdayWorkloadChart } from "@/components/WeekdayWorkloadChart";
import { usePlannerState } from "@/hooks/usePlannerState";
import { buildRecommendations, buildWarnings, summarizeBestPlan } from "@/lib/recommendations";
import { analyzePlanSchedule } from "@/lib/schedule";
import { scorePlan } from "@/lib/scoring";
import { formatHours } from "@/lib/utils";

export default function HomePage() {
  const workspaceRef = useRef<HTMLElement | null>(null);
  const comparisonRef = useRef<HTMLElement | null>(null);
  const copyResetTimeoutRef = useRef<number | null>(null);
  const [copyStatus, setCopyStatus] = useState<"idle" | "copied" | "error">("idle");
  const {
    state,
    isHydrated,
    addCourse,
    removeCourse,
    toggleCourseInPlan,
    addCommitment,
    removeCommitment,
    updatePreferences,
    loadSampleSemester,
    resetPlanner,
    setActivePlan,
  } = usePlannerState();

  const analyses = state.plans.map((plan) => {
    const scheduled = analyzePlanSchedule(
      plan,
      state.courses,
      state.commitments,
      state.preferences,
    );
    const scored = scorePlan(scheduled.metrics);

    const draftAnalysis = {
      planId: plan.id,
      planName: plan.name,
      planProfileLabel: plan.profileLabel,
      planDescription: plan.description,
      courses: scheduled.courses,
      classBlocks: scheduled.classBlocks,
      commitmentBlocks: scheduled.commitmentBlocks,
      dayLoads: scheduled.dayLoads,
      classConflicts: scheduled.classConflicts,
      commitmentConflicts: scheduled.commitmentConflicts,
      warnings: [],
      recommendations: [],
      metrics: {
        ...scheduled.metrics,
        ...scored,
      },
      scoreBreakdown: scored.scoreBreakdown,
    };

    const warnings = buildWarnings(draftAnalysis);
    const recommendations = buildRecommendations({
      ...draftAnalysis,
      warnings,
    });

    return {
      ...draftAnalysis,
      warnings,
      recommendations,
    };
  });

  const activeAnalysis =
    analyses.find((analysis) => analysis.planId === state.activePlanId) ?? analyses[0];
  const bestPlan = summarizeBestPlan(analyses);
  const recommendedAnalysis =
    analyses.find((analysis) => analysis.planId === bestPlan?.planId) ?? analyses[0];
  const hasPlannerData = state.courses.length > 0 || state.commitments.length > 0;
  const isDemoState = useMemo(
    () => state.plans.some((plan) => Boolean(plan.profileLabel)),
    [state.plans],
  );
  const demoPlans = analyses.map((analysis) => ({
    name: analysis.planName,
    profileLabel: analysis.planProfileLabel,
    stressScore: analysis.metrics.stressScore,
    stressLabel: analysis.metrics.stressLabel,
  }));
  const recommendationTitle =
    bestPlan?.title ?? `Recommended: ${recommendedAnalysis?.planName ?? "Plan B"}`;
  const recommendationDescription =
    bestPlan?.description ?? "Lowest overall pressure with the clearest week-to-week fit.";
  const recommendationReasons =
    bestPlan?.reasons ?? [`Lowest stress score of the three at ${recommendedAnalysis.metrics.stressScore}`];
  const examClusteringSummary =
    recommendedAnalysis.metrics.examClusterPairs > 0
      ? `${recommendedAnalysis.metrics.examClusterPairs} clustered deadline pair${
          recommendedAnalysis.metrics.examClusterPairs > 1 ? "s" : ""
        }`
      : "Low";
  const activePlanSignals = [
    {
      label: "Weekly class hours",
      value: formatHours(activeAnalysis.metrics.weeklyClassHours),
    },
    {
      label: "Weekly study hours",
      value: formatHours(activeAnalysis.metrics.weeklyStudyHours),
    },
    {
      label: "Total conflicts",
      value: String(
        activeAnalysis.metrics.classConflictCount +
          activeAnalysis.metrics.commitmentConflictCount,
      ),
    },
    {
      label: "Busiest day",
      value: `${activeAnalysis.metrics.busiestDay} · ${formatHours(
        activeAnalysis.metrics.busiestDayHours,
      )}`,
    },
    {
      label: "Heavy days",
      value: String(activeAnalysis.metrics.heavyDayCount),
    },
    {
      label: "Exam clustering",
      value:
        activeAnalysis.metrics.examClusterPairs > 0
          ? `${activeAnalysis.metrics.examClusterPairs} pair${
              activeAnalysis.metrics.examClusterPairs > 1 ? "s" : ""
            }`
          : "Clear",
    },
  ];

  function scrollToTarget(target: HTMLElement | null) {
    requestAnimationFrame(() => {
      target?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  function handleSampleLoad() {
    loadSampleSemester();
    scrollToTarget(comparisonRef.current);
  }

  function handleBuildOwn() {
    resetPlanner();
    scrollToTarget(workspaceRef.current);
  }

  function handleJumpToComparison() {
    scrollToTarget(comparisonRef.current);
  }

  function queueCopyStatus(status: "copied" | "error") {
    setCopyStatus(status);

    if (copyResetTimeoutRef.current !== null) {
      window.clearTimeout(copyResetTimeoutRef.current);
    }

    copyResetTimeoutRef.current = window.setTimeout(() => {
      setCopyStatus("idle");
      copyResetTimeoutRef.current = null;
    }, 2200);
  }

  function buildRecommendationExportText() {
    const keyRecommendation =
      recommendedAnalysis.recommendations[0] ??
      "Review the full plan details before you lock in this schedule.";

    return [
      "Course Load Optimizer",
      recommendationTitle,
      recommendationDescription,
      "",
      `Selected plan: ${recommendedAnalysis.planName}`,
      `Stress score: ${recommendedAnalysis.metrics.stressScore} (${recommendedAnalysis.metrics.stressLabel})`,
      `Weekly study hours: ${formatHours(recommendedAnalysis.metrics.weeklyStudyHours)} / week`,
      `Class conflicts: ${recommendedAnalysis.metrics.classConflictCount}`,
      `Commitment overlaps: ${recommendedAnalysis.metrics.commitmentConflictCount}`,
      `Exam clustering: ${examClusteringSummary}`,
      "",
      "Top reasons:",
      ...recommendationReasons.map((reason) => `- ${reason}`),
      "",
      `Key recommendation: ${keyRecommendation}`,
    ].join("\n");
  }

  async function handleCopyRecommendationSummary() {
    const summaryText = buildRecommendationExportText();

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(summaryText);
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = summaryText;
        textArea.setAttribute("readonly", "true");
        textArea.style.position = "absolute";
        textArea.style.left = "-9999px";
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
      }

      queueCopyStatus("copied");
    } catch {
      queueCopyStatus("error");
    }
  }

  if (!isHydrated) {
    return (
      <main className="min-h-screen px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <LandingHero
            onTrySample={handleSampleLoad}
            onBuildOwn={handleBuildOwn}
          />
          <div className="mt-8 panel text-sm text-slate-500">Loading saved planner…</div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <LandingHero
          onTrySample={handleSampleLoad}
          onBuildOwn={handleBuildOwn}
          onJumpToComparison={hasPlannerData ? handleJumpToComparison : undefined}
          isSampleLoaded={isDemoState}
          bestPlanName={bestPlan?.planName ?? null}
          demoPlans={isDemoState ? demoPlans : []}
        />

        {hasPlannerData ? (
          <StickyPlanSummary
            analyses={analyses}
            activePlanId={state.activePlanId}
            recommendedPlanId={bestPlan?.planId ?? null}
            onChange={setActivePlan}
          />
        ) : null}

        {hasPlannerData ? (
        <section ref={comparisonRef} className="space-y-5">
          <div className="grid gap-4 xl:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]">
            <div className="rounded-[30px] border border-slate-900 bg-[linear-gradient(150deg,#0f172a,#1f2937)] p-5 text-white shadow-[0_24px_50px_rgba(15,23,42,0.16)]">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/60">
                  Recommended plan
                </p>
                <button
                  type="button"
                  onClick={handleCopyRecommendationSummary}
                  className="inline-flex items-center rounded-full border border-white/12 bg-white/5 px-3 py-1.5 text-sm font-semibold text-white/80 transition hover:bg-white/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-white/35 focus:ring-offset-0 motion-reduce:transition-none"
                >
                  {copyStatus === "copied"
                    ? "Copied summary"
                    : copyStatus === "error"
                      ? "Copy failed"
                      : "Copy summary"}
                </button>
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-3">
                <h3 className="text-2xl font-semibold text-white">
                  {recommendationTitle}
                </h3>
                <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-sm font-semibold text-white">
                  Stress score {recommendedAnalysis?.metrics.stressScore ?? 0}
                </span>
              </div>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-white/85">
                {recommendationDescription}
              </p>
              <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                {recommendationReasons.map((reason) => (
                  <li
                    key={reason}
                    className="rounded-[22px] border border-white/10 bg-white/6 px-4 py-3 text-sm font-medium text-white/92"
                  >
                    {reason}
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-xs text-white/60" aria-live="polite">
                {copyStatus === "copied"
                  ? "Recommendation copied to your clipboard."
                  : copyStatus === "error"
                    ? "Clipboard access failed. Try again in your browser."
                    : "Copy a clean text summary of this plan to share or save."}
              </p>
            </div>
            <SectionCard
              title="Compare plans"
              description="Stress score, conflicts, and workload at a glance."
              className="h-full"
            >
              <StressLegend />
              <div className="mt-5 grid gap-4 lg:grid-cols-3 xl:grid-cols-1">
                {analyses.map((analysis) => (
                  <ScoreCard
                    key={analysis.planId}
                    analysis={analysis}
                    highlighted={analysis.planId === state.activePlanId}
                    recommended={analysis.planId === bestPlan?.planId}
                  />
                ))}
              </div>
            </SectionCard>
          </div>
          <SectionCard
            title="Comparison summary"
            description="See where each plan wins or falls behind before you inspect the details."
          >
            <ComparisonTable
              analyses={analyses}
              recommendedPlanId={bestPlan?.planId ?? null}
            />
          </SectionCard>
        </section>
        ) : null}

        {hasPlannerData ? (
        <section className="grid gap-6 xl:grid-cols-[minmax(0,1.08fr)_360px]">
          <SectionCard
            title="Why this score?"
            description={`${activeAnalysis.planName} blends weighted category pressure with conflict penalties when those rules apply.`}
          >
            <PlanContentTransition motionKey={`score-${state.activePlanId}`}>
              <ScoreDriversPanel analysis={activeAnalysis} />
              <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {activePlanSignals.map((signal) => (
                  <div
                    key={signal.label}
                    className="rounded-3xl border border-slate-200 bg-slate-50/80 p-4"
                  >
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                      {signal.label}
                    </p>
                    <p className="mt-3 text-2xl font-semibold text-slate-900">{signal.value}</p>
                  </div>
                ))}
              </div>
            </PlanContentTransition>
          </SectionCard>

          <div className="space-y-6">
            <SectionCard
              title="Plan summary"
              description="Quick read before you inspect the visuals."
              compact
            >
              <PlanContentTransition motionKey={`summary-${state.activePlanId}`}>
                <div className="space-y-3">
                  <div className="rounded-3xl border border-slate-200 bg-slate-50/80 p-3.5">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                      Stress score
                    </p>
                    <p className="mt-2.5 text-3xl font-semibold text-slate-950">
                      {activeAnalysis.metrics.stressScore}
                    </p>
                    <p className="mt-1 text-sm capitalize text-slate-600">
                      {activeAnalysis.metrics.stressLabel}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-3xl border border-slate-200 bg-white p-3.5">
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                        Weekly commitments
                      </p>
                      <p className="mt-2 text-xl font-semibold text-slate-900">
                        {formatHours(activeAnalysis.metrics.weeklyCommitmentHours)}
                      </p>
                    </div>
                    <div className="rounded-3xl border border-slate-200 bg-white p-3.5">
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                        Tightest exam gap
                      </p>
                      <p className="mt-2 text-xl font-semibold text-slate-900">
                        {activeAnalysis.metrics.tightestExamGapHours === null
                          ? "Clear"
                          : `${activeAnalysis.metrics.tightestExamGapHours}h`}
                      </p>
                    </div>
                  </div>
                </div>
              </PlanContentTransition>
            </SectionCard>

            <SectionCard
              title="Warnings"
              description="The biggest risks in the active plan."
              compact
            >
              <PlanContentTransition motionKey={`warnings-${state.activePlanId}`}>
                <WarningList warnings={activeAnalysis.warnings} />
              </PlanContentTransition>
            </SectionCard>

            <SectionCard
              title="Why this plan works"
              description="Short guidance on whether to keep, lighten, or rebuild it."
              compact
            >
              <PlanContentTransition motionKey={`recommendations-${state.activePlanId}`}>
                <RecommendationPanel recommendations={activeAnalysis.recommendations} />
              </PlanContentTransition>
            </SectionCard>
          </div>
        </section>
        ) : null}

        {hasPlannerData ? (
        <section className="grid gap-5 xl:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)]">
          <SectionCard
            title={`${activeAnalysis.planName} timetable`}
            description="Course blocks and recurring commitments appear together so pressure points are easy to spot."
            compact
          >
            <PlanContentTransition motionKey={`timetable-${state.activePlanId}`}>
              <Timetable
                classBlocks={activeAnalysis.classBlocks}
                commitmentBlocks={activeAnalysis.commitmentBlocks}
              />
            </PlanContentTransition>
          </SectionCard>

          <SectionCard
            title="Weekly workload"
            description="See where class, study, and commitments stack up across the week."
            compact
          >
            <PlanContentTransition motionKey={`workload-${state.activePlanId}`}>
              <WeekdayWorkloadChart dayLoads={activeAnalysis.dayLoads} />
            </PlanContentTransition>
          </SectionCard>
        </section>
        ) : null}

        <section ref={workspaceRef} className="space-y-5">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">
                Edit your semester
              </p>
              <h2 className="mt-2 text-3xl font-serif text-slate-950">
                Adjust the sample or build your own
              </h2>
            </div>
            <div className="flex flex-wrap gap-3">
              <button type="button" className="button-secondary" onClick={handleSampleLoad}>
                Try sample semester
              </button>
              <button type="button" className="button-secondary" onClick={handleBuildOwn}>
                Build your own plan
              </button>
            </div>
          </div>

          <div className="grid gap-5 xl:grid-cols-[380px_minmax(0,1fr)]">
            <div className="space-y-5">
              <SectionCard
                title="Course setup"
                description="Enter class times, weekly workload, difficulty, and major deadlines."
                compact
              >
                <CourseForm courses={state.courses} onAddCourse={addCourse} />
              </SectionCard>

              <SectionCard
                title="Commitments"
                description="Include work, clubs, exercise, or other recurring time outside class."
                compact
              >
                <CommitmentForm onAddCommitment={addCommitment} />
              </SectionCard>

              <SectionCard
                title="Preferences"
                description="Set the limits used to flag heavy days and sleep conflicts."
                compact
              >
                <PreferencesCard preferences={state.preferences} onUpdate={updatePreferences} />
              </SectionCard>
            </div>

            <div className="space-y-5">
              <SectionCard
                title="Edit plans"
                description="Toggle courses into any plan and the recommendation updates immediately."
                compact
                action={
                  <span className="badge-soft">
                    {state.courses.length} courses · {state.commitments.length} commitments
                  </span>
                }
              >
                <PlanTabs
                  analyses={analyses}
                  activePlanId={state.activePlanId}
                  recommendedPlanId={bestPlan?.planId ?? null}
                  onChange={setActivePlan}
                />
                <div className="mt-5">
                  <CourseLibrary
                    courses={state.courses}
                    plans={state.plans}
                    activePlanId={state.activePlanId}
                    onTogglePlan={toggleCourseInPlan}
                    onRemove={removeCourse}
                  />
                </div>
              </SectionCard>

              <SectionCard
                title="Outside commitments"
                description="These recurring blocks stay active across every candidate plan."
                compact
              >
                <CommitmentList commitments={state.commitments} onRemove={removeCommitment} />
              </SectionCard>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
