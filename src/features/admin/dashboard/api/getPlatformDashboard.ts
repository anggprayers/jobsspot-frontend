import apiClient from "@/lib/apiClient";

import type { PlatformDashboardResponse } from "../types/platformDashboard";

export async function getPlatformDashboard(): Promise<PlatformDashboardResponse> {
    const response = await apiClient.get<PlatformDashboardResponse>("/admin/dashboard");

    return response.data;
}
