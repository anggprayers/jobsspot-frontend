"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Activity, Bell, Building2, LayoutDashboard, ShieldCheck, UserRound, Users } from "lucide-react";

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
} from "@/components/ui/sidebar";

const navigationItems = [
    {
        title: "Dashboard",
        href: "/admin",
        icon: LayoutDashboard,
    },
    {
        title: "Users",
        href: "/admin/users",
        icon: Users,
    },
    {
        title: "Companies",
        href: "/admin/companies",
        icon: Building2,
    },
    {
        title: "Activity",
        href: "/admin/activity",
        icon: Activity,
    },
    {
        title: "Notifications",
        href: "/admin/notifications",
        icon: Bell,
    },
];

function isActiveRoute(pathname: string, href: string): boolean {
    if (href === "/admin") {
        return pathname === href;
    }

    return pathname === href || pathname.startsWith(`${href}/`);
}

export default function AdminSidebar() {
    const pathname = usePathname();

    return (
        <Sidebar collapsible="icon" className="border-slate-800">
            <SidebarHeader className="border-b border-slate-800 bg-slate-950 text-white">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild size="lg" tooltip="JobsSpot Admin">
                            <Link href="/admin">
                                <div className="flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-white/10">
                                    <Image
                                        src="/logo.png"
                                        alt="JobsSpot"
                                        width={32}
                                        height={32}
                                        className="size-8 object-contain"
                                        priority
                                    />
                                </div>

                                <div className="grid flex-1 text-left leading-tight">
                                    <span className="truncate font-semibold">JobsSpot</span>

                                    <span className="truncate text-xs text-slate-400">
                                        Platform Admin
                                    </span>
                                </div>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent className="bg-slate-950 text-slate-200">
                <SidebarGroup>
                    <SidebarGroupLabel className="text-slate-500">Administration</SidebarGroupLabel>

                    <SidebarGroupContent>
                        <SidebarMenu>
                            {navigationItems.map((item) => (
                                <SidebarMenuItem key={item.href}>
                                    <SidebarMenuButton
                                        asChild
                                        isActive={isActiveRoute(pathname, item.href)}
                                        tooltip={item.title}
                                        className="text-slate-300 hover:bg-slate-900 hover:text-white data-[active=true]:bg-blue-600 data-[active=true]:text-white data-[active=true]:shadow-sm"
                                    >
                                        <Link href={item.href}>
                                            <item.icon />
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter className="border-t border-slate-800 bg-slate-950 text-slate-300">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            asChild
                            tooltip="Return to JobsSpot"
                            className="text-slate-300 hover:bg-slate-900 hover:text-white"
                        >
                            <Link href="/">
                                <UserRound />
                                <span>Return to JobsSpot</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>

                <div className="flex items-center gap-2 px-2 text-xs text-slate-500 group-data-[collapsible=icon]:hidden">
                    <ShieldCheck className="size-3.5" />
                    Protected admin workspace
                </div>
            </SidebarFooter>

            <SidebarRail />
        </Sidebar>
    );
}
