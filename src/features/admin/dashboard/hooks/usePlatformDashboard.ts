import { useQuery } from "@tanstack/react-query";

import { getPlatformDashboard } from "../api/getPlatformDashboard";

export function usePlatformDashboard() {
    return useQuery({
        queryKey: ["platform-admin", "dashboard"],
        queryFn: getPlatformDashboard,
        staleTime: 30_000,
    });
}
