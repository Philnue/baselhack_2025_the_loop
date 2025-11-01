"use client";

import { getTopEmotions } from "@/lib/dashboardData";
import { BRAND_COLOR, EMPTY_STATE_MESSAGES, GRAY_TONES } from "@/lib/dashboardConstants";
import { ProgressBarItem } from "./ProgressBarItem";

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
  const topEmotions = getTopEmotions(5);

  if (topEmotions.length === 0) {
    return <div className="text-sm text-gray-500">{EMPTY_STATE_MESSAGES.emotion}</div>;
  }

  const maxValue = Math.max(...topEmotions.map((e) => e.value));

  return (
    <div className="space-y-4">
      {topEmotions.map((emotion, index) => {
        const percentage = maxValue > 0 ? (emotion.value / maxValue) * 100 : 0;
        const isHighest = emotion.value === maxValue;
        const color = isHighest ? BRAND_COLOR : GRAY_TONES[index % GRAY_TONES.length];

        return (
          <ProgressBarItem
            key={`${emotion.emotion}-${index}`}
            label={EMOTION_LABELS[emotion.emotion] || emotion.emotion}
            value={emotion.value}
            percentage={percentage}
            color={color}
          />
        );
      })}
    </div>
  );
}

