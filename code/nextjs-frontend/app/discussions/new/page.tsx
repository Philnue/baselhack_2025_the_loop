"use client";

import * as React from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { TemplateCard } from "@/components/TemplateCard";
import { TagsInput } from "@/components/TagsInput";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const TEMPLATES = [
  {
    id: "tool-adoption",
    title: "Tool Adoption",
    description: "Discuss and decide on adopting new software for the team.",
  },
  {
    id: "feature-prioritization",
    title: "Feature Prioritization",
    description: "Align on which new product features to build next.",
  },
  {
    id: "policy-feedback",
    title: "Policy Feedback",
    description: "Gather opinions and form a consensus on new policies.",
  },
];

export default function CreateDiscussionPage() {
  const [selectedTemplate, setSelectedTemplate] = React.useState<string | null>(null);
  // Template section starts open on desktop/tablet, closed on mobile
  const [isTemplateSectionOpen, setIsTemplateSectionOpen] = React.useState(false);

  // Template section: open on tablet/laptop (md+), closed on mobile by default
  React.useEffect(() => {
    const mediaQuery = globalThis.matchMedia("(min-width: 768px)");
    const updateState = () => setIsTemplateSectionOpen(mediaQuery.matches);
    
    updateState();
    mediaQuery.addEventListener("change", updateState);
    return () => mediaQuery.removeEventListener("change", updateState);
  }, []);
  const [topicTitle, setTopicTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [tags, setTags] = React.useState<string[]>(["Engineering", "Automation"]);

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const handleAddTag = (tag: string) => {
    if (!tags.includes(tag)) {
      setTags([...tags, tag]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log({
      template: selectedTemplate,
      title: topicTitle,
      description,
      tags,
    });
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <main className="container mx-auto flex-1 px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <div className="mx-auto max-w-3xl">
          {/* Page Title */}
          <h1 className="mb-8 text-3xl font-bold text-foreground sm:text-4xl">
            Create New Discussion
          </h1>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Template Selection Section */}
            <section className="space-y-4">
              <button
                type="button"
                onClick={() => setIsTemplateSectionOpen(!isTemplateSectionOpen)}
                className="flex w-full items-center justify-between text-left md:w-auto"
              >
                <h2 className="text-lg font-semibold text-foreground">
                  Choose a Template (Optional)
                </h2>
                <ChevronDown
                  className={`
                    size-5 text-muted-foreground transition-transform
                    ${isTemplateSectionOpen ? "rotate-180" : ""}
                    lg:hidden
                  `}
                />
              </button>

              {/* Template Cards - Horizontal on desktop/tablet, vertical on mobile */}
              <div
                className={`
                  grid gap-4
                  grid-cols-1 md:grid-cols-3
                  transition-all duration-200
                  ${isTemplateSectionOpen ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0 overflow-hidden md:max-h-[1000px] md:opacity-100"}
                `}
              >
                {TEMPLATES.map((template) => (
                  <TemplateCard
                    key={template.id}
                    title={template.title}
                    description={template.description}
                    selected={selectedTemplate === template.id}
                    onClick={() =>
                      setSelectedTemplate(
                        selectedTemplate === template.id ? null : template.id
                      )
                    }
                  />
                ))}
              </div>
            </section>

            {/* Topic Title */}
            <div className="space-y-2">
              <label htmlFor="topic-title" className="text-sm font-medium text-foreground">
                Topic Title
              </label>
              <Input
                id="topic-title"
                type="text"
                placeholder="Enter your discussion topic"
                value={topicTitle}
                onChange={(e) => setTopicTitle(e.target.value)}
                required
              />
            </div>

            {/* Detailed Description */}
            <div className="space-y-2">
              <label
                htmlFor="description"
                className="text-sm font-medium text-foreground"
              >
                Detailed Description
              </label>
              <textarea
                id="description"
                rows={6}
                placeholder="Provide details about what you'd like to discuss..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full min-w-0 rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                required
              />
            </div>

            {/* Tags Input */}
            <TagsInput
              tags={tags}
              onRemoveTag={handleRemoveTag}
              onAddTag={handleAddTag}
            />

            {/* Action Buttons */}
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-end sm:gap-4">
              <Link href="/discussions" className="order-2 sm:order-1">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full sm:w-auto"
                >
                  Cancel
                </Button>
              </Link>
              <Button
                type="submit"
                className="order-1 w-full text-white sm:order-2 sm:w-auto"
                style={{ 
                  backgroundColor: 'var(--brand)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--brand-hover)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--brand)';
                }}
              >
                Create Topic
              </Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}

