"use client";

import Image from "next/image";
import Link from "next/link";
import { BriefcaseBusiness, Eye, EyeOff, Filter, RefreshCcw } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";

import { formatAdminDate, formatAdminLabel, getAdminErrorMessage } from "../../shared/utils/adminFormatters";
import { useAdminJobs } from "../hooks/useAdminJobs";
import type { AdminJobListItem, AdminJobStatus } from "../types/adminJob";
import JobModerationDialog from "./JobModerationDialog";

export default function AdminJobsPage() {
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState<"ALL" | AdminJobStatus>("ALL");
    const [moderation, setModeration] = useState<"ALL" | "VISIBLE" | "HIDDEN">("ALL");
    const [recordState, setRecordState] = useState<"ALL" | "ACTIVE" | "DELETED">("ACTIVE");
    const [sort, setSort] = useState<"NEWEST" | "OLDEST" | "TITLE_ASC" | "TITLE_DESC">("NEWEST");
    const [page, setPage] = useState(1);
    const [moderationJob, setModerationJob] = useState<AdminJobListItem | null>(null);
    const debouncedSearch = useDebouncedValue(search, 350);

    const jobsQuery = useAdminJobs({
        page,
        limit: 20,
        ...(debouncedSearch.trim() && { search: debouncedSearch.trim() }),
        status,
        moderation,
        recordState,
        sort,
    });

    const jobs = jobsQuery.data?.jobs ?? [];
    const pagination = jobsQuery.data?.pagination;

    return (
        <div className="mx-auto w-full max-w-7xl space-y-6">
            <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                <div>
                    <p className="text-sm font-semibold text-primary">Content moderation</p>
                    <h1 className="mt-1 text-3xl font-bold tracking-tight">Jobs</h1>
                    <p className="mt-2 text-muted-foreground">Review job postings across the platform and control public visibility without changing the employer&apos;s job status.</p>
                </div>
                <Button variant="outline" onClick={() => void jobsQuery.refetch()} disabled={jobsQuery.isFetching}>
                    <RefreshCcw className={jobsQuery.isFetching ? "animate-spin" : ""} /> Refresh
                </Button>
            </section>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Filter className="size-5 text-primary" /> Filters</CardTitle>
                    <CardDescription>Search by job, company, category, or location.</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-3 md:grid-cols-2 xl:grid-cols-6">
                    <Input
                        className="xl:col-span-2"
                        value={search}
                        onChange={(event) => { setSearch(event.target.value); setPage(1); }}
                        placeholder="Job, company, category, or location..."
                    />
                    <Select value={status} onValueChange={(value) => { setStatus(value as typeof status); setPage(1); }}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="ALL">All job statuses</SelectItem>
                            {(["DRAFT", "PUBLISHED", "PAUSED", "CLOSED", "ARCHIVED"] as const).map((value) => (
                                <SelectItem key={value} value={value}>{formatAdminLabel(value)}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Select value={moderation} onValueChange={(value) => { setModeration(value as typeof moderation); setPage(1); }}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="ALL">All moderation states</SelectItem>
                            <SelectItem value="VISIBLE">Visible</SelectItem>
                            <SelectItem value="HIDDEN">Hidden by JobsSpot</SelectItem>
                        </SelectContent>
                    </Select>
                    <Select value={recordState} onValueChange={(value) => { setRecordState(value as typeof recordState); setPage(1); }}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="ACTIVE">Active records</SelectItem>
                            <SelectItem value="DELETED">Deleted records</SelectItem>
                            <SelectItem value="ALL">All records</SelectItem>
                        </SelectContent>
                    </Select>
                    <Select value={sort} onValueChange={(value) => setSort(value as typeof sort)}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="NEWEST">Newest first</SelectItem>
                            <SelectItem value="OLDEST">Oldest first</SelectItem>
                            <SelectItem value="TITLE_ASC">Title A–Z</SelectItem>
                            <SelectItem value="TITLE_DESC">Title Z–A</SelectItem>
                        </SelectContent>
                    </Select>
                </CardContent>
            </Card>

            <Card className="overflow-hidden">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><BriefcaseBusiness className="size-5 text-primary" /> Platform jobs</CardTitle>
                    <CardDescription>{pagination ? `${pagination.totalItems} jobs found.` : "Loading jobs..."}</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                    {jobsQuery.isError && (
                        <div className="m-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                            {getAdminErrorMessage(jobsQuery.error, "Unable to load jobs.")}
                        </div>
                    )}
                    {!jobsQuery.isLoading && !jobsQuery.isError && jobs.length === 0 && (
                        <div className="p-12 text-center text-sm text-muted-foreground">No jobs match these filters.</div>
                    )}
                    {jobs.length > 0 && (
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[1100px] text-left text-sm">
                                <thead className="border-y bg-muted/40 text-xs uppercase text-muted-foreground">
                                    <tr>
                                        <th className="px-5 py-3">Job</th><th className="px-5 py-3">Status</th><th className="px-5 py-3">Moderation</th><th className="px-5 py-3">Usage</th><th className="px-5 py-3">Updated</th><th className="px-5 py-3 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {jobs.map((job) => (
                                        <tr key={job.id} className="hover:bg-muted/20">
                                            <td className="px-5 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex size-10 items-center justify-center overflow-hidden rounded-xl border bg-background">
                                                        {job.company.logoUrl ? <Image src={job.company.logoUrl} alt="" width={40} height={40} className="size-10 object-cover" /> : <BriefcaseBusiness className="size-4 text-muted-foreground" />}
                                                    </div>
                                                    <div className="min-w-0"><p className="font-semibold">{job.title}</p><p className="mt-1 text-xs text-muted-foreground">{job.company.name} · {job.category.name}</p></div>
                                                </div>
                                            </td>
                                            <td className="px-5 py-4"><span className="rounded-full border bg-muted px-2.5 py-1 text-xs font-semibold">{formatAdminLabel(job.status)}</span></td>
                                            <td className="px-5 py-4">
                                                <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-semibold ${job.moderationStatus === "HIDDEN" ? "border-red-200 bg-red-50 text-red-700" : "border-emerald-200 bg-emerald-50 text-emerald-700"}`}>
                                                    {job.moderationStatus === "HIDDEN" ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
                                                    {job.moderationStatus === "HIDDEN" ? "Hidden" : "Visible"}
                                                </span>
                                            </td>
                                            <td className="px-5 py-4 text-xs text-muted-foreground">{job.counts.applications} applications · {job.counts.reports} reports</td>
                                            <td className="px-5 py-4 text-xs text-muted-foreground">{formatAdminDate(job.updatedAt)}</td>
                                            <td className="px-5 py-4"><div className="flex justify-end gap-2"><Button asChild variant="outline" size="sm"><Link href={`/admin/jobs/${job.id}`}><Eye /> View</Link></Button><Button size="sm" variant={job.moderationStatus === "HIDDEN" ? "outline" : "destructive"} disabled={Boolean(job.deletedAt)} onClick={() => setModerationJob(job)}>{job.deletedAt ? "Deleted" : job.moderationStatus === "HIDDEN" ? "Restore" : "Hide"}</Button></div></td>
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

            {moderationJob && <JobModerationDialog job={moderationJob} open={Boolean(moderationJob)} onOpenChange={(open) => !open && setModerationJob(null)} />}
        </div>
    );
}
