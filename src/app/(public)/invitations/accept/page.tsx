import type { Metadata } from "next";
import { permanentRedirect } from "next/navigation";

export const metadata: Metadata = {
    title: "Company Invitations Retired | JobsSpot",
    description: "JobsSpot now manages hiring directly through Platform Admin.",
    robots: {
        index: false,
        follow: false,
    },
};

export default function Page() {
    permanentRedirect("/post-a-job");
}
