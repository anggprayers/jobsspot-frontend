"use client";

import Link from "next/link";
import { ClipboardList, Eye, Filter, RefreshCcw } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";

import { formatAdminDate, formatAdminLabel, getAdminErrorMessage } from "../../shared/utils/adminFormatters";
import { useAdminJobSubmissions } from "../hooks/useAdminJobSubmissions";
import type { JobSubmissionListStatus, JobSubmissionSort, JobSubmissionStatus } from "../types/adminJobSubmission";
import JobSubmissionStatusBadge from "./JobSubmissionStatusBadge";

const summaryOrder: JobSubmissionStatus[] = [
    "SUBMITTED",
    "CONTACTED",
    "PUBLISHED",
    "REJECTED",
];

export default function AdminJobSubmissionsPage() {
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState<JobSubmissionListStatus>("ALL");
    const [sort, setSort] = useState<JobSubmissionSort>("NEWEST");
    const [page, setPage] = useState(1);
    const debouncedSearch = useDebouncedValue(search, 350);

    const submissionsQuery = useAdminJobSubmissions({
        page,
        limit: 20,
        ...(debouncedSearch.trim() && { search: debouncedSearch.trim() }),
        status,
        sort,
    });

    const submissions = submissionsQuery.data?.submissions ?? [];
    const pagination = submissionsQuery.data?.pagination;
    const summary = submissionsQuery.data?.summary;

    return (
        <div className="mx-auto w-full max-w-7xl space-y-6">
            <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                <div>
                    <p className="text-sm font-semibold text-primary">Admin-managed hiring</p>
                    <h1 className="mt-1 text-3xl font-bold tracking-tight">Job Submissions</h1>
                    <p className="mt-2 max-w-3xl text-muted-foreground">
                        Review employer job requests, contact the submitter, then convert approved submissions into published JobsSpot listings.
                    </p>
                </div>

                <Button
                    variant="outline"
                    onClick={() => void submissionsQuery.refetch()}
                    disabled={submissionsQuery.isFetching}
                >
                    <RefreshCcw className={submissionsQuery.isFetching ? "animate-spin" : ""} />
                    Refresh
                </Button>
            </section>

            {summary && (
                <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                    {summaryOrder.map((itemStatus) => (
                        <Card key={itemStatus}>
                            <CardContent className="p-5">
                                <p className="text-sm text-muted-foreground">{formatAdminLabel(itemStatus)}</p>
                                <p className="mt-2 text-3xl font-bold">{summary.byStatus[itemStatus]}</p>
                            </CardContent>
                        </Card>
                    ))}
                </section>
            )}

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Filter className="size-5 text-primary" /> Filters
                    </CardTitle>
                    <CardDescription>Search by reference, job title, company, or contact email.</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-3 lg:grid-cols-[minmax(260px,2fr)_minmax(180px,1fr)_minmax(160px,1fr)]">
                    <Input
                        value={search}
                        onChange={(event) => {
                            setSearch(event.target.value);
                            setPage(1);
                        }}
                        placeholder="Reference, job, company, or email..."
                    />

                    <Select
                        value={status}
                        onValueChange={(value) => {
                            setStatus(value as JobSubmissionListStatus);
                            setPage(1);
                        }}
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="ALL">All statuses</SelectItem>
                            <SelectItem value="SUBMITTED">Submitted</SelectItem>
                            <SelectItem value="CONTACTED">Contacted</SelectItem>
                            <SelectItem value="PUBLISHED">Published</SelectItem>
                            <SelectItem value="REJECTED">Rejected</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select value={sort} onValueChange={(value) => setSort(value as JobSubmissionSort)}>
                        <SelectTrigger className="w-full">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="NEWEST">Newest first</SelectItem>
                            <SelectItem value="OLDEST">Oldest first</SelectItem>
                        </SelectContent>
                    </Select>
                </CardContent>
            </Card>

            <Card className="overflow-hidden">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <ClipboardList className="size-5 text-primary" /> Review queue
                    </CardTitle>
                    <CardDescription>
                        {pagination ? `${pagination.totalItems} submissions found.` : "Loading submissions..."}
                    </CardDescription>
                </CardHeader>

                <CardContent className="p-0">
                    {submissionsQuery.isError && (
                        <div className="m-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                            {getAdminErrorMessage(submissionsQuery.error, "Unable to load job submissions.")}
                        </div>
                    )}

                    {!submissionsQuery.isLoading && !submissionsQuery.isError && submissions.length === 0 && (
                        <div className="p-12 text-center text-sm text-muted-foreground">
                            No job submissions match these filters.
                        </div>
                    )}

                    {submissions.length > 0 && (
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[980px] text-left text-sm">
                                <thead className="border-y bg-muted/40 text-xs uppercase text-muted-foreground">
                                    <tr>
                                        <th className="px-5 py-3">Submission</th>
                                        <th className="px-5 py-3">Company / location</th>
                                        <th className="px-5 py-3">Contact</th>
                                        <th className="px-5 py-3">Status</th>
                                        <th className="px-5 py-3">Received</th>
                                        <th className="px-5 py-3 text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {submissions.map((submission) => (
                                        <tr key={submission.id} className="hover:bg-muted/20">
                                            <td className="px-5 py-4">
                                                <p className="font-semibold">{submission.jobTitle}</p>
                                                <p className="mt-1 text-xs text-muted-foreground">{submission.referenceCode}</p>
                                            </td>
                                            <td className="px-5 py-4">
                                                <p className="font-medium">{submission.companyName}</p>
                                                <p className="mt-1 text-xs text-muted-foreground">{submission.locationText}</p>
                                            </td>
                                            <td className="px-5 py-4">
                                                <p>{submission.contactName || "No contact name"}</p>
                                                <p className="mt-1 text-xs text-muted-foreground">{submission.contactEmail}</p>
                                            </td>
                                            <td className="px-5 py-4">
                                                <JobSubmissionStatusBadge status={submission.status} />
                                            </td>
                                            <td className="px-5 py-4 text-xs text-muted-foreground">
                                                {formatAdminDate(submission.createdAt)}
                                            </td>
                                            <td className="px-5 py-4">
                                                <div className="flex justify-end">
                                                    <Button asChild size="sm" variant="outline">
                                                        <Link href={`/admin/job-submissions/${submission.id}`}>
                                                            <Eye /> Review
                                                        </Link>
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </CardContent>
            </Card>

            {pagination && pagination.totalPages > 1 && (
                <div className="flex items-center justify-end gap-3">
                    <Button
                        variant="outline"
                        disabled={!pagination.hasPreviousPage}
                        onClick={() => setPage((value) => Math.max(1, value - 1))}
                    >
                        Previous
                    </Button>
                    <span className="text-sm text-muted-foreground">
                        Page {pagination.page} of {pagination.totalPages}
                    </span>
                    <Button
                        variant="outline"
                        disabled={!pagination.hasNextPage}
                        onClick={() => setPage((value) => value + 1)}
                    >
                        Next
                    </Button>
                </div>
            )}
        </div>
    );
}
