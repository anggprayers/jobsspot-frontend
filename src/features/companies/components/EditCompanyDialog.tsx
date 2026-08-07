"use client";

import { useEffect, useState, type ComponentProps } from "react";
import { AlertCircle, LoaderCircle, X } from "lucide-react";
import { toast } from "sonner";

import { useUpdateCompany } from "../hooks/useUpdateCompany";
import type { ManagedCompany, UpdateCompanyInput } from "../types/managedCompany";

type EditCompanyDialogProps = Readonly<{
    isOpen: boolean;
    onClose: () => void;
    company: ManagedCompany;
    accessToken: string;
}>;

type CompanyFormState = {
    name: string;
    description: string;
    websiteUrl: string;
    industry: string;
    companySize: string;
    location: string;
};

type FormSubmitEvent = Parameters<NonNullable<ComponentProps<"form">["onSubmit"]>>[0];

function createInitialFormState(company: ManagedCompany): CompanyFormState {
    return {
        name: company.name,
        description: company.description ?? "",
        websiteUrl: company.websiteUrl ?? "",
        industry: company.industry ?? "",
        companySize: company.companySize ?? "",
        location: company.location ?? "",
    };
}

function emptyToNull(value: string): string | null {
    const trimmedValue = value.trim();

    return trimmedValue.length > 0 ? trimmedValue : null;
}

function getMutationErrorMessage(error: unknown): string {
    return error instanceof Error
        ? error.message
        : "Unable to update the company. Please try again.";
}

