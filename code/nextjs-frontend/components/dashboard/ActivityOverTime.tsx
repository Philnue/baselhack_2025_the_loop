"use client";

import { useId } from "react";
import { BRAND_COLOR } from "@/lib/dashboardConstants";

export function ActivityOverTime() {
  const gradientId = useId();
  const dataPoints = [40, 35, 55, 42, 60, 48, 52, 45, 58, 50, 62, 55];
  const maxValue = Math.max(...dataPoints);
  const minValue = Math.min(...dataPoints);
  const range = maxValue - minValue || 1;
  
  const normalizedPoints = dataPoints.map(
    (point) => ((point - minValue) / range) * 80 + 10
  );

  const width = 280;
  const height = 120;
  const step = width / (normalizedPoints.length - 1);
  
  let pathData = `M 0 ${height - normalizedPoints[0]}`;
  for (let i = 1; i < normalizedPoints.length; i++) {
    pathData += ` L ${i * step} ${height - normalizedPoints[i]}`;
  }

  const areaPath = `${pathData} L ${width} ${height} L 0 ${height} Z`;

  return (
    <div className="space-y-2">
      <div className="flex items-baseline gap-2">
        <p className="text-2xl font-semibold text-gray-900">32</p>
        <p className="text-sm text-gray-600">Opinions</p>
      </div>
      <p className="text-sm" style={{ color: BRAND_COLOR }}>
        last month +12%
      </p>
      
      <div className="mt-4 w-full">
        <svg
          width="100%"
          height={height}
          viewBox={`0 0 ${width} ${height}`}
          className="overflow-visible"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={BRAND_COLOR} stopOpacity="0.3" />
              <stop offset="100%" stopColor={BRAND_COLOR} stopOpacity="0" />
            </linearGradient>
          </defs>
          <path
            d={areaPath}
            fill={`url(#${gradientId})`}
            fillOpacity="0.2"
          />
          <path
            d={pathData}
            fill="none"
            stroke={BRAND_COLOR}
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  );
}

