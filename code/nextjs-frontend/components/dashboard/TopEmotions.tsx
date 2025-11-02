"use client";

import { getTopEmotions } from "@/lib/dashboardData";
import { EMPTY_STATE_MESSAGES } from "@/lib/dashboardConstants";

const EMOTION_LABELS: Record<string, string> = {
  joy: "Joy",
  trust: "Trust",
  anticipation: "Anticipation",
  frustration: "Frustration",
  fear: "Fear",
  sadness: "Sadness",
  annoyance: "Annoyance",
};

export function TopEmotions() {
  const topEmotions = getTopEmotions(3);

  if (topEmotions.length === 0) {
    return <div className="text-sm text-gray-500">{EMPTY_STATE_MESSAGES.emotion}</div>;
  }

  const totalValue = topEmotions.reduce((sum, e) => sum + e.value, 0);

  return (
    <div className="space-y-3">
      {topEmotions.map((emotion) => {
        const percentage =
          totalValue > 0 ? Math.round((emotion.value / totalValue) * 100) : 0;

        return (
          <div
            key={emotion.emotion}
            className="flex items-center justify-between"
          >
            <span className="text-sm text-gray-700">
              {EMOTION_LABELS[emotion.emotion] || emotion.emotion}
            </span>
            <span className="text-sm text-gray-700">{percentage}%</span>
          </div>
        );
      })}
    </div>
  );
}

