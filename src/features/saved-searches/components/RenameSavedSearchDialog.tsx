"use client";

import {
    LoaderCircle,
    Pencil,
    Save,
    X,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { useUpdateSavedSearch } from "../hooks/useSavedSearches";
import type { SavedSearch } from "../types/savedSearch";
import { getSavedSearchErrorMessage } from "../utils/savedSearchFormatters";

type RenameSavedSearchDialogProps = Readonly<{
    savedSearch: SavedSearch;
    onClose: () => void;
}>;

export default function RenameSavedSearchDialog({
    savedSearch,
    onClose,
}: RenameSavedSearchDialogProps) {
    const [name, setName] = useState(
        savedSearch.name,
    );
    const [errorMessage, setErrorMessage] =
        useState("");

    const updateMutation = useUpdateSavedSearch();

    function handleClose() {
        if (!updateMutation.isPending) {
            onClose();
        }
    }

    async function handleSubmit(
        event: React.FormEvent<HTMLFormElement>,
    ) {
        event.preventDefault();

        const normalizedName = name.trim();

        if (!normalizedName) {
            setErrorMessage(
                "Enter a name for this saved search.",
            );
            return;
        }

        setErrorMessage("");

        const toastId = toast.loading(
            "Renaming saved search...",
        );

        try {
            await updateMutation.mutateAsync({
                savedSearchId: savedSearch.id,
                data: {
                    name: normalizedName,
                },
            });

            toast.success(
                "Saved search renamed successfully.",
                {
                    id: toastId,
                },
            );

            onClose();
        } catch (error) {
            const message = getSavedSearchErrorMessage(
                error,
                "Unable to rename this saved search.",
            );

            setErrorMessage(message);

            toast.error(message, {
                id: toastId,
            });
        }
    }

    return (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
            <button
                type="button"
                aria-label="Close rename search dialog"
                disabled={updateMutation.isPending}
                onClick={handleClose}
                className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm disabled:cursor-not-allowed"
            />

            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="rename-search-title"
                className="relative z-10 w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl sm:p-8"
            >
                <button
                    type="button"
                    aria-label="Close rename search dialog"
                    disabled={updateMutation.isPending}
                    onClick={handleClose}
                    className="absolute right-4 top-4 inline-flex size-10 items-center justify-center rounded-xl text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    <X className="size-5" />
                </button>

                <div className="flex size-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                    <Pencil className="size-5" />
                </div>

                <h2
                    id="rename-search-title"
                    className="mt-5 pr-10 text-2xl font-bold text-slate-950"
                >
                    Rename saved search
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-600">
                    Change the name without changing the
                    filters stored in this search.
                </p>

                <form
                    onSubmit={(event) =>
                        void handleSubmit(event)
                    }
                    className="mt-6"
                >
                    <label
                        htmlFor="rename-saved-search"
                        className="text-sm font-semibold text-slate-900"
                    >
                        Search name
                    </label>

                    <input
                        id="rename-saved-search"
                        type="text"
                        value={name}
                        disabled={updateMutation.isPending}
                        maxLength={100}
                        autoFocus
                        onChange={(event) => {
                            setName(event.target.value);
                            setErrorMessage("");
                        }}
                        className={`mt-2 min-h-12 w-full rounded-xl border bg-white px-4 py-3 text-slate-950 outline-none transition-colors focus:ring-4 ${
                            errorMessage
                                ? "border-red-400 focus:border-red-500 focus:ring-red-100"
                                : "border-slate-300 focus:border-blue-500 focus:ring-blue-100"
                        }`}
                    />

                    {errorMessage && (
                        <p className="mt-2 text-sm font-medium text-red-600">
                            {errorMessage}
                        </p>
                    )}

                    <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                        <button
                            type="button"
                            disabled={updateMutation.isPending}
                            onClick={handleClose}
                            className="inline-flex min-h-11 items-center justify-center rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={updateMutation.isPending}
                            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {updateMutation.isPending ? (
                                <>
                                    <LoaderCircle className="size-4 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Save className="size-4" />
                                    Save name
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
