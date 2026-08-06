"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Check, ChevronDown, ChevronsUpDown, LogOut, Settings, ShieldCheck, User } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";

import { logout } from "@/features/auth/api/logout";
import { useAuth } from "@/features/auth/hooks/useAuth";

import type { AuthMembership, CompanyMemberRole } from "@/features/auth/types/auth";

const routeLabels: Record<string, string> = {
    "/employers": "Dashboard",
    "/employers/company": "Company",
    "/employers/jobs": "Jobs",
    "/employers/applicants": "Applicants",
    "/employers/team": "Team",
    "/employers/activity": "Activity",
    "/employers/settings": "Settings",
};

function getCurrentPageLabel(pathname: string): string {
    if (routeLabels[pathname]) {
        return routeLabels[pathname];
    }

    if (pathname.startsWith("/employers/jobs/")) {
        return "Job Details";
    }

    if (pathname.startsWith("/employers/applicants/")) {
        return "Applicant Details";
    }

    return "Employer Dashboard";
}

function getInitials(firstName?: string, lastName?: string): string {
    const firstInitial = firstName?.trim().charAt(0) ?? "";

    const lastInitial = lastName?.trim().charAt(0) ?? "";

    return `${firstInitial}${lastInitial}`.toUpperCase() || "U";
}

function getCompanyInitials(companyName: string): string {
    const words = companyName.trim().split(/\s+/).filter(Boolean);

    if (words.length === 0) {
        return "CO";
    }

    if (words.length === 1) {
        return words[0].slice(0, 2).toUpperCase();
    }

    return `${words[0].charAt(0)}${words[1].charAt(0)}`.toUpperCase();
}

function formatRole(role: CompanyMemberRole | null): string {
    if (!role) {
        return "Employer";
    }

    return role
        .toLowerCase()
        .replaceAll("_", " ")
        .replace(/\b\w/g, (character) => character.toUpperCase());
}

type CompanyIdentityProps = {
    membership: AuthMembership;
};

function CompanyIdentity({ membership }: CompanyIdentityProps) {
    return (
        <div className="flex min-w-0 flex-1 items-center gap-2.5">
            <Avatar className="size-7 shrink-0 rounded-md">
                <AvatarImage
                    src={membership.companyLogoUrl ?? undefined}
                    alt={`${membership.companyName} logo`}
                    className="object-cover"
                />

                <AvatarFallback className="rounded-md text-[10px] font-bold">
                    {getCompanyInitials(membership.companyName)}
                </AvatarFallback>
            </Avatar>

            <span className="hidden min-w-0 flex-1 truncate whitespace-nowrap text-left text-sm font-medium md:block">
                {membership.companyName}
            </span>
        </div>
    );
}

