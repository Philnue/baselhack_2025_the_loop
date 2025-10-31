import { Button } from "@/components/ui/button";

export default function Dashboard() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-white dark:bg-black">
      <main className="flex w-full max-w-3xl flex-col items-center px-6 py-16 sm:px-8">
        {/* Pill-shaped container with placeholder text */}
        <div className="mb-8 rounded-full border border-gray-200 bg-gray-50 px-4 py-2 text-sm text-gray-600 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400">
          <span>some text here lorem ipsum abc</span>
        </div>

        {/* Main heading */}
        <h1 className="mb-6 text-center text-5xl font-bold leading-tight tracking-tight text-gray-900 dark:text-gray-50 sm:text-6xl">
          Wisdom of the Crowd,
          <br />
          Amplified by AI
        </h1>

        {/* Descriptive paragraph */}
        <p className="mb-12 max-w-2xl text-center text-lg leading-relaxed text-gray-600 dark:text-gray-400">
          Collect diverse opinions, discover common ground, and find meaningful
          consensus through AI-powered synthesis.
        </p>

        {/* Action buttons */}
        <div className="flex flex-col gap-4 sm:flex-row">
          <Button
            variant="default"
            size="lg"
            className="h-12 rounded-lg bg-black px-8 text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200"
          >
            Start a Discussion
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="h-12 rounded-lg border-gray-300 px-8 text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-900"
          >
            Browse Topics
          </Button>
        </div>
      </main>
    </div>
  );
}
