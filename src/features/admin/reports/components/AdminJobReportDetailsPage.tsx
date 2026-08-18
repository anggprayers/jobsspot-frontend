"use client";
import Link from "next/link";
import { ArrowLeft, Building2, Eye, EyeOff, FileWarning, RefreshCcw, UserRound } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatAdminDate, formatAdminLabel, getAdminErrorMessage } from "../../shared/utils/adminFormatters";
import JobModerationDialog from "../../jobs/components/JobModerationDialog";
import { useAdminJob } from "../../jobs/hooks/useAdminJobs";
import { useAdminJobReport } from "../hooks/useAdminJobReports";
import ReportStatusDialog from "./ReportStatusDialog";

type Props = { reportId: string };

export default function AdminJobReportDetailsPage({ reportId }: Props) {
    const reportQuery = useAdminJobReport(reportId);
    const report = reportQuery.data?.report;
    const jobQuery = useAdminJob(report?.job.id ?? "");
    const [statusOpen, setStatusOpen] = useState(false);
    const [moderationOpen, setModerationOpen] = useState(false);

    if (reportQuery.isLoading) return <div className="mx-auto h-72 w-full max-w-7xl animate-pulse rounded-2xl bg-muted" />;
    if (reportQuery.isError || !report) return <div className="mx-auto w-full max-w-3xl rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700"><p className="font-semibold">Unable to load report</p><p className="mt-2 text-sm">{getAdminErrorMessage(reportQuery.error, "This report could not be retrieved.")}</p><Button asChild variant="outline" className="mt-5"><Link href="/admin/reports"><ArrowLeft /> Back to reports</Link></Button></div>;

    const currentJob = jobQuery.data?.job;
    const final = report.status === "RESOLVED" || report.status === "DISMISSED";

    return <div className="mx-auto w-full max-w-7xl space-y-6">
        <div className="flex items-center justify-between gap-3"><Button asChild variant="ghost" className="px-0"><Link href="/admin/reports"><ArrowLeft /> Back to reports</Link></Button><Button variant="outline" onClick={() => void reportQuery.refetch()} disabled={reportQuery.isFetching}><RefreshCcw className={reportQuery.isFetching ? "animate-spin" : ""} /> Refresh</Button></div>
        <section className="rounded-2xl border bg-card p-6 shadow-sm"><div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-start"><div><p className="text-sm font-semibold text-primary">{formatAdminLabel(report.reason)}</p><h1 className="mt-2 text-3xl font-bold tracking-tight">Report for {report.job.title}</h1><p className="mt-2 text-muted-foreground">{report.job.company.name} · Submitted {formatAdminDate(report.createdAt)}</p></div><div className="flex flex-wrap gap-2"><span className="rounded-full border bg-muted px-3 py-2 text-xs font-semibold">{formatAdminLabel(report.status)}</span><Button onClick={() => setStatusOpen(true)}>{final ? "Update outcome" : "Review report"}</Button></div></div></section>
        <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
            <div className="space-y-6">
                <Card><CardHeader><CardTitle className="flex items-center gap-2"><FileWarning className="size-5 text-primary" /> Report details</CardTitle><CardDescription>The reporter&apos;s selected reason and optional explanation.</CardDescription></CardHeader><CardContent className="space-y-5"><div><p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Reason</p><p className="mt-1 font-semibold">{formatAdminLabel(report.reason)}</p></div><div><p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Explanation</p><p className="mt-1 whitespace-pre-line text-sm leading-6 text-muted-foreground">{report.details ?? "No additional explanation was provided."}</p></div>{report.resolutionNote && <div className="rounded-xl border bg-muted/40 p-4"><p className="font-semibold">Resolution note</p><p className="mt-1 text-sm leading-6 text-muted-foreground">{report.resolutionNote}</p>{report.reviewedBy && <p className="mt-2 text-xs text-muted-foreground">Last reviewed by {report.reviewedBy.firstName} {report.reviewedBy.lastName}{report.reviewedAt ? ` · ${formatAdminDate(report.reviewedAt)}` : ""}</p>}</div>}</CardContent></Card>
                <Card><CardHeader><CardTitle>Reported job content</CardTitle><CardDescription>Review the posting without leaving the moderation workspace.</CardDescription></CardHeader><CardContent className="space-y-5 text-sm leading-7"><div><p className="font-semibold">Description</p><p className="mt-1 whitespace-pre-line text-muted-foreground">{report.job.description}</p></div>{report.job.responsibilities && <div><p className="font-semibold">Responsibilities</p><p className="mt-1 whitespace-pre-line text-muted-foreground">{report.job.responsibilities}</p></div>}{report.job.requirements && <div><p className="font-semibold">Requirements</p><p className="mt-1 whitespace-pre-line text-muted-foreground">{report.job.requirements}</p></div>}</CardContent></Card>
            </div>
            <div className="space-y-6">
                <Card><CardHeader><CardTitle>Job moderation</CardTitle><CardDescription>Job visibility is separate from the report review decision above.</CardDescription></CardHeader><CardContent className="space-y-3">
                    {currentJob ? <Button className="w-full" variant={currentJob.moderationStatus === "HIDDEN" ? "outline" : "destructive"} disabled={Boolean(currentJob.deletedAt)} onClick={() => setModerationOpen(true)}>{currentJob.deletedAt ? <EyeOff /> : currentJob.moderationStatus === "HIDDEN" ? <Eye /> : <EyeOff />}{currentJob.deletedAt ? "Job record is deleted" : currentJob.moderationStatus === "HIDDEN" ? "Restore job visibility" : "Hide reported job"}</Button> : <Button className="w-full" variant="outline" disabled>Loading job moderation...</Button>}
                    <Button asChild className="w-full" variant="outline"><Link href={`/admin/jobs/${report.job.id}`}>Open job moderation record</Link></Button>
                </CardContent></Card>
                <Card><CardHeader><CardTitle className="flex items-center gap-2"><UserRound className="size-5 text-primary" /> Reporter</CardTitle><CardDescription>Reporter identity is available to platform administrators only.</CardDescription></CardHeader><CardContent className="space-y-2 text-sm"><p className="font-semibold">{report.reporter.firstName} {report.reporter.lastName}</p><p className="text-muted-foreground">{report.reporter.email}</p><Button asChild variant="outline" size="sm" className="mt-2"><Link href={`/admin/users/${report.reporter.id}`}>View user</Link></Button></CardContent></Card>
                <Card><CardHeader><CardTitle className="flex items-center gap-2"><Building2 className="size-5 text-primary" /> Job context</CardTitle></CardHeader><CardContent className="space-y-3 text-sm"><div><p className="font-medium">Company</p><Link href={`/admin/companies/${report.job.company.id}`} className="text-primary hover:underline">{report.job.company.name}</Link></div><div><p className="font-medium">Category</p><p className="text-muted-foreground">{report.job.category.name}</p></div><div><p className="font-medium">Employer status</p><p className="text-muted-foreground">{formatAdminLabel(report.job.status)}</p></div><div><p className="font-medium">Reports on this job</p><p className="text-muted-foreground">{report.job._count.reports}</p></div><div><p className="font-medium">Applications</p><p className="text-muted-foreground">{report.job._count.applications}</p></div></CardContent></Card>
            </div>
        </div>
        {statusOpen && <ReportStatusDialog report={report} open={statusOpen} onOpenChange={setStatusOpen} />}
        {moderationOpen && currentJob && <JobModerationDialog job={currentJob} open={moderationOpen} onOpenChange={setModerationOpen} />}
    </div>;
}
