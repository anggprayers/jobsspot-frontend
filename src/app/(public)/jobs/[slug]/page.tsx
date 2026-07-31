import type { Metadata } from "next";

import JobDetails from "@/features/jobs/components/JobDetails";

type JobDetailsPageProps = {
    params: Promise<{
        slug: string;
    }>;
};

export const metadata: Metadata = {
    title: "Job Details | JobsSpot",
    description: "View job responsibilities, requirements, salary, and employer information.",
};

export default async function JobDetailsPage({ params }: JobDetailsPageProps) {
    const { slug } = await params;

    return <JobDetails slug={slug} />;
}
