"use client";

import { useState, type SubmitEvent } from "react";
import { AxiosError } from "axios";
import { useRouter, useSearchParams } from "next/navigation";

import { getCurrentUser } from "../api/getCurrentUser";
import { login } from "../api/login";
import { useAuthStore } from "../store/authStore";

import { getDefaultRedirectPath } from "../utils/getDefaultRedirectPath";

type ApiErrorResponse = {
    message?: string;
};

type LoginFormProps = Readonly<{
    onSuccess?: () => void;
}>;

export default function LoginForm({ onSuccess }: LoginFormProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const setSession = useAuthStore((state) => state.setSession);

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

            const currentUserResponse = await getCurrentUser(loginResponse.accessToken);

            setSession(currentUserResponse.user, loginResponse.accessToken);

            onSuccess?.();

            const returnUrl = searchParams.get("returnUrl");

            const destination =
                returnUrl?.startsWith("/") && !returnUrl.startsWith("//")
                    ? returnUrl
                    : getDefaultRedirectPath(currentUserResponse.user);

            router.replace(destination);
        } catch (error) {
            if (error instanceof AxiosError) {
                const responseData = error.response?.data as ApiErrorResponse | undefined;

                setErrorMessage(
                    responseData?.message ?? "Unable to sign in. Please check your credentials.",
                );
            } else {
                setErrorMessage("Something went wrong. Please try again.");
            }
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
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
    );
}
