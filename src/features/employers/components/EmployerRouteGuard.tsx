"use client";

import { useEffect } from "react";
import {
    usePathname,
    useRouter,
} from "next/navigation";

import { useAuth } from "@/features/auth/hooks/useAuth";

type EmployerRouteGuardProps = Readonly<{
    children: React.ReactNode;
}>;

export default function EmployerRouteGuard({
    children,
}: EmployerRouteGuardProps) {
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

        if (!isEmployer) {
            router.replace(
                "/employers/get-started",
            );
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
            <div className="flex min-h-screen items-center justify-center bg-background">
                <div className="text-center">
                    <div className="mx-auto size-8 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />

                    <p className="mt-4 text-sm text-muted-foreground">
                        Loading employer workspace...
                    </p>
                </div>
            </div>
        );
    }

    if (
        !isAuthenticated ||
        !isEmployer
    ) {
        return null;
    }

    return children;
}
