"use client";
import { useEffect, useState } from "react";

export function ClientOnly({ children }: { children: React.ReactNode }) {
    const [isClient, setIsClient] = useState(false)

    useEffect(() => {
        setIsClient(true)
    }, [])

    // Return null during SSR and initial client render
    if (!isClient) {
        return null
    }

    // Only render children after hydration is complete
    return <>{children}</>
}

export function ExtensionCleanup() {
    useEffect(() => {
        // Remove extension-injected elements
        const removeExtensionElements = () => {
            // Remove React DevTools elements
            const devToolsElements = document.querySelectorAll('[class*="tsqd"], [data-reactroot]');
            devToolsElements.forEach(el => el.remove());

            // Remove other common extension elements
            const extensionElements = document.querySelectorAll('[extension-id], [class*="extension"]');
            extensionElements.forEach(el => el.remove());
        };

        removeExtensionElements();

        // Also clean up on route changes
        const observer = new MutationObserver(removeExtensionElements);
        observer.observe(document.body, { childList: true, subtree: true });

        return () => observer.disconnect();
    }, []);

    return null;
}