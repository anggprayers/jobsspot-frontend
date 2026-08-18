import type { Metadata } from "next";

import RequireAuth from "@/features/auth/components/RequireAuth";
import NotificationsPage from "@/features/notifications/components/NotificationsPage";

export const metadata: Metadata = {
    title: "Notifications",
    description: "Review your JobsSpot account and application notifications.",
    robots: {
        index: false,
        follow: false,
    },
};

export default function JobSeekerNotificationsPage() {
    return (
        <RequireAuth>
            <div className="bg-slate-50/70 px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
                <NotificationsPage
                    audience="JOB_SEEKER"
                    eyebrow="Job seeker updates"
                    title="Notifications"
                    description="Follow meaningful updates about your applications and JobsSpot account."
                />
            </div>
        </RequireAuth>
    );
}
