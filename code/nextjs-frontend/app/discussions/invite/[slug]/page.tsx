'use client';

import * as React from "react";
import Image from "next/image";
import QRCode from "qrcode";
import { Copy, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { use } from "react";

type Discussion = {
    readonly title: string;
    readonly description: string;
    readonly createdAt: string;
    readonly participantCount: number;
};


export default function DiscussionPage({ params, }: { params: Promise<{ slug: string }> }) {
    const { slug } = use(params);

    const [shareUrl, setShareUrl] = React.useState<string>("");
    const [qrCodeDataUrl, setQrCodeDataUrl] = React.useState<string | null>(null);
    const [copyFeedback, setCopyFeedback] = React.useState<string | null>(null);
    const [discussion, setDiscussion] = React.useState<Discussion | null>(null);
    const [isLoading, setIsLoading] = React.useState(true);
    const [loadError, setLoadError] = React.useState<string | null>(null);

    React.useEffect(() => {
        const controller = new AbortController();

        async function fetchDiscussion() {
            setIsLoading(true);
            setLoadError(null);

            try {
                // TODO: Replace placeholder with API request when backend is ready.
                await new Promise((resolve) => setTimeout(resolve, 800));

                if (controller.signal.aborted) {
                    return;
                }

                setDiscussion({
                    title: "How can we improve team collaboration?",
                    description:
                        "This discussion gathers ideas on how we can improve our workflows. Share your thoughts, experiments, and tools you believe could help the team move faster together.",
                    createdAt: "July 26, 2024 at 10:00 AM",
                    participantCount: 12,
                });
            } catch (error) {
                console.error("Unable to load discussion", error);
                if (!controller.signal.aborted) {
                    setLoadError("We could not load this discussion. Please try again shortly.");
                }
            } finally {
                if (!controller.signal.aborted) {
                    setIsLoading(false);
                }
            }
        }

        fetchDiscussion();

        return () => controller.abort();
    }, [slug]);

    React.useEffect(() => {
        if (typeof window === "undefined") {
            return;
        }

    const baseUrl = process.env.NEXT_PUBLIC_APP_BASE_URL ?? "http://localhost:3000";
    const normalizedBaseUrl = baseUrl.replace(/\/$/, "");
    const url = `${normalizedBaseUrl}/discussion/${slug}`;
        setShareUrl(url);
    }, [slug]);

    React.useEffect(() => {
        if (!shareUrl) {
            return;
        }

        QRCode.toDataURL(shareUrl, {
            errorCorrectionLevel: "M",
            margin: 2,
            width: 220,
        })
            .then((dataUrl) => setQrCodeDataUrl(dataUrl))
            .catch((error) => {
                console.error("Failed to generate QR code", error);
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

    const handleCopyLink = React.useCallback(async () => {
        if (!shareUrl) {
            return;
        }

        try {
            await navigator.clipboard.writeText(shareUrl);
            setCopyFeedback("Copied!");
        } catch (error) {
            console.error("Clipboard write failed", error);
            setCopyFeedback("Copy failed");
        }
    }, [shareUrl]);

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
                    <p className="text-sm text-muted-foreground">{loadError ?? "The discussion details are unavailable at the moment."}</p>
                </div>
            </main>
        );
    }

    return (
        <main className="container mx-auto flex min-h-screen flex-col px-4 py-10 sm:px-6 lg:px-8">
            <div className="mx-auto w-full max-w-4xl space-y-10">
                <section className="rounded-xl border border-border bg-card p-6 shadow-sm">
                    <p className="text-sm font-semibold uppercase tracking-wide text-[color:var(--brand)]">New Discussion Created</p>
                    <h1 className="mt-3 text-3xl font-bold text-foreground sm:text-4xl">{discussion.title}</h1>
                    <p className="mt-4 text-base leading-7 text-muted-foreground">{discussion.description}</p>
                    <p className="mt-6 border-t border-border pt-4 text-sm text-muted-foreground">Created on {discussion.createdAt}</p>
                </section>

                <section className="grid gap-6 md:grid-cols-[3fr_2fr]">
                    <div className="rounded-xl border border-border bg-card shadow-sm">
                        <div className="flex items-center justify-between border-b border-border px-6 py-4">
                            <h2 className="text-lg font-semibold text-foreground">Invite Participants</h2>
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
                                    <Input
                                        id="invite-email"
                                        type="email"
                                        placeholder="john.doe@example.com"
                                        className="w-full bg-[#F8F9FA]"
                                    />
                                    <Button className="w-full text-white sm:w-auto" style={{ backgroundColor: "var(--brand)" }}>
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
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={handleCopyLink}
                                        className="w-full sm:w-auto"
                                    >
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
                            <h2 className="text-lg font-semibold text-foreground">Scan QR</h2>
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
                        <h2 className="text-lg font-semibold text-foreground">Share Your Perspective</h2>
                    </div>
                    <div className="space-y-5 px-6 py-6">
                        <form className="space-y-5">
                            <div className="space-y-2">
                                <label htmlFor="participant-name" className="text-sm font-medium text-foreground">
                                    Your Name
                                </label>
                                <Input
                                    id="participant-name"
                                    placeholder="Enter your name"
                                    autoComplete="name"
                                    className="bg-[#F8F9FA]"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label htmlFor="participant-opinion" className="text-sm font-medium text-foreground">
                                    Your Opinion
                                </label>
                                <Textarea
                                    id="participant-opinion"
                                    placeholder="Share your thoughts..."
                                    className="bg-[#F8F9FA]"
                                />
                            </div>
                            <Button type="submit" className="w-full text-white" style={{ backgroundColor: "var(--brand)" }}>
                                Submit Opinion
                            </Button>
                        </form>
                    </div>
                </section>
            </div>
        </main>
    );
}
