"use client";

import Link from "next/link";
import { Crown, LoaderCircle, Search, ShieldCheck, Trash2, UserCog, UserPlus, Users } from "lucide-react";
import { useMemo, useState } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import { useAuth } from "@/features/auth/hooks/useAuth";
import {
    canManageCompanyMember,
    canManageTeam,
    isCompanyOwner,
} from "@/features/employers/utils/employerPermissions";

import { useCompanyMembers } from "../hooks/useCompanyTeam";
import type { CompanyMember } from "../types/team";
import {
    formatCompanyMemberRole,
    formatTeamMemberJoinedDate,
    getCompanyMemberRoleBadgeClasses,
    getTeamErrorMessage,
    getTeamMemberInitials,
} from "../utils/teamFormatters";

import CompanyInvitationsCard from "./CompanyInvitationsCard";
import EditMemberRoleDialog from "./EditMemberRoleDialog";
import RemoveMemberDialog from "./RemoveMemberDialog";
import InviteMemberDialog from "./InviteMemberDialog";
import TeamStats from "./TeamStats";
import TransferOwnershipDialog from "./TransferOwnershipDialog";

const EMPTY_MEMBERS: CompanyMember[] = [];

export default function EmployerTeamPage() {
    const { user, activeCompanyId, activeMembership, activeCompanyRole, isInitializing } =
        useAuth();

    const companyId = activeCompanyId ?? "";

    const isOwner = isCompanyOwner(activeCompanyRole);

    const hasTeamManagementAccess = canManageTeam(activeCompanyRole);

    const [searchValue, setSearchValue] = useState("");

    const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);

    const [memberBeingEdited, setMemberBeingEdited] = useState<CompanyMember | null>(null);

    const [memberBeingRemoved, setMemberBeingRemoved] = useState<CompanyMember | null>(null);

    const [isTransferOwnershipDialogOpen, setIsTransferOwnershipDialogOpen] = useState(false);

    const membersQuery = useCompanyMembers({
        companyId,
        enabled: !isInitializing && hasTeamManagementAccess,
    });

    const members = membersQuery.data?.members ?? EMPTY_MEMBERS;

    const eligibleOwnershipRecipients = useMemo(
        () => members.filter((member) => member.role !== "OWNER" && member.user.id !== user?.id),
        [members, user?.id],
    );

    const filteredMembers = useMemo(() => {
        const normalizedSearch = searchValue.trim().toLowerCase();

        if (!normalizedSearch) {
            return members;
        }

        return members.filter((member) => {
            const fullName = `${member.user.firstName} ${member.user.lastName}`.toLowerCase();

            return (
                fullName.includes(normalizedSearch) ||
                member.user.email.toLowerCase().includes(normalizedSearch) ||
                member.role.toLowerCase().includes(normalizedSearch)
            );
        });
    }, [members, searchValue]);

    function canManageMember(member: CompanyMember): boolean {
        return canManageCompanyMember({
            actorRole: activeCompanyRole,
            actorUserId: user?.id,
            targetRole: member.role,
            targetUserId: member.user.id,
        });
    }

    if (isInitializing) {
        return (
            <div className="flex min-h-96 items-center justify-center gap-2 text-sm text-muted-foreground">
                <LoaderCircle className="size-5 animate-spin" />
                Loading team access...
            </div>
        );
    }

    if (!hasTeamManagementAccess) {
        return (
            <div className="mx-auto w-full max-w-4xl">
                <Card>
                    <CardContent className="flex min-h-96 flex-col items-center justify-center p-8 text-center">
                        <div className="mb-5 rounded-full bg-muted p-4">
                            <ShieldCheck className="size-8 text-muted-foreground" />
                        </div>

                        <h1 className="text-2xl font-bold">Team management is restricted</h1>

                        <p className="mt-3 max-w-lg text-muted-foreground">
                            Only company owners and administrators can view or manage company team
                            members.
                        </p>

                        <Button variant="outline" className="mt-6" asChild>
                            <Link href="/employers">Return to dashboard</Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="mx-auto w-full max-w-7xl space-y-8">
            <section className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
                <div>
                    <p className="text-sm font-semibold text-primary">Company access</p>

                    <h1 className="mt-1 text-3xl font-bold tracking-tight">Team</h1>

                    <p className="mt-2 max-w-2xl text-muted-foreground">
                        Invite people and manage who can access{" "}
                        {activeMembership?.companyName ?? "your company"} workspace.
                    </p>
                </div>

                <Button type="button" onClick={() => setIsInviteDialogOpen(true)}>
                    <UserPlus />
                    Invite member
                </Button>
            </section>

            <TeamStats members={members} isLoading={membersQuery.isLoading} />

            <CompanyInvitationsCard
                companyId={companyId}
                isOwner={isOwner}
                enabled={!isInitializing && hasTeamManagementAccess}
            />

            {isOwner && (
                <Card className="border-amber-200 bg-amber-50/40">
                    <CardHeader className="gap-5 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-start gap-4">
                            <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
                                <Crown className="size-5" />
                            </div>

                            <div>
                                <CardTitle>Company ownership</CardTitle>

                                <CardDescription className="mt-1 max-w-2xl">
                                    Transfer ownership to another active member when the person who
                                    created this workspace is not the long-term company owner.
                                </CardDescription>
                            </div>
                        </div>

                        <Button
                            type="button"
                            variant="outline"
                            disabled={eligibleOwnershipRecipients.length === 0}
                            onClick={() => setIsTransferOwnershipDialogOpen(true)}
                            className="border-amber-300 bg-white text-amber-800 hover:bg-amber-100 hover:text-amber-900"
                        >
                            <Crown />
                            Transfer ownership
                        </Button>
                    </CardHeader>

                    {eligibleOwnershipRecipients.length === 0 && (
                        <CardContent className="pt-0 text-sm text-muted-foreground">
                            Add another registered JobsSpot user to the team before transferring
                            ownership.
                        </CardContent>
                    )}
                </Card>
            )}

            <Card>
                <CardHeader className="gap-5 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <CardTitle>Company members</CardTitle>

                        <CardDescription className="mt-1">
                            Owners and administrators can update or remove active team members after
                            they accept an invitation.
                        </CardDescription>
                    </div>

                    <div className="relative w-full sm:max-w-xs">
                        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />

                        <Input
                            value={searchValue}
                            onChange={(event) => setSearchValue(event.target.value)}
                            placeholder="Search team members"
                            className="pl-9"
                        />
                    </div>
                </CardHeader>

                <CardContent>
                    {membersQuery.isLoading && (
                        <div className="flex min-h-64 items-center justify-center gap-2 rounded-xl border border-dashed text-sm text-muted-foreground">
                            <LoaderCircle className="size-5 animate-spin" />
                            Loading company members...
                        </div>
                    )}

                    {membersQuery.isError && (
                        <div className="flex min-h-64 items-center justify-center rounded-xl border border-red-200 bg-red-50 p-6 text-center text-sm text-red-700">
                            {getTeamErrorMessage(
                                membersQuery.error,
                                "Unable to load company members.",
                            )}
                        </div>
                    )}

                    {!membersQuery.isLoading && !membersQuery.isError && members.length === 0 && (
                        <div className="flex min-h-64 flex-col items-center justify-center rounded-xl border border-dashed p-8 text-center">
                            <div className="mb-4 rounded-full bg-muted p-4">
                                <Users className="size-7 text-muted-foreground" />
                            </div>

                            <h3 className="font-semibold">No team members found</h3>

                            <p className="mt-2 max-w-sm text-sm text-muted-foreground">
                                Invite a teammate to begin building your company team.
                            </p>
                        </div>
                    )}

                    {!membersQuery.isLoading &&
                        !membersQuery.isError &&
                        members.length > 0 &&
                        filteredMembers.length === 0 && (
                            <div className="flex min-h-56 flex-col items-center justify-center rounded-xl border border-dashed p-8 text-center">
                                <Search className="mb-3 size-7 text-muted-foreground" />

                                <h3 className="font-semibold">No matching members</h3>

                                <p className="mt-2 text-sm text-muted-foreground">
                                    Try a different name, email, or role.
                                </p>
                            </div>
                        )}

                    {!membersQuery.isLoading &&
                        !membersQuery.isError &&
                        filteredMembers.length > 0 && (
                            <div className="divide-y overflow-hidden rounded-xl border">
                                {filteredMembers.map((member) => {
                                    const isCurrentUser = member.user.id === user?.id;

                                    const manageable = canManageMember(member);

                                    return (
                                        <div
                                            key={member.id}
                                            className="flex flex-col gap-4 p-4 transition hover:bg-muted/30 lg:flex-row lg:items-center"
                                        >
                                            <div className="flex min-w-0 flex-1 items-center gap-3">
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
                                                    <div className="flex flex-wrap items-center gap-2">
                                                        <p className="truncate font-semibold">
                                                            {member.user.firstName}{" "}
                                                            {member.user.lastName}
                                                        </p>

                                                        {isCurrentUser && (
                                                            <span className="rounded-full border bg-muted px-2 py-0.5 text-[11px] font-semibold text-muted-foreground">
                                                                You
                                                            </span>
                                                        )}
                                                    </div>

                                                    <p className="truncate text-sm text-muted-foreground">
                                                        {member.user.email}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="grid gap-3 sm:grid-cols-2 lg:w-97.5 lg:grid-cols-[150px_1fr] lg:items-center">
                                                <div>
                                                    <span
                                                        className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${getCompanyMemberRoleBadgeClasses(
                                                            member.role,
                                                        )}`}
                                                    >
                                                        {formatCompanyMemberRole(member.role)}
                                                    </span>
                                                </div>

                                                <div className="text-sm text-muted-foreground">
                                                    Joined{" "}
                                                    {formatTeamMemberJoinedDate(member.joinedAt)}
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2 lg:justify-end">
                                                {manageable ? (
                                                    <>
                                                        <Button
                                                            type="button"
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={() =>
                                                                setMemberBeingEdited(member)
                                                            }
                                                        >
                                                            <UserCog />
                                                            Change role
                                                        </Button>

                                                        <Button
                                                            type="button"
                                                            size="sm"
                                                            variant="destructive"
                                                            onClick={() =>
                                                                setMemberBeingRemoved(member)
                                                            }
                                                        >
                                                            <Trash2 />
                                                            Remove
                                                        </Button>
                                                    </>
                                                ) : (
                                                    <p className="text-xs text-muted-foreground">
                                                        {member.role === "OWNER"
                                                            ? "Protected owner account"
                                                            : isCurrentUser
                                                              ? "Manage your account in Settings"
                                                              : "Restricted member"}
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

            <TransferOwnershipDialog
                companyId={companyId}
                companyName={activeMembership?.companyName ?? "your company"}
                eligibleMembers={eligibleOwnershipRecipients}
                open={isTransferOwnershipDialogOpen}
                onOpenChange={setIsTransferOwnershipDialogOpen}
            />

            <InviteMemberDialog
                companyId={companyId}
                companyName={activeMembership?.companyName ?? "your company"}
                isOwner={isOwner}
                open={isInviteDialogOpen}
                onOpenChange={setIsInviteDialogOpen}
            />

            {memberBeingEdited && (
                <EditMemberRoleDialog
                    key={memberBeingEdited.id}
                    companyId={companyId}
                    member={memberBeingEdited}
                    isOwner={isOwner}
                    open
                    onOpenChange={(open: boolean) => {
                        if (!open) {
                            setMemberBeingEdited(null);
                        }
                    }}
                />
            )}

            {memberBeingRemoved && (
                <RemoveMemberDialog
                    key={memberBeingRemoved.id}
                    companyId={companyId}
                    member={memberBeingRemoved}
                    canRemove={canManageMember(memberBeingRemoved)}
                    open
                    onOpenChange={(open: boolean) => {
                        if (!open) {
                            setMemberBeingRemoved(null);
                        }
                    }}
                />
            )}
        </div>
    );
}
