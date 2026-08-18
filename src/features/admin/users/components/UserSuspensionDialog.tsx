"use client";

import { useState } from "react";
import { LoaderCircle, RotateCcw, ShieldBan } from "lucide-react";
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
import { useUpdateAdminUserSuspension } from "../hooks/useAdminUsers";
import type { AdminUserDetails, AdminUserListItem } from "../types/adminUser";

type ModeratedUser = AdminUserListItem | AdminUserDetails;

type UserSuspensionDialogProps = {
    user: ModeratedUser;
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

export default function UserSuspensionDialog({
    user,
    open,
    onOpenChange,
}: UserSuspensionDialogProps) {
    const isSuspended = user.status === "SUSPENDED";
    const [reason, setReason] = useState("");
    const mutation = useUpdateAdminUserSuspension(user.id);

    const reasonIsValid = isSuspended || reason.trim().length >= 10;

    async function handleSubmit() {
        if (mutation.isPending || !reasonIsValid) {
            return;
        }

        const toastId = toast.loading(
            isSuspended ? "Restoring account..." : "Suspending account...",
        );

        try {
            const response = await mutation.mutateAsync({
                suspended: !isSuspended,
                ...(!isSuspended && { reason: reason.trim() }),
            });

            toast.success(response.message, {
                id: toastId,
                ...(response.revokedSessions > 0 && {
                    description: `${response.revokedSessions} active session${response.revokedSessions === 1 ? " was" : "s were"} revoked.`,
                }),
            });

            onOpenChange(false);
        } catch (error) {
            toast.error(
                getAdminErrorMessage(
                    error,
                    isSuspended
                        ? "Unable to restore this user account."
                        : "Unable to suspend this user account.",
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
                        {isSuspended ? "Restore user account" : "Suspend user account"}
                    </DialogTitle>

                    <DialogDescription>
                        {isSuspended
                            ? `Restore access for ${user.firstName} ${user.lastName}. The user will need to sign in again.`
                            : `Suspend ${user.firstName} ${user.lastName} and revoke all active refresh sessions.`}
                    </DialogDescription>
                </DialogHeader>

                {!isSuspended && (
                    <div className="space-y-2">
                        <Label htmlFor="suspension-reason">Suspension reason</Label>
                        <Textarea
                            id="suspension-reason"
                            value={reason}
                            onChange={(event) => setReason(event.target.value)}
                            placeholder="Explain why this account is being suspended."
                            rows={5}
                            maxLength={500}
                        />
                        <div className="flex justify-between gap-3 text-xs text-muted-foreground">
                            <span>At least 10 characters are required.</span>
                            <span>{reason.length}/500</span>
                        </div>
                    </div>
                )}

                {isSuspended && user.suspensionReason && (
                    <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
                        <p className="font-semibold">Current suspension reason</p>
                        <p className="mt-1 leading-6">{user.suspensionReason}</p>
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
                        {isSuspended ? "Restore account" : "Suspend account"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
