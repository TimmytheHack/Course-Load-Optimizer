interface RecommendationPanelProps {
  recommendations: string[];
}

const RECOMMENDATION_LABELS = ["Overall", "Biggest driver", "Best next step", "Next note"];

export function RecommendationPanel({ recommendations }: RecommendationPanelProps) {
  return (
    <div className="space-y-2.5">
      {recommendations.map((recommendation, index) => (
        <article
          key={`${recommendation}-${index}`}
          className="rounded-[24px] border border-slate-200/80 bg-white/95 p-3.5 shadow-sm"
        >
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
            {RECOMMENDATION_LABELS[index] ?? `Note ${index + 1}`}
          </p>
          <p className="mt-1.5 text-sm leading-5 text-slate-700">{recommendation}</p>
        </article>
      ))}
    </div>
  );
}
