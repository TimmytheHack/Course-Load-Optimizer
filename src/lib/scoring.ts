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
  weeklyClassHours: number;
  weeklyStudyHours: number;
  weeklyCommitmentHours: number;
  classConflictCount: number;
  commitmentConflictCount: number;
  backToBackCount: number;
  longGapCount: number;
  totalGapHours: number;
  heavyDayCount: number;
  examClusterPairs: number;
  tightestExamGapHours: number | null;
  maxStudyOverageDays: number;
  maxClassesOverageDays: number;
  sleepConflictCount: number;
}) {
  const breakdown: ScoreBreakdown = {
    classLoad: scale(rawMetrics.weeklyClassHours, 9, 18),
    studyLoad: scale(rawMetrics.weeklyStudyHours, 12, 32),
    heavyDayPressure: scale(
      rawMetrics.heavyDayCount + rawMetrics.maxStudyOverageDays + rawMetrics.maxClassesOverageDays,
      1,
      6,
    ),
    backToBackPressure: scale(rawMetrics.backToBackCount, 1, 6),
    gapInefficiency: scale(rawMetrics.longGapCount + rawMetrics.totalGapHours / 3, 0.5, 5),
    commitmentPressure: scale(
      rawMetrics.weeklyCommitmentHours / 4 +
        rawMetrics.commitmentConflictCount * 1.5 +
        rawMetrics.sleepConflictCount,
      2,
      10,
    ),
    examClustering: scale(
      rawMetrics.examClusterPairs * 2 +
        (rawMetrics.tightestExamGapHours !== null ? Math.max(0, 72 - rawMetrics.tightestExamGapHours) / 24 : 0),
      1,
      8,
    ),
  };

  let stressScore =
    breakdown.classLoad * 0.2 +
    breakdown.studyLoad * 0.25 +
    breakdown.heavyDayPressure * 0.15 +
    breakdown.backToBackPressure * 0.1 +
    breakdown.gapInefficiency * 0.1 +
    breakdown.commitmentPressure * 0.1 +
    breakdown.examClustering * 0.1;

  stressScore += rawMetrics.classConflictCount * 12;
  stressScore += rawMetrics.commitmentConflictCount * 4;

  const clamped = Math.round(clamp(stressScore, 0, 100));

  return {
    stressScore: clamped,
    stressLabel: getStressTone(clamped),
    scoreBreakdown: breakdown,
  };
}
