import type { Metadata } from "next";
import AdminCategoriesPage from "@/features/admin/categories/components/AdminCategoriesPage";

export const metadata: Metadata = { title: "Job Categories" };

export default function AdminCategoriesRoute() {
    return <AdminCategoriesPage />;
}