export default function EditCompanyDialog({
    isOpen,
    onClose,
    company,
    accessToken,
}: EditCompanyDialogProps) {
    const [form, setForm] = useState<CompanyFormState>(() => createInitialFormState(company));

    const [validationError, setValidationError] = useState("");

    const updateCompanyMutation = useUpdateCompany({
        companyId: company.id,
        accessToken,
    });

    const { reset: resetUpdateCompany, isPending: isUpdatingCompany } = updateCompanyMutation;

    useEffect(() => {
        if (!isOpen) {
            return;
        }

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape" && !isUpdatingCompany) {
                onClose();
            }
        };

        document.addEventListener("keydown", handleKeyDown);

        document.body.style.overflow = "hidden";

        return () => {
            document.removeEventListener("keydown", handleKeyDown);

            document.body.style.overflow = "";
        };
    }, [isOpen, isUpdatingCompany, onClose]);

    if (!isOpen) {
        return null;
    }

    const handleChange = (field: keyof CompanyFormState, value: string) => {
        setForm((currentForm) => ({
            ...currentForm,
            [field]: value,
        }));

        if (validationError) {
            setValidationError("");
        }

        if (updateCompanyMutation.isError) {
            resetUpdateCompany();
        }
    };

    const handleSubmit = async (event: FormSubmitEvent) => {
        event.preventDefault();

        const name = form.name.trim();

        if (!name) {
            const message = "Company name is required.";

            setValidationError(message);
            toast.error(message);

            return;
        }

        const data: UpdateCompanyInput = {
            name,
            description: emptyToNull(form.description),
            websiteUrl: emptyToNull(form.websiteUrl),
            industry: emptyToNull(form.industry),
            companySize: emptyToNull(form.companySize),
            location: emptyToNull(form.location),
        };

        const toastId = toast.loading("Saving company changes...");

        try {
            await updateCompanyMutation.mutateAsync(data);

            toast.success("Company updated successfully.", {
                id: toastId,
                description: "Your company profile information is now up to date.",
            });

            onClose();
        } catch (error) {
            toast.error(getMutationErrorMessage(error), {
                id: toastId,
                description: "Review the information and try again.",
            });
        }
    };

    const mutationError =
        updateCompanyMutation.error instanceof Error
            ? updateCompanyMutation.error.message
            : "Unable to update the company. Please try again.";

    return (
        <div
            className="fixed inset-0 z-100 flex items-center justify-center bg-slate-950/60 p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="edit-company-title"
        >
            <div
                className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white shadow-2xl"
            >
                <div className="flex items-start justify-between border-b border-slate-200 px-6 py-5 sm:px-8">
                    <div>
                        <h2 id="edit-company-title" className="text-2xl font-bold text-slate-950">
                            Edit company
                        </h2>

                        <p className="mt-1 text-sm text-slate-600">
                            Update the information shown to job seekers.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isUpdatingCompany}
                        aria-label="Close edit company dialog"
                        className="rounded-xl p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-950 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <X size={21} />
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="space-y-6 px-6 py-7 sm:px-8">
                        {(validationError || updateCompanyMutation.isError) && (
                            <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                                <AlertCircle size={19} className="mt-0.5 shrink-0" />

                                <p>{validationError || mutationError}</p>
                            </div>
                        )}

                        <div>
                            <label
                                htmlFor="company-name"
                                className="text-sm font-semibold text-slate-800"
                            >
                                Company name
                            </label>

                            <input
                                id="company-name"
                                type="text"
                                value={form.name}
                                onChange={(event) => handleChange("name", event.target.value)}
                                disabled={isUpdatingCompany}
                                maxLength={150}
                                required
                                className="mt-2 min-h-12 w-full rounded-xl border border-slate-300 px-4 text-slate-950 outline-none transition focus:border-blue-500 focus:ring-3 focus:ring-blue-100 disabled:bg-slate-100"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="company-description"
                                className="text-sm font-semibold text-slate-800"
                            >
                                Description
                            </label>

                            <textarea
                                id="company-description"
                                value={form.description}
                                onChange={(event) =>
                                    handleChange("description", event.target.value)
                                }
                                disabled={isUpdatingCompany}
                                rows={6}
                                maxLength={5000}
                                placeholder="Tell job seekers about your company."
                                className="mt-2 w-full resize-y rounded-xl border border-slate-300 px-4 py-3 text-slate-950 outline-none transition focus:border-blue-500 focus:ring-3 focus:ring-blue-100 disabled:bg-slate-100"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="company-website"
                                className="text-sm font-semibold text-slate-800"
                            >
                                Website
                            </label>

                            <input
                                id="company-website"
                                type="url"
                                value={form.websiteUrl}
                                onChange={(event) => handleChange("websiteUrl", event.target.value)}
                                disabled={isUpdatingCompany}
                                placeholder="https://example.com"
                                className="mt-2 min-h-12 w-full rounded-xl border border-slate-300 px-4 text-slate-950 outline-none transition focus:border-blue-500 focus:ring-3 focus:ring-blue-100 disabled:bg-slate-100"
                            />
                        </div>

                        <div className="grid gap-6 sm:grid-cols-2">
                            <div>
                                <label
                                    htmlFor="company-industry"
                                    className="text-sm font-semibold text-slate-800"
                                >
                                    Industry
                                </label>

                                <input
                                    id="company-industry"
                                    type="text"
                                    value={form.industry}
                                    onChange={(event) =>
                                        handleChange("industry", event.target.value)
                                    }
                                    disabled={isUpdatingCompany}
                                    placeholder="Information Technology"
                                    className="mt-2 min-h-12 w-full rounded-xl border border-slate-300 px-4 text-slate-950 outline-none transition focus:border-blue-500 focus:ring-3 focus:ring-blue-100 disabled:bg-slate-100"
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="company-size"
                                    className="text-sm font-semibold text-slate-800"
                                >
                                    Company size
                                </label>

                                <input
                                    id="company-size"
                                    type="text"
                                    value={form.companySize}
                                    onChange={(event) =>
                                        handleChange("companySize", event.target.value)
                                    }
                                    disabled={isUpdatingCompany}
                                    placeholder="11–50 employees"
                                    className="mt-2 min-h-12 w-full rounded-xl border border-slate-300 px-4 text-slate-950 outline-none transition focus:border-blue-500 focus:ring-3 focus:ring-blue-100 disabled:bg-slate-100"
                                />
                            </div>
                        </div>

                        <div>
                            <label
                                htmlFor="company-location"
                                className="text-sm font-semibold text-slate-800"
                            >
                                Location
                            </label>

                            <input
                                id="company-location"
                                type="text"
                                value={form.location}
                                onChange={(event) => handleChange("location", event.target.value)}
                                disabled={isUpdatingCompany}
                                placeholder="Makati, Philippines"
                                className="mt-2 min-h-12 w-full rounded-xl border border-slate-300 px-4 text-slate-950 outline-none transition focus:border-blue-500 focus:ring-3 focus:ring-blue-100 disabled:bg-slate-100"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col-reverse gap-3 border-t border-slate-200 px-6 py-5 sm:flex-row sm:justify-end sm:px-8">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isUpdatingCompany}
                            className="inline-flex min-h-11 items-center justify-center rounded-xl border border-slate-300 px-5 font-semibold text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={isUpdatingCompany}
                            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {isUpdatingCompany && (
                                <LoaderCircle size={18} className="animate-spin" />
                            )}

                            {isUpdatingCompany ? "Saving..." : "Save changes"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
