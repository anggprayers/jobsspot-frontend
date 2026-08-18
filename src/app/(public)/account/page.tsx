import type { Metadata } from "next";

import JobSeekerDashboardPage from "@/features/account/components/JobSeekerDashboardPage";

export const metadata: Metadata = {
    title: "My JobsSpot",
    description: "Review your JobsSpot applications, saved jobs, resumes, and account activity.",
};

export default function AccountPage() {
    return <JobSeekerDashboardPage />;
}
