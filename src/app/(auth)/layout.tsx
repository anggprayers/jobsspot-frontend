import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import Logo from "@/components/common/Logo";

type AuthLayoutProps = Readonly<{
    children: React.ReactNode;
}>;

export default function AuthLayout({
    children,
}: AuthLayoutProps) {
    return (
        <div className="relative min-h-screen overflow-hidden bg-slate-50">
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 top-0 h-96 bg-[radial-gradient(circle_at_top_right,_rgba(37,99,235,0.14),_transparent_55%)]"
            />

            <header className="relative z-20 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
                <div className="mx-auto flex h-17 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                    <Logo
                        priority
                        className="gap-2"
                        imageClassName="size-9 rounded-lg"
                        textClassName="text-xl"
                    />

                    <Link
                        href="/"
                        className="inline-flex min-h-10 items-center gap-2 rounded-xl px-3 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-950 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-100"
                    >
                        <ArrowLeft className="size-4" />

                        <span className="hidden sm:inline">
                            Back to JobsSpot
                        </span>

                        <span className="sm:hidden">
                            Home
                        </span>
                    </Link>
                </div>
            </header>

            <div className="relative z-10">
                {children}
            </div>
        </div>
    );
}
