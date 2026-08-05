"use client";

import { AxiosError } from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, type SubmitEvent } from "react";
import { toast } from "sonner";

import { getCurrentUser } from "../api/getCurrentUser";
import { login } from "../api/login";
import GoogleSignInButton from "./GoogleSignInButton";
import { useAuthStore } from "../store/authStore";
import { getDefaultRedirectPath } from "../utils/getDefaultRedirectPath";
import {
    clearRememberedAuthReturnUrl,
    getAuthDestination,
} from "../utils/authReturnUrl";
import { publishAuthTabEvent } from "../utils/authTabSync";

type ApiErrorResponse = {
    message?: string;
};

type LoginFormProps = Readonly<{
    onSuccess?: () => void;
    defaultRedirectPath?: string;
}>;

export default function LoginForm({
    onSuccess,
    defaultRedirectPath,
}: LoginFormProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const setSession = useAuthStore((state) => state.setSession);

    const passwordResetSucceeded =
        searchParams.get("passwordReset") ===
        "success";

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
        event.preventDefault();

        if (isSubmitting) {
            return;
        }

        setErrorMessage("");
        setIsSubmitting(true);

        try {
            const loginResponse = await login({
                email: email.trim(),
                password,
            });

            const currentUserResponse = await getCurrentUser(
                loginResponse.accessToken,
            );

            setSession(
                currentUserResponse.user,
                loginResponse.accessToken,
            );

            publishAuthTabEvent(
                "session-updated",
            );

            const returnUrl = searchParams.get("returnUrl");

            const destination =
                getAuthDestination({
                    returnUrl,
                    defaultPath:
                        defaultRedirectPath,
                    fallbackPath:
                        getDefaultRedirectPath(),
                });

            clearRememberedAuthReturnUrl();

            const isEmployerDestination =
                destination === "/employers" ||
                destination.startsWith(
                    "/employers/",
                );

            toast.success(
                `Welcome back, ${currentUserResponse.user.firstName}!`,
                {
                    description:
                        isEmployerDestination
                            ? "Opening your employer workspace."
                            : "You’re signed in and ready to continue.",
                },
            );

            onSuccess?.();

            router.replace(destination);
        } catch (error) {
            if (error instanceof AxiosError) {
                const responseData = error.response?.data as
                    | ApiErrorResponse
                    | undefined;

                setErrorMessage(
                    responseData?.message ??
                        "Unable to sign in. Please check your credentials.",
                );
            } else {
                setErrorMessage("Something went wrong. Please try again.");
            }
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="space-y-5">
            <GoogleSignInButton
                returnUrl={
                    searchParams.get(
                        "returnUrl",
                    )
                }
                defaultRedirectPath={
                    defaultRedirectPath
                }
                onSuccess={onSuccess}
            />

            <div className="flex items-center gap-3">
                <div className="h-px flex-1 bg-slate-200" />

                <span className="text-xs font-medium uppercase tracking-wide text-slate-400">
                    Or continue with email
                </span>

                <div className="h-px flex-1 bg-slate-200" />
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
            {passwordResetSucceeded && !errorMessage && (
                <div
                    role="status"
                    className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm leading-6 text-emerald-700"
                >
                    Your password was reset successfully.
                    Sign in using your new password.
                </div>
            )}

            {errorMessage && (
                <div
                    role="alert"
                    className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                >
                    {errorMessage}
                </div>
            )}

            <div>
                <label
                    htmlFor="login-email"
                    className="mb-2 block text-sm font-medium text-slate-700"
                >
                    Email address
                </label>

                <input
                    id="login-email"
                    name="email"
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    autoComplete="email"
                    required
                    disabled={isSubmitting}
                    placeholder="you@example.com"
                    className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-100"
                />
            </div>

            <div>
                <label
                    htmlFor="login-password"
                    className="mb-2 block text-sm font-medium text-slate-700"
                >
                    Password
                </label>

                <input
                    id="login-password"
                    name="password"
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    autoComplete="current-password"
                    required
                    disabled={isSubmitting}
                    placeholder="Enter your password"
                    className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-100"
                />
            </div>

            <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-400"
            >
                {isSubmitting ? "Signing in..." : "Sign In"}
            </button>
            </form>
        </div>
    );
}
