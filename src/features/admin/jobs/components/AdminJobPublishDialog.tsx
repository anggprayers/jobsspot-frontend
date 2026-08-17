"use client";

import { useMemo, useState } from "react";
import { CalendarDays } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { getAdminErrorMessage } from "../../shared/utils/adminFormatters";
import { usePublishAdminJob } from "../hooks/useAdminJobs";
import type { AdminJobDetails } from "../types/adminJob";

function defaultDeadline(job: AdminJobDetails) {
    const current = job.applicationDeadline ? new Date(job.applicationDeadline) : null;
    if (current && current > new Date()) return current.toISOString().slice(0, 10);

    const value = new Date();
    value.setDate(value.getDate() + 30);
    return value.toISOString().slice(0, 10);
}

export default function AdminJobPublishDialog({ job, open, onOpenChange }: { job: AdminJobDetails; open: boolean; onOpenChange: (open: boolean) => void }) {
    const initialDeadline = useMemo(() => defaultDeadline(job), [job]);
    const [deadline, setDeadline] = useState(initialDeadline);
    const mutation = usePublishAdminJob(job.id);

    async function handlePublish() {
        const toastId = toast.loading("Publishing job...");
        try {
            const response = await mutation.mutateAsync({ applicationDeadline: deadline ? new Date(`${deadline}T23:59:59`).toISOString() : undefined });
            toast.success(response.message, { id: toastId, description: "The job is now public on JobsSpot." });
            onOpenChange(false);
        } catch (error) {
            toast.error(getAdminErrorMessage(error, "Unable to publish this job."), { id: toastId });
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Publish job</DialogTitle>
                    <DialogDescription>Confirm the application deadline before making this job public.</DialogDescription>
                </DialogHeader>
                <div className="space-y-3">
                    <Label htmlFor="admin-publish-deadline">Application deadline</Label>
                    <Input id="admin-publish-deadline" type="date" value={deadline} min={new Date().toISOString().slice(0, 10)} onChange={(event) => setDeadline(event.target.value)} />
                    <div className="flex gap-2 rounded-xl border border-blue-200 bg-blue-50 p-3 text-sm text-blue-900">
                        <CalendarDays className="mt-0.5 size-4 shrink-0" />
                        <p>JobsSpot suggests 30 days from publication. Platform Admin can override this date when the employer gives a different deadline.</p>
                    </div>
                </div>
                <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                    <Button type="button" onClick={() => void handlePublish()} disabled={mutation.isPending}>{mutation.isPending ? "Publishing..." : "Publish Job"}</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
