"use client";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

import EmployerHeader from "./EmployerHeader";
import EmployerSidebar from "./EmployerSidebar";

type EmployerLayoutProps = Readonly<{
    children: React.ReactNode;
}>;

export default function EmployerLayout({ children }: EmployerLayoutProps) {
    return (
        <SidebarProvider>
            <EmployerSidebar />

            <SidebarInset>
                <EmployerHeader />

                <main className="flex-1 bg-linear-to-br from-background via-background to-primary/5 p-4 md:p-6 lg:p-8">
                    {children}
                </main>
            </SidebarInset>
        </SidebarProvider>
    );
}
