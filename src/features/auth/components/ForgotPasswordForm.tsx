"use client";

import axios from "axios";
import Link from "next/link";
import {
    ArrowLeft,
    LoaderCircle,
    MailCheck,
} from "lucide-react";
import {
    useState,
    type FormEvent,
} from "react";

import { forgotPassword } from "../api/forgotPassword";

type ApiErrorResponse = {
    message?: string;
    errors?: Record<string, string[]>;
};

function getForgotPasswordErrorMessage(
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
            return "Too many password reset requests. Please wait a few minutes and try again.";
        }

        const firstValidationError =
            Object.values(
                error.response?.data?.errors ??
                    {},
            )
                .flat()
                .find(Boolean);

        return (
            firstValidationError ??
            error.response?.data?.message ??
            "Unable to process your request right now. Please try again."
        );
    }

    return "Unable to process your request right now. Please try again.";
}

export default function ForgotPasswordForm() {
    const [
        email,
        setEmail,
    ] = useState("");
    const [
        submittedEmail,
        setSubmittedEmail,
    ] = useState("");
    const [
        errorMessage,
        setErrorMessage,
    ] = useState("");
    const [
        isSubmitting,
        setIsSubmitting,
    ] = useState(false);

    async function handleSubmit(
        event: FormEvent<HTMLFormElement>,
    ) {
        event.preventDefault();

        if (
            isSubmitting ||
            !email.trim()
        ) {
            return;
        }

        setErrorMessage("");
        setIsSubmitting(true);

        try {
            await forgotPassword({
                email:
                    email
                        .trim()
                        .toLowerCase(),
            });

            setSubmittedEmail(
                email.trim().toLowerCase(),
            );
        } catch (error) {
            setErrorMessage(
                getForgotPasswordErrorMessage(
                    error,
                ),
            );
        } finally {
            setIsSubmitting(false);
        }
    }

    if (submittedEmail) {
        return (
            <div className="text-center">
                <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-blue-100 text-blue-700">
                    <MailCheck className="size-8" />
                </div>

                <p className="mt-6 text-sm font-semibold text-blue-600">
                    Check your email
                </p>

                <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
                    Reset link requested
                </h1>

                <p className="mt-4 text-sm leading-7 text-slate-600">
                    If a JobsSpot account exists for
                    this address, we sent a
                    single-use reset link to:
                </p>

                <p className="mt-2 break-all font-semibold text-slate-950">
                    {submittedEmail}
                </p>

                <div className="mt-6 rounded-xl border border-blue-200 bg-blue-50 px-4 py-4 text-left text-sm leading-6 text-blue-800">
                    The link expires after 30 minutes.
                    Check your spam or promotions folder
                    when it is not in your inbox.
                </div>

                <div className="mt-7 grid gap-3 sm:grid-cols-2">
                    <Link
                        href="/login"
                        className="inline-flex min-h-12 items-center justify-center rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
                    >
                        Back to sign in
                    </Link>

                    <button
                        type="button"
                        onClick={() => {
                            setSubmittedEmail("");
                            setErrorMessage("");
                        }}
                        className="inline-flex min-h-12 items-center justify-center rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition-colors hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
                    >
                        Use another email
                    </button>
                </div>
            </div>
        );
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="space-y-5"
        >
            {errorMessage && (
                <div
                    role="alert"
                    className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-700"
                >
                    {errorMessage}
                </div>
            )}

            <div>
                <label
                    htmlFor="forgot-password-email"
                    className="mb-2 block text-sm font-medium text-slate-700"
                >
                    Email address
                </label>

                <input
                    id="forgot-password-email"
                    name="email"
                    type="email"
                    value={email}
                    onChange={(event) =>
                        setEmail(
                            event.target.value,
                        )
                    }
                    autoComplete="email"
                    required
                    disabled={isSubmitting}
                    placeholder="you@example.com"
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-100"
                />
            </div>

            <button
                type="submit"
                disabled={
                    isSubmitting ||
                    !email.trim()
                }
                className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
            >
                {isSubmitting && (
                    <LoaderCircle className="size-4 animate-spin" />
                )}

                {isSubmitting
                    ? "Sending reset link..."
                    : "Send reset link"}
            </button>

            <Link
                href="/login"
                className="flex items-center justify-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700"
            >
                <ArrowLeft className="size-4" />
                Back to sign in
            </Link>
        </form>
    );
}
