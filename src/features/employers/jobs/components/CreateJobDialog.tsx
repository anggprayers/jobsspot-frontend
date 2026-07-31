"use client";

import { AxiosError } from "axios";
import { Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import Modal from "@/components/ui/Modal";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useJobCategories } from "@/features/categories/hooks/useJobCategories";

import { useCreateJob } from "../hooks/useCreateJob";
import { mapJobFormToPayload } from "../types/companyJob";
import type { JobFormValues } from "../validations/jobFormSchema";

import JobForm from "./JobForm";

type ApiErrorResponse = {
    success?: boolean;
    message?: string;
};

export default function CreateJobDialog() {
    const [isOpen, setIsOpen] = useState(false);
    const [submitError, setSubmitError] = useState("");
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

    const { activeCompanyId } = useAuth();

    const {
        data,
        isLoading: areCategoriesLoading,
        isError: areCategoriesError,
        error: categoriesError,
        refetch: refetchCategories,
    } = useJobCategories();

    const createJobMutation = useCreateJob({
        companyId: activeCompanyId ?? "",
    });

    const categories = data?.categories ?? [];

    function closeDialog() {
        setSubmitError("");
        setHasUnsavedChanges(false);
        setIsOpen(false);
    }

    function requestClose() {
        if (createJobMutation.isPending) {
            return;
        }

        if (hasUnsavedChanges) {
            const shouldDiscard = window.confirm(
                "Discard your changes? The job information you entered will be lost.",
            );

            if (!shouldDiscard) {
                return;
            }
        }

        closeDialog();
    }

    async function handleSubmit(values: JobFormValues) {
        if (!activeCompanyId) {
            setSubmitError("No active company is selected.");
            return;
        }

        setSubmitError("");

        try {
            const payload = mapJobFormToPayload(values);

            await createJobMutation.mutateAsync(payload);

            closeDialog();

            toast.success("Job created successfully.", {
                description: "The new job was saved as a draft.",
            });
        } catch (error) {
            if (error instanceof AxiosError) {
                const responseData = error.response?.data as ApiErrorResponse | undefined;

                const message = responseData?.message ?? "Unable to create the job.";

                setSubmitError(message);
                toast.error(message);

                return;
            }

            setSubmitError("Unable to create the job.");
            toast.error("Unable to create the job.");
        }
    }

    return (
        <>
            <button
                type="button"
                onClick={() => {
                    setSubmitError("");
                    setHasUnsavedChanges(false);
                    setIsOpen(true);
                }}
                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition-colors hover:bg-blue-700"
            >
                <Plus size={18} />
                Create Job
            </button>

            <Modal
                isOpen={isOpen}
                onClose={requestClose}
                title="Create Job"
                description="Fill in the details below to create a new job posting."
                closeOnBackdropClick={false}
                isCloseDisabled={createJobMutation.isPending}
            >
                {areCategoriesLoading && (
                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-5 text-sm text-slate-600">
                        Loading job categories...
                    </div>
                )}

                {areCategoriesError && (
                    <div className="rounded-xl border border-red-200 bg-red-50 p-5">
                        <p className="text-sm text-red-700">
                            {categoriesError instanceof Error
                                ? categoriesError.message
                                : "Unable to load job categories."}
                        </p>

                        <button
                            type="button"
                            onClick={() => refetchCategories()}
                            className="mt-3 rounded-lg border border-red-300 px-4 py-2 text-sm font-medium text-red-700 transition hover:bg-red-100"
                        >
                            Try again
                        </button>
                    </div>
                )}

                {!areCategoriesLoading && !areCategoriesError && (
                    <>
                        {submitError && (
                            <div className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                                {submitError}
                            </div>
                        )}

                        <JobForm
                            categories={categories}
                            submitLabel="Create Job"
                            isPending={createJobMutation.isPending}
                            onDirtyChange={setHasUnsavedChanges}
                            onCancel={requestClose}
                            onSubmit={handleSubmit}
                        />
                    </>
                )}
            </Modal>
        </>
    );
}
