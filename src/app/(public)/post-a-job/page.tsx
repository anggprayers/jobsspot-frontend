import type { Metadata } from "next";

import PublicJobSubmissionPage from "@/features/job-submission/components/PublicJobSubmissionPage";
import { absoluteUrl } from "@/lib/seo/site";

export const metadata: Metadata = {
    title: "Post a Job | JobsSpot",
    description:
        "Send JobsSpot your job opening for review. No employer account, plan, or online payment is required.",
    alternates: {
        canonical: absoluteUrl("/post-a-job"),
    },
};

export default function PostAJobPage() {
    return <PublicJobSubmissionPage />;
}
