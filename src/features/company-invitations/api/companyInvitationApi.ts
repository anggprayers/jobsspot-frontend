import {
    authClient,
} from "@/lib/apiClient";
import apiClient from "@/lib/apiClient";

import type {
    AcceptCompanyInvitationRequest,
    AcceptCompanyInvitationResponse,
    ResolveCompanyInvitationResponse,
} from "../types/companyInvitation";

export async function resolveCompanyInvitation(
    token: string,
): Promise<ResolveCompanyInvitationResponse> {
    const response =
        await authClient.get<ResolveCompanyInvitationResponse>(
            "/company-invitations/resolve",
            {
                params: {
                    token,
                },
            },
        );

    return response.data;
}

export async function acceptCompanyInvitation(
    data: AcceptCompanyInvitationRequest,
): Promise<AcceptCompanyInvitationResponse> {
    const response =
        await apiClient.post<AcceptCompanyInvitationResponse>(
            "/company-invitations/accept",
            data,
        );

    return response.data;
}
