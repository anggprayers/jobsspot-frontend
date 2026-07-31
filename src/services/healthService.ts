import apiClient from "@/lib/apiClient";

export type HealthResponse = {
    success: boolean;
    message: string;
};

export async function getApiHealth(): Promise<HealthResponse> {
    const response = await apiClient.get<HealthResponse>("/health");

    return response.data;
}
