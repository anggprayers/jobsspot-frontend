"use client";

import Link from "next/link";

const navigationLinks = [
    {
        label: "Find Jobs",
        href: "/jobs",
    },
    {
        label: "How It Works",
        href: "/#how-it-works",
    },
    {
        label: "Community",
        href: "/#community",
    },
    {
        label: "Contact",
        href: "/#contact",
    },
] as const;

type NavigationProps = Readonly<{
    variant?: "desktop" | "mobile";
    onNavigate?: () => void;
}>;

export default function Navigation({ variant = "desktop", onNavigate }: NavigationProps) {
    if (variant === "mobile") {
        return (
            <nav aria-label="Mobile navigation">
                <div className="space-y-1">
                    {navigationLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            onClick={onNavigate}
                            className="flex min-h-12 items-center rounded-xl px-3 py-3 font-semibold text-slate-700 transition-colors hover:bg-slate-50 hover:text-blue-600"
                        >
                            {link.label}
                        </Link>
                    ))}
                </div>
            </nav>
        );
    }

    return (
        <nav aria-label="Main navigation">
            <ul className="flex items-center gap-7 xl:gap-9">
                {navigationLinks.map((link) => (
                    <li key={link.href}>
                        <Link
                            href={link.href}
                            className="relative py-8 text-base font-semibold text-slate-700 transition-colors after:absolute after:inset-x-0 after:bottom-6 after:h-0.5 after:origin-left after:scale-x-0 after:bg-blue-600 after:transition-transform hover:text-blue-600 hover:after:scale-x-100 focus-visible:outline-none focus-visible:text-blue-600 focus-visible:after:scale-x-100"
                        >
                            {link.label}
                        </Link>
                    </li>
                ))}
            </ul>
        </nav>
    );
}
