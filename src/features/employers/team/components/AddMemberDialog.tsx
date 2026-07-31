"use client";

import { Check, LoaderCircle, Search, UserPlus, X } from "lucide-react";
import { useEffect, useState, type SubmitEvent } from "react";
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

import { useAddCompanyMember, useSearchCompanyMemberCandidates } from "../hooks/useCompanyTeam";
import type { AssignableCompanyMemberRole, CompanyMemberCandidate } from "../types/team";
import {
    formatCompanyMemberRole,
    getTeamErrorMessage,
    getTeamMemberInitials,
    roleDescriptions,
} from "../utils/teamFormatters";

type AddMemberDialogProps = {
    companyId: string;
    isOwner: boolean;
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

export default function AddMemberDialog({
    companyId,
    isOwner,
    open,
    onOpenChange,
}: AddMemberDialogProps) {
    const [searchValue, setSearchValue] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");

    const [selectedCandidate, setSelectedCandidate] = useState<CompanyMemberCandidate | null>(null);

    const [role, setRole] = useState<AssignableCompanyMemberRole>("RECRUITER");

    const addMemberMutation = useAddCompanyMember(companyId);

    useEffect(() => {
        const timeout = window.setTimeout(() => {
            setDebouncedSearch(searchValue.trim());
        }, 350);

        return () => {
            window.clearTimeout(timeout);
        };
    }, [searchValue]);

    const candidateQuery = useSearchCompanyMemberCandidates({
        companyId,
        query: debouncedSearch,
        enabled: open && !selectedCandidate && debouncedSearch.length >= 3,
    });

    const candidates = candidateQuery.data?.users ?? [];

    function resetDialog() {
        setSearchValue("");
        setDebouncedSearch("");
        setSelectedCandidate(null);
        setRole("RECRUITER");
    }

    function handleOpenChange(nextOpen: boolean) {
        if (addMemberMutation.isPending) {
            return;
        }

        if (!nextOpen) {
            resetDialog();
        }

        onOpenChange(nextOpen);
    }

    function selectCandidate(candidate: CompanyMemberCandidate) {
        setSelectedCandidate(candidate);
        setSearchValue(candidate.email);
        setDebouncedSearch("");
    }

    function clearCandidate() {
        setSelectedCandidate(null);
        setSearchValue("");
        setDebouncedSearch("");
    }

    async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
        event.preventDefault();

        if (!selectedCandidate) {
            toast.error("Select a registered JobsSpot user first.");

            return;
        }

        const toastId = toast.loading("Adding team member...");

        try {
            const response = await addMemberMutation.mutateAsync({
                email: selectedCandidate.email,
                role,
            });

            toast.success(response.message, {
                id: toastId,
                description: `${selectedCandidate.firstName} ${selectedCandidate.lastName} was added as ${formatCompanyMemberRole(role)}.`,
            });

            resetDialog();
            onOpenChange(false);
        } catch (error) {
            toast.error(getTeamErrorMessage(error, "Unable to add the team member."), {
                id: toastId,
            });
        }
    }

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="sm:max-w-xl">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Add team member</DialogTitle>

                        <DialogDescription>
                            Search for an existing registered JobsSpot user and assign their company
                            role.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-6 py-6">
                        <div>
                            <label htmlFor="team-member-search" className="text-sm font-semibold">
                                Search registered users
                            </label>

                            <div className="relative mt-2">
                                <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />

                                <Input
                                    id="team-member-search"
                                    value={searchValue}
                                    onChange={(event) => {
                                        setSearchValue(event.target.value);

                                        setSelectedCandidate(null);
                                    }}
                                    disabled={addMemberMutation.isPending}
                                    placeholder="Search by name or email"
                                    autoComplete="off"
                                    className="pr-10 pl-9"
                                />

                                {searchValue && (
                                    <button
                                        type="button"
                                        aria-label="Clear search"
                                        onClick={clearCandidate}
                                        className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground transition hover:text-foreground"
                                    >
                                        <X className="size-4" />
                                    </button>
                                )}
                            </div>

                            <p className="mt-2 text-xs text-muted-foreground">
                                Enter at least three characters. Existing company members are
                                excluded.
                            </p>

                            {!selectedCandidate && debouncedSearch.length >= 3 && (
                                <div className="mt-3 overflow-hidden rounded-xl border bg-background shadow-sm">
                                    {candidateQuery.isLoading && (
                                        <div className="flex items-center justify-center gap-2 p-5 text-sm text-muted-foreground">
                                            <LoaderCircle className="size-4 animate-spin" />
                                            Searching users...
                                        </div>
                                    )}

                                    {candidateQuery.isError && (
                                        <div className="p-5 text-center text-sm text-red-700">
                                            {getTeamErrorMessage(
                                                candidateQuery.error,
                                                "Unable to search users.",
                                            )}
                                        </div>
                                    )}

                                    {!candidateQuery.isLoading &&
                                        !candidateQuery.isError &&
                                        candidates.length === 0 && (
                                            <div className="p-5 text-center">
                                                <p className="text-sm font-medium">
                                                    No eligible users found
                                                </p>

                                                <p className="mt-1 text-xs text-muted-foreground">
                                                    The user may not have a JobsSpot account, or is
                                                    already a member.
                                                </p>
                                            </div>
                                        )}

                                    {!candidateQuery.isLoading &&
                                        !candidateQuery.isError &&
                                        candidates.map((candidate) => (
                                            <button
                                                key={candidate.id}
                                                type="button"
                                                onClick={() => selectCandidate(candidate)}
                                                className="flex w-full items-center gap-3 border-b p-3 text-left transition last:border-b-0 hover:bg-muted/50"
                                            >
                                                <Avatar className="size-10">
                                                    <AvatarImage
                                                        src={candidate.avatarUrl ?? undefined}
                                                        alt={`${candidate.firstName} ${candidate.lastName}`}
                                                    />

                                                    <AvatarFallback>
                                                        {getTeamMemberInitials(
                                                            candidate.firstName,
                                                            candidate.lastName,
                                                        )}
                                                    </AvatarFallback>
                                                </Avatar>

                                                <div className="min-w-0 flex-1">
                                                    <p className="truncate text-sm font-semibold">
                                                        {candidate.firstName} {candidate.lastName}
                                                    </p>

                                                    <p className="truncate text-xs text-muted-foreground">
                                                        {candidate.email}
                                                    </p>
                                                </div>

                                                <UserPlus className="size-4 text-muted-foreground" />
                                            </button>
                                        ))}
                                </div>
                            )}

                            {selectedCandidate && (
                                <div className="mt-3 flex items-center gap-3 rounded-xl border border-primary/30 bg-primary/5 p-4">
                                    <Avatar className="size-11">
                                        <AvatarImage
                                            src={selectedCandidate.avatarUrl ?? undefined}
                                            alt={`${selectedCandidate.firstName} ${selectedCandidate.lastName}`}
                                        />

                                        <AvatarFallback>
                                            {getTeamMemberInitials(
                                                selectedCandidate.firstName,
                                                selectedCandidate.lastName,
                                            )}
                                        </AvatarFallback>
                                    </Avatar>

                                    <div className="min-w-0 flex-1">
                                        <p className="truncate font-semibold">
                                            {selectedCandidate.firstName}{" "}
                                            {selectedCandidate.lastName}
                                        </p>

                                        <p className="truncate text-sm text-muted-foreground">
                                            {selectedCandidate.email}
                                        </p>
                                    </div>

                                    <Check className="size-5 text-primary" />
                                </div>
                            )}
                        </div>

                        <div>
                            <label htmlFor="team-member-role" className="text-sm font-semibold">
                                Company role
                            </label>

                            <Select
                                value={role}
                                onValueChange={(value) =>
                                    setRole(value as AssignableCompanyMemberRole)
                                }
                                disabled={addMemberMutation.isPending}
                            >
                                <SelectTrigger id="team-member-role" className="mt-2 w-full">
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
                            disabled={addMemberMutation.isPending}
                        >
                            Cancel
                        </Button>

                        <Button
                            type="submit"
                            disabled={!selectedCandidate || addMemberMutation.isPending}
                        >
                            {addMemberMutation.isPending ? (
                                <LoaderCircle className="animate-spin" />
                            ) : (
                                <UserPlus />
                            )}

                            {addMemberMutation.isPending ? "Adding..." : "Add member"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
