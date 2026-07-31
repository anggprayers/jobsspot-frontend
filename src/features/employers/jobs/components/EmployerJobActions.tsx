"use client";

import axios from "axios";
import Link from "next/link";
import { Archive, Edit3, Eye, MoreHorizontal, Pause, Play, RotateCcw, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { canManageJobs } from "@/features/employers/utils/employerPermissions";

import { useArchiveJob } from "../hooks/useArchiveJob";
import { usePublishJob } from "../hooks/usePublishJob";
import { useRestoreJob } from "../hooks/useRestoreJob";
import { useUnpublishJob } from "../hooks/useUnpublishJob";
import type { CompanyJob } from "../types/companyJob";

import DeleteJobDialog from "./DeleteJobDialog";
import EditJobDialog from "./EditJobDialog";

type JobCategoryOption = {
    id: string;
    name: string;
};

type EmployerJobActionsProps = {
    job: CompanyJob;
    companyId: string;
    categories: JobCategoryOption[];
};

export default function EmployerJobActions({
    job,
    companyId,
    categories,
}: EmployerJobActionsProps) {
    const { activeCompanyRole } = useAuth();

    const hasJobManagementAccess = canManageJobs(activeCompanyRole);

    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);

    const publishMutation = usePublishJob({
        companyId,
    });

    const unpublishMutation = useUnpublishJob({
        companyId,
    });

    const archiveMutation = useArchiveJob({
        companyId,
    });

    const restoreMutation = useRestoreJob({
        companyId,
    });

    const isMutating =
        publishMutation.isPending ||
        unpublishMutation.isPending ||
        archiveMutation.isPending ||
        restoreMutation.isPending;

    function handlePublish() {
        if (!hasJobManagementAccess) {
            return;
        }

        const isRepublishing = job.status === "PAUSED";

        const toastId = toast.loading(isRepublishing ? "Republishing job..." : "Publishing job...");

        publishMutation.mutate(job.id, {
            onSuccess: () => {
                toast.success(
                    isRepublishing
                        ? "Job republished successfully."
                        : "Job published successfully.",
                    {
                        id: toastId,
                        description: `${job.title} is now visible to job seekers.`,
                    },
                );
            },

            onError: (error) => {
                const message = axios.isAxiosError(error)
                    ? (error.response?.data?.message ?? "Unable to publish the job.")
                    : "Unable to publish the job.";

                toast.error(message, {
                    id: toastId,
                    description: axios.isAxiosError(error) ? undefined : "Please try again.",
                });
            },
        });
    }

    function handlePause() {
        if (!hasJobManagementAccess) {
            return;
        }

        const toastId = toast.loading("Pausing job...");

        unpublishMutation.mutate(job.id, {
            onSuccess: () => {
                toast.success("Job paused successfully.", {
                    id: toastId,
                    description: `${job.title} is no longer visible to job seekers.`,
                });
            },

            onError: (error) => {
                const message = axios.isAxiosError(error)
                    ? (error.response?.data?.message ?? "Unable to pause the job.")
                    : "Unable to pause the job.";

                toast.error(message, {
                    id: toastId,
                    description: axios.isAxiosError(error) ? undefined : "Please try again.",
                });
            },
        });
    }

    function handleArchive() {
        if (!hasJobManagementAccess) {
            return;
        }

        const toastId = toast.loading("Archiving job...");

        archiveMutation.mutate(job.id, {
            onSuccess: () => {
                toast.success("Job archived successfully.", {
                    id: toastId,
                    description: `${job.title} was moved to the archive.`,
                });
            },

            onError: (error) => {
                const message = axios.isAxiosError(error)
                    ? (error.response?.data?.message ?? "Unable to archive the job.")
                    : "Unable to archive the job.";

                toast.error(message, {
                    id: toastId,
                    description: axios.isAxiosError(error) ? undefined : "Please try again.",
                });
            },
        });
    }

    function handleRestore() {
        if (!hasJobManagementAccess) {
            return;
        }

        const toastId = toast.loading("Restoring job...");

        restoreMutation.mutate(job.id, {
            onSuccess: () => {
                toast.success("Job restored successfully.", {
                    id: toastId,
                    description: `${job.title} was restored as a draft.`,
                });
            },

            onError: (error) => {
                const message = axios.isAxiosError(error)
                    ? (error.response?.data?.message ?? "Unable to restore the job.")
                    : "Unable to restore the job.";

                toast.error(message, {
                    id: toastId,
                    description: axios.isAxiosError(error) ? undefined : "Please try again.",
                });
            },
        });
    }

    const canArchive = job.status === "DRAFT" || job.status === "PAUSED" || job.status === "CLOSED";

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <button
                        type="button"
                        disabled={isMutating}
                        aria-label={`Actions for ${job.title}`}
                        className="inline-flex size-9 items-center justify-center rounded-lg border border-slate-300 text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        <MoreHorizontal className="size-4" />
                    </button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem asChild>
                        <Link href={`/employers/jobs/${job.id}`}>
                            <Eye className="size-4" />
                            View job
                        </Link>
                    </DropdownMenuItem>

                    {hasJobManagementAccess && (
                        <>
                            <DropdownMenuSeparator />

                            {(job.status === "DRAFT" || job.status === "PAUSED") && (
                                <DropdownMenuItem disabled={isMutating} onSelect={handlePublish}>
                                    <Play className="size-4" />

                                    {publishMutation.isPending
                                        ? job.status === "PAUSED"
                                            ? "Republishing..."
                                            : "Publishing..."
                                        : job.status === "PAUSED"
                                          ? "Republish"
                                          : "Publish"}
                                </DropdownMenuItem>
                            )}

                            {job.status === "PUBLISHED" && (
                                <DropdownMenuItem disabled={isMutating} onSelect={handlePause}>
                                    <Pause className="size-4" />

                                    {unpublishMutation.isPending ? "Pausing..." : "Pause"}
                                </DropdownMenuItem>
                            )}

                            {job.status !== "ARCHIVED" && (
                                <DropdownMenuItem onSelect={() => setIsEditOpen(true)}>
                                    <Edit3 className="size-4" />
                                    Edit
                                </DropdownMenuItem>
                            )}

                            {canArchive && (
                                <DropdownMenuItem disabled={isMutating} onSelect={handleArchive}>
                                    <Archive className="size-4" />

                                    {archiveMutation.isPending ? "Archiving..." : "Archive"}
                                </DropdownMenuItem>
                            )}

                            {job.status === "ARCHIVED" && (
                                <DropdownMenuItem disabled={isMutating} onSelect={handleRestore}>
                                    <RotateCcw className="size-4" />

                                    {restoreMutation.isPending
                                        ? "Restoring..."
                                        : "Restore as draft"}
                                </DropdownMenuItem>
                            )}

                            <DropdownMenuSeparator />

                            <DropdownMenuItem
                                variant="destructive"
                                onSelect={() => setIsDeleteOpen(true)}
                            >
                                <Trash2 className="size-4" />
                                Delete
                            </DropdownMenuItem>
                        </>
                    )}
                </DropdownMenuContent>
            </DropdownMenu>

            {hasJobManagementAccess && (
                <>
                    <EditJobDialog
                        open={isEditOpen}
                        onOpenChange={setIsEditOpen}
                        companyId={companyId}
                        job={job}
                        categories={categories}
                    />

                    <DeleteJobDialog
                        open={isDeleteOpen}
                        onOpenChange={setIsDeleteOpen}
                        companyId={companyId}
                        job={job}
                    />
                </>
            )}
        </>
    );
}
