"use client";
import { LoaderCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { getAdminErrorMessage } from "../../shared/utils/adminFormatters";
import { useUpdateAdminJobReportStatus } from "../hooks/useAdminJobReports";
import type { AdminJobReportDetails, JobReportStatus } from "../types/adminJobReport";

type Props = { report: AdminJobReportDetails; open: boolean; onOpenChange: (open: boolean) => void };
type ReviewStatus = Exclude<JobReportStatus, "PENDING">;

export default function ReportStatusDialog({ report, open, onOpenChange }: Props) {
    const [status, setStatus] = useState<ReviewStatus>(report.status === "PENDING" ? "UNDER_REVIEW" : report.status);
    const [note, setNote] = useState(report.resolutionNote ?? "");
    const mutation = useUpdateAdminJobReportStatus(report.id);
    const finalStatus = status === "RESOLVED" || status === "DISMISSED";
    const valid = !finalStatus || note.trim().length >= 5;

    async function handleSave() {
        if (!valid || mutation.isPending) return;
        const toastId = toast.loading("Updating report review...");
        try {
            const response = await mutation.mutateAsync({ status, ...(finalStatus && { resolutionNote: note.trim() }) });
            toast.success(response.message, { id: toastId });
            onOpenChange(false);
        } catch (error) {
            toast.error(getAdminErrorMessage(error, "Unable to update this report."), { id: toastId });
        }
    }

    return <Dialog open={open} onOpenChange={onOpenChange}><DialogContent className="sm:max-w-lg">
        <DialogHeader><DialogTitle>Update report review</DialogTitle><DialogDescription>Track the report through review, then record a final outcome.</DialogDescription></DialogHeader>
        <div className="space-y-4">
            <div className="space-y-2"><Label>Status</Label><Select value={status} onValueChange={(value) => setStatus(value as ReviewStatus)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="UNDER_REVIEW">Under review</SelectItem><SelectItem value="RESOLVED">Resolved</SelectItem><SelectItem value="DISMISSED">Dismissed</SelectItem></SelectContent></Select></div>
            {finalStatus && <div className="space-y-2"><Label htmlFor="resolution-note">Resolution note</Label><Textarea id="resolution-note" value={note} onChange={(event) => setNote(event.target.value)} maxLength={1000} rows={5} placeholder="Record what was reviewed and why this outcome was chosen." /><div className="flex justify-between text-xs text-muted-foreground"><span>At least 5 characters are required for a final outcome.</span><span>{note.length}/1000</span></div></div>}
        </div>
        <DialogFooter><Button variant="outline" onClick={() => onOpenChange(false)} disabled={mutation.isPending}>Cancel</Button><Button onClick={() => void handleSave()} disabled={!valid || mutation.isPending}>{mutation.isPending && <LoaderCircle className="animate-spin" />} Save review status</Button></DialogFooter>
    </DialogContent></Dialog>;
}
