import apiClient from "@/lib/apiClient";

import type {
    CreateSavedSearchRequest,
    CreateSavedSearchResponse,
    DeleteSavedSearchResponse,
    GetSavedSearchesParams,
    GetSavedSearchesResponse,
    UpdateSavedSearchRequest,
    UpdateSavedSearchResponse,
} from "../types/savedSearch";

export async function getSavedSearches(
    params: GetSavedSearchesParams = {},
): Promise<GetSavedSearchesResponse> {
    const response =
        await apiClient.get<GetSavedSearchesResponse>(
            "/saved-searches",
            {
                params,
            },
        );

    return response.data;
}

export async function createSavedSearch(
    data: CreateSavedSearchRequest,
): Promise<CreateSavedSearchResponse> {
    const response =
        await apiClient.post<CreateSavedSearchResponse>(
            "/saved-searches",
            data,
        );

    return response.data;
}

export async function updateSavedSearch({
    savedSearchId,
    data,
}: {
    savedSearchId: string;
    data: UpdateSavedSearchRequest;
}): Promise<UpdateSavedSearchResponse> {
    const response =
        await apiClient.patch<UpdateSavedSearchResponse>(
            `/saved-searches/${encodeURIComponent(
                savedSearchId,
            )}`,
            data,
        );

    return response.data;
}

export async function deleteSavedSearch(
    savedSearchId: string,
): Promise<DeleteSavedSearchResponse> {
    const response =
        await apiClient.delete<DeleteSavedSearchResponse>(
            `/saved-searches/${encodeURIComponent(
                savedSearchId,
            )}`,
        );

    return response.data;
}
