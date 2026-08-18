"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    Building2,
    LoaderCircle,
    LogIn,
    LogOut,
    Menu,
    ShieldCheck,
    UserRound,
    X,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import Logo from "@/components/common/Logo";
import { logout } from "@/features/auth/api/logout";
import SignInModal from "@/features/auth/components/SignInModal";
import { useAuth } from "@/features/auth/hooks/useAuth";
import NotificationBell from "@/features/notifications/components/NotificationBell";

import Container from "./Container";
import Navigation from "./Navigation";

function getInitials(firstName: string, lastName: string): string {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
}

export default function Header() {
    const router = useRouter();

    const {
        user,
        isAuthenticated,
        isInitializing,
        clearSession,
    } = useAuth();

    const [isSignInOpen, setIsSignInOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);

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
            toast.error(
                "The server could not complete the logout request.",
                {
                    id: toastId,
                    description:
                        "Your local session has still been cleared.",
                },
            );
        } finally {
            clearSession();
            setIsMobileMenuOpen(false);
            setIsLoggingOut(false);

            router.replace("/");
            router.refresh();
        }
    }

    function openSignInModal() {
        setIsMobileMenuOpen(false);
        setIsSignInOpen(true);
    }

    const postJobHref = "/post-a-job";
    const postJobLabel = "Post a Job";

    return (
        <>
            <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 shadow-sm backdrop-blur-xl">
                <Container>
                    <div className="flex h-20 items-center justify-between sm:h-22 lg:h-24">
                        <Logo />

                        <div className="hidden items-center gap-8 lg:flex xl:gap-10">
                            <Navigation />

                            <div className="flex items-center gap-3">
                                {isAuthenticated && user && (
                                    <NotificationBell
                                        audience="JOB_SEEKER"
                                        viewAllHref="/notifications"
                                        visualStyle="public"
                                    />
                                )}

                                {isInitializing ? (
                                    <button
                                        type="button"
                                        disabled
                                        aria-busy="true"
                                        className="inline-flex min-h-12 cursor-wait items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3 text-base font-semibold text-slate-800 shadow-sm"
                                    >
                                        <LogIn size={19} />
                                        Sign In
                                    </button>
                                ) : isAuthenticated && user ? (
                                    <Link
                                        href="/account"
                                        className="inline-flex min-h-12 items-center justify-center gap-3 rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-left shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-400 hover:bg-slate-50 hover:shadow-md focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-slate-200"
                                    >
                                        <span className="flex size-8 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
                                            {getInitials(
                                                user.firstName,
                                                user.lastName,
                                            )}
                                        </span>

                                        <span className="max-w-32">
                                            <span className="block truncate text-sm font-semibold text-slate-950">
                                                {user.firstName}
                                            </span>

                                            <span className="block truncate text-xs text-slate-500">
                                                My account
                                            </span>
                                        </span>
                                    </Link>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setIsSignInOpen(true)
                                        }
                                        className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3 text-base font-semibold text-slate-800 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-400 hover:bg-slate-50 hover:shadow-md focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-slate-200"
                                    >
                                        <LogIn size={19} />
                                        Sign In
                                    </button>
                                )}

                                {user?.isAdmin && (
                                    <Link
                                        href="/admin"
                                        className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm font-semibold text-blue-700 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-300 hover:bg-blue-100 hover:shadow-md focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200"
                                    >
                                        <ShieldCheck size={18} />
                                        Admin
                                    </Link>
                                )}

                                <Link
                                    href={postJobHref}
                                    className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-base font-semibold text-white shadow-sm shadow-blue-600/20 transition-all duration-200 hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-md hover:shadow-blue-600/25 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200"
                                >
                                    <Building2 size={19} />
                                    {postJobLabel}
                                </Link>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 lg:hidden">
                            {isAuthenticated && user && (
                                <NotificationBell
                                    audience="JOB_SEEKER"
                                    viewAllHref="/notifications"
                                    visualStyle="public"
                                    className="size-11"
                                />
                            )}

                            <button
                                type="button"
                                aria-label={
                                    isMobileMenuOpen
                                        ? "Close navigation menu"
                                        : "Open navigation menu"
                                }
                                aria-expanded={isMobileMenuOpen}
                                aria-controls="mobile-navigation"
                                onClick={() =>
                                    setIsMobileMenuOpen(
                                        (current) => !current,
                                    )
                                }
                                className="inline-flex size-11 items-center justify-center rounded-xl border border-slate-300 bg-white text-slate-800 shadow-sm transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-slate-200"
                            >
                                {isMobileMenuOpen ? (
                                    <X className="size-5" />
                                ) : (
                                    <Menu className="size-5" />
                                )}
                            </button>
                        </div>
                    </div>
                </Container>
            </header>

            {isMobileMenuOpen && (
                <div className="fixed inset-0 z-60 lg:hidden">
                    <button
                        type="button"
                        aria-label="Close navigation menu"
                        className="absolute inset-0 bg-slate-950/45 backdrop-blur-[2px]"
                        onClick={() =>
                            setIsMobileMenuOpen(false)
                        }
                    />

                    <aside
                        id="mobile-navigation"
                        role="dialog"
                        aria-modal="true"
                        aria-label="Mobile navigation"
                        className="absolute inset-y-0 right-0 flex w-[min(88vw,380px)] flex-col bg-white shadow-2xl"
                    >
                        <div className="flex h-20 items-center justify-between border-b border-slate-200 px-5 sm:h-22 sm:px-6">
                            <Logo />

                            <button
                                type="button"
                                aria-label="Close navigation menu"
                                onClick={() =>
                                    setIsMobileMenuOpen(false)
                                }
                                className="inline-flex size-10 items-center justify-center rounded-xl border border-slate-300 text-slate-700 transition-colors hover:bg-slate-50"
                            >
                                <X className="size-5" />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto px-5 py-6 sm:px-6">
                            {isAuthenticated && user && (
                                <div className="mb-6 rounded-2xl border border-blue-100 bg-blue-50/70 p-4">
                                    <div className="flex items-center gap-3">
                                        <span className="flex size-11 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
                                            {getInitials(
                                                user.firstName,
                                                user.lastName,
                                            )}
                                        </span>

                                        <div className="min-w-0">
                                            <p className="truncate font-semibold text-slate-950">
                                                {user.firstName}{" "}
                                                {user.lastName}
                                            </p>

                                            <p className="truncate text-sm text-slate-600">
                                                {user.email}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <Navigation
                                variant="mobile"
                                onNavigate={() =>
                                    setIsMobileMenuOpen(false)
                                }
                            />

                            <div className="mt-7 space-y-3 border-t border-slate-200 pt-6">
                                {isInitializing ? (
                                    <button
                                        type="button"
                                        disabled
                                        aria-busy="true"
                                        className="flex min-h-12 w-full cursor-wait items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-3 font-semibold text-slate-800"
                                    >
                                        <LogIn className="size-5" />
                                        Sign In
                                    </button>
                                ) : isAuthenticated ? (
                                    <>
                                        <Link
                                            href="/account"
                                            onClick={() =>
                                                setIsMobileMenuOpen(
                                                    false,
                                                )
                                            }
                                            className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-3 font-semibold text-slate-800 transition-colors hover:bg-slate-50"
                                        >
                                            <UserRound className="size-5" />
                                            My account
                                        </Link>

                                        {user?.isAdmin && (
                                            <Link
                                                href="/admin"
                                                onClick={() => setIsMobileMenuOpen(false)}
                                                className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 font-semibold text-blue-700 transition-colors hover:bg-blue-100"
                                            >
                                                <ShieldCheck className="size-5" />
                                                Platform admin
                                            </Link>
                                        )}

                                        <button
                                            type="button"
                                            disabled={isLoggingOut}
                                            onClick={() =>
                                                void handleLogout()
                                            }
                                            className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 font-semibold text-red-700 transition-colors hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
                                        >
                                            {isLoggingOut ? (
                                                <LoaderCircle className="size-5 animate-spin" />
                                            ) : (
                                                <LogOut className="size-5" />
                                            )}

                                            {isLoggingOut
                                                ? "Signing out..."
                                                : "Sign out"}
                                        </button>
                                    </>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={openSignInModal}
                                        className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-3 font-semibold text-slate-800 transition-colors hover:bg-slate-50"
                                    >
                                        <LogIn className="size-5" />
                                        Sign In
                                    </button>
                                )}

                                <Link
                                    href={postJobHref}
                                    onClick={() =>
                                        setIsMobileMenuOpen(false)
                                    }
                                    className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white shadow-sm shadow-blue-600/20 transition-colors hover:bg-blue-700"
                                >
                                    <Building2 className="size-5" />
                                    {postJobLabel}
                                </Link>
                            </div>
                        </div>
                    </aside>
                </div>
            )}

            <SignInModal
                isOpen={isSignInOpen}
                onClose={() => setIsSignInOpen(false)}
            />
        </>
    );
}
