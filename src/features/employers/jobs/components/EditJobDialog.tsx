"use client";

import axios from "axios";
import { useState } from "react";
import { toast } from "sonner";

import Modal from "@/components/ui/Modal";

import { useUpdateJob } from "../hooks/useUpdateJob";
import type { CompanyJob } from "../types/companyJob";

import JobForm from "./JobForm";

type EditJobDialogProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    companyId: string;
    job: CompanyJob;
    categories: {
        id: string;
        name: string;
    }[];
};

export default function EditJobDialog({
    open,
    onOpenChange,
    companyId,
    job,
    categories,
}: EditJobDialogProps) {
    const [submitError, setSubmitError] = useState("");
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

    const updateJob = useUpdateJob({
        companyId,
    });

    function closeDialog() {
        setSubmitError("");
        setHasUnsavedChanges(false);
        onOpenChange(false);
    }

    function requestClose() {
        if (updateJob.isPending) {
            return;
        }

        if (hasUnsavedChanges) {
            const shouldDiscard = window.confirm(
                "Discard your changes? Your unsaved job updates will be lost.",
            );

            if (!shouldDiscard) {
                return;
            }
        }

        closeDialog();
    }

    const formCategories = job.category.isActive
        ? categories
        : [
              { id: job.category.id, name: `${job.category.name} (inactive)` },
              ...categories.filter((category) => category.id !== job.category.id),
          ];

    return (
        <Modal
            isOpen={open}
            onClose={requestClose}
            title="Edit Job"
            description="Update your job posting."
            closeOnBackdropClick={false}
            isCloseDisabled={updateJob.isPending}
        >
            {submitError && (
                <p className="mb-5 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                    {submitError}
                </p>
            )}

            <JobForm
                categories={formCategories}
                submitLabel="Save Changes"
                isPending={updateJob.isPending}
                onDirtyChange={setHasUnsavedChanges}
                defaultValues={{
                    categoryId: job.category.id,
                    title: job.title,
                    description: job.description,
                    requirements: job.requirements ?? "",
                    responsibilities: job.responsibilities ?? "",
                    employmentType: job.employmentType,
                    workplaceType: job.workplaceType,
                    experienceLevel: job.experienceLevel,
                    city: job.city ?? "",
                    stateRegion: job.stateRegion ?? "",
                    countryCode: "US",
                    salaryMin: job.salaryMin ?? "",
                    salaryMax: job.salaryMax ?? "",
                    salaryCurrency: job.salaryCurrency ?? "",
                    salaryPeriod: job.salaryPeriod ?? "",
                    applicationDeadline: job.applicationDeadline?.slice(0, 10) ?? "",
                }}
                onCancel={requestClose}
                onSubmit={async (values) => {
                    setSubmitError("");

                    try {
                        await updateJob.mutateAsync({
                            jobId: job.id,
                            values,
                        });

                        closeDialog();

                        toast.success("Job updated successfully.", {
                            description: job.title,
                        });
                    } catch (error) {
                        if (axios.isAxiosError(error)) {
                            const message =
                                error.response?.data?.message ?? "Unable to update the job.";

                            setSubmitError(message);
                            toast.error(message);

                            return;
                        }

                        setSubmitError("Unable to update the job.");
                        toast.error("Unable to update the job.");
                    }
                }}
            />
        </Modal>
    );
}
