import type { Metadata } from "next";

import CompanyProfile from "@/features/companies/components/CompanyProfile";

type CompanyPageProps = Readonly<{
    params: Promise<{
        slug: string;
    }>;
}>;

export const metadata: Metadata = {
    title: "Company Profile | JobsSpot",
    description: "View company information and explore available job opportunities.",
};

export default async function CompanyPage({ params }: CompanyPageProps) {
    const { slug } = await params;

    return <CompanyProfile slug={slug} />;
}
