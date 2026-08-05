"use client";

import {
    LoaderCircle,
    Save,
    SearchCheck,
    X,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { useCreateSavedSearch } from "../hooks/useSavedSearches";
import type { SavedSearchFiltersInput } from "../types/savedSearch";
import {
    getDraftSavedSearchFilterLabels,
    getSavedSearchErrorMessage,
} from "../utils/savedSearchFormatters";

type SaveSearchDialogProps = Readonly<{
    filters: SavedSearchFiltersInput;
    onClose: () => void;
}>;

export default function SaveSearchDialog({
    filters,
    onClose,
}: SaveSearchDialogProps) {
    const [name, setName] = useState("");
    const [errorMessage, setErrorMessage] =
        useState("");

    const createMutation = useCreateSavedSearch();
    const filterLabels =
        getDraftSavedSearchFilterLabels(filters);

    const hasActiveFilters =
        filterLabels.length > 0;

    function handleClose() {
        if (!createMutation.isPending) {
            onClose();
        }
    }

    async function handleSubmit(
        event: React.FormEvent<HTMLFormElement>,
    ) {
        event.preventDefault();

        const normalizedName = name.trim();

        if (!hasActiveFilters) {
            setErrorMessage(
                "Choose at least one keyword, location, category, or filter before saving.",
            );
            return;
        }

        if (!normalizedName) {
            setErrorMessage(
                "Enter a name for this saved search.",
            );
            return;
        }

        setErrorMessage("");

        const toastId = toast.loading(
            "Saving your search...",
        );

        try {
            await createMutation.mutateAsync({
                name: normalizedName,
                ...filters,
            });

            toast.success("Search saved successfully.", {
                id: toastId,
            });

            onClose();
        } catch (error) {
            const message = getSavedSearchErrorMessage(
                error,
                "Unable to save this search.",
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
                aria-label="Close save search dialog"
                disabled={createMutation.isPending}
                onClick={handleClose}
                className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm disabled:cursor-not-allowed"
            />

            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="save-search-title"
                className="relative z-10 w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl sm:p-8"
            >
                <button
                    type="button"
                    aria-label="Close save search dialog"
                    disabled={createMutation.isPending}
                    onClick={handleClose}
                    className="absolute right-4 top-4 inline-flex size-10 items-center justify-center rounded-xl text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    <X className="size-5" />
                </button>

                <div className="flex size-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                    <SearchCheck className="size-6" />
                </div>

                <h2
                    id="save-search-title"
                    className="mt-5 pr-10 text-2xl font-bold text-slate-950"
                >
                    Save this search
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-600">
                    Give these filters a name so you can run
                    the same search again from your account.
                </p>

                <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
                        Current filters
                    </p>

                    <div className="mt-3 flex flex-wrap gap-2">
                        {filterLabels.length > 0 ? (
                            filterLabels.map((label, index) => (
                                <span
                                    key={`${label}-${index}`}
                                    className="rounded-full border border-blue-100 bg-white px-3 py-1.5 text-sm font-semibold text-blue-700"
                                >
                                    {label}
                                </span>
                            ))
                        ) : (
                            <span className="text-sm font-medium text-amber-700">
                                Choose at least one search term or filter first.
                            </span>
                        )}
                    </div>
                </div>

                <form
                    onSubmit={(event) =>
                        void handleSubmit(event)
                    }
                    className="mt-6"
                >
                    <label
                        htmlFor="saved-search-name"
                        className="text-sm font-semibold text-slate-900"
                    >
                        Search name
                    </label>

                    <input
                        id="saved-search-name"
                        type="text"
                        value={name}
                        disabled={createMutation.isPending}
                        maxLength={100}
                        autoFocus
                        onChange={(event) => {
                            setName(event.target.value);
                            setErrorMessage("");
                        }}
                        placeholder="Example: Remote junior developer jobs"
                        className={`mt-2 min-h-12 w-full rounded-xl border bg-white px-4 py-3 text-slate-950 outline-none transition-colors placeholder:text-slate-400 focus:ring-4 ${
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
                            disabled={createMutation.isPending}
                            onClick={handleClose}
                            className="inline-flex min-h-11 items-center justify-center rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={
                                createMutation.isPending ||
                                !hasActiveFilters
                            }
                            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {createMutation.isPending ? (
                                <>
                                    <LoaderCircle className="size-4 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Save className="size-4" />
                                    Save search
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
