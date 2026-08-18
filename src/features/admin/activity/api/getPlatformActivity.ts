import apiClient from "@/lib/apiClient";

import type {
    PlatformActivityParams,
    PlatformActivityResponse,
} from "../types/platformActivity";

export async function getPlatformActivity(
    params: PlatformActivityParams,
): Promise<PlatformActivityResponse> {
    const response = await apiClient.get<PlatformActivityResponse>("/admin/activity", {
        params,
    });

    return response.data;
}
