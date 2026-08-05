"use client";

import { LoaderCircle, XCircle } from "lucide-react";
import type { MouseEvent } from "react";
import { toast } from "sonner";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { useCancelCompanyInvitation } from "../hooks/useCompanyTeam";
import type { CompanyInvitation } from "../types/team";
import {
    getTeamErrorDescription,
    getTeamErrorMessage,
} from "../utils/teamFormatters";

type CancelInvitationDialogProps = {
    companyId: string;
    invitation: CompanyInvitation;
    canManage: boolean;
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

export default function CancelInvitationDialog({
    companyId,
    invitation,
    canManage,
    open,
    onOpenChange,
}: CancelInvitationDialogProps) {
    const cancelInvitationMutation = useCancelCompanyInvitation(companyId);

    function handleOpenChange(nextOpen: boolean) {
        if (cancelInvitationMutation.isPending) {
            return;
        }

        onOpenChange(nextOpen);
    }

    async function handleCancelInvitation() {
        if (!canManage || cancelInvitationMutation.isPending) {
            return;
        }

        const toastId = toast.loading("Cancelling company invitation...");

        try {
            const response = await cancelInvitationMutation.mutateAsync(invitation.id);

            toast.success(response.message, {
                id: toastId,
                description: `${invitation.email} can no longer use the invitation link.`,
            });

            onOpenChange(false);
        } catch (error) {
            toast.error(getTeamErrorMessage(error, "Unable to cancel the company invitation."), {
                id: toastId,
                description: getTeamErrorDescription(error),
            });
        }
    }

    return (
        <AlertDialog open={open} onOpenChange={handleOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Cancel this invitation?</AlertDialogTitle>

                    <AlertDialogDescription>
                        The invitation sent to {invitation.email} will stop working immediately. You
                        can send a new invitation later if needed.
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter>
                    <AlertDialogCancel disabled={cancelInvitationMutation.isPending}>
                        Keep invitation
                    </AlertDialogCancel>

                    <AlertDialogAction
                        disabled={!canManage || cancelInvitationMutation.isPending}
                        onClick={(event: MouseEvent<HTMLButtonElement>) => {
                            event.preventDefault();

                            void handleCancelInvitation();
                        }}
                        className="bg-destructive text-white hover:bg-destructive/90"
                    >
                        {cancelInvitationMutation.isPending ? (
                            <>
                                <LoaderCircle className="animate-spin" />
                                Cancelling...
                            </>
                        ) : (
                            <>
                                <XCircle />
                                Cancel invitation
                            </>
                        )}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
