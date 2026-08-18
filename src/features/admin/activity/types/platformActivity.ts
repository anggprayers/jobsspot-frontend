import type { AdminPagination } from "../../users/types/adminUser";

export type PlatformActivityItem = {
    id: string;
    actorUserId: string;
    actorDisplayName: string;
    actorEmail: string;
    action: string;
    entityType: string;
    entityId: string | null;
    metadata: unknown;
    createdAt: string;
    actorUser: {
        avatarUrl: string | null;
    };
};

export type PlatformActivityParams = {
    page: number;
    limit: number;
    action?: string;
    entityType?: string;
};

export type PlatformActivityResponse = {
    success: true;
    message: string;
    activity: PlatformActivityItem[];
    pagination: AdminPagination;
};
