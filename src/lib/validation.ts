import {
  CommitmentCategory,
  Course,
  Day,
  Difficulty,
  RequirementType,
} from "@/lib/types";

export interface CourseDraft {
  name: string;
  meetingDays: Day[];
  startTime: string;
  endTime: string;
  workloadHours: number;
  difficulty: Difficulty;
  requirement: RequirementType;
  deadlines: Array<{ title: string; date: string }>;
}

export interface CommitmentDraft {
  title: string;
  category: CommitmentCategory;
  meetingDays: Day[];
  startTime: string;
  endTime: string;
}

export type ValidationErrors = Record<string, string>;

function isValidTime(time: string) {
  return /^\d{2}:\d{2}$/.test(time);
}

export function validateCourseDraft(draft: CourseDraft, courses: Course[]): ValidationErrors {
  const errors: ValidationErrors = {};

  if (!draft.name.trim()) {
    errors.name = "Course name is required.";
  } else if (
    courses.some(
      (course) => course.name.trim().toLowerCase() === draft.name.trim().toLowerCase(),
    )
  ) {
    errors.name = "A course with this name already exists.";
  }

  if (draft.meetingDays.length === 0) {
    errors.meetingDays = "Choose at least one meeting day.";
  }

  if (!isValidTime(draft.startTime)) {
    errors.startTime = "Enter a valid start time.";
  }

  if (!isValidTime(draft.endTime)) {
    errors.endTime = "Enter a valid end time.";
  }

  if (
    isValidTime(draft.startTime) &&
    isValidTime(draft.endTime) &&
    draft.startTime >= draft.endTime
  ) {
    errors.endTime = "End time must be after the start time.";
  }

  if (Number.isNaN(draft.workloadHours) || draft.workloadHours <= 0 || draft.workloadHours > 40) {
    errors.workloadHours = "Use a weekly workload between 1 and 40 hours.";
  }

  const invalidDeadline = draft.deadlines.find(
    (deadline) =>
      Boolean(deadline.title.trim()) !== Boolean(deadline.date) ||
      (deadline.date && Number.isNaN(new Date(`${deadline.date}T12:00:00`).getTime())),
  );

  if (invalidDeadline) {
    errors.deadlines = "Each deadline needs both a label and a valid date.";
  }

  return errors;
}

export function validateCommitmentDraft(draft: CommitmentDraft): ValidationErrors {
  const errors: ValidationErrors = {};

  if (!draft.title.trim()) {
    errors.title = "Commitment name is required.";
  }

  if (draft.meetingDays.length === 0) {
    errors.meetingDays = "Choose at least one day.";
  }

  if (!isValidTime(draft.startTime)) {
    errors.startTime = "Enter a valid start time.";
  }

  if (!isValidTime(draft.endTime)) {
    errors.endTime = "Enter a valid end time.";
  }

  if (
    isValidTime(draft.startTime) &&
    isValidTime(draft.endTime) &&
    draft.startTime >= draft.endTime
  ) {
    errors.endTime = "End time must be after the start time.";
  }

  return errors;
}
