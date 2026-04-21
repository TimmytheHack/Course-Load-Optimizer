const STRESS_BANDS = [
  { label: "Light", range: "0-30", tone: "border-emerald-200 bg-emerald-50 text-emerald-900" },
  { label: "Balanced", range: "31-60", tone: "border-sky-200 bg-sky-50 text-sky-900" },
  { label: "Intense", range: "61-80", tone: "border-amber-200 bg-amber-50 text-amber-900" },
  { label: "Overload risk", range: "81-100", tone: "border-rose-200 bg-rose-50 text-rose-900" },
];

export function StressLegend() {
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {STRESS_BANDS.map((band) => (
        <div key={band.label} className={["rounded-3xl border p-4", band.tone].join(" ")}>
          <p className="text-xs font-semibold uppercase tracking-[0.16em]">{band.range}</p>
          <p className="mt-2 text-base font-semibold">{band.label}</p>
        </div>
      ))}
    </div>
  );
}
