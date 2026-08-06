import type { Metadata } from "next";

import NotificationsPage from "@/features/notifications/components/NotificationsPage";

export const metadata: Metadata = {
    title: "Admin Notifications",
    description: "Review JobsSpot platform moderation notifications.",
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
            description="Review moderation, reports, and platform health updates that need administrator attention."
        />
    );
}
