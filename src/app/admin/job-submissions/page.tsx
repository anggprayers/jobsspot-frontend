import type { Metadata } from "next";

import AdminJobSubmissionsPage from "@/features/admin/job-submissions/components/AdminJobSubmissionsPage";

export const metadata: Metadata = {
    title: "Job Submissions",
};

export default function AdminJobSubmissionsRoute() {
    return <AdminJobSubmissionsPage />;
}
