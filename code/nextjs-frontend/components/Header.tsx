"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  readonly showCreateButton?: boolean;
}

export function Header({ showCreateButton = true }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2">
          <span className="hidden text-xl font-semibold sm:inline">
            Consenza
          </span>
          <div className="size-2 rounded-full bg-foreground"></div>
        </div>

        <nav className="flex items-center gap-4 sm:gap-6">
          <Link
            href="/"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Dashboard
          </Link>
          <Link
            href="/discussions"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Discussions
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          {showCreateButton && (
            <Button
              variant="default"
              className="hidden text-white sm:inline-flex bg-(--brand) hover:bg-(--brand-hover) transition-colors"
            >
              Create New
            </Button>
          )}
          <div className="size-8 rounded-full bg-gray-300"></div>
        </div>
      </div>
    </header>
  );
}
