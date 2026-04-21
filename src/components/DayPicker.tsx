import { Day, DAYS } from "@/lib/types";

interface DayPickerProps {
  selectedDays: Day[];
  onToggleDay: (day: Day) => void;
}

export function DayPicker({ selectedDays, onToggleDay }: DayPickerProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {DAYS.map((day) => {
        const active = selectedDays.includes(day);
        return (
          <button
            key={day}
            type="button"
            onClick={() => onToggleDay(day)}
            className={[
              "rounded-full border px-3 py-1.5 text-sm font-medium transition",
              active
                ? "border-slate-900 bg-slate-900 text-white shadow-sm"
                : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-slate-900",
            ].join(" ")}
          >
            {day}
          </button>
        );
      })}
    </div>
  );
}
