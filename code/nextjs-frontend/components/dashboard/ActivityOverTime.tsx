"use client";

import { useId } from "react";

export function ActivityOverTime() {
  const gradientId = useId();
  // Sample data points for the line graph
  const dataPoints = [40, 35, 55, 42, 60, 48, 52, 45, 58, 50, 62, 55];
  const maxValue = Math.max(...dataPoints);
  const minValue = Math.min(...dataPoints);
  const range = maxValue - minValue || 1;
  
  // Normalize data points to fit SVG (0-100 scale)
  const normalizedPoints = dataPoints.map(
    (point) => ((point - minValue) / range) * 80 + 10
  );

  // Generate path for the line
  const width = 280;
  const height = 120;
  const step = width / (normalizedPoints.length - 1);
  
  let pathData = `M 0 ${height - normalizedPoints[0]}`;
  normalizedPoints.forEach((point, index) => {
    if (index > 0) {
      pathData += ` L ${index * step} ${height - point}`;
    }
  });

  // Generate area path (for fill)
  const areaPath = `${pathData} L ${width} ${height} L 0 ${height} Z`;

  return (
    <div className="space-y-2">
      <div className="flex items-baseline gap-2">
        <p className="text-2xl font-semibold text-gray-900">32</p>
        <p className="text-sm text-gray-600">Opinions</p>
      </div>
      <p className="text-sm text-[#A8005C]">last month +12%</p>
      
      {/* SVG Line Chart */}
      <div className="mt-4 w-full">
        <svg
          width="100%"
          height={height}
          viewBox={`0 0 ${width} ${height}`}
          className="overflow-visible"
          preserveAspectRatio="none"
        >
          {/* Area fill */}
          <path
            d={areaPath}
            fill={`url(#${gradientId})`}
            fillOpacity="0.2"
          />
          {/* Line */}
          <path
            d={pathData}
            fill="none"
            stroke="#A8005C"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Gradient definition */}
          <defs>
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#A8005C" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#A8005C" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>
  );
}

