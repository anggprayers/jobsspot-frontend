import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
    createAdminCompany,
    getAdminCompanies,
    getAdminCompany,
    updateAdminCompany,
    updateAdminCompanySuspension,
    updateAdminCompanyVerification,
} from "../api/adminCompaniesApi";
import type {
    AdminCompanyListParams,
    CreateAdminCompanyRequest,
    UpdateAdminCompanyRequest,
    UpdateAdminCompanySuspensionRequest,
    UpdateAdminCompanyVerificationRequest,
} from "../types/adminCompany";

export function useAdminCompanies(params: AdminCompanyListParams) {
    return useQuery({
        queryKey: ["platform-admin", "companies", params],
        queryFn: () => getAdminCompanies(params),
        placeholderData: (previousData) => previousData,
    });
}

export function useAdminCompany(companyId: string) {
    return useQuery({
        queryKey: ["platform-admin", "companies", companyId],
        queryFn: () => getAdminCompany(companyId),
        enabled: Boolean(companyId),
    });
}

function useInvalidateCompanyQueries() {
    const queryClient = useQueryClient();

    return async () => {
        await Promise.all([
            queryClient.invalidateQueries({ queryKey: ["platform-admin", "companies"] }),
            queryClient.invalidateQueries({ queryKey: ["platform-admin", "dashboard"] }),
            queryClient.invalidateQueries({ queryKey: ["platform-admin", "activity"] }),
            queryClient.invalidateQueries({ queryKey: ["public-companies"] }),
            queryClient.invalidateQueries({ queryKey: ["jobs"] }),
        ]);
    };
}

export function useUpdateAdminCompanySuspension(companyId: string) {
    const invalidate = useInvalidateCompanyQueries();

    return useMutation({
        mutationFn: (input: UpdateAdminCompanySuspensionRequest) =>
            updateAdminCompanySuspension(companyId, input),
        onSuccess: invalidate,
    });
}

export function useUpdateAdminCompanyVerification(companyId: string) {
    const invalidate = useInvalidateCompanyQueries();

    return useMutation({
        mutationFn: (input: UpdateAdminCompanyVerificationRequest) =>
            updateAdminCompanyVerification(companyId, input),
        onSuccess: invalidate,
    });
}

export function useCreateAdminCompany() {
    const invalidate = useInvalidateCompanyQueries();
    return useMutation({
        mutationFn: (input: CreateAdminCompanyRequest) => createAdminCompany(input),
        onSuccess: invalidate,
    });
}

export function useUpdateAdminCompany(companyId: string) {
    const invalidate = useInvalidateCompanyQueries();
    return useMutation({
        mutationFn: (input: UpdateAdminCompanyRequest) => updateAdminCompany(companyId, input),
        onSuccess: invalidate,
    });
}
