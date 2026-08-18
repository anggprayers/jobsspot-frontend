import type { Metadata } from "next";

import PublicJobSubmissionPage from "@/features/job-submission/components/PublicJobSubmissionPage";
import { absoluteUrl } from "@/lib/seo/site";

export const metadata: Metadata = {
    title: "Post a Job | JobsSpot",
    description:
        "Send JobsSpot your job opening for review. Our team confirms the posting details and next steps with you before publication.",
    alternates: {
        canonical: absoluteUrl("/post-a-job"),
    },
};

export default function PostAJobPage() {
    return <PublicJobSubmissionPage />;
}
