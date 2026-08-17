import type { Metadata } from "next";
import AdminCompanyFormPage from "@/features/admin/companies/components/AdminCompanyFormPage";
export const metadata: Metadata = { title: "Edit Company" };
type Props = { params: Promise<{ companyId: string }> };
export default async function AdminEditCompanyRoute({ params }: Props) { const { companyId } = await params; return <AdminCompanyFormPage mode="edit" companyId={companyId} />; }
