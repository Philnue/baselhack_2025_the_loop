"use client";

import { getTopEmotions } from "@/lib/dashboardData";

const emotionLabels: Record<string, string> = {
  joy: "Joy",
  trust: "Trust",
  anticipation: "Anticipation",
  frustration: "Frustration",
  fear: "Fear",
  sadness: "Sadness",
  annoyance: "Annoyance",
};

export function TopEmotions() {
  const topEmotions = getTopEmotions(5);

  if (topEmotions.length === 0) {
    return (
      <div className="text-sm text-gray-500">No emotion data available</div>
    );
  }

  // Find max value for percentage calculation
  const maxValue = Math.max(...topEmotions.map((e) => e.value));

  // Grey tones for non-highest items
  const greyTones = [
    "#9CA3AF", // Gray-400
    "#6B7280", // Gray-500
    "#4B5563", // Gray-600
    "#374151", // Gray-700
    "#1F2937", // Gray-800
  ];

  return (
    <div className="space-y-4">
      {topEmotions.map((emotion, index) => {
        const percentage = maxValue > 0 ? (emotion.value / maxValue) * 100 : 0;
        // Highest score gets magenta, others get grey tones
        const isHighest = emotion.value === maxValue;
        const color = isHighest ? "#A8005C" : greyTones[index % greyTones.length];

        return (
          <div key={`${emotion.emotion}-${index}`} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {/* Color dot - visible on mobile */}
                <div
                  className="h-3 w-3 rounded-full lg:hidden"
                  style={{ backgroundColor: color }}
                />
                <span className="text-sm font-medium text-gray-700">
                  {emotionLabels[emotion.emotion] || emotion.emotion}
                </span>
              </div>
              <span className="text-sm font-semibold text-gray-900">
                {emotion.value.toFixed(2)}
              </span>
            </div>
            {/* Progress bar */}
            <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${percentage}%`,
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

