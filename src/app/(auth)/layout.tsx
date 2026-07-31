import Link from "next/link";
import { ArrowLeft } from "lucide-react";

type AuthLayoutProps = Readonly<{
    children: React.ReactNode;
}>;

export default function AuthLayout({ children }: AuthLayoutProps) {
    return (
        <div className="min-h-screen bg-slate-50">
            <header className="border-b border-slate-200 bg-white">
                <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                    <Link href="/" className="text-lg font-bold tracking-tight text-slate-950">
                        JobsSpot
                    </Link>

                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-slate-950"
                    >
                        <ArrowLeft className="size-4" />
                        Back to JobsSpot
                    </Link>
                </div>
            </header>

            {children}
        </div>
    );
}
