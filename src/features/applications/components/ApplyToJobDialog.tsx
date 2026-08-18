"use client";

import axios from "axios";
import Link from "next/link";
import {
    BriefcaseBusiness,
    FileText,
    LoaderCircle,
    MailCheck,
    Send,
    ShieldAlert,
    Upload,
    X,
} from "lucide-react";
import {
    useRef,
    useState,
    type ChangeEvent,
    type FormEvent,
} from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

import { useAuth } from "@/features/auth/hooks/useAuth";
import { useSendVerificationEmail } from "@/features/auth/hooks/useEmailVerification";
import type { PublicJobDetails } from "@/features/jobs/types/publicJobDetails";
import {
    useResumes,
    useUploadResume,
} from "@/features/resumes/hooks/useResumes";
import type { ResumeRecord } from "@/features/resumes/types/resume";
import {
    formatResumeFileSize,
    formatResumeFileType,
    getResumeErrorMessage,
} from "@/features/resumes/utils/resumeFormatters";

import { useCreateApplication } from "../hooks/useApplications";
import { getApplicationErrorMessage } from "../utils/applicationFormatters";

const MAX_COVER_LETTER_LENGTH = 5000;
const MAX_RESUME_SIZE = 5 * 1024 * 1024;
const MAX_COVER_LETTER_FILE_SIZE = 5 * 1024 * 1024;
const MAX_ACTIVE_RESUMES = 10;
const ALLOWED_RESUME_EXTENSIONS = [".pdf", ".doc", ".docx"];
const ALLOWED_COVER_LETTER_EXTENSIONS = [".pdf", ".doc", ".docx"];

function getFileExtension(fileName: string): string {
    const lastDotIndex = fileName.lastIndexOf(".");

    return lastDotIndex === -1
        ? ""
        : fileName.slice(lastDotIndex).toLowerCase();
}

function validateResumeFile(file: File): string | null {
    if (!ALLOWED_RESUME_EXTENSIONS.includes(getFileExtension(file.name))) {
        return "Choose a PDF, DOC, or DOCX resume file.";
    }

    if (file.size === 0) {
        return "The selected resume file is empty.";
    }

    if (file.size > MAX_RESUME_SIZE) {
        return "Resume files must be 5 MB or smaller.";
    }

    return null;
}

function validateCoverLetterFile(file: File): string | null {
    if (!ALLOWED_COVER_LETTER_EXTENSIONS.includes(getFileExtension(file.name))) {
        return "Choose a PDF, DOC, or DOCX cover letter file.";
    }

    if (file.size === 0) {
        return "The selected cover letter file is empty.";
    }

    if (file.size > MAX_COVER_LETTER_FILE_SIZE) {
        return "Cover letter files must be 5 MB or smaller.";
    }

    return null;
}

type ApiErrorResponse = {
    message?: string;
};

function getVerificationEmailErrorMessage(
    error: unknown,
): string {
    if (
        axios.isAxiosError<ApiErrorResponse>(
            error,
        )
    ) {
        if (
            error.response?.status === 429
        ) {
            return "Too many verification requests. Please wait a few minutes and try again.";
        }

        return (
            error.response?.data?.message ??
            "Unable to send the verification email right now."
        );
    }

    return "Unable to send the verification email right now.";
}

type ApplyToJobDialogProps = Readonly<{
    job: PublicJobDetails;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}>;

