"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import {
    ArrowLeft,
    BriefcaseBusiness,
    CalendarDays,
    CircleDollarSign,
    Clock3,
    ExternalLink,
    MapPin,
    Monitor,
    ShieldAlert,
    UserRound,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/features/auth/hooks/useAuth";

import { useCompanyJob } from "../hooks/useCompanyJob";
import type { CompanyJob } from "../types/companyJob";
import {
    formatEmploymentType,
    formatJobDate,
    formatJobExpiration,
    formatJobStatus,
    formatWorkplaceType,
    getJobStatusBadgeClasses,
} from "../utils/jobFormatters";

function formatExperienceLevel(experienceLevel: CompanyJob["experienceLevel"]): string {
    const labels: Record<CompanyJob["experienceLevel"], string> = {
        ENTRY_LEVEL: "Entry level",
        JUNIOR: "Junior",
        MID_LEVEL: "Mid-level",
        SENIOR: "Senior",
        LEAD: "Lead",
        EXECUTIVE: "Executive",
    };

    return labels[experienceLevel];
}

function formatSalaryPeriod(period: CompanyJob["salaryPeriod"]): string {
    if (!period) {
        return "";
    }

    const labels: Record<NonNullable<CompanyJob["salaryPeriod"]>, string> = {
        HOURLY: "hour",
        DAILY: "day",
        WEEKLY: "week",
        MONTHLY: "month",
        YEARLY: "year",
    };

    return labels[period];
}

function formatSalary(job: CompanyJob): string {
    if (!job.salaryMin && !job.salaryMax) {
        return "Not specified";
    }

    const currency = job.salaryCurrency ?? "USD";

    const formatter = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency,
        maximumFractionDigits: 0,
    });

    const minimum = job.salaryMin ? formatter.format(Number(job.salaryMin)) : null;

    const maximum = job.salaryMax ? formatter.format(Number(job.salaryMax)) : null;

    let salary = "";

    if (minimum && maximum) {
        salary = `${minimum} – ${maximum}`;
    } else if (minimum) {
        salary = `From ${minimum}`;
    } else if (maximum) {
        salary = `Up to ${maximum}`;
    }

    const period = formatSalaryPeriod(job.salaryPeriod);

    return period ? `${salary} per ${period}` : salary;
}

function parseList(value: string | null): string[] {
    if (!value) {
        return [];
    }

    return value
        .split(/\r?\n/)
        .map((line) => line.replace(/^[•*-]\s*/, "").trim())
        .filter(Boolean);
}

