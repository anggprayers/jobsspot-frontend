"use client";

import axios from "axios";
import {
    BriefcaseBusiness,
    Building2,
    CalendarDays,
    ChevronDown,
    ChevronUp,
    LoaderCircle,
    MapPin,
    Pencil,
    Plus,
    Trash2,
} from "lucide-react";
import { useState, type SubmitEvent } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
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
    useCreateWorkExperience,
    useDeleteWorkExperience,
    useUpdateWorkExperience,
    useWorkExperiences,
} from "../hooks/useJobSeekerProfile";

import type {
    SaveWorkExperienceRequest,
    WorkExperience,
    WorkExperienceEmploymentType,
} from "../types/jobSeekerProfile";

const employmentTypes: Array<{
    value: WorkExperienceEmploymentType;
    label: string;
}> = [
    {
        value: "FULL_TIME",
        label: "Full-time",
    },
    {
        value: "PART_TIME",
        label: "Part-time",
    },
    {
        value: "CONTRACT",
        label: "Contract",
    },
    {
        value: "TEMPORARY",
        label: "Temporary",
    },
    {
        value: "INTERNSHIP",
        label: "Internship",
    },
];

function normalizeOptionalText(value: string): string | null {
    const normalizedValue = value.trim();

    return normalizedValue === "" ? null : normalizedValue;
}

function monthToIsoDate(value: string): string {
    return `${value}-01`;
}

function toMonthInputValue(value: string | null): string {
    return value?.slice(0, 7) ?? "";
}

function formatEmploymentType(
    employmentType: WorkExperienceEmploymentType | null,
): string | null {
    if (!employmentType) {
        return null;
    }

    return (
        employmentTypes.find((option) => option.value === employmentType)
            ?.label ?? employmentType
    );
}

function formatMonthYear(value: string): string {
    return new Intl.DateTimeFormat("en-US", {
        month: "short",
        year: "numeric",
        timeZone: "UTC",
    }).format(new Date(value));
}

function formatDateRange(experience: WorkExperience): string {
    const start = formatMonthYear(experience.startDate);

    if (experience.isCurrent) {
        return `${start} – Present`;
    }

    if (!experience.endDate) {
        return start;
    }

    return `${start} – ${formatMonthYear(experience.endDate)}`;
}

function getApiErrorMessage(error: unknown, fallbackMessage: string): string {
    if (axios.isAxiosError<{ message?: string }>(error)) {
        return error.response?.data?.message ?? fallbackMessage;
    }

    return fallbackMessage;
}

type WorkExperienceFormState = {
    jobTitle: string;
    companyName: string;
    employmentType: WorkExperienceEmploymentType | "";
    location: string;
    startDate: string;
    endDate: string;
    isCurrent: boolean;
    description: string;
};

function getInitialFormState(
    experience: WorkExperience | null,
): WorkExperienceFormState {
    return {
        jobTitle: experience?.jobTitle ?? "",
        companyName: experience?.companyName ?? "",
        employmentType: experience?.employmentType ?? "",
        location: experience?.location ?? "",
        startDate: toMonthInputValue(experience?.startDate ?? null),
        endDate: toMonthInputValue(experience?.endDate ?? null),
        isCurrent: experience?.isCurrent ?? false,
        description: experience?.description ?? "",
    };
}

type WorkExperienceFormDialogProps = Readonly<{
    experience: WorkExperience | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}>;

