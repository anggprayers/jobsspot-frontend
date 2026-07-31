import Link from "next/link";
import { ArrowRight, Banknote, BriefcaseBusiness, Clock3, MapPin } from "lucide-react";

import type { PublicCompany, PublicCompanyJob } from "../types/publicCompany";

type CompanyJobsProps = Readonly<{
    company: PublicCompany;
}>;

function formatLabel(value: string) {
    return value
        .toLowerCase()
        .split("_")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
}

function formatSalary(job: PublicCompanyJob) {
    const salaryMin = job.salaryMin !== null ? Number(job.salaryMin) : null;

    const salaryMax = job.salaryMax !== null ? Number(job.salaryMax) : null;

    if (salaryMin === null && salaryMax === null) {
        return "Salary not specified";
    }

    const formatter = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: job.salaryCurrency ?? "USD",
        maximumFractionDigits: 0,
    });

    let salary: string;

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

function formatPublishedDate(value: string | null) {
    if (!value) {
        return "Recently posted";
    }

    const publishedDate = new Date(value);

    if (Number.isNaN(publishedDate.getTime())) {
        return "Recently posted";
    }

    const differenceInMilliseconds = Date.now() - publishedDate.getTime();

    const differenceInDays = Math.max(
        0,
        Math.floor(differenceInMilliseconds / (1000 * 60 * 60 * 24)),
    );

    if (differenceInDays === 0) {
        return "Posted today";
    }

    if (differenceInDays === 1) {
        return "Posted yesterday";
    }

    if (differenceInDays < 30) {
        return `Posted ${differenceInDays} days ago`;
    }

    return `Posted ${publishedDate.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    })}`;
}

function CompanyJobCard({
    job,
}: Readonly<{
    job: PublicCompanyJob;
}>) {
    return (
        <article className="group rounded-2xl border border-slate-200 bg-white p-6 transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md sm:p-7">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0 flex-1">
                    <p className="text-base font-semibold text-blue-600">{job.category.name}</p>

                    <Link href={`/jobs/${job.slug}`} className="mt-2 block">
                        <h3 className="text-2xl font-bold leading-tight tracking-tight text-slate-950 transition-colors group-hover:text-blue-600">
                            {job.title}
                        </h3>
                    </Link>

                    <div className="mt-5 flex flex-wrap gap-x-6 gap-y-4 text-base text-slate-600">
                        <span className="inline-flex items-center gap-2">
                            <MapPin size={18} className="shrink-0 text-slate-400" />

                            {job.location ?? "Location not specified"}
                        </span>

                        <span className="inline-flex items-center gap-2">
                            <BriefcaseBusiness size={18} className="shrink-0 text-slate-400" />

                            {formatLabel(job.employmentType)}
                        </span>

                        <span className="inline-flex items-center gap-2">
                            <Banknote size={18} className="shrink-0 text-slate-400" />

                            {formatSalary(job)}
                        </span>

                        <span className="inline-flex items-center gap-2">
                            <Clock3 size={18} className="shrink-0 text-slate-400" />

                            {formatPublishedDate(job.publishedAt)}
                        </span>
                    </div>

                    <div className="mt-5 flex flex-wrap gap-2.5">
                        <span className="rounded-full border border-blue-100 bg-blue-50 px-3.5 py-1.5 text-sm font-semibold text-blue-700">
                            {formatLabel(job.workplaceType)}
                        </span>

                        <span className="rounded-full border border-slate-200 bg-slate-50 px-3.5 py-1.5 text-sm font-semibold text-slate-700">
                            {formatLabel(job.experienceLevel)}
                        </span>
                    </div>
                </div>

                <Link
                    href={`/jobs/${job.slug}`}
                    className="inline-flex min-h-12 shrink-0 items-center gap-2 self-start rounded-xl border border-slate-300 bg-white px-5 py-3 text-base font-semibold text-slate-800 shadow-sm transition-all hover:-translate-y-0.5 hover:border-blue-600 hover:bg-blue-600 hover:text-white hover:shadow-md"
                >
                    View Job
                    <ArrowRight size={18} />
                </Link>
            </div>
        </article>
    );
}

export default function CompanyJobs({ company }: CompanyJobsProps) {
    return (
        <section className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm sm:p-9">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
                        Careers
                    </p>

                    <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
                        Open Positions
                    </h2>

                    <p className="mt-3 text-lg leading-8 text-slate-600">
                        Explore currently available roles at {company.name}.
                    </p>
                </div>

                <p className="shrink-0 text-base font-semibold text-slate-500">
                    {company.openJobsCount} {company.openJobsCount === 1 ? "position" : "positions"}
                </p>
            </div>

            {company.jobs.length > 0 ? (
                <div className="mt-8 space-y-5">
                    {company.jobs.map((job) => (
                        <CompanyJobCard key={job.id} job={job} />
                    ))}
                </div>
            ) : (
                <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-7 py-14 text-center">
                    <BriefcaseBusiness size={42} className="mx-auto text-slate-400" />

                    <h3 className="mt-5 text-2xl font-bold text-slate-900">No open positions</h3>

                    <p className="mx-auto mt-3 max-w-md text-base leading-7 text-slate-600">
                        This company does not currently have any published job openings.
                    </p>

                    <Link
                        href="/jobs"
                        className="mt-6 inline-flex min-h-12 items-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3 text-base font-semibold text-blue-600 shadow-sm transition-all hover:-translate-y-0.5 hover:border-blue-300 hover:bg-blue-50"
                    >
                        Browse other jobs
                        <ArrowRight size={18} />
                    </Link>
                </div>
            )}
        </section>
    );
}
