"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

import AuthPageShell from "./AuthPageShell";
import LoginForm from "./LoginForm";

function isEmployerDestination(
    value: string | null,
): boolean {
    return Boolean(
        value &&
            (value === "/employers" ||
                value.startsWith(
                    "/employers/",
                )),
    );
}

export default function LoginPageContent() {
    const searchParams =
        useSearchParams();

    const returnUrl =
        searchParams.get("returnUrl");
    const isEmployerLogin =
        isEmployerDestination(returnUrl);

    return (
        <AuthPageShell
            audience={
                isEmployerLogin
                    ? "employer"
                    : "job-seeker"
            }
            eyebrow={
                isEmployerLogin
                    ? "Employer access"
                    : "Welcome back"
            }
            title={
                isEmployerLogin
                    ? "Sign in to your employer workspace"
                    : "Sign in to JobsSpot"
            }
            description={
                isEmployerLogin
                    ? "Manage your company, job postings, applicants, and hiring team."
                    : "Continue your job search, manage applications, and keep your career profile up to date."
            }
        >
            <LoginForm
                defaultRedirectPath={
                    isEmployerLogin
                        ? "/employers"
                        : "/jobs"
                }
            />

            <div className="mt-6 flex items-center justify-between gap-4 text-sm">
                <Link
                    href="/forgot-password"
                    className="font-semibold text-blue-600 transition-colors hover:text-blue-700"
                >
                    Forgot password?
                </Link>

                <Link
                    href="/register"
                    className="font-semibold text-blue-600 transition-colors hover:text-blue-700"
                >
                    Create account
                </Link>
            </div>
        </AuthPageShell>
    );
}
