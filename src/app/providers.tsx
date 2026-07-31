"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

import { TooltipProvider } from "@/components/ui/tooltip";
import AuthProvider from "@/features/auth/components/AuthProvider";

type ProvidersProps = Readonly<{
    children: React.ReactNode;
}>;

export default function Providers({ children }: ProvidersProps) {
    const [queryClient] = useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        staleTime: 60 * 1000,
                        refetchOnWindowFocus: false,
                        retry: 1,
                    },
                },
            }),
    );

    return (
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                <TooltipProvider delayDuration={0}>{children}</TooltipProvider>
            </AuthProvider>
        </QueryClientProvider>
    );
}
