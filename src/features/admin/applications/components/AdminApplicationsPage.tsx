"use client";

import Link from "next/link";
import { Eye, FileUser, Filter, RefreshCcw } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatAdminDate, getAdminErrorMessage } from "@/features/admin/shared/utils/adminFormatters";

import { useAdminApplications } from "../hooks/useAdminApplications";
import type { AdminApplicationListStatus, AdminApplicationSort } from "../types/adminApplication";
import ApplicationStatusBadge from "./ApplicationStatusBadge";

function useDebouncedValue(value: string, delayMs: number) {
    const [debouncedValue, setDebouncedValue] = useState(value);
    useEffect(() => {
        const timeout = window.setTimeout(() => setDebouncedValue(value), delayMs);
        return () => window.clearTimeout(timeout);
    }, [delayMs, value]);
    return debouncedValue;
}

export default function AdminApplicationsPage() {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState<AdminApplicationListStatus>("ALL");
    const [sort, setSort] = useState<AdminApplicationSort>("NEWEST");
    const debouncedSearch = useDebouncedValue(search, 300);

    const applicationsQuery = useAdminApplications({
        page,
        limit: 20,
        ...(debouncedSearch.trim() && { search: debouncedSearch.trim() }),
        status,
        sort,
    });

    const applications = applicationsQuery.data?.applications ?? [];
    const summary = applicationsQuery.data?.summary;
    const pagination = applicationsQuery.data?.pagination;

    const summaryCards = summary
        ? [
              ["Total", summary.total],
              ["Submitted", summary.submitted],
              ["Under Review", summary.underReview],
              ["Interview", summary.interview],
              ["Hired", summary.hired],
              ["Not Selected", summary.notSelected],
          ] as const
        : [];

    return (
        <div className="mx-auto w-full max-w-7xl space-y-6">
            <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                <div>
                    <p className="text-sm font-semibold text-primary">Admin-managed hiring</p>
                    <h1 className="mt-1 text-3xl font-bold tracking-tight">Applications</h1>
                    <p className="mt-2 max-w-3xl text-muted-foreground">
                        Review job-seeker applications, securely access submitted documents, coordinate with employers off-platform, and keep candidates updated.
                    </p>
                </div>
                <Button variant="outline" onClick={() => void applicationsQuery.refetch()} disabled={applicationsQuery.isFetching}>
                    <RefreshCcw className={applicationsQuery.isFetching ? "animate-spin" : ""} /> Refresh
                </Button>
            </section>

            {summary && (
                <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
                    {summaryCards.map(([label, value]) => (
                        <Card key={label}>
                            <CardContent className="p-5">
                                <p className="text-sm text-muted-foreground">{label}</p>
                                <p className="mt-2 text-3xl font-bold">{value}</p>
                            </CardContent>
                        </Card>
                    ))}
                </section>
            )}

            {summary && summary.legacyShortlisted > 0 && (
                <div className="rounded-xl border border-violet-200 bg-violet-50 px-4 py-3 text-sm text-violet-700">
                    {summary.legacyShortlisted} legacy shortlisted application{summary.legacyShortlisted === 1 ? "" : "s"} remain. New admin status changes no longer use Shortlisted.
                </div>
            )}

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Filter className="size-5 text-primary" /> Filters</CardTitle>
                    <CardDescription>Search by applicant, email, job title, or company.</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-3 lg:grid-cols-[minmax(280px,2fr)_minmax(180px,1fr)_minmax(160px,1fr)]">
                    <Input
                        value={search}
                        onChange={(event) => { setSearch(event.target.value); setPage(1); }}
                        placeholder="Applicant, email, job, or company..."
                    />
                    <Select value={status} onValueChange={(value) => { setStatus(value as AdminApplicationListStatus); setPage(1); }}>
                        <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="ALL">All statuses</SelectItem>
                            <SelectItem value="SUBMITTED">Submitted</SelectItem>
                            <SelectItem value="UNDER_REVIEW">Under Review</SelectItem>
                            <SelectItem value="INTERVIEW">Interview</SelectItem>
                            <SelectItem value="OFFERED">Offered</SelectItem>
                            <SelectItem value="HIRED">Hired</SelectItem>
                            <SelectItem value="REJECTED">Not Selected</SelectItem>
                            <SelectItem value="WITHDRAWN">Withdrawn</SelectItem>
                        </SelectContent>
                    </Select>
                    <Select value={sort} onValueChange={(value) => setSort(value as AdminApplicationSort)}>
                        <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="NEWEST">Newest first</SelectItem>
                            <SelectItem value="OLDEST">Oldest first</SelectItem>
                        </SelectContent>
                    </Select>
                </CardContent>
            </Card>

            <Card className="overflow-hidden">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><FileUser className="size-5 text-primary" /> Application queue</CardTitle>
                    <CardDescription>{pagination ? `${pagination.totalItems} applications found.` : "Loading applications..."}</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                    {applicationsQuery.isError && (
                        <div className="m-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                            {getAdminErrorMessage(applicationsQuery.error, "Unable to load applications.")}
                        </div>
                    )}
                    {!applicationsQuery.isLoading && !applicationsQuery.isError && applications.length === 0 && (
                        <div className="p-12 text-center text-sm text-muted-foreground">No applications match these filters.</div>
                    )}
                    {applications.length > 0 && (
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[1000px] text-left text-sm">
                                <thead className="border-y bg-muted/40 text-xs uppercase text-muted-foreground">
                                    <tr>
                                        <th className="px-5 py-3">Applicant</th>
                                        <th className="px-5 py-3">Job / company</th>
                                        <th className="px-5 py-3">Status</th>
                                        <th className="px-5 py-3">Resume</th>
                                        <th className="px-5 py-3">Applied</th>
                                        <th className="px-5 py-3 text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {applications.map((application) => (
                                        <tr key={application.id} className="hover:bg-muted/20">
                                            <td className="px-5 py-4">
                                                <p className="font-semibold">{application.applicant.firstName} {application.applicant.lastName}</p>
                                                <p className="mt-1 text-xs text-muted-foreground">{application.applicant.email ?? "Deleted account"}</p>
                                            </td>
                                            <td className="px-5 py-4">
                                                <p className="font-medium">{application.job.title}</p>
                                                <p className="mt-1 text-xs text-muted-foreground">{application.job.company.name}</p>
                                            </td>
                                            <td className="px-5 py-4"><ApplicationStatusBadge status={application.status} /></td>
                                            <td className="px-5 py-4 text-xs text-muted-foreground">{application.resume?.name ?? "No resume"}</td>
                                            <td className="px-5 py-4 text-xs text-muted-foreground">{formatAdminDate(application.appliedAt)}</td>
                                            <td className="px-5 py-4">
                                                <div className="flex justify-end">
                                                    <Button asChild size="sm" variant="outline">
                                                        <Link href={`/admin/applications/${application.id}`}><Eye /> Review</Link>
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
                    <Button variant="outline" disabled={!pagination.hasPreviousPage} onClick={() => setPage((value) => Math.max(1, value - 1))}>Previous</Button>
                    <span className="text-sm text-muted-foreground">Page {pagination.page} of {pagination.totalPages}</span>
                    <Button variant="outline" disabled={!pagination.hasNextPage} onClick={() => setPage((value) => value + 1)}>Next</Button>
                </div>
            )}
        </div>
    );
}
