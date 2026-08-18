import type { Metadata } from "next";

import NotificationsPage from "@/features/notifications/components/NotificationsPage";

export const metadata: Metadata = {
    title: "Employer Notifications",
    description: "Review employer workspace notifications on JobsSpot.",
    robots: {
        index: false,
        follow: false,
    },
};

export default function EmployerNotificationsPage() {
    return (
        <NotificationsPage
            audience="EMPLOYER"
            eyebrow="Employer updates"
            title="Notifications"
            description="Review application, job, team, and company workspace updates."
        />
    );
}
