"use client";

export function EngagementSnapshot() {
  return (
    <div className="space-y-4">
      {/* Main engagement metric */}
      <div>
        <p className="text-gray-900">
          <span className="text-3xl font-bold">128</span>{" "}
          <span className="text-xl font-normal">Engagements</span>
        </p>
        <p className="text-sm text-gray-500 mt-1">Last Month +25%</p>
      </div>

      {/* Upvotes metric */}
      <div>
        <p className="text-sm text-gray-500">Upvotes</p>
        <p className="text-2xl font-bold text-gray-900 mt-1">86</p>
      </div>
    </div>
  );
}

