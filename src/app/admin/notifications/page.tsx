import type { Metadata } from "next";

import NotificationsPage from "@/features/notifications/components/NotificationsPage";

export const metadata: Metadata = {
    title: "Admin Notifications",
    description: "Review JobsSpot hiring, moderation, and platform notifications.",
    robots: {
        index: false,
        follow: false,
    },
};

export default function AdminNotificationsPage() {
    return (
        <NotificationsPage
            audience="ADMIN"
            eyebrow="Platform alerts"
            title="Notifications"
            description="Review new applications, job submissions, reports, and platform alerts that need administrator attention."
        />
    );
}
