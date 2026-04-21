import { samplePlannerState } from "./src/lib/sampleData";
import { analyzePlanSchedule } from "./src/lib/schedule";
import { scorePlan } from "./src/lib/scoring";
import { buildRecommendations, buildWarnings } from "./src/lib/recommendations";

for (const plan of samplePlannerState.plans) {
  const scheduled = analyzePlanSchedule(plan, samplePlannerState.courses, samplePlannerState.commitments, samplePlannerState.preferences);
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
    metrics: { ...scheduled.metrics, ...scored },
    scoreBreakdown: scored.scoreBreakdown,
  };
  const warnings = buildWarnings(draftAnalysis);
  const recommendations = buildRecommendations({ ...draftAnalysis, warnings });
  console.log(plan.name);
  for (const line of recommendations) console.log(`- ${line}`);
}
