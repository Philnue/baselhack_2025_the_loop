"use client";

export function EngagementSnapshot() {
  return (
    <div className="space-y-4">
      {/* Main engagement metric */}
      <div>
        <p className="text-2xl font-semibold text-gray-900">128 Engagements</p>
        <p className="text-sm text-green-600">Last Month +25%</p>
      </div>

      {/* Split cards for mobile, side by side on desktop */}
      <div className="grid grid-cols-2 gap-4">
        {/* Upvotes card */}
        <div className="rounded-lg bg-purple-50 p-4">
          <p className="text-2xl font-semibold text-gray-900">86</p>
          <p className="text-sm text-gray-600">Upvotes</p>
        </div>

        {/* Growth card */}
        <div className="rounded-lg bg-green-50 p-4">
          <p className="text-2xl font-semibold text-gray-900">+25%</p>
          <p className="text-sm text-gray-600">Last month</p>
        </div>
      </div>
    </div>
  );
}

