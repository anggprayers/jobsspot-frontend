"use client";

import axios from "axios";
import Link from "next/link";
import {
    LoaderCircle,
    MailCheck,
    ShieldAlert,
} from "lucide-react";
import { toast } from "sonner";

import { useAuth } from "../hooks/useAuth";
import { useSendVerificationEmail } from "../hooks/useEmailVerification";

type ApiErrorResponse = {
    message?: string;
};

type EmailVerificationBannerProps = Readonly<{
    variant?: "public" | "employer";
}>;

function getSendErrorMessage(
    error: unknown,
): string {
    if (
        axios.isAxiosError<ApiErrorResponse>(
            error,
        )
    ) {
        if (
            error.response?.status === 429
        ) {
            return "Too many verification requests. Please wait a few minutes and try again.";
        }

        return (
            error.response?.data?.message ??
            "Unable to send the verification email right now."
        );
    }

    return "Unable to send the verification email right now.";
}

export default function EmailVerificationBanner({
    variant = "public",
}: EmailVerificationBannerProps) {
    const {
        user,
        isAuthenticated,
        isInitializing,
    } = useAuth();

    const sendVerificationMutation =
        useSendVerificationEmail();

    if (
        isInitializing ||
        !isAuthenticated ||
        !user ||
        user.isEmailVerified
    ) {
        return null;
    }

    async function handleSendVerificationEmail() {
        if (
            sendVerificationMutation.isPending
        ) {
            return;
        }

        const toastId = toast.loading(
            "Sending verification email...",
        );

        try {
            const response =
                await sendVerificationMutation.mutateAsync();

            toast.success(
                response.alreadyVerified
                    ? "Email already verified."
                    : "Verification email sent.",
                {
                    id: toastId,
                    description:
                        response.alreadyVerified
                            ? "Your account already has a verified email address."
                            : "Check your inbox. The newest link expires in 30 minutes.",
                },
            );
        } catch (error) {
            toast.error(
                getSendErrorMessage(error),
                {
                    id: toastId,
                },
            );
        }
    }

    const innerClassName =
        variant === "employer"
            ? "flex flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between md:px-6"
            : "mx-auto flex w-full max-w-7xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8";

    return (
        <section
            aria-label="Email verification required"
            className="border-b border-amber-200 bg-amber-50 text-amber-950"
        >
            <div className={innerClassName}>
                <div className="flex items-start gap-3">
                    <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
                        <ShieldAlert className="size-5" />
                    </span>

                    <div>
                        <p className="font-semibold">
                            Verify your email to unlock applications and employer actions
                        </p>

                        <p className="mt-0.5 text-sm leading-6 text-amber-800">
                            You can keep browsing and preparing your account. Confirm{" "}
                            <span className="font-medium">
                                {user.email}
                            </span>{" "}
                            before applying for jobs or managing employer content.
                        </p>
                    </div>
                </div>

                <div className="flex shrink-0 flex-wrap items-center gap-2 sm:justify-end">
                    <Link
                        href="/account/settings"
                        className="inline-flex min-h-10 items-center justify-center rounded-xl border border-amber-300 bg-white px-4 py-2 text-sm font-semibold text-amber-900 transition-colors hover:bg-amber-100"
                    >
                        Account settings
                    </Link>

                    <button
                        type="button"
                        disabled={
                            sendVerificationMutation.isPending
                        }
                        onClick={() =>
                            void handleSendVerificationEmail()
                        }
                        className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-amber-700 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-amber-800 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {sendVerificationMutation.isPending ? (
                            <LoaderCircle className="size-4 animate-spin" />
                        ) : (
                            <MailCheck className="size-4" />
                        )}

                        {sendVerificationMutation.isPending
                            ? "Sending..."
                            : "Send verification email"}
                    </button>
                </div>
            </div>
        </section>
    );
}
