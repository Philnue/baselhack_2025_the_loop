import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ActivityOverTime } from "@/components/dashboard/ActivityOverTime";
import { ImpactScore } from "@/components/dashboard/ImpactScore";
import { TopOpinionCategories } from "@/components/dashboard/TopOpinionCategories";
import { EngagementSnapshot } from "@/components/dashboard/EngagementSnapshot";
import { TopEmotions } from "@/components/dashboard/TopEmotions";
import { TopSentiment } from "@/components/dashboard/TopSentiment";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-white">
      <main className="container mx-auto px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <h1 className="mb-8 text-2xl font-semibold text-gray-900 sm:text-3xl">
          Dashboard
        </h1>

        <section className="mb-8">
          <h2 className="mb-6 text-xl font-semibold text-gray-900">
            My Contributions
          </h2>

          {/* Responsive Grid: 1 column on mobile, 2 columns on desktop */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Total Opinions Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base font-medium text-gray-700">
                  Total Opinions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-semibold text-gray-900">142</p>
              </CardContent>
            </Card>

            {/* Discussions Joined Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base font-medium text-gray-700">
                  Discussions Joined
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-semibold text-gray-900">35</p>
              </CardContent>
            </Card>

            {/* Activity Over Time Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base font-medium text-gray-700">
                  Activity Over Time
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ActivityOverTime />
              </CardContent>
            </Card>

            {/* Your Impact Score Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base font-medium text-gray-700">
                  Your Impact Score
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ImpactScore score={8.2} maxScore={10} />
              </CardContent>
            </Card>

            {/* Top Opinion Categories Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base font-medium text-blue-400">
                  Top Opinion Categories
                </CardTitle>
              </CardHeader>
              <CardContent>
                <TopOpinionCategories />
              </CardContent>
            </Card>

            {/* Engagement Snapshot Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base font-medium text-blue-400">
                  Engagement Snapshot
                </CardTitle>
              </CardHeader>
              <CardContent>
                <EngagementSnapshot />
              </CardContent>
            </Card>

            {/* Top Emotions Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base font-medium text-blue-400">
                  Top Emotions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <TopEmotions />
              </CardContent>
            </Card>

            {/* Top Sentiment Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base font-medium text-blue-400">
                  Top Sentiment
                </CardTitle>
              </CardHeader>
              <CardContent>
                <TopSentiment />
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
    </div>
  );
}
