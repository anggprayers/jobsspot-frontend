import type { Metadata } from "next";
import AdminJobFormPage from "@/features/admin/jobs/components/AdminJobFormPage";
export const metadata: Metadata = { title: "Edit Job" };
type Props = { params: Promise<{ jobId: string }> };
export default async function AdminEditJobRoute({ params }: Props) { const { jobId } = await params; return <AdminJobFormPage mode="edit" jobId={jobId} />; }
