"use client";

import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

import { getAdminErrorMessage } from "../../shared/utils/adminFormatters";
import { useArchiveAdminJob } from "../hooks/useAdminJobs";
import type { AdminJobDetails } from "../types/adminJob";

export default function AdminJobArchiveDialog({ job, open, onOpenChange }: { job: AdminJobDetails; open: boolean; onOpenChange: (open: boolean) => void }) {
    const mutation = useArchiveAdminJob(job.id);

    async function handleArchive() {
        const toastId = toast.loading("Archiving job...");
        try {
            const response = await mutation.mutateAsync();
            toast.success(response.message, { id: toastId });
            onOpenChange(false);
        } catch (error) {
            toast.error(getAdminErrorMessage(error, "Unable to archive this job."), { id: toastId });
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader><DialogTitle>Archive job?</DialogTitle><DialogDescription>This removes the job from public listings and keeps the record/history available to Platform Admin.</DialogDescription></DialogHeader>
                <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                    <Button type="button" variant="destructive" onClick={() => void handleArchive()} disabled={mutation.isPending}>{mutation.isPending ? "Archiving..." : "Archive Job"}</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
