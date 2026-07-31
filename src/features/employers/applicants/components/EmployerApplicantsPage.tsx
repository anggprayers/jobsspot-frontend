"use client";

import axios from "axios";
import Link from "next/link";
import {
    BriefcaseBusiness,
    ChevronLeft,
    ChevronRight,
    ClipboardCheck,
    Clock3,
    Eye,
    FileSearch,
    Search,
    Star,
    UserCheck,
    UsersRound,
} from "lucide-react";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";

import { useCompanyApplications } from "../hooks/useCompanyApplications";
import type {
    EmployerApplicationsQueryParams,
    EmployerApplicationStatus,
} from "../types/employerApplication";
import {
    formatApplicationDate,
    formatFileSize,
    formatApplicationStatus,
    getApplicantInitials,
    getApplicationStatusBadgeClasses,
} from "../utils/applicationFormatters";

import { canUpdateApplications } from "@/features/employers/utils/employerPermissions";

const APPLICATIONS_PER_PAGE = 10;

const emptySummary = {
    totalApplications: 0,
    submitted: 0,
    underReview: 0,
    shortlisted: 0,
    interviews: 0,
    offered: 0,
    hired: 0,
    rejected: 0,
    withdrawn: 0,
};

type StatusFilter = "ALL" | EmployerApplicationStatus;

function getErrorMessage(error: unknown): string {
    if (axios.isAxiosError<{ message?: string }>(error)) {
        return error.response?.data?.message ?? "Unable to load company applications.";
    }

    return "Unable to load company applications.";
}

