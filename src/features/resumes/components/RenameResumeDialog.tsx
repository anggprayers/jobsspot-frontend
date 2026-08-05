"use client";

import { LoaderCircle, Pencil } from "lucide-react";
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
import { Input } from "@/components/ui/input";

import { useRenameResume } from "../hooks/useResumes";
import type { ResumeRecord } from "../types/resume";
import { getResumeErrorMessage } from "../utils/resumeFormatters";

type RenameResumeDialogProps = {
    resume: ResumeRecord;
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

export default function RenameResumeDialog({
    resume,
    open,
    onOpenChange,
}: RenameResumeDialogProps) {
    const [name, setName] = useState(resume.name);

    const renameMutation = useRenameResume();

    const normalizedName = name.trim();

    const hasChanges = normalizedName.length >= 1 && normalizedName !== resume.name;

    function handleOpenChange(nextOpen: boolean) {
        if (renameMutation.isPending) {
            return;
        }

        onOpenChange(nextOpen);
    }

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (!hasChanges) {
            return;
        }

        const toastId = toast.loading("Renaming resume...");

        try {
            const response = await renameMutation.mutateAsync({
                resumeId: resume.id,
                name: normalizedName,
            });

            toast.success(response.message, {
                id: toastId,
                description: `"${response.resume.name}" is ready to use.`,
            });

            onOpenChange(false);
        } catch (error) {
            toast.error(getResumeErrorMessage(error, "Unable to rename the resume."), {
                id: toastId,
            });
        }
    }

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent
                className="sm:max-w-md"
                onEscapeKeyDown={(event) => event.preventDefault()}
                onInteractOutside={(event) => event.preventDefault()}
            >
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Rename resume</DialogTitle>

                        <DialogDescription>
                            Use a clear name so you can identify this resume when applying for jobs.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="py-6">
                        <label htmlFor="resume-rename" className="text-sm font-semibold">
                            Resume name
                        </label>

                        <Input
                            id="resume-rename"
                            value={name}
                            onChange={(event) => setName(event.target.value)}
                            disabled={renameMutation.isPending}
                            maxLength={100}
                            autoFocus
                            className="mt-2"
                        />

                        <p className="mt-2 text-xs text-muted-foreground">
                            {normalizedName.length}/100 characters
                        </p>
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            disabled={renameMutation.isPending}
                            onClick={() => onOpenChange(false)}
                        >
                            Cancel
                        </Button>

                        <Button type="submit" disabled={!hasChanges || renameMutation.isPending}>
                            {renameMutation.isPending ? (
                                <LoaderCircle className="animate-spin" />
                            ) : (
                                <Pencil />
                            )}

                            {renameMutation.isPending ? "Saving..." : "Save name"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
