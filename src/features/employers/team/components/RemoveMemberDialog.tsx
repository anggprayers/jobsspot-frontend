"use client";

import { LoaderCircle, Trash2 } from "lucide-react";
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

import { useRemoveCompanyMember } from "../hooks/useCompanyTeam";
import type { CompanyMember } from "../types/team";
import { getTeamErrorMessage } from "../utils/teamFormatters";

type RemoveMemberDialogProps = {
    companyId: string;
    member: CompanyMember;
    canRemove: boolean;
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

export default function RemoveMemberDialog({
    companyId,
    member,
    canRemove,
    open,
    onOpenChange,
}: RemoveMemberDialogProps) {
    const removeMemberMutation = useRemoveCompanyMember(companyId);

    function handleOpenChange(nextOpen: boolean) {
        if (removeMemberMutation.isPending) {
            return;
        }

        onOpenChange(nextOpen);
    }

    async function handleRemoveMember() {
        if (!canRemove || removeMemberMutation.isPending) {
            return;
        }

        const toastId = toast.loading("Removing team member...");

        try {
            const response = await removeMemberMutation.mutateAsync(member.id);

            toast.success(response.message, {
                id: toastId,
                description: `${member.user.firstName} ${member.user.lastName} no longer has access to this company.`,
            });

            onOpenChange(false);
        } catch (error) {
            toast.error(getTeamErrorMessage(error, "Unable to remove the team member."), {
                id: toastId,
            });
        }
    }

    return (
        <AlertDialog open={open} onOpenChange={handleOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Remove team member?</AlertDialogTitle>

                    <AlertDialogDescription>
                        {member.user.firstName} {member.user.lastName} will immediately lose access
                        to this company workspace. Their JobsSpot account will not be deleted.
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter>
                    <AlertDialogCancel disabled={removeMemberMutation.isPending}>
                        Cancel
                    </AlertDialogCancel>

                    <AlertDialogAction
                        disabled={!canRemove || removeMemberMutation.isPending}
                        onClick={(event: MouseEvent<HTMLButtonElement>) => {
                            event.preventDefault();

                            void handleRemoveMember();
                        }}
                        className="bg-destructive text-white hover:bg-destructive/90"
                    >
                        {removeMemberMutation.isPending ? (
                            <>
                                <LoaderCircle className="animate-spin" />
                                Removing...
                            </>
                        ) : (
                            <>
                                <Trash2 />
                                Remove member
                            </>
                        )}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
