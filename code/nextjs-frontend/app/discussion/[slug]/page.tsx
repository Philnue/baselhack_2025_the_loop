'use client';

import * as React from 'react';
import { use } from 'react';
import Link from 'next/link';
import { ArrowLeft, MessageCircle, Send, Heart, Sparkles } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { getOrCreateUserId, getSessionStorage, setSessionStorage } from '@/lib/utils';
import { createMessageService } from '../../discussions/MessagesService';


type DiscussionDetails = {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly tags: string[];
  readonly owner_id: string;
  readonly created_at?: string;
};

type DiscussionMessage = {
  readonly id: string;
  readonly owner_id: string;
  readonly message: string;
  readonly created_at?: string;
  readonly upvotes: number;
};

type MessageApiResponse = {
  id?: string;
  owner_id?: string;
  message?: string;
  created_at?: string;
  upvotes?: number;
};

function formatRelativeTime(dateIso?: string) {
  if (!dateIso) {
    return '';
  }

  const date = new Date(dateIso);
  if (Number.isNaN(date.getTime())) {
    return '';
  }

  const now = Date.now();
  const diffMs = date.getTime() - now;
  const diffSec = Math.round(diffMs / 1000);
  const absSec = Math.abs(diffSec);

  const units: Array<[Intl.RelativeTimeFormatUnit, number]> = [
    ['year', 60 * 60 * 24 * 365],
    ['month', 60 * 60 * 24 * 30],
    ['week', 60 * 60 * 24 * 7],
    ['day', 60 * 60 * 24],
    ['hour', 60 * 60],
    ['minute', 60],
    ['second', 1],
  ];

  const formatter = new Intl.RelativeTimeFormat(undefined, { numeric: 'auto' });
  for (const [unit, secondsInUnit] of units) {
    if (absSec >= secondsInUnit || unit === 'second') {
      const value = Math.round(diffSec / secondsInUnit);
      return formatter.format(value, unit);
    }
  }

  return '';
}

