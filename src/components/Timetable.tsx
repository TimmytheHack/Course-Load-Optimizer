import { DAYS, ScheduleBlock } from "@/lib/types";
import { getTimetableWindow } from "@/lib/schedule";
import { formatTimeLabel } from "@/lib/utils";

interface TimetableProps {
  classBlocks: ScheduleBlock[];
  commitmentBlocks: ScheduleBlock[];
}

const STEP_MINUTES = 60;

export function Timetable({ classBlocks, commitmentBlocks }: TimetableProps) {
  const blocks = [...classBlocks, ...commitmentBlocks];
  const window = getTimetableWindow(blocks);
  const totalMinutes = window.end - window.start;
  const hours = Array.from(
    { length: Math.ceil(totalMinutes / STEP_MINUTES) + 1 },
    (_, index) => window.start + index * STEP_MINUTES,
  );

  if (blocks.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50/80 px-6 py-12 text-center text-sm text-slate-500">
        Assign a few courses to the active plan to render the weekly timetable.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-600">
          <span className="h-2.5 w-2.5 rounded-full bg-slate-900" />
          Class block
        </span>
        <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-600">
          <span className="h-2.5 w-2.5 rounded-full bg-slate-400" />
          Commitment block
        </span>
      </div>
      <div className="overflow-x-auto">
      <div className="grid min-w-[920px] grid-cols-[76px_repeat(7,minmax(112px,1fr))] gap-px rounded-[28px] border border-slate-200/80 bg-slate-200 p-px shadow-[0_12px_30px_rgba(15,23,42,0.04)]">
        <div className="bg-slate-50" />
        {DAYS.map((day) => (
          <div
            key={day}
            className="bg-slate-50 px-3 py-3 text-center text-sm font-semibold text-slate-700"
          >
            {day}
          </div>
        ))}

        <div className="relative bg-white">
          {hours.map((time) => (
            <div
              key={time}
              className="absolute inset-x-0 border-t border-dashed border-slate-200 px-3 text-xs text-slate-400"
              style={{ top: `${((time - window.start) / totalMinutes) * 100}%` }}
            >
              <span className="-translate-y-1/2 block rounded-full bg-white pr-2">
                {formatTimeLabel(`${String(Math.floor(time / 60)).padStart(2, "0")}:00`)}
              </span>
            </div>
          ))}
        </div>

        {DAYS.map((day) => {
          const dayBlocks = blocks
            .filter((block) => block.day === day)
            .sort((left, right) => left.startMinutes - right.startMinutes);

          return (
            <div key={day} className="relative h-[720px] bg-white">
              {hours.map((time) => (
                <div
                  key={time}
                  className="absolute inset-x-0 border-t border-dashed border-slate-200"
                  style={{ top: `${((time - window.start) / totalMinutes) * 100}%` }}
                />
              ))}
              {dayBlocks.map((block) => {
                const top = ((block.startMinutes - window.start) / totalMinutes) * 100;
                const height = ((block.endMinutes - block.startMinutes) / totalMinutes) * 100;

                return (
                  <article
                    key={block.id}
                    className={[
                      "absolute inset-x-2 overflow-hidden rounded-2xl border px-3 py-2 shadow-sm",
                      block.color,
                      block.kind === "commitment" ? "opacity-85 saturate-[0.82]" : "",
                    ].join(" ")}
                    style={{ top: `${top}%`, height: `${Math.max(height, 8)}%` }}
                  >
                    <p className="text-xs font-semibold uppercase tracking-[0.12em]">
                      {block.kind}
                    </p>
                    <p className="mt-1 text-sm font-semibold leading-5">{block.title}</p>
                    <p className="mt-1 text-xs">
                      {formatTimeLabel(block.startTime)} - {formatTimeLabel(block.endTime)}
                    </p>
                  </article>
                );
              })}
            </div>
          );
        })}
      </div>
      </div>
    </div>
  );
}
