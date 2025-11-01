'use client';

import * as React from 'react';
import { use } from 'react';

import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { getOrCreateUserId } from '@/lib/utils';
import { createMessageService } from '@/app/discussions/MessagesService';

type DiscussionMessage = {
  readonly id: string;
  readonly owner_id: string;
  readonly message: string;
  readonly created_at?: string;
};

type MessageApiResponse = {
  id?: string;
  owner_id?: string;
  message?: string;
  created_at?: string;
};

type DiscussionDetails = {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly tags: string[];
  readonly owner_id: string;
  readonly created_at?: string;
};

type Props = {
  params: Promise<{ slug: string }>;
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

export default function DiscussionPage({ params }: Props) {
  const { slug } = use(params);
  const userId = React.useMemo(() => getOrCreateUserId(), []);

  const [discussion, setDiscussion] = React.useState<DiscussionDetails | null>(null);
  const [messages, setMessages] = React.useState<DiscussionMessage[]>([]);
  const [newOpinion, setNewOpinion] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(true);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [loadError, setLoadError] = React.useState<string | null>(null);
  const [submitError, setSubmitError] = React.useState<string | null>(null);
  const [hasSubmitted, setHasSubmitted] = React.useState(false);

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
              'This discussion gathers insights from participants. Final copy will arrive once the backend response is wired.',
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

        const uniqueMessages = Array.from(
          new Map(combinedMessages.map((item) => [item.id, item])).values()
        );

        uniqueMessages.sort((a, b) => {
          const aTime = a.created_at ? new Date(a.created_at).getTime() : 0;
          const bTime = b.created_at ? new Date(b.created_at).getTime() : 0;
          return bTime - aTime;
        });

        setMessages(uniqueMessages);
      } catch (error) {
        if (!controller.signal.aborted) {
          console.error('Failed to load discussion details', error);
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
    setHasSubmitted(messages.some((message) => message.owner_id === userId));
  }, [messages, userId]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
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
      };

      setMessages((prev) => [newEntry, ...prev]);
      setNewOpinion('');
  setHasSubmitted(true);
    } catch (error) {
      console.error('Failed to submit message', error);
      setSubmitError('Unable to submit your opinion right now. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4 rounded-lg border border-gray-200 bg-white px-8 py-6 shadow-sm">
          <span className="size-10 animate-spin rounded-full border-4 border-gray-200 border-t-[var(--brand)]" aria-hidden="true" />
          <p className="text-sm text-gray-600">Loading discussion…</p>
        </div>
      </div>
    );
  }

  if (loadError || !discussion) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="max-w-md rounded-lg border border-gray-200 bg-white px-6 py-8 text-center shadow-sm">
          <h1 className="text-lg font-semibold text-gray-900">Unable to load discussion</h1>
          <p className="mt-2 text-sm text-gray-600">{loadError ?? 'The discussion details are unavailable at the moment.'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="mx-auto max-w-3xl space-y-8 px-4">
        <div className="rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
          <h1 className="mb-3 text-3xl font-bold text-gray-900">{discussion.name}</h1>
          <p className="mb-6 text-lg text-gray-600">{discussion.description}</p>
          {discussion.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {discussion.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-block rounded-full border border-pink-400 px-4 py-1 text-sm font-medium text-pink-700"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
  </div>

        <div className="rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
          {!hasSubmitted ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="opinion" className="block text-lg font-semibold text-gray-800">
                  Share your opinion
                </label>
                <Textarea
                  id="opinion"
                  name="opinion"
                  rows={5}
                  className="bg-white"
                  placeholder="What are your thoughts?"
                  value={newOpinion}
                  onChange={(e) => setNewOpinion(e.target.value)}
                  disabled={isSubmitting}
                />
              </div>
              {submitError && <p className="text-sm text-red-500">{submitError}</p>}
              <div className="flex justify-end">
                <Button
                  type="submit"
                  className="bg-[#9B2C6B] text-white hover:bg-[#8A265F]"
                  disabled={isSubmitting || !newOpinion.trim()}
                >
                  {isSubmitting ? 'Submitting…' : 'Submit Opinion'}
                </Button>
              </div>
            </form>
          ) : (
            <p className="text-sm text-gray-600">You have already shared your thoughts for this discussion.</p>
          )}
        </div>

        <div>
          <h2 className="mb-6 text-2xl font-semibold text-gray-900">Opinions from other participants</h2>
          <div className="space-y-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
            {messages.length === 0 ? (
              <p className="text-sm text-gray-500">No opinions yet. Be the first to share!</p>
            ) : (
              <div className="flex max-h-96 flex-col gap-4 overflow-y-auto pr-2">
                {messages.map((message) => (
                  <div key={message.id} className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span className="font-semibold text-gray-700">
                        {message.owner_id === userId ? 'You' : 'Participant'}
                      </span>
                      {message.created_at && <span>{formatRelativeTime(message.created_at)}</span>}
                    </div>
                    <p className="mt-3 text-base text-gray-800">{message.message}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