function WorkExperienceFormDialog({
    experience,
    open,
    onOpenChange,
}: WorkExperienceFormDialogProps) {
    const createMutation = useCreateWorkExperience();
    const updateMutation = useUpdateWorkExperience();

    const [form, setForm] = useState<WorkExperienceFormState>(() =>
        getInitialFormState(experience),
    );
    const [formError, setFormError] = useState("");

    const isEditing = experience !== null;
    const isPending =
        createMutation.isPending || updateMutation.isPending;

    function updateField<K extends keyof WorkExperienceFormState>(
        field: K,
        value: WorkExperienceFormState[K],
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
        if (!form.jobTitle.trim()) {
            return "Job title is required.";
        }

        if (!form.companyName.trim()) {
            return "Company name is required.";
        }

        if (!form.startDate) {
            return "Start date is required.";
        }

        if (!form.isCurrent && form.endDate && form.endDate < form.startDate) {
            return "End date cannot be earlier than start date.";
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

        const request: SaveWorkExperienceRequest = {
            jobTitle: form.jobTitle.trim(),
            companyName: form.companyName.trim(),
            employmentType: form.employmentType || null,
            location: normalizeOptionalText(form.location),
            startDate: monthToIsoDate(form.startDate),
            endDate:
                form.isCurrent || !form.endDate
                    ? null
                    : monthToIsoDate(form.endDate),
            isCurrent: form.isCurrent,
            description: normalizeOptionalText(form.description),
        };

        const toastId = toast.loading(
            isEditing
                ? "Updating work experience..."
                : "Adding work experience...",
        );

        try {
            const response = isEditing
                ? await updateMutation.mutateAsync({
                      experienceId: experience.id,
                      data: request,
                  })
                : await createMutation.mutateAsync(request);

            toast.success(response.message, {
                id: toastId,
            });

            onOpenChange(false);
        } catch (error) {
            toast.error(
                getApiErrorMessage(
                    error,
                    isEditing
                        ? "Unable to update this work experience."
                        : "Unable to add this work experience.",
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
                        {isEditing
                            ? "Edit work experience"
                            : "Add work experience"}
                    </DialogTitle>

                    <DialogDescription>
                        Add accurate employment details that employers can
                        review alongside your applications.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid gap-5 sm:grid-cols-2">
                        <div>
                            <label
                                htmlFor="experience-job-title"
                                className="text-sm font-semibold"
                            >
                                Job title
                            </label>

                            <Input
                                id="experience-job-title"
                                value={form.jobTitle}
                                maxLength={120}
                                placeholder="e.g. Junior Web Developer"
                                disabled={isPending}
                                onChange={(event) =>
                                    updateField(
                                        "jobTitle",
                                        event.target.value,
                                    )
                                }
                                className="mt-2"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="experience-company-name"
                                className="text-sm font-semibold"
                            >
                                Company
                            </label>

                            <Input
                                id="experience-company-name"
                                value={form.companyName}
                                maxLength={120}
                                placeholder="e.g. JobsSpot"
                                disabled={isPending}
                                onChange={(event) =>
                                    updateField(
                                        "companyName",
                                        event.target.value,
                                    )
                                }
                                className="mt-2"
                            />
                        </div>
                    </div>

                    <div className="grid gap-5 sm:grid-cols-2">
                        <div>
                            <label
                                htmlFor="experience-employment-type"
                                className="text-sm font-semibold"
                            >
                                Employment type
                            </label>

                            <select
                                id="experience-employment-type"
                                value={form.employmentType}
                                disabled={isPending}
                                onChange={(event) =>
                                    updateField(
                                        "employmentType",
                                        event.target
                                            .value as WorkExperienceEmploymentType | "",
                                    )
                                }
                                className="mt-2 flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                <option value="">Not specified</option>

                                {employmentTypes.map((option) => (
                                    <option
                                        key={option.value}
                                        value={option.value}
                                    >
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label
                                htmlFor="experience-location"
                                className="text-sm font-semibold"
                            >
                                Location
                            </label>

                            <Input
                                id="experience-location"
                                value={form.location}
                                maxLength={150}
                                placeholder="e.g. Pasay City, Metro Manila"
                                disabled={isPending}
                                onChange={(event) =>
                                    updateField(
                                        "location",
                                        event.target.value,
                                    )
                                }
                                className="mt-2"
                            />
                        </div>
                    </div>

                    <div className="grid gap-5 sm:grid-cols-2">
                        <div>
                            <label
                                htmlFor="experience-start-date"
                                className="text-sm font-semibold"
                            >
                                Start date
                            </label>

                            <Input
                                id="experience-start-date"
                                type="month"
                                value={form.startDate}
                                disabled={isPending}
                                onChange={(event) =>
                                    updateField(
                                        "startDate",
                                        event.target.value,
                                    )
                                }
                                className="mt-2"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="experience-end-date"
                                className="text-sm font-semibold"
                            >
                                End date
                            </label>

                            <Input
                                id="experience-end-date"
                                type="month"
                                value={form.endDate}
                                disabled={isPending || form.isCurrent}
                                onChange={(event) =>
                                    updateField(
                                        "endDate",
                                        event.target.value,
                                    )
                                }
                                className="mt-2"
                            />
                        </div>
                    </div>

                    <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 p-4">
                        <input
                            type="checkbox"
                            checked={form.isCurrent}
                            disabled={isPending}
                            onChange={(event) => {
                                const isCurrent = event.target.checked;

                                setForm((current) => ({
                                    ...current,
                                    isCurrent,
                                    ...(isCurrent && {
                                        endDate: "",
                                    }),
                                }));

                                if (formError) {
                                    setFormError("");
                                }
                            }}
                            className="mt-1 size-4 rounded border-slate-300"
                        />

                        <span>
                            <span className="block text-sm font-semibold text-slate-950">
                                I currently work here
                            </span>

                            <span className="mt-1 block text-sm leading-6 text-slate-600">
                                The role will be displayed as ongoing and no end
                                date will be stored.
                            </span>
                        </span>
                    </label>

                    <div>
                        <div className="flex items-center justify-between gap-4">
                            <label
                                htmlFor="experience-description"
                                className="text-sm font-semibold"
                            >
                                Description
                            </label>

                            <span className="text-xs text-slate-500">
                                {form.description.length}/3000
                            </span>
                        </div>

                        <textarea
                            id="experience-description"
                            rows={6}
                            value={form.description}
                            maxLength={3000}
                            placeholder="Describe your responsibilities, projects, and achievements."
                            disabled={isPending}
                            onChange={(event) =>
                                updateField(
                                    "description",
                                    event.target.value,
                                )
                            }
                            className="mt-2 flex min-h-32 w-full resize-y rounded-md border border-input bg-transparent px-3 py-3 text-sm shadow-xs outline-none transition-[color,box-shadow] placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50"
                        />
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
                                  : "Add experience"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

type DeleteWorkExperienceDialogProps = Readonly<{
    experience: WorkExperience;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}>;

function DeleteWorkExperienceDialog({
    experience,
    open,
    onOpenChange,
}: DeleteWorkExperienceDialogProps) {
    const deleteMutation = useDeleteWorkExperience();

    async function handleDelete() {
        const toastId = toast.loading("Removing work experience...");

        try {
            const response = await deleteMutation.mutateAsync(
                experience.id,
            );

            toast.success(response.message, {
                id: toastId,
            });

            onOpenChange(false);
        } catch (error) {
            toast.error(
                getApiErrorMessage(
                    error,
                    "Unable to remove this work experience.",
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
                onPointerDownOutside={(event) => event.preventDefault()}
                onEscapeKeyDown={(event) => {
                    if (deleteMutation.isPending) {
                        event.preventDefault();
                    }
                }}
            >
                <DialogHeader>
                    <DialogTitle>Remove work experience?</DialogTitle>

                    <DialogDescription>
                        <strong>{experience.jobTitle}</strong> at{" "}
                        <strong>{experience.companyName}</strong> will be
                        permanently removed from your profile.
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

                        {deleteMutation.isPending
                            ? "Removing..."
                            : "Remove experience"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

type WorkExperienceItemProps = Readonly<{
    experience: WorkExperience;
    onEdit: (experience: WorkExperience) => void;
    onDelete: (experience: WorkExperience) => void;
}>;

function WorkExperienceItem({
    experience,
    onEdit,
    onDelete,
}: WorkExperienceItemProps) {
    const employmentType = formatEmploymentType(
        experience.employmentType,
    );

    return (
        <article className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                <div className="min-w-0">
                    <div className="flex items-start gap-3">
                        <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                            <BriefcaseBusiness className="size-5" />
                        </span>

                        <div className="min-w-0">
                            <h3 className="font-semibold text-slate-950">
                                {experience.jobTitle}
                            </h3>

                            <p className="mt-1 flex items-center gap-2 text-sm text-slate-700">
                                <Building2 className="size-4 shrink-0" />
                                {experience.companyName}
                            </p>
                        </div>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-600">
                        <span className="flex items-center gap-2">
                            <CalendarDays className="size-4" />
                            {formatDateRange(experience)}
                        </span>

                        {experience.location && (
                            <span className="flex items-center gap-2">
                                <MapPin className="size-4" />
                                {experience.location}
                            </span>
                        )}
                    </div>

                    <div className="mt-3 flex flex-wrap gap-2">
                        {employmentType && (
                            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                                {employmentType}
                            </span>
                        )}

                        {experience.isCurrent && (
                            <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
                                Current role
                            </span>
                        )}
                    </div>

                    {experience.description && (
                        <p className="mt-4 whitespace-pre-line text-sm leading-7 text-slate-600">
                            {experience.description}
                        </p>
                    )}
                </div>

                <div className="flex shrink-0 gap-2">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => onEdit(experience)}
                    >
                        <Pencil />
                        Edit
                    </Button>

                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => onDelete(experience)}
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

export default function JobSeekerWorkExperienceCard() {
    const workExperiencesQuery = useWorkExperiences();

    const [isExpanded, setIsExpanded] = useState(false);
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [experienceBeingEdited, setExperienceBeingEdited] =
        useState<WorkExperience | null>(null);
    const [experienceBeingDeleted, setExperienceBeingDeleted] =
        useState<WorkExperience | null>(null);

    const workExperiences =
        workExperiencesQuery.data?.workExperiences ?? [];

    return (
        <>
            <Card>
                <CardHeader>
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div className="flex items-start gap-4">
                            <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                                <BriefcaseBusiness className="size-6" />
                            </div>

                            <div>
                                <CardTitle>Work experience</CardTitle>

                                <CardDescription className="mt-1">
                                    Show employers where you have worked and
                                    what you contributed.
                                </CardDescription>
                            </div>
                        </div>

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
                                onClick={() => setIsAddDialogOpen(true)}
                                className="flex-1 sm:flex-none"
                            >
                                <Plus />
                                Add experience
                            </Button>
                        </div>
                    </div>
                </CardHeader>

                {isExpanded && (
                    <CardContent>
                    {workExperiencesQuery.isPending && (
                        <div className="space-y-3">
                            <div className="h-40 animate-pulse rounded-2xl bg-slate-100" />
                            <div className="h-40 animate-pulse rounded-2xl bg-slate-100" />
                        </div>
                    )}

                    {workExperiencesQuery.isError && (
                        <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-center">
                            <p className="font-semibold text-red-700">
                                Unable to load your work experience.
                            </p>

                            <Button
                                type="button"
                                variant="outline"
                                className="mt-3"
                                onClick={() =>
                                    void workExperiencesQuery.refetch()
                                }
                            >
                                Try again
                            </Button>
                        </div>
                    )}

                    {!workExperiencesQuery.isPending &&
                        !workExperiencesQuery.isError &&
                        workExperiences.length === 0 && (
                            <div className="rounded-xl border border-dashed border-slate-300 px-5 py-10 text-center">
                                <p className="font-semibold text-slate-900">
                                    No work experience added yet
                                </p>

                                <p className="mt-2 text-sm text-slate-600">
                                    Add internships, freelance projects,
                                    contract roles, or full-time experience.
                                </p>
                            </div>
                        )}

                    {!workExperiencesQuery.isPending &&
                        !workExperiencesQuery.isError &&
                        workExperiences.length > 0 && (
                            <div className="space-y-4">
                                {workExperiences.map((experience) => (
                                    <WorkExperienceItem
                                        key={experience.id}
                                        experience={experience}
                                        onEdit={setExperienceBeingEdited}
                                        onDelete={
                                            setExperienceBeingDeleted
                                        }
                                    />
                                ))}
                            </div>
                        )}
                    </CardContent>
                )}
            </Card>

            {isAddDialogOpen && (
                <WorkExperienceFormDialog
                    key="add-work-experience"
                    experience={null}
                    open
                    onOpenChange={setIsAddDialogOpen}
                />
            )}

            {experienceBeingEdited && (
                <WorkExperienceFormDialog
                    key={experienceBeingEdited.id}
                    experience={experienceBeingEdited}
                    open
                    onOpenChange={(open) => {
                        if (!open) {
                            setExperienceBeingEdited(null);
                        }
                    }}
                />
            )}

            {experienceBeingDeleted && (
                <DeleteWorkExperienceDialog
                    key={experienceBeingDeleted.id}
                    experience={experienceBeingDeleted}
                    open
                    onOpenChange={(open) => {
                        if (!open) {
                            setExperienceBeingDeleted(null);
                        }
                    }}
                />
            )}
        </>
    );
}
