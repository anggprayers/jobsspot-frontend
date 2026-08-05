"use client";

import axios from "axios";
import Link from "next/link";
import {
    AlertCircle,
    CheckCircle2,
    Circle,
    Eye,
    EyeOff,
    LoaderCircle,
} from "lucide-react";
import {
    useMemo,
    useState,
    type FormEvent,
    type ReactNode,
} from "react";
import { useSearchParams } from "next/navigation";

import { resetPassword } from "../api/resetPassword";
import { useAuthStore } from "../store/authStore";
import { publishAuthTabEvent } from "../utils/authTabSync";

type ApiErrorResponse = {
    message?: string;
    errors?: Record<string, string[]>;
};

function getResetPasswordErrorMessage(
    error: unknown,
): string {
    if (
        axios.isAxiosError<ApiErrorResponse>(
            error,
        )
    ) {
        if (
            error.response?.status === 410
        ) {
            return "This password reset link has expired. Request a new one.";
        }

        if (
            error.response?.status === 429
        ) {
            return "Too many password reset attempts. Please wait a few minutes and try again.";
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
            "Unable to reset your password right now. Please request a new link."
        );
    }

    return "Unable to reset your password right now. Please request a new link.";
}

function RequirementItem({
    passed,
    children,
}: Readonly<{
    passed: boolean;
    children: ReactNode;
}>) {
    const Icon = passed
        ? CheckCircle2
        : Circle;

    return (
        <li
            className={`flex items-center gap-2 text-sm ${
                passed
                    ? "text-emerald-700"
                    : "text-slate-500"
            }`}
        >
            <Icon className="size-4 shrink-0" />
            <span>{children}</span>
        </li>
    );
}

