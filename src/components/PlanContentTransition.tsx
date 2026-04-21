import { ReactNode } from "react";

interface PlanContentTransitionProps {
  motionKey: string;
  children: ReactNode;
  className?: string;
}

export function PlanContentTransition({
  motionKey,
  children,
  className,
}: PlanContentTransitionProps) {
  return (
    <div key={motionKey} className={["plan-switch-panel", className].filter(Boolean).join(" ")}>
      {children}
    </div>
  );
}
