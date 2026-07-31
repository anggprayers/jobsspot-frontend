import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";

import { useAuthStore } from "@/features/auth/store/authStore";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

if (!apiUrl) {
    throw new Error("NEXT_PUBLIC_API_URL is not defined.");
}

export const authClient = axios.create({
    baseURL: apiUrl,
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
});

const apiClient = axios.create({
    baseURL: apiUrl,
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
});

type RetryableRequestConfig = InternalAxiosRequestConfig & {
    _retry?: boolean;
};

type RefreshResponse = {
    success: boolean;
    message: string;
    accessToken: string;
};

let refreshPromise: Promise<string> | null = null;

async function requestNewAccessToken(): Promise<string> {
    if (!refreshPromise) {
        refreshPromise = authClient
            .post<RefreshResponse>("/auth/refresh")
            .then((response) => {
                const accessToken = response.data.accessToken;

                useAuthStore.getState().setAccessToken(accessToken);

                return accessToken;
            })
            .finally(() => {
                refreshPromise = null;
            });
    }

    return refreshPromise;
}

apiClient.interceptors.request.use((config) => {
    const accessToken = useAuthStore.getState().accessToken;

    if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
});

apiClient.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const originalRequest = error.config as RetryableRequestConfig | undefined;

        if (error.response?.status !== 401 || !originalRequest || originalRequest._retry) {
            return Promise.reject(error);
        }

        originalRequest._retry = true;

        try {
            const accessToken = await requestNewAccessToken();

            originalRequest.headers.Authorization = `Bearer ${accessToken}`;

            return apiClient(originalRequest);
        } catch (refreshError) {
            useAuthStore.getState().clearSession();

            return Promise.reject(refreshError);
        }
    },
);

export default apiClient;
