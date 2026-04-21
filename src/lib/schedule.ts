import {
  Commitment,
  ConflictPair,
  Course,
  Day,
  DAYS,
  Plan,
  Preferences,
  ScheduleBlock,
} from "@/lib/types";
import { clamp, roundTo } from "@/lib/utils";

export function timeToMinutes(time: string) {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

export function getDurationHours(startTime: string, endTime: string) {
  return (timeToMinutes(endTime) - timeToMinutes(startTime)) / 60;
}

export function expandCourseBlocks(course: Course): ScheduleBlock[] {
  return course.meetingDays.map((day) => ({
    id: `${course.id}-${day}`,
    sourceId: course.id,
    title: course.name,
    day,
    sourceDays: course.meetingDays,
    startTime: course.startTime,
    endTime: course.endTime,
    startMinutes: timeToMinutes(course.startTime),
    endMinutes: timeToMinutes(course.endTime),
    durationHours: getDurationHours(course.startTime, course.endTime),
    kind: "course" as const,
    color: course.color,
    workloadHours: course.workloadHours,
    difficulty: course.difficulty,
    requirement: course.requirement,
    deadlines: course.deadlines,
  }));
}

export function expandCommitmentBlocks(commitment: Commitment): ScheduleBlock[] {
  return commitment.meetingDays.map((day) => ({
    id: `${commitment.id}-${day}`,
    sourceId: commitment.id,
    title: commitment.title,
    day,
    sourceDays: commitment.meetingDays,
    startTime: commitment.startTime,
    endTime: commitment.endTime,
    startMinutes: timeToMinutes(commitment.startTime),
    endMinutes: timeToMinutes(commitment.endTime),
    durationHours: getDurationHours(commitment.startTime, commitment.endTime),
    kind: "commitment" as const,
    color: commitment.color,
    category: commitment.category,
  }));
}

export function findOverlaps(firstBlocks: ScheduleBlock[], secondBlocks = firstBlocks) {
  const overlaps: ConflictPair[] = [];
  const isSameCollection = firstBlocks === secondBlocks;

  for (let index = 0; index < firstBlocks.length; index += 1) {
    const block = firstBlocks[index];

    for (
      let compareIndex = isSameCollection ? index + 1 : 0;
      compareIndex < secondBlocks.length;
      compareIndex += 1
    ) {
      const compare = secondBlocks[compareIndex];

      if (block.day !== compare.day) {
        continue;
      }

      if (block.sourceId === compare.sourceId && block.kind === compare.kind) {
        continue;
      }

      if (block.startMinutes < compare.endMinutes && compare.startMinutes < block.endMinutes) {
        overlaps.push({
          id: `${block.id}-${compare.id}`,
          day: block.day,
          firstTitle: block.title,
          secondTitle: compare.title,
          startTime: block.startMinutes > compare.startMinutes ? block.startTime : compare.startTime,
          endTime: block.endMinutes < compare.endMinutes ? block.endTime : compare.endTime,
        });
      }
    }
  }

  return overlaps;
}

function getDayBlocks(blocks: ScheduleBlock[], day: Day, kind?: ScheduleBlock["kind"]) {
  return blocks
    .filter((block) => block.day === day && (!kind || block.kind === kind))
    .sort((left, right) => left.startMinutes - right.startMinutes);
}

function distributeStudyHours(courses: Course[]) {
  const perDay: Record<Day, number> = {
    Mon: 0,
    Tue: 0,
    Wed: 0,
    Thu: 0,
    Fri: 0,
    Sat: 0,
    Sun: 0,
  };

  courses.forEach((course) => {
    const targets: Day[] =
      course.meetingDays.length > 0 ? course.meetingDays : ["Mon", "Wed", "Fri"];
    const chunk = course.workloadHours / targets.length;

    targets.forEach((day) => {
      perDay[day] += chunk;
    });
  });

  return perDay;
}

function countBackToBack(courseBlocks: ScheduleBlock[]) {
  let count = 0;

  DAYS.forEach((day) => {
    const blocks = getDayBlocks(courseBlocks, day, "course");
    blocks.forEach((block, index) => {
      const next = blocks[index + 1];
      if (!next) {
        return;
      }

      const gapMinutes = next.startMinutes - block.endMinutes;
      if (gapMinutes >= 0 && gapMinutes <= 15) {
        count += 1;
      }
    });
  });

  return count;
}

function getGapMetrics(courseBlocks: ScheduleBlock[]) {
  let longGapCount = 0;
  let totalGapHours = 0;

  DAYS.forEach((day) => {
    const blocks = getDayBlocks(courseBlocks, day, "course");
    blocks.forEach((block, index) => {
      const next = blocks[index + 1];
      if (!next) {
        return;
      }

      const gapMinutes = next.startMinutes - block.endMinutes;
      if (gapMinutes >= 90) {
        longGapCount += 1;
        totalGapHours += gapMinutes / 60;
      }
    });
  });

  return {
    longGapCount,
    totalGapHours: roundTo(totalGapHours),
  };
}

function getExamClusterMetrics(courses: Course[]) {
  const deadlines = courses.flatMap((course) =>
    course.deadlines.map((deadline) => ({
      courseName: course.name,
      date: deadline.date,
      title: deadline.title,
    })),
  );

  let clusterPairs = 0;
  let tightestHours: number | null = null;

  for (let index = 0; index < deadlines.length; index += 1) {
    for (let compareIndex = index + 1; compareIndex < deadlines.length; compareIndex += 1) {
      const firstDate = new Date(`${deadlines[index].date}T12:00:00`);
      const secondDate = new Date(`${deadlines[compareIndex].date}T12:00:00`);

      if (Number.isNaN(firstDate.getTime()) || Number.isNaN(secondDate.getTime())) {
        continue;
      }

      const hoursApart = Math.abs(firstDate.getTime() - secondDate.getTime()) / (1000 * 60 * 60);

      if (hoursApart <= 72) {
        clusterPairs += 1;
        tightestHours =
          tightestHours === null ? hoursApart : Math.min(tightestHours, hoursApart);
      }
    }
  }

  return {
    examClusterPairs: clusterPairs,
    tightestExamGapHours: tightestHours === null ? null : roundTo(tightestHours),
  };
}

function isSleepConflict(block: ScheduleBlock, preferences: Preferences) {
  const sleepStart = timeToMinutes(preferences.sleepStart);
  const sleepEnd = timeToMinutes(preferences.sleepEnd);

  if (sleepStart < sleepEnd) {
    return block.startMinutes < sleepEnd && block.endMinutes > sleepStart;
  }

  return block.startMinutes < sleepEnd || block.endMinutes > sleepStart;
}

export function analyzePlanSchedule(
  plan: Plan,
  allCourses: Course[],
  commitments: Commitment[],
  preferences: Preferences,
) {
  const courses = allCourses.filter((course) => plan.courseIds.includes(course.id));
  const classBlocks = courses.flatMap(expandCourseBlocks);
  const commitmentBlocks = commitments.flatMap(expandCommitmentBlocks);
  const allBlocks = [...classBlocks, ...commitmentBlocks];
  const classConflicts = findOverlaps(classBlocks);
  const commitmentConflicts = findOverlaps(classBlocks, commitmentBlocks);
  const studyHoursByDay = distributeStudyHours(courses);
  const { longGapCount, totalGapHours } = getGapMetrics(classBlocks);
  const backToBackCount = countBackToBack(classBlocks);
  const { examClusterPairs, tightestExamGapHours } = getExamClusterMetrics(courses);

  const dayLoads = DAYS.map((day) => {
    const classDayBlocks = getDayBlocks(classBlocks, day, "course");
    const commitmentDayBlocks = getDayBlocks(commitmentBlocks, day, "commitment");
    const classHours = classDayBlocks.reduce((sum, block) => sum + block.durationHours, 0);
    const commitmentHours = commitmentDayBlocks.reduce((sum, block) => sum + block.durationHours, 0);
    const studyHours = studyHoursByDay[day];
    const totalHours = classHours + commitmentHours + studyHours;

    return {
      day,
      classHours: roundTo(classHours),
      commitmentHours: roundTo(commitmentHours),
      studyHours: roundTo(studyHours),
      totalHours: roundTo(totalHours),
      classCount: classDayBlocks.length,
    };
  });

  const busiestDay = [...dayLoads].sort((left, right) => right.totalHours - left.totalHours)[0]?.day ?? "Mon";
  const busiestDayHours =
    [...dayLoads].sort((left, right) => right.totalHours - left.totalHours)[0]?.totalHours ?? 0;
  const heavyDayCount = dayLoads.filter(
    (day) =>
      day.totalHours >= 10 ||
      day.classCount > preferences.maxClassesPerDay ||
      day.studyHours > preferences.maxStudyHoursPerDay,
  ).length;
  const maxStudyOverageDays = dayLoads.filter(
    (day) => day.studyHours > preferences.maxStudyHoursPerDay,
  ).length;
  const maxClassesOverageDays = dayLoads.filter(
    (day) => day.classCount > preferences.maxClassesPerDay,
  ).length;
  const weeklyClassHours = roundTo(classBlocks.reduce((sum, block) => sum + block.durationHours, 0));
  const weeklyCommitmentHours = roundTo(
    commitmentBlocks.reduce((sum, block) => sum + block.durationHours, 0),
  );
  const weeklyStudyHours = roundTo(courses.reduce((sum, course) => sum + course.workloadHours, 0));
  const courseCount = courses.length;
  const hardCourseCount = courses.filter((course) => course.difficulty === "hard").length;
  const deadlineCount = courses.reduce((sum, course) => sum + course.deadlines.length, 0);
  const sleepConflictCount = allBlocks.filter((block) => isSleepConflict(block, preferences)).length;

  return {
    courses,
    classBlocks,
    commitmentBlocks,
    dayLoads,
    classConflicts,
    commitmentConflicts,
    metrics: {
      courseCount,
      hardCourseCount,
      deadlineCount,
      weeklyClassHours,
      weeklyStudyHours,
      weeklyCommitmentHours,
      classConflictCount: classConflicts.length,
      commitmentConflictCount: commitmentConflicts.length,
      backToBackCount,
      longGapCount,
      totalGapHours,
      busiestDay,
      busiestDayHours,
      heavyDayCount,
      examClusterPairs,
      tightestExamGapHours,
      maxStudyOverageDays,
      maxClassesOverageDays,
      sleepConflictCount,
    },
  };
}

export function getTimetableWindow(blocks: ScheduleBlock[]) {
  if (blocks.length === 0) {
    return { start: 8 * 60, end: 21 * 60 };
  }

  const earliest = Math.min(...blocks.map((block) => block.startMinutes));
  const latest = Math.max(...blocks.map((block) => block.endMinutes));
  const BUFFER_MINUTES = 30;
  const snapDownToHalfHour = (minutes: number) => Math.floor(minutes / 30) * 30;
  const snapUpToHalfHour = (minutes: number) => Math.ceil(minutes / 30) * 30;

  return {
    start: clamp(snapDownToHalfHour(earliest - BUFFER_MINUTES), 6 * 60, 10 * 60 + 30),
    end: clamp(snapUpToHalfHour(latest + BUFFER_MINUTES), 17 * 60 + 30, 23 * 60),
  };
}
