"use client";

import { BRAND_COLOR } from "@/lib/dashboardConstants";

interface ImpactScoreProps {
  readonly score: number;
  readonly maxScore: number;
}

function getRating(percentage: number): string {
  if (percentage >= 80) return "Excellent";
  if (percentage >= 60) return "Good";
  if (percentage >= 40) return "Fair";
  return "Needs Improvement";
}

export function ImpactScore({ score, maxScore }: ImpactScoreProps) {
  const percentage = (score / maxScore) * 100;
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center py-4">
      <div className="relative flex items-center justify-center">
        <svg
          width="140"
          height="140"
          viewBox="0 0 120 120"
          className="transform -rotate-90"
        >
          <circle
            cx="60"
            cy="60"
            r={radius}
            stroke="#E5E7EB"
            strokeWidth="10"
            fill="none"
          />
          <circle
            cx="60"
            cy="60"
            r={radius}
            stroke={BRAND_COLOR}
            strokeWidth="10"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-500 ease-in-out"
          />
        </svg>
        <div className="absolute flex flex-col items-center justify-center">
          <p className="text-3xl font-semibold text-gray-900">
            {score}/{maxScore}
          </p>
          <p className="text-sm font-medium" style={{ color: BRAND_COLOR }}>
            {getRating(percentage)}
          </p>
        </div>
      </div>
    </div>
  );
}