export default function EmployerApplicantsPage() {
    const { activeCompanyId, activeCompanyRole } = useAuth();

    const companyId = activeCompanyId ?? "";

    const hasApplicationManagementAccess = canUpdateApplications(activeCompanyRole);

    const [searchInput, setSearchInput] = useState("");
    const [jobFilter, setJobFilter] = useState("ALL");
    const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
    const [page, setPage] = useState(1);

    const debouncedSearch = useDebouncedValue(searchInput, 400);

    const queryParams = useMemo<EmployerApplicationsQueryParams>(
        () => ({
            page,
            limit: APPLICATIONS_PER_PAGE,

            ...(debouncedSearch.trim() && {
                search: debouncedSearch.trim(),
            }),

            ...(jobFilter !== "ALL" && {
                jobId: jobFilter,
            }),

            ...(statusFilter !== "ALL" && {
                status: statusFilter,
            }),
        }),
        [debouncedSearch, jobFilter, page, statusFilter],
    );

    const applicationsQuery = useCompanyApplications({
        companyId,
        params: queryParams,
    });

    const applications = applicationsQuery.data?.applications ?? [];

    const summary = applicationsQuery.data?.summary ?? emptySummary;

    const jobOptions = applicationsQuery.data?.jobOptions ?? [];

    const pagination = applicationsQuery.data?.pagination;

    const hasActiveFilters =
        Boolean(searchInput.trim()) || jobFilter !== "ALL" || statusFilter !== "ALL";

    function handleSearchChange(value: string) {
        setSearchInput(value);
        setPage(1);
    }

    function handleJobFilterChange(value: string) {
        setJobFilter(value);
        setPage(1);
    }

    function handleStatusFilterChange(value: string) {
        setStatusFilter(value as StatusFilter);
        setPage(1);
    }

    const statCards = [
        {
            label: "Total applicants",
            value: summary.totalApplications,
            icon: UsersRound,
        },
        {
            label: "New submissions",
            value: summary.submitted,
            icon: FileSearch,
        },
        {
            label: "Under review",
            value: summary.underReview,
            icon: Clock3,
        },
        {
            label: "Shortlisted",
            value: summary.shortlisted,
            icon: Star,
        },
        {
            label: "Interviews",
            value: summary.interviews,
            icon: ClipboardCheck,
        },
        {
            label: "Hired",
            value: summary.hired,
            icon: UserCheck,
        },
    ];

    function clearFilters() {
        setSearchInput("");
        setJobFilter("ALL");
        setStatusFilter("ALL");
        setPage(1);
    }

    return (
        <div className="mx-auto w-full max-w-7xl space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
                    Applicants
                </h1>

                <p className="mt-1 text-sm text-slate-600 sm:text-base">
                    {hasApplicationManagementAccess
                        ? "Review and manage applications submitted to your company's jobs."
                        : "View applications submitted to your company's jobs and their current statuses."}
                </p>
            </div>

            <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
                {statCards.map((card) => {
                    const Icon = card.icon;

                    return (
                        <div
                            key={card.label}
                            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <p className="text-sm font-medium text-slate-500">
                                        {card.label}
                                    </p>

                                    <p className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
                                        {applicationsQuery.isLoading ? "—" : card.value}
                                    </p>
                                </div>

                                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                                    <Icon className="size-5" />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
                <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_240px_220px_auto]">
                    <div className="relative">
                        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400" />

                        <Input
                            value={searchInput}
                            onChange={(event) => handleSearchChange(event.target.value)}
                            placeholder="Search applicant, email, or job..."
                            className="pl-9"
                        />
                    </div>

                    <Select value={jobFilter} onValueChange={handleJobFilterChange}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="All jobs" />
                        </SelectTrigger>

                        <SelectContent>
                            <SelectItem value="ALL">All jobs</SelectItem>

                            {jobOptions.map((job) => (
                                <SelectItem key={job.id} value={job.id}>
                                    {job.title}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select value={statusFilter} onValueChange={handleStatusFilterChange}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="All statuses" />
                        </SelectTrigger>

                        <SelectContent>
                            <SelectItem value="ALL">All statuses</SelectItem>

                            <SelectItem value="SUBMITTED">Submitted</SelectItem>

                            <SelectItem value="UNDER_REVIEW">Under review</SelectItem>

                            <SelectItem value="SHORTLISTED">Shortlisted</SelectItem>

                            <SelectItem value="INTERVIEW">Interview</SelectItem>

                            <SelectItem value="OFFERED">Offered</SelectItem>

                            <SelectItem value="HIRED">Hired</SelectItem>

                            <SelectItem value="REJECTED">Rejected</SelectItem>

                            <SelectItem value="WITHDRAWN">Withdrawn</SelectItem>
                        </SelectContent>
                    </Select>

                    <Button
                        type="button"
                        variant="outline"
                        disabled={!hasActiveFilters}
                        onClick={clearFilters}
                    >
                        Clear filters
                    </Button>
                </div>

                {applicationsQuery.isFetching && !applicationsQuery.isLoading && (
                    <p className="mt-3 text-xs font-medium text-blue-600">
                        Updating applications...
                    </p>
                )}
            </section>

            {applicationsQuery.isLoading && (
                <section className="space-y-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    {Array.from({
                        length: 5,
                    }).map((_, index) => (
                        <div key={index} className="h-16 animate-pulse rounded-xl bg-slate-100" />
                    ))}
                </section>
            )}

            {applicationsQuery.isError && (
                <section className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
                    <h2 className="text-lg font-semibold text-red-800">
                        Unable to load applicants
                    </h2>

                    <p className="mt-2 text-sm text-red-700">
                        {getErrorMessage(applicationsQuery.error)}
                    </p>

                    <Button
                        type="button"
                        variant="outline"
                        className="mt-5"
                        onClick={() => applicationsQuery.refetch()}
                    >
                        Try again
                    </Button>
                </section>
            )}

            {!applicationsQuery.isLoading &&
                !applicationsQuery.isError &&
                applications.length === 0 && (
                    <section className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
                        <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-600">
                            {hasActiveFilters ? (
                                <Search className="size-6" />
                            ) : (
                                <UsersRound className="size-6" />
                            )}
                        </div>

                        <h2 className="mt-5 text-lg font-semibold text-slate-950">
                            {hasActiveFilters
                                ? "No applications match your filters"
                                : "No applications yet"}
                        </h2>

                        <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-slate-600">
                            {hasActiveFilters
                                ? "Try another applicant name, job, or application status."
                                : "Applications will appear here after job seekers apply to one of your published jobs."}
                        </p>

                        {hasActiveFilters && (
                            <Button
                                type="button"
                                variant="outline"
                                className="mt-5"
                                onClick={clearFilters}
                            >
                                Clear filters
                            </Button>
                        )}
                    </section>
                )}

            {!applicationsQuery.isLoading &&
                !applicationsQuery.isError &&
                applications.length > 0 && (
                    <>
                        <section className="hidden overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm md:block">
                            <div className="overflow-x-auto">
                                <table className="w-full min-w-250 border-collapse text-left">
                                    <thead className="border-b border-slate-200 bg-slate-50">
                                        <tr>
                                            <th className="px-5 py-4 text-xs font-semibold tracking-wide text-slate-500 uppercase">
                                                Applicant
                                            </th>

                                            <th className="px-5 py-4 text-xs font-semibold tracking-wide text-slate-500 uppercase">
                                                Applied job
                                            </th>

                                            <th className="px-5 py-4 text-xs font-semibold tracking-wide text-slate-500 uppercase">
                                                Resume
                                            </th>

                                            <th className="px-5 py-4 text-xs font-semibold tracking-wide text-slate-500 uppercase">
                                                Status
                                            </th>

                                            <th className="px-5 py-4 text-xs font-semibold tracking-wide text-slate-500 uppercase">
                                                Applied
                                            </th>

                                            <th className="px-5 py-4 text-xs font-semibold tracking-wide text-slate-500 uppercase">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>

                                    <tbody className="divide-y divide-slate-100">
                                        {applications.map((application) => {
                                            const profile = application.applicant.jobSeekerProfile;

                                            return (
                                                <tr
                                                    key={application.id}
                                                    className="transition hover:bg-slate-50"
                                                >
                                                    <td className="px-5 py-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">
                                                                {getApplicantInitials(
                                                                    application.applicant.firstName,
                                                                    application.applicant.lastName,
                                                                )}
                                                            </div>

                                                            <div className="min-w-0">
                                                                <p className="truncate font-semibold text-slate-950">
                                                                    {
                                                                        application.applicant
                                                                            .firstName
                                                                    }{" "}
                                                                    {application.applicant.lastName}
                                                                </p>

                                                                <p className="truncate text-sm text-slate-500">
                                                                    {application.applicant.email}
                                                                </p>

                                                                {profile?.headline && (
                                                                    <p className="mt-1 max-w-65 truncate text-xs text-slate-500">
                                                                        {profile.headline}
                                                                    </p>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </td>

                                                    <td className="px-5 py-4">
                                                        <div className="flex items-start gap-2">
                                                            <BriefcaseBusiness className="mt-0.5 size-4 shrink-0 text-slate-400" />

                                                            <span className="text-sm font-medium text-slate-700">
                                                                {application.job.title}
                                                            </span>
                                                        </div>
                                                    </td>

                                                    <td className="px-5 py-4">
                                                        {application.resume ? (
                                                            <div>
                                                                <p className="max-w-45 truncate text-sm font-medium text-slate-700">
                                                                    {application.resume.name}
                                                                </p>

                                                                <p className="mt-0.5 text-xs text-slate-500">
                                                                    {formatFileSize(
                                                                        application.resume.fileSize,
                                                                    )}
                                                                </p>
                                                            </div>
                                                        ) : (
                                                            <span className="text-sm text-slate-400">
                                                                No resume
                                                            </span>
                                                        )}
                                                    </td>

                                                    <td className="px-5 py-4">
                                                        <span
                                                            className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${getApplicationStatusBadgeClasses(
                                                                application.status,
                                                            )}`}
                                                        >
                                                            {formatApplicationStatus(
                                                                application.status,
                                                            )}
                                                        </span>
                                                    </td>

                                                    <td className="px-5 py-4 text-sm text-slate-600">
                                                        {formatApplicationDate(
                                                            application.appliedAt,
                                                        )}
                                                    </td>

                                                    <td className="px-5 py-4">
                                                        <Button variant="outline" size="sm" asChild>
                                                            <Link
                                                                href={`/employers/applicants/${application.id}`}
                                                            >
                                                                <Eye className="size-4" />
                                                                View
                                                            </Link>
                                                        </Button>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </section>

                        <section className="space-y-4 md:hidden">
                            {applications.map((application) => {
                                const profile = application.applicant.jobSeekerProfile;

                                return (
                                    <article
                                        key={application.id}
                                        className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">
                                                {getApplicantInitials(
                                                    application.applicant.firstName,
                                                    application.applicant.lastName,
                                                )}
                                            </div>

                                            <div className="min-w-0 flex-1">
                                                <p className="font-semibold text-slate-950">
                                                    {application.applicant.firstName}{" "}
                                                    {application.applicant.lastName}
                                                </p>

                                                <p className="truncate text-sm text-slate-500">
                                                    {application.applicant.email}
                                                </p>

                                                {profile?.headline && (
                                                    <p className="mt-1 text-sm text-slate-600">
                                                        {profile.headline}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        <div className="mt-5 space-y-3 border-t border-slate-100 pt-4">
                                            <div>
                                                <p className="text-xs font-semibold tracking-wide text-slate-400 uppercase">
                                                    Applied job
                                                </p>

                                                <p className="mt-1 text-sm font-medium text-slate-700">
                                                    {application.job.title}
                                                </p>
                                            </div>

                                            <div className="flex flex-wrap items-center justify-between gap-3">
                                                <span
                                                    className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${getApplicationStatusBadgeClasses(
                                                        application.status,
                                                    )}`}
                                                >
                                                    {formatApplicationStatus(application.status)}
                                                </span>

                                                <span className="text-xs text-slate-500">
                                                    Applied{" "}
                                                    {formatApplicationDate(application.appliedAt)}
                                                </span>
                                            </div>

                                            {application.resume && (
                                                <p className="text-sm text-slate-600">
                                                    Resume:{" "}
                                                    <span className="font-medium">
                                                        {application.resume.name}
                                                    </span>
                                                </p>
                                            )}
                                        </div>

                                        <Button variant="outline" className="mt-4 w-full" asChild>
                                            <Link href={`/employers/applicants/${application.id}`}>
                                                <Eye className="size-4" />
                                                View applicant
                                            </Link>
                                        </Button>
                                    </article>
                                );
                            })}
                        </section>

                        {pagination && pagination.totalItems > 0 && (
                            <section className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
                                <p className="text-sm text-slate-600">
                                    Showing{" "}
                                    <span className="font-semibold text-slate-900">
                                        {(pagination.page - 1) * pagination.limit + 1}
                                    </span>
                                    {" – "}
                                    <span className="font-semibold text-slate-900">
                                        {Math.min(
                                            pagination.page * pagination.limit,
                                            pagination.totalItems,
                                        )}
                                    </span>{" "}
                                    of{" "}
                                    <span className="font-semibold text-slate-900">
                                        {pagination.totalItems}
                                    </span>{" "}
                                    applications
                                </p>

                                <div className="flex items-center gap-2">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        disabled={
                                            !pagination.hasPreviousPage ||
                                            applicationsQuery.isFetching
                                        }
                                        onClick={() =>
                                            setPage((currentPage) => Math.max(1, currentPage - 1))
                                        }
                                    >
                                        <ChevronLeft className="size-4" />
                                        Previous
                                    </Button>

                                    <span className="px-2 text-sm font-medium text-slate-700">
                                        Page {pagination.page} of {pagination.totalPages}
                                    </span>

                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        disabled={
                                            !pagination.hasNextPage || applicationsQuery.isFetching
                                        }
                                        onClick={() => setPage((currentPage) => currentPage + 1)}
                                    >
                                        Next
                                        <ChevronRight className="size-4" />
                                    </Button>
                                </div>
                            </section>
                        )}
                    </>
                )}
        </div>
    );
}
