"use client";

import { getTopSentiments } from "@/lib/dashboardData";

const sentimentLabels: Record<string, string> = {
  positive: "Positive",
  neutral: "Neutral",
  negative: "Negative",
};

export function TopSentiment() {
  const topSentiments = getTopSentiments();

  if (topSentiments.length === 0) {
    return (
      <div className="text-sm text-gray-500">No sentiment data available</div>
    );
  }

  // Find max count for highest score
  const maxCount = Math.max(...topSentiments.map((s) => s.count));

  // Grey tones for non-highest items
  const greyTones = [
    "#9CA3AF", // Gray-400
    "#6B7280", // Gray-500
    "#4B5563", // Gray-600
  ];

  return (
    <div className="space-y-4">
      {topSentiments.map((sentiment, index) => {
        // Highest score gets magenta, others get grey tones
        const isHighest = sentiment.count === maxCount;
        const color = isHighest ? "#A8005C" : greyTones[index % greyTones.length];

        return (
          <div key={sentiment.sentiment} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {/* Color dot - visible on mobile */}
                <div
                  className="h-3 w-3 rounded-full lg:hidden"
                  style={{ backgroundColor: color }}
                />
                <span className="text-sm font-medium text-gray-700">
                  {sentimentLabels[sentiment.sentiment] || sentiment.sentiment}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-gray-900">
                  {sentiment.count}
                </span>
                <span className="text-sm text-gray-500">
                  ({sentiment.percentage.toFixed(1)}%)
                </span>
              </div>
            </div>
            {/* Progress bar */}
            <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${sentiment.percentage}%`,
                  backgroundColor: color,
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

