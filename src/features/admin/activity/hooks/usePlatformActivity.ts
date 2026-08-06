import { useQuery } from "@tanstack/react-query";

import { getPlatformActivity } from "../api/getPlatformActivity";
import type { PlatformActivityParams } from "../types/platformActivity";

export function usePlatformActivity(params: PlatformActivityParams) {
    return useQuery({
        queryKey: ["platform-admin", "activity", params],
        queryFn: () => getPlatformActivity(params),
        placeholderData: (previousData) => previousData,
    });
}
