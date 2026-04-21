import { PlanAnalysis, WarningItem } from "@/lib/types";
import { formatHours } from "@/lib/utils";

export function buildWarnings(analysis: PlanAnalysis): WarningItem[] {
  const { metrics } = analysis;
  const warnings: WarningItem[] = [];

  if (metrics.classConflictCount > 0) {
    warnings.push({
      id: "class-conflicts",
      severity: "high",
      title: "Class conflict",
      detail: `${metrics.classConflictCount} overlapping class block${metrics.classConflictCount > 1 ? "s" : ""} make this plan impossible without changes.`,
    });
  }

  if (metrics.commitmentConflictCount > 0) {
    warnings.push({
      id: "commitment-conflicts",
      severity: "high",
      title: "Commitment overlap",
      detail: `${metrics.commitmentConflictCount} class block${metrics.commitmentConflictCount > 1 ? "s" : ""} collide with work or personal commitments.`,
    });
  }

  if (metrics.backToBackCount >= 3) {
    warnings.push({
      id: "back-to-back",
      severity: "medium",
      title: "Compressed transitions",
      detail: `${metrics.backToBackCount} back-to-back transitions leave very little recovery time between classes.`,
    });
  }

  if (metrics.longGapCount >= 2) {
    warnings.push({
      id: "long-gaps",
      severity: "medium",
      title: "Inefficient gaps",
      detail: `${metrics.longGapCount} long gaps create dead time between classes during the week.`,
    });
  }

  if (metrics.examClusterPairs > 0) {
    warnings.push({
      id: "exam-clusters",
      severity: "high",
      title: "Assessment clustering",
      detail: `${metrics.examClusterPairs} assessment pair${metrics.examClusterPairs > 1 ? "s" : ""} land inside the same 72-hour window.`,
    });
  }

  if (metrics.heavyDayCount >= 2) {
    warnings.push({
      id: "heavy-days",
      severity: metrics.heavyDayCount >= 4 ? "high" : "medium",
      title: "Heavy day concentration",
      detail: `${metrics.heavyDayCount} day${metrics.heavyDayCount > 1 ? "s" : ""} cross the heavy-day threshold.`,
    });
  }

  if (metrics.sleepConflictCount > 0) {
    warnings.push({
      id: "sleep-pressure",
      severity: "medium",
      title: "Sleep window pressure",
      detail: `${metrics.sleepConflictCount} scheduled block${metrics.sleepConflictCount > 1 ? "s" : ""} push into the preferred sleep window.`,
    });
  }

  return warnings;
}

export function buildRecommendations(analysis: PlanAnalysis) {
  const { metrics, warnings } = analysis;
  const recommendations: string[] = [];

  if (metrics.stressScore >= 81) {
    recommendations.push(
      `This plan trends overloaded because it combines ${formatHours(metrics.weeklyClassHours)} of class time with ${formatHours(metrics.weeklyStudyHours)} of expected study time.`,
    );
  } else if (metrics.stressScore >= 61) {
    recommendations.push(
      `This plan is workable but intense. The overall pressure comes from concentrated heavy days and limited recovery time.`,
    );
  } else if (metrics.stressScore >= 31) {
    recommendations.push(
      `This plan looks balanced overall. Weekly workload stays in a realistic range and the schedule is easier to sustain.`,
    );
  } else {
    recommendations.push(
      `This is the lightest option. It keeps workload manageable, but you may have room to add one more commitment or elective if needed.`,
    );
  }

  if (metrics.examClusterPairs > 0) {
    recommendations.push(
      `The sharpest pressure point is assessment timing. Move one course or prepare earlier because key deadlines stack within a three-day span.`,
    );
  }

  if (metrics.commitmentConflictCount > 0) {
    recommendations.push(
      `Work or extracurricular blocks currently overlap classes. Shift the commitment timing or swap the conflicting course before registration.`,
    );
  }

  if (metrics.longGapCount >= 2) {
    recommendations.push(
      `The schedule wastes time between classes. Replacing one midday section could reduce campus downtime and make study blocks easier to protect.`,
    );
  }

  if (metrics.backToBackCount >= 3) {
    recommendations.push(
      `Several classes run back-to-back. Try moving one section later in the day to create a buffer for meals, transit, or reset time.`,
    );
  }

  if (metrics.maxStudyOverageDays > 0) {
    recommendations.push(
      `Your estimated study load exceeds the daily target on ${metrics.maxStudyOverageDays} day${metrics.maxStudyOverageDays > 1 ? "s" : ""}. Consider dropping one high-workload course.`,
    );
  }

  if (warnings.length === 0) {
    recommendations.push(
      `No major warning flags were detected. If you keep this plan, focus on protecting the busiest day: ${metrics.busiestDay}.`,
    );
  }

  return recommendations.slice(0, 4);
}

export function summarizeBestPlan(analyses: PlanAnalysis[]) {
  const ranked = [...analyses].sort((left, right) => {
    if (left.metrics.classConflictCount !== right.metrics.classConflictCount) {
      return left.metrics.classConflictCount - right.metrics.classConflictCount;
    }

    if (left.metrics.commitmentConflictCount !== right.metrics.commitmentConflictCount) {
      return left.metrics.commitmentConflictCount - right.metrics.commitmentConflictCount;
    }

    return left.metrics.stressScore - right.metrics.stressScore;
  });

  const best = ranked[0];
  if (!best) {
    return null;
  }

  const reasons: string[] = [];

  if (best.metrics.classConflictCount === 0 && best.metrics.commitmentConflictCount === 0) {
    reasons.push("it avoids direct scheduling conflicts");
  }

  if (best.metrics.stressScore <= 60) {
    reasons.push("its workload stays in a sustainable range");
  }

  if (best.metrics.examClusterPairs === 0) {
    reasons.push("deadlines are better distributed");
  }

  return {
    planId: best.planId,
    planName: best.planName,
    summary: `${best.planName} is the best overall fit because ${reasons.slice(0, 2).join(" and ") || "it has the lowest overall pressure"}.`,
  };
}
