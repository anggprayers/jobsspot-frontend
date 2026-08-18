import type { Metadata } from "next";

import EmployerJobsPage from "@/features/employers/jobs/components/EmployerJobsPage";

export const metadata: Metadata = {
    title: "Jobs | Employer Dashboard",
    description: "Manage your company's job postings.",
};

export default function Page() {
    return <EmployerJobsPage />;
}
