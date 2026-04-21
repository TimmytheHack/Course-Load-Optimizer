import { Commitment } from "@/lib/types";
import { formatDayList, formatTimeLabel } from "@/lib/utils";

interface CommitmentListProps {
  commitments: Commitment[];
  onRemove: (commitmentId: string) => void;
}

export function CommitmentList({ commitments, onRemove }: CommitmentListProps) {
  if (commitments.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50/80 px-5 py-8 text-center text-sm text-slate-500">
        Add work, club, exercise, or personal blocks so the app can flag schedule collisions realistically.
      </div>
    );
  }

  return (
    <div className="space-y-2.5">
      {commitments.map((commitment) => (
        <article
          key={commitment.id}
          className="flex flex-wrap items-start justify-between gap-3 rounded-[26px] border border-slate-200 bg-white p-3.5 shadow-sm"
        >
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-semibold text-slate-900">{commitment.title}</h3>
              <span className="badge-neutral capitalize">{commitment.category}</span>
            </div>
            <p className="mt-1.5 text-sm text-slate-600">
              {formatDayList(commitment.meetingDays)} · {formatTimeLabel(commitment.startTime)} to{" "}
              {formatTimeLabel(commitment.endTime)}
            </p>
          </div>
          <button
            type="button"
            className="text-sm font-medium text-slate-500 transition hover:text-rose-600"
            onClick={() => onRemove(commitment.id)}
          >
            Remove
          </button>
        </article>
      ))}
    </div>
  );
}
