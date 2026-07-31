"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    BriefcaseBusiness,
    Building2,
    History,
    LayoutDashboard,
    Settings,
    UserRoundCog,
    Users,
} from "lucide-react";

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
import { useAuth } from "@/features/auth/hooks/useAuth";
import {
    canManageCompany,
    canManageTeam,
    canViewActivity,
} from "@/features/employers/utils/employerPermissions";

const dashboardNavigationItem = {
    title: "Dashboard",
    href: "/employers",
    icon: LayoutDashboard,
};

const companyNavigationItem = {
    title: "Company",
    href: "/employers/company",
    icon: Building2,
};

const jobsNavigationItem = {
    title: "Jobs",
    href: "/employers/jobs",
    icon: BriefcaseBusiness,
};

const applicantsNavigationItem = {
    title: "Applicants",
    href: "/employers/applicants",
    icon: Users,
};

const teamNavigationItem = {
    title: "Team",
    href: "/employers/team",
    icon: UserRoundCog,
};

const activityNavigationItem = {
    title: "Activity",
    href: "/employers/activity",
    icon: History,
};

const settingsNavigationItem = {
    title: "Settings",
    href: "/employers/settings",
    icon: Settings,
};

function isNavigationItemActive(pathname: string, href: string): boolean {
    if (href === "/employers") {
        return pathname === href;
    }

    return pathname === href || pathname.startsWith(`${href}/`);
}

export default function EmployerSidebar() {
    const pathname = usePathname();

    const { activeCompanyRole } = useAuth();

    const hasCompanyManagementAccess = canManageCompany(activeCompanyRole);

    const hasTeamManagementAccess = canManageTeam(activeCompanyRole);

    const hasActivityAccess = canViewActivity(activeCompanyRole);

    const navigationItems = [
        dashboardNavigationItem,

        ...(hasCompanyManagementAccess ? [companyNavigationItem] : []),

        jobsNavigationItem,
        applicantsNavigationItem,

        ...(hasTeamManagementAccess ? [teamNavigationItem] : []),

        ...(hasActivityAccess ? [activityNavigationItem] : []),

        settingsNavigationItem,
    ];

    return (
        <Sidebar collapsible="icon">
            <SidebarHeader className="border-b">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild size="lg" tooltip="JobsSpot">
                            <Link href="/employers">
                                <div className="flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-primary/10">
                                    <Image
                                        src="/logo.jpeg"
                                        alt="JobsSpot"
                                        width={32}
                                        height={32}
                                        className="size-8 object-contain"
                                        priority
                                    />
                                </div>

                                <div className="grid flex-1 text-left leading-tight">
                                    <span className="truncate font-semibold">JobsSpot</span>

                                    <span className="truncate text-xs text-muted-foreground">
                                        Employer Portal
                                    </span>
                                </div>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Workspace</SidebarGroupLabel>

                    <SidebarGroupContent>
                        <SidebarMenu>
                            {navigationItems.map((item) => {
                                const isActive = isNavigationItemActive(pathname, item.href);

                                return (
                                    <SidebarMenuItem key={item.href}>
                                        <SidebarMenuButton
                                            asChild
                                            isActive={isActive}
                                            tooltip={item.title}
                                            className="data-[active=true]:bg-primary data-[active=true]:text-primary-foreground data-[active=true]:shadow-sm"
                                        >
                                            <Link href={item.href}>
                                                <item.icon />

                                                <span>{item.title}</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                );
                            })}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter className="border-t">
                <p className="px-2 text-xs text-muted-foreground group-data-[collapsible=icon]:hidden">
                    JobsSpot Employer Portal
                </p>
            </SidebarFooter>

            <SidebarRail />
        </Sidebar>
    );
}
