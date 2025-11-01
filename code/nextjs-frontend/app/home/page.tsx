import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      <main className="flex w-full flex-col items-center px-6 py-16 sm:py-24 lg:py-32">
        <div className="mb-8 rounded-full border border-pink-500  px-5 py-2 text-sm font-medium text-pink-700">
          <span>Consenza</span>
        </div>

        <h1 className="font-serif mb-6 text-center text-4xl font-medium leading-tight tracking-medium text-gray-900 sm:text-5xl lg:text-6xl">
          From every opinion,
          <br />
          a shared decision
        </h1>

        <p className="font-sans mb-12 max-w-2xl text-center text-lg leading-relaxed text-gray-600">
          Collect diverse opinions, discover common ground, and find meaningful
          consensus through AI-powered synthesis.
        </p>

        <div className="flex flex-col gap-4 sm:flex-row">
          <Button
            variant="default"
            size="lg"
            asChild
            className="h-12 rounded-sm bg-[#A8005C] px-8 text-white hover:bg-[#8A004B] transition-colors"
          >
            <Link href="/discussions/new">
              <p className="text-sm font-bold">Start a Discussion</p>
            </Link>
          </Button>
          <Button
            variant="outline"
            size="lg"
            asChild
            className="h-12 rounded-sm border-2 border-[#A8005C] px-8 text-[#A8005C] hover:bg-pink-50 hover:text-[#A8005C] transition-colors"
          >
            <Link href="/discussions">
              <p className="text-sm font-bold">Browse Topics</p>
            </Link>
          </Button>
        </div>
      </main>
    </div>
  );
}

