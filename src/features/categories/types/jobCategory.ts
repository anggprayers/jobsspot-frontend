export type JobCategory = {
    id: string;
    name: string;
    slug: string;
    jobCount: number;
};

export type GetJobCategoriesResponse = {
    success: boolean;
    message: string;
    categories: JobCategory[];
};
