"use client";

import {
    CheckCircle2,
    Download,
    FileText,
    LoaderCircle,
    Pencil,
    RefreshCw,
    ShieldCheck,
    Star,
    Trash2,
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
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
    useResumeDownload,
    useResumes,
    useSetDefaultResume,
    useUploadResume,
} from "../hooks/useResumes";
import type { ResumeRecord } from "../types/resume";
import {
    formatResumeDate,
    formatResumeFileSize,
    formatResumeFileType,
    getResumeErrorMessage,
} from "../utils/resumeFormatters";

import DeleteResumeDialog from "./DeleteResumeDialog";
import RenameResumeDialog from "./RenameResumeDialog";

const MAX_RESUME_SIZE = 5 * 1024 * 1024;
const MAX_ACTIVE_RESUMES = 10;
const ALLOWED_EXTENSIONS = [".pdf", ".doc", ".docx"];

function getFileExtension(fileName: string): string {
    const lastDotIndex = fileName.lastIndexOf(".");

    if (lastDotIndex === -1) {
        return "";
    }

    return fileName.slice(lastDotIndex).toLowerCase();
}

function openSecureDownload(downloadUrl: string) {
    const link = document.createElement("a");

    link.href = downloadUrl;
    link.target = "_blank";
    link.rel = "noopener noreferrer";

    document.body.appendChild(link);
    link.click();
    link.remove();
}

