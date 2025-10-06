'use client'
import React from 'react'
import { usePathname } from 'next/navigation'
import { Separator } from "@/components/ui/separator"
import {
    SidebarTrigger,
} from "@/components/ui/sidebar"
import { ModeToggle } from './ui/mood-toggle'
import { ThemeSelector } from './theme-selector'
import { DynamicBreadcrumb } from './ui/dynamic-breadcrumb'
import Link from 'next/link'
import SignOutButton from './core/signout-button'
import { StudentSelector } from './StudentSelector'

const SiteHeader = () => {
    const pathname = usePathname()
    const isParentPage = pathname?.includes('/parents')

    return (
        <header className="flex h-16 shrink-0 items-center justify-between gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-2 px-4">
                <SidebarTrigger className="-ml-1" />
                <Separator
                    orientation="vertical"
                    className="mr-2 data-[orientation=vertical]:h-4"
                />
                <DynamicBreadcrumb />
            </div>
            <div className="flex items-center gap-4 px-4">
                {isParentPage && <StudentSelector />}
                <ThemeSelector />
                <ModeToggle />
                <SignOutButton />
            </div>
        </header>
    )
}

export default SiteHeader