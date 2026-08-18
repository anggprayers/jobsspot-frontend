"use client";
import Link from "next/link";
import { FileWarning, Filter, RefreshCcw } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { formatAdminDate, formatAdminLabel, getAdminErrorMessage } from "../../shared/utils/adminFormatters";
import { useAdminJobReports } from "../hooks/useAdminJobReports";
import type { JobReportReason, JobReportStatus } from "../types/adminJobReport";

const reasons: JobReportReason[] = ["SCAM_FRAUD", "MISLEADING", "DISCRIMINATION", "SPAM_DUPLICATE", "INAPPROPRIATE", "OTHER"];
const statuses: JobReportStatus[] = ["PENDING", "UNDER_REVIEW", "RESOLVED", "DISMISSED"];

function statusClass(status: JobReportStatus) {
    if (status === "PENDING") return "border-amber-200 bg-amber-50 text-amber-700";
    if (status === "UNDER_REVIEW") return "border-blue-200 bg-blue-50 text-blue-700";
    if (status === "RESOLVED") return "border-emerald-200 bg-emerald-50 text-emerald-700";
    return "border-slate-200 bg-slate-50 text-slate-600";
}

export default function AdminJobReportsPage() {
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState<"ALL" | JobReportStatus>("ALL");
    const [reason, setReason] = useState<"ALL" | JobReportReason>("ALL");
    const [sort, setSort] = useState<"NEWEST" | "OLDEST">("NEWEST");
    const [page, setPage] = useState(1);
    const debouncedSearch = useDebouncedValue(search, 350);
    const reportsQuery = useAdminJobReports({ page, limit: 20, ...(debouncedSearch.trim() && { search: debouncedSearch.trim() }), status, reason, sort });
    const reports = reportsQuery.data?.reports ?? [];
    const pagination = reportsQuery.data?.pagination;

    return <div className="mx-auto w-full max-w-7xl space-y-6">
        <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="text-sm font-semibold text-primary">Trust & safety</p><h1 className="mt-1 text-3xl font-bold tracking-tight">Job reports</h1><p className="mt-2 text-muted-foreground">Review concerns submitted by job seekers and record a clear moderation outcome.</p></div><Button variant="outline" onClick={() => void reportsQuery.refetch()} disabled={reportsQuery.isFetching}><RefreshCcw className={reportsQuery.isFetching ? "animate-spin" : ""} /> Refresh</Button></section>
        <Card><CardHeader><CardTitle className="flex items-center gap-2"><Filter className="size-5 text-primary" /> Filters</CardTitle><CardDescription>Search reports by job, company, or reporting account.</CardDescription></CardHeader><CardContent className="grid gap-3 md:grid-cols-4">
            <Input value={search} onChange={(event) => { setSearch(event.target.value); setPage(1); }} placeholder="Job, company, reporter..." />
            <Select value={status} onValueChange={(value) => { setStatus(value as typeof status); setPage(1); }}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="ALL">All statuses</SelectItem>{statuses.map((item) => <SelectItem key={item} value={item}>{formatAdminLabel(item)}</SelectItem>)}</SelectContent></Select>
            <Select value={reason} onValueChange={(value) => { setReason(value as typeof reason); setPage(1); }}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="ALL">All report reasons</SelectItem>{reasons.map((item) => <SelectItem key={item} value={item}>{formatAdminLabel(item)}</SelectItem>)}</SelectContent></Select>
            <Select value={sort} onValueChange={(value) => setSort(value as typeof sort)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="NEWEST">Newest first</SelectItem><SelectItem value="OLDEST">Oldest first</SelectItem></SelectContent></Select>
        </CardContent></Card>
        <Card className="overflow-hidden"><CardHeader><CardTitle className="flex items-center gap-2"><FileWarning className="size-5 text-primary" /> Submitted reports</CardTitle><CardDescription>{pagination ? `${pagination.totalItems} reports found.` : "Loading reports..."}</CardDescription></CardHeader><CardContent className="p-0">
            {reportsQuery.isError && <div className="m-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{getAdminErrorMessage(reportsQuery.error, "Unable to load job reports.")}</div>}
            {!reportsQuery.isLoading && !reportsQuery.isError && reports.length === 0 && <div className="p-12 text-center text-sm text-muted-foreground">No job reports match these filters.</div>}
            {reports.length > 0 && <div className="overflow-x-auto"><table className="w-full min-w-[1050px] text-left text-sm"><thead className="border-y bg-muted/40 text-xs uppercase text-muted-foreground"><tr><th className="px-5 py-3">Report</th><th className="px-5 py-3">Job</th><th className="px-5 py-3">Reporter</th><th className="px-5 py-3">Status</th><th className="px-5 py-3">Submitted</th><th className="px-5 py-3 text-right">Action</th></tr></thead><tbody className="divide-y">{reports.map((report) => <tr key={report.id} className="hover:bg-muted/20">
                <td className="px-5 py-4"><p className="font-semibold">{formatAdminLabel(report.reason)}</p>{report.details && <p className="mt-1 max-w-xs truncate text-xs text-muted-foreground">{report.details}</p>}</td>
                <td className="px-5 py-4"><p className="font-semibold">{report.job.title}</p><p className="mt-1 text-xs text-muted-foreground">{report.job.company.name}{report.job.adminHiddenAt ? " · Hidden by JobsSpot" : ""}</p></td>
                <td className="px-5 py-4"><p>{report.reporter.firstName} {report.reporter.lastName}</p><p className="mt-1 text-xs text-muted-foreground">{report.reporter.email}</p></td>
                <td className="px-5 py-4"><span className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${statusClass(report.status)}`}>{formatAdminLabel(report.status)}</span></td>
                <td className="px-5 py-4 text-xs text-muted-foreground">{formatAdminDate(report.createdAt)}</td>
                <td className="px-5 py-4 text-right"><Button asChild size="sm" variant="outline"><Link href={`/admin/reports/${report.id}`}>Review report</Link></Button></td>
            </tr>)}</tbody></table></div>}
        </CardContent></Card>
        {pagination && pagination.totalPages > 1 && <div className="flex items-center justify-end gap-3"><Button variant="outline" disabled={!pagination.hasPreviousPage} onClick={() => setPage((value) => Math.max(1, value - 1))}>Previous</Button><span className="text-sm text-muted-foreground">Page {pagination.page} of {pagination.totalPages}</span><Button variant="outline" disabled={!pagination.hasNextPage} onClick={() => setPage((value) => value + 1)}>Next</Button></div>}
    </div>;
}
