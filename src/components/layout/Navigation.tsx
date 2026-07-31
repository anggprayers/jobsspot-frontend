"use client";

import Link from "next/link";
import { ChevronDown } from "lucide-react";

const navigationLinks = [
    {
        label: "Pricing",
        href: "/#pricing",
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

export default function Navigation() {
    return (
        <nav aria-label="Main navigation">
            <ul className="flex items-center gap-10">
                <li className="group relative">
                    <button
                        type="button"
                        className="flex items-center gap-2 py-8 text-base font-semibold text-slate-700 transition-colors hover:text-blue-600"
                    >
                        How It Works
                        <ChevronDown
                            size={18}
                            className="transition-transform duration-200 group-hover:rotate-180"
                        />
                    </button>

                    <div className="invisible absolute left-1/2 top-full z-50 w-72 -translate-x-1/2 translate-y-3 rounded-2xl border border-slate-200 bg-white p-2.5 opacity-0 shadow-xl shadow-slate-200/60 transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                        <Link
                            href="/#how-it-works-job-seekers"
                            className="block rounded-xl px-4 py-4 transition-colors hover:bg-slate-50"
                        >
                            <span className="block text-base font-semibold text-slate-950">
                                For Job Seekers
                            </span>

                            <span className="mt-1.5 block text-sm leading-6 text-slate-600">
                                Find opportunities and apply with confidence.
                            </span>
                        </Link>

                        <Link
                            href="/#how-it-works-employers"
                            className="block rounded-xl px-4 py-4 transition-colors hover:bg-slate-50"
                        >
                            <span className="block text-base font-semibold text-slate-950">
                                For Employers
                            </span>

                            <span className="mt-1.5 block text-sm leading-6 text-slate-600">
                                Publish jobs and connect with qualified talent.
                            </span>
                        </Link>
                    </div>
                </li>

                {navigationLinks.map((link) => (
                    <li key={link.href}>
                        <Link
                            href={link.href}
                            className="relative py-8 text-base font-semibold text-slate-700 transition-colors after:absolute after:inset-x-0 after:bottom-6 after:h-0.5 after:origin-left after:scale-x-0 after:bg-blue-600 after:transition-transform hover:text-blue-600 hover:after:scale-x-100"
                        >
                            {link.label}
                        </Link>
                    </li>
                ))}
            </ul>
        </nav>
    );
}
