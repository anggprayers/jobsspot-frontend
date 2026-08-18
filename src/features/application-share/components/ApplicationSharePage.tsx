"use client";

import Link from "next/link";
import { BriefcaseBusiness, Clock3, Download, FileText, ShieldCheck, UserRound } from "lucide-react";

import { Button } from "@/components/ui/button";
import { JOBS_SPOT_TIME_ZONE } from "@/lib/jobsSpotDateTime";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getAdminErrorMessage } from "@/features/admin/shared/utils/adminFormatters";
import { useSharedApplication, useSharedCoverLetterDownload, useSharedResumeDownload } from "../hooks/useApplicationShare";

function formatDate(value: string) {
    return new Intl.DateTimeFormat("en-US", {
        timeZone: JOBS_SPOT_TIME_ZONE,
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
        timeZoneName: "short",
    }).format(new Date(value));
}

function formatFileSize(bytes: number | null) {
    if (bytes === null) return "";
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function openSecureFile(url: string) {
    const link = document.createElement("a");
    link.href = url;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    document.body.appendChild(link);
    link.click();
    link.remove();
}

export default function ApplicationSharePage({ token }: { token: string }) {
    const shareQuery = useSharedApplication(token);
    const resumeMutation = useSharedResumeDownload(token);
    const coverLetterMutation = useSharedCoverLetterDownload(token);

    if (shareQuery.isLoading) {
        return <main className="min-h-screen bg-slate-50 px-4 py-16"><div className="mx-auto max-w-3xl rounded-2xl border bg-white p-10 text-center text-slate-600">Opening secure application...</div></main>;
    }

    if (shareQuery.isError || !shareQuery.data) {
        return (
            <main className="min-h-screen bg-slate-50 px-4 py-16">
                <div className="mx-auto max-w-3xl rounded-2xl border border-red-200 bg-white p-8 text-center shadow-sm">
                    <ShieldCheck className="mx-auto size-12 text-red-500" />
                    <h1 className="mt-4 text-2xl font-bold">Secure link unavailable</h1>
                    <p className="mx-auto mt-3 max-w-xl text-slate-600">{getAdminErrorMessage(shareQuery.error, "This link is invalid, expired, or has been revoked.")}</p>
                    <Button asChild variant="outline" className="mt-6"><Link href="/">Go to JobsSpot</Link></Button>
                </div>
            </main>
        );
    }

    const { application, expiresAt } = shareQuery.data;

    return (
        <main className="min-h-screen bg-slate-50 px-4 py-10 sm:py-16">
            <div className="mx-auto max-w-4xl space-y-6">
                <div className="flex flex-col justify-between gap-4 rounded-2xl border bg-white p-6 shadow-sm sm:flex-row sm:items-center">
                    <div>
                        <div className="flex items-center gap-2 text-sm font-semibold text-emerald-700"><ShieldCheck className="size-4" /> Secure JobsSpot application</div>
                        <h1 className="mt-2 text-2xl font-bold sm:text-3xl">{application.applicantName}</h1>
                        <p className="mt-2 text-slate-600">{application.jobTitle} · {application.companyName}</p>
                    </div>
                    <div className="rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-600"><Clock3 className="mr-2 inline size-4" /> Expires {formatDate(expiresAt)}</div>
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                    {application.resume && (
                        <Card>
                            <CardHeader><CardTitle className="flex items-center gap-2"><UserRound className="size-5 text-primary" /> Resume</CardTitle><CardDescription>{application.resume.name} · {formatFileSize(application.resume.fileSize)}</CardDescription></CardHeader>
                            <CardContent><Button className="w-full" disabled={resumeMutation.isPending} onClick={async () => { const result = await resumeMutation.mutateAsync(); openSecureFile(result.downloadUrl); }}><Download /> Open resume</Button></CardContent>
                        </Card>
                    )}
                    {(application.coverLetter || application.coverLetterFile) && (
                        <Card>
                            <CardHeader><CardTitle className="flex items-center gap-2"><FileText className="size-5 text-primary" /> Cover letter</CardTitle><CardDescription>{application.coverLetterFile?.name ? `${application.coverLetterFile.name} · ${formatFileSize(application.coverLetterFile.fileSize)}` : "Submitted cover letter"}</CardDescription></CardHeader>
                            <CardContent className="space-y-4">
                                {application.coverLetter && <div className="whitespace-pre-wrap rounded-xl bg-slate-50 p-4 text-sm leading-6 text-slate-700">{application.coverLetter}</div>}
                                {application.coverLetterFile?.name && <Button className="w-full" variant="outline" disabled={coverLetterMutation.isPending} onClick={async () => { const result = await coverLetterMutation.mutateAsync(); openSecureFile(result.downloadUrl); }}><Download /> Open cover letter file</Button>}
                            </CardContent>
                        </Card>
                    )}
                </div>

                <div className="rounded-2xl border bg-white p-5 text-sm leading-6 text-slate-600">
                    <BriefcaseBusiness className="mr-2 inline size-4 text-primary" /> This link was created by JobsSpot Platform Admin for hiring review. Do not forward it. Access expires automatically and may be revoked earlier.
                </div>
            </div>
        </main>
    );
}
