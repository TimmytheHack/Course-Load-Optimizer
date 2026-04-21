import { Commitment, Course, Plan, PlannerState, Preferences } from "@/lib/types";

const sampleCourses: Course[] = [
  {
    id: "course-cs210",
    name: "CS 210 Algorithms",
    meetingDays: ["Mon", "Wed"],
    startTime: "09:30",
    endTime: "10:45",
    workloadHours: 10,
    difficulty: "hard",
    requirement: "required",
    color: "bg-emerald-300/80 border-emerald-500/60 text-emerald-950",
    deadlines: [
      { id: "cs210-midterm", title: "Midterm", date: "2026-04-29" },
      { id: "cs210-project", title: "Project checkpoint", date: "2026-05-05" },
    ],
  },
  {
    id: "course-ma225",
    name: "MA 225 Linear Algebra",
    meetingDays: ["Tue", "Thu"],
    startTime: "11:00",
    endTime: "12:15",
    workloadHours: 8,
    difficulty: "hard",
    requirement: "required",
    color: "bg-sky-300/80 border-sky-500/60 text-sky-950",
    deadlines: [
      { id: "ma225-quiz", title: "Quiz 4", date: "2026-04-30" },
      { id: "ma225-final", title: "Final exam", date: "2026-05-06" },
    ],
  },
  {
    id: "course-wr150",
    name: "WR 150 Writing Seminar",
    meetingDays: ["Tue", "Thu"],
    startTime: "14:00",
    endTime: "15:15",
    workloadHours: 5,
    difficulty: "medium",
    requirement: "required",
    color: "bg-amber-200/90 border-amber-500/60 text-amber-950",
    deadlines: [
      { id: "wr150-draft", title: "Research draft", date: "2026-04-28" },
      { id: "wr150-essay", title: "Final essay", date: "2026-05-04" },
    ],
  },
  {
    id: "course-ec101",
    name: "EC 101 Intro Economics",
    meetingDays: ["Mon", "Wed", "Fri"],
    startTime: "13:00",
    endTime: "13:50",
    workloadHours: 6,
    difficulty: "medium",
    requirement: "elective",
    color: "bg-rose-200/90 border-rose-500/60 text-rose-950",
    deadlines: [
      { id: "ec101-quiz", title: "Quiz 6", date: "2026-04-27" },
      { id: "ec101-exam", title: "Unit exam", date: "2026-05-08" },
    ],
  },
  {
    id: "course-ph100",
    name: "PH 100 Intro Philosophy",
    meetingDays: ["Mon", "Wed"],
    startTime: "16:00",
    endTime: "17:15",
    workloadHours: 4,
    difficulty: "easy",
    requirement: "elective",
    color: "bg-violet-200/90 border-violet-500/60 text-violet-950",
    deadlines: [
      { id: "ph100-paper", title: "Reflection paper", date: "2026-05-02" },
    ],
  },
  {
    id: "course-bi140",
    name: "BI 140 Biology Lab",
    meetingDays: ["Tue"],
    startTime: "18:00",
    endTime: "20:45",
    workloadHours: 7,
    difficulty: "hard",
    requirement: "required",
    color: "bg-lime-200/90 border-lime-500/60 text-lime-950",
    deadlines: [
      { id: "bi140-practical", title: "Lab practical", date: "2026-04-30" },
    ],
  },
  {
    id: "course-ds201",
    name: "DS 201 Data Systems",
    meetingDays: ["Tue", "Thu"],
    startTime: "09:00",
    endTime: "10:15",
    workloadHours: 9,
    difficulty: "hard",
    requirement: "required",
    color: "bg-cyan-200/90 border-cyan-500/60 text-cyan-950",
    deadlines: [
      { id: "ds201-project", title: "Schema project", date: "2026-04-29" },
      { id: "ds201-exam", title: "Architecture exam", date: "2026-05-01" },
    ],
  },
];

const sampleCommitments: Commitment[] = [
  {
    id: "commitment-job",
    title: "Campus Bookstore Shift",
    category: "job",
    meetingDays: ["Mon", "Wed", "Fri"],
    startTime: "17:30",
    endTime: "21:00",
    color: "bg-slate-200/95 border-slate-500/60 text-slate-900",
  },
  {
    id: "commitment-club",
    title: "Debate Club",
    category: "club",
    meetingDays: ["Tue"],
    startTime: "19:00",
    endTime: "20:30",
    color: "bg-orange-200/90 border-orange-500/60 text-orange-950",
  },
  {
    id: "commitment-exercise",
    title: "Gym / Recharge Block",
    category: "exercise",
    meetingDays: ["Tue", "Thu", "Sat"],
    startTime: "07:30",
    endTime: "08:30",
    color: "bg-teal-200/90 border-teal-500/60 text-teal-950",
  },
];

const samplePreferences: Preferences = {
  sleepStart: "23:30",
  sleepEnd: "07:30",
  maxStudyHoursPerDay: 5,
  maxClassesPerDay: 3,
};

const samplePlans: Plan[] = [
  {
    id: "planA",
    name: "Plan A",
    profileLabel: "Overloaded",
    description: "Heavy academic load plus evening conflicts makes this the high-risk option.",
    courseIds: [
      "course-cs210",
      "course-ma225",
      "course-wr150",
      "course-ec101",
      "course-bi140",
      "course-ds201",
    ],
  },
  {
    id: "planB",
    name: "Plan B",
    profileLabel: "Balanced",
    description: "A realistic mix of required work and electives with fewer pressure spikes.",
    courseIds: ["course-cs210", "course-wr150", "course-ec101", "course-ph100"],
  },
  {
    id: "planC",
    name: "Plan C",
    profileLabel: "Deadline-heavy",
    description: "Course times are workable, but major assessments bunch together late in the term.",
    courseIds: ["course-cs210", "course-ma225", "course-wr150", "course-ds201"],
  },
];

export const samplePlannerState: PlannerState = {
  courses: sampleCourses,
  commitments: sampleCommitments,
  preferences: samplePreferences,
  plans: samplePlans,
  activePlanId: "planB",
};
