import apiClient from "@/lib/apiClient";

import type {
    AddCompanyMemberRequest,
    AddCompanyMemberResponse,
    CompanyInvitationMutationResponse,
    CreateCompanyInvitationRequest,
    GetCompanyInvitationsResponse,
    GetCompanyMembersResponse,
    RemoveCompanyMemberResponse,
    SearchCompanyMemberCandidatesResponse,
    TransferCompanyOwnershipRequest,
    TransferCompanyOwnershipResponse,
    UpdateCompanyMemberRoleRequest,
    UpdateCompanyMemberRoleResponse,
} from "../types/team";

// GET /api/companies/:companyId/members
// Retrieve all active members of the company.
export async function getCompanyMembers(companyId: string): Promise<GetCompanyMembersResponse> {
    const response = await apiClient.get<GetCompanyMembersResponse>(
        `/companies/${encodeURIComponent(companyId)}/members`,
    );

    return response.data;
}

// GET /api/companies/:companyId/members/search-users?query=...
// Search registered JobsSpot users who can be added to the company.
export async function searchCompanyMemberCandidates(
    companyId: string,
    query: string,
): Promise<SearchCompanyMemberCandidatesResponse> {
    const response = await apiClient.get<SearchCompanyMemberCandidatesResponse>(
        `/companies/${encodeURIComponent(companyId)}/members/search-users`,
        {
            params: {
                query,
            },
        },
    );

    return response.data;
}

// POST /api/companies/:companyId/members
// Add an existing registered JobsSpot user to the company.
export async function addCompanyMember(
    companyId: string,
    data: AddCompanyMemberRequest,
): Promise<AddCompanyMemberResponse> {
    const response = await apiClient.post<AddCompanyMemberResponse>(
        `/companies/${encodeURIComponent(companyId)}/members`,
        data,
    );

    return response.data;
}

// PATCH /api/companies/:companyId/members/:memberId
// Change an existing company member's role.
export async function updateCompanyMemberRole(
    companyId: string,
    memberId: string,
    data: UpdateCompanyMemberRoleRequest,
): Promise<UpdateCompanyMemberRoleResponse> {
    const response = await apiClient.patch<UpdateCompanyMemberRoleResponse>(
        `/companies/${encodeURIComponent(companyId)}/members/${encodeURIComponent(memberId)}`,
        data,
    );

    return response.data;
}

// POST /api/companies/:companyId/members/transfer-ownership
// Transfer ownership to another active company member.
export async function transferCompanyOwnership(
    companyId: string,
    data: TransferCompanyOwnershipRequest,
): Promise<TransferCompanyOwnershipResponse> {
    const response = await apiClient.post<TransferCompanyOwnershipResponse>(
        `/companies/${encodeURIComponent(companyId)}/members/transfer-ownership`,
        data,
    );

    return response.data;
}

// DELETE /api/companies/:companyId/members/:memberId
// Soft-remove an existing member from the company.
export async function removeCompanyMember(
    companyId: string,
    memberId: string,
): Promise<RemoveCompanyMemberResponse> {
    const response = await apiClient.delete<RemoveCompanyMemberResponse>(
        `/companies/${encodeURIComponent(companyId)}/members/${encodeURIComponent(memberId)}`,
    );

    return response.data;
}

// GET /api/companies/:companyId/invitations
// Retrieve pending and expired company invitations.
export async function getCompanyInvitations(
    companyId: string,
): Promise<GetCompanyInvitationsResponse> {
    const response = await apiClient.get<GetCompanyInvitationsResponse>(
        `/companies/${encodeURIComponent(companyId)}/invitations`,
    );

    return response.data;
}

// POST /api/companies/:companyId/invitations
// Send an invitation to an email address, including people without a JobsSpot account yet.
export async function createCompanyInvitation(
    companyId: string,
    data: CreateCompanyInvitationRequest,
): Promise<CompanyInvitationMutationResponse> {
    const response = await apiClient.post<CompanyInvitationMutationResponse>(
        `/companies/${encodeURIComponent(companyId)}/invitations`,
        data,
    );

    return response.data;
}

// POST /api/companies/:companyId/invitations/:invitationId/resend
// Rotate the invitation token and send a fresh email.
export async function resendCompanyInvitation(
    companyId: string,
    invitationId: string,
): Promise<CompanyInvitationMutationResponse> {
    const response = await apiClient.post<CompanyInvitationMutationResponse>(
        `/companies/${encodeURIComponent(companyId)}/invitations/${encodeURIComponent(invitationId)}/resend`,
    );

    return response.data;
}

// DELETE /api/companies/:companyId/invitations/:invitationId
// Cancel an invitation so its token can no longer be accepted.
export async function cancelCompanyInvitation(
    companyId: string,
    invitationId: string,
): Promise<CompanyInvitationMutationResponse> {
    const response = await apiClient.delete<CompanyInvitationMutationResponse>(
        `/companies/${encodeURIComponent(companyId)}/invitations/${encodeURIComponent(invitationId)}`,
    );

    return response.data;
}
