"use client";

import { BadgeCheck, BadgeX, LoaderCircle } from "lucide-react";
import { toast } from "sonner";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { getAdminErrorMessage } from "../../shared/utils/adminFormatters";
import { useUpdateAdminCompanyVerification } from "../hooks/useAdminCompanies";
import type { AdminCompanyDetails, AdminCompanyListItem } from "../types/adminCompany";

type ModeratedCompany = AdminCompanyListItem | AdminCompanyDetails;

type CompanyVerificationDialogProps = {
    company: ModeratedCompany;
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

export default function CompanyVerificationDialog({
    company,
    open,
    onOpenChange,
}: CompanyVerificationDialogProps) {
    const mutation = useUpdateAdminCompanyVerification(company.id);
    const willVerify = !company.isVerified;

    async function handleConfirm() {
        if (mutation.isPending) {
            return;
        }

        const toastId = toast.loading(
            willVerify ? "Verifying company..." : "Removing verification...",
        );

        try {
            const response = await mutation.mutateAsync({ verified: willVerify });
            toast.success(response.message, { id: toastId });
            onOpenChange(false);
        } catch (error) {
            toast.error(
                getAdminErrorMessage(
                    error,
                    willVerify
                        ? "Unable to verify this company."
                        : "Unable to remove company verification.",
                ),
                { id: toastId },
            );
        }
    }

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <div
                        className={`mb-2 flex size-11 items-center justify-center rounded-xl ${
                            willVerify
                                ? "bg-blue-50 text-blue-600"
                                : "bg-amber-50 text-amber-700"
                        }`}
                    >
                        {willVerify ? (
                            <BadgeCheck className="size-5" />
                        ) : (
                            <BadgeX className="size-5" />
                        )}
                    </div>
                    <AlertDialogTitle>
                        {willVerify ? "Verify company" : "Remove verification"}
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        {willVerify
                            ? `Mark ${company.name} as verified on JobsSpot. Only do this after reviewing the organization.`
                            : `Remove the verified status from ${company.name}. This does not suspend or delete the company.`}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={mutation.isPending}>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={(event) => {
                            event.preventDefault();
                            void handleConfirm();
                        }}
                        disabled={mutation.isPending}
                    >
                        {mutation.isPending && <LoaderCircle className="animate-spin" />}
                        {willVerify ? "Verify company" : "Remove verification"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
