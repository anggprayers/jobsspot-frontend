"use client";

import { useRef, useState, type ChangeEvent } from "react";
import { AlertCircle, Camera, ImageIcon, LoaderCircle, Trash2, X } from "lucide-react";
import { toast } from "sonner";

import { useDeleteCompanyBanner } from "../hooks/useDeleteCompanyBanner";
import { useUploadCompanyBanner } from "../hooks/useUploadCompanyBanner";

type CompanyBannerUploaderProps = Readonly<{
    companyId: string;
    companyName: string;
    bannerUrl: string | null;
    accessToken: string;
    canEdit: boolean;
}>;

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const ALLOWED_FILE_TYPES = ["image/jpeg", "image/png", "image/webp"];

function getMutationErrorMessage(error: unknown, fallback: string): string {
    return error instanceof Error ? error.message : fallback;
}

export default function CompanyBannerUploader({
    companyId,
    companyName,
    bannerUrl,
    accessToken,
    canEdit,
}: CompanyBannerUploaderProps) {
    const inputRef = useRef<HTMLInputElement>(null);

    const [validationError, setValidationError] = useState("");

    const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] = useState(false);

    const uploadBannerMutation = useUploadCompanyBanner({
        companyId,
        accessToken,
    });

    const deleteBannerMutation = useDeleteCompanyBanner({
        companyId,
        accessToken,
    });

    const isProcessing = uploadBannerMutation.isPending || deleteBannerMutation.isPending;

    const clearErrors = () => {
        setValidationError("");
        uploadBannerMutation.reset();
        deleteBannerMutation.reset();
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
            const message = "The banner cannot exceed 5 MB.";

            setValidationError(message);
            toast.error(message);

            return;
        }

        const toastId = toast.loading(
            bannerUrl ? "Replacing company banner..." : "Uploading company banner...",
        );

        try {
            await uploadBannerMutation.mutateAsync(file);

            toast.success(bannerUrl ? "Company banner replaced." : "Company banner uploaded.", {
                id: toastId,
                description: "The new banner is now visible on your company profile.",
            });
        } catch (error) {
            toast.error(getMutationErrorMessage(error, "Unable to upload the company banner."), {
                id: toastId,
                description: "Check the image and try again.",
            });
        }
    };

    const handleDeleteBanner = async () => {
        clearErrors();

        const toastId = toast.loading("Deleting company banner...");

        try {
            await deleteBannerMutation.mutateAsync();

            toast.success("Company banner deleted.", {
                id: toastId,
                description: "The banner was removed from your company profile.",
            });

            setIsDeleteConfirmationOpen(false);
        } catch (error) {
            toast.error(getMutationErrorMessage(error, "Unable to delete the company banner."), {
                id: toastId,
                description: "Please try again.",
            });
        }
    };

    const mutationError =
        uploadBannerMutation.error instanceof Error
            ? uploadBannerMutation.error.message
            : deleteBannerMutation.error instanceof Error
              ? deleteBannerMutation.error.message
              : "Unable to update the company banner.";

    return (
        <>
            <div>
                <div className="group relative h-44 overflow-hidden bg-slate-200 sm:h-52">
                    {bannerUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                            src={bannerUrl}
                            alt={`${companyName} banner`}
                            className="h-full w-full object-cover"
                        />
                    ) : (
                        <div className="flex h-full flex-col items-center justify-center gap-2 text-slate-500">
                            <ImageIcon size={34} />

                            <span>No banner uploaded</span>
                        </div>
                    )}

                    {isProcessing && (
                        <div className="absolute inset-0 flex items-center justify-center bg-slate-950/60">
                            <LoaderCircle size={30} className="animate-spin text-white" />
                        </div>
                    )}

                    {canEdit && !isProcessing && (
                        <div className="absolute top-4 right-4 flex gap-2 opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100">
                            <button
                                type="button"
                                onClick={() => inputRef.current?.click()}
                                aria-label={
                                    bannerUrl ? "Replace company banner" : "Upload company banner"
                                }
                                title={
                                    bannerUrl ? "Replace company banner" : "Upload company banner"
                                }
                                className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-white px-3 text-sm font-semibold text-slate-800 shadow-md transition-colors hover:bg-slate-100"
                            >
                                <Camera size={17} />

                                <span className="hidden sm:inline">
                                    {bannerUrl ? "Replace" : "Upload"}
                                </span>
                            </button>

                            {bannerUrl && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        clearErrors();
                                        setIsDeleteConfirmationOpen(true);
                                    }}
                                    aria-label="Delete company banner"
                                    title="Delete company banner"
                                    className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-red-600 text-white shadow-md transition-colors hover:bg-red-700"
                                >
                                    <Trash2 size={17} />
                                </button>
                            )}
                        </div>
                    )}

                    <input
                        ref={inputRef}
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        onChange={handleFileChange}
                        className="hidden"
                    />
                </div>

                {(validationError ||
                    uploadBannerMutation.isError ||
                    deleteBannerMutation.isError) && (
                    <div className="mx-6 mt-4 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700 sm:mx-8">
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
                    aria-labelledby="delete-company-banner-title"
                >
                    <div
                        className="w-full max-w-md rounded-3xl bg-white shadow-2xl"
                    >
                        <div className="flex items-start justify-between border-b border-slate-200 px-6 py-5">
                            <div>
                                <h2
                                    id="delete-company-banner-title"
                                    className="text-xl font-bold text-slate-950"
                                >
                                    Delete company banner?
                                </h2>

                                <p className="mt-2 text-sm leading-6 text-slate-600">
                                    The current banner will be removed from your company profile.
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={() => setIsDeleteConfirmationOpen(false)}
                                disabled={deleteBannerMutation.isPending}
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
                                disabled={deleteBannerMutation.isPending}
                                className="inline-flex min-h-11 items-center justify-center rounded-xl border border-slate-300 px-5 font-semibold text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                onClick={handleDeleteBanner}
                                disabled={deleteBannerMutation.isPending}
                                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-red-600 px-5 font-semibold text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {deleteBannerMutation.isPending && (
                                    <LoaderCircle size={18} className="animate-spin" />
                                )}

                                {deleteBannerMutation.isPending ? "Deleting..." : "Delete banner"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
