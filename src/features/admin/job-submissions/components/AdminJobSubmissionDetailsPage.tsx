"use client";

import Link from "next/link";
import { ArrowLeft, BriefcaseBusiness, CheckCircle2, ExternalLink, LoaderCircle, Mail, Phone, RefreshCcw, XCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import { formatAdminDate, formatAdminLabel, getAdminErrorMessage } from "../../shared/utils/adminFormatters";
import { useAdminJobSubmission, useMarkAdminJobSubmissionContacted } from "../hooks/useAdminJobSubmissions";
import JobSubmissionStatusBadge from "./JobSubmissionStatusBadge";
import PublishJobSubmissionPanel from "./PublishJobSubmissionPanel";
import RejectJobSubmissionDialog from "./RejectJobSubmissionDialog";

export default function AdminJobSubmissionDetailsPage({ submissionId }: { submissionId: string }) {
    const [rejectOpen, setRejectOpen] = useState(false);
    const submissionQuery = useAdminJobSubmission(submissionId);
    const contactedMutation = useMarkAdminJobSubmissionContacted(submissionId);

    const submission = submissionQuery.data?.submission;

    async function handleMarkContacted() {
        if (!submission || contactedMutation.isPending) return;

        const toastId = toast.loading("Marking submission as contacted...");

        try {
            const response = await contactedMutation.mutateAsync({});
            toast.success(response.message, { id: toastId });
        } catch (error) {
            toast.error(getAdminErrorMessage(error, "Unable to mark this submission as contacted."), {
                id: toastId,
            });
        }
    }

    if (submissionQuery.isLoading) {
        return (
            <div className="mx-auto flex min-h-[40vh] w-full max-w-6xl items-center justify-center text-muted-foreground">
                <LoaderCircle className="mr-2 animate-spin" /> Loading job submission...
            </div>
        );
    }

    if (submissionQuery.isError || !submission) {
        return (
            <div className="mx-auto w-full max-w-6xl space-y-4">
                <Button asChild variant="outline">
                    <Link href="/admin/job-submissions"><ArrowLeft /> Back to submissions</Link>
                </Button>
                <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-red-700">
                    {getAdminErrorMessage(submissionQuery.error, "Unable to load this job submission.")}
                </div>
            </div>
        );
    }

    const isFinal = submission.status === "REJECTED" || submission.status === "PUBLISHED";

    return (
        <div className="mx-auto w-full max-w-6xl space-y-6">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                <div>
                    <Button asChild variant="ghost" className="mb-3 -ml-3">
                        <Link href="/admin/job-submissions"><ArrowLeft /> Job submissions</Link>
                    </Button>
                    <div className="flex flex-wrap items-center gap-3">
                        <h1 className="text-3xl font-bold tracking-tight">{submission.jobTitle}</h1>
                        <JobSubmissionStatusBadge status={submission.status} />
                    </div>
                    <p className="mt-2 text-muted-foreground">
                        {submission.referenceCode} · received {formatAdminDate(submission.createdAt)}
                    </p>
                </div>

                <Button variant="outline" onClick={() => void submissionQuery.refetch()} disabled={submissionQuery.isFetching}>
                    <RefreshCcw className={submissionQuery.isFetching ? "animate-spin" : ""} /> Refresh
                </Button>
            </div>

            <div className="grid gap-6 lg:grid-cols-[minmax(0,1.6fr)_minmax(300px,0.8fr)]">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><BriefcaseBusiness className="size-5 text-primary" /> Submitted job details</CardTitle>
                        <CardDescription>The original employer-provided information stays preserved here.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-5">
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div><p className="text-xs font-semibold uppercase text-muted-foreground">Company</p><p className="mt-1 font-semibold">{submission.companyName}</p></div>
                            <div><p className="text-xs font-semibold uppercase text-muted-foreground">Location</p><p className="mt-1">{submission.locationText}</p></div>
                            <div><p className="text-xs font-semibold uppercase text-muted-foreground">Work arrangement</p><p className="mt-1">{formatAdminLabel(submission.workplaceType)}</p></div>
                            <div><p className="text-xs font-semibold uppercase text-muted-foreground">Job type</p><p className="mt-1">{formatAdminLabel(submission.employmentType)}</p></div>
                            <div><p className="text-xs font-semibold uppercase text-muted-foreground">Salary / pay rate</p><p className="mt-1">{submission.salaryText || "Not provided"}</p></div>
                            <div><p className="text-xs font-semibold uppercase text-muted-foreground">Company website</p>{submission.companyWebsite ? <a className="mt-1 inline-flex items-center gap-1 text-primary hover:underline" href={submission.companyWebsite} target="_blank" rel="noreferrer">Open website <ExternalLink className="size-3.5" /></a> : <p className="mt-1">Not provided</p>}</div>
                        </div>
                        <div>
                            <p className="text-xs font-semibold uppercase text-muted-foreground">Description</p>
                            <p className="mt-2 whitespace-pre-wrap leading-7">{submission.description}</p>
                        </div>
                        {submission.internalNotes && (
                            <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
                                <p className="font-semibold">Internal review notes</p>
                                <p className="mt-1 whitespace-pre-wrap leading-6">{submission.internalNotes}</p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Submitter contact</CardTitle>
                            <CardDescription>Use these details to confirm arrangements off-platform.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {submission.contactName && <p className="font-semibold">{submission.contactName}</p>}
                            <a href={`mailto:${submission.contactEmail}`} className="flex min-w-0 items-center gap-2 text-sm text-primary hover:underline"><Mail className="size-4 shrink-0" /><span className="break-all">{submission.contactEmail}</span></a>
                            {submission.contactPhone && <a href={`tel:${submission.contactPhone}`} className="flex items-center gap-2 text-sm text-primary hover:underline"><Phone className="size-4" />{submission.contactPhone}</a>}
                            <div className="pt-2">
                                <Button className="w-full" variant={submission.status === "CONTACTED" ? "outline" : "default"} disabled={isFinal || submission.status === "CONTACTED" || contactedMutation.isPending} onClick={() => void handleMarkContacted()}>
                                    {contactedMutation.isPending ? <LoaderCircle className="animate-spin" /> : <CheckCircle2 />}
                                    {submission.status === "CONTACTED" ? "Already contacted" : "Mark as contacted"}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Review state</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2 text-sm">
                            <div className="flex justify-between gap-4"><span className="text-muted-foreground">Received</span><span>{formatAdminDate(submission.createdAt)}</span></div>
                            <div className="flex justify-between gap-4"><span className="text-muted-foreground">Contacted</span><span>{submission.contactedAt ? formatAdminDate(submission.contactedAt) : "—"}</span></div>
                            <div className="flex justify-between gap-4"><span className="text-muted-foreground">Reviewed</span><span>{submission.reviewedAt ? formatAdminDate(submission.reviewedAt) : "—"}</span></div>
                            {submission.reviewedBy && <div className="flex justify-between gap-4"><span className="text-muted-foreground">Reviewed by</span><span className="text-right">{submission.reviewedBy.firstName} {submission.reviewedBy.lastName}</span></div>}
                        </CardContent>
                    </Card>

                    {!isFinal && (
                        <Button variant="destructive" className="w-full" onClick={() => setRejectOpen(true)}>
                            <XCircle /> Reject submission
                        </Button>
                    )}

                    {submission.publishedJob && (
                        <Card className="border-emerald-200 bg-emerald-50/60">
                            <CardHeader>
                                <CardTitle className="text-emerald-900">Published successfully</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3 text-sm text-emerald-900">
                                <p>{submission.publishedJob.title}</p>
                                <Button asChild variant="outline" className="w-full bg-white">
                                    <Link href={`/admin/jobs/${submission.publishedJob.id}`}>Open admin job</Link>
                                </Button>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>

            {!isFinal && <PublishJobSubmissionPanel submission={submission} />}

            <RejectJobSubmissionDialog
                submissionId={submission.id}
                jobTitle={submission.jobTitle}
                open={rejectOpen}
                onOpenChange={setRejectOpen}
            />
        </div>
    );
}
