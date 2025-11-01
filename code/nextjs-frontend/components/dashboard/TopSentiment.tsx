"use client";

import { getTopSentiments } from "@/lib/dashboardData";

const sentimentColors: Record<string, string> = {
  positive: "#10B981", // Green
  neutral: "#6B7280", // Gray
  negative: "#EF4444", // Red
};

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

  return (
    <div className="space-y-4">
      {topSentiments.map((sentiment, index) => {
        const color = sentimentColors[sentiment.sentiment] || "#6B7280";

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

