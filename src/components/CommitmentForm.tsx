"use client";

import { useState } from "react";

import { DayPicker } from "@/components/DayPicker";
import { CommitmentDraft, validateCommitmentDraft, ValidationErrors } from "@/lib/validation";

interface CommitmentFormProps {
  onAddCommitment: (draft: CommitmentDraft) => void;
}

const INITIAL_DRAFT: CommitmentDraft = {
  title: "",
  category: "job",
  meetingDays: ["Mon", "Wed", "Fri"],
  startTime: "17:00",
  endTime: "20:00",
};

export function CommitmentForm({ onAddCommitment }: CommitmentFormProps) {
  const [draft, setDraft] = useState<CommitmentDraft>(INITIAL_DRAFT);
  const [errors, setErrors] = useState<ValidationErrors>({});

  function toggleDay(day: CommitmentDraft["meetingDays"][number]) {
    setDraft((current) => ({
      ...current,
      meetingDays: current.meetingDays.includes(day)
        ? current.meetingDays.filter((selectedDay) => selectedDay !== day)
        : [...current.meetingDays, day],
    }));
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validateCommitmentDraft(draft);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    onAddCommitment(draft);
    setDraft(INITIAL_DRAFT);
    setErrors({});
  }

  return (
    <form className="space-y-3" onSubmit={handleSubmit}>
      <div>
        <label className="field-label" htmlFor="commitment-title">
          Commitment name
        </label>
        <input
          id="commitment-title"
          className="input-field"
          value={draft.title}
          onChange={(event) => setDraft((current) => ({ ...current, title: event.target.value }))}
          placeholder="Campus bookstore shift"
        />
        {errors.title ? <p className="field-error">{errors.title}</p> : null}
      </div>

      <div className="space-y-3 rounded-[22px] border border-slate-200 bg-slate-50/70 p-3.5">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
            Commitment details
          </p>
          <div className="mt-2">
            <label className="field-label" htmlFor="commitment-category">
              Category
            </label>
            <select
              id="commitment-category"
              className="input-field"
              value={draft.category}
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  category: event.target.value as CommitmentDraft["category"],
                }))
              }
            >
              <option value="job">Part-time job</option>
              <option value="club">Club / extracurricular</option>
              <option value="exercise">Exercise / personal time</option>
              <option value="personal">Personal block</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
            Schedule
          </p>
          <div className="mt-2 space-y-3">
            <div>
              <label className="field-label">Meeting days</label>
              <DayPicker selectedDays={draft.meetingDays} onToggleDay={toggleDay} />
              {errors.meetingDays ? <p className="field-error">{errors.meetingDays}</p> : null}
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="field-label" htmlFor="commitment-start-time">
                  Start time
                </label>
                <input
                  id="commitment-start-time"
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
                <label className="field-label" htmlFor="commitment-end-time">
                  End time
                </label>
                <input
                  id="commitment-end-time"
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
          </div>
        </div>
      </div>

      <button type="submit" className="button-primary w-full justify-center">
        Add commitment
      </button>
    </form>
  );
}
