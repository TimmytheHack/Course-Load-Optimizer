import { Preferences } from "@/lib/types";

interface PreferencesCardProps {
  preferences: Preferences;
  onUpdate: (next: Partial<Preferences>) => void;
}

export function PreferencesCard({ preferences, onUpdate }: PreferencesCardProps) {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="field-label" htmlFor="sleep-start">
            Preferred sleep start
          </label>
          <input
            id="sleep-start"
            type="time"
            className="input-field"
            value={preferences.sleepStart}
            onChange={(event) => onUpdate({ sleepStart: event.target.value })}
          />
        </div>
        <div>
          <label className="field-label" htmlFor="sleep-end">
            Preferred sleep end
          </label>
          <input
            id="sleep-end"
            type="time"
            className="input-field"
            value={preferences.sleepEnd}
            onChange={(event) => onUpdate({ sleepEnd: event.target.value })}
          />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="field-label" htmlFor="max-study">
            Max study hours per day
          </label>
          <input
            id="max-study"
            type="number"
            min={1}
            max={12}
            className="input-field"
            value={preferences.maxStudyHoursPerDay}
            onChange={(event) =>
              onUpdate({ maxStudyHoursPerDay: Number(event.target.value) || 1 })
            }
          />
        </div>
        <div>
          <label className="field-label" htmlFor="max-classes">
            Max classes per day
          </label>
          <input
            id="max-classes"
            type="number"
            min={1}
            max={8}
            className="input-field"
            value={preferences.maxClassesPerDay}
            onChange={(event) => onUpdate({ maxClassesPerDay: Number(event.target.value) || 1 })}
          />
        </div>
      </div>
    </div>
  );
}
