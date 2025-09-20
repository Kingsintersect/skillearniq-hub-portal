"use client";

import { ProgressProvider } from "@bprogress/next/app";
import { Progress } from "@bprogress/next";

export function PageLoadProviders({ children }: { children: React.ReactNode }) {
    return (
        <ProgressProvider
            color="#16a34a"       // bar color
            height={"4px"}         // bar height in px
            options={{
                showSpinner: true, // disable spinner
            }}
            spinnerPosition="top-right"
            startPosition={0.3}
        // shallowRouting
        >
            <Progress />
            {children}
        </ProgressProvider>
    );
}
