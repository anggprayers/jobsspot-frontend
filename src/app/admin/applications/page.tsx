import type { Metadata } from "next";

import AdminApplicationsPage from "@/features/admin/applications/components/AdminApplicationsPage";

export const metadata: Metadata = { title: "Applications" };

export default function AdminApplicationsRoute() {
    return <AdminApplicationsPage />;
}
