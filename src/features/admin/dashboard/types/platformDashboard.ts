export type PlatformDashboard = {
    generatedAt: string;
    users: {
        total: number;
        active: number;
        suspended: number;
        newLast30Days: number;
    };
    companies: {
        total: number;
        verified: number;
        suspended: number;
    };
    jobs: {
        total: number;
        published: number;
    };
    applications: {
        total: number;
        newLast30Days: number;
    };
    categories: {
        total: number;
        active: number;
    };
};

export type PlatformDashboardResponse = {
    success: true;
    message: string;
    dashboard: PlatformDashboard;
};
