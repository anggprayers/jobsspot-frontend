"use client";

import axios from "axios";
import {
    Award,
    ChevronDown,
    ChevronUp,
    Building2,
    CalendarDays,
    ExternalLink,
    Hash,
    LoaderCircle,
    Pencil,
    Plus,
    Trash2,
} from "lucide-react";
import { useState, type SubmitEvent } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

import {
    useCertifications,
    useCreateCertification,
    useDeleteCertification,
    useUpdateCertification,
} from "../hooks/useJobSeekerProfile";

import type { Certification, SaveCertificationRequest } from "../types/jobSeekerProfile";

const MAX_CERTIFICATIONS = 50;

function normalizeOptionalText(value: string): string | null {
    const normalizedValue = value.trim();

    return normalizedValue === "" ? null : normalizedValue;
}

function monthToIsoDate(value: string): string | null {
    return value ? `${value}-01` : null;
}

function toMonthInputValue(value: string | null): string {
    return value?.slice(0, 7) ?? "";
}

function formatMonthYear(value: string): string {
    return new Intl.DateTimeFormat("en-US", {
        month: "short",
        year: "numeric",
        timeZone: "UTC",
    }).format(new Date(value));
}

function formatCertificationDate(certification: Certification): string | null {
    if (!certification.issueDate && !certification.expirationDate) {
        return null;
    }

    const issueDate = certification.issueDate
        ? `Issued ${formatMonthYear(certification.issueDate)}`
        : null;

    const expirationDate = certification.expirationDate
        ? `Expires ${formatMonthYear(certification.expirationDate)}`
        : null;

    return [issueDate, expirationDate].filter(Boolean).join(" · ");
}

function isValidOptionalUrl(value: string): boolean {
    const normalizedValue = value.trim();

    if (!normalizedValue) {
        return true;
    }

    try {
        const url = new URL(normalizedValue);

        return url.protocol === "http:" || url.protocol === "https:";
    } catch {
        return false;
    }
}

function getApiErrorMessage(error: unknown, fallbackMessage: string): string {
    if (axios.isAxiosError<{ message?: string }>(error)) {
        return error.response?.data?.message ?? fallbackMessage;
    }

    return fallbackMessage;
}

type CertificationFormState = {
    name: string;
    issuingOrganization: string;
    issueDate: string;
    expirationDate: string;
    credentialId: string;
    credentialUrl: string;
};

function getInitialFormState(certification: Certification | null): CertificationFormState {
    return {
        name: certification?.name ?? "",
        issuingOrganization: certification?.issuingOrganization ?? "",
        issueDate: toMonthInputValue(certification?.issueDate ?? null),
        expirationDate: toMonthInputValue(certification?.expirationDate ?? null),
        credentialId: certification?.credentialId ?? "",
        credentialUrl: certification?.credentialUrl ?? "",
    };
}

type CertificationFormDialogProps = Readonly<{
    certification: Certification | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}>;

