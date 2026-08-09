"use client";

import { Eye, EyeOff, LoaderCircle } from "lucide-react";
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

import { getAdminErrorMessage } from "../../shared/utils/adminFormatters";
import { useUpdateAdminCategoryStatus } from "../hooks/useAdminCategories";
import type { AdminJobCategory } from "../types/adminCategory";

type CategoryStatusDialogProps = {
    category: AdminJobCategory;
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

export default function CategoryStatusDialog({ category, open, onOpenChange }: CategoryStatusDialogProps) {
    const mutation = useUpdateAdminCategoryStatus(category.id);
    const willActivate = !category.isActive;

    async function handleSubmit() {
        if (mutation.isPending) return;

        const toastId = toast.loading(willActivate ? "Activating category..." : "Deactivating category...");

        try {
            const response = await mutation.mutateAsync({ active: willActivate });
            toast.success(response.message, {
                id: toastId,
                description: willActivate
                    ? "Employers can select this category again and eligible published jobs can appear publicly."
                    : "Existing job records are preserved, but jobs in this category are removed from public listings until the category is reactivated.",
            });
            onOpenChange(false);
        } catch (error) {
            toast.error(getAdminErrorMessage(error, `Unable to ${willActivate ? "activate" : "deactivate"} the category.`), { id: toastId });
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <div className={`mb-2 flex size-11 items-center justify-center rounded-xl ${willActivate ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-700"}`}>
                        {willActivate ? <Eye className="size-5" /> : <EyeOff className="size-5" />}
                    </div>
                    <DialogTitle>{willActivate ? "Activate job category" : "Deactivate job category"}</DialogTitle>
                    <DialogDescription>
                        {willActivate
                            ? `Make ${category.name} available to employers and public category filters again.`
                            : `Temporarily remove ${category.name} from employer selection and public category filters.`}
                    </DialogDescription>
                </DialogHeader>

                {!willActivate && (
                    <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900">
                        <p className="font-semibold">This does not delete employer data.</p>
                        <p className="mt-1">
                            {category.counts.jobs} existing job{category.counts.jobs === 1 ? "" : "s"} currently use this category. Their records and employer statuses remain, but eligible public listings in this category will be hidden until it is active again.
                        </p>
                    </div>
                )}

                <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={mutation.isPending}>
                        Cancel
                    </Button>
                    <Button
                        type="button"
                        variant={willActivate ? "default" : "destructive"}
                        onClick={() => void handleSubmit()}
                        disabled={mutation.isPending}
                    >
                        {mutation.isPending && <LoaderCircle className="animate-spin" />}
                        {willActivate ? "Activate category" : "Deactivate category"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
