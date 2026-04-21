import { useEffect, useRef, useState } from "react";

interface SectionNavigatorItem {
  id: string;
  label: string;
}

interface SectionNavigatorProps {
  sections: SectionNavigatorItem[];
  activeSectionId: string;
  activePlanName: string;
  activePlanScore: number;
  onNavigate: (id: string) => void;
  variant: "mobile" | "desktop";
}

export function SectionNavigator({
  sections,
  activeSectionId,
  activePlanName,
  activePlanScore,
  onNavigate,
  variant,
}: SectionNavigatorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const activeSection = sections.find((section) => section.id === activeSectionId) ?? sections[0];

  useEffect(() => {
    if (!isOpen || variant !== "desktop") {
      return;
    }

    function handlePointerDown(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, variant]);

  if (variant === "mobile") {
    return (
      <div className="xl:hidden">
        <div className="-mx-1 overflow-x-auto pb-1">
          <div className="flex min-w-max items-center gap-2 px-1">
            {sections.map((section) => {
              const active = section.id === activeSectionId;

              return (
                <button
                  key={section.id}
                  type="button"
                  onClick={() => onNavigate(section.id)}
                  className={[
                    "rounded-full border px-3 py-1.5 text-xs font-semibold transition motion-reduce:transition-none",
                    active
                      ? "border-slate-900 bg-slate-900 text-white"
                      : "border-slate-200 bg-white/90 text-slate-600 hover:border-slate-300 hover:text-slate-900",
                  ].join(" ")}
                >
                  {section.label}
                </button>
              );
            })}
          </div>
        </div>
        <p className="mt-2 text-xs text-slate-500">
          Active plan: <span className="font-semibold text-slate-700">{activePlanName}</span> · Score{" "}
          <span className="font-semibold text-slate-700">{activePlanScore}</span>
        </p>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="pointer-events-none fixed bottom-5 right-5 z-40 hidden xl:block">
      <div className="pointer-events-auto relative flex items-end justify-end">
        {isOpen ? (
          <nav className="absolute bottom-16 right-0 w-72 rounded-[26px] border border-slate-200/80 bg-white/95 p-4 shadow-[0_18px_40px_rgba(15,23,42,0.12)] backdrop-blur">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                  Navigate
                </p>
                <p className="mt-1 text-sm font-semibold text-slate-950">{activeSection?.label}</p>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-500 transition hover:border-slate-300 hover:text-slate-900"
              >
                Close
              </button>
            </div>

            <div className="mt-3 rounded-[18px] border border-slate-200 bg-slate-50/85 px-3 py-2.5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                Active plan
              </p>
              <p className="mt-1 text-sm font-semibold text-slate-950">{activePlanName}</p>
              <p className="mt-1 text-xs text-slate-500">Score {activePlanScore}</p>
            </div>

            <div className="mt-3 space-y-1.5">
              {sections.map((section) => {
                const active = section.id === activeSectionId;

                return (
                  <button
                    key={section.id}
                    type="button"
                    onClick={() => {
                      onNavigate(section.id);
                      setIsOpen(false);
                    }}
                    className={[
                      "flex w-full items-center justify-between rounded-2xl border px-3 py-2 text-left text-sm font-medium transition motion-reduce:transition-none",
                      active
                        ? "border-slate-900 bg-slate-900 text-white shadow-sm"
                        : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-slate-900",
                    ].join(" ")}
                  >
                    <span>{section.label}</span>
                    <span
                      className={[
                        "h-2 w-2 rounded-full",
                        active ? "bg-white" : "bg-slate-300",
                      ].join(" ")}
                    />
                  </button>
                );
              })}
            </div>
          </nav>
        ) : null}

        <button
          type="button"
          onClick={() => setIsOpen((open) => !open)}
          className="inline-flex items-center gap-2.5 rounded-full border border-slate-200/80 bg-white/95 px-4 py-3 text-sm font-semibold text-slate-900 shadow-[0_16px_36px_rgba(15,23,42,0.1)] backdrop-blur transition hover:border-slate-300 hover:shadow-[0_18px_40px_rgba(15,23,42,0.14)] motion-reduce:transition-none"
          aria-expanded={isOpen}
          aria-haspopup="dialog"
        >
          <span className="text-slate-500">Navigate</span>
          <span className="rounded-full bg-slate-900 px-2.5 py-1 text-xs font-semibold text-white">
            {activeSection?.label}
          </span>
          <span className="text-xs text-slate-500">
            {activePlanName} · {activePlanScore}
          </span>
        </button>
      </div>
    </div>
  );
}
