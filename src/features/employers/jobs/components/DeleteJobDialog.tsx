"use client";

import axios from "axios";
import { useState } from "react";
import { toast } from "sonner";

import Modal from "@/components/ui/Modal";

import { useDeleteJob } from "../hooks/useDeleteJob";
import type { CompanyJob } from "../types/companyJob";

type DeleteJobDialogProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    companyId: string;
    job: CompanyJob;
};

export default function DeleteJobDialog({
    open,
    onOpenChange,
    companyId,
    job,
}: DeleteJobDialogProps) {
    const [submitError, setSubmitError] = useState("");

    const deleteJobMutation = useDeleteJob({
        companyId,
    });

    function handleClose() {
        if (deleteJobMutation.isPending) {
            return;
        }

        setSubmitError("");
        onOpenChange(false);
    }

    async function handleDelete() {
        setSubmitError("");

        try {
            await deleteJobMutation.mutateAsync(job.id);

            onOpenChange(false);

            toast.success("Job deleted successfully.", {
                description: `${job.title} was removed from your active listings.`,
            });
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const message = error.response?.data?.message ?? "Unable to delete the job.";

                setSubmitError(message);
                toast.error(message);

                return;
            }

            setSubmitError("Unable to delete the job.");
            toast.error("Unable to delete the job.");
        }
    }

    return (
        <Modal
            isOpen={open}
            onClose={handleClose}
            title="Delete Job"
            description="This job will be removed from your active listings."
            closeOnBackdropClick={false}
            isCloseDisabled={deleteJobMutation.isPending}
        >
            <div className="space-y-6">
                <div className="rounded-xl border border-red-200 bg-red-50 p-4">
                    <p className="font-medium text-red-900">Delete “{job.title}”?</p>

                    <p className="mt-2 text-sm text-red-700">
                        The job will disappear from your active listings. It can potentially be
                        restored later because JobsSpot uses soft deletion.
                    </p>
                </div>

                {submitError && (
                    <p className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                        {submitError}
                    </p>
                )}

                <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:justify-end">
                    <button
                        type="button"
                        onClick={handleClose}
                        disabled={deleteJobMutation.isPending}
                        className="rounded-lg border border-slate-300 px-5 py-2.5 font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        Cancel
                    </button>

                    <button
                        type="button"
                        onClick={handleDelete}
                        disabled={deleteJobMutation.isPending}
                        className="rounded-lg bg-red-600 px-5 py-2.5 font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {deleteJobMutation.isPending ? "Deleting..." : "Delete Job"}
                    </button>
                </div>
            </div>
        </Modal>
    );
}
