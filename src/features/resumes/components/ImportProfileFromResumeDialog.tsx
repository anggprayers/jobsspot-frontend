"use client";

import axios from "axios";
import { Check, FileSearch, FileUp, LoaderCircle, Sparkles, TriangleAlert } from "lucide-react";
import { useMemo, useState, type Dispatch, type ReactNode, type SetStateAction } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { getCurrentUser } from "@/features/auth/api/getCurrentUser";
import { useAuthStore } from "@/features/auth/store/authStore";
import type { AuthUser } from "@/features/auth/types/auth";
import type { JobSeekerProfile } from "@/features/job-seeker-profile/types/jobSeekerProfile";

import {
    useImportResumeProfile,
    useResumeProfilePreview,
    useResumes,
    useUploadResume,
} from "../hooks/useResumes";
import type {
    ImportResumeProfileRequest,
    ResumeProfilePreview,
    ResumeProfilePreviewResponse,
} from "../types/resume";

type Props = Readonly<{
    user: AuthUser;
    profile: JobSeekerProfile | null;
}>;

type FieldSelections = {
    firstName: boolean;
    lastName: boolean;
    phone: boolean;
    location: boolean;
    headline: boolean;
    summary: boolean;
    websiteUrl: boolean;
    linkedInUrl: boolean;
    yearsOfExperience: boolean;
};

type EditableProfile = {
    firstName: string;
    lastName: string;
    phone: string;
    location: string;
    headline: string;
    summary: string;
    websiteUrl: string;
    linkedInUrl: string;
    yearsOfExperience: string;
};

const MAX_RESUME_SKILL_IMPORTS = 5;

const EMPTY_SELECTIONS: FieldSelections = {
    firstName: false,
    lastName: false,
    phone: false,
    location: false,
    headline: false,
    summary: false,
    websiteUrl: false,
    linkedInUrl: false,
    yearsOfExperience: false,
};

function getErrorMessage(error: unknown, fallback: string): string {
    if (axios.isAxiosError<{ message?: string; errors?: Record<string, string[]> }>(error)) {
        const data = error.response?.data;
        const firstFieldError = data?.errors
            ? Object.values(data.errors).flat().find(Boolean)
            : undefined;
        return firstFieldError ?? data?.message ?? fallback;
    }

    return error instanceof Error ? error.message : fallback;
}

function buildEditableProfile(preview: ResumeProfilePreview): EditableProfile {
    return {
        firstName: preview.personal.firstName ?? "",
        lastName: preview.personal.lastName ?? "",
        phone: preview.personal.phone ?? "",
        location: preview.personal.location ?? "",
        headline: preview.professional.headline ?? "",
        summary: preview.professional.summary ?? "",
        websiteUrl: preview.professional.websiteUrl ?? "",
        linkedInUrl: preview.professional.linkedInUrl ?? "",
        yearsOfExperience:
            preview.professional.yearsOfExperience === null
                ? ""
                : String(preview.professional.yearsOfExperience),
    };
}

function buildInitialSelections(
    preview: ResumeProfilePreview,
    user: AuthUser,
    profile: JobSeekerProfile | null,
): FieldSelections {
    return {
        firstName: Boolean(preview.personal.firstName) && !user.firstName,
        lastName: Boolean(preview.personal.lastName) && !user.lastName,
        phone: Boolean(preview.personal.phone) && !user.phone,
        location: Boolean(preview.personal.location) && !profile?.location,
        headline: Boolean(preview.professional.headline) && !profile?.headline,
        summary: Boolean(preview.professional.summary) && !profile?.summary,
        websiteUrl: Boolean(preview.professional.websiteUrl) && !profile?.websiteUrl,
        linkedInUrl: Boolean(preview.professional.linkedInUrl) && !profile?.linkedInUrl,
        yearsOfExperience:
            preview.professional.yearsOfExperience !== null &&
            (profile?.yearsOfExperience ?? null) === null,
    };
}

