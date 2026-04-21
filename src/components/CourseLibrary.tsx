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
      <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50/80 px-5 py-8 text-center text-sm text-slate-500">
        No courses yet. Add a few courses, then assign each one to Plan A, B, and C to start comparing schedules.
      </div>
    );
  }

  return (
    <div className="space-y-2.5">
      {courses.map((course) => (
        <article key={course.id} className="rounded-[24px] border border-slate-200 bg-white px-4 py-3.5 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-2.5">
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-1.5">
                <h3 className="text-base font-semibold text-slate-900">{course.name}</h3>
                <span className="rounded-full border px-2 py-0.5 text-[11px] font-medium capitalize text-slate-600 [border-color:rgba(148,163,184,0.2)] [background:rgba(248,250,252,0.9)]">
                  {course.requirement}
                </span>
                <span className="rounded-full border px-2 py-0.5 text-[11px] font-medium capitalize text-slate-600 [border-color:rgba(148,163,184,0.2)] [background:rgba(248,250,252,0.9)]">
                  {course.difficulty}
                </span>
              </div>
              <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-slate-600">
                <span>{formatDayList(course.meetingDays)}</span>
                <span className="text-slate-300">•</span>
                <span>
                  {formatTimeLabel(course.startTime)} to {formatTimeLabel(course.endTime)}
                </span>
                <span className="text-slate-300">•</span>
                <span>{formatHours(course.workloadHours)} / week</span>
              </div>
            </div>
            <button
              type="button"
              className="rounded-full px-2 py-1 text-sm font-medium text-slate-500 transition hover:bg-rose-50 hover:text-rose-600"
              onClick={() => onRemove(course.id)}
            >
              Remove
            </button>
          </div>

          <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
            {plans.map((plan) => {
              const active = plan.courseIds.includes(course.id);
              const emphasized = activePlanId === plan.id;
              return (
                <button
                  key={plan.id}
                  type="button"
                  onClick={() => onTogglePlan(plan.id, course.id)}
                  className={[
                    "min-w-[76px] rounded-full border px-3 py-1 text-center text-sm font-medium transition motion-reduce:transition-none",
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
            <div className="mt-2.5 flex flex-wrap gap-1.5">
              {course.deadlines.map((deadline) => (
                <span
                  key={deadline.id}
                  className="rounded-full border px-2 py-0.5 text-[11px] font-medium text-slate-600 [border-color:rgba(148,163,184,0.18)] [background:rgba(248,250,252,0.75)]"
                >
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
