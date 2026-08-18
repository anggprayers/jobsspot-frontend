"use client";

import { useState } from "react";
import { Building2, LoaderCircle, RotateCcw, ShieldBan } from "lucide-react";
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
import { useUpdateAdminCompanySuspension } from "../hooks/useAdminCompanies";
import type { AdminCompanyDetails, AdminCompanyListItem } from "../types/adminCompany";

type ModeratedCompany = AdminCompanyListItem | AdminCompanyDetails;

type CompanySuspensionDialogProps = {
    company: ModeratedCompany;
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

export default function CompanySuspensionDialog({
    company,
    open,
    onOpenChange,
}: CompanySuspensionDialogProps) {
    const isSuspended = company.status === "SUSPENDED";
    const [reason, setReason] = useState("");
    const mutation = useUpdateAdminCompanySuspension(company.id);
    const reasonIsValid = isSuspended || reason.trim().length >= 10;

    async function handleSubmit() {
        if (mutation.isPending || !reasonIsValid) {
            return;
        }

        const toastId = toast.loading(
            isSuspended ? "Restoring company..." : "Suspending company...",
        );

        try {
            const response = await mutation.mutateAsync({
                suspended: !isSuspended,
                ...(!isSuspended && { reason: reason.trim() }),
            });

            toast.success(response.message, {
                id: toastId,
                description: isSuspended
                    ? "The preserved company workspace is available again."
                    : "Public listings and employer workspace access are now blocked.",
            });
            onOpenChange(false);
        } catch (error) {
            toast.error(
                getAdminErrorMessage(
                    error,
                    isSuspended
                        ? "Unable to restore this company."
                        : "Unable to suspend this company.",
                ),
                { id: toastId },
            );
        }
    }

    function handleOpenChange(nextOpen: boolean) {
        if (!nextOpen) {
            setReason("");
        }

        onOpenChange(nextOpen);
    }

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <div
                        className={`mb-2 flex size-11 items-center justify-center rounded-xl ${
                            isSuspended
                                ? "bg-emerald-50 text-emerald-600"
                                : "bg-red-50 text-red-600"
                        }`}
                    >
                        {isSuspended ? (
                            <RotateCcw className="size-5" />
                        ) : (
                            <ShieldBan className="size-5" />
                        )}
                    </div>
                    <DialogTitle>
                        {isSuspended ? "Restore company" : "Suspend company"}
                    </DialogTitle>
                    <DialogDescription>
                        {isSuspended
                            ? `Restore ${company.name} and make its preserved workspace available again.`
                            : `Suspend ${company.name}, hide its public presence, and block employer workspace access.`}
                    </DialogDescription>
                </DialogHeader>

                {!isSuspended && (
                    <div className="space-y-2">
                        <Label htmlFor="company-suspension-reason">Suspension reason</Label>
                        <Textarea
                            id="company-suspension-reason"
                            value={reason}
                            onChange={(event) => setReason(event.target.value)}
                            placeholder="Explain why this company is being suspended."
                            rows={5}
                            maxLength={500}
                        />
                        <div className="flex justify-between gap-3 text-xs text-muted-foreground">
                            <span>At least 10 characters are required.</span>
                            <span>{reason.length}/500</span>
                        </div>
                    </div>
                )}

                {!isSuspended && (
                    <div className="flex gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
                        <Building2 className="mt-0.5 size-5 shrink-0" />
                        <p>
                            Existing members, jobs, applications, and job statuses are preserved.
                            Restoration does not require recreating the company.
                        </p>
                    </div>
                )}

                {isSuspended && company.suspensionReason && (
                    <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
                        <p className="font-semibold">Current suspension reason</p>
                        <p className="mt-1 leading-6">{company.suspensionReason}</p>
                    </div>
                )}

                <DialogFooter>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        disabled={mutation.isPending}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="button"
                        variant={isSuspended ? "default" : "destructive"}
                        onClick={() => void handleSubmit()}
                        disabled={mutation.isPending || !reasonIsValid}
                    >
                        {mutation.isPending && <LoaderCircle className="animate-spin" />}
                        {isSuspended ? "Restore company" : "Suspend company"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
