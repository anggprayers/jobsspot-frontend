"use client";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

import AdminHeader from "./AdminHeader";
import AdminSidebar from "./AdminSidebar";
import PlatformAdminGuard from "./PlatformAdminGuard";

type AdminLayoutProps = Readonly<{
    children: React.ReactNode;
}>;

export default function AdminLayout({ children }: AdminLayoutProps) {
    return (
        <PlatformAdminGuard>
            <SidebarProvider>
                <AdminSidebar />
                <SidebarInset>
                    <AdminHeader />
                    <main className="min-h-[calc(100vh-4rem)] flex-1 bg-linear-to-br from-background via-background to-primary/5 p-4 md:p-6 lg:p-8">
                        {children}
                    </main>
                </SidebarInset>
            </SidebarProvider>
        </PlatformAdminGuard>
    );
}
