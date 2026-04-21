"use client";

import { useRef } from "react";

import { CommitmentForm } from "@/components/CommitmentForm";
import { CommitmentList } from "@/components/CommitmentList";
import { ComparisonTable } from "@/components/ComparisonTable";
import { CourseForm } from "@/components/CourseForm";
import { CourseLibrary } from "@/components/CourseLibrary";
import { LandingHero } from "@/components/LandingHero";
import { PlanTabs } from "@/components/PlanTabs";
import { PreferencesCard } from "@/components/PreferencesCard";
import { RecommendationPanel } from "@/components/RecommendationPanel";
import { ScoreCard } from "@/components/ScoreCard";
import { SectionCard } from "@/components/SectionCard";
import { StressLegend } from "@/components/StressLegend";
import { Timetable } from "@/components/Timetable";
import { WarningList } from "@/components/WarningList";
import { WeekdayWorkloadChart } from "@/components/WeekdayWorkloadChart";
import { usePlannerState } from "@/hooks/usePlannerState";
import { buildRecommendations, buildWarnings, summarizeBestPlan } from "@/lib/recommendations";
import { analyzePlanSchedule } from "@/lib/schedule";
import { scorePlan } from "@/lib/scoring";
import { formatHours } from "@/lib/utils";

const SNAPSHOT_TILES = [
  {
    label: "Class conflicts",
    key: "classConflictCount",
  },
  {
    label: "Commitment overlaps",
    key: "commitmentConflictCount",
  },
  {
    label: "Back-to-back classes",
    key: "backToBackCount",
  },
  {
    label: "Long gaps",
    key: "longGapCount",
  },
  {
    label: "Weekly class hours",
    key: "weeklyClassHours",
  },
  {
    label: "Weekly study hours",
    key: "weeklyStudyHours",
  },
  {
    label: "Busiest day",
    key: "busiestDay",
  },
  {
    label: "Heavy days",
    key: "heavyDayCount",
  },
  {
    label: "Exam clustering",
    key: "examClusterPairs",
  },
];

