"use client";

import { LoaderCircle, Undo2 } from "lucide-react";
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

import { useWithdrawApplication } from "../hooks/useApplications";
import type { JobSeekerApplication } from "../types/application";
import { getApplicationErrorMessage } from "../utils/applicationFormatters";

type WithdrawApplicationDialogProps = Readonly<{
    application: JobSeekerApplication | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}>;

export default function WithdrawApplicationDialog({
    application,
    open,
    onOpenChange,
}: WithdrawApplicationDialogProps) {
    const withdrawMutation = useWithdrawApplication();

    function handleOpenChange(nextOpen: boolean) {
        if (withdrawMutation.isPending) {
            return;
        }

        onOpenChange(nextOpen);
    }

    async function handleWithdraw() {
        if (!application || withdrawMutation.isPending) {
            return;
        }

        const toastId = toast.loading("Withdrawing application...");

        try {
            const response = await withdrawMutation.mutateAsync(application.id);

            toast.success(response.message, {
                id: toastId,
                description: `Your application for ${application.job.title} is now marked as withdrawn.`,
            });

            onOpenChange(false);
        } catch (error) {
            toast.error(
                getApplicationErrorMessage(
                    error,
                    "Unable to withdraw the application.",
                ),
                {
                    id: toastId,
                },
            );
        }
    }

    return (
        <AlertDialog open={open} onOpenChange={handleOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Withdraw this application?</AlertDialogTitle>

                    <AlertDialogDescription>
                        {application
                            ? `Your application for "${application.job.title}" at ${application.job.company.name} will be marked as withdrawn. You will not be able to apply to this same job again.`
                            : "This application will be marked as withdrawn."}
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter>
                    <AlertDialogCancel disabled={withdrawMutation.isPending}>
                        Keep application
                    </AlertDialogCancel>

                    <AlertDialogAction
                        disabled={!application || withdrawMutation.isPending}
                        onClick={(event: MouseEvent<HTMLButtonElement>) => {
                            event.preventDefault();
                            void handleWithdraw();
                        }}
                        className="bg-destructive text-white hover:bg-destructive/90"
                    >
                        {withdrawMutation.isPending ? (
                            <>
                                <LoaderCircle className="animate-spin" />
                                Withdrawing...
                            </>
                        ) : (
                            <>
                                <Undo2 />
                                Withdraw application
                            </>
                        )}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
