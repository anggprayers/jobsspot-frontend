"use client";

import { Eye, EyeOff, LoaderCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import { getAdminErrorMessage } from "../../shared/utils/adminFormatters";
import { useUpdateAdminJobModeration } from "../hooks/useAdminJobs";
import type { AdminJobDetails, AdminJobListItem } from "../types/adminJob";

type ModeratedJob = AdminJobListItem | AdminJobDetails;

type JobModerationDialogProps = {
    job: ModeratedJob;
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

export default function JobModerationDialog({ job, open, onOpenChange }: JobModerationDialogProps) {
    const isHidden = job.moderationStatus === "HIDDEN";
    const [reason, setReason] = useState("");
    const mutation = useUpdateAdminJobModeration(job.id);
    const reasonIsValid = isHidden || reason.trim().length >= 10;

    async function handleSubmit() {
        if (mutation.isPending || !reasonIsValid) return;

        const toastId = toast.loading(isHidden ? "Restoring job visibility..." : "Hiding job...");

        try {
            const response = await mutation.mutateAsync({
                hidden: !isHidden,
                ...(!isHidden && { reason: reason.trim() }),
            });

            toast.success(response.message, {
                id: toastId,
                description: isHidden
                    ? "The job is no longer under a JobsSpot moderation hold. Its normal status and expiration still apply."
                    : "The employer job record is preserved, but the posting is hidden from public job listings.",
            });
            onOpenChange(false);
        } catch (error) {
            toast.error(
                getAdminErrorMessage(error, isHidden ? "Unable to restore this job." : "Unable to hide this job."),
                { id: toastId },
            );
        }
    }

    function handleOpenChange(nextOpen: boolean) {
        if (!nextOpen) setReason("");
        onOpenChange(nextOpen);
    }

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <div className={`mb-2 flex size-11 items-center justify-center rounded-xl ${isHidden ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"}`}>
                        {isHidden ? <Eye className="size-5" /> : <EyeOff className="size-5" />}
                    </div>
                    <DialogTitle>{isHidden ? "Restore job visibility" : "Hide job from JobsSpot"}</DialogTitle>
                    <DialogDescription>
                        {isHidden
                            ? `Remove the platform moderation hold from ${job.title}.`
                            : `Hide ${job.title} from public JobsSpot listings while preserving the employer's job record and applications.`}
                    </DialogDescription>
                </DialogHeader>

                {!isHidden && (
                    <div className="space-y-2">
                        <Label htmlFor="job-moderation-reason">Moderation reason</Label>
                        <Textarea
                            id="job-moderation-reason"
                            value={reason}
                            onChange={(event) => setReason(event.target.value)}
                            placeholder="Explain why this job is being hidden. This reason is visible to the employer team."
                            rows={5}
                            maxLength={500}
                        />
                        <div className="flex justify-between gap-3 text-xs text-muted-foreground">
                            <span>At least 10 characters are required.</span>
                            <span>{reason.length}/500</span>
                        </div>
                    </div>
                )}

                {isHidden && job.adminHiddenReason && (
                    <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
                        <p className="font-semibold">Recorded moderation reason</p>
                        <p className="mt-1 leading-6">{job.adminHiddenReason}</p>
                    </div>
                )}

                <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={mutation.isPending}>
                        Cancel
                    </Button>
                    <Button
                        type="button"
                        variant={isHidden ? "default" : "destructive"}
                        onClick={() => void handleSubmit()}
                        disabled={mutation.isPending || !reasonIsValid}
                    >
                        {mutation.isPending && <LoaderCircle className="animate-spin" />}
                        {isHidden ? "Restore visibility" : "Hide job"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
