export type AuditAction = string;

export type AuditEntityType = "APPLICATION" | "JOB" | "COMPANY_MEMBERSHIP" | "COMPANY";

export type ActivityFilterValue = "ALL" | AuditEntityType;

export type AuditActor = {
    avatarUrl: string | null;
};

export type CompanyActivityItem = {
    id: string;
    actorUserId: string | null;
    actorDisplayName: string;
    actorEmail: string;
    action: AuditAction;
    entityType: AuditEntityType;
    entityId: string | null;
    metadata: Record<string, unknown> | null;
    createdAt: string;
    actorUser: AuditActor | null;
};

export type CompanyActivityPagination = {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
};

export type GetCompanyActivityParameters = {
    page?: number;
    limit?: number;
    action?: string;
    entityType?: AuditEntityType;
};

export type GetCompanyActivityResponse = {
    success: boolean;
    message: string;
    activity: CompanyActivityItem[];
    pagination: CompanyActivityPagination;
};
