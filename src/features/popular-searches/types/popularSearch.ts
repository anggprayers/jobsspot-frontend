export type PopularSearch = {
    id: string;
    keyword: string;
    normalizedTerm: string;
    searchCount: number;
    lastSearchedAt: string;
};

export type GetPopularSearchesParams = {
    limit?: number;
    days?: number;
};

export type GetPopularSearchesResponse = {
    success: true;
    message: string;
    popularSearches: PopularSearch[];
    periodDays: number;
};

export type TrackPopularSearchResponse = {
    success: true;
    message: string;
};
