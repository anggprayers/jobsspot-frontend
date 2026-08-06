import type { Metadata } from "next";

import AdminCompaniesPage from "@/features/admin/companies/components/AdminCompaniesPage";

export const metadata: Metadata = {
    title: "Companies",
};

export default function PlatformAdminCompaniesPage() {
    return <AdminCompaniesPage />;
}
