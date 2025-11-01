import { Button } from "@/components/ui/button";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-white text-gray-900">

      {/* Main Hero Section */}
      {/* Adjusted padding for responsive sizes */}
  <main className="flex w-full flex-col items-center px-6 py-16 sm:py-24 lg:py-32">
        
        {/* Pill-shaped container (updated text and style) */}
        <div className="mb-8 rounded-full border border-pink-500  px-5 py-2 text-sm font-medium text-pink-700">
          <span>AI powered consensus building</span>
        </div>

        {/* Main heading - Adjusted font size for responsive design */}
        <h1 className="mb-6 text-center text-4xl font-bold leading-tight tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
          Wisdom of the Crowd,
          <br />
          Amplified by AI
        </h1>

        {/* Descriptive paragraph */}
        <p className="mb-12 max-w-2xl text-center text-lg leading-relaxed text-gray-600">
          Collect diverse opinions, discover common ground, and find meaningful
          consensus through AI-powered synthesis.
        </p>

        {/* Action buttons (already responsive with sm:flex-row) */}
        <div className="flex flex-col gap-4 sm:flex-row">
          <Button
            variant="default"
            size="lg"
            className="h-12 rounded-sm bg-[#A8005C] px-8 text-white hover:bg-[#8A004B] transition-colors" // Updated color
          >
            <p className="text-sm font-bold">Start a Discussion</p>
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="h-12 rounded-sm border-2 border-[#A8005C] px-8 text-[#A8005C] hover:bg-pink-50 hover:text-[#A8005C] transition-colors" // Updated color
          >
            <p className="text-sm font-bold">Browse Topics</p>
          </Button>
        </div>
      </main>
    </div>
  );
}


