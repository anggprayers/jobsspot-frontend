"use client";

import Link from "next/link";
import { ArrowLeft, BriefcaseBusiness, CalendarDays, Download, ExternalLink, FileText, Link2, Mail, MapPin, Phone, RefreshCcw, UserRound } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatAdminDate, formatAdminLabel, getAdminErrorMessage, getAdminInitials } from "@/features/admin/shared/utils/adminFormatters";

import {
    useAdminApplication,
    useAdminApplicationCoverLetterDownload,
    useAdminApplicationResumeDownload,
    useRevokeAdminApplicationShareLink,
    useUpdateAdminApplicationStatus,
} from "../hooks/useAdminApplications";
import type { AdminManageableApplicationStatus } from "../types/adminApplication";
import ApplicationStatusBadge, { formatAdminApplicationStatus } from "./ApplicationStatusBadge";
import CreateApplicationShareLinkDialog from "./CreateApplicationShareLinkDialog";

const manageableStatuses: Array<{ value: AdminManageableApplicationStatus; label: string }> = [
    { value: "UNDER_REVIEW", label: "Under Review" },
    { value: "INTERVIEW", label: "Interview" },
    { value: "OFFERED", label: "Offered" },
    { value: "HIRED", label: "Hired" },
    { value: "REJECTED", label: "Not Selected" },
];

