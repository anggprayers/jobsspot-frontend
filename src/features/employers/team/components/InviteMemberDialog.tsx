"use client";

import { LoaderCircle, MailPlus } from "lucide-react";
import { useState, type SubmitEvent } from "react";
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import { useCreateCompanyInvitation } from "../hooks/useCompanyTeam";
import type { AssignableCompanyMemberRole } from "../types/team";
import {
    formatCompanyMemberRole,
    getTeamErrorDescription,
    getTeamErrorMessage,
    roleDescriptions,
} from "../utils/teamFormatters";

type InviteMemberDialogProps = {
    companyId: string;
    companyName: string;
    isOwner: boolean;
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

export default function InviteMemberDialog({
    companyId,
    companyName,
    isOwner,
    open,
    onOpenChange,
}: InviteMemberDialogProps) {
    const [email, setEmail] = useState("");
    const [role, setRole] = useState<AssignableCompanyMemberRole>("RECRUITER");

    const createInvitationMutation = useCreateCompanyInvitation(companyId);

    function resetDialog() {
        setEmail("");
        setRole("RECRUITER");
    }

    function handleOpenChange(nextOpen: boolean) {
        if (createInvitationMutation.isPending) {
            return;
        }

        if (!nextOpen) {
            resetDialog();
        }

        onOpenChange(nextOpen);
    }

    async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
        event.preventDefault();

        const normalizedEmail = email.trim().toLowerCase();

        if (!normalizedEmail) {
            toast.error("Enter the recipient's email address.");

            return;
        }

        const toastId = toast.loading("Sending company invitation...");

        try {
            const response = await createInvitationMutation.mutateAsync({
                email: normalizedEmail,
                role,
            });

            toast.success(response.message, {
                id: toastId,
                description: `${normalizedEmail} was invited as ${formatCompanyMemberRole(role)}.`,
            });

            resetDialog();
            onOpenChange(false);
        } catch (error) {
            toast.error(getTeamErrorMessage(error, "Unable to send the company invitation."), {
                id: toastId,
                description: getTeamErrorDescription(error),
            });
        }
    }

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="sm:max-w-xl">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <div className="mb-2 flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                            <MailPlus className="size-6" />
                        </div>

                        <DialogTitle>Invite a team member</DialogTitle>

                        <DialogDescription>
                            Send an email invitation to join {companyName}. The recipient can sign in
                            or create a JobsSpot account using the invited email address.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-5 py-6">
                        <div>
                            <label htmlFor="company-invitation-email" className="text-sm font-semibold">
                                Email address
                            </label>

                            <Input
                                id="company-invitation-email"
                                type="email"
                                value={email}
                                onChange={(event) => setEmail(event.target.value)}
                                disabled={createInvitationMutation.isPending}
                                required
                                autoComplete="email"
                                autoFocus
                                maxLength={320}
                                placeholder="name@company.com"
                                className="mt-2"
                            />

                            <p className="mt-2 text-xs leading-5 text-muted-foreground">
                                Invitations expire after seven days and can be resent from the Team
                                page.
                            </p>
                        </div>

                        <div>
                            <label htmlFor="company-invitation-role" className="text-sm font-semibold">
                                Company role
                            </label>

                            <Select
                                value={role}
                                onValueChange={(value) =>
                                    setRole(value as AssignableCompanyMemberRole)
                                }
                                disabled={createInvitationMutation.isPending}
                            >
                                <SelectTrigger id="company-invitation-role" className="mt-2 w-full">
                                    <SelectValue />
                                </SelectTrigger>

                                <SelectContent>
                                    {isOwner && <SelectItem value="ADMIN">Admin</SelectItem>}

                                    <SelectItem value="RECRUITER">Recruiter</SelectItem>

                                    <SelectItem value="VIEWER">Viewer</SelectItem>
                                </SelectContent>
                            </Select>

                            <p className="mt-2 text-xs leading-5 text-muted-foreground">
                                {roleDescriptions[role]}
                            </p>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => handleOpenChange(false)}
                            disabled={createInvitationMutation.isPending}
                        >
                            Cancel
                        </Button>

                        <Button
                            type="submit"
                            disabled={!email.trim() || createInvitationMutation.isPending}
                        >
                            {createInvitationMutation.isPending ? (
                                <LoaderCircle className="animate-spin" />
                            ) : (
                                <MailPlus />
                            )}

                            {createInvitationMutation.isPending
                                ? "Sending invitation..."
                                : "Send invitation"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
