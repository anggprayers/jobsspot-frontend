import apiClient from "@/lib/apiClient";

import type {
    AddCompanyMemberRequest,
    AddCompanyMemberResponse,
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
        `/companies/${companyId}/members`,
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
        `/companies/${companyId}/members/search-users`,
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
        `/companies/${companyId}/members`,
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
        `/companies/${companyId}/members/${memberId}`,
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
        `/companies/${companyId}/members/${memberId}`,
    );

    return response.data;
}
