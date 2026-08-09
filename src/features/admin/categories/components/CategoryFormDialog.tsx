"use client";

import { LoaderCircle } from "lucide-react";
import { useState } from "react";
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
import { Label } from "@/components/ui/label";

import { getAdminErrorMessage } from "../../shared/utils/adminFormatters";
import { useCreateAdminCategory, useUpdateAdminCategory } from "../hooks/useAdminCategories";
import type { AdminJobCategory } from "../types/adminCategory";

type CategoryFormDialogProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    category?: AdminJobCategory | null;
};

type CategoryFormDialogContentProps = {
    category?: AdminJobCategory | null;
    onOpenChange: (open: boolean) => void;
};

function CategoryFormDialogContent({ category, onOpenChange }: CategoryFormDialogContentProps) {
    const isEditing = Boolean(category);
    const [name, setName] = useState(() => category?.name ?? "");
    const [displayOrder, setDisplayOrder] = useState(() => String(category?.displayOrder ?? 0));
    const createMutation = useCreateAdminCategory();
    const updateMutation = useUpdateAdminCategory(category?.id ?? "");
    const isPending = createMutation.isPending || updateMutation.isPending;

    const parsedOrder = Number(displayOrder);
    const isValid = name.trim().length >= 2 && Number.isInteger(parsedOrder) && parsedOrder >= 0 && parsedOrder <= 10_000;

    async function handleSubmit() {
        if (!isValid || isPending) return;

        const toastId = toast.loading(isEditing ? "Updating category..." : "Creating category...");

        try {
            const response = isEditing && category
                ? await updateMutation.mutateAsync({ name: name.trim(), displayOrder: parsedOrder })
                : await createMutation.mutateAsync({ name: name.trim(), displayOrder: parsedOrder });

            toast.success(response.message, { id: toastId });
            onOpenChange(false);
        } catch (error) {
            toast.error(getAdminErrorMessage(error, `Unable to ${isEditing ? "update" : "create"} the category.`), { id: toastId });
        }
    }

    return (
        <DialogContent className="sm:max-w-lg">
            <DialogHeader>
                <DialogTitle>{isEditing ? "Edit job category" : "Create job category"}</DialogTitle>
                <DialogDescription>
                    {isEditing
                        ? "Update the category label and its display order. The existing public URL key stays unchanged so saved links and searches keep working."
                        : "Add a category employers can use when creating job listings."}
                </DialogDescription>
            </DialogHeader>

            <div className="space-y-5">
                <div className="space-y-2">
                    <Label htmlFor="admin-category-name">Category name</Label>
                    <Input
                        id="admin-category-name"
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                        placeholder="e.g. Healthcare"
                        maxLength={80}
                        autoComplete="off"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Use a clear label job seekers will understand.</span>
                        <span>{name.length}/80</span>
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="admin-category-order">Display order</Label>
                    <Input
                        id="admin-category-order"
                        type="number"
                        min={0}
                        max={10_000}
                        step={1}
                        value={displayOrder}
                        onChange={(event) => setDisplayOrder(event.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">Lower numbers appear first in public category lists.</p>
                </div>
            </div>

            <DialogFooter>
                <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>
                    Cancel
                </Button>
                <Button type="button" onClick={() => void handleSubmit()} disabled={!isValid || isPending}>
                    {isPending && <LoaderCircle className="animate-spin" />}
                    {isEditing ? "Save changes" : "Create category"}
                </Button>
            </DialogFooter>
        </DialogContent>
    );
}

export default function CategoryFormDialog({ open, onOpenChange, category }: CategoryFormDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            {open ? (
                <CategoryFormDialogContent
                    key={category?.id ?? "new-category"}
                    category={category}
                    onOpenChange={onOpenChange}
                />
            ) : null}
        </Dialog>
    );
}
