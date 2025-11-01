"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { TemplateCard } from "@/components/TemplateCard";
import { TagsInput } from "@/components/TagsInput";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn, getOrCreateUserId } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createDiscussionService } from "../../services/DiscussionsService";

const TEMPLATES = [
  {
    id: "TOOL_ADOPTION",
    title: "Tool Adoption",
    description: "Discuss and decide on adopting new software for the team.",
  },
  {
    id: "FEATURE_PRIORITIZATION",
    title: "Feature Prioritization",
    description: "Align on which new product features to build next.",
  },
  {
    id: "POLICY_FEEDBACK",
    title: "Policy Feedback",
    description: "Gather opinions and form a consensus on new policies.",
  },
];

export default function CreateDiscussionPage() {
  const router = useRouter();
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
  const [tags, setTags] = React.useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [formError, setFormError] = React.useState<string | null>(null);

  const handleRemoveTag = React.useCallback((tag: string) => {
    setTags((prevTags) => prevTags.filter((t) => t !== tag));
  }, []);

  const handleAddTag = React.useCallback((tag: string) => {
    const normalizedTag = tag.trim();
    if (!normalizedTag) {
      return;
    }

    setTags((prevTags) => {
      const exists = prevTags.some(
        (existingTag) =>
          existingTag.toLowerCase() === normalizedTag.toLowerCase()
      );
      return exists ? prevTags : [...prevTags, normalizedTag];
    });
  }, []);

  const createDiscussion = React.useCallback(
    async (payload: {
      readonly template: string | null;
      readonly title: string;
      readonly description: string;
      readonly tags: string[];
    }) => {
      const data = await createDiscussionService({
        template: payload.template,
        name: payload.title,
        description: payload.description,
        tags: payload.tags,
        owner_id: getOrCreateUserId(),
      });

      return data["id"];
    },
    []
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!topicTitle.trim() || !description.trim() || tags.length === 0) {
      setFormError(
        "Please complete the topic, description, and add at least one tag."
      );
      return;
    }

    setIsSubmitting(true);
    getOrCreateUserId();

    try {
      const payload = {
        template: selectedTemplate,
        title: topicTitle.trim(),
        description: description.trim(),
        tags,
      };

      const generatedSlug = await createDiscussion(payload);
      router.push(`/discussions/invite/${generatedSlug}`);
    } catch (error) {
      console.error("Failed to create discussion", error);
      setFormError(
        "Something went wrong while creating the discussion. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const LoadingOverlay = React.useMemo(
    () =>
      function LoadingOverlayComponent({
        message,
      }: {
        readonly message: string;
      }) {
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur">
            <div className="flex flex-col items-center gap-4 rounded-lg border border-border bg-card px-10 py-8 shadow-lg">
              <span
                className="size-12 animate-spin rounded-full border-4 border-muted border-t-[var(--brand)]"
                aria-hidden="true"
              />
              <p className="text-sm font-medium text-foreground">{message}</p>
            </div>
          </div>
        );
      },
    []
  );

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {isSubmitting && <LoadingOverlay message="Creating your discussion..." />}
      <main className="container mx-auto flex-1 px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <div className="mx-auto max-w-3xl">
          <h1 className="mb-8 text-3xl font-bold text-foreground sm:text-4xl">
            Create New Discussion
          </h1>

          <form onSubmit={handleSubmit} className="space-y-8">
            {formError && (
              <div className="rounded-md border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                {formError}
              </div>
            )}
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
                disabled={isSubmitting}
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
                disabled={isSubmitting}
              />
            </div>

            <TagsInput
              tags={tags}
              onRemoveTag={handleRemoveTag}
              onAddTag={handleAddTag}
              placeholder="Add at least one tag"
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
                className="order-1 w-full text-white sm:order-2 sm:w-auto"
                style={{ backgroundColor: "var(--brand)" }}
                disabled={isSubmitting}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "var(--brand-hover)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "var(--brand)";
                }}
              >
                {isSubmitting ? "Creating..." : "Create Topic"}
              </Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
