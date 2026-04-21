import { PlanAnalysis, WarningItem } from "@/lib/types";
import { formatHours } from "@/lib/utils";

const DRIVER_LABELS = {
  courseIntensity: "course intensity",
  workloadIntensity: "workload intensity",
  dailyBalance: "day-to-day balance",
  scheduleFriction: "schedule friction",
  commitmentPressure: "commitment pressure",
  examPressure: "exam pressure",
  conflictPressure: "conflict risk",
} as const;

function getTopDrivers(analysis: PlanAnalysis) {
  return Object.entries(analysis.scoreBreakdown)
    .map(([key, value]) => ({
      key: key as keyof PlanAnalysis["scoreBreakdown"],
      value,
    }))
    .sort((left, right) => right.value - left.value);
}

function describeDriver(analysis: PlanAnalysis, key: keyof PlanAnalysis["scoreBreakdown"]) {
  const { metrics } = analysis;

  switch (key) {
    case "courseIntensity":
      if (metrics.hardCourseCount > 0) {
        return `${metrics.courseCount} courses with ${metrics.hardCourseCount} hard course${metrics.hardCourseCount > 1 ? "s" : ""}`;
      }

      return `${metrics.courseCount} total courses`;
    case "workloadIntensity":
      return `${formatHours(metrics.weeklyStudyHours)} of expected study time each week`;
    case "dailyBalance":
      return `${metrics.heavyDayCount} heavy day${metrics.heavyDayCount > 1 ? "s" : ""} and a busiest day that reaches ${formatHours(metrics.busiestDayHours)}`;
    case "scheduleFriction":
      if (metrics.longGapCount > 0 && metrics.backToBackCount > 0) {
        return `${metrics.backToBackCount} tight transitions plus ${metrics.longGapCount} long gap${metrics.longGapCount > 1 ? "s" : ""}`;
      }

      if (metrics.longGapCount > 0) {
        return `${metrics.longGapCount} long gap${metrics.longGapCount > 1 ? "s" : ""} across the week`;
      }

      return `${metrics.backToBackCount} back-to-back transition${metrics.backToBackCount > 1 ? "s" : ""}`;
    case "commitmentPressure":
      if (metrics.commitmentConflictCount > 0) {
        return `${metrics.commitmentConflictCount} commitment overlap${metrics.commitmentConflictCount > 1 ? "s" : ""} on top of ${formatHours(metrics.weeklyCommitmentHours)} outside class`;
      }

      return `${formatHours(metrics.weeklyCommitmentHours)} of outside commitments`;
    case "examPressure":
      if (metrics.tightestExamGapHours !== null) {
        return `${metrics.examClusterPairs} clustered deadline pair${metrics.examClusterPairs > 1 ? "s" : ""} with the closest only ${metrics.tightestExamGapHours}h apart`;
      }

      return `${metrics.deadlineCount} major deadline${metrics.deadlineCount > 1 ? "s" : ""}`;
    case "conflictPressure":
      if (metrics.classConflictCount > 0) {
        return `${metrics.classConflictCount} direct class conflict${metrics.classConflictCount > 1 ? "s" : ""}`;
      }

      return `${metrics.commitmentConflictCount} overlap${metrics.commitmentConflictCount > 1 ? "s" : ""} with outside commitments`;
    default:
      return DRIVER_LABELS[key];
  }
}

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
  const topDrivers = getTopDrivers(analysis);
  const topDriver = topDrivers[0];
  const secondDriver = topDrivers[1];
  const primaryDriverText = topDriver ? describeDriver(analysis, topDriver.key) : null;
  const secondaryDriverText = secondDriver ? describeDriver(analysis, secondDriver.key) : null;

  if (metrics.stressScore >= 81) {
    recommendations.push(
      `This plan reads as overload risk. The score is being driven most by ${primaryDriverText ?? "overall workload"}${secondaryDriverText ? `, followed by ${secondaryDriverText}` : ""}.`,
    );
  } else if (metrics.stressScore >= 61) {
    recommendations.push(
      `This plan is intense but potentially workable. The main strain comes from ${primaryDriverText ?? "the current workload mix"}${secondaryDriverText ? ` and ${secondaryDriverText}` : ""}.`,
    );
  } else if (metrics.stressScore >= 31) {
    recommendations.push(
      `This plan looks balanced overall. No single stress driver dominates, and the biggest pressure point is still only ${primaryDriverText ?? "moderate"}.`,
    );
  } else {
    recommendations.push(
      `This is the lightest option. Course intensity, weekly study load, and deadline timing all stay relatively controlled.`,
    );
  }

  if (metrics.classConflictCount > 0) {
    recommendations.push(
      `This plan is not realistically runnable until the direct class conflict is removed. That issue alone forces the score near overload territory.`,
    );
  } else if (metrics.examClusterPairs > 0) {
    recommendations.push(
      `Assessment timing is the clearest risk. ${metrics.examClusterPairs} clustered deadline pair${metrics.examClusterPairs > 1 ? "s" : ""} means one bad week could define the whole plan.`,
    );
  } else if (metrics.maxStudyOverageDays > 0 || metrics.heavyDayCount >= 2) {
    recommendations.push(
      `The week gets top-heavy on ${metrics.heavyDayCount} day${metrics.heavyDayCount > 1 ? "s" : ""}, and the busiest day reaches ${formatHours(metrics.busiestDayHours)}. Spreading one demanding course or section would make the plan easier to sustain.`,
    );
  } else if (metrics.longGapCount >= 2 || metrics.backToBackCount >= 3) {
    recommendations.push(
      `The schedule shape is costing you efficiency. ${describeDriver(analysis, "scheduleFriction")} makes it harder to protect meals, transitions, and focused study blocks.`,
    );
  } else if (metrics.commitmentConflictCount > 0 || metrics.weeklyCommitmentHours >= 12) {
    recommendations.push(
      `Outside commitments materially affect this plan. Keep the course list, but adjust work or club timing first so the academic load has enough room to breathe.`,
    );
  }

  if (warnings.length === 0) {
    recommendations.push(
      `No major warning flags were detected. If you keep this plan, protect ${metrics.busiestDay} as your anchor day and avoid adding another hard course on top of it.`,
    );
  } else if (topDriver && topDriver.value >= 55) {
    recommendations.push(
      `If you want to improve this plan without rebuilding it, start with ${DRIVER_LABELS[topDriver.key]}. That is the single biggest contributor to the current score.`,
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
