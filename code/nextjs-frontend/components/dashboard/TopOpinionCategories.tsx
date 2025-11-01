"use client";

import { themeData } from "@/lib/dashboardData";

const categoryColors = [
  "#A8005C", // Brand pink
  "#3B82F6", // Blue
  "#F97316", // Orange
  "#10B981", // Green
  "#8B5CF6", // Purple
  "#EF4444", // Red
  "#6366F1", // Indigo
  "#F59E0B", // Amber
];

export function TopOpinionCategories() {
  // Sort by total_weight and take top 5
  const topCategories = [...themeData]
    .sort((a, b) => b.total_weight - a.total_weight)
    .slice(0, 5);

  if (topCategories.length === 0) {
    return (
      <div className="text-sm text-gray-500">No category data available</div>
    );
  }

  // Find max weight for percentage calculation
  const maxWeight = Math.max(...topCategories.map((c) => c.total_weight));

  return (
    <div className="space-y-4">
      {topCategories.map((category, index) => {
        const percentage = maxWeight > 0 ? (category.total_weight / maxWeight) * 100 : 0;
        const color = categoryColors[index % categoryColors.length];

        return (
          <div key={category.theme_label} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {/* Color dot - visible on mobile */}
                <div
                  className="h-3 w-3 rounded-full lg:hidden"
                  style={{ backgroundColor: color }}
                />
                <span className="text-sm font-medium text-gray-700">
                  {category.theme_label}
                </span>
              </div>
              <span className="text-sm font-semibold text-gray-900">
                {category.total_weight.toFixed(2)}
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

