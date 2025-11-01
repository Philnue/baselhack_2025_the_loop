"use client";

import * as React from "react";
import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Input } from "./ui/input";

interface TagsInputProps {
  readonly tags: string[];
  readonly onRemoveTag: (tag: string) => void;
  readonly onAddTag?: (tag: string) => void;
  readonly placeholder?: string;
}

export function TagsInput({
  tags,
  onRemoveTag,
  onAddTag,
  placeholder = "Add tags...",
}: TagsInputProps) {
  const [inputValue, setInputValue] = React.useState("");

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputValue.trim() && onAddTag) {
      e.preventDefault();
      onAddTag(inputValue.trim());
      setInputValue("");
    }
  };

  return (
    <div className="space-y-2">
      <Label
        htmlFor="tags-input"
        className="text-sm font-medium text-foreground"
      >
        Add Tags/Categories
      </Label>
      <div className="flex min-h-9 w-full flex-wrap items-center gap-2 rounded-md border border-input bg-transparent px-3 py-2 shadow-xs">
        {tags.map((tag) => (
          <Badge
            key={tag}
            variant="secondary"
            className="flex items-center gap-1 border-(--tag-color) bg-white pr-1 text-(--tag-color)"
          >
            {tag}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onRemoveTag(tag)}
              className="ml-1 h-auto w-auto rounded-full p-0.5 hover:bg-gray-100"
              aria-label={`Remove ${tag} tag`}
            >
              <X className="size-3 text-(--tag-color)" />
            </Button>
          </Badge>
        ))}
        <Input
          id="tags-input"
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={tags.length === 0 ? placeholder : ""}
          className="min-w-[120px] flex-1 border-0 bg-transparent shadow-none focus-visible:ring-0"
        />
      </div>
    </div>
  );
}
