import type { ReactNode } from "react";
import { readReport } from "@/app/services/ResultsService";
import type {
  DiscussionReportResponse,
  ThemeBoardEntry,
  SentimentRow,
  EmotionRow,
  EvidenceEntry,
} from "@/app/services/ResultsService";
import {
  MessageSquareText,
  LayoutList,
  PieChart,
  CheckCheck,
  GitPullRequestArrow,
  Hash, // Added for the new card icons
} from "lucide-react";

type EmotionMetricKey = Exclude<keyof EmotionRow, "theme_label">;

// NEW: A flexible card component to match the UI design
type ReportCardProps = {
  icon: ReactNode;
  title: string;
  description: string;
  children: ReactNode;
  className?: string; // To allow passing grid-span classes
};


// NEW: Component to render the "Consensus" bar chart
function ConsensusCard({ themes }: { themes: ThemeBoardEntry[] }) {
  if (!themes || themes.length === 0) {
    return (
      <p className="text-sm text-gray-500">
        No consensus data was found.
      </p>
    );
  }

  // UPDATED: Sort themes by consensus descending FIRST
  const sortedThemes = [...themes].sort(
    (a, b) => (b.consensus || 0) - (a.consensus || 0),
  );

  // Take the top 5 from the sorted list
  const topThemes = sortedThemes.slice(0, 5);

  return (
    <div className="space-y-4">
      {topThemes.map((theme) => {
        const consensusValue = theme.consensus || 0;

        return (
          <div key={theme.theme_label}>
            <div className="mb-1.5 flex justify-between text-sm font-medium text-gray-700">
              <span>{theme.theme_label}</span>
              {/* Format the consensus value as a percentage */}
              <span>{consensusValue.toFixed(0)}%</span>
            </div>
            <div className="h-4 w-full rounded-full bg-gray-200">
              <div
                // UPDATED: Use gray-700 to match Key Themes
                className="h-4 rounded-full bg-gray-700"
                style={{ width: `${consensusValue}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

function markdownToHtml(value: string): string {
  return value
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\n/g, "<br />");
}

function formatPercentage(value: number | null | undefined, digits = 0): string {
  const numericValue = value ?? NaN;
  if (Number.isNaN(numericValue)) {
    return "—";
  }

  return `${(numericValue * 100).toFixed(digits)}%`;
}

// REMOVED: Unused formatConsensus function

// NEW: Reusable card component matching the UI spec
function ReportCard({
  icon,
  title,
  description,
  children,
  className = "",
}: ReportCardProps) {
  return (
    <div
      className={`flex h-full flex-col justify-start rounded-lg border border-gray-200 bg-white p-6 shadow-sm ${className}`}
    >
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 rounded-full bg-gray-100 p-3">{icon}</div>
        <div className="flex-1">
          <h3 className="font-sans text-xl font-semibold text-gray-900">
            {title}
          </h3>
          <p className="text-sm text-gray-500">{description}</p>
        </div>
      </div>
      {/* Render children content with spacing */}
      <div className="mt-6 flex-1">{children}</div>
    </div>
  );
}

// NEW: Component to render the "Key Themes" bar chart
// NEW: Component to render the "Key Themes" bar chart
function KeyThemesCard({ themes }: { themes: ThemeBoardEntry[] }) {
  if (!themes || themes.length === 0) {
    return (
      <p className="text-sm text-gray-500">No key themes were identified.</p>
    );
  }
  // Take the top 5 themes to match the UI image
  const topThemes = themes.slice(0, 5);

  // Calculate the total weight of the top 5 themes
  const totalWeight = topThemes.reduce(
    (sum, theme) => sum + (theme.total_weight || 0),
    0,
  );

  // If totalWeight is 0, prevent division by zero
  if (totalWeight === 0) {
    return (
      <p className="text-sm text-gray-500">
        No weight data available for key themes.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {topThemes.map((theme) => {
        // Calculate the percentage based on total_weight
        const weightPercentage = theme.total_weight / totalWeight;

        return (
          <div key={theme.theme_label}>
            <div className="mb-1.5 flex justify-between text-sm font-medium text-gray-700">
              <span>{theme.theme_label}</span>
              {/* Use the new weightPercentage */}
              <span>{formatPercentage(weightPercentage, 0)}</span>
            </div>
            <div className="h-4 w-full rounded-full bg-gray-200">
              <div
                className="h-4 rounded-full bg-gray-700" // Dark gray bar to match image
                style={{ width: formatPercentage(weightPercentage, 0) }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

// REMOVED: Unused InfoCard, themeIcons, and mapThemeCards

function SentimentTable({ rows }: { rows: SentimentRow[] }) {
  if (rows.length === 0) {
    return null;
  }

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
              Theme
            </th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-emerald-600">
              Positive
            </th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
              Neutral
            </th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-rose-600">
              Negative
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {rows.map((row) => (
            <tr key={row.theme_label}>
              <td className="px-4 py-3 text-sm font-medium text-gray-900">
                {row.theme_label}
              </td>
              <td className="px-4 py-3 text-sm text-gray-700">
                {row.positive}
              </td>
              <td className="px-4 py-3 text-sm text-gray-700">{row.neutral}</td>
              <td className="px-4 py-3 text-sm text-gray-700">
                {row.negative}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function EmotionTable({ rows }: { rows: EmotionRow[] }) {
  if (rows.length === 0) {
    return null;
  }

  const headers: EmotionMetricKey[] = [
    "Emotion.ANGER",
    "Emotion.ANTICIPATION",
    "Emotion.FEAR",
    "Emotion.JOY",
    "Emotion.SADNESS",
    "Emotion.TRUST",
  ];

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
              Theme
            </th>
            {headers.map((header) => (
              <th
                key={header}
                className="px-4 py-3 text-left text-sm font-semibold text-gray-600"
              >
                {header.replace("Emotion.", "")}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {rows.map((row) => (
            <tr key={row.theme_label}>
              <td className="px-4 py-3 text-sm font-medium text-gray-900">
                {row.theme_label}
              </td>
              {headers.map((header) => (
                <td key={header} className="px-4 py-3 text-sm text-gray-700">
                  {formatPercentage(row[header], 0)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// UPDATED: Made title optional to avoid empty space in cards
function EvidenceList({
  title,
  items,
}: {
  title?: string;
  items: EvidenceEntry[];
}) {
  if (!items || items.length === 0) {
    // UPDATED: Return a placeholder p-tag instead of null
    return (
      <p className="text-sm text-gray-500">
        No evidence items to display for this section.
      </p>
    );
  }

  return (
    <section className={title ? "space-y-3" : ""}>
      {title && (
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      )}
      <div className="space-y-3">
        {items.map((item, index) => (
          <div
            key={`${item.theme_label}-${index}`}
            className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
          >
            <div className="text-sm font-semibold text-[#A8005C]">
              {item.theme_label}
            </div>
            <div className="mt-1 text-sm text-gray-500">
              {item.evidence_type} · Score {(item.score * 100).toFixed(1)} ·
              Weight {item.w.toFixed(2)}
            </div>
            <p className="mt-2 text-sm text-gray-700">{item.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

// UPDATED: Made title optional
function SummaryList({
  title,
  items,
}: {
  title?: string;
  items: string[];
}) {
  if (!items || items.length === 0) {
    return (
      <p className="text-sm text-gray-500">No items to display for this section.</p>
    );
  }

  return (
    <section className={title ? "space-y-3" : ""}>
      {title && (
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      )}
      <ul className="list-disc space-y-2 pl-5 text-sm text-gray-700">
        {items.map((item, index) => (
          <li
            key={`${title}-${index}`}
            className="leading-relaxed"
            dangerouslySetInnerHTML={{ __html: markdownToHtml(item) }}
          />
        ))}
      </ul>
    </section>
  );
}

export default async function DiscussionPage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = await params;

  let data: DiscussionReportResponse | null = null;
  let loadError: string | null = null;

  try {
    data = await readReport(slug);
  } catch (error) {
    console.error("Failed to load report", error);
    loadError =
      "We couldn't fetch this report right now. Please try again later.";
  }

  const report = data?.report ?? null;
  // REMOVED: cardData is no longer needed
  const agreedTopics = report?.payload?.summary?.agreed_topics ?? [];
  const disagreedTopics = report?.payload?.summary?.disagreed_topics ?? [];
  
  // NEW: Process the list to only get headings
  const conflictingTopicHeadings = disagreedTopics.map(item => {
    return item.split(" — ")[0]; // Get the part before the " — " separator
  });

  const topWeightedPoints = report?.summary?.top_weighted_points ?? [];
  const highlights = report?.payload?.evidence?.highlights_top3 ?? [];
  const weightedEvidence =
    report?.payload?.evidence?.top10_weighted_texts ?? [];

  return (
    <main className="flex min-h-screen flex-col items-center justify-start bg-gray-50 p-4 sm:p-8 lg:p-12">
      <div className="w-full max-w-5xl">
        {loadError ? (
          <div className="rounded-md border border-red-200 bg-red-50 p-6 text-sm text-red-600">
            {loadError}
          </div>
        ) : data ? (
          <>
            <header className="mb-8">
              <h1 className="mb-2 text-3xl font-bold text-gray-900 sm:text-4xl">
                {data.name}
              </h1>
              <p className="mt-4 text-lg text-gray-600">
                {data.description || "No description provided."}
              </p>

              {data.tags && data.tags.length > 0 && (
                <div className="mt-6 flex flex-wrap gap-3">
                  {data.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-block rounded-full border border-gray-300 bg-white px-4 py-1.5 text-sm font-medium text-[#A8005C]"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              <hr className="mt-6 border-gray-200" />
            </header>

            {report ? (
              <>
                {/* === NEW DASHBOARD LAYOUT === */}

                {/* --- Row 1: Consensus Summary (Full Width) --- */}
                <ReportCard
                  icon={<Hash className="h-6 w-6 text-gray-700" />}
                  title="Consensus Summary"
                  description="A detailed explanation of the AI's findings"
                  className="mb-6" // Use margin-bottom instead of grid for the first item
                >
                  <div className="space-y-4 text-gray-700">
                    <p>{report.summary.main_summary}</p>
                    <h4 className="text-sm font-semibold text-gray-800">
                      Conflicting Viewpoint
                    </h4>
                    {report.summary.conficting_statement && (
                      <div className="rounded-md border border-amber-200 bg-amber-50 p-4 text-sm text-amber-700">
                        {report.summary.conficting_statement}
                      </div>
                    )}
                  </div>
                </ReportCard>

                {/* --- Row 2 & 3: The 2x2 Grid --- */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  {/* --- Key Themes --- */}
                  <ReportCard
                    icon={<LayoutList className="h-6 w-6 text-gray-700" />}
                    title="Key Themes"
                    description="Main ideas that emerged from the discussion"
                  >
                    <KeyThemesCard themes={report.theme_board} />
                  </ReportCard>

                  <ReportCard
                    icon={<MessageSquareText className="h-6 w-6 text-gray-700" />}
                    title="Top Weighted Points"
                    description="The most impactful points from the discussion"
                  >
                    {/* This renders a clean bulleted list */}
                    <SummaryList items={topWeightedPoints} />
                  </ReportCard>

                  {/* --- Agreements --- */}
                  <ReportCard
                    icon={<CheckCheck className="h-6 w-6 text-gray-700" />}
                    title="Consensus"
                    description="Consensus level for each key theme"
                  >
                    <ConsensusCard themes={report.theme_board} />
                  </ReportCard>

                  {/* --- Conflicting Viewpoints --- */}
                  <ReportCard
                    icon={
                      <GitPullRequestArrow className="h-6 w-6 text-gray-700" />
                    }
                    title="Conflicting viewpoints"
                    description="Areas where opinions differ significantly"
                  >
                    {/* UPDATED: Pass the new processed list */}
                    <SummaryList items={conflictingTopicHeadings} />
                  </ReportCard>
                </div>

                {/* === END OF NEW DASHBOARD === */}

                {/* === NEW "Detailed Analysis" Section for extra stuff === */}
                <hr className="my-12 border-gray-200" />
                <h2 className="mb-8 text-2xl font-semibold text-gray-900">
                  Detailed Analysis
                </h2>

                <section className="space-y-8">

                  <div>
                    <h3 className="mb-3 text-lg font-semibold text-gray-900">
                      Sentiment Analysis
                    </h3>
                    <SentimentTable rows={report.sentiment_table} />
                  </div>

                  <div>
                    <h3 className="mb-3 text-lg font-semibold text-gray-900">
                      Emotion Analysis
                    </h3>
                    <EmotionTable rows={report.emotion_table} />
                  </div>

                  <EvidenceList title="Top Highlights" items={highlights} />

                </section>
                {/* === END OF Detailed Analysis === */}
              </>
            ) : (
              <div className="rounded-md border border-blue-200 bg-blue-50 p-6 text-sm text-blue-700">
                This discussion report is still generating. Check back soon for
                the full analysis.
              </div>
            )}
          </>
        ) : null}
      </div>
    </main>
  );
}