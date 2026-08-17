import type { Metadata } from "next";
import AdminCompanyFormPage from "@/features/admin/companies/components/AdminCompanyFormPage";
export const metadata: Metadata = { title: "Create Company" };
export default function AdminCreateCompanyRoute() { return <AdminCompanyFormPage mode="create" />; }
