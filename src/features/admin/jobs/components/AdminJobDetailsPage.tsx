"use client";

import Link from "next/link";
import { useState } from "react";
import {
    ArrowLeft,
    BriefcaseBusiness,
    Building2,
    CalendarDays,
    Eye,
    EyeOff,
    FileWarning,
    MapPin,
    RefreshCcw,
    UserRound,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import { formatAdminDate, formatAdminLabel, getAdminErrorMessage } from "../../shared/utils/adminFormatters";
import { useAdminJob } from "../hooks/useAdminJobs";
import JobModerationDialog from "./JobModerationDialog";

type AdminJobDetailsPageProps = { jobId: string };

export default function AdminJobDetailsPage({ jobId }: AdminJobDetailsPageProps) {
    const jobQuery = useAdminJob(jobId);
    const job = jobQuery.data?.job;
    const [moderationOpen, setModerationOpen] = useState(false);

    if (jobQuery.isLoading) {
        return <div className="mx-auto h-72 w-full max-w-7xl animate-pulse rounded-2xl bg-muted" />;
    }

    if (jobQuery.isError || !job) {
        return (
            <div className="mx-auto w-full max-w-3xl rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">
                <p className="font-semibold">Unable to load job details</p>
                <p className="mt-2 text-sm">{getAdminErrorMessage(jobQuery.error, "This job could not be retrieved.")}</p>
                <Button asChild variant="outline" className="mt-5"><Link href="/admin/jobs"><ArrowLeft /> Back to jobs</Link></Button>
            </div>
        );
    }

    return (
        <div className="mx-auto w-full max-w-7xl space-y-6">
            <div className="flex items-center justify-between gap-3">
                <Button asChild variant="ghost" className="px-0"><Link href="/admin/jobs"><ArrowLeft /> Back to jobs</Link></Button>
                <Button variant="outline" onClick={() => void jobQuery.refetch()} disabled={jobQuery.isFetching}>
                    <RefreshCcw className={jobQuery.isFetching ? "animate-spin" : ""} /> Refresh
                </Button>
            </div>

            {job.moderationStatus === "HIDDEN" && (
                <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-red-800">
                    <div className="flex gap-3"><EyeOff className="mt-0.5 size-5 shrink-0" /><div>
                        <p className="font-semibold">Hidden from public JobsSpot listings</p>
                        <p className="mt-1 text-sm leading-6">{job.adminHiddenReason ?? "No moderation reason was recorded."}</p>
                        {job.adminHiddenAt && <p className="mt-2 text-xs">Moderated {formatAdminDate(job.adminHiddenAt)}{job.adminHiddenBy ? ` by ${job.adminHiddenBy.firstName} ${job.adminHiddenBy.lastName}` : ""}.</p>}
                    </div></div>
                </div>
            )}

            <section className="rounded-2xl border bg-card p-6 shadow-sm">
                <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-start">
                    <div>
                        <div className="flex flex-wrap items-center gap-2">
                            <span className="rounded-full border bg-muted px-2.5 py-1 text-xs font-semibold">{formatAdminLabel(job.status)}</span>
                            <span className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${job.moderationStatus === "HIDDEN" ? "border-red-200 bg-red-50 text-red-700" : "border-emerald-200 bg-emerald-50 text-emerald-700"}`}>{job.moderationStatus === "HIDDEN" ? "Hidden" : "Visible"}</span>
                        </div>
                        <h1 className="mt-3 text-3xl font-bold tracking-tight">{job.title}</h1>
                        <p className="mt-2 text-muted-foreground">{job.company.name} · {job.category.name}</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {job.status === "PUBLISHED" && job.moderationStatus === "VISIBLE" && !job.deletedAt && !job.company.suspendedAt && !job.company.deletedAt && (
                            <Button asChild variant="outline"><Link href={`/jobs/${job.slug}`} target="_blank"><Eye /> Public view</Link></Button>
                        )}
                        <Button variant={job.moderationStatus === "HIDDEN" ? "default" : "destructive"} onClick={() => setModerationOpen(true)} disabled={Boolean(job.deletedAt)}>
                            {job.moderationStatus === "HIDDEN" ? <Eye /> : <EyeOff />}{job.moderationStatus === "HIDDEN" ? "Restore visibility" : "Hide job"}
                        </Button>
                    </div>
                </div>
            </section>

            <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <Card><CardHeader><CardDescription>Applications</CardDescription><CardTitle className="text-3xl">{job.counts.applications}</CardTitle></CardHeader></Card>
                <Card><CardHeader><CardDescription>Total reports</CardDescription><CardTitle className="text-3xl">{job.counts.reports}</CardTitle></CardHeader></Card>
                <Card><CardHeader><CardDescription>Pending reports</CardDescription><CardTitle className="text-3xl">{job.counts.pendingReports}</CardTitle></CardHeader></Card>
                <Card><CardHeader><CardDescription>Under review</CardDescription><CardTitle className="text-3xl">{job.counts.underReviewReports}</CardTitle></CardHeader></Card>
            </section>

            <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
                <div className="space-y-6">
                    <Card><CardHeader><CardTitle>Job content</CardTitle><CardDescription>Employer-provided posting content.</CardDescription></CardHeader><CardContent className="space-y-6 text-sm leading-7">
                        <div><p className="mb-2 font-semibold">Description</p><p className="whitespace-pre-line text-muted-foreground">{job.description}</p></div>
                        {job.responsibilities && <div><p className="mb-2 font-semibold">Responsibilities</p><p className="whitespace-pre-line text-muted-foreground">{job.responsibilities}</p></div>}
                        {job.requirements && <div><p className="mb-2 font-semibold">Requirements</p><p className="whitespace-pre-line text-muted-foreground">{job.requirements}</p></div>}
                    </CardContent></Card>

                    <Card><CardHeader><CardTitle className="flex items-center gap-2"><FileWarning className="size-5 text-primary" /> Recent reports</CardTitle><CardDescription>Latest reports connected to this posting.</CardDescription></CardHeader><CardContent>
                        {job.reports.length === 0 ? <p className="text-sm text-muted-foreground">No job reports have been submitted.</p> : <div className="divide-y">{job.reports.map((report) => (
                            <div key={report.id} className="flex flex-col justify-between gap-3 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-center">
                                <div><p className="font-semibold">{formatAdminLabel(report.reason)}</p><p className="mt-1 text-sm text-muted-foreground">{report.reporter.firstName} {report.reporter.lastName} · {formatAdminDate(report.createdAt)}</p></div>
                                <div className="flex items-center gap-2"><span className="rounded-full border bg-muted px-2.5 py-1 text-xs font-semibold">{formatAdminLabel(report.status)}</span><Button asChild size="sm" variant="outline"><Link href={`/admin/reports/${report.id}`}>Review</Link></Button></div>
                            </div>
                        ))}</div>}
                    </CardContent></Card>
                </div>

                <div className="space-y-6">
                    <Card><CardHeader><CardTitle>Posting details</CardTitle></CardHeader><CardContent className="space-y-4 text-sm">
                        <div className="flex gap-3"><Building2 className="mt-0.5 size-4 text-muted-foreground" /><div><p className="font-medium">Company</p><Link className="text-primary hover:underline" href={`/admin/companies/${job.company.id}`}>{job.company.name}</Link></div></div>
                        <div className="flex gap-3"><MapPin className="mt-0.5 size-4 text-muted-foreground" /><div><p className="font-medium">Location</p><p className="text-muted-foreground">{job.location ?? "Not specified"}</p></div></div>
                        <div className="flex gap-3"><CalendarDays className="mt-0.5 size-4 text-muted-foreground" /><div><p className="font-medium">Expiration</p><p className="text-muted-foreground">{job.expiresAt ? formatAdminDate(job.expiresAt) : "Not set"}</p></div></div>
                        <div className="flex gap-3"><UserRound className="mt-0.5 size-4 text-muted-foreground" /><div><p className="font-medium">Created by</p><p className="text-muted-foreground">{job.createdBy.firstName} {job.createdBy.lastName}</p></div></div>
                        <div className="flex gap-3"><BriefcaseBusiness className="mt-0.5 size-4 text-muted-foreground" /><div><p className="font-medium">Work setup</p><p className="text-muted-foreground">{formatAdminLabel(job.employmentType)} · {formatAdminLabel(job.workplaceType)} · {formatAdminLabel(job.experienceLevel)}</p></div></div>
                    </CardContent></Card>

                    <Card><CardHeader><CardTitle>Application status distribution</CardTitle></CardHeader><CardContent className="space-y-2">{Object.entries(job.counts.applicationsByStatus).map(([status, count]) => <div key={status} className="flex items-center justify-between rounded-lg bg-muted/50 px-3 py-2 text-sm"><span>{formatAdminLabel(status)}</span><span className="font-semibold">{count}</span></div>)}</CardContent></Card>
                </div>
            </div>

            {moderationOpen && <JobModerationDialog job={job} open={moderationOpen} onOpenChange={setModerationOpen} />}
        </div>
    );
}
