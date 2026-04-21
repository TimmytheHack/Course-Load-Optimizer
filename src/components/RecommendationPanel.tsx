interface RecommendationPanelProps {
  recommendations: string[];
}

export function RecommendationPanel({ recommendations }: RecommendationPanelProps) {
  return (
    <div className="space-y-3">
      {recommendations.map((recommendation, index) => (
        <article
          key={`${recommendation}-${index}`}
          className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm"
        >
          <p className="text-sm leading-6 text-slate-700">{recommendation}</p>
        </article>
      ))}
    </div>
  );
}
