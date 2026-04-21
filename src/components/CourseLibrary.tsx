import { Course, Plan, PlanId } from "@/lib/types";
import { formatDayList, formatHours, formatTimeLabel, safeDateLabel } from "@/lib/utils";

interface CourseLibraryProps {
  courses: Course[];
  plans: Plan[];
  activePlanId: PlanId;
  onTogglePlan: (planId: PlanId, courseId: string) => void;
  onRemove: (courseId: string) => void;
}

export function CourseLibrary({
  courses,
  plans,
  activePlanId,
  onTogglePlan,
  onRemove,
}: CourseLibraryProps) {
  if (courses.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50/80 px-6 py-10 text-center text-sm text-slate-500">
        No courses yet. Add a few courses, then assign each one to Plan A, B, and C to start comparing schedules.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {courses.map((course) => (
        <article key={course.id} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-base font-semibold text-slate-900">{course.name}</h3>
                <span className="badge-neutral capitalize">{course.requirement}</span>
                <span className="badge-neutral capitalize">{course.difficulty}</span>
              </div>
              <p className="mt-2 text-sm text-slate-600">
                {formatDayList(course.meetingDays)} · {formatTimeLabel(course.startTime)} to{" "}
                {formatTimeLabel(course.endTime)} · {formatHours(course.workloadHours)} / week
              </p>
            </div>
            <button
              type="button"
              className="text-sm font-medium text-slate-500 transition hover:text-rose-600"
              onClick={() => onRemove(course.id)}
            >
              Remove
            </button>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {plans.map((plan) => {
              const active = plan.courseIds.includes(course.id);
              const emphasized = activePlanId === plan.id;
              return (
                <button
                  key={plan.id}
                  type="button"
                  onClick={() => onTogglePlan(plan.id, course.id)}
                  className={[
                    "rounded-full border px-3 py-1.5 text-sm font-medium transition",
                    active
                      ? emphasized
                        ? "border-slate-900 bg-slate-900 text-white"
                        : "border-slate-300 bg-slate-100 text-slate-800"
                      : "border-slate-200 bg-white text-slate-500 hover:border-slate-300 hover:text-slate-900",
                  ].join(" ")}
                >
                  {plan.name}
                </button>
              );
            })}
          </div>

          {course.deadlines.length > 0 ? (
            <div className="mt-4 flex flex-wrap gap-2">
              {course.deadlines.map((deadline) => (
                <span key={deadline.id} className="badge-soft">
                  {deadline.title} · {safeDateLabel(deadline.date)}
                </span>
              ))}
            </div>
          ) : null}
        </article>
      ))}
    </div>
  );
}