export default function HomePage() {
  const workspaceRef = useRef<HTMLElement | null>(null);
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

  function scrollToWorkspace() {
    requestAnimationFrame(() => {
      workspaceRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  function handleSampleLoad() {
    loadSampleSemester();
    scrollToWorkspace();
  }

  function handleBuildOwn() {
    resetPlanner();
    scrollToWorkspace();
  }

  if (!isHydrated) {
    return (
      <main className="min-h-screen px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <LandingHero onTrySample={handleSampleLoad} onBuildOwn={handleBuildOwn} />
          <div className="mt-8 panel text-sm text-slate-500">Loading saved planner…</div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <LandingHero onTrySample={handleSampleLoad} onBuildOwn={handleBuildOwn} />

        <section ref={workspaceRef} className="space-y-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">
                Planner Workspace
              </p>
              <h2 className="mt-2 text-3xl font-serif text-slate-950">
                Compare the real tradeoffs before registration
              </h2>
            </div>
            <div className="flex flex-wrap gap-3">
              <button type="button" className="button-secondary" onClick={handleSampleLoad}>
                Load sample data
              </button>
              <button type="button" className="button-secondary" onClick={handleBuildOwn}>
                Clear planner
              </button>
            </div>
          </div>

          <div className="grid gap-6 xl:grid-cols-[380px_minmax(0,1fr)]">
            <div className="space-y-6">
              <SectionCard
                title="Course Input"
                description="Add courses manually with time, workload, difficulty, and major deadlines."
              >
                <CourseForm courses={state.courses} onAddCourse={addCourse} />
              </SectionCard>

              <SectionCard
                title="Commitment Input"
                description="Include work, clubs, exercise, or personal blocks so schedule analysis stays realistic."
              >
                <CommitmentForm onAddCommitment={addCommitment} />
              </SectionCard>

              <SectionCard
                title="Preferences"
                description="Set the sleep and daily capacity limits used by the scoring engine."
              >
                <PreferencesCard preferences={state.preferences} onUpdate={updatePreferences} />
              </SectionCard>
            </div>

            <div className="space-y-6">
              <SectionCard
                title="Plan Builder"
                description="Assign every course to any combination of Plan A, Plan B, and Plan C."
                action={
                  <span className="badge-soft">
                    {state.courses.length} courses · {state.commitments.length} commitments
                  </span>
                }
              >
                <PlanTabs
                  analyses={analyses}
                  activePlanId={state.activePlanId}
                  onChange={setActivePlan}
                />
                <div className="mt-6">
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
                title="Outside Commitments"
                description="These recurring blocks stay active across every candidate plan."
              >
                <CommitmentList commitments={state.commitments} onRemove={removeCommitment} />
              </SectionCard>
            </div>
          </div>
        </section>

        <section className="space-y-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">
                Candidate Plans
              </p>
              <h2 className="mt-2 text-3xl font-serif text-slate-950">
                Stress score cards make the comparison obvious
              </h2>
            </div>
            <p className="max-w-xl text-sm leading-6 text-slate-600">
              The score blends class load, study load, heavy-day pressure, inefficient gaps,
              commitment pressure, and exam clustering on a 0 to 100 scale.
            </p>
          </div>
          <StressLegend />
          <div className="grid gap-4 lg:grid-cols-3">
            {analyses.map((analysis) => (
              <ScoreCard
                key={analysis.planId}
                analysis={analysis}
                highlighted={analysis.planId === state.activePlanId}
              />
            ))}
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-[minmax(0,1.15fr)_360px]">
          <SectionCard
            title={`${activeAnalysis.planName} Analysis Snapshot`}
            description="Every required schedule signal for the selected plan, from conflicts to exam clustering."
          >
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {SNAPSHOT_TILES.map((tile) => {
                const value = activeAnalysis.metrics[tile.key as keyof typeof activeAnalysis.metrics];
                const formattedValue =
                  tile.key === "weeklyClassHours" || tile.key === "weeklyStudyHours"
                    ? formatHours(Number(value))
                    : String(value);

                return (
                  <div
                    key={tile.key}
                    className="rounded-3xl border border-slate-200 bg-slate-50/80 p-4"
                  >
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                      {tile.label}
                    </p>
                    <p className="mt-3 text-2xl font-semibold text-slate-900">{formattedValue}</p>
                  </div>
                );
              })}
            </div>
          </SectionCard>

          <SectionCard
            title="Active Plan Summary"
            description="A quick read on how this option feels in practice."
          >
            <div className="space-y-4">
              <div className="rounded-3xl border border-slate-200 bg-slate-50/80 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                  Overall signal
                </p>
                <p className="mt-3 text-3xl font-semibold text-slate-950">
                  {activeAnalysis.metrics.stressScore}
                </p>
                <p className="mt-1 text-sm capitalize text-slate-600">
                  {activeAnalysis.metrics.stressLabel}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-3xl border border-slate-200 bg-white p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                    Weekly commitments
                  </p>
                  <p className="mt-2 text-xl font-semibold text-slate-900">
                    {formatHours(activeAnalysis.metrics.weeklyCommitmentHours)}
                  </p>
                </div>
                <div className="rounded-3xl border border-slate-200 bg-white p-4">
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
              <div className="rounded-3xl border border-slate-200 bg-white p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                  Top recommendation
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-700">
                  {activeAnalysis.recommendations[0] ??
                    "Add courses to the active plan to generate recommendations."}
                </p>
              </div>
            </div>
          </SectionCard>
        </section>

        <section className="grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_360px]">
          <SectionCard
            title="Weekly Timetable"
            description="Course blocks are shown alongside recurring commitments to make pressure points visible."
          >
            <Timetable
              classBlocks={activeAnalysis.classBlocks}
              commitmentBlocks={activeAnalysis.commitmentBlocks}
            />
          </SectionCard>

          <div className="space-y-6">
            <SectionCard
              title="Warning List"
              description="Red flags that would make this plan harder to sustain."
            >
              <WarningList warnings={activeAnalysis.warnings} />
            </SectionCard>

            <SectionCard
              title="Recommendation Engine"
              description="Short rule-based guidance explaining where the plan works or breaks."
            >
              <RecommendationPanel recommendations={activeAnalysis.recommendations} />
            </SectionCard>
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          <SectionCard
            title="Workload by Weekday"
            description="Class, study, and commitment hours stacked across the week for the active plan."
          >
            <WeekdayWorkloadChart dayLoads={activeAnalysis.dayLoads} />
          </SectionCard>

          <SectionCard
            title="Side-by-Side Comparison"
            description="Choose the schedule that best balances workload, conflicts, and deadline timing."
          >
            <ComparisonTable analyses={analyses} bestPlanSummary={bestPlan?.summary ?? null} />
          </SectionCard>
        </section>
      </div>
    </main>
  );
}
