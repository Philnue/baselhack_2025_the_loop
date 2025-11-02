"use client";

import { getTopSentiments } from "@/lib/dashboardData";
import { EMPTY_STATE_MESSAGES } from "@/lib/dashboardConstants";

const SENTIMENT_LABELS: Record<string, string> = {
  positive: "Positive",
  neutral: "Neutral",
  negative: "Negative",
};

export function TopSentiment() {
  const topSentiments = getTopSentiments().slice(0, 3);

  if (topSentiments.length === 0) {
    return <div className="text-sm text-gray-500">{EMPTY_STATE_MESSAGES.sentiment}</div>;
  }

  return (
    <div className="space-y-3">
      {topSentiments.map((sentiment) => {
        return (
          <div
            key={sentiment.sentiment}
            className="flex items-center justify-between"
          >
            <span className="text-sm text-gray-700">
              {SENTIMENT_LABELS[sentiment.sentiment] || sentiment.sentiment}
            </span>
            <span className="text-sm text-gray-700">
              {Math.round(sentiment.percentage)}%
            </span>
          </div>
        );
      })}
    </div>
  );
}

