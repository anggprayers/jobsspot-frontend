"use client";

import { useState } from "react";
import { Archive, BriefcaseBusiness, FilePenLine, PauseCircle, Search, Send } from "lucide-react";

import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useJobCategories } from "@/features/categories/hooks/useJobCategories";
import { canManageJobs } from "@/features/employers/utils/employerPermissions";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";

import { useCompanyJobs } from "../hooks/useCompanyJobs";
import type { CompanyJobStatus } from "../types/companyJob";

import CreateJobDialog from "./CreateJobDialog";
import EmployerJobsEmptyState from "./EmployerJobsEmptyState";
import EmployerJobsTable from "./EmployerJobsTable";

type StatusFilter = CompanyJobStatus | "ALL";

export default function EmployerJobsPage() {
    const { accessToken, activeCompanyId, activeCompanyRole } = useAuth();

    const hasJobManagementAccess = canManageJobs(activeCompanyRole);

    const [searchInput, setSearchInput] = useState("");
    const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
    const [page, setPage] = useState(1);

    const debouncedSearch = useDebouncedValue(searchInput, 400);

    const companyId = activeCompanyId ?? "";

    const {
        data: jobsData,
        isLoading: isLoadingJobs,
        isFetching: isFetchingJobs,
        isError: isJobsError,
        error: jobsError,
    } = useCompanyJobs({
        companyId,
        accessToken: accessToken ?? "",
        params: {
            search: debouncedSearch || undefined,
            status: statusFilter === "ALL" ? undefined : statusFilter,
            page,
            limit: 10,
        },
    });

    const {
        data: categoriesData,
        isLoading: isLoadingCategories,
        isError: isCategoriesError,
        error: categoriesError,
    } = useJobCategories();

    const jobs = jobsData?.jobs ?? [];
    const categories = categoriesData?.categories ?? [];

    const summary = jobsData?.summary ?? {
        totalJobs: 0,
        publishedJobs: 0,
        draftJobs: 0,
        pausedJobs: 0,
        closedJobs: 0,
        archivedJobs: 0,
    };

    const pagination = jobsData?.pagination;

    const isLoading = isLoadingJobs || isLoadingCategories;

    const isError = isJobsError || isCategoriesError;

    const error = jobsError ?? categoriesError;

    const hasFilters = searchInput.trim().length > 0 || statusFilter !== "ALL";

    const statCards = [
        {
            label: "Total jobs",
            value: summary.totalJobs,
            icon: BriefcaseBusiness,
        },
        {
            label: "Published",
            value: summary.publishedJobs,
            icon: Send,
        },
        {
            label: "Draft",
            value: summary.draftJobs,
            icon: FilePenLine,
        },
        {
            label: "Paused",
            value: summary.pausedJobs,
            icon: PauseCircle,
        },
        {
            label: "Archived",
            value: summary.archivedJobs,
            icon: Archive,
        },
    ];

    function clearFilters() {
        setSearchInput("");
        setStatusFilter("ALL");
        setPage(1);
    }

    return (
        <div className="min-w-0 space-y-7">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                <div>
                    <p className="text-sm font-semibold text-primary">Job management</p>

                    <h1 className="mt-1 text-3xl font-bold text-slate-950">Jobs</h1>

                    <p className="mt-2 text-slate-600">
                        {hasJobManagementAccess
                            ? "Create, publish, and manage your company's job postings."
                            : "View your company's job postings and their current statuses."}
                    </p>
                </div>

                {hasJobManagementAccess && <CreateJobDialog />}
            </div>

            {!isLoading && !isError && summary.totalJobs > 0 && (
                <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                    {statCards.map((stat) => (
                        <article
                            key={stat.label}
                            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <p className="text-sm font-medium text-slate-500">
                                        {stat.label}
                                    </p>

                                    <p className="mt-2 text-3xl font-bold text-slate-950">
                                        {stat.value}
                                    </p>
                                </div>

                                <div className="rounded-xl bg-blue-50 p-2.5 text-blue-600">
                                    <stat.icon className="size-5" />
                                </div>
                            </div>
                        </article>
                    ))}
                </section>
            )}

            {!isLoading && !isError && summary.totalJobs > 0 && (
                <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
                        <div className="relative flex-1">
                            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400" />

                            <Input
                                type="search"
                                value={searchInput}
                                onChange={(event) => {
                                    setSearchInput(event.target.value);
                                    setPage(1);
                                }}
                                placeholder="Search by title, category, or location..."
                                aria-label="Search company jobs"
                                className="pl-9"
                            />
                        </div>

                        <Select
                            value={statusFilter}
                            onValueChange={(value) => {
                                setStatusFilter(value as StatusFilter);
                                setPage(1);
                            }}
                        >
                            <SelectTrigger
                                className="w-full lg:w-52"
                                aria-label="Filter jobs by status"
                            >
                                <SelectValue placeholder="All statuses" />
                            </SelectTrigger>

                            <SelectContent>
                                <SelectItem value="ALL">All statuses</SelectItem>

                                <SelectItem value="PUBLISHED">Published</SelectItem>

                                <SelectItem value="DRAFT">Draft</SelectItem>

                                <SelectItem value="PAUSED">Paused</SelectItem>

                                <SelectItem value="CLOSED">Closed</SelectItem>

                                <SelectItem value="ARCHIVED">Archived</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {isFetchingJobs && !isLoadingJobs && (
                        <p className="mt-3 text-sm text-slate-500">Updating job results...</p>
                    )}
                </section>
            )}

            {isLoading && (
                <div className="rounded-2xl border border-slate-200 bg-white p-8 text-slate-600">
                    Loading jobs...
                </div>
            )}

            {isError && (
                <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">
                    {error instanceof Error ? error.message : "Unable to load jobs."}
                </div>
            )}

            {!isLoading &&
                !isError &&
                summary.totalJobs === 0 &&
                (hasJobManagementAccess ? (
                    <EmployerJobsEmptyState />
                ) : (
                    <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
                        <div className="mx-auto flex size-12 items-center justify-center rounded-xl bg-slate-100 text-slate-500">
                            <BriefcaseBusiness className="size-5" />
                        </div>

                        <h2 className="mt-5 text-lg font-semibold text-slate-950">
                            No jobs available yet
                        </h2>

                        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-600">
                            Company job postings will appear here once an owner, administrator, or
                            recruiter creates them.
                        </p>
                    </div>
                ))}

            {!isLoading && !isError && summary.totalJobs > 0 && jobs.length === 0 && (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
                    <div className="mx-auto flex size-12 items-center justify-center rounded-xl bg-slate-100 text-slate-500">
                        <Search className="size-5" />
                    </div>

                    <h2 className="mt-5 text-lg font-semibold text-slate-950">
                        No matching jobs found
                    </h2>

                    <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-600">
                        Try changing your search term or selecting a different job status.
                    </p>

                    {hasFilters && (
                        <button
                            type="button"
                            onClick={clearFilters}
                            className="mt-5 rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                        >
                            Clear filters
                        </button>
                    )}
                </div>
            )}

            {!isLoading && !isError && jobs.length > 0 && (
                <>
                    <EmployerJobsTable jobs={jobs} companyId={companyId} categories={categories} />

                    {pagination && (
                        <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                            <p className="text-sm text-slate-600">
                                Showing{" "}
                                <span className="font-semibold text-slate-900">
                                    {(pagination.page - 1) * pagination.limit + 1}
                                </span>
                                {"–"}
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
                                jobs
                            </p>

                            <div className="flex items-center gap-3">
                                <button
                                    type="button"
                                    disabled={!pagination.hasPreviousPage || isFetchingJobs}
                                    onClick={() =>
                                        setPage((currentPage) => Math.max(1, currentPage - 1))
                                    }
                                    className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    Previous
                                </button>

                                <span className="text-sm font-medium text-slate-700">
                                    Page {pagination.page} of {pagination.totalPages}
                                </span>

                                <button
                                    type="button"
                                    disabled={!pagination.hasNextPage || isFetchingJobs}
                                    onClick={() => setPage((currentPage) => currentPage + 1)}
                                    className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