export default function DiscussionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const userId = React.useMemo(() => getOrCreateUserId(), []);
  const submissionStorageKey = React.useMemo(() => `discussion-submitted-${slug}-${userId}`, [slug, userId]);
  const upvoteStorageKey = React.useMemo(() => `discussion-upvoted-${slug}-${userId}`, [slug, userId]);

  const [discussion, setDiscussion] = React.useState<DiscussionDetails | null>(null);
  const [messages, setMessages] = React.useState<DiscussionMessage[]>([]);
  const [newOpinion, setNewOpinion] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(true);
  const [loadError, setLoadError] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [submitError, setSubmitError] = React.useState<string | null>(null);
  const [hasSubmitted, setHasSubmitted] = React.useState(false);
  const [upvotedMessages, setUpvotedMessages] = React.useState(new Set<string>());
  const [isGenerating, setIsGenerating] = React.useState(false);
  
  React.useEffect(() => {
    const storedUpvotes = getSessionStorage(upvoteStorageKey);
    if (storedUpvotes) {
      try {
        const parsed = JSON.parse(storedUpvotes);
        if (Array.isArray(parsed)) {
          setUpvotedMessages(new Set(parsed));
        }
      } catch (e) {
        console.error('Failed to parse upvoted messages from session storage', e);
      }
    }
  }, [upvoteStorageKey]);

  React.useEffect(() => {
    setSessionStorage(upvoteStorageKey, JSON.stringify(Array.from(upvotedMessages)));
  }, [upvotedMessages, upvoteStorageKey]);

  React.useEffect(() => {
    const controller = new AbortController();

    async function fetchDiscussionData() {
      setIsLoading(true);
      setLoadError(null);

      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'https://fastapi.nutline.cloud/';
        const normalized = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;

        const detailPromise = fetch(`${normalized}discussions/${slug}`, {
          signal: controller.signal,
        });
        const messagesPromise = fetch(`${normalized}messages/?discussion_id=${slug}`, {
          signal: controller.signal,
        });

        const [detailRes, messagesRes] = await Promise.all([detailPromise, messagesPromise]);

        const combinedMessages: DiscussionMessage[] = [];

        const collectMessages = (payload: unknown) => {
          if (!payload) {
            return;
          }

          const extractArray = (value: unknown): unknown[] | null => {
            if (Array.isArray(value)) {
              return value;
            }

            if (typeof value === 'object' && value !== null) {
              const possibleItems = (value as { items?: unknown; messages?: unknown }).items;
              if (Array.isArray(possibleItems)) {
                return possibleItems;
              }

              const possibleMessages = (value as { messages?: unknown }).messages;
              if (Array.isArray(possibleMessages)) {
                return possibleMessages;
              }
            }

            return null;
          };

          const candidates = extractArray(payload);
          if (!candidates) {
            return;
          }

          for (const item of candidates) {
            if (typeof item === 'object' && item !== null) {
              const messageItem = item as MessageApiResponse;
              combinedMessages.push({
                id: String(messageItem.id ?? crypto.randomUUID()),
                owner_id: String(messageItem.owner_id ?? 'unknown'),
                message: String(messageItem.message ?? ''),
                created_at: messageItem.created_at,
                upvotes: Number(messageItem.upvotes ?? 0),
              });
            }
          }
        };

        if (detailRes.ok) {
          const detailJson = await detailRes.json();
          setDiscussion({
            id: detailJson.id ?? slug,
            name: detailJson.name ?? detailJson.title ?? 'Discussion topic',
            description:
              detailJson.description ??
              'Facilitated conversation across participants. Description will update when the backend returns richer copy.',
            tags: Array.isArray(detailJson.tags) ? detailJson.tags : [],
            owner_id: detailJson.owner_id ?? 'unknown',
            created_at: detailJson.created_at,
          });

          collectMessages(detailJson.messages);
        } else {
          throw new Error(`Unable to fetch discussion ${slug}`);
        }

        if (messagesRes.ok) {
          const messagesJson = await messagesRes.json();
          collectMessages(messagesJson);
        }

        const uniqueMessages = Array.from(new Map(combinedMessages.map((item) => [item.id, item])).values());
        uniqueMessages.sort((a, b) => {
          const aTime = a.created_at ? new Date(a.created_at).getTime() : 0;
          const bTime = b.created_at ? new Date(b.created_at).getTime() : 0;
          return bTime - aTime;
        });

        setMessages(uniqueMessages);
      } catch (error) {
        if (!controller.signal.aborted) {
          console.error('Failed to load discussion', error);
          setLoadError('We could not load this discussion. Please try again later.');
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }

    fetchDiscussionData();

    return () => controller.abort();
  }, [slug]);

  React.useEffect(() => {
    if (!submissionStorageKey) {
      return;
    }

    const storedFlag = getSessionStorage(submissionStorageKey);
    if (storedFlag === 'true') {
      setHasSubmitted(true);
      return;
    }

    const hasUserSubmitted = messages.some((message) => message.owner_id === userId);
    if (hasUserSubmitted) {
      setHasSubmitted(true);
      setSessionStorage(submissionStorageKey, 'true');
    } else {
      setHasSubmitted(false);
    }
  }, [messages, submissionStorageKey, userId]);


  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitError(null);

    if (hasSubmitted) {
      return;
    }

    const trimmedMessage = newOpinion.trim();
    if (!trimmedMessage) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await createMessageService({
        message: trimmedMessage,
        discussion_id: slug,
        owner_id: userId,
      });

      const newEntry: DiscussionMessage = {
        id: response.id ?? crypto.randomUUID(),
        owner_id: response.owner_id ?? userId,
        message: response.message ?? trimmedMessage,
        created_at: response.created_at,
        upvotes: 0,
      };

      setMessages((prev) => [newEntry, ...prev]);
      setNewOpinion('');
      setHasSubmitted(true);
      setSessionStorage(submissionStorageKey, 'true');
    } catch (error) {
      console.error('Failed to submit message', error);
      setSubmitError('Unable to submit your opinion right now. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpvote = (messageId: string) => {
    const newUpvoted = new Set(upvotedMessages);
    const isAlreadyUpvoted = newUpvoted.has(messageId);
    let upvoteChange = 0;

    if (isAlreadyUpvoted) {
      newUpvoted.delete(messageId);
      upvoteChange = -1;
    } else {
      newUpvoted.add(messageId);
      upvoteChange = 1;
    }

    setUpvotedMessages(newUpvoted);

    setMessages((prevMessages) =>
      prevMessages.map((msg) =>
        msg.id === messageId
          ? { ...msg, upvotes: Math.max(0, msg.upvotes + upvoteChange) }
          : msg
      )
    );
  };

  const handleGenerateConsensus = async () => {
    setIsGenerating(true);
    console.log('Starting AI consensus generation for owner...');    
    await new Promise((resolve) => setTimeout(resolve, 2500));
    
    console.log('AI consensus generated!');
    setIsGenerating(false);
  };


  if (isLoading) {
    return (
      <main className="container mx-auto flex min-h-screen flex-col px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-4xl space-y-6">
          <div className="h-32 animate-pulse rounded-xl border border-border bg-muted/60" />
          <div className="h-24 animate-pulse rounded-xl border border-border bg-muted/60" />
          <div className="h-80 animate-pulse rounded-xl border border-border bg-muted/60" />
        </div>
      </main>
    );
  }

  if (loadError || !discussion) {
    return (
      <main className="container mx-auto flex min-h-screen flex-col items-center justify-center px-4 py-12 text-center sm:px-6 lg:px-8">
        <div className="max-w-md space-y-4">
          <h1 className="text-2xl font-semibold text-foreground">Unable to load discussion</h1>
          <p className="text-sm text-muted-foreground">{loadError ?? 'The discussion details are unavailable at the moment.'}</p>
        </div>
      </main>
    );
  }

  const isOwner = discussion.owner_id === userId && discussion.owner_id !== 'unknown';

  return (
    <main className="container mx-auto flex min-h-screen flex-col px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-10">
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <Link href="/discussions" className="inline-flex items-center gap-2 text-sm font-medium text-foreground hover:text-foreground/80">
            <ArrowLeft className="size-4" />
            Back to discussions
          </Link>
          <span aria-hidden="true">/</span>
          <span>{discussion.name}</span>
        </div>

        <section className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-start justify-between gap-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground sm:text-4xl">{discussion.name}</h1>
              <p className="mt-4 text-base leading-7 text-muted-foreground">{discussion.description}</p>
            </div>
          </div>
          <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-2 font-medium text-foreground">
              <MessageCircle className="size-4" />
              {messages.length} contributions
            </span>
            {discussion.created_at && <span>Created {formatRelativeTime(discussion.created_at)}</span>}
          </div>
          {discussion.tags.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-2">
              {discussion.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center rounded-full border border-border px-3 py-1 text-sm font-medium text-foreground"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </section>

        <section className="flex flex-col gap-6">
          <div className="rounded-xl border border-border bg-card shadow-sm">
            <div className="border-b border-border px-6 py-4">
              <h2 className="font-sans text-lg font-semibold text-foreground">Share your perspective</h2>
            </div>
            <div className="space-y-6 px-6 py-6">
              {!hasSubmitted ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <Textarea
                    id="discussion-opinion"
                    placeholder="Add your opinion for others to consider..."
                    className="bg-[#F8F9FA]"
                    rows={6}
                    value={newOpinion}
                    onChange={(event) => setNewOpinion(event.target.value)}
                    disabled={isSubmitting}
                  />
                  {submitError && <p className="text-sm text-red-500">{submitError}</p>}
                  <Button
                    type="submit"
                    className="w-full text-white"
                    style={{ backgroundColor: 'var(--brand)' }}
                    disabled={isSubmitting || !newOpinion.trim()}
                  >
                    {isSubmitting ? 'Submitting…' : (
                      <span className="inline-flex items-center justify-center gap-2">
                        <Send className="size-4" />
                        Submit opinion
                      </span>
                    )}
                  </Button>
                </form>
              ) : (
                <div className="rounded-lg border border-border bg-muted/40 p-4 text-sm text-muted-foreground">
                  You have already shared your opinion for this discussion. Thank you for contributing!
                </div>
              )}
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card shadow-sm">
            <div className="border-b border-border px-6 py-4">
              <h2 className="font-sans text-lg font-semibold text-foreground">Recent opinions</h2>
            </div>
            <div className="flex flex-col gap-4 px-6 py-6 pr-3">
              {messages.length === 0 ? (
                <p className="text-sm text-muted-foreground">No opinions yet. Be the first to share!</p>
              ) : (
                <div className="flex max-h-[32rem] flex-col gap-4 overflow-y-auto">
                  {messages.map((message) => {
                    const isUpvoted = upvotedMessages.has(message.id);
                    return (
                      <div key={message.id} className="rounded-lg border border-border bg-background p-4 shadow-sm">
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span className="font-semibold text-foreground">
                            {message.owner_id === userId ? 'You' : 'Participant'}
                          </span>
                          {message.created_at && <span>{formatRelativeTime(message.created_at)}</span>}
                        </div>
                        <p className="mt-3 text-sm text-foreground/90">{message.message}</p>
                        <div className="mt-4 flex justify-end">
                          <Button
                            variant="outline"
                            size="sm"
                            className={`inline-flex items-center gap-1.5 ${
                              isUpvoted ? 'border-primary text-primary' : ''
                            }`}
                            onClick={() => handleUpvote(message.id)}
                          >
                            <Heart className={`size-4 ${isUpvoted ? 'fill-current' : ''}`} />
                            Upvote ({message.upvotes})
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </section>

        {isOwner && (
          <section className="flex justify-center border-t border-border pt-8">
            <Button
              variant="outline"
              size="lg"
              style={{
                color: '#A8005C', 
                borderColor: '#A8005C',
              }}
              onClick={handleGenerateConsensus}
              disabled={isGenerating}
              className="hover:bg-fuchsia-50 hover:text-fuchsia-800"
            >
              {isGenerating ? (
                'Generating...'
              ) : (
                <span className="inline-flex items-center  justify-center gap-2">
                  <Sparkles className="size-5" />
                  <span className="text-[#A8005C]">Generate AI Consensus</span>
                </span>
              )}
            </Button>
          </section>
        )}
        {/* --- End AI Consensus Button Section --- */}
        
      </div>
    </main>
  );
}