export default function EmployerHeader() {
    const pathname = usePathname();
    const router = useRouter();

    const {
        user,
        activeCompanyId,
        activeMembership,
        activeCompanyRole,
        setActiveCompany,
        clearSession,
    } = useAuth();

    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const currentPage = getCurrentPageLabel(pathname);

    const fullName = user ? `${user.firstName} ${user.lastName}` : "User";

    const initials = getInitials(user?.firstName, user?.lastName);

    const memberships = user?.memberships ?? [];

    const hasMultipleCompanies = memberships.length > 1;

    function handleCompanyChange(companyId: string) {
        if (companyId === activeCompanyId) {
            return;
        }

        setActiveCompany(companyId);

        /*
         * Return to the dashboard so job or applicant
         * IDs from the previous company do not remain
         * in the current URL.
         */
        router.replace("/employers");
        router.refresh();
    }

    async function handleLogout() {
        if (isLoggingOut) {
            return;
        }

        setIsLoggingOut(true);

        try {
            await logout();
        } finally {
            clearSession();
            router.replace("/");
            router.refresh();
        }
    }

    return (
        <header className="sticky top-0 z-30 border-b border-border/70 bg-background/95 backdrop-blur">
            <div className="flex h-16 items-center justify-between gap-3 px-4 md:px-6">
                <div className="flex min-w-0 items-center gap-3">
                    <SidebarTrigger />

                    <Separator orientation="vertical" className="hidden h-5 sm:block" />

                    <Breadcrumb className="hidden sm:block">
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <BreadcrumbLink asChild>
                                    <Link href="/employers">Employer</Link>
                                </BreadcrumbLink>
                            </BreadcrumbItem>

                            {currentPage !== "Dashboard" && (
                                <>
                                    <BreadcrumbSeparator />

                                    <BreadcrumbItem>
                                        <BreadcrumbPage>{currentPage}</BreadcrumbPage>
                                    </BreadcrumbItem>
                                </>
                            )}
                        </BreadcrumbList>
                    </Breadcrumb>
                </div>

                <div className="flex min-w-0 shrink-0 items-center gap-2">
                    {activeMembership &&
                        (hasMultipleCompanies ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        aria-label="Switch active company"
                                        className="h-10 w-11 min-w-0 justify-center overflow-hidden px-1.5 md:w-72 md:justify-start md:px-3"
                                    >
                                        <CompanyIdentity membership={activeMembership} />

                                        <ChevronsUpDown className="ml-auto hidden size-4 shrink-0 text-muted-foreground md:block" />
                                    </Button>
                                </DropdownMenuTrigger>

                                <DropdownMenuContent align="end" className="w-72">
                                    <DropdownMenuLabel>
                                        <p>Switch company</p>

                                        <p className="mt-1 text-xs font-normal text-muted-foreground">
                                            Select an employer workspace.
                                        </p>
                                    </DropdownMenuLabel>

                                    <DropdownMenuSeparator />

                                    {memberships.map((membership) => {
                                        const isActive = membership.companyId === activeCompanyId;

                                        return (
                                            <DropdownMenuItem
                                                key={membership.membershipId}
                                                onSelect={() =>
                                                    handleCompanyChange(membership.companyId)
                                                }
                                                className="gap-3 py-2.5"
                                            >
                                                <Avatar className="size-9 shrink-0 rounded-lg">
                                                    <AvatarImage
                                                        src={membership.companyLogoUrl ?? undefined}
                                                        alt={`${membership.companyName} logo`}
                                                        className="object-cover"
                                                    />

                                                    <AvatarFallback className="rounded-lg text-xs font-bold">
                                                        {getCompanyInitials(membership.companyName)}
                                                    </AvatarFallback>
                                                </Avatar>

                                                <div className="min-w-0 flex-1">
                                                    <p className="truncate whitespace-nowrap font-medium">
                                                        {membership.companyName}
                                                    </p>

                                                    <p className="mt-0.5 truncate text-xs text-muted-foreground">
                                                        {formatRole(membership.role)}
                                                    </p>
                                                </div>

                                                {isActive && (
                                                    <Check className="size-4 shrink-0 text-primary" />
                                                )}
                                            </DropdownMenuItem>
                                        );
                                    })}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            <div className="flex h-10 w-11 min-w-0 items-center overflow-hidden rounded-md border px-1.5 md:w-72 md:px-3">
                                <CompanyIdentity membership={activeMembership} />
                            </div>
                        ))}

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                type="button"
                                variant="ghost"
                                aria-label="Open account menu"
                                className="h-10 w-10 justify-center gap-2 px-1 lg:w-auto lg:max-w-56 lg:justify-start lg:px-2"
                            >
                                <Avatar className="size-8 shrink-0">
                                    <AvatarFallback>{initials}</AvatarFallback>
                                </Avatar>

                                <span className="hidden max-w-36 truncate whitespace-nowrap text-sm font-medium lg:block">
                                    {fullName}
                                </span>

                                <ChevronDown className="hidden size-4 shrink-0 text-muted-foreground lg:block" />
                            </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent align="end" className="w-60">
                            <DropdownMenuLabel>
                                <p className="truncate">{fullName}</p>

                                <p className="mt-1 truncate text-xs font-normal text-muted-foreground">
                                    {user?.email}
                                </p>

                                <p className="mt-1 text-xs font-medium text-primary">
                                    {formatRole(activeCompanyRole)}
                                </p>
                            </DropdownMenuLabel>

                            <DropdownMenuSeparator />

                            <DropdownMenuItem asChild>
                                <Link href="/employers/settings#profile">
                                    <User />
                                    Profile
                                </Link>
                            </DropdownMenuItem>

                            <DropdownMenuItem asChild>
                                <Link href="/employers/settings">
                                    <Settings />
                                    Settings
                                </Link>
                            </DropdownMenuItem>

                            {user?.isAdmin && (
                                <DropdownMenuItem asChild>
                                    <Link href="/admin">
                                        <ShieldCheck />
                                        Platform admin
                                    </Link>
                                </DropdownMenuItem>
                            )}

                            <DropdownMenuSeparator />

                            <DropdownMenuItem
                                variant="destructive"
                                disabled={isLoggingOut}
                                onSelect={(event) => {
                                    event.preventDefault();
                                    void handleLogout();
                                }}
                            >
                                <LogOut />

                                {isLoggingOut ? "Logging out..." : "Log out"}
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </header>
    );
}
