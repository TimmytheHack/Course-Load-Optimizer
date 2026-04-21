import { WarningItem } from "@/lib/types";

interface WarningListProps {
  warnings: WarningItem[];
}

const SEVERITY_STYLES: Record<WarningItem["severity"], string> = {
  high: "border-rose-200 bg-rose-50 text-rose-900",
  medium: "border-amber-200 bg-amber-50 text-amber-900",
  low: "border-emerald-200 bg-emerald-50 text-emerald-900",
};

export function WarningList({ warnings }: WarningListProps) {
  if (warnings.length === 0) {
    return (
      <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-5 text-sm text-emerald-900">
        No major warning flags. This plan clears the biggest schedule-risk checks.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {warnings.map((warning) => (
        <article
          key={warning.id}
          className={["rounded-3xl border p-4", SEVERITY_STYLES[warning.severity]].join(" ")}
        >
          <div className="flex items-center justify-between gap-3">
            <h3 className="font-semibold">{warning.title}</h3>
            <span className="text-xs font-semibold uppercase tracking-[0.16em]">
              {warning.severity}
            </span>
          </div>
          <p className="mt-2 text-sm leading-6">{warning.detail}</p>
        </article>
      ))}
    </div>
  );
}
