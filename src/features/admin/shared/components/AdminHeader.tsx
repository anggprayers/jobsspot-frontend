"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ChevronDown, Home, LogOut, ShieldCheck, UserRound } from "lucide-react";

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
import { getAdminInitials } from "../utils/adminFormatters";

function getPageLabel(pathname: string): string {
    if (pathname === "/admin") {
        return "Dashboard";
    }

    if (pathname === "/admin/users") {
        return "Users";
    }

    if (pathname.startsWith("/admin/users/")) {
        return "User details";
    }

    if (pathname === "/admin/companies") {
        return "Companies";
    }

    if (pathname.startsWith("/admin/companies/")) {
        return "Company details";
    }

    if (pathname === "/admin/activity") {
        return "Activity";
    }

    return "Administration";
}

export default function AdminHeader() {
    const pathname = usePathname();
    const router = useRouter();
    const { user, clearSession } = useAuth();
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const currentPage = getPageLabel(pathname);
    const fullName = user ? `${user.firstName} ${user.lastName}` : "Administrator";
    const initials = user ? getAdminInitials(user.firstName, user.lastName) : "AD";

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
                                    <Link href="/admin">Admin</Link>
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

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            type="button"
                            variant="ghost"
                            aria-label="Open administrator account menu"
                            className="h-10 w-10 justify-center gap-2 px-1 lg:w-auto lg:max-w-56 lg:justify-start lg:px-2"
                        >
                            <Avatar className="size-8 shrink-0">
                                <AvatarImage src={user?.avatarUrl ?? undefined} alt={fullName} />
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

                            <p className="mt-1 flex items-center gap-1.5 text-xs font-medium text-primary">
                                <ShieldCheck className="size-3.5" />
                                Platform administrator
                            </p>
                        </DropdownMenuLabel>

                        <DropdownMenuSeparator />

                        <DropdownMenuItem asChild>
                            <Link href="/">
                                <Home />
                                JobsSpot home
                            </Link>
                        </DropdownMenuItem>

                        <DropdownMenuItem asChild>
                            <Link href="/account/profile">
                                <UserRound />
                                My account
                            </Link>
                        </DropdownMenuItem>

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
        </header>
    );
}
