"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

const Logo = () => (
  <svg
    width="32"
    height="32"
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M20 20H50V40H40V80H20V20Z" fill="#4f46e5" />
    <path d="M80 80H50V60H60V20H80V80Z" fill="#a5b4fc" />
  </svg>
);

const MenuIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="3" y1="12" x2="21" y2="12"></line>
    <line x1="3" y1="6" x2="21" y2="6"></line>
    <line x1="3" y1="18" x2="21" y2="18"></line>
  </svg>
);

export function GlobalNavbar() {
  return (
    <header className="relative flex h-20 w-full items-center justify-between border-b border-gray-200 px-6 sm:px-10">
      <div className="flex items-center gap-3">
        <Link href="/">
          <Logo />
        </Link>
        <Link href="/">
          <span className="text-xl font-semibold text-gray-800 md:hidden lg:inline">
            Consenza
          </span>
        </Link>
      </div>

      <nav className="hidden md:flex lg:hidden absolute left-1/2 -translate-x-1/2 items-center gap-8">
        <Link
          href="/"
          className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
        >
          Dashboard
        </Link>
        <Link
          href="/discussions"
          className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
        >
          Discussions
        </Link>
      </nav>

      <Button variant="ghost" size="icon" className="md:hidden">
        <MenuIcon />
      </Button>

      <div className="hidden md:flex items-center gap-8">
        <nav className="hidden lg:flex items-center gap-8">
          <Link
            href="/"
            className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
          >
            Dashboard
          </Link>
          <Link
            href="/discussions"
            className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
          >
            Discussions
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <Link href="/discussions/new">
            <Button
              variant="default"
              className="h-10 rounded-md bg-[#A8005C] px-6 text-white hover:bg-[#8A004B] transition-colors"
            >
              Create New
            </Button>
          </Link>
          <div className="h-10 w-10 rounded-full bg-gray-200"></div>
        </div>
      </div>
    </header>
  );
}
