import type { Metadata } from "next";
import AdminJobFormPage from "@/features/admin/jobs/components/AdminJobFormPage";
export const metadata: Metadata = { title: "Create Job" };
export default function AdminCreateJobRoute() { return <AdminJobFormPage mode="create" />; }
