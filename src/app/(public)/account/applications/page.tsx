import type { Metadata } from "next";

import JobSeekerApplicationsPage from "@/features/applications/components/JobSeekerApplicationsPage";

export const metadata: Metadata = {
    title: "My Applications | JobsSpot",
    description:
        "Track your submitted job applications and current hiring status.",
};

export default function ApplicationsPage() {
    return <JobSeekerApplicationsPage />;
}
