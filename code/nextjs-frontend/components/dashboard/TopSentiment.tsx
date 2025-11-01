"use client";

import { getTopSentiments } from "@/lib/dashboardData";
import { BRAND_COLOR, EMPTY_STATE_MESSAGES, GRAY_TONES } from "@/lib/dashboardConstants";
import { ProgressBarItem } from "./ProgressBarItem";

const SENTIMENT_LABELS: Record<string, string> = {
  positive: "Positive",
  neutral: "Neutral",
  negative: "Negative",
};

export function TopSentiment() {
  const topSentiments = getTopSentiments();

  if (topSentiments.length === 0) {
    return <div className="text-sm text-gray-500">{EMPTY_STATE_MESSAGES.sentiment}</div>;
  }

  const maxCount = Math.max(...topSentiments.map((s) => s.count));

  return (
    <div className="space-y-4">
      {topSentiments.map((sentiment, index) => {
        const isHighest = sentiment.count === maxCount;
        const color = isHighest ? BRAND_COLOR : GRAY_TONES[index % GRAY_TONES.length];

        return (
          <ProgressBarItem
            key={sentiment.sentiment}
            label={SENTIMENT_LABELS[sentiment.sentiment] || sentiment.sentiment}
            value={sentiment.count}
            percentage={sentiment.percentage}
            color={color}
            valueFormatter={(v) => v.toString()}
            showPercentage
          />
        );
      })}
    </div>
  );
}