export default function ResumeManagerPage() {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const autoFilledResumeNameRef = useRef<string | null>(null);

    const [selectedFile, setSelectedFile] =
        useState<File | null>(null);

    const [resumeName, setResumeName] = useState("");

    const [isDefault, setIsDefault] = useState(false);

    const [uploadProgress, setUploadProgress] = useState(0);

    const [validationError, setValidationError] = useState("");

    const [resumeBeingRenamed, setResumeBeingRenamed] =
        useState<ResumeRecord | null>(null);

    const [resumeBeingDeleted, setResumeBeingDeleted] =
        useState<ResumeRecord | null>(null);

    const resumesQuery = useResumes(true);

    const uploadMutation = useUploadResume();

    const setDefaultMutation = useSetDefaultResume();

    const downloadMutation = useResumeDownload();

    const resumes = resumesQuery.data?.resumes ?? [];

    const hasReachedLimit =
        resumes.length >= MAX_ACTIVE_RESUMES;

    const hasUploadFormData =
        selectedFile !== null ||
        resumeName.trim().length > 0 ||
        isDefault;

    function clearUploadForm() {
        setSelectedFile(null);
        setResumeName("");
        setIsDefault(false);
        setUploadProgress(0);
        setValidationError("");
        autoFilledResumeNameRef.current = null;

        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    }

    function validateSelectedFile(file: File): string | null {
        const extension = getFileExtension(file.name);

        if (!ALLOWED_EXTENSIONS.includes(extension)) {
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

    function handleFileChange(
        event: ChangeEvent<HTMLInputElement>,
    ) {
        const file = event.target.files?.[0] ?? null;

        setValidationError("");
        setUploadProgress(0);

        if (!file) {
            setSelectedFile(null);

            return;
        }

        const error = validateSelectedFile(file);

        if (error) {
            setSelectedFile(null);
            setValidationError(error);
            event.target.value = "";

            return;
        }

        setSelectedFile(file);

        const suggestedName = file.name.replace(
            /\.(pdf|docx?)$/i,
            "",
        );

        const currentName = resumeName.trim();

        if (
            !currentName ||
            currentName === autoFilledResumeNameRef.current
        ) {
            setResumeName(suggestedName);
            autoFilledResumeNameRef.current = suggestedName;
        }
    }

    function handleRemoveSelectedFile() {
        setSelectedFile(null);
        setUploadProgress(0);
        setValidationError("");

        if (
            autoFilledResumeNameRef.current &&
            resumeName.trim() === autoFilledResumeNameRef.current
        ) {
            setResumeName("");
        }

        autoFilledResumeNameRef.current = null;

        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    }

    async function handleUpload(
        event: FormEvent<HTMLFormElement>,
    ) {
        event.preventDefault();

        if (!selectedFile) {
            setValidationError(
                "Choose a resume file before uploading.",
            );

            return;
        }

        const fileError = validateSelectedFile(selectedFile);

        if (fileError) {
            setValidationError(fileError);

            return;
        }

        if (hasReachedLimit) {
            setValidationError(
                "You can keep up to 10 active resumes.",
            );

            return;
        }

        setValidationError("");
        setUploadProgress(0);

        const toastId = toast.loading("Uploading resume...");

        const normalizedResumeName = resumeName.trim();

        try {
            const response = await uploadMutation.mutateAsync({
                file: selectedFile,
                isDefault,
                onProgress: setUploadProgress,
                ...(normalizedResumeName && {
                    name: normalizedResumeName,
                }),
            });

            toast.success(response.message, {
                id: toastId,
                description: response.resume.isDefault
                    ? `"${response.resume.name}" is now your default resume.`
                    : `"${response.resume.name}" is ready to use.`,
            });

            clearUploadForm();
        } catch (error) {
            setUploadProgress(0);

            toast.error(
                getResumeErrorMessage(
                    error,
                    "Unable to upload the resume.",
                ),
                {
                    id: toastId,
                },
            );
        }
    }

    async function handleSetDefault(resume: ResumeRecord) {
        if (
            resume.isDefault ||
            setDefaultMutation.isPending
        ) {
            return;
        }

        const toastId = toast.loading(
            "Updating default resume...",
        );

        try {
            const response =
                await setDefaultMutation.mutateAsync(resume.id);

            toast.success(response.message, {
                id: toastId,
                description: `"${response.resume.name}" will be selected first when you apply.`,
            });
        } catch (error) {
            toast.error(
                getResumeErrorMessage(
                    error,
                    "Unable to update the default resume.",
                ),
                {
                    id: toastId,
                },
            );
        }
    }

    async function handleDownload(resume: ResumeRecord) {
        if (downloadMutation.isPending) {
            return;
        }

        const toastId = toast.loading(
            "Preparing secure download...",
        );

        try {
            const response =
                await downloadMutation.mutateAsync(resume.id);

            toast.success("Secure download ready.", {
                id: toastId,
                description: `The private link expires in ${
                    response.expiresInSeconds / 60
                } minutes.`,
            });

            openSecureDownload(response.downloadUrl);
        } catch (error) {
            toast.error(
                getResumeErrorMessage(
                    error,
                    "Unable to prepare the resume download.",
                ),
                {
                    id: toastId,
                },
            );
        }
    }

    return (
        <div className="space-y-8">
            <section>
                <p className="text-sm font-semibold text-primary">
                    Job seeker account
                </p>

                <h1 className="mt-1 text-3xl font-bold tracking-tight">
                    Resumes
                </h1>

                <p className="mt-2 max-w-2xl text-muted-foreground">
                    Upload and manage the resumes you will use when
                    applying for JobsSpot opportunities.
                </p>
            </section>

            <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
                <Card>
                    <CardHeader>
                        <div className="flex items-start gap-4">
                            <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                <Upload className="size-6" />
                            </div>

                            <div>
                                <CardTitle>Upload a resume</CardTitle>

                                <CardDescription className="mt-1">
                                    PDF, DOC, or DOCX up to 5 MB.
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent>
                        <form
                            onSubmit={handleUpload}
                            className="space-y-5"
                        >
                            {validationError && (
                                <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                                    {validationError}
                                </div>
                            )}

                            {hasReachedLimit && (
                                <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
                                    You have reached the limit of 10
                                    active resumes. Delete one before
                                    uploading another.
                                </div>
                            )}

                            <div>
                                <label
                                    htmlFor="resume-file"
                                    className="text-sm font-semibold"
                                >
                                    Resume file
                                </label>

                                <input
                                    ref={fileInputRef}
                                    id="resume-file"
                                    type="file"
                                    accept=".pdf,.doc,.docx"
                                    onChange={handleFileChange}
                                    disabled={
                                        uploadMutation.isPending ||
                                        hasReachedLimit
                                    }
                                    className="sr-only"
                                />

                                {!selectedFile ? (
                                    <div className="mt-2 flex flex-col gap-3 rounded-xl border border-dashed bg-muted/20 p-4 sm:flex-row sm:items-center sm:justify-between">
                                        <div>
                                            <p className="text-sm font-semibold">
                                                Choose a resume file
                                            </p>

                                            <p className="mt-1 text-xs text-muted-foreground">
                                                PDF, DOC, or DOCX. Maximum
                                                file size is 5 MB.
                                            </p>
                                        </div>

                                        <Button
                                            type="button"
                                            variant="outline"
                                            disabled={
                                                uploadMutation.isPending ||
                                                hasReachedLimit
                                            }
                                            onClick={() =>
                                                fileInputRef.current?.click()
                                            }
                                        >
                                            <Upload />
                                            Choose file
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="mt-2 flex flex-col gap-3 rounded-xl border bg-muted/30 p-3 sm:flex-row sm:items-center sm:justify-between">
                                        <div className="flex min-w-0 items-center gap-3">
                                            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                                <FileText className="size-5" />
                                            </div>

                                            <div className="min-w-0">
                                                <p className="truncate text-sm font-semibold">
                                                    {selectedFile.name}
                                                </p>

                                                <p className="mt-0.5 text-xs text-muted-foreground">
                                                    {formatResumeFileSize(
                                                        selectedFile.size,
                                                    )}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap gap-2 sm:shrink-0">
                                            <Button
                                                type="button"
                                                size="sm"
                                                variant="outline"
                                                disabled={
                                                    uploadMutation.isPending ||
                                                    hasReachedLimit
                                                }
                                                onClick={() =>
                                                    fileInputRef.current?.click()
                                                }
                                            >
                                                <RefreshCw />
                                                Replace
                                            </Button>

                                            <Button
                                                type="button"
                                                size="sm"
                                                variant="ghost"
                                                disabled={
                                                    uploadMutation.isPending
                                                }
                                                onClick={
                                                    handleRemoveSelectedFile
                                                }
                                            >
                                                <X />
                                                Remove
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div>
                                <label
                                    htmlFor="resume-name"
                                    className="text-sm font-semibold"
                                >
                                    Resume name
                                    <span className="ml-1 font-normal text-muted-foreground">
                                        (optional)
                                    </span>
                                </label>

                                <Input
                                    id="resume-name"
                                    value={resumeName}
                                    onChange={(event) => {
                                        setResumeName(
                                            event.target.value,
                                        );
                                        autoFilledResumeNameRef.current =
                                            null;
                                    }}
                                    disabled={
                                        uploadMutation.isPending ||
                                        hasReachedLimit
                                    }
                                    maxLength={100}
                                    placeholder="e.g. Frontend Developer Resume"
                                    className="mt-2"
                                />

                                <p className="mt-2 text-xs text-muted-foreground">
                                    A clear name helps when choosing a
                                    resume for an application.
                                </p>
                            </div>

                            <label className="flex cursor-pointer items-start gap-3 rounded-xl border p-4">
                                <input
                                    type="checkbox"
                                    checked={isDefault}
                                    onChange={(event) =>
                                        setIsDefault(
                                            event.target.checked,
                                        )
                                    }
                                    disabled={
                                        uploadMutation.isPending ||
                                        hasReachedLimit
                                    }
                                    className="mt-1 size-4 rounded border-border"
                                />

                                <span>
                                    <span className="block text-sm font-semibold">
                                        Set as default resume
                                    </span>

                                    <span className="mt-1 block text-xs leading-5 text-muted-foreground">
                                        Your default resume will be
                                        selected first when applying.
                                        The first resume is always made
                                        default automatically.
                                    </span>
                                </span>
                            </label>

                            {uploadMutation.isPending && (
                                <div>
                                    <div className="mb-2 flex justify-between text-xs text-muted-foreground">
                                        <span>Uploading securely</span>
                                        <span>
                                            {uploadProgress > 0
                                                ? `${uploadProgress}%`
                                                : "Preparing..."}
                                        </span>
                                    </div>

                                    <div className="h-2 overflow-hidden rounded-full bg-muted">
                                        <div
                                            className="h-full rounded-full bg-primary transition-[width]"
                                            style={{
                                                width: `${
                                                    uploadProgress > 0
                                                        ? uploadProgress
                                                        : 8
                                                }%`,
                                            }}
                                        />
                                    </div>
                                </div>
                            )}

                            <div className="flex flex-col-reverse gap-3 border-t pt-5 sm:flex-row sm:items-center sm:justify-between">
                                <Button
                                    type="button"
                                    variant="outline"
                                    disabled={
                                        !hasUploadFormData ||
                                        uploadMutation.isPending
                                    }
                                    onClick={clearUploadForm}
                                >
                                    <X />
                                    Clear form
                                </Button>

                                <Button
                                    type="submit"
                                    disabled={
                                        !selectedFile ||
                                        uploadMutation.isPending ||
                                        hasReachedLimit
                                    }
                                >
                                    {uploadMutation.isPending ? (
                                        <LoaderCircle className="animate-spin" />
                                    ) : (
                                        <Upload />
                                    )}

                                    {uploadMutation.isPending
                                        ? "Uploading..."
                                        : "Upload resume"}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>

                <aside className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Resume overview</CardTitle>

                            <CardDescription>
                                Your current resume storage.
                            </CardDescription>
                        </CardHeader>

                        <CardContent className="space-y-5">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">
                                    Active resumes
                                </span>

                                <span className="font-semibold">
                                    {resumesQuery.isLoading
                                        ? "..."
                                        : `${resumes.length}/${MAX_ACTIVE_RESUMES}`}
                                </span>
                            </div>

                            <div className="flex items-center justify-between border-t pt-5">
                                <span className="text-sm text-muted-foreground">
                                    Default resume
                                </span>

                                <span className="max-w-40 truncate text-right text-sm font-semibold">
                                    {resumes.find(
                                        (resume) =>
                                            resume.isDefault,
                                    )?.name ?? "None"}
                                </span>
                            </div>

                            <div className="rounded-xl bg-primary/5 p-4 text-sm leading-6 text-muted-foreground">
                                <ShieldCheck className="mb-2 size-5 text-primary" />
                                Resume files are stored privately and
                                opened through temporary secure links.
                            </div>
                        </CardContent>
                    </Card>
                </aside>
            </section>

            <Card>
                <CardHeader>
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <CardTitle>Your resumes</CardTitle>

                            <CardDescription className="mt-1">
                                Rename, download, set a default, or
                                remove an active resume.
                            </CardDescription>
                        </div>

                        {!resumesQuery.isLoading && (
                            <p className="text-sm text-muted-foreground">
                                {resumes.length} active{" "}
                                {resumes.length === 1
                                    ? "resume"
                                    : "resumes"}
                            </p>
                        )}
                    </div>
                </CardHeader>

                <CardContent>
                    {resumesQuery.isLoading && (
                        <div className="flex min-h-56 items-center justify-center gap-2 rounded-xl border border-dashed text-sm text-muted-foreground">
                            <LoaderCircle className="size-5 animate-spin" />
                            Loading your resumes...
                        </div>
                    )}

                    {resumesQuery.isError && (
                        <div className="flex min-h-56 flex-col items-center justify-center rounded-xl border border-red-200 bg-red-50 p-8 text-center">
                            <p className="font-semibold text-red-700">
                                Unable to load your resumes
                            </p>

                            <p className="mt-2 text-sm text-red-700">
                                {getResumeErrorMessage(
                                    resumesQuery.error,
                                    "Please try again.",
                                )}
                            </p>

                            <Button
                                type="button"
                                variant="outline"
                                className="mt-5"
                                onClick={() =>
                                    void resumesQuery.refetch()
                                }
                            >
                                Try again
                            </Button>
                        </div>
                    )}

                    {!resumesQuery.isLoading &&
                        !resumesQuery.isError &&
                        resumes.length === 0 && (
                            <div className="flex min-h-56 flex-col items-center justify-center rounded-xl border border-dashed p-8 text-center">
                                <div className="mb-4 rounded-full bg-muted p-4">
                                    <FileText className="size-7 text-muted-foreground" />
                                </div>

                                <h3 className="font-semibold">
                                    No resumes uploaded
                                </h3>

                                <p className="mt-2 max-w-md text-sm text-muted-foreground">
                                    Upload your first resume above. It
                                    will automatically become your
                                    default resume.
                                </p>
                            </div>
                        )}

                    {!resumesQuery.isLoading &&
                        !resumesQuery.isError &&
                        resumes.length > 0 && (
                            <div className="divide-y overflow-hidden rounded-xl border">
                                {resumes.map((resume) => (
                                    <div
                                        key={resume.id}
                                        className="flex flex-col gap-4 p-4 transition hover:bg-muted/30 lg:flex-row lg:items-center"
                                    >
                                        <div className="flex min-w-0 flex-1 items-center gap-3">
                                            <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                                <FileText className="size-5" />
                                            </div>

                                            <div className="min-w-0">
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <p className="truncate font-semibold">
                                                        {resume.name}
                                                    </p>

                                                    {resume.isDefault && (
                                                        <span className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-[11px] font-semibold text-amber-700">
                                                            <Star className="size-3 fill-current" />
                                                            Default
                                                        </span>
                                                    )}
                                                </div>

                                                <p className="mt-1 text-sm text-muted-foreground">
                                                    {formatResumeFileType(
                                                        resume.mimeType,
                                                    )}{" "}
                                                    ·{" "}
                                                    {formatResumeFileSize(
                                                        resume.fileSize,
                                                    )}{" "}
                                                    · Uploaded{" "}
                                                    {formatResumeDate(
                                                        resume.createdAt,
                                                    )}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap items-center gap-2 lg:justify-end">
                                            <Button
                                                type="button"
                                                size="sm"
                                                variant="outline"
                                                disabled={
                                                    downloadMutation.isPending
                                                }
                                                onClick={() =>
                                                    void handleDownload(
                                                        resume,
                                                    )
                                                }
                                            >
                                                {downloadMutation.isPending ? (
                                                    <LoaderCircle className="animate-spin" />
                                                ) : (
                                                    <Download />
                                                )}
                                                Download
                                            </Button>

                                            {!resume.isDefault && (
                                                <Button
                                                    type="button"
                                                    size="sm"
                                                    variant="outline"
                                                    disabled={
                                                        setDefaultMutation.isPending
                                                    }
                                                    onClick={() =>
                                                        void handleSetDefault(
                                                            resume,
                                                        )
                                                    }
                                                >
                                                    {setDefaultMutation.isPending ? (
                                                        <LoaderCircle className="animate-spin" />
                                                    ) : (
                                                        <CheckCircle2 />
                                                    )}
                                                    Set default
                                                </Button>
                                            )}

                                            <Button
                                                type="button"
                                                size="sm"
                                                variant="outline"
                                                onClick={() =>
                                                    setResumeBeingRenamed(
                                                        resume,
                                                    )
                                                }
                                            >
                                                <Pencil />
                                                Rename
                                            </Button>

                                            <Button
                                                type="button"
                                                size="sm"
                                                variant="destructive"
                                                onClick={() =>
                                                    setResumeBeingDeleted(
                                                        resume,
                                                    )
                                                }
                                            >
                                                <Trash2 />
                                                Delete
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                </CardContent>
            </Card>

            {resumeBeingRenamed && (
                <RenameResumeDialog
                    key={resumeBeingRenamed.id}
                    resume={resumeBeingRenamed}
                    open
                    onOpenChange={(open) => {
                        if (!open) {
                            setResumeBeingRenamed(null);
                        }
                    }}
                />
            )}

            <DeleteResumeDialog
                resume={resumeBeingDeleted}
                open={Boolean(resumeBeingDeleted)}
                onOpenChange={(open) => {
                    if (!open) {
                        setResumeBeingDeleted(null);
                    }
                }}
            />
        </div>
    );
}
