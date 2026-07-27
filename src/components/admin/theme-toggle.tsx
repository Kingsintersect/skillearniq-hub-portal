"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

/**
 * Theme toggle backed entirely by next-themes — the single source of truth for
 * light/dark across the whole app. It must NOT manipulate the `.dark` class or
 * read `prefers-color-scheme` itself: doing so previously forced the dashboard
 * to the OS theme on mount, overriding the theme the user picked on the public
 * site (light on the homepage, dark on the dashboard).
 */
export function ThemeToggle() {
    const { resolvedTheme, setTheme } = useTheme();
    const [mounted, setMounted] = React.useState(false);

    // resolvedTheme is only known on the client — gate the icon to avoid a
    // hydration mismatch.
    React.useEffect(() => setMounted(true), []);

    const isDark = resolvedTheme === "dark";

    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(isDark ? "light" : "dark")}
            aria-label="Toggle theme"
        >
            {mounted && (
                <motion.span
                    key={isDark ? "moon" : "sun"}
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                    {isDark ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                </motion.span>
            )}
        </Button>
    );
}
