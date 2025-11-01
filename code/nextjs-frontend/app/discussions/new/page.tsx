"use client";

import * as React from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { TemplateCard } from "@/components/TemplateCard";
import { TagsInput } from "@/components/TagsInput";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn, getOrCreateUserId } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { redirect } from "next/navigation";

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
  const [selectedTemplate, setSelectedTemplate] = React.useState<string | null>(
    null
  );
  const [isTemplateSectionOpen, setIsTemplateSectionOpen] =
    React.useState(false);

  React.useEffect(() => {
    const mediaQuery = globalThis.matchMedia("(min-width: 768px)");
    const updateState = () => setIsTemplateSectionOpen(mediaQuery.matches);

    updateState();
    mediaQuery.addEventListener("change", updateState);
    return () => mediaQuery.removeEventListener("change", updateState);
  }, []);
  const [topicTitle, setTopicTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [tags, setTags] = React.useState<string[]>([
    "Engineering",
    "Automation",
  ]);

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const handleAddTag = (tag: string) => {
    if (!tags.includes(tag)) {
      setTags([...tags, tag]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    const user_id = getOrCreateUserId();

    e.preventDefault();
    console.log({
      template: selectedTemplate,
      title: topicTitle,
      description,
      tags,
      user_id,
    });

    const jsonResponse = {
      id: "1234-1234-1234-1234",
      owner: user_id,
    };

    redirect("/discussions/1234-1234-1234-1234");
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <main className="container mx-auto flex-1 px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <div className="mx-auto max-w-3xl">
          <h1 className="mb-8 text-3xl font-bold text-foreground sm:text-4xl">
            Create New Discussion
          </h1>

          <form onSubmit={handleSubmit} className="space-y-8">
            <section className="space-y-4">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setIsTemplateSectionOpen(!isTemplateSectionOpen)}
                className="flex h-auto w-full items-center justify-between p-0 text-left hover:bg-transparent md:w-auto"
              >
                <h2 className="text-lg font-semibold text-foreground">
                  Choose a Template (Optional)
                </h2>
                <ChevronDown
                  className={cn(
                    "size-5 text-muted-foreground transition-transform lg:hidden",
                    isTemplateSectionOpen && "rotate-180"
                  )}
                />
              </Button>

              <div
                className={cn(
                  "grid grid-cols-1 gap-4 transition-all duration-200 md:grid-cols-3",
                  isTemplateSectionOpen
                    ? "max-h-[1000px] opacity-100"
                    : "max-h-0 overflow-hidden opacity-0 md:max-h-[1000px] md:opacity-100"
                )}
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

            <div className="space-y-2">
              <Label
                htmlFor="topic-title"
                className="text-sm font-medium text-foreground"
              >
                Topic Title
              </Label>
              <Input
                id="topic-title"
                type="text"
                placeholder="Enter your discussion topic"
                value={topicTitle}
                onChange={(e) => setTopicTitle(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="description"
                className="text-sm font-medium text-foreground"
              >
                Detailed Description
              </Label>
              <Textarea
                id="description"
                rows={6}
                placeholder="Provide details about what you'd like to discuss..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>

            <TagsInput
              tags={tags}
              onRemoveTag={handleRemoveTag}
              onAddTag={handleAddTag}
            />

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
                className="order-1 w-full text-white sm:order-2 sm:w-auto bg-(--brand) hover:bg-(--brand-hover) transition-colors"
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
