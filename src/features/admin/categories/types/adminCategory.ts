export type AdminJobCategory = {
    id: string;
    name: string;
    slug: string;
    isActive: boolean;
    displayOrder: number;
    createdAt: string;
    updatedAt: string;
    counts: {
        jobs: number;
        savedSearches: number;
    };
};

export type AdminCategoryListParams = {
    page?: number;
    limit?: number;
    search?: string;
    status?: "ALL" | "ACTIVE" | "INACTIVE";
    sort?: "ORDER_ASC" | "NAME_ASC" | "NAME_DESC" | "NEWEST";
};

export type AdminCategoriesResponse = {
    success: boolean;
    message: string;
    categories: AdminJobCategory[];
    pagination: {
        page: number;
        limit: number;
        totalItems: number;
        totalPages: number;
        hasNextPage: boolean;
        hasPreviousPage: boolean;
    };
};

export type AdminCategoryResponse = {
    success: boolean;
    message: string;
    category: AdminJobCategory;
};

export type CreateAdminCategoryRequest = {
    name: string;
    displayOrder?: number;
};

export type UpdateAdminCategoryRequest = {
    name?: string;
    displayOrder?: number;
};

export type UpdateAdminCategoryStatusRequest = {
    active: boolean;
};