function CertificationFormDialog({
    certification,
    open,
    onOpenChange,
}: CertificationFormDialogProps) {
    const createMutation = useCreateCertification();
    const updateMutation = useUpdateCertification();

    const [form, setForm] = useState<CertificationFormState>(() =>
        getInitialFormState(certification),
    );
    const [formError, setFormError] = useState("");

    const isEditing = certification !== null;
    const isPending = createMutation.isPending || updateMutation.isPending;

    function updateField<K extends keyof CertificationFormState>(
        field: K,
        value: CertificationFormState[K],
    ) {
        setForm((current) => ({
            ...current,
            [field]: value,
        }));

        if (formError) {
            setFormError("");
        }
    }

    function validateForm(): string | null {
        if (!form.name.trim()) {
            return "Certification name is required.";
        }

        if (form.issueDate && form.expirationDate && form.expirationDate < form.issueDate) {
            return "Expiration date cannot be earlier than the issue date.";
        }

        if (!isValidOptionalUrl(form.credentialUrl)) {
            return "Enter a valid credential URL beginning with http:// or https://.";
        }

        return null;
    }

    async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
        event.preventDefault();

        const validationMessage = validateForm();

        if (validationMessage) {
            setFormError(validationMessage);
            return;
        }

        const data: SaveCertificationRequest = {
            name: form.name.trim(),
            issuingOrganization: normalizeOptionalText(form.issuingOrganization),
            issueDate: monthToIsoDate(form.issueDate),
            expirationDate: monthToIsoDate(form.expirationDate),
            credentialId: normalizeOptionalText(form.credentialId),
            credentialUrl: normalizeOptionalText(form.credentialUrl),
        };

        const toastId = toast.loading(
            isEditing ? "Updating certification..." : "Adding certification...",
        );

        try {
            const response = isEditing
                ? await updateMutation.mutateAsync({
                      certificationId: certification.id,
                      data,
                  })
                : await createMutation.mutateAsync(data);

            toast.success(response.message, {
                id: toastId,
            });

            onOpenChange(false);
        } catch (error) {
            toast.error(
                getApiErrorMessage(
                    error,
                    isEditing
                        ? "Unable to update this certification."
                        : "Unable to add this certification.",
                ),
                {
                    id: toastId,
                },
            );
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                className="max-h-[90vh] overflow-y-auto sm:max-w-2xl"
                onPointerDownOutside={(event) => event.preventDefault()}
                onEscapeKeyDown={(event) => {
                    if (isPending) {
                        event.preventDefault();
                    }
                }}
            >
                <DialogHeader>
                    <DialogTitle>
                        {isEditing ? "Edit certification" : "Add certification"}
                    </DialogTitle>

                    <DialogDescription>
                        Add professional certifications, licenses, and credentials that support your
                        qualifications.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid gap-5 sm:grid-cols-2">
                        <div>
                            <label htmlFor="certification-name" className="text-sm font-semibold">
                                Certification name
                            </label>

                            <Input
                                id="certification-name"
                                value={form.name}
                                maxLength={150}
                                placeholder="e.g. Responsive Web Design"
                                disabled={isPending}
                                onChange={(event) => updateField("name", event.target.value)}
                                className="mt-2"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="certification-organization"
                                className="text-sm font-semibold"
                            >
                                Issuing organization
                                <span className="font-normal text-slate-500"> (optional)</span>
                            </label>

                            <Input
                                id="certification-organization"
                                value={form.issuingOrganization}
                                maxLength={150}
                                placeholder="e.g. freeCodeCamp"
                                disabled={isPending}
                                onChange={(event) =>
                                    updateField("issuingOrganization", event.target.value)
                                }
                                className="mt-2"
                            />
                        </div>
                    </div>

                    <div className="grid gap-5 sm:grid-cols-2">
                        <div>
                            <label
                                htmlFor="certification-issue-date"
                                className="text-sm font-semibold"
                            >
                                Issue date
                                <span className="font-normal text-slate-500"> (optional)</span>
                            </label>

                            <Input
                                id="certification-issue-date"
                                type="month"
                                value={form.issueDate}
                                disabled={isPending}
                                onChange={(event) => updateField("issueDate", event.target.value)}
                                className="mt-2"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="certification-expiration-date"
                                className="text-sm font-semibold"
                            >
                                Expiration date
                                <span className="font-normal text-slate-500"> (optional)</span>
                            </label>

                            <Input
                                id="certification-expiration-date"
                                type="month"
                                value={form.expirationDate}
                                disabled={isPending}
                                onChange={(event) =>
                                    updateField("expirationDate", event.target.value)
                                }
                                className="mt-2"
                            />
                        </div>
                    </div>

                    <div className="grid gap-5 sm:grid-cols-2">
                        <div>
                            <label
                                htmlFor="certification-credential-id"
                                className="text-sm font-semibold"
                            >
                                Credential ID
                                <span className="font-normal text-slate-500"> (optional)</span>
                            </label>

                            <Input
                                id="certification-credential-id"
                                value={form.credentialId}
                                maxLength={200}
                                placeholder="e.g. RWD-123456"
                                disabled={isPending}
                                onChange={(event) =>
                                    updateField("credentialId", event.target.value)
                                }
                                className="mt-2"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="certification-credential-url"
                                className="text-sm font-semibold"
                            >
                                Credential URL
                                <span className="font-normal text-slate-500"> (optional)</span>
                            </label>

                            <Input
                                id="certification-credential-url"
                                type="url"
                                value={form.credentialUrl}
                                maxLength={500}
                                placeholder="https://..."
                                disabled={isPending}
                                onChange={(event) =>
                                    updateField("credentialUrl", event.target.value)
                                }
                                className="mt-2"
                            />
                        </div>
                    </div>

                    {formError && (
                        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                            {formError}
                        </p>
                    )}

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            disabled={isPending}
                            onClick={() => onOpenChange(false)}
                        >
                            Cancel
                        </Button>

                        <Button type="submit" disabled={isPending}>
                            {isPending ? (
                                <LoaderCircle className="animate-spin" />
                            ) : isEditing ? (
                                <Pencil />
                            ) : (
                                <Plus />
                            )}

                            {isPending
                                ? "Saving..."
                                : isEditing
                                  ? "Save changes"
                                  : "Add certification"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

type DeleteCertificationDialogProps = Readonly<{
    certification: Certification;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}>;

function DeleteCertificationDialog({
    certification,
    open,
    onOpenChange,
}: DeleteCertificationDialogProps) {
    const deleteMutation = useDeleteCertification();

    async function handleDelete() {
        const toastId = toast.loading("Removing certification...");

        try {
            const response = await deleteMutation.mutateAsync(certification.id);

            toast.success(response.message, {
                id: toastId,
            });

            onOpenChange(false);
        } catch (error) {
            toast.error(getApiErrorMessage(error, "Unable to remove this certification."), {
                id: toastId,
            });
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                onPointerDownOutside={(event) => event.preventDefault()}
                onEscapeKeyDown={(event) => {
                    if (deleteMutation.isPending) {
                        event.preventDefault();
                    }
                }}
            >
                <DialogHeader>
                    <DialogTitle>Remove certification?</DialogTitle>

                    <DialogDescription>
                        <strong>{certification.name}</strong>
                        {certification.issuingOrganization && (
                            <>
                                {" "}
                                from <strong>{certification.issuingOrganization}</strong>
                            </>
                        )}{" "}
                        will be permanently removed from your profile.
                    </DialogDescription>
                </DialogHeader>

                <DialogFooter>
                    <Button
                        type="button"
                        variant="outline"
                        disabled={deleteMutation.isPending}
                        onClick={() => onOpenChange(false)}
                    >
                        Cancel
                    </Button>

                    <Button
                        type="button"
                        disabled={deleteMutation.isPending}
                        onClick={() => void handleDelete()}
                        className="bg-red-600 text-white hover:bg-red-700"
                    >
                        {deleteMutation.isPending ? (
                            <LoaderCircle className="animate-spin" />
                        ) : (
                            <Trash2 />
                        )}

                        {deleteMutation.isPending ? "Removing..." : "Remove certification"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

type CertificationItemProps = Readonly<{
    certification: Certification;
    onEdit: (certification: Certification) => void;
    onDelete: (certification: Certification) => void;
}>;

function CertificationItem({ certification, onEdit, onDelete }: CertificationItemProps) {
    const certificationDate = formatCertificationDate(certification);

    return (
        <article className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                <div className="min-w-0">
                    <div className="flex items-start gap-3">
                        <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                            <Award className="size-5" />
                        </span>

                        <div className="min-w-0">
                            <h3 className="font-semibold text-slate-950">{certification.name}</h3>

                            {certification.issuingOrganization && (
                                <p className="mt-1 flex items-center gap-2 text-sm text-slate-700">
                                    <Building2 className="size-4 shrink-0" />
                                    {certification.issuingOrganization}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-600">
                        {certificationDate && (
                            <span className="flex items-center gap-2">
                                <CalendarDays className="size-4" />
                                {certificationDate}
                            </span>
                        )}

                        {certification.credentialId && (
                            <span className="flex items-center gap-2">
                                <Hash className="size-4" />
                                Credential ID: {certification.credentialId}
                            </span>
                        )}
                    </div>

                    {certification.credentialUrl && (
                        <a
                            href={certification.credentialUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700 hover:underline"
                        >
                            <ExternalLink className="size-4" />
                            View credential
                        </a>
                    )}
                </div>

                <div className="flex shrink-0 gap-2">
                    <Button type="button" variant="outline" onClick={() => onEdit(certification)}>
                        <Pencil />
                        Edit
                    </Button>

                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => onDelete(certification)}
                        className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                    >
                        <Trash2 />
                        Remove
                    </Button>
                </div>
            </div>
        </article>
    );
}

export default function JobSeekerCertificationCard() {
    const certificationsQuery = useCertifications();

    const [isExpanded, setIsExpanded] = useState(false);
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [certificationBeingEdited, setCertificationBeingEdited] = useState<Certification | null>(
        null,
    );
    const [certificationBeingDeleted, setCertificationBeingDeleted] =
        useState<Certification | null>(null);

    const certifications = certificationsQuery.data?.certifications ?? [];
    const hasReachedLimit = certifications.length >= MAX_CERTIFICATIONS;

    return (
        <>
            <Card>
                <CardHeader>
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div className="flex items-start gap-4">
                            <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                                <Award className="size-6" />
                            </div>

                            <div>
                                <CardTitle>Certifications</CardTitle>

                                <CardDescription className="mt-1">
                                    Add licenses, certificates, and professional credentials that
                                    support your qualifications.
                                </CardDescription>
                            </div>
                        </div>

                        <div className="flex flex-col items-start gap-2 sm:items-end">
                            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                                {certifications.length}/{MAX_CERTIFICATIONS}
                            </span>

                            <div className="flex w-full gap-2 sm:w-auto">
                                <Button
                                    type="button"
                                    variant="outline"
                                    aria-expanded={isExpanded}
                                    onClick={() => setIsExpanded((value) => !value)}
                                    className="flex-1 sm:flex-none"
                                >
                                    {isExpanded ? <ChevronUp /> : <ChevronDown />}
                                    {isExpanded ? "Hide" : "Show"}
                                </Button>
                                <Button
                                    type="button"
                                    disabled={hasReachedLimit}
                                    onClick={() => setIsAddDialogOpen(true)}
                                    className="flex-1 sm:flex-none"
                                >
                                    <Plus />
                                    Add certification
                                </Button>
                            </div>
                        </div>
                    </div>
                </CardHeader>

                {isExpanded && (
                    <CardContent>
                    {hasReachedLimit && (
                        <p className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
                            You have reached the maximum of {MAX_CERTIFICATIONS} certifications.
                        </p>
                    )}

                    {certificationsQuery.isPending && (
                        <div className="space-y-3">
                            <div className="h-36 animate-pulse rounded-2xl bg-slate-100" />
                            <div className="h-36 animate-pulse rounded-2xl bg-slate-100" />
                        </div>
                    )}

                    {certificationsQuery.isError && (
                        <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-center">
                            <p className="font-semibold text-red-700">
                                Unable to load your certifications.
                            </p>

                            <Button
                                type="button"
                                variant="outline"
                                className="mt-3"
                                onClick={() => void certificationsQuery.refetch()}
                            >
                                Try again
                            </Button>
                        </div>
                    )}

                    {!certificationsQuery.isPending &&
                        !certificationsQuery.isError &&
                        certifications.length === 0 && (
                            <div className="rounded-xl border border-dashed border-slate-300 px-5 py-10 text-center">
                                <p className="font-semibold text-slate-900">
                                    No certifications added yet
                                </p>

                                <p className="mt-2 text-sm text-slate-600">
                                    Add relevant certifications, licenses, or verified credentials.
                                </p>
                            </div>
                        )}

                    {!certificationsQuery.isPending &&
                        !certificationsQuery.isError &&
                        certifications.length > 0 && (
                            <div className="space-y-4">
                                {certifications.map((certification) => (
                                    <CertificationItem
                                        key={certification.id}
                                        certification={certification}
                                        onEdit={setCertificationBeingEdited}
                                        onDelete={setCertificationBeingDeleted}
                                    />
                                ))}
                            </div>
                        )}
                    </CardContent>
                )}
            </Card>

            {isAddDialogOpen && (
                <CertificationFormDialog
                    key="add-certification"
                    certification={null}
                    open
                    onOpenChange={setIsAddDialogOpen}
                />
            )}

            {certificationBeingEdited && (
                <CertificationFormDialog
                    key={certificationBeingEdited.id}
                    certification={certificationBeingEdited}
                    open
                    onOpenChange={(open) => {
                        if (!open) {
                            setCertificationBeingEdited(null);
                        }
                    }}
                />
            )}

            {certificationBeingDeleted && (
                <DeleteCertificationDialog
                    key={certificationBeingDeleted.id}
                    certification={certificationBeingDeleted}
                    open
                    onOpenChange={(open) => {
                        if (!open) {
                            setCertificationBeingDeleted(null);
                        }
                    }}
                />
            )}
        </>
    );
}
