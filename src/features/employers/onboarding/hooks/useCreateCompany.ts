"use client";

import { useMutation } from "@tanstack/react-query";

import { createCompany } from "../api/createCompany";
import type {
    CreateCompanyInput,
} from "../types/companyOnboarding";

export function useCreateCompany(
    accessToken: string,
) {
    return useMutation({
        mutationFn: (
            data: CreateCompanyInput,
        ) =>
            createCompany({
                accessToken,
                data,
            }),
    });
}
