import { PlanAnalysis, WarningItem } from "@/lib/types";
import { formatHours, formatTimeLabel } from "@/lib/utils";

export const DRIVER_LABELS = {
  courseIntensity: "course load",
  workloadIntensity: "weekly workload",
  dailyBalance: "day balance",
  scheduleFriction: "schedule shape",
  commitmentPressure: "outside commitments",
  examPressure: "deadline timing",
  conflictPressure: "conflicts",
} as const;

export type ScoreDriverKey = keyof PlanAnalysis["scoreBreakdown"];

export function getRankedScoreDrivers(analysis: PlanAnalysis) {
  return Object.entries(analysis.scoreBreakdown)
    .map(([key, value]) => ({
      key: key as ScoreDriverKey,
      value,
    }))
    .sort((left, right) => right.value - left.value);
}

export function describeScoreDriver(analysis: PlanAnalysis, key: ScoreDriverKey) {
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

      if (metrics.backToBackCount > 0) {
        return `${metrics.backToBackCount} back-to-back transition${metrics.backToBackCount > 1 ? "s" : ""}`;
      }

      return "very little wasted time between classes";
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
  const { metrics, classConflicts, commitmentConflicts } = analysis;
  const warnings: WarningItem[] = [];
  const firstClassConflict = classConflicts[0];
  const firstCommitmentConflict = commitmentConflicts[0];

  if (metrics.classConflictCount > 0) {
    warnings.push({
      id: "class-conflicts",
      severity: "high",
      title: "Class conflict",
      detail: firstClassConflict
        ? `${metrics.classConflictCount} overlapping class block${metrics.classConflictCount > 1 ? "s" : ""} make this plan impossible without changes. The first conflict is on ${firstClassConflict.day} between ${firstClassConflict.firstTitle} and ${firstClassConflict.secondTitle}.`
        : `${metrics.classConflictCount} overlapping class block${metrics.classConflictCount > 1 ? "s" : ""} make this plan impossible without changes.`,
      action: firstClassConflict
        ? `Change or remove one of the ${firstClassConflict.day} classes around ${formatTimeLabel(firstClassConflict.startTime)} to ${formatTimeLabel(firstClassConflict.endTime)} first.`
        : "Move or remove one of the overlapping classes first.",
    });
  }

  if (metrics.commitmentConflictCount > 0) {
    warnings.push({
      id: "commitment-conflicts",
      severity: "high",
      title: "Commitment overlap",
      detail: firstCommitmentConflict
        ? `${metrics.commitmentConflictCount} class block${metrics.commitmentConflictCount > 1 ? "s" : ""} collide with outside commitments. The first overlap is on ${firstCommitmentConflict.day} between ${firstCommitmentConflict.firstTitle} and ${firstCommitmentConflict.secondTitle}.`
        : `${metrics.commitmentConflictCount} class block${metrics.commitmentConflictCount > 1 ? "s" : ""} collide with outside commitments.`,
      action: firstCommitmentConflict
        ? `Adjust the ${firstCommitmentConflict.secondTitle} block or swap that class section first.`
        : "Adjust the overlapping commitment time or swap the conflicting class first.",
    });
  }

  if (metrics.backToBackCount >= 3) {
    warnings.push({
      id: "back-to-back",
      severity: "medium",
      title: "Compressed transitions",
      detail: `${metrics.backToBackCount} back-to-back transitions leave very little time to move, eat, or reset between classes.`,
      action: "Start by moving one tightly packed section to open up a buffer in the busiest part of the week.",
    });
  }

  if (metrics.longGapCount >= 2) {
    warnings.push({
      id: "long-gaps",
      severity: "medium",
      title: "Inefficient gaps",
      detail: `${metrics.longGapCount} long gaps create dead time between classes and make the week harder to use efficiently.`,
      action: "Try clustering classes on the same days or shifting one section to shorten the longest gap first.",
    });
  }

  if (metrics.examClusterPairs > 0) {
    warnings.push({
      id: "exam-clusters",
      severity: "high",
      title: "Assessment clustering",
      detail: `${metrics.examClusterPairs} assessment pair${metrics.examClusterPairs > 1 ? "s" : ""} land inside the same 72-hour window, which can turn one week into a crunch point.`,
      action: "If you can, swap out one deadline-heavy course before changing lighter parts of the plan.",
    });
  }

  if (metrics.heavyDayCount >= 2) {
    warnings.push({
      id: "heavy-days",
      severity: metrics.heavyDayCount >= 4 ? "high" : "medium",
      title: "Heavy day concentration",
      detail: `${metrics.heavyDayCount} day${metrics.heavyDayCount > 1 ? "s" : ""} cross the heavy-day threshold, so the pressure is stacking onto too few days.`,
      action: `Start with ${metrics.busiestDay} and move one demanding class or study-heavy course off that day.`,
    });
  }

  if (metrics.sleepConflictCount > 0) {
    warnings.push({
      id: "sleep-pressure",
      severity: "medium",
      title: "Sleep window pressure",
      detail: `${metrics.sleepConflictCount} scheduled block${metrics.sleepConflictCount > 1 ? "s" : ""} cut into the sleep window you set in preferences.`,
      action: "Adjust the latest or earliest recurring block first, or loosen the preference if that limit is unrealistic for this semester.",
    });
  }

  return warnings;
}

