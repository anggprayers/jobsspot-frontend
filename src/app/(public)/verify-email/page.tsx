import type { Metadata } from "next";
import { Suspense } from "react";

import VerifyEmailPage from "@/features/auth/components/VerifyEmailPage";

export const metadata: Metadata = {
    title: "Verify Email | JobsSpot",
    description:
        "Confirm the email address connected to your JobsSpot account.",
};

function VerifyEmailLoading() {
    return (
        <main className="bg-slate-50 px-4 py-16 sm:py-24">
            <div className="mx-auto h-80 w-full max-w-xl animate-pulse rounded-2xl border border-slate-200 bg-white" />
        </main>
    );
}

export default function Page() {
    return (
        <Suspense
            fallback={
                <VerifyEmailLoading />
            }
        >
            <VerifyEmailPage />
        </Suspense>
    );
}
