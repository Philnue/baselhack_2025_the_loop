"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface TemplateCardProps {
  readonly title: string;
  readonly description: string;
  readonly selected?: boolean;
  readonly onClick?: () => void;
}

export function TemplateCard({
  title,
  description,
  selected = false,
  onClick,
}: TemplateCardProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "group relative flex w-full flex-col items-start rounded-lg border-2 p-4 text-left transition-all",
        selected
          ? "dark:bg-[var(--brand-dark)]/20"
          : "border-gray-200 bg-white hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:hover:bg-gray-800"
      )}
      style={{
        ...(selected ? {
          borderColor: 'var(--brand)',
          backgroundColor: 'var(--brand-light)',
        } : {}),
      }}
      onMouseEnter={(e) => {
        if (!selected) {
          e.currentTarget.style.borderColor = 'var(--brand)';
        }
      }}
      onMouseLeave={(e) => {
        if (!selected) {
          e.currentTarget.style.borderColor = '';
        }
      }}
    >
      <h3 className="mb-2 text-sm font-semibold text-foreground">{title}</h3>
      <p className="text-xs text-muted-foreground">{description}</p>
    </button>
  );
}

