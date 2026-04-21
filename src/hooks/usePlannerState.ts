"use client";

import { useEffect, useState } from "react";

import { samplePlannerState } from "@/lib/sampleData";
import {
  Commitment,
  Course,
  PlannerState,
  PlanId,
  RequirementType,
  Difficulty,
  CommitmentCategory,
} from "@/lib/types";
import { CommitmentDraft, CourseDraft } from "@/lib/validation";
import { createId } from "@/lib/utils";

const STORAGE_KEY = "course-load-optimizer.v1";

const COURSE_COLORS = [
  "bg-emerald-300/80 border-emerald-500/60 text-emerald-950",
  "bg-sky-300/80 border-sky-500/60 text-sky-950",
  "bg-amber-200/90 border-amber-500/60 text-amber-950",
  "bg-rose-200/90 border-rose-500/60 text-rose-950",
  "bg-violet-200/90 border-violet-500/60 text-violet-950",
  "bg-lime-200/90 border-lime-500/60 text-lime-950",
  "bg-cyan-200/90 border-cyan-500/60 text-cyan-950",
];

const COMMITMENT_COLORS = [
  "bg-slate-200/95 border-slate-500/60 text-slate-900",
  "bg-orange-200/90 border-orange-500/60 text-orange-950",
  "bg-teal-200/90 border-teal-500/60 text-teal-950",
  "bg-fuchsia-200/90 border-fuchsia-500/60 text-fuchsia-950",
];

export function createEmptyPlannerState(): PlannerState {
  return {
    courses: [],
    commitments: [],
    preferences: {
      sleepStart: "23:00",
      sleepEnd: "07:30",
      maxStudyHoursPerDay: 5,
      maxClassesPerDay: 3,
    },
    plans: [
      { id: "planA", name: "Plan A", courseIds: [] },
      { id: "planB", name: "Plan B", courseIds: [] },
      { id: "planC", name: "Plan C", courseIds: [] },
    ],
    activePlanId: "planA",
  };
}

function pickColor(colors: string[], index: number) {
  return colors[index % colors.length];
}

export function usePlannerState() {
  const [state, setState] = useState<PlannerState>(createEmptyPlannerState);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setState(JSON.parse(stored) as PlannerState);
      }
    } catch {
      window.localStorage.removeItem(STORAGE_KEY);
    } finally {
      setIsHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [isHydrated, state]);

  function addCourse(draft: CourseDraft) {
    const course: Course = {
      id: createId("course"),
      name: draft.name.trim(),
      meetingDays: draft.meetingDays,
      startTime: draft.startTime,
      endTime: draft.endTime,
      workloadHours: draft.workloadHours,
      difficulty: draft.difficulty as Difficulty,
      requirement: draft.requirement as RequirementType,
      color: pickColor(COURSE_COLORS, state.courses.length),
      deadlines: draft.deadlines
        .filter((deadline) => deadline.title.trim() && deadline.date)
        .map((deadline) => ({
          id: createId("deadline"),
          title: deadline.title.trim(),
          date: deadline.date,
        })),
    };

    setState((current) => ({
      ...current,
      courses: [...current.courses, course],
    }));
  }

  function removeCourse(courseId: string) {
    setState((current) => ({
      ...current,
      courses: current.courses.filter((course) => course.id !== courseId),
      plans: current.plans.map((plan) => ({
        ...plan,
        courseIds: plan.courseIds.filter((id) => id !== courseId),
      })),
    }));
  }

  function toggleCourseInPlan(planId: PlanId, courseId: string) {
    setState((current) => ({
      ...current,
      plans: current.plans.map((plan) => {
        if (plan.id !== planId) {
          return plan;
        }

        const exists = plan.courseIds.includes(courseId);
        return {
          ...plan,
          courseIds: exists
            ? plan.courseIds.filter((id) => id !== courseId)
            : [...plan.courseIds, courseId],
        };
      }),
    }));
  }

  function addCommitment(draft: CommitmentDraft) {
    const commitment: Commitment = {
      id: createId("commitment"),
      title: draft.title.trim(),
      category: draft.category as CommitmentCategory,
      meetingDays: draft.meetingDays,
      startTime: draft.startTime,
      endTime: draft.endTime,
      color: pickColor(COMMITMENT_COLORS, state.commitments.length),
    };

    setState((current) => ({
      ...current,
      commitments: [...current.commitments, commitment],
    }));
  }

  function removeCommitment(commitmentId: string) {
    setState((current) => ({
      ...current,
      commitments: current.commitments.filter((commitment) => commitment.id !== commitmentId),
    }));
  }

  function updatePreferences(next: Partial<PlannerState["preferences"]>) {
    setState((current) => ({
      ...current,
      preferences: {
        ...current.preferences,
        ...next,
      },
    }));
  }

  function loadSampleSemester() {
    setState(samplePlannerState);
  }

  function resetPlanner() {
    setState(createEmptyPlannerState());
  }

  function setActivePlan(planId: PlanId) {
    setState((current) => ({
      ...current,
      activePlanId: planId,
    }));
  }

  return {
    state,
    isHydrated,
    addCourse,
    removeCourse,
    toggleCourseInPlan,
    addCommitment,
    removeCommitment,
    updatePreferences,
    loadSampleSemester,
    resetPlanner,
    setActivePlan,
  };
}
