import type { Metadata } from "next";

import JobSeekerSettingsPage from "@/features/account/components/JobSeekerSettingsPage";

export const metadata: Metadata = {
    title: "Account Settings | JobsSpot",
    description:
        "Manage your JobsSpot account information and password.",
};

export default function AccountSettingsPage() {
    return <JobSeekerSettingsPage />;
}
