import type { Metadata } from "next";

import EmployerGetStartedPage from "@/features/employers/onboarding/components/EmployerGetStartedPage";

export const metadata: Metadata = {
    title: "Employer Setup | JobsSpot",
    description:
        "Create your company workspace and start hiring with JobsSpot.",
};

export default function GetStartedPage() {
    return <EmployerGetStartedPage />;
}
