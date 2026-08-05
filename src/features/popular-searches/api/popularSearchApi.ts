import apiClient from "@/lib/apiClient";

import type {
    GetPopularSearchesParams,
    GetPopularSearchesResponse,
    TrackPopularSearchResponse,
} from "../types/popularSearch";

export async function getPopularSearches(
    params: GetPopularSearchesParams = {},
): Promise<GetPopularSearchesResponse> {
    const response =
        await apiClient.get<GetPopularSearchesResponse>(
            "/popular-searches",
            {
                params,
            },
        );

    return response.data;
}

export async function trackPopularSearch(
    keyword: string,
): Promise<TrackPopularSearchResponse> {
    const response =
        await apiClient.post<TrackPopularSearchResponse>(
            "/popular-searches/track",
            {
                keyword,
            },
        );

    return response.data;
}
