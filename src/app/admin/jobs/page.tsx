import type { Metadata } from "next";
import AdminJobsPage from "@/features/admin/jobs/components/AdminJobsPage";
export const metadata: Metadata = { title: "Job Moderation" };
export default function AdminJobsRoute() { return <AdminJobsPage />; }
