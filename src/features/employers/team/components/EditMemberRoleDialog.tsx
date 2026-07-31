"use client";

import { LoaderCircle, UserCog } from "lucide-react";
import { useState, type SubmitEvent } from "react";
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import { useUpdateCompanyMemberRole } from "../hooks/useCompanyTeam";
import type { AssignableCompanyMemberRole, CompanyMember } from "../types/team";
import {
    formatCompanyMemberRole,
    getTeamErrorMessage,
    getTeamMemberInitials,
    roleDescriptions,
} from "../utils/teamFormatters";

type EditMemberRoleDialogProps = {
    companyId: string;
    member: CompanyMember;
    isOwner: boolean;
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

export default function EditMemberRoleDialog({
    companyId,
    member,
    isOwner,
    open,
    onOpenChange,
}: EditMemberRoleDialogProps) {
    const initialRole: AssignableCompanyMemberRole =
        member.role === "OWNER" ? "RECRUITER" : member.role;

    const [role, setRole] = useState<AssignableCompanyMemberRole>(initialRole);

    const updateRoleMutation = useUpdateCompanyMemberRole(companyId);

    async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
        event.preventDefault();

        if (role === member.role) {
            onOpenChange(false);
            return;
        }

        const toastId = toast.loading("Updating member role...");

        try {
            const response = await updateRoleMutation.mutateAsync({
                memberId: member.id,
                data: {
                    role,
                },
            });

            toast.success(response.message, {
                id: toastId,
                description: `${member.user.firstName} ${member.user.lastName} is now ${formatCompanyMemberRole(role)}.`,
            });

            onOpenChange(false);
        } catch (error) {
            toast.error(getTeamErrorMessage(error, "Unable to update the member role."), {
                id: toastId,
            });
        }
    }

    return (
        <Dialog
            open={open}
            onOpenChange={(nextOpen: boolean) => {
                if (!updateRoleMutation.isPending) {
                    onOpenChange(nextOpen);
                }
            }}
        >
            <DialogContent>
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Change member role</DialogTitle>

                        <DialogDescription>
                            Update the company permissions for {member.user.firstName}{" "}
                            {member.user.lastName}.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-5 py-6">
                        <div className="flex items-center gap-3 rounded-xl border bg-muted/30 p-4">
                            <Avatar className="size-11">
                                <AvatarImage
                                    src={member.user.avatarUrl ?? undefined}
                                    alt={`${member.user.firstName} ${member.user.lastName}`}
                                />

                                <AvatarFallback>
                                    {getTeamMemberInitials(
                                        member.user.firstName,
                                        member.user.lastName,
                                    )}
                                </AvatarFallback>
                            </Avatar>

                            <div className="min-w-0">
                                <p className="truncate font-semibold">
                                    {member.user.firstName} {member.user.lastName}
                                </p>

                                <p className="truncate text-sm text-muted-foreground">
                                    {member.user.email}
                                </p>
                            </div>
                        </div>

                        <div>
                            <label htmlFor="edit-member-role" className="text-sm font-semibold">
                                Role
                            </label>

                            <Select
                                value={role}
                                onValueChange={(value) =>
                                    setRole(value as AssignableCompanyMemberRole)
                                }
                                disabled={updateRoleMutation.isPending}
                            >
                                <SelectTrigger id="edit-member-role" className="mt-2 w-full">
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
                            onClick={() => onOpenChange(false)}
                            disabled={updateRoleMutation.isPending}
                        >
                            Cancel
                        </Button>

                        <Button
                            type="submit"
                            disabled={role === member.role || updateRoleMutation.isPending}
                        >
                            {updateRoleMutation.isPending ? (
                                <LoaderCircle className="animate-spin" />
                            ) : (
                                <UserCog />
                            )}

                            {updateRoleMutation.isPending ? "Updating..." : "Update role"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
