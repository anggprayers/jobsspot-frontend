"use client";

import { useQuery } from "@tanstack/react-query";

import { getCompanyActivity } from "../api/companyActivityApi";

import type { AuditEntityType } from "../types/activity";

type UseCompanyActivityParameters = {
    companyId: string;
    page?: number;
    limit?: number;
    action?: string;
    entityType?: AuditEntityType;
    enabled?: boolean;
};

export const companyActivityQueryKey = ({
    companyId,
    page,
    limit,
    action,
    entityType,
}: {
    companyId: string;
    page: number;
    limit: number;
    action?: string;
    entityType?: AuditEntityType;
}) =>
    [
        "company-activity",
        companyId,
        {
            page,
            limit,
            action: action ?? null,
            entityType: entityType ?? null,
        },
    ] as const;

export function useCompanyActivity({
    companyId,
    page = 1,
    limit = 20,
    action,
    entityType,
    enabled = true,
}: UseCompanyActivityParameters) {
    return useQuery({
        queryKey: companyActivityQueryKey({
            companyId,
            page,
            limit,
            action,
            entityType,
        }),

        queryFn: () =>
            getCompanyActivity(companyId, {
                page,
                limit,

                ...(action && {
                    action,
                }),

                ...(entityType && {
                    entityType,
                }),
            }),

        enabled: enabled && Boolean(companyId),
    });
}
