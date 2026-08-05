import type { Metadata } from "next";
import { Suspense } from "react";

import AuthPageShell from "@/features/auth/components/AuthPageShell";
import ResetPasswordForm from "@/features/auth/components/ResetPasswordForm";

export const metadata: Metadata = {
    title: "Reset Password | JobsSpot",
    description:
        "Create a new secure password for your JobsSpot account.",
};

function ResetPasswordLoading() {
    return (
        <AuthPageShell
            mode="security"
            eyebrow="Account recovery"
            title="Create a new password"
            description="Choose a strong password that you have not used for this account before."
        >
            <div className="animate-pulse space-y-4">
                <div className="h-12 rounded-xl bg-slate-100" />
                <div className="h-12 rounded-xl bg-slate-100" />
                <div className="h-30 rounded-xl bg-slate-100" />
                <div className="h-12 rounded-xl bg-blue-100" />
            </div>
        </AuthPageShell>
    );
}

export default function ResetPasswordPage() {
    return (
        <Suspense
            fallback={
                <ResetPasswordLoading />
            }
        >
            <AuthPageShell
                mode="security"
                eyebrow="Account recovery"
                title="Create a new password"
                description="Choose a strong password that you have not used for this account before."
            >
                <ResetPasswordForm />
            </AuthPageShell>
        </Suspense>
    );
}
