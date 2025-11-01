"use client";

import { themeData } from "@/lib/dashboardData";
import { BRAND_COLOR, EMPTY_STATE_MESSAGES, GRAY_TONES } from "@/lib/dashboardConstants";
import { ProgressBarItem } from "./ProgressBarItem";

export function TopOpinionCategories() {
  const topCategories = [...themeData]
    .sort((a, b) => b.total_weight - a.total_weight)
    .slice(0, 5);

  if (topCategories.length === 0) {
    return <div className="text-sm text-gray-500">{EMPTY_STATE_MESSAGES.category}</div>;
  }

  const maxWeight = Math.max(...topCategories.map((c) => c.total_weight));

  return (
    <div className="space-y-4">
      {topCategories.map((category, index) => {
        const percentage = maxWeight > 0 ? (category.total_weight / maxWeight) * 100 : 0;
        const isHighest = category.total_weight === maxWeight;
        const color = isHighest ? BRAND_COLOR : GRAY_TONES[index % GRAY_TONES.length];

        return (
          <ProgressBarItem
            key={category.theme_label}
            label={category.theme_label}
            value={category.total_weight}
            percentage={percentage}
            color={color}
          />
        );
      })}
    </div>
  );
}

