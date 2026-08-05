import type { Metadata } from "next";
import { Suspense } from "react";

import AuthPageShell from "@/features/auth/components/AuthPageShell";
import RegisterPageContent from "@/features/auth/components/RegisterPageContent";

export const metadata: Metadata = {
    title: "Create Account | JobsSpot",
    description:
        "Create your JobsSpot account to build a job seeker profile, save opportunities, and apply for jobs.",
};

function RegisterPageLoading() {
    return (
        <AuthPageShell
            size="wide"
            eyebrow="Join JobsSpot"
            title="Create your account"
            description="Build your profile, manage resumes, save jobs, and track every application in one place."
        >
            <div className="animate-pulse space-y-4">
                <div className="h-12 rounded-xl bg-slate-100" />
                <div className="grid gap-4 sm:grid-cols-2">
                    <div className="h-12 rounded-xl bg-slate-100" />
                    <div className="h-12 rounded-xl bg-slate-100" />
                </div>
                <div className="h-12 rounded-xl bg-slate-100" />
                <div className="h-12 rounded-xl bg-blue-100" />
            </div>
        </AuthPageShell>
    );
}

export default function RegisterPage() {
    return (
        <Suspense
            fallback={
                <RegisterPageLoading />
            }
        >
            <RegisterPageContent />
        </Suspense>
    );
}
