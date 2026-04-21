import { ScoreBreakdown } from "@/lib/types";
import { clamp, getStressTone } from "@/lib/utils";

function scale(value: number, low: number, high: number) {
  if (value <= low) {
    return 0;
  }

  if (value >= high) {
    return 100;
  }

  return ((value - low) / (high - low)) * 100;
}

export function scorePlan(rawMetrics: {
  courseCount: number;
  hardCourseCount: number;
  deadlineCount: number;
  weeklyClassHours: number;
  weeklyStudyHours: number;
  weeklyCommitmentHours: number;
  classConflictCount: number;
  commitmentConflictCount: number;
  backToBackCount: number;
  longGapCount: number;
  totalGapHours: number;
  busiestDayHours: number;
  heavyDayCount: number;
  examClusterPairs: number;
  tightestExamGapHours: number | null;
  maxStudyOverageDays: number;
  maxClassesOverageDays: number;
  sleepConflictCount: number;
}) {
  const courseIntensitySignal =
    rawMetrics.courseCount + rawMetrics.hardCourseCount * 1.7 + rawMetrics.weeklyClassHours / 8;
  const workloadSignal =
    rawMetrics.weeklyStudyHours + rawMetrics.hardCourseCount * 2 + rawMetrics.deadlineCount * 0.6;
  const dailyBalanceSignal =
    rawMetrics.heavyDayCount * 2 +
    rawMetrics.maxStudyOverageDays * 1.5 +
    rawMetrics.maxClassesOverageDays * 1.25 +
    Math.max(0, rawMetrics.busiestDayHours - 9);
  const scheduleFrictionSignal =
    rawMetrics.backToBackCount * 1.15 +
    rawMetrics.longGapCount * 1.4 +
    rawMetrics.totalGapHours / 2.5;
  const commitmentSignal =
    rawMetrics.weeklyCommitmentHours / 3 +
    rawMetrics.commitmentConflictCount * 2 +
    rawMetrics.sleepConflictCount * 1.5;
  const examSignal =
    rawMetrics.examClusterPairs * 2.2 +
    (rawMetrics.tightestExamGapHours !== null
      ? Math.max(0, 72 - rawMetrics.tightestExamGapHours) / 18
      : 0);
  const conflictSignal =
    rawMetrics.classConflictCount * 4 + rawMetrics.commitmentConflictCount * 2.5;

  const breakdown: ScoreBreakdown = {
    courseIntensity: scale(courseIntensitySignal, 4.5, 12),
    workloadIntensity: scale(workloadSignal, 12, 34),
    dailyBalance: scale(dailyBalanceSignal, 1.5, 10),
    scheduleFriction: scale(scheduleFrictionSignal, 1, 8),
    commitmentPressure: scale(commitmentSignal, 2, 11),
    examPressure: scale(examSignal, 1, 9),
    conflictPressure: scale(conflictSignal, 0.5, 6),
  };

  let stressScore =
    breakdown.courseIntensity * 0.14 +
    breakdown.workloadIntensity * 0.24 +
    breakdown.dailyBalance * 0.18 +
    breakdown.scheduleFriction * 0.12 +
    breakdown.commitmentPressure * 0.11 +
    breakdown.examPressure * 0.11 +
    breakdown.conflictPressure * 0.1;

  if (rawMetrics.classConflictCount > 0) {
    stressScore = Math.max(stressScore, 78 + rawMetrics.classConflictCount * 8);
  }

  if (rawMetrics.commitmentConflictCount > 0) {
    stressScore += 4 + rawMetrics.commitmentConflictCount * 3;
  }

  const clamped = Math.round(clamp(stressScore, 0, 100));

  return {
    stressScore: clamped,
    stressLabel: getStressTone(clamped),
    scoreBreakdown: breakdown,
  };
}
