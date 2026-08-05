"use client";

import axios from "axios";
import Link from "next/link";
import {
    useRouter,
    useSearchParams,
} from "next/navigation";
import {
    AlertCircle,
    CheckCircle2,
    LoaderCircle,
    MailCheck,
} from "lucide-react";
import {
    useEffect,
    useRef,
} from "react";
import { toast } from "sonner";

import { useAuth } from "../hooks/useAuth";
import { useVerifyEmail } from "../hooks/useEmailVerification";

type ApiErrorResponse = {
    message?: string;
};

function getVerificationErrorMessage(
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
            return "Too many verification attempts. Please wait a few minutes before trying again.";
        }

        return (
            error.response?.data?.message ??
            "The email address could not be verified. Please request a new link."
        );
    }

    return "The email address could not be verified. Please request a new link.";
}

export default function VerifyEmailPage() {
    const router = useRouter();
    const searchParams =
        useSearchParams();
    const hasAttemptedVerification =
        useRef(false);

    const {
        isAuthenticated,
        isInitializing,
    } = useAuth();

    const {
        mutate,
        data,
        error,
        isPending,
        isError,
        isSuccess,
    } = useVerifyEmail();

    const token =
        searchParams.get("token")?.trim() ??
        "";

    useEffect(() => {
        if (
            hasAttemptedVerification.current ||
            !token
        ) {
            return;
        }

        hasAttemptedVerification.current =
            true;

        mutate(
            {
                token,
            },
            {
                onSuccess: (response) => {
                    window.history.replaceState(
                        {},
                        "",
                        "/verify-email",
                    );

                    if (
                        response.authenticated
                    ) {
                        toast.success(
                            `Email verified. Welcome to JobsSpot, ${response.user.firstName}!`,
                            {
                                description:
                                    "Your account is ready. Start exploring available jobs.",
                            },
                        );

                        router.replace(
                            response.redirectTo,
                        );
                    }
                },
            },
        );
    }, [
        mutate,
        router,
        token,
    ]);

    const destination =
        isAuthenticated
            ? "/jobs"
            : "/login?returnUrl=%2Fjobs";

    let icon = (
        <LoaderCircle className="size-7 animate-spin" />
    );
    let iconClasses =
        "bg-blue-100 text-blue-700";
    let heading =
        "Verifying your email";
    let description =
        "Please wait while JobsSpot confirms your verification link.";

    if (!token) {
        icon = (
            <AlertCircle className="size-7" />
        );
        iconClasses =
            "bg-amber-100 text-amber-700";
        heading =
            "Verification link unavailable";
        description =
            "This page needs a verification token. Request a new email from Account Settings.";
    } else if (
        isSuccess &&
        data.alreadyVerified
    ) {
        icon = (
            <CheckCircle2 className="size-7" />
        );
        iconClasses =
            "bg-emerald-100 text-emerald-700";
        heading =
            "Email already verified";
        description =
            "This email address was already verified. Sign in to continue when you are not already signed in.";
    } else if (
        isSuccess &&
        data.authenticated
    ) {
        icon = (
            <CheckCircle2 className="size-7" />
        );
        iconClasses =
            "bg-emerald-100 text-emerald-700";
        heading =
            "Email verified";
        description =
            "Your account is ready. Redirecting you to available jobs.";
    } else if (isError) {
        icon = (
            <AlertCircle className="size-7" />
        );
        iconClasses =
            "bg-red-100 text-red-700";
        heading =
            "Unable to verify email";
        description =
            getVerificationErrorMessage(
                error,
            );
    } else if (!isPending) {
        description =
            "Preparing your verification request.";
    }

    const showAction =
        !isPending &&
        !isInitializing &&
        (!isSuccess ||
            data.alreadyVerified);

    return (
        <main className="bg-slate-50 px-4 py-16 sm:py-24">
            <section className="mx-auto w-full max-w-xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg shadow-slate-200/60">
                <div className="border-t-4 border-blue-600 px-6 py-8 sm:px-9 sm:py-10">
                    <div
                        className={`flex size-14 items-center justify-center rounded-2xl ${iconClasses}`}
                    >
                        {icon}
                    </div>

                    <p className="mt-7 text-sm font-semibold text-blue-600">
                        JobsSpot account security
                    </p>

                    <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
                        {heading}
                    </h1>

                    <p
                        aria-live="polite"
                        className="mt-4 text-base leading-7 text-slate-600"
                    >
                        {description}
                    </p>

                    {showAction && (
                        <div className="mt-8 flex flex-wrap gap-3">
                            <Link
                                href={destination}
                                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-base font-semibold text-white transition-colors hover:bg-blue-700"
                            >
                                <MailCheck className="size-5" />

                                {isAuthenticated
                                    ? "Browse jobs"
                                    : "Sign in to continue"}
                            </Link>

                            <Link
                                href="/"
                                className="inline-flex min-h-12 items-center justify-center rounded-xl border border-slate-300 bg-white px-5 py-3 text-base font-semibold text-slate-700 transition-colors hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
                            >
                                Back to home
                            </Link>
                        </div>
                    )}
                </div>
            </section>
        </main>
    );
}
