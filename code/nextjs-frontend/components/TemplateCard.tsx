"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";

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
    <Button
      variant="outline"
      onClick={onClick}
      className={cn(
        "group relative flex h-auto w-full flex-col items-start rounded-lg border-2 p-4 text-left transition-all",
        {
          "border-(--brand) bg-(--brand-light) hover:border-(--brand) hover:bg-(--brand-light)":
            selected,

          "border-gray-200 bg-white hover:border-(--brand) hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:hover:bg-gray-800":
            !selected,
        }
      )}
    >
  <h3 className="font-sans mb-2 text-sm font-semibold text-foreground">{title}</h3>
      <p className="text-xs text-muted-foreground text-wrap">{description}</p>
    </Button>
  );
}
