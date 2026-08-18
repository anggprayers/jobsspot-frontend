"use client";

import { useRef, useState, type ChangeEvent } from "react";
import { AlertCircle, Building2, Camera, LoaderCircle, Trash2, X } from "lucide-react";
import { toast } from "sonner";

import { useDeleteCompanyLogo } from "../hooks/useDeleteCompanyLogo";
import { useUploadCompanyLogo } from "../hooks/useUploadCompanyLogo";

type CompanyLogoUploaderProps = Readonly<{
    companyId: string;
    companyName: string;
    logoUrl: string | null;
    accessToken: string;
    canEdit: boolean;
}>;

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const ALLOWED_FILE_TYPES = ["image/jpeg", "image/png", "image/webp"];

function getMutationErrorMessage(error: unknown, fallback: string): string {
    return error instanceof Error ? error.message : fallback;
}

export default function CompanyLogoUploader({
    companyId,
    companyName,
    logoUrl,
    accessToken,
    canEdit,
}: CompanyLogoUploaderProps) {
    const inputRef = useRef<HTMLInputElement>(null);

    const [validationError, setValidationError] = useState("");

    const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] = useState(false);

    const uploadLogoMutation = useUploadCompanyLogo({
        companyId,
        accessToken,
    });

    const deleteLogoMutation = useDeleteCompanyLogo({
        companyId,
        accessToken,
    });

    const isProcessing = uploadLogoMutation.isPending || deleteLogoMutation.isPending;

    const clearErrors = () => {
        setValidationError("");
        uploadLogoMutation.reset();
        deleteLogoMutation.reset();
    };

    const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];

        event.target.value = "";

        if (!file) {
            return;
        }

        clearErrors();

        if (!ALLOWED_FILE_TYPES.includes(file.type)) {
            const message = "Only JPG, PNG, and WebP images are allowed.";

            setValidationError(message);
            toast.error(message);

            return;
        }

        if (file.size > MAX_FILE_SIZE) {
            const message = "The logo cannot exceed 5 MB.";

            setValidationError(message);
            toast.error(message);

            return;
        }

        const toastId = toast.loading(
            logoUrl ? "Replacing company logo..." : "Uploading company logo...",
        );

        try {
            await uploadLogoMutation.mutateAsync(file);

            toast.success(logoUrl ? "Company logo replaced." : "Company logo uploaded.", {
                id: toastId,
                description: "The new logo is now visible on your company profile.",
            });
        } catch (error) {
            toast.error(getMutationErrorMessage(error, "Unable to upload the company logo."), {
                id: toastId,
                description: "Check the image and try again.",
            });
        }
    };

    const handleDeleteLogo = async () => {
        clearErrors();

        const toastId = toast.loading("Deleting company logo...");

        try {
            await deleteLogoMutation.mutateAsync();

            toast.success("Company logo deleted.", {
                id: toastId,
                description: "The logo was removed from your company profile.",
            });

            setIsDeleteConfirmationOpen(false);
        } catch (error) {
            toast.error(getMutationErrorMessage(error, "Unable to delete the company logo."), {
                id: toastId,
                description: "Please try again.",
            });
        }
    };

    const mutationError =
        uploadLogoMutation.error instanceof Error
            ? uploadLogoMutation.error.message
            : deleteLogoMutation.error instanceof Error
              ? deleteLogoMutation.error.message
              : "Unable to update the company logo.";

    return (
        <>
            <div>
                <div className="relative -mt-14 h-28 w-28">
                    <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-2xl border-4 border-white bg-slate-100 shadow-sm">
                        {logoUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                                src={logoUrl}
                                alt={`${companyName} logo`}
                                className="h-full w-full object-cover"
                            />
                        ) : (
                            <Building2 size={42} className="text-slate-400" />
                        )}

                        {isProcessing && (
                            <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-slate-950/60">
                                <LoaderCircle size={26} className="animate-spin text-white" />
                            </div>
                        )}
                    </div>

                    {canEdit && (
                        <>
                            <button
                                type="button"
                                onClick={() => inputRef.current?.click()}
                                disabled={isProcessing}
                                aria-label={
                                    logoUrl ? "Replace company logo" : "Upload company logo"
                                }
                                title={logoUrl ? "Replace company logo" : "Upload company logo"}
                                className="absolute -right-2 -bottom-2 inline-flex h-10 w-10 items-center justify-center rounded-full border-4 border-white bg-blue-600 text-white shadow-md transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {uploadLogoMutation.isPending ? (
                                    <LoaderCircle size={17} className="animate-spin" />
                                ) : (
                                    <Camera size={17} />
                                )}
                            </button>

                            {logoUrl && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        clearErrors();
                                        setIsDeleteConfirmationOpen(true);
                                    }}
                                    disabled={isProcessing}
                                    aria-label="Delete company logo"
                                    title="Delete company logo"
                                    className="absolute -bottom-2 -left-2 inline-flex h-10 w-10 items-center justify-center rounded-full border-4 border-white bg-red-600 text-white shadow-md transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    <Trash2 size={17} />
                                </button>
                            )}

                            <input
                                ref={inputRef}
                                type="file"
                                accept="image/jpeg,image/png,image/webp"
                                onChange={handleFileChange}
                                className="hidden"
                            />
                        </>
                    )}
                </div>

                {(validationError || uploadLogoMutation.isError || deleteLogoMutation.isError) && (
                    <div className="mt-5 flex max-w-md items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                        <AlertCircle size={18} className="mt-0.5 shrink-0" />

                        <p>{validationError || mutationError}</p>
                    </div>
                )}
            </div>

            {isDeleteConfirmationOpen && (
                <div
                    className="fixed inset-0 z-100 flex items-center justify-center bg-slate-950/60 p-4"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="delete-company-logo-title"
                >
                    <div
                        className="w-full max-w-md rounded-3xl bg-white shadow-2xl"
                    >
                        <div className="flex items-start justify-between border-b border-slate-200 px-6 py-5">
                            <div>
                                <h2
                                    id="delete-company-logo-title"
                                    className="text-xl font-bold text-slate-950"
                                >
                                    Delete company logo?
                                </h2>

                                <p className="mt-2 text-sm leading-6 text-slate-600">
                                    The current logo will be removed from your company profile.
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={() => setIsDeleteConfirmationOpen(false)}
                                disabled={deleteLogoMutation.isPending}
                                aria-label="Close delete confirmation"
                                className="rounded-xl p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-950 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="flex flex-col-reverse gap-3 px-6 py-5 sm:flex-row sm:justify-end">
                            <button
                                type="button"
                                onClick={() => setIsDeleteConfirmationOpen(false)}
                                disabled={deleteLogoMutation.isPending}
                                className="inline-flex min-h-11 items-center justify-center rounded-xl border border-slate-300 px-5 font-semibold text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                onClick={handleDeleteLogo}
                                disabled={deleteLogoMutation.isPending}
                                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-red-600 px-5 font-semibold text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {deleteLogoMutation.isPending && (
                                    <LoaderCircle size={18} className="animate-spin" />
                                )}

                                {deleteLogoMutation.isPending ? "Deleting..." : "Delete logo"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
