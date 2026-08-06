import type { Metadata } from "next";

import AdminLayout from "@/features/admin/shared/components/AdminLayout";

export const metadata: Metadata = {
    title: "Platform Admin",
    description: "Protected JobsSpot platform administration workspace.",
    robots: {
        index: false,
        follow: false,
    },
};

type PlatformAdminLayoutProps = Readonly<{
    children: React.ReactNode;
}>;

export default function PlatformAdminLayout({ children }: PlatformAdminLayoutProps) {
    return <AdminLayout>{children}</AdminLayout>;
}
