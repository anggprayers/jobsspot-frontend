"use client";

import { LoaderCircle } from "lucide-react";
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
import { useRejectAdminJobSubmission } from "../hooks/useAdminJobSubmissions";

export default function RejectJobSubmissionDialog({
    submissionId,
    jobTitle,
    open,
    onOpenChange,
}: {
    submissionId: string;
    jobTitle: string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}) {
    const [reason, setReason] = useState("");
    const mutation = useRejectAdminJobSubmission(submissionId);
    const isValid = reason.trim().length >= 5;

    async function handleReject() {
        if (!isValid || mutation.isPending) return;

        const toastId = toast.loading("Rejecting submission...");

        try {
            const response = await mutation.mutateAsync({ reason: reason.trim() });
            toast.success(response.message, { id: toastId });
            setReason("");
            onOpenChange(false);
        } catch (error) {
            toast.error(getAdminErrorMessage(error, "Unable to reject this submission."), {
                id: toastId,
            });
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Reject job submission</DialogTitle>
                    <DialogDescription>
                        Record why {jobTitle} will not move forward. This note is stored for platform-admin review.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-2">
                    <Label htmlFor="job-submission-reject-reason">Reason</Label>
                    <Textarea
                        id="job-submission-reject-reason"
                        value={reason}
                        onChange={(event) => setReason(event.target.value)}
                        placeholder="Explain why the submission is being rejected..."
                        rows={5}
                        maxLength={2000}
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                        <span>At least 5 characters.</span>
                        <span>{reason.length}/2,000</span>
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)} disabled={mutation.isPending}>
                        Cancel
                    </Button>
                    <Button variant="destructive" onClick={() => void handleReject()} disabled={!isValid || mutation.isPending}>
                        {mutation.isPending && <LoaderCircle className="animate-spin" />}
                        Reject submission
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
