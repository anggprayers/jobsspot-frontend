"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Copy, Share2, X } from "lucide-react";

type ShareJobButtonProps = Readonly<{
    jobTitle: string;
}>;

export default function ShareJobButton({ jobTitle }: ShareJobButtonProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isCopied, setIsCopied] = useState(false);

    const resetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        return () => {
            if (resetTimerRef.current) {
                clearTimeout(resetTimerRef.current);
            }
        };
    }, []);

    function showCopiedState() {
        setIsCopied(true);

        if (resetTimerRef.current) {
            clearTimeout(resetTimerRef.current);
        }

        resetTimerRef.current = setTimeout(() => {
            setIsCopied(false);
        }, 2000);
    }

    async function handleCopyLink() {
        try {
            await navigator.clipboard.writeText(window.location.href);
            showCopiedState();
        } catch {
            setIsCopied(false);
        }
    }

    async function handleShare() {
        if (!navigator.share) {
            setIsOpen(true);
            return;
        }

        try {
            await navigator.share({
                title: jobTitle,
                text: `Check out this job opportunity: ${jobTitle}`,
                url: window.location.href,
            });
        } catch {
            // The user may have closed the native share dialog.
        }
    }

    return (
        <>
            <button
                type="button"
                onClick={handleShare}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3 font-semibold text-slate-700 transition-colors hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
            >
                <Share2 size={18} />
                Share Job
            </button>

            {isOpen && (
                <div
                    className="fixed inset-0 z-100 flex items-center justify-center bg-slate-950/60 px-4"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="share-job-title"
                >
                    <div
                        className="relative w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl sm:p-8"
                    >
                        <button
                            type="button"
                            aria-label="Close share dialog"
                            onClick={() => setIsOpen(false)}
                            className="absolute right-4 top-4 rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900"
                        >
                            <X size={20} />
                        </button>

                        <p className="text-sm font-semibold text-blue-600">JobsSpot</p>

                        <h2
                            id="share-job-title"
                            className="mt-2 pr-10 text-2xl font-bold text-slate-950"
                        >
                            Share this job
                        </h2>

                        <p className="mt-2 text-sm leading-6 text-slate-600">
                            Copy the job link and send it to someone who may be interested.
                        </p>

                        <button
                            type="button"
                            onClick={handleCopyLink}
                            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition-colors hover:bg-blue-700"
                        >
                            {isCopied ? (
                                <>
                                    <Check size={18} />
                                    Link Copied
                                </>
                            ) : (
                                <>
                                    <Copy size={18} />
                                    Copy Job Link
                                </>
                            )}
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}
