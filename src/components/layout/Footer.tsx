import Link from "next/link";

import Logo from "@/components/common/Logo";

import Container from "./Container";

const jobSeekerLinks = [
    {
        label: "Find Jobs",
        href: "/jobs",
    },
    {
        label: "Browse Categories",
        href: "/categories",
    },
    {
        label: "Create Account",
        href: "/register",
    },
    {
        label: "Saved Jobs",
        href: "/account/saved-jobs",
    },
] as const;

const employerLinks = [
    {
        label: "Hire Talent",
        href: "/employers",
    },
    {
        label: "Pricing",
        href: "/#pricing",
    },
    {
        label: "Employer Dashboard",
        href: "/employers",
    },
] as const;

const companyLinks = [
    {
        label: "About",
        href: "/about",
    },
    {
        label: "Contact",
        href: "/#contact",
    },
    {
        label: "Community",
        href: "/#community",
    },
    {
        label: "Privacy Policy",
        href: "/privacy",
    },
    {
        label: "Terms & Conditions",
        href: "/terms",
    },
] as const;

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="border-t border-slate-800 bg-slate-950 text-slate-300">
            <Container className="py-20 sm:py-24">
                <div className="grid gap-14 md:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr] lg:gap-20">
                    <div>
                        <Logo textClassName="text-white" />

                        <p className="mt-7 max-w-lg text-base leading-8 text-slate-400">
                            Connecting talented professionals with companies looking for their next
                            great hire. Whether you&apos;re searching for your dream job or building
                            your team, JobsSpot helps you get there faster.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-base font-bold uppercase tracking-[0.12em] text-white">
                            Job Seekers
                        </h2>

                        <ul className="mt-7 space-y-4">
                            {jobSeekerLinks.map((link) => (
                                <li key={`${link.label}-${link.href}`}>
                                    <Link
                                        href={link.href}
                                        className="inline-block text-base leading-7 text-slate-400 decoration-blue-400 decoration-2 underline-offset-4 transition-colors hover:text-blue-300 hover:underline focus-visible:rounded-sm focus-visible:text-blue-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/70"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h2 className="text-base font-bold uppercase tracking-[0.12em] text-white">
                            Employers
                        </h2>

                        <ul className="mt-7 space-y-4">
                            {employerLinks.map((link) => (
                                <li key={`${link.label}-${link.href}`}>
                                    <Link
                                        href={link.href}
                                        className="inline-block text-base leading-7 text-slate-400 decoration-blue-400 decoration-2 underline-offset-4 transition-colors hover:text-blue-300 hover:underline focus-visible:rounded-sm focus-visible:text-blue-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/70"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h2 className="text-base font-bold uppercase tracking-[0.12em] text-white">
                            Company
                        </h2>

                        <ul className="mt-7 space-y-4">
                            {companyLinks.map((link) => (
                                <li key={`${link.label}-${link.href}`}>
                                    <Link
                                        href={link.href}
                                        className="inline-block text-base leading-7 text-slate-400 decoration-blue-400 decoration-2 underline-offset-4 transition-colors hover:text-blue-300 hover:underline focus-visible:rounded-sm focus-visible:text-blue-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/70"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="mt-20 border-t border-slate-800 pt-9">
                    <p className="text-center text-base tracking-wide text-slate-500">
                        © {currentYear} JobsSpot. All rights reserved.
                    </p>
                </div>
            </Container>
        </footer>
    );
}
