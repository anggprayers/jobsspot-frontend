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
} from "lucide-react";
import { useState, type FormEvent } from "react";
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
import { useResumes } from "@/features/resumes/hooks/useResumes";
import {
    formatResumeFileSize,
    formatResumeFileType,
} from "@/features/resumes/utils/resumeFormatters";

import { useCreateApplication } from "../hooks/useApplications";
import { getApplicationErrorMessage } from "../utils/applicationFormatters";

const MAX_COVER_LETTER_LENGTH = 5000;

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
    const [selectedResumeId, setSelectedResumeId] = useState("");
    const [coverLetter, setCoverLetter] = useState("");

    const { user } = useAuth();
    const isEmailVerified =
        user?.isEmailVerified ?? false;

    const resumesQuery = useResumes(
        open && isEmailVerified,
    );
    const createMutation = useCreateApplication();
    const sendVerificationMutation =
        useSendVerificationEmail();

    const resumes = resumesQuery.data?.resumes ?? [];

    const defaultResumeId =
        resumes.find((resume) => resume.isDefault)?.id ??
        resumes[0]?.id ??
        "";

    const effectiveSelectedResumeId =
        selectedResumeId || defaultResumeId;

    function handleOpenChange(nextOpen: boolean) {
        if (
            createMutation.isPending ||
            sendVerificationMutation.isPending
        ) {
            return;
        }

        if (!nextOpen) {
            setSelectedResumeId("");
            setCoverLetter("");
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

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (
            !isEmailVerified ||
            !effectiveSelectedResumeId ||
            createMutation.isPending
        ) {
            return;
        }

        const toastId = toast.loading("Submitting application...");

        try {
            const response = await createMutation.mutateAsync({
                jobId: job.id,
                resumeId: effectiveSelectedResumeId,
                coverLetter: coverLetter.trim() || null,
            });

            toast.success(response.message, {
                id: toastId,
                description: `Your application to ${job.company.name} is now marked as submitted.`,
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
                    if (createMutation.isPending) {
                        event.preventDefault();
                    }
                }}
                onInteractOutside={(event) => {
                    if (createMutation.isPending) {
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

                        <DialogDescription>
                            Submit your resume to {job.company.name}. Review your
                            selection carefully before sending the application.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-6 py-6">
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
                                    <div className="mt-2 rounded-xl border border-amber-200 bg-amber-50 p-4">
                                        <div className="flex items-start gap-3">
                                            <FileText className="mt-0.5 size-5 shrink-0 text-amber-600" />

                                            <div>
                                                <p className="font-semibold text-amber-900">
                                                    Upload a resume first
                                                </p>

                                                <p className="mt-1 text-sm leading-6 text-amber-700">
                                                    A resume is required before
                                                    you can submit an application.
                                                </p>

                                                <Link
                                                    href="/account/resumes"
                                                    className="mt-3 inline-flex text-sm font-semibold text-amber-800 underline underline-offset-4"
                                                >
                                                    Go to resumes
                                                </Link>
                                            </div>
                                        </div>
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
                                        disabled={createMutation.isPending}
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
                        </section>

                        <section>
                            <div className="flex items-center justify-between gap-4">
                                <label
                                    htmlFor="application-cover-letter"
                                    className="text-sm font-semibold text-slate-900"
                                >
                                    Cover letter
                                    <span className="ml-1 font-normal text-slate-500">
                                        (Optional)
                                    </span>
                                </label>

                                <span className="text-xs text-slate-500">
                                    {coverLetter.length.toLocaleString()}/
                                    {MAX_COVER_LETTER_LENGTH.toLocaleString()}
                                </span>
                            </div>

                            <textarea
                                id="application-cover-letter"
                                value={coverLetter}
                                onChange={(event) => setCoverLetter(event.target.value)}
                                disabled={createMutation.isPending}
                                maxLength={MAX_COVER_LETTER_LENGTH}
                                rows={8}
                                placeholder="Briefly explain why you are interested in this role and how your experience matches the position."
                                className="mt-2 flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm leading-6 shadow-xs outline-none transition-[color,box-shadow] placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50"
                            />
                        </section>
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            disabled={createMutation.isPending}
                            onClick={() => handleOpenChange(false)}
                        >
                            Cancel
                        </Button>

                        <Button
                            type="submit"
                            disabled={
                                !effectiveSelectedResumeId ||
                                resumes.length === 0 ||
                                createMutation.isPending
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
                                    Submit application
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
