import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
    title: "Company Invitations Retired | JobsSpot",
    description: "JobsSpot now manages hiring directly through Platform Admin.",
    robots: {
        index: false,
        follow: false,
    },
};

export default function Page() {
    redirect("/post-a-job");
}