export default function ResetPasswordForm() {
    const searchParams =
        useSearchParams();

    const token =
        searchParams.get("token")?.trim() ??
        "";

    const [
        newPassword,
        setNewPassword,
    ] = useState("");
    const [
        confirmNewPassword,
        setConfirmNewPassword,
    ] = useState("");
    const [
        showNewPassword,
        setShowNewPassword,
    ] = useState(false);
    const [
        showConfirmPassword,
        setShowConfirmPassword,
    ] = useState(false);
    const [
        errorMessage,
        setErrorMessage,
    ] = useState("");
    const [
        isSubmitting,
        setIsSubmitting,
    ] = useState(false);

    const requirements = useMemo(
        () => ({
            length:
                newPassword.length >= 8,
            lowercase:
                /[a-z]/.test(newPassword),
            uppercase:
                /[A-Z]/.test(newPassword),
            number:
                /[0-9]/.test(newPassword),
            special:
                /[^A-Za-z0-9]/.test(
                    newPassword,
                ),
            matches:
                confirmNewPassword.length >
                    0 &&
                newPassword ===
                    confirmNewPassword,
        }),
        [
            confirmNewPassword,
            newPassword,
        ],
    );

    const passwordIsValid =
        requirements.length &&
        requirements.lowercase &&
        requirements.uppercase &&
        requirements.number &&
        requirements.special &&
        requirements.matches;

    async function handleSubmit(
        event: FormEvent<HTMLFormElement>,
    ) {
        event.preventDefault();

        if (
            isSubmitting ||
            !token ||
            !passwordIsValid
        ) {
            return;
        }

        setErrorMessage("");
        setIsSubmitting(true);

        try {
            const response =
                await resetPassword({
                    token,
                    newPassword,
                    confirmNewPassword,
                });

            useAuthStore
                .getState()
                .clearSession();

            publishAuthTabEvent(
                "session-cleared",
            );

            // Use a full replacement navigation after this
            // security-sensitive action. It reliably clears
            // the consumed token URL from browser history and
            // avoids desynchronizing the Next.js App Router.
            window.location.replace(
                response.redirectTo,
            );
        } catch (error) {
            setErrorMessage(
                getResetPasswordErrorMessage(
                    error,
                ),
            );
        } finally {
            setIsSubmitting(false);
        }
    }

    if (!token) {
        return (
            <div className="text-center">
                <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
                    <AlertCircle className="size-8" />
                </div>

                <h1 className="mt-6 text-3xl font-bold tracking-tight text-slate-950">
                    Reset link unavailable
                </h1>

                <p className="mt-4 text-sm leading-7 text-slate-600">
                    This page needs a valid password
                    reset token. Request a new email
                    to continue.
                </p>

                <Link
                    href="/forgot-password"
                    className="mt-7 inline-flex min-h-12 items-center justify-center rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
                >
                    Request a new link
                </Link>
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
                    htmlFor="reset-new-password"
                    className="mb-2 block text-sm font-medium text-slate-700"
                >
                    New password
                </label>

                <div className="relative">
                    <input
                        id="reset-new-password"
                        name="newPassword"
                        type={
                            showNewPassword
                                ? "text"
                                : "password"
                        }
                        value={newPassword}
                        onChange={(event) =>
                            setNewPassword(
                                event.target.value,
                            )
                        }
                        autoComplete="new-password"
                        required
                        minLength={8}
                        maxLength={100}
                        disabled={isSubmitting}
                        placeholder="Create a new password"
                        className="w-full rounded-xl border border-slate-300 px-4 py-3 pr-12 text-sm text-slate-950 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-100"
                    />

                    <button
                        type="button"
                        disabled={isSubmitting}
                        onClick={() =>
                            setShowNewPassword(
                                (value) => !value,
                            )
                        }
                        aria-label={
                            showNewPassword
                                ? "Hide new password"
                                : "Show new password"
                        }
                        className="absolute inset-y-0 right-0 flex w-12 items-center justify-center text-slate-500 transition-colors hover:text-slate-900 disabled:cursor-not-allowed"
                    >
                        {showNewPassword ? (
                            <EyeOff className="size-5" />
                        ) : (
                            <Eye className="size-5" />
                        )}
                    </button>
                </div>
            </div>

            <div>
                <label
                    htmlFor="reset-confirm-password"
                    className="mb-2 block text-sm font-medium text-slate-700"
                >
                    Confirm new password
                </label>

                <div className="relative">
                    <input
                        id="reset-confirm-password"
                        name="confirmNewPassword"
                        type={
                            showConfirmPassword
                                ? "text"
                                : "password"
                        }
                        value={
                            confirmNewPassword
                        }
                        onChange={(event) =>
                            setConfirmNewPassword(
                                event.target.value,
                            )
                        }
                        autoComplete="new-password"
                        required
                        maxLength={100}
                        disabled={isSubmitting}
                        placeholder="Repeat the new password"
                        className="w-full rounded-xl border border-slate-300 px-4 py-3 pr-12 text-sm text-slate-950 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-100"
                    />

                    <button
                        type="button"
                        disabled={isSubmitting}
                        onClick={() =>
                            setShowConfirmPassword(
                                (value) => !value,
                            )
                        }
                        aria-label={
                            showConfirmPassword
                                ? "Hide confirmed password"
                                : "Show confirmed password"
                        }
                        className="absolute inset-y-0 right-0 flex w-12 items-center justify-center text-slate-500 transition-colors hover:text-slate-900 disabled:cursor-not-allowed"
                    >
                        {showConfirmPassword ? (
                            <EyeOff className="size-5" />
                        ) : (
                            <Eye className="size-5" />
                        )}
                    </button>
                </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm font-semibold text-slate-800">
                    Password requirements
                </p>

                <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                    <RequirementItem
                        passed={
                            requirements.length
                        }
                    >
                        At least 8 characters
                    </RequirementItem>

                    <RequirementItem
                        passed={
                            requirements.lowercase
                        }
                    >
                        One lowercase letter
                    </RequirementItem>

                    <RequirementItem
                        passed={
                            requirements.uppercase
                        }
                    >
                        One uppercase letter
                    </RequirementItem>

                    <RequirementItem
                        passed={
                            requirements.number
                        }
                    >
                        One number
                    </RequirementItem>

                    <RequirementItem
                        passed={
                            requirements.special
                        }
                    >
                        One special character
                    </RequirementItem>

                    <RequirementItem
                        passed={
                            requirements.matches
                        }
                    >
                        Passwords match
                    </RequirementItem>
                </ul>
            </div>

            <p className="text-xs leading-5 text-slate-500">
                Resetting your password signs out all
                existing JobsSpot sessions.
            </p>

            <button
                type="submit"
                disabled={
                    isSubmitting ||
                    !passwordIsValid
                }
                className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
            >
                {isSubmitting && (
                    <LoaderCircle className="size-4 animate-spin" />
                )}

                {isSubmitting
                    ? "Resetting password..."
                    : "Reset password"}
            </button>

            <Link
                href="/forgot-password"
                className="block text-center text-sm font-semibold text-blue-600 hover:text-blue-700"
            >
                Request a different link
            </Link>
        </form>
    );
}