export default function EmployerJobDetailsPage() {
    const params = useParams<{ jobId: string }>();

    const { activeCompanyId } = useAuth();

    const companyId = activeCompanyId ?? "";
    const jobId = params.jobId;

    const { data, isLoading, isError, error } = useCompanyJob({
        companyId,
        jobId,
    });

    if (isLoading) {
        return (
            <div className="mx-auto w-full max-w-6xl">
                <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-slate-600">
                    Loading job details...
                </div>
            </div>
        );
    }

    if (isError || !data?.job) {
        return (
            <div className="mx-auto w-full max-w-6xl space-y-5">
                <Button variant="outline" asChild>
                    <Link href="/employers/jobs">
                        <ArrowLeft />
                        Back to jobs
                    </Link>
                </Button>

                <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center text-red-700">
                    {error instanceof Error ? error.message : "Unable to load this job."}
                </div>
            </div>
        );
    }

    const job = data.job;

    const responsibilities = parseList(job.responsibilities);

    const requirements = parseList(job.requirements);

    return (
        <div className="mx-auto w-full max-w-6xl space-y-6">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <Button variant="outline" size="sm" asChild>
                    <Link href="/employers/jobs">
                        <ArrowLeft />
                        Back to jobs
                    </Link>
                </Button>

                {job.status === "PUBLISHED" &&
                    !job.isExpired &&
                    !job.adminHiddenAt && (
                    <Button variant="outline" size="sm" asChild>
                        <Link href={`/jobs/${job.slug}`} target="_blank" rel="noreferrer">
                            <ExternalLink />
                            Open public listing
                        </Link>
                    </Button>
                )}
            </div>

            {job.adminHiddenAt && (
                <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-red-800">
                    <div className="flex gap-3">
                        <ShieldAlert className="mt-0.5 size-5 shrink-0" />
                        <div>
                            <p className="font-semibold">This posting is hidden by JobsSpot</p>
                            <p className="mt-1 text-sm leading-6">
                                It is not visible in public job search while this moderation hold is active.
                                Editing the job or changing its employer status does not remove the hold.
                            </p>
                            {job.adminHiddenReason && (
                                <div className="mt-3 rounded-xl border border-red-200 bg-white/70 p-3 text-sm">
                                    <span className="font-semibold">Reason: </span>{job.adminHiddenReason}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-start">
                    <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-3">
                            <span
                                className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${getJobStatusBadgeClasses(
                                    job,
                                )}`}
                            >
                                {formatJobStatus(job)}
                            </span>

                            <span className="text-sm font-medium text-blue-600">
                                {job.category.name}
                            </span>
                        </div>

                        <h1 className="mt-4 wrap-break-word text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                            {job.title}
                        </h1>

                        <p className="mt-3 text-sm text-slate-500">
                            Created by{" "}
                            <span className="font-medium text-slate-700">
                                {job.createdBy.firstName} {job.createdBy.lastName}
                            </span>
                            {" · "}
                            Updated {formatJobDate(job.updatedAt)}
                        </p>
                    </div>
                </div>

                <dl className="mt-8 grid gap-4 border-t border-slate-200 pt-6 sm:grid-cols-2 xl:grid-cols-4">
                    <div className="rounded-xl bg-slate-50 p-4">
                        <dt className="flex items-center gap-2 text-sm font-medium text-slate-500">
                            <BriefcaseBusiness className="size-4" />
                            Employment
                        </dt>

                        <dd className="mt-2 font-semibold text-slate-900">
                            {formatEmploymentType(job.employmentType)}
                        </dd>
                    </div>

                    <div className="rounded-xl bg-slate-50 p-4">
                        <dt className="flex items-center gap-2 text-sm font-medium text-slate-500">
                            <Monitor className="size-4" />
                            Workplace
                        </dt>

                        <dd className="mt-2 font-semibold text-slate-900">
                            {formatWorkplaceType(job.workplaceType)}
                        </dd>
                    </div>

                    <div className="rounded-xl bg-slate-50 p-4">
                        <dt className="flex items-center gap-2 text-sm font-medium text-slate-500">
                            <UserRound className="size-4" />
                            Experience
                        </dt>

                        <dd className="mt-2 font-semibold text-slate-900">
                            {formatExperienceLevel(job.experienceLevel)}
                        </dd>
                    </div>

                    <div className="rounded-xl bg-slate-50 p-4">
                        <dt className="flex items-center gap-2 text-sm font-medium text-slate-500">
                            <MapPin className="size-4" />
                            Location
                        </dt>

                        <dd className="mt-2 font-semibold text-slate-900">
                            {job.location ?? "Not specified"}
                        </dd>
                    </div>

                    <div className="rounded-xl bg-slate-50 p-4 sm:col-span-2">
                        <dt className="flex items-center gap-2 text-sm font-medium text-slate-500">
                            <CircleDollarSign className="size-4" />
                            Salary
                        </dt>

                        <dd className="mt-2 font-semibold text-slate-900">{formatSalary(job)}</dd>
                    </div>

                    <div className="rounded-xl bg-slate-50 p-4">
                        <dt className="flex items-center gap-2 text-sm font-medium text-slate-500">
                            <CalendarDays className="size-4" />
                            Application deadline
                        </dt>

                        <dd className="mt-2 font-semibold text-slate-900">
                            {job.applicationDeadline
                                ? formatJobDate(job.applicationDeadline)
                                : "No deadline"}
                        </dd>
                    </div>

                    <div
                        className={`rounded-xl p-4 ${
                            job.isExpired
                                ? "bg-red-50"
                                : "bg-slate-50"
                        }`}
                    >
                        <dt
                            className={`flex items-center gap-2 text-sm font-medium ${
                                job.isExpired
                                    ? "text-red-600"
                                    : "text-slate-500"
                            }`}
                        >
                            <Clock3 className="size-4" />
                            Posting expiration
                        </dt>

                        <dd
                            className={`mt-2 font-semibold ${
                                job.isExpired
                                    ? "text-red-700"
                                    : "text-slate-900"
                            }`}
                        >
                            {formatJobExpiration(job).dateLabel}
                        </dd>

                        {formatJobExpiration(job)
                            .detailLabel && (
                            <p
                                className={`mt-1 text-sm ${
                                    job.isExpired
                                        ? "font-semibold text-red-600"
                                        : "text-slate-500"
                                }`}
                            >
                                {
                                    formatJobExpiration(job)
                                        .detailLabel
                                }
                            </p>
                        )}
                    </div>
                </dl>
            </section>

            <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
                <Card>
                    <CardHeader>
                        <CardTitle>Job description</CardTitle>

                        <CardDescription>Overview and purpose of this position.</CardDescription>
                    </CardHeader>

                    <CardContent>
                        <div className="whitespace-pre-line text-sm leading-7 text-slate-700 sm:text-base">
                            {job.description}
                        </div>
                    </CardContent>
                </Card>

                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Responsibilities</CardTitle>

                            <CardDescription>
                                Main duties associated with this position.
                            </CardDescription>
                        </CardHeader>

                        <CardContent>
                            {responsibilities.length > 0 ? (
                                <ul className="space-y-3">
                                    {responsibilities.map((responsibility, index) => (
                                        <li
                                            key={`${responsibility}-${index}`}
                                            className="flex gap-3 text-sm leading-6 text-slate-700"
                                        >
                                            <span
                                                className="mt-2 size-1.5 shrink-0 rounded-full bg-blue-600"
                                                aria-hidden="true"
                                            />

                                            <span>{responsibility}</span>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-sm text-slate-500">
                                    No responsibilities were provided.
                                </p>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Requirements</CardTitle>

                            <CardDescription>
                                Skills and qualifications expected from applicants.
                            </CardDescription>
                        </CardHeader>

                        <CardContent>
                            {requirements.length > 0 ? (
                                <ul className="space-y-3">
                                    {requirements.map((requirement, index) => (
                                        <li
                                            key={`${requirement}-${index}`}
                                            className="flex gap-3 text-sm leading-6 text-slate-700"
                                        >
                                            <span
                                                className="mt-2 size-1.5 shrink-0 rounded-full bg-blue-600"
                                                aria-hidden="true"
                                            />

                                            <span>{requirement}</span>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-sm text-slate-500">
                                    No requirements were provided.
                                </p>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
