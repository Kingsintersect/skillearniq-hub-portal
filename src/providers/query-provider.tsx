"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState, type ReactNode } from "react";

interface QueryProviderProps {
    children: ReactNode;
}

export function QueryProvider({ children }: QueryProviderProps) {
    const [queryClient] = useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        staleTime: 60 * 1000, // 1 minute
                        gcTime: 10 * 60 * 1000, // 10 minutes
                        retry: (failureCount, error: unknown) => {
                            // Narrow the error type if it's an object with statusCode
                            if (
                                typeof error === "object" &&
                                error !== null &&
                                "statusCode" in error
                            ) {
                                const statusCode = (error as { statusCode: number }).statusCode;
                                if (statusCode >= 400 && statusCode < 500 && statusCode !== 429) {
                                    return false;
                                }
                            }
                            return failureCount < 2;
                        },
                    },
                    mutations: {
                        retry: false,
                    },
                },
            })
    );

    return (
        <QueryClientProvider client={queryClient} >
            {children}
            {process.env.NODE_ENV === "development" && <ReactQueryDevtools />}
        </QueryClientProvider>
    );
}
