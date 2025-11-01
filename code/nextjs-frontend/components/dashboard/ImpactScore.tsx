"use client";

interface ImpactScoreProps {
  score: number;
  maxScore: number;
}

export function ImpactScore({ score, maxScore }: ImpactScoreProps) {
  const percentage = (score / maxScore) * 100;
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  // Determine rating text
  let rating = "Good";
  if (percentage >= 80) rating = "Excellent";
  else if (percentage >= 60) rating = "Good";
  else if (percentage >= 40) rating = "Fair";
  else rating = "Needs Improvement";

  return (
    <div className="flex flex-col items-center justify-center py-4">
      <div className="relative flex items-center justify-center">
        <svg
          width="140"
          height="140"
          viewBox="0 0 120 120"
          className="transform -rotate-90"
        >
          {/* Background circle */}
          <circle
            cx="60"
            cy="60"
            r={radius}
            stroke="#E5E7EB"
            strokeWidth="10"
            fill="none"
          />
          {/* Progress circle */}
          <circle
            cx="60"
            cy="60"
            r={radius}
            stroke="#A8005C"
            strokeWidth="10"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-500 ease-in-out"
          />
        </svg>
        {/* Center text */}
        <div className="absolute flex flex-col items-center justify-center">
          <p className="text-3xl font-semibold text-gray-900">
            {score}/{maxScore}
          </p>
          <p className="text-sm font-medium text-[#A8005C]">{rating}</p>
        </div>
      </div>
    </div>
  );
}

