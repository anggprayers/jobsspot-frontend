import type { Metadata } from "next";

import AdminUserDetailsPage from "@/features/admin/users/components/AdminUserDetailsPage";

export const metadata: Metadata = {
    title: "User Details",
};

type AdminUserPageProps = {
    params: Promise<{
        userId: string;
    }>;
};

export default async function AdminUserPage({ params }: AdminUserPageProps) {
    const { userId } = await params;

    return <AdminUserDetailsPage userId={userId} />;
}
