"use client";

import { Crown, LoaderCircle, ShieldAlert } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState, type SubmitEvent } from "react";
import { toast } from "sonner";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { getCurrentUser } from "@/features/auth/api/getCurrentUser";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useAuthStore } from "@/features/auth/store/authStore";
import { publishAuthTabEvent } from "@/features/auth/utils/authTabSync";

import { useTransferCompanyOwnership } from "../hooks/useCompanyTeam";
import type { CompanyMember } from "../types/team";
import {
    formatCompanyMemberRole,
    getTeamErrorMessage,
    getTeamMemberInitials,
} from "../utils/teamFormatters";

type TransferOwnershipDialogProps = {
    companyId: string;
    companyName: string;
    eligibleMembers: CompanyMember[];
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

function normalizeConfirmation(value: string): string {
    return value.trim().replace(/\s+/g, " ").toLocaleLowerCase();
}

export default function TransferOwnershipDialog({
    companyId,
    companyName,
    eligibleMembers,
    open,
    onOpenChange,
}: TransferOwnershipDialogProps) {
    const router = useRouter();
    const { accessToken } = useAuth();
    const setUser = useAuthStore((state) => state.setUser);

    const [selectedMemberId, setSelectedMemberId] = useState("");
    const [confirmationCompanyName, setConfirmationCompanyName] = useState("");

    const transferOwnershipMutation = useTransferCompanyOwnership(companyId);

    const selectedMember = useMemo(
        () => eligibleMembers.find((member) => member.id === selectedMemberId) ?? null,
        [eligibleMembers, selectedMemberId],
    );

    const confirmationMatches =
        normalizeConfirmation(confirmationCompanyName) === normalizeConfirmation(companyName);

    function resetDialog() {
        setSelectedMemberId("");
        setConfirmationCompanyName("");
        transferOwnershipMutation.reset();
    }

    function handleOpenChange(nextOpen: boolean) {
        if (transferOwnershipMutation.isPending) {
            return;
        }

        if (!nextOpen) {
            resetDialog();
        }

        onOpenChange(nextOpen);
    }

    async function refreshCurrentUser() {
        if (!accessToken) {
            router.refresh();
            return;
        }

        const response = await getCurrentUser(accessToken);

        setUser(response.user);
        publishAuthTabEvent("session-updated");
        router.refresh();
    }

    async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
        event.preventDefault();

        if (!selectedMember || !confirmationMatches || transferOwnershipMutation.isPending) {
            return;
        }

        const toastId = toast.loading("Transferring company ownership...");

        try {
            const response = await transferOwnershipMutation.mutateAsync({
                targetMemberId: selectedMember.id,
                confirmationCompanyName: confirmationCompanyName.trim(),
            });

            toast.success(response.message, {
                id: toastId,
                description: `${selectedMember.user.firstName} ${selectedMember.user.lastName} is now the owner. Your role changed to Admin.`,
            });

            resetDialog();
            onOpenChange(false);

            try {
                await refreshCurrentUser();
            } catch {
                window.location.assign("/employers/team");
            }
        } catch (error) {
            toast.error(getTeamErrorMessage(error, "Unable to transfer company ownership."), {
                id: toastId,
            });
        }
    }

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="sm:max-w-xl">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <div className="mb-2 flex size-12 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
                            <Crown className="size-6" />
                        </div>

                        <DialogTitle>Transfer company ownership</DialogTitle>

                        <DialogDescription>
                            Choose an active team member to become the only owner of {companyName}.
                            Your role will change to Admin immediately.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-6 py-6">
                        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900">
                            <div className="flex items-start gap-3">
                                <ShieldAlert className="mt-0.5 size-5 shrink-0" />

                                <div>
                                    <p className="font-semibold">This action changes company control.</p>

                                    <p className="mt-1">
                                        The new owner can manage all company information, jobs,
                                        applicants, and team permissions. You will remain an administrator.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div>
                            <label htmlFor="ownership-target-member" className="text-sm font-semibold">
                                New company owner
                            </label>

                            <Select
                                value={selectedMemberId}
                                onValueChange={setSelectedMemberId}
                                disabled={transferOwnershipMutation.isPending}
                            >
                                <SelectTrigger id="ownership-target-member" className="mt-2 w-full">
                                    <SelectValue placeholder="Select a team member" />
                                </SelectTrigger>

                                <SelectContent>
                                    {eligibleMembers.map((member) => (
                                        <SelectItem key={member.id} value={member.id}>
                                            {member.user.firstName} {member.user.lastName} · {formatCompanyMemberRole(member.role)}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {selectedMember && (
                            <div className="flex items-center gap-3 rounded-xl border bg-muted/30 p-4">
                                <Avatar className="size-11">
                                    <AvatarImage
                                        src={selectedMember.user.avatarUrl ?? undefined}
                                        alt={`${selectedMember.user.firstName} ${selectedMember.user.lastName}`}
                                    />

                                    <AvatarFallback>
                                        {getTeamMemberInitials(
                                            selectedMember.user.firstName,
                                            selectedMember.user.lastName,
                                        )}
                                    </AvatarFallback>
                                </Avatar>

                                <div className="min-w-0 flex-1">
                                    <p className="truncate font-semibold">
                                        {selectedMember.user.firstName} {selectedMember.user.lastName}
                                    </p>

                                    <p className="truncate text-sm text-muted-foreground">
                                        {selectedMember.user.email}
                                    </p>
                                </div>

                                <span className="rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">
                                    New owner
                                </span>
                            </div>
                        )}

                        <div>
                            <label htmlFor="ownership-company-confirmation" className="text-sm font-semibold">
                                Type <span className="text-foreground">{companyName}</span> to confirm
                            </label>

                            <Input
                                id="ownership-company-confirmation"
                                value={confirmationCompanyName}
                                onChange={(event) => setConfirmationCompanyName(event.target.value)}
                                disabled={transferOwnershipMutation.isPending}
                                maxLength={100}
                                autoComplete="off"
                                placeholder={companyName}
                                className="mt-2"
                            />

                            {confirmationCompanyName && !confirmationMatches && (
                                <p className="mt-2 text-xs font-medium text-red-600">
                                    The company name does not match.
                                </p>
                            )}
                        </div>
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => handleOpenChange(false)}
                            disabled={transferOwnershipMutation.isPending}
                        >
                            Cancel
                        </Button>

                        <Button
                            type="submit"
                            disabled={
                                !selectedMember ||
                                !confirmationMatches ||
                                transferOwnershipMutation.isPending
                            }
                            className="bg-amber-600 text-white hover:bg-amber-700"
                        >
                            {transferOwnershipMutation.isPending ? (
                                <LoaderCircle className="animate-spin" />
                            ) : (
                                <Crown />
                            )}

                            {transferOwnershipMutation.isPending
                                ? "Transferring..."
                                : "Transfer ownership"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
