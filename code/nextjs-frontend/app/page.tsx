import { Button } from "@/components/ui/button";

// A simple SVG placeholder for the logo, styled to resemble the screenshot
const Logo = () => (
  <svg width="32" height="32" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* These paths create a simple, abstract logo similar to the one in the screenshot */}
    <path d="M20 20H50V40H40V80H20V20Z" fill="#4f46e5"/> {/* Darker blue/purple */}
    <path d="M80 80H50V60H60V20H80V80Z" fill="#a5b4fc"/> {/* Lighter blue */}
  </svg>
);

// SVG for the mobile menu (hamburger) icon
const MenuIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="3" y1="12" x2="21" y2="12"></line>
    <line x1="3" y1="6" x2="21" y2="6"></line>
    <line x1="3" y1="18" x2="21" y2="18"></line>
  </svg>
);


export default function Dashboard() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Header/Navbar */}
      {/* Added 'relative' for centered tablet nav positioning */}
      <header className="relative flex h-20 w-full items-center justify-between border-b border-gray-200 px-6 sm:px-10">
        
        {/* Left side: Logo and App Name */}
        <div className="flex items-center gap-3">
          <Logo />
          {/* "Consenza" text is visible on mobile and desktop, but hidden on tablet */}
          <span className="text-xl font-semibold text-gray-800 md:hidden lg:inline">Consenza</span>
        </div>

        {/* Center Nav (Tablet Only) */}
        <nav className="hidden md:flex lg:hidden absolute left-1/2 -translate-x-1/2 items-center gap-8">
          <a href="#" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
            Dashboard
          </a>
          <a href="#" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
            Discussions
          </a>
        </nav>

        {/* Right side: Nav Links, Actions (Create New Button and Avatar) */}
        {/* <div className="hidden md:flex items-center gap-8">
          <nav className="hidden lg:flex items-center gap-8">
            <a href="#" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
              Dashboard
            </a>
            <a href="#" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
              Discussions
            </a>
          </nav>
        </div> */}

        {/* Mobile Menu Button (Mobile Only) */}
        <button className="md:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100">
          <MenuIcon />
        </button>

        <div className="hidden md:flex items-center gap-8">
          <nav className="hidden lg:flex items-center gap-8">
            <a href="#" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
              Dashboard
            </a>
            <a href="#" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
              Discussions
            </a>
          </nav>

          <div className="flex items-center gap-15">
            <Button
              variant="default"
              className="h-10 rounded-md bg-[#A8005C] px-6 text-white hover:bg-[#8A004B] transition-colors" 
            >
              Create New
            </Button>
            <div className="h-10 w-10 rounded-full bg-gray-200"></div>
          </div>
        </div>
      </header>

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


