import type { Metadata } from "next";
import AdminJobReportDetailsPage from "@/features/admin/reports/components/AdminJobReportDetailsPage";
export const metadata: Metadata = { title: "Job Report Review" };
type Props = { params: Promise<{ reportId: string }> };
export default async function AdminReportRoute({ params }: Props) { const { reportId } = await params; return <AdminJobReportDetailsPage reportId={reportId} />; }
