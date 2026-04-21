import { ReactNode } from "react";

interface SectionCardProps {
  id?: string;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
  compact?: boolean;
  children: ReactNode;
}

export function SectionCard({
  id,
  title,
  description,
  action,
  className,
  compact = false,
  children,
}: SectionCardProps) {
  return (
    <section
      id={id}
      className={[
        "panel",
        "relative overflow-hidden",
        compact ? "!p-5" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div
        className={[
          "pointer-events-none absolute top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(148,163,184,0.24),transparent)]",
          compact ? "inset-x-5" : "inset-x-6",
        ].join(" ")}
      />
      <div
        className={[
          "flex items-start justify-between border-b border-slate-200/70",
          compact ? "mb-5 gap-3 pb-4" : "mb-6 gap-4 pb-5",
        ].join(" ")}
      >
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-slate-950">{title}</h2>
          {description ? (
            <p
              className={[
                "max-w-2xl text-sm text-slate-600",
                compact ? "mt-1.5 leading-5" : "mt-2 leading-6",
              ].join(" ")}
            >
              {description}
            </p>
          ) : null}
        </div>
        {action ? <div className="shrink-0 pt-1">{action}</div> : null}
      </div>
      {children}
    </section>
  );
}