function SelectionRow({
    checked,
    label,
    currentValue,
    children,
    onCheckedChange,
}: Readonly<{
    checked: boolean;
    label: string;
    currentValue?: string | null;
    children: ReactNode;
    onCheckedChange: (checked: boolean) => void;
}>) {
    return (
        <div className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="mb-3 flex items-start justify-between gap-4">
                <div>
                    <p className="text-sm font-semibold text-slate-900">{label}</p>
                    {currentValue && (
                        <p className="mt-1 text-xs text-slate-500">Current: {currentValue}</p>
                    )}
                </div>
                <label className="flex shrink-0 items-center gap-2 text-xs font-semibold text-slate-600">
                    <input
                        type="checkbox"
                        checked={checked}
                        onChange={(event) => onCheckedChange(event.target.checked)}
                        className="size-4 accent-blue-600"
                    />
                    Import
                </label>
            </div>
            {children}
        </div>
    );
}

export default function ImportProfileFromResumeDialog({ user, profile }: Props) {
    const [open, setOpen] = useState(false);
    const [selectedResumeId, setSelectedResumeId] = useState("");
    const [previewResponse, setPreviewResponse] = useState<ResumeProfilePreviewResponse | null>(null);
    const [editable, setEditable] = useState<EditableProfile | null>(null);
    const [selections, setSelections] = useState<FieldSelections>(EMPTY_SELECTIONS);
    const [selectedSkills, setSelectedSkills] = useState<Set<number>>(new Set());
    const [selectedWork, setSelectedWork] = useState<Set<number>>(new Set());
    const [selectedEducation, setSelectedEducation] = useState<Set<number>>(new Set());
    const [selectedCertifications, setSelectedCertifications] = useState<Set<number>>(new Set());
    const [uploadFile, setUploadFile] = useState<File | null>(null);

    const resumesQuery = useResumes(open);
    const previewMutation = useResumeProfilePreview();
    const importMutation = useImportResumeProfile();
    const uploadMutation = useUploadResume();
    const setUser = useAuthStore((state) => state.setUser);

    const resumes = resumesQuery.data?.resumes ?? [];
    const preview = previewResponse?.preview ?? null;

    const preferredResume = resumes.find((resume) => resume.isDefault) ?? resumes[0];
    const effectiveResumeId = selectedResumeId || preferredResume?.id || "";

    const selectedCount = useMemo(() => {
        return (
            Object.values(selections).filter(Boolean).length +
            selectedSkills.size +
            selectedWork.size +
            selectedEducation.size +
            selectedCertifications.size
        );
    }, [selections, selectedCertifications, selectedEducation, selectedSkills, selectedWork]);

    function resetPreview() {
        setPreviewResponse(null);
        setEditable(null);
        setSelections(EMPTY_SELECTIONS);
        setSelectedSkills(new Set());
        setSelectedWork(new Set());
        setSelectedEducation(new Set());
        setSelectedCertifications(new Set());
    }

    function applyPreview(response: ResumeProfilePreviewResponse) {
        const nextPreview = response.preview;
        setPreviewResponse(response);
        setEditable(buildEditableProfile(nextPreview));
        setSelections(buildInitialSelections(nextPreview, user, profile));
        setSelectedSkills(
            new Set(
                nextPreview.skills
                    .slice(0, MAX_RESUME_SKILL_IMPORTS)
                    .map((_, index) => index),
            ),
        );
        setSelectedWork(new Set(nextPreview.workExperiences.map((_, index) => index)));
        setSelectedEducation(new Set(nextPreview.education.map((_, index) => index)));
        setSelectedCertifications(new Set(nextPreview.certifications.map((_, index) => index)));
    }

    async function analyzeResume(resumeId: string) {
        const toastId = toast.loading("Reading your resume...");
        try {
            const response = await previewMutation.mutateAsync(resumeId);
            setSelectedResumeId(resumeId);
            applyPreview(response);
            toast.success("Resume analysis is ready to review.", { id: toastId });
        } catch (error) {
            toast.error(getErrorMessage(error, "Unable to analyze this resume."), { id: toastId });
        }
    }

    async function handleUploadAndAnalyze() {
        if (!uploadFile || uploadMutation.isPending || previewMutation.isPending) return;
        const extension = uploadFile.name.toLowerCase();
        if (!extension.endsWith(".pdf") && !extension.endsWith(".docx")) {
            toast.error("Profile import supports PDF and DOCX resumes.");
            return;
        }

        const toastId = toast.loading("Uploading resume...");
        try {
            const uploaded = await uploadMutation.mutateAsync({
                file: uploadFile,
                isDefault: resumes.length === 0,
            });
            setSelectedResumeId(uploaded.resume.id);
            setUploadFile(null);
            toast.loading("Analyzing uploaded resume...", { id: toastId });
            const response = await previewMutation.mutateAsync(uploaded.resume.id);
            applyPreview(response);
            toast.success("Resume uploaded and analyzed.", { id: toastId });
        } catch (error) {
            toast.error(getErrorMessage(error, "Unable to upload and analyze this resume."), {
                id: toastId,
            });
        }
    }

    function toggleSet(setter: Dispatch<SetStateAction<Set<number>>>, index: number) {
        setter((current) => {
            const next = new Set(current);
            if (next.has(index)) next.delete(index);
            else next.add(index);
            return next;
        });
    }

    function toggleSkill(index: number) {
        setSelectedSkills((current) => {
            const next = new Set(current);

            if (next.has(index)) {
                next.delete(index);
                return next;
            }

            if (next.size >= MAX_RESUME_SKILL_IMPORTS) {
                toast.info(`You can import up to ${MAX_RESUME_SKILL_IMPORTS} skills from a resume.`);
                return current;
            }

            next.add(index);
            return next;
        });
    }

    function nullable(value: string): string | null {
        const trimmed = value.trim();
        return trimmed ? trimmed : null;
    }

    function buildImportPayload(): ImportResumeProfileRequest | null {
        if (!preview || !editable || selectedCount === 0) return null;

        const personal: NonNullable<ImportResumeProfileRequest["personal"]> = {};
        if (selections.firstName) personal.firstName = nullable(editable.firstName);
        if (selections.lastName) personal.lastName = nullable(editable.lastName);
        if (selections.phone) personal.phone = nullable(editable.phone);
        if (selections.location) personal.location = nullable(editable.location);

        const professional: NonNullable<ImportResumeProfileRequest["professional"]> = {};
        if (selections.headline) professional.headline = nullable(editable.headline);
        if (selections.summary) professional.summary = nullable(editable.summary);
        if (selections.websiteUrl) professional.websiteUrl = nullable(editable.websiteUrl);
        if (selections.linkedInUrl) professional.linkedInUrl = nullable(editable.linkedInUrl);
        if (selections.yearsOfExperience) {
            professional.yearsOfExperience = editable.yearsOfExperience.trim()
                ? Number(editable.yearsOfExperience)
                : null;
        }

        const payload: ImportResumeProfileRequest = {};
        if (Object.keys(personal).length) payload.personal = personal;
        if (Object.keys(professional).length) payload.professional = professional;
        if (selectedSkills.size) {
            payload.skills = preview.skills
                .filter((_, index) => selectedSkills.has(index))
                .slice(0, MAX_RESUME_SKILL_IMPORTS);
        }
        if (selectedWork.size) payload.workExperiences = preview.workExperiences.filter((_, index) => selectedWork.has(index));
        if (selectedEducation.size) payload.education = preview.education.filter((_, index) => selectedEducation.has(index));
        if (selectedCertifications.size) payload.certifications = preview.certifications.filter((_, index) => selectedCertifications.has(index));
        return payload;
    }

    async function handleImport() {
        if (!selectedResumeId || importMutation.isPending) return;
        const payload = buildImportPayload();
        if (!payload) {
            toast.error("Select at least one detected field or profile item to import.");
            return;
        }

        const toastId = toast.loading("Updating your JobsSpot profile...");
        try {
            const response = await importMutation.mutateAsync({ resumeId: selectedResumeId, data: payload });
            const currentUser = await getCurrentUser();
            setUser(currentUser.user);
            toast.success("Profile information imported.", {
                id: toastId,
                description: `${response.imported.workExperiencesAdded} experience, ${response.imported.educationAdded} education, ${response.imported.certificationsAdded} certification, and ${response.imported.skillsAdded} skill records added.`,
            });
            setOpen(false);
            resetPreview();
        } catch (error) {
            toast.error(getErrorMessage(error, "Unable to import the selected profile information."), {
                id: toastId,
            });
        }
    }

    const isBusy = previewMutation.isPending || uploadMutation.isPending || importMutation.isPending;

    return (
        <Dialog
            open={open}
            onOpenChange={(nextOpen) => {
                setOpen(nextOpen);
                if (!nextOpen) resetPreview();
            }}
        >
            <DialogTrigger asChild>
                <Button type="button" variant="outline">
                    <FileSearch />
                    Import from resume
                </Button>
            </DialogTrigger>

            <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl">
                <DialogHeader>
                    <DialogTitle>Import profile from resume</DialogTitle>
                    <DialogDescription>
                        JobsSpot can read your resume and suggest details for your profile. Review everything before adding it.
                    </DialogDescription>
                </DialogHeader>

                {!preview && (
                    <div className="space-y-5">
                        <div className="rounded-2xl border border-slate-200 p-4">
                            <p className="font-semibold text-slate-900">Use an existing resume</p>
                            <p className="mt-1 text-sm text-slate-500">PDF and DOCX can be analyzed for profile data.</p>
                            <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                                <Select value={effectiveResumeId} onValueChange={setSelectedResumeId} disabled={isBusy || resumes.length === 0}>
                                    <SelectTrigger className="min-w-0 flex-1">
                                        <SelectValue placeholder={resumes.length ? "Select a resume" : "No resumes uploaded"} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {resumes.map((resume) => (
                                            <SelectItem key={resume.id} value={resume.id}>
                                                {resume.name}{resume.isDefault ? " (Default)" : ""}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <Button
                                    type="button"
                                    disabled={!effectiveResumeId || isBusy}
                                    onClick={() => void analyzeResume(effectiveResumeId)}
                                >
                                    {previewMutation.isPending ? <LoaderCircle className="animate-spin" /> : <Sparkles />}
                                    Analyze resume
                                </Button>
                            </div>
                        </div>

                        <div className="rounded-2xl border border-dashed border-blue-200 bg-blue-50/40 p-4">
                            <div className="flex items-start gap-3">
                                <FileUp className="mt-0.5 size-5 text-blue-700" />
                                <div>
                                    <p className="font-semibold text-slate-900">Upload a new resume</p>
                                    <p className="mt-1 text-sm text-slate-600">PDF or DOCX · maximum 5 MB. The file is also saved to your Resumes page.</p>
                                </div>
                            </div>
                            <Input
                                type="file"
                                accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                                className="mt-4 bg-white"
                                disabled={isBusy}
                                onChange={(event) => setUploadFile(event.target.files?.[0] ?? null)}
                            />
                            <Button
                                type="button"
                                variant="outline"
                                className="mt-3"
                                disabled={!uploadFile || isBusy}
                                onClick={() => void handleUploadAndAnalyze()}
                            >
                                {uploadMutation.isPending || previewMutation.isPending ? <LoaderCircle className="animate-spin" /> : <FileUp />}
                                Upload and analyze
                            </Button>
                        </div>
                    </div>
                )}

                {preview && editable && (
                    <div className="space-y-6">
                        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
                            <div className="flex items-start gap-2">
                                <TriangleAlert className="mt-0.5 size-4 shrink-0" />
                                <div>
                                    <p className="font-semibold">Review before importing</p>
                                    {preview.parser.warnings.map((warning) => (
                                        <p key={warning} className="mt-1 leading-6">{warning}</p>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <section className="space-y-3">
                            <div>
                                <h3 className="font-bold text-slate-950">Personal information</h3>
                                <p className="text-sm text-slate-500">Your sign-in email is detected for reference only and is never changed by resume import.</p>
                            </div>
                            {preview.personal.detectedEmail && (
                                <div className="rounded-xl bg-slate-50 p-3 text-sm text-slate-600">
                                    Detected email: <span className="font-semibold text-slate-900">{preview.personal.detectedEmail}</span>
                                </div>
                            )}
                            {preview.personal.firstName && (
                                <SelectionRow checked={selections.firstName} label="First name" currentValue={user.firstName} onCheckedChange={(value) => setSelections((current) => ({ ...current, firstName: value }))}>
                                    <Input value={editable.firstName} onChange={(event) => setEditable((current) => current ? { ...current, firstName: event.target.value } : current)} />
                                </SelectionRow>
                            )}
                            {preview.personal.lastName && (
                                <SelectionRow checked={selections.lastName} label="Last name" currentValue={user.lastName} onCheckedChange={(value) => setSelections((current) => ({ ...current, lastName: value }))}>
                                    <Input value={editable.lastName} onChange={(event) => setEditable((current) => current ? { ...current, lastName: event.target.value } : current)} />
                                </SelectionRow>
                            )}
                            {preview.personal.phone && (
                                <SelectionRow checked={selections.phone} label="Phone" currentValue={user.phone} onCheckedChange={(value) => setSelections((current) => ({ ...current, phone: value }))}>
                                    <Input value={editable.phone} onChange={(event) => setEditable((current) => current ? { ...current, phone: event.target.value } : current)} />
                                </SelectionRow>
                            )}
                            {preview.personal.location && (
                                <SelectionRow checked={selections.location} label="Location" currentValue={profile?.location} onCheckedChange={(value) => setSelections((current) => ({ ...current, location: value }))}>
                                    <Input value={editable.location} onChange={(event) => setEditable((current) => current ? { ...current, location: event.target.value } : current)} />
                                </SelectionRow>
                            )}
                        </section>

                        <section className="space-y-3">
                            <div>
                                <h3 className="font-bold text-slate-950">Professional profile</h3>
                                <p className="mt-1 text-sm text-slate-500">
                                    Your professional headline is a short role or title that quickly tells employers what you do or what kind of work you are looking for.
                                </p>
                            </div>
                            {preview.professional.headline && (
                                <SelectionRow checked={selections.headline} label="Professional headline" currentValue={profile?.headline} onCheckedChange={(value) => setSelections((current) => ({ ...current, headline: value }))}>
                                    <Input value={editable.headline} placeholder="e.g. Web Developer, Registered Nurse, Accountant" onChange={(event) => setEditable((current) => current ? { ...current, headline: event.target.value } : current)} />
                                </SelectionRow>
                            )}
                            {preview.professional.summary && (
                                <SelectionRow checked={selections.summary} label="Professional summary" currentValue={profile?.summary} onCheckedChange={(value) => setSelections((current) => ({ ...current, summary: value }))}>
                                    <textarea value={editable.summary} onChange={(event) => setEditable((current) => current ? { ...current, summary: event.target.value } : current)} rows={5} className="w-full rounded-xl border border-slate-300 p-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100" />
                                </SelectionRow>
                            )}
                            {preview.professional.websiteUrl && (
                                <SelectionRow checked={selections.websiteUrl} label="Website / portfolio" currentValue={profile?.websiteUrl} onCheckedChange={(value) => setSelections((current) => ({ ...current, websiteUrl: value }))}>
                                    <Input value={editable.websiteUrl} onChange={(event) => setEditable((current) => current ? { ...current, websiteUrl: event.target.value } : current)} />
                                </SelectionRow>
                            )}
                            {preview.professional.linkedInUrl && (
                                <SelectionRow checked={selections.linkedInUrl} label="LinkedIn" currentValue={profile?.linkedInUrl} onCheckedChange={(value) => setSelections((current) => ({ ...current, linkedInUrl: value }))}>
                                    <Input value={editable.linkedInUrl} onChange={(event) => setEditable((current) => current ? { ...current, linkedInUrl: event.target.value } : current)} />
                                </SelectionRow>
                            )}
                            {preview.professional.yearsOfExperience !== null && (
                                <SelectionRow checked={selections.yearsOfExperience} label="Estimated years of experience" currentValue={profile?.yearsOfExperience === null ? null : String(profile?.yearsOfExperience ?? "")} onCheckedChange={(value) => setSelections((current) => ({ ...current, yearsOfExperience: value }))}>
                                    <Input type="number" min={0} max={60} value={editable.yearsOfExperience} onChange={(event) => setEditable((current) => current ? { ...current, yearsOfExperience: event.target.value } : current)} />
                                </SelectionRow>
                            )}
                        </section>

                        {preview.skills.length > 0 && (
                            <section>
                                <div className="flex flex-wrap items-start justify-between gap-3">
                                    <div>
                                        <h3 className="font-bold text-slate-950">Skills</h3>
                                        <p className="mt-1 text-sm text-slate-500">
                                            JobsSpot shows up to 5 skills detected from this resume. Select the ones that best describe you; you can add more skills to your profile later.
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs font-semibold text-slate-500">
                                            {selectedSkills.size}/{MAX_RESUME_SKILL_IMPORTS} selected
                                        </span>
                                        <Button type="button" size="sm" variant="outline" onClick={() =>
                                                setSelectedSkills(
                                                    new Set(
                                                        preview.skills
                                                            .slice(0, MAX_RESUME_SKILL_IMPORTS)
                                                            .map((_, index) => index),
                                                    ),
                                                )
                                            }>
                                            Select all
                                        </Button>
                                        <Button type="button" size="sm" variant="outline" onClick={() => setSelectedSkills(new Set())}>
                                            Clear
                                        </Button>
                                    </div>
                                </div>
                                <div className="mt-3 flex flex-wrap gap-2">
                                    {preview.skills.map((skill, index) => {
                                        const isSelected = selectedSkills.has(index);
                                        return (
                                            <button
                                                key={`${skill}-${index}`}
                                                type="button"
                                                aria-pressed={isSelected}
                                                onClick={() => toggleSkill(index)}
                                                className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm transition ${isSelected ? "border-blue-300 bg-blue-50 text-blue-800" : "border-slate-200 bg-white text-slate-500 hover:border-slate-300"}`}
                                            >
                                                {isSelected && <Check className="size-3.5" />}
                                                {skill}
                                            </button>
                                        );
                                    })}
                                </div>
                            </section>
                        )}

                        {preview.workExperiences.length > 0 && (
                            <section>
                                <h3 className="font-bold text-slate-950">Work experience</h3>
                                <div className="mt-3 space-y-2">
                                    {preview.workExperiences.map((item, index) => (
                                        <label key={`${item.companyName}-${item.jobTitle}-${index}`} className="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 p-3">
                                            <input type="checkbox" className="mt-1 size-4 accent-blue-600" checked={selectedWork.has(index)} onChange={() => toggleSet(setSelectedWork, index)} />
                                            <span className="min-w-0">
                                                <span className="block font-semibold text-slate-900">{item.jobTitle}</span>
                                                <span className="block text-sm text-slate-500">
                                                    {item.companyName} · {item.startDate.slice(0, 7)} – {item.isCurrent ? "Present" : item.endDate?.slice(0, 7) ?? "Unknown"}
                                                </span>
                                                {item.description && (
                                                    <span className="mt-2 block whitespace-pre-line text-sm leading-6 text-slate-600">
                                                        {item.description}
                                                    </span>
                                                )}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </section>
                        )}

                        {preview.education.length > 0 && (
                            <section>
                                <h3 className="font-bold text-slate-950">Education</h3>
                                <div className="mt-3 space-y-2">
                                    {preview.education.map((item, index) => (
                                        <label key={`${item.institutionName}-${index}`} className="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 p-3">
                                            <input type="checkbox" className="mt-1 size-4 accent-blue-600" checked={selectedEducation.has(index)} onChange={() => toggleSet(setSelectedEducation, index)} />
                                            <span className="min-w-0">
                                                <span className="block font-semibold text-slate-900">{item.institutionName}</span>
                                                <span className="block text-sm text-slate-500">{item.degree ?? item.fieldOfStudy ?? "Education record"}</span>
                                                {(item.startDate || item.endDate || item.isCurrent) && (
                                                    <span className="mt-1 block text-xs font-medium text-slate-500">
                                                        {[item.startDate?.slice(0, 4), item.isCurrent ? "Present" : item.endDate?.slice(0, 4)].filter(Boolean).join(" – ")}
                                                    </span>
                                                )}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </section>
                        )}

                        {preview.certifications.length > 0 && (
                            <section>
                                <h3 className="font-bold text-slate-950">Certifications</h3>
                                <div className="mt-3 space-y-2">
                                    {preview.certifications.map((item, index) => (
                                        <label key={`${item.name}-${index}`} className="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 p-3">
                                            <input type="checkbox" className="mt-1 size-4 accent-blue-600" checked={selectedCertifications.has(index)} onChange={() => toggleSet(setSelectedCertifications, index)} />
                                            <span><span className="block font-semibold text-slate-900">{item.name}</span><span className="text-sm text-slate-500">{item.issuingOrganization ?? "Issuing organization not detected"}</span></span>
                                        </label>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>
                )}

                <DialogFooter>
                    {preview && (
                        <Button type="button" variant="outline" disabled={isBusy} onClick={resetPreview}>
                            Choose another resume
                        </Button>
                    )}
                    {preview && (
                        <Button type="button" disabled={isBusy || selectedCount === 0} onClick={() => void handleImport()}>
                            {importMutation.isPending ? <LoaderCircle className="animate-spin" /> : <Sparkles />}
                            Import {selectedCount} selected
                        </Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
