"use client";

import {
    Clock3,
    LoaderCircle,
    Mail,
    RefreshCw,
    RotateCw,
    Send,
    XCircle,
} from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import {
    useCompanyInvitations,
    useResendCompanyInvitation,
} from "../hooks/useCompanyTeam";
import type { CompanyInvitation } from "../types/team";
import {
    formatCompanyMemberRole,
    formatInvitationDate,
    formatInvitationStatus,
    getCompanyMemberRoleBadgeClasses,
    getInvitationStatusBadgeClasses,
    getTeamErrorDescription,
    getTeamErrorMessage,
    getTeamMemberInitials,
} from "../utils/teamFormatters";

import CancelInvitationDialog from "./CancelInvitationDialog";

type CompanyInvitationsCardProps = {
    companyId: string;
    isOwner: boolean;
    enabled: boolean;
    onInvite: () => void;
};

const EMPTY_INVITATIONS: CompanyInvitation[] = [];

export default function CompanyInvitationsCard({
    companyId,
    isOwner,
    enabled,
    onInvite,
}: CompanyInvitationsCardProps) {
    const [invitationBeingCancelled, setInvitationBeingCancelled] =
        useState<CompanyInvitation | null>(null);

    const queryClient = useQueryClient();

    const invitationsQuery = useCompanyInvitations({
        companyId,
        enabled,
    });

    const resendInvitationMutation = useResendCompanyInvitation(companyId);

    const invitations = invitationsQuery.data?.invitations ?? EMPTY_INVITATIONS;

    function canManageInvitation(invitation: CompanyInvitation): boolean {
        return isOwner || invitation.role !== "ADMIN";
    }

    async function handleRefresh() {
        await Promise.all([
            invitationsQuery.refetch(),
            queryClient.invalidateQueries({
                queryKey: ["company-members", companyId],
            }),
        ]);
    }

    async function handleResend(invitation: CompanyInvitation) {
        if (!canManageInvitation(invitation) || resendInvitationMutation.isPending) {
            return;
        }

        const toastId = toast.loading("Resending company invitation...");

        try {
            const response = await resendInvitationMutation.mutateAsync(invitation.id);

            toast.success(response.message, {
                id: toastId,
                description: `A fresh invitation link was sent to ${invitation.email}.`,
            });
        } catch (error) {
            toast.error(getTeamErrorMessage(error, "Unable to resend the company invitation."), {
                id: toastId,
                description: getTeamErrorDescription(error),
            });
        }
    }

    return (
        <>
            <Card>
                <CardHeader className="gap-5 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <CardTitle className="flex items-center gap-2">
                            <Mail className="size-5 text-primary" />
                            Company invitations
                        </CardTitle>

                        <CardDescription className="mt-1">
                            Track invitations that are waiting for recipients to join the company.
                        </CardDescription>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => void handleRefresh()}
                            disabled={invitationsQuery.isFetching}
                        >
                            <RefreshCw
                                className={invitationsQuery.isFetching ? "animate-spin" : undefined}
                            />
                            Refresh
                        </Button>

                        <Button type="button" onClick={onInvite}>
                            <Send />
                            Invite member
                        </Button>
                    </div>
                </CardHeader>

                <CardContent>
                    {invitationsQuery.isLoading && (
                        <div className="flex min-h-48 items-center justify-center gap-2 rounded-xl border border-dashed text-sm text-muted-foreground">
                            <LoaderCircle className="size-5 animate-spin" />
                            Loading company invitations...
                        </div>
                    )}

                    {invitationsQuery.isError && (
                        <div className="flex min-h-48 flex-col items-center justify-center rounded-xl border border-red-200 bg-red-50 p-6 text-center text-sm text-red-700">
                            <p>
                                {getTeamErrorMessage(
                                    invitationsQuery.error,
                                    "Unable to load company invitations.",
                                )}
                            </p>

                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                className="mt-4 border-red-200 bg-white text-red-700 hover:bg-red-100 hover:text-red-800"
                                onClick={() => void invitationsQuery.refetch()}
                            >
                                <RotateCw />
                                Try again
                            </Button>
                        </div>
                    )}

                    {!invitationsQuery.isLoading &&
                        !invitationsQuery.isError &&
                        invitations.length === 0 && (
                            <div className="flex min-h-48 flex-col items-center justify-center rounded-xl border border-dashed p-8 text-center">
                                <div className="mb-4 rounded-full bg-muted p-4">
                                    <Mail className="size-7 text-muted-foreground" />
                                </div>

                                <h3 className="font-semibold">No pending invitations</h3>

                                <p className="mt-2 max-w-md text-sm text-muted-foreground">
                                    Invite a teammate by email. They can accept after signing in or
                                    creating their JobsSpot account.
                                </p>

                                <Button type="button" className="mt-5" onClick={onInvite}>
                                    <Send />
                                    Send an invitation
                                </Button>
                            </div>
                        )}

                    {!invitationsQuery.isLoading &&
                        !invitationsQuery.isError &&
                        invitations.length > 0 && (
                            <div className="divide-y overflow-hidden rounded-xl border">
                                {invitations.map((invitation) => {
                                    const canManage = canManageInvitation(invitation);
                                    const isBeingResent =
                                        resendInvitationMutation.isPending &&
                                        resendInvitationMutation.variables === invitation.id;

                                    return (
                                        <div
                                            key={invitation.id}
                                            className="flex flex-col gap-4 p-4 transition hover:bg-muted/30 xl:flex-row xl:items-center"
                                        >
                                            <div className="flex min-w-0 flex-1 items-center gap-3">
                                                <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                                                    <Mail className="size-5" />
                                                </div>

                                                <div className="min-w-0">
                                                    <p className="truncate font-semibold">
                                                        {invitation.email}
                                                    </p>

                                                    <div className="mt-1 flex min-w-0 items-center gap-2 text-xs text-muted-foreground">
                                                        <Avatar className="size-5">
                                                            <AvatarImage
                                                                src={
                                                                    invitation.invitedBy
                                                                        .avatarUrl ?? undefined
                                                                }
                                                                alt={`${invitation.invitedBy.firstName} ${invitation.invitedBy.lastName}`}
                                                            />

                                                            <AvatarFallback className="text-[9px]">
                                                                {getTeamMemberInitials(
                                                                    invitation.invitedBy.firstName,
                                                                    invitation.invitedBy.lastName,
                                                                )}
                                                            </AvatarFallback>
                                                        </Avatar>

                                                        <span className="truncate">
                                                            Invited by {invitation.invitedBy.firstName}{" "}
                                                            {invitation.invitedBy.lastName}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="grid gap-3 text-sm sm:grid-cols-2 xl:w-135 xl:grid-cols-[120px_110px_1fr] xl:items-center">
                                                <div>
                                                    <span
                                                        className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${getCompanyMemberRoleBadgeClasses(
                                                            invitation.role,
                                                        )}`}
                                                    >
                                                        {formatCompanyMemberRole(invitation.role)}
                                                    </span>
                                                </div>

                                                <div>
                                                    <span
                                                        className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${getInvitationStatusBadgeClasses(
                                                            invitation.status,
                                                        )}`}
                                                    >
                                                        {formatInvitationStatus(invitation.status)}
                                                    </span>
                                                </div>

                                                <div className="space-y-1 text-xs text-muted-foreground sm:col-span-2 xl:col-span-1">
                                                    <p className="flex items-center gap-1.5">
                                                        <Clock3 className="size-3.5" />
                                                        {invitation.status === "EXPIRED"
                                                            ? `Expired ${formatInvitationDate(invitation.expiresAt)}`
                                                            : `Expires ${formatInvitationDate(invitation.expiresAt)}`}
                                                    </p>

                                                    <p>
                                                        Sent {invitation.sendCount}{" "}
                                                        {invitation.sendCount === 1 ? "time" : "times"}
                                                        {invitation.lastSentAt
                                                            ? ` · Last sent ${formatInvitationDate(invitation.lastSentAt)}`
                                                            : ""}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex flex-wrap items-center gap-2 xl:justify-end">
                                                {canManage ? (
                                                    <>
                                                        <Button
                                                            type="button"
                                                            size="sm"
                                                            variant="outline"
                                                            disabled={
                                                                resendInvitationMutation.isPending
                                                            }
                                                            onClick={() =>
                                                                void handleResend(invitation)
                                                            }
                                                        >
                                                            {isBeingResent ? (
                                                                <LoaderCircle className="animate-spin" />
                                                            ) : (
                                                                <RotateCw />
                                                            )}
                                                            {isBeingResent
                                                                ? "Resending..."
                                                                : invitation.status === "EXPIRED"
                                                                  ? "Renew & resend"
                                                                  : "Resend"}
                                                        </Button>

                                                        <Button
                                                            type="button"
                                                            size="sm"
                                                            variant="destructive"
                                                            disabled={
                                                                resendInvitationMutation.isPending
                                                            }
                                                            onClick={() =>
                                                                setInvitationBeingCancelled(
                                                                    invitation,
                                                                )
                                                            }
                                                        >
                                                            <XCircle />
                                                            Cancel
                                                        </Button>
                                                    </>
                                                ) : (
                                                    <p className="text-xs text-muted-foreground">
                                                        Only the owner can manage admin invitations.
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                </CardContent>
            </Card>

            {invitationBeingCancelled && (
                <CancelInvitationDialog
                    key={invitationBeingCancelled.id}
                    companyId={companyId}
                    invitation={invitationBeingCancelled}
                    canManage={canManageInvitation(invitationBeingCancelled)}
                    open
                    onOpenChange={(open) => {
                        if (!open) {
                            setInvitationBeingCancelled(null);
                        }
                    }}
                />
            )}
        </>
    );
}
