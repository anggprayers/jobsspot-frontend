import type { Metadata } from "next";
import AdminJobReportsPage from "@/features/admin/reports/components/AdminJobReportsPage";
export const metadata: Metadata = { title: "Job Reports" };
export default function AdminReportsRoute() { return <AdminJobReportsPage />; }
