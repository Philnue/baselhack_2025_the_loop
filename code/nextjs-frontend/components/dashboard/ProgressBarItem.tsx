"use client";

interface ProgressBarItemProps {
  readonly label: string;
  readonly value: number;
  readonly percentage: number;
  readonly color: string;
  readonly valueFormatter?: (value: number) => string;
  readonly showPercentage?: boolean;
}

export function ProgressBarItem({
  label,
  value,
  percentage,
  color,
  valueFormatter = (v) => v.toFixed(2),
  showPercentage = false,
}: ProgressBarItemProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div
            className="h-3 w-3 rounded-full lg:hidden"
            style={{ backgroundColor: color }}
          />
          <span className="text-sm font-medium text-gray-700">{label}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-gray-900">
            {valueFormatter(value)}
          </span>
          {showPercentage && (
            <span className="text-sm text-gray-500">
              ({percentage.toFixed(1)}%)
            </span>
          )}
        </div>
      </div>
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
}

