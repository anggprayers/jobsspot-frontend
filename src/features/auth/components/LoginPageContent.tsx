"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

import {
    normalizeAuthReturnPath,
    rememberAuthReturnUrl,
} from "../utils/authReturnUrl";
import AuthPageShell from "./AuthPageShell";
import GuestOnlyAuthPage from "./GuestOnlyAuthPage";
import LoginForm from "./LoginForm";

export default function LoginPageContent() {
    const searchParams =
        useSearchParams();

    const rawReturnUrl =
        searchParams.get("returnUrl");
    const returnUrl = normalizeAuthReturnPath(rawReturnUrl);

    useEffect(() => {
        rememberAuthReturnUrl(returnUrl);
    }, [returnUrl]);

    const registerHref = returnUrl
        ? `/register?returnUrl=${encodeURIComponent(returnUrl)}`
        : "/register";

    return (
        <GuestOnlyAuthPage
            redirectTo={
                returnUrl ?? "/jobs"
            }
        >
            <AuthPageShell
                audience="job-seeker"
                eyebrow="Welcome back"
                title="Sign in to JobsSpot"
                description="Continue your job search, manage applications, and keep your career profile up to date."
            >
                <LoginForm defaultRedirectPath="/jobs" />

                <div className="mt-6 flex items-center justify-between gap-4 text-sm">
                    <Link
                        href="/forgot-password"
                        className="font-semibold text-blue-600 transition-colors hover:text-blue-700"
                    >
                        Forgot password?
                    </Link>

                    <Link
                        href={registerHref}
                        className="font-semibold text-blue-600 transition-colors hover:text-blue-700"
                    >
                        Create account
                    </Link>
                </div>
            </AuthPageShell>
        </GuestOnlyAuthPage>
    );
}
