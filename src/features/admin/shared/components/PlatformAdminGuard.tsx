"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ShieldAlert } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/features/auth/hooks/useAuth";

type PlatformAdminGuardProps = Readonly<{
    children: React.ReactNode;
}>;

export default function PlatformAdminGuard({ children }: PlatformAdminGuardProps) {
    const router = useRouter();
    const pathname = usePathname();
    const { user, isAuthenticated, isInitializing } = useAuth();

    useEffect(() => {
        if (isInitializing || isAuthenticated) {
            return;
        }

        router.replace(`/login?returnUrl=${encodeURIComponent(pathname)}`);
    }, [isAuthenticated, isInitializing, pathname, router]);

    if (isInitializing) {
        return (
            <div
                className="flex min-h-screen items-center justify-center bg-background"
                role="status"
            >
                <div className="size-10 animate-spin rounded-full border-4 border-muted border-t-primary" />
            </div>
        );
    }

    if (!isAuthenticated) {
        return null;
    }

    if (!user?.isAdmin) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-linear-to-br from-background via-background to-primary/5 px-4 py-12">
                <section className="w-full max-w-lg rounded-2xl border bg-card p-8 text-center shadow-sm">
                    <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
                        <ShieldAlert className="size-7" />
                    </div>

                    <p className="mt-6 text-sm font-semibold text-primary">Restricted area</p>

                    <h1 className="mt-3 text-3xl font-bold tracking-tight text-foreground">
                        Platform administrator access is required
                    </h1>

                    <p className="mt-4 leading-7 text-muted-foreground">
                        Your JobsSpot account is signed in, but it is not authorized to access the
                        platform administration workspace.
                    </p>

                    <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                        <Button asChild>
                            <Link href="/">Back to JobsSpot</Link>
                        </Button>

                        <Button asChild variant="outline">
                            <Link href="/account/profile">My account</Link>
                        </Button>
                    </div>
                </section>
            </main>
        );
    }

    return children;
}
