"use client";

import { themeData } from "@/lib/dashboardData";
import { EMPTY_STATE_MESSAGES } from "@/lib/dashboardConstants";

export function TopOpinionCategories() {
  const topCategories = [...themeData]
    .sort((a, b) => b.total_weight - a.total_weight)
    .slice(0, 3);

  if (topCategories.length === 0) {
    return <div className="text-sm text-gray-500">{EMPTY_STATE_MESSAGES.category}</div>;
  }

  const totalWeight = topCategories.reduce((sum, c) => sum + c.total_weight, 0);

  return (
    <div className="space-y-3">
      {topCategories.map((category) => {
        const percentage =
          totalWeight > 0
            ? Math.round((category.total_weight / totalWeight) * 100)
            : 0;

        return (
          <div
            key={category.theme_label}
            className="flex items-center justify-between"
          >
            <span className="text-sm text-gray-700">{category.theme_label}</span>
            <span className="text-sm text-gray-700">{percentage}%</span>
          </div>
        );
      })}
    </div>
  );
}

