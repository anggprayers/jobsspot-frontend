import type { CompanyJob } from "../types/companyJob";

import {
    formatEmploymentType,
    formatJobDate,
    formatJobExpiration,
    formatJobStatus,
    formatWorkplaceType,
    getJobStatusBadgeClasses,
} from "../utils/jobFormatters";

import EmployerJobActions from "./EmployerJobActions";

type JobCategoryOption = {
    id: string;
    name: string;
};

type EmployerJobsTableProps = {
    jobs: CompanyJob[];
    companyId: string;
    categories: JobCategoryOption[];
};

function JobStatusBadge({
    job,
}: {
    job: CompanyJob;
}) {
    return (
        <span
            className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${getJobStatusBadgeClasses(
                job,
            )}`}
        >
            {formatJobStatus(job)}
        </span>
    );
}

function JobExpiration({
    job,
}: {
    job: CompanyJob;
}) {
    const expiration = formatJobExpiration(job);

    return (
        <div>
            <div
                className={
                    job.isExpired
                        ? "font-semibold text-red-700"
                        : "font-medium text-slate-800"
                }
            >
                {expiration.dateLabel}
            </div>

            {expiration.detailLabel && (
                <div
                    className={`mt-1 text-xs ${
                        job.isExpired
                            ? "font-semibold text-red-600"
                            : "text-slate-500"
                    }`}
                >
                    {expiration.detailLabel}
                </div>
            )}
        </div>
    );
}

export default function EmployerJobsTable({ jobs, companyId, categories }: EmployerJobsTableProps) {
    return (
        <>
            {/* Mobile cards */}
            <div className="space-y-4 md:hidden">
                {jobs.map((job) => (
                    <article
                        key={job.id}
                        className="rounded-2xl border border-slate-200 bg-white p-5"
                    >
                        <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                                <h2 className="wrap-break-word font-semibold text-slate-950">
                                    {job.title}
                                </h2>

                                <p className="mt-1 text-sm text-slate-500">{job.category.name}</p>
                            </div>

                            <JobStatusBadge job={job} />
                        </div>

                        <dl className="mt-5 grid grid-cols-2 gap-4 border-t border-slate-100 pt-4">
                            <div>
                                <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">
                                    Employment
                                </dt>

                                <dd className="mt-1 text-sm font-medium text-slate-800">
                                    {formatEmploymentType(job.employmentType)}
                                </dd>
                            </div>

                            <div>
                                <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">
                                    Workplace
                                </dt>

                                <dd className="mt-1 text-sm font-medium text-slate-800">
                                    {formatWorkplaceType(job.workplaceType)}
                                </dd>
                            </div>

                            <div>
                                <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">
                                    Expiration
                                </dt>

                                <dd className="mt-1 text-sm">
                                    <JobExpiration job={job} />
                                </dd>
                            </div>

                            <div>
                                <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">
                                    Updated
                                </dt>

                                <dd className="mt-1 text-sm font-medium text-slate-800">
                                    {formatJobDate(job.updatedAt)}
                                </dd>
                            </div>
                        </dl>

                        <div className="mt-5 border-t border-slate-100 pt-4">
                            <EmployerJobActions
                                job={job}
                                companyId={companyId}
                                categories={categories}
                            />
                        </div>
                    </article>
                ))}
            </div>

            {/* Desktop table */}
            <div className="hidden overflow-hidden rounded-2xl border border-slate-200 bg-white md:block">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200">
                        <thead className="bg-slate-50">
                            <tr>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                                    Job
                                </th>

                                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                                    Status
                                </th>

                                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                                    Employment
                                </th>

                                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                                    Workplace
                                </th>

                                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                                    Expiration
                                </th>

                                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                                    Actions
                                </th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-slate-100">
                            {jobs.map((job) => (
                                <tr key={job.id} className="transition-colors hover:bg-slate-50">
                                    <td className="px-6 py-5">
                                        <div className="font-semibold text-slate-950">
                                            {job.title}
                                        </div>

                                        <div className="mt-1 text-sm text-slate-500">
                                            {job.category.name}
                                        </div>
                                    </td>

                                    <td className="px-6 py-5">
                                        <JobStatusBadge job={job} />
                                    </td>

                                    <td className="whitespace-nowrap px-6 py-5 text-sm text-slate-700">
                                        {formatEmploymentType(job.employmentType)}
                                    </td>

                                    <td className="whitespace-nowrap px-6 py-5 text-sm text-slate-700">
                                        {formatWorkplaceType(job.workplaceType)}
                                    </td>

                                    <td className="whitespace-nowrap px-6 py-5 text-sm">
                                        <JobExpiration job={job} />
                                    </td>

                                    <td className="px-6 py-5">
                                        <EmployerJobActions
                                            job={job}
                                            companyId={companyId}
                                            categories={categories}
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}
