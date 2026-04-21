export const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;
export const PLAN_IDS = ["planA", "planB", "planC"] as const;

export type Day = (typeof DAYS)[number];
export type Difficulty = "easy" | "medium" | "hard";
export type RequirementType = "required" | "elective";
export type CommitmentCategory =
  | "job"
  | "club"
  | "exercise"
  | "personal"
  | "sleep"
  | "other";
export type PlanId = (typeof PLAN_IDS)[number];
export type Severity = "low" | "medium" | "high";
export type StressLabel = "light" | "balanced" | "intense" | "overload risk";

export interface Deadline {
  id: string;
  title: string;
  date: string;
}

export interface Course {
  id: string;
  name: string;
  meetingDays: Day[];
  startTime: string;
  endTime: string;
  workloadHours: number;
  difficulty: Difficulty;
  deadlines: Deadline[];
  requirement: RequirementType;
  color: string;
}

export interface Commitment {
  id: string;
  title: string;
  category: CommitmentCategory;
  meetingDays: Day[];
  startTime: string;
  endTime: string;
  color: string;
}

export interface Preferences {
  sleepStart: string;
  sleepEnd: string;
  maxStudyHoursPerDay: number;
  maxClassesPerDay: number;
}

export interface Plan {
  id: PlanId;
  name: string;
  profileLabel?: string;
  description?: string;
  courseIds: string[];
}

export interface PlannerState {
  courses: Course[];
  commitments: Commitment[];
  preferences: Preferences;
  plans: Plan[];
  activePlanId: PlanId;
}

export interface ScheduleBlock {
  id: string;
  sourceId: string;
  title: string;
  day: Day;
  startTime: string;
  endTime: string;
  startMinutes: number;
  endMinutes: number;
  durationHours: number;
  kind: "course" | "commitment";
  color: string;
}

export interface ConflictPair {
  id: string;
  day: Day;
  firstTitle: string;
  secondTitle: string;
  startTime: string;
  endTime: string;
}

export interface WarningItem {
  id: string;
  severity: Severity;
  title: string;
  detail: string;
}

export interface DayLoad {
  day: Day;
  classHours: number;
  studyHours: number;
  commitmentHours: number;
  totalHours: number;
  classCount: number;
}

export interface ScoreBreakdown {
  classLoad: number;
  studyLoad: number;
  heavyDayPressure: number;
  backToBackPressure: number;
  gapInefficiency: number;
  commitmentPressure: number;
  examClustering: number;
}

export interface ScheduleMetrics {
  weeklyClassHours: number;
  weeklyStudyHours: number;
  weeklyCommitmentHours: number;
  classConflictCount: number;
  commitmentConflictCount: number;
  backToBackCount: number;
  longGapCount: number;
  totalGapHours: number;
  busiestDay: Day;
  heavyDayCount: number;
  examClusterPairs: number;
  tightestExamGapHours: number | null;
  maxStudyOverageDays: number;
  maxClassesOverageDays: number;
  sleepConflictCount: number;
  stressScore: number;
  stressLabel: StressLabel;
}

export interface PlanAnalysis {
  planId: PlanId;
  planName: string;
  planProfileLabel?: string;
  planDescription?: string;
  courses: Course[];
  classBlocks: ScheduleBlock[];
  commitmentBlocks: ScheduleBlock[];
  dayLoads: DayLoad[];
  classConflicts: ConflictPair[];
  commitmentConflicts: ConflictPair[];
  warnings: WarningItem[];
  recommendations: string[];
  metrics: ScheduleMetrics;
  scoreBreakdown: ScoreBreakdown;
}
