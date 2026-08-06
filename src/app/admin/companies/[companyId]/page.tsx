import type { Metadata } from "next";

import AdminCompanyDetailsPage from "@/features/admin/companies/components/AdminCompanyDetailsPage";

export const metadata: Metadata = {
    title: "Company Details",
};

type AdminCompanyPageProps = {
    params: Promise<{
        companyId: string;
    }>;
};

export default async function AdminCompanyPage({ params }: AdminCompanyPageProps) {
    const { companyId } = await params;

    return <AdminCompanyDetailsPage companyId={companyId} />;
}
