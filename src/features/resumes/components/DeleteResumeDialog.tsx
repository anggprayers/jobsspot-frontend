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

import { useDeleteResume } from "../hooks/useResumes";
import type { ResumeRecord } from "../types/resume";
import { getResumeErrorMessage } from "../utils/resumeFormatters";

type DeleteResumeDialogProps = {
    resume: ResumeRecord | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

export default function DeleteResumeDialog({
    resume,
    open,
    onOpenChange,
}: DeleteResumeDialogProps) {
    const deleteMutation = useDeleteResume();

    function handleOpenChange(nextOpen: boolean) {
        if (deleteMutation.isPending) {
            return;
        }

        onOpenChange(nextOpen);
    }

    async function handleDelete() {
        if (!resume || deleteMutation.isPending) {
            return;
        }

        const toastId = toast.loading("Deleting resume...");

        try {
            const response = await deleteMutation.mutateAsync(
                resume.id,
            );

            toast.success(response.message, {
                id: toastId,
                description: response.retainedForApplications
                    ? "The file remains privately available to applications that already use it."
                    : `"${resume.name}" was removed from your account.`,
            });

            onOpenChange(false);
        } catch (error) {
            toast.error(
                getResumeErrorMessage(
                    error,
                    "Unable to delete the resume.",
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
                    <AlertDialogTitle>Delete resume?</AlertDialogTitle>

                    <AlertDialogDescription>
                        {resume
                            ? `"${resume.name}" will be removed from your active resumes. Existing job applications will keep their historical resume access.`
                            : "This resume will be removed from your account."}
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter>
                    <AlertDialogCancel
                        disabled={deleteMutation.isPending}
                    >
                        Cancel
                    </AlertDialogCancel>

                    <AlertDialogAction
                        disabled={
                            !resume || deleteMutation.isPending
                        }
                        onClick={(
                            event: MouseEvent<HTMLButtonElement>,
                        ) => {
                            event.preventDefault();

                            void handleDelete();
                        }}
                        className="bg-destructive text-white hover:bg-destructive/90"
                    >
                        {deleteMutation.isPending ? (
                            <>
                                <LoaderCircle className="animate-spin" />
                                Deleting...
                            </>
                        ) : (
                            <>
                                <Trash2 />
                                Delete resume
                            </>
                        )}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
