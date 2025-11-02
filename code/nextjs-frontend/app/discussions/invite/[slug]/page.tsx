'use client';

import * as React from 'react';
import { use } from 'react';
import Image from 'next/image';
import QRCode from 'qrcode';
import { Copy, Users } from 'lucide-react';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { getOrCreateUserId } from "@/lib/utils";
import { createMessageService } from "@/app/services/MessagesService";

type DiscussionDetails = {
    readonly id: string;
    readonly name: string;
    readonly description: string;
    readonly tags: string[];
    readonly owner_id: string;
    readonly created_at?: string;
    readonly participantCount: number;
};

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

export default function DiscussionInvitePage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = use(params);
    const userId = React.useMemo(() => getOrCreateUserId(), []);
    const submissionStorageKey = React.useMemo(() => `discussion-submitted-${slug}-${userId}`, [slug, userId]);

    const [shareUrl, setShareUrl] = React.useState('');
    const [qrCodeDataUrl, setQrCodeDataUrl] = React.useState<string | null>(null);
    const [copyFeedback, setCopyFeedback] = React.useState<string | null>(null);
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
                    const participantCount = (() => {
                        if (typeof detailJson.participant_count === 'number') {
                            return detailJson.participant_count;
                        }
                        if (Array.isArray(detailJson.participants)) {
                            return detailJson.participants.length;
                        }
                        if (typeof detailJson.participantCount === 'number') {
                            return detailJson.participantCount;
                        }
                        return 1;
                    })();

                    setDiscussion({
                        id: detailJson.id ?? slug,
                        name: detailJson.name ?? detailJson.title ?? 'Discussion topic',
                        description:
                            detailJson.description ??
                            'This discussion gathers insights from participants. Final copy will arrive once the backend response is wired.',
                        tags: Array.isArray(detailJson.tags) ? detailJson.tags : [],
                        owner_id: detailJson.owner_id ?? 'unknown',
                        created_at: detailJson.created_at,
                        participantCount,
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
                    console.error('Failed to load invite data', error);
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
        if (typeof window === 'undefined') {
            return;
        }

        const baseUrl = process.env.NEXT_PUBLIC_APP_BASE_URL ?? 'http://localhost:3000';
        const normalizedBaseUrl = baseUrl.replace(/\/$/, '');
        const url = `${normalizedBaseUrl}/discussion/${slug}`;
        setShareUrl(url);
    }, [slug]);

    React.useEffect(() => {
        if (!shareUrl) {
            return;
        }

        QRCode.toDataURL(shareUrl, {
            errorCorrectionLevel: 'M',
            margin: 2,
            width: 220,
        })
            .then((dataUrl) => setQrCodeDataUrl(dataUrl))
            .catch((error) => {
                console.error('Failed to generate QR code', error);
                setQrCodeDataUrl(null);
            });
    }, [shareUrl]);

    React.useEffect(() => {
        if (!copyFeedback) {
            return undefined;
        }

        const timer = window.setTimeout(() => setCopyFeedback(null), 2000);
        return () => window.clearTimeout(timer);
    }, [copyFeedback]);

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

    const handleCopyLink = React.useCallback(async () => {
        if (!shareUrl) {
            return;
        }

        try {
            await navigator.clipboard.writeText(shareUrl);
            setCopyFeedback('Copied!');
        } catch (error) {
            console.error('Clipboard write failed', error);
            setCopyFeedback('Copy failed');
        }
    }, [shareUrl]);

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

    if (isLoading) {
        return (
            <main className="container mx-auto flex min-h-screen flex-col px-4 py-10 sm:px-6 lg:px-8">
                <div className="mx-auto w-full max-w-4xl space-y-6">
                    <div className="h-40 animate-pulse rounded-xl border border-border bg-muted/60" />
                    <div className="grid gap-6 md:grid-cols-[3fr_2fr]">
                        <div className="h-64 animate-pulse rounded-xl border border-border bg-muted/60" />
                        <div className="h-64 animate-pulse rounded-xl border border-border bg-muted/60" />
                    </div>
                    <div className="h-72 animate-pulse rounded-xl border border-border bg-muted/60" />
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

    return (
        <main className="container mx-auto flex min-h-screen flex-col px-4 py-10 sm:px-6 lg:px-8">
            <div className="mx-auto w-full max-w-4xl space-y-10">
                <section className="rounded-xl border border-border bg-card p-6 shadow-sm">
                    <p className="text-sm font-semibold uppercase tracking-wide text-[color:var(--brand)]">New Discussion Created</p>
                    <h1 className="mt-3 text-3xl font-bold text-foreground sm:text-4xl">{discussion.name}</h1>
                    <p className="mt-4 text-base leading-7 text-muted-foreground">{discussion.description}</p>
                    <p className="mt-6 border-t border-border pt-4 text-sm text-muted-foreground">
                        Created {discussion.created_at ? formatRelativeTime(discussion.created_at) : 'just now'}
                    </p>
                    {discussion.tags.length > 0 && (
                        <div className="mt-4 flex flex-wrap gap-2">
                            {discussion.tags.map((tag) => (
                                <span key={tag} className="inline-flex items-center rounded-full border border-pink-400 px-3 py-1 text-sm font-medium text-pink-700">
                                    #{tag}
                                </span>
                            ))}
                        </div>
                    )}
                </section>

                <section className="grid gap-6 md:grid-cols-[3fr_2fr]">
                    <div className="rounded-xl border border-border bg-card shadow-sm">
                        <div className="flex items-center justify-between border-b border-border px-6 py-4">
                            <h2 className="font-sans text-lg font-semibold text-foreground">Invite Participants</h2>
                            <span className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Users className="size-4" />
                                {discussion.participantCount} joined
                            </span>
                        </div>
                        <div className="space-y-5 px-6 py-6">
                            <div className="space-y-1.5">
                                <label htmlFor="invite-email" className="text-sm font-medium text-foreground">
                                    Invite by email
                                </label>
                                <div className="flex flex-col gap-3 sm:flex-row">
                                    <Input id="invite-email" type="email" placeholder="john.doe@example.com" className="w-full bg-[#F8F9FA]" />
                                    <Button className="w-full text-white sm:w-auto" style={{ backgroundColor: 'var(--brand)' }}>
                                        Send
                                    </Button>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 text-xs uppercase tracking-wide text-muted-foreground">
                                <span className="h-px flex-1 bg-border" aria-hidden="true" />
                                or
                                <span className="h-px flex-1 bg-border" aria-hidden="true" />
                            </div>

                            <div className="space-y-1.5">
                                <label htmlFor="discussion-link" className="text-sm font-medium text-foreground">
                                    Copy invitation link
                                </label>
                                <div className="flex flex-col gap-3 sm:flex-row">
                                    <Input id="discussion-link" readOnly value={shareUrl} className="w-full bg-background" />
                                    <Button type="button" variant="outline" onClick={handleCopyLink} className="w-full sm:w-auto">
                                        {copyFeedback ?? (
                                            <span className="flex items-center gap-2">
                                                <Copy className="size-4" />
                                                Copy Link
                                            </span>
                                        )}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-xl border border-border bg-card shadow-sm">
                        <div className="border-b border-border px-6 py-4">
                            <h2 className="font-sans text-lg font-semibold text-foreground">Scan QR</h2>
                        </div>
                        <div className="flex flex-col items-center gap-4 px-6 py-6">
                            {qrCodeDataUrl ? (
                                <Image
                                    src={qrCodeDataUrl}
                                    alt="Discussion QR code"
                                    width={220}
                                    height={220}
                                    unoptimized
                                    className="rounded-lg border border-border bg-white p-4"
                                />
                            ) : (
                                <div className="flex h-[220px] w-[220px] items-center justify-center rounded-lg border border-border bg-muted">
                                    <p className="text-sm text-muted-foreground">Generating QR...</p>
                                </div>
                            )}
                            <p className="text-center text-sm text-muted-foreground">
                                Scan this code with your phone to join the discussion instantly.
                            </p>
                        </div>
                    </div>
                </section>

                <section className="rounded-xl border border-border bg-card shadow-sm">
                    <div className="border-b border-border px-6 py-4">
                        <h2 className="font-sans text-lg font-semibold text-foreground">Share Your Opinion</h2>
                    </div>
                    <div className="space-y-6 px-6 py-6">
                        {!hasSubmitted ? (
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-1.5">
                                    <Textarea
                                        id="participant-opinion"
                                        placeholder="Share your thoughts..."
                                        className="bg-[#F8F9FA]"
                                        rows={5}
                                        value={newOpinion}
                                        onChange={(event) => setNewOpinion(event.target.value)}
                                        disabled={isSubmitting}
                                    />
                                </div>
                                {submitError && <p className="text-sm text-red-500">{submitError}</p>}
                                <Button
                                    type="submit"
                                    className="w-full text-white"
                                    style={{ backgroundColor: 'var(--brand)' }}
                                    disabled={isSubmitting || !newOpinion.trim()}
                                >
                                    {isSubmitting ? 'Submitting…' : 'Submit Opinion'}
                                </Button>
                            </form>
                        ) : (
                            <p className="text-sm text-muted-foreground">You have already shared your perspective for this discussion.</p>
                        )}

                        <div className="space-y-4">
                            <h3 className="font-sans text-base font-semibold text-foreground">Recent opinions</h3>
                            {messages.length === 0 ? (
                                <p className="text-sm text-muted-foreground">No opinions yet. Be the first to share!</p>
                            ) : (
                                <div className="flex max-h-80 flex-col gap-4 overflow-y-auto pr-2">
                                    {messages.map((message) => (
                                        <div key={message.id} className="rounded-lg border border-border bg-background p-4 shadow-sm">
                                            <div className="flex items-center justify-between text-xs text-muted-foreground">
                                                <span className="font-semibold text-foreground">
                                                    {message.owner_id === userId ? 'You' : 'Participant'}
                                                </span>
                                                {message.created_at && <span>{formatRelativeTime(message.created_at)}</span>}
                                            </div>
                                            <p className="mt-3 text-sm text-foreground/90">{message.message}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </section>
            </div>
        </main>
    );
}
