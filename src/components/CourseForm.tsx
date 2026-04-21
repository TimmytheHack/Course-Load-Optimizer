"use client";

import { useState } from "react";

import { DayPicker } from "@/components/DayPicker";
import { Course } from "@/lib/types";
import { CourseDraft, validateCourseDraft, ValidationErrors } from "@/lib/validation";

interface CourseFormProps {
  courses: Course[];
  onAddCourse: (draft: CourseDraft) => void;
}

const INITIAL_DRAFT: CourseDraft = {
  name: "",
  meetingDays: ["Mon", "Wed"],
  startTime: "09:00",
  endTime: "10:15",
  workloadHours: 6,
  difficulty: "medium",
  requirement: "required",
  deadlines: [{ title: "", date: "" }],
};

export function CourseForm({ courses, onAddCourse }: CourseFormProps) {
  const [draft, setDraft] = useState<CourseDraft>(INITIAL_DRAFT);
  const [errors, setErrors] = useState<ValidationErrors>({});

  function toggleDay(day: CourseDraft["meetingDays"][number]) {
    setDraft((current) => ({
      ...current,
      meetingDays: current.meetingDays.includes(day)
        ? current.meetingDays.filter((selectedDay) => selectedDay !== day)
        : [...current.meetingDays, day],
    }));
  }

  function updateDeadline(index: number, field: "title" | "date", value: string) {
    setDraft((current) => ({
      ...current,
      deadlines: current.deadlines.map((deadline, deadlineIndex) =>
        deadlineIndex === index ? { ...deadline, [field]: value } : deadline,
      ),
    }));
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validateCourseDraft(draft, courses);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    onAddCourse(draft);
    setDraft(INITIAL_DRAFT);
    setErrors({});
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div>
        <label className="field-label" htmlFor="course-name">
          Course name
        </label>
        <input
          id="course-name"
          className="input-field"
          value={draft.name}
          onChange={(event) => setDraft((current) => ({ ...current, name: event.target.value }))}
          placeholder="CS 210 Algorithms"
        />
        {errors.name ? <p className="field-error">{errors.name}</p> : null}
      </div>

      <div>
        <label className="field-label">Meeting days</label>
        <DayPicker selectedDays={draft.meetingDays} onToggleDay={toggleDay} />
        {errors.meetingDays ? <p className="field-error">{errors.meetingDays}</p> : null}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="field-label" htmlFor="course-start-time">
            Start time
          </label>
          <input
            id="course-start-time"
            type="time"
            className="input-field"
            value={draft.startTime}
            onChange={(event) =>
              setDraft((current) => ({ ...current, startTime: event.target.value }))
            }
          />
          {errors.startTime ? <p className="field-error">{errors.startTime}</p> : null}
        </div>
        <div>
          <label className="field-label" htmlFor="course-end-time">
            End time
          </label>
          <input
            id="course-end-time"
            type="time"
            className="input-field"
            value={draft.endTime}
            onChange={(event) =>
              setDraft((current) => ({ ...current, endTime: event.target.value }))
            }
          />
          {errors.endTime ? <p className="field-error">{errors.endTime}</p> : null}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label className="field-label" htmlFor="course-workload">
            Weekly workload
          </label>
          <input
            id="course-workload"
            type="number"
            min={1}
            max={40}
            className="input-field"
            value={draft.workloadHours}
            onChange={(event) =>
              setDraft((current) => ({
                ...current,
                workloadHours: Number(event.target.value),
              }))
            }
          />
          {errors.workloadHours ? <p className="field-error">{errors.workloadHours}</p> : null}
        </div>
        <div>
          <label className="field-label" htmlFor="course-difficulty">
            Difficulty
          </label>
          <select
            id="course-difficulty"
            className="input-field"
            value={draft.difficulty}
            onChange={(event) =>
              setDraft((current) => ({
                ...current,
                difficulty: event.target.value as CourseDraft["difficulty"],
              }))
            }
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>
        <div>
          <label className="field-label" htmlFor="course-requirement">
            Requirement
          </label>
          <select
            id="course-requirement"
            className="input-field"
            value={draft.requirement}
            onChange={(event) =>
              setDraft((current) => ({
                ...current,
                requirement: event.target.value as CourseDraft["requirement"],
              }))
            }
          >
            <option value="required">Required</option>
            <option value="elective">Elective</option>
          </select>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
        <div className="mb-3 flex items-center justify-between gap-3">
          <label className="field-label m-0">Exam dates / major deadlines</label>
          <button
            type="button"
            className="text-sm font-medium text-slate-700 hover:text-slate-950"
            onClick={() =>
              setDraft((current) => ({
                ...current,
                deadlines: [...current.deadlines, { title: "", date: "" }],
              }))
            }
          >
            + Add deadline
          </button>
        </div>
        <div className="space-y-3">
          {draft.deadlines.map((deadline, index) => (
            <div key={`${deadline.title}-${index}`} className="grid gap-3 sm:grid-cols-[1fr_auto_auto]">
              <input
                className="input-field"
                value={deadline.title}
                onChange={(event) => updateDeadline(index, "title", event.target.value)}
                placeholder="Midterm, paper, project..."
              />
              <input
                type="date"
                className="input-field"
                value={deadline.date}
                onChange={(event) => updateDeadline(index, "date", event.target.value)}
              />
              {draft.deadlines.length > 1 ? (
                <button
                  type="button"
                  className="rounded-xl border border-slate-200 px-3 text-sm font-medium text-slate-600 transition hover:border-slate-300 hover:text-slate-900"
                  onClick={() =>
                    setDraft((current) => ({
                      ...current,
                      deadlines: current.deadlines.filter((_, deadlineIndex) => deadlineIndex !== index),
                    }))
                  }
                >
                  Remove
                </button>
              ) : null}
            </div>
          ))}
        </div>
        {errors.deadlines ? <p className="field-error">{errors.deadlines}</p> : null}
      </div>

      <button type="submit" className="button-primary w-full justify-center">
        Add course
      </button>
    </form>
  );
}