function formatFileSize(bytes: number | null | undefined): string {
    if (bytes === null || bytes === undefined) return "—";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function openSecureFile(downloadUrl: string) {
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    document.body.appendChild(link);
    link.click();
    link.remove();
}

export default function AdminApplicationDetailsPage({ applicationId }: { applicationId: string }) {
    const applicationQuery = useAdminApplication(applicationId);
    const statusMutation = useUpdateAdminApplicationStatus(applicationId);
    const resumeDownloadMutation = useAdminApplicationResumeDownload(applicationId);
    const coverLetterDownloadMutation = useAdminApplicationCoverLetterDownload(applicationId);
    const revokeMutation = useRevokeAdminApplicationShareLink(applicationId);
    const [selectedStatus, setSelectedStatus] = useState<AdminManageableApplicationStatus | "">("");

    if (applicationQuery.isLoading) {
        return <div className="mx-auto w-full max-w-7xl rounded-2xl border bg-white p-10 text-center text-muted-foreground">Loading application...</div>;
    }
    if (applicationQuery.isError || !applicationQuery.data?.application) {
        return (
            <div className="mx-auto w-full max-w-7xl space-y-5">
                <Button variant="outline" asChild><Link href="/admin/applications"><ArrowLeft /> Back to applications</Link></Button>
                <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-700">{getAdminErrorMessage(applicationQuery.error, "Unable to load this application.")}</div>
            </div>
        );
    }

    const application = applicationQuery.data.application;
    const applicant = application.applicant;
    const profile = applicant.jobSeekerProfile;
    const hasCoverLetter = Boolean(application.coverLetter || application.coverLetterFileName);
    const canChangeStatus = !applicant.isDeleted && application.status !== "WITHDRAWN";
    const availableStatuses = manageableStatuses.filter((item) => item.value !== application.status);

    async function handleStatusUpdate() {
        if (!selectedStatus) return;
        const toastId = toast.loading("Updating application status...");
        try {
            await statusMutation.mutateAsync({ status: selectedStatus });
            toast.success("Application status updated.", { id: toastId, description: `Candidate is now ${formatAdminApplicationStatus(selectedStatus).toLowerCase()}.` });
            setSelectedStatus("");
        } catch (error) {
            toast.error(getAdminErrorMessage(error, "Unable to update application status."), { id: toastId });
        }
    }

    async function handleResumeDownload() {
        const toastId = toast.loading("Preparing secure resume link...");
        try {
            const response = await resumeDownloadMutation.mutateAsync();
            openSecureFile(response.downloadUrl);
            toast.success("Resume opened securely.", { id: toastId, description: "The R2 signed link expires in five minutes." });
        } catch (error) {
            toast.error(getAdminErrorMessage(error, "Unable to open the submitted resume."), { id: toastId });
        }
    }

    async function handleCoverLetterDownload() {
        const toastId = toast.loading("Preparing secure cover-letter link...");
        try {
            const response = await coverLetterDownloadMutation.mutateAsync();
            openSecureFile(response.downloadUrl);
            toast.success("Cover letter opened securely.", { id: toastId, description: "The R2 signed link expires in five minutes." });
        } catch (error) {
            toast.error(getAdminErrorMessage(error, "Unable to open the submitted cover letter."), { id: toastId });
        }
    }

    async function handleRevoke(shareLinkId: string) {
        if (!window.confirm("Revoke this secure employer share link?")) return;
        try {
            await revokeMutation.mutateAsync(shareLinkId);
            toast.success("Secure share link revoked.");
        } catch (error) {
            toast.error(getAdminErrorMessage(error, "Unable to revoke the share link."));
        }
    }

    return (
        <div className="mx-auto w-full max-w-7xl space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <Button variant="outline" asChild><Link href="/admin/applications"><ArrowLeft /> Back to applications</Link></Button>
                <Button variant="outline" onClick={() => void applicationQuery.refetch()} disabled={applicationQuery.isFetching}><RefreshCcw className={applicationQuery.isFetching ? "animate-spin" : ""} /> Refresh</Button>
            </div>

            <section className="rounded-2xl border bg-white p-6 shadow-sm sm:p-8">
                <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-start">
                    <div className="flex min-w-0 items-start gap-4">
                        <div className="flex size-16 shrink-0 items-center justify-center rounded-full bg-blue-100 text-lg font-bold text-blue-700">{getAdminInitials(applicant.firstName, applicant.lastName)}</div>
                        <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-3">
                                <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{applicant.firstName} {applicant.lastName}</h1>
                                <ApplicationStatusBadge status={application.status} />
                            </div>
                            <p className="mt-2 text-muted-foreground">{profile?.headline ?? "Job applicant"}</p>
                            <p className="mt-2 text-sm text-muted-foreground">Applied {formatAdminDate(application.appliedAt)}</p>
                        </div>
                    </div>

                    <div className="w-full space-y-3 rounded-xl border bg-muted/30 p-4 lg:max-w-sm">
                        <p className="font-semibold">Update candidate status</p>
                        {canChangeStatus ? (
                            <>
                                <Select value={selectedStatus} onValueChange={(value) => setSelectedStatus(value as AdminManageableApplicationStatus)}>
                                    <SelectTrigger className="w-full bg-white"><SelectValue placeholder="Select new status" /></SelectTrigger>
                                    <SelectContent>{availableStatuses.map((item) => <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>)}</SelectContent>
                                </Select>
                                <Button className="w-full" disabled={!selectedStatus || statusMutation.isPending} onClick={() => void handleStatusUpdate()}>Update status</Button>
                                <p className="text-xs leading-5 text-muted-foreground">Use meaningful status changes only. Simply viewing an application should not notify the candidate.</p>
                            </>
                        ) : (
                            <p className="text-sm text-muted-foreground">{application.status === "WITHDRAWN" ? "This application was withdrawn and is read-only." : "The applicant account is no longer available."}</p>
                        )}
                    </div>
                </div>
            </section>

            <div className="grid gap-6 xl:grid-cols-[minmax(0,1.5fr)_minmax(340px,0.8fr)]">
                <div className="space-y-6">
                    <Card>
                        <CardHeader><CardTitle className="flex items-center gap-2"><BriefcaseBusiness className="size-5 text-primary" /> Job application</CardTitle><CardDescription>Exact job context tied to this application.</CardDescription></CardHeader>
                        <CardContent className="grid gap-4 sm:grid-cols-2">
                            <div><p className="text-xs font-semibold uppercase text-muted-foreground">Job</p><p className="mt-1 font-semibold">{application.job.title}</p><p className="text-sm text-muted-foreground">{application.job.company.name}</p></div>
                            <div><p className="text-xs font-semibold uppercase text-muted-foreground">Location</p><p className="mt-1">{application.job.location ?? "Not specified"}</p></div>
                            <div><p className="text-xs font-semibold uppercase text-muted-foreground">Work setup</p><p className="mt-1">{formatAdminLabel(application.job.employmentType)} · {formatAdminLabel(application.job.workplaceType)} · {formatAdminLabel(application.job.experienceLevel)}</p></div>
                            <div><p className="text-xs font-semibold uppercase text-muted-foreground">Category</p><p className="mt-1">{application.job.category.name}</p></div>
                            <div className="sm:col-span-2"><Button variant="outline" asChild><Link href={`/admin/jobs/${application.job.id}`}><ExternalLink /> Open admin job</Link></Button></div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader><CardTitle className="flex items-center gap-2"><FileText className="size-5 text-primary" /> Submitted documents</CardTitle><CardDescription>Platform Admin can securely open the exact files attached when the candidate applied.</CardDescription></CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex flex-col justify-between gap-3 rounded-xl border p-4 sm:flex-row sm:items-center">
                                <div><p className="font-semibold">Resume</p><p className="text-sm text-muted-foreground">{application.resume ? `${application.resume.name} · ${formatFileSize(application.resume.fileSize)}` : "No resume attached"}</p></div>
                                <Button variant="outline" disabled={!application.resume || resumeDownloadMutation.isPending || applicant.isDeleted} onClick={() => void handleResumeDownload()}><Download /> Open resume</Button>
                            </div>
                            <div className="rounded-xl border p-4">
                                <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                                    <div><p className="font-semibold">Cover letter</p><p className="text-sm text-muted-foreground">{application.coverLetterFileName ? `${application.coverLetterFileName} · ${formatFileSize(application.coverLetterFileSize)}` : application.coverLetter ? "Written cover letter" : "No cover letter submitted"}</p></div>
                                    {application.coverLetterFileName && <Button variant="outline" disabled={coverLetterDownloadMutation.isPending || applicant.isDeleted} onClick={() => void handleCoverLetterDownload()}><Download /> Open file</Button>}
                                </div>
                                {application.coverLetter && <div className="mt-4 whitespace-pre-wrap rounded-lg bg-muted/40 p-4 text-sm leading-6">{application.coverLetter}</div>}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader><CardTitle className="flex items-center gap-2"><Link2 className="size-5 text-primary" /> Employer sharing</CardTitle><CardDescription>Create expiring, revocable links instead of exposing permanent R2 URLs.</CardDescription></CardHeader>
                        <CardContent className="space-y-4">
                            <CreateApplicationShareLinkDialog applicationId={application.id} hasResume={Boolean(application.resume)} hasCoverLetter={hasCoverLetter} />
                            {application.shareLinks.length === 0 ? (
                                <p className="rounded-xl border border-dashed p-6 text-center text-sm text-muted-foreground">No secure share links have been created.</p>
                            ) : (
                                <div className="space-y-3">
                                    {application.shareLinks.map((share) => {
                                        const state = share.revokedAt ? "Revoked" : "Created";
                                        return (
                                            <div key={share.id} className="flex flex-col justify-between gap-3 rounded-xl border p-4 sm:flex-row sm:items-center">
                                                <div className="min-w-0 text-sm">
                                                    <div className="flex flex-wrap items-center gap-2"><span className="font-semibold">{state}</span><span className="text-muted-foreground">· {share.includeResume ? "Resume" : ""}{share.includeResume && share.includeCoverLetter ? " + " : ""}{share.includeCoverLetter ? "Cover letter" : ""}</span></div>
                                                    <p className="mt-1 text-muted-foreground">Expires {formatAdminDate(share.expiresAt)} · {share.accessCount} access{share.accessCount === 1 ? "" : "es"}</p>
                                                    {share.lastAccessedAt && <p className="text-muted-foreground">Last accessed {formatAdminDate(share.lastAccessedAt)}</p>}
                                                </div>
                                                {!share.revokedAt && <Button type="button" variant="outline" disabled={revokeMutation.isPending} onClick={() => void handleRevoke(share.id)}>Revoke</Button>}
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card>
                        <CardHeader><CardTitle className="flex items-center gap-2"><UserRound className="size-5 text-primary" /> Candidate</CardTitle></CardHeader>
                        <CardContent className="space-y-4 text-sm">
                            <div><p className="font-semibold">{applicant.firstName} {applicant.lastName}</p>{profile?.summary && <p className="mt-2 leading-6 text-muted-foreground">{profile.summary}</p>}</div>
                            {applicant.email && <a className="flex items-center gap-2 text-primary hover:underline" href={`mailto:${applicant.email}`}><Mail className="size-4" /> {applicant.email}</a>}
                            {applicant.phone && <a className="flex items-center gap-2 text-primary hover:underline" href={`tel:${applicant.phone}`}><Phone className="size-4" /> {applicant.phone}</a>}
                            {profile?.location && <p className="flex items-center gap-2"><MapPin className="size-4 text-muted-foreground" /> {profile.location}</p>}
                            {profile?.yearsOfExperience !== null && profile?.yearsOfExperience !== undefined && <p>{profile.yearsOfExperience} years of experience</p>}
                            {profile?.linkedInUrl && <a href={profile.linkedInUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-primary hover:underline"><ExternalLink className="size-4" /> LinkedIn profile</a>}
                            {profile?.websiteUrl && <a href={profile.websiteUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-primary hover:underline"><ExternalLink className="size-4" /> Website</a>}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader><CardTitle className="flex items-center gap-2"><CalendarDays className="size-5 text-primary" /> Application timeline</CardTitle></CardHeader>
                        <CardContent className="space-y-3 text-sm">
                            <div className="flex justify-between gap-4"><span className="text-muted-foreground">Applied</span><span>{formatAdminDate(application.appliedAt)}</span></div>
                            <div className="flex justify-between gap-4"><span className="text-muted-foreground">Reviewed</span><span>{formatAdminDate(application.reviewedAt)}</span></div>
                            <div className="flex justify-between gap-4"><span className="text-muted-foreground">Withdrawn</span><span>{formatAdminDate(application.withdrawnAt)}</span></div>
                            <div className="flex justify-between gap-4"><span className="text-muted-foreground">Updated</span><span>{formatAdminDate(application.updatedAt)}</span></div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
