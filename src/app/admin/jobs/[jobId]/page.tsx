import type { Metadata } from "next";
import AdminJobDetailsPage from "@/features/admin/jobs/components/AdminJobDetailsPage";
export const metadata: Metadata = { title: "Job Details" };
type Props = { params: Promise<{ jobId: string }> };
export default async function AdminJobRoute({ params }: Props) { const { jobId } = await params; return <AdminJobDetailsPage jobId={jobId} />; }
