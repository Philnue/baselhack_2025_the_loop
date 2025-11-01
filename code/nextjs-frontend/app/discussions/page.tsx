import DiscussionCard from "@/components/DiscussionCard";
import { getDiscussionsService, type Discussion } from "@/app/services/DiscussionsService";

function formatRelativeTime(dateIso?: string) {
  if (!dateIso) {
    return "Just now";
  }

  const date = new Date(dateIso);
  if (Number.isNaN(date.getTime())) {
    return "Just now";
  }

  const now = Date.now();
  const diffMs = date.getTime() - now;
  const diffSec = Math.round(diffMs / 1000);
  const absSec = Math.abs(diffSec);

  const units: Array<[Intl.RelativeTimeFormatUnit, number]> = [
    ["year", 60 * 60 * 24 * 365],
    ["month", 60 * 60 * 24 * 30],
    ["week", 60 * 60 * 24 * 7],
    ["day", 60 * 60 * 24],
    ["hour", 60 * 60],
    ["minute", 60],
    ["second", 1],
  ];

  const formatter = new Intl.RelativeTimeFormat(undefined, { numeric: "auto" });
  for (const [unit, secondsInUnit] of units) {
    if (absSec >= secondsInUnit || unit === "second") {
      const value = Math.round(diffSec / secondsInUnit);
      return formatter.format(value, unit);
    }
  }

  return "Just now";
}

function formatTagSummary(tags: string[]) {
  if (!tags || tags.length === 0) {
    return "No tags";
  }

  if (tags.length === 1) {
    return `#${tags[0]}`;
  }

  const [first, second, ...rest] = tags;
  if (rest.length === 0) {
    return `#${first}, #${second}`;
  }

  return `#${first}, #${second} +${rest.length} more`;
}

export default async function DiscussionsPage() {
  let discussions: Discussion[] = [];
  let loadError: string | null = null;

  try {
    discussions = await getDiscussionsService();
  } catch (error) {
    console.error("Failed to load discussions list", error);
    loadError = "We couldn't fetch discussions right now. Please try again later.";
  }

  const hasDiscussions = discussions.length > 0;

  return (
    <div className="flex min-h-screen flex-col">
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <h1 className="text-3xl font-semibold text-gray-900 sm:text-4xl">
          Browse Discussions
        </h1>

        <div className="mt-4 text-gray-500">
          Explore active discussions and add your perspective
        </div>

        {loadError ? (
          <div className="mt-8 rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-600">
            {loadError}
          </div>
        ) : hasDiscussions ? (
          <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {discussions.map((discussion) => (
              <DiscussionCard
                key={discussion.id}
                title={discussion.name}
                desc={discussion.description}
                created={formatRelativeTime(discussion.created_at)}
                responses={formatTagSummary(discussion.tags ?? [])}
                id={discussion.id}
              />
            ))}
          </div>
        ) : (
          <div className="mt-8 rounded-md border border-dashed border-gray-300 bg-white p-8 text-center text-sm text-gray-500">
            No discussions yet. Create one to get the conversation started!
          </div>
        )}
      </div>
    </div>
  );
}
