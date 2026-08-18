import Image from "next/image";
import Link from "next/link";
import { BriefcaseBusiness, Building2, CalendarClock, Clock3, MapPin } from "lucide-react";

import type { PublicJobDetails } from "../types/publicJobDetails";

type JobDetailsHeaderProps = Readonly<{
    job: PublicJobDetails;
}>;

function formatLabel(value: string) {
    return value
        .toLowerCase()
        .split("_")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
}

function formatDate(value: string | null, fallback: string) {
    if (!value) {
        return fallback;
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return fallback;
    }

    return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        timeZone: "UTC",
    });
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

export default function JobDetailsHeader({ job }: JobDetailsHeaderProps) {
    const companyUrl = `/companies/${job.company.slug}`;

    return (
        <header className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm sm:p-10">
            <div className="flex flex-col gap-7 sm:flex-row sm:items-start">
                <Link
                    href={companyUrl}
                    aria-label={`View ${job.company.name} company profile`}
                    className="relative flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-blue-100 bg-blue-50 text-2xl font-bold text-blue-600 shadow-sm transition-all hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200"
                >
                    {job.company.logoUrl ? (
                        <Image
                            src={job.company.logoUrl}
                            alt={`${job.company.name} logo`}
                            fill
                            sizes="80px"
                            className="object-cover"
                        />
                    ) : (
                        getCompanyInitials(job.company.name)
                    )}
                </Link>

                <div className="min-w-0 flex-1">
                    <h1 className="text-4xl font-bold leading-tight tracking-tight text-slate-950 sm:text-5xl">
                        {job.title}
                    </h1>

                    <Link
                        href={companyUrl}
                        className="mt-5 inline-flex max-w-full items-center gap-2.5 text-xl font-semibold text-slate-700 transition-colors hover:text-blue-600"
                    >
                        <Building2 size={21} className="shrink-0 text-slate-400" />

                        <span className="truncate">{job.company.name}</span>
                    </Link>

                    <div className="mt-7 flex flex-wrap gap-x-8 gap-y-4 text-lg text-slate-600">
                        <span className="inline-flex items-center gap-2.5">
                            <MapPin size={19} className="shrink-0 text-slate-400" />
                            {job.location ?? "Location not specified"}
                        </span>

                        <span className="inline-flex items-center gap-2.5">
                            <BriefcaseBusiness size={19} className="shrink-0 text-slate-400" />
                            {formatLabel(job.employmentType)}
                        </span>

                        <span className="inline-flex items-center gap-2.5">
                            <Clock3 size={19} className="shrink-0 text-slate-400" />
                            Posted {formatDate(job.publishedAt, "recently")}
                        </span>

                        {job.applicationDeadline && (
                            <span className="inline-flex items-center gap-2.5 font-medium text-slate-700">
                                <CalendarClock size={19} className="shrink-0 text-blue-500" />
                                Apply by {formatDate(job.applicationDeadline, "the listed deadline")}
                            </span>
                        )}
                    </div>

                    <div className="mt-7 flex flex-wrap gap-2.5">
                        <span className="rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-base font-semibold text-blue-700">
                            {formatLabel(job.workplaceType)}
                        </span>

                        <span className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-base font-semibold text-slate-700">
                            {formatLabel(job.employmentType)}
                        </span>

                        <span className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-base font-semibold text-slate-700">
                            {formatLabel(job.experienceLevel)}
                        </span>
                    </div>
                </div>
            </div>
        </header>
    );
}
