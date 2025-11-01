"use client";

import * as React from "react";
import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";

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
      <label htmlFor="tags-input" className="text-sm font-medium text-foreground">
        Add Tags/Categories
      </label>
      <div className="flex min-h-9 w-full flex-wrap items-center gap-2 rounded-md border border-input bg-transparent px-3 py-2 shadow-xs">
        {tags.map((tag) => (
          <Badge
            key={tag}
            variant="secondary"
            className="flex items-center gap-1 pr-1 border-[var(--tag-color)] bg-white"
            style={{
              color: 'var(--tag-color)',
              borderColor: 'var(--tag-color)',
              backgroundColor: 'white',
            }}
          >
            {tag}
            <button
              onClick={() => onRemoveTag(tag)}
              className="ml-1 rounded-full hover:bg-gray-100 p-0.5 transition-colors"
              aria-label={`Remove ${tag} tag`}
            >
              <X className="size-3" style={{ color: 'var(--tag-color)' }} />
            </button>
          </Badge>
        ))}
        <input
          id="tags-input"
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={tags.length === 0 ? placeholder : ""}
          className="min-w-[120px] flex-1 border-0 bg-transparent outline-none placeholder:text-muted-foreground"
        />
      </div>
    </div>
  );
}

