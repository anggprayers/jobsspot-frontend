import type { Metadata } from "next";

import AdminJobSubmissionDetailsPage from "@/features/admin/job-submissions/components/AdminJobSubmissionDetailsPage";

export const metadata: Metadata = {
    title: "Job Submission Review",
};

type AdminJobSubmissionPageProps = {
    params: Promise<{
        submissionId: string;
    }>;
};

export default async function AdminJobSubmissionPage({ params }: AdminJobSubmissionPageProps) {
    const { submissionId } = await params;

    return <AdminJobSubmissionDetailsPage submissionId={submissionId} />;
}
