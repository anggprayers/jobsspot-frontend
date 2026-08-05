"use client";

import Link from "next/link";
import {
    BriefcaseBusiness,
    Building2,
    CheckCircle2,
    Search,
    Users,
    X,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

import LoginForm from "./LoginForm";

type SignInModalProps = Readonly<{
    isOpen: boolean;
    onClose: () => void;
    redirectTo?: string;
}>;

function isEmployerDestination(
    value: string,
): boolean {
    return (
        value === "/employers" ||
        value.startsWith("/employers/")
    );
}

export default function SignInModal({
    isOpen,
    onClose,
    redirectTo,
}: SignInModalProps) {
    const pathname = usePathname();

    const resolvedRedirectPath =
        redirectTo ??
        (pathname === "/"
            ? "/jobs"
            : pathname);

    const isEmployerLogin =
        isEmployerDestination(
            resolvedRedirectPath,
        );

    useEffect(() => {
        if (!isOpen) {
            return;
        }

        const handleKeyDown = (
            event: KeyboardEvent,
        ) => {
            if (event.key === "Escape") {
                onClose();
            }
        };

        document.addEventListener(
            "keydown",
            handleKeyDown,
        );
        document.body.style.overflow =
            "hidden";

        return () => {
            document.removeEventListener(
                "keydown",
                handleKeyDown,
            );
            document.body.style.overflow =
                "";
        };
    }, [isOpen, onClose]);

    if (!isOpen) {
        return null;
    }

    const SideIcon = isEmployerLogin
        ? Building2
        : Search;

    return (
        <div
            className="fixed inset-0 z-100 flex items-center justify-center bg-slate-950/65 px-4 py-6 backdrop-blur-sm"
            role="dialog"
            aria-modal="true"
            aria-labelledby="sign-in-title"
            onMouseDown={onClose}
        >
            <div
                className="relative grid max-h-[calc(100vh-3rem)] w-full max-w-3xl overflow-y-auto rounded-3xl border border-white/15 bg-white shadow-2xl md:grid-cols-[250px_minmax(0,1fr)]"
                onMouseDown={(event) =>
                    event.stopPropagation()
                }
            >
                <aside className="relative hidden overflow-hidden bg-slate-950 p-7 text-white md:flex md:flex-col md:justify-between">
                    <div
                        aria-hidden="true"
                        className="absolute -left-16 top-8 size-52 rounded-full bg-blue-600/25 blur-3xl"
                    />

                    <div className="relative">
                        <span className="flex size-11 items-center justify-center rounded-2xl border border-white/10 bg-white/8 text-blue-300">
                            <SideIcon className="size-5" />
                        </span>

                        <h3 className="mt-6 text-2xl font-bold leading-tight">
                            {isEmployerLogin
                                ? "Continue building your hiring pipeline."
                                : "Continue your next career step."}
                        </h3>

                        <div className="mt-7 space-y-4 text-sm text-slate-300">
                            <div className="flex gap-3">
                                <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-blue-300" />
                                <span>
                                    {isEmployerLogin
                                        ? "Manage job posts and applicants."
                                        : "Track jobs, resumes, and applications."}
                                </span>
                            </div>

                            <div className="flex gap-3">
                                {isEmployerLogin ? (
                                    <Users className="mt-0.5 size-4 shrink-0 text-blue-300" />
                                ) : (
                                    <BriefcaseBusiness className="mt-0.5 size-4 shrink-0 text-blue-300" />
                                )}

                                <span>
                                    {isEmployerLogin
                                        ? "Work with your company team."
                                        : "Keep your search organized."}
                                </span>
                            </div>
                        </div>
                    </div>

                    <p className="relative mt-10 text-xs leading-5 text-slate-500">
                        Secure JobsSpot account access
                    </p>
                </aside>

                <div className="relative p-6 sm:p-8">
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close sign-in dialog"
                        className="absolute right-4 top-4 rounded-xl p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900"
                    >
                        <X size={20} />
                    </button>

                    <div className="pr-10">
                        <p className="text-sm font-semibold text-blue-600">
                            {isEmployerLogin
                                ? "Employer access"
                                : "Welcome back"}
                        </p>

                        <h2
                            id="sign-in-title"
                            className="mt-2 text-3xl font-bold tracking-tight text-slate-950"
                        >
                            {isEmployerLogin
                                ? "Sign in to your workspace"
                                : "Sign in to JobsSpot"}
                        </h2>

                        <p className="mt-3 text-sm leading-6 text-slate-600">
                            {isEmployerLogin
                                ? "Manage your company, job postings, applicants, and hiring team."
                                : "Continue your job search and manage your JobsSpot account."}
                        </p>
                    </div>

                    <div className="mt-7">
                        <LoginForm
                            onSuccess={onClose}
                            defaultRedirectPath={
                                resolvedRedirectPath
                            }
                        />
                    </div>

                    <div className="mt-6 flex items-center justify-between gap-4 text-sm">
                        <Link
                            href="/forgot-password"
                            onClick={onClose}
                            className="font-semibold text-blue-600 transition-colors hover:text-blue-700"
                        >
                            Forgot password?
                        </Link>

                        <Link
                            href="/register"
                            onClick={onClose}
                            className="font-semibold text-blue-600 transition-colors hover:text-blue-700"
                        >
                            Create account
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
