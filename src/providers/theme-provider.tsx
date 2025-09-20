"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"

export function ThemeProvider({
    children,
    ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
    return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}
// export function useTheme() {
//     const { setTheme, theme, systemTheme } = React.useContext(NextThemesProvider.Context)
//     return { setTheme, theme, systemTheme }
// }
// export function useThemeSSR() {
//     const { resolvedTheme } = React.useContext(NextThemesProvider.Context)
//     return { resolvedTheme }
// }