import type { Metadata } from "next";
import { Suspense } from "react";

import CompanyInvitationAcceptancePage from "@/features/company-invitations/components/CompanyInvitationAcceptancePage";

export const metadata: Metadata = {
    title: "Company Invitation",
    description:
        "Review and accept a JobsSpot company invitation.",
    robots: {
        index: false,
        follow: false,
    },
};

function InvitationPageLoading() {
    return (
        <div className="bg-slate-50 px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
            <div className="mx-auto h-128 w-full max-w-5xl animate-pulse rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-200/60" />
        </div>
    );
}

export default function Page() {
    return (
        <Suspense
            fallback={
                <InvitationPageLoading />
            }
        >
            <CompanyInvitationAcceptancePage />
        </Suspense>
    );
}
