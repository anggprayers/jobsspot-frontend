import type { Metadata } from "next";
import { Suspense } from "react";

import AuthPageShell from "@/features/auth/components/AuthPageShell";
import GuestOnlyAuthPage from "@/features/auth/components/GuestOnlyAuthPage";
import LoginPageContent from "@/features/auth/components/LoginPageContent";

export const metadata: Metadata = {
    title: "Sign In | JobsSpot",
    description:
        "Sign in to manage your JobsSpot profile, applications, saved jobs, or employer workspace.",
};

function LoginPageLoading() {
    return (
        <AuthPageShell
            eyebrow="Welcome back"
            title="Sign in to JobsSpot"
            description="Continue your job search, manage applications, and keep your career profile up to date."
        >
            <div className="animate-pulse space-y-4">
                <div className="h-12 rounded-xl bg-slate-100" />
                <div className="h-12 rounded-xl bg-slate-100" />
                <div className="h-12 rounded-xl bg-blue-100" />
            </div>
        </AuthPageShell>
    );
}

export default function LoginPage() {
    return (
        <GuestOnlyAuthPage>
            <Suspense
                fallback={
                    <LoginPageLoading />
                }
            >
                <LoginPageContent />
            </Suspense>
        </GuestOnlyAuthPage>
    );
}
