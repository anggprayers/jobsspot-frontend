"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
    Bell,
    Bookmark,
    BriefcaseBusiness,
    ChevronDown,
    FileText,
    LayoutDashboard,
    LoaderCircle,
    LogOut,
    SearchCheck,
    Settings,
    UserRound,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { logout } from "@/features/auth/api/logout";
import { useAuth } from "@/features/auth/hooks/useAuth";

type AccountLayoutProps = Readonly<{
    children: React.ReactNode;
}>;

const availableLinks = [
    {
        label: "Overview",
        href: "/account",
        icon: LayoutDashboard,
    },
    {
        label: "Applications",
        href: "/account/applications",
        icon: BriefcaseBusiness,
    },
    {
        label: "Saved jobs",
        href: "/account/saved-jobs",
        icon: Bookmark,
    },
    {
        label: "Resumes",
        href: "/account/resumes",
        icon: FileText,
    },
    {
        label: "Profile",
        href: "/account/profile",
        icon: UserRound,
    },
    {
        label: "Saved searches",
        href: "/account/saved-searches",
        icon: SearchCheck,
    },
    {
        label: "Notifications",
        href: "/notifications",
        icon: Bell,
    },
    {
        label: "Settings",
        href: "/account/settings",
        icon: Settings,
    },
] as const;

function getInitials(firstName: string, lastName: string): string {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
}

export default function AccountLayout({ children }: AccountLayoutProps) {
    const pathname = usePathname();
    const router = useRouter();

    const { user, isAuthenticated, isInitializing, clearSession } = useAuth();

    const [isMobileNavigationOpen, setIsMobileNavigationOpen] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    useEffect(() => {
        if (!isInitializing && !isAuthenticated && !isLoggingOut) {
            router.replace(`/login?returnUrl=${encodeURIComponent(pathname)}`);
        }
    }, [isAuthenticated, isInitializing, isLoggingOut, pathname, router]);

    async function handleLogout() {
        if (isLoggingOut) {
            return;
        }

        setIsLoggingOut(true);

        const toastId = toast.loading("Signing out...");

        try {
            await logout();

            toast.success("Signed out successfully.", {
                id: toastId,
            });
        } catch {
            toast.error("The server could not complete the logout request.", {
                id: toastId,
                description: "Your local session has still been cleared.",
            });
        } finally {
            clearSession();
            setIsMobileNavigationOpen(false);

            router.replace("/");
            router.refresh();
        }
    }

    if (isInitializing || !isAuthenticated || !user) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center px-4">
                <div className="flex items-center gap-3 rounded-2xl border bg-white px-5 py-4 text-sm text-slate-600 shadow-sm">
                    <LoaderCircle className="size-5 animate-spin text-blue-600" />
                    Loading your account...
                </div>
            </div>
        );
    }

    return (
        <div className="bg-slate-50/70">
            <div className="mx-auto w-full max-w-360 px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
                <div className="mb-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm lg:hidden">
                    <div className="flex items-center justify-between gap-4">
                        <div className="flex min-w-0 items-center gap-3">
                            <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
                                {getInitials(user.firstName, user.lastName)}
                            </div>

                            <div className="min-w-0">
                                <p className="truncate font-semibold text-slate-950">
                                    {user.firstName} {user.lastName}
                                </p>

                                <p className="truncate text-sm text-slate-500">
                                    Job seeker account
                                </p>
                            </div>
                        </div>

                        <button
                            type="button"
                            aria-expanded={isMobileNavigationOpen}
                            aria-controls="account-mobile-navigation"
                            onClick={() => setIsMobileNavigationOpen((current) => !current)}
                            className="inline-flex min-h-10 shrink-0 items-center gap-2 rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
                        >
                            Menu
                            <ChevronDown
                                className={`size-4 transition-transform ${
                                    isMobileNavigationOpen ? "rotate-180" : ""
                                }`}
                            />
                        </button>
                    </div>

                    {isMobileNavigationOpen && (
                        <div
                            id="account-mobile-navigation"
                            className="mt-4 border-t border-slate-200 pt-4"
                        >
                            <AccountNavigation
                                pathname={pathname}
                                isLoggingOut={isLoggingOut}
                                onNavigate={() => setIsMobileNavigationOpen(false)}
                                onLogout={() => void handleLogout()}
                            />
                        </div>
                    )}
                </div>

                <div className="grid items-start gap-6 lg:grid-cols-[270px_minmax(0,1fr)] xl:gap-8">
                    <aside className="sticky top-28 hidden space-y-5 lg:block">
                        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                            <div className="flex items-center gap-3">
                                <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
                                    {getInitials(user.firstName, user.lastName)}
                                </div>

                                <div className="min-w-0">
                                    <p className="truncate font-semibold text-slate-950">
                                        {user.firstName} {user.lastName}
                                    </p>

                                    <p className="truncate text-sm text-slate-500">{user.email}</p>
                                </div>
                            </div>

                            <div className="mt-5 border-t border-slate-100 pt-4">
                                <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
                                    Job seeker account
                                </p>
                            </div>
                        </div>

                        <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
                            <AccountNavigation
                                pathname={pathname}
                                isLoggingOut={isLoggingOut}
                                onLogout={() => void handleLogout()}
                            />
                        </div>
                    </aside>

                    <main className="min-w-0">{children}</main>
                </div>
            </div>
        </div>
    );
}

type AccountNavigationProps = Readonly<{
    pathname: string;
    isLoggingOut: boolean;
    onNavigate?: () => void;
    onLogout: () => void;
}>;

function AccountNavigation({
    pathname,
    isLoggingOut,
    onNavigate,
    onLogout,
}: AccountNavigationProps) {
    return (
        <nav aria-label="Job seeker account navigation" className="space-y-1">
            {availableLinks.map((link) => {
                const Icon = link.icon;
                const isActive =
                    link.href === "/account"
                        ? pathname === "/account"
                        : pathname === link.href || pathname.startsWith(`${link.href}/`);

                return (
                    <Link
                        key={link.href}
                        href={link.href}
                        onClick={onNavigate}
                        aria-current={isActive ? "page" : undefined}
                        className={`flex min-h-11 items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors ${
                            isActive
                                ? "bg-blue-50 text-blue-700"
                                : "text-slate-700 hover:bg-slate-50 hover:text-blue-600"
                        }`}
                    >
                        <Icon className="size-4.5" />
                        {link.label}
                    </Link>
                );
            })}

            <div className="my-3 border-t border-slate-100" />

            <button
                type="button"
                disabled={isLoggingOut}
                onClick={onLogout}
                className="flex min-h-11 w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
                {isLoggingOut ? (
                    <LoaderCircle className="size-4.5 animate-spin" />
                ) : (
                    <LogOut className="size-4.5" />
                )}

                {isLoggingOut ? "Signing out..." : "Sign out"}
            </button>
        </nav>
    );
}
