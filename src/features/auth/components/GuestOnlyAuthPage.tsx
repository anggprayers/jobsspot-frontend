"use client";

import { useRouter } from "next/navigation";
import {
    useEffect,
    type ReactNode,
} from "react";

import { useAuth } from "../hooks/useAuth";

type GuestOnlyAuthPageProps = Readonly<{
    children: ReactNode;
    redirectTo?: string;
}>;

export default function GuestOnlyAuthPage({
    children,
    redirectTo = "/jobs",
}: GuestOnlyAuthPageProps) {
    const router = useRouter();

    const {
        isAuthenticated,
        isInitializing,
    } = useAuth();

    useEffect(() => {
        if (
            !isInitializing &&
            isAuthenticated
        ) {
            router.replace(redirectTo);
        }
    }, [
        isAuthenticated,
        isInitializing,
        redirectTo,
        router,
    ]);

    if (
        isInitializing ||
        isAuthenticated
    ) {
        return (
            <main className="flex min-h-[calc(100vh-4.25rem)] items-center bg-slate-100 px-4 py-8 sm:px-6 lg:px-8">
                <div className="mx-auto grid min-h-[650px] w-full max-w-6xl overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-2xl shadow-slate-300/45 lg:grid-cols-[0.92fr_1.08fr]">
                    <div className="hidden animate-pulse bg-slate-950 px-12 py-14 lg:block">
                        <div className="h-9 w-52 rounded-full bg-slate-800" />

                        <div className="mt-9 h-12 w-full max-w-md rounded-xl bg-slate-800" />
                        <div className="mt-4 h-12 w-4/5 rounded-xl bg-slate-800" />

                        <div className="mt-11 space-y-6">
                            {Array.from({
                                length: 3,
                            }).map((_, index) => (
                                <div
                                    key={index}
                                    className="flex gap-4"
                                >
                                    <div className="size-10 rounded-2xl bg-slate-800" />

                                    <div className="flex-1">
                                        <div className="h-4 w-48 rounded bg-slate-800" />
                                        <div className="mt-3 h-3 w-full rounded bg-slate-900" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex items-center justify-center px-5 py-9 sm:px-10 lg:px-14">
                        <div className="w-full max-w-md animate-pulse">
                            <div className="h-4 w-28 rounded bg-blue-100" />
                            <div className="mt-4 h-10 w-72 rounded bg-slate-200" />
                            <div className="mt-4 h-5 w-full rounded bg-slate-100" />

                            <div className="mt-9 h-12 rounded-xl bg-slate-100" />
                            <div className="mt-4 h-12 rounded-xl bg-slate-100" />
                            <div className="mt-6 h-12 rounded-xl bg-blue-100" />
                        </div>
                    </div>
                </div>
            </main>
        );
    }

    return children;
}
