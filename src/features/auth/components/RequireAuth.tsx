"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

import { useAuthStore } from "../store/authStore";

type RequireAuthProps = Readonly<{
    children: React.ReactNode;
}>;

export default function RequireAuth({ children }: RequireAuthProps) {
    const router = useRouter();
    const pathname = usePathname();

    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const isInitializing = useAuthStore((state) => state.isInitializing);

    useEffect(() => {
        if (isInitializing || isAuthenticated) {
            return;
        }

        const returnUrl = encodeURIComponent(pathname);

        router.replace(`/login?returnUrl=${returnUrl}`);
    }, [isAuthenticated, isInitializing, pathname, router]);

    if (isInitializing) {
        return (
            <div
                className="flex min-h-screen items-center justify-center bg-slate-50"
                role="status"
                aria-label="Loading"
            >
                <div className="size-9 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />
            </div>
        );
    }

    if (!isAuthenticated) {
        return null;
    }

    return children;
}
