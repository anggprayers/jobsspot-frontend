"use client";

import { useEffect } from "react";
import {
    usePathname,
    useRouter,
} from "next/navigation";

import { useAuth } from "@/features/auth/hooks/useAuth";

type EmployerOnboardingGuardProps =
    Readonly<{
        children: React.ReactNode;
    }>;

export default function EmployerOnboardingGuard({
    children,
}: EmployerOnboardingGuardProps) {
    const pathname = usePathname();
    const router = useRouter();

    const {
        isInitializing,
        isAuthenticated,
        isEmployer,
    } = useAuth();

    useEffect(() => {
        if (isInitializing) {
            return;
        }

        if (!isAuthenticated) {
            const returnUrl =
                encodeURIComponent(pathname);

            router.replace(
                `/login?returnUrl=${returnUrl}`,
            );

            return;
        }

        if (isEmployer) {
            router.replace("/employers");
        }
    }, [
        isAuthenticated,
        isEmployer,
        isInitializing,
        pathname,
        router,
    ]);

    if (isInitializing) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-50">
                <div className="text-center">
                    <div className="mx-auto size-9 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />

                    <p className="mt-4 text-sm font-medium text-slate-600">
                        Preparing employer setup...
                    </p>
                </div>
            </div>
        );
    }

    if (
        !isAuthenticated ||
        isEmployer
    ) {
        return null;
    }

    return children;
}
