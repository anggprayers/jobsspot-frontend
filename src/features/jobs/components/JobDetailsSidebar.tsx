"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
    Banknote,
    Bookmark,
    BriefcaseBusiness,
    Building2,
    MapPin,
    Send,
    Sparkles,
} from "lucide-react";

import SignInModal from "@/features/auth/components/SignInModal";

import type { PublicJobDetails } from "../types/publicJobDetails";
import ReportJobButton from "./ReportJobButton";
import ShareJobButton from "./ShareJobButton";

type JobDetailsSidebarProps = Readonly<{
    job: PublicJobDetails;
}>;

function formatLabel(value: string) {
    return value
        .toLowerCase()
        .split("_")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
}

function formatSalary(job: PublicJobDetails) {
    const salaryMin = job.salaryMin ? Number(job.salaryMin) : null;
    const salaryMax = job.salaryMax ? Number(job.salaryMax) : null;

    if (salaryMin === null && salaryMax === null) {
        return "Not specified";
    }

    const formatter = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: job.salaryCurrency ?? "USD",
        maximumFractionDigits: 0,
    });

    let salary = "";

    if (salaryMin !== null && salaryMax !== null) {
        salary = `${formatter.format(salaryMin)} – ${formatter.format(salaryMax)}`;
    } else if (salaryMin !== null) {
        salary = `From ${formatter.format(salaryMin)}`;
    } else {
        salary = `Up to ${formatter.format(salaryMax ?? 0)}`;
    }

    if (!job.salaryPeriod) {
        return salary;
    }

    return `${salary} / ${formatLabel(job.salaryPeriod).toLowerCase()}`;
}

function getCompanyInitials(companyName: string) {
    const words = companyName.trim().split(/\s+/).filter(Boolean);

    if (words.length === 0) {
        return "CO";
    }

    if (words.length === 1) {
        return words[0].slice(0, 2).toUpperCase();
    }

    return words
        .slice(0, 2)
        .map((word) => word.charAt(0))
        .join("")
        .toUpperCase();
}

export default function JobDetailsSidebar({ job }: JobDetailsSidebarProps) {
    const [isSignInOpen, setIsSignInOpen] = useState(false);

    const overviewItems = [
        {
            label: "Location",
            value: job.location,
            icon: MapPin,
        },
        {
            label: "Salary",
            value: formatSalary(job),
            icon: Banknote,
        },
        {
            label: "Employment",
            value: formatLabel(job.employmentType),
            icon: BriefcaseBusiness,
        },
        {
            label: "Workplace",
            value: formatLabel(job.workplaceType),
            icon: Building2,
        },
        {
            label: "Experience",
            value: formatLabel(job.experienceLevel),
            icon: Sparkles,
        },
    ];

    return (
        <>
            <aside className="space-y-6 lg:sticky lg:top-28">
                <section className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
                    <h2 className="text-2xl font-bold text-slate-950">Job Overview</h2>

                    <dl className="mt-7 space-y-6">
                        {overviewItems.map((item) => {
                            const Icon = item.icon;

                            return (
                                <div key={item.label} className="flex items-start gap-4">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                                        <Icon size={20} />
                                    </div>

                                    <div className="min-w-0">
                                        <dt className="text-base font-medium text-slate-500">
                                            {item.label}
                                        </dt>

                                        <dd className="mt-1 text-lg font-semibold leading-7 text-slate-900">
                                            {item.value}
                                        </dd>
                                    </div>
                                </div>
                            );
                        })}
                    </dl>
                </section>

                <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                    <button
                        type="button"
                        onClick={() => setIsSignInOpen(true)}
                        className="inline-flex min-h-13 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-base font-semibold text-white shadow-sm shadow-blue-600/20 transition-all hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-md"
                    >
                        <Send size={19} />
                        Apply Now
                    </button>

                    <button
                        type="button"
                        onClick={() => setIsSignInOpen(true)}
                        className="mt-3 inline-flex min-h-13 w-full items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-3.5 text-base font-semibold text-slate-800 shadow-sm transition-all hover:-translate-y-0.5 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
                    >
                        <Bookmark size={19} />
                        Save Job
                    </button>

                    <p className="mt-5 text-center text-base leading-7 text-slate-500">
                        Sign in to apply, save this role, and track your application.
                    </p>
                </section>

                <section className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
                    <p className="text-sm font-bold uppercase tracking-[0.16em] text-blue-600">
                        Company
                    </p>

                    <Link
                        href={`/companies/${job.company.slug}`}
                        className="group mt-5 flex items-center gap-4"
                    >
                        <div className="relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-blue-100 bg-blue-50 font-bold text-blue-600 shadow-sm">
                            {job.company.logoUrl ? (
                                <Image
                                    src={job.company.logoUrl}
                                    alt={`${job.company.name} logo`}
                                    fill
                                    sizes="56px"
                                    className="object-cover"
                                />
                            ) : (
                                getCompanyInitials(job.company.name)
                            )}
                        </div>

                        <div className="min-w-0">
                            <h2 className="truncate text-lg font-bold text-slate-950 transition-colors group-hover:text-blue-600">
                                {job.company.name}
                            </h2>

                            <p className="mt-1 text-base text-slate-500">Employer on JobsSpot</p>
                        </div>
                    </Link>

                    <p className="mt-5 text-base leading-7 text-slate-600">
                        View employer information and other available positions from this company.
                    </p>

                    <Link
                        href={`/companies/${job.company.slug}`}
                        className="mt-6 inline-flex min-h-12 w-full items-center justify-center rounded-xl border border-slate-300 bg-white px-5 py-3 text-base font-semibold text-slate-700 shadow-sm transition-all hover:-translate-y-0.5 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
                    >
                        View Company
                    </Link>
                </section>

                <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                    <ShareJobButton jobTitle={job.title} />

                    <div className="mt-4 flex justify-center border-t border-slate-100 pt-5">
                        <ReportJobButton jobId={job.id} jobTitle={job.title} />
                    </div>
                </section>
            </aside>

            <SignInModal isOpen={isSignInOpen} onClose={() => setIsSignInOpen(false)} />
        </>
    );
}
