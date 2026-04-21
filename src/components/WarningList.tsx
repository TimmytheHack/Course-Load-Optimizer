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
      <div className="rounded-[26px] border border-emerald-200 bg-[linear-gradient(180deg,#f0fdf4,#ecfdf5)] p-5 text-sm text-emerald-900 shadow-sm">
        No major warning flags. This plan clears the biggest schedule-risk checks.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {warnings.map((warning, index) => (
        <article
          key={warning.id}
          className={["rounded-[26px] border p-4 shadow-sm", SEVERITY_STYLES[warning.severity]].join(" ")}
        >
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-full border border-current/15 bg-white/55 text-xs font-semibold">
                {index + 1}
              </span>
              <h3 className="font-semibold">{warning.title}</h3>
            </div>
            <span className="text-xs font-semibold uppercase tracking-[0.16em]">
              {warning.severity}
            </span>
          </div>
          <p className="mt-3 text-sm leading-6">{warning.detail}</p>
        </article>
      ))}
    </div>
  );
}
