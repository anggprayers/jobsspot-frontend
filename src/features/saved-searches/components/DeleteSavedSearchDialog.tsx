"use client";

import {
    LoaderCircle,
    Trash2,
    X,
} from "lucide-react";
import { toast } from "sonner";

import { useDeleteSavedSearch } from "../hooks/useSavedSearches";
import type { SavedSearch } from "../types/savedSearch";
import { getSavedSearchErrorMessage } from "../utils/savedSearchFormatters";

type DeleteSavedSearchDialogProps = Readonly<{
    savedSearch: SavedSearch;
    onClose: () => void;
    onDeleted: () => void;
}>;

export default function DeleteSavedSearchDialog({
    savedSearch,
    onClose,
    onDeleted,
}: DeleteSavedSearchDialogProps) {
    const deleteMutation = useDeleteSavedSearch();

    function handleClose() {
        if (!deleteMutation.isPending) {
            onClose();
        }
    }

    async function handleDelete() {
        const toastId = toast.loading(
            "Deleting saved search...",
        );

        try {
            await deleteMutation.mutateAsync(
                savedSearch.id,
            );

            toast.success(
                "Saved search deleted successfully.",
                {
                    id: toastId,
                },
            );

            onDeleted();
        } catch (error) {
            toast.error(
                getSavedSearchErrorMessage(
                    error,
                    "Unable to delete this saved search.",
                ),
                {
                    id: toastId,
                },
            );
        }
    }

    return (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" aria-hidden="true" />

            <div
                role="alertdialog"
                aria-modal="true"
                aria-labelledby="delete-search-title"
                aria-describedby="delete-search-description"
                className="relative z-10 w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl sm:p-8"
            >
                <button
                    type="button"
                    aria-label="Close delete search dialog"
                    disabled={deleteMutation.isPending}
                    onClick={handleClose}
                    className="absolute right-4 top-4 inline-flex size-10 items-center justify-center rounded-xl text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    <X className="size-5" />
                </button>

                <div className="flex size-12 items-center justify-center rounded-2xl bg-red-50 text-red-600">
                    <Trash2 className="size-5" />
                </div>

                <h2
                    id="delete-search-title"
                    className="mt-5 pr-10 text-2xl font-bold text-slate-950"
                >
                    Delete saved search?
                </h2>

                <p
                    id="delete-search-description"
                    className="mt-2 text-sm leading-6 text-slate-600"
                >
                    “{savedSearch.name}” will be removed
                    from your account. This action cannot be
                    undone.
                </p>

                <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                    <button
                        type="button"
                        disabled={deleteMutation.isPending}
                        onClick={handleClose}
                        className="inline-flex min-h-11 items-center justify-center rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        Cancel
                    </button>

                    <button
                        type="button"
                        disabled={deleteMutation.isPending}
                        onClick={() =>
                            void handleDelete()
                        }
                        className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {deleteMutation.isPending ? (
                            <>
                                <LoaderCircle className="size-4 animate-spin" />
                                Deleting...
                            </>
                        ) : (
                            <>
                                <Trash2 className="size-4" />
                                Delete search
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
