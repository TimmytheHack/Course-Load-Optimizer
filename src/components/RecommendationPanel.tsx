interface RecommendationPanelProps {
  recommendations: string[];
}

export function RecommendationPanel({ recommendations }: RecommendationPanelProps) {
  return (
    <div className="space-y-3">
      {recommendations.map((recommendation, index) => (
        <article
          key={`${recommendation}-${index}`}
          className="rounded-[26px] border border-slate-200/80 bg-white/95 p-4 shadow-sm"
        >
          <div className="flex items-start gap-3">
            <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-600">
              {index + 1}
            </span>
            <p className="text-sm leading-6 text-slate-700">{recommendation}</p>
          </div>
        </article>
      ))}
    </div>
  );
}
