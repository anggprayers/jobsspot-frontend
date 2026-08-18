import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
    getAdminUser,
    getAdminUsers,
    updateAdminUserSuspension,
} from "../api/adminUsersApi";
import type {
    AdminUserListParams,
    UpdateAdminUserSuspensionRequest,
} from "../types/adminUser";

export function useAdminUsers(params: AdminUserListParams) {
    return useQuery({
        queryKey: ["platform-admin", "users", params],
        queryFn: () => getAdminUsers(params),
        placeholderData: (previousData) => previousData,
    });
}

export function useAdminUser(userId: string) {
    return useQuery({
        queryKey: ["platform-admin", "users", userId],
        queryFn: () => getAdminUser(userId),
        enabled: Boolean(userId),
    });
}

export function useUpdateAdminUserSuspension(userId: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (input: UpdateAdminUserSuspensionRequest) =>
            updateAdminUserSuspension(userId, input),
        onSuccess: async () => {
            await Promise.all([
                queryClient.invalidateQueries({ queryKey: ["platform-admin", "users"] }),
                queryClient.invalidateQueries({ queryKey: ["platform-admin", "dashboard"] }),
                queryClient.invalidateQueries({ queryKey: ["platform-admin", "activity"] }),
            ]);
        },
    });
}
