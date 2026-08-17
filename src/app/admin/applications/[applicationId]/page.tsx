import type { Metadata } from "next";

import AdminApplicationDetailsPage from "@/features/admin/applications/components/AdminApplicationDetailsPage";

export const metadata: Metadata = { title: "Application Review" };

type Props = { params: Promise<{ applicationId: string }> };

export default async function AdminApplicationDetailsRoute({ params }: Props) {
    const { applicationId } = await params;
    return <AdminApplicationDetailsPage applicationId={applicationId} />;
}
