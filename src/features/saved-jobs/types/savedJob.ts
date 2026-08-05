import type { PublicJob, PublicJobsPagination } from "@/features/jobs/types/publicJob";

export type SavedJobRecord = {
    savedAt: string;
    job: PublicJob & {
        status: string;
        isAvailable: boolean;
    };
};

export type GetSavedJobsParams = {
    page?: number;
    limit?: number;
};

export type GetSavedJobsResponse = {
    success: true;
    message: string;
    savedJobs: SavedJobRecord[];
    pagination: PublicJobsPagination;
};

export type SavedJobStatusResponse = {
    success: true;
    isSaved: boolean;
    savedAt: string | null;
};

export type SaveJobResponse = {
    success: true;
    message: string;
    savedJob: SavedJobRecord;
};

export type RemoveSavedJobResponse = {
    success: true;
    message: string;
    jobId: string;
};
