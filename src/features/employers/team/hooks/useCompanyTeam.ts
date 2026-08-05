"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
    addCompanyMember,
    cancelCompanyInvitation,
    createCompanyInvitation,
    getCompanyInvitations,
    getCompanyMembers,
    removeCompanyMember,
    resendCompanyInvitation,
    searchCompanyMemberCandidates,
    transferCompanyOwnership,
    updateCompanyMemberRole,
} from "../api/companyTeamApi";

import type {
    AddCompanyMemberRequest,
    CreateCompanyInvitationRequest,
    TransferCompanyOwnershipRequest,
    UpdateCompanyMemberRoleRequest,
} from "../types/team";

const companyMembersQueryKey = (companyId: string) => ["company-members", companyId] as const;

const companyInvitationsQueryKey = (companyId: string) =>
    ["company-invitations", companyId] as const;

const memberCandidatesQueryKey = (companyId: string, query: string) =>
    ["company-member-candidates", companyId, query] as const;

type UseCompanyMembersParameters = {
    companyId: string;
    enabled?: boolean;
};

export function useCompanyMembers({ companyId, enabled = true }: UseCompanyMembersParameters) {
    return useQuery({
        queryKey: companyMembersQueryKey(companyId),

        queryFn: () => getCompanyMembers(companyId),

        enabled: enabled && Boolean(companyId),
    });
}

type UseSearchCompanyMemberCandidatesParameters = {
    companyId: string;
    query: string;
    enabled?: boolean;
};

export function useSearchCompanyMemberCandidates({
    companyId,
    query,
    enabled = true,
}: UseSearchCompanyMemberCandidatesParameters) {
    return useQuery({
        queryKey: memberCandidatesQueryKey(companyId, query),

        queryFn: () => searchCompanyMemberCandidates(companyId, query),

        enabled: enabled && Boolean(companyId) && query.trim().length >= 3,

        staleTime: 30_000,
    });
}

export function useAddCompanyMember(companyId: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: AddCompanyMemberRequest) => addCompanyMember(companyId, data),

        onSuccess: async () => {
            await Promise.all([
                queryClient.invalidateQueries({
                    queryKey: companyMembersQueryKey(companyId),
                }),

                queryClient.invalidateQueries({
                    queryKey: ["company-member-candidates", companyId],
                }),
            ]);
        },
    });
}

type UpdateCompanyMemberRoleParameters = {
    memberId: string;
    data: UpdateCompanyMemberRoleRequest;
};

export function useUpdateCompanyMemberRole(companyId: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ memberId, data }: UpdateCompanyMemberRoleParameters) =>
            updateCompanyMemberRole(companyId, memberId, data),

        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: companyMembersQueryKey(companyId),
            });
        },
    });
}

export function useTransferCompanyOwnership(companyId: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: TransferCompanyOwnershipRequest) =>
            transferCompanyOwnership(companyId, data),

        onSuccess: async () => {
            await Promise.all([
                queryClient.invalidateQueries({
                    queryKey: companyMembersQueryKey(companyId),
                }),
                queryClient.invalidateQueries({
                    queryKey: ["company-activity", companyId],
                }),
            ]);
        },
    });
}

export function useRemoveCompanyMember(companyId: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (memberId: string) => removeCompanyMember(companyId, memberId),

        onSuccess: async () => {
            await Promise.all([
                queryClient.invalidateQueries({
                    queryKey: companyMembersQueryKey(companyId),
                }),

                queryClient.invalidateQueries({
                    queryKey: ["company-member-candidates", companyId],
                }),
            ]);
        },
    });
}

type UseCompanyInvitationsParameters = {
    companyId: string;
    enabled?: boolean;
};

export function useCompanyInvitations({
    companyId,
    enabled = true,
}: UseCompanyInvitationsParameters) {
    return useQuery({
        queryKey: companyInvitationsQueryKey(companyId),

        queryFn: () => getCompanyInvitations(companyId),

        enabled: enabled && Boolean(companyId),

        staleTime: 15_000,
    });
}

export function useCreateCompanyInvitation(companyId: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateCompanyInvitationRequest) =>
            createCompanyInvitation(companyId, data),

        onSuccess: async () => {
            await Promise.all([
                queryClient.invalidateQueries({
                    queryKey: companyInvitationsQueryKey(companyId),
                }),
                queryClient.invalidateQueries({
                    queryKey: ["company-activity", companyId],
                }),
            ]);
        },
    });
}

export function useResendCompanyInvitation(companyId: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (invitationId: string) =>
            resendCompanyInvitation(companyId, invitationId),

        onSuccess: async () => {
            await Promise.all([
                queryClient.invalidateQueries({
                    queryKey: companyInvitationsQueryKey(companyId),
                }),
                queryClient.invalidateQueries({
                    queryKey: ["company-activity", companyId],
                }),
            ]);
        },
    });
}

export function useCancelCompanyInvitation(companyId: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (invitationId: string) =>
            cancelCompanyInvitation(companyId, invitationId),

        onSuccess: async () => {
            await Promise.all([
                queryClient.invalidateQueries({
                    queryKey: companyInvitationsQueryKey(companyId),
                }),
                queryClient.invalidateQueries({
                    queryKey: ["company-activity", companyId],
                }),
            ]);
        },
    });
}