export default function ApplyToJobDialog({
    job,
    open,
    onOpenChange,
}: ApplyToJobDialogProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const coverLetterFileInputRef = useRef<HTMLInputElement>(null);

    const [selectedResumeId, setSelectedResumeId] = useState("");
    const [coverLetter, setCoverLetter] = useState("");
    const [coverLetterMode, setCoverLetterMode] = useState<"WRITE" | "UPLOAD">("WRITE");
    const [selectedCoverLetterFile, setSelectedCoverLetterFile] = useState<File | null>(null);
    const [coverLetterValidationError, setCoverLetterValidationError] = useState("");
    const [selectedUploadFile, setSelectedUploadFile] =
        useState<File | null>(null);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [uploadValidationError, setUploadValidationError] =
        useState("");
    const [recentlyUploadedResume, setRecentlyUploadedResume] =
        useState<ResumeRecord | null>(null);

    const { user } = useAuth();
    const isEmailVerified =
        user?.isEmailVerified ?? false;

    const resumesQuery = useResumes(
        open && isEmailVerified,
    );
    const createMutation = useCreateApplication();
    const uploadMutation = useUploadResume();
    const sendVerificationMutation =
        useSendVerificationEmail();

    const storedResumes = resumesQuery.data?.resumes ?? [];
    const resumes =
        recentlyUploadedResume &&
        !storedResumes.some(
            (resume) => resume.id === recentlyUploadedResume.id,
        )
            ? [recentlyUploadedResume, ...storedResumes]
            : storedResumes;

    const hasReachedResumeLimit =
        resumes.length >= MAX_ACTIVE_RESUMES;
    const isBusy =
        createMutation.isPending || uploadMutation.isPending;

    const defaultResumeId =
        resumes.find((resume) => resume.isDefault)?.id ??
        resumes[0]?.id ??
        "";

    const effectiveSelectedResumeId =
        selectedResumeId || defaultResumeId;

    function handleOpenChange(nextOpen: boolean) {
        if (
            isBusy ||
            sendVerificationMutation.isPending
        ) {
            return;
        }

        if (!nextOpen) {
            setSelectedResumeId("");
            setCoverLetter("");
            setCoverLetterMode("WRITE");
            setSelectedCoverLetterFile(null);
            setCoverLetterValidationError("");
            setSelectedUploadFile(null);
            setUploadProgress(0);
            setUploadValidationError("");
            setRecentlyUploadedResume(null);

            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }

            if (coverLetterFileInputRef.current) {
                coverLetterFileInputRef.current.value = "";
            }
        }

        onOpenChange(nextOpen);
    }

    async function handleSendVerificationEmail() {
        if (
            isEmailVerified ||
            sendVerificationMutation.isPending
        ) {
            return;
        }

        const toastId = toast.loading(
            "Sending verification email...",
        );

        try {
            const response =
                await sendVerificationMutation.mutateAsync();

            toast.success(
                response.alreadyVerified
                    ? "Email already verified."
                    : "Verification email sent.",
                {
                    id: toastId,
                    description:
                        response.alreadyVerified
                            ? "Your account already has a verified email address."
                            : "Check your inbox. The newest link expires in 30 minutes.",
                },
            );
        } catch (error) {
            toast.error(
                getVerificationEmailErrorMessage(
                    error,
                ),
                {
                    id: toastId,
                },
            );
        }
    }

    function handleResumeFileChange(
        event: ChangeEvent<HTMLInputElement>,
    ) {
        const file = event.target.files?.[0] ?? null;

        setUploadValidationError("");
        setUploadProgress(0);

        if (!file) {
            setSelectedUploadFile(null);
            return;
        }

        const validationError = validateResumeFile(file);

        if (validationError) {
            setSelectedUploadFile(null);
            setUploadValidationError(validationError);
            event.target.value = "";
            return;
        }

        setSelectedUploadFile(file);
    }

    function clearSelectedUploadFile() {
        setSelectedUploadFile(null);
        setUploadProgress(0);
        setUploadValidationError("");

        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    }

    async function handleInlineResumeUpload() {
        if (!selectedUploadFile || uploadMutation.isPending) {
            return;
        }

        const validationError = validateResumeFile(selectedUploadFile);

        if (validationError) {
            setUploadValidationError(validationError);
            return;
        }

        if (hasReachedResumeLimit) {
            setUploadValidationError(
                "You can keep up to 10 active resumes.",
            );
            return;
        }

        setUploadValidationError("");
        setUploadProgress(0);

        const toastId = toast.loading("Uploading resume...");

        try {
            const response = await uploadMutation.mutateAsync({
                file: selectedUploadFile,
                isDefault: resumes.length === 0,
                onProgress: setUploadProgress,
            });

            setRecentlyUploadedResume(response.resume);
            setSelectedResumeId(response.resume.id);
            clearSelectedUploadFile();

            toast.success("Resume uploaded and selected.", {
                id: toastId,
                description: `“${response.resume.name}” is ready for this application.`,
            });
        } catch (error) {
            toast.error(
                getResumeErrorMessage(
                    error,
                    "Unable to upload the resume.",
                ),
                { id: toastId },
            );
        }
    }

    function handleCoverLetterFileChange(
        event: ChangeEvent<HTMLInputElement>,
    ) {
        const file = event.target.files?.[0] ?? null;
        setCoverLetterValidationError("");

        if (!file) {
            setSelectedCoverLetterFile(null);
            return;
        }

        const validationError = validateCoverLetterFile(file);

        if (validationError) {
            setSelectedCoverLetterFile(null);
            setCoverLetterValidationError(validationError);
            event.target.value = "";
            return;
        }

        setSelectedCoverLetterFile(file);
    }

    function switchCoverLetterMode(mode: "WRITE" | "UPLOAD") {
        setCoverLetterMode(mode);
        setCoverLetterValidationError("");

        if (mode === "WRITE") {
            setSelectedCoverLetterFile(null);
            if (coverLetterFileInputRef.current) {
                coverLetterFileInputRef.current.value = "";
            }
        } else {
            setCoverLetter("");
        }
    }

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (
            !isEmailVerified ||
            !effectiveSelectedResumeId ||
            isBusy
        ) {
            return;
        }

        const toastId = toast.loading("Submitting application...");

        try {
            const response = await createMutation.mutateAsync({
                jobId: job.id,
                resumeId: effectiveSelectedResumeId,
                coverLetter:
                    coverLetterMode === "WRITE"
                        ? coverLetter.trim() || null
                        : null,
                coverLetterFile:
                    coverLetterMode === "UPLOAD"
                        ? selectedCoverLetterFile
                        : null,
            });

            toast.success(response.message, {
                id: toastId,
                description: `JobsSpot received your application for ${job.title} at ${job.company.name}.`,
            });

            handleOpenChange(false);
        } catch (error) {
            toast.error(
                getApplicationErrorMessage(
                    error,
                    "Unable to submit your application.",
                ),
                {
                    id: toastId,
                },
            );
        }
    }

    const selectedResume = resumes.find(
        (resume) => resume.id === effectiveSelectedResumeId,
    );

    if (!isEmailVerified) {
        return (
            <Dialog
                open={open}
                onOpenChange={handleOpenChange}
            >
                <DialogContent
                    className="sm:max-w-lg"
                    onEscapeKeyDown={(event) => {
                        if (
                            sendVerificationMutation.isPending
                        ) {
                            event.preventDefault();
                        }
                    }}
                    onInteractOutside={(event) => {
                        if (
                            sendVerificationMutation.isPending
                        ) {
                            event.preventDefault();
                        }
                    }}
                >
                    <DialogHeader>
                        <div className="mb-3 flex size-12 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
                            <ShieldAlert className="size-6" />
                        </div>

                        <DialogTitle>
                            Verify your email to apply
                        </DialogTitle>

                        <DialogDescription className="leading-6">
                            Confirm{" "}
                            <span className="font-medium text-slate-700">
                                {user?.email}
                            </span>{" "}
                            before submitting an application
                            to {job.company.name}. You can
                            continue browsing, updating your
                            profile, and managing resumes
                            while your account is unverified.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-800">
                        The newest verification link replaces
                        any previous link and expires after
                        30 minutes.
                    </div>

                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button
                            type="button"
                            variant="outline"
                            disabled={
                                sendVerificationMutation.isPending
                            }
                            onClick={() =>
                                handleOpenChange(false)
                            }
                        >
                            Close
                        </Button>

                        <Button
                            asChild
                            variant="outline"
                        >
                            <Link href="/account/settings">
                                Account settings
                            </Link>
                        </Button>

                        <Button
                            type="button"
                            disabled={
                                sendVerificationMutation.isPending
                            }
                            onClick={() =>
                                void handleSendVerificationEmail()
                            }
                        >
                            {sendVerificationMutation.isPending ? (
                                <>
                                    <LoaderCircle className="animate-spin" />
                                    Sending...
                                </>
                            ) : (
                                <>
                                    <MailCheck />
                                    Send verification
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        );
    }

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent
                className="max-h-[90vh] overflow-y-auto sm:max-w-2xl"
                onEscapeKeyDown={(event) => {
                    if (isBusy) {
                        event.preventDefault();
                    }
                }}
                onInteractOutside={(event) => {
                    if (isBusy) {
                        event.preventDefault();
                    }
                }}
            >
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <BriefcaseBusiness className="size-5 text-blue-600" />
                            Apply for {job.title}
                        </DialogTitle>

                        <DialogDescription className="leading-6">
                            Choose the resume you want to send and add an optional cover letter. JobsSpot receives the application and coordinates the next steps with {job.company.name}.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-6 py-6">
                        <div className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm leading-6 text-blue-800">
                            Your selected resume is copied to this application so the exact file you submit stays attached to it. JobsSpot Platform Admin can securely review and share it with the hiring company when needed.
                        </div>

                        <section>
                            <div className="flex items-center justify-between gap-4">
                                <label
                                    htmlFor="application-resume"
                                    className="text-sm font-semibold text-slate-900"
                                >
                                    Resume
                                </label>

                                <Link
                                    href="/account/resumes"
                                    className="text-sm font-semibold text-blue-600 hover:text-blue-700"
                                >
                                    Manage resumes
                                </Link>
                            </div>

                            {resumesQuery.isLoading && (
                                <div className="mt-2 flex min-h-24 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-500">
                                    <LoaderCircle className="mr-2 size-4 animate-spin text-blue-600" />
                                    Loading your resumes...
                                </div>
                            )}

                            {resumesQuery.isError && (
                                <div className="mt-2 rounded-xl border border-red-200 bg-red-50 p-4">
                                    <p className="text-sm font-medium text-red-700">
                                        Unable to load your resumes.
                                    </p>

                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        className="mt-3"
                                        onClick={() => void resumesQuery.refetch()}
                                    >
                                        Try again
                                    </Button>
                                </div>
                            )}

                            {!resumesQuery.isLoading &&
                                !resumesQuery.isError &&
                                resumes.length === 0 && (
                                    <div className="mt-2 rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm leading-6 text-blue-800">
                                        You do not have a saved resume yet. Upload one below without leaving this application.
                                    </div>
                                )}

                            {resumes.length > 0 && (
                                <>
                                    <select
                                        id="application-resume"
                                        value={effectiveSelectedResumeId}
                                        onChange={(event) =>
                                            setSelectedResumeId(event.target.value)
                                        }
                                        disabled={isBusy}
                                        required
                                        className="mt-2 flex min-h-11 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        {resumes.map((resume) => (
                                            <option key={resume.id} value={resume.id}>
                                                {resume.name}
                                                {resume.isDefault ? " (Default)" : ""}
                                            </option>
                                        ))}
                                    </select>

                                    {selectedResume && (
                                        <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
                                            <div className="flex items-center gap-3">
                                                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-white text-blue-600 shadow-sm">
                                                    <FileText className="size-5" />
                                                </div>

                                                <div className="min-w-0">
                                                    <p className="truncate font-semibold text-slate-900">
                                                        {selectedResume.name}
                                                    </p>

                                                    <p className="mt-0.5">
                                                        {formatResumeFileType(
                                                            selectedResume.mimeType,
                                                        )}{" "}
                                                        ·{" "}
                                                        {formatResumeFileSize(
                                                            selectedResume.fileSize,
                                                        )}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </>
                            )}

                            {!resumesQuery.isLoading &&
                                !resumesQuery.isError && (
                                    <div className="mt-3 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4">
                                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                            <div className="flex items-start gap-3">
                                                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-white text-blue-600 shadow-sm">
                                                    <Upload className="size-5" />
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-slate-900">
                                                        {resumes.length === 0
                                                            ? "Upload your resume"
                                                            : "Upload another resume"}
                                                    </p>
                                                    <p className="mt-1 text-sm text-slate-600">
                                                        PDF, DOC, or DOCX · Maximum 5 MB
                                                    </p>
                                                </div>
                                            </div>

                                            <input
                                                ref={fileInputRef}
                                                type="file"
                                                accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                                                className="hidden"
                                                disabled={isBusy || hasReachedResumeLimit}
                                                onChange={handleResumeFileChange}
                                            />

                                            <Button
                                                type="button"
                                                variant="outline"
                                                disabled={isBusy || hasReachedResumeLimit}
                                                onClick={() => fileInputRef.current?.click()}
                                            >
                                                <Upload />
                                                Choose file
                                            </Button>
                                        </div>

                                        {hasReachedResumeLimit && (
                                            <p className="mt-3 text-sm text-amber-700">
                                                You have reached the limit of 10 active resumes. Remove one from Manage resumes before uploading another.
                                            </p>
                                        )}

                                        {selectedUploadFile && (
                                            <div className="mt-4 rounded-lg border border-slate-200 bg-white p-3">
                                                <div className="flex items-center justify-between gap-3">
                                                    <div className="min-w-0">
                                                        <p className="truncate text-sm font-semibold text-slate-900">
                                                            {selectedUploadFile.name}
                                                        </p>
                                                        <p className="mt-0.5 text-xs text-slate-500">
                                                            {formatResumeFileSize(selectedUploadFile.size)}
                                                        </p>
                                                    </div>

                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="icon"
                                                        disabled={uploadMutation.isPending}
                                                        aria-label="Remove selected resume file"
                                                        onClick={clearSelectedUploadFile}
                                                    >
                                                        <X />
                                                    </Button>
                                                </div>

                                                {uploadMutation.isPending && (
                                                    <div className="mt-3">
                                                        <div className="flex items-center justify-between text-xs text-slate-500">
                                                            <span>Uploading securely</span>
                                                            <span>{uploadProgress > 0 ? `${uploadProgress}%` : "Starting..."}</span>
                                                        </div>
                                                        <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-200">
                                                            <div
                                                                className="h-full rounded-full bg-blue-600 transition-[width]"
                                                                style={{ width: `${uploadProgress > 0 ? uploadProgress : 8}%` }}
                                                            />
                                                        </div>
                                                    </div>
                                                )}

                                                <Button
                                                    type="button"
                                                    className="mt-3 w-full sm:w-auto"
                                                    disabled={uploadMutation.isPending}
                                                    onClick={() => void handleInlineResumeUpload()}
                                                >
                                                    {uploadMutation.isPending ? (
                                                        <>
                                                            <LoaderCircle className="animate-spin" />
                                                            Uploading...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Upload />
                                                            Upload and use
                                                        </>
                                                    )}
                                                </Button>
                                            </div>
                                        )}

                                        {uploadValidationError && (
                                            <p className="mt-3 text-sm font-medium text-red-700">
                                                {uploadValidationError}
                                            </p>
                                        )}
                                    </div>
                                )}
                        </section>

                        <section>
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                    <p className="text-sm font-semibold text-slate-900">
                                        Cover letter
                                        <span className="ml-1 font-normal text-slate-500">
                                            (Optional)
                                        </span>
                                    </p>
                                    <p className="mt-1 text-xs text-slate-500">
                                        Optional. Add a short note or attach an existing cover letter.
                                    </p>
                                </div>

                                <div className="inline-flex rounded-lg border border-slate-200 bg-slate-50 p-1">
                                    <Button
                                        type="button"
                                        size="sm"
                                        variant={coverLetterMode === "WRITE" ? "default" : "ghost"}
                                        disabled={isBusy}
                                        onClick={() => switchCoverLetterMode("WRITE")}
                                    >
                                        Write
                                    </Button>
                                    <Button
                                        type="button"
                                        size="sm"
                                        variant={coverLetterMode === "UPLOAD" ? "default" : "ghost"}
                                        disabled={isBusy}
                                        onClick={() => switchCoverLetterMode("UPLOAD")}
                                    >
                                        Upload file
                                    </Button>
                                </div>
                            </div>

                            {coverLetterMode === "WRITE" ? (
                                <>
                                    <div className="mt-3 flex justify-end">
                                        <span className="text-xs text-slate-500">
                                            {coverLetter.length.toLocaleString()}/
                                            {MAX_COVER_LETTER_LENGTH.toLocaleString()}
                                        </span>
                                    </div>

                                    <textarea
                                        id="application-cover-letter"
                                        value={coverLetter}
                                        onChange={(event) => setCoverLetter(event.target.value)}
                                        disabled={isBusy}
                                        maxLength={MAX_COVER_LETTER_LENGTH}
                                        rows={8}
                                        placeholder="Briefly explain why you are interested in this role and how your experience matches the position."
                                        className="mt-2 flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm leading-6 shadow-xs outline-none transition-[color,box-shadow] placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50"
                                    />
                                </>
                            ) : (
                                <div className="mt-3 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4">
                                    <input
                                        ref={coverLetterFileInputRef}
                                        type="file"
                                        accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                                        className="hidden"
                                        disabled={isBusy}
                                        onChange={handleCoverLetterFileChange}
                                    />

                                    {selectedCoverLetterFile ? (
                                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                            <div className="min-w-0">
                                                <p className="truncate text-sm font-semibold text-slate-900">
                                                    {selectedCoverLetterFile.name}
                                                </p>
                                                <p className="mt-1 text-xs text-slate-500">
                                                    {formatResumeFileSize(selectedCoverLetterFile.size)} · Attached only to this application
                                                </p>
                                            </div>

                                            <Button
                                                type="button"
                                                variant="outline"
                                                disabled={isBusy}
                                                onClick={() => {
                                                    setSelectedCoverLetterFile(null);
                                                    setCoverLetterValidationError("");
                                                    if (coverLetterFileInputRef.current) {
                                                        coverLetterFileInputRef.current.value = "";
                                                    }
                                                }}
                                            >
                                                <X />
                                                Remove
                                            </Button>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                            <div>
                                                <p className="text-sm font-semibold text-slate-900">
                                                    Attach your cover letter
                                                </p>
                                                <p className="mt-1 text-sm text-slate-600">
                                                    PDF, DOC, or DOCX · Maximum 5 MB
                                                </p>
                                            </div>

                                            <Button
                                                type="button"
                                                variant="outline"
                                                disabled={isBusy}
                                                onClick={() => coverLetterFileInputRef.current?.click()}
                                            >
                                                <Upload />
                                                Choose file
                                            </Button>
                                        </div>
                                    )}

                                    {coverLetterValidationError && (
                                        <p className="mt-3 text-sm font-medium text-red-700">
                                            {coverLetterValidationError}
                                        </p>
                                    )}
                                </div>
                            )}
                        </section>
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            disabled={isBusy}
                            onClick={() => handleOpenChange(false)}
                        >
                            Cancel
                        </Button>

                        <Button
                            type="submit"
                            disabled={
                                !effectiveSelectedResumeId ||
                                resumes.length === 0 ||
                                isBusy
                            }
                        >
                            {createMutation.isPending ? (
                                <>
                                    <LoaderCircle className="animate-spin" />
                                    Submitting...
                                </>
                            ) : (
                                <>
                                    <Send />
                                    Send application
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