export function buildRecommendations(analysis: PlanAnalysis) {
  const { metrics, warnings } = analysis;
  const recommendations: string[] = [];
  const topDrivers = getRankedScoreDrivers(analysis);
  const topDriver = topDrivers[0];
  const primaryDriverText = topDriver ? describeScoreDriver(analysis, topDriver.key) : null;

  if (metrics.stressScore >= 81) {
    recommendations.push("This plan is overloaded overall.");
  } else if (metrics.stressScore >= 61) {
    recommendations.push("This plan could work, but it is heavy overall.");
  } else if (metrics.stressScore >= 31) {
    recommendations.push("This plan looks sustainable overall.");
  } else {
    recommendations.push("This is the lightest option overall.");
  }

  recommendations.push(
    `The main pressure comes from ${primaryDriverText ?? "overall workload"}.`,
  );

  if (metrics.classConflictCount > 0) {
    recommendations.push(
      "Move or drop one of the overlapping class sections first.",
    );
  } else if (metrics.commitmentConflictCount > 0) {
    recommendations.push(
      "Adjust the overlapping commitment block or swap that class section first.",
    );
  } else if (metrics.examClusterPairs > 0) {
    recommendations.push(
      "Separate one deadline-heavy course from the tightest cluster first.",
    );
  } else if (metrics.maxStudyOverageDays > 0 || metrics.heavyDayCount >= 2) {
    recommendations.push(
      `Lighten ${metrics.busiestDay} first, or move one demanding course off that day.`,
    );
  } else if (metrics.longGapCount >= 2 || metrics.backToBackCount >= 3) {
    if (metrics.longGapCount >= 2) {
      recommendations.push(
        `Cluster ${metrics.busiestDay} more tightly to cut down long gaps first.`,
      );
    } else {
      recommendations.push(
        "Add one buffer between the tightest class blocks first.",
      );
    }
  } else if (metrics.weeklyCommitmentHours >= 12) {
    recommendations.push(
      "Protect more time around work and other commitments first.",
    );
  } else if (warnings.length === 0) {
    recommendations.push(
      `Keep this version and protect ${metrics.busiestDay} as your anchor day.`,
    );
  } else {
    recommendations.push(
      `Reduce ${topDriver ? DRIVER_LABELS[topDriver.key] : "overall pressure"} first.`,
    );
  }

  return recommendations.slice(0, 3);
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

  const minHeavyDays = Math.min(...analyses.map((analysis) => analysis.metrics.heavyDayCount));
  const minExamClusters = Math.min(...analyses.map((analysis) => analysis.metrics.examClusterPairs));
  const minCommitmentConflicts = Math.min(
    ...analyses.map((analysis) => analysis.metrics.commitmentConflictCount),
  );
  const reasons: string[] = [];

  if (best.metrics.classConflictCount === 0) {
    reasons.push("No class conflicts");
  }

  reasons.push(`Manageable study load at ${formatHours(best.metrics.weeklyStudyHours)} / week`);

  if (best.metrics.heavyDayCount === 0) {
    reasons.push("No heavy days across the week");
  } else if (best.metrics.heavyDayCount === minHeavyDays) {
    reasons.push(
      `${best.metrics.heavyDayCount} heavy day${
        best.metrics.heavyDayCount > 1 ? "s" : ""
      }, fewer than the other options`,
    );
  }

  if (best.metrics.examClusterPairs === 0) {
    reasons.push("Low exam clustering with no stacked deadlines");
  } else if (best.metrics.examClusterPairs === minExamClusters) {
    reasons.push(
      `${best.metrics.examClusterPairs} clustered deadline pair${
        best.metrics.examClusterPairs > 1 ? "s" : ""
      }, lower than the other options`,
    );
  }

  if (best.metrics.commitmentConflictCount === 0) {
    reasons.push("Better fit with outside commitments");
  } else if (best.metrics.commitmentConflictCount === minCommitmentConflicts) {
    reasons.push(
      `${best.metrics.commitmentConflictCount} overlap${
        best.metrics.commitmentConflictCount > 1 ? "s" : ""
      } with outside commitments, better than the other options`,
    );
  }

  if (reasons.length < 3) {
    reasons.push(`Lowest stress score of the three at ${best.metrics.stressScore}`);
  }

  return {
    planId: best.planId,
    planName: best.planName,
    title: `Recommended: ${best.planName}`,
    description: `Best balance of workload, conflicts, and deadline pressure at a stress score of ${best.metrics.stressScore}.`,
    reasons: reasons.slice(0, 4),
  };
}
